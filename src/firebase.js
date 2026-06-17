import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyBIELEmqTcFV9Ureg5V8orcEHMTrGRDqy4",

  authDomain: "cartel-tycoon-game.firebaseapp.com",

  projectId: "cartel-tycoon-game",

  storageBucket: "cartel-tycoon-game.firebasestorage.app",

  messagingSenderId: "356172125491",

  appId: "1:356172125491:web:7b6fa03a61f3b353e59a46"

};
// Initialisation de Firebase
const app = initializeApp(firebaseConfig);

// Services exportées pour être utilisés dans tout le projet
export const auth =getAuth(app);
export const db= getFirestore(app);

export default app;
