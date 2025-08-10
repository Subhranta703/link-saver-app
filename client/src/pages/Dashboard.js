import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddBookmark from "../utils/addBookmark";

export default function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchBookmarks();
    }
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookmarks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (Array.isArray(data)) {
        setBookmarks(data);
      } else {
        setBookmarks([]);
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setBookmarks([]);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookmarks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting bookmark:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-blue-600 text-white p-4 shadow-lg">
        <h1 className="text-xl font-bold tracking-wide">📌 Link Saver</h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
        >
          Logout
        </button>
      </div>

      {/* Add Bookmark */}
      <div className="max-w-2xl mx-auto mt-6">
        <AddBookmark
          onBookmarkAdded={(newBookmark) =>
            setBookmarks((prev) => [newBookmark, ...prev])
          }
        />
      </div>

      {/* Bookmark List */}
      <div className="max-w-2xl mx-auto mt-8 space-y-4 pb-10">
        {bookmarks.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No bookmarks yet. Start adding some!
          </p>
        ) : (
          bookmarks.map((b) => (
            <div
              key={b._id}
              className="flex items-start gap-4 p-5 bg-white/90 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200"
            >
              <img
                src={`https://www.google.com/s2/favicons?domain=${b.url}&sz=64`}
                alt="favicon"
                className="w-12 h-12 rounded-lg border border-gray-200"
              />
              <div className="flex-1">
                <a
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-lg text-blue-700 hover:underline"
                >
                  {b.title || b.url}
                </a>
                <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">
                  {b.summary}
                </p>
              </div>
              <button
                onClick={() => deleteBookmark(b._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow-sm transition-all duration-200"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
