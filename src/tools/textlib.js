// Pure helpers used by the text-engine tools. No DOM access at import time.

// ---------- UTF-8 / Base64 ----------
export function utf8Bytes(str) {
  return new TextEncoder().encode(str);
}
export function bytesToB64(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
export function b64ToBytes(b64) {
  let s = b64.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (/[^A-Za-z0-9+/=]/.test(s)) {
    const bad = s.match(/[^A-Za-z0-9+/=]/)[0];
    throw new Error(`'${bad}' is not a Base64 character.`);
  }
  s = s.replace(/=+$/, "");
  if (s.length % 4 === 1) throw new Error("The input length is not valid Base64 (one character too many or too few).");
  s += "===".slice((s.length + 3) % 4);
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
export function b64url(str) {
  return bytesToB64(utf8Bytes(str)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ---------- JSON ----------
export function parseJson(text) {
  try {
    return { value: JSON.parse(text) };
  } catch (e) {
    return { error: jsonError(text, e) };
  }
}
function jsonError(text, e) {
  if (!text.trim()) return "The input is empty. Paste some JSON.";
  const found = locateJsonError(text);
  const pos = found ? found.pos : 0;
  const before = text.slice(0, pos);
  const line = before.split("\n").length;
  const col = pos - before.lastIndexOf("\n");
  const near = text.slice(pos, pos + 12).replace(/\s+/g, " ");
  let msg = found ? found.msg : String(e.message || e);
  let hint = "";
  const ch = text[pos];
  if ((ch === "}" || ch === "]") && /,\s*$/.test(before)) hint = " Remove the trailing comma before it; JSON does not allow one.";
  else if (ch === "'") hint = " JSON strings and keys need double quotes, not single quotes.";
  else if (found && found.msg.startsWith("Expected a key") && /[A-Za-z_$]/.test(ch || "")) hint = " Object keys must be wrapped in double quotes.";
  return `Line ${line}, column ${col}: ${msg}${near ? ` near "${near}"` : ""}.${hint}`;
}

/** Minimal JSON scanner that reports the index of the first syntax error. */
function locateJsonError(t) {
  let i = 0;
  const fail = (msg) => {
    throw { pos: i, msg };
  };
  const ws = () => {
    while (i < t.length && " \t\n\r".includes(t[i])) i++;
  };
  const str = () => {
    i++;
    while (i < t.length) {
      const c = t[i];
      if (c === '"') return i++;
      if (c === "\\") {
        i++;
        if (t[i] === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(t.slice(i + 1, i + 5))) fail("Invalid \\u escape");
          i += 5;
          continue;
        }
        if (!'"\\/bfnrt'.includes(t[i])) fail("Invalid escape character in string");
      } else if (c < " ") fail("Unescaped control character (such as a line break) inside a string");
      i++;
    }
    fail("Unterminated string");
  };
  const val = () => {
    ws();
    const c = t[i];
    if (c === "{") {
      i++;
      ws();
      if (t[i] === "}") return i++;
      for (;;) {
        ws();
        if (t[i] !== '"') fail("Expected a key in double quotes");
        str();
        ws();
        if (t[i] !== ":") fail("Expected ':' after the key");
        i++;
        val();
        ws();
        if (t[i] === ",") {
          i++;
          ws();
          if (t[i] === "}") fail("Unexpected '}' after a comma");
          continue;
        }
        if (t[i] === "}") return i++;
        fail("Expected ',' or '}'");
      }
    }
    if (c === "[") {
      i++;
      ws();
      if (t[i] === "]") return i++;
      for (;;) {
        val();
        ws();
        if (t[i] === ",") {
          i++;
          ws();
          if (t[i] === "]") fail("Unexpected ']' after a comma");
          continue;
        }
        if (t[i] === "]") return i++;
        fail("Expected ',' or ']'");
      }
    }
    if (c === '"') return str();
    const m = t.slice(i).match(/^(-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?|true|false|null)/);
    if (m) {
      i += m[0].length;
      return;
    }
    fail(i >= t.length ? "Unexpected end of input" : `Unexpected character '${c}'`);
  };
  try {
    val();
    ws();
    if (i < t.length) fail("Unexpected text after the end of the JSON value");
  } catch (err) {
    if (err && typeof err.pos === "number") return err;
    throw err;
  }
  return null;
}

export function sortKeysDeep(v) {
  if (Array.isArray(v)) return v.map(sortKeysDeep);
  if (v && typeof v === "object") return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeysDeep(v[k])]));
  return v;
}

