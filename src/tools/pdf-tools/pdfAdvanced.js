import Tesseract from "tesseract.js";
import { PDFDocument } from "pdf-lib";
import {
  extractPdfTextByPage,
  loadPdfDocument,
  parsePageRange,
} from "./pdfShared";

const OCR_LANG = {
  Word: "eng",
  DOCX: "eng",
  Hindi: "hin+eng",
  Telugu: "tel+eng",
  English: "eng",
};

export function downloadBytes(filename, bytes) {
  const blob = bytes instanceof Blob ? bytes : new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function loadPdfLib(file, ignoreEncryption = true) {
  return PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption });
}

export async function getPdfPageCount(file) {
  const doc = await loadPdfLib(file);
  return doc.getPageCount();
}

export async function renderPageToDataUrl(file, pageNumber, scale = 1.5) {
  const pdf = await loadPdfDocument(file);
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  return canvas.toDataURL("image/jpeg", 0.85);
}

export async function renderPdfThumbnails(file, max = 12, scale = 0.35) {
  const pdf = await loadPdfDocument(file);
  const limit = Math.min(pdf.numPages, max);
  const thumbs = [];
  for (let i = 1; i <= limit; i += 1) {
    thumbs.push({ page: i, dataUrl: await renderPageToDataUrl(file, i, scale) });
  }
  return { thumbs, total: pdf.numPages };
}

export async function ocrPageFromPdf(file, pageNumber, lang = "eng") {
  const pdf = await loadPdfDocument(file);
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvas, canvasContext: ctx, viewport }).promise;
  const result = await Tesseract.recognize(canvas, lang, {
    logger: () => {},
    // Full core registers legacy params referenced by hin/tel traineddata configs
    // (avoids "Parameter not found: segsearch_max_futile_classifications").
    legacyCore: true,
  });
  return (result.data.text || "").trim();
}

export async function extractTextAdvanced(file, options = {}) {
  const {
    pageRange = "",
    useOcr = false,
    ocrLang = "eng",
    onProgress = () => {},
  } = options;

  const { pages: allPages, numPages } = await extractPdfTextByPage(file);
  const indexes =
    parsePageRange(pageRange, numPages).length > 0
      ? parsePageRange(pageRange, numPages)
      : Array.from({ length: numPages }, (_, i) => i);

  const output = [];
  for (let i = 0; i < indexes.length; i += 1) {
    const idx = indexes[i];
    let text = allPages[idx] || "";
    if (useOcr || !text.trim()) {
      onProgress(Math.round(((i + 0.5) / indexes.length) * 90));
      text = await ocrPageFromPdf(file, idx + 1, ocrLang);
    }
    output.push(text);
    onProgress(Math.round(((i + 1) / indexes.length) * 90));
  }

  return { pages: output, numPages: indexes.length, pageIndexes: indexes };
}

export async function rebuildPdf(file, { pageIndexes = null, rotateMap = {} } = {}) {
  const source = await loadPdfLib(file);
  const total = source.getPageCount();
  const indexes = pageIndexes ?? Array.from({ length: total }, (_, i) => i);
  const output = await PDFDocument.create();
  const copied = await output.copyPages(source, indexes);
  copied.forEach((page, i) => {
    const sourceIndex = indexes[i];
    const rotation = rotateMap[sourceIndex];
    if (rotation) page.setRotation(rotation);
    output.addPage(page);
  });
  return output.save();
}

export async function compressPdfBytes(file, level = "medium") {
  const source = await loadPdfLib(file);
  const output = await PDFDocument.create();
  const pages = await output.copyPages(source, source.getPageIndices());
  pages.forEach((p) => output.addPage(p));

  const useObjectStreams = level === "light";
  return output.save({
    useObjectStreams,
    addDefaultPage: false,
  });
}

export function chunkPageIndexes(total, chunkSize) {
  const chunks = [];
  for (let start = 0; start < total; start += chunkSize) {
    chunks.push(
      Array.from({ length: Math.min(chunkSize, total - start) }, (_, i) => start + i)
    );
  }
  return chunks;
}

export function parseSplitRanges(input, totalPages) {
  const raw = String(input || "").trim();
  if (!raw) return [Array.from({ length: totalPages }, (_, i) => i)];
  return raw
    .split("|")
    .map((segment) => parsePageRange(segment.trim(), totalPages))
    .filter((group) => group.length > 0);
}

export function countWords(text) {
  return String(text || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function resolveOcrLang(language) {
  return OCR_LANG[language] || "eng";
}
