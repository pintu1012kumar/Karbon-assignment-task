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
    return <p className="text-center mt-10 text-gray-400">Loading...</p>;

  return (
    <div className="bg-black text-gray-200">
      <Navbar onLogout={handleLogout} />
      <div className=" min-h-screen ">
        <div className="max-w-full mx-auto p-6 flex gap-40">
          <div className="flex-1 space-y-4">
            <div className="text-center mb-8">
              <h1 className="font-bold text-4xl lg:text-5xl pb-3 mt-5 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                My Notes Collection
              </h1>
            </div>

            {notes.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64  ">
                <div className="text-6xl mb-4 opacity-50">📝</div>
                <p className="text-gray-400 text-xl font-medium">
                  No notes found...
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Create your first note to get started!
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-900 p-4 rounded-lg shadow hover:shadow-lg transition border border-gray-700 w-full max-w-2xl mx-auto"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-white">
                      {note.title}
                    </h3>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="  px-3 py-1 rounded text-sm transition"
                    >
                      ❌
                    </button>
                  </div>

                  <p className="text-gray-400 mt-2 text-sm">{note.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="w-100  bg-gray-900 shadow rounded-lg p-4 mt-20 px-10 border border-gray-700 h-fit pb-10">
            <h1 className="font-bold text-2xl pb-3 text-center">
              Create New Note{" "}
            </h1>
            <input
              placeholder="Enter note title..."
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Write your note content here..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded px-3 py-2 mb-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addNote}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition mt-3"
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
