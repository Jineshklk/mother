import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "./api";
function Messages() {
  const { userId } = useParams(); // Receiver userId
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const token = localStorage.getItem("token");

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/api/auth/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      alert("Failed to load messages");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      await axios.post(
        `${API}/api/auth/message`,
        { receiverId: userId, message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInput("");
      fetchMessages(); // Refresh chat
    } catch (err) {
      alert("Message not sent");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 to-pink-200 p-6 flex flex-col font-elegant">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-romantic text-center text-rose-600 mb-4"
      >
        💌 Chat with User #{userId}
      </motion.h2>

      <div className="bg-white shadow-xl rounded-2xl flex-1 p-4 overflow-y-auto mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs px-4 py-2 rounded-2xl ${
              msg.from_self
                ? "bg-rose-400 text-white ml-auto"
                : "bg-rose-100 text-rose-800"
            }`}
          >
            {msg.message}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-xl border border-rose-300 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Messages;