export function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj ?? {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out[key] = Array.isArray(v) ? JSON.stringify(v) : v;
  }
  return out;
}

export function csvCell(v, delim = ",") {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return /["\n\r]/.test(s) || s.includes(delim) || /^\s|\s$/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** RFC 4180 CSV parser. Handles quotes, escaped quotes and newlines in quoted fields. */
export function parseCsv(text, delim = ",") {
  const rows = [];
  let row = [],
    field = "",
    q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else q = false;
      } else field += c;
    } else if (c === '"' && field === "") q = true;
    else if (c === delim) {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

export function detectDelimiter(text) {
  const first = text.split(/\r?\n/)[0] || "";
  const counts = [",", ";", "\t", "|"].map((d) => [d, first.split(d).length]);
  counts.sort((a, b) => b[1] - a[1]);
  return counts[0][1] > 1 ? counts[0][0] : ",";
}

// ---------- XML ----------
const xmlEsc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
function xmlName(k) {
  let n = String(k).replace(/[^A-Za-z0-9_.-]/g, "_");
  if (!/^[A-Za-z_]/.test(n)) n = "_" + n;
  return n;
}
export function jsonToXml(value, name = "root", indent = "  ", depth = 0) {
  const pad = indent.repeat(depth);
  if (Array.isArray(value)) return value.map((v) => jsonToXml(v, name, indent, depth)).join("\n");
  const tag = xmlName(name);
  if (value && typeof value === "object") {
    const attrs = Object.entries(value)
      .filter(([k]) => k.startsWith("@"))
      .map(([k, v]) => ` ${xmlName(k.slice(1))}="${xmlEsc(v)}"`)
      .join("");
    const kids = Object.entries(value).filter(([k]) => !k.startsWith("@"));
    if (kids.length === 1 && kids[0][0] === "#text") return `${pad}<${tag}${attrs}>${xmlEsc(kids[0][1])}</${tag}>`;
    if (!kids.length) return `${pad}<${tag}${attrs}/>`;
    const inner = kids.map(([k, v]) => jsonToXml(v, k, indent, depth + 1)).join("\n");
    return `${pad}<${tag}${attrs}>\n${inner}\n${pad}</${tag}>`;
  }
  if (value === null) return `${pad}<${tag}/>`;
  return `${pad}<${tag}>${xmlEsc(value)}</${tag}>`;
}
export function xmlNodeToJson(node) {
  const obj = {};
  for (const a of node.attributes || []) obj["@" + a.name] = a.value;
  const children = [...node.childNodes];
  const elements = children.filter((c) => c.nodeType === 1);
  const text = children
    .filter((c) => c.nodeType === 3 || c.nodeType === 4)
    .map((c) => c.nodeValue)
    .join("")
    .trim();
  if (!elements.length) {
    if (!Object.keys(obj).length) return coerce(text);
    if (text) obj["#text"] = coerce(text);
    return obj;
  }
  for (const el of elements) {
    const v = xmlNodeToJson(el);
    if (el.nodeName in obj) {
      if (!Array.isArray(obj[el.nodeName])) obj[el.nodeName] = [obj[el.nodeName]];
      obj[el.nodeName].push(v);
    } else obj[el.nodeName] = v;
  }
  if (text) obj["#text"] = text;
  return obj;
}
function coerce(s) {
  if (s === "") return "";
  if (s === "true") return true;
  if (s === "false") return false;
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(s) && s.length < 16) return Number(s);
  return s;
}

// ---------- JSON -> TypeScript ----------
export function jsonToTs(value, rootName = "Root") {
  const interfaces = [];
  const seen = new Map();
  const pascal = (s) =>
    (String(s).replace(/[^A-Za-z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^./, (c) => c.toUpperCase()) || "Item").replace(/^(\d)/, "_$1");
  function typeOf(v, name) {
    if (v === null) return "null";
    if (Array.isArray(v)) {
      if (!v.length) return "unknown[]";
      const objs = v.filter((x) => x && typeof x === "object" && !Array.isArray(x));
      const others = [...new Set(v.filter((x) => !(x && typeof x === "object" && !Array.isArray(x))).map((x) => typeOf(x, name)))];
      const parts = [...others];
      if (objs.length) parts.push(objectType(objs, singular(name)));
      const t = parts.length === 1 ? parts[0] : `(${parts.join(" | ")})`;
      return `${t}[]`;
    }
    if (typeof v === "object") return objectType([v], name);
    return typeof v;
  }
  function objectType(objs, name) {
    const keys = [...new Set(objs.flatMap((o) => Object.keys(o)))];
    const fields = keys.map((k) => {
      const present = objs.filter((o) => k in o);
      const types = [...new Set(present.map((o) => typeOf(o[k], k)))];
      const optional = present.length < objs.length;
      const key = /^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k);
      return `  ${key}${optional ? "?" : ""}: ${types.join(" | ")};`;
    });
    const body = fields.join("\n");
    if (seen.has(body)) return seen.get(body);
    let iname = pascal(name);
    while (interfaces.some((i) => i.name === iname)) iname += "2";
    seen.set(body, iname);
    interfaces.push({ name: iname, body });
    return iname;
  }
  const top = typeOf(value, rootName);
  const out = interfaces
    .reverse()
    .map((i) => `export interface ${i.name} {\n${i.body}\n}`)
    .join("\n\n");
  return interfaces.some((i) => i.name === pascal(rootName)) ? out : `${out}${out ? "\n\n" : ""}export type ${pascal(rootName)} = ${top};`;
}
function singular(s) {
  s = String(s);
  if (/ies$/.test(s)) return s.slice(0, -3) + "y";
  if (/s$/.test(s) && !/ss$/.test(s)) return s.slice(0, -1);
  return s + "Item";
}

// ---------- JSON diff ----------
export function diffJson(a, b, path = "$", out = []) {
  const ta = kind(a),
    tb = kind(b);
  if (ta !== tb) {
    out.push([path, "changed", show(a), show(b)]);
    return out;
  }
  if (ta === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const p = /^[A-Za-z_$][\w$]*$/.test(k) ? `${path}.${k}` : `${path}[${JSON.stringify(k)}]`;
      if (!(k in b)) out.push([p, "removed", show(a[k]), ""]);
      else if (!(k in a)) out.push([p, "added", "", show(b[k])]);
      else diffJson(a[k], b[k], p, out);
    }
  } else if (ta === "array") {
    const n = Math.max(a.length, b.length);
    for (let i = 0; i < n; i++) {
      const p = `${path}[${i}]`;
      if (i >= b.length) out.push([p, "removed", show(a[i]), ""]);
      else if (i >= a.length) out.push([p, "added", "", show(b[i])]);
      else diffJson(a[i], b[i], p, out);
    }
  } else if (a !== b) out.push([path, "changed", show(a), show(b)]);
  return out;
}
const kind = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v);
const show = (v) => {
  const s = JSON.stringify(v);
  return s && s.length > 80 ? s.slice(0, 77) + "…" : s;
};

