import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", name: "", bio: "", file: null });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/profile/${username}`, { withCredentials: true });
        setUser(data.user);
        setFormData({
          username: data.user.username,
          name: data.user.name,
          bio: data.user.bio,
          file: null,
        });
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
      data.append("username", formData.username);
      data.append("name", formData.name);
      data.append("bio", formData.bio);

      const response = await axios.post(
        `http://localhost:3000/profile/${user._id}/edit`,
        data,
        {
          withCredentials: true,
          headers: formData.file ? { "Content-Type": "multipart/form-data" } : {},
        }
      );

      setUser(response.data.user);
      navigate(`/profile/${response.data.user.username}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    }
  };

  const triggerFileSelect = () => {
    document.getElementById("fileInput").click();
  };

  if (!user) return null;

  return (
    <div>
      <style>{`
        .page {
          background-color: #18181b;
          color: white;
          min-height: 100vh;
          padding: 20px 0;
          font-family: sans-serif;
        }
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
        }
        .nav a {
          color: #3b82f6;
          font-size: 14px;
          text-decoration: none;
        }
        .center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-top: 60px;
        }
        .profile-pic {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #bae6fd;
          overflow: hidden;
        }
        .profile-pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .edit-btn {
          color: #3b82f6;
          background: none;
          border: none;
          cursor: pointer;
          text-transform: capitalize;
        }
        .form-container {
          padding: 0 16px;
          margin-top: 40px;
        }
        .form-container h3 {
          font-size: 18px;
          margin-bottom: 8px;
        }
        .form-container hr {
          opacity: 0.3;
          margin-bottom: 16px;
        }
        form input,
        form textarea {
          width: 100%;
          padding: 10px 12px;
          margin-top: 8px;
          border: 2px solid #27272a;
          border-radius: 6px;
          background-color: #18181b;
          color: white;
        }
        form textarea {
          resize: none;
          height: 100px;
        }
        .submit-btn {
          width: 100%;
          background-color: #3b82f6;
          color: white;
          padding: 12px;
          border: none;
          border-radius: 6px;
          margin-top: 12px;
          cursor: pointer;
          font-weight: bold;
        }
        .hidden {
          display: none;
        }
      `}</style>

      <div className="page">
        <div className="nav">
          <a href="/profile">&#8592; Profile</a>
          <h2 style={{ fontSize: "14px" }}>Edit Profile</h2>
          <a href="/feed">&#8962; Home</a>
        </div>

        <div className="center">
          <div className="profile-pic">
            <img src={`http://localhost:3000/images/upload/${user.pic}`} alt="profile" />
          </div>
          <button className="edit-btn" type="button" onClick={triggerFileSelect}>
            Edit Picture
          </button>
        </div>

        <div className="form-container">
          <h3>Edit Account Details</h3>
          <hr />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <input
              id="fileInput"
              className="hidden"
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
            />
            <button className="submit-btn" type="submit">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
