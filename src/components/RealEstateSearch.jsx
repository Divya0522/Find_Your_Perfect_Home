




import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/RealEstateSearch.css';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import ChatBox from '../components/chat/ChatBox';
import PotentialChats from '../components/chat/PotentialChats';
import Profile from './Profile';
import PropertyDetailsModal from './PropertyDetailsModal';
import ReviewModal from './ReviewModal';
import { useNavigate, useLocation } from 'react-router-dom';
import ListingActionsDropdown from './ListActionDropdown';
import MessagesDropdown from './MessagesDropDown';
import Chat from '../pages/Chat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import LoanRequestForm from './LoanRequestForm';
import MortgageCalculatorModal from './MortageCalculatorModal';


const RealEstateSearch = () => {
  const [properties, setProperties] = useState([]);
  const [savedListings, setSavedListings] = useState(new Set());
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    homeType: '', bedrooms: '', bathrooms: '', city: '', minArea: '', maxArea: '', minPrice: '', maxPrice: '', minRating:'',
  });
  const [activeTab, setActiveTab] = useState('FOR SALE');
  const [showChat, setShowChat] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPropertyForReview, setSelectedPropertyForReview] = useState(null);
  const { user, logoutUser } = useContext(AuthContext);
  const [ notifications, setNotifications ] = useState([]);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showMortgageCalculatorModal, setShowMortgageCalculatorModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications,setShowNotifications]=useState(false);
  useEffect(() => {
    fetchProperties();
  }, [activeTab]);


  
  useEffect(() => {
    if (user) {
      
      fetchSavedListings();
    }
  }, [user]);


  const handleMortgageCalculator = () => {
    setShowMortgageCalculatorModal(true); // Open the mortgage calculator modal
  };

  const handleCloseMortgageCalculatorModal = () => {
    setShowMortgageCalculatorModal(false); // Close the mortgage calculator modal
  };
  const fetchPropertiesByRating = async (minRating) => {
    try {
      const response = await axios.get(
        `https://find-your-perfect-home-backend.onrender.com/api/properties/filter-by-rating?minRating=${minRating}`
      );
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties by rating:", error);
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    fetchProperties(); // Fetch properties when the tab changes
  };
  const handleRatingFilter = (e) => {
    const { value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      minRating: value || '', // Ensure value is always defined
    }));
  
    if (value) {
      fetchPropertiesByRating(value);
    } else {
      fetchProperties(); // Fetch all properties if no rating is specified
    }
  };

  const fetchSavedListings = async () => {
    try {
      const response = await axios.get('https://find-your-perfect-home-backend.onrender.com/api/properties/save-listings', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      console.log('Saved listings:', response.data);
      setSavedListings(new Set(response.data.map(listing => listing._id))); // Update the saved listings state
    } catch (error) {
      console.error('Error fetching saved listings:', error);
    }
  };
  
  // Call this function when needed, e.g., on component mount
  useEffect(() => {
    if (user) {
      fetchSavedListings();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        property_type: activeTab === 'FOR SALE' ? 'Sale' : 'Rent', // Add property_type filter
      }).toString();
      const response = await axios.get(`https://find-your-perfect-home-backend.onrender.com/api/properties?${queryParams}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams({...filters,property_type: activeTab === 'FOR SALE' ? 'Sale' : 'Rent'}).toString();
      const response = await axios.get(`https://find-your-perfect-home-backend.onrender.com/api/properties?${queryParams}`);
      setProperties(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleViewDetails = (property) => {
    navigate(`/properties/${property._id}`);
  };

  const handleAddReview = (property) => {
    setSelectedPropertyForReview(property);
    setShowReviewModal(true);
  };

  const handleMessagesClick = () => {
    navigate('/chat');
    setShowChat(true);
  };
  const handleLoanForm = () => {
    setShowLoanModal(true); // Open the loan modal
  };

  const handleCloseLoanModal = () => {
    setShowLoanModal(false); // Close the loan modal
  };
  const handleSavedListingsClick = () => {
    navigate('/liked-properties');
  };

  const handleBlockedUsersClick = () => {
    navigate('/blocked-users');
  };
  const handleBlockUser = (userId) => {
    console.log("Blocking user with ID:", userId);
    // You can add additional logic here if needed
  };
  const handleSaveListing = async (listingId) => {
    try {
      console.log('Saving listing with ID:', listingId);
      const response = await axios.post(
        'https://find-your-perfect-home-backend.onrender.com/api/properties/save-listing',
        { listingId }, // Ensure this matches the backend's expected request body
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSavedListings(prev => new Set(prev).add(listingId));
     alert('Listing Saved!');
    } catch (error) {
      console.error('Error saving listing:', error);
      console.error('Error response data:', error.response?.data); // Log the error response
      alert(error.response?.data?.message || 'Failed to save listing');
    }
  };
  const handleUnsaveListing = async (listingId) => {
    try {
      console.log('Unsaving listing with ID:', listingId);
      await axios.post(
        'https://find-your-perfect-home-backend.onrender.com/api/properties/unsave-listing',
        { listingId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSavedListings(prev => {
        const newSavedListings = new Set(prev);
        newSavedListings.delete(listingId); // Remove from saved listings
        return newSavedListings;
      });
      alert('Listing unsaved!');
      fetchProperties(); // Refresh the properties list
    } catch (error) {
      console.error('Error unsaving listing:', error);
    }
  };
  // useEffect(() => {
  //   const handleClickOutside = () => {
  //     if (showNotifications) {
  //       setShowNotifications(false);
  //     }
  //   };
    
  //   document.addEventListener('click', handleClickOutside);
  //   return () => document.removeEventListener('click', handleClickOutside);
  // }, [showNotifications]);
  return (
    <div className="search-container">
      {/* Header Section */}
      <div className="header1">
        <div className="profile-section">
          <div className="profile-header">
            <h2>User Information</h2>
            <button className="update-profile-button" onClick={() => setShowProfileForm(true)}>
              Update Profile
            </button>
          </div>
          <div className="profile-details">
            <img
              src={user?.avatar?.startsWith('http') ? user.avatar : `https://find-your-perfect-home-backend.onrender.com/${user?.avatar}`}
              alt="Avatar"
              className="profile-avatar"
            />
            <div className="profile-info">
              <p className="profile-name">{user?.name || 'No Name Available'}</p>
              <p className="profile-email">{user?.email || 'No Email Available'}</p>
            </div>
          </div>
          <button className="logout-button" onClick={logoutUser}>
            Logout
          </button>
        </div>
        <div className="messaging-section">

        <div className="notification-container">
  <div 
    className="notification-icon"
    onClick={(e) => {
      e.stopPropagation();
      setShowNotifications(!showNotifications);
    }}
  >
    <FontAwesomeIcon icon={faBell} />
    {unreadCount > 0 && (
      <span className="notification-counter">{unreadCount}</span>
    )}
  </div>

  {showNotifications && (
    <div className="notification-dropdown">
      <div className="notification-header">
        <h4>Notifications</h4>
        <button 
          className="close-notifications"
          onClick={() => setShowNotifications(false)}
        >
          ×
        </button>
      </div>
      
      <div className="notification-list">
      {notifications.length > 0 ? (
  notifications.map(notification => (
    <div 
      key={notification._id}
      className={`notification-item ${notification.read ? '' : 'unread'}`}
      onClick={() => {
        // markNotificationAsRead(notification._id);
        navigate(`/properties/${notification.propertyId._id}`);
        setShowNotifications(false);
      }}
    >
      <div className="notification-message">
        <p>{notification.message}</p>
        {notification.propertyId && (
          <div className="property-preview">
            <img 
              src={notification.propertyId.images?.[0] || '/placeholder.jpg'} 
              alt="Property" 
              className="preview-image"
            />
            <span>{notification.propertyId.title}</span>
          </div>
        )}
      </div>
      <small>
        {new Date(notification.createdAt).toLocaleString()}
      </small>
    </div>
  ))
) : (
  <div className="no-notifications">
    No notifications yet
  </div>
)}
      </div>
    </div>
  )}
</div>
      
          <MessagesDropdown
            onMessagesClick={handleMessagesClick}
            onSavedListingsClick={handleSavedListingsClick}
            onBlockedUsersClick={handleBlockedUsersClick}
          />
        </div>
      </div>

      {/* Profile Update Form (Modal) */}
      {showProfileForm && (
        <div className="profile-modal">
          <div className="profile-modal-content">
            <Profile />
            <button className="close-modal" onClick={() => setShowProfileForm(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Tabs and Search Box */}
      <div className="tabs">
        {['FOR SALE', 'FOR RENT'].map((tab) => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="search-box">
        <div className="search-row">
          <div className="search-item">
            <label>PROPERTY TYPE</label>
            <select name="homeType" value={filters.homeType} onChange={handleInputChange}>
              <option value="">Select</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
          <div className="search-item">
            <label>BEDROOMS</label>
            <input type="number" name="bedrooms" placeholder="Bedrooms" value={filters.bedrooms} onChange={handleInputChange} />
          </div>
          <div className="search-item">
            <label>BATHROOMS</label>
            <input type="number" name="bathrooms" placeholder="Bathrooms" value={filters.bathrooms} onChange={handleInputChange} />
          </div>
        </div>
        <div className="search-row">
          <div className="search-item">
            <label>CITY</label>
            <input type="text" name="city" placeholder="City" value={filters.city} onChange={handleInputChange} />
          </div>
          <div className="search-item">
            <label>MIN AREA (sqft)</label>
            <input type="number" name="minArea" placeholder="Min Area" value={filters.minArea} onChange={handleInputChange} />
          </div>
          <div className="search-item">
            <label>MAX AREA (sqft)</label>
            <input type="number" name="maxArea" placeholder="Max Area" value={filters.maxArea} onChange={handleInputChange} />
          </div>
        </div>
        <div className="search-row">
          <div className="search-item">
            <label>MIN PRICE (₹)</label>
            <input type="number" name="minPrice" placeholder="Min Price" value={filters.minPrice} onChange={handleInputChange} />
          </div>
          <div className="search-item">
            <label>MAX PRICE (₹)</label>
            <input type="number" name="maxPrice" placeholder="Max Price" value={filters.maxPrice} onChange={handleInputChange} />
          </div>
          <div className="search-item">
          <label>MINIMUM RATING</label>
            <input
              type="number"
              name="minRating"
              placeholder="Min Rating (1-5)"
              value={filters.minRating || ''}
              onChange={handleRatingFilter}
              min="1"
              max="5"
              step="0.1"
            />
          </div>
        </div>
        <div className="search-row">
          <button className="search" onClick={handleSearch}>Search</button>
          <div className="action-buttons">
      <button className="contact-loan-button" onClick={handleLoanForm}>
        Contact for Loan
      </button>
      <button className="mortgage-calculator-button" onClick={handleMortgageCalculator}>
        Mortgage Calculator
      </button>
    </div>
        </div>
      </div>

      {/* Property Results */}
      <div className="results">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="property-card">
              <div className="property-card-header">
                <ListingActionsDropdown
                   listing={{ ...property, saved: savedListings.has(property._id) }}
                  onSave={handleSaveListing}
                  onUnsave={handleUnsaveListing}
                  onBlock={handleBlockUser}
                  onReport={(listingId) => console.log('Report listing:', listingId)}
                  onReview={(listing) => console.log('Review listing:', listing)}
                  reportedUserEmail={property.user_id?.email} 
                />
              </div>
              <img
                src={property.images.length > 0 ? property.images[0] : "/placeholder.jpg"}
                alt={property.title}
                className="property-image"
              />
              <div className="property-info">
                <h2>{property.title}</h2>
                <p>{property.description}</p>
                <p><strong>Bedrooms:</strong> {property.bedrooms} | <strong>Bathrooms:</strong> {property.bathrooms}</p>
                <p><strong>City:</strong> {property.location.address}</p>
                <p><strong>Area:</strong> {property.location?.area?.toLocaleString()} sqft</p>
                <p><strong>Price:</strong> ₹{property.price.toLocaleString()}</p>
                <p><strong>Rating:</strong> {property.rating.average_rating} ({property.rating.total_reviews} reviews)</p>
                <button className="view-details-button" onClick={() => handleViewDetails(property)}>
                  View Details
                </button>
                <button className="add-review-button" onClick={() => handleAddReview(property)}>
                  Add Review
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No properties found</p>
        )}
      </div>

      {/* Chat Interface */}
      {showChat && (
         <div className="chat-modal">
         <div className="chat-modal-content">
           <Chat />
           <button onClick={() => setShowChat(false)}>Close</button>
         </div>
       </div>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          property={selectedPropertyForReview}
          onClose={() => setShowReviewModal(false)}
          onSubmit={(reviewData) => {
            console.log("Review Data:", reviewData);
            // Call API to submit review
            setShowReviewModal(false);
          }}
        />
      )}
      {showLoanModal && (
        <LoanRequestForm onClose={handleCloseLoanModal} />
      )}
      {showMortgageCalculatorModal && (
        <MortgageCalculatorModal onClose={handleCloseMortgageCalculatorModal} />
      )}
    </div>
  );
};

export default RealEstateSearch;