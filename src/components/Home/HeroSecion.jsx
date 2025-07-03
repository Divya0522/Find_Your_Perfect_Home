
import React from 'react';
import '../../styles/HeroSection.css'
import image from '../../images/img4.jpg';

export default function HeroSection() {
  return (
    <div>
      <div className="background-image">
        <img src={image} style={{ width: '100%', height: '658px', objectFit: 'cover', filter: 'brightness(70%)' }} />
        <div className="container">
          <h4 className="title">Your ultimate destination for seamless real estate experiences.</h4>
          <h1 className="heading">Welcome to Find Your Place</h1>
          <button className="contact">Contact Us</button>
        </div>
      </div>
    </div>
  );
}
