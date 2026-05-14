// =============================================
//  MERN Blog Platform - Backend (server.js)
//  Simple Express + MongoDB REST API
// =============================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/blogdb";

// ---- Middleware ----
app.use(cors());
app.use(express.json());

// ---- MongoDB Connection ----
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    seedPosts(); // Seed sample posts on startup
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ---- Post Schema & Model ----
const postSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  author:    { type: String, required: true },
  category:  { type: String, default: "General" },
  image:     { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model("Post", postSchema);

// ---- Seed Data (6 fictional blog posts) ----
async function seedPosts() {
  const count = await Post.countDocuments();
  if (count > 0) return; // Don't seed if posts already exist

  const samplePosts = [
    {
      title: "The Future of Quantum Computing",
      content:
        "Quantum computing is no longer science fiction. In 2024, researchers at several leading labs achieved what many called 'quantum advantage' — the point where a quantum machine solves problems faster than any classical computer ever could.\n\nThe key breakthrough involves stabilizing qubits at room temperature, which has historically been the biggest challenge. Earlier systems required cooling to near absolute zero, making them impractical for widespread use.\n\nWith these advances, industries from pharmaceuticals to finance are racing to adopt quantum algorithms. Drug discovery, which once took decades, could now be simulated in days. Financial risk models that took hours could run in seconds.\n\nThe question is no longer 'if' but 'when' quantum computing becomes mainstream. Experts predict commercially viable quantum computers within the next five years.",
      author: "Dr. Ananya Mehta",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    },
    {
      title: "Backpacking Through the Hidden Villages of Himachal Pradesh",
      content:
        "Most tourists who visit Himachal Pradesh stick to Manali and Shimla. But venture deeper into the valleys, and you'll discover a world untouched by mass tourism.\n\nI spent three weeks trekking through villages like Tirthan, Jibhi, and Shangarh — places where guesthouses are run by local families, where dinner is whatever the farm produced that day, and where the night sky is so clear you feel like you could reach out and touch the Milky Way.\n\nThe people here are extraordinarily warm. In one village, a shepherd invited me for chai and ended up teaching me to make traditional Himachali dham, a festive meal served on leaf plates.\n\nIf you want to travel slowly and meaningfully, skip the tourist circuit. Pack light, learn a few words of Pahadi, and just start walking. The real Himachal is waiting.",
      author: "Rohan Desai",
      category: "Travel",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    },
    {
      title: "How I Rebuilt My Morning Routine from Scratch",
      content:
        "Two years ago, I was waking up at 9am, immediately checking my phone, and feeling behind before the day had even started. Productivity hacks and 5am club culture felt like too much. So I tried something different: I built a routine that actually fit my life.\n\nThe first thing I changed was removing my phone from the bedroom entirely. An old-fashioned alarm clock replaced it. Those first quiet 30 minutes — just coffee and a journal — changed everything.\n\nI stopped treating breakfast as optional. A proper meal at the table, not at the desk, became a ritual that signaled 'the day is beginning properly.'\n\nI also stopped optimizing every minute. Some mornings I read. Some I walk. The consistency isn't in the activity — it's in the pace. Slow, intentional, unhurried.\n\nThe result? I get more done, feel less anxious, and actually enjoy mornings now.",
      author: "Priya Nair",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80",
    },
    {
      title: "Voyager 1: Humanity's Farthest Journey",
      content:
        "Launched in 1977, Voyager 1 is now over 24 billion kilometers from Earth — so far that a radio signal traveling at the speed of light takes more than 22 hours to reach it. And yet, it still talks to us.\n\nEngineers at NASA's Jet Propulsion Laboratory recently decoded a strange pattern in Voyager's transmissions — the spacecraft had begun using backup thrusters that hadn't fired in 37 years. Remarkably, they worked.\n\nWhat makes Voyager extraordinary isn't just its distance. It's that a machine built with 1970s technology, powered by a plutonium generator producing less electricity than a light bulb, is still returning scientific data from interstellar space.\n\nAboard Voyager is a golden record — sounds and images of Earth, a message in a bottle cast into the cosmic ocean. Somewhere beyond our solar system, that record is still traveling, carrying the sound of rain, of Bach, of a mother's first words to her newborn child.",
      author: "Vikram Iyer",
      category: "Space",
      image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    },
    {
      title: "Why Every Developer Should Learn Linux",
      content:
        "When I started my first job as a junior developer, I was terrified of the terminal. My team lead would SSH into servers and type commands faster than I could read them. Three months later, I was doing the same.\n\nLinux isn't just an operating system — it's a philosophy. Everything is a file. Programs do one thing and do it well. You understand what your computer is actually doing.\n\nFor cloud deployments, Linux is unavoidable. AWS EC2, Google Cloud VMs, Azure instances — they all run Linux by default. If you can't navigate a Linux server, you'll always be dependent on someone else to deploy your work.\n\nStart small. Install Ubuntu on an old laptop or spin up a free-tier VM. Learn ls, cd, grep, and chmod. Then learn vim (yes, really). Within a month, the terminal will feel like home, and you'll wonder how you ever worked without it.",
      author: "Aditya Kulkarni",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80",
    },
    {
      title: "The Astronaut Who Grew Plants in Space",
      content:
        "In 2015, Scott Kelly became the first person to eat food grown entirely in space. The crop: red romaine lettuce, cultivated under LED lights in a special growth chamber aboard the International Space Station.\n\nIt sounds simple. It wasn't. Growing plants in microgravity requires solving problems that don't exist on Earth. Water doesn't drain — it clings to roots and can suffocate them. Air circulation has to be mechanical because warm air doesn't rise. Even choosing the right soil substitute took years of research.\n\nBut the results were more than nutritional. Studies showed that tending to plants had measurable positive effects on astronaut mental health. In the sterile, confined environment of the ISS, a patch of green became something precious.\n\nAs missions to Mars are planned, the ability to grow food in space moves from experiment to necessity. The lettuce Kelly ate may be the ancestor of the crops that feed the first Martian colony.",
      author: "Dr. Sneha Pillai",
      category: "Space",
      image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
    },
  ];

  await Post.insertMany(samplePosts);
  console.log("🌱 Sample posts seeded successfully");
}

// =============================================
//  REST API ROUTES
// =============================================

// GET /posts — Fetch all posts (newest first)
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /posts/:id — Fetch a single post by ID
app.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST /posts — Create a new post
app.post("/posts", async (req, res) => {
  try {
    const { title, content, author, category, image } = req.body;
    const newPost = new Post({ title, content, author, category, image });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ error: "Failed to create post" });
  }
});

// DELETE /posts/:id — Delete a post by ID
app.delete("/posts/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
