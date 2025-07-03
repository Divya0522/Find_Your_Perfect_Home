
// import React, { useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';

// const PropertyDetailsModal = ({ property, onClose }) => {
//   const [hoveredImage, setHoveredImage] = useState(null);
//   const [review, setReview] = useState('');
//   const [rating, setRating] = useState(0);

//   if (!property) return null;

//   // Validate latitude and longitude
//   const latitude = property.location?.latitude || 0;
//   const longitude = property.location?.longitude || 0;
//   const isValidCoordinates = 
//   !isNaN(property.location?.latitude) && 
//   !isNaN(property.location?.longitude) &&
//   Math.abs(property.location.latitude) <= 90 &&
//   Math.abs(property.location.longitude) <= 180;

//   // Handle review submission
//   const handleSubmitReview = async () => {
//     try {
//       const response = await axios.post(
//         `http://localhost:5001/api/properties/${property._id}/reviews`,
//         { review, rating },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('token')}`, // Add authentication token
//           },
//         }
//       );
//       console.log('Review submitted:', response.data);
//       onClose(); // Close the modal after submission
//     } catch (error) {
//       console.error('Error submitting review:', error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//       <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl overflow-y-auto max-h-screen">
//         <button
//           className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
//           onClick={onClose}
//         >
//           Close
//         </button>
//         <h2 className="text-2xl font-bold mb-4">{property.title}</h2>
//         <p className="text-gray-700 mb-4">{property.description}</p>

//         {/* Owner Information */}
//         {property.user_id && (
//           <div className="mb-6">
//             <h3 className="text-xl font-bold mb-2">Owner Information</h3>
//             <p><strong>Name:</strong> {property.user_id.name}</p>
//             <p><strong>Email:</strong> {property.user_id.email}</p>
//           </div>
//         )}
        
//         {/* Property Images */}
//         <div className="flex flex-wrap gap-4 mb-6">
//           {property.images.map((image, index) => (
//             <div
//               key={index}
//               className="relative"
//               onMouseEnter={() => setHoveredImage(image)}
//               onMouseLeave={() => setHoveredImage(null)}
//             >
//               <img
//                 src={image}
//                 alt={`Property Image ${index + 1}`}
//                 className="w-24 h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
//               />
//               {/* Show full-size image on hover */}
//               {hoveredImage === image && (
//                 <div className="absolute top-0 left-28 z-10">
//                   <img
//                     src={image}
//                     alt={`Full-size Property Image ${index + 1}`}
//                     className="w-64 h-64 object-cover rounded-lg shadow-lg"
//                   />
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>

//         {/* Property Info */}
//         <div className="mb-6">
//           <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
//           <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
//           <p><strong>City:</strong> {property.location.address}</p>
//           <p><strong>Price:</strong> ${property.price.toLocaleString()}</p>
//           <p><strong>Rating:</strong> {property.rating.average_rating} ({property.rating.total_reviews} reviews)</p>
//         </div>

//         {/* Review Form */}
//         <div className="mb-6">
//           <h3 className="text-xl font-bold mb-2">Add a Review</h3>
//           <textarea
//             className="w-full p-2 border rounded-lg mb-2"
//             placeholder="Write your review..."
//             value={review}
//             onChange={(e) => setReview(e.target.value)}
//           />
//           <input
//             type="number"
//             min="1"
//             max="5"
//             className="w-full p-2 border rounded-lg mb-2"
//             placeholder="Rating (1-5)"
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//           />
//           <button
//             className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
//             onClick={handleSubmitReview}
//           >
//             Submit Review
//           </button>
//         </div>

//         {/* Display Reviews */}
//         <div className="mb-6">
//           <h3 className="text-xl font-bold mb-2">Reviews</h3>
//           // Update the reviews display section
// {property.reviews.map((review, index) => (
//   <div key={index} className="mb-4">
//     <div className="flex items-center gap-2">
//       <img 
//         src={review.user_id?.avatar || '/default-avatar.png'} 
//         className="w-8 h-8 rounded-full"
//       />
//       <div>
//         <p className="font-semibold">{review.user_id?.name}</p>
//         <div className="flex gap-1">
//           {[...Array(5)].map((_, i) => (
//             <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
//               ★
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//     <p className="mt-2">{review.review}</p>
//   </div>
// ))}
//         </div>
//           {/*Property Details */}
          


