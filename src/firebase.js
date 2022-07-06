import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAfC35uQiouO-Z7yuQSIrC-7mklow_KyYY",
  authDomain: "budget-diary-999e4.firebaseapp.com",
  projectId: "budget-diary-999e4",
  storageBucket: "budget-diary-999e4.appspot.com",
  messagingSenderId: "685308263563",
  appId: "1:685308263563:web:2d239e380264041596688e",
  measurementId: "G-7R59FEDD45"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };