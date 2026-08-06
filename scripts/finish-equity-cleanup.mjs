import fs from "fs";
import path from "path";

const ROOT = process.cwd();

function stripSitemapUrls(text, needles) {
  let out = text;
  for (const needle of needles) {
    const re = new RegExp(
      `\\s*<url>\\s*<loc>https://freetoolspro\\.in/[^<]*${needle}</loc>[\\s\\S]*?</url>`,
      "g"
    );
    out = out.replace(re, "");
  }
  out = out.replace(
    /\s*<url>\s*<loc>https:\/\/freetoolspro\.in\/stock-calculators\/[^<]+<\/loc>[\s\S]*?<\/url>/g,
    ""
  );
  return out;
}

const needles = [
  "stock-profit-calculator",
  "option-profit-calculator",
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
];

for (const rel of ["sitemap.xml", "public/sitemap.xml"]) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  const before = fs.readFileSync(p, "utf8");
  const after = stripSitemapUrls(before, needles);
  fs.writeFileSync(p, after);
  console.log(
    rel,
    "removed equity urls?",
    before.length !== after.length,
    "still stock-profit?",
    after.includes("stock-profit")
  );
}

const orphanJsx = [
  "src/tools/calculators/OptionProfitCalculator.jsx",
  "src/tools/calculators/StockProfitCalculator.jsx",
  "src/tools/trending/IndianEquityMarketIndices.jsx",
];
for (const rel of orphanJsx) {
  const p = path.join(ROOT, rel);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log("deleted", rel);
  } else {
    console.log("absent", rel);
  }
}

const stockDir = path.join(ROOT, "src/tools/stock-calculators");
if (fs.existsSync(stockDir)) {
  fs.rmSync(stockDir, { recursive: true, force: true });
  console.log("deleted stock-calculators dir");
}

// vite.config.js path list cleanup
const vite = path.join(ROOT, "vite.config.js");
if (fs.existsSync(vite)) {
  let t = fs.readFileSync(vite, "utf8");
  const before = t;
  for (const id of needles) {
    t = t.replace(new RegExp(`\\n\\s*"/[^"]*${id}"\\s*,`, "g"), "\n");
  }
  t = t.replace(/\n\s*"\/stock-calculators\/[^"]+"\s*,/g, "\n");
  if (t !== before) {
    fs.writeFileSync(vite, t);
    console.log("patched vite.config.js");
  } else {
    console.log("vite.config.js unchanged");
  }
}
