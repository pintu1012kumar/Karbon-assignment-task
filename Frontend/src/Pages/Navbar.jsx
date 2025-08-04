import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export default function Navbar({ onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/user")
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        }
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  return (
    <div className="flex justify-between items-center  mb-6  pb-3 pt-3 px-6">
      <h1 className="text-2xl font-bold text-blue-500"> My Notes</h1>

      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-gray-200">{user.name}</span>
          </div>
        )}
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
