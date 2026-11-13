// Lays out one manuscript as an A4 PDF with pdf-lib.
// Every line is measured before it is drawn. A line that would still run past
// the right margin (a long URL, a hash, a line of code with no spaces) is cut
// by characters instead, so nothing can leave the page. Any line that is too
// wide anyway is recorded in `overflows`, and the editorial check fails on it.
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// A5 portrait: a standard book size that also reads well on a phone screen.
export const W = 419.53;
export const H = 595.28;
const M = 42;
const BOTTOM = 46;

const INK = rgb(0.11, 0.12, 0.14);
const MUTED = rgb(0.33, 0.36, 0.42);
const BRAND = rgb(0.851, 0.514, 0.153);
const RULE = rgb(0.82, 0.8, 0.76);
const PAPER = rgb(0.97, 0.955, 0.93);
const CODEBG = rgb(0.95, 0.95, 0.96);
const HEADBG = rgb(0.93, 0.91, 0.88);
const WHITE = rgb(1, 1, 1);
const COVER = rgb(0.09, 0.11, 0.16);

// Standard PDF fonts only cover WinAnsi. Map the characters we use to safe ones.
const SWAPS = [
  ["₹", "Rs. "], ["–", "-"], ["—", " - "], ["−", "-"], ["“", '"'], ["”", '"'], ["‘", "'"], ["’", "'"],
  ["…", "..."], [" ", " "], ["→", "->"], ["←", "<-"], ["≤", "<="], ["≥", ">="], ["≈", "~"], ["✓", "[ok]"], ["✕", "x"],
  ["•", "-"], ["\t", "  "],
];

export function clean(s) {
  let out = String(s ?? "");
  for (const [a, b] of SWAPS) out = out.split(a).join(b);
  return out.replace(/Rs\. {2,}/g, "Rs. ");
}

export function unencodable(s) {
  const bad = new Set();
  for (const ch of clean(s)) {
    const c = ch.codePointAt(0);
    if (c === 10) continue;
    if (c < 32 || c > 255) bad.add(ch);
  }
  return [...bad];
}

function breakWord(word, font, size, maxW) {
  const parts = [];
  let cur = "";
  for (const ch of word) {
    if (cur && font.widthOfTextAtSize(cur + ch, size) > maxW) {
      parts.push(cur);
      cur = ch;
    } else cur += ch;
  }
  if (cur) parts.push(cur);
  return parts;
}

