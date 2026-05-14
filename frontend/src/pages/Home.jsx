import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Base URL for API — reads from environment or defaults to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Home() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Fetch all posts when the component loads
  useEffect(() => {
    axios
      .get(`${API_URL}/posts`)
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load posts. Is the backend running?");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="status-msg">Loading posts...</p>;
  if (error)   return <p className="status-msg error">{error}</p>;

  return (
    <div className="page">
      {/* Hero banner */}
      <div className="hero">
        <h1>Welcome to BlogSphere</h1>
        <p>Explore stories on Technology, Travel, Lifestyle & Space</p>
      </div>

      {/* Posts grid */}
      {posts.length === 0 ? (
        <p className="status-msg">No posts yet. <Link to="/create">Create the first one!</Link></p>
      ) : (
        <div className="posts-grid">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

// --- PostCard sub-component ---
function PostCard({ post }) {
  // Format the date nicely
  const date = new Date(post.createdAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "short", day: "numeric",
  });

  // Truncate content for preview
  const preview = post.content.length > 150
    ? post.content.substring(0, 150) + "..."
    : post.content;

  return (
    <div className="card">
      {/* Post image */}
      {post.image && (
        <img src={post.image} alt={post.title} className="card-img" />
      )}

      <div className="card-body">
        {/* Category badge */}
        <span className="badge">{post.category || "General"}</span>

        <h2 className="card-title">{post.title}</h2>
        <p className="card-preview">{preview}</p>

        <div className="card-footer">
          <span className="card-author">✍ {post.author}</span>
          <span className="card-date">📅 {date}</span>
        </div>

        <Link to={`/posts/${post._id}`} className="btn btn-primary">
          Read More →
        </Link>
      </div>
    </div>
  );
}

export default Home;
