
import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import './Register.css';

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [Status, setStatus] = useState(null);


    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            
            setStatus('success');
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/network-request-failed') {
          
                setStatus('user-exists');
            } else {
                
                setStatus('error');
            }
        }
    }
    
    const putMessage = () => {
        if (Status === 'success') {
            return (
                <p>
                You have successfully registered!Please Click{' '}
                <span onClick={() => 
                    {props.onFormSwitch('login');
                    setEmail('');
                    setPass('');}} className="link">
                    here to go to your Dashoard.
                </span>{' '}
                
            </p>
            );
        } else if (Status === 'user-exists') {
            return (
                <p>
                    Email is already registered. Please use a different email or{' '}
                    <span onClick={() => {props.onFormSwitch('login');
                    setEmail('');
                    setPass('')}} className="link">
                        login here
                    </span>
                    .
                </p>
            );
        } else if (Status === 'error') {
            return <p>Error registering user. Please try again.</p>;
        }
        return null;
    };

    return (
        <div className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={handleRegistration}>
            <label htmlFor="email">email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
            <label htmlFor="password">password</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <button type="submit">Register</button>
        </form>
        {
            putMessage()
        }
        <button className="link-btn" onClick={() => {props.onFormSwitch('login');
                    setEmail('');
                    setPass('');}}>Already have an account? Login here.</button>
    </div>
    )
}

export default Register;