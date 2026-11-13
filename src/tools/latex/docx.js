// LaTeX to Word: MathML to Office Math (OMML), the format of native, editable Word equations, then a
// minimal .docx package. A .docx is a ZIP of XML files; the ZIP is written here with stored (uncompressed)
// entries, which Word opens normally and which needs no compression library.
import { parseXml, elements, textOf, escXml } from "./xml.js";

const NARY = new Set(["∑", "∏", "∐", "∫", "∬", "∭", "∮", "⋃", "⋂", "⨁", "⨂", "⋁", "⋀"]);
const ACC = { "^": "̂", "ˆ": "̂", "~": "̃", "˜": "̃", "→": "⃗", "⃗": "⃗", "˙": "̇", "¨": "̈", "ˇ": "̌", "˘": "̆", "´": "́", "`": "̀" };
const BARS = new Set(["¯", "‾", "ˉ", "―", "_"]);
const STOP = new Set(["=", "+", "-", "−", "<", ">", "≤", "≥", "≠", "≈", ",", "→", "±", "∓"]);

const run = (t, pr = "") => `<m:r>${pr}<w:rPr><w:rFonts w:ascii="Cambria Math" w:hAnsi="Cambria Math"/></w:rPr><m:t xml:space="preserve">${escXml(t)}</m:t></m:r>`;
const PLAIN = '<m:rPr><m:sty m:val="p"/></m:rPr>';
const unwrap = (n) => {
  while (n && ["mrow", "mstyle", "mpadded"].includes(n.tag) && elements(n).length === 1) n = elements(n)[0];
  return n;
};
const opText = (n) => {
  const u = unwrap(n);
  return u?.tag === "mo" ? textOf(u).trim() : "";
};

function naryXml(op, lim, sub, sup, body) {
  return `<m:nary><m:naryPr><m:chr m:val="${op}"/><m:limLoc m:val="${lim}"/>${sub ? "" : '<m:subHide m:val="1"/>'}${sup ? "" : '<m:supHide m:val="1"/>'}</m:naryPr><m:sub>${sub}</m:sub><m:sup>${sup}</m:sup><m:e>${body}</m:e></m:nary>`;
}

/** The big operator and its limits, if this element is one (\sum_{i}^{n}, \int_0^1, or a bare \sum). */
function narySpec(n) {
  const u = unwrap(n);
  if (!u) return null;
  if (u.tag === "mo" && NARY.has(textOf(u).trim())) return { op: textOf(u).trim(), lim: "subSup", sub: null, sup: null };
  if (!["munderover", "munder", "mover", "msubsup", "msub", "msup"].includes(u.tag)) return null;
  const [b, x, y] = elements(u);
  const op = opText(b);
  if (!NARY.has(op)) return null;
  const lim = u.tag.startsWith("mu") || u.tag === "mover" ? "undOvr" : "subSup";
  if (u.tag === "munderover" || u.tag === "msubsup") return { op, lim, sub: x, sup: y };
  if (u.tag === "munder" || u.tag === "msub") return { op, lim, sub: x, sup: null };
  return { op, lim, sub: null, sup: x };
}

function seq(kids) {
  let out = "";
  for (let i = 0; i < kids.length; i++) {
    const spec = narySpec(kids[i]);
    if (spec) {
      const body = [];
      while (i + 1 < kids.length && !STOP.has(opText(kids[i + 1]))) body.push(kids[++i]);
      out += naryXml(spec.op, spec.lim, spec.sub ? om(spec.sub) : "", spec.sup ? om(spec.sup) : "", seq(body));
    } else out += om(kids[i]);
  }
  return out;
}

function fences(n, kids) {
  if (kids.length < 2) return null;
  const a = kids[0];
  const z = kids[kids.length - 1];
  if (a.tag !== "mo" || z.tag !== "mo") return null;
  if (a.attrs.stretchy === "false" || z.attrs.stretchy === "false") return null;
  const beg = textOf(a).trim();
  const end = textOf(z).trim();
  if (!/^[([{|‖∣∥⟨⌊⌈〈]?$/.test(beg) || !/^[)\]}|‖∣∥⟩⌋⌉〉]?$/.test(end)) return null;
  if (kids.length === 2 && !beg && !end) return null;
  return `<m:d><m:dPr><m:begChr m:val="${escXml(beg)}"/><m:endChr m:val="${escXml(end)}"/></m:dPr><m:e>${seq(kids.slice(1, -1))}</m:e></m:d>`;
}

function table(n) {
  const rows = elements(n).filter((r) => r.tag === "mtr" || r.tag === "mlabeledtr");
  const cols = Math.max(1, ...rows.map((r) => elements(r).length));
  const align = (n.attrs.columnalign || "center").trim().split(/\s+/);
  const jc = (i) => ({ left: "left", right: "right" })[align[Math.min(i, align.length - 1)]] || "center";
  const mcs = Array.from({ length: cols }, (_, i) => `<m:mc><m:mcPr><m:count m:val="1"/><m:mcJc m:val="${jc(i)}"/></m:mcPr></m:mc>`).join("");
  const body = rows
    .map((r) => {
      const cells = elements(r).map((c) => `<m:e>${om(c)}</m:e>`);
      while (cells.length < cols) cells.push("<m:e/>");
      return `<m:mr>${cells.join("")}</m:mr>`;
    })
    .join("");
  return `<m:m><m:mPr><m:mcs>${mcs}</m:mcs></m:mPr>${body}</m:m>`;
}

