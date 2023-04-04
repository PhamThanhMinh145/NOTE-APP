// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrC5DzgtXW1ysUv1fztRQNLmYVH5dJSQA",
  authDomain: "note-app-94992.firebaseapp.com",
  projectId: "note-app-94992",
  storageBucket: "note-app-94992.appspot.com",
  messagingSenderId: "128875156013",
  appId: "1:128875156013:web:d7ec425329ad5db27adea4",
  measurementId: "G-E0QZPJ247N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);