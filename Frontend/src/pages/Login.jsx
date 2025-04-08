import React from "react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // Importing the CSS file

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
      const response = await axios.post(
        "http://localhost:3000/login",
        formData,
        { withCredentials: true }
      );
      if (response.data.username) {
        navigate(`/profile/${response.data.username}`);
      }
    } catch (err) {
      setError(err.response?.data || "Invalid email or password");
    }
  };

  return (
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
        <div className="register-link-container">
          Don't have an account?{" "}
          <Link to="/" className="register-link">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;