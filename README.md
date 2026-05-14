# BlogSphere — MERN Stack Blogging Platform

A simple, beginner-friendly full-stack blogging platform built with the **MERN stack** (MongoDB, Express, React, Node.js).  
Built for a **Cloud Computing practical assignment** demonstrating how to deploy a MERN application across **two separate AWS EC2 instances**.

## Technologies Used

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

## Project Structure

```txt
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

## Why two instances?

### How they communicate:
The React frontend (on EC2 #2) makes HTTP API calls to the Express backend (on EC2 #1) using EC2 #1's public IP address. MongoDB lives on EC2 #1 alongside the backend.

This demonstrates real-world cloud architecture where the frontend and backend run on separate servers — a common pattern in production deployments.

---

# 💻 Local Setup

Follow these steps to run the app on your **local machine** before deploying to AWS.

## Prerequisites
- [Node.js 20+](https://nodejs.org/)
- [MongoDB Community](https://www.mongodb.com/try/download/community) installed locally **OR** a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) free account

## Step 1 — Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/blogsphere.git
cd blogsphere
```

## Step 2 — Run the Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env → set MONGO_URI=mongodb://localhost:27017/blogdb
node server.js
```

Expected output:

```txt
 Connected to MongoDB
 Sample posts seeded successfully
 Server running at http://localhost:5000
```

## Step 3 — Run the Frontend

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

## Test with curl

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

# BlogSphere MERN Deployment Guide on AWS EC2

## Project Architecture

| Server | Purpose | Tech |
|---|---|---|
| EC2 Instance #1 | Backend + Database | Node.js + Express + MongoDB |
| EC2 Instance #2 | Frontend | React + Vite |

---

# PART 1 — Create EC2 Instances

Go to:

https://console.aws.amazon.com/ec2/

---

# Create Backend Instance

Click:

Launch Instance

Fill the details:

| Setting | Value |
|---|---|
| Name | blogsphere-backend |
| AMI | Ubuntu Server 22.04 LTS |
| Instance Type | t3.micro (or t2.micro) |
| Key Pair | Create new → blogsphere-key |
| Security Group | Create → backend-sg |
| Storage | 8 GB |

Download the `.pem` key file.

Click:

Launch Instance

---

# Create Frontend Instance

Again click:

Launch Instance

Fill:

| Setting | Value |
|---|---|
| Name | blogsphere-frontend |
| AMI | Ubuntu Server 22.04 LTS |
| Instance Type | t3.micro |
| Key Pair | Use existing `blogsphere-key` |
| Security Group | Create → frontend-sg |
| Storage | 8 GB |

Click:

Launch Instance

---

# PART 2 — Configure Security Groups

Go to:

EC2 → Security Groups

---

# Backend Security Group

Open:

`backend-sg`

Add inbound rules:

| Type | Port | Source |
|---|---|---|
| SSH | 22 | My IP |
| Custom TCP | 5000 | 0.0.0.0/0 |

Save rules.

---

# Frontend Security Group

Open:

`frontend-sg`

Add inbound rules:

| Type | Port | Source |
|---|---|---|
| SSH | 22 | My IP |
| Custom TCP | 3000 | 0.0.0.0/0 |

Save rules.

---

# PART 3 — Copy Public IPs

Go to:

EC2 → Instances

Copy:

- Backend Public IPv4
- Frontend Public IPv4

Example:

```txt
Backend IP: 13.xx.xx.xx
Frontend IP: 43.xx.xx.xx
```

Keep these safely.

---

# PART 4 — Connect to Backend EC2

## Windows PowerShell

```powershell
ssh -i "C:\Users\YOURNAME\Downloads\blogsphere-key.pem" ubuntu@BACKEND_IP
```

---

## Mac/Linux

```bash
chmod 400 blogsphere-key.pem

ssh -i "blogsphere-key.pem" ubuntu@BACKEND_IP
```

Type:

```bash
yes
```

---

# PART 5 — Update Ubuntu

```bash
sudo apt update && sudo apt upgrade -y
```

---

# PART 6 — Install Node.js

```bash
sudo apt install -y curl

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

sudo apt install -y nodejs
```

Verify:

```bash
node -v
npm -v
```

---

# PART 7 — Install MongoDB

Run commands one-by-one:

```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
```

```bash
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
```

```bash
sudo apt update
```

```bash
sudo apt install -y mongodb-org
```

```bash
sudo systemctl start mongod
```

```bash
sudo systemctl enable mongod
```

Check status:

```bash
sudo systemctl status mongod
```

You should see:

```txt
active (running)
```

Press:

```txt
Q
```

---

# PART 8 — Clone Project on Backend EC2

Inside backend EC2 terminal:

```bash
cd ~
```

```bash
git clone https://github.com/YOUR_USERNAME/BlogSphere.git
```

```bash
cd BlogSphere/backend
```

---

# PART 9 — Configure Backend

Install dependencies:

```bash
npm install
```

Install CORS:

```bash
npm install cors
```

---

# Enable CORS

Inside `server.js`:

```js
const cors = require("cors");

