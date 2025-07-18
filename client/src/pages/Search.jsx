import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch, FaHeart } from 'react-icons/fa';
import { API } from "./api";

function Search() {
  const [filters, setFilters] = useState({
    age: '',
    gender: '',
    religion: '',
    profession: '',
    location: '',
  });

  const [matches, setMatches] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('${API}/api/auth/search', filters, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatches(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch matches.');
    }
  };

  const handleSendInterest = async (receiverId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `${API}/api/auth/interest`,
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Interest sent!');
    } catch (err) {
      if (err.response?.status === 409) {
        alert("You've already sent interest to this user.");
      } else {
        alert('Failed to send interest.');
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-rose-100 via-peach-100 to-purple-100 p-6 overflow-hidden">
      {/* Moving Background Animation */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-72 h-72 bg-pink-300 opacity-30 rounded-full animate-pulse top-1/4 left-10 blur-3xl"></div>
        <div className="absolute w-96 h-96 bg-purple-200 opacity-30 rounded-full animate-ping top-1/3 right-10 blur-3xl"></div>
        <div className="absolute w-80 h-80 bg-rose-200 opacity-40 rounded-full animate-pulse bottom-0 left-1/3 blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-4xl font-romantic text-center text-rose-600 mb-10">
          Find Your Perfect Match
        </h2>

        {/* Filter Form */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-3 gap-4 bg-white/40 backdrop-blur-lg p-6 rounded-xl shadow-lg mb-8"
        >
          <input name="age" placeholder="Age" onChange={handleChange} className="p-3 rounded-xl bg-white/70 placeholder-gray-700 focus:outline-none" />
          <select name="gender" onChange={handleChange} className="p-3 rounded-xl bg-white/70 text-gray-700 focus:outline-none">
            <option value="">Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>
          <input name="religion" placeholder="Religion" onChange={handleChange} className="p-3 rounded-xl bg-white/70 placeholder-gray-700 focus:outline-none" />
          <input name="profession" placeholder="Profession" onChange={handleChange} className="p-3 rounded-xl bg-white/70 placeholder-gray-700 focus:outline-none" />
          <input name="location" placeholder="Location" onChange={handleChange} className="p-3 rounded-xl bg-white/70 placeholder-gray-700 focus:outline-none" />

          <button
            onClick={handleSearch}
            className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-4 py-3 flex items-center justify-center gap-2 transition"
          >
            <FaSearch /> Search
          </button>
        </motion.div>

        {/* Match Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-rose-100"
            >
              <h3 className="text-2xl font-semibold text-rose-600">{user.name}</h3>
              <p className="text-gray-700">Age: {user.age}</p>
              <p className="text-gray-700">Gender: {user.gender}</p>
              <p className="text-gray-700">Religion: {user.religion}</p>
              <p className="text-gray-700">Profession: {user.profession}</p>
              <p className="text-gray-700">Location: {user.location}</p>
              <p className="italic text-sm text-gray-600">"{user.interests}"</p>
              <button
                onClick={() => handleSendInterest(user.id)}
                className="mt-4 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <FaHeart /> Send Interest
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;