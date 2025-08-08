// server/models/Bookmark.js
const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  url: String,
  title: String,
  favicon: String,
  summary: String,
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);
