import { buildVariant } from "./buildVariant.js";

const PAGES = [
  {
    slug: "online",
    parentPath: "/encoding-tools/base64-decode",
    parentName: "Base64 Decode",
    h1: "Base64 Decode Online Free",
    title: "Base64 Decode Online Free | FreeToolsPro",
    description:
      "Base64 decode online free—paste a Base64 string and get readable text instantly. Browser-based, no signup.",
    keywords: ["base64 decode online", "decode base64 free", "base64 decoder", "base64 to text"],
    mode: "decode",
  },
  {
    slug: "to-text",
    parentPath: "/encoding-tools/base64-decode",
    parentName: "Base64 Decode",
    h1: "Base64 to Text Converter Online",
    title: "Base64 to Text Online Free | FreeToolsPro",
    description:
      "Convert Base64 to text online free. Decode Base64 strings in your browser with FreeToolsPro.",
    keywords: ["base64 to text", "base64 decode to string", "decode base64 online"],
    mode: "decode",
  },
  {
    slug: "online",
    parentPath: "/encoding-tools/base64-encode",
    parentName: "Base64 Encode",
    h1: "Base64 Encode Online Free",
    title: "Base64 Encode Online Free | FreeToolsPro",
    description:
      "Base64 encode online free—convert text to Base64 instantly in your browser. No signup required.",
    keywords: ["base64 encode online", "text to base64", "base64 encoder free"],
    mode: "encode",
  },
  {
    slug: "text-to-base64",
    parentPath: "/encoding-tools/base64-encode",
    parentName: "Base64 Encode",
    h1: "Text to Base64 Encoder Online",
    title: "Text to Base64 Online Free | FreeToolsPro",
    description:
      "Encode text to Base64 online free. Fast, private browser tool for developers and marketers.",
    keywords: ["text to base64", "encode text base64 online", "string to base64"],
    mode: "encode",
  },
  {
    slug: "image-to-base64-online",
    parentPath: "/image-tools/image-to-base64",
    parentName: "Image to Base64",
    h1: "Image to Base64 Online Free",
    title: "Image to Base64 Converter Online Free | FreeToolsPro",
    description:
      "Convert an image to Base64 online free for HTML, CSS, or JSON embeds. Runs in your browser.",
    keywords: ["image to base64", "png to base64", "jpg to base64 online", "encode image base64"],
    mode: "image",
  },
  {
    slug: "data-uri",
    parentPath: "/image-tools/image-to-base64",
    parentName: "Image to Base64",
    h1: "Image to Base64 Data URI Online",
    title: "Image to Base64 Data URI Free | FreeToolsPro",
    description:
      "Create a Base64 data URI from an image online—handy for CSS backgrounds and inline HTML.",
    keywords: ["base64 data uri", "image data uri generator", "css background base64"],
    mode: "image",
  },
];

export function buildBase64Variants() {
  return PAGES.map((p) =>
    buildVariant({
      slug: p.slug,
      parentPath: p.parentPath,
      parentName: p.parentName,
      category: p.parentPath.includes("image") ? "image-tools" : "encoding-tools",
      h1: p.h1,
      title: p.title,
      description: p.description,
      keywords: p.keywords,
      intro: `${p.h1} with FreeToolsPro. Paste or upload, get the result, and copy it into your project—no account needed.`,
      steps: [
        `Open ${p.parentName}.`,
        p.mode === "image" ? "Upload an image file." : "Paste your text or Base64 string.",
        "Run encode/decode and copy the output.",
      ],
      faqs: [
        {
          q: "Is Base64 encoding private?",
          a: "Processing runs in your browser on FreeToolsPro for these tools—nothing requires creating an account.",
        },
      ],
      presets: { mode: p.mode },
    })
  );
}
