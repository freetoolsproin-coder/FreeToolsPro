import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

// 🔍 Health check
app.get("/", (req, res) => {
  res.send("Server working ✅");
});

// 🔑 Validate API key on startup
if (!process.env.GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing in .env");
}

// 🤖 API route
app.post("/api/bio", async (req, res) => {
  const { name, keywords, platform, tone, emoji } = req.body;

  try {
    const client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const prompt = `
Generate 3 ${platform} bios for:
Name: ${name}
Keywords: ${keywords}
Tone: ${tone}
Include emoji: ${emoji}
Keep them short and catchy.
`;

    const response = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0].message.content;

    const bios = text.split("\n").filter((b) => b.trim() !== "");

    res.json({ bios });
  } catch (err) {
    console.error("🔥 FULL ERROR:", err);
    res.status(500).json({
      error: err.message || "Backend error",
    });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
