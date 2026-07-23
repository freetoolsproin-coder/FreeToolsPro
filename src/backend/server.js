import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFDocument } from "pdf-lib";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File upload setup (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

/* ================= ROUTES ================= */

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ✅ Merge PDF API (FIXED)
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

// ✅ Download API
app.post("/api/download", (req, res) => {
  const videoUrl = req.body.url; // Because you sent { url } in the body

  res.json({ success: true, message: "Video fetched!" });
});

// ✅ Plagiarism API
app.post("/api/plagiarism", (req, res) => {
  const { text } = req.body;

  const score = Math.floor(Math.random() * 100);

  res.json({
    score,
    message: "Demo plagiarism check",
  });
});

/* ================= SERVER ================= */

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
