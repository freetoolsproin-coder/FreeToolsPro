import { useEffect, useState } from "react";
import { Download, Scissors, ImageDown } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import PdfToolPage from "./PdfToolPage";
import {
  PdfAlert,
  PdfFileChip,
  PdfPageRangeField,
  PdfPrimaryButton,
  PdfProgress,
  PdfStats,
  PdfThumbnailStrip,
  PdfUploadZone,
} from "./pdfShared";
import { chunkPageIndexes, getPdfPageCount, parseSplitRanges, renderPdfThumbnails } from "./pdfAdvanced";

const MODES = [
  { id: "each", label: "Every page", desc: "One PDF per page" },
  { id: "chunk", label: "By chunk size", desc: "Group N pages per file" },
  { id: "ranges", label: "Custom ranges", desc: "Use | between groups (1-2|3-5)" },
];

export default function PdfSplitter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [parts, setParts] = useState([]);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("each");
  const [chunkSize, setChunkSize] = useState(2);
  const [rangeInput, setRangeInput] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [thumbs, setThumbs] = useState([]);
  const [thumbTotal, setThumbTotal] = useState(0);

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      const total = await getPdfPageCount(file);
      const { thumbs: t, total: n } = await renderPdfThumbnails(file, 10);
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

  const clearParts = () => {
    parts.forEach((p) => URL.revokeObjectURL(p.url));
    setParts([]);
  };

  const split = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setProgress(5);
    clearParts();

    try {
      const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const total = source.getPageCount();
      const base = file.name.replace(/\.pdf$/i, "") || "document";
      const output = [];

      let groups = [];
      if (mode === "each") {
        groups = Array.from({ length: total }, (_, i) => [i]);
      } else if (mode === "chunk") {
        const size = Math.max(1, Number(chunkSize) || 1);
        groups = chunkPageIndexes(total, size);
      } else {
        groups = parseSplitRanges(rangeInput, total);
        if (!groups.length) throw new Error("Enter valid ranges separated by | (example: 1-2|3-5).");
      }

      for (let g = 0; g < groups.length; g += 1) {
        const indexes = groups[g];
        const document = await PDFDocument.create();
        const copied = await document.copyPages(source, indexes);
        copied.forEach((page) => document.addPage(page));
        const bytes = await document.save();
        const label =
          mode === "each"
            ? `page-${indexes[0] + 1}`
            : `part-${g + 1}-pages-${indexes.map((i) => i + 1).join("-")}`;
        output.push({
          name: `${base}-${label}.pdf`,
          url: URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })),
          pages: indexes.length,
        });
        setProgress(Math.round(((g + 1) / groups.length) * 100));
      }
      setParts(output);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not split this PDF.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const downloadAll = () => {
    parts.forEach((part) => {
      const link = document.createElement("a");
      link.href = part.url;
      link.download = part.name;
      link.click();
    });
  };

  return (
    <PdfToolPage
      title="Split PDF"
      subtitle="Split every page, chunk pages, or use custom ranges—download multiple PDFs locally."
      path="/pdf-tools/pdf-splitter"
    >
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Advanced split modes for invoices, chapters, and batch downloads. Your file never leaves this
        device.
      </p>

      <PdfUploadZone
        onFiles={(selected) => {
          setFile(selected);
          clearParts();
          setError("");
        }}
        disabled={loading}
        hint="Split locally · multiple output files"
      />

      <PdfFileChip file={file} onClear={loading ? undefined : () => { setFile(null); clearParts(); }} />
      <PdfThumbnailStrip thumbs={thumbs} total={thumbTotal} />

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`rounded-xl border px-3 py-3 text-left transition ${
              mode === m.id
                ? "border-[var(--hero-accent)] bg-[var(--hero-accent-soft)]"
                : "border-[var(--ftp-line)] bg-white hover:border-teal-300"
            }`}
          >
            <span className="block text-sm font-semibold text-[var(--ftp-ink)]">{m.label}</span>
            <span className="mt-0.5 block text-xs text-[var(--ftp-ink-soft)]">{m.desc}</span>
          </button>
        ))}
      </div>

      {mode === "chunk" ? (
        <label className="mt-4 block text-sm text-[var(--ftp-ink-soft)]">
          Pages per file
          <input
            type="number"
            min={1}
            max={pageCount || 999}
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            className="mt-1.5 w-full max-w-xs rounded-xl border border-[var(--ftp-line)] bg-white px-3 py-2.5 text-sm"
          />
        </label>
      ) : null}

      {mode === "ranges" ? (
        <div className="mt-4">
          <PdfPageRangeField
            value={rangeInput}
            onChange={setRangeInput}
            disabled={loading}
            totalPages={pageCount}
            hint="Example: 1-3|4-6|8 (pipe separates output files)"
          />
        </div>
      ) : null}

      {loading ? <PdfProgress value={progress} label="Splitting PDF…" /> : null}
      {error ? <PdfAlert tone="error">{error}</PdfAlert> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <PdfPrimaryButton onClick={split} disabled={!file || loading}>
          <Scissors className="h-4 w-4" /> Split PDF
        </PdfPrimaryButton>
        {parts.length > 1 ? (
          <button type="button" onClick={downloadAll} className="inline-flex items-center gap-2 rounded-xl border border-[var(--ftp-line)] bg-white px-4 py-3 text-sm font-semibold hover:bg-[var(--ftp-porcelain)]">
            <ImageDown className="h-4 w-4" /> Download all ({parts.length})
          </button>
        ) : null}
      </div>

      {parts.length ? (
        <>
          <PdfStats items={[{ label: "Output files", value: parts.length }, { label: "Source pages", value: pageCount }, { label: "Mode", value: MODES.find((m) => m.id === mode)?.label }]} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {parts.map((part) => (
              <a key={part.name} href={part.url} download={part.name} className="flex items-center justify-between rounded-xl border border-[var(--ftp-line)] px-4 py-3 text-sm font-semibold hover:bg-[var(--ftp-porcelain)]">
                <span className="truncate pr-2">{part.name}</span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[var(--hero-accent)]">
                  <Download className="h-4 w-4" /> {part.pages} pg
                </span>
              </a>
            ))}
          </div>
        </>
      ) : null}
    </PdfToolPage>
  );
}
