import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";

// export initializeFirebase function to initlize Firebase later and get the app object
const initializeFirebase = () => {
  return initializeApp(firebaseConfig);
};

export default initializeFirebase;
