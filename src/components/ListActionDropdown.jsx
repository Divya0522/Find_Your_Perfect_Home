
import '../styles/ListActionDropdown.css';
import React, { useState } from "react";
import "../styles/ListActionDropdown.css";
import axios from 'axios';

const ListingActionsDropdown = ({ listing, onSave, onUnsave, onBlock, onReport, onReview }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [otherReason, setOtherReason] = useState(""); // New state for "Other" reason
  const [error, setError] = useState("");

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleReportClick = () => {
    setShowReportForm(true);
    setShowMenu(false);
  };

  const handleBlockUser = async (userId) => {
    console.log("Blocking user with ID:", userId); // Debugging log
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      // Ensure userId is a string and not an object
      const userIdString = userId._id ? userId._id : userId;

      // Call the backend API to block the user
      const response = await axios.put(
        `http://localhost:5001/api/users/${userIdString}/status`,
        { status: "blocked" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("User blocked successfully!");
        onBlock(userIdString); // Notify the parent component
      } else {
        alert("Failed to block user.");
      }
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("An error occurred while blocking the user.");
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!reason) {
      setError("Please select a reason.");
      return;
    }

    // If "Other" is selected, ensure the user provides a reason
    if (reason === "other" && !otherReason.trim()) {
      setError("Please provide a reason for 'Other'.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/submit-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason === "other" ? otherReason : reason, // Use "otherReason" if "Other" is selected
          comment,
          property_id: listing._id, // Use the property ID instead of reportedUserEmail
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Report submitted successfully!");
        setShowReportForm(false);
        setReason(""); // Reset form fields
        setComment("");
        setOtherReason("");
      } else {
        setError(data.error || "An error occurred. Please try again.");
      }
    } catch (error) {
      setError("Failed to submit the report. Please check your connection.");
    }
  };

  return (
    <div className="property-menu">
      {/* Toggle Button */}
      <button className="menu-toggler" onClick={toggleMenu}>
        ☰
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div className="dropdown-menu">
          <button onClick={() => listing.saved ? onUnsave(listing._id) : onSave(listing._id)}>
            {listing.saved ? 'Unsave' : 'Save'} Listing
          </button>

          {/* Block Listing */}
          <button onClick={() => handleBlockUser(listing.user_id)}>
            Block User
          </button>
          {/* Report Listing */}
          <button onClick={handleReportClick}>
            Report Listing
          </button>
        </div>
      )}

      {/* Report Form Modal */}
      {showReportForm && (
        <div className="report-form-modal">
          <h2>Report Inappropriate or Violation</h2>
          <p>Please fill out the form below to report any violations.</p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleReportSubmit}>
            <div className="form-group">
              <label htmlFor="reason">Reason</label>
              <select
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              >
                <option value="">Select</option>
                <option value="inappropriate_comment">Inappropriate comment or violent threats</option>
                <option value="harassment">Harassment or cyberbullying</option>
                <option value="spam">Spam or misleading content</option>
                <option value="scam">Scam or impersonation to scam</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Show additional input for "Other" reason */}
            {reason === "other" && (
              <div className="form-group">
                <label htmlFor="otherReason">Please specify the reason</label>
                <input
                  type="text"
                  id="otherReason"
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Enter your reason"
                  required
                />
              </div>
            )}

            {/* Always show the comment field */}
            <div className="form-group">
              <label htmlFor="comment">Additional Details</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please provide additional details"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-button">
                Submit
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowReportForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ListingActionsDropdown;