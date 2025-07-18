import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUserCircle, FaHeart, FaEnvelope, FaEye, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { API } from "./api";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    axios
      .get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => {
        console.error("Token validation error:", err.response?.data || err.message);
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);

  if (!user) return <p className="p-10 text-center text-lg font-medium">Loading...</p>;

  const profilePhotoURL = user.photo
    ? `http://localhost:5000${user.photo}`
    : null;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-50 via-rose-100 to-pink-200 font-elegant">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-64 bg-rose-100 text-rose-800 p-6 space-y-6 fixed md:relative z-10 ${
          sidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="text-2xl font-bold text-center">💖 MatchMe</div>
        <nav className="space-y-4">
          <a href="/dashboard" className="flex items-center space-x-3 hover:text-rose-600">
            <FaUserCircle /> <span>Dashboard</span>
          </a>
          <a href="/complete-profile" className="flex items-center space-x-3 hover:text-rose-600">
            <FaUserEdit /> <span>Complete Profile</span>
          </a>
          <a href="/search" className="flex items-center space-x-3 hover:text-rose-600">
            <FaHeart /> <span>Find Match</span>
          </a>
          <a href="/interests" className="flex items-center space-x-3 hover:text-rose-600">
            <FaEnvelope /> <span>Interests</span>
          </a>
          <a
            href="#"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex items-center space-x-3 hover:text-rose-600"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </a>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64">
        <div className="flex justify-between items-center bg-white shadow-md p-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
            ☰
          </button>
          <div className="flex items-center space-x-3">
            {profilePhotoURL ? (
              <img
                src={profilePhotoURL}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-rose-400"
              />
            ) : (
              <FaUserCircle className="text-2xl text-rose-500" />
            )}
            <span className="font-medium">{user.name}</span>
          </div>
        </div>

        {/* Main Area */}
        <div className="p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h1 className="text-3xl font-bold text-rose-600 mb-2">Welcome, {user.name}!</h1>
            <p className="text-rose-800">Your journey to love starts here. 💗</p>
            <a
              href="/complete-profile"
              className="inline-block mt-4 text-rose-500 hover:underline"
            >
              Go to Profile Form →
            </a>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="bg-rose-100 text-rose-900 rounded-2xl shadow p-4"
            >
              <FaEye className="text-xl mb-2" />
              <h2 className="text-lg font-semibold">Profile Views</h2>
              <p className="text-2xl font-bold">12</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-rose-100 text-rose-900 rounded-2xl shadow p-4"
            >
              <FaHeart className="text-xl mb-2" />
              <h2 className="text-lg font-semibold">Matches</h2>
              <p className="text-2xl font-bold">5</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="bg-rose-100 text-rose-900 rounded-2xl shadow p-4"
            >
              <FaEnvelope className="text-xl mb-2" />
              <h2 className="text-lg font-semibold">Messages</h2>
              <p className="text-2xl font-bold">3</p>
            </motion.div>
          </div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="bg-white rounded-2xl shadow p-6"
          >
            <h2 className="text-xl font-semibold text-rose-600 mb-2">Recent Activity</h2>
            <p className="text-rose-900">You viewed 2 new profiles and received 1 interest 💌</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
