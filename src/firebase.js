import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhCKILUcxEDfRajbKIzXaKEII2zOWEzfQ",
  authDomain: "pos-tienda-d3ff8.firebaseapp.com",
  projectId: "pos-tienda-d3ff8",
  storageBucket: "pos-tienda-d3ff8.firebasestorage.app",
  messagingSenderId: "610672745968",
  appId: "1:610672745968:web:4a4e8ec852da3395959135"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);