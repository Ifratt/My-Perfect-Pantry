// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjaQJJeHTchN_3h5t8rGURS6wLnwP2BLc",
  authDomain: "pantry-app-7ccf9.firebaseapp.com",
  projectId: "pantry-app-7ccf9",
  storageBucket: "pantry-app-7ccf9.appspot.com",
  messagingSenderId: "694295984502",
  appId: "1:694295984502:web:2f8264cb39b7ea4ef2a257",
  measurementId: "G-SRPRW5PYDM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Correct function call

export { firestore };
