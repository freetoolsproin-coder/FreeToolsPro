// Instagram post images (1080 × 1350, the 4:5 portrait size that fills the most space in the feed),
// drawn as SVG and turned into PNG by sharp at build time. Same look as the Open Graph cards in og.js.
import { pxWidth } from "../tools/builders-extra.js";
import { ACCENT, FONT, esc, wrap, MARK } from "./og.js";

export const IG_W = 1080;
export const IG_H = 1350;

// What each kind of tool can honestly promise (keep in line with PRIVATE in ToolPage.jsx).
const POINTS = {
  image: ["Free, no sign-up", "Images never leave your device", "Works on phone and laptop"],
  pdf: ["Free, no sign-up", "Files never leave your device", "No watermark, no limits"],
  text: ["Free, no sign-up", "Runs in your browser", "Nothing you paste is uploaded"],
  calc: ["Free, no sign-up", "Results update as you type", "Built for India: ₹, lakh, crore"],
  builder: ["Free, no sign-up", "Live preview", "Copy the code in one click"],
  unit: ["Free, no sign-up", "Instant conversion", "Works on phone and laptop"],
  qr: ["Free, no sign-up", "No tracking, no expiry", "Download PNG or SVG"],
  canvas: ["Free, no sign-up", "Drawn on your device", "Download in one click"],
  study: ["Free, no sign-up", "Your notes stay on your device", "Works on phone and laptop"],
  latex: ["Free, no sign-up", "Nothing to install", "Runs in your browser"],
};
export const pointsFor = (engine, cat) => {
  const p = POINTS[engine] || POINTS.text;
  // The rupee line only fits the money and tax calculators.
  return engine === "calc" && cat !== "finance" && cat !== "tax" ? [p[0], p[1], "Works on phone and laptop"] : p;
};

const tick = (x, y, accent) =>
  `<circle cx="${x}" cy="${y}" r="22" fill="${accent}"/><path d="M${x - 10} ${y + 1}l7 7 13-15" stroke="#ffffff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;

/**
 * SVG for one Instagram post.
 * @param {{title:string, subtitle?:string, label?:string, cat?:string, points?:string[]}} o
 */
export function igSvg({ title, subtitle = "", label = "", cat = "finance", points = POINTS.text }) {
  const accent = ACCENT[cat] || ACCENT.finance;
  const left = 84;
  const maxW = IG_W - left * 2;
  // Fonts differ between hosts, so wrap a little short of the edge.
  const textW = maxW * 0.88;

  // Title: as large as fits in 3 lines while the subtitle and ticks still clear the call-to-action box
  // (the last tick must sit at or above y = 1060).
  const sub = subtitle ? wrap(subtitle, 42, textW, 3) : [];
  const fits = (s, n) => 360 + s * 0.86 + (n - 1) * Math.round(s * 1.1) + 40 + 42 + sub.length * 56 + 40 + 156 <= 1060;
  let size = 112;
  let lines = wrap(title, size, textW, 99);
  while ((lines.length > 3 || !fits(size, lines.length)) && size > 64) {
    size -= 6;
    lines = wrap(title, size, textW, 99);
  }
  if (lines.length > 3) lines = wrap(title, size, textW, 3);
  const lh = Math.round(size * 1.1);
  let y = 360 + size * 0.86;
  const titleSvg = lines.map((l, i) => `<text x="${left}" y="${Math.round(y + i * lh)}" font-size="${size}" font-weight="800" fill="#ffffff">${esc(l)}</text>`).join("");
  y += (lines.length - 1) * lh + 40;

  const subSvg = sub.map((l, i) => `<text x="${left}" y="${Math.round(y + 42 + i * 56)}" font-size="42" font-weight="500" fill="#c9d3e6">${esc(l)}</text>`).join("");
  y += 42 + sub.length * 56 + 40;

  // Three ticks, placed in the space left above the call-to-action box.
  const ptsTop = Math.max(y, 820);
  const ptsSvg = points
    .slice(0, 3)
    .map((p, i) => {
      const py = ptsTop + i * 78;
      return `${tick(left + 22, py, accent)}<text x="${left + 66}" y="${py + 13}" font-size="38" font-weight="600" fill="#e7ecf6">${esc(p)}</text>`;
    })
    .join("");

  const labelW = label ? Math.round(pxWidth(label.toUpperCase(), 26) * 1.12 + 52) : 0;
  const ctaY = IG_H - 220;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${IG_W}" height="${IG_H}" viewBox="0 0 ${IG_W} ${IG_H}" font-family="${FONT}">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d1b3d"/><stop offset="1" stop-color="#10284f"/></linearGradient>
  <radialGradient id="glow" cx="0.95" cy="0.05" r="0.75"><stop offset="0" stop-color="${accent}" stop-opacity="0.6"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${IG_W}" height="${IG_H}" fill="url(#bg)"/>
<rect width="${IG_W}" height="${IG_H}" fill="url(#glow)"/>
<rect x="0" y="0" width="16" height="${IG_H}" fill="${accent}"/>
<g transform="translate(${left} 96) scale(1.1)">${MARK}</g>
<text x="${left + 100}" y="158" font-size="50" font-weight="800" fill="#ffffff">Free<tspan fill="#3fb07f">Tools</tspan><tspan fill="#D98327">Pro</tspan></text>
${label ? `<rect x="${left}" y="236" width="${labelW}" height="58" rx="29" fill="${accent}"/><text x="${left + labelW / 2}" y="275" font-size="26" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="1">${esc(label.toUpperCase())}</text>` : ""}
${titleSvg}
${subSvg}
${ptsSvg}
<rect x="${left}" y="${ctaY}" width="${maxW}" height="128" rx="28" fill="#ffffff" fill-opacity="0.08" stroke="${accent}" stroke-width="3"/>
<text x="${left + 40}" y="${ctaY + 80}" font-size="36" font-weight="700" fill="#ffffff">Try it free: link in bio</text>
<text x="${IG_W - left - 40}" y="${ctaY + 80}" font-size="36" font-weight="800" fill="#3fb07f" text-anchor="end">freetoolspro.in</text>
</svg>`;
}
