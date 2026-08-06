import { buildVariant } from "./buildVariant.js";

const TARGETS = [
  { slug: "jpeg-under-50kb", format: "jpeg", kb: 50, label: "Compress JPEG under 50KB" },
  { slug: "jpeg-under-100kb", format: "jpeg", kb: 100, label: "Compress JPEG under 100KB" },
  { slug: "jpeg-under-200kb", format: "jpeg", kb: 200, label: "Compress JPEG under 200KB" },
  { slug: "png-under-50kb", format: "png", kb: 50, label: "Compress PNG under 50KB" },
  { slug: "png-under-100kb", format: "png", kb: 100, label: "Compress PNG under 100KB" },
  { slug: "webp-under-50kb", format: "webp", kb: 50, label: "Compress WebP under 50KB" },
  { slug: "webp-under-100kb", format: "webp", kb: 100, label: "Compress WebP under 100KB" },
  { slug: "image-under-50kb-for-email", format: "jpeg", kb: 50, label: "Compress Image under 50KB for Email" },
  { slug: "image-under-100kb-for-web", format: "webp", kb: 100, label: "Compress Image under 100KB for Web" },
  { slug: "compress-photo-for-whatsapp", format: "jpeg", kb: 200, label: "Compress Photo for WhatsApp" },
];

export function buildImageCompressVariants() {
  return TARGETS.map((t) =>
    buildVariant({
      slug: t.slug,
      parentPath: "/image-tools/image-compressor",
      parentName: "Image Compressor",
      category: "image-tools",
      h1: `${t.label} Online Free`,
      title: `${t.label} Online Free | FreeToolsPro`,
      description: `${t.label} free in your browser. Reduce file size toward ~${t.kb}KB with FreeToolsPro’s image compressor—no signup.`,
      keywords: [
        t.label.toLowerCase(),
        `compress ${t.format} under ${t.kb}kb`,
        `reduce image size to ${t.kb}kb`,
        "image compressor online free",
      ],
      intro: `Looking to ${t.label.toLowerCase()}? Open the free Image Compressor, upload your ${t.format.toUpperCase()} (or any common image), and reduce size for web, email, or chat.`,
      steps: [
        "Open the Image Compressor with the size target preset.",
        "Upload your image from your device.",
        `Compress until the file is near ${t.kb}KB (or as close as quality allows).`,
        "Download the compressed image.",
      ],
      faqs: [
        {
          q: `Can every photo reach ${t.kb}KB?`,
          a: "Very large or detailed images may not hit an ultra-low size without visible quality loss. Lower dimensions or try WebP for better compression.",
        },
      ],
      presets: { targetKb: t.kb, format: t.format },
    })
  );
}
