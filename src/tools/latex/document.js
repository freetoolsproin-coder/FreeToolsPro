// Reads a LaTeX document into a simple list of blocks (headings, paragraphs, lists, tables, equations)
// that pdf.js lays out. This is a focused reader for everyday LaTeX, not TeX itself: anything it cannot
// typeset is skipped and reported in `log`, so a document always produces a result.

const HARMLESS_PKG = new Set("amsmath amssymb amsfonts amsthm mathtools inputenc fontenc geometry graphicx hyperref xcolor color booktabs array enumitem lmodern babel microtype parskip fancyhdr titlesec url listings float caption subcaption multirow tabularx setspace csquotes physics cancel mhchem bm latexsym ragged2e fullpage nopageno".split(" "));
const SIZES = { tiny: 0.6, scriptsize: 0.7, footnotesize: 0.8, small: 0.9, normalsize: 1, large: 1.2, Large: 1.44, LARGE: 1.73, huge: 2.07, Huge: 2.49 };
const MATH_ENVS = new Set(["equation", "equation*", "align", "align*", "gather", "gather*", "multline", "multline*", "displaymath", "flalign", "flalign*", "alignat", "alignat*", "eqnarray", "eqnarray*"]);
const SYMBOLS = { LaTeX: "LaTeX", TeX: "TeX", ldots: "…", dots: "…", textbackslash: "\\", textasciitilde: "~", textasciicircum: "^", textbar: "|", textless: "<", textgreater: ">", textbullet: "•", textendash: "–", textemdash: "—", copyright: "©", textregistered: "®", texttrademark: "™", pounds: "£", S: "§", P: "¶", dag: "†", ddag: "‡", i: "ı", ss: "ß", ae: "æ", AE: "Æ", oe: "œ", OE: "Œ", o: "ø", O: "Ø", aa: "å", AA: "Å", textdegree: "°", guillemotleft: "«", guillemotright: "»" };
const ACCENTS = { "'": "́", "`": "̀", '"': "̈", "^": "̂", "~": "̃", c: "̧", "=": "̄", ".": "̇", v: "̌", u: "̆" };
const IGNORE_0 = new Set("centering raggedright raggedleft sloppy fussy protect relax nobreak noindent indent par pagestyle thispagestyle pagenumbering frenchspacing normalfont rmfamily sffamily onehalfspacing doublespacing singlespacing null strut hfil vfil vfill hrulefill smallbreak medbreak bigbreak nopagebreak allowbreak maketitle tableofcontents listoffigures listoftables appendix".split(" "));
const IGNORE_1 = new Set("label pagestyle thispagestyle pagenumbering vspace vspace* hspace hspace* setlength setcounter addtocounter bibliographystyle input include nocite index".split(" "));

/** Text inside {...} starting at src[i] === "{". Returns [content, indexAfter]. */
function braced(src, i) {
  let depth = 0;
  for (let p = i; p < src.length; p++) {
    const c = src[p];
    if (c === "\\") p++;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) return [src.slice(i + 1, p), p + 1];
  }
  return [src.slice(i + 1), src.length];
}

function bracketed(src, i) {
  let depth = 0;
  for (let p = i; p < src.length; p++) {
    const c = src[p];
    if (c === "\\") p++;
    else if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (c === "]" && depth === 0) return [src.slice(i + 1, p), p + 1];
  }
  return [src.slice(i + 1), src.length];
}

const skipWs = (s, i) => {
  while (i < s.length && /\s/.test(s[i])) i++;
  return i;
};

/** Read one macro argument: {group}, or a single token. */
function oneArg(src, i) {
  i = skipWs(src, i);
  if (src[i] === "{") return braced(src, i);
  if (src[i] === "\\") {
    const m = src.slice(i).match(/^\\([a-zA-Z]+|.)/);
    return [m[0], i + m[0].length];
  }
  return [src[i] ?? "", i + 1];
}

function stripComments(src) {
  // Keep verbatim-like blocks untouched.
  const parts = src.split(/(\\begin\{(?:verbatim|lstlisting)\}[\s\S]*?\\end\{(?:verbatim|lstlisting)\})/);
  return parts.map((p, i) => (i % 2 ? p : p.replace(/(^|[^\\])%.*$/gm, "$1"))).join("");
}

