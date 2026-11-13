// Options for each image tool. Processing lives in components/islands/ImageTool.jsx.
const sel = (id, label, def, options, show) => ({ id, label, type: "select", def, options, show });
const range = (id, label, def, min, max, step, unit = "", show) => ({ id, label, type: "range", def, min, max, step, unit, show });
const num = (id, label, def, min, max, show) => ({ id, label, type: "number", def, min, max, step: 1, show });
const tog = (id, label, def, show) => ({ id, label, type: "toggle", def, show });
const color = (id, label, def, show) => ({ id, label, type: "color", def, show });

const FORMAT = (def = "same") =>
  sel("format", "Save as", def, [
    ["same", "Same as original"],
    ["image/jpeg", "JPG"],
    ["image/png", "PNG"],
    ["image/webp", "WebP"],
  ]);

// [id, label, width, height] in the sizes each platform recommends (2026).
export const SOCIAL_SIZES = [
  ["ig-square", "Instagram post (square)", 1080, 1080],
  ["ig-portrait", "Instagram post (portrait 4:5)", 1080, 1350],
  ["ig-story", "Instagram Story / Reel", 1080, 1920],
  ["fb-post", "Facebook post", 1200, 630],
  ["fb-cover", "Facebook cover", 1640, 624],
  ["yt-thumb", "YouTube thumbnail", 1280, 720],
  ["yt-banner", "YouTube channel banner", 2560, 1440],
  ["x-post", "X (Twitter) post", 1600, 900],
  ["x-header", "X (Twitter) header", 1500, 500],
  ["li-post", "LinkedIn post", 1200, 627],
  ["li-banner", "LinkedIn profile banner", 1584, 396],
  ["pin", "Pinterest pin (2:3)", 1000, 1500],
  ["wa-dp", "WhatsApp profile photo", 640, 640],
  ["wa-status", "WhatsApp status", 1080, 1920],
  ["og", "Link preview (Open Graph)", 1200, 630],
];

export const IMAGE_MODES = {
  "image-compressor": {
    multiple: true,
    options: [
      num("target", "Target size in KB (0 = use quality)", 0, 0, 20000),
      range("quality", "Quality", 0.75, 0.1, 1, 0.05, "", (o) => !o.target),
      num("maxw", "Max width in px (0 = keep)", 0, 0, 10000),
      sel("format", "Save as", "image/jpeg", [
        ["image/jpeg", "JPG (smallest for photos)"],
        ["image/webp", "WebP"],
        ["same", "Same as original"],
      ]),
    ],
  },
  "image-resizer": {
    multiple: true,
    options: [
      sel("preset", "Preset", "custom", [
        ["custom", "Custom size"],
        ["photo35", "Indian passport / exam photo 3.5 × 4.5 cm (413 × 531)"],
        ["passport", "US passport / visa 2 × 2 in (600 × 600)"],
        ["sign", "Signature 140 × 60 px"],
        ["ig", "Instagram post 1080 × 1080"],
        ["igp", "Instagram portrait 1080 × 1350"],
        ["yt", "YouTube thumbnail 1280 × 720"],
        ["hd", "Full HD 1920 × 1080"],
      ]),
      sel("unit", "Unit", "px", [["px", "Pixels"], ["pct", "Percent"], ["cm", "Centimetres"]], (o) => o.preset === "custom"),
      num("w", "Width", 1200, 1, 20000, (o) => o.preset === "custom"),
      num("h", "Height", 0, 0, 20000, (o) => o.preset === "custom" && !o.lock),
      tog("lock", "Keep aspect ratio", true, (o) => o.preset === "custom"),
      num("dpi", "DPI", 300, 72, 1200, (o) => o.preset === "custom" && o.unit === "cm"),
      sel("fit", "Fit", "cover", [["cover", "Crop to fill"], ["contain", "Fit inside (add background)"]], (o) => o.preset !== "custom" || !o.lock),
      FORMAT("same"),
    ],
  },
  "image-format-converter": {
    multiple: true,
    options: [
      sel("format", "Convert to", "image/webp", [
        ["image/jpeg", "JPG"],
        ["image/png", "PNG"],
        ["image/webp", "WebP"],
      ]),
      range("quality", "Quality", 0.9, 0.1, 1, 0.05, "", (o) => o.format !== "image/png"),
      color("bg", "Background for transparent areas", "#ffffff", (o) => o.format === "image/jpeg"),
    ],
  },
  "image-cropper": {
    multiple: false,
    options: [
      sel("ratio", "Aspect ratio", "1:1", [
        ["free", "Free"],
        ["1:1", "1:1 square"],
        ["4:5", "4:5 Instagram portrait"],
        ["9:16", "9:16 Story / Reel"],
        ["16:9", "16:9 YouTube / widescreen"],
        ["4:3", "4:3"],
        ["3:2", "3:2"],
        ["35:45", "35 × 45 mm passport"],
      ]),
      range("size", "Crop size", 100, 10, 100, 1, "%"),
      range("hsize", "Crop height", 100, 10, 100, 1, "%", (o) => o.ratio === "free"),
      range("x", "Horizontal position", 50, 0, 100, 1, "%"),
      range("y", "Vertical position", 50, 0, 100, 1, "%"),
      FORMAT("same"),
    ],
  },
  "social-media-image-resizer": {
    multiple: true,
    options: [
      sel("size", "Size", "ig-portrait", SOCIAL_SIZES.map(([k, label, w, h]) => [k, `${label} · ${w} × ${h}`])),
      sel("fit", "Fit", "cover", [["cover", "Crop to fill"], ["contain", "Fit whole image (add background)"], ["blur", "Fit with blurred background"]]),
      color("bg", "Background colour", "#ffffff", (o) => o.fit === "contain"),
      range("focus", "Crop position", 50, 0, 100, 1, "%", (o) => o.fit === "cover"),
      sel("format", "Save as", "image/jpeg", [["image/jpeg", "JPG"], ["image/png", "PNG"], ["image/webp", "WebP"]]),
    ],
  },
  "image-to-base64": { multiple: false, options: [] },
  "favicon-generator": {
    multiple: false,
    options: [range("pad", "Padding", 0, 0, 30, 1, "%"), tog("bgOn", "Solid background", false), color("bg", "Background colour", "#ffffff", (o) => o.bgOn), range("radius", "Corner rounding", 0, 0, 50, 1, "%", (o) => o.bgOn)],
  },
};

export const PRESETS = {
  passport: [600, 600],
  photo35: [413, 531],
  sign: [140, 60],
  ig: [1080, 1080],
  igp: [1080, 1350],
  yt: [1280, 720],
  hd: [1920, 1080],
};
