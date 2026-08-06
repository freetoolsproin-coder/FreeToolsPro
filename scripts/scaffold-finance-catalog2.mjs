/**
 * Scaffold retirement/banking/insurance/business/daily market tools.
 * node scripts/scaffold-finance-catalog2.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const { FINANCE2_NORMALIZED, FIELD_PRESETS_2, DAILY_CONFIG } = await import(
  pathToFileURL(path.join(ROOT, "src/data/financeCatalog2Manifest.js")).href
);

const NEW_CATEGORIES = [
  ["retirement-tools", "Retirement", "PiggyBank", "/retirement-tools"],
  ["banking-tools", "Banking", "Landmark", "/banking-tools"],
  ["insurance-tools", "Insurance", "ShieldCheck", "/insurance-tools"],
  ["business-finance", "Business Finance", "BriefcaseBusiness", "/business-finance"],
  ["market-daily", "Market Daily", "CalendarDays", "/market-daily"],
];

const ICON_FIX = {
  HeartPulse: "Heart",
  Newspaper: "FileText",
  Fuel: "Gauge",
  Gift: "Sparkles",
  CreditCard: "Wallet",
  Shield: "ShieldCheck",
};

function fixIcon(icon) {
  return ICON_FIX[icon] || icon;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function emitCalc(tool) {
  const icon = fixIcon(tool.icon);
  const fields = FIELD_PRESETS_2[tool.kind];
  if (!fields) throw new Error(`Missing fields for ${tool.kind}`);
  return `import { ${icon} } from "lucide-react";
import FinanceCalcShell from "../_shared/FinanceCalcShell";
import { financeCompute } from "../_shared/financeFormulas";

const fields = ${JSON.stringify(fields, null, 2)};

export default function ${tool.component}() {
  return (
    <FinanceCalcShell
      seoKey="${tool.seoKey}"
      category="${tool.category}"
      path="${tool.path}"
      icon={${icon}}
      title=${JSON.stringify(tool.name)}
      subtitle=${JSON.stringify(tool.desc)}
      fields={fields}
      compute={financeCompute.${tool.kind}}
    />
  );
}
`;
}

function emitDaily(tool) {
  const icon = fixIcon(tool.icon);
  const cfg = DAILY_CONFIG[tool.kind];
  if (!cfg) throw new Error(`No daily config for ${tool.kind}`);
  return `import { ${icon} } from "lucide-react";
import DailyListShell from "../_shared/DailyListShell";
import { ${cfg.dataKey} } from "../../data/marketDailyData";

export default function ${tool.component}() {
  return (
    <DailyListShell
      seoKey="${tool.seoKey}"
      category="${tool.category}"
      path="${tool.path}"
      icon={${icon}}
      title=${JSON.stringify(tool.name)}
      subtitle=${JSON.stringify(tool.desc)}
      rows={${cfg.dataKey}}
      columns={${JSON.stringify(cfg.columns)}}
      searchKeys={${JSON.stringify(cfg.searchKeys)}}
    />
  );
}
`;
}

function emitMetal(tool) {
  const icon = fixIcon(tool.icon);
  const isGold = tool.kind === "gold_today";
  return `import { useState } from "react";
import { ${icon} } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { METAL_TODAY } from "../../data/marketDailyData";

export default function ${tool.component}() {
  const [grams, setGrams] = useState(10);
  ${isGold ? `const [purity, setPurity] = useState("gold22k");
  const rate = purity === "gold24k" ? METAL_TODAY.gold24k : METAL_TODAY.gold22k;` : `const rate = METAL_TODAY.silver;`}
  const total = (Number(grams) || 0) * rate;
  return (
    <>
      <Seo page="${tool.seoKey}" />
      <ToolHeroShell category="${tool.category}" icon={${icon}} title=${JSON.stringify(tool.name)} subtitle=${JSON.stringify(tool.desc)} layout="stack" panel="light">
        <div className="grid gap-3 sm:grid-cols-2">
          ${
            isGold
              ? `<div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">24K / g</p><p className="text-xl font-semibold">₹{METAL_TODAY.gold24k.toLocaleString("en-IN")}</p></div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">22K / g</p><p className="text-xl font-semibold">₹{METAL_TODAY.gold22k.toLocaleString("en-IN")}</p></div>`
              : `<div className="rounded-xl border border-[var(--ftp-line)] bg-white p-4 sm:col-span-2"><p className="text-xs uppercase text-[var(--ftp-ink-soft)]">Silver / g</p><p className="text-xl font-semibold">₹{METAL_TODAY.silver}</p></div>`
          }
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          ${
            isGold
              ? `<label className="text-sm text-[var(--ftp-ink-soft)]">Purity<select className={selectDark + " mt-1.5"} value={purity} onChange={(e) => setPurity(e.target.value)}><option value="gold22k">22K</option><option value="gold24k">24K</option></select></label>`
              : ""
          }
          <label className="text-sm text-[var(--ftp-ink-soft)]">Grams<input className={inputDark + " mt-1.5"} type="number" value={grams} onChange={(e) => setGrams(e.target.value)} /></label>
        </div>
        <p className="mt-4 text-2xl font-semibold">≈ ₹{Math.round(total).toLocaleString("en-IN")}</p>
        <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">{METAL_TODAY.asOf}</p>
      </ToolHeroShell>
      <ToolContentLayout category="${tool.category}" currentToolPath="${tool.path}" />
    </>
  );
}
`;
}

function emitFuel(tool) {
  const icon = fixIcon(tool.icon);
  const key = tool.kind === "petrol_today" ? "petrol" : "diesel";
  return `import { ${icon} } from "lucide-react";
import DailyListShell from "../_shared/DailyListShell";
import { FUEL_RATES } from "../../data/marketDailyData";

const rows = FUEL_RATES.${key}.map((r) => ({ city: r.city, price: "₹" + r.price }));

export default function ${tool.component}() {
  return (
    <DailyListShell
      seoKey="${tool.seoKey}"
      category="${tool.category}"
      path="${tool.path}"
      icon={${icon}}
      title=${JSON.stringify(tool.name)}
      subtitle=${JSON.stringify(tool.desc)}
      rows={rows}
      columns={[{ key: "city", label: "City" }, { key: "price", label: "Price / litre" }]}
      searchKeys={["city"]}
      footnote={FUEL_RATES.asOf}
    />
  );
}
`;
}

function emitInvoice(tool) {
  const icon = fixIcon(tool.icon);
  const gst = tool.kind === "gst_invoice";
  return `import { useMemo, useState } from "react";
import { ${icon} } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function ${tool.component}() {
  const [seller, setSeller] = useState("Your Business Pvt Ltd");
  const [buyer, setBuyer] = useState("Client Name");
  const [item, setItem] = useState("Consulting services");
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [gstin, setGstin] = useState("22AAAAA0000A1Z5");

  const doc = useMemo(() => {
    const base = Number(amount) || 0;
    const tax = ${gst ? "(base * (Number(rate) || 0)) / 100" : "0"};
    const total = base + tax;
    const cgst = tax / 2;
    const sgst = tax / 2;
    return [
      "INVOICE",
      "Seller: " + seller${gst ? ' + " | GSTIN: " + gstin' : ""},
      "Bill to: " + buyer,
      "Item: " + item,
      "Taxable: ₹" + base.toLocaleString("en-IN"),
      ${gst ? '"CGST: ₹" + Math.round(cgst).toLocaleString("en-IN"),' : ""}
      ${gst ? '"SGST: ₹" + Math.round(sgst).toLocaleString("en-IN"),' : ""}
      "Total: ₹" + Math.round(total).toLocaleString("en-IN"),
      "Date: " + new Date().toLocaleDateString("en-IN"),
    ].filter(Boolean).join("\\n");
  }, [seller, buyer, item, amount, rate, gstin]);

  return (
    <>
      <Seo page="${tool.seoKey}" />
      <ToolHeroShell category="${tool.category}" icon={${icon}} title=${JSON.stringify(tool.name)} subtitle=${JSON.stringify(tool.desc)} layout="stack" panel="light">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Seller<input className={inputDark + " mt-1.5"} value={seller} onChange={(e) => setSeller(e.target.value)} /></label>
          <label className="text-sm">Buyer<input className={inputDark + " mt-1.5"} value={buyer} onChange={(e) => setBuyer(e.target.value)} /></label>
          <label className="text-sm sm:col-span-2">Item / description<input className={inputDark + " mt-1.5"} value={item} onChange={(e) => setItem(e.target.value)} /></label>
          <label className="text-sm">Amount (₹)<input type="number" className={inputDark + " mt-1.5"} value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
          ${gst ? `<label className="text-sm">GST %<input type="number" className={inputDark + " mt-1.5"} value={rate} onChange={(e) => setRate(e.target.value)} /></label>
          <label className="text-sm sm:col-span-2">GSTIN<input className={inputDark + " mt-1.5"} value={gstin} onChange={(e) => setGstin(e.target.value)} /></label>` : ""}
        </div>
        <textarea className={textareaDark + " mt-4 min-h-[200px]"} value={doc} readOnly />
        <button type="button" className="mt-3 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => navigator.clipboard.writeText(doc)}>Copy invoice</button>
      </ToolHeroShell>
      <ToolContentLayout category="${tool.category}" currentToolPath="${tool.path}" />
    </>
  );
}
`;
}

function generate() {
  for (const tool of FINANCE2_NORMALIZED) {
    tool.icon = fixIcon(tool.icon);
    let content;
    if (tool.ui === "calc") content = emitCalc(tool);
    else if (tool.ui === "daily") content = emitDaily(tool);
    else if (tool.ui === "metal") content = emitMetal(tool);
    else if (tool.ui === "fuel") content = emitFuel(tool);
    else if (tool.ui === "invoice") content = emitInvoice(tool);
    else throw new Error("Unknown ui " + tool.ui);
    write(path.join(ROOT, "src/tools", tool.folder, `${tool.component}.jsx`), content);
  }
  console.log("wrote", FINANCE2_NORMALIZED.length, "tools");
}

function ensureIcons(text) {
  const used = new Set([
    ...FINANCE2_NORMALIZED.map((t) => fixIcon(t.icon)),
    ...NEW_CATEGORIES.map((c) => fixIcon(c[2])),
    "Heart",
    "CreditCard",
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

  if (!text.includes('id: "retirement-tools"')) {
    const cats = NEW_CATEGORIES.map(
      ([id, name, icon, pathName]) =>
        `  { id: "${id}", name: "${name}", icon: ${fixIcon(icon)}, path: "${pathName}" },`
    ).join("\n");
    text = text.replace(
      /\{ id: "salary-hr", name: "Salary & HR", icon: Wallet, path: "\/salary-hr" \},\n\];/,
      `{ id: "salary-hr", name: "Salary & HR", icon: Wallet, path: "/salary-hr" },\n${cats}\n];`
    );
  }

  const remaps = {
    "inventory-calculator": "business-finance",
    "invoice-template-creator": "business-finance",
    "quotation-generator": "business-finance",
    "gold-silver-price-tracker": "market-daily",
    "government-holidays": "market-daily",
  };
  for (const [id, cat] of Object.entries(remaps)) {
    const re = new RegExp(`(id: "${id}",[\\s\\S]*?category: ")([^"]+)(")`);
    if (re.test(text)) text = text.replace(re, `$1${cat}$3`);
  }

  if (!text.includes('id: "pension-calculator"')) {
    const defs = FINANCE2_NORMALIZED.map((tool) => {
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
  if (text.includes("PensionCalculator")) {
    console.log("routes exist");
    return;
  }
  const lazies =
    FINANCE2_NORMALIZED.map(
      (t) =>
        `const ${t.component} = lazy(() => import("../tools/${t.folder}/${t.component}"));`
    ).join("\n") + "\n";
  const re =
    /const AveragePriceCalculator = lazy\(\(\) => import\("\.\.\/tools\/stock-calculators\/AveragePriceCalculator"\)\);\r?\n/;
  if (!re.test(text)) {
    // fallback after LlmReadiness
    const re2 =
      /const LlmReadinessChecker = lazy\(\(\) => import\("\.\.\/tools\/developer-tools\/LlmReadinessChecker"\)\);\r?\n/;
    text = text.replace(re2, (m) => m + lazies);
  } else {
    text = text.replace(re, (m) => m + lazies);
  }

  const routes = FINANCE2_NORMALIZED.map(
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
  console.log("patched routes");
}

function patchSeo() {
  const p = path.join(ROOT, "src/seo/seoConfig.js");
  let text = fs.readFileSync(p, "utf8");
  if (!text.includes("pensionCalculator:")) {
    const blocks = FINANCE2_NORMALIZED.map(
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
  if (!srt.includes("/retirement-tools/pension-calculator")) {
    const blocks = FINANCE2_NORMALIZED.map(
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
  if (text.includes('"retirement-tools"')) return;
  const themeBlock = NEW_CATEGORIES.map(
    ([id, label]) => `  "${id}": {
    id: "${id}",
    label: ${JSON.stringify(label)},
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
    /  "salary-hr": "salary-hr",\n\};/,
    `  "salary-hr": "salary-hr",\n${folderLines}\n};`
  );
  // if salary-hr not in folder map yet
  if (!text.includes('"retirement-tools": "retirement-tools"')) {
    text = text.replace(
      /  "seo-tools": "seo-tools",\n\};/,
      `  "seo-tools": "seo-tools",\n  "salary-hr": "salary-hr",\n${folderLines}\n};`
    );
  }
  const prefixLines = NEW_CATEGORIES.map(([id, , , pathName]) => `  ["${pathName}/", "${id}"],`).join(
    "\n"
  );
  text = text.replace(
    /  \["\/salary-hr\/", "salary-hr"\],\n\];/,
    `  ["/salary-hr/", "salary-hr"],\n${prefixLines}\n];`
  );
  if (!text.includes('["/retirement-tools/"')) {
    text = text.replace(
      /  \["\/seo-tools\/", "seo-tools"\],\n\];/,
      `  ["/seo-tools/", "seo-tools"],\n  ["/salary-hr/", "salary-hr"],\n${prefixLines}\n];`
    );
  }
  fs.writeFileSync(p, text, "utf8");
  console.log("patched themes");
}

function patchHome() {
  const p = path.join(ROOT, "src/data/homeSections.js");
  let text = fs.readFileSync(p, "utf8");
  const priority = [
    "gold-rate-today",
    "petrol-price-today",
    "fd-calculator",
    "nps-calculator",
    "ipo-calendar",
    "market-holidays",
    "gst-invoice-generator",
    "term-insurance-calculator",
    "credit-card-emi-calculator",
    "fii-dii-activity",
    "diesel-price-today",
    "silver-rate-today",
  ];
  if (!text.includes('"pension-calculator"')) {
    text = text.replace(
      /export const RECENTLY_ADDED_IDS = \[/,
      `export const RECENTLY_ADDED_IDS = [\n${priority.map((id) => `  "${id}",`).join("\n")}`
    );
  }
  if (!text.includes('"retirement-tools":')) {
    const blurbs = NEW_CATEGORIES.map(
      ([id, name]) => `  "${id}": "${name} tools updated for everyday Indian use.",`
    ).join("\n");
    text = text.replace(/export const COLLECTION_BLURBS = \{/, `export const COLLECTION_BLURBS = {\n${blurbs}`);
  }
  // put some daily pages into trending by also listing high traffic - home trending uses category trending-tools
  // Update trending blurb
  text = text.replace(
    '"trending-tools": "India utilities, weather, markets, holidays, and everyday converters.",',
    '"trending-tools": "Market daily pages, India utilities, weather, and converters.",'
  );
  fs.writeFileSync(p, text, "utf8");
  console.log("patched home");
}

function patchSitemapVite() {
  const sm = path.join(ROOT, "public/sitemap.xml");
  let text = fs.readFileSync(sm, "utf8");
  if (!text.includes("/retirement-tools/pension-calculator")) {
    const urls = FINANCE2_NORMALIZED.map(
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
  if (!vt.includes("/retirement-tools/pension-calculator")) {
    const paths = FINANCE2_NORMALIZED.map((t) => `        "${t.path}"`).join(",\n");
    vt = vt.replace(/dynamicRoutes:\s*\[/, `dynamicRoutes: [\n${paths},`);
    fs.writeFileSync(vite, vt, "utf8");
  }
  console.log("patched sitemap/vite");
}

function patchWhatItDoes() {
  const p = path.join(ROOT, "src/data/toolWhatItDoes/newTools.js");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes("/retirement-tools/pension-calculator")) return;
  const entries = FINANCE2_NORMALIZED.map(
    (t) => `  "${t.path}": {
    paragraphs: [
      ${JSON.stringify(t.name + ": " + t.desc)},
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },`
  ).join("\n");
  text = text.replace(/\n\};\s*$/, `\n${entries}\n};\n`);
  fs.writeFileSync(p, text, "utf8");
}

// Also mark a few daily tools as trending-tools for home trending strip
function promoteTrending() {
  const p = path.join(ROOT, "src/data/toolDefinitions.js");
  let text = fs.readFileSync(p, "utf8");
  // Insert lightweight trending duplicates? Better: change category of select daily tools to trending-tools
  // User asked for categories though - keep market-daily and also prepend to RECENTLY_ADDED (done).
  // Optionally set showInDesktopNav - fine.
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
promoteTrending();

// verify lazy
const routes = fs.readFileSync(path.join(ROOT, "src/routes/appRoutes.jsx"), "utf8");
const missing = FINANCE2_NORMALIZED.filter((t) => !routes.includes(`const ${t.component} = lazy`));
console.log("missing lazy", missing.map((m) => m.component));
console.log("DONE", FINANCE2_NORMALIZED.length);
