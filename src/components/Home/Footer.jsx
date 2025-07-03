import React from 'react';
import '../../styles/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column">
          <h3 className="footer-title">Find Your Place</h3>
          <p>
            Your trusted platform to buy, sell, or rent properties with ease.
            Let's find the place you'll love to call home.
          </p>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/properties">Properties</a></li>
            <li><a href="/buy">Buy</a></li>
            <li><a href="/sell">Sell</a></li>
            <li><a href="/rent">Rent</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Contact Us</h3>
          <p>
            <strong>Phone:</strong> +1 (123) 456-7890
          </p>
          <p>
            <strong>Email:</strong> support@findyourplace.com
          </p>
          <p>
            <strong>Address:</strong> 123 Real Estate Lane, Dream City, USA
          </p>
        </div>
        <div className="footer-column">
          <h3 className="footer-title">Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Find Your Place. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
