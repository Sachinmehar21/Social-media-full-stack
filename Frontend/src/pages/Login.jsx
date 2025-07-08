import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api, { API_URL } from '../api';
import "../styles/Login.css"; // Importing the CSS file
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(`/login`, formData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.username) {
        navigate(`/profile/${response.data.username}`);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError(err.response?.data || "Invalid email or password");
      }
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('auth/google', {
        token: credentialResponse.credential,
      });
      // Save JWT to localStorage or context
      localStorage.setItem('jwt', res.data.token);
      // Redirect or update UI as needed
      window.location.href = '/';
    } catch (err) {
      alert('Google login failed.');
    }
  };

  const handleGoogleError = () => {
    alert('Google login was unsuccessful.');
  };

  return (
    <GoogleOAuthProvider clientId="205780044927-usa3mt7u7i8h5jh5kv4dfaengocpomfi.apps.googleusercontent.com">
      <div className="login-container">
        <div className="login-content">
          <img 
            className="logo" 
            src="https://res.cloudinary.com/dyvfgglux/image/upload/v1743708868/logo_m1jyai.png" 
            alt="Logo" 
          />
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              className="form-input"
              type="text"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            {error && <p className="error-message">*{error}</p>}
            <button type="submit" className="submit-button">Login</button>
          </form>
          <div style={{ marginTop: 20 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
          <div className="register-link-container">
            Don't have an account?{" "}
            <Link to="/" className="register-link">Register</Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;