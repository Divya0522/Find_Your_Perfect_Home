import React, { useState } from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="contact-us-container">
      <div className="contact-info">
        <h2>Contact Us</h2>
        <p>Have a question? We'd love to hear from you. Please fill out the form below or contact us directly.</p>

        <div className="contact-details">
          <div className="detail">
            <h3>Address</h3>
            <p>5-107 Real Estate Street, Suite 456, Guntur, AndhraPradesh</p>
          </div>
          <div className="detail">
            <h3>Phone</h3>
            <p>+91 234 567 890</p>
          </div>
          <div className="detail">
            <h3>Email</h3>
            <p>contact@realestate.com</p>
          </div>
        </div>

        <div className="map">
  <h3>Visit Us</h3>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.632702459072!2d80.65385031533143!3d16.497752292322647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a45b5c6a4f1c8ef%3A0xa25fc0f101674c7f!2sVVIT%20Numburu!5e0!3m2!1sen!2sin!4v1674930744734!5m2!1sen!2sin"
    width="100%"
    height="300"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>

      </div>

      <div className="contact-form">
        <h3>Send us a Message</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Your Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Your Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>

      <div className="faq-section">
        <h3>Frequently Asked Questions</h3>
        <div className="faq-item">
          <h4>How can I schedule a property viewing?</h4>
          <p>Contact us via email or phone, and our team will arrange a suitable time for your viewing.</p>
        </div>
        <div className="faq-item">
          <h4>Do you offer virtual tours?</h4>
          <p>Yes, we offer virtual tours for most properties. Let us know your preference when you contact us.</p>
        </div>
        <div className="faq-item">
          <h4>Can I get property recommendations?</h4>
          <p>Yes! Our team can suggest properties based on your needs. Just let us know your preferences.</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