// ---------- CSS ----------
function protect(src, re) {
  const saved = [];
  const out = src.replace(re, (m) => {
    saved.push(m);
    return `\u0000${saved.length - 1}\u0000`;
  });
  return { out, restore: (s) => s.replace(/\u0000(\d+)\u0000/g, (_, i) => saved[+i]) };
}
export function minifyCss(css) {
  const p = protect(css, /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*![\s\S]*?\*\//g);
  let s = p.out.replace(/\/\*[\s\S]*?\*\//g, "");
  s = s
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,>])\s*/g, "$1")
    .replace(/:\s+/g, ":")
    .replace(/;}/g, "}")
    .trim();
  return p.restore(s);
}
export function beautifyCss(css, indent = "  ") {
  const p = protect(minifyCss(css), /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\*[\s\S]*?\*\//g);
  let depth = 0,
    out = "",
    line = "";
  const flush = () => {
    const decl = line.trim().replace(/^([^:]+):\s*/, "$1: ");
    if (decl) out += indent.repeat(depth) + decl + "\n";
    line = "";
  };
  for (const ch of p.out) {
    if (ch === "{") {
      out += indent.repeat(depth) + line.trim().replace(/,(?!\s)/g, ", ").replace(/([^\s])$/, "$1") + " {\n";
      line = "";
      depth++;
    } else if (ch === "}") {
      flush();
      depth = Math.max(0, depth - 1);
      out += indent.repeat(depth) + "}\n";
      if (depth === 0) out += "\n";
    } else if (ch === ";") {
      line += ";";
      flush();
    } else line += ch;
  }
  flush();
  return p.restore(out.trim());
}

// ---------- HTML ----------
const BLOCK =
  "html|head|body|title|meta|link|script|style|div|p|ul|ol|li|table|thead|tbody|tfoot|tr|td|th|section|article|aside|header|footer|nav|main|h[1-6]|form|fieldset|figure|figcaption|br|hr|img|picture|source|svg|blockquote|dl|dt|dd|option|select|label|input|button|textarea|pre|noscript|template";
export function minifyHtml(html) {
  const p = protect(html, /<(pre|textarea|script|style)\b[\s\S]*?<\/\1>|<!--\[if[\s\S]*?<!\[endif\]-->/gi);
  let s = p.out.replace(/<!--[\s\S]*?-->/g, "");
  s = s.replace(/\s+/g, " ");
  const re = new RegExp(`\\s*(</?(?:${BLOCK})\\b[^>]*>)\\s*`, "gi");
  s = s.replace(re, "$1").replace(/\s*(\u0000\d+\u0000)\s*/g, "$1");
  return p.restore(s.trim());
}

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0", copy: "©", reg: "®", trade: "™", hellip: "…", mdash: "—", ndash: "–", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", euro: "€", pound: "£", yen: "¥", cent: "¢", deg: "°", times: "×", divide: "÷", middot: "·", bull: "•", laquo: "«", raquo: "»", para: "¶", sect: "§" };
export function escapeHtml(s, nonAscii = false) {
  let out = s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  if (nonAscii) out = out.replace(/[^\x00-\x7f]/gu, (c) => `&#${c.codePointAt(0)};`);
  return out;
}
export function unescapeHtml(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+\d*);/gi, (m, e) => {
    if (e[0] === "#") {
      const cp = e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(cp) && cp <= 0x10ffff ? String.fromCodePoint(cp) : m;
    }
    return NAMED[e.toLowerCase()] ?? m;
  });
}

