// Image to LaTeX without a server or a model download. The image is cut into symbols (connected components),
// each symbol is compared with reference shapes drawn from the TeX font, and the positions of the symbols
// decide the structure: fractions, roots, superscripts, subscripts and limits.
// It reads clean, typeset equations. Handwriting needs a trained model, which this deliberately is not.

const GRID = 18;

const R = String.raw;
const ROMAN_LOWER = "abcdefghijklmnopqrstuvwxyz".split("");
const ROMAN_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** [tex to draw, tex to output]. */
export const TEMPLATE_SPECS = [
  ..."0123456789".split("").map((d) => [d, d]),
  ...ROMAN_LOWER.map((c) => [c, c]),
  ...ROMAN_UPPER.map((c) => [c, c]),
  ...ROMAN_LOWER.map((c) => [`\\mathrm{${c}}`, c]),
  ...ROMAN_UPPER.map((c) => [`\\mathrm{${c}}`, c]),
  ...["alpha", "beta", "gamma", "delta", "epsilon", "varepsilon", "zeta", "eta", "theta", "lambda", "mu", "nu", "xi", "pi", "rho", "sigma", "tau", "phi", "varphi", "chi", "psi", "omega", "Gamma", "Delta", "Theta", "Lambda", "Xi", "Pi", "Sigma", "Phi", "Psi", "Omega"].map((g) => [`\\${g}`, `\\${g}`]),
  ["+", "+"], ["=", "="], ["-", "-"], ["\\times", "\\times"], ["\\div", "\\div"], ["\\pm", "\\pm"], ["<", "<"], [">", ">"], ["\\leq", "\\leq"], ["\\geq", "\\geq"], ["\\neq", "\\neq"], ["\\approx", "\\approx"], ["\\equiv", "\\equiv"],
  ["\\rightarrow", "\\to"], ["\\Rightarrow", "\\Rightarrow"], ["\\infty", "\\infty"], ["\\partial", "\\partial"], ["\\nabla", "\\nabla"], ["\\in", "\\in"], ["\\forall", "\\forall"], ["\\exists", "\\exists"],
  ["(", "("], [")", ")"], ["[", "["], ["]", "]"], ["\\{", "\\{"], ["\\}", "\\}"], ["|", "|"], ["/", "/"], [",", ","], [";", ";"], [":", ":"], ["!", "!"], ["'", "'"],
  [R`\displaystyle\sum`, "\\sum"], [R`\displaystyle\prod`, "\\prod"], [R`\displaystyle\int`, "\\int"], [R`\textstyle\sum`, "\\sum"], [R`\textstyle\prod`, "\\prod"], [R`\textstyle\int`, "\\int"], [R`\displaystyle\oint`, "\\oint"],
];

const LETTER_LIKE = new Set("cCoOsSuUvVwWxXzZpP".split(""));
const X_HEIGHT = new Set("acemnorsuvwxz".split(""));
const DESC = new Set("gpqy".split(""));
const SHORT_GREEK = new Set(["\\alpha", "\\epsilon", "\\varepsilon", "\\mu", "\\nu", "\\pi", "\\sigma", "\\tau", "\\omega", "\\gamma", "\\eta", "\\rho", "\\chi", "\\varphi"]);
const OPERATORS = new Set(["+", "-", "=", "<", ">", "\\times", "\\div", "\\pm", "\\leq", "\\geq", "\\neq", "\\approx", "\\equiv", "\\to", "\\Rightarrow", "\\in", "/"]);
const BIG = new Set(["\\sum", "\\prod"]);
const INTEGRAL = new Set(["\\int", "\\oint"]);
const FUNCS = ["arcsin", "arccos", "arctan", "sinh", "cosh", "tanh", "sin", "cos", "tan", "cot", "sec", "csc", "log", "exp", "lim", "max", "min", "det", "ln"];

// ---- raster helpers ----

function otsu(gray) {
  const hist = new Array(256).fill(0);
  for (const v of gray) hist[v]++;
  const total = gray.length;
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0,
    wB = 0,
    best = 0,
    t = 128;
  for (let i = 0; i < 256; i++) {
    wB += hist[i];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += i * hist[i];
    const d = wB * wF * (sumB / wB - (sum - sumB) / wF) ** 2;
    if (d > best) {
      best = d;
      t = i;
    }
  }
  return t;
}

