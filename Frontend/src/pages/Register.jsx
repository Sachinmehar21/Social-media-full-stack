import React from "react";
import { useState } from "react";
import api, { API_URL } from '../api';
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

const Register = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password } = data; // Extracting only required fields

    try {
      const response = await api.post(`/`, { username, email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data.username) {
        navigate(`/profile/${response.data.username}`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post('/auth/google', {
        token: credentialResponse.credential,
      });
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      window.location.href = '/';
    } catch (err) {
      alert('Google registration failed.');
    }
  };

  const handleGoogleError = () => {
    alert('Google registration was unsuccessful.');
  };

  return (
    <GoogleOAuthProvider clientId="205780044927-usa3mt7u7i8h5jh5kv4dfaengocpomfi.apps.googleusercontent.com">
      <div className="register-container">
        <div className="register-content">
          <img
            className="logo"
            src="https://res.cloudinary.com/dyvfgglux/image/upload/v1743708868/logo_m1jyai.png"
            alt="Logo"
          />
          <form className="register-form" onSubmit={handleSubmit}>
            <input
              className="form-input"
              type="text"
              name="username"
              placeholder="Username For your Spam account"
              onChange={handleChange}
              required
            />
            <input
              className="form-input"
              type="email"
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
            <button type="submit" className="submit-button">
              Make New Account
            </button>
          </form>
          <div style={{ marginTop: 20 }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
          <div className="login-link-container">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Log In
            </Link>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
