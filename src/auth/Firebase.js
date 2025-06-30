import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Firebase config (gantilah dengan konfigurasi proyek Firebase Anda)
const firebaseConfig = {
  apiKey: "AIzaSyBjaN-Q2hRHisJC_M91w9zueQ0Naccci-Y",
  authDomain: "projek-baru-b1e43.firebaseapp.com",
  projectId: "projek-baru-b1e43",
  storageBucket: "projek-baru-b1e43.firebasestorage.app",
  messagingSenderId: "916444120192",
  appId: "1:916444120192:web:e9cab22314c826a0e1d265",
  measurementId: "G-KQ9YNJZ0XF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);
const storage = getStorage(app);

export { auth, storage };
