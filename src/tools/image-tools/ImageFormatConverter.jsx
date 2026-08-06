import React, { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Image as ImageIcon, Loader2, Download } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

const formatOptions = ["png", "jpg", "webp", "gif"];

function normalizeFormat(value) {
  if (!value) return null;
  const v = String(value).toLowerCase().replace("jpeg", "jpg");
  return formatOptions.includes(v) ? v : null;
}

export default function ImageFormatConverter() {
  const [params] = useSearchParams();
  const presetTo = normalizeFormat(params.get("to"));
  const [file, setFile] = useState(null);
  const [toFormat, setToFormat] = useState(presetTo || "png");
  const [convertedUrl, setConvertedUrl] = useState(null);
  const [originalUrl, setOriginalUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (presetTo) setToFormat(presetTo);
  }, [presetTo]);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    };
  }, [originalUrl, convertedUrl]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      setFile(selectedFile);
      setOriginalUrl(URL.createObjectURL(selectedFile));
      setConvertedUrl(null);
      setError("");
    }
  };

  const handleConvert = useCallback(async () => {
    if (!file) {
      setError("Please select a file to convert.");
      return;
    }

    const isHeic =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (isHeic) {
      setError(
        "HEIC/HEIF conversion is not supported in the browser. Please convert to JPG/PNG first, or use a different format."
      );
      return;
    }

    setError("");
    setIsLoading(true);
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setConvertedUrl(null);

    try {
      const image = new Image();
      const objectUrl = URL.createObjectURL(file);

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = () => reject(new Error("Could not load image."));
        image.src = objectUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext("2d");
      if (toFormat === "jpg" || toFormat === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(image, 0, 0);
      URL.revokeObjectURL(objectUrl);

      const mimeType = toFormat === "jpg" ? "image/jpeg" : `image/${toFormat}`;
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, mimeType, 0.92);
      });

      if (!blob) {
        throw new Error("Conversion failed.");
      }

      setConvertedUrl(URL.createObjectURL(blob));
    } catch {
      setError("Conversion failed. Please check the file and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [file, toFormat, convertedUrl]);

  return (
    <>
      <Seo page="imageFormatConverter" />

      <ToolHeroShell
        icon={ImageIcon}
        title="Image Format Converter"
        subtitle="Convert images between PNG, JPG, WebP, and GIF in your browser"
        maxWidth="max-w-5xl"
      >
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300">
            Upload Image
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/*"
            onChange={handleFileChange}
            className={`${inputDark} mt-2 file:mr-4 file:rounded-full file:border-0 file:bg-sky-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-300`}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="to-format" className="block text-sm font-medium text-slate-300">
              Convert to
            </label>
            <select
              id="to-format"
              value={toFormat}
              onChange={(e) => setToFormat(e.target.value)}
              className={`${selectDark} mt-2`}
            >
              {formatOptions.map((f) => (
                <option key={f} value={f}>
                  {f.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleConvert}
            disabled={isLoading || !file}
            className="flex items-center justify-center gap-2 self-end rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            {isLoading ? "Converting..." : "Convert"}
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        )}

        {(originalUrl || convertedUrl) && (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {originalUrl && (
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-center">
                <h2 className="mb-2 text-lg font-semibold text-white">Original</h2>
                <img
                  src={originalUrl}
                  alt="Original"
                  className="mx-auto max-h-64 max-w-full rounded-lg object-contain"
                />
              </div>
            )}
            {convertedUrl && (
              <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-center">
                <h2 className="mb-2 text-lg font-semibold text-white">Converted</h2>
                <img
                  src={convertedUrl}
                  alt="Converted"
                  className="mx-auto max-h-64 max-w-full rounded-lg object-contain"
                />
                <a
                  href={convertedUrl}
                  download={`converted.${toFormat === "jpg" ? "jpg" : toFormat}`}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
              </div>
            )}
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="image-tools"
        currentToolPath="/image-tools/image-format-converter" />
    </>
  );
}
