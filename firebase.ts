import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  CollectionReference,
  DocumentData,
  collection,
  getFirestore,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBil6vfsiSA75fm9jd4O6fogIF_ZE-x3CY",
  authDomain: "wmsumarketplace.firebaseapp.com",
  projectId: "wmsumarketplace",
  storageBucket: "wmsumarketplace.appspot.com",
  messagingSenderId: "1035560243597",
  appId: "1:1035560243597:web:efaabd0be1140a6debedc4",
  measurementId: "G-MBZM5WGZB9",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(db, collectionName) as CollectionReference<T>;
};
