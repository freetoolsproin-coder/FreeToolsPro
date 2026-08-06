import { useEffect, useState } from "react";
import { Download, FileImage, ImageDown } from "lucide-react";
import {
  PdfAlert,
  PdfFileChip,
  PdfPageRangeField,
  PdfPrimaryButton,
  PdfProgress,
  PdfStats,
  PdfThumbnailStrip,
  PdfUploadZone,
  loadPdfDocument,
  parsePageRange,
} from "./pdfShared";
import { getPdfPageCount, renderPdfThumbnails } from "./pdfAdvanced";

const FORMATS = [
  { id: "jpeg", label: "JPG", mime: "image/jpeg", ext: "jpg" },
  { id: "png", label: "PNG", mime: "image/png", ext: "png" },
  { id: "webp", label: "WebP", mime: "image/webp", ext: "webp" },
];

export default function PdfToJpg() {
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [quality, setQuality] = useState(0.92);
  const [scale, setScale] = useState(2);
  const [format, setFormat] = useState("jpeg");
  const [thumbs, setThumbs] = useState([]);
  const [thumbTotal, setThumbTotal] = useState(0);

  const clear = () => {
    setFile(null);
    setImages([]);
    setProgress(0);
    setError("");
    setPageCount(0);
    setPageRange("");
    setThumbs([]);
    setThumbTotal(0);
  };

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      try {
        const total = await getPdfPageCount(file);
        const { thumbs: t, total: n } = await renderPdfThumbnails(file, 10);
        if (!cancelled) {
          setPageCount(total);
          setThumbs(t);
          setThumbTotal(n);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const convertPdf = async () => {
    if (!file) {
      setError("Upload a PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    setImages([]);
    setProgress(0);

    try {
      const pdf = await loadPdfDocument(file);
      const fmt = FORMATS.find((f) => f.id === format) || FORMATS[0];
      const indexes = parsePageRange(pageRange, pdf.numPages);
      const pagesToRender = indexes.length ? indexes.map((i) => i + 1) : Array.from({ length: pdf.numPages }, (_, i) => i + 1);
      const output = [];

      for (let n = 0; n < pagesToRender.length; n += 1) {
        const i = pagesToRender[n];
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas unavailable");

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        output.push({
          page: i,
          dataUrl: canvas.toDataURL(fmt.mime, quality),
          ext: fmt.ext,
        });
        setProgress(Math.round(((n + 1) / pagesToRender.length) * 100));
      }

      setImages(output);
    } catch (err) {
      console.error(err);
      const msg = String(err?.message || err || "");
      if (/password/i.test(msg)) {
        setError("This PDF is password-protected. Unlock it first, then retry.");
      } else {
        setError("Could not convert this PDF. The file may be encrypted, damaged, or too large.");
      }
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = () => {
    images.forEach((img) => {
      const link = document.createElement("a");
      link.href = img.dataUrl;
      link.download = `page-${img.page}.${img.ext}`;
      link.click();
    });
  };

  return (
    <div>
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Export PDF pages as JPG, PNG, or WebP with quality, scale, and page-range controls—all
        processed locally.
      </p>

      <PdfUploadZone
        onFiles={(f) => {
          clear();
          setFile(f);
        }}
        disabled={loading}
        hint="High-DPI export · optional page ranges"
      />

      <PdfFileChip file={file} onClear={loading ? undefined : clear} />
      <PdfThumbnailStrip thumbs={thumbs} total={thumbTotal} />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <PdfPageRangeField
          value={pageRange}
          onChange={setPageRange}
          disabled={loading}
          totalPages={pageCount}
        />
        <label className="text-sm text-[var(--ftp-ink-soft)]">
          Format
          <select
            className="mt-1.5 w-full rounded-xl border border-[var(--ftp-line)] bg-white px-3 py-2.5 text-sm"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            disabled={loading}
          >
            {FORMATS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm text-[var(--ftp-ink-soft)]">
          Quality ({Math.round(quality * 100)}%)
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            disabled={loading}
            className="mt-2 w-full accent-[var(--hero-accent)]"
          />
        </label>
        <label className="text-sm text-[var(--ftp-ink-soft)]">
          Scale ({scale}×)
          <input
            type="range"
            min="1"
            max="3"
            step="0.5"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            disabled={loading}
            className="mt-2 w-full accent-[var(--hero-accent)]"
          />
        </label>
      </div>

      {loading ? <PdfProgress value={progress} label="Rendering pages…" /> : null}
      {error ? <PdfAlert tone="error">{error}</PdfAlert> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <PdfPrimaryButton onClick={convertPdf} disabled={!file || loading}>
          Convert to images
        </PdfPrimaryButton>
        {images.length > 1 ? (
          <button
            type="button"
            onClick={downloadAll}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--ftp-line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--ftp-ink)] hover:bg-[var(--ftp-porcelain)]"
          >
            <ImageDown className="h-4 w-4" />
            Download all ({images.length})
          </button>
        ) : null}
      </div>

      {images.length > 0 ? (
        <div className="mt-8">
          <PdfStats
            items={[
              { label: "Pages exported", value: images.length },
              { label: "Format", value: format.toUpperCase() },
              { label: "Scale", value: `${scale}×` },
            ]}
          />
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img) => (
              <article
                key={`page-${img.page}`}
                className="overflow-hidden rounded-2xl border border-[var(--ftp-line)] bg-white"
              >
                <div className="bg-[var(--ftp-porcelain)] p-2">
                  <img
                    src={img.dataUrl}
                    alt={`Page ${img.page}`}
                    className="max-h-72 w-full rounded-lg object-contain"
                  />
                </div>
                <div className="flex items-center justify-between gap-2 px-3 py-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--ftp-ink-soft)]">
                    <FileImage className="h-3.5 w-3.5" aria-hidden="true" />
                    Page {img.page}
                  </span>
                  <a
                    href={img.dataUrl}
                    download={`page-${img.page}.${img.ext}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--hero-accent)] hover:underline"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    Download
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
