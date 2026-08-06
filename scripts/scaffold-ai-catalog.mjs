/**
 * Scaffold AI catalog tools + register categories/routes/SEO/home.
 * node scripts/scaffold-ai-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { AI_CATALOG_NORMALIZED, AI_CATEGORIES, AI_REMAPS } = await import(
  pathToFileURL(path.join(ROOT, "src/data/aiCatalogManifest.js")).href
);

const ICON_FIX = {
  SpellCheck: "Check",
  FlaskConical: "Code2",
  Megaphone: "Share2",
  PanelsTopLeft: "LayoutGrid",
  Copy: "Files",
  Zap: "Zap",
  MousePointerClick: "MousePointerClick",
};

function fixIcon(icon) {
  return ICON_FIX[icon] || icon;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function emitTool(tool) {
  const icon = fixIcon(tool.icon);
  const multi =
    !["prompt_library", "brand_name", "cta_gen", "thumbnail_text"].includes(tool.kind);
  return `import { ${icon} } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function ${tool.component}() {
  return (
    <IoToolShell
      seoKey="${tool.seoKey}"
      category="${tool.category}"
      path="${tool.path}"
      icon={${icon}}
      title=${JSON.stringify(tool.name)}
      subtitle=${JSON.stringify(tool.desc)}
      actionLabel="Generate"
      multiline={${multi}}
      placeholder=${JSON.stringify(
        tool.kind === "tone_change"
          ? "professional\\nPaste text to restyle…"
          : tool.kind === "skill_gap"
            ? "html, css, js\\n---\\nreact, typescript, node"
            : tool.kind === "prompt_compare"
              ? "Prompt A\\n---\\nPrompt B"
              : tool.kind === "prompt_translate"
                ? "Hindi\\nYour prompt here…"
                : "Paste input or topic…"
      )}
      transform={aiTransforms.${tool.kind}}
    />
  );
}
`;
}

function generate() {
  for (const tool of AI_CATALOG_NORMALIZED) {
    tool.icon = fixIcon(tool.icon);
    write(path.join(ROOT, "src/tools", tool.folder, `${tool.component}.jsx`), emitTool(tool));
  }
  console.log("wrote", AI_CATALOG_NORMALIZED.length, "tools");
}

function ensureIcons(text) {
  const used = new Set([
    ...AI_CATALOG_NORMALIZED.map((t) => fixIcon(t.icon)),
    ...AI_CATEGORIES.map((c) => fixIcon(c[2])),
    "Files",
    "Check",
    "Megaphone",
    "Heart",
  ]);
  const section = text.split('} from "lucide-react"')[0];
  const missing = [...used].filter((i) => !new RegExp(`\\b${i}\\b`).test(section));
  if (!missing.length) return text;
  return text.replace(/\n\} from "lucide-react";/, `\n  ${missing.join(",\n  ")},\n} from "lucide-react";`);
}

function patchDefinitions() {
  const p = path.join(ROOT, "src/data/toolDefinitions.js");
  let text = fs.readFileSync(p, "utf8");
  text = ensureIcons(text);

  if (!text.includes('id: "ai-writing-tools"')) {
    const cats = AI_CATEGORIES.map(
      ([id, name, icon, pathName]) =>
        `  { id: "${id}", name: "${name}", icon: ${fixIcon(icon)}, path: "${pathName}" },`
    ).join("\n");
    // append before end of categories array
    text = text.replace(
      /\{ id: "market-daily", name: "Market Daily", icon: CalendarDays, path: "\/market-daily" \},\n\];/,
      `{ id: "market-daily", name: "Market Daily", icon: CalendarDays, path: "/market-daily" },\n${cats}\n];`
    );
    if (!text.includes('id: "ai-writing-tools"')) {
      text = text.replace(/\n\];\n\n\/\* ===========================\n   Tools/, `\n${cats}\n];\n\n/* ===========================\n   Tools`);
    }
  }

  for (const [id, cat] of Object.entries(AI_REMAPS)) {
    const re = new RegExp(`(id: "${id}",[\\s\\S]*?category: ")([^"]+)(")`);
    if (re.test(text)) text = text.replace(re, `$1${cat}$3`);
  }

  if (!text.includes('id: "ai-title-generator"')) {
    const defs = AI_CATALOG_NORMALIZED.map((tool) => {
      const icon = fixIcon(tool.icon);
      const kws = tool.keywords.map((k) => JSON.stringify(k)).join(", ");
      return `
{
  id: "${tool.id}",
  path: "${tool.path}",
  name: ${JSON.stringify(tool.name)},
  desc: ${JSON.stringify(tool.desc)},
  icon: ${icon},
  category: "${tool.category}",
  keywords: [${kws}],
  navLabel: ${JSON.stringify(tool.name.split(" ").slice(0, 2).join(" "))},
  title: ${JSON.stringify(tool.name)},
  showInDesktopNav: true,
  showInMobileNav: true,
},`;
    }).join("\n");
    text = text.replace(/\n\];\s*$/, `${defs}\n];\n`);
  }

  fs.writeFileSync(p, text, "utf8");
  console.log("patched definitions");
}

function patchRoutes() {
  const p = path.join(ROOT, "src/routes/appRoutes.jsx");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes("AiTitleGenerator")) {
    console.log("routes already present");
  } else {
    const lazies =
      AI_CATALOG_NORMALIZED.map(
        (t) =>
          `const ${t.component} = lazy(() => import("../tools/${t.folder}/${t.component}"));`
      ).join("\n") + "\n";
    const re =
      /const AveragePriceCalculator = lazy\(\(\) => import\("\.\.\/tools\/stock-calculators\/AveragePriceCalculator"\)\);\r?\n/;
    if (re.test(text)) text = text.replace(re, (m) => m + lazies);
    else {
      const re2 =
        /const LlmReadinessChecker = lazy\(\(\) => import\("\.\.\/tools\/developer-tools\/LlmReadinessChecker"\)\);\r?\n/;
      text = text.replace(re2, (m) => m + lazies);
    }

    const routes = AI_CATALOG_NORMALIZED.map(
      (t) => `  {
    path: "${t.path}",
    element: (
      <Suspense fallback={fallback}>
        <${t.component} />
      </Suspense>
    ),
  },`
    ).join("\n");
    const ifscRe =
      /path: "\/business-tools\/ifsc-code-finder",[\s\S]*?<\/Suspense>\s*\),\s*\},/;
    text = text.replace(ifscRe, (m) => m + "\n" + routes);
    fs.writeFileSync(p, text, "utf8");
  }

  // ensure lazy for any missing
  text = fs.readFileSync(p, "utf8");
  const missing = AI_CATALOG_NORMALIZED.filter((t) => !text.includes(`const ${t.component} = lazy`));
  if (missing.length) {
    const block =
      missing
        .map(
          (t) =>
            `const ${t.component} = lazy(() => import("../tools/${t.folder}/${t.component}"));`
        )
        .join("\n") + "\n";
    text = text.replace(
      /const AveragePriceCalculator = lazy\(\(\) => import\("\.\.\/tools\/stock-calculators\/AveragePriceCalculator"\)\);\r?\n/,
      (m) => m + block
    );
    fs.writeFileSync(p, text, "utf8");
  }
  console.log("patched routes; missing lazy left:", missing.length);
}

function patchSeo() {
  const p = path.join(ROOT, "src/seo/seoConfig.js");
  let text = fs.readFileSync(p, "utf8");
  if (!text.includes("aiTitleGenerator:")) {
    const blocks = AI_CATALOG_NORMALIZED.map(
      (t) => `
  ${t.seoKey}: {
    title: ${JSON.stringify(t.name + " | FreeToolsPro")},
    description: ${JSON.stringify(t.desc)},
    keywords: ${JSON.stringify(t.keywords.join(", "))},
    path: "${t.path}",
    type: "tool",
    category: "SoftwareApplication",
  },`
    ).join("\n");
    text = text.replace(/\n\};\s*$/, `${blocks}\n};\n`);
    fs.writeFileSync(p, text, "utf8");
  }
  const sr = path.join(ROOT, "src/components/config/seoRoutes.js");
  let srt = fs.readFileSync(sr, "utf8");
  if (!srt.includes("/ai-writing-tools/ai-title-generator")) {
    const blocks = AI_CATALOG_NORMALIZED.map(
      (t) => `  "${t.path}": {
    title: ${JSON.stringify(t.name + " | FreeToolsPro")},
    description: ${JSON.stringify(t.desc)},
  },`
    ).join("\n");
    srt = srt.replace(/\n\};\s*$/, `\n${blocks}\n};\n`);
    fs.writeFileSync(sr, srt, "utf8");
  }
  console.log("patched seo");
}

function patchThemes() {
  const p = path.join(ROOT, "src/data/categoryThemes.js");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes('"ai-writing-tools"')) {
    console.log("themes ok");
    return;
  }
  const themeBlock = AI_CATEGORIES.map(
    ([id, label]) => `  "${id}": {
    id: "${id}",
    label: ${JSON.stringify(label.replace(/^AI /, ""))},
    accent: "#2dd4bf",
    accentSoft: "rgba(45, 212, 191, 0.16)",
    glowA: "rgba(45, 212, 191, 0.16)",
    glowB: "rgba(56, 189, 248, 0.12)",
    hint: ${JSON.stringify(label)},
  },`
  ).join("\n");
  text = text.replace(/\n\};\n\nconst FOLDER_TO_CATEGORY/, `\n${themeBlock}\n};\n\nconst FOLDER_TO_CATEGORY`);
  const folderLines = AI_CATEGORIES.map(([id]) => `  "${id}": "${id}",`).join("\n");
  text = text.replace(/\n\};\n\nexport function normalizeCategory/, `\n${folderLines}\n};\n\nexport function normalizeCategory`);
  const prefixLines = AI_CATEGORIES.map(([id, , , pathName]) => `  ["${pathName}/", "${id}"],`).join(
    "\n"
  );
  text = text.replace(/\n\];\n\nexport function categoryFromPath/, `\n${prefixLines}\n];\n\nexport function categoryFromPath`);
  fs.writeFileSync(p, text, "utf8");
  console.log("patched themes");
}

function patchHome() {
  const p = path.join(ROOT, "src/data/homeSections.js");
  let text = fs.readFileSync(p, "utf8");
  const priority = [
    "ai-title-generator",
    "prompt-enhancer",
    "seo-audit-ai",
    "code-reviewer",
    "ad-copy-generator",
    "ats-resume-checker",
    "ai-website-auditor",
    "blog-outline-generator",
    "unit-test-generator",
    "keyword-clustering",
    "meeting-notes-summarizer",
    "flashcard-generator",
    "prompt-quality-score",
    "n8n-workflow-generator",
    "alt-text-generator",
    "readability-checker",
  ];
  if (!text.includes('"ai-title-generator"')) {
    text = text.replace(
      /export const RECENTLY_ADDED_IDS = \[/,
      `export const RECENTLY_ADDED_IDS = [\n${priority.map((id) => `  "${id}",`).join("\n")}`
    );
  }
  if (!text.includes('"ai-writing-tools":')) {
    const blurbs = AI_CATEGORIES.map(
      ([id, name]) => `  "${id}": "${name} for creators, students, and teams.",`
    ).join("\n");
    text = text.replace(/export const COLLECTION_BLURBS = \{/, `export const COLLECTION_BLURBS = {\n${blurbs}`);
  }
  // Feature AI tools in trending strip
  if (!text.includes('"ai-title-generator"') || !text.includes("TRENDING_FEATURED_IDS")) {
    /* already may exist */
  }
  text = text.replace(
    /export const TRENDING_FEATURED_IDS = \[[\s\S]*?\];/,
    `export const TRENDING_FEATURED_IDS = [
  "ai-title-generator",
  "prompt-enhancer",
  "seo-audit-ai",
  "code-reviewer",
  "ad-copy-generator",
  "ats-resume-checker",
  "ai-website-auditor",
  "gold-rate-today",
  "petrol-price-today",
  "ipo-calendar",
];`
  );
  fs.writeFileSync(p, text, "utf8");
  console.log("patched home");
}

