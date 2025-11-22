
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyB10-QcyKUcFKD6-YNHm7WtZg2JXAzgGIE",
  authDomain: "summery-2025.firebaseapp.com",
  projectId: "summery-2025",
  storageBucket: "summery-2025.firebasestorage.app",
  messagingSenderId: "374825774684",
  appId: "1:374825774684:web:b39b7a97244d1fb2560099",
  measurementId: "G-RPVCJYXDRQ"
};

let app;
let db;
let storage;
let analytics;
let isFirebaseReady = false;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);

  // Initialize services
  // Note: We're using try-catch blocks for individual services because
  // sometimes specific services might fail to load in certain environments
  try {
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firestore not available:", e);
  }

  try {
    storage = getStorage(app);
  } catch (e) {
    console.warn("Storage not available:", e);
  }

  // Analytics usually requires checking support
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(err => console.warn("Analytics not supported:", err));

  // We consider it ready if we successfully initialized the app and at least DB/Storage are defined
  if (app && db && storage) {
    isFirebaseReady = true;
  } else {
    console.warn("Firebase services incomplete. Running in fallback mode.");
  }

} catch (error) {
  console.error("Firebase complete initialization failed:", error);
  isFirebaseReady = false;
}

// Export services
export { db, storage, analytics, isFirebaseReady };
