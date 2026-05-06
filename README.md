# Stray Animal Tracker

A community web app for reporting and tracking stray animals and lost pets. Instead of relying on social media and word of mouth, community members can view and update animal listings on a shared live map — reporting strays, marking them as cared for, and logging when they've been reunited with their owner.

---

## Live URLs

| | URL |
|---|---|
| **Front-end** | [https://ahouse74.github.io/capstone/](https://ahouse74.github.io/capstone/) |
| **Back-end API** | [https://capstone-server-production.up.railway.app](https://capstone-server-production.up.railway.app) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Front-end | Vue 3 (Vite) + Vue Router + Pinia |
| Map | Leaflet.js (OpenStreetMap) |
| Back-end | Node.js + Express.js |
| Database | MongoDB Atlas + Mongoose |
| Deployment | GitHub Pages (front-end) + Railway (back-end) |

---

## Local Setup

### Prerequisites

- Node.js v24 or later
- npm
- A MongoDB Atlas account with a cluster

---

### 1. Clone the repositories

This project uses two separate repos — one for the front-end, one for the back-end.

```bash
# Front-end
git clone https://github.com/ahouse74/capstone
cd capstone

# Back-end (separate repo)
git clone https://github.com/ahouse74/capstone-server
cd capstone-server
```

---

### 2. Set up the back-end

```bash
cd capstone-server
npm install
```

Create a `.env` file in the root of `capstone-server/`:

```
MONGO_URI=your_mongodb_connection_string_here
PORT=5000
```

Start the server:

```bash
npm run dev
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

---

### 3. Set up the front-end

```bash
cd capstone/client
npm install
```

Create a `.env.development` file inside the `client/` folder:

```
VITE_API_URL=http://localhost:5000
```

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. Both the back-end and front-end servers need to be running at the same time.

---

## API Routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/animals` | List all animals |
| GET | `/api/animals/:id` | Get a single animal |
| GET | `/api/animals/:id/comments` | Get comments for an animal |
| POST | `/api/animals` | Create a new animal listing |
| POST | `/api/animals/:id/comments` | Add a comment to a listing |
| PATCH | `/api/animals/:id` | Update an animal's status |