import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Search.css";
import { Link, useNavigate } from "react-router-dom";
import { BsChatDots } from "react-icons/bs";
import { FiHome, FiSearch, FiPlusSquare, FiUser } from "react-icons/fi";
import { API_URL } from '../api';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Generate images based on screen size
  const imageCount = window.innerWidth >= 1024 ? 44 : 15;

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/feed`, {
          withCredentials: true,
        });
        setCurrentUser(response.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching current user:", error);
        navigate("/login");
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim()) {
      try {
        const response = await axios.get(`${API_URL}/search/${value}`, {
          withCredentials: true,
        });
        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Search failed", error);
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
  };

  const handleFollow = async (username) => {
    try {
      const response = await axios.post(
        `${API_URL}/follow/${username}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUsers(users.map(user => {
          if (user.username === username) {
            return {
              ...user,
              followers: [...(user.followers || []), currentUser._id]
            };
          }
          return user;
        }));
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="search-container">
      <div className="topbar">
        <Link to="/feed">
          <img
            src="https://res.cloudinary.com/dyvfgglux/image/upload/v1743708891/image_z3anjm.png"
            alt="logo"
            className="logo"
          />
        </Link>
        <div className="topbar-icons">
          <Link to="/dm">
            <div className="topbar-icon">
              <BsChatDots />
            </div>
          </Link>
          <Link to={`/profile/${currentUser?.username}`} className="user-profile-link">
            <img
              src={currentUser?.profilepicture || "/default-profile.png"}
              alt={currentUser?.username}
              className="user-avatar"
            />
          </Link>
        </div>
      </div>

      <div className="search-content">
        <div className="search-bar">
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {searchTerm ? (
          <div className="search-results">
            {users.length > 0 ? (
              users.map((user) => (
                <div key={user._id} className="user-card">
                  <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', flex: 1 }}>
                    <img
                      src={user.profilepicture || "/default-profile.png"}
                      alt={user.username}
                      className="user-avatar"
                    />
                    <div className="user-info">
                      <div className="username">{user.username}</div>
                      <div className="fullname">{user.fullname || user.username}</div>
                    </div>
                  </Link>
                  {currentUser._id !== user._id && (
                    <button
                      className={user.followers?.includes(currentUser._id) ? "unfollow-button" : "follow-button"}
                      onClick={() => handleFollow(user.username)}
                    >
                      {user.followers?.includes(currentUser._id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">No users found</div>
            )}
          </div>
        ) : (
          <div className="image-grid">
            {Array.from({ length: imageCount }, (_, i) => (
              <img
                key={i}
                src={`https://picsum.photos/200/300?random=${i + 2}`}
                alt={`Random ${i + 1}`}
                className="grid-image"
              />
            ))}
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <Link to="/feed" className="nav-icon">
          <FiHome />
        </Link>
        <Link to="/search" className="nav-icon">
          <FiSearch />
        </Link>
        <Link to="/upload" className="nav-icon">
          <FiPlusSquare />
        </Link>
        <Link to={`/profile/${currentUser?.username}`} className="nav-icon">
          <FiUser />
        </Link>
      </div>
    </div>
  );
};

export default Search;
