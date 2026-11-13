// Presentation MathML to LaTeX. Walks the MathML tree and writes the matching commands.
import { parseXml, elements, textOf } from "./xml.js";
import { CHAR_TO_TEX } from "./symbols.js";

const FUNCS = new Set("sin cos tan cot sec csc arcsin arccos arctan sinh cosh tanh coth log ln lg exp lim limsup liminf min max sup inf det gcd arg deg dim ker hom Pr".split(" "));
const ACCENT = { "^": "hat", "ˆ": "hat", "̂": "hat", "~": "tilde", "˜": "tilde", "̃": "tilde", "¯": "bar", "̄": "bar", "ˉ": "bar", "→": "vec", "⃗": "vec", "⃗": "vec", "˙": "dot", "̇": "dot", "¨": "ddot", "̈": "ddot", "ˇ": "check", "̌": "check", "˘": "breve", "̆": "breve", "´": "acute", "́": "acute", "`": "grave", "̀": "grave" };
const WIDE = { hat: "widehat", tilde: "widetilde" };
const VARIANT = { bold: "mathbf", "bold-italic": "boldsymbol", "double-struck": "mathbb", script: "mathcal", "bold-script": "mathcal", fraktur: "mathfrak", "bold-fraktur": "mathfrak", "sans-serif": "mathsf", "bold-sans-serif": "mathsf", monospace: "mathtt" };
const FENCE_ENV = { "(": "pmatrix", "[": "bmatrix", "{": "Bmatrix", "|": "vmatrix", "∣": "vmatrix", "‖": "Vmatrix", "∥": "Vmatrix" };
const CLOSES = { "(": ")", "[": "]", "{": "}", "|": "|", "∣": "∣", "‖": "‖", "∥": "∥" };

const chars = (s) => [...s].map((c) => CHAR_TO_TEX[c] ?? c);

/** Join tokens, adding a space after a command that would otherwise run into a letter. */
function join(parts) {
  let out = "";
  for (const p of parts) {
    if (!p) continue;
    if (/\\[a-zA-Z]+$/.test(out) && /^[a-zA-Z0-9]/.test(p)) out += " ";
    else if (/[\^_][a-zA-Z0-9]$/.test(out) && /^[a-zA-Z0-9]/.test(p)) out += " ";
    out += p;
  }
  return out;
}

const group = (s) => (/^(\\[a-zA-Z]+|.)$/u.test(s) ? s : `{${s}}`);
const arg = (s) => `{${s}}`;

function word(s) {
  return join(chars(s));
}

function mi(n) {
  const t = textOf(n).trim();
  const v = n.attrs.mathvariant;
  if (FUNCS.has(t)) return `\\${t}`;
  if (t.length > 1 && !/^\\/.test(t) && [...t].length > 1) return v === "bold" ? `\\mathbf{${t}}` : `\\operatorname{${t}}`;
  const tex = word(t);
  if (v === "normal") return /^[A-Za-z]$/.test(t) ? `\\mathrm{${t}}` : tex;
  return VARIANT[v] ? `\\${VARIANT[v]}{${tex}}` : tex;
}

function mo(n) {
  const t = textOf(n).trim();
  if (FUNCS.has(t)) return `\\${t}`;
  if (t.length > 1 && /^[A-Za-z]+$/.test(t)) return `\\operatorname{${t}}`;
  return word(t);
}

function mspace(n) {
  const w = parseFloat(n.attrs.width || "0");
  const unit = /em/.test(n.attrs.width || "") ? 1 : 0.0625;
  const em = w * unit;
  if (em >= 1.8) return "\\qquad ";
  if (em >= 0.9) return "\\quad ";
  if (em >= 0.25) return "\\;";
  if (em >= 0.2) return "\\:";
  if (em > 0) return "\\,";
  if (em < 0) return "\\!";
  return "";
}

function table(n, fence) {
  const rows = elements(n).filter((r) => r.tag === "mtr" || r.tag === "mlabeledtr");
  const body = rows.map((r) => elements(r).map((c) => conv(c)).join(" & ")).join(" \\\\ ");
  const aligns = (n.attrs.columnalign || "").trim().split(/\s+/);
  let env = fence?.env || "matrix";
  if (!fence && rows.length) {
    if (aligns[0] === "left" && !aligns[1]) return `\\begin{cases} ${body} \\end{cases}`;
    if (aligns[0] === "right" && aligns[1] === "left") env = "aligned";
    else if (aligns[0] === "left" && aligns[1] === "left") env = "aligned";
  }
  return `\\begin{${env}} ${body} \\end{${env}}`;
}

