import fs from "fs";

function retryWrite(p, content, tries = 10) {
  for (let i = 0; i < tries; i++) {
    try {
      fs.writeFileSync(p, content);
      return;
    } catch (e) {
      if (i === tries - 1) throw e;
      const sab = new SharedArrayBuffer(4);
      Atomics.wait(new Int32Array(sab), 0, 0, 300 * (i + 1));
    }
  }
}

function retryRm(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

const paths = [
  "/market-daily/commodity-prices",
  "/market-daily/gold-rate-today",
  "/market-daily/silver-rate-today",
  "/market-daily/petrol-price-today",
  "/market-daily/diesel-price-today",
];

{
  const p = "vite.config.js";
  let t = fs.readFileSync(p, "utf8");
  for (const r of paths) {
    t = t.replace(new RegExp(`\\n\\s*"${r.replace(/\//g, "\\/")}"\\s*,`, "g"), "\n");
  }
  retryWrite(p, t);
  console.log("vite", !t.includes("market-daily"));
}

for (const rel of ["sitemap.xml", "public/sitemap.xml"]) {
  if (!fs.existsSync(rel)) continue;
  let t = fs.readFileSync(rel, "utf8");
  for (const r of paths) {
    t = t.replace(
      new RegExp(
        `\\s*<url>\\s*<loc>https://freetoolspro\\.in${r.replace(/\//g, "\\/")}</loc>[\\s\\S]*?</url>`,
        "g"
      ),
      ""
    );
  }
  retryWrite(rel, t);
  console.log(rel, !t.includes("market-daily"));
}

{
  const p = "src/data/financeCatalog2Manifest.js";
  let t = fs.readFileSync(p, "utf8");
  t = t.replace(/\nexport const DAILY_CONFIG = \{[\s\S]*?\n\};\n?/, "\n");
  t = t.replace(/\n\s*\/\/ Daily market pages[\s\S]*?(?=\n\];)/, "\n");
  for (const id of [
    "commodity-prices",
    "gold-rate-today",
    "silver-rate-today",
    "petrol-price-today",
    "diesel-price-today",
  ]) {
    t = t.replace(new RegExp(`\\n\\s*\\["${id}"[^\\]]*\\],`, "g"), "\n");
  }
  retryWrite(p, t);
  console.log("manifest", !t.includes("commodity-prices") && !t.includes("DAILY_CONFIG"));
}

{
  const p = "src/data/categoryThemes.js";
  let t = fs.readFileSync(p, "utf8");
  t = t.replace(
    /\n\s*"market-daily":\s*\{\s*\n\s*id:\s*"market-daily",[\s\S]*?\n\s*\},/,
    ""
  );
  t = t.replace(/\n\s*"market-daily":\s*"finance-tools",/, "");
  t = t.replace(/\n\s*\["\/market-daily\/",\s*"finance-tools"\],/, "");
  retryWrite(p, t);
  console.log("themes", !t.includes("market-daily"));
}

{
  const p = "src/components/blog/BlogMarkdown.jsx";
  let t = fs.readFileSync(p, "utf8");
  t = t.replace(/\n\s*href\.startsWith\("\/market-daily\/"\)\s*\|\|/, "");
  t = t.replace(/\n\s*href\.startsWith\("\/stock-"\)\s*\|\|/, "");
  retryWrite(p, t);
  console.log("blogmd", !t.includes("market-daily") && !t.includes("/stock-"));
}

retryRm("src/data/marketDailyData.js");
retryRm("src/tools/market-daily");
console.log(
  "deleted",
  !fs.existsSync("src/tools/market-daily"),
  !fs.existsSync("src/data/marketDailyData.js")
);