function resize(gray, w, h, W, H) {
  const out = new Uint8ClampedArray(W * H);
  for (let y = 0; y < H; y++) {
    const fy = ((y + 0.5) * h) / H - 0.5;
    const y0 = Math.max(0, Math.floor(fy));
    const y1 = Math.min(h - 1, y0 + 1);
    const ty = Math.max(0, fy - y0);
    for (let x = 0; x < W; x++) {
      const fx = ((x + 0.5) * w) / W - 0.5;
      const x0 = Math.max(0, Math.floor(fx));
      const x1 = Math.min(w - 1, x0 + 1);
      const tx = Math.max(0, fx - x0);
      const a = gray[y0 * w + x0] * (1 - tx) + gray[y0 * w + x1] * tx;
      const b = gray[y1 * w + x0] * (1 - tx) + gray[y1 * w + x1] * tx;
      out[y * W + x] = a * (1 - ty) + b * ty;
    }
  }
  return out;
}

/** Ink mask (1 = ink) from an RGBA image, on a white or a dark background. Transparency counts as background. */
export function toInk({ data, width, height }) {
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < gray.length; i++) {
    const a = data[i * 4 + 3];
    const g = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    gray[i] = a >= 250 ? g : a === 0 ? 255 : (g * a + 255 * (255 - a)) / 255;
  }
  return { gray, width, height };
}

function binarize(gray, w, h) {
  const t = otsu(gray);
  let edge = 0,
    n = 0;
  for (let x = 0; x < w; x++) {
    edge += gray[x] + gray[(h - 1) * w + x];
    n += 2;
  }
  for (let y = 0; y < h; y++) {
    edge += gray[y * w] + gray[y * w + w - 1];
    n += 2;
  }
  const dark = edge / n < t;
  const ink = new Uint8Array(w * h);
  for (let i = 0; i < ink.length; i++) ink[i] = (dark ? gray[i] > t : gray[i] <= t) ? 1 : 0;
  return ink;
}

function components(ink, w, h) {
  const label = new Int32Array(w * h);
  const comps = [];
  const stack = [];
  for (let i = 0; i < ink.length; i++) {
    if (!ink[i] || label[i]) continue;
    const id = comps.length + 1;
    const c = { l: w, r: 0, t: h, b: 0, area: 0, px: [] };
    label[i] = id;
    stack.push(i);
    while (stack.length) {
      const p = stack.pop();
      const y = (p / w) | 0;
      const x = p - y * w;
      c.px.push(p);
      c.area++;
      if (x < c.l) c.l = x;
      if (x > c.r) c.r = x;
      if (y < c.t) c.t = y;
      if (y > c.b) c.b = y;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const X = x + dx;
          const Y = y + dy;
          if (X < 0 || Y < 0 || X >= w || Y >= h) continue;
          const q = Y * w + X;
          if (ink[q] && !label[q]) {
            label[q] = id;
            stack.push(q);
          }
        }
    }
    comps.push(c);
  }
  return comps;
}

/** Shrink any ink shape to a GRID x GRID vector of coverage, stretched to fill its box. */
function feature(px, l, t, r, b, w) {
  const W = r - l + 1;
  const H = b - t + 1;
  const v = new Float32Array(GRID * GRID);
  for (const p of px) {
    const y = ((p / w) | 0) - t;
    const x = p % w - l;
    const gx = Math.min(GRID - 1, Math.floor(((x + 0.5) * GRID) / W));
    const gy = Math.min(GRID - 1, Math.floor(((y + 0.5) * GRID) / H));
    v[gy * GRID + gx] += 1;
  }
  const cell = Math.max(1, ((W * H) / (GRID * GRID)));
  for (let i = 0; i < v.length; i++) v[i] = Math.min(1, v[i] / cell);
  // Blur lightly so a slightly different font or stroke weight still matches.
  const o = new Float32Array(v.length);
  for (let y = 0; y < GRID; y++)
    for (let x = 0; x < GRID; x++) {
      let s = 0,
        n = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++) {
          const X = x + dx;
          const Y = y + dy;
          if (X < 0 || Y < 0 || X >= GRID || Y >= GRID) continue;
          const k = dx === 0 && dy === 0 ? 4 : dx === 0 || dy === 0 ? 2 : 1;
          s += v[Y * GRID + X] * k;
          n += k;
        }
      o[y * GRID + x] = s / n;
    }
  let norm = 0;
  for (const a of o) norm += a * a;
  norm = Math.sqrt(norm) || 1;
  for (let i = 0; i < o.length; i++) o[i] /= norm;
  return o;
}

