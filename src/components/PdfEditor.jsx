import { PDFDocument, rgb } from "pdf-lib";
import { useState } from "react";

export default function PdfEditor() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("Edited with PDF Tools");
  const [fontSize, setFontSize] = useState(18);
  const [color, setColor] = useState("#3b82f6");
  const [opacity, setOpacity] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [x, setX] = useState(50);
  const [y, setY] = useState(700);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    return {
      r: ((bigint >> 16) & 255) / 255,
      g: ((bigint >> 8) & 255) / 255,
      b: (bigint & 255) / 255,
    };
  };

  const editPdf = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer);
      const pages = pdfDoc.getPages();

      const pageIndex = Math.min(pageNo - 1, pages.length - 1);
      const page = pages[pageIndex];

      const { r, g, b } = hexToRgb(color);

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        color: rgb(r, g, b),
        opacity,
      });

      const bytes = await pdfDoc.save();
      const blob = new Blob([bytes], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    } catch (err) {
      setError("Failed to edit PDF");
    } finally {
      setLoading(false);
    }
  };

  const resetControls = () => {
    setText("Edited with PDF Tools");
    setFontSize(18);
    setColor("#3b82f6");
    setOpacity(1);
    setPageNo(1);
    setX(50);
    setY(700);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white px-4 py-10">
      <div className="max-w-2xl mx-auto rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl p-6 space-y-6">

        <h2 className="text-2xl font-bold text-center">
          ✏️ PDF Text Editor
        </h2>

        {/* Upload */}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm file:bg-blue-600 file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg"
        />

        {/* Text */}
        <div>
          <label className="text-sm">Text</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-black/40 border border-white/20"
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">Font Size</label>
            <input type="range" min="8" max="60" value={fontSize}
              onChange={(e) => setFontSize(+e.target.value)} />
          </div>

          <div>
            <label className="text-sm">Opacity</label>
            <input type="range" min="0.1" max="1" step="0.1" value={opacity}
              onChange={(e) => setOpacity(+e.target.value)} />
          </div>

          <div>
            <label className="text-sm">Text Color</label>
            <input type="color" value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded-lg" />
          </div>

          <div>
            <label className="text-sm">Page</label>
            <input type="number" min="1" value={pageNo}
              onChange={(e) => setPageNo(+e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/20" />
          </div>
        </div>

        {/* Position */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm">X Position</label>
            <input type="range" min="0" max="600" value={x}
              onChange={(e) => setX(+e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Y Position</label>
            <input type="range" min="0" max="800" value={y}
              onChange={(e) => setY(+e.target.value)} />
          </div>
        </div>

        {/* Actions */}
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={editPdf}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-xl font-semibold"
          >
            {loading ? "Processing..." : "Apply & Download"}
          </button>

          <button
            onClick={resetControls}
            className="px-4 bg-white/10 border border-white/20 rounded-xl"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