//         {/* Property Map */}
//         <div className="mb-6">
//           <h3 className="text-xl font-bold mb-2">Location</h3>
//           {isValidCoordinates ? (
//             <MapContainer
//               center={[latitude, longitude]}
//               zoom={13}
//               style={{ height: '300px', width: '100%' }}
//             >
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//               <Marker position={[latitude, longitude]}>
//                 <Popup>{property.location.address}</Popup>
//               </Marker>
//             </MapContainer>
//           ) : (
//             <p>Location data is unavailable.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyDetailsModal;

// PropertyDetailsModal.jsx

// import React, { useContext, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import {FaBath,FaBed,FaDollarSign,FaMapMarkerAlt,FaTimes} from 'react-icons/fa';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { Carousel } from 'react-responsive-carousel';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';

// const PropertyDetailsModal = ({ property, onClose }) => {
//   const [hoveredImage, setHoveredImage] = useState(null);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const {user}=useContext(AuthContext);
//   const handleImageClick = (image) => {
//     setSelectedImage(image);
//   };

//   if (!property) return null;
//   delete L.Icon.Default.prototype._getIconUrl;
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//     iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
//   });
//   const latitude = property.location?.latitude || 0;
//   const longitude = property.location?.longitude || 0;
//   const isValidCoordinates = 
//     !isNaN(property.location?.latitude) && 
//     !isNaN(property.location?.longitude) &&
//     Math.abs(property.location.latitude) <= 90 &&
//     Math.abs(property.location.longitude) <= 180;
//     const handleSaveListing = async () => {
//       try {
//         await axios.post('/api/users/save-listing', 
//           { listingId: property._id },
//           { headers: { Authorization: `Bearer ${user.token}` } }
//         );
//         alert('Listing saved!');
//       } catch (error) {
//         console.error('Error saving listing:', error);
//       }
//     };
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//         <div className="bg-white rounded-lg p-6 w-11/12 max-w-4xl overflow-y-auto max-h-screen">
//           {/* Close button */}
//           <button onClick={onClose} className="absolute top-4 right-4 ...">
//             <FaTimes />
//           </button>
  
//           {/* Property Images Carousel */}
//           <Carousel showThumbs={false}>
//   {property.images.map((image, index) => (
//     <div key={index}>
//       <img 
//         src={image} 
//         className="property-image"
//         alt={`Property view ${index+1}`}
//       />
//     </div>
//   ))}
// </Carousel>
  
//           {/* Property Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h2 className="text-2xl font-bold mb-4">{property.title}</h2>
//               <p className="text-gray-600 mb-4">{property.description}</p>
              
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div>
//                   <FaBed className="inline mr-2" />
//                   {property.bedrooms} Bedrooms
//                 </div>
//                 <div>
//                   <FaBath className="inline mr-2" />
//                   {property.bathrooms} Bathrooms
//                 </div>
//                 <div>
//                   <FaDollarSign className="inline mr-2" />
//                   Price: ${property.price.toLocaleString()}
//                 </div>
//                 <div>
//                   <FaMapMarkerAlt className="inline mr-2" />
//                   {property.location.address}
//                 </div>
//               </div>
//             </div>
//             <button onClick={handleSaveListing} className="save-button">
//   Save to Favorites
// </button>
//             {/* Map Section */}
//             <div className="h-64">
//               {/* {isValidCoordinates && (
//                 <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%' }}>
//                   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                   <Marker position={[latitude, longitude]}>
//                     <Popup>{property.location.address}</Popup>
//                   </Marker>
//                 </MapContainer>
//               )} */}
//               {isValidCoordinates && (
//   <MapContainer
//     center={[latitude, longitude]}
//     zoom={13}
//     style={{ height: '300px', width: '100%' }}
//   >
//     <TileLayer
//       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       attribution='&copy; OpenStreetMap contributors'
//     />
//     <Marker position={[latitude, longitude]}>
//       <Popup>{property.location.address}</Popup>
//     </Marker>
//   </MapContainer>
// )}
//             </div>
//           </div>
  
