/**
 * Remove equity-market tools from catalog, routes, SEO, sitemap, vite, home.
 * node scripts/remove-equity-market-tools.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const REMOVE_IDS = new Set([
  "stock-profit-calculator",
  "indian-equity-market-indices",
  "average-price-calculator",
  "profit-loss-calculator",
  "position-size-calculator",
  "risk-reward-calculator",
  "brokerage-calculator",
  "delivery-charges-calculator",
  "intraday-charges-calculator",
  "cagr-calculator",
  "dividend-yield-calculator",
  "market-holidays",
  "ipo-calendar",
  "dividend-calendar",
  "bonus-shares-calendar",
  "stock-splits",
  "results-calendar",
  "fii-dii-activity",
  "market-news",
]);

const REMOVE_PATH_PREFIXES = [
  "/stock-calculators/",
  "/calculators/stock-profit-calculator",
  "/trending-tools/indian-equity-market-indices",
  "/market-daily/market-holidays",
  "/market-daily/ipo-calendar",
  "/market-daily/dividend-calendar",
  "/market-daily/bonus-shares-calendar",
  "/market-daily/stock-splits",
  "/market-daily/results-calendar",
  "/market-daily/fii-dii-activity",
  "/market-daily/market-news",
];

const COMPONENT_NAMES = [
  "StockProfitCalculator",
  "IndianEquityMarketIndices",
  "AveragePriceCalculator",
  "ProfitLossCalculator",
  "PositionSizeCalculator",
  "RiskRewardCalculator",
  "BrokerageCalculator",
  "DeliveryChargesCalculator",
  "IntradayChargesCalculator",
  "CagrCalculator",
  "DividendYieldCalculator",
  "MarketHolidays",
  "IpoCalendar",
  "DividendCalendar",
  "BonusSharesCalendar",
  "StockSplits",
  "ResultsCalendar",
  "FiiDiiActivity",
  "MarketNews",
];

function shouldRemovePath(p) {
  return REMOVE_PATH_PREFIXES.some((pre) => p === pre || p.startsWith(pre));
}

function stripToolBlocks(text) {
  // Remove tool definition objects by id
  for (const id of REMOVE_IDS) {
    const re = new RegExp(
      `\\n\\{\\s*\\n\\s*id: "${id}",[\\s\\S]*?\\n\\},`,
      "g"
    );
    text = text.replace(re, "\n");
  }
  return text;
}

function stripRoutes(text) {
  for (const name of COMPONENT_NAMES) {
    text = text.replace(
      new RegExp(`\\nconst ${name} = lazy\\(\\(\\) => import\\("[^"]+"\\)\\);\\r?\\n`, "g"),
      "\n"
    );
  }
  // Remove route objects whose path matches
  text = text.replace(
    /\n\s*\{\s*\n\s*path: "([^"]+)",\s*\n\s*element: \(\s*\n\s*<Suspense fallback=\{fallback\}>\s*\n\s*<([A-Za-z0-9]+) \/>\s*\n\s*<\/Suspense>\s*\n\s*\),\s*\n\s*\},/g,
    (full, routePath, comp) => {
      if (shouldRemovePath(routePath) || COMPONENT_NAMES.includes(comp)) return "\n";
      return full;
    }
  );
  return text;
}

function stripSeoObject(text) {
  // seoConfig.js style: key: { ... path: "..." }
  for (const pre of REMOVE_PATH_PREFIXES) {
    // path field based removal for nested objects is hard; remove by path string blocks
  }
  text = text.replace(
    /\n\s*[A-Za-z0-9_]+:\s*\{[^{}]*?path:\s*"([^"]+)"[^{}]*?\},/g,
    (full, p) => (shouldRemovePath(p) ? "\n" : full)
  );
  // seoRoutes style: "/path": { ... }
  text = text.replace(
    /\n\s*"(\/[^"]+)":\s*\{[^{}]*?\},/g,
    (full, p) => (shouldRemovePath(p) ? "\n" : full)
  );
  return text;
}

function stripSitemap(text) {
  return text.replace(
    /\s*<url>\s*<loc>https:\/\/freetoolspro\.in(\/[^<]+)<\/loc>[\s\S]*?<\/url>/g,
    (full, p) => (shouldRemovePath(p) ? "" : full)
  );
}

function stripViteRoutes(text) {
  return text.replace(/\n\s*"(\/[^"]+)"\s*,/g, (full, p) =>
    shouldRemovePath(p) ? "\n" : full
  );
}

function stripHomeIds(text) {
  for (const id of REMOVE_IDS) {
    text = text.replace(new RegExp(`\\n\\s*"${id}",`, "g"), "\n");
  }
  return text;
}

function stripWhatItDoes(text) {
  return text.replace(
    /\n\s*"(\/[^"]+)":\s*\{[\s\S]*?\n\s*\},/g,
    (full, p) => (shouldRemovePath(p) ? "\n" : full)
  );
}

function deleteDirs() {
  const dirs = [
    "src/tools/stock-calculators",
  ];
  const files = [
    "src/tools/calculators/StockProfitCalculator.jsx",
    "src/tools/trending/IndianEquityMarketIndices.jsx",
    "src/tools/market-daily/MarketHolidays.jsx",
    "src/tools/market-daily/IpoCalendar.jsx",
    "src/tools/market-daily/DividendCalendar.jsx",
    "src/tools/market-daily/BonusSharesCalendar.jsx",
    "src/tools/market-daily/StockSplits.jsx",
    "src/tools/market-daily/ResultsCalendar.jsx",
    "src/tools/market-daily/FiiDiiActivity.jsx",
    "src/tools/market-daily/MarketNews.jsx",
  ];
  for (const d of dirs) {
    const full = path.join(ROOT, d);
    if (fs.existsSync(full)) fs.rmSync(full, { recursive: true, force: true });
  }
  for (const f of files) {
    const full = path.join(ROOT, f);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  }
}

function patch(file, fn) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) return;
  const before = fs.readFileSync(p, "utf8");
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(p, after, "utf8");
    console.log("patched", file);
  }
}

deleteDirs();
patch("src/data/toolDefinitions.js", stripToolBlocks);
patch("src/routes/appRoutes.jsx", stripRoutes);
patch("src/seo/seoConfig.js", stripSeoObject);
patch("src/components/config/seoRoutes.js", stripSeoObject);
patch("public/sitemap.xml", stripSitemap);
patch("vite.config.js", stripViteRoutes);
patch("src/data/homeSections.js", stripHomeIds);
patch("src/data/toolWhatItDoes/newTools.js", stripWhatItDoes);
patch("src/data/toolWhatItDoes/trendingTools.js", stripWhatItDoes);
patch("src/data/toolWhatItDoes/calculators.js", stripWhatItDoes);
patch("src/pages/Home.jsx", (t) =>
  t.replace("mortgage, stock/option profit, and gratuity tools.", "mortgage and gratuity tools.")
);

// Clean unused CandlestickChart if only used by removed tools — leave icons alone.

console.log("DONE removed", REMOVE_IDS.size, "tool ids");
