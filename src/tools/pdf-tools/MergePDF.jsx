import React, { useState, useEffect, useCallback } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import ExploreRelatedTools from "../../components/ExploreRelatedTools";
import { PDFDocument } from "pdf-lib";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Download,
  Settings,
  Layers,
} from "lucide-react";

export default function MergePDF() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Cleanup blob preview URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview);
      });
    };
  }, [files]);

  // Calculate cumulative size
  const totalSizeMB = (
    files.reduce((acc, item) => acc + item.file.size, 0) /
    (1024 * 1024)
  ).toFixed(2);

  // Add files with duplicate prevention & extra state configs
  const addFiles = useCallback((incomingFiles) => {
    setFiles((prev) => {
      const existing = prev.map((item) => `${item.file.name}-${item.file.size}`);

      const uniqueFiles = incomingFiles
        .filter((file) => !existing.includes(`${file.name}-${file.size}`))
        .map((file) => ({
          file,
          preview: URL.createObjectURL(file),
          pageRange: "", // Blank means full document merge
        }));

      return [...prev, ...uniqueFiles];
    });
  }, []);

  // Dropzone Setup
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    onDrop: addFiles,
  });

  const handleFiles = (e) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index) => {
    const fileToRemove = files[index];
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    files.forEach((item) => {
      if (item.preview) URL.revokeObjectURL(item.preview);
    });
    setFiles([]);
    setProgress(0);
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

  // Set individual page ranges configuration
  const handlePageRangeChange = (index, value) => {
    setFiles((prev) => prev.map((item, i) => (i === index ? { ...item, pageRange: value } : item)));
  };

  const parsePageSelection = (value, totalPages) => {
    if (!value || !value.trim()) {
      return Array.from({ length: totalPages }, (_, index) => index);
    }

    const pages = new Set();
    const segments = value
      .split(",")
      .map((segment) => segment.trim())
      .filter(Boolean);

    segments.forEach((segment) => {
      if (!segment.includes("-")) {
        const page = Number(segment);
        if (!Number.isNaN(page) && page >= 1 && page <= totalPages) {
          pages.add(page - 1);
        }
        return;
      }

      const [startRaw, endRaw] = segment.split("-").map((part) => part.trim());
      const start = Number(startRaw);
      const end = Number(endRaw);

      if (
        !Number.isNaN(start) &&
        !Number.isNaN(end) &&
        start >= 1 &&
        end >= start &&
        end <= totalPages
      ) {
        for (let page = start; page <= end; page += 1) {
          pages.add(page - 1);
        }
      }
    });

    return Array.from(pages).sort((a, b) => a - b);
  };

  // Merge PDFs locally in the browser so the tool works without an external service
  const mergePDFs = async () => {
    if (files.length < 2) {
      alert("Please upload at least 2 PDF files to merge.");
      return;
    }

    try {
      setLoading(true);
      setProgress(0);

      const mergedPdf = await PDFDocument.create();

      for (let index = 0; index < files.length; index += 1) {
        const { file, pageRange } = files[index];
        const fileBuffer = await file.arrayBuffer();
        const sourcePdf = await PDFDocument.load(fileBuffer);
        const selectedPages = parsePageSelection(pageRange, sourcePdf.getPageCount());
        const copiedPages = await mergedPdf.copyPages(sourcePdf, selectedPages);

        copiedPages.forEach((page) => mergedPdf.addPage(page));
        setProgress(Math.round(((index + 1) / files.length) * 100));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `merged_${Date.now()}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setProgress(100);
    } catch (error) {
      console.error("Merge PDF Failure:", error);
      alert(error.message || "An error occurred while combining your PDF files.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo page="mergePdf" />

      <ToolHeroShell
        category="pdf-tools"
        icon={FileText}
        title="Advanced PDF Merger"
        subtitle="Combine files in your choice order, or configure exact page scopes per document seamlessly."
        formLabel="Merge"
        wide
      >
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-slate-800">
            {/* Upload Zone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragActive
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-400 bg-gray-50 text-gray-600"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud size={48} className="mx-auto mb-3 text-gray-400" />
              <div className="font-semibold text-base text-gray-700">
                Drag & Drop PDF Files Here
              </div>
              <div className="text-sm text-gray-400 mt-1">or click to scan files</div>
            </div>

            {/* Form Input Alternative fallback */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <span>Accepted Type: .pdf</span>
              <label className="cursor-pointer text-blue-600 font-medium hover:underline">
                Select manually
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFiles}
                  className="hidden"
                />
              </label>
            </div>

            {/* Actions Dashboard Panel */}
            {files.length > 0 && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="font-semibold text-gray-800 text-sm">
                    {files.length} Document(s) Loaded
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Combined Size: {totalSizeMB} MB
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearAllFiles}
                    className="px-4 py-2 text-sm font-medium bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={mergePDFs}
                    disabled={loading || files.length < 2}
                    className="px-5 py-2 text-sm font-medium btnRegular text-white rounded-xl shadow-sm hover:bg-blue-700 disabled:opacity-40 transition flex items-center gap-1.5"
                  >
                    {loading ? (
                      "Processing..."
                    ) : (
                      <>
                        <Download size={15} /> Merge Output
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Progress Metrics bar */}
            {loading && (
              <div className="mt-4 bg-blue-50 p-3 rounded-xl border border-blue-100">
                <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-center text-xs text-blue-700 font-medium mt-1.5">
                  Uploading and building assembly: {progress}% Complete
                </div>
              </div>
            )}

            {/* Custom List Container */}
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Arrange Order & Execution Rules
                </h3>
                <div className="space-y-3">
                  {files.map((item, index) => (
                    <div
                      key={`${item.file.name}-${index}`}
                      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl bg-white hover:border-gray-300 transition"
                    >
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="bg-gray-100 px-2 py-1.5 rounded-lg text-xs font-bold text-gray-500 mt-0.5">
                          #{index + 1}
                        </div>
                        <FileText className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
                        <div className="min-w-0">
                          <p
                            className="text-sm font-medium text-gray-800 truncate"
                            title={item.file.name}
                          >
                            {item.file.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      {/* Advanced Input Custom Segment Range Selection */}
                      <div className="flex flex-wrap items-center gap-3 sm:flex-nowrap">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-xl">
                          <Settings size={14} className="text-gray-400" />
                          <input
                            type="text"
                            placeholder="All pages (e.g. 1-3, 5)"
                            value={item.pageRange}
                            onChange={(e) => handlePageRangeChange(index, e.target.value)}
                            className="bg-transparent text-xs text-gray-700 outline-none w-36 placeholder-gray-400"
                          />
                        </div>

                        {/* Movement Management Control Stack */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="p-1.5 bg-gray-50 border rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveDown(index)}
                            disabled={index === files.length - 1}
                            className="p-1.5 bg-gray-50 border rounded-lg hover:bg-gray-100 disabled:opacity-30 transition"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="p-1.5 bg-red-50 border border-red-100 text-red-500 rounded-lg hover:bg-red-100 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
      </ToolHeroShell>

      {/* SEO CONTENT */}
      <ToolContentLayout
        category="pdf-tools"
        currentToolPath="/merge-pdf" />
    </>
  );
}
