require("dotenv").config(); // loads .env variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const snapshotRoutes = require("./routes/snapshots");

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5000" }));
app.use(express.json({ limit: "5mb" })); // allow large base64 image payloads

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/snapshots", snapshotRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "Mandelbrot API running." }));

// ── Connect to MongoDB, then start the server ────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