/** One reference shape from a picture of a single symbol ({ gray, width, height }). */
export function templateFromImage(img, tex) {
  const ink = binarize(img.gray, img.width, img.height);
  const px = [];
  let [l, t, r, b] = [img.width, img.height, 0, 0];
  for (let i = 0; i < ink.length; i++)
    if (ink[i]) {
      const y = (i / img.width) | 0;
      const x = i - y * img.width;
      px.push(i);
      l = Math.min(l, x);
      r = Math.max(r, x);
      t = Math.min(t, y);
      b = Math.max(b, y);
    }
  return px.length ? { tex, f: feature(px, l, t, r, b, img.width), aspect: (r - l + 1) / (b - t + 1) } : null;
}

/** Reference shapes from the TeX font. raster(svg) returns { gray, width, height } for an SVG string. */
export async function buildTemplates(texToSvg, raster) {
  const out = [];
  for (const [draw, tex] of TEMPLATE_SPECS) {
    const r = texToSvg(draw, { display: false });
    if (r.error || !r.svg) continue;
    const t = templateFromImage(await raster(r.svg), tex);
    if (t) out.push(t);
  }
  return out;
}

function classify(sym, templates, width) {
  const f = feature(sym.px, sym.l, sym.t, sym.r, sym.b, width);
  const aspect = sym.w / sym.h;
  let best = null,
    second = null;
  for (const T of templates) {
    let s = 0;
    for (let i = 0; i < f.length; i++) s += f[i] * T.f[i];
    s -= 0.22 * Math.abs(Math.log(aspect / T.aspect));
    if (!best || s > best.s) {
      if (best && best.tex !== T.tex) second = best;
      best = { tex: T.tex, s };
    } else if (T.tex !== best.tex && (!second || s > second.s)) second = { tex: T.tex, s };
  }
  return { tex: best.tex, conf: Math.max(0, Math.min(1, best.s)), alt: second?.tex };
}

// ---- symbols ----

const overlapX = (a, b) => Math.max(0, Math.min(a.r, b.r) - Math.max(a.l, b.l) + 1);
const box = (c) => ({ ...c, w: c.r - c.l + 1, h: c.b - c.t + 1, cx: (c.l + c.r) / 2, cy: (c.t + c.b) / 2 });
const isBar = (s) => s.w / s.h >= 2.6 && s.area / (s.w * s.h) > 0.7;
const isDot = (s, unit) => s.h <= unit * 0.3 && s.w <= unit * 0.3 && s.w / s.h < 2 && s.h / s.w < 2;

function merge(list, i, j) {
  const [a, b] = [list[i], list[j]];
  const m = box({ l: Math.min(a.l, b.l), r: Math.max(a.r, b.r), t: Math.min(a.t, b.t), b: Math.max(a.b, b.b), area: a.area + b.area, px: a.px.concat(b.px), merged: (a.merged || 1) + (b.merged || 1) });
  list.splice(Math.max(i, j), 1);
  list.splice(Math.min(i, j), 1);
  list.push(m);
}