function overUnder(n) {
  const [b, x, y] = elements(n);
  const op = opText(x);
  if (n.tag === "mover") {
    if (ACC[op]) return `<m:acc><m:accPr><m:chr m:val="${ACC[op]}"/></m:accPr><m:e>${om(b)}</m:e></m:acc>`;
    if (BARS.has(op)) return `<m:bar><m:barPr><m:pos m:val="top"/></m:barPr><m:e>${om(b)}</m:e></m:bar>`;
    if (op === "⏞") return `<m:groupChr><m:groupChrPr><m:chr m:val="⏞"/><m:pos m:val="top"/><m:vertJc m:val="bot"/></m:groupChrPr><m:e>${om(b)}</m:e></m:groupChr>`;
    return `<m:limUpp><m:e>${om(b)}</m:e><m:lim>${om(x)}</m:lim></m:limUpp>`;
  }
  if (n.tag === "munder") {
    if (BARS.has(op)) return `<m:bar><m:barPr><m:pos m:val="bot"/></m:barPr><m:e>${om(b)}</m:e></m:bar>`;
    if (op === "⏟") return `<m:groupChr><m:groupChrPr><m:chr m:val="⏟"/><m:pos m:val="bot"/><m:vertJc m:val="top"/></m:groupChrPr><m:e>${om(b)}</m:e></m:groupChr>`;
    return `<m:limLow><m:e>${om(b)}</m:e><m:lim>${om(x)}</m:lim></m:limLow>`;
  }
  return `<m:limUpp><m:e><m:limLow><m:e>${om(b)}</m:e><m:lim>${om(x)}</m:lim></m:limLow></m:e><m:lim>${om(y)}</m:lim></m:limUpp>`;
}

function om(n) {
  if (!n) return "";
  if (typeof n === "string") return n.trim() ? run(n.trim()) : "";
  const k = elements(n);
  const t = textOf(n);
  switch (n.tag) {
    case "#root":
    case "math":
    case "mstyle":
    case "mpadded":
    case "mtd":
    case "merror":
      return seq(k);
    case "mrow":
      return fences(n, k) ?? seq(k);
    case "semantics":
      return om(k[0]);
    case "annotation":
    case "annotation-xml":
    case "mphantom":
    case "none":
      return "";
    case "mi": {
      const s = t.trim();
      const v = n.attrs.mathvariant;
      if ([...s].length > 1 || v === "normal") return run(s, PLAIN);
      if (v === "bold") return run(s, '<m:rPr><m:sty m:val="b"/></m:rPr>');
      if (v === "double-struck") return run(s, '<m:rPr><m:scr m:val="double-struck"/><m:sty m:val="p"/></m:rPr>');
      if (v === "script") return run(s, '<m:rPr><m:scr m:val="script"/><m:sty m:val="p"/></m:rPr>');
      if (v === "fraktur") return run(s, '<m:rPr><m:scr m:val="fraktur"/><m:sty m:val="p"/></m:rPr>');
      return run(s);
    }
    case "mn":
      return run(t.trim(), PLAIN);
    case "mo": {
      const s = t.trim().replace(/[⁡-⁤]/g, "");
      return s ? run(s, PLAIN) : "";
    }
    case "mtext":
    case "ms":
      return run(t.replace(/\s+/g, " ") || " ", "<m:rPr><m:nor/></m:rPr>");
    case "mspace": {
      const w = parseFloat(n.attrs.width || "0") * (/em/.test(n.attrs.width || "") ? 1 : 0.0625);
      return w > 0.1 ? run(w >= 0.9 ? " " : " ", PLAIN) : "";
    }
    case "mfrac":
      return `<m:f>${parseFloat(n.attrs.linethickness) === 0 ? '<m:fPr><m:type m:val="noBar"/></m:fPr>' : ""}<m:num>${om(k[0])}</m:num><m:den>${om(k[1])}</m:den></m:f>`;
    case "msqrt":
      return `<m:rad><m:radPr><m:degHide m:val="1"/></m:radPr><m:deg/><m:e>${seq(k)}</m:e></m:rad>`;
    case "mroot":
      return `<m:rad><m:deg>${om(k[1])}</m:deg><m:e>${om(k[0])}</m:e></m:rad>`;
    case "msup":
      return `<m:sSup><m:e>${om(k[0])}</m:e><m:sup>${om(k[1])}</m:sup></m:sSup>`;
    case "msub":
      return `<m:sSub><m:e>${om(k[0])}</m:e><m:sub>${om(k[1])}</m:sub></m:sSub>`;
    case "msubsup":
      return `<m:sSubSup><m:e>${om(k[0])}</m:e><m:sub>${om(k[1])}</m:sub><m:sup>${om(k[2])}</m:sup></m:sSubSup>`;
    case "mover":
    case "munder":
    case "munderover":
      return overUnder(n);
    case "mtable":
      return table(n);
    case "menclose":
      if (/strike/.test(n.attrs.notation || "")) return `<m:borderBox><m:borderBoxPr><m:hideTop m:val="1"/><m:hideBot m:val="1"/><m:hideLeft m:val="1"/><m:hideRight m:val="1"/><m:strikeBLTR m:val="1"/></m:borderBoxPr><m:e>${seq(k)}</m:e></m:borderBox>`;
      return `<m:borderBox><m:e>${seq(k)}</m:e></m:borderBox>`;
    default:
      return seq(k);
  }
}

