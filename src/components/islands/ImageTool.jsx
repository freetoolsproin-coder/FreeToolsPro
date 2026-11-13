import { useEffect, useMemo, useRef, useState } from "react";
import { IMAGE_MODES, PRESETS, SOCIAL_SIZES } from "../../tools/image-modes.js";
import { bytes } from "../../lib/format.js";
import { Field, DropZone, CopyButton, downloadBlob, useDebounced } from "./ui.jsx";

const EXT = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

async function loadImage(file) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  try {
    await img.decode();
  } catch {
    URL.revokeObjectURL(url);
    throw new Error(/heic|heif/i.test(file.type + file.name) ? "This browser cannot open HEIC photos. Try Safari, or export the photo as JPG first." : "This file could not be opened as an image.");
  }
  return { img, url, w: img.naturalWidth, h: img.naturalHeight };
}

function canvasFor(w, h) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}
const toBlob = (c, type, q) => new Promise((res) => c.toBlob((b) => res(b), type, q));

function outType(opt, file) {
  if (opt && opt !== "same") return opt;
  return EXT[file.type] ? file.type : "image/png";
}
function outName(file, type, suffix) {
  return `${file.name.replace(/\.[^.]+$/, "")}${suffix}.${EXT[type] || "png"}`;
}

function draw(src, w, h, { crop, bg, fit } = {}) {
  const c = canvasFor(w, h);
  const ctx = c.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  if (crop) ctx.drawImage(src.img, crop.x, crop.y, crop.w, crop.h, 0, 0, c.width, c.height);
  else if (fit) {
    const r = fit === "cover" ? Math.max(w / src.w, h / src.h) : Math.min(w / src.w, h / src.h);
    const dw = src.w * r,
      dh = src.h * r;
    if (fit === "contain" && !bg) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    }
    ctx.drawImage(src.img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  } else ctx.drawImage(src.img, 0, 0, c.width, c.height);
  return c;
}

function cropRect(src, o) {
  let rw, rh;
  if (o.ratio === "free") {
    rw = (src.w * o.size) / 100;
    rh = (src.h * o.hsize) / 100;
  } else {
    const [a, b] = o.ratio.split(":").map(Number);
    const target = a / b;
    // largest rectangle of this ratio that fits, scaled by size%
    if (src.w / src.h > target) {
      rh = src.h;
      rw = rh * target;
    } else {
      rw = src.w;
      rh = rw / target;
    }
    rw *= o.size / 100;
    rh *= o.size / 100;
  }
  const x = ((src.w - rw) * o.x) / 100;
  const y = ((src.h - rh) * o.y) / 100;
  return { x: Math.round(x), y: Math.round(y), w: Math.round(rw), h: Math.round(rh) };
}

