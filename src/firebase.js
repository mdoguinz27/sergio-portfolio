import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCZH6wy0loU0t0GaCpI9k4oZ1a3IxrC7ho",
    authDomain: "sergio-portfolio-9c74d.firebaseapp.com",
    projectId: "sergio-portfolio-9c74d",
    storageBucket: "sergio-portfolio-9c74d.firebasestorage.app",
    messagingSenderId: "476535920332",
    appId: "1:476535920332:web:b970c8b65277252bafd469",
    measurementId: "G-D4YFKCDGWM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
