// Builder tools: a form of fields -> generated code + a live preview.
// preview.type: "box" (style applied to a sample box), "glass", "serp", "serp2", "share", "color".
import { EXTRA_BUILDERS } from "./builders-extra.js";

const f = {
  text: (id, label, def = "", extra = {}) => ({ id, label, type: "text", def, ...extra }),
  area: (id, label, def = "", extra = {}) => ({ id, label, type: "textarea", def, ...extra }),
  range: (id, label, def, min, max, step = 1, unit = "") => ({ id, label, type: "range", def, min, max, step, unit }),
  color: (id, label, def) => ({ id, label, type: "color", def }),
  select: (id, label, def, options) => ({ id, label, type: "select", def, options }),
  toggle: (id, label, def = false) => ({ id, label, type: "toggle", def }),
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- colour maths ----------
export function hexToRgb(hex) {
  let h = String(hex).trim().replace(/^#/, "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgbToHex([r, g, b]) {
  return "#" + [r, g, b].map((x) => Math.round(Math.min(255, Math.max(0, x))).toString(16).padStart(2, "0")).join("");
}
export function rgbToHsl([r, g, b]) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
export function hslToRgb([h, s, l]) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const fn = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [fn(0) * 255, fn(8) * 255, fn(4) * 255];
}
function luminance([r, g, b]) {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
function rgba(hex, alpha) {
  const rgb = hexToRgb(hex) || [0, 0, 0];
  return `rgba(${rgb.join(", ")}, ${+alpha.toFixed(2)})`;
}

const AI_BOTS = ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "ClaudeBot", "anthropic-ai", "Google-Extended", "CCBot", "PerplexityBot", "Bytespider", "Applebot-Extended", "meta-externalagent"];

export const BUILDERS = {
  "gradient-generator": {
    fields: [
      f.select("type", "Type", "linear", [["linear", "Linear"], ["radial", "Radial"]]),
      { ...f.range("angle", "Angle", 135, 0, 360, 1, "°"), show: (v) => v.type === "linear" },
      f.color("c1", "Colour 1", "#2346d8"),
      f.color("c2", "Colour 2", "#f5b000"),
      f.toggle("three", "Add a middle colour", false),
      { ...f.color("c3", "Middle colour", "#e8457a"), show: (v) => v.three },
    ],
    build: (v) => {
      const stops = v.three ? [`${v.c1} 0%`, `${v.c3} 50%`, `${v.c2} 100%`] : [`${v.c1} 0%`, `${v.c2} 100%`];
      const g = v.type === "linear" ? `linear-gradient(${v.angle}deg, ${stops.join(", ")})` : `radial-gradient(circle at center, ${stops.join(", ")})`;
      return { code: `background: ${v.c1};\nbackground: ${g};`, lang: "css", preview: { type: "box", style: { background: g }, tall: true } };
    },
  },
  "css-shadow-generator": {
    fields: [
      f.range("x", "Horizontal offset", 0, -50, 50, 1, "px"),
      f.range("y", "Vertical offset", 12, -50, 50, 1, "px"),
      f.range("blur", "Blur", 32, 0, 100, 1, "px"),
      f.range("spread", "Spread", -8, -50, 50, 1, "px"),
      f.color("color", "Shadow colour", "#13203b"),
      f.range("alpha", "Opacity", 0.18, 0, 1, 0.01),
      f.range("radius", "Corner radius", 12, 0, 60, 1, "px"),
      f.toggle("inset", "Inset", false),
      f.toggle("layer", "Layered (more realistic)", true),
    ],
    build: (v) => {
      const main = `${v.inset ? "inset " : ""}${v.x}px ${v.y}px ${v.blur}px ${v.spread}px ${rgba(v.color, v.alpha)}`;
      const shadow = v.layer && !v.inset ? `0 1px 2px ${rgba(v.color, Math.min(1, v.alpha * 0.6))}, ${main}` : main;
      return {
        code: `box-shadow: ${shadow};\nborder-radius: ${v.radius}px;`,
        lang: "css",
        preview: { type: "box", style: { boxShadow: shadow, borderRadius: v.radius + "px", background: "var(--paper)" }, light: true },
      };
    },
  },
  "glassmorphism-generator": {
    fields: [
      f.range("blur", "Blur", 14, 0, 40, 1, "px"),
      f.range("alpha", "Transparency", 0.22, 0, 1, 0.01),
      f.range("sat", "Saturation", 160, 100, 250, 5, "%"),
      f.color("tint", "Tint", "#ffffff"),
      f.range("border", "Border opacity", 0.35, 0, 1, 0.01),
      f.range("radius", "Corner radius", 18, 0, 50, 1, "px"),
    ],
    build: (v) => {
      const style = {
        background: rgba(v.tint, v.alpha),
        backdropFilter: `blur(${v.blur}px) saturate(${v.sat}%)`,
        WebkitBackdropFilter: `blur(${v.blur}px) saturate(${v.sat}%)`,
        border: `1px solid ${rgba(v.tint, v.border)}`,
        borderRadius: v.radius + "px",
      };
      return {
        code: `background: ${style.background};\n-webkit-backdrop-filter: ${style.backdropFilter};\nbackdrop-filter: ${style.backdropFilter};\nborder: ${style.border};\nborder-radius: ${v.radius}px;`,
        lang: "css",
        preview: { type: "glass", style },
      };
    },
  },
  "color-picker": {
    fields: [f.color("c", "Colour", "#2346d8"), f.text("hex", "Or type HEX, RGB or HSL", "", { placeholder: "#1e90ff, rgb(30,144,255), hsl(210,100%,56%)" })],
    build: (v) => {
      let rgb = hexToRgb(v.c);
      const t = v.hex.trim();
      if (t) {
        const m1 = t.match(/^rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/i);
        const m2 = t.match(/^hsla?\(\s*([\d.]+)(?:deg)?[ ,]+([\d.]+)%[ ,]+([\d.]+)%/i);
        const parsed = m1 ? [+m1[1], +m1[2], +m1[3]] : m2 ? hslToRgb([+m2[1], +m2[2], +m2[3]]) : hexToRgb(t);
        if (!parsed) return { error: "Could not read that colour. Try #1e90ff, rgb(30, 144, 255) or hsl(210, 100%, 56%)." };
        rgb = parsed;
      }
      const hex = rgbToHex(rgb);
      const [h, s, l] = rgbToHsl(rgb);
      const cw = contrast(rgb, [255, 255, 255]);
      const cb = contrast(rgb, [0, 0, 0]);
      const grade = (c) => (c >= 7 ? "AAA" : c >= 4.5 ? "AA" : c >= 3 ? "AA large text only" : "Fails");
      const shades = [90, 75, 60, l, 35, 22, 12].map((L) => rgbToHex(hslToRgb([h, s, L])));
      return {
        outputs: [
          { label: "HEX", value: hex.toUpperCase() },
          { label: "RGB", value: `rgb(${rgb.map(Math.round).join(", ")})` },
          { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
          { label: "CSS variable", value: `--brand: ${hex};` },
        ],
        stats: [
          { label: "Contrast with white text", value: `${cw.toFixed(2)} : 1 · ${grade(cw)}`, warn: cw < 4.5 },
          { label: "Contrast with black text", value: `${cb.toFixed(2)} : 1 · ${grade(cb)}`, warn: cb < 4.5 },
        ],
        preview: { type: "color", hex, shades, textOn: cw >= cb ? "#ffffff" : "#000000" },
      };
    },
  },
  "meta-tag-generator": {
    fields: [
      f.text("title", "Page title", "EMI Calculator: Loan EMI with Amortization Schedule", { counter: [30, 60] }),
      f.area("desc", "Meta description", "Calculate your loan EMI, total interest and total payment instantly. See a year-by-year amortization schedule for home, car or personal loans.", { counter: [70, 160] }),
      f.text("url", "Canonical URL", "https://freetoolspro.in/calculators/emi-calculator"),
      f.select("robots", "Search engines", "index, follow", [["index, follow", "Index and follow links"], ["noindex, follow", "Do not index, follow links"], ["noindex, nofollow", "Do not index or follow"]]),
      f.toggle("viewport", "Include viewport tag", true),
      f.select("lang", "Language", "en", [["en", "English"], ["en-IN", "English (India)"], ["hi", "Hindi"]]),
    ],
    build: (v) => {
      const code = [
        `<!-- in <html lang="${v.lang}"> -->`,
        `<meta charset="utf-8">`,
        v.viewport ? `<meta name="viewport" content="width=device-width, initial-scale=1">` : "",
        `<title>${esc(v.title)}</title>`,
        `<meta name="description" content="${esc(v.desc)}">`,
        v.url ? `<link rel="canonical" href="${esc(v.url)}">` : "",
        `<meta name="robots" content="${v.robots}">`,
      ]
        .filter(Boolean)
        .join("\n");
      return { code, lang: "html", preview: { type: "serp", title: v.title, url: v.url, desc: v.desc } };
    },
  },
  "open-graph-generator": {
    fields: [
      f.text("title", "Title", "SIP Calculator: Mutual Fund Returns with Step-Up", { counter: [20, 70] }),
      f.area("desc", "Description", "Calculate the future value of your monthly SIP with an optional yearly step-up.", { counter: [50, 200] }),
      f.text("url", "Page URL", "https://freetoolspro.in/calculators/sip-calculator"),
      f.text("image", "Image URL (1200 × 630)", "https://freetoolspro.in/images/seo-preview.png"),
      f.text("site", "Site name", "FreeToolsPro"),
      f.select("type", "Type", "website", [["website", "website"], ["article", "article"], ["product", "product"]]),
      f.text("handle", "X (Twitter) handle", "@freetoolspro"),
    ],
    build: (v) => {
      const code = [
        `<meta property="og:type" content="${v.type}">`,
        `<meta property="og:title" content="${esc(v.title)}">`,
        `<meta property="og:description" content="${esc(v.desc)}">`,
        `<meta property="og:url" content="${esc(v.url)}">`,
        v.image ? `<meta property="og:image" content="${esc(v.image)}">` : "",
        v.image ? `<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">` : "",
        v.site ? `<meta property="og:site_name" content="${esc(v.site)}">` : "",
        `<meta name="twitter:card" content="${v.image ? "summary_large_image" : "summary"}">`,
        v.handle ? `<meta name="twitter:site" content="${esc(v.handle)}">` : "",
        `<meta name="twitter:title" content="${esc(v.title)}">`,
        `<meta name="twitter:description" content="${esc(v.desc)}">`,
        v.image ? `<meta name="twitter:image" content="${esc(v.image)}">` : "",
      ]
        .filter(Boolean)
        .join("\n");
      let host = "";
      try {
        host = new URL(v.url).hostname;
      } catch {}
      return { code, lang: "html", preview: { type: "share", title: v.title, desc: v.desc, image: v.image, host } };
    },
  },
  "robots-generator": {
    fields: [
      f.select("all", "Default for all crawlers", "allow", [["allow", "Allow everything"], ["disallow", "Block everything"]]),
      f.area("dis", "Paths to block (one per line)", "/admin/\n/cart\n/search?", { rows: 4 }),
      f.toggle("ai", "Block AI training and answer crawlers", false),
      f.text("sitemap", "Sitemap URL", "https://example.in/sitemap.xml"),
      f.text("host", "Extra sitemap (optional)", ""),
    ],
    build: (v) => {
      const paths = v.dis
        .split(/\r?\n/)
        .map((x) => x.trim())
        .filter(Boolean)
        .map((x) => (x.startsWith("/") ? x : "/" + x));
      const lines = ["User-agent: *"];
      if (v.all === "disallow") lines.push("Disallow: /");
      else if (paths.length) paths.forEach((p) => lines.push(`Disallow: ${p}`));
      else lines.push("Allow: /");
      if (v.ai) {
        lines.push("");
        AI_BOTS.forEach((b) => lines.push(`User-agent: ${b}`));
        lines.push("Disallow: /");
      }
      const maps = [v.sitemap, v.host].map((x) => x.trim()).filter(Boolean);
      if (maps.length) lines.push("", ...maps.map((m) => `Sitemap: ${m}`));
      return { code: lines.join("\n") + "\n", lang: "text", download: { name: "robots.txt", mime: "text/plain" } };
    },
  },
  ...EXTRA_BUILDERS,
};
