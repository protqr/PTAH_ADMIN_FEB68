import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCqFvPQWYZBnRI9yEQ-6StUNMuhthrJWKI",
  authDomain: "ptahproject-3a7d3.firebaseapp.com",
  projectId: "ptahproject-3a7d3",
  storageBucket: "ptahproject-3a7d3.appspot.com",
  messagingSenderId: "647749383918",
  appId: "1:647749383918:web:6a058671b540bf1f0b65ff",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
