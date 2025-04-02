import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [newUsername, setNewUsername] = useState(user?.username || "");
  const [profilePicture, setProfilePicture] = useState(null);

  // const defaultProfilePic =
  //   "https://res.cloudinary.com/dyvfgglux/image/upload/v1738956001/WhatsApp_Image_2025-01-30_at_03.35.12_9bf2ee3c-removebg-preview_flote7.png";

  // Function to update username
  const handleUsernameUpdate = async (e) => {
    e.preventDefault();

      const response = await axios.post(
        `http://localhost:3000/profile/${user._id}/edit`, 
        { username: newUsername },
        { withCredentials: true }
      );

      console.log("Username updated:", response.data);
      setUser(response.data.user);
      navigate(`/profile/${response.data.user.username}`);
    
  };

  // Function to update profile picture
  const handleProfilePictureUpdate = async (e) => {
    e.preventDefault();
    if (!profilePicture) return;

    const formData = new FormData();
    formData.append("file", profilePicture);
      const response = await axios.post(
        `http://localhost:3000/profile/${user._id}/edit`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Profile picture updated:", response.data);
      setUser(response.data.user);
      navigate(`/profile/${response.data.user.username}`);
    
  };

  // if (!user) return <h1>Loading...</h1>;

  return (
    <div>
      <h1>Edit Profile</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Profile Picture Update */}
      <form onSubmit={handleProfilePictureUpdate} encType="multipart/form-data">
        <h2>Change Profile Picture</h2>
        <br />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>

      {/* Username Update */}
      <form onSubmit={handleUsernameUpdate}>
        <h2>
          <strong>Current Username:</strong> {user.username}
        </h2>
        <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}  />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditProfile;
