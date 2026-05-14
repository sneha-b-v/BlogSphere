import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function PostDetail() {
  const { id }       = useParams();     // Get post ID from URL
  const navigate     = useNavigate();   // For redirecting after delete
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  // Fetch the single post when component loads
  useEffect(() => {
    axios
      .get(`${API_URL}/posts/${id}`)
      .then((res) => {
        setPost(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Post not found.");
        setLoading(false);
      });
  }, [id]);

  // Delete post handler
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/posts/${id}`);
      alert("Post deleted successfully!");
      navigate("/"); // Go back to home after deletion
    } catch (err) {
      alert("Failed to delete post. Please try again.");
    }
  };

  if (loading) return <p className="status-msg">Loading post...</p>;
  if (error)   return <p className="status-msg error">{error}</p>;
  if (!post)   return null;

  const date = new Date(post.createdAt).toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="page">
      <div className="post-detail">

        {/* Back link */}
        <Link to="/" className="back-link">← Back to all posts</Link>

        {/* Post image */}
        {post.image && (
          <img src={post.image} alt={post.title} className="detail-img" />
        )}

        {/* Category & Meta */}
        <span className="badge">{post.category || "General"}</span>

        <h1 className="detail-title">{post.title}</h1>

        <div className="detail-meta">
          <span><strong>{post.author}</strong></span>
          <span>{date}</span>
        </div>

        {/* Full post content — preserve line breaks */}
        <div className="detail-content">
          {post.content.split("\n").map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          )}
        </div>

        {/* Delete button */}
        <div className="detail-actions">
          <button onClick={handleDelete} className="btn btn-danger">
            🗑 Delete Post
          </button>
        </div>

      </div>
    </div>
  );
}

export default PostDetail;
