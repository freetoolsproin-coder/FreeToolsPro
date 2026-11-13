import { useEffect, useRef, useState } from "react";
import { CANVAS_MODES, FONTS } from "../../tools/canvas-modes.js";
import { bytes } from "../../lib/format.js";
import { Field, DropZone, downloadBlob } from "./ui.jsx";

function fontOf(key) {
  const f = FONTS.find((x) => x[0] === key) || FONTS[0];
  return { family: f[2], weight: f[3] };
}

/** Split text into lines that fit `maxW`, keeping the user's own line breaks. */
function wrap(ctx, text, maxW) {
  const out = [];
  for (const para of String(text).split(/\r?\n/)) {
    const words = para.split(/\s+/).filter(Boolean);
    if (!words.length) continue;
    let line = words[0];
    for (const w of words.slice(1)) {
      if (ctx.measureText(line + " " + w).width <= maxW) line += " " + w;
      else {
        out.push(line);
        line = w;
      }
    }
    out.push(line);
  }
  return out;
}

/** Largest font size (<= start) at which `text` wraps into at most `maxLines` lines that all fit. */
function fitText(ctx, text, { family, weight }, start, min, maxW, maxLines, maxH, lh) {
  for (let size = start; size >= min; size -= 2) {
    ctx.font = `${weight} ${size}px ${family}`;
    const lines = wrap(ctx, text, maxW);
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxW) && lines.length * size * lh <= maxH) return { size, lines };
  }
  ctx.font = `${weight} ${min}px ${family}`;
  return { size: min, lines: wrap(ctx, text, maxW).slice(0, maxLines) };
}

