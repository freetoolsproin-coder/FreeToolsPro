import { useEffect, useState } from "react";
import { Download, FileOutput, Files } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import {
  PdfAlert,
  PdfFileChip,
  PdfPageRangeField,
  PdfPrimaryButton,
  PdfProgress,
  PdfStats,
  PdfThumbnailStrip,
  PdfToggle,
  PdfUploadZone,
  parsePageRange,
} from "./pdfShared";
import { getPdfPageCount, renderPdfThumbnails } from "./pdfAdvanced";

export default function ExtractPdfPages() {
  const [file, setFile] = useState(null);
  const [pageRange, setPageRange] = useState("1");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputs, setOutputs] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [extractedCount, setExtractedCount] = useState(0);
  const [splitSeparate, setSplitSeparate] = useState(false);
  const [thumbs, setThumbs] = useState([]);
  const [thumbTotal, setThumbTotal] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      const total = await getPdfPageCount(file);
      const { thumbs: t, total: n } = await renderPdfThumbnails(file, 12);
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
    outputs.forEach((o) => URL.revokeObjectURL(o.url));
    setFile(null);
    setOutputs([]);
    setPageCount(0);
    setExtractedCount(0);
    setThumbs([]);
    setError("");
  };

  const extract = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setProgress(8);
    outputs.forEach((o) => URL.revokeObjectURL(o.url));
    setOutputs([]);

    try {
      const source = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const total = source.getPageCount();
      const indexes = parsePageRange(pageRange, total);

      if (!indexes.length) {
        throw new Error(`Enter valid pages between 1 and ${total} (example: 1-3, 5).`);
      }

      const base = file.name.replace(/\.pdf$/i, "") || "document";
      const results = [];

      if (splitSeparate) {
        for (let i = 0; i < indexes.length; i += 1) {
          const doc = await PDFDocument.create();
          const [page] = await doc.copyPages(source, [indexes[i]]);
          doc.addPage(page);
          const bytes = await doc.save();
          results.push({
            name: `${base}-page-${indexes[i] + 1}.pdf`,
            url: URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })),
            pages: 1,
          });
          setProgress(Math.round(((i + 1) / indexes.length) * 100));
        }
      } else {
        const output = await PDFDocument.create();
        const copied = await output.copyPages(source, indexes);
        copied.forEach((page) => output.addPage(page));
        const bytes = await output.save();
        results.push({
          name: `${base}-extracted.pdf`,
          url: URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })),
          pages: indexes.length,
        });
        setProgress(100);
      }

      setOutputs(results);
      setExtractedCount(indexes.length);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not extract pages.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1">
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Extract page ranges into one PDF or separate files per page—with live thumbnails and local
        processing.
      </p>

      <PdfUploadZone onFiles={(f) => { clear(); setFile(f); }} disabled={loading} />
      <PdfFileChip file={file} onClear={loading ? undefined : clear} />
      <PdfThumbnailStrip thumbs={thumbs} total={thumbTotal} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <PdfPageRangeField value={pageRange} onChange={setPageRange} disabled={loading} totalPages={pageCount} />
        <PdfToggle
          label="One file per page"
          description="Download each extracted page as its own PDF."
          checked={splitSeparate}
          onChange={setSplitSeparate}
          disabled={loading}
        />
      </div>

      {loading ? <PdfProgress value={progress} label="Extracting pages…" /> : null}
      {error ? <PdfAlert tone="error">{error}</PdfAlert> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <PdfPrimaryButton onClick={extract} disabled={!file || loading}>
          <FileOutput className="h-4 w-4" /> Extract pages
        </PdfPrimaryButton>
      </div>

      {outputs.length ? (
        <>
          <PdfStats items={[{ label: "Pages selected", value: extractedCount }, { label: "Output files", value: outputs.length }, { label: "Mode", value: splitSeparate ? "Separate" : "Single PDF" }]} />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {outputs.map((out) => (
              <a key={out.name} href={out.url} download={out.name} className="flex items-center justify-between rounded-xl border border-[var(--ftp-line)] px-4 py-3 text-sm font-semibold hover:bg-[var(--ftp-porcelain)]">
                <span className="inline-flex items-center gap-2 truncate">
                  {outputs.length > 1 ? <Files className="h-4 w-4 shrink-0" /> : <Download className="h-4 w-4 shrink-0" />}
                  {out.name}
                </span>
                <span className="text-xs text-[var(--ftp-ink-soft)]">{out.pages} pg</span>
              </a>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
