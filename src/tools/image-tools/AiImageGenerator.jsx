import { useState } from "react";
import { ImagePlus, Loader2, Download, Sparkles, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";

const STYLES = [
  { id: "realistic", label: "Realistic", suffix: "photorealistic, detailed lighting" },
  { id: "digital-art", label: "Digital Art", suffix: "digital illustration, vibrant colors" },
  { id: "anime", label: "Anime", suffix: "anime style, clean lines" },
  { id: "3d", label: "3D Render", suffix: "3d render, octane style" },
  { id: "watercolor", label: "Watercolor", suffix: "watercolor painting, soft textures" },
];

const inputClass =
  "w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25 placeholder:text-slate-500";

export default function AiImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("digital-art");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 100000));

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter an image prompt.");
      return;
    }

    setError("");
    setLoading(true);
    setImageUrl("");

    const styleMeta = STYLES.find((s) => s.id === style);
    const fullPrompt = `${prompt.trim()}, ${styleMeta?.suffix || ""}`.trim();
    const nextSeed = Math.floor(Math.random() * 100000);
    setSeed(nextSeed);

    // Pollinations provides a no-key image generation endpoint suitable for demos.
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=768&height=768&seed=${nextSeed}&nologo=true`;

    // Preload image so we only show it when ready
    const img = new Image();
    img.onload = () => {
      setImageUrl(url);
      setLoading(false);
    };
    img.onerror = () => {
      setError("Image generation failed. Please try a different prompt.");
      setLoading(false);
    };
    img.src = url;
  };

  return (
    <>
      <Seo page="aiImageGenerator" />

      <ToolHeroShell
        icon={ImagePlus}
        title="AI Image Generator"
        subtitle="Describe an idea and generate an image in different creative styles."
        category="image-tools"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="img-prompt">
              Image Prompt
            </label>
            <textarea
              id="img-prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A cozy cabin in snowy mountains at sunrise, cinematic lighting"
              className={inputClass}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-300">Style</p>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStyle(s.id)}
                  className={`rounded-2xl border px-3 py-1.5 text-sm transition ${
                    style === s.id
                      ? "border-violet-400 bg-violet-500/20 text-violet-200"
                      : "border-slate-700 bg-slate-900/80 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-2.5 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate Image"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        {(loading || imageUrl) && (
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <ImagePlus className="h-4 w-4" /> Generated Image
              </h2>
              {imageUrl && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
                  >
                    <RefreshCw className="h-4 w-4" /> Regenerate
                  </button>
                  <a
                    href={imageUrl}
                    download={`ai-image-${seed}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
                  >
                    <Download className="h-4 w-4" /> Open / Save
                  </a>
                </div>
              )}
            </div>
            <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/80">
              {loading ? (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-sm">Creating your image...</p>
                </div>
              ) : (
                <img src={imageUrl} alt={prompt} className="max-h-[640px] w-full object-contain" />
              )}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Images are generated via a third-party model endpoint. Results may vary by prompt and style.
            </p>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent category="image-tools" currentToolPath="/image-tools/ai-image-generator" />
    </>
  );
}
