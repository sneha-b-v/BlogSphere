import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo / Brand */}
        <Link to="/" className="navbar-brand">
          🌐 BlogSphere
        </Link>

        {/* Navigation links */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/create" className="nav-link nav-link-cta">+ New Post</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
