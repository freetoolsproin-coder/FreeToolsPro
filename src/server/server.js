import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 🔍 Health check
app.get("/", (req, res) => {
  res.send("Server working ✅");
});

// 🔑 Validate API key on startup
if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY missing in .env");
}

// 🤖 API route
app.post("/api/bio", async (req, res) => {
  const { name, keywords, platform, tone, emoji } = req.body;

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
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
      model: "gpt-4.1-mini",
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
