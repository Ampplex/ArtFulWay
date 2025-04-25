import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAduD9f2j5CdR1q5f18C51x8Gj2CKrme7s",
    authDomain: "coming-soon-5d442.firebaseapp.com",
    databaseURL: "https://coming-soon-5d442-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "coming-soon-5d442",
    storageBucket: "coming-soon-5d442.firebasestorage.app",
    messagingSenderId: "728478669790",
    appId: "1:728478669790:web:32fc951d00fec1f814db4f",
    measurementId: "G-S0J3PVBN78"
  };
  
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };