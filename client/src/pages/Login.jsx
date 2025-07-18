import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { API } from "./api";
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/api/auth/login`, form);
      localStorage.setItem("token", res.data.token);
      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-md bg-white/10 border border-white/30 shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-white text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder=" "
              required
              className="peer w-full bg-transparent border-b-2 border-white text-white placeholder-transparent focus:outline-none focus:border-blue-300 py-2"
            />
            {form.email === "" && (
              <label className="absolute left-0 top-2 text-white/70 text-sm transition-all">
                Email
              </label>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder=" "
              required
              className="peer w-full bg-transparent border-b-2 border-white text-white placeholder-transparent focus:outline-none focus:border-blue-300 py-2"
            />
            {form.password === "" && (
              <label className="absolute left-0 top-2 text-white/70 text-sm transition-all">
                Password
              </label>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition duration-300"
          >
            Login
          </motion.button>
        </form>
        <p className="text-white/70 mt-4 text-sm text-center">
          Don’t have an account?{" "}
          <a href="/register" className="underline hover:text-white">
            Register
          </a>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
