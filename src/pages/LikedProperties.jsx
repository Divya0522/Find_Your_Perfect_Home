
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaBed, FaBath, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const LikedProperties = () => {
  const [likedProperties, setLikedProperties] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLikedProperties = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/find/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
  
        const savedListings = response.data.saved_listings;
        console.log('Saved Listings:', savedListings);
  
        const properties = await Promise.all(
          savedListings.map(async (listingId) => {
            try {
              const propertyResponse = await axios.get(`http://localhost:5001/api/properties/${listingId}`);
              return propertyResponse.data;
            } catch (error) {
              console.error(`Property ${listingId} not found:`, error);
              return null;
            }
          })
        );
  
        const validProperties = properties.filter(property => property !== null);
        setLikedProperties(validProperties);
      } catch (error) {
        console.error('Error fetching liked properties:', error);
      }
    };
  
    if (user) {
      fetchLikedProperties();
    }
  }, [user]);

  const handleViewDetails = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  const handleUnsaveListing = async (listingId) => {
    try {
      await axios.post(
        'http://localhost:5001/api/properties/unsave-listing',
        { listingId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      // Remove the unsaved property from the state
      setLikedProperties(prev => prev.filter(property => property._id !== listingId));
      alert('Listing unsaved!');
    } catch (error) {
      console.error('Error unsaving listing:', error);
    }
  };

  return (
    <div className="liked-properties">
      <h2>Liked Properties</h2>
      {likedProperties.length > 0 ? (
        likedProperties.map((property) => (
          <div key={property._id} className="property-card">
            <img
              src={property.images[0]}
              alt={property.title}
              className="property-image"
            />
            <div className="property-info">
              <h3>{property.title}</h3>
              <p>{property.description}</p>
              <p>
                <FaMapMarkerAlt /> {property.location.address}
              </p>
              <p>
                <FaBed /> {property.bedrooms} Bedrooms | <FaBath /> {property.bathrooms} Bathrooms
              </p>
              <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>
              <div className="property-actions">
                <button onClick={() => handleViewDetails(property._id)}>View Details</button>
                <button onClick={() => handleUnsaveListing(property._id)}>Unsave</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No saved properties found.</p>
      )}
    </div>
  );
};

export default LikedProperties;