/** Put split symbols back together: =, i, j, !, :, ;, the bar of ≤ and ≥, and ÷. */
function joinParts(list, unit) {
  let again = true;
  while (again) {
    again = false;
    outer: for (let i = 0; i < list.length; i++)
      for (let j = i + 1; j < list.length; j++) {
        const [a, b] = list[i].t <= list[j].t ? [list[i], list[j]] : [list[j], list[i]];
        const ov = overlapX(a, b);
        if (ov < 0.5 * Math.min(a.w, b.w)) continue;
        const gap = b.t - a.b;
        if (gap > unit * 0.75 || gap < -1) continue;
        const bothBars = isBar(a) && isBar(b) && Math.min(a.w, b.w) / Math.max(a.w, b.w) > 0.8;
        const dotOverStem = isDot(a, unit) && b.h > a.h * 1.5 && b.w < a.w * 5;
        const dotOverPunct = isDot(a, unit) && isDot(b, unit);
        const dotOverComma = isDot(a, unit) && b.h <= unit * 0.55 && b.w < unit * 0.3;
        const stemOverDot = isDot(b, unit) && a.h > b.h * 3 && a.w < b.w * 2.4;
        const barUnder = isBar(b) && !isBar(a) && Math.min(a.w, b.w) / Math.max(a.w, b.w) > 0.75 && a.h < unit * 1.15 && gap < unit * 0.5 && !list.some((s) => s !== a && s !== b && s.t > b.b && s.t - b.b < unit && overlapX(s, b) > 0);
        if (bothBars || dotOverStem || dotOverPunct || dotOverComma || stemOverDot || barUnder) {
          merge(list, i, j);
          again = true;
          break outer;
        }
      }
  }
  return list;
}

// ---- layout ----

function joinTex(parts) {
  let out = "";
  for (const p of parts) {
    if (!p) continue;
    if (/\\[a-zA-Z]+$/.test(out) && /^[a-zA-Z0-9]/.test(p)) out += " ";
    out += p;
  }
  return out;
}

function functionNames(tex) {
  // Only whole runs of plain letters are candidates, so "sin" inside \sigma is never touched.
  return tex.replace(/(?<![\\a-zA-Z])[a-zA-Z]{2,}/g, (run) => {
    let out = run;
    for (const f of FUNCS) out = out.replace(new RegExp(f, "g"), `\u0001${f}\u0002`);
    return out;
  }).replace(/\u0001([a-z]+)\u0002(?=[a-zA-Z0-9])/g, "\\$1 ").replace(/\u0001([a-z]+)\u0002/g, "\\$1");
}

/** Height of a letter in "full height" units, and its baseline, from which letter it is. */
function metrics(s) {
  const t = s.tex;
  if (X_HEIGHT.has(t) || SHORT_GREEK.has(t)) return { full: s.h / 0.62, base: DESC.has(t) || t === "\\rho" || t === "\\gamma" || t === "\\eta" || t === "\\chi" ? s.b - s.h * 0.25 : s.b };
  if (DESC.has(t)) return { full: s.h / 0.85, base: s.b - s.h * 0.27 };
  if (t === "j" || t === "f") return { full: s.h / 1.2, base: s.b - s.h * 0.17 };
  return { full: s.h, base: s.b };
}

function isAlnum(t) {
  return /^[a-zA-Z0-9]$/.test(t) || /^\\(alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|lambda|mu|nu|xi|pi|rho|sigma|tau|phi|varphi|chi|psi|omega|Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Phi|Psi|Omega|infty|partial)$/.test(t);
}

