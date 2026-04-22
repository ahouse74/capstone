# Step-by-Step Setup Guide

This guide documents exactly how to set this project up from scratch on a new machine.

---

## Part 1: Back-End Setup

### Prerequisites

- **Node.js** v24 or later (check with `node -v`)
- **npm** (comes with Node)
- **VS Code** with the **Thunder Client** extension installed
- **nodemon** (installed locally as a dev dependency — no global install needed)
- A **MongoDB Atlas** account with a cluster created

---

### Clone the Repo and Install Dependencies

```bash
git clone https://github.com/ahouse74/capstone
cd capstone
npm install
```

This installs all dependencies listed in `package.json`, including:
- `express` — web server framework
- `mongoose` — MongoDB object modelling
- `dotenv` — loads environment variables from `.env`
- `nodemon` (dev) — auto-restarts the server on file changes

---

### Configure the `.env` File

Create a file called `.env` in the project root. **This file must never be committed to GitHub** — confirm `.env` is listed in `.gitignore` before doing anything else.

```
MONGO_URI=mongodb://ajhouse05_db_user:jeqzavuTYeeJ9jMf@ac-pfrgqh0-shard-00-00.mtvabyg.mongodb.net:27017,ac-pfrgqh0-shard-00-01.mtvabyg.mongodb.net:27017,ac-pfrgqh0-shard-00-02.mtvabyg.mongodb.net:27017/?ssl=true&replicaSet=atlas-job1jg-shard-0&authSource=admin&appName=capstone
PORT=5000
```

**Variable reference:**

| Variable | What it is |
|---|---|
| `MONGO_URI` | The full connection string for your MongoDB Atlas cluster. Get this from Atlas → Connect → Connect your application. Use the standard (`mongodb://`) string, not the SRV (`mongodb+srv://`) version if you experience DNS/`querySrv` errors on your network. |
| `PORT` | The local port the Express server listens on. `5000` works fine; change it if something else is already using that port. |

> ⚠️ Never paste real credentials into this file when sharing or committing. The `.env` file stays local only.

---

### Connect to MongoDB Atlas

Before starting the server, make sure Atlas will accept your connection:

1. Log in to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Go to **Network Access** in the left sidebar
3. Click **Add IP Address** → **Allow Access From Anywhere** (`0.0.0.0/0`) → **Confirm**
4. Go to **Database Access** and confirm your database user exists with read/write permissions
5. Go to **Database** and confirm your cluster is active (free-tier clusters pause after inactivity — click **Resume** if needed)

If you see a `querySrv ECONNREFUSED` error when starting the server, switch to the standard connection string format (`mongodb://`) instead of the SRV format (`mongodb+srv://`). You can get this from Atlas → Connect → Connect your application → select the standard string option.

---

### Project Structure

```
capstone/
├── models/
│   ├── Animal.js       # Mongoose schema for animals
│   └── Comment.js      # Mongoose schema for comments
├── routes/
│   └── animals.js      # All /api/animals route handlers
├── .env                # Local environment variables (never commit)
├── .gitignore
├── server.js           # Entry point — connects to DB and starts Express
└── package.json
```

---

### Start the Server

```bash
npm run dev
```

You should see:

```
Connected to MongoDB
Server running on port 5000
```

If you see `DB connection failed`, check:
- Your `MONGO_URI` in `.env` is correct and has no quotes or extra spaces
- Your IP is whitelisted in Atlas Network Access
- Your cluster is not paused

---

### API Routes Reference

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/animals` | List all animals |
| GET | `/api/animals/:id` | Get a single animal |
| GET | `/api/animals/:id/comments` | Get all comments for an animal |
| POST | `/api/animals` | Create a new animal listing |
| POST | `/api/animals/:id/comments` | Add a comment to an animal |
| PATCH | `/api/animals/:id` | Update an animal's status |

---

### Test Routes in Thunder Client

Thunder Client is a VS Code extension. Install it from the Extensions tab if you haven't already.

**Workflow:**

1. Start the server with `npm run dev`
2. Click the thunder bolt icon in the VS Code sidebar
3. Click **New Request**

**Step 1 — Create an animal (do this first to get an `_id`):**
- Method: `POST`
- URL: `http://localhost:5000/api/animals`
- Body tab → JSON:
```json
{
  "name": "Luna",
  "species": "Dog",
  "description": "Very fluffy"
}
```
- Copy the `_id` value from the response — you'll use it for all routes below.

**Step 2 — Test the remaining routes:**

| Route | Method | URL | Body |
|---|---|---|---|
| List all | GET | `http://localhost:5000/api/animals` | none |
| Get one | GET | `http://localhost:5000/api/animals/<_id>` | none |
| Add comment | POST | `http://localhost:5000/api/animals/<_id>/comments` | `{ "author": "Alice", "body": "So cute!" }` |
| Get comments | GET | `http://localhost:5000/api/animals/<_id>/comments` | none |
| Update status | PATCH | `http://localhost:5000/api/animals/<_id>` | `{ "status": "adopted" }` |

**Expected status codes:**

| Code | Meaning |
|---|---|
| `200 OK` | Successful GET or PATCH |
| `201 Created` | Successful POST |
| `400 Bad Request` | Missing a required field |
| `404 Not Found` | The ID doesn't exist |
| `500` | Server error — check the terminal |

---

## Part 2: Front-End Setup

> *To be completed during Week 14.*

### Scaffold the Vite Project

```bash
# placeholder — update with actual commands used
npm create vite@latest client -- --template react
cd client
npm install
```

### Configure the API URL

Create a `.env` file inside the `client/` folder:

```
VITE_API_URL=http://localhost:5000
```

> In production this will point to your Railway URL instead. Never hardcode the URL directly in your components — always use `import.meta.env.VITE_API_URL`.

### Run the Dev Server

```bash
npm run dev
```

### Verify Front-End Connects to Back-End

- *Document what you checked here — e.g. a fetch call that returns data, a component that renders animals from the API, etc.*

---

## Part 3: Deployment

> *To be completed during Week 15.*

### Deploy the Back-End to Railway

1. Push your back-end code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
3. Select your repo
4. *Document remaining steps here once completed*

### Set Environment Variables in Railway

In the Railway dashboard → your service → **Variables** tab, add:

| Variable | Value |
|---|---|
| `MONGO_URI` | Your Atlas connection string |
| `PORT` | Railway sets this automatically — you may not need to add it |

### Deploy the Front-End to GitHub Pages

- *Document steps here once completed*

### Link Front-End to Deployed Back-End

Update the `VITE_API_URL` in your front-end deployment settings to point to your Railway URL:

```
VITE_API_URL=https://your-app.up.railway.app
```

### CORS Configuration

When the front-end and back-end are on different domains, you'll need to allow cross-origin requests. Install the `cors` package:

```bash
npm install cors
```

Add to `server.js`:

```js
const cors = require('cors');
app.use(cors({ origin: 'https://your-github-pages-url' }));
```

- *Update with your actual URLs once deployed*