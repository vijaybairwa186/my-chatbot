const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${"AIzaSyC4CWtQJ2FJ6FYMxmxGYjSvPwMavtgIrcA"}`;
const GEMINI_API_KEY = "AIzaSyC4CWtQJ2FJ6FYMxmxGYjSvPwMavtgIrcA";

app.post('/api/chat', async (req, res) => {
  const { contents } = req.body;
  try {
    const response = await fetch(`${`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${"AIzaSyC4CWtQJ2FJ6FYMxmxGYjSvPwMavtgIrcA"}`}?key=${"AIzaSyC4CWtQJ2FJ6FYMxmxGYjSvPwMavtgIrcA"}`, {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
