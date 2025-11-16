// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAe3cteOKo7iTsyHtpO6A-yHE7exCkjHvs",
  authDomain: "ai-trip-planer-e4597.firebaseapp.com",
  projectId: "ai-trip-planer-e4597",
  storageBucket: "ai-trip-planer-e4597.firebasestorage.app",
  messagingSenderId: "254991160860",
  appId: "1:254991160860:web:b160255d8ad2fc4520b1d9",
  measurementId: "G-F3JTPJ13HK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);