app.use(cors());
```

---

# Create Environment File

```bash
cp .env.example .env
```

Open:

```bash
nano .env
```

Paste:

```env
MONGO_URI=mongodb://localhost:27017/blogdb
PORT=5000
```

Save:

```txt
Ctrl + X
Y
Enter
```

---

# PART 10 — Test Backend

Run:

```bash
node server.js
```

You should see:

```txt
Connected to MongoDB
Server running on port 5000
```

Stop server:

```txt
Ctrl + C
```

---

# PART 11 — Run Backend with PM2

Install PM2:

```bash
sudo npm install -g pm2
```

Start backend:

```bash
pm2 start server.js --name blog-backend
```

Enable auto-start:

```bash
pm2 startup
```

It prints a command.

Copy and run that command.

Then save PM2:

```bash
pm2 save
```

Check:

```bash
pm2 status
```

You should see:

```txt
online
```

---

# PART 12 — Test Backend API

On your computer:

```bash
curl http://BACKEND_IP:5000/posts
```

You should receive JSON data.

Backend deployment complete.

---

# PART 13 — Connect to Frontend EC2

Open a NEW terminal window.

SSH into frontend server:

```bash
ssh -i "blogsphere-key.pem" ubuntu@FRONTEND_IP
```

---

# PART 14 — Install Node.js on Frontend

```bash
sudo apt update && sudo apt upgrade -y
```

```bash
sudo apt install -y curl
```

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
```

```bash
sudo apt install -y nodejs
```

---

# PART 15 — Clone Frontend Project

```bash
cd ~
```

```bash
git clone https://github.com/YOUR_USERNAME/BlogSphere.git
```

```bash
cd BlogSphere/frontend
```

---

# PART 16 — Configure Frontend

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Open:

```bash
nano .env
```

Paste:

```env
VITE_API_URL=http://BACKEND_IP:5000
```

Example:

```env
VITE_API_URL=http://13.233.100.10:5000
```

Save:

```txt
Ctrl + X
Y
Enter
```

---

# PART 17 — Build Frontend

```bash
npm run build
```

---

# PART 18 — Run Frontend with PM2

Install PM2 and Serve:

```bash
sudo npm install -g pm2
```

```bash
sudo npm install -g serve
```

Start frontend:

```bash
pm2 start "serve -s dist -l 3000" --name blog-frontend
```

Enable startup:

```bash
pm2 startup
```

Run the generated command.

Then:

```bash
pm2 save
```

Check:

```bash
pm2 status
```

You should see:

```txt
online
```

---

# PART 19 — Open Website

Open browser:

```txt
http://FRONTEND_IP:3000
```

Your MERN BlogSphere app should load.

---


# Useful PM2 Commands

## View Running Apps

```bash
pm2 status
```

## View Logs

```bash
pm2 logs
```

## Restart Backend

```bash
pm2 restart blog-backend
```

## Restart Frontend

```bash
pm2 restart blog-frontend
```

## Stop App

```bash
pm2 stop blog-backend
```

---

# Common Errors & Fixes

## Port 5000 Not Working

Check backend security group has:

```txt
Custom TCP → 5000 → 0.0.0.0/0
```

---

## Port 3000 Not Working

Check frontend security group has:

```txt
Custom TCP → 3000 → 0.0.0.0/0
```

---

## MongoDB Not Running

Run:

```bash
sudo systemctl restart mongod
```

Check:

```bash
sudo systemctl status mongod
```

---

## PM2 App Offline

Check logs:

```bash
pm2 logs
```

Restart:

```bash
pm2 restart all
```

---


#  Common Errors & Fixes

##  "Could not load posts. Is the backend running?"

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

##  MongoDB connection error on startup

```bash
# Check MongoDB status
sudo systemctl status mongod

# Start it if it's stopped
sudo systemctl start mongod

# View error logs
sudo journalctl -u mongod --no-pager | tail -30
```

---

##  Frontend shows a blank white page

The build is missing or `VITE_API_URL` was empty when building.

```bash
# On EC2 #2
cat ~/blogsphere/frontend/.env      # Verify the URL is set correctly
cd ~/blogsphere/frontend
npm run build                        # Rebuild with the correct env
pm2 restart blog-frontend
```

---

##  "Permission denied (publickey)" when SSH-ing

Your `.pem` key file has wrong permissions.

```bash
# On Mac/Linux
chmod 400 blogsphere-key.pem

# Then try SSH again
ssh -i "blogsphere-key.pem" ubuntu@<IP>
```

On **Windows**, right-click the `.pem` file → Properties → Security tab → Advanced → Disable inheritance → Remove all inherited permissions → Add only your own Windows user account with Read permission.

---

## "Connection refused" on port 5000 or 3000

The port is blocked by the security group.

1. Go to AWS Console → EC2 → Security Groups
2. Click the correct security group (`backend-sg` for port 5000, `frontend-sg` for port 3000)
3. Click **Inbound rules** → **Edit inbound rules**
4. Confirm the port is listed. If not, add it with source `0.0.0.0/0`
5. Click **Save rules** and wait 30 seconds before retrying

---

## PM2 process shows "errored" status

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

## EC2 public IP changed after stopping the instance

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

## Useful PM2 Commands (on either EC2)

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

# AWS Security Group Summary

## backend-sg (attached to EC2 #1)

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | My IP | SSH access |
| 5000 | TCP | 0.0.0.0/0 | Express API — reachable by frontend and curl |

## frontend-sg (attached to EC2 #2)

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | My IP | SSH access |
| 3000 | TCP | 0.0.0.0/0 | React frontend — open to all users |

> MongoDB port 27017 is **not opened** in any security group. It only listens on `localhost` inside EC2 #1, which is the correct and more secure configuration.

---