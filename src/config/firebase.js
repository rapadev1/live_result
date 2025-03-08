import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0FJlPqxWQ87wzj55KFU2NQeBGpFXrlE0",
  authDomain: "liveboulders.firebaseapp.com",
  projectId: "liveboulders",
  storageBucket: "liveboulders.firebasestorage.app",
  messagingSenderId: "99064577423",
  appId: "1:99064577423:web:aecdbef4cd8347ee93dffa",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
