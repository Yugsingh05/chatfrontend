// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw2hEhX0X0BFKQP_148FEZpYYd8SdERfo",
  authDomain: "chat-bdf34.firebaseapp.com",
  projectId: "chat-bdf34",
  storageBucket: "chat-bdf34.firebasestorage.app",
  messagingSenderId: "790780152487",
  appId: "1:790780152487:web:51a4af673d97b87db1e982",
  measurementId: "G-SGPNWETW6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);