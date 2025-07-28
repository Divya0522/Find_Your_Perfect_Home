
import React, { useState } from 'react';
import axios from 'axios'; // Ensure axios is imported
import '../styles/ReviewModal.css'; // Ensure you have the correct CSS file

const ReviewModal = ({ property, onClose, onSubmit }) => {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

 const handleSubmit = async () => {
  const token = localStorage.getItem('token');
 
  
  if (!token) {
    console.error('No token found. Please log in.');
    alert('Please log in to submit a review');
    return;
  }

  try {
    const response = await axios.post(
      `https://find-your-perfect-home-backend.onrender.com/api/properties/${property._id}/reviews`,
      { review, rating },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, 
      }
    );

    onSubmit({ review, rating });
    onClose();
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    
    if (error.response?.status === 401) {
      alert('Session expired. Please log in again.');
      localStorage.removeItem('token');
    } else {
      alert('Failed to submit review. Please try again.');
    }
  }
};
  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <button className="close-modal-button" onClick={onClose}>
          &times;
        </button>
        <h2 className="modal-title">Add a Review</h2>
        <textarea
          className="review-textarea"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows="5" // Set the number of rows for the textarea
          style={{ resize: 'none' }} // Prevent resizing if desired
        />
        <input
          type="number"
          min="1"
          max="5"
          className="rating-input"
          placeholder="Rating (1-5)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />
        <button className="submit-review-button" onClick={handleSubmit}>
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;