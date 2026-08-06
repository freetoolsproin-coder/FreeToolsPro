import fs from "fs";

const ID = "gold-silver-price-tracker";
const ROUTE = "/trending-tools/gold-silver-price-tracker";
const COMP = "GoldSilverPriceTracker";
const SEO_KEY = "goldSilverPriceTracker";

function patch(rel, fn) {
  if (!fs.existsSync(rel)) return;
  const before = fs.readFileSync(rel, "utf8");
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(rel, after);
    console.log("patched", rel);
  } else {
    console.log("unchanged", rel);
  }
}

patch("src/data/toolDefinitions.js", (t) =>
  t.replace(new RegExp(`\\n*\\{\\s*\\n\\s*id:\\s*"${ID}",[\\s\\S]*?\\n\\},`, "g"), "\n")
);

patch("src/routes/appRoutes.jsx", (t) =>
  t
    .replace(new RegExp(`\\nconst ${COMP} = lazy\\(\\(\\) => import\\("[^"]+"\\)\\);`, "g"), "")
    .replace(
      new RegExp(
        `\\n\\s*\\{\\s*\\n\\s*path:\\s*"${ROUTE.replace(/\//g, "\\/")}",[\\s\\S]*?\\n\\s*\\},`,
        "g"
      ),
      "\n"
    )
);

patch("src/seo/seoConfig.js", (t) =>
  t.replace(new RegExp(`\\n\\s*${SEO_KEY}:\\s*\\{[\\s\\S]*?\\n\\s*\\},`, "g"), "\n")
);

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

console.log("done");
