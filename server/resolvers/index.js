import fakeData from "../fakeData/index.js";
import { AuthorModel, FolderModel, NoteModel, NotificationModel } from "../models/index.js";
import { GraphQLScalarType } from "graphql";
import { PubSub } from "graphql-subscriptions";


const pubsub = new PubSub();

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
  }),
  Query: {
    folders: async (parent, args, context) => {
      // return fakeData.folders
      const folders = await FolderModel.find({
        authorId: context.uid,
      }).sort({
        updatedAt: "desc",
      });
      console.log({ folders, context });
      return folders;
    },

    folder: async (parent, args) => {
      const folderId = args.folderId;
      console.log({ folderId });
      const foundFolder = await FolderModel.findById(folderId);
      return foundFolder;

      //   return fakeData.folders.find((folder) => folder.id === folderId);
    },
    note: async (parent, args) => {
      const noteId = args.noteId;
      const note = await NoteModel.findById(noteId);
      return note;
      // return fakeData.notes.find((note) => note.id === noteId);
    },
  },
  // connect tới table khác để get data
  Folder: {
    author: async (parent, args) => {
      const authorId = parent.authorId;
      const author = await AuthorModel.findOne({
        uid: authorId,
      });
      return author;
    },
    notes: async (parent, args) => {
      // console.log(parent);
      const notes = await NoteModel.find({
        folderId: parent.id,
      }).sort({
        updatedAt: "desc",
      });
      console.log({ notes });
      // return fakeData.notes.filter((note) => note.folderId === parent.id);
      return notes;
    },
  },

  // function add/ updata data

  Mutation: {
    addNote: async (parent, args) => {
      const newNode = new NoteModel(args);
      await newNode.save();
      return newNode;
    },

    // sau 1 giây tự động gửi data từ note component lên phía server
    // tránh tắc nghẽn request gửi lên quá nhiều
    updateNote: async (parent, args) => {
      const noteId = args.id;
      const note = await NoteModel.findByIdAndUpdate(noteId, args);
      return note;
    },

    addFolder: async (parent, args, context) => {
      const newFolder = new FolderModel({ ...args, authorId: context.uid });
      console.log({ newFolder });
      // PUSH NOFICATION
      pubsub.publish('FOLDER_CREATED', {
        folderCreated: {
          message: 'A new folder created',
        },
      });
      await newFolder.save();
      return newFolder;
    },
    // register người dùng
    register: async (parent, args) => {
      const foundUser = await AuthorModel.findOne({ uid: args.uid });

      if (!foundUser) {
        const newUser = new AuthorModel(args);
        await newUser.save();
        return newUser;
      }

      return foundUser;
    },

    pushNotification: async (parent, args) => {
      
      const newNotification = new NotificationModel(args);
      // PUSH NOFICATION
      pubsub.publish('PUSH_NOTIFICATION', {
        notification: {
          message: args.content,
        },
      });
      await newNotification.save();
      return {message: 'success'}
    }
  },

  Subscription: {
    folderCreated: {
      subscribe: () => pubsub.asyncIterator(["FOLDER_CREATED", 'NOTE_CREATED']),
    },

    notification: {
      subscribe: () => pubsub.asyncIterator(['PUSH_NOTIFICATION']),
    }
  },
};
