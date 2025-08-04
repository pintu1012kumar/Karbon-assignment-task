import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

axios.defaults.withCredentials = true;

export default function Dashboard() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/user")
      .then((res) => {
        if (!res.data) {
          navigate("/login");
        } else {
          axios
            .get("http://localhost:3000/notes")
            .then((res) => setNotes(res.data))
            .catch((err) => console.error(err));
        }
      })
      .catch(() => navigate("/login"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const addNote = async () => {
    const res = await axios.post("http://localhost:3000/notes", form);
    setNotes([...notes, res.data]);
    setForm({ title: "", content: "" });
  };

  const deleteNote = async (id) => {
    await axios.delete(`http://localhost:3000/notes/${id}`);
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/auth/logout");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (loading)
    return (
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300 text-lg">Loading your notes...</p>
        </div>
      </div>
    );

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen">
      <Navbar onLogout={handleLogout} />
      <div className="min-h-screen">
        <div className="max-w-full mx-auto p-6 flex gap-8 lg:gap-12">
          {/* Left */}
          <div className="flex-1 space-y-6">
            <div className="text-center mb-8">
              <h1 className="font-bold text-4xl lg:text-5xl pb-3 mt-5 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Your Notes Collection
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
            </div>

            {notes.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50">
                <div className="text-6xl mb-4 opacity-50">📝</div>
                <p className="text-gray-400 text-xl font-medium">
                  No notes found...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Create your first note to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {notes.map((note, index) => (
                  <div
                    key={note.id}
                    className="group bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-700/50 hover:border-blue-500/30 w-full max-w-3xl mx-auto transform hover:-translate-y-1"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                      animation: "fadeInUp 0.6s ease-out forwards",
                    }}
                  >
                    {/* Title + Delete Button in same row */}
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300 flex-1 pr-4">
                        {note.title}
                      </h3>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 px-3 py-2 rounded-lg text-sm transition-all duration-300 hover:scale-110"
                        title="Delete note"
                      >
                        <span className="text-red-400 hover:text-red-300">
                          ❌
                        </span>
                      </button>
                    </div>

                    {/* Note Content */}
                    <p className="text-gray-300 leading-relaxed text-base">
                      {note.content}
                    </p>

                    {/* Decorative bottom border */}
                    <div className="mt-4 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Note - Right */}
          <div className="w-96 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 mt-20 border border-gray-700/50 h-fit sticky top-24">
            <div className="text-center mb-6">
              <h1 className="font-bold text-2xl bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-2">
                Create New Note
              </h1>
              <div className="w-16 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 mx-auto rounded-full"></div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  placeholder="Enter note title..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 placeholder-gray-400"
                />
              </div>

              <div className="relative">
                <textarea
                  placeholder="Write your note content here..."
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full bg-gray-700/50 backdrop-blur-sm text-white border border-gray-600/50 rounded-xl px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 placeholder-gray-400"
                />
              </div>

              <button
                onClick={addNote}
                disabled={!form.title.trim() || !form.content.trim()}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:transform-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>✨</span>
                  Add Note
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
