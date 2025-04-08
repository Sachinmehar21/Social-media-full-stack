import React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

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
      const response = await axios.post(
        "http://localhost:3000/",
        { username, email, password },
        { withCredentials: true }
      );

      if (response.data.username) {
        navigate(`/profile/${response.data.username}`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
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
        <div className="login-link-container">
          Already have an account?{" "}
          <Link to="/login" className="login-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
