import { buildVariant } from "./buildVariant.js";

const FORMATS = ["png", "jpg", "webp", "gif"];

const SPECIAL = [
  {
    slug: "webp-to-png-transparent",
    from: "webp",
    to: "png",
    h1: "Convert WebP to PNG Transparent Online",
    title: "Convert WebP to PNG Transparent (Free Online) | FreeToolsPro",
    description:
      "Convert WebP images to transparent PNG online—free, no signup. Keep alpha where supported and download instantly in your browser.",
    keywords: [
      "convert webp to png transparent",
      "webp to png with transparency",
      "webp to png online free",
      "transparent png converter",
    ],
    note: "PNG preserves transparency better than JPG. Upload your WebP and choose PNG as the output format.",
  },
  {
    slug: "png-to-webp-for-web",
    from: "png",
    to: "webp",
    h1: "Convert PNG to WebP for Faster Websites",
    title: "PNG to WebP Converter Free Online | FreeToolsPro",
    description:
      "Convert PNG to WebP online to shrink image weight for websites. Free browser tool—no upload to a server account required.",
    keywords: [
      "png to webp converter",
      "convert png to webp online",
      "png to webp free",
      "optimize images webp",
    ],
    note: "WebP usually produces smaller files than PNG for photos and UI assets on the modern web.",
  },
  {
    slug: "jpg-to-png-online",
    from: "jpg",
    to: "png",
    h1: "Convert JPG to PNG Online Free",
    title: "JPG to PNG Converter Online Free | FreeToolsPro",
    description:
      "Convert JPG/JPEG to PNG online free. Instant browser conversion for editing, screenshots, and lossless workflows.",
    keywords: ["jpg to png", "jpeg to png converter", "convert jpg to png online free"],
    note: "JPG has no alpha channel; the PNG will be opaque unless you edit transparency later.",
  },
];

function pairVariant(from, to) {
  const slug = `${from}-to-${to}`;
  const FROM = from.toUpperCase();
  const TO = to.toUpperCase();
  return buildVariant({
    slug,
    parentPath: "/image-tools/image-format-converter",
    parentName: "Image Format Converter",
    category: "image-tools",
    h1: `Convert ${FROM} to ${TO} Online Free`,
    title: `${FROM} to ${TO} Converter Online Free | FreeToolsPro`,
    description: `Convert ${FROM} to ${TO} online free—no signup. Fast browser-based image format converter on FreeToolsPro.`,
    keywords: [
      `${from} to ${to}`,
      `convert ${from} to ${to} online`,
      `${from} to ${to} converter free`,
      `image converter ${from} ${to}`,
    ],
    intro: `Need to convert ${FROM} to ${TO}? Use FreeToolsPro’s free Image Format Converter—upload your file, set output to ${TO}, and download the result.`,
    steps: [
      `Open the Image Format Converter (preselected for ${TO}).`,
      `Upload your ${FROM} image from your device.`,
      `Confirm the output format is ${TO} and run convert.`,
      "Download the converted file and use it in your project.",
    ],
    faqs: [
      {
        q: `Is ${FROM} to ${TO} conversion free?`,
        a: "Yes. This FreeToolsPro page and the converter tool are free to use in your browser.",
      },
      {
        q: "Do I need to create an account?",
        a: "No signup is required for standard conversions.",
      },
    ],
    presets: { from, to },
  });
}

export function buildImageFormatVariants() {
  const out = [];
  const seen = new Set();

  for (const s of SPECIAL) {
    seen.add(s.slug);
    out.push(
      buildVariant({
        slug: s.slug,
        parentPath: "/image-tools/image-format-converter",
        parentName: "Image Format Converter",
        category: "image-tools",
        h1: s.h1,
        title: s.title,
        description: s.description,
        keywords: s.keywords,
        intro: s.note,
        steps: [
          "Open the converter with the suggested output format.",
          `Upload your ${s.from.toUpperCase()} image.`,
          `Convert to ${s.to.toUpperCase()} and download.`,
        ],
        faqs: [
          {
            q: "Will transparency be kept?",
            a: "PNG and WebP can keep transparency; JPG cannot. Prefer PNG when you need a transparent background.",
          },
        ],
        presets: { from: s.from, to: s.to },
      })
    );
  }

  for (const from of FORMATS) {
    for (const to of FORMATS) {
      if (from === to) continue;
      const slug = `${from}-to-${to}`;
      if (seen.has(slug)) continue;
      seen.add(slug);
      out.push(pairVariant(from, to));
    }
  }

  return out;
}
