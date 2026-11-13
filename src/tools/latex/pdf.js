// Typesets the blocks from document.js into a real PDF with pdf-lib: selectable Times text, justified
// paragraphs, and equations drawn as vector paths from the TeX engine's SVG.
import { PDFDocument, StandardFonts, rgb, pushGraphicsState, popGraphicsState, concatTransformationMatrix, PageSizes, PDFName, PDFString } from "pdf-lib";
import { parseLatex } from "./document.js";
import { mul, svgShapes } from "./svg.js";

const PAPER = { a4: PageSizes.A4, letter: PageSizes.Letter, a5: PageSizes.A5 };
const NAMED = { red: "#ff0000", green: "#00a000", blue: "#0645ad", black: "#000000", white: "#ffffff", gray: "#808080", grey: "#808080", cyan: "#00aaaa", magenta: "#cc00cc", yellow: "#c9a800", orange: "#ff8000", purple: "#800080", brown: "#804000", teal: "#008080", violet: "#8000ff", darkgray: "#404040", lightgray: "#c0c0c0" };

function color(c) {
  if (!c || c === "currentColor") return null;
  const hex = NAMED[String(c).toLowerCase()] || (/^#?[0-9a-f]{6}$/i.test(c) ? `#${c.replace("#", "")}` : null);
  if (!hex) {
    const m = String(c).match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    return m ? rgb(m[1] / 255, m[2] / 255, m[3] / 255) : null;
  }
  return rgb(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);
}

/** Sanitize text for the PDF standard fonts (WinAnsi). */
function winAnsi(s, ctx) {
  return s
    .replace(/[   ]/g, " ")
    .replace(/ /g, " ")
    .replace(/[^\x20-\x7e -ÿ–—‘’‚“”„†‡•…‰‹›€™ŒœŠšŸŽžƒˆ˜]/g, (c) => {
      ctx.warnChar(c);
      return "?";
    });
}

class Layout {
  constructor(pdf, fonts, parsed, tex) {
    Object.assign(this, { pdf, fonts, parsed, tex });
    const { meta } = parsed;
    const [w, h] = PAPER[meta.paper] || PageSizes.A4;
    this.W = w;
    this.H = h;
    this.M = meta.margin ?? (meta.size >= 12 ? 64 : 72);
    this.fs = meta.size;
    this.lead = meta.size * 1.28;
    this.badChars = new Set();
    this.page = null;
    this.y = 0;
    this.math = new Map();
    this.links = [];
    this.newPage();
  }
  warnChar(c) {
    this.badChars.add(c);
  }
  newPage() {
    this.page = this.pdf.addPage([this.W, this.H]);
    this.y = this.H - this.M;
    this.empty = true;
  }
  need(h) {
    if (this.y - h < this.M) this.newPage();
  }
  font(s = {}) {
    if (s.tt) return this.fonts.tt;
    return s.b ? (s.i ? this.fonts.bi : this.fonts.b) : s.i ? this.fonts.i : this.fonts.r;
  }

  mathBox(tex, size, display) {
    const key = `${display ? "D" : "I"}:${tex}`;
    let m = this.math.get(key);
    if (!m) {
      const r = this.tex(tex, { display });
      if (r.error) {
        this.parsed.log.push({ level: "error", msg: `Equation '${tex.slice(0, 50)}': ${r.error}` });
        m = { error: tex };
      } else m = svgShapes(r.svg);
      this.math.set(key, m);
    }
    if (m.error) return { kind: "text", text: `[${m.error}]`, s: { color: "red", tt: true }, size: size * 0.85 };
    const k = size / 1000;
    return { kind: "math", m, k, w: m.w * k, asc: m.top * k, desc: m.depth * k };
  }

  drawMath(box, x, base, page = this.page) {
    const { m, k } = box;
    // Page coordinates: origin bottom-left. SVG: y down, 1000 units to the em.
    const toPage = [k, 0, 0, -k, x - m.x * k, base];
    for (const s of m.shapes) {
      const t = mul(mul(toPage, s.m), [1, 0, 0, -1, 0, 0]);
      page.pushOperators(pushGraphicsState(), concatTransformationMatrix(...t));
      page.drawSvgPath(s.d, { x: 0, y: 0, scale: 1, color: color(s.fill) ?? rgb(0, 0, 0), borderWidth: 0 });
      page.pushOperators(popGraphicsState());
    }
  }

  /** Turn runs into measured words. */
  atoms(runs, base = {}) {
    const out = [];
    const size = (s) => (base.size || this.fs) * (s?.size || 1) * (s?.sup ? 0.7 : 1);
    for (const r of runs) {
      if (r.br) {
        out.push({ kind: "br" });
        continue;
      }
      if (r.hfill) {
        out.push({ kind: "hfill" });
        continue;
      }
      if (r.math !== undefined) {
        const b = this.mathBox(r.math, size(r.s), !!r.display);
        if (b.kind === "text") out.push({ kind: "word", ...this.word(b.text, b.s, b.size) });
        else out.push(b);
        continue;
      }
      const s = { ...base.style, ...r.s };
      const text = winAnsi(s.sc ? r.text.toUpperCase() : r.text, this);
      for (const piece of text.split(/( +)/)) {
        if (!piece) continue;
        if (/^ +$/.test(piece)) out.push({ kind: "space", w: this.font(s).widthOfTextAtSize(" ", size(s)) * piece.length });
        else out.push({ kind: "word", ...this.word(piece, s, size(s)) });
      }
    }
    return out;
  }
  word(text, s, size) {
    const f = this.font(s);
    return { text, s, size, f, w: f.widthOfTextAtSize(text, size), asc: size * 0.72, desc: size * 0.22 };
  }

  /** Greedy line breaking. Returns lines of atoms. */
  lines(atoms, width) {
    const lines = [];
    let cur = [];
    let w = 0;
    let pendingSpace = null;
    const end = (forced) => {
      lines.push({ atoms: cur, forced });
      cur = [];
      w = 0;
      pendingSpace = null;
    };
    for (const a of atoms) {
      if (a.kind === "br") {
        end(true);
        continue;
      }
      if (a.kind === "space") {
        if (cur.length) pendingSpace = a;
        continue;
      }
      if (a.kind === "hfill") {
        cur.push(a);
        pendingSpace = null;
        continue;
      }
      const sp = pendingSpace ? pendingSpace.w : 0;
      if (w + sp + a.w > width && cur.length) end(false);
      else if (pendingSpace) {
        cur.push(pendingSpace);
        w += sp;
      }
      pendingSpace = null;
      cur.push(a);
      w += a.w;
    }
    if (cur.length) end(true);
    return lines;
  }

  drawLine(line, x, base, width, align, justify) {
    const atoms = line.atoms;
    const natural = atoms.reduce((s, a) => s + (a.w || 0), 0);
    const fills = atoms.filter((a) => a.kind === "hfill").length;
    const spaces = atoms.filter((a) => a.kind === "space").length;
    const slack = Math.max(0, width - natural);
    let cx = x;
    if (!fills) {
      if (align === "center") cx += slack / 2;
      else if (align === "right") cx += slack;
    }
    const extra = !fills && justify && !line.forced && spaces && slack / natural < 0.35 ? slack / spaces : 0;
    for (const a of atoms) {
      if (a.kind === "space") cx += a.w + extra;
      else if (a.kind === "hfill") cx += slack / fills;
      else if (a.kind === "math") {
        if (a.w > width) {
          const r = width / a.w;
          this.drawMath({ ...a, k: a.k * r, w: width }, x, base);
          cx += width;
        } else {
          this.drawMath(a, cx, base);
          cx += a.w;
        }
      } else {
        const rise = a.s?.sup ? a.size * 0.5 : 0;
        const col = color(a.s?.color) ?? rgb(0, 0, 0);
        this.page.drawText(a.text, { x: cx, y: base + rise, size: a.size, font: a.f, color: col });
        if (a.s?.u) this.page.drawLine({ start: { x: cx, y: base - 1.5 }, end: { x: cx + a.w, y: base - 1.5 }, thickness: 0.4, color: col });
        if (a.s?.href) this.link(cx, base - 2, a.w, a.size, a.s.href);
        cx += a.w;
      }
    }
  }
  link(x, y, w, h, url) {
    if (!/^(https?:|mailto:)/.test(url)) return;
    const ctx = this.pdf.context;
    const ref = ctx.register(ctx.obj({ Type: "Annot", Subtype: "Link", Rect: [x, y, x + w, y + h], Border: [0, 0, 0], A: { Type: "Action", S: "URI", URI: PDFString.of(url) } }));
    const key = PDFName.of("Annots");
    const list = this.page.node.lookup(key);
    if (list) list.push(ref);
    else this.page.node.set(key, ctx.obj([ref]));
  }

  paragraph(runs, { x = this.M, width = this.W - 2 * this.M, align, indent = 0, size, style, justify = true, after = 0.55 } = {}) {
    const atoms = this.atoms(runs, { size, style });
    const lead = (size || this.fs) * 1.28;
    const lines = this.lines(atoms, width - 0.01);
    lines.forEach((l, i) => {
      const asc = Math.max(lead * 0.76, ...l.atoms.map((a) => a.asc || 0));
      const desc = Math.max(lead * 0.24, ...l.atoms.map((a) => a.desc || 0));
      this.need(asc + desc);
      this.y -= asc;
      const ind = i === 0 ? indent : 0;
      this.drawLine(l, x + ind, this.y, width - ind, align, justify && !align);
      this.y -= desc;
    });
    this.y -= (size || this.fs) * after;
    this.empty = false;
  }

  heading(b) {
    const sizes = { 1: 1.44, 2: 1.2, 3: 1.1, 4: 1 };
    const size = this.fs * sizes[b.level];
    if (this.y - size * 4 < this.M) this.newPage();
    if (!this.empty) this.y -= size * 0.7;
    const runs = b.num ? [{ text: `${b.num} `, s: { b: true } }, ...b.runs] : b.runs;
    this.paragraph(runs, { size, style: { b: true }, justify: false, after: 0.35 });
  }

  display(b, x, width) {
    const box = this.mathBox(b.tex, this.fs * 1.05, true);
    if (box.kind === "text") return this.paragraph([{ text: box.text, s: box.s }], { x, width, align: "center", justify: false });
    const numW = b.num ? this.font().widthOfTextAtSize(`(${b.num})`, this.fs) + 12 : 0;
    const room = width - numW * 2;
    const scale = box.w > room ? Math.max(0.4, room / box.w) : 1;
    const k = box.k * scale;
    const [w, asc, desc] = [box.w * scale, box.asc * scale, box.desc * scale];
    const gap = this.fs * 0.5;
    this.need(asc + desc + gap * 2);
    this.y -= gap + asc;
    this.drawMath({ ...box, k }, x + (width - w) / 2, this.y);
    if (b.num) {
      const t = `(${b.num})`;
      this.page.drawText(t, { x: x + width - this.font().widthOfTextAtSize(t, this.fs), y: this.y - this.fs * 0.3 + (asc - desc) / 2, size: this.fs, font: this.font() });
    }
    this.y -= desc + gap;
    this.empty = false;
  }

  measureTable(b, x, width) {
    const sz = this.fs * 0.95;
    const n = Math.max(b.cols.length, ...b.rows.map((r) => r.reduce((s, c) => s + c.span, 0)), 1);
    const pad = 6;
    const widths = Array(n).fill(0);
    const cellAtoms = b.rows.map((r) => r.map((c) => this.atoms(c.runs, { size: sz })));
    b.rows.forEach((r, ri) => {
      let col = 0;
      r.forEach((c, ci) => {
        if (c.span === 1) {
          const w = cellAtoms[ri][ci].reduce((s, a) => s + (a.w || 0), 0);
          widths[col] = Math.max(widths[col], Math.min(w, 400));
        }
        col += c.span;
      });
    });
    b.cols.forEach((c, i) => {
      if (c.width) widths[i] = c.width;
    });
    const flex = b.cols.filter((c) => c.flex).length;
    let total = widths.reduce((s, w) => s + w + 2 * pad, 0);
    if (flex) {
      const room = Math.max(0, width - b.cols.reduce((s, c, i) => s + (c.flex ? 2 * pad : widths[i] + 2 * pad), 0));
      b.cols.forEach((c, i) => {
        if (c.flex) widths[i] = room / flex;
      });
      total = width;
    }
    if (total > width) {
      const f = (width - 2 * pad * n) / (total - 2 * pad * n);
      widths.forEach((w, i) => (widths[i] = w * f));
      total = width;
    }
    const left = x + (width - total) / 2;
    const rows = b.rows.map((r, ri) => {
      let col = 0;
      const cells = r.map((c, ci) => {
        const w = widths.slice(col, col + c.span).reduce((s, v) => s + v, 0) + (c.span - 1) * 2 * pad;
        const cell = { col, span: c.span, w, x: left + widths.slice(0, col).reduce((s, v) => s + v + 2 * pad, 0), align: c.align || b.cols[col]?.align || "left", lines: this.lines(cellAtoms[ri][ci], w + 0.01) };
        col += c.span;
        return cell;
      });
      const h = Math.max(sz * 1.5, ...cells.map((c) => c.lines.reduce((s, l) => s + Math.max(sz * 1.3, ...l.atoms.map((a) => (a.asc || 0) + (a.desc || 0))), 0))) + 3;
      return { cells, h };
    });
    return { rows, widths, left, total, sz, pad, height: rows.reduce((s, r) => s + r.h, 0) + this.fs * 1.3 };
  }

  table(b, x, width) {
    const { rows, widths, left, total, sz, pad, height } = this.measureTable(b, x, width);
    if (height > this.y - this.M && height < this.H - 2 * this.M) this.newPage();
    this.y -= this.fs * 0.4;
    const rule = (y, t) => this.page.drawLine({ start: { x: left, y }, end: { x: left + total, y }, thickness: t * 0.7, color: rgb(0, 0, 0) });
    rows.forEach((row, i) => {
      if (this.y - row.h < this.M) this.newPage();
      if (b.hl[i]) rule(this.y, b.hl[i]);
      const top = this.y;
      for (const c of row.cells) {
        let cy = top - 2;
        for (const l of c.lines) {
          const asc = Math.max(sz * 0.9, ...l.atoms.map((a) => a.asc || 0));
          const desc = Math.max(sz * 0.3, ...l.atoms.map((a) => a.desc || 0));
          this.drawLine(l, c.x + pad, cy - asc, c.w, c.align, false);
          cy -= asc + desc;
        }
      }
      this.y -= row.h;
      for (const v of b.vlines) {
        if (row.cells.some((c) => c.col < v && c.col + c.span > v)) continue;
        const vx = left + widths.slice(0, v).reduce((s, w) => s + w + 2 * pad, 0);
        this.page.drawLine({ start: { x: vx, y: top }, end: { x: vx, y: this.y }, thickness: 0.4, color: rgb(0, 0, 0) });
      }
    });
    if (b.hl[rows.length]) rule(this.y, b.hl[rows.length]);
    this.y -= this.fs * 0.9;
    this.empty = false;
  }

  verb(b, x, width) {
    const sz = this.fs * 0.85;
    const f = this.fonts.tt;
    const cw = f.widthOfTextAtSize("M", sz);
    const max = Math.max(10, Math.floor(width / cw));
    for (const raw of b.text.split("\n")) {
      const clean = winAnsi(raw.replace(/\t/g, "    "), this);
      const parts = clean.length ? clean.match(new RegExp(`.{1,${max}}`, "g")) : [""];
      for (const p of parts) {
        this.need(sz * 1.3);
        this.y -= sz * 1.3;
        if (p) this.page.drawText(p, { x, y: this.y, size: sz, font: f });
      }
    }
    this.y -= this.fs * 0.6;
    this.empty = false;
  }

  list(b, x, width, depth = 0) {
    const ind = this.fs * 2;
    const bullets = ["•", "–", "*", "·"];
    b.items.forEach((it, n) => {
      const itemX = x + ind;
      let label = b.kind === "enumerate" ? `${depth === 1 ? `(${String.fromCharCode(97 + (n % 26))})` : depth === 2 ? ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"][n % 10] + "." : `${n + 1}.`}` : b.kind === "bib" ? it.label : bullets[depth] ?? "•";
      if (b.kind === "description" || (it.label && b.kind !== "bib")) {
        const lab = Array.isArray(it.label) ? it.label.map((r) => ({ ...r, s: { ...r.s, b: b.kind === "description" } })) : [];
        const first = it.blocks[0];
        if (b.kind === "description" && first?.k === "p") {
          first.runs = [...lab, { text: " ", s: {} }, ...first.runs];
          this.blocksFlow(it.blocks, x + ind * 0.5, width - ind * 0.5, depth, { tight: true });
          return;
        }
        if (lab.length) label = lab.map((r) => r.text ?? "").join("");
      }
      this.blocksFlow(it.blocks, itemX, width - ind, depth + 1, { tight: true, marker: { label, x: itemX - this.fs * 0.5 } });
    });
  }

  blocksFlow(blocks, x, width, depth, opts = {}) {
    blocks.forEach((b, i) => {
      if (b.k === "p") {
        const next = blocks[i + 1];
        if (b.caption && next?.k === "table") {
          const { height } = this.measureTable(next, x, width);
          if (height + this.lead * 2 < this.H - 2 * this.M) this.need(height + this.lead * 2);
        }
        const marker = i === 0 ? opts.marker : null;
        if (marker) {
          const f = this.fonts.r;
          const t = winAnsi(marker.label, this);
          this.need(this.lead);
          const w = f.widthOfTextAtSize(t, this.fs);
          this.page.drawText(t, { x: marker.x - w, y: this.y - this.lead * 0.76, size: this.fs, font: f });
        }
        const indent = !opts.noindent && !b.noindent && !b.align && !b.caption && this.prev === "p" && !this.prevAligned ? this.fs * 1.5 : 0;
        this.paragraph(b.runs, { x, width, align: b.align, indent, size: b.caption ? this.fs * 0.92 : undefined, after: opts.tight ? 0.15 : 0.5, justify: !opts.tight || width > 300 });
      } else this.block(b, x, width, depth);
      this.prev = b.k;
      this.prevAligned = !!b.align;
    });
  }

  block(b, x, width, depth) {
    switch (b.k) {
      case "h":
        return this.heading(b);
      case "eq":
        return this.display(b, x, width);
      case "list":
        this.list(b, x, width, b.kind === "bib" ? 0 : depth);
        this.y -= this.fs * 0.35;
        return;
      case "table":
        return this.table(b, x, width);
      case "verb":
        return this.verb(b, x, width);
      case "newpage":
        if (!this.empty) this.newPage();
        return;
      case "space":
        this.y -= b.pt;
        return;
      case "rule":
        this.need(8);
        this.y -= 4;
        this.page.drawLine({ start: { x, y: this.y }, end: { x: x + width, y: this.y }, thickness: 0.5, color: rgb(0, 0, 0) });
        this.y -= 6;
        return;
      case "title":
        return this.title();
      case "toc":
        return this.toc();
      case "abstract": {
        this.paragraph([{ text: "Abstract", s: { b: true } }], { align: "center", justify: false, x, width, after: 0.3 });
        this.blocksFlow(b.blocks, x + 28, width - 56, depth, { noindent: true });
        this.y -= this.fs * 0.5;
        return;
      }
      case "quote":
        this.blocksFlow(b.blocks, x + 24, width - 48, depth, { noindent: true });
        return;
    }
  }

  title() {
    const { inline } = this.parsed.meta;
    const big = this.fs * 1.73;
    this.y -= this.fs;
    for (const line of inline.title || []) this.paragraph(line, { align: "center", size: big, justify: false, after: 0.4 });
    this.y -= this.fs * 0.4;
    for (const line of inline.author || []) this.paragraph(line, { align: "center", size: this.fs * 1.2, justify: false, after: 0.2 });
    const d = inline.date;
    if (d === null || d === undefined) this.paragraph([{ text: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), s: {} }], { align: "center", justify: false, size: this.fs * 1.1 });
    else for (const line of d) if (line.length) this.paragraph(line, { align: "center", justify: false, size: this.fs * 1.1 });
    this.y -= this.fs;
    this.prev = "title";
  }

  toc() {
    this.paragraph([{ text: "Contents", s: { b: true } }], { size: this.fs * 1.44, justify: false });
    for (const h of this.parsed.toc) this.paragraph([{ text: h.num ? `${h.num} ` : "", s: {} }, ...h.runs], { x: this.M + (h.level - 1) * 16, justify: false, after: 0.1 });
    this.y -= this.fs;
    this.parsed.log.push({ level: "info", msg: "The table of contents lists headings without page numbers." });
  }

  run() {
    const { blocks, notes } = this.parsed;
    this.prev = "";
    this.blocksFlow(blocks, this.M, this.W - 2 * this.M, 0);
    if (notes.length) {
      this.need(this.fs * 4);
      this.y -= this.fs;
      this.page.drawLine({ start: { x: this.M, y: this.y }, end: { x: this.M + 120, y: this.y }, thickness: 0.4, color: rgb(0, 0, 0) });
      this.y -= 4;
      for (const n of notes) this.paragraph([{ text: `${n.n} `, s: { sup: true } }, ...n.runs], { size: this.fs * 0.85, justify: false, after: 0.15 });
      this.parsed.log.push({ level: "info", msg: "Footnotes are collected at the end of the document." });
    }
    if (this.parsed.meta.cls !== "beamer") {
      const pages = this.pdf.getPages();
      if (pages.length > 1 || this.parsed.meta.cls !== "letter")
        pages.forEach((p, i) => {
          const t = String(i + 1);
          const w = this.fonts.r.widthOfTextAtSize(t, this.fs);
          p.drawText(t, { x: (this.W - w) / 2, y: this.M * 0.5, size: this.fs, font: this.fonts.r });
        });
    }
    if (this.badChars.size) this.parsed.log.push({ level: "warn", msg: `Replaced with ?: ${[...this.badChars].slice(0, 12).join(" ")}. The built-in fonts cover Western characters only; for maths symbols use $...$.` });
  }
}

/** Compile LaTeX source. tex is the engine's texToSvg. Returns { bytes, pages, log }. */
export async function compileLatex(source, tex) {
  const parsed = parseLatex(source);
  const pdf = await PDFDocument.create();
  const fonts = {
    r: await pdf.embedFont(StandardFonts.TimesRoman),
    b: await pdf.embedFont(StandardFonts.TimesRomanBold),
    i: await pdf.embedFont(StandardFonts.TimesRomanItalic),
    bi: await pdf.embedFont(StandardFonts.TimesRomanBoldItalic),
    tt: await pdf.embedFont(StandardFonts.Courier),
  };
  const titleText = (parsed.meta.inline.title?.[0] || []).map((r) => r.text ?? "").join("");
  if (titleText) pdf.setTitle(titleText);
  pdf.setCreator("FreeToolsPro LaTeX to PDF");
  pdf.setProducer("FreeToolsPro (freetoolspro.in)");
  const layout = new Layout(pdf, fonts, parsed, tex);
  layout.run();
  const bytes = await pdf.save();
  return { bytes, pages: pdf.getPageCount(), log: parsed.log };
}
