import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/ResetPassword.css'; // Import the CSS file

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('Invalid reset token');
      return;
    }
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setMessage('Password must contain at least 8 characters, one uppercase, one lowercase, and one number');
      return;
    }
    try {
      const response = await fetch(`https://find-your-perfect-home-backend.onrender.com/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
  
      const result = await response.json();
      setMessage(result.message);
      setTimeout(() => navigate('/'), 2000); // Redirect to sign-in after 2 seconds
    } catch (error) {
      console.error('Error:', error.message);
      setMessage(`Error: ${error.message}`);
    }
  };
  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="reset-password-button">
            Reset Password
          </button>
        </form>
        {message && <p className="reset-password-message">{message}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;