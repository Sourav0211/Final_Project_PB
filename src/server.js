const express = require('express');
const { initializeApp } = require('firebase/app');
const compression = require('compression');
const { getFirestore, collection, addDoc, getDocs ,doc,deleteDoc
,query,where } = require('@firebase/firestore');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cache = require('memory-cache');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const path = require('path');

// app.use(cors());
// app.options('/api/login', cors());
// const _ = require('lodash'); 


const firebaseConfig = {
  apiKey: "AIzaSyB2_ux1kEP4K4j2p-TjR9_yOm_H6Zcuh_E",
  authDomain: "my-budget-react.firebaseapp.com",
  projectId: "my-budget-react",
  storageBucket: "my-budget-react.appspot.com",
  messagingSenderId: "601586725418",
  appId: "1:601586725418:web:7795257868ff5a74824953",
  measurementId: "G-P42CDK9XQK"
};
// const firebaseConfig = {
//   apiKey: "AIzaSyB2_ux1kEP4K4j2p-TjR9_yOm_H6Zcuh_E",
//   authDomain: "my-budget-react.firebaseapp.com",
//   projectId: "my-budget-react",
//   storageBucket: "my-budget-react.appspot.com",
//   messagingSenderId: "601586725418",
//   appId: "1:601586725418:web:7795257868ff5a74824953",
//   measurementId: "G-P42CDK9XQK"
// };


const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);
const auth = getAuth(appFirebase); //

const app = express();


app.use(express.static('build'));

// Serve 'index.html' for all other routes
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


app.use(compression(
  {
    level : 6
  }
)); 

const port = 3001;

// middleware to check cache
const cacheMiddleware = (req, res, next) => {
  const cacheKey = req.url;

  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    res.json(cachedData);
  } else {
    next();
  }
};

app.use(express.json());




// Endpoint to add a new budget
app.post('/api/budget', async (req, res) => {
  const { userUID, month, category, value, value2 } = req.body;
  const budgetCollectionRef = collection(db, "Test", userUID, "Budget");

  try {
    const docRef = await addDoc(budgetCollectionRef, { month, category, value, value2 });
    res.status(201).json({ success: true, id: docRef.id });

  } catch (error) {
    console.error(error);
    cache.clear();
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
    const cacheKey = req.url;
    if (month) {
      const querySnapshot = await getDocs(query(budgetCollectionRef, where("month", "==", month)));
      data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } else {
      const querySnapshot = await getDocs(budgetCollectionRef);
      data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    }
    cache.put(cacheKey, { success: true, data });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});





// // Endpoint to fecth data without a month filter
app.get('/api/linechart/:userUID', async (req, res) => {
  const { userUID } = req.params;
  const budgetCollectionRef = collection(db, "Test", userUID, "Budget");

  try {
    const cacheKey = req.url;
    const querySnapshot = await getDocs(budgetCollectionRef);
    const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    cache.put(cacheKey, { success: true, data });
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// // Endpoint to delete a specific budget item
app.delete('/api/budget/:userUID/:itemId', async (req, res) => {
  const { userUID, itemId } = req.params;
  const budgetDocRef = doc(collection(db, "Test", userUID, "Budget"), itemId);

  try {
    await deleteDoc(budgetDocRef);
    cache.clear();
    res.status(200).json({ success: true, message: "Budget item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});



// Endpoint to add a new budget and return a custom JWT
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Assuming successful validation, create a custom JWT token
    const customToken = jwt.sign({ email }, 'your-secret-key', { expiresIn: '1m' });
    
    res.status(200).json({ success: true, customToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Create a new user in Firebase Authentication
    // const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Assuming successful registration, create a custom JWT token uid: userCredential.user.uid
    const customToken = jwt.sign({ email }, 'your-secret-key', { expiresIn: '1m' });

    res.status(201).json({ success: true, customToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error', details: error.message });
  }
});






app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
