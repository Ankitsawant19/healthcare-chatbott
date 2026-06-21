const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Backend is working");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Received:", message);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are a healthcare chatbot.

Rules:
1. Suggest simple home remedies only.
2. Suggest OTC medicines only.
3. Never suggest antibiotics.
4. If serious symptoms, advise doctor consultation.
5. Keep answers short and simple.

User symptoms: ${message}
      `
    });

    console.log("AI Response:", response.text);

    res.json({
      reply: response.text
    });

  } catch (error) {
    console.log("Gemini Error:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});