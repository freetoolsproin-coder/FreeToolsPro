import { useEffect, useState } from "react";
import { Download, Minimize2 } from "lucide-react";
import {
  PdfAlert,
  PdfFileChip,
  PdfPrimaryButton,
  PdfProgress,
  PdfStats,
  PdfThumbnailStrip,
  PdfUploadZone,
  formatBytes,
} from "./pdfShared";
import { compressPdfBytes, downloadBytes, getPdfPageCount, renderPdfThumbnails } from "./pdfAdvanced";

const LEVELS = [
  { id: "light", label: "Light", desc: "Fast · object streams on" },
  { id: "medium", label: "Balanced", desc: "Recommended default" },
  { id: "max", label: "Maximum", desc: "Rebuild structure" },
];

export default function CompressPdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [level, setLevel] = useState("medium");
  const [pageCount, setPageCount] = useState(0);
  const [thumbs, setThumbs] = useState([]);
  const [thumbTotal, setThumbTotal] = useState(0);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      const total = await getPdfPageCount(file);
      const { thumbs: t, total: n } = await renderPdfThumbnails(file, 6);
      if (!cancelled) {
        setPageCount(total);
        setThumbs(t);
        setThumbTotal(n);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const clear = () => {
    setFile(null);
    setStats(null);
    setProgress(0);
    setError("");
    setThumbs([]);
    setThumbTotal(0);
  };

  const compress = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setProgress(15);
    setStats(null);

    try {
      setProgress(45);
      const output = await compressPdfBytes(file, level);
      setProgress(90);
      const blob = new Blob([output], { type: "application/pdf" });
      setStats({ before: file.size, after: blob.size });
      const name = (file.name || "document").replace(/\.pdf$/i, "") + "-compressed.pdf";
      downloadBytes(name, blob);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError("Could not compress this PDF. It may be encrypted or damaged.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const savedPct =
    stats && stats.before > 0
      ? Math.max(0, Math.round((1 - stats.after / stats.before) * 100))
      : 0;

  return (
    <div className="space-y-1">
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Advanced PDF compression with light, balanced, and maximum rebuild modes. Image-heavy scans
        may see smaller gains than text PDFs.
      </p>

      <PdfUploadZone onFiles={(f) => { clear(); setFile(f); }} disabled={loading} />
      <PdfFileChip file={file} onClear={loading ? undefined : clear} />
      <PdfThumbnailStrip thumbs={thumbs} total={thumbTotal} />

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLevel(l.id)}
            className={`rounded-xl border px-3 py-3 text-left ${
              level === l.id ? "border-[var(--hero-accent)] bg-[var(--hero-accent-soft)]" : "border-[var(--ftp-line)] bg-white"
            }`}
          >
            <span className="block text-sm font-semibold">{l.label}</span>
            <span className="text-xs text-[var(--ftp-ink-soft)]">{l.desc}</span>
          </button>
        ))}
      </div>

      {pageCount ? (
        <PdfStats items={[{ label: "Pages", value: pageCount }, { label: "Input", value: formatBytes(file?.size) }, { label: "Mode", value: level }]} />
      ) : null}

      {loading ? <PdfProgress value={progress} label="Compressing PDF…" /> : null}

      {stats ? (
        <PdfAlert tone="success">
          Original: {formatBytes(stats.before)} → Compressed: {formatBytes(stats.after)}
          {savedPct > 0 ? ` (${savedPct}% smaller)` : " (similar size — file may already be optimized)"}
        </PdfAlert>
      ) : null}

      {error ? <PdfAlert tone="error">{error}</PdfAlert> : null}

      <div className="mt-5">
        <PdfPrimaryButton onClick={compress} disabled={!file || loading}>
          <Minimize2 className="h-4 w-4" /> Compress & download
        </PdfPrimaryButton>
      </div>
    </div>
  );
}
