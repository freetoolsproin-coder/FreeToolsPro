import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Loader2, UploadCloud, X } from "lucide-react";
import { getDocument, GlobalWorkerOptions, version as pdfjsVersion } from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

/** Prefer Vite-bundled worker; fall back to public + CDN if host blocks .mjs assets. */
function resolvePdfWorkerSrc() {
  if (pdfWorkerUrl) return pdfWorkerUrl;
  if (typeof window !== "undefined") {
    return `${window.location.origin}/pdf.worker.min.mjs`;
  }
  return `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
}

GlobalWorkerOptions.workerSrc = resolvePdfWorkerSrc();

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function loadPdfDocument(file) {
  // Copy bytes — transferred ArrayBuffers can be detached by the worker.
  const data = new Uint8Array(await file.arrayBuffer());

  const tryLoad = (workerSrc) => {
    if (workerSrc) GlobalWorkerOptions.workerSrc = workerSrc;
    return getDocument({
      data: data.slice(),
      useSystemFonts: true,
      isEvalSupported: false,
    }).promise;
  };

  try {
    return await tryLoad(resolvePdfWorkerSrc());
  } catch (firstErr) {
    const originWorker =
      typeof window !== "undefined" ? `${window.location.origin}/pdf.worker.min.mjs` : null;
    const cdnWorker = `https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.mjs`;
    const fallbacks = [originWorker, cdnWorker].filter(
      (src) => src && src !== GlobalWorkerOptions.workerSrc
    );

    let lastErr = firstErr;
    for (const src of fallbacks) {
      try {
        return await tryLoad(src);
      } catch (err) {
        lastErr = err;
      }
    }
    throw lastErr;
  }
}

export async function extractPdfTextByPage(file) {
  const pdf = await loadPdfDocument(file);
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const lines = [];
    let lastY = null;
    let line = "";
    content.items.forEach((item) => {
      const y = item.transform?.[5];
      const str = item.str || "";
      if (lastY !== null && Math.abs(y - lastY) > 2 && line.trim()) {
        lines.push(line.trimEnd());
        line = "";
      }
      line += str + (item.hasEOL ? "\n" : " ");
      lastY = y;
    });
    if (line.trim()) lines.push(line.trimEnd());
    pages.push(lines.join("\n").replace(/[ \t]+\n/g, "\n").trim());
  }
  return { pages, numPages: pdf.numPages };
}

/** Word-openable .doc built from extracted page text (runs fully in-browser). */
export function buildWordDocBlob(pages, title = "Converted PDF") {
  const body = pages
    .map((pageText, i) => {
      const paragraphs = (pageText || "")
        .split(/\n+/)
        .filter(Boolean)
        .map(
          (p) =>
            `<p style="margin:0 0 10pt;font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.45;">${escapeHtml(p)}</p>`
        )
        .join("");
      const pageBreak =
        i < pages.length - 1 ? `<br clear="all" style="page-break-before:always" />` : "";
      return `<div>${paragraphs || "<p>&nbsp;</p>"}${pageBreak}</div>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:w="urn:schemas-microsoft-com:office:word"
 xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->
<style>
  body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; }
</style>
</head>
<body>${body}</body>
</html>`;

  return new Blob(["\ufeff", html], { type: "application/msword" });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function PdfUploadZone({
  onFiles,
  multiple = false,
  disabled = false,
  hint = "PDF files only · processed in your browser",
}) {
  const onDrop = useCallback(
    (accepted) => {
      if (!accepted?.length || disabled) return;
      onFiles(multiple ? accepted : accepted[0]);
    },
    [disabled, multiple, onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple,
    disabled,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
        disabled
          ? "cursor-not-allowed border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] opacity-60"
          : isDragActive
            ? "border-[var(--hero-accent)] bg-[var(--hero-accent-soft)]"
            : "border-[var(--ftp-line-strong)] bg-[var(--ftp-porcelain)] hover:border-[var(--hero-accent)] hover:bg-white"
      }`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--ftp-line)] bg-white text-[var(--hero-accent)]">
        <UploadCloud className="h-7 w-7" aria-hidden="true" />
      </div>
      <p className="text-base font-semibold text-[var(--ftp-ink)]">
        {isDragActive ? "Drop PDF here" : multiple ? "Drag & drop PDF files" : "Drag & drop a PDF"}
      </p>
      <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">or click to browse</p>
      <p className="mt-3 text-xs text-[var(--ftp-ink-soft)]">{hint}</p>
    </div>
  );
}

export function PdfFileChip({ file, onClear }) {
  if (!file) return null;
  return (
    <div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--ftp-line)] bg-white px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
        <FileText className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--ftp-ink)]">{file.name}</p>
        <p className="text-xs text-[var(--ftp-ink-soft)]">{formatBytes(file.size)}</p>
      </div>
      {onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg p-2 text-[var(--ftp-ink-soft)] transition hover:bg-[var(--ftp-porcelain)] hover:text-[var(--ftp-ink)]"
          aria-label="Remove file"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function PdfProgress({ value, label = "Working…" }) {
  return (
    <div className="mt-4 rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--ftp-ink)]">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--hero-accent)]" aria-hidden="true" />
        {label} {typeof value === "number" ? `${value}%` : ""}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-black/5">
        <div
          className="h-full rounded-full bg-[var(--hero-accent)] transition-all"
          style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
        />
      </div>
    </div>
  );
}

