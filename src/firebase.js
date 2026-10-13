// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2F9c6n4u85VjJWF9UO-Q0YUJ1XVZOSH0",
  authDomain: "smart-choice-com-ng.firebaseapp.com",
  projectId: "smart-choice-com-ng",
  storageBucket: "smart-choice-com-ng.firebasestorage.app",
  messagingSenderId: "301790050421",
  appId: "1:301790050421:web:7fd8ae5c8c5384e569203c",
  measurementId: "G-Y52L43FKZJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
