# Mandelbrot Explorer

An interactive full-stack web application for exploring the Mandelbrot set fractal. Zoom infinitely into one of mathematics' most beautiful objects, save your favorite views as snapshots, and share them with the community.

**Live Demo:** [mandelbrot-explorer-pi.vercel.app](https://mandelbrot-explorer-pi.vercel.app)

---

## Screenshots

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/ef6ba1ee-4fc4-4367-a973-c5095ab4ec97" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7fadb1fc-7a72-4cb2-b993-65b7600004bc" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6260c5d0-46d4-41ce-8d87-e8fa71778d16" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/fc87e494-dded-4705-90b2-ebade78981d9" />

---

## Features

- **Interactive fractal renderer** — real-time Mandelbrot set rendered pixel-by-pixel using the HTML5 Canvas API
- **Infinite zoom** — scroll to zoom, click and drag to pan, with no limit on depth
- **Keyboard shortcuts** — press `Z` to zoom in and `X` to zoom out, both centered on the cursor position
- **Color palettes** — switch between Fire, Ocean, Psychedelic, and Grayscale
- **Adjustable iteration depth** — slider from 50 to 500 iterations controls boundary detail
- **Snapshot saving** — capture the current view as an image and store it with its exact coordinates
- **Public gallery** — browse snapshots shared by all users
- **User authentication** — register, log in, and manage your own snapshots
- **Fully responsive** — works on desktop, tablet, and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Bootstrap 5, HTML5 Canvas |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Authentication | JWT (JSON Web Tokens) + bcrypt |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Project Structure

```
mandelbrot-explorer/
├── mandelbrot/                   # React frontend (Create React App)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Canvas.jsx        # Mandelbrot renderer + snapshot saving
│       │   └── Navbar.jsx        # Responsive navigation bar
│       ├── context/
│       │   └── AuthContext.jsx   # Global auth state (React Context + JWT)
│       ├── pages/
│       │   ├── Home.jsx          # Landing page
│       │   ├── Explorer.jsx      # Fractal explorer page
│       │   ├── Gallery.jsx       # Public snapshot gallery
│       │   ├── Login.jsx         # Login form
│       │   ├── Register.jsx      # Registration form
│       │   ├── Profile.jsx       # User's saved snapshots
│       │   ├── About.jsx         # Math explanation + tech stack
│       │   └── NotFound.jsx      # 404 page
│       └── App.js                # Routing + layout
│
└── server/                       # Node.js backend
    ├── models/
    │   ├── User.js               # User schema (bcrypt password hashing)
    │   └── Snapshot.js           # Snapshot schema
    ├── routes/
    │   ├── auth.js               # POST /api/auth/register, /api/auth/login
    │   └── snapshots.js          # CRUD endpoints for snapshots
    ├── middleware/
    │   └── authMiddleware.js     # JWT verification for protected routes
    └── index.js                  # Express server entry point
```

---

## Getting Started Locally

### Prerequisites

- Node.js v18 or higher
- A [MongoDB Atlas](https://mongodb.com/atlas) account and cluster (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/YoussefElwazzan/mandelbrot-explorer.git
cd mandelbrot-explorer
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mandelbrot?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
CLIENT_URL=http://localhost:3000
PORT=5000
```

Start the server:

```bash
node index.js
```

You should see:
```
Connected to MongoDB
Server running on port 5000
```

### 3. Set up the frontend

Open a new terminal:

```bash
cd mandelbrot
npm install
```

Create a `.env` file inside the `mandelbrot` folder:

```
REACT_APP_API_URL=http://localhost:5000
```

Start the React app:

```bash
npm start
```

The app will open at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Create a new account |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/snapshots/public` | No | Get all public snapshots |
| GET | `/api/snapshots/mine` | Yes | Get the logged-in user's snapshots |
| POST | `/api/snapshots` | Yes | Save a new snapshot |
| DELETE | `/api/snapshots/:id` | Yes | Delete a snapshot (owner only) |

---

## How the Mandelbrot Set Works

Every pixel on screen corresponds to a complex number `c = x + yi`. Starting from `z = 0`, the formula `z → z² + c` is applied repeatedly. If the result stays bounded (never escapes past a distance of 2 from the origin), the point belongs to the set and is colored black. If it escapes, the pixel is colored based on how many steps it took — producing the vivid patterns at the boundary.

The check `x² + y² > 4` (equivalent to distance > 2, without the slow square root) is the escape condition used in the renderer.

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Z` | Zoom in at cursor position |
| `X` | Zoom out at cursor position |
| Scroll wheel | Zoom in / out |
| Click + drag | Pan around |

---

## Deployment

The application is deployed across three cloud services:

- **Vercel** — hosts the React frontend, auto-deploys on every push to `main`
- **Railway** — hosts the Node.js backend, auto-deploys on every push to `main`
- **MongoDB Atlas** — cloud-hosted database, always running

---

## License

This project was built as a university web development course project.
