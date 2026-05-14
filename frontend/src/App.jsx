import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/posts/:id"  element={<PostDetail />} />
          <Route path="/create"     element={<CreatePost />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© 2024 BlogSphere · Built with MERN Stack</p>
      </footer>
    </div>
  );
}

export default App;