function line(items) {
  if (!items.length) return "";
  const list = [...items].sort((a, b) => a.l - b.l);
  const alnum = list.filter((s) => !s.composite && isAlnum(s.tex));
  const refs = alnum.map(metrics);
  const heights = list.filter((s) => s.composite).map((s) => s.textH || 0);
  const refH = Math.max(...refs.map((m) => m.full), ...heights, 0) || Math.max(...list.map((s) => s.h));
  const full = refs.filter((m) => m.full >= refH * 0.8).map((m) => m.base).sort((a, b) => a - b);
  const compBase = list.filter((s) => s.composite).map((s) => s.mid + refH * 0.3);
  const baseline = full.length ? full[full.length >> 1] : compBase.length ? compBase[0] : Math.max(...list.map((s) => s.b));
  const axis = baseline - refH * 0.28;

  const role = (s) => {
    if (s.composite) return s.mid < axis - refH * 0.55 ? "sup" : s.mid > axis + refH * 0.55 ? "sub" : "main";
    if (s.tex === "'") return "main";
    if (BIG.has(s.tex) || INTEGRAL.has(s.tex) || /^[()[\]|]$|^\\[{}]$/.test(s.tex)) {
      if (s.h >= refH * 0.8) return "main";
    }
    if (isAlnum(s.tex)) {
      const m = metrics(s);
      if (m.full >= refH * 0.8) return Math.abs(m.base - baseline) < refH * 0.35 ? "main" : m.base < baseline ? "sup" : "sub";
      return m.base < baseline - refH * 0.2 ? "sup" : "sub";
    }
    if (s.tex === "," || s.tex === "." || s.tex === ";") return s.cy > baseline + refH * 0.5 ? "sub" : s.cy < axis - refH * 0.5 ? "sup" : "main";
    if (OPERATORS.has(s.tex) || s.isDot) return s.cy < axis - refH * 0.32 ? "sup" : s.cy > axis + refH * 0.42 ? "sub" : "main";
    const c = s.cy;
    return c < axis - refH * 0.55 ? "sup" : c > axis + refH * 0.55 ? "sub" : "main";
  };

  const parts = [];
  let i = 0;
  while (i < list.length) {
    const s = list[i];
    const mainStart = role(s) === "main" || parts.length === 0;
    if (!mainStart) {
      i++;
      continue;
    }
    let tex = s.tex;
    if (s.tex === "\\sum" || s.tex === "\\prod") tex = s.tex;
    let j = i + 1;
    const sup = [];
    const sub = [];
    for (; j < list.length; j++) {
      const r = role(list[j]);
      if (r === "main") break;
      (r === "sup" ? sup : sub).push(list[j]);
    }
    if (s.limits) {
      if (s.limits.lo?.length) sub.unshift(...s.limits.lo);
      if (s.limits.hi?.length) sup.unshift(...s.limits.hi);
    }
    const script = (l, mark) => {
      if (!l.length) return "";
      const t = line(l);
      return `${mark}${/^(\\[a-zA-Z]+|.)$/.test(t) ? t : `{${t}}`}`;
    };
    parts.push(tex + script(sub, "_") + script(sup, "^"));
    i = j;
  }
  return functionNames(joinTex(parts));
}

function parse(syms, unit) {
  if (!syms.length) return "";
  let list = [...syms];

  // Roots first: a symbol whose box holds others, with a long bar along its top.
  for (const s of [...list].sort((a, b) => b.w * b.h - a.w * a.h)) {
    if (!list.includes(s) || !s.radical) continue;
    const inside = list.filter((o) => o !== s && o.cx > s.l && o.cx < s.r && o.cy > s.t && o.cy < s.b);
    if (!inside.length) continue;
    const inner = parse(inside, unit);
    list = list.filter((o) => o !== s && !inside.includes(o));
    list.push({ ...s, l: s.l, composite: true, tex: `\\sqrt{${inner}}`, mid: (s.t + s.b) / 2 + s.h * 0.08, textH: Math.min(s.h, unit) });
  }

  // Fractions, longest bar first so nested fractions resolve from the outside in.
  for (const s of [...list].filter((x) => !x.composite && isBar(x)).sort((a, b) => b.w - a.w)) {
    if (!list.includes(s)) continue;
    const inSpan = (o) => o !== s && o.cx >= s.l - 2 && o.cx <= s.r + 2;
    const above = list.filter((o) => inSpan(o) && o.b < s.t + 1);
    const below = list.filter((o) => inSpan(o) && o.t > s.b - 1);
    if (!above.length || !below.length) continue;
    const near = (l, up) => {
      // Only keep what belongs to this fraction: walk away from the bar and stop at a wide gap.
      const sorted = [...l].sort((a, b) => (up ? b.b - a.b : a.t - b.t));
      const keep = [];
      let edge = up ? s.t : s.b;
      for (const o of sorted) {
        const gap = up ? edge - o.b : o.t - edge;
        if (gap > unit * 1.1) break;
        keep.push(o);
        edge = up ? Math.min(edge, o.t) : Math.max(edge, o.b);
      }
      return keep;
    };
    const top = near(above, true);
    const bot = near(below, false);
    if (!top.length || !bot.length) continue;
    const tex = `\\frac{${parse(top, unit)}}{${parse(bot, unit)}}`;
    const used = new Set([s, ...top, ...bot]);
    list = list.filter((o) => !used.has(o));
    list.push({ l: s.l, r: s.r, t: Math.min(...top.map((o) => o.t)), b: Math.max(...bot.map((o) => o.b)), w: s.w, h: 1, cx: s.cx, cy: s.cy, composite: true, tex, mid: s.cy, textH: 0, area: s.area });
  }

  // Limits above and below big operators.
  for (const s of list.filter((x) => BIG.has(x.tex))) {
    const inSpan = (o) => o !== s && o.cx >= s.l - s.w * 0.4 && o.cx <= s.r + s.w * 0.4;
    const hi = list.filter((o) => inSpan(o) && o.b <= s.t + 1);
    const lo = list.filter((o) => inSpan(o) && o.t >= s.b - 1);
    if (hi.length || lo.length) {
      s.limits = { hi, lo };
      list = list.filter((o) => !hi.includes(o) && !lo.includes(o));
    }
  }

  return line(list);
}

