// Pure generators and the code formatter. No TeX engine needed, so these load fast.
const FENCES = {
  bmatrix: ["\\begin{bmatrix}", "\\end{bmatrix}"],
  pmatrix: ["\\begin{pmatrix}", "\\end{pmatrix}"],
  vmatrix: ["\\begin{vmatrix}", "\\end{vmatrix}"],
  Vmatrix: ["\\begin{Vmatrix}", "\\end{Vmatrix}"],
  Bmatrix: ["\\begin{Bmatrix}", "\\end{Bmatrix}"],
  matrix: ["\\begin{matrix}", "\\end{matrix}"],
};

export const MATRIX_FILLS = {
  zero: () => "0",
  identity: (r, c) => (r === c ? "1" : "0"),
  symbolic: (r, c, name) => `${name}_{${r + 1}${c + 1}}`,
  blank: () => "",
};

/** Matrix source. cells is a 2-D array of strings. With `dots`, the middle row and column become \cdots etc. */
export function matrixLatex(cells, { env = "bmatrix", pad = true } = {}) {
  const [open, close] = FENCES[env] || FENCES.bmatrix;
  const rows = cells.map((r) => r.map((c) => c.trim() || "{}"));
  const widths = [];
  rows.forEach((r) => r.forEach((c, i) => (widths[i] = Math.max(widths[i] || 0, c.length))));
  const lines = rows.map((r) => r.map((c, i) => (pad ? c.padEnd(widths[i]) : c)).join(" & ").trimEnd());
  return `${open}\n${lines.map((l, i) => `  ${l}${i < lines.length - 1 ? " \\\\" : ""}`).join("\n")}\n${close}`;
}

/** Read rows from pasted spreadsheet text, CSV, or an existing LaTeX table body. */
export function parseGrid(text) {
  const t = String(text || "").replace(/\r\n?/g, "\n").replace(/\n+$/, "");
  if (!t.trim()) return [];
  if (/\\\\|(?<!\\)&/.test(t) && !t.includes("\t")) {
    return t
      .replace(/\\(hline|toprule|midrule|bottomrule)/g, "")
      .split(/\\\\/)
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => r.split(/(?<!\\)&/).map((c) => c.trim()));
  }
  const delim = t.includes("\t") ? "\t" : t.includes(",") ? "," : /;/.test(t) ? ";" : null;
  return t.split("\n").map((line) => {
    if (!delim) return [line.trim()];
    if (delim !== ",") return line.split(delim).map((c) => c.trim());
    const out = [];
    let cur = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) {
        if (c === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (c === '"') q = false;
        else cur += c;
      } else if (c === '"') q = true;
      else if (c === ",") {
        out.push(cur.trim());
        cur = "";
      } else cur += c;
    }
    out.push(cur.trim());
    return out;
  });
}

