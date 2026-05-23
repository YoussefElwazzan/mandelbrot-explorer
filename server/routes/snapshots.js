const express = require("express");
const Snapshot = require("../models/Snapshot");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/snapshots/public  — no auth required
router.get("/public", async (req, res) => {
  try {
    const snapshots = await Snapshot.find({ isPublic: true })
      .populate("userId", "username") // join user info
      .sort({ createdAt: -1 }) // newest first
      .limit(100);
    res.json(snapshots);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// GET /api/snapshots/mine  — requires auth
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const snapshots = await Snapshot.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(snapshots);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// POST /api/snapshots  — requires auth
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, imageData, coordinates, palette, maxIter, isPublic } =
      req.body;

    if (!imageData || !coordinates)
      return res
        .status(400)
        .json({ message: "imageData and coordinates are required." });

    const snapshot = await Snapshot.create({
      userId: req.user._id,
      title,
      imageData,
      coordinates,
      palette,
      maxIter,
      isPublic,
    });

    res.status(201).json(snapshot);
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

// DELETE /api/snapshots/:id  — requires auth, must own the snapshot
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const snapshot = await Snapshot.findById(req.params.id);
    if (!snapshot)
      return res.status(404).json({ message: "Snapshot not found." });

    // Only the owner can delete
    if (snapshot.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized." });

    await snapshot.deleteOne();
    res.json({ message: "Deleted." });
  } catch (err) {
    res.status(500).json({ message: "Server error.", error: err.message });
  }
});

module.exports = router;
