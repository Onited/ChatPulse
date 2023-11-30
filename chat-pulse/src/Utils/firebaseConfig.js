// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCpfbkvEcEKSmK4U3RxjlYMSwsJtgppz0k",
  authDomain: "chatpulse-onited.firebaseapp.com",
  projectId: "chatpulse-onited",
  storageBucket: "chatpulse-onited.appspot.com",
  messagingSenderId: "100009305224",
  appId: "1:100009305224:web:b33dc2f414ecbb941c2b3d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
