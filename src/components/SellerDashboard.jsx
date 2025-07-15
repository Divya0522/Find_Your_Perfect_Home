
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import ListingForm from "../components/ListingForm";
import ListingList from "../components/ListingList";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";
import "../styles/RealEstateSearch.css";
import PropertyDetailsModal from "./PropertyDetailsModal";
import ChatModal from "./ChatModal";
import Profile from './Profile';
import axios from "axios";

const SellerDashboard = () => {
  const { user, logoutUser  } = useContext(AuthContext);
  const { notifications, currentChat } = useContext(ChatContext);
  const [listings, setListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedUser,setSelectedUser]=useState(null);
  const navigate = useNavigate();
  const handleMessagesClick = () => {
    navigate('/chat');
  }

  const handleNewPost = () => {
    setShowForm(true);
    setEditingListing(null);
  };
  const handleContactOwner = (ownerId) => {
    setSelectedUser(ownerId);
    setShowChat(true);
  }
  
  const fetchMyListings = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/properties/my-listings", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

 


  useEffect(() => {
    let isMounted = true; // Track if the component is still mounted
  
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/properties/my-listings", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
  
        if (isMounted) {
          setListings(response.data);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };
  
    if (user) {
      fetchData();
    }
  
    return () => {
      isMounted = false; // Cleanup to prevent state updates on unmounted component
    };
  }, [user]);

const handleListingSubmit = async () => {
  // Only update UI state
  await fetchMyListings(); // Refresh listings
  setShowForm(false);
  setEditingListing(null);
};
  const handleEditListing = (listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleViewDetails = (listing) => {
    navigate(`/properties/${listing._id}`);
    setSelectedProperty(listing); // Set the selected property for viewing details
  };

  const handleSavedListings = () => {
    navigate('/liked-properties'); // Navigate to the liked properties page
  };

  const handleSaveListing = async (listing) => {
    try {
      const response = await axios.post(
        'http://localhost:5001/api/properties/save-listing',
        { listingId: listing._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
  
      if (response.status === 200) {
        alert('Listing saved!');
        // Update the state to reflect the saved status
        setListings(prevListings =>
          prevListings.map(l =>
            l._id === listing._id ? { ...l, saved: true } : l
          )
        );
      }
    } catch (error) {
      console.error('Error saving listing:', error);
      alert(error.response?.data?.message || 'Error saving listing');
    }
  };
  const handleLogout = () => {
    logoutUser ();
    navigate("/signin");
  };

  const handleDeleteListing = async (listingId) => {
    try {
      await axios.delete(`http://localhost:5001/api/properties/${listingId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setListings(prev => prev.filter(listing => listing._id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert(`Error: ${error.response?.data?.message || "Failed to delete listing"}`);
    }
  };

  return (
    <div className="search-container">
      <h2>Your Listings</h2>
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
              src={user?.avatar?.includes('http')
                ? user.avatar
                : `http://localhost:5001/${user?.avatar}`}
              alt="Avatar"
              className="profile-avatar"
            />
            {showProfileForm && (
              <div className="profile-modal">
                <div className="profile-modal-content">
                  <Profile onClose={() => setShowProfileForm(false)} />
                </div>
              </div>
            )}
            <div className="profile-info">
              <p className="profile-name">{user?.name || "No Name Available"}</p>
              <p className="profile-email">{user?.email || "No Email Available"}</p>
            </div>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Messaging Button */}
        {/* <div className="messaging-section">
          <button className="message-icon" onClick={() => setShowChat(!showChat)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
              <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
            </svg>
            <span>Messages</span>
          </button>
        </div> */}

        {/* In the messaging section */}
<div className="messaging-section">
  <button 
    className="message-icon" 
    onClick={handleMessagesClick}
    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
      <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
    </svg>
    <span>Messages</span>
    {notifications.length > 0 && (
      <span className="notification-badge">
        {notifications.filter(n => !n.isRead).length}
      </span>
    )}
  </button>
</div>
      </div>

      {/* Body Section */}
      <div className="seller-body">
        {/* Header for Listings and New Post Button */}
        <div className="listings-header">
          <h2 className="listings-title">Your Listings</h2>
          <div className="actions">
            <button className="new-post-button" onClick={handleNewPost}>
              + New Post
            </button>
            <button className="saved-listings-button" onClick={handleSavedListings}>
              Saved Listings
            </button>
          </div>
        </div>
        <ListingList 
          listings={listings} 
          onEdit={handleEditListing} 
          onSave={handleSaveListing} 
          onDelete={handleDeleteListing} 
          onViewDetails={handleViewDetails} 
        />
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ListingForm 
              onSubmit={handleListingSubmit}
              onClose={() => {
                setShowForm(false);
                setEditingListing(null);
              }}
              initialData={editingListing}
            />
          </div>
        </div>
      )}
     {/* {showChat && (
        <div className="chat-interface">
          <PotentialChats />
          <ChatBox currentChat={currentChat} />
        </div>
      )} */}

{showChat && (
    <div className="chat-modal-overlay">
      <ChatModal onClose={() => setShowChat(false)} />
    </div>
  )}

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default SellerDashboard;