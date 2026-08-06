import { useState } from "react";
import { Download, FileText, GripVertical, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  ImageUploadZone,
  PdfAlert,
  PdfPrimaryButton,
  PdfProgress,
  PdfStats,
  formatBytes,
} from "./pdfShared";

const PAGE_SIZES = {
  fit: "fit",
  a4: "a4",
  letter: "letter",
};

function readImageSize(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function pageDimensions(sizeKey, imgW, imgH, margin = 0) {
  if (sizeKey === "a4") {
    const w = 595.28;
    const h = 841.89;
    return { w: w - margin * 2, h: h - margin * 2, pageW: w, pageH: h, orientation: "portrait" };
  }
  if (sizeKey === "letter") {
    const w = 612;
    const h = 792;
    return { w: w - margin * 2, h: h - margin * 2, pageW: w, pageH: h, orientation: "portrait" };
  }
  return {
    w: imgW,
    h: imgH,
    pageW: imgW,
    pageH: imgH,
    orientation: imgW >= imgH ? "landscape" : "portrait",
  };
}

export default function JpgToPdf() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState("fit");
  const [margin, setMargin] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  const addImages = async (files) => {
    setError("");
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");
    const next = [];
    for (const file of files) {
      const preview = await fileToDataUrl(file);
      next.push({ file, preview, id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}` });
    }
    setImages((prev) => [...prev, ...next]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  const moveImage = (index, direction) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const buildPdf = async () => {
    if (!images.length) {
      setError("Add at least one image.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(5);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");

    try {
      let pdf = null;

      for (let i = 0; i < images.length; i += 1) {
        const { preview, file } = images[i];
        const { width, height } = await readImageSize(preview);
        const format = file.type.includes("png") ? "PNG" : "JPEG";
        const dims = pageDimensions(pageSize, width, height, margin);
        let orientation = dims.orientation;
        if (autoRotate && pageSize !== "fit") {
          orientation = width >= height ? "landscape" : "portrait";
        }

        if (!pdf) {
          pdf = new jsPDF({
            orientation,
            unit: "px",
            format: pageSize === "fit" ? [dims.pageW, dims.pageH] : [dims.pageW, dims.pageH],
          });
        } else {
          pdf.addPage([dims.pageW, dims.pageH], orientation);
        }

        const drawW = pageSize === "fit" ? width : dims.w;
        const drawH = pageSize === "fit" ? height : dims.h;
        const offsetX = pageSize === "fit" ? 0 : margin;
        const offsetY = pageSize === "fit" ? 0 : margin;
        pdf.addImage(preview, format, offsetX, offsetY, drawW, drawH);
        setProgress(Math.round(((i + 1) / images.length) * 100));
      }

      const blob = pdf.output("blob");
      setDownloadUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
      setError("Could not build the PDF. Try smaller images or a different format.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const totalBytes = images.reduce((sum, item) => sum + item.file.size, 0);

  return (
    <div className="space-y-1">
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Advanced image-to-PDF: reorder pages, pick A4/Letter/fit sizing, margins, and auto
        orientation—all in your browser.
      </p>

      <ImageUploadZone onFiles={addImages} disabled={loading} hint="JPG, PNG, WebP · multi-select" />

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-sm text-[var(--ftp-ink-soft)]">
          Page size
          <select
            className="mt-1.5 w-full rounded-xl border border-[var(--ftp-line)] bg-white px-3 py-2.5 text-sm"
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
            disabled={loading}
          >
            <option value="fit">Fit to image</option>
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </label>
        <label className="text-sm text-[var(--ftp-ink-soft)]">
          Margin ({margin}px)
          <input
            type="range"
            min="0"
            max="48"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value))}
            disabled={loading || pageSize === "fit"}
            className="mt-2 w-full accent-[var(--hero-accent)]"
          />
        </label>
        <label className="flex items-end gap-2 pb-2 text-sm text-[var(--ftp-ink)]">
          <input
            type="checkbox"
            checked={autoRotate}
            onChange={(e) => setAutoRotate(e.target.checked)}
            disabled={loading || pageSize === "fit"}
            className="h-4 w-4 accent-[var(--hero-accent)]"
          />
          Auto orientation
        </label>
      </div>

      {images.length ? (
        <PdfStats
          items={[
            { label: "Images", value: images.length },
            { label: "Total size", value: formatBytes(totalBytes) },
            { label: "Page size", value: pageSize.toUpperCase() },
          ]}
        />
      ) : null}

      {images.length ? (
        <div className="mt-4 space-y-2">
          {images.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-xl border border-[var(--ftp-line)] bg-white px-3 py-2"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-[var(--ftp-ink-soft)]" aria-hidden="true" />
              <img src={item.preview} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[var(--ftp-ink)]">{item.file.name}</p>
                <p className="text-xs text-[var(--ftp-ink-soft)]">{formatBytes(item.file.size)}</p>
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveImage(index, -1)} disabled={index === 0 || loading} className="rounded-lg px-2 py-1 text-xs font-semibold text-[var(--ftp-ink-soft)] hover:bg-[var(--ftp-porcelain)] disabled:opacity-40">Up</button>
                <button type="button" onClick={() => moveImage(index, 1)} disabled={index === images.length - 1 || loading} className="rounded-lg px-2 py-1 text-xs font-semibold text-[var(--ftp-ink-soft)] hover:bg-[var(--ftp-porcelain)] disabled:opacity-40">Down</button>
                <button type="button" onClick={() => removeImage(item.id)} disabled={loading} className="rounded-lg p-2 text-rose-600 hover:bg-rose-50" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {loading ? <PdfProgress value={progress} label="Building PDF…" /> : null}
      {error ? <PdfAlert tone="error">{error}</PdfAlert> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <PdfPrimaryButton onClick={buildPdf} disabled={!images.length || loading}>
          <FileText className="h-4 w-4" />
          Create PDF
        </PdfPrimaryButton>
        {downloadUrl ? (
          <a href={downloadUrl} download="images.pdf" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PDF
          </a>
        ) : null}
      </div>
    </div>
  );
}
