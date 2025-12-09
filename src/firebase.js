// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkl80ia7BEuYPczYjmHsaU1rtmnKb6ad8",
  authDomain: "yvass1.firebaseapp.com",
  projectId: "yvass1",
  storageBucket: "yvass1.firebasestorage.app",
  messagingSenderId: "288785985072",
  appId: "1:288785985072:web:a6aaefac58d7f6e9e447f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };