import React from 'react';
import '../../styles/Featured.css'; 
import image1 from '../../images/card2.png';
import image2 from '../../images/card1.png';
import image3 from '../../images/card3.png';

export default function Featured() {
  return (
    <div>
      <div className="container1">
        <div className="container2">
          <h2 className="first-heading">Featured Properties</h2>
          <h4 className="second-heading">
            Discover our top selections that cater to various tastes and needs.
          </h4>
        </div>
        <div className="cards">
  <div className="card left">
    <img src={image1} className="card-image" alt="Featured Property" />
    <div className="card-text">
      <strong>Modern Apartment in Downtown</strong>
      <div className="details">
        <p>📍 123 City Center St, Downtown</p>
        <p>🏠 2 Beds • 2 Baths</p>
        <p>📐 1,200 sq ft</p>
      </div>
      <p>
        This stylish apartment features modern amenities, stunning city views, and is located close to public transport and entertainment options.
      </p>
    </div>
  </div>
  <div className="card right">
    <img src={image2} className="card-image" alt="Featured Property" />
    <div className="card-text">
      <strong>Spacious Family Home</strong>
      <div className="details">
        <p>📍 456 Suburban Rd, Greenfield</p>
        <p>🏠 4 Beds • 3 Baths</p>
        <p>📐 2,500 sq ft</p>
      </div>
      <p>
        A charming house with a large garden, located in a family-friendly neighborhood close to schools and parks.
      </p>
    </div>
  </div>
  <div className="card left">
    <img src={image3} className="card-image" alt="Featured Property" />
    <div className="card-text">
      <strong>Luxury Beachside Villa</strong>
      <div className="details">
        <p>📍 789 Oceanview Blvd, Seaside</p>
        <p>🏠 5 Beds • 4 Baths</p>
        <p>📐 3,800 sq ft</p>
      </div>
      <p>
        Enjoy breathtaking ocean views from this elegant villa, complete with a private pool and modern amenities.
      </p>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}
