
import React, { useState } from "react";
import axios from "axios";
import "../styles/LoanRequestForm.css";

const LoanRequestForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    totalAmount: "",
    monthlyEMI: "",
    monthlyInterest: "",
    userEmail: "",
    propertyGuarantee: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.totalAmount &&
      formData.monthlyEMI &&
      formData.monthlyInterest &&
      formData.userEmail &&
      formData.propertyGuarantee
    ) {
      try {
        // Send the form data to the backend
        const response = await axios.post('http://localhost:5001/api/submit-loan-request', formData);

        if (response.status === 200) {
          setIsSubmitted(true);
        }
      } catch (error) {
        console.error('Error submitting loan request:', error);
        alert('Failed to submit loan request. Please try again.');
      }
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal-button" onClick={onClose}>
          X
        </button>
        <h2>Loan Request Form</h2>
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group1">
              <label htmlFor="totalAmount">Total Loan Amount (₹)</label>
              <input
                type="number"
                id="totalAmount"
                name="totalAmount"
                value={formData.totalAmount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group1">
              <label htmlFor="monthlyEMI">Monthly EMI (₹)</label>
              <input
                type="number"
                id="monthlyEMI"
                name="monthlyEMI"
                value={formData.monthlyEMI}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group1">
              <label htmlFor="monthlyInterest">Monthly Interest (%)</label>
              <input
                type="number"
                id="monthlyInterest"
                name="monthlyInterest"
                value={formData.monthlyInterest}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>
            <div className="form-group1">
              <label htmlFor="userEmail">Email Address</label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group1">
              <label>Do you have any property for loan guarantee?</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="propertyGuarantee"
                    value="yes"
                    checked={formData.propertyGuarantee === "yes"}
                    onChange={handleInputChange}
                    required
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="propertyGuarantee"
                    value="no"
                    checked={formData.propertyGuarantee === "no"}
                    onChange={handleInputChange}
                  />
                  No
                </label>
              </div>
            </div>
            <button type="submit" className="submit-button1">
              Submit
            </button>
          </form>
        ) : (
          <div className="confirmation-message">
            Thanks for submitting the form..! The bank will contact you through the mail.
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanRequestForm;