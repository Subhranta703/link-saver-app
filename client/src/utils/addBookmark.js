import { useState } from "react";

export default function AddBookmark({ onBookmarkAdded }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const addBookmark = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    let aiSummary = "Summary not available.";

    try {
      // Step 1: Clean the URL to ensure it has a protocol
      let cleanUrl = url.trim();
      if (!/^https?:\/\//i.test(cleanUrl)) {
        cleanUrl = "http://" + cleanUrl;
      }

      // Step 2: Get AI summary from Jina AI (NO double http issue)
      const encodedUrl = encodeURIComponent(cleanUrl);
      const summaryRes = await fetch(`https://r.jina.ai/${encodedUrl}`, {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      if (summaryRes.ok) {
        aiSummary = await summaryRes.text();
      } else {
        console.warn("Jina AI summary fetch failed:", summaryRes.status);
      }

      // Step 3: Save bookmark to backend
      const res = await fetch("http://localhost:5000/api/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: cleanUrl, summary: aiSummary }),
      });

      const data = await res.json();

      // Step 4: Update parent component
      if (onBookmarkAdded) {
        onBookmarkAdded(data);
      }

      setUrl("");
    } catch (err) {
      console.error("Error adding bookmark:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white/80 backdrop-blur-sm shadow-lg rounded-2xl border border-gray-200">
      <form onSubmit={addBookmark} className="flex gap-3">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a link to save..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          } text-white px-5 py-2 rounded-lg shadow-md font-semibold transition-all duration-200`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>
    </div>
  );
}
