import { useState, useRef } from "react";
import Tesseract from "tesseract.js";
import { Upload, Copy, Download, Check, RefreshCw, Languages, Sliders, Trash2, Image } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function ImageToText() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("eng");
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Preprocessing states
  const [contrast, setContrast] = useState(0); // -100 to 100
  const [brightness, setBrightness] = useState(0); // -100 to 100

  const fileInputRef = useRef(null);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setText("");
    setProgress(0);
  };

  const handleInputChange = (e) => {
    handleFile(e.target.files[0]);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Preprocesses the image using canvas filters for better OCR readability
  const preprocessImage = () => {
    return new Promise((resolve) => {
      if (contrast === 0 && brightness === 0) {
        resolve(preview); // Return original if no adjustments made
        return;
      }

      const img = new Image();
      img.src = preview;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        // Apply CSS-like filters natively to the canvas context
        ctx.filter = `brightness(${100 + Number(brightness)}%) contrast(${100 + Number(contrast)}%)`;
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL(image.type));
      };
    });
  };

  const extractText = async () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);

    try {
      // Step 1: Process image filters prior to running OCR
      const processedImageSource = await preprocessImage();

      // Step 2: Run Tesseract
      const result = await Tesseract.recognize(processedImageSource, language, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.floor(m.progress * 100));
          }
        },
        // Full core registers legacy params referenced by some traineddata configs.
        legacyCore: true,
      });

      setText(result.data.text || "No text could be found in this image.");
    } catch (error) {
      console.error("OCR Error:", error);
      setText("An error occurred while analyzing the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const downloadText = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setImage(null);
    setPreview(null);
    setText("");
    setProgress(0);
    setContrast(0);
    setBrightness(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      <Seo page="imagetotextextractor" />

      <ToolHeroShell
        category="image-tools"
        icon={Image}
        title="Extract Text From Image"
        subtitle="Upload JPG, PNG, or WEBP images and instantly extract text using advanced OCR technology."
        formLabel="Start here"
      >
{preview && (
            <button
              onClick={resetTool}
              className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-slate-800 transition"
              title="Clear All"
            >
              <Trash2 size={20} /> Clear All
            </button>
          )}

          {/* Configuration Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-4 gap-4 mb-6 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
            {/* Language Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <Languages size={16} /> Language Selection
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="eng">English (ENG)</option>
                <option value="spa">Spanish (SPA)</option>
                <option value="fra">French (FRA)</option>
                <option value="deu">German (DEU)</option>
              </select>
            </div>

            {/* Adjustments */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <Sliders size={16} /> Image Enhancements (Boost OCR)
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                <div>
                  <div className="flex justify-between mb-1 text-slate-400">
                    <span>Contrast</span>
                    <span>{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={contrast}
                    onChange={(e) => setContrast(e.target.value)}
                    className="w-full accent-blue-500 bg-slate-700 h-1 rounded inputSlider"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-slate-400">
                    <span>Brightness</span>
                    <span>{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={brightness}
                    onChange={(e) => setBrightness(e.target.value)}
                    className="w-full accent-blue-500 bg-slate-700 h-1 rounded inputSlider"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dropzone/Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition relative min-h-[180px] ${
              preview
                ? "border-slate-700 bg-slate-950/20"
                : "cursor-pointer border-slate-700 hover:border-slate-500 bg-slate-950/40"
            } ${isDragging ? "border-blue-500 bg-blue-500/10" : ""}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
            />

            {!preview ? (
              <>
                <Upload size={40} className="text-slate-500 mb-3" />
                <p className="text-base font-medium text-slate-300 text-center">
                  Drag & Drop image here, or <span className="text-blue-400">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, WEBP</p>
              </>
            ) : (
              <div className="w-full flex flex-col items-center">
                <div className="max-w-full max-h-[300px] overflow-hidden rounded-xl border border-slate-800">
                  <img
                    src={preview}
                    alt="Source Preview"
                    style={{
                      filter: `brightness(${100 + Number(brightness)}%) contrast(${100 + Number(contrast)}%)`,
                    }}
                    className="w-full max-h-[300px] object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-3 text-xs text-slate-400 hover:text-white underline"
                >
                  Change Image
                </button>
              </div>
            )}
          </div>

          {/* Core Action Button */}
          {preview && (
            <div className="mt-5 text-center mx-auto">
              <button
                onClick={extractText}
                disabled={loading}
                className="w-full btnRegular disabled:bg-slate-800 text-white font-medium py-3 rounded-xl transition flex justify-center items-center gap-2 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Parsing Content ({progress}%)</span>
                  </>
                ) : (
                  <>
                    <Check size={18} /> <span>Run Text Extraction</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Results Output Block */}
          {text && (
            <div className="mt-8 border-t border-slate-800 pt-6 animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-semibold tracking-wider uppercase text-slate-400">
                  Extracted Output
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={copyText}
                    className="flex items-center gap-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-700 transition"
                  >
                    {isCopied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    {isCopied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={downloadText}
                    className="flex items-center gap-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs px-3 py-2 rounded-lg border border-slate-700 transition"
                  >
                    <Download size={14} /> Download (.txt)
                  </button>
                </div>
              </div>
              <textarea
                value={text}
                readOnly
                rows={8}
                className="w-full jsonTextarea border border-slate-800 bg-slate-950 text-slate-300 rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-slate-700 resize-y"
              />
            </div>
          )}
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/image-to-text" />
    </>
  );
}
