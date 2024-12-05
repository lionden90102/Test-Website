// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCJevieoFH1XGnVHntywJjJhrci1sL2MLc",
    authDomain: "test-project-shoping.firebaseapp.com",
    projectId: "test-project-shoping",
    storageBucket: "test-project-shoping.firebasestorage.app",
    messagingSenderId: "1003696479401",
    appId: "1:1003696479401:web:b1e279ebb04a405110ddb8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);