 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore";
 import {getAuth} from "firebase/auth";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGb9zQ0_yNc3eei1peBjRNFxcRB2EjR4A",
  authDomain: "test-1c827.firebaseapp.com",
  databaseURL: "https://test-1c827-default-rtdb.firebaseio.com",
  projectId: "test-1c827",
  storageBucket: "test-1c827.appspot.com",
  messagingSenderId: "101859958556",
  appId: "1:101859958556:web:a1c23f39c7a8ad6a5064d9"
};

 // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
