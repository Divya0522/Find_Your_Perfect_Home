


import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { getRequest, baseUrl } from '../utils/services';
import '../styles/SignInSignUp.css';

const SignUpSignInAuth = () => {
  const [activeForm, setActiveForm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, registerUser, user } = useContext(AuthContext);
  const { setUserChats, setPotentialChats } = useContext(ChatContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  useEffect(() => {
    if (isLoggedIn && user?.role) {
      if (user.role === 'buy/rent') {
        navigate('/search');
      } else if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'sell') {
        navigate('/seller-dashboard');
      }
    }
  }, [isLoggedIn, user, navigate]);

  const handleInputChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    setActiveForm(location.pathname === '/signup' ? 'signup' : 'signin');
  }, [location]);

  const handleFormSubmit = async (e, formType) => {
    e.preventDefault();
    console.log("Form submitted:", formType);

    if (!formData.email?.trim() || !formData.password?.trim()) {
      alert("Email and password are required.");
      return;
    }

    try {
      if (formType === "signin") {
        const email = formData.email.trim();
        const password = formData.password.trim();

        const response = await loginUser(email, password, setUserChats, setPotentialChats);

        if (response.error && response.message === "Your account has been suspended. Please contact support.") {
          alert(response.message);
          return;
        }

        if (response.error) {
          console.error("Login failed:", response.message);
          alert(response.message);
          return;
        }

        setIsLoggedIn(true);
      } else if (formType === "signup") {
        const { name, email, password, confirmPassword, role } = formData;

        if (password !== confirmPassword) {
          alert("Passwords do not match!");
          return;
        }

        console.log("Attempting to register user:", { name, email, role });

        const response = await registerUser({ name, email, password, confirmPassword, role });
        console.log("Registration response:", response);

        if (response?.error) {
          alert(response.message); // Show error message if registration fails
          return;
        }

        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="mainc">
      <div className="signup-container">
        <div className="form-container">
          {activeForm === 'signin' && (
            <form id="signin-form" onSubmit={(e) => handleFormSubmit(e, 'signin')}>
              <input name="email" type="email" placeholder="EMAIL" className="input-field" required value={formData.email} onChange={handleInputChange} />
              <input name="password" type="password" placeholder="PASSWORD" className="input-field" required value={formData.password} onChange={handleInputChange} />
              <button type="submit" className="form-buttons1">SIGN IN</button>
              <div className="forgot-password" onClick={() => navigate('/forgot-password')}>
                Forgot Password?
              </div>
              <div className="toggle-form">
                Don't have an account?{' '}
                <span onClick={() => setActiveForm('signup')} className="toggle-link">
                  Sign up here
                </span>
              </div>
            </form>
          )}

          {activeForm === 'signup' && (
            <form id="signup-form" onSubmit={(e) => handleFormSubmit(e, 'signup')}>
              <input name="name" type="text" placeholder="FULL NAME" className="input-field" required value={formData.name} onChange={handleInputChange} />
              <input name="email" type="email" placeholder="EMAIL" className="input-field" required value={formData.email} onChange={handleInputChange} />
              <input name="password" type="password" placeholder="PASSWORD" className="input-field" required value={formData.password} onChange={handleInputChange} />
              <input name="confirmPassword" type="password" placeholder="CONFIRM PASSWORD" className="input-field" required value={formData.confirmPassword} onChange={handleInputChange} />
              <select name="role" className="input-field" required value={formData.role} onChange={handleInputChange}>
                <option value="" disabled>Select Role</option>
                <option value="buy/rent">Buy/Rent</option>
                <option value="sell">Sell</option>
              </select>
              <button type="submit" className="form-buttons1">Sign Up</button>
              <div className="toggle-form">
                Already have an account?{' '}
                <span onClick={() => setActiveForm('signin')} className="toggle-link">
                  Login here
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpSignInAuth;