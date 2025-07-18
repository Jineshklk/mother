import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaUserCircle,
  FaHeart,
  FaEnvelope,
  FaSignOutAlt,
  FaUserEdit,
} from 'react-icons/fa';
import { API } from "./api";

function Interests() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [interests, setInterests] = useState({ sent: [], received: [] });
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    axios
      .get(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        alert('Session expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/login';
      });

    fetchInterests();
  }, []);

  const fetchInterests = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/interests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setInterests(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch interests.');
    }
  };

  const handleAction = async (id, status) => {
    try {
      await axios.put(
        `${API}/api/auth/interest/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchInterests();
    } catch (err) {
      alert('Failed to update interest status.');
    }
  };

  if (!user) return <p className="p-10 text-center text-lg font-medium">Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300 font-elegant">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`w-64 bg-white/80 text-rose-800 p-6 space-y-6 fixed md:relative z-10 ${
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
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="flex items-center space-x-3 hover:text-rose-600"
          >
            <FaSignOutAlt /> <span>Logout</span>
          </a>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-6 space-y-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-rose-700"
        >
          💌 Your Interests
        </motion.h1>

        {/* Sent Interests */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-rose-600">Sent Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interests.sent.length === 0 ? (
              <p className="text-gray-600">No interests sent yet.</p>
            ) : (
              interests.sent.map(({ id, status, receiver }) => (
                <motion.div
                  key={id}
                  className="bg-white rounded-xl shadow p-4 space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg font-bold">{receiver.name}</h3>
                  <p>Age: {receiver.age}</p>
                  <p>Gender: {receiver.gender}</p>
                  <p>Location: {receiver.location}</p>
                  <p className="italic text-sm text-gray-500">Status: {status || 'pending'}</p>
                  <a
                    href={`/messages/${receiver.id}`}
                    className="text-rose-600 underline text-sm"
                  >
                    Message
                  </a>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Received Interests */}
        <section>
          <h2 className="text-xl font-semibold mb-3 text-rose-600">Received Interests</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interests.received.length === 0 ? (
              <p className="text-gray-600">No interests received yet.</p>
            ) : (
              interests.received.map(({ id, status, sender }) => (
                <motion.div
                  key={id}
                  className="bg-white rounded-xl shadow p-4 space-y-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-lg font-bold">{sender.name}</h3>
                  <p>Age: {sender.age}</p>
                  <p>Gender: {sender.gender}</p>
                  <p>Location: {sender.location}</p>
                  <p className="italic text-sm text-gray-500">Status: {status || 'pending'}</p>

                  <a
                    href={`/messages/${sender.id}`}
                    className="text-rose-600 underline text-sm"
                  >
                    Message
                  </a>

                  {status !== 'accepted' && status !== 'rejected' && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleAction(id, 'accepted')}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleAction(id, 'rejected')}
                        className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Interests;
