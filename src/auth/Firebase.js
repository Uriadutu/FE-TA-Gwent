import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Firebase config (gantilah dengan konfigurasi proyek Firebase Anda)
const firebaseConfig = {
  apiKey: "AIzaSyDZMF1uCe23nkGUy47PIY9cl3uRrKV_aIU",
  authDomain: "projek-fekon.firebaseapp.com",
  projectId: "projek-fekon",
  storageBucket: "projek-fekon.firebasestorage.app",
  messagingSenderId: "397062555427",
  appId: "1:397062555427:web:dcc7da8a5b244ec97b2e96",
  measurementId: "G-V1V0MZVZXC",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);

export { auth, storage };
