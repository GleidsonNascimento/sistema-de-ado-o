import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApCkNXg2tI2jk6RbADtvIkfQmWljaasto",
  authDomain: "sistema-de-adocao.firebaseapp.com",
  projectId: "sistema-de-adocao",
  storageBucket: "sistema-de-adocao.appspot.com",
  messagingSenderId: "553965924460",
  appId: "1:553965924460:web:e66addd42c8a9983f9e849",
  measurementId: "G-1LQY836SQC",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const imagemDb = getStorage(app);

export { app, db };