/** Case and look-alike fixes that need the other symbols in the image. */
function refine(syms) {
  const sameLine = (a, b) => Math.abs(a.b - b.b) < Math.max(a.h, b.h) * 0.3;
  for (const s of syms) {
    if (!LETTER_LIKE.has(s.tex)) continue;
    // Compare with symbols of known height that share this baseline; script-sized digits do not count.
    const known = syms.filter((o) => o !== s && sameLine(o, s) && (/^[0-9A-Zbdfhklt]$/.test(o.tex) || X_HEIGHT.has(o.tex)) && !LETTER_LIKE.has(o.tex));
    const lower = s.tex.toLowerCase();
    const upper = s.tex.toUpperCase();
    if (!known.length) {
      s.tex = lower;
      continue;
    }
    const full = Math.max(...known.map((o) => (X_HEIGHT.has(o.tex) ? o.h / 0.62 : o.h)));
    s.tex = s.h >= full * 0.82 ? upper : lower;
  }
  // A round shape is a zero unless it sits against letters on its own line.
  const inLine = [...syms].sort((a, b) => a.l - b.l);
  inLine.forEach((s, i) => {
    if (s.tex !== "o" && s.tex !== "O") return;
    const close = (n) => n && /^[a-zA-Z]$/.test(n.tex) && sameLine(n, s) && Math.abs((n === inLine[i - 1] ? s.l - n.r : n.l - s.r)) < s.w * 0.7;
    if (!close(inLine[i - 1]) && !close(inLine[i + 1])) s.tex = "0";
  });
  // A thin vertical stroke between digits is a 1, between letters an l.
  const sorted = [...syms].sort((a, b) => a.l - b.l);
  sorted.forEach((s, i) => {
    if (!["l", "I", "|", "1"].includes(s.tex)) return;
    const near = [sorted[i - 1], sorted[i + 1]].filter(Boolean);
    if (near.some((n) => /^[0-9]$/.test(n.tex) && Math.abs(n.cy - s.cy) < s.h * 0.4)) s.tex = "1";
    // In a sans font l and I are the same shape. Beside capitals, and with no small letters on its line, it is an I.
    else if (s.tex === "l" && near.some((n) => /^[A-Z]$/.test(n.tex)) && !near.some((n) => /^[a-z]$/.test(n.tex))) s.tex = "I";
  });
}

