import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';
import logo from '../../images/main.png';
import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



export default function Header() {
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('header');
      if (window.scrollY >= header.offsetTop + header.offsetHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="header" className="header">
      <div className="inner-header">
        <div className="top-nav">
          <div className="nav-logo">
            <div className="logo">
              <img src={logo} style={{ width: '100px', height: '100px' }} alt="Find Your Place Logo" />
            </div>
            <p className="caption">Find Your Place</p>
          </div>
          <div className="button">
          <button className="sign-in" onClick={() => navigate('/signin')}>Sign in</button>
          <button className="sign-up" onClick={() => navigate('/signup')}>Sign Up</button>
          </div>
        </div>
        <div id="bottom-nav" className={`bottom-nav ${isSticky ? 'sticky' : ''}`}>
        <ul className="nav-links">
   <li><NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink></li>
  <li><NavLink to="/listings" className={({ isActive }) => (isActive ? 'active' : '')}>Listings</NavLink></li>
  <li><NavLink to="/about-us" className={({ isActive }) => (isActive ? 'active' : '')}>About Us</NavLink></li>
  <li><NavLink to="/contact-us"className={({ isActive }) => (isActive ? 'active' : '')}>Contact Us</NavLink></li> 

</ul>
        </div>
      </div>
    </div>
  );
}