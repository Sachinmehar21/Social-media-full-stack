import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../api';
import "../styles/Editprofile.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ username: "", name: "", bio: "", file: null });
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/profile/${username}`, { withCredentials: true });
        setUser(data.user);
        setFormData({
          username: data.user.username,
          bio: data.user.bio,
          file: null,
        });
        setPreviewUrl(data.user.profilepicture);
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
      data.append("bio", formData.bio);

      const response = await axios.post(
        `${API_URL}/profile/${user._id}/edit`,
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      // Create a preview URL for the selected image
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const triggerFileSelect = () => {
    document.getElementById("fileInput").click();
  };

  if (!user) return null;

  return (
    <div>
      <div className="page">
        <div className="nav">
          <h2 style={{ fontSize: "14px" }}>Edit Profile</h2>
        </div>

        <div className="center">
          <div className="profile-pic">
            <img src={previewUrl} alt="profile" />
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
              onChange={handleFileChange}
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
