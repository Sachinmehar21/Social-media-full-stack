import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
      if (response.data.success) {
        navigate(`/profile/${response.data.user.username}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div>
      <div>
        <h1>Login</h1>
        {error && <div>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <div>
          Don't have an account? <Link to="/">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;