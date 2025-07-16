import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !email.includes('@')) {
    setMessage('Please enter a valid email address.');
    return;
  }

  setIsLoading(true);
  setMessage('');

  try {
    const response = await fetch('https://find-your-perfect-home-backend.onrender.com/api/forgot-password', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
      credentials: 'include' // If using cookies
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send reset email');
    }

    setMessage(data.message || 'Reset email sent. Please check your inbox.');
  } catch (error) {
    console.error('Full error:', error);
    setMessage(error.message || 'An error occurred. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="forgot-password-button"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Submit'}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <button className="forgot-back-button" onClick={() => navigate('/')}>
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;