// ---------- MD5 (RFC 1321) ----------
export function md5(bytes) {
  const K = new Int32Array(64);
  for (let i = 0; i < 64; i++) K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) | 0;
  const S = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, 16, 23, 6, 10, 15, 21];
  const len = bytes.length;
  const nBlocks = ((len + 8) >>> 6) + 1;
  const words = new Int32Array(nBlocks * 16);
  for (let i = 0; i < len; i++) words[i >> 2] |= bytes[i] << ((i % 4) * 8);
  words[len >> 2] |= 0x80 << ((len % 4) * 8);
  words[nBlocks * 16 - 2] = (len * 8) | 0;
  words[nBlocks * 16 - 1] = Math.floor(len / 0x20000000);
  let a0 = 0x67452301,
    b0 = 0xefcdab89 | 0,
    c0 = 0x98badcfe | 0,
    d0 = 0x10325476;
  for (let blk = 0; blk < nBlocks; blk++) {
    let A = a0,
      B = b0,
      C = c0,
      D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) {
        F = (B & C) | (~B & D);
        g = i;
      } else if (i < 32) {
        F = (D & B) | (~D & C);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        F = B ^ C ^ D;
        g = (3 * i + 5) % 16;
      } else {
        F = C ^ (B | ~D);
        g = (7 * i) % 16;
      }
      const tmp = D;
      D = C;
      C = B;
      const x = (A + F + K[i] + words[blk * 16 + g]) | 0;
      const s = S[(i >> 4) * 4 + (i % 4)];
      B = (B + ((x << s) | (x >>> (32 - s)))) | 0;
      A = tmp;
    }
    a0 = (a0 + A) | 0;
    b0 = (b0 + B) | 0;
    c0 = (c0 + C) | 0;
    d0 = (d0 + D) | 0;
  }
  const out = new Uint8Array(16);
  [a0, b0, c0, d0].forEach((w, i) => {
    for (let j = 0; j < 4; j++) out[i * 4 + j] = (w >>> (j * 8)) & 255;
  });
  return out;
}
export const hex = (bytes) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");

// ---------- secure random ----------
export function randInt(max) {
  // Unbiased integer in [0, max) using rejection sampling.
  const lim = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  do crypto.getRandomValues(buf);
  while (buf[0] >= lim);
  return buf[0] % max;
}

// ---------- seeded PRNG for deterministic sample output ----------
export function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- text stats ----------
export function wordList(text) {
  return text.match(/[\p{L}\p{N}\p{M}]+(?:['’-][\p{L}\p{N}\p{M}]+)*/gu) || [];
}
export function graphemes(text) {
  if (typeof Intl !== "undefined" && Intl.Segmenter) return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].length;
  return [...text].length;
}

export const STOP = new Set(
  "a about above after again against all am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself yourselves also may might must shall us via per etc".split(" ")
);
