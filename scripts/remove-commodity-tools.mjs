import fs from "fs";
import path from "path";

const ROOT = process.cwd();

const IDS = [
  "commodity-prices",
  "gold-rate-today",
  "silver-rate-today",
  "petrol-price-today",
  "diesel-price-today",
];

const COMPONENTS = [
  "CommodityPrices",
  "GoldRateToday",
  "SilverRateToday",
  "PetrolPriceToday",
  "DieselPriceToday",
];

const SEO_KEYS = [
  "commodityPrices",
  "goldRateToday",
  "silverRateToday",
  "petrolPriceToday",
  "dieselPriceToday",
];

const PATHS = IDS.map((id) => `/market-daily/${id}`);

function patch(rel, fn) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    console.log("skip missing", rel);
    return;
  }
  const before = fs.readFileSync(p, "utf8");
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(p, after);
    console.log("patched", rel);
  } else {
    console.log("unchanged", rel);
  }
}

function removeToolObjects(text, id) {
  // object blocks that start with id: "…"
  return text.replace(
    new RegExp(`\\n*\\{\\s*\\n\\s*id:\\s*"${id}",[\\s\\S]*?\\n\\},`, "g"),
    "\n"
  );
}

function removeRouteBlocks(text, routePath) {
  return text.replace(
    new RegExp(
      `\\n\\s*\\{\\s*\\n\\s*path:\\s*"${routePath.replace(/\//g, "\\/")}",[\\s\\S]*?\\n\\s*\\},`,
      "g"
    ),
    "\n"
  );
}

function removeLazy(text, name) {
  return text.replace(
    new RegExp(
      `\\nconst ${name} = lazy\\(\\(\\) => import\\("[^"]+"\\)\\);`,
      "g"
    ),
    ""
  );
}

function removeSeoKey(text, key) {
  return text.replace(
    new RegExp(`\\n\\s*${key}:\\s*\\{[\\s\\S]*?\\n\\s*\\},`, "g"),
    "\n"
  );
}

function removeSeoRoute(text, routePath) {
  return text.replace(
    new RegExp(
      `\\n\\s*"${routePath.replace(/\//g, "\\/")}":\\s*\\{[\\s\\S]*?\\n\\s*\\},`,
      "g"
    ),
    "\n"
  );
}

function removeWhatItDoes(text, routePath) {
  return text.replace(
    new RegExp(
      `\\n\\s*"${routePath.replace(/\//g, "\\/")}":\\s*\\{[\\s\\S]*?\\n\\s*\\},`,
      "g"
    ),
    "\n"
  );
}

function removeSitemapUrls(text) {
  let out = text;
  for (const route of PATHS) {
    out = out.replace(
      new RegExp(
        `\\s*<url>\\s*<loc>https://freetoolspro\\.in${route.replace(/\//g, "\\/")}</loc>[\\s\\S]*?</url>`,
        "g"
      ),
      ""
    );
  }
  return out;
}

function removeVitePaths(text) {
  let out = text;
  for (const route of PATHS) {
    out = out.replace(new RegExp(`\\n\\s*"${route.replace(/\//g, "\\/")}"\\s*,`, "g"), "\n");
  }
  return out;
}

function removeHomeIds(text) {
  let out = text;
  for (const id of IDS) {
    out = out.replace(new RegExp(`\\n\\s*"${id}",`, "g"), "\n");
  }
  return out;
}

// toolDefinitions
patch("src/data/toolDefinitions.js", (t) => {
  let out = t;
  for (const id of IDS) out = removeToolObjects(out, id);
  return out;
});

// appRoutes
patch("src/routes/appRoutes.jsx", (t) => {
  let out = t;
  for (const name of COMPONENTS) out = removeLazy(out, name);
  for (const route of PATHS) out = removeRouteBlocks(out, route);
  return out;
});

// seo
patch("src/seo/seoConfig.js", (t) => {
  let out = t;
  for (const key of SEO_KEYS) out = removeSeoKey(out, key);
  return out;
});

patch("src/components/config/seoRoutes.js", (t) => {
  let out = t;
  for (const route of PATHS) out = removeSeoRoute(out, route);
  return out;
});

patch("src/data/toolWhatItDoes/newTools.js", (t) => {
  let out = t;
  for (const route of PATHS) out = removeWhatItDoes(out, route);
  return out;
});

patch("src/data/homeSections.js", removeHomeIds);
patch("vite.config.js", removeVitePaths);
patch("sitemap.xml", removeSitemapUrls);
patch("public/sitemap.xml", removeSitemapUrls);

// financeCatalog2Manifest — drop daily market entries + DAILY_CONFIG
patch("src/data/financeCatalog2Manifest.js", (t) => {
  let out = t.replace(
    /\n\s*\/\/ Daily market pages[\s\S]*?(?=\n\];)/,
    "\n"
  );
  out = out.replace(/\nexport const DAILY_CONFIG = \{[\s\S]*?\n\};\n?/, "\n");
  return out;
});

// categoryThemes — remove market-daily theme + mappings
patch("src/data/categoryThemes.js", (t) => {
  let out = t.replace(
    /\n\s*"market-daily":\s*\{\s*\n\s*id:\s*"market-daily",[\s\S]*?\n\s*\},/,
    ""
  );
  out = out.replace(/\n\s*"market-daily":\s*"finance-tools",/, "");
  out = out.replace(/\n\s*\["\/market-daily\/",\s*"finance-tools"\],/, "");
  return out;
});

// BlogMarkdown internal path check — remove market-daily if present
patch("src/components/blog/BlogMarkdown.jsx", (t) =>
  t.replace(/\n\s*href\.startsWith\("\/market-daily\/"\)\s*\|\|/, "")
);

// delete files
const toDelete = [
  "src/data/marketDailyData.js",
  "src/tools/market-daily",
];
for (const rel of toDelete) {
  const p = path.join(ROOT, rel);
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
    console.log("deleted", rel);
  } else {
    console.log("absent", rel);
  }
}

console.log("DONE commodity cleanup");
