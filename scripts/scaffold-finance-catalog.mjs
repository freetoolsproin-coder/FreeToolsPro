/**
 * Scaffold finance calculators + register categories/routes/SEO/home.
 * node scripts/scaffold-finance-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { FINANCE_CATALOG_NORMALIZED, FIELD_PRESETS } = await import(
  pathToFileURL(path.join(ROOT, "src/data/financeCatalogManifest.js")).href
);

const NEW_CATEGORIES = [
  ["stock-calculators", "Stock Calculators", "CandlestickChart", "/stock-calculators"],
  ["mutual-fund-tools", "Mutual Fund Tools", "TrendingUp", "/mutual-fund-tools"],
  ["loan-calculators", "Loan Calculators", "Landmark", "/loan-calculators"],
  ["tax-tools", "Tax Tools (India)", "ReceiptIndianRupee", "/tax-tools"],
  ["salary-hr", "Salary & HR", "Wallet", "/salary-hr"],
];

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function emitTool(tool) {
  const fields = FIELD_PRESETS[tool.kind];
  if (!fields) throw new Error(`No fields for ${tool.kind} (${tool.id})`);
  return `import { ${tool.icon} } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = ${JSON.stringify(fields, null, 2)};

export default function ${tool.component}() {
  return (
    <FinanceCalcShell
      seoKey="${tool.seoKey}"
      category="${tool.category}"
      path="${tool.path}"
      icon={${tool.icon}}
      title=${JSON.stringify(tool.name)}
      subtitle=${JSON.stringify(tool.desc)}
      fields={fields}
      compute={financeCompute.${tool.kind}}
    />
  );
}
`;
}

function generateTools() {
  for (const tool of FINANCE_CATALOG_NORMALIZED) {
    write(path.join(ROOT, "src/tools", tool.folder, `${tool.component}.jsx`), emitTool(tool));
  }
  console.log("wrote", FINANCE_CATALOG_NORMALIZED.length, "tools");
}

function ensureIcons(text) {
  const used = new Set([
    ...FINANCE_CATALOG_NORMALIZED.map((t) => t.icon),
    ...NEW_CATEGORIES.map((c) => c[2]),
    "Wallet",
    "ArrowRightLeft",
    "Target",
    "Award",
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

  if (!text.includes('id: "stock-calculators"')) {
    const cats = NEW_CATEGORIES.map(
      ([id, name, icon, pathName]) =>
        `  { id: "${id}", name: "${name}", icon: ${icon}, path: "${pathName}" },`
    ).join("\n");
    text = text.replace(
      /\{ id: "seo-tools", name: "SEO Tools", icon: Search, path: "\/seo-tools" \},\n\];/,
      `{ id: "seo-tools", name: "SEO Tools", icon: Search, path: "/seo-tools" },\n${cats}\n];`
    );
  }

  const remaps = {
    "emi-calculator": "loan-calculators",
    "sip-calculator": "mutual-fund-tools",
    "inflation-calculator": "mutual-fund-tools",
    "loan-eligibility-calculator": "loan-calculators",
    "mortgage-calculator": "loan-calculators",
    "stock-profit-calculator": "stock-calculators",
    "gratuity-calculator": "salary-hr",
    "salary-calculator": "salary-hr",
    "gst-calculator": "tax-tools",
    "epf-checker": "salary-hr",
  };
  for (const [id, cat] of Object.entries(remaps)) {
    const re = new RegExp(`(id: "${id}",[\\s\\S]*?category: ")([^"]+)(")`);
    if (re.test(text)) text = text.replace(re, `$1${cat}$3`);
  }

  // rename stock profit closer to Profit/Loss
  text = text.replace(
    /id: "stock-profit-calculator",\n  path: "\/calculators\/stock-profit-calculator",\n  name: "Stock Profit Calculator",/,
    'id: "stock-profit-calculator",\n  path: "/calculators/stock-profit-calculator",\n  name: "Stock Profit Calculator",'
  );

  if (!text.includes('id: "average-price-calculator"')) {
    const defs = FINANCE_CATALOG_NORMALIZED.map((tool) => {
      const kws = tool.keywords.map((k) => JSON.stringify(k)).join(", ");
      return `
{
  id: "${tool.id}",
  path: "${tool.path}",
  name: ${JSON.stringify(tool.name)},
  desc: ${JSON.stringify(tool.desc)},
  icon: ${tool.icon},
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
  console.log("patched toolDefinitions.js");
}

function patchRoutes() {
  const p = path.join(ROOT, "src/routes/appRoutes.jsx");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes("AveragePriceCalculator")) {
    console.log("routes already have finance tools");
    return;
  }

  const lazies =
    FINANCE_CATALOG_NORMALIZED.map(
      (t) => `const ${t.component} = lazy(() => import("../tools/${t.folder}/${t.component}"));`
    ).join("\n") + "\n";

  const re =
    /const LlmReadinessChecker = lazy\(\(\) => import\("\.\.\/tools\/developer-tools\/LlmReadinessChecker"\)\);\r?\n/;
  if (!re.test(text)) throw new Error("lazy anchor missing");
  text = text.replace(re, (m) => m + lazies);

  const routes = FINANCE_CATALOG_NORMALIZED.map(
    (t) => `  {
    path: "${t.path}",
    element: (
      <Suspense fallback={fallback}>
        <${t.component} />
      </Suspense>
    ),
  },`
  ).join("\n");

  // append before final export or after last route - find export const appRoutes end is hard
  // insert after ifsc block again
  const ifscRe =
    /path: "\/business-tools\/ifsc-code-finder",[\s\S]*?<\/Suspense>\s*\),\s*\},/;
  if (!ifscRe.test(text)) throw new Error("ifsc route missing");
  text = text.replace(ifscRe, (m) => m + "\n" + routes);

  fs.writeFileSync(p, text, "utf8");
  console.log("patched appRoutes.jsx");
}

function patchSeo() {
  const p = path.join(ROOT, "src/seo/seoConfig.js");
  let text = fs.readFileSync(p, "utf8");
  if (!text.includes("averagePriceCalculator:")) {
    const blocks = FINANCE_CATALOG_NORMALIZED.map(
      (t) => `
  ${t.seoKey}: {
    title: ${JSON.stringify(t.name + " | FreeToolsPro")},
    description: ${JSON.stringify(t.desc)},
    keywords: ${JSON.stringify(t.keywords.join(", "))},
    path: "${t.path}",
    type: "tool",
    category: "FinanceApplication",
  },`
    ).join("\n");
    text = text.replace(/\n\};\s*$/, `${blocks}\n};\n`);
    fs.writeFileSync(p, text, "utf8");
  }

  const sr = path.join(ROOT, "src/components/config/seoRoutes.js");
  let srt = fs.readFileSync(sr, "utf8");
  if (!srt.includes("/stock-calculators/average-price-calculator")) {
    const blocks = FINANCE_CATALOG_NORMALIZED.map(
      (t) => `  "${t.path}": {
    title: ${JSON.stringify(t.name + " | FreeToolsPro")},
    description: ${JSON.stringify(t.desc)},
  },`
    ).join("\n");
    srt = srt.replace(/\n\};\s*$/, `\n${blocks}\n};\n`);
    fs.writeFileSync(sr, srt, "utf8");
  }
  console.log("patched SEO");
}

function patchThemes() {
  const p = path.join(ROOT, "src/data/categoryThemes.js");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes('"stock-calculators"')) {
    console.log("themes ok");
    return;
  }
  const themeBlock = NEW_CATEGORIES.map(
    ([id, label]) => `  "${id}": {
    id: "${id}",
    label: ${JSON.stringify(label.replace(/ Tools.*$/, "").replace(/ Calculators/, ""))},
    accent: "#14b8a6",
    accentSoft: "rgba(20, 184, 166, 0.16)",
    glowA: "rgba(56, 189, 248, 0.18)",
    glowB: "rgba(13, 148, 136, 0.2)",
    hint: ${JSON.stringify(label)},
  },`
  ).join("\n");
  text = text.replace(/\n\};\n\nconst FOLDER_TO_CATEGORY/, `\n${themeBlock}\n};\n\nconst FOLDER_TO_CATEGORY`);

  const folderLines = NEW_CATEGORIES.map(([id]) => `  "${id}": "${id}",`).join("\n");
  text = text.replace(
    /  "seo-tools": "seo-tools",\n\};/,
    `  "seo-tools": "seo-tools",\n${folderLines}\n};`
  );
  const prefixLines = NEW_CATEGORIES.map(([id, , , pathName]) => `  ["${pathName}/", "${id}"],`).join(
    "\n"
  );
  text = text.replace(
    /  \["\/seo-tools\/", "seo-tools"\],\n\];/,
    `  ["/seo-tools/", "seo-tools"],\n${prefixLines}\n];`
  );
  fs.writeFileSync(p, text, "utf8");
  console.log("patched themes");
}

function patchHome() {
  const p = path.join(ROOT, "src/data/homeSections.js");
  let text = fs.readFileSync(p, "utf8");
  const ids = FINANCE_CATALOG_NORMALIZED.map((t) => t.id);
  const priority = [
    "income-tax-calculator",
    "home-loan-calculator",
    "fire-calculator",
    "in-hand-salary-calculator",
    "cagr-calculator",
    "lumpsum-calculator",
    "old-vs-new-tax-regime",
    "position-size-calculator",
    "brokerage-calculator",
    "retirement-corpus-calculator",
    "tds-calculator",
    "epf-interest-calculator",
  ];
  const ordered = [...priority, ...ids.filter((i) => !priority.includes(i))];
  if (!text.includes('"average-price-calculator"')) {
    text = text.replace(
      /export const RECENTLY_ADDED_IDS = \[/,
      `export const RECENTLY_ADDED_IDS = [\n${ordered
        .slice(0, 16)
        .map((id) => `  "${id}",`)
        .join("\n")}`
    );
  }
  if (!text.includes('"stock-calculators":')) {
    const blurbs = NEW_CATEGORIES.map(
      ([id, name]) => `  "${id}": "${name} for Indian investors and salaried users.",`
    ).join("\n");
    text = text.replace(/export const COLLECTION_BLURBS = \{/, `export const COLLECTION_BLURBS = {\n${blurbs}`);
  }
  fs.writeFileSync(p, text, "utf8");
  console.log("patched home");
}

function patchSitemapVite() {
  const sm = path.join(ROOT, "public/sitemap.xml");
  let text = fs.readFileSync(sm, "utf8");
  if (!text.includes("/stock-calculators/average-price-calculator")) {
    const urls = FINANCE_CATALOG_NORMALIZED.map(
      (t) => `  <url>
    <loc>https://freetoolspro.in${t.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    ).join("\n");
    text = text.replace("</urlset>", `${urls}\n</urlset>`);
    fs.writeFileSync(sm, text, "utf8");
  }
  const vite = path.join(ROOT, "vite.config.js");
  let vt = fs.readFileSync(vite, "utf8");
  if (!vt.includes("/stock-calculators/average-price-calculator")) {
    const paths = FINANCE_CATALOG_NORMALIZED.map((t) => `        "${t.path}"`).join(",\n");
    vt = vt.replace(/dynamicRoutes:\s*\[/, `dynamicRoutes: [\n${paths},`);
    fs.writeFileSync(vite, vt, "utf8");
  }
  console.log("patched sitemap/vite");
}

function patchWhatItDoes() {
  const p = path.join(ROOT, "src/data/toolWhatItDoes/newTools.js");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes("/stock-calculators/average-price-calculator")) return;
  const entries = FINANCE_CATALOG_NORMALIZED.map(
    (t) => `  "${t.path}": {
    paragraphs: [
      ${JSON.stringify(t.name + " on FreeToolsPro: " + t.desc)},
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },`
  ).join("\n");
  text = text.replace(/\n\};\s*$/, `\n${entries}\n};\n`);
  fs.writeFileSync(p, text, "utf8");
  console.log("patched what-it-does");
}

generateTools();
patchDefinitions();
patchRoutes();
patchSeo();
patchThemes();
patchHome();
patchSitemapVite();
patchWhatItDoes();
console.log("DONE", FINANCE_CATALOG_NORMALIZED.length);