export function PdfPrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ftp-ink)] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Parse "1-3, 5, 8" into sorted unique 0-based page indexes. */
export function parsePageRange(input, totalPages) {
  if (!totalPages || totalPages < 1) return [];
  const raw = String(input || "").trim();
  if (!raw) return Array.from({ length: totalPages }, (_, i) => i);

  const seen = new Set();
  const parts = raw.split(/[,;]+/);
  for (const part of parts) {
    const token = part.trim();
    if (!token) continue;
    if (token.includes("-")) {
      const [a, b] = token.split("-").map((n) => parseInt(n.trim(), 10));
      if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
      const start = Math.min(a, b);
      const end = Math.max(a, b);
      for (let page = start; page <= end; page += 1) {
        if (page >= 1 && page <= totalPages) seen.add(page - 1);
      }
    } else {
      const page = parseInt(token, 10);
      if (Number.isFinite(page) && page >= 1 && page <= totalPages) seen.add(page - 1);
    }
  }
  return [...seen].sort((a, b) => a - b);
}

export function ImageUploadZone({
  onFiles,
  multiple = true,
  disabled = false,
  hint = "JPG or PNG · processed in your browser",
}) {
  const onDrop = useCallback(
    (accepted) => {
      if (!accepted?.length || disabled) return;
      onFiles(multiple ? accepted : accepted[0]);
    },
    [disabled, multiple, onFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    multiple,
    disabled,
    onDrop,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
        disabled
          ? "cursor-not-allowed border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] opacity-60"
          : isDragActive
            ? "border-[var(--hero-accent)] bg-[var(--hero-accent-soft)]"
            : "border-[var(--ftp-line-strong)] bg-[var(--ftp-porcelain)] hover:border-[var(--hero-accent)] hover:bg-white"
      }`}
    >
      <input {...getInputProps()} />
      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--ftp-line)] bg-white text-[var(--hero-accent)]">
        <UploadCloud className="h-7 w-7" aria-hidden="true" />
      </div>
      <p className="text-base font-semibold text-[var(--ftp-ink)]">
        {isDragActive ? "Drop images here" : multiple ? "Drag & drop images" : "Drag & drop an image"}
      </p>
      <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">or click to browse</p>
      <p className="mt-3 text-xs text-[var(--ftp-ink-soft)]">{hint}</p>
    </div>
  );
}

export function PdfSecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--ftp-line-strong)] bg-white px-4 py-3 text-sm font-semibold text-[var(--ftp-ink)] transition hover:bg-[var(--ftp-porcelain)] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function PdfAlert({ tone = "error", children }) {
  const styles = {
    error: "border-red-200 bg-red-50 text-red-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    info: "border-sky-200 bg-sky-50 text-sky-800",
  };
  return (
    <div className={`mt-4 rounded-xl border px-4 py-3 text-sm ${styles[tone] || styles.error}`}>
      {children}
    </div>
  );
}

export function PdfPageRangeField({ value, onChange, disabled, totalPages, hint }) {
  return (
    <label className="block text-sm text-[var(--ftp-ink-soft)]">
      Page range (optional)
      <input
        type="text"
        className="mt-1.5 w-full rounded-xl border border-[var(--ftp-line)] bg-white px-3 py-2.5 text-sm text-[var(--ftp-ink)]"
        placeholder="All pages · e.g. 1-3, 5"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      {totalPages ? (
        <span className="mt-1 block text-xs text-[var(--ftp-ink-soft)]">
          {hint || `${totalPages} page${totalPages === 1 ? "" : "s"} in file`}
        </span>
      ) : null}
    </label>
  );
}

export function PdfToggle({ label, description, checked, onChange, disabled }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--ftp-line)] bg-white px-4 py-3">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-[var(--ftp-line)] accent-[var(--hero-accent)]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span>
        <span className="block text-sm font-semibold text-[var(--ftp-ink)]">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-xs leading-5 text-[var(--ftp-ink-soft)]">
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}

export function PdfStats({ items }) {
  if (!items?.length) return null;
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2.5 text-center"
        >
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ftp-ink-soft)]">
            {item.label}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--ftp-ink)]">{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export function PdfThumbnailStrip({ thumbs, total, selected = null, onSelect = null }) {
  if (!thumbs?.length) return null;
  return (
    <div className="mt-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">
        Page preview {total > thumbs.length ? `(showing ${thumbs.length} of ${total})` : ""}
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {thumbs.map((t) => (
          <button
            key={t.page}
            type="button"
            onClick={() => onSelect?.(t.page)}
            className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
              selected === t.page
                ? "border-[var(--hero-accent)] ring-2 ring-[var(--hero-accent)]/20"
                : "border-[var(--ftp-line)] hover:border-teal-300"
            }`}
          >
            <img src={t.dataUrl} alt={`Page ${t.page}`} className="h-24 w-auto bg-white" />
            <span className="block bg-white py-0.5 text-center text-[10px] font-medium text-[var(--ftp-ink-soft)]">
              {t.page}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
