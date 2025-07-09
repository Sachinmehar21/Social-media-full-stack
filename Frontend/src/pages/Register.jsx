import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "../styles/Register.css";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Register = () => {
  const [data, setData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = data;

    try {
      const response = await api.post("/", { username, email, password });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        navigate(`/profile/${response.data.username}`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.response?.data || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google", {
        token: credentialResponse.credential,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate(`/profile/${res.data.username || ""}`);
      }
    } catch (err) {
      console.error("Google registration failed:", err);
      alert("Google registration failed.");
    }
  };

  const handleGoogleError = () => {
    alert("Google sign-in was unsuccessful.");
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
              useOneTap
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
