import React, { useState,useEffect } from "react";
import {auth} from "./firebase"
import { signInWithEmailAndPassword,signOut,onAuthStateChanged  } from "firebase/auth";
import './Login.css';
import Dashboard from "./Dashboard";

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [authUser, setAuthUser] = useState(null); 
    const [tokenExpiration, setTokenExpiration] = useState(null);
    const [status ,setStatus] = useState(null);

    const Login = (e) => {
       e.preventDefault();
       signInWithEmailAndPassword(auth, email, pass)
       .then((userCredential) => {
        console.log(userCredential);
        setAuthUser(userCredential.user);

        const expirationTime = new Date().getTime() +  5 * 60 * 1000; // 1 minutes
        setTokenExpiration(expirationTime);

       }).catch((error) => {
        console.log(error);
        if(error.code === 'auth/network-request-failed')
        {
            setStatus('Invalid-User');
        }
       })
    }


    const putMessage = () => {
        if (status === 'Invalid-User') {
            return (
                <p>
                Invalid Email or Password
                </p>
            );
        }
    }



    useEffect(() =>
    {
        const listen = onAuthStateChanged(auth, (user)=>{
            if(user){
                setAuthUser(user);

            const expirationTime = new Date().getTime() + 5 * 60 * 1000; // 1 minutes 
            setTokenExpiration(expirationTime);
            }
            else{
                setAuthUser(null);
                setTokenExpiration(null); 

            }
        });
        return()=>{
            listen();
        }
        
    },[]);
    const userSignOut = () => {
        signOut(auth).then(()=> {
            console.log('sign out successful')
            setAuthUser(null);
            setTokenExpiration(null);
        }).catch(error => console.log(error) )
    }

/*setting session time for 1 min*/
    const checkTokenExpiration = () => {
        if (authUser && tokenExpiration) {
          const currentTimestamp = new Date().getTime();
          if (currentTimestamp > tokenExpiration) {
            // Token has expired, sign out the user or take appropriate action
            console.log("Token has expired");
            userSignOut();
          }
        }
      };
    
      useEffect(() => {
        const interval = setInterval(() => {
          checkTokenExpiration();
        }, 1000); // Check token expiration every second
    
        return () => clearInterval(interval);
      }, [authUser, tokenExpiration]);





    if (authUser) {
        return (<Dashboard authUser={authUser} userSignOut={userSignOut}/>)
      }



    
    return (
        <div className="auth-form-container">
            <h2>Login</h2>
            <form className="login-form" onSubmit={Login}>
                <label htmlFor="email">email</label>
                <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email" />
                
                <label htmlFor="password">password</label>
                <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                
                <button classNAme="login-button" type="submit">Log In</button>
            </form>
            <button className="link-btn" onClick={() => props.onFormSwitch('register')}>Don't have an account? Register here.</button>
            <div className="Warning">
                {putMessage()}
            </div>
        </div>
        
    )
}

export default Login;



