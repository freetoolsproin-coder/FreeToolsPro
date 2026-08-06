import fs from "fs";

const ID = "gold-silver-price-tracker";
const ROUTE = "/trending-tools/gold-silver-price-tracker";

function retryWrite(p, content, tries = 12) {
  for (let i = 0; i < tries; i++) {
    try {
      fs.writeFileSync(p, content);
      return;
    } catch (e) {
      if (i === tries - 1) throw e;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 400 * (i + 1));
    }
  }
}

function patch(rel, fn) {
  if (!fs.existsSync(rel)) {
    console.log("missing", rel);
    return;
  }
  const before = fs.readFileSync(rel, "utf8");
  const after = fn(before);
  if (after !== before) {
    retryWrite(rel, after);
    console.log("patched", rel);
  } else {
    console.log("unchanged", rel);
  }
}

patch("src/components/config/seoRoutes.js", (t) =>
  t.replace(
    new RegExp(`\\n\\s*"${ROUTE.replace(/\//g, "\\/")}":\\s*\\{[\\s\\S]*?\\n\\s*\\},`, "g"),
    "\n"
  )
);

patch("src/data/toolWhatItDoes/trendingTools.js", (t) =>
  t.replace(
    new RegExp(`\\n\\s*"${ROUTE.replace(/\//g, "\\/")}":\\s*\\{[\\s\\S]*?\\n\\s*\\},`, "g"),
    "\n"
  )
);

patch("src/data/homeSections.js", (t) =>
  t.replace(new RegExp(`\\n\\s*"${ID}",`, "g"), "\n")
);

patch("vite.config.js", (t) =>
  t.replace(new RegExp(`\\n\\s*"${ROUTE.replace(/\//g, "\\/")}"\\s*,`, "g"), "\n")
);

for (const rel of ["sitemap.xml", "public/sitemap.xml"]) {
  patch(rel, (t) =>
    t.replace(
      new RegExp(
        `\\s*<url>\\s*<loc>https://freetoolspro\\.in${ROUTE.replace(/\//g, "\\/")}</loc>[\\s\\S]*?</url>`,
        "g"
      ),
      ""
    )
  );
}

const jsx = "src/tools/trending/GoldSilverPriceTracker.jsx";
if (fs.existsSync(jsx)) {
  fs.unlinkSync(jsx);
  console.log("deleted", jsx);
} else {
  console.log("absent", jsx);
}

// Re-check primary files in case first run partially failed
patch("src/data/toolDefinitions.js", (t) =>
  t.replace(new RegExp(`\\n*\\{\\s*\\n\\s*id:\\s*"${ID}",[\\s\\S]*?\\n\\},`, "g"), "\n")
);
patch("src/routes/appRoutes.jsx", (t) =>
  t
    .replace(/\nconst GoldSilverPriceTracker = lazy\(\(\) => import\("[^"]+"\)\);/g, "")
    .replace(
      new RegExp(
        `\\n\\s*\\{\\s*\\n\\s*path:\\s*"${ROUTE.replace(/\//g, "\\/")}",[\\s\\S]*?\\n\\s*\\},`,
        "g"
      ),
      "\n"
    )
);
patch("src/seo/seoConfig.js", (t) =>
  t.replace(/\n\s*goldSilverPriceTracker:\s*\{[\s\S]*?\n\s*\},/g, "\n")
);

console.log("done");
