import { useRef, useState } from "react";
import { PDF_MODES, parseRanges, COMPRESS_STEPS, COMPRESS_LEVELS } from "../../tools/pdf-modes.js";
import { bytes } from "../../lib/format.js";
import { Field, DropZone, CopyButton, downloadBlob } from "./ui.jsx";

const MM = 72 / 25.4;
const PAGES = { a4: [595.28, 841.89], a4l: [841.89, 595.28], letter: [612, 792] };

async function loadPdfLib() {
  return import("pdf-lib");
}

// Legacy pdf.js build: works on older Android WebViews and Safari versions still common in India.
async function loadPdfjs() {
  const [pdfjs, worker] = await Promise.all([import("pdfjs-dist/legacy/build/pdf.mjs"), import("pdfjs-dist/legacy/build/pdf.worker.min.mjs?url")]);
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
}

async function openPdfjs(file) {
  const pdfjs = await loadPdfjs();
  try {
    return await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  } catch (e) {
    throw new Error(e.name === "PasswordException" ? "This PDF is password-protected. Remove the password in a PDF reader, then try again." : "This file could not be read as a PDF.");
  }
}

/** Draw one pdf.js page onto a white canvas. `maxSide` keeps very large pages within canvas limits. */
async function renderPage(page, scale, maxSide = 5000) {
  const base = page.getViewport({ scale: 1 });
  const k = Math.min(scale, maxSide / Math.max(base.width, base.height));
  const vp = page.getViewport({ scale: k });
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.floor(vp.width));
  c.height = Math.max(1, Math.floor(vp.height));
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  await page.render({ canvasContext: ctx, canvas: c, viewport: vp }).promise;
  return c;
}

function toGray(c) {
  const ctx = c.getContext("2d");
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const y = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i + 1] = d[i + 2] = y;
  }
  ctx.putImageData(img, 0, 0);
}

/** "1, 2, 3, 7, 5" -> "1-3, 7, 5" (1-based, keeps the given order). */
function orderToText(order) {
  const out = [];
  let i = 0;
  while (i < order.length) {
    let j = i;
    while (j + 1 < order.length && order[j + 1].p === order[j].p + 1) j++;
    out.push(j > i ? `${order[i].p + 1}-${order[j].p + 1}` : `${order[i].p + 1}`);
    i = j + 1;
  }
  return out.join(", ");
}

async function openPdf(lib, file) {
  try {
    return await lib.PDFDocument.load(await file.arrayBuffer());
  } catch (e) {
    if (/encrypt/i.test(e.message)) throw new Error(`${file.name} is password-protected. Remove the password in a PDF reader, then try again.`);
    throw new Error(`${file.name} could not be read as a PDF.`);
  }
}

/** JPEG EXIF orientation (1 = normal). Phone photos often store rotation here. */
async function jpegOrientation(file) {
  const v = new DataView(await file.slice(0, 65536).arrayBuffer());
  if (v.getUint16(0) !== 0xffd8) return 1;
  let o = 2;
  while (o < v.byteLength - 4) {
    const marker = v.getUint16(o);
    const len = v.getUint16(o + 2);
    if (marker === 0xffe1 && v.getUint32(o + 4) === 0x45786966) {
      const t = o + 10;
      const le = v.getUint16(t) === 0x4949;
      const ifd = t + v.getUint32(t + 4, le);
      const n = v.getUint16(ifd, le);
      for (let i = 0; i < n; i++) {
        const e = ifd + 2 + i * 12;
        if (e + 10 > v.byteLength) break;
        if (v.getUint16(e, le) === 0x0112) return v.getUint16(e + 8, le);
      }
      return 1;
    }
    if ((marker & 0xff00) !== 0xff00) break;
    o += 2 + len;
  }
  return 1;
}

