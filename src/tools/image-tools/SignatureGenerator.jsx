import { useCallback, useEffect, useRef, useState } from "react";
import { PenLine, Download, Trash2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const INK = "#07101f";

const FONT_STYLES = [
  { id: "cursive", label: "Cursive", font: "Georgia, 'Times New Roman', serif", style: "italic" },
  { id: "elegant", label: "Elegant", font: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", style: "italic" },
  { id: "bold", label: "Bold Script", font: "'Segoe Script', 'Brush Script MT', cursive", style: "normal" },
  { id: "classic", label: "Classic", font: "'Times New Roman', Times, serif", style: "italic" },
];

function downloadCanvas(canvas, fileName) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }, "image/png");
}

export default function SignatureGenerator() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [mode, setMode] = useState("draw");
  const [name, setName] = useState("");
  const [fontStyle, setFontStyle] = useState("cursive");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    ctx.strokeStyle = INK;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [strokeWidth]);

  useEffect(() => {
    setupCanvas();
    const onResize = () => setupCanvas();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setupCanvas]);

  const getPoint = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (event) => {
    if (mode !== "draw") return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPoint(event);
    drawingRef.current = true;
    ctx.strokeStyle = INK;
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (event) => {
    if (!drawingRef.current || mode !== "draw") return;
    event.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPoint(event);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    drawingRef.current = false;
  };

  const renderTextSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !name.trim()) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, rect.width, rect.height);
    const style = FONT_STYLES.find((s) => s.id === fontStyle) || FONT_STYLES[0];
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `${style.style} 48px ${style.font}`;
    ctx.fillText(name.trim(), rect.width / 2, rect.height / 2);
  };

  const handleClear = () => {
    setName("");
    setupCanvas();
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    downloadCanvas(canvas, "signature.png");
  };

  const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

  return (
    <>
      <Seo page="signatureGenerator" />

      <ToolHeroShell
        icon={PenLine}
        title="Signature Generator"
        subtitle="Draw your signature on canvas or type your name with a styled font, then download as PNG."
        category="image-tools"
        layout="stack"
        formLabel="Create signature"
      >
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("draw")}
            className={`age-btn-ghost px-4 py-2 text-sm ${mode === "draw" ? "border-[var(--ftp-teal)] text-[var(--ftp-ink)]" : ""}`}
          >
            Draw
          </button>
          <button
            type="button"
            onClick={() => setMode("type")}
            className={`age-btn-ghost px-4 py-2 text-sm ${mode === "type" ? "border-[var(--ftp-teal)] text-[var(--ftp-ink)]" : ""}`}
          >
            Type name
          </button>
        </div>

        {mode === "draw" ? (
          <div className="mt-4">
            <label htmlFor="stroke-width" className={labelClass}>
              Stroke width
            </label>
            <input
              id="stroke-width"
              type="range"
              min={1}
              max={6}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-full accent-[var(--ftp-teal)]"
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sig-name" className={labelClass}>
                Your name
              </label>
              <input
                id="sig-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={inputDark}
              />
            </div>
            <div>
              <label htmlFor="sig-style" className={labelClass}>
                Style
              </label>
              <select
                id="sig-style"
                value={fontStyle}
                onChange={(e) => setFontStyle(e.target.value)}
                className={selectDark}
              >
                {FONT_STYLES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={renderTextSignature}
                disabled={!name.trim()}
                className="age-btn-primary"
              >
                Apply to canvas
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 overflow-hidden rounded-[14px] border border-[var(--ftp-line)] bg-white">
          <canvas
            ref={canvasRef}
            className="h-48 w-full touch-none cursor-crosshair"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={handleClear} className="age-btn-ghost">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear
          </button>
          <button type="button" onClick={handleDownload} className="age-btn-primary">
            <Download className="h-4 w-4" aria-hidden="true" />
            Download PNG
          </button>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/signature-generator"
      />
    </>
  );
}