/** Collect \newcommand definitions and expand them everywhere, so templates with their own macros work. */
function expandMacros(src, log) {
  const macros = {};
  const defRe = /\\(?:re|provide)?newcommand\*?\s*\{?\\([a-zA-Z]+)\}?\s*(?:\[(\d)\])?\s*(?:\[([^\]]*)\])?\s*\{/g;
  let out = "";
  let last = 0;
  let m;
  while ((m = defRe.exec(src))) {
    const open = m.index + m[0].length - 1;
    const [body, end] = braced(src, open);
    macros[m[1]] = { n: Number(m[2] || 0), opt: m[3], body };
    out += src.slice(last, m.index);
    last = end;
    defRe.lastIndex = end;
  }
  out += src.slice(last);
  const defs = out.matchAll(/\\def\\([a-zA-Z]+)\s*\{/g);
  for (const d of defs) {
    const [body, end] = braced(out, d.index + d[0].length - 1);
    macros[d[1]] = { n: 0, body };
    out = out.slice(0, d.index) + " ".repeat(end - d.index) + out.slice(end);
  }
  const names = Object.keys(macros).filter((k) => macros[k]);
  if (!names.length) return out;
  const re = new RegExp(`\\\\(${names.sort((a, b) => b.length - a.length).join("|")})(?![a-zA-Z])`);
  for (let round = 0, guard = 0; round < 8 && guard < 20000; round++) {
    let changed = false;
    let res = "";
    let rest = out;
    let hit;
    while ((hit = rest.match(re)) && guard++ < 20000) {
      const def = macros[hit[1]];
      res += rest.slice(0, hit.index);
      let i = hit.index + hit[0].length;
      const args = [];
      if (def.opt !== undefined) {
        if (rest[i] === "[") {
          const [o, e] = bracketed(rest, i);
          args.push(o);
          i = e;
        } else args.push(def.opt);
      }
      while (args.length < def.n) {
        const [a, e] = oneArg(rest, i);
        args.push(a);
        i = e;
      }
      res += def.body.replace(/#(\d)/g, (_, d) => args[d - 1] ?? "");
      rest = rest.slice(i);
      changed = true;
    }
    out = res + rest;
    if (!changed) break;
    if (round === 7) log.push({ level: "warn", msg: "A macro expands into itself; expansion was stopped after 8 rounds." });
  }
  return out;
}

class Reader {
  constructor(log) {
    this.log = log;
    this.counters = { section: 0, subsection: 0, subsubsection: 0, equation: 0, table: 0, figure: 0, footnote: 0 };
    this.labels = {};
    this.toc = [];
    this.notes = [];
    this.theorems = {};
    this.warned = new Set();
    this.last = "";
  }
  warn(msg) {
    if (!this.warned.has(msg)) {
      this.warned.add(msg);
      this.log.push({ level: "warn", msg });
    }
  }

  // ---- inline ----
  inline(src, base = {}) {
    const runs = [];
    let style = { ...base };
    const push = (text) => {
      if (!text) return;
      const lastRun = runs[runs.length - 1];
      if (lastRun && lastRun.text !== undefined && JSON.stringify(lastRun.s) === JSON.stringify(style)) lastRun.text += text;
      else runs.push({ text, s: { ...style } });
    };
    const addAll = (r) => r.forEach((x) => runs.push(x));
    let i = 0;
    while (i < src.length) {
      const c = src[i];
      if (c === "\\") {
        const n = src[i + 1];
        if (n === undefined) break;
        if (n === "(") {
          const e = src.indexOf("\\)", i);
          const end = e < 0 ? src.length : e;
          runs.push({ math: src.slice(i + 2, end).trim(), s: { ...style } });
          i = end + 2;
          continue;
        }
        if (n === "\\") {
          runs.push({ br: true });
          i += 2;
          if (src[i] === "*") i++;
          i = skipWs(src, i);
          if (src[i] === "[") i = bracketed(src, i)[1];
          continue;
        }
        if ("&%$#_{}".includes(n)) {
          push(n);
          i += 2;
          continue;
        }
        if (n === " " || n === "\n" || n === ",") {
          push(n === "," ? " " : " ");
          i += 2;
          continue;
        }
        if (n === ";" || n === ":" || n === "!" || n === "/" || n === "-") {
          i += 2;
          continue;
        }
        if (ACCENTS[n] && !/[a-zA-Z]/.test(n)) {
          const [a, e] = oneArg(src, i + 2);
          push((a.replace(/^\\/, "") + ACCENTS[n]).normalize("NFC"));
          i = e;
          continue;
        }
        const m = src.slice(i).match(/^\\([a-zA-Z]+\*?)/);
        if (!m) {
          i += 2;
          continue;
        }
        const name = m[1];
        i += m[0].length;
        const hadSpace = /\s/.test(src[i] || "");
        const arg = () => {
          const [a, e] = oneArg(src, i);
          i = e;
          return a;
        };
        const opt = () => {
          const p = skipWs(src, i);
          if (src[p] === "[") {
            const [o, e] = bracketed(src, p);
            i = e;
            return o;
          }
          return null;
        };
        const styled = (patch) => addAll(this.inline(arg(), { ...style, ...patch }));
        if (name.length === 1 && ACCENTS[name]) {
          const a = arg();
          push((a.replace(/^\\/, "") + ACCENTS[name]).normalize("NFC"));
        } else if (name === "textbf" || name === "mathbf") styled({ b: true });
        else if (name === "textit" || name === "emph" || name === "textsl") styled({ i: !style.i });
        else if (name === "texttt") styled({ tt: true });
        else if (name === "textsc") styled({ sc: true });
        else if (name === "textrm" || name === "textsf" || name === "textnormal" || name === "mbox" || name === "text" || name === "textup" || name === "hbox") styled({});
        else if (name === "underline" || name === "uline") styled({ u: true });
        else if (name === "textcolor") {
          const col = arg();
          styled({ color: col });
        } else if (name === "colorbox") {
          arg();
          styled({});
        } else if (name === "color") style.color = arg();
        else if (name === "href") {
          const url = arg();
          styled({ href: url, color: style.color || "blue" });
        } else if (name === "url" || name === "nolinkurl") {
          const url = arg();
          addAll(this.inline(url.replace(/([%_#&$])/g, "\\$1"), { ...style, href: url, tt: true, color: "blue" }));
        } else if (SIZES[name]) style.size = SIZES[name];
        else if (name === "bfseries" || name === "bf") style.b = true;
        else if (name === "itshape" || name === "it" || name === "em" || name === "slshape") style.i = true;
        else if (name === "ttfamily" || name === "tt") style.tt = true;
        else if (name === "scshape" || name === "sc") style.sc = true;
        else if (name === "mdseries" || name === "upshape") {
          style.b = false;
          style.i = false;
        } else if (name === "hfill" || name === "hfil") {
          runs.push({ hfill: true });
          if (hadSpace) i = skipWs(src, i);
        } else if (name === "quad" || name === "qquad" || name === "enspace" || name === "enskip") push(name === "qquad" ? "  " : name === "quad" ? " " : " ");
        else if (name === "hspace" || name === "hspace*") {
          arg();
          push(" ");
        } else if (name === "today") push(new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }));
        else if (SYMBOLS[name]) {
          push(SYMBOLS[name]);
          if (hadSpace && /^[a-z]/i.test(name) && name !== "ldots" && name !== "dots") i = skipWs(src, i);
        } else if (name === "ref" || name === "eqref" || name === "pageref" || name === "autoref" || name === "cref") {
          const key = arg();
          const v = this.labels[key];
          if (v === undefined && this.final) this.warn(`\\${name}{${key}} has no matching \\label.`);
          push(name === "eqref" ? `(${v ?? "?"})` : `${v ?? "?"}`);
        } else if (name === "cite") {
          opt();
          const keys = arg().split(",").map((k) => k.trim());
          push(`[${keys.map((k) => this.labels[`bib:${k}`] ?? "?").join(", ")}]`);
          if (this.final) for (const k of keys) if (!this.labels[`bib:${k}`]) this.warn(`\\cite{${k}} has no \\bibitem in this file; BibTeX files are not read.`);
        } else if (name === "footnote") {
          const content = arg();
          const n = ++this.counters.footnote;
          runs.push({ text: String(n), s: { ...style, sup: true } });
          this.notes.push({ n, runs: this.inline(content) });
        } else if (name === "includegraphics") {
          opt();
          const f = arg();
          this.warn(`Image '${f}' skipped: this compiler has no file system, so images are not included.`);
          push(`[image: ${f}]`);
        } else if (name === "label") this.setLabel(arg());
        else if (IGNORE_1.has(name)) arg();
        else if (IGNORE_0.has(name)) {
          if (hadSpace) i = skipWs(src, i);
        } else {
          this.warn(`\\${name} is not supported and was skipped.`);
          const p = skipWs(src, i);
          if (src[p] === "{") {
            const [a, e] = braced(src, p);
            addAll(this.inline(a, style));
            i = e;
          }
        }
        continue;
      }
      if (c === "$") {
        const dbl = src[i + 1] === "$";
        const open = dbl ? 2 : 1;
        let e = i + open;
        while (e < src.length && !(src[e] === "$" && src[e - 1] !== "\\")) e++;
        if (e >= src.length) this.warn("A $ is missing its closing $.");
        runs.push({ math: src.slice(i + open, e).trim(), s: { ...style }, display: dbl });
        i = e + open;
        continue;
      }
      if (c === "{") {
        const [a, e] = braced(src, i);
        addAll(this.inline(a, style));
        i = e;
        continue;
      }
      if (c === "}") {
        i++;
        continue;
      }
      if (c === "~") {
        push(" ");
        i++;
        continue;
      }
      if (src.startsWith("---", i)) {
        push("—");
        i += 3;
        continue;
      }
      if (src.startsWith("--", i)) {
        push("–");
        i += 2;
        continue;
      }
      if (src.startsWith("``", i)) {
        push("“");
        i += 2;
        continue;
      }
      if (src.startsWith("''", i)) {
        push("”");
        i += 2;
        continue;
      }
      if (c === "`") {
        push("‘");
        i++;
        continue;
      }
      if (c === "'") {
        push("’");
        i++;
        continue;
      }
      push(/\s/.test(c) ? " " : c);
      i++;
    }
    return runs;
  }

  setLabel(key) {
    this.labels[key] = this.last;
  }

  // ---- blocks ----
  blocks(src, ctx = {}) {
    const out = [];
    let para = "";
    const flush = () => {
      const t = para.trim();
      para = "";
      if (!t) return;
      const runs = this.inline(t, ctx.style);
      if (!runs.some((r) => r.hfill || r.br || r.math || (r.text ?? "").trim())) return;
      out.push({ k: "p", runs, align: ctx.align, noindent: ctx.noindent ?? /^\s*\\noindent/.test(t) });
    };
    let i = 0;
    while (i < src.length) {
      if (src[i] === "\n") {
        const m = src.slice(i).match(/^\n[ \t]*\n\s*/);
        if (m) {
          flush();
          i += m[0].length;
          continue;
        }
      }
      if (src[i] === "$" && src[i + 1] === "$") {
        const e = src.indexOf("$$", i + 2);
        flush();
        out.push({ k: "eq", tex: src.slice(i + 2, e < 0 ? src.length : e).trim() });
        i = e < 0 ? src.length : e + 2;
        continue;
      }
      if (src[i] === "\\") {
        if (src[i + 1] === "[") {
          const e = src.indexOf("\\]", i);
          flush();
          out.push({ k: "eq", tex: src.slice(i + 2, e < 0 ? src.length : e).trim() });
          i = e < 0 ? src.length : e + 2;
          continue;
        }
        const m = src.slice(i).match(/^\\([a-zA-Z]+\*?)/);
        if (m) {
          const name = m[1];
          let p = i + m[0].length;
          if (name === "begin") {
            const [env, e0] = oneArg(src, p);
            const [body, after] = this.envBody(src, env, e0);
            flush();
            this.env(env, body, out, ctx);
            i = after;
            continue;
          }
          const lvl = { part: 1, chapter: 1, section: 1, subsection: 2, subsubsection: 3, paragraph: 4, subparagraph: 4 }[name.replace("*", "")];
          if (lvl) {
            const q = skipWs(src, p);
            if (src[q] === "[") p = bracketed(src, q)[1];
            const [title, e] = oneArg(src, p);
            flush();
            out.push(this.heading(lvl, name.endsWith("*"), title));
            i = e;
            continue;
          }
          if (name === "maketitle" || name === "titlepage") {
            flush();
            out.push({ k: "title" });
            i = p;
            continue;
          }
          if (name === "tableofcontents") {
            flush();
            out.push({ k: "toc" });
            i = p;
            continue;
          }
          if (name === "newpage" || name === "clearpage" || name === "cleardoublepage" || name === "pagebreak") {
            flush();
            out.push({ k: "newpage" });
            i = p;
            continue;
          }
          if (name === "bigskip" || name === "medskip" || name === "smallskip") {
            flush();
            out.push({ k: "space", pt: { bigskip: 12, medskip: 6, smallskip: 3 }[name] });
            i = p;
            continue;
          }
          if (name === "vspace" || name === "vspace*") {
            const [a, e] = oneArg(src, p);
            flush();
            out.push({ k: "space", pt: toPt(a) });
            i = e;
            continue;
          }
          if (name === "hrule" || name === "hline") {
            flush();
            out.push({ k: "rule" });
            i = p;
            continue;
          }
          if (name === "rule") {
            let e = p;
            if (src[skipWs(src, e)] === "[") e = bracketed(src, skipWs(src, e))[1];
            e = oneArg(src, e)[1];
            e = oneArg(src, e)[1];
            flush();
            out.push({ k: "rule" });
            i = e;
            continue;
          }
          if (name === "bibliography" || name === "printbibliography") {
            this.warn("BibTeX files are not read. List references in a thebibliography environment instead.");
            i = name === "bibliography" ? oneArg(src, p)[1] : p;
            continue;
          }
          if (name === "caption" && ctx.onCaption) {
            const [c, e] = oneArg(src, p);
            flush();
            ctx.onCaption(c);
            i = e;
            continue;
          }
        }
        // Anything else is inline: copy the command through so the inline reader handles it.
        const tok = src.slice(i).match(/^\\([a-zA-Z]+\*?|.)/s);
        para += tok[0];
        i += tok[0].length;
        continue;
      }
      para += src[i];
      i++;
    }
    flush();
    return out;
  }

  heading(level, star, title) {
    let num = "";
    if (!star && level <= 3) {
      const c = this.counters;
      if (level === 1) {
        c.section++;
        c.subsection = c.subsubsection = 0;
        num = `${c.section}`;
      } else if (level === 2) {
        c.subsection++;
        c.subsubsection = 0;
        num = `${c.section}.${c.subsection}`;
      } else {
        c.subsubsection++;
        num = `${c.section}.${c.subsection}.${c.subsubsection}`;
      }
      this.last = num;
    }
    const runs = this.inline(title);
    const h = { k: "h", level, num, runs };
    if (level <= 2) this.toc.push(h);
    return h;
  }

  envBody(src, env, from) {
    const open = `\\begin{${env}}`;
    const close = `\\end{${env}}`;
    let depth = 1;
    let p = from;
    while (p < src.length) {
      const a = src.indexOf(open, p);
      const b = src.indexOf(close, p);
      if (b < 0) {
        this.log.push({ level: "error", msg: `\\begin{${env}} has no matching \\end{${env}}.` });
        return [src.slice(from), src.length];
      }
      if (a >= 0 && a < b) {
        depth++;
        p = a + open.length;
      } else {
        depth--;
        p = b + close.length;
        if (depth === 0) return [src.slice(from, b), p];
      }
    }
    return [src.slice(from), src.length];
  }

  mathBlock(env, body, out) {
    const star = env.endsWith("*") || env === "displaymath";
    const base = env.replace("*", "");
    const lines = /\\\\/.test(body) && base !== "equation" && base !== "multline";
    let tex = body;
    const labelled = [...tex.matchAll(/\\label\{([^}]*)\}/g)].map((m) => m[1]);
    tex = tex.replace(/\\label\{[^}]*\}/g, "").replace(/\\nonumber|\\notag/g, "").trim();
    if (base === "align" || base === "flalign" || base === "alignat" || base === "eqnarray") tex = `\\begin{aligned}${base === "alignat" ? tex.replace(/^\{\d+\}/, "") : tex.replace(/&\s*=\s*&/g, "&=")}\\end{aligned}`;
    else if (base === "gather") tex = `\\begin{gathered}${tex}\\end{gathered}`;
    else if (base === "multline") tex = `\\begin{gathered}${tex}\\end{gathered}`;
    let num = "";
    if (!star) {
      const n = lines ? (tex.match(/\\\\/g) || []).length + 1 : 1;
      const first = this.counters.equation + 1;
      this.counters.equation += n;
      num = n > 1 ? `${first}–${this.counters.equation}` : `${first}`;
      this.last = `${first}`;
    }
    labelled.forEach((l) => this.setLabel(l));
    out.push({ k: "eq", tex, num });
  }

  env(env, body, out, ctx) {
    if (MATH_ENVS.has(env)) return this.mathBlock(env, body, out);
    if (env === "itemize" || env === "enumerate" || env === "description") {
      const opt = body.match(/^\s*\[[^\]]*\]/);
      return out.push({ k: "list", kind: env, items: this.items(opt ? body.slice(opt[0].length) : body, ctx) });
    }
    if (env === "center" || env === "flushleft" || env === "flushright") {
      const align = { center: "center", flushleft: "left", flushright: "right" }[env];
      return out.push(...this.blocks(body, { ...ctx, align, noindent: true }));
    }
    if (env === "abstract") return out.push({ k: "abstract", blocks: this.blocks(body, { ...ctx, noindent: true }) });
    if (env === "quote" || env === "quotation" || env === "verse") return out.push({ k: "quote", blocks: this.blocks(body, { ...ctx, noindent: true }) });
    if (env === "verbatim" || env === "lstlisting") return out.push({ k: "verb", text: body.replace(/^(\[[^\]]*\])?\n/, "").replace(/\n$/, "") });
    if (env === "tabular" || env === "tabularx" || env === "tabular*") return out.push(this.tabular(env, body));
    if (env === "table" || env === "figure" || env === "table*" || env === "figure*") return this.float(env.replace("*", ""), body, out, ctx);
    if (env === "thebibliography") {
      const items = [];
      const rest = body.replace(/^\s*\{[^}]*\}/, "");
      const chunks = rest.split(/\\bibitem/).slice(1);
      chunks.forEach((c, n) => {
        const m = c.match(/^(?:\[[^\]]*\])?\s*\{([^}]*)\}/);
        if (m) {
          this.labels[`bib:${m[1]}`] = n + 1;
          items.push({ label: `[${n + 1}]`, blocks: this.blocks(c.slice(m[0].length), { ...ctx, noindent: true }) });
        }
      });
      out.push({ k: "h", level: 1, num: "", runs: [{ text: "References", s: {} }] });
      return out.push({ k: "list", kind: "bib", items });
    }
    if (env === "proof") {
      const inner = this.blocks(body, { ...ctx, noindent: true });
      if (inner[0]?.k === "p") inner[0].runs.unshift({ text: "Proof. ", s: { i: true } });
      inner.push({ k: "p", runs: [{ hfill: true }, { math: "\\square", s: {} }], noindent: true });
      return out.push(...inner);
    }
    if (this.theorems[env]) {
      const th = this.theorems[env];
      th.n++;
      this.last = String(th.n);
      const opt = body.match(/^\s*\[([^\]]*)\]/);
      const text = opt ? body.slice(opt[0].length) : body;
      const inner = this.blocks(text, { ...ctx, noindent: true, style: { i: true } });
      const head = { text: `${th.name} ${th.n}${opt ? ` (${opt[1]})` : ""}. `, s: { b: true } };
      if (inner[0]?.k === "p") inner[0].runs.unshift(head);
      else inner.unshift({ k: "p", runs: [head], noindent: true });
      return out.push(...inner);
    }
    if (env === "frame") {
      let text = body;
      const t = text.match(/^\s*\{/);
      let title = "";
      if (t) {
        const [a, e] = braced(text, t[0].length - 1);
        title = a;
        text = text.slice(e);
      }
      const ft = text.match(/\\frametitle\{([^}]*)\}/);
      if (ft) {
        title = ft[1];
        text = text.replace(ft[0], "");
      }
      out.push({ k: "newpage" });
      if (title) out.push({ k: "h", level: 2, num: "", runs: this.inline(title) });
      return out.push(...this.blocks(text, { ...ctx, noindent: true }));
    }
    if (env === "document") return out.push(...this.blocks(body, ctx));
    const known = ["minipage", "multicols", "small", "footnotesize", "large", "Large", "landscape", "spacing", "singlespace", "titlepage", "wrapfigure", "adjustbox", "block", "columns", "column"];
    if (!known.includes(env)) this.warn(`Environment '${env}' is not supported; its contents were kept as plain text.`);
    else if (env === "multicols") this.warn("Multiple columns are set as a single column.");
    const cleaned = body.replace(/^\s*(\[[^\]]*\])?(\{[^}]*\})?/, "");
    out.push(...this.blocks(cleaned, ctx));
  }

  float(kind, body, out, ctx) {
    const parts = [];
    let caption = null;
    const cleaned = body.replace(/^\s*\[[^\]]*\]/, "").replace(/\\centering/g, "");
    const inner = this.blocks(cleaned, { ...ctx, noindent: true, align: "center", onCaption: (c) => (caption = c) });
    parts.push(...inner);
    if (caption !== null) {
      const n = ++this.counters[kind];
      this.last = String(n);
      const runs = [{ text: `${kind === "table" ? "Table" : "Figure"} ${n}: `, s: { b: true } }, ...this.inline(caption)];
      const cap = { k: "p", runs, align: "center", noindent: true, caption: true };
      if (kind === "table") out.push(cap, ...parts);
      else out.push(...parts, cap);
    } else out.push(...parts);
    for (const m of cleaned.matchAll(/\\label\{([^}]*)\}/g)) this.setLabel(m[1]);
  }

  items(body, ctx) {
    const items = [];
    const chunks = splitItems(body);
    for (const c of chunks) {
      let t = c;
      let label = null;
      const m = t.match(/^\s*\[/);
      if (m) {
        const [o, e] = bracketed(t, m[0].length - 1);
        label = o;
        t = t.slice(e);
      }
      items.push({ label: label === null ? null : this.inline(label), blocks: this.blocks(t, { ...ctx, noindent: true, align: undefined }) });
    }
    return items;
  }

  tabular(env, body) {
    let src = body;
    if (env !== "tabular") src = src.replace(/^\s*\{[^}]*\}/, "");
    src = src.replace(/^\s*\[[a-z]\]/, "");
    const specM = src.match(/^\s*\{/);
    let spec = "";
    if (specM) {
      const [s, e] = braced(src, specM[0].length - 1);
      spec = s;
      src = src.slice(e);
    }
    const { cols, vlines } = parseSpec(spec);
    const rows = [];
    const hl = {};
    const lines = splitRows(src);
    for (let line of lines) {
      let rule = 0;
      const strip = () => {
        let again = true;
        while (again) {
          again = false;
          const m = line.match(/^\s*\\(hline|toprule|midrule|bottomrule|cmidrule(?:\([^)]*\))?\{[^}]*\}|cline\{[^}]*\}|addlinespace(?:\[[^\]]*\])?|rowcolor\{[^}]*\})/);
          if (m) {
            if (/toprule|bottomrule/.test(m[1])) rule = Math.max(rule, 1);
            else if (/hline|midrule|cmidrule|cline/.test(m[1])) rule = Math.max(rule, 0.6);
            line = line.slice(m[0].length);
            again = true;
          }
        }
      };
      strip();
      if (rule) hl[rows.length] = rule;
      if (!line.trim()) continue;
      const cells = splitCells(line).map((c) => {
        let t = c.trim();
        let span = 1;
        let align = null;
        const mc = t.match(/^\\multicolumn\s*\{(\d+)\}\s*\{([^}]*)\}\s*\{/);
        if (mc) {
          span = Number(mc[1]);
          align = /c/.test(mc[2]) ? "center" : /r/.test(mc[2]) ? "right" : "left";
          t = braced(t, mc[0].length - 1)[0];
        }
        return { runs: this.inline(t.replace(/\\multirow\s*\{[^}]*\}\s*\{[^}]*\}\s*\{([^}]*)\}/, "$1")), span, align };
      });
      rows.push(cells);
    }
    return { k: "table", cols, vlines, rows, hl };
  }
}

