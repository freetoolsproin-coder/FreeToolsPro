import { useState, useEffect, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { useDropzone } from "react-dropzone";
import {
  ArrowDown,
  ArrowUp,
  Download,
  FileText,
  Layers,
  Settings,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import { formatBytes, parsePageRange, PdfProgress } from "./pdfShared";
import { downloadBytes } from "./pdfAdvanced";

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputName, setOutputName] = useState("merged-document");
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, [files]);

  const totalSize = files.reduce((acc, item) => acc + item.file.size, 0);
  const totalPages = files.reduce((acc, item) => acc + (item.pageCount || 0), 0);

  const addFiles = useCallback(async (incomingFiles) => {
    setError("");
    const enriched = [];
    for (const file of incomingFiles) {
      let pageCount = 0;
      try {
        const doc = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        pageCount = doc.getPageCount();
      } catch {
        pageCount = 0;
      }
      enriched.push({
        file,
        preview: URL.createObjectURL(file),
        pageRange: "",
        pageCount,
      });
    }

    setFiles((prev) => {
      const existing = new Set(prev.map((item) => `${item.file.name}-${item.file.size}`));
      return [...prev, ...enriched.filter((item) => !existing.has(`${item.file.name}-${item.file.size}`))];
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    onDrop: addFiles,
  });

  const removeFile = (index) => {
    const fileToRemove = files[index];
    if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    files.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });
    setFiles([]);
    setProgress(0);
    setError("");
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...files];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFiles(updated);
  };

  const moveDown = (index) => {
    if (index === files.length - 1) return;
    const updated = [...files];
    [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
    setFiles(updated);
  };

  const handlePageRangeChange = (index, value) => {
    setFiles((prev) => prev.map((item, i) => (i === index ? { ...item, pageRange: value } : item)));
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Upload at least 2 PDF files to merge.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setProgress(0);

      const mergedPdf = await PDFDocument.create();
      let mergedPageCount = 0;

      for (let index = 0; index < files.length; index += 1) {
        const { file, pageRange } = files[index];
        const sourcePdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
        const selectedPages = parsePageRange(pageRange, sourcePdf.getPageCount());
        const copiedPages = await mergedPdf.copyPages(sourcePdf, selectedPages);
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        mergedPageCount += selectedPages.length;
        setProgress(Math.round(((index + 1) / files.length) * 100));
      }

      const mergedBytes = await mergedPdf.save();
      const safeName = outputName.trim().replace(/[^\w.-]+/g, "-") || "merged-document";
      downloadBytes(`${safeName}.pdf`, mergedBytes);
      setProgress(100);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not merge these PDFs. Check encryption and page ranges.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo page="mergePdf" />
      <ToolHeroShell
        category="pdf-tools"
        icon={Layers}
        title="Merge PDF"
        subtitle="Combine multiple PDFs in custom order with per-file page ranges—advanced merge desk."
        formLabel="Merge"
        wide
      >
        <div className="rounded-2xl border border-[var(--ftp-line)] bg-white p-4 sm:p-6">
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
              isDragActive
                ? "border-[var(--hero-accent)] bg-[var(--hero-accent-soft)]"
                : "border-[var(--ftp-line-strong)] bg-[var(--ftp-porcelain)] hover:border-[var(--hero-accent)]"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto mb-3 h-12 w-12 text-[var(--hero-accent)]" />
            <p className="font-semibold text-[var(--ftp-ink)]">Drag & drop PDF files</p>
            <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">or click to browse · multiple files</p>
          </div>

          {files.length > 0 ? (
            <div className="mt-5 flex flex-col gap-4 rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[var(--ftp-ink)]">
                  {files.length} file(s) · {totalPages || "?"} pages · {formatBytes(totalSize)}
                </p>
                <label className="mt-2 block text-sm text-[var(--ftp-ink-soft)]">
                  Output filename
                  <input
                    type="text"
                    value={outputName}
                    onChange={(e) => setOutputName(e.target.value)}
                    className="mt-1 w-full max-w-xs rounded-xl border border-[var(--ftp-line)] bg-white px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={clearAllFiles} className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                  Clear all
                </button>
                <button type="button" onClick={mergePDFs} disabled={loading || files.length < 2} className="inline-flex items-center gap-2 rounded-xl bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-40">
                  <Download className="h-4 w-4" />
                  {loading ? "Merging…" : "Merge PDF"}
                </button>
              </div>
            </div>
          ) : null}

          {loading ? <PdfProgress value={progress} label="Merging documents…" /> : null}
          {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

          {files.length > 0 ? (
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--ftp-ink-soft)]">
                Order & page scopes
              </h3>
              {files.map((item, index) => (
                <div key={`${item.file.name}-${index}`} className="flex flex-col gap-3 rounded-xl border border-[var(--ftp-line)] bg-white p-4 lg:flex-row lg:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="rounded-lg bg-[var(--ftp-porcelain)] px-2 py-1 text-xs font-bold text-[var(--ftp-ink-soft)]">#{index + 1}</span>
                    <FileText className="h-5 w-5 shrink-0 text-red-500" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[var(--ftp-ink)]">{item.file.name}</p>
                      <p className="text-xs text-[var(--ftp-ink-soft)]">
                        {formatBytes(item.file.size)} · {item.pageCount || "?"} pages
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-2.5 py-1.5">
                      <Settings className="h-3.5 w-3.5 text-[var(--ftp-ink-soft)]" />
                      <input
                        type="text"
                        placeholder="All pages (1-3, 5)"
                        value={item.pageRange}
                        onChange={(e) => handlePageRangeChange(index, e.target.value)}
                        className="w-36 bg-transparent text-xs outline-none"
                      />
                    </div>
                    <button type="button" onClick={() => moveUp(index)} disabled={index === 0} className="rounded-lg border p-1.5 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button>
                    <button type="button" onClick={() => moveDown(index)} disabled={index === files.length - 1} className="rounded-lg border p-1.5 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button>
                    <button type="button" onClick={() => removeFile(index)} className="rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </ToolHeroShell>
      <ToolContentLayout category="pdf-tools" currentToolPath="/pdf-tools/pdf-merger" />
    </>
  );
}