export function wrap(text, font, size, maxW) {
  const words = clean(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const pieces = font.widthOfTextAtSize(word, size) > maxW ? breakWord(word, font, size, maxW) : [word];
    for (const piece of pieces) {
      const next = line ? `${line} ${piece}` : piece;
      if (font.widthOfTextAtSize(next, size) <= maxW) line = next;
      else {
        if (line) lines.push(line);
        line = piece;
      }
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

// Code keeps its spaces. Long lines continue on the next row, indented, with a marker.
function wrapCode(text, font, size, maxW) {
  const out = [];
  for (const raw of clean(text).split("\n")) {
    let rest = raw.replace(/\s+$/, "");
    if (!rest) {
      out.push("");
      continue;
    }
    let first = true;
    while (rest.length) {
      const prefix = first ? "" : "  > ";
      let n = rest.length;
      while (n > 1 && font.widthOfTextAtSize(prefix + rest.slice(0, n), size) > maxW) n -= 1;
      out.push(prefix + rest.slice(0, n));
      rest = rest.slice(n);
      first = false;
    }
  }
  return out;
}

class Flow {
  constructor(pdf, fonts, book, author) {
    this.pdf = pdf;
    this.font = fonts.regular;
    this.bold = fonts.bold;
    this.mono = fonts.mono;
    this.book = book;
    this.author = author;
    this.page = null;
    this.y = 0;
    this.maxW = W - M * 2;
    this.toc = [];
    this.content = false;
    this.overflows = [];
  }

  text(str, opts) {
    const width = opts.font.widthOfTextAtSize(str, opts.size);
    if (opts.x + width > W - M + 0.5) this.overflows.push({ page: this.pdf.getPageCount(), text: str.slice(0, 60), over: Math.round(opts.x + width - (W - M)) });
    this.page.drawText(str, { ...opts });
  }

  header() {
    const label = clean(this.book.title);
    const short = label.length > 46 ? label.slice(0, 44) + "..." : label;
    this.page.drawText(short, { x: M, y: H - 28, size: 7, font: this.font, color: MUTED });
    const name = clean(this.author.name);
    const nw = this.font.widthOfTextAtSize(name, 7);
    this.page.drawText(name, { x: W - M - nw, y: H - 28, size: 7, font: this.font, color: MUTED });
    this.page.drawLine({ start: { x: M, y: H - 34 }, end: { x: W - M, y: H - 34 }, thickness: 0.4, color: RULE });
  }

  newPage() {
    this.page = this.pdf.addPage([W, H]);
    if (this.content) this.header();
    this.y = this.content ? H - 54 : H - M;
  }

  ensure(h) {
    if (!this.page || this.y - h < BOTTOM) this.newPage();
  }

  lines(str, face, size, color, gap, indent = 0) {
    for (const line of wrap(str, face, size, this.maxW - indent)) {
      this.ensure(gap);
      this.text(line, { x: M + indent, y: this.y, size, font: face, color });
      this.y -= gap;
    }
  }

  para(str) {
    this.lines(str, this.font, 10, INK, 14);
    this.y -= 6;
  }

  heading(str, size = 11.5) {
    this.ensure(44);
    this.lines(str, this.bold, size, INK, size + 3.5);
    this.y -= 2;
  }

  label(str) {
    this.ensure(34);
    this.lines(str, this.bold, 9, BRAND, 12.5);
    this.y -= 1;
  }

  bullets(items, marker = "-") {
    items.forEach((item, n) => {
      const mark = marker === "1" ? `${n + 1}.` : "-";
      const lines = wrap(item, this.font, 10, this.maxW - 16);
      lines.forEach((line, i) => {
        this.ensure(14);
        if (i === 0) this.text(mark, { x: M, y: this.y, size: 10, font: marker === "1" ? this.bold : this.font, color: BRAND });
        this.text(line, { x: M + 16, y: this.y, size: 10, font: this.font, color: INK });
        this.y -= 14;
      });
      this.y -= 3;
    });
    this.y -= 5;
  }

  note(str) {
    const lines = wrap(str, this.font, 9, this.maxW - 20);
    // Notes can be long: draw them in page-sized slices.
    let i = 0;
    while (i < lines.length) {
      this.ensure(30);
      const room = Math.max(1, Math.floor((this.y - BOTTOM - 10) / 12.2));
      const slice = lines.slice(i, i + room);
      const h = 13 + slice.length * 12.2;
      this.page.drawRectangle({ x: M, y: this.y - h + 12, width: this.maxW, height: h, color: PAPER });
      this.page.drawRectangle({ x: M, y: this.y - h + 12, width: 2.5, height: h, color: BRAND });
      let ny = this.y;
      for (const line of slice) {
        this.text(line, { x: M + 12, y: ny, size: 9, font: this.font, color: MUTED });
        ny -= 12.2;
      }
      this.y -= h + 6;
      i += slice.length;
      if (i < lines.length) this.newPage();
    }
    this.y -= 2;
  }

  code(str, caption) {
    if (caption) {
      this.lines(caption, this.font, 8, MUTED, 11);
      this.y -= 3;
    }
    const size = 7.6;
    const gap = 10.2;
    const lines = wrapCode(str, this.mono, size, this.maxW - 16);
    let i = 0;
    while (i < lines.length) {
      this.ensure(gap * Math.min(3, lines.length - i) + 10);
      const room = Math.max(1, Math.floor((this.y - BOTTOM - 8) / gap));
      const slice = lines.slice(i, i + room);
      const h = 10 + slice.length * gap;
      this.page.drawRectangle({ x: M, y: this.y - h + 10, width: this.maxW, height: h, color: CODEBG });
      let ny = this.y;
      for (const line of slice) {
        if (line) this.text(line, { x: M + 8, y: ny, size, font: this.mono, color: INK });
        ny -= gap;
      }
      this.y -= h + 4;
      i += slice.length;
      if (i < lines.length) this.newPage();
    }
    this.y -= 6;
  }

  table(t) {
    if (t.caption) {
      this.lines(t.caption, this.font, 8, MUTED, 11);
      this.y -= 4;
    }
    const cols = t.headers.length;
    const weights = t.widths || t.headers.map(() => 1);
    const total = weights.reduce((a, b) => a + b, 0);
    const colW = weights.map((w) => (this.maxW * w) / total);
    const xs = colW.map((_, i) => M + colW.slice(0, i).reduce((a, b) => a + b, 0));
    const size = cols >= 5 ? 6.8 : 7.6;
    const drawRow = (cells, head) => {
      const face = head ? this.bold : this.font;
      const wrapped = cells.map((c, i) => wrap(String(c), face, size, colW[i] - 6));
      const n = Math.max(...wrapped.map((w) => w.length));
      const rowH = 6 + n * (size + 2.4);
      if (!this.page || this.y - rowH < BOTTOM) {
        this.newPage();
        if (!head) drawRow(t.headers, true);
      }
      if (head) this.page.drawRectangle({ x: M, y: this.y - rowH + 10, width: this.maxW, height: rowH, color: HEADBG });
      else this.page.drawLine({ start: { x: M, y: this.y - rowH + 10 }, end: { x: W - M, y: this.y - rowH + 10 }, thickness: 0.3, color: RULE });
      wrapped.forEach((lines, i) => {
        let ly = this.y;
        for (const line of lines) {
          this.text(line, { x: xs[i] + 3, y: ly, size, font: face, color: INK });
          ly -= size + 2.4;
        }
      });
      this.y -= rowH;
    };
    this.ensure(40);
    drawRow(t.headers, true);
    for (const row of t.rows) drawRow(row, false);
    this.y -= 10;
  }

  block(b) {
    if (b.heading) this.heading(b.heading, b.level === 2 ? 10.5 : 11.5);
    if (b.label) this.label(b.label);
    for (const p of b.paragraphs || []) this.para(p);
    if (b.bullets?.length) this.bullets(b.bullets);
    if (b.steps?.length) this.bullets(b.steps, "1");
    if (b.code) this.code(b.code, b.codeCaption);
    for (const c of b.codes || []) this.code(c.code, c.caption);
    if (b.table) this.table(b.table);
    for (const t of b.tables || []) this.table(t);
    for (const p of b.after || []) this.para(p);
    if (b.note) this.note(b.note);
    for (const sub of b.sections || []) this.block({ ...sub, level: 2 });
  }

  chapter(ch) {
    if (this.page && this.y < H - 80) this.newPage();
    this.ensure(80);
    if (ch.kicker) {
      this.lines(ch.kicker.toUpperCase(), this.bold, 8, BRAND, 12);
      this.y -= 2;
    }
    this.lines(ch.title, this.bold, 15, INK, 19);
    this.y -= 5;
    if (ch.toc !== false) this.toc.push({ title: ch.title, page: this.pdf.getPageCount() });
    for (const p of ch.paragraphs || []) this.para(p);
    for (const s of ch.sections || []) this.block(s);
  }
}

function drawCover(pdf, fonts, book, author) {
  const { regular: font, bold } = fonts;
  const page = pdf.addPage([W, H]);
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: COVER });
  page.drawRectangle({ x: 0, y: H - 10, width: W, height: 10, color: BRAND });
  page.drawRectangle({ x: 0, y: 0, width: 12, height: H, color: BRAND });
  page.drawText("FREETOOLSPRO", { x: M, y: H - 58, size: 9, font: bold, color: BRAND });
  page.drawText(clean(book.topic).toUpperCase(), { x: M, y: H - 98, size: 10, font: bold, color: rgb(0.78, 0.8, 0.86) });
  let y = H - 140;
  for (const line of wrap(book.title, bold, 22, W - M * 2 - 6)) {
    page.drawText(line, { x: M, y, size: 22, font: bold, color: WHITE });
    y -= 28;
  }
  y -= 6;
  page.drawLine({ start: { x: M, y }, end: { x: M + 56, y }, thickness: 2, color: BRAND });
  y -= 22;
  for (const line of wrap(book.blurb, font, 10.5, W - M * 2 - 6)) {
    page.drawText(line, { x: M, y, size: 10.5, font, color: rgb(0.82, 0.84, 0.88) });
    y -= 15;
  }
  page.drawText("Written by", { x: M, y: 112, size: 9, font, color: rgb(0.7, 0.73, 0.78) });
  let ay = 94;
  for (const line of wrap(author.name, bold, 13, W - M * 2)) {
    page.drawText(line, { x: M, y: ay, size: 13, font: bold, color: WHITE });
    ay -= 16;
  }
  for (const line of wrap(author.role, font, 8.5, W - M * 2)) {
    page.drawText(line, { x: M, y: ay, size: 8.5, font, color: rgb(0.75, 0.78, 0.84) });
    ay -= 11;
  }
  page.drawText("freetoolspro.in/ebooks", { x: M, y: 34, size: 8.5, font: bold, color: BRAND });
}

function drawAuthor(flow, edition) {
  flow.content = false;
  flow.newPage();
  flow.lines(flow.book.title, flow.bold, 15, INK, 19);
  flow.y -= 3;
  flow.lines(`An original guide. ${edition}.`, flow.font, 9.5, MUTED, 13);
  flow.y -= 6;
  flow.lines(`By ${flow.author.name}`, flow.bold, 10.5, INK, 14);
  flow.lines(flow.author.role, flow.font, 9, MUTED, 12);
  flow.y -= 8;
  flow.para(
    "This text was written for readers of FreeToolsPro. It is original. It does not copy another book, and it is free to download for your own reading. Figures are worked examples so you can see the arithmetic. They are not a quote from a bank, a tax assessment, or a university rule."
  );
  flow.para(
    "Nothing in this book is legal, tax, financial, medical, or academic advice. Rates, slabs, contribution caps and college formulas change. Read it to understand the moving parts, then confirm the current number with the office that will hold you to it."
  );
  flow.note("Tools mentioned in the book run in your browser on freetoolspro.in. Your inputs stay on your device.");
  flow.newPage();
  flow.lines("About the author", flow.bold, 12, INK, 16);
  flow.y -= 2;
  for (const p of flow.author.bio) flow.para(p);
}

function tocLines(toc, font) {
  const rows = [];
  for (const item of toc) {
    const pageNo = String(item.page);
    const pw = font.widthOfTextAtSize(pageNo, 9.5);
    const titleLines = wrap(item.title, font, 9.5, W - M * 2 - pw - 14);
    titleLines.forEach((t, i) => rows.push({ t, pageNo: i === titleLines.length - 1 ? pageNo : "", pw, gapAfter: i === titleLines.length - 1 }));
  }
  return rows;
}

const TOC_ROWS_FIRST = 30;
const TOC_ROWS_MORE = 34;

function tocPagesNeeded(chapters, font) {
  const rows = tocLines(chapters.filter((c) => c.toc !== false).map((c) => ({ title: c.title, page: 999 })), font).length;
  if (rows <= TOC_ROWS_FIRST) return 1;
  return 1 + Math.ceil((rows - TOC_ROWS_FIRST) / TOC_ROWS_MORE);
}

function drawToc(pdf, fonts, toc, firstIndex, count) {
  const { regular: font, bold } = fonts;
  const rows = tocLines(toc, font);
  let p = 0;
  let page = pdf.getPages()[firstIndex];
  let y = H - M;
  page.drawText("Contents", { x: M, y, size: 15, font: bold, color: INK });
  y -= 24;
  let used = 0;
  for (const r of rows) {
    if (used >= (p === 0 ? TOC_ROWS_FIRST : TOC_ROWS_MORE)) {
      p += 1;
      if (p >= count) throw new Error("Contents ran past the pages reserved for it");
      page = pdf.getPages()[firstIndex + p];
      y = H - M;
      used = 0;
    }
    page.drawText(r.t, { x: M, y, size: 9.5, font, color: INK });
    if (r.pageNo) page.drawText(r.pageNo, { x: W - M - r.pw, y, size: 9.5, font, color: MUTED });
    y -= r.gapAfter ? 15 : 12;
    used += 1;
  }
}

export async function renderBook({ book, author, chapters, edition }) {
  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold),
    mono: await pdf.embedFont(StandardFonts.Courier),
  };
  pdf.setTitle(clean(book.title));
  pdf.setAuthor(clean(author.name));
  pdf.setSubject(clean(book.blurb));
  pdf.setCreator("FreeToolsPro");
  pdf.setProducer(clean(author.name));
  pdf.setKeywords([book.topic, "FreeToolsPro", author.name].map(clean));

  drawCover(pdf, fonts, book, author);
  const flow = new Flow(pdf, fonts, book, author);
  drawAuthor(flow, edition);
  const tocFirst = pdf.getPageCount();
  const tocCount = tocPagesNeeded(chapters, fonts.regular);
  for (let i = 0; i < tocCount; i++) pdf.addPage([W, H]);
  flow.page = null;
  flow.content = true;
  for (const ch of chapters) flow.chapter(ch);
  drawToc(pdf, fonts, flow.toc, tocFirst, tocCount);

  pdf.getPages().forEach((p, i) => {
    if (i === 0) return;
    const label = String(i + 1);
    const lw = fonts.regular.widthOfTextAtSize(label, 8);
    p.drawText(label, { x: (W - lw) / 2, y: 24, size: 8, font: fonts.regular, color: MUTED });
  });

  const bytes = await pdf.save();
  return { bytes, pages: pdf.getPageCount(), overflows: flow.overflows, toc: flow.toc };
}
