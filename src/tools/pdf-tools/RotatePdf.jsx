import { useEffect, useState } from "react";
import { degrees } from "pdf-lib";
import { Download, RotateCw, RotateCcw } from "lucide-react";
import {
  PdfAlert,
  PdfFileChip,
  PdfPrimaryButton,
  PdfProgress,
  PdfSecondaryButton,
  PdfUploadZone,
} from "./pdfShared";
import { downloadBytes, getPdfPageCount, loadPdfLib, renderPdfThumbnails } from "./pdfAdvanced";

const STEP = 90;

export default function RotatePdf() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [rotations, setRotations] = useState({});
  const [thumbs, setThumbs] = useState([]);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      const total = await getPdfPageCount(file);
      const { thumbs: t } = await renderPdfThumbnails(file, Math.min(total, 16), 0.4);
      if (!cancelled) {
        setPageCount(total);
        setThumbs(t);
        setRotations({});
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const clear = () => {
    setFile(null);
    setPageCount(0);
    setRotations({});
    setThumbs([]);
    setError("");
  };

  const rotatePage = (pageIndex, delta) => {
    setRotations((prev) => ({
      ...prev,
      [pageIndex]: ((prev[pageIndex] || 0) + delta + 360) % 360,
    }));
  };

  const rotateAll = (delta) => {
    setRotations((prev) => {
      const next = { ...prev };
      for (let i = 0; i < pageCount; i += 1) {
        next[i] = ((next[i] || 0) + delta + 360) % 360;
      }
      return next;
    });
  };

  const apply = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(20);

    try {
      const source = await loadPdfLib(file);
      const pages = source.getPages();
      pages.forEach((page, index) => {
        const extra = rotations[index] || 0;
        if (extra) {
          const current = page.getRotation().angle;
          page.setRotation(degrees(current + extra));
        }
      });
      setProgress(80);
      const bytes = await source.save();
      const name = (file.name || "document").replace(/\.pdf$/i, "") + "-rotated.pdf";
      downloadBytes(name, bytes);
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not rotate this PDF.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Visual page rotator: adjust each thumbnail or rotate all pages at once, then download the
        updated PDF.
      </p>

      <PdfUploadZone onFiles={(f) => { clear(); setFile(f); }} disabled={loading} />
      <PdfFileChip file={file} onClear={loading ? undefined : clear} />

      {pageCount > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <PdfSecondaryButton onClick={() => rotateAll(STEP)} disabled={loading}>
            <RotateCw className="h-4 w-4" /> Rotate all +90°
          </PdfSecondaryButton>
          <PdfSecondaryButton onClick={() => rotateAll(-STEP)} disabled={loading}>
            <RotateCcw className="h-4 w-4" /> Rotate all −90°
          </PdfSecondaryButton>
        </div>
      ) : null}

      {thumbs.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {thumbs.map((t) => {
            const rot = rotations[t.page - 1] || 0;
            return (
              <div key={t.page} className="rounded-xl border border-[var(--ftp-line)] bg-white p-2">
                <div className="flex justify-center overflow-hidden rounded-lg bg-[var(--ftp-porcelain)] p-2">
                  <img
                    src={t.dataUrl}
                    alt={`Page ${t.page}`}
                    className="max-h-28 transition-transform duration-200"
                    style={{ transform: `rotate(${rot}deg)` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-1">
                  <span className="text-xs font-medium text-[var(--ftp-ink-soft)]">Page {t.page}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => rotatePage(t.page - 1, -STEP)} className="rounded border px-1.5 py-0.5 text-xs">−90°</button>
                    <button type="button" onClick={() => rotatePage(t.page - 1, STEP)} className="rounded border px-1.5 py-0.5 text-xs">+90°</button>
                  </div>
                </div>
                {rot ? <p className="mt-1 text-center text-[10px] text-teal-700">+{rot}° pending</p> : null}
              </div>
            );
          })}
        </div>
      ) : null}

      {loading ? <PdfProgress value={progress} label="Applying rotation…" /> : null}
      {error ? <PdfAlert tone="error">{error}</PdfAlert> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <PdfPrimaryButton onClick={apply} disabled={!file || loading}>
          <Download className="h-4 w-4" /> Download rotated PDF
        </PdfPrimaryButton>
      </div>
    </div>
  );
}