/** mrow children, spotting (table), [table] and {table so brackets become pmatrix, bmatrix or cases. */
function row(kids) {
  const parts = [];
  if (kids.length === 3 && unwrap(kids[0])?.tag === "mo" && unwrap(kids[2])?.tag === "mo" && unwrap(kids[1])?.tag === "mfrac" && parseFloat(unwrap(kids[1]).attrs.linethickness) === 0 && textOf(kids[0]).trim() === "(") {
    const [a, b] = elements(unwrap(kids[1]));
    return `\\binom{${conv(a)}}{${conv(b)}}`;
  }
  const first = kids[0];
  const last = kids[kids.length - 1];
  if (kids.length >= 3 && first.tag === "mo" && last.tag === "mo" && first.attrs.stretchy !== "false" && last.attrs.stretchy !== "false" && /^[([{|⟨⌊⌈]$/.test(textOf(first).trim()) && /^[)\]}|⟩⌋⌉]$/.test(textOf(last).trim()) && kids.slice(1, -1).some((k) => /mfrac|munder|mover|mtable/.test(k.tag)) && !(unwrap(kids[1])?.tag === "mtable" && kids.length === 3)) {
    return `\\left${word(textOf(first).trim())} ${row(kids.slice(1, -1))} \\right${word(textOf(last).trim())}`;
  }
  for (let i = 0; i < kids.length; i++) {
    const k = kids[i];
    const open = k.tag === "mo" ? textOf(k).trim() : null;
    const next = unwrap(kids[i + 1]);
    if (open && next?.tag === "mtable") {
      const after = kids[i + 2];
      const close = after?.tag === "mo" ? textOf(after).trim() : "";
      if (close === CLOSES[open] && FENCE_ENV[open]) {
        parts.push(table(next, { env: FENCE_ENV[open] }));
        i += 2;
        continue;
      }
      if (open === "{" && !close) {
        parts.push(`\\begin{cases} ${elements(next).map((r) => elements(r).map((c) => conv(c)).join(" & ")).join(" \\\\ ")} \\end{cases}`);
        i += 1;
        continue;
      }
    }
    parts.push(conv(k));
  }
  return join(parts);
}

function unwrap(n) {
  while (n && (n.tag === "mrow" || n.tag === "mstyle" || n.tag === "mpadded") && elements(n).length === 1) n = elements(n)[0];
  return n;
}

