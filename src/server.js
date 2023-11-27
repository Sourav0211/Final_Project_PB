const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs } = require('@firebase/firestore');

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
  const { userUID, category, value } = req.body;
  const budgetCollectionRef = collection(db, "Test", userUID, "Budget");

  try {
    const docRef = await addDoc(budgetCollectionRef, { category, value });
    res.status(201).json({ success: true, id: docRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Endpoint to get budget data
app.get('/api/budget/:userUID', async (req, res) => {
  const { userUID } = req.params;
  const budgetCollectionRef = collection(db, "Test", userUID, "Budget");

  try {
    const data = await getDocs(budgetCollectionRef);
    const budgetData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    res.status(200).json({ success: true, data: budgetData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
