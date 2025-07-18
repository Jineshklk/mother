import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { API } from "./api";

function CompleteProfile() {
  const [form, setForm] = useState({
    age: "",
    gender: "",
    religion: "",
    profession: "",
    location: "",
    interests: "",
  });
  const [photo, setPhoto] = useState(null); // New photo state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      // Step 1: Save profile info
      await axios.put(`${API}/api/auth/profile`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Step 2: Upload photo if provided
      if (photo) {
        const formData = new FormData();
        formData.append("photo", photo);

        await axios.post(`${API}/api/auth/upload-photo`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      alert("Profile updated!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-profileTheme bg-cover bg-center font-elegant text-white px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-white/30 border border-white/20 shadow-xl rounded-3xl p-8 w-full max-w-xl"
      >
        <h2 className="text-3xl font-romantic text-rose-500 text-center mb-6">
          Complete Your Profile
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />

          <select
            name="gender"
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 text-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            type="text"
            name="religion"
            placeholder="Religion"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />

          <input
            type="text"
            name="profession"
            placeholder="Profession"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />

          <textarea
            name="interests"
            placeholder="Interests (e.g., music, travel, cooking)"
            onChange={handleChange}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-400"
            rows={3}
          ></textarea>

          {/* 📷 Profile Photo Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="w-full file:bg-rose-500 file:text-white file:rounded-xl file:px-4 file:py-2 file:border-none file:cursor-pointer bg-white/20 p-3 rounded-xl text-white/80"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-4 rounded-xl transition"
          >
            Save Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default CompleteProfile;
