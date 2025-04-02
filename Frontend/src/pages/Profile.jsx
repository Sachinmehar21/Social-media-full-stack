import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { username } = useParams(); // Get username from URL params
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
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

  const handleFollow = async () => {
    await axios.post(`http://localhost:3000/follow/${username}`, {}, { withCredentials: true });
    window.location.reload();
  };

  const handleUnfollow = async () => {
    await axios.post(`http://localhost:3000/unfollow/${username}`, {}, { withCredentials: true });
    window.location.reload();
  };

  const handleLogout = async () => {
    await axios.post("http://localhost:3000/logout", {}, { withCredentials: true });
    navigate("/");
  };

  if (!user) return <h1>Loading...</h1>;

  return (
    <div>
      <h1>Profile</h1>
      <img src={user.profilepicture} alt="Profile" width="200" height="200" />
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Followers:</strong> {user.followers.length}</p>
      <p><strong>Following:</strong> {user.following.length}</p>

      {user.isCurrentUser ? (
        <button onClick={() => navigate(`/profile/${user.username}/edit`)}>Edit</button>
      ) : (
        user.isFollowing ? (
          <button onClick={handleUnfollow}>Unfollow</button>
        ) : (
          <button onClick={handleFollow}>Follow</button>
        )
      )}

      <h2>Posts</h2>
      <div>
        {posts.map((post) => (
          <div key={post._id}>
            <img src={post.media} alt="Post" />
            <p>{post.caption}</p>
            <p>Likes: {post.likes.length}</p>
            <button>Like</button>
          </div>
        ))}
      </div>

      <button onClick={handleLogout}>Logout</button>
      <br /><br />
      <a href="/upload">Upload</a><br /><br />
      <a href="/users">View all users</a>
      <br />
      <a href="/allposts">View all posts</a>
    </div>
  );
};

export default Profile;