export function mathmlToOmml(mathml, display = true) {
  const inner = seq(elements(parseXml(mathml)));
  return display ? `<m:oMathPara><m:oMathParaPr><m:jc m:val="center"/></m:oMathParaPr><m:oMath>${inner}</m:oMath></m:oMathPara>` : `<m:oMath>${inner}</m:oMath>`;
}

const text = (t) => (t ? `<w:r><w:t xml:space="preserve">${escXml(t)}</w:t></w:r>` : "");
const para = (inner) => `<w:p>${inner}</w:p>`;

/** Split one paragraph of "text with $x$ and $$y$$" into [{math, display}|{text}]. */
export function splitMixed(src) {
  const parts = [];
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]|\\\(([\s\S]+?)\\\)|(?<!\\)\$((?:\\.|[^$\\])+?)\$/g;
  let last = 0;
  for (const m of src.matchAll(re)) {
    if (m.index > last) parts.push({ text: src.slice(last, m.index) });
    const d = m[1] ?? m[2];
    parts.push({ math: (d ?? m[3] ?? m[4]).trim(), display: d !== undefined });
    last = m.index + m[0].length;
  }
  if (last < src.length) parts.push({ text: src.slice(last) });
  return parts;
}

/** document.xml body from blocks separated by blank lines. toMml(tex, display) returns { mathml } or { error }. */
export function buildDocumentXml(source, mode, toMml) {
  const errors = [];
  let count = 0;
  const mathXml = (tex, display) => {
    const { mathml, error } = toMml(tex, display);
    if (error) {
      errors.push(`${tex.slice(0, 40)}: ${error}`);
      return display ? para(text(tex)) : text(tex);
    }
    count++;
    const x = mathmlToOmml(mathml, display);
    return display ? para(x) : x;
  };
  const blocks = String(source || "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  const body = blocks
    .map((b) => {
      if (mode === "equations") return mathXml(b.replace(/^\$\$?|\$\$?$/g, "").trim(), true);
      const parts = splitMixed(b.replace(/\s*\n\s*/g, " "));
      if (parts.length === 1 && parts[0].math) return mathXml(parts[0].math, true);
      let out = "";
      let inline = "";
      for (const p of parts) {
        if (p.math && p.display) {
          if (inline) out += para(inline);
          inline = "";
          out += mathXml(p.math, true);
        } else inline += p.math ? mathXml(p.math, false) : text(p.text);
      }
      return out + (inline ? para(inline) : "");
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
  return { xml, count, errors };
}

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(b) {
  let c = 0xffffffff;
  for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function zip(files) {
  const enc = new TextEncoder();
  const chunks = [];
  const central = [];
  let offset = 0;
  const hdr = (size, fill) => {
    const a = new Uint8Array(size);
    fill(new DataView(a.buffer));
    return a;
  };
  for (const [name, content] of files) {
    const nm = enc.encode(name);
    const data = enc.encode(content);
    const crc = crc32(data);
    const common = (v, o) => {
      v.setUint16(o, 20, true);
      v.setUint16(o + 2, 0x0800, true);
      v.setUint16(o + 4, 0, true);
      v.setUint16(o + 6, 0, true);
      v.setUint16(o + 8, 0x21, true);
      v.setUint32(o + 10, crc, true);
      v.setUint32(o + 14, data.length, true);
      v.setUint32(o + 18, data.length, true);
      v.setUint16(o + 22, nm.length, true);
    };
    chunks.push(hdr(30, (v) => {
      v.setUint32(0, 0x04034b50, true);
      common(v, 4);
    }), nm, data);
    central.push(hdr(46, (v) => {
      v.setUint32(0, 0x02014b50, true);
      v.setUint16(4, 20, true);
      common(v, 6);
      v.setUint32(42, offset, true);
    }), nm);
    offset += 30 + nm.length + data.length;
  }
  const cdSize = central.reduce((s, c) => s + c.length, 0);
  const end = hdr(22, (v) => {
    v.setUint32(0, 0x06054b50, true);
    v.setUint16(8, files.length, true);
    v.setUint16(10, files.length, true);
    v.setUint32(12, cdSize, true);
    v.setUint32(16, offset, true);
  });
  const parts = [...chunks, ...central, end];
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let p = 0;
  for (const c of parts) {
    out.set(c, p);
    p += c.length;
  }
  return out;
}

/** Complete .docx bytes for a document.xml string. */
export function buildDocx(documentXml) {
  return zip([
    ["[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>'],
    ["_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
    ["word/document.xml", documentXml],
  ]);
}
