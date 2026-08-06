import fs from "fs";

const ID = "gas-supply-distributor";
const ROUTE = "/trending-tools/gas-supply-distributor";
const COMP = "GasSupplyDistributor";
const SEO_KEY = "gasSupplyDistributor";
const WHAT_FILE = "src/data/toolWhatItDoes/trendingTools.js";

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

/** Remove object keyed by route using brace depth (avoids non-greedy orphans). */
function removeKeyedObject(text, key) {
  const needle = `"${key}":`;
  const start = text.indexOf(needle);
  if (start < 0) return text;

  let i = start + needle.length;
  while (i < text.length && /\s/.test(text[i])) i++;
  if (text[i] !== "{") return text;

  let depth = 0;
  let end = i;
  for (; end < text.length; end++) {
    const ch = text[end];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        end++;
        break;
      }
    }
  }

  let from = start;
  while (from > 0 && (text[from - 1] === " " || text[from - 1] === "\t")) from--;
  if (text[from - 1] === "\n") from--;
  if (text[from - 1] === "\r") from--;

  let to = end;
  if (text[to] === ",") to++;
  if (text[to] === "\r") to++;
  if (text[to] === "\n") to++;

  return text.slice(0, from) + text.slice(to);
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

patch(WHAT_FILE, (t) => removeKeyedObject(t, ROUTE));

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

const jsx = "src/tools/trending/GasSupplyDistributor.jsx";
if (fs.existsSync(jsx)) {
  fs.unlinkSync(jsx);
  console.log("deleted", jsx);
} else {
  console.log("absent", jsx);
}

console.log("done");
