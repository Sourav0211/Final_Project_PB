// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore} from "@firebase/firestore";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyB2_ux1kEP4K4j2p-TjR9_yOm_H6Zcuh_E",
//   authDomain: "my-budget-react.firebaseapp.com",
//   projectId: "my-budget-react",
//   storageBucket: "my-budget-react.appspot.com",
//   messagingSenderId: "601586725418",
//   appId: "1:601586725418:web:7795257868ff5a74824953",
//   measurementId: "G-P42CDK9XQK"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// const auth = getAuth(app);
// export const db = getFirestore(app);


// export { auth };



// firebase.js
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('@firebase/firestore');
const { getAuth } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyB2_ux1kEP4K4j2p-TjR9_yOm_H6Zcuh_E",
  authDomain: "my-budget-react.firebaseapp.com",
  projectId: "my-budget-react",
  storageBucket: "my-budget-react.appspot.com",
  messagingSenderId: "601586725418",
  appId: "1:601586725418:web:7795257868ff5a74824953",
  measurementId: "G-P42CDK9XQK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { db, auth };
