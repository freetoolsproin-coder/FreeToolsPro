import { useState } from "react";
import { ImagePlus, Upload, Copy, Check, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";
import { ToolSeoIntro, ToolSeoStandard } from "../../utils/toolSeoBlocks";

function cleanFilename(name) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b(img|image|photo|pic|screenshot|dsc|dscn)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function describeAspectRatio(w, h) {
  const ratio = w / h;
  if (ratio > 1.6) return "wide cinematic composition";
  if (ratio > 1.2) return "landscape orientation";
  if (ratio < 0.7) return "tall portrait orientation";
  if (ratio < 0.9) return "vertical composition";
  return "balanced square-like framing";
}

function buildPrompt({ name, width, height }) {
  const subject = cleanFilename(name) || "a detailed scene";
  const aspect = describeAspectRatio(width, height);
  const size = `${width}×${height}px`;

  return `A highly detailed image of ${subject}, ${aspect}, ${size} resolution, sharp focus, natural lighting, rich textures, professional photography style, 8k quality, vivid colors, clean background separation`;
}

export default function ImageToPrompt() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFile = (e) => {
    const picked = e.target.files?.[0];
    if (!picked || !picked.type.startsWith("image/")) return;

    setFile(picked);
    setPrompt("");
    const url = URL.createObjectURL(picked);
    setPreview(url);
  };

  const handleGenerate = async () => {
    if (!file) return;
    setLoading(true);
    setPrompt("");

    const img = new Image();
    img.onload = async () => {
      await new Promise((r) => setTimeout(r, 400));
      setPrompt(buildPrompt({ name: file.name, width: img.naturalWidth, height: img.naturalHeight }));
      setLoading(false);
    };
    img.onerror = () => {
      setPrompt(buildPrompt({ name: file.name, width: 1024, height: 1024 }));
      setLoading(false);
    };
    img.src = preview;
  };

  const copyPrompt = async () => {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="imageToPrompt" />

      <ToolHeroShell
        icon={ImagePlus}
        title="Image to Prompt Generator"
        subtitle="Upload an image and get a descriptive AI prompt from its filename and dimensions (browser-side demo)."
        maxWidth="max-w-4xl"
      >
        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-600 bg-slate-900/50 px-6 py-10 transition hover:border-sky-400/50">
            <Upload className="mb-2 h-8 w-8 text-slate-400" />
            <span className="text-sm font-medium text-slate-300">
              {file ? file.name : "Click to upload an image"}
            </span>
            <span className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP supported</span>
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>

          {preview && (
            <div className="flex flex-col gap-4 sm:flex-row">
              <img
                src={preview}
                alt="Upload preview"
                className="h-48 w-full rounded-2xl border border-slate-700 object-contain bg-slate-900/80 sm:w-1/2"
              />
              <div className="flex flex-1 flex-col justify-center gap-3 text-sm text-slate-400">
                <p>
                  <span className="text-slate-300">Filename:</span> {file?.name}
                </p>
                <p className="text-xs text-slate-500">
                  Demo mode: prompt is built from filename keywords and image dimensions—no vision API required.
                </p>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={loading}
                  className="inline-flex w-fit items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                  {loading ? "Generating..." : "Generate Prompt"}
                </button>
              </div>
            </div>
          )}

          {prompt && (
            <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-white">Generated Prompt</h2>
                <button
                  type="button"
                  onClick={copyPrompt}
                  className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-sm leading-7 text-slate-300">{prompt}</p>
            </div>
          )}
        </div>
      </ToolHeroShell>

      <ToolPageContent category="image-tools" currentToolPath="/image-tools/image-to-prompt" />
    </>
  );
}
