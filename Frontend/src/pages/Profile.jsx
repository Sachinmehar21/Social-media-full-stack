import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoHome } from "react-icons/go";
import { MdAddPhotoAlternate } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import "../styles/Profile.css";

import { FiPlusSquare, FiUser } from "react-icons/fi";

const Profile = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/profile/${username}`, { 
        withCredentials: true 
      });
      setUser(data.user);
      setPosts(data.posts);
      setCurrentUser(data.currentUser);
      setIsFollowing(data.user.isFollowing);
      setFollowers(data.user.followers || []);
      setFollowing(data.user.following || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        const response = await axios.post(`http://localhost:3000/unfollow/${username}`, {}, { withCredentials: true });
        if (response.data.success) {
          setIsFollowing(false);
          await fetchProfile();
        }
      } else {
        const response = await axios.post(`http://localhost:3000/follow/${username}`, {}, { withCredentials: true });
        if (response.data.success) {
          setIsFollowing(true);
          await fetchProfile();
        }
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
    }
  };

  const handleFollowUser = async (username) => {
    try {
      await axios.post(`http://localhost:3000/follow/${username}`, {}, { withCredentials: true });
      await fetchProfile();
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollowUser = async (username) => {
    try {
      await axios.post(`http://localhost:3000/unfollow/${username}`, {}, { withCredentials: true });
      await fetchProfile();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) return <div className="profile-container">Loading...</div>;
  if (!user) return <div className="profile-container">Could not find user profile</div>;

  return (
    <>
    <div className="instagram-container">   
      <div className="profile-container">
        
        <div className="nav">
          <Link to="/feed">
            <img
              src="https://res.cloudinary.com/dyvfgglux/image/upload/v1743708891/image_z3anjm.png"
              alt="logo"
              className="logo"
            />
          </Link>
          {/* <h2 className="username">{user.username}</h2> */}
          <div className="icons">
            {user.isCurrentUser ? (
              <button onClick={handleLogout} className="logout-button">
                <FiLogOut size={24} />
              </button>
            ) : (
              <button 
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
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
            <div className="stat-item" onClick={() => setShowFollowersModal(true)} style={{ cursor: 'pointer' }}>
              <h3>{followers.length}</h3>
              <h4>Followers</h4>
            </div>
            <div className="stat-item" onClick={() => setShowFollowingModal(true)} style={{ cursor: 'pointer' }}>
              <h3>{following.length}</h3>
              <h4>Following</h4>
            </div>
          </div>
        </div>

        <div className="details">
          <h3>{user.username}</h3>
          <p>{user.bio || 'Add bio'}</p>
        </div>

        {user.isCurrentUser && (
        <div className="edit-profile">
          <Link to={`/profile/${username}/edit`}>Edit Profile</Link>
        </div>
        )}

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

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="modal-overlay" onClick={() => setShowFollowersModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Followers</div>
              <div className="close-button" onClick={() => setShowFollowersModal(false)}>
                <IoClose />
              </div>
            </div>
            <div className="likes-list">
              {followers.map((follower) => (
                <Link
                  to={`/profile/${follower.username}`}
                  key={follower._id}
                  className="like-item"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={follower.profilepicture || "/default-profile.png"}
                    alt={follower.username}
                    className="like-avatar"
                  />
                  <div className="like-info">
                    <div className="like-username">{follower.username}</div>
                  </div>
                  {currentUser && currentUser._id !== follower._id && (
                    <button 
                      className={`follow-button ${follower.followers?.includes(currentUser._id) ? 'following' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (follower.followers?.includes(currentUser._id)) {
                          handleUnfollowUser(follower.username);
                        } else {
                          handleFollowUser(follower.username);
                        }
                      }}
                    >
                      {follower.followers?.includes(currentUser._id) ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="modal-overlay" onClick={() => setShowFollowingModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Following</div>
              <div className="close-button" onClick={() => setShowFollowingModal(false)}>
                <IoClose />
              </div>
            </div>
            <div className="likes-list">
              {following.map((followed) => (
                <Link
                  to={`/profile/${followed.username}`}
                  key={followed._id}
                  className="like-item"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={followed.profilepicture || "/default-profile.png"}
                    alt={followed.username}
                    className="like-avatar"
                  />
                  <div className="like-info">
                    <div className="like-username">{followed.username}</div>
                  </div>
                  {currentUser && currentUser._id !== followed._id && (
                    <button 
                      className={`follow-button ${followed.followers?.includes(currentUser._id) ? 'following' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        if (followed.followers?.includes(currentUser._id)) {
                          handleUnfollowUser(followed.username);
                        } else {
                          handleFollowUser(followed.username);
                        }
                      }}
                    >
                      {followed.followers?.includes(currentUser._id) ? 'Unfollow' : 'Follow'}
                    </button>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bottom-nav">
        <Link to="/feed" style={{ textDecoration: 'none', color: 'white' }}><GoHome size={24} /></Link>
        <Link to="/search" style={{ textDecoration: 'none', color: 'white' }}><IoSearch size={24} /></Link>
        <Link to="/upload" style={{ textDecoration: 'none', color: 'white' }}><FiPlusSquare size={24} /></Link>
        {user.isCurrentUser ? (
          <Link to={`/profile/${user?.username}`} style={{ textDecoration: 'none', color: 'white' }}>
            <div className="footer-profile">
              <img src={user.profilepicture || "https://res.cloudinary.com/dyvfgglux/image/upload/v1743708891/image_z3anjm.png"} alt="Profile" />
            </div>
          </Link>
        ) : (
          <Link to={`/profile/${user?.username}`} style={{ textDecoration: 'none', color: 'white' }}>
            <FiUser size={24} />
          </Link>
        )}
      </div>
      </div>
    </>
  );
};

export default Profile;