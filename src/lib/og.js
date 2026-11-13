// Open Graph share images (1200 × 630), drawn as SVG and turned into PNG by sharp at build time.
// Kept to plain SVG (rects, circles, paths, text) so librsvg renders it the same on every host.
import { pxWidth } from "../tools/builders-extra.js";

export const OG_W = 1200;
export const OG_H = 630;

// Category accent colours (same as .cat-* in global.css).
export const ACCENT = {
  finance: "#D98327",
  tax: "#d68a00",
  everyday: "#039855",
  text: "#3e4784",
  developer: "#6941c6",
  encoding: "#475467",
  image: "#0e9384",
  pdf: "#d92d20",
  design: "#c11574",
  student: "#1570ef",
  study: "#7a5af8",
  latex: "#b54708",
  writing: "#3b7c0f",
  seo: "#088ab2",
  creator: "#e31b54",
};

export const FONT = `'Open Sans', 'Segoe UI', 'Noto Sans', 'DejaVu Sans', Arial, sans-serif`;
export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Word-wrap `text` to lines no wider than `max` px at `size`, at most `maxLines` (last one ellipsised). */
export function wrap(text, size, max, maxLines) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  // Bold text is roughly 8% wider than the regular widths in pxWidth.
  const w = (s) => pxWidth(s, size) * 1.08;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (w(next) <= max || !line) line = next;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last && w(last + "…") > max) last = last.replace(/\s*\S+$/, "");
    kept[maxLines - 1] = (last || kept[maxLines - 1]) + "…";
    return kept;
  }
  return lines;
}

/** Largest font size (from `start` down to `min`) at which the title fits in `maxLines`. */
function fitTitle(text, start, min, max, maxLines) {
  for (let s = start; s >= min; s -= 4) {
    const lines = wrap(text, s, max, 99);
    if (lines.length <= maxLines) return { size: s, lines };
  }
  return { size: min, lines: wrap(text, min, max, maxLines) };
}

// The FreeToolsPro mark (pen nib), drawn in a 71 × 71 box.
export const MARK = `<path d="M10.9 26.9C16.1-4.8 50.1-4.2 55.9 26.9" stroke="#9fb8af" stroke-width="1.6" fill="none"/>
<path d="M2.5 2.5H63" stroke="#9fb8af" stroke-width="1.6"/>
<path d="M32.8 5L52.9 45.4C49.4 46 42.3 48.4 42.3 52.9" stroke="#9fb8af" stroke-width="1.6" fill="none"/>
<path d="M32.8 5L12.6 45.4C16.2 46 23.3 48.4 23.3 52.9" stroke="#9fb8af" stroke-width="1.6" fill="none"/>
<circle cx="32.8" cy="36.6" r="5" fill="#D98327"/>
<circle cx="56.3" cy="27.7" r="2.5" fill="#D98327"/><circle cx="10.9" cy="27.7" r="2.5" fill="#D98327"/>
<circle cx="2.5" cy="2.5" r="2.5" fill="#D98327"/><circle cx="32.8" cy="2.5" r="2.5" fill="#D98327"/><circle cx="63" cy="2.5" r="2.5" fill="#D98327"/>
<rect x="15.1" y="51.7" width="34" height="7.6" rx="3.8" fill="#D98327"/>
<path d="M21.4 59.2H44.1V69.6C44.1 70.1 43.7 70.6 43.1 70.6H22.4C21.9 70.6 21.4 70.1 21.4 69.6Z" fill="#3fb07f"/>`;

/**
 * Build the SVG for one share card.
 * @param {{title:string, subtitle?:string, label?:string, cat?:string, footer?:string}} o
 */
export function ogSvg({ title, subtitle = "", label = "", cat = "finance", footer = "Free · No sign-up · Runs in your browser" }) {
  const accent = ACCENT[cat] || ACCENT.finance;
  const left = 80;
  const maxW = OG_W - left - 80;
  // Fit title + subtitle into the space between the header (y≈160) and the footer (y≈505).
  const TOP = 165,
    BOTTOM = 500;
  let t, lh, sub, block;
  for (const subMax of [2, 1, 0]) {
    for (let size = 84; size >= 48; size -= 4) {
      const lines = wrap(title, size, maxW, 99);
      if (lines.length > 3) continue;
      const s2 = subtitle && subMax ? wrap(subtitle, 32, maxW, subMax) : [];
      const h = lines.length * Math.round(size * 1.12) + (s2.length ? 26 + s2.length * 44 : 0);
      if (h <= BOTTOM - TOP) {
        t = { size, lines };
        lh = Math.round(size * 1.12);
        sub = s2;
        block = h;
        break;
      }
    }
    if (t) break;
  }
  if (!t) {
    t = { size: 48, lines: wrap(title, 48, maxW, 3) };
    lh = 54;
    sub = [];
    block = t.lines.length * lh;
  }
  let y = TOP + (BOTTOM - TOP - block) / 2 + t.size * 0.86;
  const titleSvg = t.lines.map((l, i) => `<text x="${left}" y="${Math.round(y + i * lh)}" font-size="${t.size}" font-weight="800" fill="#ffffff">${esc(l)}</text>`).join("");
  y += (t.lines.length - 1) * lh + 26 + 34;
  const subSvg = sub.map((l, i) => `<text x="${left}" y="${Math.round(y + i * 44)}" font-size="32" font-weight="500" fill="#c9d3e6">${esc(l)}</text>`).join("");
  const labelW = label ? Math.round(pxWidth(label.toUpperCase(), 22) * 1.12 + 44) : 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}" font-family="${FONT}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d1b3d"/><stop offset="1" stop-color="#10284f"/></linearGradient>
  <radialGradient id="glow" cx="0.92" cy="0.1" r="0.7"><stop offset="0" stop-color="${accent}" stop-opacity="0.55"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${OG_W}" height="${OG_H}" fill="url(#bg)"/>
<rect width="${OG_W}" height="${OG_H}" fill="url(#glow)"/>
<rect x="0" y="0" width="14" height="${OG_H}" fill="${accent}"/>
<g transform="translate(${left} 62) scale(0.9)">${MARK}</g>
<text x="${left + 82}" y="113" font-size="40" font-weight="800" fill="#ffffff">Free<tspan fill="#3fb07f">Tools</tspan><tspan fill="#D98327">Pro</tspan></text>
${label ? `<rect x="${OG_W - 80 - labelW}" y="72" width="${labelW}" height="48" rx="24" fill="${accent}"/><text x="${OG_W - 80 - labelW / 2}" y="104" font-size="22" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">${esc(label.toUpperCase())}</text>` : ""}
${titleSvg}
${subSvg}
<rect x="${left}" y="${OG_H - 92}" width="64" height="6" rx="3" fill="${accent}"/>
<text x="${left}" y="${OG_H - 52}" font-size="28" font-weight="600" fill="#e7ecf6">${esc(footer)}</text>
<text x="${OG_W - 80}" y="${OG_H - 52}" font-size="28" font-weight="700" fill="#ffffff" text-anchor="end">freetoolspro.in</text>
</svg>`;
}