/** Escape text for LaTeX, leaving $...$ maths and existing commands alone. */
export function escapeCell(s) {
  return String(s ?? "")
    .split(/(\$[^$]*\$)/)
    .map((part, i) => (i % 2 ? part : part.replace(/(?<!\\)([%&#_])/g, "\\$1")))
    .join("");
}

export function tableLatex(rows, opts = {}) {
  const { aligns = [], style = "booktabs", header = true, caption = "", label = "", float: isFloat = true, escape = true, placement = "htbp", center = true } = opts;
  const cols = Math.max(1, ...rows.map((r) => r.length));
  const al = (i) => aligns[i] || "l";
  const spec = style === "grid" ? `|${Array.from({ length: cols }, (_, i) => al(i)).join("|")}|` : Array.from({ length: cols }, (_, i) => al(i)).join("");
  const cell = (c) => (escape ? escapeCell(c) : String(c ?? ""));
  const norm = rows.map((r) => Array.from({ length: cols }, (_, i) => cell(r[i])));
  const widths = [];
  norm.forEach((r) => r.forEach((c, i) => (widths[i] = Math.max(widths[i] || 0, c.length))));
  const fmt = (r) => `${r.map((c, i) => c.padEnd(widths[i])).join(" & ")} \\\\`;
  const lines = [];
  const top = { booktabs: "\\toprule", grid: "\\hline", lines: "\\hline", plain: "" }[style];
  const mid = { booktabs: "\\midrule", grid: "\\hline", lines: "\\hline", plain: "" }[style];
  const bot = { booktabs: "\\bottomrule", grid: "\\hline", lines: "\\hline", plain: "" }[style];
  if (top) lines.push(top);
  norm.forEach((r, i) => {
    lines.push(fmt(r));
    if (i < norm.length - 1 && ((header && i === 0 && mid) || style === "grid")) lines.push(mid);
  });
  if (bot) lines.push(bot);
  const tab = `\\begin{tabular}{${spec}}\n${lines.map((l) => `  ${l}`).join("\n")}\n\\end{tabular}`;
  if (!isFloat) return tab;
  const body = [center ? "\\centering" : "", caption ? `\\caption{${cell(caption)}}` : "", label ? `\\label{${label}}` : "", tab].filter(Boolean).join("\n").split("\n").map((l) => `  ${l}`).join("\n");
  return `\\begin{table}[${placement}]\n${body}\n\\end{table}`;
}

// ---- formatter ----

const ALIGN_ENVS = /^(tabular\*?|tabularx|array|matrix|[pbBvV]matrix|smallmatrix|cases|align\*?|aligned|alignat\*?|alignedat|flalign\*?|split|eqnarray\*?)$/;

/** Column-align the & separators of a block of rows. */
function alignRows(lines) {
  const rows = lines.map((l) => {
    const m = l.match(/^(.*?)(\s*\\\\(?:\[[^\]]*\])?\s*)?$/);
    return { cells: m[1].split(/(?<!\\)&/).map((c) => c.trim()), end: m[2] ? ` ${m[2].trim()}` : "" };
  });
  const widths = [];
  rows.forEach((r) => r.cells.forEach((c, i) => (widths[i] = Math.max(widths[i] || 0, c.length))));
  return rows.map((r) => r.cells.map((c, i) => (i < r.cells.length - 1 ? c.padEnd(widths[i]) : c)).join(" & ") + r.end);
}

/** Pretty-print LaTeX source. Options: indent width, alignTables, oneItem, blankLines, wrap commands. */
export function formatLatex(source, opts = {}) {
  const { indent = 2, alignTables = true, sectionGap = true, splitLines = true } = opts;
  const pad = " ".repeat(indent);
  const raw = String(source || "").replace(/\r\n?/g, "\n").replace(/\t/g, "    ");

  // Protect verbatim blocks, then put every \begin, \end and \item on its own line.
  const kept = [];
  let text = raw.replace(/\\begin\{(verbatim\*?|lstlisting|minted|comment)\}[\s\S]*?\\end\{\1\}/g, (m) => {
    kept.push(m);
    return `\u0000${kept.length - 1}\u0000`;
  });
  if (splitLines) {
    const atStart = /(^|\n)[ \t]*$/;
    text = text.replace(/\\(begin|end)\{[^}]+\}(\[[^\]]*\])?(\{[^{}]*\})?/g, (m, kind, _a, _b, offset, str) => {
      const before = str.slice(0, offset);
      if (/(?<!\\)%[^\n]*$/.test(before) || /\\multicolumn|\$[^$\n]*$/.test(before.split("\n").pop())) return m;
      const lead = atStart.test(before) ? "" : "\n";
      const next = str[offset + m.length];
      return `${lead}${m}${next === undefined || next === "\n" ? "" : "\n"}`;
    });
    text = text.replace(/([^\s])[ \t]+\\item(?![a-zA-Z])/g, "$1\n\\item");
  }

  const lines = text.split("\n").map((l) => l.trim());
  const out = [];
  const stack = [];
  let blanks = 0;
  let pendingAlign = null;

  const flushAlign = () => {
    if (!pendingAlign) return;
    const { rows, level } = pendingAlign;
    const body = rows.filter((r) => !/^\\(hline|toprule|midrule|bottomrule|cmidrule|cline)/.test(r));
    const aligned = alignTables && body.length > 1 && body.some((r) => r.includes("&")) ? alignRows(body) : body;
    let k = 0;
    for (const r of rows) out.push(pad.repeat(level) + (/^\\(hline|toprule|midrule|bottomrule|cmidrule|cline)/.test(r) ? r : aligned[k++]));
    pendingAlign = null;
  };

  for (let line of lines) {
    if (!line) {
      flushAlign();
      if (++blanks <= 1 && out.length) out.push("");
      continue;
    }
    blanks = 0;
    const endM = line.match(/^\\end\{([^}]+)\}/);
    const beginM = line.match(/^\\begin\{([^}]+)\}/);
    const inAlign = stack.length && ALIGN_ENVS.test(stack[stack.length - 1]);
    if (inAlign && !endM && !beginM) {
      if (!pendingAlign) pendingAlign = { rows: [], level: stack.length };
      pendingAlign.rows.push(line);
      continue;
    }
    flushAlign();
    if (endM) {
      if (stack[stack.length - 1] === endM[1]) stack.pop();
      else {
        const at = stack.lastIndexOf(endM[1]);
        if (at >= 0) stack.length = at;
      }
    }
    if (sectionGap && /^\\(part|chapter|section|subsection)\*?[{[]/.test(line) && out.length && out[out.length - 1] !== "") out.push("");
    const item = /^\\(item|bibitem)(?![a-zA-Z])/.test(line);
    const inList = stack.length && /^(itemize|enumerate|description|thebibliography)$/.test(stack[stack.length - 1]);
    const level = stack.length;
    out.push(pad.repeat(inList && !item ? level + 1 : level) + line);
    if (beginM && !endM) {
      const same = new RegExp(`\\\\end\\{${beginM[1].replace(/[*]/g, "\\*")}\\}`).test(line);
      if (!same && beginM[1] !== "document") stack.push(beginM[1]);
    }
  }
  flushAlign();
  while (out.length && out[out.length - 1] === "") out.pop();
  const unbalanced = stack.length ? stack : null;
  const result = out.join("\n").replace(/^[ \t]*\u0000(\d+)\u0000/gm, (_, i) => kept[i]).replace(/\u0000(\d+)\u0000/g, (_, i) => kept[i]);
  return { text: result, unbalanced };
}

