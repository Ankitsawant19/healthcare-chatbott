"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, Bot, User } from "lucide-react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello 👋 I am your healthcare assistant. Tell me your symptoms."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    console.log("Sending:", input);

    const currentInput = input;

    const userMessage = {
      sender: "user",
      text: currentInput
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: currentInput
      });

      console.log("Response:", res.data);

      const cleanedReply = res.data.reply
  .replace(/\*\*/g, "")   // removes bold **
  .replace(/\*/g, "•");   // converts * to bullet

const botMessage = {
  sender: "bot",
  text: cleanedReply
};

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.log("Frontend Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠ Something went wrong. Please try again."
        }
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white p-5 text-center text-2xl font-bold shadow-md">
          HealthCare Chat Assistant
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] flex gap-3 p-4 rounded-2xl shadow-md ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-green-200 text-black"
                }`}
              >
                {msg.sender === "bot" ? (
                  <Bot size={22} />
                ) : (
                  <User size={22} />
                )}
                <p className="whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-xl shadow text-gray-500 animate-pulse">
                Typing...
              </div>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-white flex gap-3">
          <input
            type="text"
            placeholder="Describe your symptoms..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
            className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl transition"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}