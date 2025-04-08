import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoHome } from "react-icons/go";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import "./Profile.css";

const Profile = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:3000/profile/${username}`, { 
          withCredentials: true 
        });
        setUser(data.user);
        setPosts(data.posts);
        setCurrentUser(data.currentUser);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!user) return <div className="profile-container">Could not find user profile</div>;

  return (
    <>
      <div className="profile-container">
        <div className="nav">
          <h3 className="username">{user.username}</h3>
          <div className="icons">
            <Link to="/upload">
              <MdAddPhotoAlternate size={24} />
            </Link>
          </div>
        </div>

        <div className="profile-header">
          <div className="profile-pic">
            <img 
              src={user.profilepicture || "https://res.cloudinary.com/dyvfgglux/image/upload/v1743708891/image_z3anjm.png"} 
              alt="Profile" 
            />
          </div>
          <div className="stats">
            <div className="stat-item">
              <h3>{posts.length}</h3>
              <h4>Posts</h4>
            </div>
            <div className="stat-item">
              <h3>{user.followers?.length || 0}</h3>
              <h4>Followers</h4>
            </div>
            <div className="stat-item">
              <h3>{user.following?.length || 0}</h3>
              <h4>Following</h4>
            </div>
          </div>
        </div>

        <div className="details">
          <h3>{user.name || user.username}</h3>
          <p>{user.bio || 'Add bio'}</p>
        </div>

        <div className="edit-profile">
          <Link to={`/profile/${username}/edit`}>Edit Profile</Link>
        </div>

        <div className="posts-grid">
          {posts.length > 0 ? (
            [...posts].reverse().map(post => (
              <div key={post._id} className="post">
                <img src={post.media} alt="Post" />
              </div>
            ))
          ) : (
            <p className="no-posts">Create your first post!</p>
          )}
        </div>
      </div>

      <div className="footer">
        <Link to="/feed"><GoHome size={24} /></Link>
        <Link to="/search"><IoSearch size={24} /></Link>
        <Link to="/upload"><MdAddPhotoAlternate size={24} /></Link>
        <Link to="/profile">
          <div className="footer-profile">
            <img 
              src={user.profilepicture || "https://res.cloudinary.com/dyvfgglux/image/upload/v1743708891/image_z3anjm.png"} 
              alt="Profile" 
            />
          </div>
        </Link>
      </div>
    </>
  );
};

export default Profile;