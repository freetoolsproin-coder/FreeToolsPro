import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument } from "pdf-lib";
import OpenAI from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "../server/.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

app.use(cors());
app.use(express.json({ limit: "4mb" }));

const upload = multer({ storage: multer.memoryStorage() });

const SUPPORTED_LANGUAGES = ["Hindi", "Telugu", "English"];
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const GROQ_MODEL = process.env.GROQ_PDF_MODEL || process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

function createGroqClient() {
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: GROQ_BASE_URL,
  });
}

function normalizePages(translated, expectedLength) {
  const list = translated.map((p) => String(p ?? ""));
  if (list.length === expectedLength) return list;
  if (list.length > expectedLength) return list.slice(0, expectedLength);
  while (list.length < expectedLength) list.push("");
  return list;
}

async function translateOnePage(client, pageText, targetLanguage) {
  const completion = await client.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      {
        role: "system",
        content: `You translate document text into ${targetLanguage}. Preserve paragraph breaks, lists, numbers, names, and dates. Output only the translated text with no commentary.`,
      },
      {
        role: "user",
        content: pageText || "(empty page)",
      },
    ],
  });
  return completion.choices[0]?.message?.content?.trim() || "";
}

async function translatePagesGroq(client, sourcePages, targetLanguage) {
  if (sourcePages.length === 1) {
    return [await translateOnePage(client, sourcePages[0], targetLanguage)];
  }

  try {
    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `Translate every document page into ${targetLanguage}. Preserve structure. Return JSON only: {"pages":["..."]} with exactly ${sourcePages.length} strings in the same order.`,
        },
        {
          role: "user",
          content: JSON.stringify({ pages: sourcePages }),
        },
      ],
    });
    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    if (Array.isArray(parsed.pages) && parsed.pages.length === sourcePages.length) {
      return parsed.pages.map((p) => String(p || ""));
    }
  } catch (bulkErr) {
    console.warn("Bulk PDF translation failed, falling back to per-page:", bulkErr.message);
  }

  const out = [];
  for (let i = 0; i < sourcePages.length; i += 1) {
    out.push(await translateOnePage(client, sourcePages[i], targetLanguage));
  }
  return out;
}

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.post("/merge-pdf", upload.array("files"), async (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const mergedPdf = await PDFDocument.create();
    for (const file of files) {
      const pdf = await PDFDocument.load(file.buffer);
      const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedBytes = await mergedPdf.save();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=merged.pdf");
    res.send(Buffer.from(mergedBytes));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to merge PDFs" });
  }
});

app.post("/api/download", (req, res) => {
  res.json({ success: true, message: "Video fetched!" });
});

app.post("/api/plagiarism", (req, res) => {
  const score = Math.floor(Math.random() * 100);
  res.json({ score, message: "Demo plagiarism check" });
});

app.post("/api/pdf-translate", async (req, res) => {
  const { pages, targetLanguage } = req.body || {};

  if (!Array.isArray(pages) || !pages.length) {
    return res.status(400).json({ error: "Provide document pages to translate." });
  }
  if (!SUPPORTED_LANGUAGES.includes(targetLanguage)) {
    return res.status(400).json({ error: "Supported languages: Hindi, Telugu, English." });
  }
  if (!process.env.GROQ_API_KEY) {
    return res.status(503).json({
      error: "PDF translation is not configured on this server (missing GROQ_API_KEY).",
    });
  }

  const sourcePages = pages.map((page) => String(page || "").slice(0, 12000));
  if (sourcePages.length > 40) {
    return res.status(400).json({ error: "Translate up to 40 pages at a time." });
  }

  try {
    const client = createGroqClient();
    const translated = await translatePagesGroq(client, sourcePages, targetLanguage);
    res.json({
      pages: normalizePages(translated, sourcePages.length),
      via: "groq",
    });
  } catch (error) {
    console.error("PDF translation failed:", error);
    res.status(500).json({
      error:
        error.message ||
        "Could not translate this PDF. Try fewer pages, enable OCR for scanned files, or retry.",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠ GROQ_API_KEY not set — /api/pdf-translate will return 503");
  }
});
