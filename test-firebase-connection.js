
import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";

// Configuration from src/lib/firebase.ts
const firebaseConfig = {
    apiKey: "AIzaSyDikjhpQQVtzD-uQgX3nrI0KmC-t1vn8TM",
    authDomain: "smitetrade-40643.firebaseapp.com",
    projectId: "smitetrade-40643",
    storageBucket: "smitetrade-40643.firebasestorage.app",
    messagingSenderId: "864178131396",
    appId: "1:864178131396:web:591ad30d87b2c151bd5491",
    measurementId: "G-EL7J7BHWXQ"
};

console.log("Initializing Firebase...");
try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log("Firebase initialized.");

    // Attempt to access a collection.
    // We expect this might fail with "verification failed" or "permission denied" if rules are strict,
    // but that PROVES the connection to the server works.
    // If it hangs or gives network error, then connection is broken.
    console.log("Attempting to connect to Firestore...");

    // Using a timeout to fail fast if it hangs
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timed out after 10s")), 10000)
    );

    const connectionTest = getDocs(collection(db, "products"));

    Promise.race([connectionTest, timeout])
        .then((snapshot) => {
            console.log("SUCCESS: Connected to Firestore!");
            console.log(`Read ${snapshot.size} documents from 'products'.`);
        })
        .catch((error) => {
            if (error.code === 'permission-denied') {
                console.log("SUCCESS (Partial): Connected to Firestore, but permission denied (this is expected if not logged in).");
                console.log("The connection to Firebase is WORKING.");
            } else {
                console.error("FAILURE: Could not connect to Firestore.");
                console.error("Error code:", error.code);
                console.error("Error message:", error.message);
            }
        });

} catch (e) {
    console.error("CRITICAL ERROR initializing Firebase:", e);
}
