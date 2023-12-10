import React from 'react';
import './Menu.css';

function Menu( {userSignOut , showInsights}) {



    return (
      <nav className='NavBar'>
          <ul>
              <li><a href="/">Home</a></li>
              <li> <a href="#about">About</a> </li>
              <li onClick={showInsights}>Insights</li>
              <a href="/" onClick={userSignOut} id='navbutton'>Sign Out</a>
          </ul>
      </nav>
    );
  }
  
  export default Menu; 