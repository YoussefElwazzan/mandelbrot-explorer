const mongoose = require("mongoose");

const snapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, default: "Untitled snapshot", trim: true },
    imageData: { type: String, required: true }, // base64 JPEG data URL
    coordinates: {
      cx: { type: Number, required: true },
      cy: { type: Number, required: true },
      scale: { type: Number, required: true },
    },
    palette: { type: String, default: "fire" },
    maxIter: { type: Number, default: 100 },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Snapshot", snapshotSchema);
