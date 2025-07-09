import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsChatDots, BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { BiShareAlt } from "react-icons/bi";
import { FiHome, FiSearch, FiPlusSquare, FiUser } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import "../styles/Homepage.css";
import { API_URL } from '../api/axios';

const Homepage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [selectedPostLikes, setSelectedPostLikes] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/feed`, {
          withCredentials: true,
        });
        console.log("Feed response:", response.data);
        setUser(response.data.user);
        setPosts(response.data.posts || []);
        setError(null);

        // Fetch suggested users
        const usersResponse = await axios.get(`${API_URL}/users`, {
          withCredentials: true,
        });
        const suggested = usersResponse.data.users.filter(
          suggestedUser => 
            suggestedUser._id !== response.data.user._id && 
            !response.data.user.following.includes(suggestedUser._id)
        );
        setSuggestedUsers(suggested.slice(0, 5));
      } catch (error) {
        console.error("Error fetching feed data:", error);
        setError("Failed to load feed. Please try again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLike = async (postId) => {
    try {
      const response = await axios.post(
        `${API_URL}/likepost/${postId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likes: response.data.likes,
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error("Error liking/unliking post:", error);
    }
  };

  const handleSave = (postId) => {
    // axios logic here
    navigate('/dm');
  };

  const handleShowLikes = async (postId) => {
    try {
      const response = await axios.get(`${API_URL}/post/${postId}/likes`, {
        withCredentials: true
      });
      if (response.data.success) {
        setSelectedPostLikes(response.data.likes);
        setShowLikesModal(true);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
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
        // Update the likes list if in modal
        setSelectedPostLikes(prevLikes => 
          prevLikes.map(like => {
            if (like.username === username) {
              return {
                ...like,
                followers: like.followers ? [...like.followers, user._id] : [user._id]
              };
            }
            return like;
          })
        );

        // Refresh feed to get new posts
        const feedResponse = await axios.get(`${API_URL}/feed`, {
          withCredentials: true,
        });
        setPosts(feedResponse.data.posts || []);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async (username) => {
    try {
      const response = await axios.post(
        `${API_URL}/unfollow/${username}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update the likes list if in modal
        setSelectedPostLikes(prevLikes => 
          prevLikes.map(like => {
            if (like.username === username) {
              return {
                ...like,
                followers: like.followers?.filter(id => id !== user._id) || []
              };
            }
            return like;
          })
        );

        // Refresh feed to remove unfollowed user's posts
        const feedResponse = await axios.get(`${API_URL}/feed`, {
          withCredentials: true,
        });
        setPosts(feedResponse.data.posts || []);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleFollowSuggestion = async (username) => {
    try {
      const response = await axios.post(
        `${API_URL}/follow/${username}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setSuggestedUsers(prevUsers => 
          prevUsers.filter(user => user.username !== username)
        );
        
        const feedResponse = await axios.get(`${API_URL}/feed`, {
          withCredentials: true,
        });
        setPosts(feedResponse.data.posts || []);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleAddComment = async (postId) => {
    try {
      const response = await axios.post(
        `${API_URL}/addcomment/${postId}`,
        { text: commentText[postId] },
        { withCredentials: true }
      );

      if (response.data.success) {
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [...(post.comments || []), response.data.comment]
            };
          }
          return post;
        }));
        setCommentText({ ...commentText, [postId]: '' });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.post(
        `${API_URL}/deletecomment/${commentId}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter(comment => comment._id !== commentId)
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentClick = (postId) => {
    setShowCommentInput(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const seconds = Math.floor((now - postDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return 'Just now';
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!user) return <div className="error">Please log in to view your feed</div>;

  return (
    <div className="instagram-container">
      {/* Top Navbar */}
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
          <Link to={`/profile/${user?.username}`} className="user-profile-link">
            <img
              src={user.profilepicture || "/default-profile.png"}
              alt={user.username}
              className="user-avatar"
            />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container">
        {/* Posts */}
        <div className="posts-container">
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#8e8e8e" }}>
              No posts to show. Follow some users to see their posts!
            </div>
          ) : (
            posts.map((post, idx) => (
              <div className="post" key={post._id || idx}>
                <div className="post-header">
                  <div className="post-header-left">
                    <Link
                      to={`/profile/${post.user?.username}`}
                      style={{ color: "inherit", textDecoration: "none", display: "flex", alignItems: "center" }}
                    >
                      <img
                        src={post.user?.profilepicture || "/default-profile.png"}
                        alt={post.user?.username || "user"}
                        className="post-avatar"
                      />
                      <div className="post-username">
                        {post.user?.username || "Unknown User"}
                      </div>
                    </Link>
                  </div>
                  <div className="post-options">•••</div>
                </div>

                <div className="post-img-container">
                  <img
                    src={post.media}
                    alt="post"
                    className="post-img"
                    onError={(e) => {
                      e.target.src = "/placeholder-post.jpg";
                    }}
                  />
                </div>

                <div className="post-actions">
                  <div className="icons-row">
                    <div className="left-icons">
                      {post.likes?.includes(user._id) ? (
                        <AiFillHeart
                          color="rgb(255, 48, 64)"
                          onClick={() => handleLike(post._id)}
                          className="icon"
                        />
                      ) : (
                        <AiOutlineHeart
                          onClick={() => handleLike(post._id)}
                          className="icon"
                        />
                      )}
                      <BsChatDots 
                        className="icon" 
                        onClick={() => handleCommentClick(post._id)}
                      />
                      <BiShareAlt className="icon" />
                    </div>
                    {post.saved?.includes(user._id) ? (
                      <BsBookmarkFill
                        onClick={() => handleSave(post._id)}
                        className="icon"
                      />
                    ) : (
                      <BsBookmark
                        onClick={() => handleSave(post._id)}
                        className="icon"
                      />
                    )}
                  </div>

                  <div className="like-count" onClick={() => handleShowLikes(post._id)} style={{ cursor: 'pointer' }}>
                    {post.likes?.length || 0} likes
                  </div>
                  <div className="caption-container">
                    <Link
                      to={`/profile/${post.user?.username}`}
                      className="post-username"
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {post.user?.username || "Unknown User"}
                    </Link>{" "}
                    {post.caption || ""}
                  </div>

                  {showComments[post._id] && post.comments?.length > 0 && (
                    <div className="comments-section">
                      {post.comments.map(comment => (
                        <div key={comment._id} className="comment">
                          <Link
                            to={`/profile/${comment.user.username}`}
                            className="comment-username"
                          >
                            {comment.user.username}
                          </Link>
                          <span className="comment-text">{comment.text}</span>
                          {comment.user._id === user._id && (
                            <button
                              className="delete-comment"
                              onClick={() => handleDeleteComment(post._id, comment._id)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div 
                    className="view-comments" 
                    onClick={() => toggleComments(post._id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {post.comments?.length > 0 
                      ? `View all ${post.comments.length} comments` 
                      : 'No comments yet'}
                  </div>

                  {showCommentInput[post._id] && (
                    <div className="comment-input-container">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && commentText[post._id]?.trim()) {
                            handleAddComment(post._id);
                          }
                        }}
                      />
                      <button
                        className="post-comment"
                        onClick={() => handleAddComment(post._id)}
                        disabled={!commentText[post._id]?.trim()}
                      >
                        Post
                      </button>
                    </div>
                  )}

                  <div className="timestamp">
                    {formatTimeAgo(post.createdAt)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Suggestions section */}
        <div className="suggestions">
          <Link to={`/profile/${user?.username}`} className="user-profile-link">
            <div className="user-profile">
              <img
                src={user.profilepicture || "/default-profile.png"}
                alt={user.username}
                className="user-avatar-large"
              />
              <div className="user-info">
                <div className="user-display-name">{user.username}</div>
                <div className="user-fullname">
                  {user.fullname || "Instagram User"}
                </div>
              </div>
            </div>
          </Link>

          <div className="suggestions-title">
            <span className="suggestions-header">Suggestions For You</span>
            <Link to="/users" className="see-all">See All</Link>
          </div>

          {suggestedUsers.map((suggestedUser) => (
            <div className="suggestion" key={suggestedUser._id}>
              <Link to={`/profile/${suggestedUser.username}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <img
                  src={suggestedUser.profilepicture || "/default-profile.png"}
                  alt={suggestedUser.username}
                  className="suggestion-avatar"
                  onError={(e) => {
                    e.target.src = "/default-profile.png";
                  }}
                />
                <div className="suggestion-info">
                  <div className="suggestion-username">
                    {suggestedUser.username}
                  </div>
                  <div className="suggestion-relation">
                    {suggestedUser.followers ? suggestedUser.followers.length : 0} followers
                  </div>
                </div>
              </Link>
              <div 
                className="follow-btn"
                onClick={() => handleFollowSuggestion(suggestedUser.username)}
              >
                Follow
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Likes Modal */}
      {showLikesModal && (
        <div className="modal-overlay" onClick={() => setShowLikesModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Likes</div>
              <div className="close-button" onClick={() => setShowLikesModal(false)}>
                <IoClose />
              </div>
            </div>
            <div className="likes-list">
              {selectedPostLikes.map((like) => (
                <Link
                  to={`/profile/${like.username}`}
                  key={like._id}
                  className="like-item"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <img
                    src={like.profilepicture || "/default-profile.png"}
                    alt={like.username}
                    className="like-avatar"
                  />
                  <div className="like-info">
                    <div className="like-username">{like.username}</div>
                    <div className="like-fullname">{like.fullname || like.username}</div>
                  </div>
                  {user._id !== like._id && (
                    <button className="follow-button">
                      {like.followers?.includes(user._id) ? 'Following' : 'Follow'}
                    </button>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <Link to="/" className="nav-icon">
          <FiHome />
        </Link>
        <Link to="/search" className="nav-icon">
          <FiSearch />
        </Link>
        <Link to="/upload" className="nav-icon">
          <FiPlusSquare />
        </Link>
        <Link to={`/profile/${user?.username}`} className="nav-icon">
          <FiUser />
        </Link>
      </div>
    </div>
  );
};

export default Homepage;