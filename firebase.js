//import firebase from "firebase";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
import myConfig from "dotenv";

myConfig.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASEAPIKEY,
  authDomain: "quikdine-auth.firebaseapp.com",
  projectId: "quikdine-auth",
  storageBucket: "quikdine-auth.appspot.com",
  messagingSenderId: "531400496889",
  appId: "1:531400496889:web:cc238a378f6e3d98ee3428",
};

const app = initializeApp(firebaseConfig);

//Initialize Firestore
export const db = getFirestore(app);
// getFirestore(app)
const auth = getAuth(app);

export { auth };
