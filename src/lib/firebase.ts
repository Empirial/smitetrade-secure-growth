
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDikjhpQQVtzD-uQgX3nrI0KmC-t1vn8TM",
  authDomain: "smitetrade-40643.firebaseapp.com",
  projectId: "smitetrade-40643",
  storageBucket: "smitetrade-40643.firebasestorage.app",
  messagingSenderId: "864178131396",
  appId: "1:864178131396:web:591ad30d87b2c151bd5491",
  measurementId: "G-EL7J7BHWXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, analytics };
export default app;
