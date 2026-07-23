import { PDFDocument, rgb } from "pdf-lib";
import { useState } from "react";

export default function PdfEditor() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

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
      setError("Please upload a PDF file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const buffer = await file.arrayBuffer();

      const pdfDoc = await PDFDocument.load(buffer);

      const pages = pdfDoc.getPages();

      const pageIndex = Math.min(Math.max(pageNo - 1, 0), pages.length - 1);

      const page = pages[pageIndex];

      const { r, g, b } = hexToRgb(color);

      page.drawText(text, {
        x,
        y,
        size: fontSize,
        color: rgb(r, g, b),
        opacity,
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
    } catch (err) {
      console.error(err);
      setError("Failed to edit PDF.");
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
    <div className="mx-auto mt-4">
      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* LEFT PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg p-6 space-y-6">
          {/* Upload */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">Upload PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];

                if (selectedFile) {
                  setFile(selectedFile);
                  setPdfUrl(URL.createObjectURL(selectedFile));
                }
              }}
              className="block w-full text-sm
                file:mr-4
                file:py-2
                file:px-4
                file:rounded-xl
                file:border-0
                file:bg-amber-500
                file:text-white
                hover:file:bg-amber-600"
            />

            {file && <p className="mt-2 text-xs text-slate-500">{file.name}</p>}
          </div>

          {/* Text */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
            />
          </div>

          {/* Font Size */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-black font-medium">Font Size</label>
              <span>{fontSize}px</span>
            </div>

            <input
              type="range"
              min="8"
              max="60"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Opacity */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-black font-medium">Opacity</label>

              <span>{opacity}</span>
            </div>

            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">Text Color</label>

            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-12 rounded-xl cursor-pointer"
            />
          </div>

          {/* Page */}
          <div>
            <label className="block text-black text-sm font-medium mb-2">Page Number</label>

            <input
              type="number"
              min="1"
              value={pageNo}
              onChange={(e) => setPageNo(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700"
            />
          </div>

          {/* Position */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-black text-sm font-medium mb-2">X Position</label>

              <input
                type="number"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-black text-sm font-medium mb-2">Y Position</label>
              <input
                type="number"
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700"
              />
            </div>
          </div>

          {error && <div className="bg-red-100 text-red-600 p-3 rounded-xl text-sm">{error}</div>}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={editPdf}
              disabled={loading}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 text-xl rounded-xl font-normal transition"
            >
              {loading ? "Processing..." : "Apply Changes"}
            </button>

            <button
              onClick={resetControls}
              className="py-3 rounded-xl bg-slate-200 dark:bg-slate-700"
            >
              Reset
            </button>
          </div>

          {pdfUrl && (
            <a
              href={pdfUrl}
              download="edited.pdf"
              className="block text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium"
            >
              Download PDF
            </a>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg overflow-hidden">
          {pdfUrl ? (
            <iframe title="PDF Preview" src={pdfUrl} className="w-full h-[850px]" />
          ) : (
            <div className="h-[850px] flex items-center justify-center text-slate-500">
              Upload a PDF to preview it here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
