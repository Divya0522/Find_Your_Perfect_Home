import React from "react";
import "../../styles/Listings.css";
import image1 from '../../images/pii1.png'
import image2 from '../../images/pii2.png'
import image3 from '../../images/pii3.png'
import image4 from '../../images/pii4.png'
export default function Listings() {
  return (
    <>
    <div className="listings">
      <div className="titlelists">
        <h1 className="heading-primary">
          Uncover a diverse array of properties that suit your specific needs on
          our state-of-the-art platform
        </h1>
        <p className="subheading">
          Whether you are looking for a snug apartment, a large family house, or
          a business location, our seamless interface enables you to
          effortlessly sift through numerous listings. Leverage our enhanced
          search capabilities to find the perfect fit for your way of life and
          preferences.
        </p>
      </div>
      <div className="features">
        <div className="feature-card feature-card1">
          <div className="feature-content">
            <h3 className="feature-title">Advanced Search Filters</h3>
            <div className="fbody">
            <p className="feature-description">
              Our platform offers advanced search filters that allow users to
              refine their property searches based on location, price range,
              number of bedrooms, and more.
            </p>
            <button className="feature-button">Explore Filters</button></div>
          </div>
        </div>
        <div className="feature-card feature-card2">
          <div className="feature-content">
            <h3 className="feature-title">Interactive Map View</h3>
            <p className="feature-description">
              Visualize available properties through our interactive map view,
              enabling users to see property locations and nearby amenities.
            </p>
            <button className="feature-button">View on Map</button>
          </div>
        </div>
        <div className="feature-card feature-card3">
          <div className="feature-content">
            <h3 className="feature-title">Save Your Searches</h3>
            <p className="feature-description">
            Keep track of your favorite properties by saving your searches for easy access later. This feature allows you to revisit the listings that caught your eye, making your property hunt more efficient.
            </p>
            <button className="feature-button">Save Searches</button>
          </div>
        </div>
        <div className="feature-card feature-card4">
          <div className="feature-content">
            <h3 className="feature-title">Compare Properties</h3>
            <p className="feature-description">
            Easily compare multiple properties side by side to evaluate their features, pricing, and locations. This functionality is designed to help you make informed decisions by highlighting the pros and cons of each listing.
            </p>
            <button className="feature-button">Start Comparing</button>
          </div>
        </div>
      </div>
    </div>
    <div className="about">
        <div className="atitle">
           <h2 className='ah1'>Discover Your Dream Home</h2> 
           <h4 className='ah4'>Find the perfect property that suits your lifestyle and budget with our comprehensive listings.</h4>
        <div className="acards">
  <div className="acard left">
    <img src={image1} className="acard-image" alt="Featured Property" />
    <div className="acard-text">
      <strong>Luxury Urban Apartments</strong>
      <p>
      Explore our exclusive collection of luxury urban apartments featuring modern designs, top-notch amenities, and stunning city views. These properties are ideal for those seeking a vibrant city life with all the comforts of home.
      </p>
    </div>
  </div>
  <div className="acard right">
    <img src={image2} className="acard-image" alt="Featured Property" />
    <div className="acard-text">
      <strong>Charming Family Homes</strong>
      <p>
      Browse through a selection of charming family homes located in serene neighborhoods. Each listing provides ample space and a welcoming environment, perfect for families looking to settle down in a community-focused.
      </p>
    </div>
  </div>
  <div className="acard left">
    <img src={image3} className="acard-image" alt="Featured Property" />
    <div className="acard-text">
      <strong>Cozy Suburban Condos</strong>
      <p>
      Our listings also include cozy suburban condos that offer a blend of comfort and convenience. With easy access to local amenities and parks, these properties are perfect for young professionals or small families.
      </p>
    </div>
  </div>
    </div>
    </div>
    </div>
    </>
  );
}