function recognizeOne(ink, W, H, templates) {
  let comps = components(ink, W, H).map(box);
  if (!comps.length) return null;
  const hs = comps.map((c) => c.h).sort((a, b) => a - b);
  const unit = hs[Math.floor(hs.length * 0.7)] || hs[0];
  comps = comps.filter((c) => c.area >= Math.max(2, unit * unit * 0.008));
  const parts = joinParts(comps, unit);
  for (const s of parts) {
    if (!s.merged && isBar(s) && s.w > 0) {
      s.tex = "-";
      s.conf = 0.95;
      continue;
    }
    if (!s.merged && isDot(s, unit)) {
      s.tex = ".";
      s.isDot = true;
      s.conf = 0.9;
      continue;
    }
    // A very large thin outline holding other symbols is a root sign.
    const holds = parts.filter((o) => o !== s && o.cx > s.l && o.cx < s.r && o.cy > s.t && o.cy < s.b);
    let topRun = 0;
    if (holds.length) {
      const rowTop = new Set();
      for (const p of s.px) {
        const y = (p / W) | 0;
        if (y <= s.t + Math.max(2, s.h * 0.06)) rowTop.add(p % W);
      }
      topRun = rowTop.size / s.w;
    }
    if (holds.length && topRun > 0.35) {
      s.radical = true;
      s.tex = "\\sqrt";
      s.conf = 0.9;
      continue;
    }
    Object.assign(s, classify(s, templates, W));
  }
  refine(parts);

  // \cdot, not a full stop, when the dot sits mid-height.
  const alnumBottoms = parts.filter((s) => isAlnum(s.tex)).map((s) => s.b).sort((a, b) => a - b);
  if (alnumBottoms.length)
    for (const s of parts)
      if (s.isDot) {
        const nearest = alnumBottoms[alnumBottoms.length >> 1];
        if (s.cy < nearest - unit * 0.22) s.tex = "\\cdot";
      }

  const tex = parse(parts, unit);
  const scored = parts.filter((s) => s.conf !== undefined);
  const confidence = scored.reduce((a, s) => a + s.conf, 0) / Math.max(1, scored.length);
  const unsure = [...new Set(scored.filter((s) => s.conf < 0.7).map((s) => s.tex))];
  return { tex, confidence, symbols: parts.length, unsure };
}

/** Rows of ink separated by a clear horizontal gap are separate lines of an equation. */
function rows(ink, W, H, unit) {
  const has = new Uint8Array(H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (ink[y * W + x]) {
        has[y] = 1;
        break;
      }
  const bands = [];
  let start = -1;
  let gap = 0;
  for (let y = 0; y < H; y++) {
    if (has[y]) {
      if (start < 0) start = y;
      gap = 0;
    } else if (start >= 0 && ++gap > unit * 0.9) {
      bands.push([start, y - gap]);
      start = -1;
    }
  }
  if (start >= 0) bands.push([start, H - 1]);
  return bands;
}

/** Read an equation from an RGBA image { data, width, height }. */
export function recognize(image, templates) {
  let { gray, width: W, height: H } = toInk(image);
  let ink = binarize(gray, W, H);
  if (ink.reduce((a, b) => a + b, 0) === 0) throw new Error("No ink found. Try an image with dark text on a light background.");
  // Work at a size where a normal letter is about 40 pixels tall.
  const probe = components(ink, W, H).map(box);
  const hs = probe.map((c) => c.h).sort((a, b) => a - b);
  const unit = hs[Math.floor(hs.length * 0.7)] || 40;
  const scale = Math.min(6, Math.max(0.35, 42 / unit));
  if (scale > 1.25 || scale < 0.7) {
    const [W2, H2] = [Math.round(W * scale), Math.round(H * scale)];
    gray = resize(gray, W, H, W2, H2);
    W = W2;
    H = H2;
    ink = binarize(gray, W, H);
  }
  const u = 42;
  const bands = rows(ink, W, H, u);
  const results = [];
  for (const [a, b] of bands) {
    const sub = new Uint8Array(W * (b - a + 1));
    sub.set(ink.subarray(a * W, (b + 1) * W));
    const r = recognizeOne(sub, W, b - a + 1, templates);
    if (r) results.push(r);
  }
  if (!results.length) throw new Error("No symbols found in this image.");
  const tex = results.length > 1 ? `\\begin{aligned}\n${results.map((r) => r.tex).join(" \\\\\n")}\n\\end{aligned}` : results[0].tex;
  return {
    tex,
    symbols: results.reduce((a, r) => a + r.symbols, 0),
    confidence: results.reduce((a, r) => a + r.confidence, 0) / results.length,
    unsure: [...new Set(results.flatMap((r) => r.unsure))],
  };
}
