import React from 'react';
import './Menu.css';

function Menu( {userSignOut , showInsights}) {



    return (
      <nav className='NavBar'>
          <ul>
              <li>Home</li>
              <li>About</li>
              <li onClick={showInsights}>Insights</li>
              <a href="#" onClick={userSignOut} id='navbutton'>Sign Out</a>
          </ul>
      </nav>
    );
  }
  
  export default Menu; 