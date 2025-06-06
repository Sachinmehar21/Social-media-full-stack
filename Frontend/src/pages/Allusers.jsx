import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BsChatDots } from "react-icons/bs";
import { FiHome, FiSearch, FiPlusSquare, FiUser } from 'react-icons/fi';
import '../styles/Profile.css';

const Allusers = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // First get the current user from feed
        const feedResponse = await axios.get('http://localhost:3000/feed', {
          withCredentials: true
        });
        setCurrentUser(feedResponse.data.user);

        // Then get all users
        const usersResponse = await axios.get('http://localhost:3000/users', {
          withCredentials: true
        });
        setUsers(usersResponse.data.users);
        setError(null);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load users. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleFollow = async (username) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/follow/${username}`,
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
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/unfollow/${username}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUsers(users.map(user => {
          if (user.username === username) {
            return {
              ...user,
              followers: user.followers?.filter(id => id !== currentUser._id) || []
            };
          }
          return user;
        }));
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const toggleFollow = async (username, isFollowing) => {
    if (isFollowing) {
      await handleUnfollow(username);
    } else {
      await handleFollow(username);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!currentUser) return <div className="error">Please log in to view users</div>;

  return (
    <div className="instagram-container">
      <style>{`
        .users-container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #000;
        }

        .like-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          gap: 12px;
          border-bottom: 1px solid #262626;
          transition: background-color 0.2s ease;
        }

        .like-item:hover {
          background-color: #1a1a1a;
        }

        .like-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }

        .like-info {
          flex: 1;
          min-width: 0;
        }

        .like-username {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .like-fullname {
          color: #8e8e8e;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .follow-button {
          padding: 6px 16px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background-color: #0095f6;
          color: white;
          white-space: nowrap;
        }

        .follow-button:hover {
          background-color: #1877f2;
        }

        .follow-button.following {
          background-color: transparent;
          color: white;
          border: 1px solid #363636;
        }

        .follow-button.following:hover {
          background-color: #3f3f46;
        }

        @media (min-width: 1024px) {
          .instagram-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .topbar {
            width: 100%;
            max-width: 975px;
          }

          .users-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }

          .like-item {
            padding: 16px;
          }

          .like-avatar {
            width: 56px;
            height: 56px;
          }

          .like-username {
            font-size: 16px;
          }

          .like-fullname {
            font-size: 14px;
          }

          .follow-button {
            padding: 8px 24px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .users-container {
            padding: 12px;
          }

          .like-item {
            padding: 12px 16px;
          }

          .like-avatar {
            width: 48px;
            height: 48px;
          }

          .like-username {
            font-size: 15px;
            margin-bottom: 4px;
          }

          .like-fullname {
            font-size: 13px;
          }

          .follow-button {
            padding: 8px 20px;
            font-size: 14px;
            min-width: 80px;
          }
        }
      `}</style>

      <div className="users-container">
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
          </div>
        </div>
        
        {users.map(user => (
          <div key={user._id} className="like-item">
            <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img
                src={user.profilepicture || "/default-profile.png"}
                alt={user.username}
                className="like-avatar"
              />
            </Link>
            <div className="like-info">
              <Link to={`/profile/${user.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="like-username">{user.username}</div>
                <div className="like-fullname">{user.fullname || user.username}</div>
              </Link>
            </div>
            {currentUser._id !== user._id && (
              <button
                className={`follow-button ${user.followers?.includes(currentUser._id) ? 'following' : ''}`}
                onClick={() => toggleFollow(user.username, user.followers?.includes(currentUser._id))}
              >
                {user.followers?.includes(currentUser._id) ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bottom-nav">
        <Link to="/" className="nav-icon">
          <FiHome />
        </Link>
        <Link to="/search" className="nav-icon">
          <FiSearch />
        </Link>
        <Link to="/create" className="nav-icon">
          <FiPlusSquare />
        </Link>
        <Link to={`/profile/${currentUser?.username}`} className="nav-icon">
          <FiUser />
        </Link>
      </div>
    </div>
  );
};

export default Allusers;