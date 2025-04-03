import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { username } = useParams(); // Get username from URL params
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/profile/${username}`, { withCredentials: true });
        setUser(data.user);
        setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [username]);

  const handleDeletePost = async (postId) => {
    try {
      await axios.post(`http://localhost:3000/deletepost/${postId}`, {}, { withCredentials: true });
      // Update posts state instead of reloading
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/likepost/${postId}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update the posts state with the new like status
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              likes: response.data.likes,
              isLiked: response.data.isLiked
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment[postId] || newComment[postId].trim() === "") return;
    
    try {
      const response = await axios.post(
        `http://localhost:3000/comment/${postId}`,
        { comment: newComment[postId] },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update the posts state with the new comment
        setPosts(posts.map(post => {
          if (post._id === postId) {
            return {
              ...post,
              comments: [...post.comments, response.data.comment]
            };
          }
          return post;
        }));
        
        // Clear the comment input
        setNewComment(prev => ({ ...prev, [postId]: "" }));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/deletecomment/${commentId}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        // Update the posts state by removing the deleted comment
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

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/follow/${user._id}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUser(prev => ({
          ...prev,
          followers: [...prev.followers, response.data.currentUser._id],
          isFollowing: true
        }));
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/unfollow/${user._id}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        setUser(prev => ({
          ...prev,
          followers: prev.followers.filter(id => id !== response.data.currentUser._id),
          isFollowing: false
        }));
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/logout", { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div>
        <h1>{user.username}'s Profile</h1>
        <img src={user.profilePic || "default-avatar.png"} alt="Profile" />
        <div>
          <p>Followers: {user.followers.length}</p>
          <p>Following: {user.following.length}</p>
        </div>
        
        {user.isCurrentUser ? (
          <div>
            <button onClick={() => navigate(`/profile/${user.username}/edit`)}>Edit Profile</button>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            {user.isFollowing ? (
              <button onClick={handleUnfollow}>Unfollow</button>
            ) : (
              <button onClick={handleFollow}>Follow</button>
            )}
          </div>
        )}
      </div>

      <div>
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet</p>
        ) : (
          posts.map(post => (
            <div key={post._id}>
              <img src={post.media} alt="Post" />
              <p>{post.caption}</p>
              <p>Likes: {post.likes.length}</p>
              <button onClick={() => handleLikePost(post._id)}>
                {post.isLiked ? "Unlike" : "Like"}
              </button>
              
              {user.isCurrentUser && (
                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
              )}
              
              <div>
                <h3>Comments</h3>
                {post.comments.map(comment => (
                  <div key={comment._id}>
                    <p>
                      <strong>{comment.user.username}</strong>: {comment.text}
                      {comment.user._id === user._id && (
                        <button onClick={() => handleDeleteComment(comment._id, post._id)}>
                          Delete
                        </button>
                      )}
                    </p>
                  </div>
                ))}
                
                <div>
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[post._id] || ""}
                    onChange={(e) => setNewComment(prev => ({ ...prev, [post._id]: e.target.value }))}
                  />
                  <button onClick={() => handleAddComment(post._id)}>Comment</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
