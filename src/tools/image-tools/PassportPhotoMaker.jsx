import { useRef, useState } from "react";
import { IdCard, Upload, Download } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const PRESETS = [
  { id: "india-us", label: "India / US (600 x 600 px)", width: 600, height: 600 },
  { id: "schengen", label: "Schengen (413 x 531 px)", width: 413, height: 531 },
];

function centerCropDraw(ctx, img, targetW, targetH) {
  const srcRatio = img.width / img.height;
  const targetRatio = targetW / targetH;
  let sx;
  let sy;
  let sw;
  let sh;

  if (srcRatio > targetRatio) {
    sh = img.height;
    sw = sh * targetRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / targetRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
}

export default function PassportPhotoMaker() {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [preset, setPreset] = useState("india-us");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [outputUrl, setOutputUrl] = useState("");
  const [error, setError] = useState("");

  const selected = PRESETS.find((p) => p.id === preset) || PRESETS[0];

  const processImage = (dataUrl) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = selected.width;
      canvas.height = selected.height;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, selected.width, selected.height);
      centerCropDraw(ctx, img, selected.width, selected.height);
      setOutputUrl(canvas.toDataURL("image/jpeg", 0.92));
      setError("");
    };
    img.onerror = () => setError("Could not load the image. Try a different file.");
    img.src = dataUrl;
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setFileName(file.name);
    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      processImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handlePresetChange = (nextPreset) => {
    setPreset(nextPreset);
    if (preview) {
      const next = PRESETS.find((p) => p.id === nextPreset) || PRESETS[0];
      const canvas = canvasRef.current;
      if (!canvas) return;
      const img = new Image();
      img.onload = () => {
        canvas.width = next.width;
        canvas.height = next.height;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, next.width, next.height);
        centerCropDraw(ctx, img, next.width, next.height);
        setOutputUrl(canvas.toDataURL("image/jpeg", 0.92));
      };
      img.src = preview;
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const link = document.createElement("a");
    link.href = outputUrl;
    link.download = `passport-photo-${selected.width}x${selected.height}.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

  return (
    <>
      <Seo page="passportPhotoMaker" />

      <ToolHeroShell
        icon={IdCard}
        title="Passport Photo Maker"
        subtitle="Upload a portrait photo, center-crop to official size presets, and download a JPEG passport photo."
        category="image-tools"
        layout="stack"
        formLabel="Make passport photo"
      >
        <div>
          <label htmlFor="passport-preset" className={labelClass}>
            Size preset
          </label>
          <select
            id="passport-preset"
            value={preset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className={selectDark}
          >
            {PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[14px] border border-dashed border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-6 py-10 transition hover:border-[var(--ftp-teal)]">
          <Upload className="mb-2 h-8 w-8 text-[var(--ftp-ink-soft)]" aria-hidden="true" />
          <span className="text-sm font-medium text-[var(--ftp-ink)]">
            {fileName || "Click to upload a portrait photo"}
          </span>
          <span className="mt-1 text-xs text-[var(--ftp-ink-soft)]">PNG or JPG recommended</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="sr-only"
          />
        </label>

        {error ? (
          <p className="mt-3 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {error}
          </p>
        ) : null}

        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

        {outputUrl ? (
          <div className="mt-6 rounded-[14px] border border-[var(--ftp-line)] bg-white p-4">
            <p className="text-sm font-medium text-[var(--ftp-ink)]">
              Preview ({selected.width} x {selected.height} px)
            </p>
            <img
              src={outputUrl}
              alt="Passport photo preview"
              className="mx-auto mt-4 max-h-80 max-w-full rounded-[14px] border border-[var(--ftp-line)] object-contain"
            />
            <button type="button" onClick={handleDownload} className="age-btn-primary mt-4 w-full">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download JPEG
            </button>
          </div>
        ) : (
          <p className="mt-6 text-center text-sm text-[var(--ftp-ink-soft)]">
            Your cropped passport photo will appear here after upload.
          </p>
        )}
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/passport-photo-maker"
      />
    </>
  );
}