function luminance(hex) {
  const n = parseInt(String(hex).replace("#", ""), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function coverImage(ctx, img, W, H, focus = 50) {
  const iw = img.naturalWidth || img.width,
    ih = img.naturalHeight || img.height;
  const r = Math.max(W / iw, H / ih);
  const dw = iw * r,
    dh = ih * r;
  const k = focus / 100;
  ctx.drawImage(img, (W - dw) * (dw > W + 1 ? k : 0.5), (H - dh) / 2, dw, dh);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function drawThumbnail(ctx, W, H, o, img) {
  ctx.clearRect(0, 0, W, H);
  if (o.bg === "photo" && img) {
    coverImage(ctx, img, W, H, o.focus);
    ctx.fillStyle = `rgba(0,0,0,${o.shade / 100})`;
    ctx.fillRect(0, 0, W, H);
    // Extra shade behind the text side keeps it readable on busy photos.
    if (o.pos !== "center") {
      const g = ctx.createLinearGradient(o.pos === "left" ? 0 : W, 0, o.pos === "left" ? W * 0.7 : W * 0.3, 0);
      g.addColorStop(0, `rgba(0,0,0,${Math.min(0.6, o.shade / 100 + 0.2)})`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  } else if (o.bg === "gradient") {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, o.c1);
    g.addColorStop(1, o.c2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  } else {
    ctx.fillStyle = o.c1;
    ctx.fillRect(0, 0, W, H);
  }
  const font = fontOf(o.font);
  const pad = 64;
  const maxW = o.pos === "center" ? W - pad * 2 : W * 0.64;
  const lh = 1.04;
  const { size, lines } = fitText(ctx, o.text, font, o.size, 40, maxW, 4, H - pad * 2 - (o.badge ? 70 : 0), lh);
  const hl = new Set(
    String(o.hl || "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
  );
  const blockH = lines.length * size * lh;
  let y = o.vpos === "top" ? pad + (o.badge ? 80 : 0) : o.vpos === "bottom" ? H - pad - blockH : (H - blockH) / 2;
  ctx.textBaseline = "top";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  for (const line of lines) {
    ctx.font = `${font.weight} ${size}px ${font.family}`;
    const words = line.split(" ");
    const space = ctx.measureText(" ").width;
    const lineW = ctx.measureText(line).width;
    let x = o.pos === "left" ? pad : o.pos === "right" ? W - pad - lineW : (W - lineW) / 2;
    for (const w of words) {
      const ww = ctx.measureText(w).width;
      if (o.stroke > 0) {
        ctx.lineWidth = o.stroke * 2;
        ctx.strokeStyle = o.strokeColor;
        ctx.strokeText(w, x, y);
      } else {
        ctx.shadowColor = "rgba(0,0,0,.45)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 4;
      }
      ctx.fillStyle = hl.has(w.toLowerCase()) ? o.hlColor : o.color;
      ctx.fillText(w, x, y);
      ctx.shadowColor = "transparent";
      x += ww + space;
    }
    y += size * lh;
  }
  if (o.badge) {
    ctx.font = `${font.weight} 40px ${font.family}`;
    const tw = ctx.measureText(o.badge).width;
    const bx = o.pos === "right" ? pad : W - pad - tw - 44;
    roundRect(ctx, bx, 44, tw + 44, 64, 14);
    ctx.fillStyle = o.badgeColor;
    ctx.fill();
    ctx.fillStyle = luminance(o.badgeColor) > 0.45 ? "#111111" : "#ffffff";
    ctx.textBaseline = "middle";
    ctx.fillText(o.badge, bx + 22, 44 + 34);
    ctx.textBaseline = "top";
  }
}

function drawOg(ctx, W, H, o, img) {
  ctx.clearRect(0, 0, W, H);
  if (o.bg === "gradient") {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, o.c1);
    g.addColorStop(1, o.c2);
    ctx.fillStyle = g;
  } else ctx.fillStyle = o.c1;
  ctx.fillRect(0, 0, W, H);
  if (o.bg === "dots") {
    ctx.fillStyle = luminance(o.c1) > 0.4 ? "rgba(0,0,0,.10)" : "rgba(255,255,255,.12)";
    for (let x = 20; x < W; x += 32) for (let y = 20; y < H; y += 32) ctx.fillRect(x, y, 3, 3);
  }
  const center = o.layout === "center";
  let left = 80;
  if (o.layout === "split") {
    ctx.fillStyle = o.accent;
    ctx.fillRect(0, 0, 28, H);
    left = 96;
  }
  const font = fontOf(o.font);
  const maxW = W - left - 80;
  ctx.textBaseline = "top";
  ctx.textAlign = center ? "center" : "left";
  const cx = center ? W / 2 : left;
  let top = 72;
  if (img) {
    const iw = img.naturalWidth || img.width,
      ih = img.naturalHeight || img.height;
    const k = Math.min(260 / iw, 72 / ih, 1.5);
    const dw = iw * k,
      dh = ih * k;
    ctx.drawImage(img, center ? (W - dw) / 2 : left, top, dw, dh);
    top += dh + 28;
  }
  if (o.tag) {
    ctx.font = `${font.weight} 26px ${font.family}`;
    ctx.fillStyle = o.accent;
    ctx.fillText(o.tag.toUpperCase(), cx, top);
    top += 48;
  }
  const bottomReserve = o.site ? 110 : 60;
  const subH = o.sub ? 100 : 0;
  const { size, lines } = fitText(ctx, o.title, font, 78, 40, maxW, 4, H - top - bottomReserve - subH, 1.12);
  ctx.font = `${font.weight} ${size}px ${font.family}`;
  ctx.fillStyle = o.color;
  for (const line of lines) {
    ctx.fillText(line, cx, top);
    top += size * 1.12;
  }
  if (o.sub) {
    top += 14;
    ctx.globalAlpha = 0.85;
    const s = fitText(ctx, o.sub, { family: font.family, weight: 500 }, 34, 24, maxW, 2, 90, 1.25);
    ctx.font = `500 ${s.size}px ${font.family}`;
    for (const line of s.lines) {
      ctx.fillText(line, cx, top);
      top += s.size * 1.25;
    }
    ctx.globalAlpha = 1;
  }
  if (o.site) {
    ctx.font = `700 28px ${font.family}`;
    const y = H - 72;
    const tw = ctx.measureText(o.site).width;
    ctx.fillStyle = o.accent;
    ctx.fillRect(center ? (W - 56) / 2 : left, y - 18, 56, 6);
    ctx.fillStyle = o.color;
    ctx.fillText(o.site, cx, y);
    if (!center && tw > maxW) ctx.textAlign = "left";
  }
  ctx.textAlign = "left";
}

async function encode(canvas, cfg) {
  if (cfg.format !== "image/jpeg") return new Promise((r) => canvas.toBlob(r, cfg.format));
  let q = 0.92,
    blob;
  do {
    blob = await new Promise((r) => canvas.toBlob(r, "image/jpeg", q));
    q -= 0.08;
  } while (cfg.maxBytes && blob.size > cfg.maxBytes && q > 0.3);
  return blob;
}

export default function CanvasTool({ id }) {
  const cfg = CANVAS_MODES[id];
  const [opts, setOpts] = useState(() => Object.fromEntries(cfg.fields.map((f) => [f.id, f.def])));
  const [img, setImg] = useState(null);
  const [err, setErr] = useState("");
  const [fontTick, setFontTick] = useState(0);
  const [last, setLast] = useState(null);
  const canvasRef = useRef(null);
  const smallRef = useRef(null);

  useEffect(() => {
    const { family, weight } = fontOf(opts.font);
    const first = family.split(",")[0].replace(/"/g, "").trim();
    if (document.fonts && document.fonts.load) document.fonts.load(`${weight} 64px "${first}"`).then(() => setFontTick((n) => n + 1), () => {});
  }, [opts.font]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (id === "youtube-thumbnail-maker") drawThumbnail(ctx, cfg.width, cfg.height, opts, img?.img);
    else drawOg(ctx, cfg.width, cfg.height, opts, img?.img);
    const s = smallRef.current;
    if (s) {
      const sctx = s.getContext("2d");
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(c, 0, 0, s.width, s.height);
    }
    setLast(null);
  }, [opts, img, fontTick, id]);

  async function addFiles(files) {
    setErr("");
    const f = files.find((x) => x.type.startsWith("image/"));
    if (!f) return setErr("Choose an image file (JPG, PNG or WebP).");
    const url = URL.createObjectURL(f);
    const el = new Image();
    el.src = url;
    try {
      await el.decode();
    } catch {
      URL.revokeObjectURL(url);
      return setErr("This image could not be opened. Try a JPG or PNG.");
    }
    if (img) URL.revokeObjectURL(img.url);
    setImg({ img: el, url, name: f.name });
    if (id === "youtube-thumbnail-maker") setOpts((p) => ({ ...p, bg: "photo" }));
  }

  async function download() {
    const blob = await encode(canvasRef.current, cfg);
    setLast(blob.size);
    downloadBlob(blob, cfg.file);
  }

  const visible = cfg.fields.filter((f) => !f.show || f.show(opts));
  const set = (k) => (v) => setOpts((p) => ({ ...p, [k]: v }));

  return (
    <div className="builder canvastool">
      <form className="panel builder__fields" onSubmit={(e) => e.preventDefault()} aria-label="Design settings">
        <DropZone accept="image/*" multiple={false} onFiles={addFiles} label={img ? "Change image" : cfg.image.label} hint={cfg.image.hint} />
        {img && (
          <p className="canvastool__file">
            <span>{img.name}</span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => {
                URL.revokeObjectURL(img.url);
                setImg(null);
                if (opts.bg === "photo") setOpts((p) => ({ ...p, bg: "gradient" }));
              }}
            >
              Remove
            </button>
          </p>
        )}
        {err && (
          <p className="msg msg--error" role="alert">
            {err}
          </p>
        )}
        {visible.map((f) => (
          <Field key={f.id} spec={f} value={opts[f.id]} onChange={set(f.id)} />
        ))}
        {id === "youtube-thumbnail-maker" && opts.bg === "photo" && !img && <p className="msg">Add a photo above, or pick a gradient background.</p>}
      </form>
      <div className="builder__out">
        <div className="canvastool__stage">
          <canvas ref={canvasRef} width={cfg.width} height={cfg.height} className="canvastool__canvas" role="img" aria-label="Design preview" />
          {opts.guide && <span className="canvastool__time">12:34</span>}
        </div>
        {id === "youtube-thumbnail-maker" && (
          <div className="canvastool__small">
            <canvas ref={smallRef} width={336} height={189} aria-hidden="true" />
            <p className="hint">How it looks in a phone feed. If you cannot read it here, use fewer, bigger words.</p>
          </div>
        )}
        <div className="row-actions">
          <button type="button" className="btn btn--primary btn--lg" onClick={download}>
            Download {cfg.format === "image/jpeg" ? "JPG" : "PNG"} ({cfg.width} × {cfg.height})
          </button>
          {last && <span className="hint">{bytes(last)}</span>}
        </div>
      </div>
    </div>
  );
}
