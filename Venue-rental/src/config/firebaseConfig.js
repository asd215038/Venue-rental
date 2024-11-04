
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDZ3JiUPbAdv8p1N6DlYCwcmqe9DX7NR1c",
    authDomain: "fir-1030.firebaseapp.com",
    projectId: "fir-1030",
    storageBucket: "fir-1030.appspot.com",
    messagingSenderId: "837615573577",
    appId: "1:837615573577:web:3a7d4ed534d287394b7d98",
    measurementId: "G-3NN29C74S8"
  };

export const firebaseApp = initializeApp(firebaseConfig); // 更名為 firebaseApp
export const db = getFirestore(firebaseApp); // 使用 firebaseApp
export const firebaseAuth = getAuth(firebaseApp); // 使用 firebaseApp
  
// export {
//   db,
//   firebaseAuth,
//   ...
// }