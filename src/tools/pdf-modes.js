// Options for each PDF tool. Processing lives in components/islands/PdfTool.jsx.
export const PDF_MODES = {
  "pdf-merger": { accept: "application/pdf,.pdf", multiple: true, action: "Merge PDFs", options: [] },
  "pdf-splitter": {
    accept: "application/pdf,.pdf",
    multiple: false,
    action: "Split PDF",
    options: [
      { id: "ranges", label: "Pages to extract", type: "text", def: "1-2", placeholder: "e.g. 1-3, 5, 8-10" },
      { id: "mode", label: "Output", type: "select", def: "one", options: [["one", "All selected pages in one PDF"], ["each", "One PDF per range"], ["every", "Every page as its own PDF"]] },
    ],
  },
  "rotate-pdf": {
    accept: "application/pdf,.pdf",
    multiple: false,
    action: "Rotate and save",
    options: [
      { id: "angle", label: "Rotate by", type: "select", def: "90", options: [["90", "90° clockwise"], ["180", "180°"], ["270", "90° anti-clockwise"]] },
      { id: "which", label: "Pages", type: "select", def: "all", options: [["all", "All pages"], ["odd", "Odd pages"], ["even", "Even pages"], ["list", "Specific pages"]] },
      { id: "list", label: "Page numbers", type: "text", def: "1", placeholder: "e.g. 1, 3-4", show: (o) => o.which === "list" },
    ],
  },
  "jpg-to-pdf": {
    accept: "image/jpeg,image/png,image/webp,image/gif,image/bmp",
    multiple: true,
    action: "Create PDF",
    options: [
      { id: "page", label: "Page size", type: "select", def: "a4", options: [["a4", "A4 portrait"], ["a4l", "A4 landscape"], ["letter", "US Letter"], ["fit", "Same as image"]] },
      { id: "margin", label: "Margin", type: "select", def: "10", options: [["0", "None"], ["10", "Small (10 mm)"], ["20", "Large (20 mm)"]], show: (o) => o.page !== "fit" },
    ],
  },
  "pdf-to-jpg": {
    accept: "application/pdf,.pdf",
    multiple: false,
    action: "Convert pages",
    options: [
      { id: "dpi", label: "Resolution", type: "select", def: "150", options: [["72", "72 DPI (small)"], ["150", "150 DPI (screen)"], ["300", "300 DPI (print)"]] },
      { id: "fmt", label: "Format", type: "select", def: "image/jpeg", options: [["image/jpeg", "JPG"], ["image/png", "PNG"]] },
    ],
  },
  "compress-pdf": {
    accept: "application/pdf,.pdf",
    multiple: false,
    action: "Compress PDF",
    options: [
      {
        id: "level",
        label: "Compression",
        type: "select",
        def: "balanced",
        options: [
          ["high", "High quality (150 DPI, light compression)"],
          ["balanced", "Balanced (110 DPI, recommended)"],
          ["small", "Smallest file (80 DPI, strong compression)"],
          ["target", "Aim for a file size in KB"],
        ],
      },
      { id: "target", label: "Target size (KB)", type: "number", def: 500, min: 20, max: 50000, unit: "KB", show: (o) => o.level === "target" },
      { id: "gray", label: "Black and white (smaller for text scans)", type: "toggle", def: false },
    ],
  },
  "reorder-pdf-pages": {
    accept: "application/pdf,.pdf",
    multiple: false,
    action: "Save new PDF",
    options: [],
  },
  "pdf-to-text": {
    accept: "application/pdf,.pdf",
    multiple: false,
    action: "Extract text",
    options: [
      { id: "join", label: "Line breaks", type: "select", def: "keep", options: [["keep", "Keep as in the PDF"], ["join", "Join lines into paragraphs"]] },
      { id: "markers", label: "Mark where each page starts", type: "toggle", def: true },
    ],
  },
};

/** Compression presets: render resolution and JPEG quality, from best to smallest. */
export const COMPRESS_STEPS = [
  [150, 0.75],
  [130, 0.68],
  [110, 0.6],
  [96, 0.52],
  [80, 0.45],
  [72, 0.38],
  [60, 0.32],
  [50, 0.26],
];
export const COMPRESS_LEVELS = { high: [150, 0.75], balanced: [110, 0.6], small: [80, 0.45] };

/** Parse "1-3, 5, 8-" into ranges of 0-based page indexes, clamped to `count`. */
export function parseRanges(text, count) {
  const out = [];
  for (const part of String(text).split(/[,;]+/)) {
    const p = part.trim();
    if (!p) continue;
    const m = p.match(/^(\d*)\s*[-–]\s*(\d*)$/);
    let a, b;
    if (m) {
      a = m[1] ? +m[1] : 1;
      b = m[2] ? +m[2] : count;
    } else if (/^\d+$/.test(p)) a = b = +p;
    else throw new Error(`'${p}' is not a page or range. Use numbers like 1-3, 5.`);
    if (a < 1 || b < 1 || a > count || b > count) throw new Error(`Page ${Math.max(a, b)} does not exist; this PDF has ${count} page${count === 1 ? "" : "s"}.`);
    if (a > b) [a, b] = [b, a];
    out.push(Array.from({ length: b - a + 1 }, (_, i) => a - 1 + i));
  }
  if (!out.length) throw new Error("Enter at least one page number.");
  return out;
}
