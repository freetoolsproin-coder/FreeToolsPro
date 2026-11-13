// Canvas tools: options for each design. Drawing lives in components/islands/CanvasTool.jsx.
const sel = (id, label, def, options, show) => ({ id, label, type: "select", def, options, show });
const range = (id, label, def, min, max, step, unit = "", show) => ({ id, label, type: "range", def, min, max, step, unit, show });
const color = (id, label, def, show) => ({ id, label, type: "color", def, show });
const text = (id, label, def, extra = {}) => ({ id, label, type: "text", def, ...extra });
const area = (id, label, def, extra = {}) => ({ id, label, type: "textarea", def, rows: 3, ...extra });
const tog = (id, label, def, show) => ({ id, label, type: "toggle", def, show });

export const FONTS = [
  ["opensans", "Open Sans (site font)", '"Open Sans", "Segoe UI", Roboto, Arial, sans-serif', 800],
  ["impact", "Impact (classic thumbnail)", 'Impact, "Arial Black", "Roboto Condensed", sans-serif', 400],
  ["arialblack", "Arial Black", '"Arial Black", "Segoe UI Black", Arial, sans-serif', 900],
  ["serif", "Georgia (serif)", 'Georgia, "Times New Roman", serif', 700],
];

export const CANVAS_MODES = {
  "youtube-thumbnail-maker": {
    width: 1280,
    height: 720,
    format: "image/jpeg",
    maxBytes: 2 * 1024 * 1024,
    file: "thumbnail.jpg",
    image: { label: "Add a background photo", hint: "or drop one here. A face showing emotion works well. Nothing is uploaded." },
    fields: [
      area("text", "Text (one to three short lines)", "₹30 LAKH LOAN\nREAL COST?"),
      text("hl", "Highlight these words", "REAL COST?"),
      sel("font", "Font", "opensans", FONTS.map(([k, l]) => [k, l])),
      range("size", "Text size", 128, 60, 220, 2, " px"),
      sel("pos", "Text position", "left", [["left", "Left"], ["center", "Centre"], ["right", "Right"]]),
      sel("vpos", "Vertical position", "middle", [["top", "Top"], ["middle", "Middle"], ["bottom", "Bottom"]]),
      color("color", "Text colour", "#ffffff"),
      color("hlColor", "Highlight colour", "#ffd400"),
      range("stroke", "Outline thickness", 12, 0, 30, 1, " px"),
      color("strokeColor", "Outline colour", "#111111", (o) => o.stroke > 0),
      sel("bg", "Background", "gradient", [["photo", "My photo"], ["gradient", "Gradient"], ["solid", "Solid colour"]]),
      color("c1", "Colour 1", "#d92d20", (o) => o.bg !== "photo"),
      color("c2", "Colour 2", "#3d0a91", (o) => o.bg === "gradient"),
      range("shade", "Darken photo", 35, 0, 80, 5, "%", (o) => o.bg === "photo"),
      range("focus", "Photo position", 50, 0, 100, 1, "%", (o) => o.bg === "photo"),
      text("badge", "Corner badge (optional)", "2026 GUIDE", { placeholder: "e.g. NEW, PART 2" }),
      color("badgeColor", "Badge colour", "#ffd400", (o) => !!o.badge),
      tog("guide", "Show where YouTube puts the video length", true),
    ],
  },
  "og-image-generator": {
    width: 1200,
    height: 630,
    format: "image/png",
    file: "og-image.png",
    image: { label: "Add a logo (optional)", hint: "PNG with a transparent background looks best. Nothing is uploaded." },
    fields: [
      area("title", "Title", "How to calculate your home loan EMI in 2026"),
      text("sub", "Subtitle (optional)", "Formula, examples and a free calculator"),
      text("site", "Site name or URL", "freetoolspro.in"),
      sel("layout", "Layout", "left", [["left", "Left aligned"], ["center", "Centred"], ["split", "Colour bar on the left"]]),
      sel("font", "Font", "opensans", FONTS.map(([k, l]) => [k, l])),
      sel("bg", "Background", "gradient", [["gradient", "Gradient"], ["solid", "Solid colour"], ["dots", "Solid with dot grid"]]),
      color("c1", "Background colour", "#0f2a5f"),
      color("c2", "Gradient end", "#0e9384", (o) => o.bg === "gradient"),
      color("color", "Text colour", "#ffffff"),
      color("accent", "Accent colour", "#ffd400"),
      text("tag", "Small label above the title (optional)", "PERSONAL FINANCE", { placeholder: "e.g. BLOG, GUIDE" }),
    ],
  },
};
