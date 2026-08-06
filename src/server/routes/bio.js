import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

router.post("/", async (req, res) => {
  const { name, keywords, platform, tone, emoji } = req.body;

  try {
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
    res.status(500).json({ error: "Error generating bio" });
  }
});

export default router;
