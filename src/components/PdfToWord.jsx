import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function PdfToWord() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [results, setResults] = useState({});
  const [error, setError] = useState("");

  const workerRef = useRef(null);
  const inputRef = useRef(null);

  /* Init Worker */
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/uploadWorker.js", import.meta.url),
      { type: "module" }
    );

    return () => workerRef.current.terminate();
  }, []);

  /* Drag & Drop */
  const handleDrop = (e) => {
    e.preventDefault();
    setFiles([...e.dataTransfer.files]);
  };

  const handleFiles = (fileList) => {
    setFiles([...fileList]);
  };

  /* Upload & Convert */
  const convertFile = async (file) => {
    setProgress((p) => ({ ...p, [file.name]: 0 }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://api.cloudmersive.com/convert/pdf/to/docx",
        formData,
        {
          headers: {
            Apikey: "CLOUDMERSIVE_API_KEY",
          },
          responseType: "blob",
          onUploadProgress: (e) => {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress((p) => ({ ...p, [file.name]: percent }));
          },
        }
      );

      const url = URL.createObjectURL(res.data);
      setResults((r) => ({ ...r, [file.name]: url }));
    } catch {
      setError("Conversion failed for some files.");
    }
  };

  const startConversion = () => {
    files.forEach(convertFile);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">PDF → Word Converter</h2>

      {/* Drag Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded-lg p-6 text-center mb-4"
      >
        <p className="text-sm text-gray-600">
          Drag & drop PDFs here or
        </p>
        <button
          onClick={() => inputRef.current.click()}
          className="text-blue-600 underline"
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Cloud Import */}
      <div className="flex gap-3 mb-4">
        <a
          href="https://drive.google.com/drive/u/0/my-drive"
          target="_blank"
          className="text-sm underline"
        >
          Import from Google Drive
        </a>
        <a
          href="https://www.dropbox.com/home"
          target="_blank"
          className="text-sm underline"
        >
          Import from Dropbox
        </a>
      </div>

      {/* File List */}
      {files.map((file) => (
        <div key={file.name} className="mb-3">
          <div className="flex justify-between text-sm">
            <span>{file.name}</span>
            <span>{progress[file.name] || 0}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${progress[file.name] || 0}%` }}
            />
          </div>

          {/* Download */}
          {results[file.name] && (
            <a
              href={results[file.name]}
              download={file.name.replace(".pdf", ".docx")}
              className="text-green-600 text-sm"
            >
              Download Word
            </a>
          )}
        </div>
      ))}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {files.length > 0 && (
        <button
          onClick={startConversion}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded"
        >
          Convert Files
        </button>
      )}
    </div>
  );
}
