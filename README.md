# 🌐 BlogSphere — MERN Stack Blogging Platform

A simple, beginner-friendly full-stack blogging platform built with the **MERN stack** (MongoDB, Express, React, Node.js).  
Built for a **Cloud Computing practical assignment** demonstrating how to deploy a MERN application across **two separate AWS EC2 instances**.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Features](#-features)
3. [Technologies Used](#-technologies-used)
4. [Project Structure](#-project-structure)
5. [Two-EC2 Architecture](#-two-ec2-architecture)
6. [Local Setup](#-local-setup)
7. [API Endpoints](#-api-endpoints)
8. [AWS Deployment — Step by Step](#-aws-deployment--step-by-step)
   - [Phase 1 — Create Both EC2 Instances](#phase-1--create-both-ec2-instances)
   - [Phase 2 — Configure Security Groups](#phase-2--configure-security-groups)
   - [Phase 3 — Deploy Backend on EC2 #1](#phase-3--deploy-backend-on-ec2-1)
   - [Phase 4 — Deploy Frontend on EC2 #2](#phase-4--deploy-frontend-on-ec2-2)
   - [Phase 5 — Verify Everything Works](#phase-5--verify-everything-works)
9. [Environment Variables](#-environment-variables)
10. [Common Errors & Fixes](#-common-errors--fixes)
11. [Quick Reference Cheatsheet](#-quick-reference-cheatsheet)

---

## 📖 Project Overview

BlogSphere is an online blogging platform where users can:
- Browse blog posts about **Technology, Travel, Lifestyle, and Space**
- Read full blog post details
- Create and publish new blog posts
- Delete existing posts


## ✅ Features

| Feature | Status |
|---|---|
| View all blog posts on homepage | ✅ |
| View single blog post detail | ✅ |
| Create a new blog post | ✅ |
| Delete a blog post | ✅ |
| 6 pre-seeded sample posts | ✅ |
| Responsive design (mobile + desktop) | ✅ |
| REST API backend | ✅ |
| MongoDB data storage | ✅ |

---

## 🛠️ Technologies Used

### Backend (runs on EC2 #1)
| Package | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework / REST API |
| Mongoose | MongoDB object modeling |
| MongoDB | NoSQL database |
| CORS | Allows frontend EC2 to call backend EC2 |
| dotenv | Load environment variables from .env |

### Frontend (runs on EC2 #2)
| Package | Purpose |
|---|---|
| React 18 | UI library |
| Vite | Build tool |
| React Router DOM | Client-side routing |
| Axios | HTTP requests to backend API |

---

Project Structure

```
blogsphere/
 ├── backend/
 │    ├── server.js          ← All backend code (single file)
 │    ├── package.json
 │    └── .env.example
 │
 ├── frontend/
 │    ├── src/
 │    │    ├── pages/
 │    │    │    ├── Home.jsx          ← Lists all posts
 │    │    │    ├── PostDetail.jsx    ← Single post + delete
 │    │    │    └── CreatePost.jsx    ← Create post form
 │    │    ├── components/
 │    │    │    └── Navbar.jsx
 │    │    ├── App.jsx
 │    │    ├── main.jsx
 │    │    └── index.css
 │    ├── index.html
 │    ├── vite.config.js
 │    ├── package.json
 │    └── .env.example
 │
 └── README.md
```


Two-EC2 Architecture

This deployment splits the application across **two separate Ubuntu EC2 instances** on AWS:

```
                        INTERNET
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
   ┌─────────────────────┐   ┌─────────────────────┐
   │   EC2 Instance #1   │   │   EC2 Instance #2   │
   │   (Backend Server)  │   │  (Frontend Server)  │
   │                     │   │                     │
   │  • Node.js          │◄──│  • React (built)    │
   │  • Express API      │   │  • Served via serve  │
   │  • MongoDB          │   │                     │
   │                     │   │  Port: 3000         │
   │  Port: 5000 (API)   │   │  Public IP: X.X.X.X │
   │  Port: 27017 (Mongo)│   └─────────────────────┘
   │  Public IP: Y.Y.Y.Y │          Users visit
   └─────────────────────┘     http://X.X.X.X:3000
```

**How they communicate:**  
The React frontend (on EC2 #2) makes HTTP API calls to the Express backend (on EC2 #1) using EC2 #1's public IP address. MongoDB lives on EC2 #1 alongside the backend.

**Why two instances?**  
This demonstrates real-world cloud architecture where the frontend and backend run on separate servers — a common pattern in production deployments.

---

## 💻 Local Setup

Follow these steps to run the app on your **local machine** before deploying to AWS.

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [MongoDB Community](https://www.mongodb.com/try/download/community) installed locally **OR** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free account

### Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/blogsphere.git
cd blogsphere
```

### Step 2 — Run the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env → set MONGO_URI=mongodb://localhost:27017/blogdb
node server.js
```

Expected output:
```
✅ Connected to MongoDB
🌱 Sample posts seeded successfully
🚀 Server running at http://localhost:5000
```

### Step 3 — Run the Frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env → VITE_API_URL=http://localhost:5000
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📡 API Endpoints

The backend API runs on **port 5000**.

| Method | Endpoint | Description | Body Required |
|---|---|---|---|
| `GET` | `/posts` | Get all posts (newest first) | No |
| `GET` | `/posts/:id` | Get one post by ID | No |
| `POST` | `/posts` | Create a new post | Yes (JSON) |
| `DELETE` | `/posts/:id` | Delete a post by ID | No |

### POST /posts — Request Body

```json
{
  "title":    "My Blog Title",
  "content":  "Full blog post content here...",
  "author":   "Your Name",
  "category": "Technology",
  "image":    "https://example.com/image.jpg"
}
```

### Test with curl

```bash
# Get all posts
curl http://<BACKEND_IP>:5000/posts

# Create a post
curl -X POST http://<BACKEND_IP>:5000/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"Hello","content":"My first post","author":"Alice","category":"General"}'

# Delete a post
curl -X DELETE http://<BACKEND_IP>:5000/posts/<post_id>
```

---

## ☁️ AWS Deployment — Step by Step

> **Before you start:** You need an AWS account. The free tier (`t2.micro` or `t3.micro`) is sufficient for this assignment.

---

### Phase 1 — Create Both EC2 Instances

You will create **two EC2 instances** — one for the backend, one for the frontend.

#### 1.1 — Log in to AWS Console

Go to [https://console.aws.amazon.com](https://console.aws.amazon.com) and sign in.

#### 1.2 — Navigate to EC2

In the search bar at the top, type **EC2** and click on it.

#### 1.3 — Launch EC2 Instance #1 (Backend)

Click the orange **"Launch Instance"** button and fill in the following:

| Setting | Value |
|---|---|
| **Name** | `blogsphere-backend` |
| **AMI** | Ubuntu Server 22.04 LTS (Free Tier eligible) |
| **Instance Type** | t2.micro (Free Tier) |
| **Key pair** | Click "Create new key pair" → name it `blogsphere-key` → Key pair type: RSA → Format: .pem → click "Create" → the `.pem` file downloads automatically. **Keep it safe — you cannot download it again.** |
| **Security Group** | Select "Create security group" → name it `backend-sg` |
| **Storage** | 8 GB (default) |

Click **"Launch Instance"**.

#### 1.4 — Launch EC2 Instance #2 (Frontend)

Click **"Launch Instance"** again and fill in:

| Setting | Value |
|---|---|
| **Name** | `blogsphere-frontend` |
| **AMI** | Ubuntu Server 22.04 LTS |
| **Instance Type** | t2.micro |
| **Key pair** | Select the **existing** `blogsphere-key` (same key for both instances) |
| **Security Group** | Create new → name it `frontend-sg` |
| **Storage** | 8 GB |

Click **"Launch Instance"**.

#### 1.5 — Write Down Both Public IPs

Go to **EC2 → Instances** in the left sidebar. Wait until both instances show the **"Running"** state (green dot).

Click on each instance and find the **Public IPv4 address**. Write them down:

```
EC2 #1  Name: blogsphere-backend   Public IP: ___________________  
EC2 #2  Name: blogsphere-frontend  Public IP: ___________________
```

> 💡 AWS assigns new public IPs every time you **stop and start** an instance (not reboot). If the IP changes, update `VITE_API_URL` in the frontend `.env` and rebuild. For a permanent IP, see **Elastic IPs** in the AWS docs.

---

### Phase 2 — Configure Security Groups

Security Groups act as firewalls. By default they block everything — you need to open the specific ports the app uses.

#### 2.1 — Open Ports for Backend Security Group (`backend-sg`)

1. In the AWS Console, go to **EC2 → Security Groups** (in the left sidebar under "Network & Security")
2. Find `backend-sg` in the list and click on it
3. Click the **"Inbound rules"** tab at the bottom
4. Click **"Edit inbound rules"**
5. Click **"Add rule"** for each row below:

| Type | Protocol | Port Range | Source | Description |
|---|---|---|---|---|
| SSH | TCP | 22 | My IP | SSH into this instance |
| Custom TCP | TCP | 5000 | Anywhere (0.0.0.0/0) | Backend API — accessible from the internet |

6. Click **"Save rules"**

> 💡 Port 27017 (MongoDB) does **not** need to be opened publicly. MongoDB is accessed only from the same machine (localhost), so it stays closed to the internet. This is more secure.

#### 2.2 — Open Ports for Frontend Security Group (`frontend-sg`)

1. Find `frontend-sg` in the Security Groups list
2. Click the **"Inbound rules"** tab → **"Edit inbound rules"**
3. Add these rules:

| Type | Protocol | Port Range | Source | Description |
|---|---|---|---|---|
| SSH | TCP | 22 | My IP | SSH into this instance |
| Custom TCP | TCP | 3000 | Anywhere (0.0.0.0/0) | React frontend — accessible by users |

4. Click **"Save rules"**

---

### Phase 3 — Deploy Backend on EC2 #1

Everything in this phase is done **on the Backend EC2 instance**.  
Open a terminal on your local machine and SSH in.

#### 3.1 — SSH into Backend EC2

**On Mac or Linux:**
```bash
# Make the key file read-only (SSH requires this)
chmod 400 blogsphere-key.pem

# Connect
ssh -i "blogsphere-key.pem" ubuntu@<BACKEND_EC2_PUBLIC_IP>
```

**On Windows (PowerShell):**
```powershell
ssh -i "C:\Users\YourName\Downloads\blogsphere-key.pem" ubuntu@<BACKEND_EC2_PUBLIC_IP>
```

When it asks "Are you sure you want to continue connecting?" type `yes` and press Enter.

You are now inside EC2 #1. Your terminal prompt will change to something like `ubuntu@ip-xxx:~$`.

---

#### 3.2 — Update System Packages

```bash
sudo apt update && sudo apt upgrade -y
```

This updates all system packages. It may take 1–2 minutes.

---

#### 3.3 — Install Node.js 20

```bash
# Install curl if not already present
sudo apt install -y curl

# Add Node.js 20 repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Confirm installation
node --version    # Expected: v20.x.x
npm --version     # Expected: 10.x.x
```

---

#### 3.4 — Install MongoDB

Run these commands one at a time:

```bash
# 1. Import MongoDB signing key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
  sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# 2. Add the MongoDB package repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] \
  https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Refresh package list and install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# 4. Start MongoDB
sudo systemctl start mongod

# 5. Enable MongoDB to start automatically after a reboot
sudo systemctl enable mongod

# 6. Confirm it's running
sudo systemctl status mongod
```

In the output, look for the line that says `Active: active (running)`. Press `Q` to exit the status view.

---

#### 3.5 — Clone the Project from GitHub

```bash
# Move to home directory
cd ~

# Clone your repository
git clone https://github.com/YOUR_USERNAME/blogsphere.git

# Enter the project directory
cd blogsphere
```

> 💡 If you haven't pushed your code to GitHub yet, do this from your **local machine** first:
> ```bash
> git init
> git add .
> git commit -m "first commit"
> git remote add origin https://github.com/YOUR_USERNAME/blogsphere.git
> git push -u origin main
> ```

---

#### 3.6 — Configure and Install Backend

```bash
# Go to backend folder
cd ~/blogsphere/backend

# Install Node.js dependencies
npm install

# Create the environment file
cp .env.example .env

# Open the .env file for editing
nano .env
```

The file should look like this:

```env
MONGO_URI=mongodb://localhost:27017/blogdb
PORT=5000
```

To save and exit nano: press `Ctrl+X`, then press `Y`, then press `Enter`.

---

#### 3.7 — Test the Backend Manually

```bash
node server.js
```

Expected output:
```
✅ Connected to MongoDB
🌱 Sample posts seeded successfully
🚀 Server running at http://localhost:5000
```

If you see this, the backend is working correctly. Press `Ctrl+C` to stop it.

---

#### 3.8 — Keep Backend Running with PM2

PM2 is a process manager. It keeps Node.js running in the background and restarts it automatically if it crashes or the server reboots.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the backend with PM2
cd ~/blogsphere/backend
pm2 start server.js --name "blog-backend"

# Configure PM2 to start automatically on system reboot
pm2 startup
```

After running `pm2 startup`, it prints a command that starts with `sudo env PATH=...`. **Copy that exact command and run it.** It will look similar to this:

```bash
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

Then save the PM2 process list:

```bash
pm2 save
```

Check everything is running:

```bash
pm2 status
```

Expected output:
```
┌────┬──────────────────┬─────────┬───────┬───────────┐
│ id │ name             │ mode    │ ↺     │ status    │
├────┼──────────────────┼─────────┼───────┼───────────┤
│ 0  │ blog-backend     │ fork    │ 0     │ online    │
└────┴──────────────────┴─────────┴───────┴───────────┘
```

---

#### 3.9 — Confirm API is Reachable

From your **local machine** (not inside the SSH session), run:

```bash
curl http://<BACKEND_EC2_PUBLIC_IP>:5000/posts
```

You should receive a JSON array of 6 blog posts. If you do, **Phase 3 is complete.** ✅

---

### Phase 4 — Deploy Frontend on EC2 #2

**Open a new terminal window** on your local machine. Keep the backend terminal open if you need it. Everything in this phase is done **on the Frontend EC2 instance**.

#### 4.1 — SSH into Frontend EC2

```bash
ssh -i "blogsphere-key.pem" ubuntu@<FRONTEND_EC2_PUBLIC_IP>
```

You are now inside EC2 #2.

---

#### 4.2 — Update System & Install Node.js

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Confirm
node --version
npm --version
```

---

#### 4.3 — Clone the Project

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/blogsphere.git
cd blogsphere
```

---

#### 4.4 — Configure Frontend Environment

```bash
cd ~/blogsphere/frontend

# Install dependencies
npm install

# Create the .env file
cp .env.example .env

# Edit it
nano .env
```

Set the content to point to your **Backend EC2's public IP**:

```env
VITE_API_URL=http://<BACKEND_EC2_PUBLIC_IP>:5000
```

> ⚠️ This is the **most critical step** in the whole deployment. The frontend needs to know where the backend is. Replace `<BACKEND_EC2_PUBLIC_IP>` with the actual IP of EC2 #1.
>
> Example: `VITE_API_URL=http://13.201.45.67:5000`

Save and exit: `Ctrl+X` → `Y` → `Enter`.

---

#### 4.5 — Build the Frontend

```bash
npm run build
```

Vite compiles all React code into a `dist/` folder — this is the deployable version of the frontend.

Expected output:
```
✓ 42 modules transformed.
dist/index.html                  0.46 kB
dist/assets/index-Cx3K7v.js   142.35 kB
✓ built in 4.21s
```

---

#### 4.6 — Install serve and PM2

```bash
# PM2 keeps the process alive
sudo npm install -g pm2

# serve hosts the built React files
sudo npm install -g serve
```

---

#### 4.7 — Start the Frontend with PM2

```bash
cd ~/blogsphere/frontend

# Start serving the built app on port 3000
pm2 start "serve -s dist -l 3000" --name "blog-frontend"

# Auto-start on reboot
pm2 startup
# Copy and run the command PM2 prints

pm2 save

# Verify
pm2 status
```

Expected output:
```
┌────┬──────────────────┬─────────┬───────┬───────────┐
│ id │ name             │ mode    │ ↺     │ status    │
├────┼──────────────────┼─────────┼───────┼───────────┤
│ 0  │ blog-frontend    │ fork    │ 0     │ online    │
└────┴──────────────────┴─────────┴───────┴───────────┘
```

---

### Phase 5 — Verify Everything Works

#### 5.1 — Open the App

In your browser, go to:

```
http://<FRONTEND_EC2_PUBLIC_IP>:3000
```

The BlogSphere homepage should load with 6 blog post cards.

#### 5.2 — Test All Features

Work through each feature to confirm the full stack is connected:

- [ ] Homepage loads and shows all 6 posts (confirms frontend → backend → MongoDB is working)
- [ ] Click **"Read More"** on any card → post detail page opens with full content
- [ ] Click **"+ New Post"** in navbar → fill in the form → click **"Publish Post"** → you are redirected to the new post
- [ ] Go back home → your new post appears in the list
- [ ] On any post detail page → click **"Delete Post"** → post is removed from the list

#### 5.3 — Check PM2 on Both Instances

**On EC2 #1 (backend):**
```bash
pm2 status          # blog-backend → online
pm2 logs blog-backend --lines 20
```

**On EC2 #2 (frontend):**
```bash
pm2 status          # blog-frontend → online
```

If both show `online`, your deployment is complete. 🎉

---

## 🌍 Environment Variables

### backend/.env (on EC2 #1)

```env
# MongoDB is running locally on the same backend EC2 instance
MONGO_URI=mongodb://localhost:27017/blogdb

# Express API port
PORT=5000
```

### frontend/.env (on EC2 #2)

```env
# Must point to EC2 #1's public IP — change this every time the IP changes
VITE_API_URL=http://<BACKEND_EC2_PUBLIC_IP>:5000
```

> ⚠️ `VITE_API_URL` is baked into the frontend at **build time**. If you change `.env`, you must run `npm run build` again and restart PM2.

---

## 🐛 Common Errors & Fixes

### ❌ "Could not load posts. Is the backend running?"

The React frontend cannot reach the backend API.

**Check in order:**

1. Confirm backend is online on EC2 #1:
   ```bash
   pm2 status
   ```
2. Confirm port 5000 is open in `backend-sg` → AWS Console → Security Groups → Inbound rules
3. Confirm `VITE_API_URL` in `frontend/.env` has the correct backend IP
4. Confirm you **rebuilt** the frontend after changing `.env`:
   ```bash
   npm run build && pm2 restart blog-frontend
   ```
5. Test the API directly from your local machine:
   ```bash
   curl http://<BACKEND_IP>:5000/posts
   ```
   If this fails, the issue is the security group or the backend not running.

---

### ❌ MongoDB connection error on startup

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start it if it's stopped
sudo systemctl start mongod

# View error logs
sudo journalctl -u mongod --no-pager | tail -30
```

---

### ❌ Frontend shows a blank white page

The build is missing or `VITE_API_URL` was empty when building.

```bash
# On EC2 #2
cat ~/blogsphere/frontend/.env      # Verify the URL is set correctly
cd ~/blogsphere/frontend
npm run build                        # Rebuild with the correct env
pm2 restart blog-frontend
```

---

### ❌ "Permission denied (publickey)" when SSH-ing

Your `.pem` key file has wrong permissions.

```bash
# On Mac/Linux
chmod 400 blogsphere-key.pem

# Then try SSH again
ssh -i "blogsphere-key.pem" ubuntu@<IP>
```

On **Windows**, right-click the `.pem` file → Properties → Security tab → Advanced → Disable inheritance → Remove all inherited permissions → Add only your own Windows user account with Read permission.

---

### ❌ "Connection refused" on port 5000 or 3000

The port is blocked by the security group.

1. Go to AWS Console → EC2 → Security Groups
2. Click the correct security group (`backend-sg` for port 5000, `frontend-sg` for port 3000)
3. Click **Inbound rules** → **Edit inbound rules**
4. Confirm the port is listed. If not, add it with source `0.0.0.0/0`
5. Click **Save rules** and wait 30 seconds before retrying

---

### ❌ PM2 process shows "errored" status

```bash
# Read the detailed error
pm2 logs blog-backend --lines 50

# Fix the error, then restart
pm2 delete blog-backend
cd ~/blogsphere/backend
pm2 start server.js --name "blog-backend"
pm2 save
```

---

### ❌ EC2 public IP changed after stopping the instance

AWS assigns a new public IP every time you stop and start (not reboot) an instance. The backend IP changing will break the frontend.

**Quick fix:**
```bash
# On EC2 #2 — update the backend IP and rebuild
nano ~/blogsphere/frontend/.env     # Change VITE_API_URL to new backend IP
cd ~/blogsphere/frontend
npm run build
pm2 restart blog-frontend
```

**Permanent fix:** Use an **Elastic IP** in AWS (free while attached to a running instance):
1. AWS Console → EC2 → Elastic IPs → Allocate Elastic IP
2. Select the new IP → Actions → Associate Elastic IP address
3. Select your backend instance → Associate
4. EC2 #1 now has a permanent IP that never changes

---

## 📌 Quick Reference Cheatsheet

### EC2 #1 — Backend (run in order)

```bash
# 1. SSH in
ssh -i "blogsphere-key.pem" ubuntu@<BACKEND_IP>

# 2. Install Node.js
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update && sudo apt install -y mongodb-org
sudo systemctl start mongod && sudo systemctl enable mongod

# 4. Clone and setup
git clone https://github.com/YOUR_USERNAME/blogsphere.git
cd ~/blogsphere/backend
npm install
cp .env.example .env
nano .env
# → Set: MONGO_URI=mongodb://localhost:27017/blogdb  and  PORT=5000

# 5. Start with PM2
sudo npm install -g pm2
pm2 start server.js --name "blog-backend"
pm2 startup   # ← copy and run the command it prints
pm2 save
pm2 status    # confirm: blog-backend is online
```

---

### EC2 #2 — Frontend (open a new terminal)

```bash
# 1. SSH in
ssh -i "blogsphere-key.pem" ubuntu@<FRONTEND_IP>

# 2. Install Node.js
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Clone and setup
git clone https://github.com/YOUR_USERNAME/blogsphere.git
cd ~/blogsphere/frontend
npm install
cp .env.example .env
nano .env
# → Set: VITE_API_URL=http://<BACKEND_EC2_PUBLIC_IP>:5000

# 4. Build
npm run build

# 5. Start with PM2
sudo npm install -g pm2
sudo npm install -g serve
pm2 start "serve -s dist -l 3000" --name "blog-frontend"
pm2 startup   # ← copy and run the command it prints
pm2 save
pm2 status    # confirm: blog-frontend is online
```

---

### Useful PM2 Commands (on either EC2)

```bash
pm2 status                         # See all processes and their status
pm2 logs blog-backend              # View backend logs (live)
pm2 logs blog-frontend             # View frontend logs (live)
pm2 restart blog-backend           # Restart backend
pm2 restart blog-frontend          # Restart frontend
pm2 stop blog-backend              # Stop backend
pm2 delete blog-backend            # Remove from PM2 entirely
pm2 save                           # Save current state (survives reboot)
```

### MongoDB Commands (on EC2 #1)

```bash
sudo systemctl status mongod       # Check if MongoDB is running
sudo systemctl start mongod        # Start MongoDB
sudo systemctl stop mongod         # Stop MongoDB
sudo systemctl restart mongod      # Restart MongoDB
```

### If Backend IP Changes

```bash
# On EC2 #2 only
nano ~/blogsphere/frontend/.env    # Update VITE_API_URL with new IP
cd ~/blogsphere/frontend
npm run build                       # Rebuild (required!)
pm2 restart blog-frontend
```

---

## 📋 AWS Security Group Summary

### backend-sg (attached to EC2 #1)

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | My IP | SSH access |
| 5000 | TCP | 0.0.0.0/0 | Express API — reachable by frontend and curl |

### frontend-sg (attached to EC2 #2)

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | My IP | SSH access |
| 3000 | TCP | 0.0.0.0/0 | React frontend — open to all users |

> MongoDB port 27017 is **not opened** in any security group. It only listens on `localhost` inside EC2 #1, which is the correct and more secure configuration.

---

## 👨‍💻 Author

Built for Cloud Computing Practical Assignment  
MERN Stack — MongoDB · Express · React · Node.js  
Deployed across two AWS EC2 Ubuntu 22.04 instances

---

*This project is for educational purposes only. Not intended for production use.*
