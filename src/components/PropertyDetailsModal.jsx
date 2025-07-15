

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