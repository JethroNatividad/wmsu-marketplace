// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBil6vfsiSA75fm9jd4O6fogIF_ZE-x3CY",
  authDomain: "wmsumarketplace.firebaseapp.com",
  projectId: "wmsumarketplace",
  storageBucket: "wmsumarketplace.appspot.com",
  messagingSenderId: "1035560243597",
  appId: "1:1035560243597:web:efaabd0be1140a6debedc4",
  measurementId: "G-MBZM5WGZB9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
