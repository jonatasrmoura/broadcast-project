import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Esses dados você pega no botão "</>" (Web App) lá no console que você mostrou no print
const firebaseConfig = {
  apiKey: "AIzaSyA-_fosFa2L10WlgsO4BrUvMqQsLnnMis4",
  authDomain: "project-full-stack-a32eb.firebaseapp.com",
  projectId: "project-full-stack-a32eb",
  storageBucket: "project-full-stack-a32eb.firebasestorage.app",
  messagingSenderId: "634345833864",
  appId: "1:634345833864:web:957a490a3aa93e313d663d",
  measurementId: "G-GEBHRE1QBT",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