//           {/* Owner Information */}
//           {property.user_id && (
//             <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//               <h3 className="text-xl font-bold mb-2">Property Owner</h3>
//               <div className="flex items-center gap-4">
//                 <img
//                   src={property.user_id.avatar || '/default-avatar.png'}
//                   className="w-12 h-12 rounded-full"
//                   alt="Owner"
//                 />
//                 <div>
//                   <p className="font-semibold">{property.user_id.name}</p>
//                   <p className="text-gray-600">{property.user_id.email}</p>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     );
// };

// export default PropertyDetailsModal;




// import React, { useContext, useState,useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import { FaBath, FaBed, FaDollarSign, FaMapMarkerAlt, FaTimes, FaStar } from 'react-icons/fa';
// import { useParams, useNavigate } from 'react-router-dom';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import axios from 'axios';
// import { AuthContext } from '../context/AuthContext';
// import '../styles/RealEstateSearch.css';

// // Fix leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const PropertyDetailsModal = ({ onClose }) => {
//   const [mainImage, setMainImage] = useState('');
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [property, setProperty] = useState(null);
//   const {id}=useParams();
//   useEffect(() => {
//     const fetchProperty = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5001/api/properties/${id}`);
//         setProperty(response.data);
//         setMainImage(response.data.images[0] || '');
//       } catch (error) {
//         console.error('Error fetching property:', error);
//         navigate('/'); // Redirect if property not found
//       }
//     };

//     fetchProperty();
//   }, [id, navigate]);

//   const handleSaveListing = async () => {
//     try {
//       await axios.post('localhost:5001/api/properties/save-listing', 
//         { listingId: property._id },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );
//       alert('Added to favorites!');
//     } catch (error) {
//       console.error('Error saving listing:', error);
//     }
//   };

//   if (!property) return null;

//   const isValidCoordinates = 
//     !isNaN(property.location?.latitude) && 
//     !isNaN(property.location?.longitude) &&
//     Math.abs(property.location.latitude) <= 90 &&
//     Math.abs(property.location.longitude) <= 180;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
//       <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-2xl font-bold">{property.title}</h2>
//           <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//             <FaTimes size={24} />
//           </button>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
//           {/* Image Gallery */}
//           <div className="space-y-4">
//             <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
//               <img 
//                 src={mainImage} 
//                 alt="Main property" 
//                 className="w-full h-full object-cover"
//               />
//             </div>
            
//             <div className="grid grid-cols-4 gap-2">
//               {property.images.map((img, index) => (
//                 <button 
//                   key={index}
//                   onClick={() => setMainImage(img)}
//                   className={`aspect-square rounded overflow-hidden border-2 ${
//                     mainImage === img ? 'border-blue-500' : 'border-transparent'
//                   }`}
//                 >
//                   <img 
//                     src={img} 
//                     alt={`Thumbnail ${index + 1}`} 
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Property Details */}
//           <div className="space-y-6">
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <div className="text-3xl font-bold text-blue-600 mb-4">
//                 ${property.price.toLocaleString()}
//               </div>
              
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2">
//                   <FaMapMarkerAlt className="text-gray-600" />
//                   <span>{property.location.address}</span>
//                 </div>
                
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-1">
//                     <FaBed className="text-gray-600" />
//                     <span>{property.bedrooms} beds</span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <FaBath className="text-gray-600" />
//                     <span>{property.bathrooms} baths</span>
//                   </div>
//                 </div>
//               </div>

//               <button 
//                 onClick={handleSaveListing}
//                 className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold transition-colors"
//               >
//                 Save to Favorites
//               </button>
//             </div>

//             <div className="space-y-4">
//               <h3 className="text-xl font-semibold">Property Features</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="flex items-center gap-2">
//                   <FaStar className="text-blue-500" />
//                   <span>Type: {property.property_type}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <FaStar className="text-blue-500" />
//                   <span>Square Feet: {property.area}</span>
//                 </div>
//                 {/* Add more features as needed */}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Map Section */}
//         {isValidCoordinates && (
//           <div className="p-6 border-t">
//             <h3 className="text-xl font-semibold mb-4">Location</h3>
//             <div className="h-96 rounded-lg overflow-hidden">
//               <MapContainer
//                 center={[property.location.latitude, property.location.longitude]}
//                 zoom={13}
//                 style={{ height: '100%', width: '100%' }}
//               >
//                 <TileLayer
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   attribution='&copy; OpenStreetMap contributors'
//                 />
//                 <Marker position={[property.location.latitude, property.location.longitude]}>
//                   <Popup>{property.location.address}</Popup>
//                 </Marker>
//               </MapContainer>
//             </div>
//           </div>
//         )}

