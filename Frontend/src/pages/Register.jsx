import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post("http://localhost:3000/", data, { withCredentials: true });
  
      if (response.data.username) {
        navigate(`/profile/${response.data.username}`);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            name="username" 
            placeholder="Username" 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input 
            id="email"
            name="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <div>
        Already a user? <Link to="/login">Login here</Link>
      </div>
    </div>
  );
};

export default Register;