function parseSpec(spec) {
  const cols = [];
  const vlines = new Set();
  const s = spec.replace(/@\{[^}]*\}|!\{[^}]*\}|>\{[^}]*\}|<\{[^}]*\}/g, "").replace(/\*\{(\d+)\}\{([^}]*)\}/g, (_, n, x) => x.repeat(Number(n)));
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "|") vlines.add(cols.length);
    else if ("lcr".includes(c)) cols.push({ align: { l: "left", c: "center", r: "right" }[c] });
    else if ("pmbX".includes(c)) {
      if (s[i + 1] === "{") {
        const [w, e] = braced(s, i + 1);
        cols.push({ align: "left", width: toPt(w) });
        i = e - 1;
      } else cols.push({ align: "left", flex: true });
    }
  }
  return { cols, vlines };
}

function splitTop(src, test) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "\\") {
      const hit = test(src, i, depth);
      if (hit) {
        parts.push(cur);
        cur = "";
        i += hit - 1;
        continue;
      }
      cur += c + (src[i + 1] ?? "");
      i++;
      continue;
    }
    if (c === "{") depth++;
    if (c === "}") depth--;
    const hit = test(src, i, depth);
    if (hit) {
      parts.push(cur);
      cur = "";
      i += hit - 1;
      continue;
    }
    cur += c;
  }
  parts.push(cur);
  return parts;
}
const splitRows = (s) => splitTop(s, (t, i, d) => (d === 0 && t[i] === "\\" && t[i + 1] === "\\" ? 2 : 0));
const splitCells = (s) => splitTop(s, (t, i, d) => (d === 0 && t[i] === "&" ? 1 : 0));

