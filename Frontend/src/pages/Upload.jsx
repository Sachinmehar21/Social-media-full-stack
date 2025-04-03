import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Upload = () => {
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media) return;

    const formData = new FormData();
    formData.append("media", media);
    formData.append("caption", caption);

    try {
      const response = await axios.post(
        "http://localhost:3000/post",
        formData,
        { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
      );
      navigate(`/profile/${response.data.user.username}`);
    } catch (err) {
      console.error("Error uploading post:", err);
    }
  };

  return (
    <div>
      <h1>Upload</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="media">Media</label>
          <input
            id="media"
            type="file"
            name="media"
            accept="image/*"
            onChange={(e) => setMedia(e.target.files[0])}
          />
        </div>
        <div>
          <label htmlFor="caption">Caption</label>
          <input
            id="caption"
            type="text"
            name="caption"
            placeholder="Enter caption"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Upload; 