async function process(mode, item, o) {
  const { file, src } = item;
  if (mode === "image-compressor") {
    let w = src.w,
      h = src.h;
    if (o.maxw > 0 && w > o.maxw) {
      h = (h * o.maxw) / w;
      w = o.maxw;
    }
    const type = outType(o.format, file);
    const lossy = type !== "image/png";
    let c = draw(src, w, h, { bg: type === "image/jpeg" ? "#ffffff" : undefined });
    if (!o.target || !lossy) return { blob: await toBlob(c, type, o.quality), type, w: c.width, h: c.height };
    const limit = o.target * 1024;
    for (let shrink = 0; shrink < 8; shrink++) {
      let lo = 0.05,
        hi = 0.95,
        best = null;
      for (let k = 0; k < 7; k++) {
        const q = (lo + hi) / 2;
        const b = await toBlob(c, type, q);
        if (b.size <= limit) {
          best = b;
          lo = q;
        } else hi = q;
      }
      if (best) return { blob: best, type, w: c.width, h: c.height };
      c = draw(src, c.width * 0.8, c.height * 0.8, { bg: type === "image/jpeg" ? "#ffffff" : undefined });
    }
    return { error: `Could not get this image under ${o.target} KB. Try a smaller maximum width.` };
  }
  if (mode === "image-resizer") {
    const type = outType(o.format, file);
    let W, H, fit;
    if (o.preset !== "custom") {
      [W, H] = PRESETS[o.preset];
      fit = o.fit;
    } else {
      const toPx = (n) => (o.unit === "pct" ? (src.w * n) / 100 : o.unit === "cm" ? (n / 2.54) * o.dpi : n);
      W = toPx(o.w);
      if (o.lock || !o.h) H = (W * src.h) / src.w;
      else {
        H = o.unit === "pct" ? (src.h * o.h) / 100 : toPx(o.h);
        fit = o.fit;
      }
    }
    if (W > 16000 || H > 16000) return { error: "That size is too large for the browser to draw (max 16,000 px)." };
    const c = draw(src, W, H, { fit, bg: type === "image/jpeg" ? "#ffffff" : undefined });
    return { blob: await toBlob(c, type, 0.92), type, w: c.width, h: c.height };
  }
  if (mode === "social-media-image-resizer") {
    const [, , W, H] = SOCIAL_SIZES.find((x) => x[0] === o.size) || SOCIAL_SIZES[0];
    const type = o.format;
    const c = canvasFor(W, H);
    const ctx = c.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    if (o.fit === "cover") {
      const r = Math.max(W / src.w, H / src.h);
      const dw = src.w * r,
        dh = src.h * r;
      const k = o.focus / 100;
      ctx.drawImage(src.img, (W - dw) * (dw > W ? k : 0.5), (H - dh) * (dh > H ? k : 0.5), dw, dh);
    } else {
      if (o.fit === "blur") {
        const r = Math.max(W / src.w, H / src.h);
        ctx.filter = "blur(28px) brightness(0.85)";
        ctx.drawImage(src.img, (W - src.w * r * 1.1) / 2, (H - src.h * r * 1.1) / 2, src.w * r * 1.1, src.h * r * 1.1);
        ctx.filter = "none";
      } else {
        ctx.fillStyle = o.bg;
        ctx.fillRect(0, 0, W, H);
      }
      const r = Math.min(W / src.w, H / src.h);
      ctx.drawImage(src.img, (W - src.w * r) / 2, (H - src.h * r) / 2, src.w * r, src.h * r);
    }
    return { blob: await toBlob(c, type, 0.9), type, w: W, h: H };
  }
  if (mode === "image-format-converter") {
    const type = o.format;
    const c = draw(src, src.w, src.h, { bg: type === "image/jpeg" ? o.bg : undefined });
    return { blob: await toBlob(c, type, o.quality), type, w: c.width, h: c.height };
  }
  if (mode === "image-cropper") {
    const r = cropRect(src, o);
    const type = outType(o.format, file);
    const c = draw(src, r.w, r.h, { crop: r, bg: type === "image/jpeg" ? "#ffffff" : undefined });
    return { blob: await toBlob(c, type, 0.92), type, w: c.width, h: c.height, rect: r };
  }
  if (mode === "image-to-base64") {
    const dataUrl = await new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.onerror = rej;
      fr.readAsDataURL(file);
    });
    return { dataUrl };
  }
  if (mode === "favicon-generator") {
    const sizes = [16, 32, 48, 180, 192, 512];
    const pngs = {};
    for (const s of sizes) {
      const c = canvasFor(s, s);
      const ctx = c.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      if (o.bgOn) {
        const r = (o.radius / 100) * s;
        ctx.fillStyle = o.bg;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(0, 0, s, s, r) : ctx.rect(0, 0, s, s);
        ctx.fill();
      }
      const pad = (o.pad / 100) * s;
      const box = s - pad * 2;
      const k = Math.min(box / src.w, box / src.h);
      ctx.drawImage(src.img, (s - src.w * k) / 2, (s - src.h * k) / 2, src.w * k, src.h * k);
      pngs[s] = await toBlob(c, "image/png");
    }
    const ico = await buildIco([pngs[16], pngs[32], pngs[48]], [16, 32, 48]);
    return { favicon: { pngs, ico } };
  }
}

async function buildIco(blobs, sizes) {
  const datas = await Promise.all(blobs.map((b) => b.arrayBuffer()));
  const header = 6 + 16 * datas.length;
  const total = header + datas.reduce((a, d) => a + d.byteLength, 0);
  const buf = new ArrayBuffer(total);
  const v = new DataView(buf);
  v.setUint16(0, 0, true);
  v.setUint16(2, 1, true);
  v.setUint16(4, datas.length, true);
  let offset = header;
  datas.forEach((d, i) => {
    const e = 6 + i * 16;
    v.setUint8(e, sizes[i] >= 256 ? 0 : sizes[i]);
    v.setUint8(e + 1, sizes[i] >= 256 ? 0 : sizes[i]);
    v.setUint16(e + 4, 1, true);
    v.setUint16(e + 6, 32, true);
    v.setUint32(e + 8, d.byteLength, true);
    v.setUint32(e + 12, offset, true);
    new Uint8Array(buf, offset, d.byteLength).set(new Uint8Array(d));
    offset += d.byteLength;
  });
  return new Blob([buf], { type: "image/x-icon" });
}

