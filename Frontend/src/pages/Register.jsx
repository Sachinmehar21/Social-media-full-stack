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
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange} required />
      <input name="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button>Register</button>
      <p>Already a user? <Link to="/login">Login here</Link></p>
    </form>
  );
};

export default Register;
