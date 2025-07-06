import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../api';

const Upload = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("media", media);
    formData.append("caption", caption);

    try {
      const response = await axios.post(
        `${API_URL}/post`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      navigate(`/profile/${response.data.user.username}`);
    } catch (err) {
      console.error("Error uploading post:", err);
      setError(err.response?.data?.message || "Error uploading post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <style>{`
        .upload-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #000000;
          color: #e0e0e0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0 10px;
        }
        .upload-card {
          background: #000000;
          border: 1px solid #333;
          padding: 30px;
          width: 400px;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.6);
        }
        .upload-header {
          font-size: 24px;
          font-weight: 600;
          text-align: center;
          margin-bottom: 20px;
          color: #ffffff;
        }
        .error-message {
          color: #ff4444;
          background: rgba(255, 68, 68, 0.1);
          padding: 10px;
          border-radius: 6px;
          margin-bottom: 20px;
          text-align: center;
        }
        .media-preview {
          width: 100%;
          height: 250px;
          background: #000000;
          border: 2px dashed #444;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          overflow: hidden;
        }
        .media-preview img {
          max-width: 100%;
          max-height: 100%;
          
        }
        .input-group {
          margin-bottom: 15px;
        }
        .input-group label {
          display: block;
          font-size: 14px;
          margin-bottom: 5px;
          color: #ccc;
        }
        .input-group input[type="file"],
        .input-group input[type="text"] {
          width: 100%;
          padding: 8px;
          background-color: #000000;
          color: #fff;
          border: 1px solid #444;
          border-radius: 6px;
          font-size: 14px;
        }
        .input-group input::placeholder {
          color: #aaa;
        }
        .submit-btn {
          width: 100%;
          padding: 10px;
          background: #0095f6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.3s;
        }
        .submit-btn:hover {
          background: #007acc;
        }
        .submit-btn:disabled {
          background: #666;
          cursor: not-allowed;
        }
      `}</style>

      <form className="upload-card" onSubmit={handleSubmit}>
        <div className="upload-header">Create New Post</div>
        {error && <div className="error-message">{error}</div>}

        <div className="media-preview">
          {media ? (
            <img src={URL.createObjectURL(media)} alt="preview" />
          ) : (
            <svg
              aria-label="Media Icon"
              fill="currentColor"
              height="77"
              viewBox="0 0 97.6 77.3"
              width="96"
              style={{ color: "#666" }}
            >
              <title>Media Icon</title>
              <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"></path>
              <path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"></path>
              <path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"></path>
            </svg>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="media">Choose Image</label>
          <input
            id="media"
            type="file"
            accept="image/*"
            onChange={(e) => setMedia(e.target.files[0])}
          />
        </div>

        <div className="input-group">
          <label htmlFor="caption">Caption</label>
          <input
            id="caption"
            type="text"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload Post"}
        </button>
      </form>
    </div>
  );
};

export default Upload;
