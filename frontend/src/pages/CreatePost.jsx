import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Available categories
const CATEGORIES = ["Technology", "Travel", "Lifestyle", "Space", "General"];

function CreatePost() {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title:    "",
    content:  "",
    author:   "",
    category: "General",
    image:    "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  // Update form field values
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
      setError("Title, content, and author are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/posts`, formData);
      alert("Post created successfully!");
      navigate(`/posts/${res.data._id}`); // Go to the new post
    } catch (err) {
      setError("Failed to create post. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="page">
      <div className="form-container">
        <h1 className="form-title">Create New Post</h1>
        <p className="form-subtitle">Share your thoughts with the world</p>

        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="post-form">

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a catchy title..."
              className="form-input"
            />
          </div>

          {/* Author */}
          <div className="form-group">
            <label htmlFor="author">Author Name *</label>
            <input
              id="author"
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Your name"
              className="form-input"
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Image URL (optional) */}
          <div className="form-group">
            <label htmlFor="image">Image URL (optional)</label>
            <input
              id="image"
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="form-input"
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your blog post here..."
              className="form-textarea"
              rows={10}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? "Publishing..." : "Publish Post"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreatePost;