function patchSitemapVite() {
  const sm = path.join(ROOT, "public/sitemap.xml");
  let text = fs.readFileSync(sm, "utf8");
  if (!text.includes("/ai-writing-tools/ai-title-generator")) {
    const urls = AI_CATALOG_NORMALIZED.map(
      (t) => `  <url>
    <loc>https://freetoolspro.in${t.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>`
    ).join("\n");
    text = text.replace("</urlset>", `${urls}\n</urlset>`);
    fs.writeFileSync(sm, text, "utf8");
  }
  const vite = path.join(ROOT, "vite.config.js");
  let vt = fs.readFileSync(vite, "utf8");
  if (!vt.includes("/ai-writing-tools/ai-title-generator")) {
    const paths = AI_CATALOG_NORMALIZED.map((t) => `        "${t.path}"`).join(",\n");
    vt = vt.replace(/dynamicRoutes:\s*\[/, `dynamicRoutes: [\n${paths},`);
    fs.writeFileSync(vite, vt, "utf8");
  }
  console.log("patched sitemap/vite");
}

function patchWhatItDoes() {
  const p = path.join(ROOT, "src/data/toolWhatItDoes/newTools.js");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes("/ai-writing-tools/ai-title-generator")) return;
  const entries = AI_CATALOG_NORMALIZED.map(
    (t) => `  "${t.path}": {
    paragraphs: [
      ${JSON.stringify(t.name + " on FreeToolsPro: " + t.desc)},
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },`
  ).join("\n");
  text = text.replace(/\n\};\s*$/, `\n${entries}\n};\n`);
  fs.writeFileSync(p, text, "utf8");
}

generate();
patchDefinitions();
patchRoutes();
patchSeo();
patchThemes();
patchHome();
patchSitemapVite();
patchWhatItDoes();
console.log("DONE", AI_CATALOG_NORMALIZED.length);
