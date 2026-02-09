
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const EMAIL = "mphelalufuno1.0@gmail.com";
const PASSWORD = "Password123!"; // Strong password for testing

async function runTest() {
    console.log("==========================================");
    console.log(`Starting User Simulation for: ${EMAIL}`);
    console.log("==========================================\n");

    try {
        // 1. Attempt Registration
        console.log("STEP 1: Registration");
        let user;
        let isNewUser = false;

        try {
            console.log("   Attempting to create user in Firebase Auth...");
            const userCredential = await createUserWithEmailAndPassword(auth, EMAIL, PASSWORD);
            user = userCredential.user;
            isNewUser = true;
            console.log(`   SUCCESS: Auth User Created! UID: ${user.uid}`);
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log("   NOTE: Email already exists in Auth. Proceeding to Login.");
                // Try login
                const loginCred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
                user = loginCred.user;
                console.log(`   SUCCESS: Logged in existing user! UID: ${user.uid}`);
            } else {
                throw error; // Rethrow other errors
            }
        }

        // 2. Simulate Firestore Creation (if new user, matching StoreContext logic)
        if (isNewUser) {
            console.log("\nSTEP 2: Firestore Document Creation (Simulating Frontend Logic)");
            console.log("   Creating user profile in 'users' collection...");
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: "Lufuno Mphela",
                    email: EMAIL,
                    role: "customer",
                    createdAt: new Date().toISOString()
                });
                console.log("   SUCCESS: Firestore document created.");
            } catch (e) {
                console.error("   FAILURE: Could not create Firestore document.", e);
            }
        } else {
            console.log("\nSTEP 2: Skipping Firestore Creation (User already exists)");
        }

        // 3. Verify Firestore Data
        console.log("\nSTEP 3: verification");
        console.log(`   Fetching document for user ${user.uid} from Firestore...`);
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (userDoc.exists()) {
            console.log("   SUCCESS: User document found!");
            console.log("   --------------------------------------");
            console.log("   User Data:", JSON.stringify(userDoc.data(), null, 2));
            console.log("   --------------------------------------");
        } else {
            console.error("   FAILURE: User document NOT found in Firestore. Registration flow might be incomplete.");
        }

        console.log("\n==========================================");
        console.log("TEST COMPLETE");
        console.log("==========================================");

        process.exit(0);

    } catch (error) {
        console.error("\nCRITICAL TEST FAILURE:", error);
        process.exit(1);
    }
}

runTest();
