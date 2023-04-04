import express from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";
import mongoose from "mongoose";
import "dotenv/config";
import "./firebaseConfig.js";
import { getAuth } from "firebase-admin/auth";
import { decode } from "punycode";
const app = express();
const httpServer = http.createServer(app);

// connect to DB
const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@note.xxo0b8d.mongodb.net/notes?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });
// config push notification real-time
// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: "/graphql",
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  // typeDefs,
  // resolvers,
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

// handle accessToken of firebase sent

const authorizationJWT = async (req, res, next) => {
  console.log({ authorization: req.headers.authorization });

  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    // xử lí cắt chuỗi authorization : Bear and mã token
    const acccessToken = authorizationHeader.split(" ")[1];
    getAuth()
      .verifyIdToken(acccessToken)
      .then((decodedToken) => {
        console.log("decoded Token: ", decodedToken);
        res.locals.uid = decodedToken.uid;
        console.log("res: ", res.locals.uid);
        // hop le
        next();
      })
      .catch((err) => {
        console.log({ err });
        return res.status(403).json({ message: "Forbidden", error: err });
      });
  } else {
    // return res.status(401).json({ message: "Unauthorized" });
    // khi code trên hợp lệ gọij next()  để tiến hành run code tiếp theo
    next();
  }
};

app.use(
  cors(),
  authorizationJWT,
  bodyParser.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => {
      // get user_id from decodedid to put in context to use resolvers

      return { uid: res.locals.uid };
    },
  })
);

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("Connected to DB");
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log("server ready at http://localhost:4000");
  });