//         {/* Reviews Section */}
//         <div className="p-6 border-t">
//           <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>
          
//           <div className="space-y-6">
//             {property.reviews?.length > 0 ? (
//               property.reviews.map((review, index) => (
//                 <div key={index} className="border rounded-lg p-4">
//                   <div className="flex items-center gap-3 mb-3">
//                     <img 
//                       src={review.user_id?.avatar || '/default-avatar.png'} 
//                       className="w-10 h-10 rounded-full" 
//                       alt="User avatar"
//                     />
//                     <div>
//                       <p className="font-semibold">{review.user_id?.name}</p>
//                       <div className="flex items-center gap-1 text-yellow-400">
//                         {[...Array(5)].map((_, i) => (
//                           <FaStar key={i} className={i < property.rating ? 'fill-current' : 'fill-gray-300'} />
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                   <p className="text-gray-600">{property.review}</p>
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500">No reviews yet</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PropertyDetailsModal;









import React, { useContext, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaBath, FaBed, FaDollarSign, FaMapMarkerAlt, FaTimes, FaStar } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/RealEstateSearch.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const PropertyDetailsModal = ({ onClose, property }) => {
  const [mainImage, setMainImage] = useState(property?.images?.[0] || ''); // Use the property prop directly
  const { user } = useContext(AuthContext);
  const [owner, setOwner] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/find/${property.user_id}`);
        setOwner(response.data);
      } catch (error) {
        console.error('Error fetching owner:', error);
      }
    };

    fetchOwner();
  }, [property]);
  const handleSaveListing = async () => {
    try {
      await axios.post(
        'http://localhost:5001/api/properties/save-listing', // Fix: Add protocol (http://)
        { listingId: property._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Added to favorites!');
    } catch (error) {
      console.error('Error saving listing:', error);
    }
  };

  const isValidCoordinates =
    !isNaN(property.location?.latitude) &&
    !isNaN(property.location?.longitude) &&
    Math.abs(property.location.latitude) <= 90 &&
    Math.abs(property.location.longitude) <= 180;

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/users/find/${property.user_id}`);
        setOwner(response.data);
      } catch (error) {
        console.error('Error fetching owner:', error);
      }
    };

    if (property) {
      fetchOwner();
    }
  }, [property]);

  if (!property) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold">{property.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={mainImage}
                alt="Main property"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {property?.images?.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setMainImage(img)}
                  className={`aspect-square rounded overflow-hidden border-2 ${
                    mainImage === img ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ${property.price.toLocaleString()}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-600" />
                  <span>{property.location.address}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <FaBed className="text-gray-600" />
                    <span>{property.bedrooms} beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBath className="text-gray-600" />
                    <span>{property.bathrooms} baths</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSaveListing}
                className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-lg font-semibold transition-colors"
              >
                Save to Favorites
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Property Features</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <FaStar className="text-blue-500" />
                  <span>Type: {property.property_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaStar className="text-blue-500" />
                  <span>Square Feet: {property.sqfeet}</span>
                </div>
                {/* Add more features as needed */}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {isValidCoordinates && (
          <div className="p-6 border-t">
            <h3 className="text-xl font-semibold mb-4">Location</h3>
            <div className="h-96 rounded-lg overflow-hidden">
              <MapContainer
                center={[property.location.latitude, property.location.longitude]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
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
          </div>
        )}

        {/* Reviews Section */}
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold mb-6">Customer Reviews</h3>

          <div className="space-y-6">
            {property.reviews?.length > 0 ? (
              property.reviews.map((review, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review.user_id?.avatar || '/default-avatar.png'}
                      className="w-10 h-10 rounded-full"
                      alt="User avatar"
                    />
                    <div>
                      <p className="font-semibold">{review.user_id?.name}</p>
                      <div className="flex items-center gap-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < property.rating ? 'fill-current' : 'fill-gray-300'} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.review}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;