async function imageForPdf(file) {
  const isJpg = file.type === "image/jpeg";
  if ((isJpg && (await jpegOrientation(file)) === 1) || file.type === "image/png") return { bytes: await file.arrayBuffer(), kind: isJpg ? "jpg" : "png" };
  // Re-encode other formats (and rotated JPEGs) through a canvas, which applies EXIF orientation.
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const c = document.createElement("canvas");
  c.width = bmp.width;
  c.height = bmp.height;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(bmp, 0, 0);
  const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.92));
  return { bytes: await blob.arrayBuffer(), kind: "jpg" };
}

const pdfBlob = (bytesArr) => new Blob([bytesArr], { type: "application/pdf" });
const base = (f) => f.name.replace(/\.[^.]+$/, "");

async function run(id, files, o, onProgress) {
  if (id === "pdf-merger") {
    if (files.length < 2) throw new Error("Add at least two PDFs to merge.");
    const lib = await loadPdfLib();
    const out = await lib.PDFDocument.create();
    for (const [i, f] of files.entries()) {
      onProgress(`Adding ${i + 1} of ${files.length}…`);
      const src = await openPdf(lib, f);
      const pages = await out.copyPages(src, src.getPageIndices());
      pages.forEach((p) => out.addPage(p));
    }
    return [{ name: "merged.pdf", blob: pdfBlob(await out.save()), note: `${out.getPageCount()} pages` }];
  }
  if (id === "pdf-splitter") {
    const lib = await loadPdfLib();
    const src = await openPdf(lib, files[0]);
    const count = src.getPageCount();
    const groups = o.mode === "every" ? src.getPageIndices().map((i) => [i]) : parseRanges(o.ranges, count);
    const make = async (idx) => {
      const d = await lib.PDFDocument.create();
      (await d.copyPages(src, idx)).forEach((p) => d.addPage(p));
      return pdfBlob(await d.save());
    };
    const label = (idx) => (idx.length === 1 ? `${idx[0] + 1}` : `${idx[0] + 1}-${idx[idx.length - 1] + 1}`);
    if (o.mode === "one") {
      const all = [...new Set(groups.flat())];
      return [{ name: `${base(files[0])}-pages-${groups.map(label).join("_")}.pdf`, blob: await make(all), note: `${all.length} page${all.length === 1 ? "" : "s"}` }];
    }
    const res = [];
    for (const g of groups) res.push({ name: `${base(files[0])}-p${label(g)}.pdf`, blob: await make(g), note: `${g.length} page${g.length === 1 ? "" : "s"}` });
    return res;
  }
  if (id === "rotate-pdf") {
    const lib = await loadPdfLib();
    const doc = await openPdf(lib, files[0]);
    const n = doc.getPageCount();
    const pick = o.which === "all" ? doc.getPageIndices() : o.which === "odd" ? doc.getPageIndices().filter((i) => i % 2 === 0) : o.which === "even" ? doc.getPageIndices().filter((i) => i % 2 === 1) : parseRanges(o.list, n).flat();
    for (const i of pick) {
      const p = doc.getPage(i);
      p.setRotation(lib.degrees((p.getRotation().angle + Number(o.angle)) % 360));
    }
    return [{ name: `${base(files[0])}-rotated.pdf`, blob: pdfBlob(await doc.save()), note: `${pick.length} of ${n} pages rotated` }];
  }
  if (id === "jpg-to-pdf") {
    if (!files.length) throw new Error("Add at least one image.");
    const lib = await loadPdfLib();
    const doc = await lib.PDFDocument.create();
    for (const [i, f] of files.entries()) {
      onProgress(`Adding image ${i + 1} of ${files.length}…`);
      const { bytes: b, kind } = await imageForPdf(f);
      const img = kind === "jpg" ? await doc.embedJpg(b) : await doc.embedPng(b);
      if (o.page === "fit") {
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      } else {
        const [W, H] = PAGES[o.page];
        const m = Number(o.margin) * MM;
        const k = Math.min((W - 2 * m) / img.width, (H - 2 * m) / img.height, 1.5);
        const w = img.width * k,
          h = img.height * k;
        doc.addPage([W, H]).drawImage(img, { x: (W - w) / 2, y: (H - h) / 2, width: w, height: h });
      }
    }
    return [{ name: files.length === 1 ? `${base(files[0])}.pdf` : "images.pdf", blob: pdfBlob(await doc.save()), note: `${files.length} page${files.length === 1 ? "" : "s"}` }];
  }
  if (id === "pdf-to-jpg") {
    const pdf = await openPdfjs(files[0]);
    const scale = Number(o.dpi) / 72;
    const ext = o.fmt === "image/png" ? "png" : "jpg";
    const res = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      onProgress(`Rendering page ${i} of ${pdf.numPages}…`);
      const page = await pdf.getPage(i);
      const vp = page.getViewport({ scale });
      const c = document.createElement("canvas");
      c.width = Math.floor(vp.width);
      c.height = Math.floor(vp.height);
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, c.width, c.height);
      await page.render({ canvasContext: ctx, canvas: c, viewport: vp }).promise;
      const blob = await new Promise((r) => c.toBlob(r, o.fmt, 0.9));
      res.push({ name: `${base(files[0])}-page-${i}.${ext}`, blob, note: `${c.width} × ${c.height}`, thumb: URL.createObjectURL(blob) });
    }
    return res;
  }
  if (id === "compress-pdf") {
    const pdf = await openPdfjs(files[0]);
    const lib = await loadPdfLib();
    const build = async ([dpi, q], label) => {
      const out = await lib.PDFDocument.create();
      for (let i = 1; i <= pdf.numPages; i++) {
        onProgress(`${label}page ${i} of ${pdf.numPages}…`);
        const page = await pdf.getPage(i);
        const base = page.getViewport({ scale: 1 });
        const c = await renderPage(page, dpi / 72);
        if (o.gray) toGray(c);
        const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", q));
        const img = await out.embedJpg(await blob.arrayBuffer());
        out.addPage([base.width, base.height]).drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
        c.width = c.height = 0;
        page.cleanup();
      }
      return pdfBlob(await out.save({ useObjectStreams: true }));
    };
    const orig = files[0].size;
    let blob, used, extra = "";
    if (o.level === "target") {
      const limit = Math.max(1, Number(o.target) || 0) * 1024;
      // Binary search over the presets: about three passes instead of eight.
      let lo = 0,
        hi = COMPRESS_STEPS.length - 1,
        best = null,
        smallest = null,
        pass = 0;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const b = await build(COMPRESS_STEPS[mid], `Pass ${++pass}: `);
        if (!smallest || b.size < smallest.blob.size) smallest = { blob: b, step: COMPRESS_STEPS[mid] };
        if (b.size <= limit) {
          best = { blob: b, step: COMPRESS_STEPS[mid] };
          hi = mid - 1;
        } else lo = mid + 1;
      }
      ({ blob, step: used } = best || smallest);
      extra = best ? ` · under ${o.target} KB` : ` · could not reach ${o.target} KB; this is the smallest version`;
    } else {
      used = COMPRESS_LEVELS[o.level] || COMPRESS_LEVELS.balanced;
      blob = await build(used, "Compressing ");
    }
    if (blob.size >= orig)
      throw new Error(`This PDF is already compact: the compressed copy would be ${bytes(blob.size)}, and your file is ${bytes(orig)}. Keep the original${o.level === "small" ? "" : ", or try 'Smallest file'"}.`);
    return [{ name: `${base(files[0])}-compressed.pdf`, blob, note: `${Math.round((1 - blob.size / orig) * 100)}% smaller · ${used[0]} DPI${extra}` }];
  }
  if (id === "reorder-pdf-pages") {
    const order = o.order || [];
    if (!order.length) throw new Error("Keep at least one page.");
    const lib = await loadPdfLib();
    const src = await openPdf(lib, files[0]);
    const out = await lib.PDFDocument.create();
    const copied = await out.copyPages(
      src,
      order.map((x) => x.p)
    );
    copied.forEach((pg, k) => {
      const r = order[k].rot || 0;
      if (r) pg.setRotation(lib.degrees((pg.getRotation().angle + r) % 360));
      out.addPage(pg);
    });
    const removed = src.getPageCount() - new Set(order.map((x) => x.p)).size;
    return [{ name: `${base(files[0])}-reordered.pdf`, blob: pdfBlob(await out.save()), note: `${order.length} page${order.length === 1 ? "" : "s"}${removed > 0 ? ` · ${removed} removed` : ""}` }];
  }
  if (id === "pdf-to-text") {
    const pdf = await openPdfjs(files[0]);
    const parts = [];
    let chars = 0;
    for (let i = 1; i <= pdf.numPages; i++) {
      onProgress(`Reading page ${i} of ${pdf.numPages}…`);
      const page = await pdf.getPage(i);
      const tc = await page.getTextContent();
      let t = "";
      for (const item of tc.items) {
        if (typeof item.str !== "string") continue;
        t += item.str;
        if (item.hasEOL) t += "\n";
      }
      t = t.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
      if (o.join === "join") t = t.replace(/(\p{L})-\n(?=\p{Ll})/gu, "$1").replace(/([^\n])\n(?!\n)/g, "$1 ").replace(/ {2,}/g, " ");
      chars += t.length;
      parts.push(o.markers ? `--- Page ${i} ---\n${t}` : t);
      page.cleanup();
    }
    if (!chars) throw new Error("No text found. This PDF looks like a scan (pictures of pages), which needs OCR software to read.");
    const text = parts.join("\n\n");
    const words = (text.replace(/--- Page \d+ ---/g, "").match(/\S+/g) || []).length;
    return [{ name: `${base(files[0])}.txt`, blob: new Blob([text], { type: "text/plain;charset=utf-8" }), note: `${pdf.numPages} page${pdf.numPages === 1 ? "" : "s"} · ${new Intl.NumberFormat("en-IN").format(words)} words`, text }];
  }
}

