import { PDFDocument, rgb } from "pdf-lib";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { inputDark } from "../../components/ToolHeroShell";
import {
  PdfFileChip,
  PdfPrimaryButton,
  PdfSecondaryButton,
  PdfUploadZone,
} from "./pdfShared";

function hexToRgb(hex) {
  const raw = hex.replace("#", "");
  const bigint = parseInt(raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw, 16);
  return {
    r: ((bigint >> 16) & 255) / 255,
    g: ((bigint >> 8) & 255) / 255,
    b: (bigint & 255) / 255,
  };
}

export default function PdfEditor() {
  const [file, setFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pageCount, setPageCount] = useState(1);

  const [text, setText] = useState("Edited with FreeToolsPro");
  const [fontSize, setFontSize] = useState(18);
  const [color, setColor] = useState("#0f766e");
  const [opacity, setOpacity] = useState(1);
  const [pageNo, setPageNo] = useState(1);
  const [x, setX] = useState(50);
  const [y, setY] = useState(700);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const onFile = async (selected) => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(selected);
    setPdfUrl(URL.createObjectURL(selected));
    setError("");
    try {
      const doc = await PDFDocument.load(await selected.arrayBuffer());
      const count = doc.getPageCount();
      setPageCount(count);
      setPageNo(1);
      const first = doc.getPages()[0];
      const { height } = first.getSize();
      setY(Math.max(40, Math.round(height - 80)));
    } catch {
      setPageCount(1);
    }
  };

  const clear = () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    setFile(null);
    setPdfUrl("");
    setError("");
    setPageCount(1);
  };

  const resetControls = () => {
    setText("Edited with FreeToolsPro");
    setFontSize(18);
    setColor("#0f766e");
    setOpacity(1);
    setPageNo(1);
    setX(50);
    setY(700);
  };

  const editPdf = async () => {
    if (!file) {
      setError("Upload a PDF file first.");
      return;
    }
    if (!text.trim()) {
      setError("Enter the text you want to add.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdfDoc.getPages();
      const pageIndex = Math.min(Math.max(pageNo - 1, 0), pages.length - 1);
      const page = pages[pageIndex];
      const { r, g, b } = hexToRgb(color);

      page.drawText(text.trim(), {
        x: Number(x) || 0,
        y: Number(y) || 0,
        size: Number(fontSize) || 12,
        color: rgb(r, g, b),
        opacity: Number(opacity) || 1,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError("Failed to edit PDF. The file may be encrypted or invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Add a text overlay to any page, then download the updated PDF. Coordinates use PDF points
        from the bottom-left corner.
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
        <div className="space-y-4">
          {!file ? (
            <PdfUploadZone onFiles={onFile} disabled={loading} hint="One PDF · add text overlays" />
          ) : (
            <PdfFileChip file={file} onClear={loading ? undefined : clear} />
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink)]">Text</span>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={inputDark}
              placeholder="Text to place on the page"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 flex justify-between text-sm font-medium text-[var(--ftp-ink)]">
                Size <span className="font-normal text-[var(--ftp-ink-soft)]">{fontSize}px</span>
              </span>
              <input
                type="range"
                min="8"
                max="72"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-[var(--hero-accent)]"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 flex justify-between text-sm font-medium text-[var(--ftp-ink)]">
                Opacity <span className="font-normal text-[var(--ftp-ink-soft)]">{opacity}</span>
              </span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-[var(--hero-accent)]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink)]">Color</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-xl border border-black/10 bg-white p-1"
            />
          </label>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink)]">Page</span>
              <input
                type="number"
                min="1"
                max={pageCount}
                value={pageNo}
                onChange={(e) => setPageNo(Number(e.target.value))}
                className={inputDark}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink)]">X</span>
              <input
                type="number"
                value={x}
                onChange={(e) => setX(Number(e.target.value))}
                className={inputDark}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink)]">Y</span>
              <input
                type="number"
                value={y}
                onChange={(e) => setY(Number(e.target.value))}
                className={inputDark}
              />
            </label>
          </div>

          {pageCount > 1 ? (
            <p className="text-xs text-[var(--ftp-ink-soft)]">This PDF has {pageCount} pages.</p>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <PdfPrimaryButton onClick={editPdf} disabled={!file || loading}>
              {loading ? "Applying…" : "Apply text"}
            </PdfPrimaryButton>
            <PdfSecondaryButton onClick={resetControls} disabled={loading}>
              Reset
            </PdfSecondaryButton>
            {pdfUrl && file ? (
              <a
                href={pdfUrl}
                download={(file.name || "document").replace(/\.pdf$/i, "") + "-edited.pdf"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </a>
            ) : null}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]">
          {pdfUrl ? (
            <iframe title="PDF preview" src={pdfUrl} className="h-[min(70vh,720px)] w-full bg-white" />
          ) : (
            <div className="flex h-[min(70vh,720px)] items-center justify-center px-6 text-center text-sm text-[var(--ftp-ink-soft)]">
              Upload a PDF to preview and edit it here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
