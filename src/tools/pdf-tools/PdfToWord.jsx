import { useEffect, useState } from "react";
import { Check, Download, Eye, ScanText } from "lucide-react";
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
  buildWordDocBlob,
} from "./pdfShared";
import {
  countWords,
  extractTextAdvanced,
  getPdfPageCount,
  renderPdfThumbnails,
  resolveOcrLang,
} from "./pdfAdvanced";
import { translatePdfPages } from "./pdfTranslate";

export default function PdfToWord({
  language = "Word",
  convertLabel = "Convert to Word",
  downloadLabel = "Download Word",
  downloadExt = "doc",
  scriptPattern = null,
  translate = false,
}) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadName, setDownloadName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [pageRange, setPageRange] = useState("");
  const [useOcr, setUseOcr] = useState(false);
  const [preview, setPreview] = useState("");
  const [thumbs, setThumbs] = useState([]);
  const [thumbTotal, setThumbTotal] = useState(0);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const clear = () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setFile(null);
    setDownloadUrl("");
    setDownloadName("");
    setPageCount(0);
    setPageRange("");
    setPreview("");
    setThumbs([]);
    setThumbTotal(0);
    setProgress(0);
    setError("");
    setNote("");
  };

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    (async () => {
      try {
        const total = await getPdfPageCount(file);
        if (!cancelled) setPageCount(total);
        const { thumbs: t, total: n } = await renderPdfThumbnails(file, 8);
        if (!cancelled) {
          setThumbs(t);
          setThumbTotal(n);
        }
      } catch {
        if (!cancelled) setPageCount(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [file]);

  const convert = async () => {
    if (!file) {
      setError("Upload a PDF first.");
      return;
    }

    setLoading(true);
    setError("");
    setNote("");
    setPreview("");
    setProgress(8);
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    setDownloadUrl("");

    try {
      setProgressLabel(useOcr ? "Running OCR on pages…" : "Extracting text…");
      const { pages, numPages } = await extractTextAdvanced(file, {
        pageRange,
        useOcr,
        ocrLang: resolveOcrLang(language),
        onProgress: setProgress,
      });
      setPageCount(numPages);

      const hasText = pages.some((p) => p && p.trim());
      if (!hasText) {
        setError(
          "No readable text found. Enable OCR for scanned PDFs, or check your page range."
        );
        setLoading(false);
        setProgress(0);
        return;
      }

      let outputPages = pages;
      if (translate) {
        setProgressLabel(`Translating to ${language}…`);
        setProgress(55);
        const result = await translatePdfPages(pages, language, (pct) =>
          setProgress(55 + Math.round(pct * 0.35))
        );
        outputPages = result.pages;
        if (result.note) {
          setNote(result.note);
        } else if (result.via === "groq") {
          setNote(`Translated to ${language} using the server translator. Review names and numbers before publishing.`);
        }
        setProgress(90);
      } else if (
        scriptPattern &&
        !useOcr &&
        !pages.some((page) => scriptPattern.test(page))
      ) {
        setError(
          `No readable ${language} text in the selected pages. Try OCR or a different page range.`
        );
        setLoading(false);
        setProgress(0);
        return;
      }

      const base = file.name.replace(/\.pdf$/i, "") || "document";
      const blob = buildWordDocBlob(outputPages, translate ? `${base} - ${language}` : base);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadName(`${base}${translate ? `-${language.toLowerCase()}` : ""}.${downloadExt}`);
      setPreview(outputPages.join("\n\n---\n\n").slice(0, 2400));
      setProgress(100);
      if (!translate) {
        setNote(
          useOcr
            ? "Document built with OCR text recognition. Review for accuracy before publishing."
            : "Editable document created from the PDF text layer. Layout is simplified for editing."
        );
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not convert this PDF. Try another file or enable OCR.");
      setProgress(0);
    } finally {
      setLoading(false);
      setProgressLabel("");
    }
  };

  const wordCount = countWords(preview);

  return (
    <div className="space-y-1">
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Advanced PDF to {downloadExt === "docx" ? "DOCX" : "Word"} conversion with optional OCR,
        page ranges, live preview, and {translate ? `${language} translation` : "local processing"}.
      </p>

      <PdfUploadZone
        onFiles={(f) => {
          clear();
          setFile(f);
        }}
        disabled={loading}
        hint="Text PDFs · scanned pages supported with OCR"
      />

      <PdfFileChip file={file} onClear={loading ? undefined : clear} />

      <PdfThumbnailStrip thumbs={thumbs} total={thumbTotal} />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <PdfPageRangeField
          value={pageRange}
          onChange={setPageRange}
          disabled={loading}
          totalPages={pageCount}
        />
        <PdfToggle
          label="OCR for scanned pages"
          description="Uses Tesseract when text layer is empty (slower, runs locally)."
          checked={useOcr}
          onChange={setUseOcr}
          disabled={loading}
        />
      </div>

      {loading ? (
        <PdfProgress value={progress} label={progressLabel || "Converting…"} />
      ) : null}

      {error ? <PdfAlert tone="error">{error}</PdfAlert> : null}

      {note ? (
        <PdfAlert tone="success">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Check className="h-4 w-4" aria-hidden="true" /> Ready
          </span>
          <p className="mt-1">{note}</p>
          <PdfStats
            items={[
              { label: "Pages", value: pageCount || "—" },
              { label: "Words", value: wordCount || "—" },
              { label: "OCR", value: useOcr ? "On" : "Off" },
            ]}
          />
        </PdfAlert>
      ) : null}

      {preview ? (
        <div className="mt-4 rounded-xl border border-[var(--ftp-line)] bg-white p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">
            <Eye className="h-3.5 w-3.5" /> Text preview
          </p>
          <pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-6 text-[var(--ftp-ink-soft)]">
            {preview}
            {preview.length >= 2400 ? "\n…" : ""}
          </pre>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <PdfPrimaryButton onClick={convert} disabled={!file || loading}>
          {useOcr ? <ScanText className="h-4 w-4" /> : null}
          {convertLabel}
        </PdfPrimaryButton>
        {downloadUrl ? (
          <a
            href={downloadUrl}
            download={downloadName}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            {downloadLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