function splitItems(body) {
  const parts = [];
  let depth = 0;
  let start = -1;
  const re = /\\begin\{(?:itemize|enumerate|description)\}|\\end\{(?:itemize|enumerate|description)\}|\\item(?![a-zA-Z])/g;
  let m;
  while ((m = re.exec(body))) {
    if (m[0].startsWith("\\begin")) depth++;
    else if (m[0].startsWith("\\end")) depth--;
    else if (depth === 0) {
      if (start >= 0) parts.push(body.slice(start, m.index));
      start = m.index + m[0].length;
    }
  }
  if (start >= 0) parts.push(body.slice(start));
  return parts;
}

export function toPt(s) {
  const m = String(s).match(/(-?[\d.]+)\s*(pt|mm|cm|in|em|ex|bp)?/);
  if (!m) return 6;
  const v = Number(m[1]);
  return Math.round(v * ({ pt: 1, bp: 1, mm: 2.835, cm: 28.35, in: 72, em: 10, ex: 4.5 }[m[2] || "pt"] ?? 1));
}

/** Parse a .tex source. Returns { meta, blocks, notes, toc, log }. */
export function parseLatex(source) {
  const log = [];
  const clean = stripComments(String(source || "").replace(/\r\n?/g, "\n"));
  const text = expandMacros(clean, log);
  const docStart = text.indexOf("\\begin{document}");
  const docEnd = text.lastIndexOf("\\end{document}");
  if (docStart >= 0 && docEnd < 0) log.push({ level: "error", msg: "\\begin{document} has no \\end{document}. Compiled to the end of the file." });
  const preamble = docStart >= 0 ? text.slice(0, docStart) : "";
  const body = docStart >= 0 ? text.slice(docStart + 16, docEnd < 0 ? text.length : docEnd) : text;

  const meta = { paper: "a4", size: 10, margin: null, title: null, author: null, date: null, cls: "article", twocolumn: false };
  const cm = preamble.match(/\\documentclass\s*(?:\[([^\]]*)\])?\s*\{([^}]*)\}/);
  if (cm) {
    meta.cls = cm[2];
    const o = cm[1] || "";
    if (/letterpaper/.test(o)) meta.paper = "letter";
    if (/a5paper/.test(o)) meta.paper = "a5";
    const sz = o.match(/(\d+)pt/);
    if (sz) meta.size = Number(sz[1]);
    if (/twocolumn/.test(o)) log.push({ level: "warn", msg: "twocolumn is not supported; the document is set in one column." });
    if (!["article", "report", "book", "letter", "beamer", "memoir", "extarticle", "amsart", "scrartcl"].includes(meta.cls)) log.push({ level: "warn", msg: `Document class '${meta.cls}' is not available; article layout was used.` });
  } else if (docStart >= 0) log.push({ level: "warn", msg: "No \\documentclass found; article layout was used." });
  const geo = preamble.match(/\\usepackage\[([^\]]*)\]\{geometry\}/) || preamble.match(/\\geometry\{([^}]*)\}/);
  if (geo) {
    const mm = geo[1].match(/(?:^|[,\s])margin\s*=\s*([\d.]+\s*\w+)/);
    if (mm) meta.margin = toPt(mm[1]);
    if (/letterpaper/.test(geo[1])) meta.paper = "letter";
    if (/a4paper/.test(geo[1])) meta.paper = "a4";
  }
  for (const m of preamble.matchAll(/\\usepackage(?:\[[^\]]*\])?\{([^}]*)\}/g))
    for (const p of m[1].split(",").map((x) => x.trim()))
      if (p && !HARMLESS_PKG.has(p)) log.push({ level: "warn", msg: `Package '${p}' is not available. Its commands may be skipped.` });

  const r = new Reader(log);
  for (const m of preamble.matchAll(/\\newtheorem\*?\{([^}]*)\}(?:\[[^\]]*\])?\{([^}]*)\}/g)) r.theorems[m[1]] = { name: m[2], n: 0 };
  const field = (name) => {
    const k = preamble.search(new RegExp(`\\\\${name}\\s*[\\[{]`));
    if (k < 0) return null;
    let p = k + name.length + 1;
    p = skipWs(preamble, p);
    if (preamble[p] === "[") p = skipWs(preamble, bracketed(preamble, p)[1]);
    return braced(preamble, p)[0];
  };

  // Two passes so \ref and \cite can point forward, as they do after LaTeX's second run.
  const quiet = log.length;
  r.blocks(body);
  log.length = quiet;
  const labels = r.labels;
  const thCount = Object.fromEntries(Object.keys(r.theorems).map((k) => [k, 0]));
  r.counters = { section: 0, subsection: 0, subsubsection: 0, equation: 0, table: 0, figure: 0, footnote: 0 };
  r.toc = [];
  r.notes = [];
  r.warned = new Set();
  r.labels = labels;
  r.final = true;
  for (const k of Object.keys(thCount)) r.theorems[k].n = 0;

  for (const k of ["title", "author", "date"]) {
    const v = field(k);
    if (v !== null) meta[k] = v;
  }
  const inlineMeta = {};
  for (const k of ["title", "author", "date"]) {
    const v = meta[k];
    inlineMeta[k] = v === null ? null : v.split(/\\and|\\\\/).map((x) => r.inline(x.trim()));
  }
  const blocks = r.blocks(body);
  return { meta: { ...meta, inline: inlineMeta }, blocks, notes: r.notes, toc: r.toc, log };
}
