import { useCallback, useEffect, useRef, useState } from "react";
import { ScanLine, Download } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

/** CODE39 charset: 0-9, A-Z, space, and -.$/+% */
export const CODE39_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%";

/**
 * CODE39 patterns (9 elements each: n=narrow, w=wide).
 * * is start/stop; not encoded in user data.
 */
export const CODE39_MAP = {
  "0": "nnnwwnnnw",
  "1": "wnnwnnnnw",
  "2": "nnwwnnnnw",
  "3": "wnnwwnnnn",
  "4": "nnnnwwnnw",
  "5": "wnnnwwnnn",
  "6": "nnwnwwnnn",
  "7": "nnnnwnwnw",
  "8": "wnnnwnwnn",
  "9": "nnwnwnwnn",
  A: "wnnnnnwnw",
  B: "nnwnnnwnw",
  C: "wnwnnnwnn",
  D: "nnnnwnwwn",
  E: "wnnnwnwwn",
  F: "nnwnwnwwn",
  G: "nnnnnwwnw",
  H: "wnnnnwwnn",
  I: "nnwnnwwnn",
  J: "nnnwnwwnn",
  K: "wnnnnnnww",
  L: "nnwnnnnww",
  M: "wnwnnnnwn",
  N: "nnnwnnnww",
  O: "wnnwnnnnw",
  P: "nnwwnnnnn",
  Q: "nnwnnnnwn",
  R: "wnnwnnnnn",
  S: "nnnwnnnwn",
  T: "nnnwnwwnn",
  U: "wnnnnwnnn",
  V: "nnwnnwnnn",
  W: "wnwnnwnnn",
  X: "nnnwwnwnn",
  Y: "wnnwwnnnn",
  Z: "nnwwwnnnn",
  "-": "nnnnwwnnn",
  ".": "wnnnwwnnn",
  " ": "nnwwnwwnn",
  $: "nnwnnnnwn",
  "/": "nnnwnnnwn",
  "+": "nnwnwnnnw",
  "%": "nnnnnwnww",
  "*": "nwwnnnnwn",
};

const INK = "#07101f";
const INK_SOFT = "#2a3548";
const NARROW = 2;
const WIDE = 6;
const QUIET = 20;
const BAR_HEIGHT = 100;
const TEXT_GAP = 8;

function moduleWidth(symbol) {
  return symbol === "w" ? WIDE : NARROW;
}

function validateCode39Input(text) {
  const upper = text.toUpperCase();
  const invalid = [];
  for (const ch of upper) {
    if (!CODE39_MAP[ch]) invalid.push(ch);
  }
  return { upper, invalid };
}

function computeBarcodeWidth(encoded) {
  let width = QUIET * 2;
  for (let i = 0; i < encoded.length; i += 1) {
    const pattern = CODE39_MAP[encoded[i]];
    if (!pattern) continue;
    for (const el of pattern) width += moduleWidth(el);
    if (i < encoded.length - 1) width += NARROW;
  }
  return width;
}

function drawCode39(canvas, text) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const { upper, invalid } = validateCode39Input(text);
  if (!upper || invalid.length > 0) {
    canvas.width = 320;
    canvas.height = BAR_HEIGHT + 40;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = INK_SOFT;
    ctx.font = "14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      invalid.length ? `Invalid characters: ${invalid.join(", ")}` : "Enter barcode text",
      canvas.width / 2,
      canvas.height / 2
    );
    return;
  }

  const encoded = `*${upper}*`;
  const totalWidth = computeBarcodeWidth(encoded);
  const textHeight = 18;
  canvas.width = totalWidth;
  canvas.height = BAR_HEIGHT + TEXT_GAP + textHeight + 10;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let x = QUIET;
  let isBar = true;

  for (let c = 0; c < encoded.length; c += 1) {
    const pattern = CODE39_MAP[encoded[c]];
    for (const el of pattern) {
      const w = moduleWidth(el);
      if (isBar) {
        ctx.fillStyle = INK;
        ctx.fillRect(x, 0, w, BAR_HEIGHT);
      }
      x += w;
      isBar = !isBar;
    }
    if (c < encoded.length - 1) {
      x += NARROW;
      isBar = true;
    }
  }

  ctx.fillStyle = INK;
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(upper, canvas.width / 2, BAR_HEIGHT + TEXT_GAP + textHeight);
}

export default function BarcodeGenerator() {
  const canvasRef = useRef(null);
  const [text, setText] = useState("CODE39");
  const [error, setError] = useState("");

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { upper, invalid } = validateCode39Input(text);
    if (invalid.length > 0) {
      setError(`Allowed: ${CODE39_CHARSET}. Invalid: ${invalid.join(", ")}`);
    } else {
      setError("");
    }
    drawCode39(canvas, upper || text);
  }, [text]);

  useEffect(() => {
    render();
  }, [render]);

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || error || !text.trim()) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `barcode-${text.trim().toUpperCase() || "code39"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Seo page="barcodeGenerator" />

      <ToolHeroShell
        category="trending-tools"
        icon={ScanLine}
        title="Barcode Generator"
        subtitle="Create CODE39 barcodes on canvas and download as PNG."
        formLabel="Barcode text"
        layout="stack"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
            <div>
              <label className={labelClass} htmlFor="bc-text">
                Text to encode
              </label>
              <input
                id="bc-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value.toUpperCase())}
                placeholder="ABC-123"
                className={inputDark}
              />
              <p className="mt-1.5 text-xs text-[var(--ftp-ink-soft)]">
                Charset: 0-9, A-Z, space, and -.$/+%
              </p>
              {error && (
                <p className="mt-2 text-xs font-medium text-[var(--ftp-ink)]">{error}</p>
              )}
            </div>

            <button
              type="button"
              onClick={downloadPng}
              disabled={!!error || !text.trim()}
              className="age-btn-primary w-full sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Download PNG
            </button>
          </div>

          <div className="rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
            <h2 className="mb-4 text-sm font-semibold text-[var(--ftp-ink)]">Preview</h2>
            <div className="overflow-x-auto rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <canvas ref={canvasRef} className="mx-auto max-w-full" aria-label="CODE39 barcode preview" />
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/barcode-generator"
      />
    </>
  );
}
