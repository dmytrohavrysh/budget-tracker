import { initializeApp } from "firebase/app";
import {getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import {getFirestore} from "firebase/firestore";

const REACT_APP_API_KEY="AIzaSyAfC35uQiouO-Z7yuQSIrC-7mklow_KyYY";
const REACT_APP_AUTH_DOMAIN="budget-diary-999e4.firebaseapp.com";
const REACT_APP_PROJECT_ID="budget-diary-999e4";
const REACT_APP_STORAGE_BUCKET="budget-diary-999e4.appspot.com";
const REACT_APP_MESSAGING_SENDER_ID="685308263563";
const REACT_APP_APP_ID="1:685308263563:web:2d239e380264041596688e";
const REACT_APP_MEASUREMENT_ID="G-7R59FEDD45";

const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID,
  measurementId: REACT_APP_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword};