import express from "express";
import OpenAI from "openai";

const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
      model: "gpt-4.1-mini",
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
