// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQFAri_itV7bHmZcbPT0Ht90EP2LawPVI",
  authDomain: "portfoliyo-c48b6.firebaseapp.com",
  databaseURL: "https://portfoliyo-c48b6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "portfoliyo-c48b6",
  storageBucket: "portfoliyo-c48b6.firebasestorage.app",
  messagingSenderId: "662344714053",
  appId: "1:662344714053:web:ba4c8a40f14b7a879ae02c",
  measurementId: "G-7W6PDEK7G3"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const database = getDatabase(app);