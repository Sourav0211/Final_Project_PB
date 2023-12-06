

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





//Second account keys

  


  // apiKey: "AIzaSyD4VQdkwrkcwHGBWd6HpUT4ZKuLo2ddbQI",
  // authDomain: "personal-budget-74040.firebaseapp.com",
  // projectId: "personal-budget-74040",
  // storageBucket: "personal-budget-74040.appspot.com",
  // messagingSenderId: "271862150583",
  // appId: "1:271862150583:web:fbad5577673a45dd1c6432",
  // measurementId: "G-4M6K694XV4"