import React, { useState } from "react";
import axios from "axios";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      try {
        const res = await axios.get(`/search/${value}`);
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.warn("Unexpected response:", res.data);
          setUsers([]);
        }
      } catch (err) {
        console.error("Search failed", err);
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
  };

  // Generate images based on screen size
  const imageCount = window.innerWidth >= 1024 ? 44 : 8;

  return (
    <>
      <style>{`
        .container {
          width: 100%;
          min-height: 100vh;
          background-color: #18181b;
          padding: 20px;
          box-sizing: border-box;
        }

        .search-bar {
          border: 2px solid #27272a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          border-radius: 8px;
        }

        .search-icon {
          color: white;
          font-size: 20px;
        }

        .search-input {
          margin-left: 10px;
          width: 100%;
          background-color: #18181b;
          border: none;
          outline: none;
          color: #a1a1aa;
          font-size: 16px;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 16px;
          margin-top: 20px;
        }

        @media (min-width: 1024px) {
          .image-grid {
            grid-template-columns: repeat(7, 1fr);
          }
          .image-grid img {
            height: 160px;
          }
        }

        .image-grid img {
          width: 100%;
          height: 120px;
          object-fit: cover;
          border-radius: 8px;
        }

        .users {
          margin-top: 24px;
        }

        .user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          text-decoration: none;
          color: white;
        }

        .user-pic {
          width: 60px;
          height: 60px;
          border-radius: 9999px;
          overflow: hidden;
          background-color: #bae6fd;
        }

        .user-pic img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info h4 {
          font-size: 12px;
          opacity: 0.5;
          margin: 0;
        }

        .user-info h3 {
          margin: 0;
        }
      `}</style>

      <div className="container">
        {/* Search bar */}
        <div className="search-bar">
          <i className="search-icon ri-search-line" />
          <input
            type="text"
            className="search-input"
            placeholder="Search SpamsAccounts!"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        {/* Images */}
        <div className="image-grid">
          {Array.from({ length: imageCount }, (_, i) => (
            <img
              key={i}
              src={`https://picsum.photos/200/300?random=${i + 1}`}
              alt={`Random ${i + 1}`}
            />
          ))}
        </div>

        {/* Search result users */}
        <div className="users">
          {Array.isArray(users) &&
            users.map((user, i) => (
              <a href="/profile" key={i} className="user-card">
                <div className="user-pic">
                  <img src={`/images/upload/${user.pic}`} alt={user.username} />
                </div>
                <div className="user-info">
                  <h3>{user.username}</h3>
                  <h4>{user.name}</h4>
                </div>
              </a>
            ))}
        </div>
      </div>
    </>
  );
};

export default Search;
