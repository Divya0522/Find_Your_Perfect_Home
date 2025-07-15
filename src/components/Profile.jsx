
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa'; // Import close icon
import '../styles/RealEstateSearch.css';

const Profile = ({ onClose }) => {
  const { user, setUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', username);
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (avatar) formData.append('avatar', avatar);

    try {
      const response = await axios.put(
        `http://localhost:5001/api/users/find/${user._id}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (setUser) {
        setUser(response.data);
      }

      alert('Profile updated successfully!');
      setEditMode(false);
      onClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-container">
      {/* Close button added here */}
      <button className="close-modal" onClick={onClose}>
        Close
      </button>

      <h2>{user?.role === 'sell' ? 'Owner Profile' : 'User Profile'}</h2>
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
            />
          </div>
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="profile-details">
            <img
              src={user?.avatar?.includes('http') 
                ? user.avatar 
                : `http://localhost:5001/${user?.avatar}`||'./assets/avatar.svg'}
              alt="Avatar"
              className="profile-avatar"
            />
            <p className="profile-username">{user?.name}</p>
            <p className="profile-email">{user?.email}</p>
          </div>
          <button className="edit-profile-button" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;