function script(n) {
  const [base, a, b] = elements(n);
  const bt = conv(base);
  const needsBrace = /^(\\frac|\\sqrt|\\begin|.*[\^_])/.test(bt) && !/^\{.*\}$/.test(bt);
  const left = needsBrace ? `{${bt}}` : bt || "{}";
  if (n.tag === "msup" && /^['′″]+$/.test(textOf(a).trim())) return left + "'".repeat(textOf(a).trim().replace(/″/g, "''").length);
  if (n.tag === "msup") return `${left}^${group(conv(a))}`;
  if (n.tag === "msub") return `${left}_${group(conv(a))}`;
  return `${left}_${group(conv(a))}^${group(conv(b))}`;
}

function under(n) {
  const [base, a, b] = elements(n);
  const baseT = conv(base);
  const ut = unwrap(a);
  const at = ut?.tag === "mo" ? textOf(ut).trim() : "";
  if (n.tag === "mover" || n.tag === "munder") {
    if (n.tag === "mover") {
      if (ACCENT[at]) {
        const name = ACCENT[at];
        return `\\${[...textOf(base)].length > 1 && WIDE[name] ? WIDE[name] : name}{${baseT}}`;
      }
      if (at === "‾" || at === "¯" || at === "―" || at === "_") return `\\overline{${baseT}}`;
      if (at === "⏞") return `\\overbrace{${baseT}}`;
      if (unwrap(base)?.tag === "mover" && textOf(elements(unwrap(base))[1] || { children: [] }).trim() === "⏞") return `${conv(base)}^${group(conv(a))}`;
    } else {
      if (at === "_" || at === "‾" || at === "̲" || at === "―") return `\\underline{${baseT}}`;
      if (at === "⏟") return `\\underbrace{${baseT}}`;
      if (unwrap(base)?.tag === "munder" && textOf(elements(unwrap(base))[1] || { children: [] }).trim() === "⏟") return `${conv(base)}_${group(conv(a))}`;
    }
    const big = unwrap(base)?.tag === "mo" || /^\\(lim|max|min|sup|inf|operatorname)/.test(baseT);
    if (big) return `${baseT}${n.tag === "mover" ? "^" : "_"}${group(conv(a))}`;
    return `${n.tag === "mover" ? "\\overset" : "\\underset"}{${conv(a)}}{${baseT}}`;
  }
  return `${baseT}_${group(conv(a))}^${group(conv(b))}`;
}

function conv(n) {
  if (typeof n === "string") return n.trim() ? word(n.trim()) : "";
  const kids = elements(n);
  switch (n.tag) {
    case "#root":
    case "math":
    case "mrow":
    case "mstyle":
    case "mpadded":
    case "merror":
    case "mtd":
      return row(kids);
    case "semantics": {
      const a = kids.find((k) => k.tag === "annotation" && /tex/i.test(k.attrs.encoding || ""));
      if (a) return textOf(a).trim();
      return conv(kids[0]);
    }
    case "annotation":
    case "annotation-xml":
      return "";
    case "mphantom":
      return `\\phantom{${row(kids)}}`;
    case "mi":
      return mi(n);
    case "mn":
      return word(textOf(n).trim());
    case "mo":
      return mo(n);
    case "ms":
    case "mtext": {
      const t = textOf(n).replace(/\s+/g, " ");
      return t.trim() ? `\\text{${t.replace(/([{}%$&#_])/g, "\\$1")}}` : "\\ ";
    }
    case "mspace":
      return mspace(n);
    case "mfrac": {
      const [a, b] = kids;
      if (parseFloat(n.attrs.linethickness) === 0) return `{${conv(a)} \\atop ${conv(b)}}`;
      return `\\frac{${conv(a)}}{${conv(b)}}`;
    }
    case "msqrt":
      return `\\sqrt{${row(kids)}}`;
    case "mroot":
      return `\\sqrt[${conv(kids[1])}]{${conv(kids[0])}}`;
    case "msup":
    case "msub":
    case "msubsup":
      return script(n);
    case "munder":
    case "mover":
    case "munderover":
      return under(n);
    case "mfenced": {
      const o = n.attrs.open ?? "(";
      const c = n.attrs.close ?? ")";
      const sep = (n.attrs.separators ?? ",").trim()[0] ?? "";
      const inner = kids.length === 1 ? unwrap(kids[0]) : null;
      if (inner?.tag === "mtable" && FENCE_ENV[o] && CLOSES[o] === c) return table(inner, { env: FENCE_ENV[o] });
      const open = o === "." || !o ? "." : word(o);
      const close = c === "." || !c ? "." : word(c);
      return `\\left${open} ${kids.map(conv).join(sep ? word(sep) + " " : " ")} \\right${close}`;
    }
    case "mtable":
      return table(n);
    case "menclose": {
      const not = n.attrs.notation || "longdiv";
      const body = row(kids);
      if (/radical/.test(not)) return `\\sqrt{${body}}`;
      if (/strike/.test(not)) return `\\cancel{${body}}`;
      return `\\boxed{${body}}`;
    }
    case "mmultiscripts": {
      const [base, ...rest] = kids;
      const pre = rest.findIndex((k) => k.tag === "mprescripts");
      const post = pre < 0 ? rest : rest.slice(0, pre);
      const front = pre < 0 ? [] : rest.slice(pre + 1);
      const pair = (l) => {
        let s = "";
        for (let i = 0; i + 1 < l.length; i += 2) {
          const [d, u] = [l[i], l[i + 1]];
          if (d.tag !== "none") s += `_${group(conv(d))}`;
          if (u.tag !== "none") s += `^${group(conv(u))}`;
        }
        return s;
      };
      return `${front.length ? `{}${pair(front)}` : ""}${conv(base)}${pair(post)}`;
    }
    case "none":
      return "";
    default:
      return row(kids);
  }
}

/** MathML string to LaTeX. Throws with a readable message when the input cannot be read. */
export function mathmlToLatex(src) {
  const text = String(src || "").trim();
  if (!text) return "";
  if (!text.includes("<")) throw new Error("This does not look like MathML: it has no tags. Paste markup that starts with <math>.");
  const root = parseXml(text);
  const out = conv(root).replace(/\s+/g, " ").trim();
  if (!out) throw new Error("No maths found in this MathML.");
  return out;
}
