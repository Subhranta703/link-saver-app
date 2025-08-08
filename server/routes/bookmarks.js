// server/routes/bookmarks.js
const express = require("express");
const Bookmark = require("../models/Bookmark");
const auth = require("../middleware/authMiddleware");
const fetch = require("node-fetch");

const router = express.Router();

async function fetchSummary(url) {
  try {
    const encoded = encodeURIComponent(url);
    const res = await fetch(`https://r.jina.ai/${encoded}`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok) {
      throw new Error(`Jina API error: ${res.status}`);
    }

    return await res.text();
  } catch (err) {
    console.error("Summary fetch failed:", err.message);
    return "Summary not available.";
  }
}

// GET bookmarks
router.get("/", auth, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
});

// POST bookmark
router.post("/", auth, async (req, res) => {
  try {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    if (!/^https?:\/\//i.test(url)) {
      url = "https://" + url;
    }

    let title = url;
    let favicon = "";

    try {
      const html = await fetch(url).then(r => r.text());
      title = html.match(/<title>(.*?)<\/title>/)?.[1] || url;
      favicon = new URL("/favicon.ico", url).href;
    } catch (err) {
      console.warn("Metadata fetch failed:", err.message);
    }

    const summary = await fetchSummary(url);

    const bookmark = await Bookmark.create({
      userId: req.userId,
      url,
      title,
      favicon,
      summary,
    });

    res.status(201).json(bookmark);
  } catch (err) {
    console.error("Bookmark save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE bookmark
router.delete("/:id", auth, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete bookmark" });
  }
});

module.exports = router;
