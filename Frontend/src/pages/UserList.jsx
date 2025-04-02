import React, { useState, useEffect } from "react";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users", {
          withCredentials: true,
        });
        setUsers(response.data.users); // Set users in state
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle follow action
  const handleFollow = async (username) => {
    try {
      await axios.post(`http://localhost:3000/follow/${username}`, {}, {
        withCredentials: true,
      });
      alert(`You are now following ${username}`);
      // Optionally, refetch users or update state for following status
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  // Handle unfollow action
  const handleUnfollow = async (username) => {
    try {
      await axios.post(`http://localhost:3000/unfollow/${username}`, {}, {
        withCredentials: true,
      });
      alert(`You have unfollowed ${username}`);
      // Optionally, refetch users or update state for unfollowing status
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>All Users</h2>
      <div>
        {users.map((user) => (
          <div key={user.username} style={{ marginBottom: "20px" }}>
            <img
              src={user.profilepicture}
              alt="Profile Picture"
              width="50"
              height="50"
              style={{ borderRadius: "50%" }}
            />
            <a href={`/profile/${user.username}`} style={{ marginLeft: "10px" }}>
              {user.username}
            </a>
            <div>
              {/* Button to follow/unfollow user */}
              <button onClick={() => handleFollow(user.username)}>Follow</button>
              <button onClick={() => handleUnfollow(user.username)}>Unfollow</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;