const THUMB_LIMIT = 300;

/** Thumbnails you can move, rotate and delete. Used by Reorder PDF Pages. */
function PageGrid({ count, thumbs, order, setOrder }) {
  const [draft, setDraft] = useState(null);
  const [msg, setMsg] = useState("");
  const shown = draft ?? orderToText(order);
  const move = (k, d) =>
    setOrder((prev) => {
      const a = [...prev];
      const j = k + d;
      if (j < 0 || j >= a.length) return prev;
      [a[k], a[j]] = [a[j], a[k]];
      return a;
    });
  const apply = () => {
    try {
      const rot = Object.fromEntries(order.map((x) => [x.p, x.rot]));
      const next = parseRanges(shown, count)
        .flat()
        .map((p) => ({ p, rot: rot[p] || 0 }));
      setOrder(next);
      setDraft(null);
      setMsg("");
    } catch (e) {
      setMsg(e.message);
    }
  };
  return (
    <div className="pagegrid">
      <div className="pagegrid__bar panel">
        <div className="field">
          <label className="field__label" htmlFor="page-order">
            Page order (pages you leave out are removed)
          </label>
          <div className="line-in">
            <input
              id="page-order"
              className="input"
              value={shown}
              spellCheck="false"
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), apply())}
            />
            <button type="button" className="btn btn--ghost btn--sm" onClick={apply} disabled={draft === null}>
              Apply
            </button>
          </div>
          {msg && <p className="msg msg--error">{msg}</p>}
        </div>
        <div className="pagegrid__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setOrder((p) => [...p].reverse())}>
            Reverse order
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => {
              setOrder(Array.from({ length: count }, (_, p) => ({ p, rot: 0 })));
              setDraft(null);
              setMsg("");
            }}
          >
            Reset
          </button>
        </div>
      </div>
      <ol className="pagegrid__list">
        {order.map((x, k) => {
          const t = thumbs[x.p];
          return (
            <li key={`${x.p}-${k}`} className="pagegrid__item">
              <div className="pagegrid__thumb">
                {t ? (
                  <img src={t} alt={`Page ${x.p + 1}`} style={{ transform: `rotate(${x.rot}deg)` }} />
                ) : (
                  <span className="pagegrid__ph">{x.p < THUMB_LIMIT ? "…" : `Page ${x.p + 1}`}</span>
                )}
              </div>
              <p className="pagegrid__cap">
                <span className="pagegrid__pos">{k + 1}</span> Page {x.p + 1}
              </p>
              <div className="pagegrid__btns">
                <button type="button" className="btn btn--ghost btn--xs" disabled={k === 0} onClick={() => move(k, -1)} aria-label={`Move page ${x.p + 1} earlier`}>
                  ←
                </button>
                <button type="button" className="btn btn--ghost btn--xs" onClick={() => setOrder((p) => p.map((y, i) => (i === k ? { ...y, rot: (y.rot + 90) % 360 } : y)))} aria-label={`Rotate page ${x.p + 1}`}>
                  ⟳
                </button>
                <button type="button" className="btn btn--ghost btn--xs" disabled={k === order.length - 1} onClick={() => move(k, 1)} aria-label={`Move page ${x.p + 1} later`}>
                  →
                </button>
                <button type="button" className="btn btn--ghost btn--xs" onClick={() => setOrder((p) => p.filter((_, i) => i !== k))} aria-label={`Delete page ${x.p + 1}`}>
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ol>
      {order.length === 0 && <p className="msg msg--error">All pages are removed. Press Reset to start again.</p>}
    </div>
  );
}

export default function PdfTool({ id }) {
  const cfg = PDF_MODES[id];
  const [files, setFiles] = useState([]);
  const [opts, setOpts] = useState(() => Object.fromEntries(cfg.options.map((o) => [o.id, o.def])));
  const [pages, setPages] = useState(null);
  const [status, setStatus] = useState("");
  const [err, setErr] = useState("");
  const [results, setResults] = useState([]);
  const [thumbs, setThumbs] = useState([]);
  const [order, setOrder] = useState([]);
  const thumbRun = useRef(0);
  const isImages = id === "jpg-to-pdf";
  const isReorder = id === "reorder-pdf-pages";

  async function loadThumbs(file, count) {
    const my = ++thumbRun.current;
    setThumbs([]);
    setOrder(Array.from({ length: count }, (_, p) => ({ p, rot: 0 })));
    try {
      const pdf = await openPdfjs(file);
      for (let i = 1; i <= Math.min(pdf.numPages, THUMB_LIMIT); i++) {
        if (my !== thumbRun.current) return;
        const page = await pdf.getPage(i);
        const c = await renderPage(page, 160 / page.getViewport({ scale: 1 }).width, 400);
        const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.7));
        const url = URL.createObjectURL(blob);
        page.cleanup();
        if (my !== thumbRun.current) return URL.revokeObjectURL(url);
        setThumbs((prev) => {
          const a = [...prev];
          a[i - 1] = url;
          return a;
        });
      }
    } catch (e) {
      if (my === thumbRun.current) setErr(e.message);
    }
  }

  async function add(list) {
    setErr("");
    setResults([]);
    const ok = list.filter((f) => (isImages ? f.type.startsWith("image/") : f.type === "application/pdf" || /\.pdf$/i.test(f.name)));
    if (!ok.length) return setErr(isImages ? "Choose JPG or PNG images." : "Choose PDF files.");
    const next = cfg.multiple ? [...files, ...ok] : ok.slice(0, 1);
    setFiles(next);
    if (!cfg.multiple && !isImages) {
      try {
        const lib = await loadPdfLib();
        const d = await openPdf(lib, next[0]);
        setPages(d.getPageCount());
        if (isReorder) loadThumbs(next[0], d.getPageCount());
        if (id === "pdf-splitter") setOpts((p) => ({ ...p, ranges: d.getPageCount() > 1 ? `1-${Math.min(2, d.getPageCount())}` : "1" }));
      } catch (e) {
        setPages(null);
        setErr(e.message);
      }
    }
  }

  async function go() {
    setErr("");
    setResults([]);
    setStatus("Working…");
    try {
      const res = await run(id, files, { ...opts, order }, setStatus);
      setResults(res);
      if (res.length === 1 && !res[0].text) downloadBlob(res[0].blob, res[0].name);
      setStatus("");
    } catch (e) {
      setStatus("");
      setErr(e.message || "Something went wrong.");
    }
  }

  const move = (i, d) =>
    setFiles((p) => {
      const a = [...p];
      [a[i], a[i + d]] = [a[i + d], a[i]];
      return a;
    });
  const visible = cfg.options.filter((o) => !o.show || o.show(opts));

  return (
    <div className="mediatool">
      <DropZone
        accept={cfg.accept}
        multiple={cfg.multiple}
        onFiles={add}
        label={files.length && cfg.multiple ? `Add more ${isImages ? "images" : "PDFs"}` : isImages ? "Choose images" : cfg.multiple ? "Choose PDF files" : "Choose a PDF"}
        hint="or drop them here. Files stay on your device; nothing is uploaded."
      />
      {files.length > 0 && (
        <ol className="files">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="files__item">
              <div className="files__meta">
                <p className="files__name">
                  {cfg.multiple && <span className="files__n">{i + 1}.</span>} {f.name}
                </p>
                <p className="muted">
                  {bytes(f.size)}
                  {!cfg.multiple && pages ? ` · ${pages} page${pages === 1 ? "" : "s"}` : ""}
                </p>
              </div>
              <div className="files__actions">
                {cfg.multiple && (
                  <>
                    <button type="button" className="btn btn--ghost btn--sm" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${f.name} up`}>
                      ↑
                    </button>
                    <button type="button" className="btn btn--ghost btn--sm" disabled={i === files.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${f.name} down`}>
                      ↓
                    </button>
                  </>
                )}
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setFiles((p) => p.filter((_, j) => j !== i));
                    setResults([]);
                    if (!cfg.multiple) {
                      thumbRun.current++;
                      setThumbs([]);
                      setOrder([]);
                      setPages(null);
                    }
                  }}
                  aria-label={`Remove ${f.name}`}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      {isReorder && files.length > 0 && pages > 0 && <PageGrid count={pages} thumbs={thumbs} order={order} setOrder={setOrder} />}
      {visible.length > 0 && files.length > 0 && (
        <div className="optbar panel">
          {visible.map((o) => (
            <Field key={o.id} spec={o} value={opts[o.id]} onChange={(v) => setOpts((p) => ({ ...p, [o.id]: v }))} />
          ))}
        </div>
      )}
      {files.length > 0 && (
        <div className="row-actions">
          <button type="button" className="btn btn--primary btn--lg" onClick={go} disabled={!!status || (isReorder && !order.length)}>
            {status || cfg.action}
          </button>
        </div>
      )}
      {err && (
        <p className="msg msg--error" role="alert">
          {err}
        </p>
      )}
      {results.length === 1 && results[0].text !== undefined && (
        <div className="out">
          <div className="io__bar">
            <span className="field__label">Extracted text</span>
            <div className="io__tools">
              <CopyButton text={results[0].text} />
            </div>
          </div>
          <textarea className="input textarea textarea--out" readOnly value={results[0].text} rows={16} spellCheck="false" aria-label="Extracted text" />
        </div>
      )}
      {results.length > 0 && (
        <ul className="files files--results">
          {results.map((r) => (
            <li key={r.name} className="files__item">
              {r.thumb && <img className="files__thumb" src={r.thumb} alt="" width="64" height="64" />}
              <div className="files__meta">
                <p className="files__name">{r.name}</p>
                <p className="muted">
                  {r.note} · {bytes(r.blob.size)}
                </p>
              </div>
              <div className="files__actions">
                <button type="button" className="btn btn--primary btn--sm" onClick={() => downloadBlob(r.blob, r.name)}>
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
