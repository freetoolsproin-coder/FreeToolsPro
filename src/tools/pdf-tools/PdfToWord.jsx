import axios from "axios";
import { useRef, useState } from "react";
import { Check } from "lucide-react";

const API_KEY = import.meta.env.VITE_CLOUDMERSIVE_API_KEY || "";
const API_CONFIGURED = Boolean(API_KEY && API_KEY !== "CLOUDMERSIVE_API_KEY");

export default function PdfToWord() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({});
  const [results, setResults] = useState({});
  const [error, setError] = useState("");

  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    if (!API_CONFIGURED) return;
    setFiles([...e.dataTransfer.files]);
  };

  const handleFiles = (fileList) => {
    setFiles([...fileList]);
  };

  const convertFile = async (file) => {
    setProgress((p) => ({ ...p, [file.name]: 0 }));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://api.cloudmersive.com/convert/pdf/to/docx", formData, {
        headers: {
          Apikey: API_KEY,
        },
        responseType: "blob",
        onUploadProgress: (e) => {
          if (e.total) {
            const percent = Math.round((e.loaded * 100) / e.total);
            setProgress((p) => ({ ...p, [file.name]: percent }));
          }
        },
      });

      const url = URL.createObjectURL(res.data);
      setResults((r) => ({ ...r, [file.name]: url }));
    } catch (err) {
      console.error(err);
      setError("Conversion failed. Check the API key configuration or try again later.");
    }
  };

  const startConversion = () => {
    if (!API_CONFIGURED) {
      setError("PDF to Word is not available yet — conversion API is not configured.");
      return;
    }
    setError("");
    files.forEach(convertFile);
  };

  if (!API_CONFIGURED) {
    return (
      <div className="mx-auto mt-8 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-6 text-center text-sm text-amber-50 sm:p-8">
        <p className="text-base font-semibold text-white">PDF to Word is not available yet</p>
        <p className="mt-2 text-white/80">
          This mode needs a configured conversion API key. Use <strong>PDF to JPG</strong> for
          in-browser page exports, or <strong>PDF Editor</strong> for simple text overlays.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center"
      >
        <div className="text-sm text-white text-center mb-4">Drag & drop PDFs here or</div>

        <button type="button" onClick={() => inputRef.current.click()} className="btnRegular">
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

      {files.map((file) => (
        <div key={file.name} className="mb-3">
          <div className="flex justify-between text-sm">
            <span>{file.name}</span>
            <span>{progress[file.name] || 0}%</span>
          </div>

          <div className="h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${progress[file.name] || 0}%` }}
            />
          </div>

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

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="text-center">
        {files.length > 0 && (
          <button
            type="button"
            onClick={startConversion}
            className="mt-4 w-full btnRegular text-white rounded-2xl"
          >
            Convert Files
          </button>
        )}
      </div>

      {Object.keys(results).length > 0 && (
        <p className="mt-3 flex items-center justify-center gap-1 text-sm text-emerald-400">
          <Check className="h-4 w-4" /> Ready
        </p>
      )}
    </div>
  );
}
