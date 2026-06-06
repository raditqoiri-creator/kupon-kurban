import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAxaxNPa1nHCxUP-cCiuYp5fJS1iQnz17A",
  authDomain: "kupon-kurban-52f97.firebaseapp.com",
  databaseURL: "https://kupon-kurban-52f97-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kupon-kurban-52f97",
  storageBucket: "kupon-kurban-52f97.firebasestorage.app",
  messagingSenderId: "561120086688",
  appId: "1:561120086688:web:3ad002755f15c7bae1d7c5"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);