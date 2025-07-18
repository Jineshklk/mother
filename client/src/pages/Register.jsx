import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { API } from "./api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      await axios.post(`${API}/api/auth/register`, form);
      alert("Registered successfully!");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-wedding bg-cover bg-center bg-no-repeat font-elegant">
      {/* Left: Form Card */}
      <div className="flex items-center justify-center bg-white/10 backdrop-blur-md p-8 md:p-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/30 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
        >
          <h2 className="text-4xl font-romantic text-center text-rose-500 mb-6">
            Join Your Match
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 text-white">
            {/* Name */}
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-white/70" />
              <input
                type="text"
                name="name"
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full pl-10 p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-white/70" />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full pl-10 p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-white/70" />
              <input
                type="password"
                name="password"
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full pl-10 p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-white/70" />
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                required
                placeholder="Confirm Password"
                className="w-full pl-10 p-3 rounded-xl bg-white/20 placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-rose-500 hover:bg-rose-600 transition text-white font-semibold py-3 px-4 rounded-xl"
            >
              Register
            </motion.button>
          </form>

          <p className="mt-5 text-sm text-white text-center">
            Already have an account?{" "}
            <a href="/login" className="underline hover:text-white">
              Login
            </a>
          </p>
        </motion.div>
      </div>

      {/* Right: Decorative Empty Space for Image */}
      <div className="hidden md:block"></div>
    </div>
  );
}

export default Register;
