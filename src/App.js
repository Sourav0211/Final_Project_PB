import React, { useState , useEffect } from "react";
import './App.css';
import Login from "./Login";
import Register from "./Register";
import { onAuthStateChanged } from "firebase/auth";
import {auth } from "./firebase";

function App() {

  const [authUser,setAuthUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubscribe();
  }, []);





  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  return (
    <div className="App">

       {currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : < Register onFormSwitch={toggleForm} /> }

    </div>
  );
}

export default App;