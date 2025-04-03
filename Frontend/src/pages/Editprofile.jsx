import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", file: null });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/profile/${username}`, { withCredentials: true });
        setUser(data.user);
        setFormData(prev => ({ ...prev, username: data.user.username }));
      } catch (err) {
        setError("Error fetching user data");
      }
    };
    fetchUser();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) return;
    
    try {
      const data = new FormData();
      if (formData.file) data.append("file", formData.file);
      if (formData.username) data.append("username", formData.username);

      const response = await axios.post(
        `http://localhost:3000/profile/${user._id}/edit`,
        data,
        { withCredentials: true, headers: formData.file ? { "Content-Type": "multipart/form-data" } : {} }
      );

      setUser(response.data.user);
      navigate(`/profile/${response.data.user.username}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    }
  };

  if (!user) return null;

  return (
    <div>
      <h1>Edit Profile</h1>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="file">Profile Picture</label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
