// Text-engine tools: input text (+ options) -> output. `run` may return a promise.
// Result keys: output, outputs[{label,value}], stats[{label,value,warn}], table{cols,rows},
// html (rendered in a sandboxed frame), highlight (pre-escaped HTML), error, info, download{name,mime,bom}.
import {
  utf8Bytes, bytesToB64, b64ToBytes, b64url, parseJson, sortKeysDeep, flatten, csvCell, parseCsv, detectDelimiter,
  jsonToXml, xmlNodeToJson, jsonToTs, diffJson, minifyCss, beautifyCss, minifyHtml, escapeHtml, unescapeHtml,
  md5, hex, randInt, mulberry32, wordList, graphemes, STOP,
} from "./textlib.js";
import { WORDS } from "./words.js";
import { EXTRA_TEXTS } from "./texts-extra.js";

const sel = (id, label, def, options) => ({ id, label, type: "select", def, options });
const tog = (id, label, def = false) => ({ id, label, type: "toggle", def });
const numo = (id, label, def, min, max) => ({ id, label, type: "number", def, min, max });
const txt = (id, label, def = "", placeholder = "") => ({ id, label, type: "text", def, placeholder });

const lines = (s) => s.split(/\r?\n/);
const size = (s) => utf8Bytes(s).length;
const kb = (n) => (n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`);
const fmtN = (n) => new Intl.NumberFormat("en-IN").format(n);

const SAMPLE_JSON = `{"order":{"id":"ORD-20931","placedAt":"2026-10-14T09:42:00+05:30","customer":{"name":"Asha Verma","city":"Pune"},"items":[{"sku":"TEA-250","name":"Assam tea, 250 g","qty":2,"price":180},{"sku":"MUG-01","name":"Steel mug","qty":1,"price":349}],"paid":true,"coupon":null}}`;
const SAMPLE_ARRAY = `[
  {"name": "Asha Verma", "city": "Pune", "orders": 4, "address": {"pin": "411001"}},
  {"name": "Rohan Iyer", "city": "Chennai", "orders": 1, "address": {"pin": "600004"}},
  {"name": "Meera Shah", "city": "Ahmedabad", "orders": 7, "address": {"pin": "380009"}}
]`;
const SAMPLE_PROSE = `Compound interest is interest on interest. When you leave the returns from an investment invested, next year's returns are calculated on a larger amount. Over long periods, compound interest does most of the work, which is why starting early matters more than starting big.

A ₹10,000 monthly SIP for 20 years at 12% grows to about ₹99.9 lakh, of which only ₹24 lakh is your own money.`;

const titleSmall = new Set("a an and as at but by for in nor of on or per the to vs via".split(" "));
function words2(s) {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);
}

// ---------- fancy text ----------
function mapRange(s, upper, lower, digits, exceptions = {}) {
  return [...s]
    .map((ch) => {
      if (exceptions[ch]) return exceptions[ch];
      const c = ch.charCodeAt(0);
      if (upper && c >= 65 && c <= 90) return String.fromCodePoint(upper + c - 65);
      if (lower && c >= 97 && c <= 122) return String.fromCodePoint(lower + c - 97);
      if (digits && c >= 48 && c <= 57) return String.fromCodePoint(digits + c - 48);
      return ch;
    })
    .join("");
}
const FANCY = [
  ["Bold", (s) => mapRange(s, 0x1d400, 0x1d41a, 0x1d7ce)],
  ["Italic", (s) => mapRange(s, 0x1d434, 0x1d44e, 0, { h: "ℎ" })],
  ["Bold italic", (s) => mapRange(s, 0x1d468, 0x1d482)],
  ["Script", (s) => mapRange(s, 0x1d49c, 0x1d4b6, 0, { B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ", e: "ℯ", g: "ℊ", o: "ℴ" })],
  ["Bold script", (s) => mapRange(s, 0x1d4d0, 0x1d4ea)],
  ["Gothic", (s) => mapRange(s, 0x1d504, 0x1d51e, 0, { C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ" })],
  ["Double-struck", (s) => mapRange(s, 0x1d538, 0x1d552, 0x1d7d8, { C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ" })],
  ["Sans bold", (s) => mapRange(s, 0x1d5d4, 0x1d5ee, 0x1d7ec)],
  ["Sans italic", (s) => mapRange(s, 0x1d608, 0x1d622)],
  ["Monospace", (s) => mapRange(s, 0x1d670, 0x1d68a, 0x1d7f6)],
  ["Bubble", (s) => mapRange(s, 0x24b6, 0x24d0, 0, { 0: "⓪", ...Object.fromEntries([..."123456789"].map((d, i) => [d, String.fromCodePoint(0x2460 + i)])) })],
  ["Squares", (s) => mapRange(s.toUpperCase(), 0x1f130, 0)],
  ["Wide", (s) => [...s].map((c) => (c === " " ? "　" : c.charCodeAt(0) >= 33 && c.charCodeAt(0) <= 126 ? String.fromCharCode(c.charCodeAt(0) + 0xfee0) : c)).join("")],
  ["Small caps", (s) => [...s.toLowerCase()].map((c) => "ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ"["abcdefghijklmnopqrstuvwxyz".indexOf(c)] || c).join("")],
  ["Strikethrough", (s) => [...s].map((c) => (c === " " ? c : c + "̶")).join("")],
  ["Underline", (s) => [...s].map((c) => c + "̲").join("")],
  ["Upside down", (s) => [...s].reverse().map((c) => "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀ꓭƆꓷƎℲ⅁HIſꓘ⅂WNOԀΌꓤS⊥∩ΛMX⅄Z0ƖᄅƐㄣϛ9ㄥ86"["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(c)] || ({ ".": "˙", ",": "'", "?": "¿", "!": "¡", "'": ",", "(": ")", ")": "(" }[c] ?? c)).join("")],
];

// ---------- lorem ----------
const LOREM = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

// ---------- password checks ----------
const COMMON = new Set(
  "123456 password 123456789 12345678 12345 qwerty 1234567 111111 123123 abc123 password1 1234567890 iloveyou 000000 qwerty123 admin welcome monkey dragon letmein 654321 sunshine princess football baseball master shadow superman 1q2w3e4r qwertyuiop 123321 666666 121212 starwars login passw0rd trustno1 hello india india123 krishna sairam omsairam ganesh 7777777 987654321 asdfgh zxcvbnm".split(" ")
);
function strength(pw) {
  if (!pw) return null;
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 33;
  let bits = [...pw].length * Math.log2(Math.max(pool, 1));
  const warnings = [];
  const lower = pw.toLowerCase();
  const unleet = (x) => x.replace(/[@4]/g, "a").replace(/3/g, "e").replace(/[1!|]/g, "i").replace(/0/g, "o").replace(/[$5]/g, "s").replace(/7/g, "t");
  const core = lower.replace(/[\d\W_]+$/, "").replace(/^[\d\W_]+/, "");
  const affix = lower.length - core.length;
  if ([lower, unleet(lower), core, unleet(core)].some((x) => COMMON.has(x))) {
    bits = Math.min(bits, 10 + affix * 3.3);
    warnings.push("This is one of the most common passwords, or a simple variation of one.");
  }
  if (/(.)\1{2,}/.test(pw)) {
    bits -= 8;
    warnings.push("Repeated characters (like 'aaa') add little strength.");
  }
  const seqs = ["abcdefghijklmnopqrstuvwxyz", "0123456789", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
  if (seqs.some((s) => [...Array(s.length - 3)].some((_, i) => lower.includes(s.slice(i, i + 4)) || lower.includes([...s.slice(i, i + 4)].reverse().join(""))))) {
    bits -= 12;
    warnings.push("Contains a keyboard or alphabet sequence.");
  }
  if (/(19|20)\d{2}/.test(pw)) {
    bits -= 6;
    warnings.push("Contains what looks like a year; years are among the first things attackers try.");
  }
  if (unleet(core) !== core && /^[a-z]+$/.test(unleet(core))) {
    bits -= 6;
    warnings.push("Swapping letters for look-alike symbols (a→@, o→0) is predictable.");
  }
  const phrase = lower.match(/^[a-z]{3,}(?:[\W_\d]+[a-z]{3,}){2,}[\W_\d]*$/);
  if (phrase) bits = Math.min(bits, lower.split(/[\W_\d]+/).filter(Boolean).length * 13);
  if ([...pw].length < 12) warnings.push("Use at least 12 characters; 16 or more is better.");
  bits = Math.max(0, bits);
  return { bits, warnings };
}
function crackTime(bits, perSec) {
  const secs = Math.pow(2, bits) / 2 / perSec;
  if (secs < 1) return "instantly";
  const units = [
    ["second", 60],
    ["minute", 60],
    ["hour", 24],
    ["day", 365],
    ["year", 1000],
    ["thousand years", 1000],
    ["million years", 1000],
  ];
  let v = secs;
  for (const [u, k] of units) {
    if (v < k) return `about ${Math.round(v)} ${u}${Math.round(v) === 1 || u.includes(" ") ? "" : "s"}`;
    v /= k;
  }
  return "longer than a billion years";
}

// ---------- uuid ----------
function uuid4() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  return fmtUuid(b);
}
function uuid7() {
  const b = crypto.getRandomValues(new Uint8Array(16));
  const ts = Date.now();
  for (let i = 0; i < 6; i++) b[i] = Math.floor(ts / 2 ** (8 * (5 - i))) & 0xff;
  b[6] = (b[6] & 0x0f) | 0x70;
  b[8] = (b[8] & 0x3f) | 0x80;
  return fmtUuid(b);
}
function fmtUuid(b) {
  const h = hex(b);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

// ---------- JWT sample ----------
const SAMPLE_JWT = `${b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }))}.${b64url(
  JSON.stringify({ sub: "user_8231", name: "Asha Verma", role: "editor", iat: 1767225600, exp: 1798761600 })
)}.4oHf2c5f0b3Wn8yVd6qJm1sQh0n3m3yJ8Xz1q2r3s4t`;

function istString(ms) {
  return new Date(ms).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "medium" }) + " IST";
}
function relative(ms) {
  const d = (ms - Date.now()) / 1000;
  const abs = Math.abs(d);
  const [v, u] = abs < 90 ? [abs, "second"] : abs < 5400 ? [abs / 60, "minute"] : abs < 129600 ? [abs / 3600, "hour"] : abs < 5184000 ? [abs / 86400, "day"] : abs < 63072000 ? [abs / 2592000, "month"] : [abs / 31536000, "year"];
  const n = Math.round(v);
  const s = `${n} ${u}${n === 1 ? "" : "s"}`;
  return d < 0 ? `${s} ago` : `in ${s}`;
}

async function shaAll(text, key, encoding) {
  const enc = (buf) => (encoding === "base64" ? bytesToB64(new Uint8Array(buf)) : hex(new Uint8Array(buf)));
  const data = utf8Bytes(text);
  const algos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
  const out = [];
  for (const a of algos) out.push({ label: a, value: enc(await crypto.subtle.digest(a, data)) });
  if (key) {
    for (const a of ["SHA-256", "SHA-512"]) {
      const k = await crypto.subtle.importKey("raw", utf8Bytes(key), { name: "HMAC", hash: a }, false, ["sign"]);
      out.push({ label: `HMAC-${a}`, value: enc(await crypto.subtle.sign("HMAC", k, data)) });
    }
  }
  return out;
}

export const TEXTS = {
  // ================= text =================
  "word-counter": {
    sample: SAMPLE_PROSE,
    options: [],
    run: (t) => {
      const words = wordList(t);
      const sentences = (t.match(/[^.!?।]+[.!?।]+/g) || []).length || (t.trim() ? 1 : 0);
      const paras = t.split(/\n\s*\n/).filter((p) => p.trim()).length;
      const longest = words.reduce((a, w) => (w.length > a.length ? w : a), "");
      return {
        stats: [
          { label: "Words", value: fmtN(words.length) },
          { label: "Characters", value: fmtN(graphemes(t)) },
          { label: "Without spaces", value: fmtN(graphemes(t.replace(/\s/g, ""))) },
          { label: "Sentences", value: fmtN(sentences) },
          { label: "Paragraphs", value: fmtN(paras) },
          { label: "Reading time", value: mins(words.length / 230) },
          { label: "Speaking time", value: mins(words.length / 140) },
          { label: "Longest word", value: longest || "—" },
        ],
      };
    },
  },
  "character-counter": {
    sample: "Free EMI, SIP and income tax calculators for FY 2026-27. No sign-up, works on any phone. 🇮🇳",
    options: [],
    run: (t) => {
      const n = graphemes(t);
      const lim = [
        ["X (Twitter) post", 280],
        ["SMS (one part)", /^[\x00-\x7f]*$/.test(t) ? 160 : 70],
        ["Meta title", 60],
        ["Meta description", 160],
        ["Instagram caption", 2200],
        ["YouTube title", 100],
      ];
      return {
        stats: [
          { label: "Characters", value: fmtN(n) },
          { label: "Without spaces", value: fmtN(graphemes(t.replace(/\s/g, ""))) },
          { label: "Words", value: fmtN(wordList(t).length) },
          { label: "Lines", value: fmtN(t ? lines(t).length : 0) },
          { label: "Bytes (UTF-8)", value: fmtN(size(t)) },
        ],
        table: { cols: ["Where", "Limit", "Left"], rows: lim.map(([l, m]) => [l, fmtN(m), m - n >= 0 ? fmtN(m - n) : `${fmtN(n - m)} over`]) },
      };
    },
  },
  "case-converter": {
    sample: "how to calculate EMI on a home loan in india",
    options: [],
    run: (t) => {
      const w = words2(t);
      const title = t.toLowerCase().replace(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu, (m, i) => (i > 0 && titleSmall.has(m) ? m : m[0].toUpperCase() + m.slice(1)));
      return {
        outputs: [
          { label: "Sentence case", value: t.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (m, a, b) => a + b.toUpperCase()) },
          { label: "Title Case", value: title },
          { label: "UPPERCASE", value: t.toUpperCase() },
          { label: "lowercase", value: t.toLowerCase() },
          { label: "Capitalize Each Word", value: t.toLowerCase().replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toUpperCase()) },
          { label: "aLtErNaTiNg", value: [...t].map((c, i) => (i % 2 ? c.toUpperCase() : c.toLowerCase())).join("") },
          { label: "camelCase", value: w.map((x, i) => (i ? x[0].toUpperCase() + x.slice(1).toLowerCase() : x.toLowerCase())).join("") },
          { label: "PascalCase", value: w.map((x) => x[0].toUpperCase() + x.slice(1).toLowerCase()).join("") },
          { label: "snake_case", value: w.map((x) => x.toLowerCase()).join("_") },
          { label: "kebab-case", value: w.map((x) => x.toLowerCase()).join("-") },
          { label: "CONSTANT_CASE", value: w.map((x) => x.toUpperCase()).join("_") },
        ],
      };
    },
  },
  "slug-generator": {
    sample: "10 Best SIP Plans for 2026: Returns, Risks & How to Choose\nHow to Calculate Income Tax (New Regime) — Step by Step",
    options: [sel("sep", "Separator", "-", [["-", "Hyphen -"], ["_", "Underscore _"]]), tog("stop", "Remove stop words", false), numo("max", "Max length (0 = none)", 60, 0, 200)],
    run: (t, o) =>
      ({
        output: lines(t)
          .map((l) => {
            let w = l
              .normalize("NFKD")
              .replace(/[̀-ͯ]/g, "")
              .toLowerCase()
              .replace(/&/g, " and ")
              .split(/[^\p{L}\p{N}]+/u)
              .filter(Boolean);
            if (o.stop) w = w.filter((x) => !STOP.has(x));
            let s = w.join(o.sep);
            if (o.max > 0 && s.length > o.max) s = s.slice(0, o.max).replace(new RegExp(`\\${o.sep}[^\\${o.sep}]*$`), "");
            return s;
          })
          .join("\n"),
      }),
  },
  "duplicate-line-remover": {
    sample: "asha@example.com\nrohan@example.com\nAsha@example.com\nmeera@example.com\nrohan@example.com\n  meera@example.com",
    options: [tog("ci", "Ignore case", true), tog("trim", "Ignore leading/trailing spaces", true), tog("blank", "Remove blank lines too", true)],
    run: (t, o) => {
      const seen = new Set();
      const all = lines(t);
      const out = all.filter((l) => {
        if (o.blank && !l.trim()) return false;
        let k = o.trim ? l.trim() : l;
        if (o.ci) k = k.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      return { output: out.join("\n"), info: `${all.length - out.length} line(s) removed, ${out.length} kept.` };
    },
  },
  "remove-empty-lines": {
    sample: "First paragraph line one.\n\n\n\nSecond paragraph.\n   \n\nThird paragraph.\n",
    options: [sel("mode", "Mode", "all", [["all", "Remove all empty lines"], ["collapse", "Collapse to one"]])],
    run: (t, o) => {
      const out = o.mode === "all" ? lines(t).filter((l) => l.trim()).join("\n") : t.replace(/(\r?\n[ \t]*){3,}/g, "\n\n").replace(/^\s+|\s+$/g, "");
      return { output: out, info: `${lines(t).length - lines(out).length} line(s) removed.` };
    },
  },
  "sort-lines-az": {
    sample: "Pune\nchennai\nAhmedabad\nBengaluru\nDelhi\nHyderabad\nkolkata\nMumbai",
    options: [
      sel("order", "Order", "az", [["az", "A → Z"], ["za", "Z → A"], ["len", "Shortest first"], ["lenr", "Longest first"], ["rev", "Reverse order"], ["shuf", "Shuffle"]]),
      tog("ci", "Ignore case", true),
      tog("nat", "Natural number order", true),
    ],
    run: (t, o) => {
      const l = lines(t);
      const coll = new Intl.Collator("en", { sensitivity: o.ci ? "base" : "variant", numeric: o.nat, caseFirst: "upper" });
      let out;
      if (o.order === "az") out = [...l].sort(coll.compare);
      else if (o.order === "za") out = [...l].sort(coll.compare).reverse();
      else if (o.order === "len") out = [...l].sort((a, b) => a.length - b.length || coll.compare(a, b));
      else if (o.order === "lenr") out = [...l].sort((a, b) => b.length - a.length || coll.compare(a, b));
      else if (o.order === "rev") out = [...l].reverse();
      else {
        out = [...l];
        for (let i = out.length - 1; i > 0; i--) {
          const j = o._ssr ? i : randInt(i + 1);
          [out[i], out[j]] = [out[j], out[i]];
        }
      }
      return { output: out.join("\n") };
    },
  },
  "number-lines": {
    sample: "Open the EMI calculator.\nEnter the loan amount.\n\nSet the interest rate and tenure.\nRead the schedule.",
    options: [
      sel("mode", "Mode", "add", [["add", "Add numbers"], ["remove", "Remove numbers"]]),
      numo("start", "Start at", 1, -1e6, 1e6),
      sel("sep", "Separator", ". ", [[". ", "1. "], [") ", "1) "], [": ", "1: "], ["\t", "1 + tab"], [" ", "1 + space"]]),
      tog("skip", "Skip blank lines", false),
      tog("pad", "Pad with zeros", false),
    ],
    run: (t, o) => {
      const l = lines(t);
      if (o.mode === "remove") return { output: l.map((x) => x.replace(/^\s*\d+[.):\t ]\s?/, "")).join("\n") };
      let n = Number(o.start) || 0;
      const total = l.filter((x) => !o.skip || x.trim()).length;
      const width = String(n + total - 1).length;
      return { output: l.map((x) => (o.skip && !x.trim() ? x : `${o.pad ? String(n++).padStart(width, "0") : n++}${o.sep}${x}`)).join("\n") };
    },
  },
  "trim-text": {
    sample: "   Name:\t\tAsha   Verma   \n  City:   Pune  \n\n\tPIN:  411001   ",
    options: [tog("lines", "Trim each line", true), tog("collapse", "Collapse repeated spaces", true), tog("tabs", "Convert tabs to spaces", true), tog("blank", "Remove blank lines", false)],
    run: (t, o) => {
      let l = lines(t.replace(/ /g, " "));
      if (o.tabs) l = l.map((x) => x.replace(/\t/g, " "));
      if (o.collapse) l = l.map((x) => x.replace(/ {2,}/g, " "));
      if (o.lines) l = l.map((x) => x.trim());
      if (o.blank) l = l.filter((x) => x.trim());
      const out = l.join("\n");
      return { output: out, info: `${t.length - out.length} character(s) removed.` };
    },
  },
  "lorem-ipsum-generator": {
    noInput: true,
    options: [numo("count", "How many", 3, 1, 100), sel("unit", "Of", "p", [["p", "Paragraphs"], ["s", "Sentences"], ["w", "Words"]]), tog("lorem", "Start with 'Lorem ipsum…'", true), tog("html", "Wrap in <p> tags", false)],
    run: (_, o) => {
      const rnd = mulberry32(o._seed || 7);
      const pick = () => LOREM[Math.floor(rnd() * LOREM.length)];
      const sentence = () => {
        const n = 6 + Math.floor(rnd() * 10);
        const w = Array.from({ length: n }, pick);
        if (rnd() < 0.4) w[Math.floor(n / 2)] += ",";
        const s = w.join(" ");
        return s[0].toUpperCase() + s.slice(1) + ".";
      };
      const para = () => Array.from({ length: 4 + Math.floor(rnd() * 4) }, sentence).join(" ");
      const count = Math.min(Math.max(1, o.count | 0), 100);
      let parts;
      if (o.unit === "w") parts = [Array.from({ length: count }, pick).join(" ")];
      else if (o.unit === "s") parts = [Array.from({ length: count }, sentence).join(" ")];
      else parts = Array.from({ length: count }, para);
      if (o.lorem) parts[0] = "Lorem ipsum dolor sit amet, " + parts[0].replace(/^\S+\s\S+\s?/, "").replace(/^./, (c) => c.toLowerCase());
      if (o.unit === "w") parts[0] = parts[0].split(" ").slice(0, count).join(" ");
      return { output: o.html ? parts.map((p) => `<p>${p}</p>`).join("\n") : parts.join("\n\n") };
    },
  },
  "fancy-text-generator": {
    sample: "Asha Verma 2026",
    inputType: "line",
    options: [],
    run: (t) => ({ outputs: FANCY.map(([label, f]) => ({ label, value: f(t) })) }),
  },
  "keyword-density-checker": {
    sample: SAMPLE_PROSE,
    options: [tog("stop", "Ignore stop words", true), numo("min", "Minimum word length", 3, 1, 20)],
    run: (t, o) => {
      const w = wordList(t.toLowerCase());
      if (!w.length) return { info: "Paste some text to analyse." };
      const count = (n) => {
        const m = new Map();
        for (let i = 0; i + n <= w.length; i++) {
          const g = w.slice(i, i + n);
          if (n === 1 && ((o.stop && STOP.has(g[0])) || g[0].length < o.min)) continue;
          if (n > 1 && o.stop && (STOP.has(g[0]) || STOP.has(g[n - 1]))) continue;
          const k = g.join(" ");
          m.set(k, (m.get(k) || 0) + 1);
        }
        return [...m].filter(([, c]) => n === 1 || c > 1).sort((a, b) => b[1] - a[1]).slice(0, n === 1 ? 15 : 8);
      };
      const rows = [1, 2, 3].flatMap((n) => count(n).map(([k, c]) => [k, `${n}-word`, c, `${((c * n * 100) / w.length).toFixed(2)}%`]));
      return { stats: [{ label: "Total words", value: fmtN(w.length) }, { label: "Unique words", value: fmtN(new Set(w).size) }], table: { cols: ["Keyword", "Type", "Count", "Density"], rows } };
    },
  },

  // ================= developer =================
  "json-formatter": {
    sample: SAMPLE_JSON,
    options: [sel("indent", "Indent", "2", [["2", "2 spaces"], ["4", "4 spaces"], ["tab", "Tab"]]), tog("sort", "Sort keys", false)],
    outputLang: "json",
    run: (t, o) => {
      const r = parseJson(t);
      if (r.error) return { error: r.error };
      const v = o.sort ? sortKeysDeep(r.value) : r.value;
      return { output: JSON.stringify(v, null, o.indent === "tab" ? "\t" : Number(o.indent)), download: { name: "formatted.json", mime: "application/json" } };
    },
  },
  "json-validator": {
    sample: `{\n  "name": "Asha",\n  "skills": ["SQL", "Excel",],\n  "active": true\n}`,
    options: [],
    run: (t) => {
      const r = parseJson(t);
      if (r.error) return { error: r.error };
      const depth = (v) => (v && typeof v === "object" ? 1 + Math.max(0, ...Object.values(v).map(depth)) : 0);
      const type = Array.isArray(r.value) ? `array of ${r.value.length} item(s)` : r.value === null ? "null" : typeof r.value === "object" ? `object with ${Object.keys(r.value).length} key(s)` : typeof r.value;
      return { info: "Valid JSON.", stats: [{ label: "Top level", value: type }, { label: "Nesting depth", value: depth(r.value) }, { label: "Size", value: kb(size(t)) }] };
    },
  },
  "json-minifier": {
    sample: JSON.stringify(JSON.parse(SAMPLE_JSON), null, 2),
    options: [],
    outputLang: "json",
    run: (t) => {
      const r = parseJson(t);
      if (r.error) return { error: r.error };
      const out = JSON.stringify(r.value);
      const a = size(t),
        b = size(out);
      return { output: out, info: `${kb(a)} → ${kb(b)} (${a ? Math.round((1 - b / a) * 100) : 0}% smaller)`, download: { name: "minified.json", mime: "application/json" } };
    },
  },
  "json-to-csv": {
    sample: SAMPLE_ARRAY,
    options: [sel("delim", "Delimiter", ",", [[",", "Comma"], [";", "Semicolon"], ["\t", "Tab"]])],
    run: (t, o) => {
      const r = parseJson(t);
      if (r.error) return { error: r.error };
      let arr = Array.isArray(r.value) ? r.value : [r.value];
      if (!arr.length) return { info: "The array is empty." };
      arr = arr.map((x) => (x && typeof x === "object" && !Array.isArray(x) ? flatten(x) : { value: Array.isArray(x) ? JSON.stringify(x) : x }));
      const cols = [...new Set(arr.flatMap((x) => Object.keys(x)))];
      const out = [cols.map((c) => csvCell(c, o.delim)).join(o.delim), ...arr.map((x) => cols.map((c) => csvCell(x[c], o.delim)).join(o.delim))].join("\r\n");
      return { output: out, info: `${arr.length} row(s), ${cols.length} column(s).`, download: { name: "data.csv", mime: "text/csv", bom: true } };
    },
  },
  "csv-to-json": {
    sample: `name,city,orders,note\nAsha Verma,Pune,4,"Prefers ""express"" delivery"\nRohan Iyer,Chennai,1,\n"Shah, Meera",Ahmedabad,7,"Two lines\nof notes"`,
    options: [sel("delim", "Delimiter", "auto", [["auto", "Detect"], [",", "Comma"], [";", "Semicolon"], ["\t", "Tab"], ["|", "Pipe"]]), tog("header", "First row is header", true), tog("nums", "Detect numbers", true)],
    outputLang: "json",
    run: (t, o) => {
      const d = o.delim === "auto" ? detectDelimiter(t) : o.delim;
      const rows = parseCsv(t, d);
      if (!rows.length) return { info: "Paste some CSV." };
      const conv = (v) => (o.nums && /^-?(0|[1-9]\d*)(\.\d+)?$/.test(v) && v.length < 16 ? Number(v) : v);
      let out;
      if (o.header) {
        const h = rows[0].map((x, i) => x.trim() || `column${i + 1}`);
        out = rows.slice(1).map((r) => Object.fromEntries(h.map((k, i) => [k, conv(r[i] ?? "")])));
      } else out = rows.map((r) => r.map(conv));
      return { output: JSON.stringify(out, null, 2), info: `${out.length} record(s).`, download: { name: "data.json", mime: "application/json" } };
    },
  },
  "json-to-xml": {
    sample: `{"order": {"@id": "ORD-20931", "customer": "Asha Verma", "item": [{"sku": "TEA-250", "qty": 2}, {"sku": "MUG-01", "qty": 1}], "paid": true}}`,
    options: [txt("root", "Root element (if needed)", "root"), tog("decl", "Add XML declaration", true)],
    run: (t, o) => {
      const r = parseJson(t);
      if (r.error) return { error: r.error };
      const v = r.value;
      const single = v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 1 && !Object.keys(v)[0].startsWith("@");
      const xml = single ? jsonToXml(Object.values(v)[0], Object.keys(v)[0]) : jsonToXml(v, o.root || "root");
      return { output: (o.decl ? '<?xml version="1.0" encoding="UTF-8"?>\n' : "") + xml, download: { name: "data.xml", mime: "application/xml" } };
    },
  },
  "xml-to-json": {
    sample: `<?xml version="1.0"?>\n<order id="ORD-20931">\n  <customer>Asha Verma</customer>\n  <item><sku>TEA-250</sku><qty>2</qty></item>\n  <item><sku>MUG-01</sku><qty>1</qty></item>\n  <paid>true</paid>\n</order>`,
    clientOnly: true,
    options: [],
    outputLang: "json",
    run: (t) => {
      const doc = new DOMParser().parseFromString(t, "application/xml");
      const err = doc.querySelector("parsererror");
      if (err) return { error: "The XML is not well-formed: " + err.textContent.replace(/\s+/g, " ").trim().slice(0, 200) };
      const root = doc.documentElement;
      return { output: JSON.stringify({ [root.nodeName]: xmlNodeToJson(root) }, null, 2) };
    },
  },
  "json-to-typescript": {
    sample: SAMPLE_JSON,
    options: [txt("root", "Root type name", "Root")],
    run: (t, o) => {
      const r = parseJson(t);
      if (r.error) return { error: r.error };
      return { output: jsonToTs(r.value, o.root || "Root") };
    },
  },
  "yaml-to-json": {
    sample: `# GitHub Actions workflow\nname: deploy\non:\n  push:\n    branches: [main]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build`,
    options: [sel("indent", "Indent", "2", [["2", "2 spaces"], ["4", "4 spaces"]])],
    outputLang: "json",
    run: async (t, o) => {
      const yaml = await loadYaml();
      try {
        const docs = yaml.loadAll(t).filter((d) => d !== undefined);
        return { output: JSON.stringify(docs.length === 1 ? docs[0] : docs, null, Number(o.indent)) };
      } catch (e) {
        return { error: e.mark ? `Line ${e.mark.line + 1}, column ${e.mark.column + 1}: ${e.reason}` : e.message };
      }
    },
  },
  "json-to-yaml": {
    sample: SAMPLE_JSON,
    options: [sel("indent", "Indent", "2", [["2", "2 spaces"], ["4", "4 spaces"]])],
    run: async (t, o) => {
      const r = parseJson(t);
      if (r.error) return { error: r.error };
      const yaml = await loadYaml();
      return { output: yaml.dump(r.value, { indent: Number(o.indent), lineWidth: 120, noRefs: true }), download: { name: "data.yaml", mime: "text/yaml" } };
    },
  },
  "json-compare": {
    inputLabel: "Original JSON",
    input2Label: "Changed JSON",
    sample: `{"id": 7, "name": "Asha", "plan": "basic", "tags": ["sms"], "limits": {"daily": 100}}`,
    sample2: `{"id": 7, "name": "Asha Verma", "tags": ["sms", "email"], "limits": {"daily": 250}, "active": true}`,
    options: [],
    run: (a, _, b) => {
      const ra = parseJson(a);
      if (ra.error) return { error: "Original: " + ra.error };
      const rb = parseJson(b);
      if (rb.error) return { error: "Changed: " + rb.error };
      const d = diffJson(ra.value, rb.value);
      if (!d.length) return { info: "No differences. The two documents contain the same data." };
      return { info: `${d.length} difference(s).`, table: { cols: ["Path", "Change", "Original", "Changed"], rows: d } };
    },
  },
  "sql-formatter": {
    sample: "select o.id, c.name, sum(i.qty * i.price) as total from orders o join customers c on c.id = o.customer_id join order_items i on i.order_id = o.id where o.placed_at >= '2026-04-01' and c.city in ('Pune','Mumbai') group by o.id, c.name having sum(i.qty * i.price) > 1000 order by total desc limit 20;",
    options: [
      sel("lang", "Dialect", "sql", [["sql", "Standard SQL"], ["mysql", "MySQL"], ["mariadb", "MariaDB"], ["postgresql", "PostgreSQL"], ["tsql", "SQL Server"], ["sqlite", "SQLite"], ["plsql", "Oracle PL/SQL"], ["bigquery", "BigQuery"], ["snowflake", "Snowflake"]]),
      sel("kw", "Keywords", "upper", [["upper", "UPPERCASE"], ["lower", "lowercase"], ["preserve", "Keep as typed"]]),
      sel("mode", "Mode", "format", [["format", "Format"], ["minify", "Minify"]]),
    ],
    outputLang: "sql",
    run: async (t, o) => {
      if (o.mode === "minify") {
        const out = t
          .replace(/--[^\n]*/g, "")
          .replace(/\/\*[\s\S]*?\*\//g, "")
          .replace(/('(?:''|[^'])*')|\s+/g, (m, s) => s || " ")
          .trim();
        return { output: out };
      }
      const { format } = await import("sql-formatter");
      try {
        return { output: format(t, { language: o.lang, keywordCase: o.kw, tabWidth: 2 }) };
      } catch (e) {
        return { error: String(e.message).split("\n")[0] };
      }
    },
  },
  "regex-tester": {
    sample: "Orders: ORD-20931 (₹709, 14 Oct 2026), ORD-20932 (₹1,250, 15 Oct 2026), ref ord-77",
    options: [txt("pattern", "Pattern", "ORD-(\\d+)", "e.g. \\d{3}"), txt("flags", "Flags", "gi", "gimsuy"), txt("replace", "Replace with (optional)", "#$1", "$1, $<name>")],
    run: (t, o) => {
      if (!o.pattern) return { info: "Type a pattern." };
      let re;
      try {
        re = new RegExp(o.pattern, [...new Set(o.flags.replace(/[^dgimsuyv]/g, ""))].join(""));
      } catch (e) {
        return { error: e.message };
      }
      const matches = [];
      if (re.global || re.sticky) {
        let m,
          guard = 0;
        re.lastIndex = 0;
        while ((m = re.exec(t)) && guard++ < 1000) {
          matches.push(m);
          if (m[0] === "") re.lastIndex++;
        }
      } else {
        const m = re.exec(t);
        if (m) matches.push(m);
      }
      let hl = "",
        last = 0;
      for (const m of matches) {
        hl += escapeHtml(t.slice(last, m.index)) + `<mark>${escapeHtml(m[0]) || "∅"}</mark>`;
        last = m.index + m[0].length;
      }
      hl += escapeHtml(t.slice(last));
      const res = {
        highlight: hl,
        info: `${matches.length} match${matches.length === 1 ? "" : "es"}.`,
        table: matches.length
          ? { cols: ["#", "Match", "Index", "Groups"], rows: matches.slice(0, 200).map((m, i) => [i + 1, m[0], m.index, m.length > 1 ? m.slice(1).map((g, j) => `$${j + 1}=${g ?? "∅"}`).join("  ") + (m.groups ? "  " + Object.entries(m.groups).map(([k, v]) => `${k}=${v}`).join("  ") : "") : "—"]) }
          : undefined,
      };
      if (o.replace) res.output = t.replace(re, o.replace);
      return res;
    },
  },
  "timestamp-converter": {
    sample: "1767225600",
    inputType: "line",
    options: [],
    nowButton: true,
    run: (t, o) => {
      const s = t.trim();
      let ms;
      if (/^-?\d+(\.\d+)?$/.test(s)) {
        const n = Number(s);
        ms = Math.abs(n) >= 1e14 ? n / 1000 : Math.abs(n) >= 1e11 ? n : n * 1000;
      } else {
        ms = Date.parse(s);
        if (Number.isNaN(ms)) return { error: "Enter a Unix timestamp (seconds or milliseconds) or a date like 2026-10-16 14:30." };
      }
      const d = new Date(ms);
      if (Number.isNaN(d.getTime())) return { error: "That timestamp is out of range." };
      const unit = /^-?\d+$/.test(s) ? (Math.abs(Number(s)) >= 1e14 ? "microseconds" : Math.abs(Number(s)) >= 1e11 ? "milliseconds" : "seconds") : "date text";
      return {
        stats: [
          { label: "India (IST)", value: istString(ms) },
          { label: "UTC", value: d.toUTCString() },
          { label: "ISO 8601", value: d.toISOString() },
          { label: "Relative", value: o._ssr ? "—" : relative(ms) },
          { label: "Unix seconds", value: String(Math.floor(ms / 1000)) },
          { label: "Unix milliseconds", value: String(Math.round(ms)) },
          { label: "Input read as", value: unit },
        ],
      };
    },
  },
  "jwt-decoder": {
    sample: SAMPLE_JWT,
    options: [],
    run: (t, o) => {
      const parts = t.trim().replace(/^Bearer\s+/i, "").split(".");
      if (parts.length < 2) return { error: "A JWT has three parts separated by dots: header.payload.signature." };
      const dec = (p, name) => {
        try {
          return JSON.parse(new TextDecoder().decode(b64ToBytes(p)));
        } catch {
          throw new Error(`The ${name} is not valid Base64URL-encoded JSON.`);
        }
      };
      let h, p;
      try {
        h = dec(parts[0], "header");
        p = dec(parts[1], "payload");
      } catch (e) {
        return { error: e.message };
      }
      const stats = [];
      const now = Date.now() / 1000;
      for (const [k, l] of [["iat", "Issued at"], ["nbf", "Not before"], ["exp", "Expires"]])
        if (typeof p[k] === "number") stats.push({ label: l, value: istString(p[k] * 1000) + (o._ssr ? "" : ` (${relative(p[k] * 1000)})`) });
      if (typeof p.exp === "number" && !o._ssr) stats.push({ label: "Status", value: p.exp < now ? "Expired" : "Not expired", warn: p.exp < now });
      stats.push({ label: "Algorithm", value: h.alg || "—" });
      return {
        outputs: [
          { label: "Header", value: JSON.stringify(h, null, 2) },
          { label: "Payload", value: JSON.stringify(p, null, 2) },
        ],
        stats,
        info: "Decoded locally. The signature has not been verified.",
      };
    },
  },
  "markdown-to-html": {
    sample: "## Monthly budget\n\nTrack **fixed** and *variable* costs.\n\n| Item | Amount |\n|---|---:|\n| Rent | ₹22,000 |\n| SIP | ₹10,000 |\n\n- [x] Pay rent\n- [ ] Top up PPF\n\n> Pay yourself first.\n\nSee the [SIP calculator](https://freetoolspro.in/calculators/sip-calculator).",
    options: [tog("breaks", "Treat single line breaks as <br>", false)],
    outputLang: "html",
    run: async (t, o) => {
      const { marked } = await import("marked");
      const html = marked.parse(t, { gfm: true, breaks: o.breaks, async: false });
      return { output: html, html };
    },
  },
  "html-minifier": {
    sample: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <!-- page title -->\n    <title>  EMI Calculator  </title>\n  </head>\n  <body>\n    <main class="wrap">\n      <h1>EMI   Calculator</h1>\n      <p>Monthly <b>EMI</b> <i>and</i> schedule.</p>\n      <pre>  keep   this\n  spacing</pre>\n    </main>\n  </body>\n</html>`,
    options: [],
    outputLang: "html",
    run: (t) => {
      const out = minifyHtml(t);
      return { output: out, info: `${kb(size(t))} → ${kb(size(out))} (${size(t) ? Math.round((1 - size(out) / size(t)) * 100) : 0}% smaller)` };
    },
  },
  "css-minifier": {
    sample: `/*! theme v2 */\n.card {\n  padding: 16px 20px;\n  color: #13203b; /* ink */\n  font-family: "Bricolage Grotesque", sans-serif;\n}\n\n.card:hover,\n.card:focus-within {\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);\n}\n\n@media (max-width: 600px) {\n  .card { padding: 12px; }\n}`,
    options: [],
    outputLang: "css",
    run: (t) => {
      const out = minifyCss(t);
      return { output: out, info: `${kb(size(t))} → ${kb(size(out))} (${size(t) ? Math.round((1 - size(out) / size(t)) * 100) : 0}% smaller)` };
    },
  },
  "css-beautifier": {
    sample: `.nav{display:flex;gap:12px;align-items:center}.nav a:hover,.nav a:focus{color:#2346d8;text-decoration:underline}@media (max-width:600px){.nav{flex-direction:column}.nav a{padding:8px 0}}`,
    options: [sel("indent", "Indent", "2", [["2", "2 spaces"], ["4", "4 spaces"], ["tab", "Tab"]])],
    outputLang: "css",
    run: (t, o) => ({ output: beautifyCss(t, o.indent === "tab" ? "\t" : " ".repeat(Number(o.indent))) }),
  },

  // ================= encoding & security =================
  "base64-encode": {
    sample: "नमस्ते! Your OTP is 482913. ₹ symbols and emoji 👍 work too.",
    options: [tog("url", "URL-safe (- _ and no padding)", false), tog("wrap", "Wrap lines at 76 characters", false)],
    run: (t, o) => {
      let out = bytesToB64(utf8Bytes(t));
      if (o.url) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      if (o.wrap) out = out.replace(/.{76}/g, "$&\n");
      return { output: out, info: `${fmtN(size(t))} bytes → ${fmtN(out.replace(/\n/g, "").length)} characters` };
    },
  },
  "base64-decode": {
    sample: "4KSo4KSu4KS44KWN4KSk4KWHISBZb3VyIE9UUCBpcyA0ODI5MTMu",
    options: [],
    run: (t) => {
      if (!t.trim()) return { info: "Paste Base64 to decode." };
      try {
        const bytes = b64ToBytes(t.trim().replace(/^data:[^,]*,/, ""));
        const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
        return { output: text, info: `${fmtN(bytes.length)} bytes decoded.` };
      } catch (e) {
        if (e instanceof TypeError) return { error: "Decoded fine, but the result is not UTF-8 text. It is probably binary data such as an image or file." };
        return { error: e.message };
      }
    },
  },
  "url-encode": {
    sample: "https://freetoolspro.in/tools?search=emi calculator&city=Bengaluru&note=50% off",
    options: [sel("mode", "Encode", "component", [["component", "As a parameter value (encodeURIComponent)"], ["full", "As a full URL (encodeURI)"]]), tog("plus", "Spaces as +", false)],
    run: (t, o) => {
      let out = o.mode === "full" ? encodeURI(t) : encodeURIComponent(t);
      if (o.plus) out = out.replace(/%20/g, "+");
      return { output: out };
    },
  },
  "url-decode": {
    sample: "https://example.com/redirect?to=https%3A%2F%2Ffreetoolspro.in%2Ftools%3Fsearch%3Demi%2520calculator&utm_source=newsletter&utm_campaign=oct_2026",
    options: [tog("plus", "Treat + as space", true), tog("repeat", "Decode repeatedly", false)],
    run: (t, o) => {
      let s = t.trim();
      const dec = (x) => decodeURIComponent(o.plus ? x.replace(/\+/g, " ") : x);
      try {
        let out = dec(s);
        if (o.repeat) for (let i = 0; i < 5 && /%[0-9a-f]{2}/i.test(out); i++) out = decodeURIComponent(out);
        let table;
        const q = s.indexOf("?");
        if (q >= 0) {
          const params = new URLSearchParams(s.slice(q + 1).split("#")[0]);
          table = { cols: ["Parameter", "Value"], rows: [...params].map(([k, v]) => [k, v]) };
        }
        return { output: out, table };
      } catch {
        const bad = s.match(/%(?![0-9a-f]{2})/i);
        return { error: `Invalid percent-encoding${bad ? ` at character ${bad.index + 1}` : ""}. A % must be followed by two hex digits.` };
      }
    },
  },
  "html-escape": {
    sample: `<a href="/tools?q=emi&sort=popular">EMI & SIP calculators</a> — ₹0, it's free`,
    options: [sel("dir", "Direction", "escape", [["escape", "Escape (text → entities)"], ["unescape", "Unescape (entities → text)"]]), tog("ascii", "Also escape non-ASCII characters", false)],
    run: (t, o) => ({ output: o.dir === "escape" ? escapeHtml(t, o.ascii) : unescapeHtml(t) }),
  },
  "binary-converter": {
    sample: "Hi ₹",
    options: [sel("dir", "Direction", "enc", [["enc", "Text → bytes"], ["dec", "Bytes → text"]]), sel("base", "Byte format (for bytes → text)", "2", [["2", "Binary"], ["16", "Hex"], ["10", "Decimal"], ["8", "Octal"]])],
    run: (t, o) => {
      if (o.dir === "enc") {
        const b = [...utf8Bytes(t)];
        const f = (base, pad) => b.map((x) => x.toString(base).padStart(pad, "0")).join(" ");
        return {
          outputs: [
            { label: "Binary", value: f(2, 8) },
            { label: "Hex", value: f(16, 2).toUpperCase() },
            { label: "Decimal", value: f(10, 1) },
            { label: "Octal", value: f(8, 3) },
          ],
          info: `${[...t].length} character(s), ${b.length} byte(s) in UTF-8.`,
        };
      }
      const base = Number(o.base);
      const toks = t.trim().replace(/0x/gi, "").split(/[\s,]+/).filter(Boolean);
      const bytes = toks.map((x) => parseInt(x, base));
      const badIdx = bytes.findIndex((n) => !Number.isFinite(n) || n < 0 || n > 255);
      if (badIdx >= 0) return { error: `'${toks[badIdx]}' is not a valid byte in base ${base}. Separate bytes with spaces.` };
      return { output: new TextDecoder().decode(new Uint8Array(bytes)) };
    },
  },
  "md5-generator": {
    sample: "freetoolspro",
    options: [tog("upper", "Uppercase", false), tog("lines", "Hash each line separately", false)],
    run: (t, o) => {
      const h = (s) => {
        const x = hex(md5(utf8Bytes(s)));
        return o.upper ? x.toUpperCase() : x;
      };
      if (o.lines) return { output: lines(t).map((l) => `${h(l)}  ${l}`).join("\n") };
      const raw = md5(utf8Bytes(t));
      return { outputs: [{ label: "MD5 (hex)", value: o.upper ? hex(raw).toUpperCase() : hex(raw) }, { label: "MD5 (Base64)", value: bytesToB64(raw) }] };
    },
  },
  "sha256-generator": {
    sample: "freetoolspro",
    clientOnly: true,
    options: [txt("key", "HMAC secret key (optional)", "", "Leave blank for plain hashes"), sel("enc", "Output", "hex", [["hex", "Hex"], ["base64", "Base64"]])],
    run: async (t, o) => ({ outputs: await shaAll(t, o.key, o.enc) }),
  },
  "uuid-generator": {
    noInput: true,
    clientOnly: true,
    options: [sel("ver", "Version", "4", [["4", "v4 (random)"], ["7", "v7 (time-ordered)"]]), numo("count", "How many", 5, 1, 1000), tog("upper", "Uppercase", false), tog("nohyph", "Remove hyphens", false), txt("check", "Check a UUID", "", "Paste a UUID to validate")],
    run: (_, o) => {
      const n = Math.min(Math.max(1, o.count | 0), 1000);
      let ids = Array.from({ length: n }, o.ver === "7" ? uuid7 : uuid4);
      if (o.upper) ids = ids.map((x) => x.toUpperCase());
      if (o.nohyph) ids = ids.map((x) => x.replace(/-/g, ""));
      const res = { output: ids.join("\n") };
      if (o.check) {
        const m = o.check.trim().match(/^[0-9a-f]{8}-?[0-9a-f]{4}-?([0-9a-f])[0-9a-f]{3}-?([0-9a-f])[0-9a-f]{3}-?[0-9a-f]{12}$/i);
        res.stats = [{ label: "Check", value: m ? `Valid UUID, version ${m[1]}${/[89ab]/i.test(m[2]) ? "" : " (non-standard variant)"}` : "Not a valid UUID", warn: !m }];
      }
      return res;
    },
  },
  "password-generator": {
    noInput: true,
    clientOnly: true,
    options: [
      sel("type", "Type", "random", [["random", "Random characters"], ["phrase", "Passphrase (words)"]]),
      { ...numo("len", "Length", 16, 6, 128), show: (o) => o.type === "random" },
      { ...tog("up", "A–Z", true), show: (o) => o.type === "random" },
      { ...tog("low", "a–z", true), show: (o) => o.type === "random" },
      { ...tog("dig", "0–9", true), show: (o) => o.type === "random" },
      { ...tog("sym", "Symbols", true), show: (o) => o.type === "random" },
      { ...tog("amb", "Avoid look-alikes (0 O l 1 I)", true), show: (o) => o.type === "random" },
      { ...numo("words", "Words", 6, 3, 12), show: (o) => o.type === "phrase" },
      { ...sel("wsep", "Separator", "-", [["-", "Hyphen"], [".", "Dot"], [" ", "Space"], ["_", "Underscore"]]), show: (o) => o.type === "phrase" },
      { ...tog("cap", "Capitalise and add a number", true), show: (o) => o.type === "phrase" },
      numo("count", "How many", 5, 1, 50),
    ],
    run: (_, o) => {
      const n = Math.min(Math.max(1, o.count | 0), 50);
      let out, bits;
      if (o.type === "phrase") {
        const list = [...new Set(WORDS)];
        const k = Math.min(Math.max(3, o.words | 0), 12);
        out = Array.from({ length: n }, () => {
          const w = Array.from({ length: k }, () => list[randInt(list.length)]);
          if (o.cap) {
            const i = randInt(k);
            w[i] = w[i][0].toUpperCase() + w[i].slice(1) + randInt(10);
          }
          return w.join(o.wsep);
        });
        bits = k * Math.log2(list.length) + (o.cap ? Math.log2(k * 10) : 0);
      } else {
        let sets = [];
        if (o.up) sets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
        if (o.low) sets.push("abcdefghijklmnopqrstuvwxyz");
        if (o.dig) sets.push("0123456789");
        if (o.sym) sets.push("!@#$%^&*()-_=+[]{};:,.?/~");
        if (!sets.length) return { error: "Choose at least one character type." };
        if (o.amb) sets = sets.map((s) => s.replace(/[0Ol1I|]/g, ""));
        const all = sets.join("");
        const len = Math.min(Math.max(sets.length, o.len | 0), 128);
        out = Array.from({ length: n }, () => {
          // Guarantee one of each chosen set, then fill and shuffle.
          const c = sets.map((s) => s[randInt(s.length)]);
          while (c.length < len) c.push(all[randInt(all.length)]);
          for (let i = c.length - 1; i > 0; i--) {
            const j = randInt(i + 1);
            [c[i], c[j]] = [c[j], c[i]];
          }
          return c.join("");
        });
        bits = len * Math.log2(all.length);
      }
      return { output: out.join("\n"), stats: [{ label: "Strength", value: `${Math.round(bits)} bits${bits >= 80 ? " (strong)" : bits >= 60 ? " (good)" : " (weak)"}`, warn: bits < 60 }] };
    },
  },
  "password-strength-checker": {
    sample: "P@ssw0rd2026",
    inputType: "password",
    options: [],
    run: (t) => {
      const r = strength(t);
      if (!r) return { info: "Type a password to check it." };
      const score = r.bits < 28 ? 0 : r.bits < 40 ? 1 : r.bits < 60 ? 2 : r.bits < 80 ? 3 : 4;
      const label = ["Very weak", "Weak", "Fair", "Strong", "Very strong"][score];
      return {
        meter: { value: score, max: 4, label },
        stats: [
          { label: "Estimated strength", value: `${Math.round(r.bits)} bits` },
          { label: "Online attack (100 guesses/s)", value: crackTime(r.bits, 100) },
          { label: "Offline attack (10 billion guesses/s)", value: crackTime(r.bits, 1e10), warn: score < 3 },
          { label: "Length", value: [...t].length },
        ],
        table: r.warnings.length ? { cols: ["What to fix"], rows: r.warnings.map((w) => [w]) } : undefined,
      };
    },
  },
  "url-parser": {
    sample: "https://shop.example.in:8443/products/tea/assam?size=250g&utm_source=instagram&utm_medium=social&utm_campaign=diwali_2026#reviews",
    inputType: "line",
    options: [],
    run: (t) => {
      let u;
      try {
        u = new URL(t.trim());
      } catch {
        try {
          u = new URL("https://" + t.trim());
        } catch {
          return { error: "That does not look like a URL. Include the domain, for example example.com/page." };
        }
      }
      const params = [...u.searchParams];
      return {
        stats: [
          { label: "Protocol", value: u.protocol.replace(":", "") },
          { label: "Host", value: u.hostname },
          { label: "Port", value: u.port || "default" },
          { label: "Path", value: decodeURIComponent(u.pathname) },
          { label: "Fragment", value: u.hash ? decodeURIComponent(u.hash.slice(1)) : "—" },
          { label: "Origin", value: u.origin },
        ],
        table: params.length ? { cols: ["Parameter", "Value", "Note"], rows: params.map(([k, v]) => [k, v, /^utm_/.test(k) ? "Tracking (UTM)" : /^(gclid|fbclid|msclkid)$/.test(k) ? "Ad click ID" : ""]) } : undefined,
        outputs: params.some(([k]) => /^(utm_|gclid|fbclid|msclkid)/.test(k))
          ? [{ label: "Clean URL (tracking removed)", value: (() => { const c = new URL(u); [...c.searchParams.keys()].filter((k) => /^(utm_|gclid|fbclid|msclkid)/.test(k)).forEach((k) => c.searchParams.delete(k)); return c.toString(); })() }]
          : undefined,
      };
    },
  },
  ...EXTRA_TEXTS,
};

async function loadYaml() {
  const m = await import("js-yaml");
  return m.default && m.default.load ? m.default : m;
}

function mins(m) {
  if (m < 1) return `${Math.max(1, Math.round(m * 60))} sec`;
  return `${Math.round(m)} min`;
}