const FAVICON_HTML = `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;
const MANIFEST = `{
  "name": "Your site",
  "short_name": "Site",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}`;

export default function ImageTool({ id }) {
  const cfg = IMAGE_MODES[id];
  const [items, setItems] = useState([]);
  const [opts, setOpts] = useState(() => Object.fromEntries(cfg.options.map((o) => [o.id, o.def])));
  const [err, setErr] = useState("");
  const dOpts = useDebounced(opts, 250);
  const gen = useRef(0);

  async function addFiles(files) {
    setErr("");
    const imgs = files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif|avif)$/i.test(f.name));
    if (!imgs.length) return setErr("Choose image files (JPG, PNG, WebP).");
    const loaded = [];
    for (const file of imgs) {
      try {
        loaded.push({ key: `${file.name}-${file.size}-${Math.random()}`, file, src: await loadImage(file) });
      } catch (e) {
        setErr(e.message);
      }
    }
    setItems((prev) => {
      if (!cfg.multiple) prev.forEach((p) => URL.revokeObjectURL(p.src.url));
      return cfg.multiple ? [...prev, ...loaded] : loaded.slice(0, 1);
    });
    if (id === "image-resizer" && loaded[0] && opts.unit === "px") setOpts((p) => ({ ...p, w: loaded[0].src.w, h: loaded[0].src.h }));
  }

  useEffect(() => {
    const my = ++gen.current;
    (async () => {
      for (const it of items) {
        let out;
        try {
          out = await process(id, it, dOpts);
        } catch (e) {
          out = { error: e.message || "Could not process this image." };
        }
        if (my !== gen.current) return;
        setItems((prev) => prev.map((p) => (p.key === it.key ? { ...p, out: { ...out, url: out.blob ? URL.createObjectURL(out.blob) : undefined } } : p)));
      }
    })();
  }, [dOpts, items.length, id]);

  const visible = cfg.options.filter((o) => !o.show || o.show(opts));
  const totalIn = items.reduce((a, i) => a + i.file.size, 0);
  const totalOut = items.reduce((a, i) => a + (i.out?.blob?.size || 0), 0);
  const first = items[0];

  return (
    <div className="mediatool">
      <DropZone
        accept="image/*,.heic,.heif"
        multiple={cfg.multiple}
        onFiles={addFiles}
        label={items.length ? (cfg.multiple ? "Add more images" : "Choose another image") : cfg.multiple ? "Choose images" : "Choose an image"}
        hint="or drop them here. Processed on your device; nothing is uploaded."
      />
      {err && (
        <p className="msg msg--error" role="alert">
          {err}
        </p>
      )}
      {visible.length > 0 && (
        <div className="optbar panel">
          {visible.map((o) => (
            <Field key={o.id} spec={o} value={opts[o.id]} onChange={(v) => setOpts((p) => ({ ...p, [o.id]: v }))} />
          ))}
        </div>
      )}

      {id === "image-cropper" && first && first.out?.rect && (
        <div className="cropview">
          <img src={first.src.url} alt="Original with crop area" />
          <span
            className="cropview__box"
            style={{
              left: `${(first.out.rect.x / first.src.w) * 100}%`,
              top: `${(first.out.rect.y / first.src.h) * 100}%`,
              width: `${(first.out.rect.w / first.src.w) * 100}%`,
              height: `${(first.out.rect.h / first.src.h) * 100}%`,
            }}
          />
        </div>
      )}

      {id === "image-to-base64" && first?.out?.dataUrl && (
        <ul className="outs">
          {[
            ["Data URI", first.out.dataUrl],
            ["HTML", `<img src="${first.out.dataUrl}" alt="" width="${first.src.w}" height="${first.src.h}">`],
            ["CSS", `background-image: url("${first.out.dataUrl}");`],
          ].map(([l, v]) => (
            <li key={l} className="outs__item">
              <div className="outs__head">
                <span className="outs__label">
                  {l} · {bytes(v.length)}
                </span>
                <CopyButton text={v} />
              </div>
              <pre className="outs__value outs__value--clip">{v.length > 600 ? v.slice(0, 600) + "…" : v}</pre>
            </li>
          ))}
        </ul>
      )}

      {id === "favicon-generator" && first?.out?.favicon && <FaviconResult fav={first.out.favicon} />}

      {!["image-to-base64", "favicon-generator"].includes(id) && items.length > 0 && (
        <>
          <ul className="files">
            {items.map((it) => (
              <li key={it.key} className="files__item">
                <img className="files__thumb" src={it.out?.url || it.src.url} alt="" width="64" height="64" />
                <div className="files__meta">
                  <p className="files__name">{it.file.name}</p>
                  <p className="muted">
                    {it.src.w} × {it.src.h} · {bytes(it.file.size)}
                    {it.out?.blob && (
                      <>
                        {" "}
                        → <b>{it.out.w} × {it.out.h} · {bytes(it.out.blob.size)}</b>
                        {it.out.blob.size < it.file.size && <span className="files__save"> {Math.round((1 - it.out.blob.size / it.file.size) * 100)}% smaller</span>}
                      </>
                    )}
                  </p>
                  {it.out?.error && <p className="msg msg--error">{it.out.error}</p>}
                </div>
                <div className="files__actions">
                  {it.out?.blob && (
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => downloadBlob(it.out.blob, outName(it.file, it.out.type, suffixFor(id)))}>
                      Download
                    </button>
                  )}
                  <button type="button" className="btn btn--ghost btn--sm" aria-label={`Remove ${it.file.name}`} onClick={() => setItems((p) => p.filter((x) => x.key !== it.key))}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {items.length > 1 && (
            <div className="row-actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={async () => {
                  for (const it of items) {
                    if (it.out?.blob) downloadBlob(it.out.blob, outName(it.file, it.out.type, suffixFor(id)));
                    await new Promise((r) => setTimeout(r, 350));
                  }
                }}
              >
                Download all ({items.length})
              </button>
              <span className="muted">
                {bytes(totalIn)} → {bytes(totalOut)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function suffixFor(id) {
  return { "image-compressor": "-compressed", "image-resizer": "-resized", "image-cropper": "-cropped", "image-format-converter": "", "social-media-image-resizer": "-social" }[id] ?? "";
}

function FaviconResult({ fav }) {
  const urls = useMemo(() => Object.fromEntries(Object.entries(fav.pngs).map(([s, b]) => [s, URL.createObjectURL(b)])), [fav]);
  const files = [
    ["favicon.ico", fav.ico, "16, 32, 48 px"],
    ["apple-touch-icon.png", fav.pngs[180], "180 px"],
    ["icon-192.png", fav.pngs[192], "192 px"],
    ["icon-512.png", fav.pngs[512], "512 px"],
    ["favicon-32x32.png", fav.pngs[32], "32 px"],
  ];
  return (
    <div className="favicon">
      <div className="favicon__sizes">
        {[16, 32, 48, 180].map((s) => (
          <figure key={s}>
            <img src={urls[s]} width={Math.min(s, 96)} height={Math.min(s, 96)} alt={`${s} pixel icon`} style={{ imageRendering: s < 64 ? "pixelated" : "auto" }} />
            <figcaption>{s}px</figcaption>
          </figure>
        ))}
      </div>
      <ul className="files">
        {files.map(([name, blob, note]) => (
          <li key={name} className="files__item">
            <div className="files__meta">
              <p className="files__name">{name}</p>
              <p className="muted">
                {note} · {bytes(blob.size)}
              </p>
            </div>
            <div className="files__actions">
              <button type="button" className="btn btn--primary btn--sm" onClick={() => downloadBlob(blob, name)}>
                Download
              </button>
            </div>
          </li>
        ))}
      </ul>
      <ul className="outs">
        <li className="outs__item">
          <div className="outs__head">
            <span className="outs__label">Add to your &lt;head&gt;</span>
            <CopyButton text={FAVICON_HTML} />
          </div>
          <pre className="outs__value">{FAVICON_HTML}</pre>
        </li>
        <li className="outs__item">
          <div className="outs__head">
            <span className="outs__label">site.webmanifest</span>
            <CopyButton text={MANIFEST} />
          </div>
          <pre className="outs__value">{MANIFEST}</pre>
        </li>
      </ul>
    </div>
  );
}
