

// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { FaStar, FaBed, FaBath, FaMapMarkerAlt, FaTimes, FaPhone } from 'react-icons/fa';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import '../styles/PropertyDetails.css'; // Import your CSS file
// import { AuthContext } from '../context/AuthContext';

// // Fix Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const PropertyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate(); // Use navigate for the close button
//   const [property, setProperty] = useState(null);
//   const [owner, setOwner] = useState(null);
//   const [reviews, setReviews] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
//   const { user } = useContext(AuthContext);
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5001/api/properties/${id}`);
//         setProperty(response.data);
//         // Fetch owner details
//         const ownerResponse = await axios.get(`http://localhost:5001/api/users/find/${response.data.user_id}`);
//         setOwner(ownerResponse.data);
//         // Fetch reviews
//         const reviewsResponse = await axios.get(`http://localhost:5001/api/properties/${id}/reviews`);
//         setReviews(reviewsResponse.data);
//       } catch (error) {
//         console.error('Error fetching property details:', error);
//       }
//     };

//     fetchProperty();
//   }, [id]);

//   if (!property) return <div>Loading...</div>;

//   // Function to handle image click
//   const handleImageClick = (img) => {
//     setSelectedImage(img);
//   };

//   // Function to close the modal
//   const closeModal = () => {
//     setSelectedImage(null);
//   };

//   // Function to handle close button click
//   const handleClose = () => {
//     navigate(-1); // Go back to the previous page
//   };

//   // Check if the property has valid coordinates
//   const isValidCoordinates =
//     property.location?.latitude &&
//     property.location?.longitude &&
//     !isNaN(property.location.latitude) &&
//     !isNaN(property.location.longitude);

//   return (
//     <div className="property-details-container">
//       <button className="close-button" onClick={handleClose}>
//         <FaTimes />
//       </button>
//       <div className="hero-section">
//         <img src={property.images[0]} alt={property.title} className="hero-image" />
//         <div className="hero-info">
//           <h1 className="property-title">{property.title}</h1>
//           <p className="price">${property.price.toLocaleString()}</p>
//           <p className="location">
//             <FaMapMarkerAlt /> {property.location.address}
//           </p>
//         </div>
//       </div>
//       <div className="property-content">
//         {/* Image Gallery */}
//         <div className="image-gallery">
//           <img src={property.images[0]} alt={property.title} className="main-image" />
//           <div className="thumbnail-container">
//             {property.images.map((img, index) => (
//               <img
//                 key={index}
//                 src={img}
//                 alt={`Thumbnail ${index}`}
//                 className="thumbnail"
//                 onClick={() => handleImageClick(img)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Property Details */}
//         <div className="property-details">
//           <h2>Description</h2>
//           <p>{property.description}</p>
//           <h3>Features:</h3>
//           <ul>
//             <li><FaBed /> {property.bedrooms} Bedrooms</li>
//             <li><FaBath /> {property.bathrooms} Bathrooms</li>
//             <li>Square Feet: {property.area}</li>
//             <li>Type: {property.property_type}</li>
//           </ul>
//           {user && user.role === 'buy/rent' && (
//             <button className="contact-button">
//               <FaPhone /> Contact Owner
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Map Section */}
//       {isValidCoordinates && (
//       <div className="map-section">
//         <h3 className="text-xl font-semibold mb-4">Location</h3>
//         <MapContainer
//           center={[property.location.latitude, property.location.longitude]}
//           zoom={13}
//           style={{ height: '400px', width: '100%' }}
//         >
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; OpenStreetMap contributors'
//           />
//           <Marker position={[property.location.latitude, property.location.longitude]}>
//             <Popup>{property.location.address}</Popup>
//           </Marker>
//         </MapContainer>
//       </div>
//     )}
//       {/* Reviews Section */}
//       <h2 className="reviews-title">Reviews</h2>
//       {reviews.length > 0 ? (
//         reviews.map((review, index) => (
//           <div key={index} className="review-card">
//             <p>{review.review}</p>
//             <div className="review-rating">
//               {[...Array(review.rating)].map((_, i) => (
//                 <FaStar key={i} />
//               ))}
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No reviews yet.</p>
//       )}

//       {/* Owner Information */}
//       {owner && (
//         <div className="owner-info">
//           <h2>Owner Information</h2>
//           <p>Name: {owner.name}</p>
//           <img src={owner.avatar} alt={owner.name} className="owner-avatar" />
//         </div>
//       )}

