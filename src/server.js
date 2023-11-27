const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs
,query,where } = require('@firebase/firestore');

const cors = require('cors');



const firebaseConfig = {
  apiKey: "AIzaSyB2_ux1kEP4K4j2p-TjR9_yOm_H6Zcuh_E",
  authDomain: "my-budget-react.firebaseapp.com",
  projectId: "my-budget-react",
  storageBucket: "my-budget-react.appspot.com",
  messagingSenderId: "601586725418",
  appId: "1:601586725418:web:7795257868ff5a74824953",
  measurementId: "G-P42CDK9XQK"
};

const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

const app = express();
app.use(cors());
const port = 3001;

app.use(express.json());

// Endpoint to add a new budget
app.post('/api/budget', async (req, res) => {
  const { userUID,month, category, value } = req.body;
  const budgetCollectionRef = collection(db, "Test", userUID, "Budget");

  try {
    const docRef = await addDoc(budgetCollectionRef, { month, category, value });
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Endpoint to get budget data
app.get('/api/budget/:userUID', async (req, res) => {
  const { userUID } = req.params;
  const { month } = req.query;
  const budgetCollectionRef = collection(db, "Test", userUID, "Budget");

  try {
    let data;
    if (month) {
        const querySnapshot = await getDocs(query(budgetCollectionRef, where("month", "==", month)));
      data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } else {
        const querySnapshot = await getDocs(budgetCollectionRef);
      data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
