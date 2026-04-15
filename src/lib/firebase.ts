
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAnalytics, isSupported } from "firebase/analytics";
import { initializeAuth, getAuth, browserSessionPersistence, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Guard against Vite HMR re-executing this module — initializeApp and
// initializeAuth both throw if called twice on the same app instance.
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Only initialize Analytics when the browser allows storage access.
// Edge/Safari Tracking Prevention blocks storage for third-party origins,
// which causes a flood of console warnings if Analytics initialises unconditionally.
isSupported().then(yes => { if (yes) initializeAnalytics(app); }).catch(() => {});

// initializeAuth sets browserSessionPersistence synchronously at creation time,
// avoiding the race window that getAuth() + setPersistence() would create.
// Falls back to getAuth() on HMR re-execution when auth is already initialized.
let auth;
try {
  auth = initializeAuth(app, { persistence: browserSessionPersistence });
} catch {
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, firebaseConfig, googleProvider };
export default app;