//       {/* Image Modal */}
//       {selectedImage && (
//         <div className="image-modal" onClick={closeModal}>
//           <div className="modal-content">
//             <button className="close-button" onClick={closeModal}>
//               <FaTimes />
//             </button>
//             <img src={selectedImage} alt="Selected" className="modal-image" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PropertyDetails;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaBed, FaBath, FaMapMarkerAlt, FaTimes, FaPhone,FaRupeeSign } from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/PropertyDetails.css'; // Import your CSS file
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Use navigate for the close button
  const [property, setProperty] = useState(null);
  const [owner, setOwner] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State for the selected image
  const { user } = useContext(AuthContext);
  const { createChat,updateCurrentChat } = useContext(ChatContext);
  
// Enhanced handleContactOwner in PropertyDetails
const handleContactOwner = async () => {
  if (!user) {
    alert('Please log in to contact the owner.');
    return;
  }

  const ownerId = property.user_id?._id || property.user_id;
  const response = await createChat(user._id, ownerId);
  
  if (response) {
    navigate('/chat');
    updateCurrentChat(response);
  }
};
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/properties/${id}`);
        setProperty(response.data);

        // Extract the user_id if it's an object
        const userId = response.data.user_id?._id || response.data.user_id;

        if (!userId) {
          console.error('User ID is missing or invalid');
          return;
        }

        // Fetch owner details
        const ownerResponse = await axios.get(`http://localhost:5001/api/users/find/${userId}`);
        setOwner(ownerResponse.data);

        // Fetch reviews
        const reviewsResponse = await axios.get(`http://localhost:5001/api/properties/${id}/reviews`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching property details:', error);
      }
    };

    fetchProperty();
  }, [id]);

  if (!property) return <div>Loading...</div>;

  // Function to handle image click
  const handleImageClick = (img) => {
    setSelectedImage(img);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Function to handle close button click
  const handleClose = () => {
    navigate(-1); // Go back to the previous page
  };

  // Check if the property has valid coordinates
  const isValidCoordinates =
    property.location?.latitude &&
    property.location?.longitude &&
    !isNaN(property.location.latitude) &&
    !isNaN(property.location.longitude);

  return (
    <div className="property-details-container">
      <button className="close-button" onClick={handleClose}>
        <FaTimes />
      </button>
      <div className="hero-section">
        <img src={property.images[0]} alt={property.title} className="hero-image" />
        <div className="hero-info">
          <h1 className="property-title">{property.title}</h1>
          <p className="price"><FaRupeeSign/>{property.price.toLocaleString()}</p>
          <p className="location">
            <FaMapMarkerAlt /> {property.location.address}
          </p>
        </div>
      </div>
      <div className="property-content">
        {/* Image Gallery */}
        <div className="image-gallery">
          <img src={property.images[0]} alt={property.title} className="main-image" />
          <div className="thumbnail-container">
            {property.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className="thumbnail"
                onClick={() => handleImageClick(img)}
              />
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="property-details">
          <h2>Description</h2>
          <p>{property.description}</p>
          <h3>Features:</h3>
          <ul>
            <li><FaBed /> {property.bedrooms} Bedrooms</li>
            <li><FaBath /> {property.bathrooms} Bathrooms</li>
            <li>Square Feet: {property.sqfeet}</li>
            <li>Type: {property.property_type}</li>
          </ul>
          {user && user.role === 'buy/rent' && (
            <button className="contact-button" onClick={handleContactOwner}>
              <FaPhone /> Contact Owner
            </button>
          )}
        </div>
      </div>

      {/* Map Section */}
      {isValidCoordinates && (
        <div className="map-section">
          <h3 className="text-xl font-semibold mb-4">Location</h3>
          <MapContainer
            center={[property.location.latitude, property.location.longitude]}
            zoom={13}
            style={{ height: '400px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[property.location.latitude, property.location.longitude]}>
              <Popup>{property.location.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* Reviews Section */}
      <h2 className="reviews-title">Reviews</h2>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review-card">
            <p>{review.review}</p>
            <div className="review-rating">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}

      {/* Owner Information */}
      {owner && (
        <div className="owner-info">
          <h2>Owner Information</h2>
          <img src={owner.avatar} alt={owner.name} className="owner-avatar" />
          <p>Name: {owner.name}</p>
          <p>Email: {owner.email}</p>
          {user && user.role === 'buy/rent' && (
            <button className="contact-button" onClick={handleContactOwner}>
              <FaPhone /> Contact Owner
            </button>
          )}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={closeModal}>
          <div className="modal-content">
            <button className="close-button" onClick={closeModal}>
              <FaTimes />
            </button>
            <img src={selectedImage} alt="Selected" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;