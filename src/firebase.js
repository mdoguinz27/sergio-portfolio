import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDw1_XJlfNuw9VKy6zCz6gLDFHEwDTAd68",
    authDomain: "sergio-portfolio-d74d8.firebaseapp.com",
    projectId: "sergio-portfolio-d74d8",
    storageBucket: "sergio-portfolio-d74d8.firebasestorage.app",
    messagingSenderId: "990850083544",
    appId: "1:990850083544:web:b5a033e2c7e971e62d85ad"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
