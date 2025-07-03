import React from 'react';
import '../../styles/AboutUs.css';
import image1 from '../../images/i1.png';
import image2 from '../../images/i2.png';
import image3 from '../../images/i3.png';

export default function AboutUs() {
  return (
    <>
      <div className="about-new">
        <div className="anew-title">
          <h2 className="anew-h1">Empowering Real Estate Connections</h2>
          <h4 className="anew-h4">Navigating Your Property Journey with Ease</h4>
        </div>
        <div className="anew-cards">
          <div className="anew-card">
            <img src={image1} className="anew-card-image" alt="User-Centric Approach" />
            <div className="anew-card-text">
              <strong>User-Centric Approach</strong>
              <p>
                At Find Your Place, we prioritize the needs of our users, whether they are renters, buyers, or property owners.
                Our platform simplifies the real estate process by providing intuitive tools that enhance user experience.
              </p>
            </div>
          </div>
          <div className="anew-card">
            <img src={image2} className="anew-card-image" alt="Innovative Technology" />
            <div className="anew-card-text">
              <strong>Innovative Technology</strong>
              <p>
                Leveraging modern web technologies, our platform combines React and Flask to deliver a responsive and interactive experience.
                We integrate cutting-edge APIs to keep property listings current and informative.
              </p>
            </div>
          </div>
          <div className="anew-card">
            <img src={image3} className="anew-card-image" alt="Building Community" />
            <div className="anew-card-text">
              <strong>Building Community</strong>
              <p>
                Real estate is not just about transactions but also about building communities. We aim to foster connections among users,
                property owners, and local markets to promote informed decisions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="celebration-container">
        <div className="celebration-title">
          <h2 className="celebration-heading">Celebrating Our Success Stories</h2>
          <h4 className="celebration-subheading">Transforming Visions into Reality</h4>
        </div>
        <div className="celebration-cards">
          <div className="celebration-card">
            <div className="celebration-card-image-wrapper">
              <img src={image1} className="celebration-card-image" alt="Urban Living Development" />
            </div>
            <div className="celebration-card-text">
              <strong>Urban Living Development</strong>
              <p>
                This project involved the successful launch of a multi-unit residential complex in the heart of the city,
                showcasing modern amenities and eco-friendly designs.
              </p>
            </div>
          </div>
          <div className="celebration-card">
            <div className="celebration-card-image-wrapper">
              <img src={image2} className="celebration-card-image" alt="Suburban Community Revitalization" />
            </div>
            <div className="celebration-card-text">
              <strong>Suburban Community Revitalization</strong>
              <p>
                We worked on revitalizing a suburban neighborhood, integrating community spaces and enhancing property values
                through strategic marketing and partnerships.
              </p>
            </div>
          </div>
          <div className="celebration-card">
            <div className="celebration-card-image-wrapper">
              <img src={image3} className="celebration-card-image" alt="Luxury Apartment Listings" />
            </div>
            <div className="celebration-card-text">
              <strong>Luxury Apartment Listings</strong>
              <p>
                Our team managed a premium listing campaign for luxury apartments, utilizing targeted marketing strategies
                that resulted in a 30% increase in inquiries within the first month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
