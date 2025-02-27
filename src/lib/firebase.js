import Firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

//import the seed value
//import {seedDatabase} from '../seed'
const config = {
  apiKey: "AIzaSyDsQ5GIqfxGe0USo73INfiOgBdOKODZ8Mw",
  authDomain: "blog-126a8.firebaseapp.com",
  projectId: "blog-126a8",
  storageBucket: "blog-126a8.firebasestorage.app",
  messagingSenderId: "991031196017",
  appId: "1:991031196017:web:3135ec961316f6c4a75ed0",
};
const firebase = Firebase.initializeApp(config);
const { FieldValue } = Firebase.firestore;
const auth = firebase.auth();
//call the seed file here only once
//seedDatabase(firebase)
export { firebase, auth, FieldValue };
