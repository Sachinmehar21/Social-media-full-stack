import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { BsChatDots, BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { BiShareAlt } from 'react-icons/bi';
import axios from 'axios';

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/feed', { withCredentials: true });
        console.log('Feed data:', response.data); // Debug log
        setUser(response.data.user);
        setPosts(response.data.posts || []);
      } catch (error) {
        console.error('Error fetching feed data:', error);
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLike = (postId) => {
    // axios logic here
  };

  const handleSave = (postId) => {
    // axios logic here
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container">
     <style>{`
  .container {
    width: 100%;
    min-height: 100vh;
    background-color: #18181b;
    color: white;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Segoe UI', sans-serif;
  }

  .topbar {
    width: 100%;
    max-width: 768px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    margin-bottom: 24px;
  }

  .logout-btn {
    background-color: white;
    color: black;
    padding: 8px 16px;
    font-weight: 600;
    border-radius: 9999px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    cursor: pointer;
    transition: background 0.3s;
  }

  .logout-btn:hover {
    background-color: #e4e4e7;
  }

  .post {
    background-color: #27272a;
    border-radius: 12px;
    width: 100%;
    max-width: 480px;
    margin-bottom: 24px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.4);
  }

  .post-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
  }

  .post-header img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #3f3f46;
  }

  .username {
    font-weight: 600;
    font-size: 0.95rem;
  }

  .post-img-container img {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  .icons-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px 0;
    font-size: 1.5rem;
  }

  .left-icons {
    display: flex;
    gap: 16px;
  }

  .like-count,
  .caption {
    padding: 4px 16px;
    font-size: 0.92rem;
  }

  .caption {
    margin-bottom: 12px;
    color: #d4d4d8;
  }

  /* Responsive styles */
  @media (max-width: 640px) {
    .post {
      margin-bottom: 20px;
      border-radius: 0;
      max-width: 100%;
    }

    .topbar {
      padding: 0 12px;
    }

    .post-header img {
      width: 36px;
      height: 36px;
    }

    .icons-row {
      font-size: 1.4rem;
      padding: 10px 12px 0;
    }

    .like-count,
    .caption {
      padding: 4px 12px;
    }
  }
`}</style>



      {/* Top Navbar */}
      <div className="topbar">
        <img src="https://res.cloudinary.com/dyvfgglux/image/upload/v1743708891/image_z3anjm.png" alt="logo" style={{ height: '60px' }} />
        <div className="logout-btn" onClick={handleLogout}>Logout</div>
      </div>

      {/* Posts */}
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>
            No posts to show. Follow some users to see their posts!
          </div>
        ) : (
          posts.map((post, idx) => (
            <div className="post" key={idx}>
              <div className="post-header">
                <img src={post.author.profilepicture || '/default-profile.png'} alt="user" />
                <span className="username">{post.author.username}</span>
              </div>

              <div className="post-img-container">
                <img
                  src={post.media}
                  alt="post"
                />
              </div>

              <div className="icons-row">
                <div className="left-icons">
                  {post.likes.includes(user._id) ? (
                    <AiFillHeart
                      color="red"
                      onClick={() => handleLike(post._id)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <AiOutlineHeart
                      onClick={() => handleLike(post._id)}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  <BsChatDots style={{ cursor: 'pointer' }} />
                  <BiShareAlt style={{ cursor: 'pointer' }} />
                </div>
                <BsBookmark style={{ cursor: 'pointer' }} />
              </div>

              <div className="like-count">{post.likes.length} Likes</div>
              <div className="caption">
                <span className="username">{post.author.username}</span>
                {post.caption}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Homepage;
