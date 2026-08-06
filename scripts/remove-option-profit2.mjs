import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function patch(rel, fn) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return;
  const before = fs.readFileSync(p, "utf8");
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(p, after, "utf8");
    console.log("patched", rel);
  } else {
    console.log("unchanged", rel);
  }
}

patch("src/data/toolDefinitions.js", (t) =>
  t.replace(/\n\{\s*\n\s*id: "option-profit-calculator",[\s\S]*?\n\},/g, "\n")
);

patch("src/routes/appRoutes.jsx", (t) => {
  t = t.replace(
    /\nconst OptionProfitCalculator = lazy\(\(\) => import\("[^"]+"\)\);\r?\n/g,
    "\n"
  );
  t = t.replace(
    /\n\s*\{\s*\n\s*path: "\/calculators\/option-profit-calculator",[\s\S]*?\n\s*\},/g,
    "\n"
  );
  return t;
});

patch("src/seo/seoConfig.js", (t) =>
  t.replace(/\n\s*[A-Za-z0-9_]+:\s*\{[^{}]*?path:\s*"\/calculators\/option-profit-calculator"[^{}]*?\},/g, "\n")
);

patch("src/components/config/seoRoutes.js", (t) =>
  t.replace(/\n\s*"\/calculators\/option-profit-calculator":\s*\{[^{}]*?\},/g, "\n")
);

patch("public/sitemap.xml", (t) =>
  t.replace(
    /\s*<url>\s*<loc>https:\/\/freetoolspro\.in\/calculators\/option-profit-calculator<\/loc>[\s\S]*?<\/url>/g,
    ""
  )
);

patch("vite.config.js", (t) =>
  t.replace(/\n\s*"\/calculators\/option-profit-calculator"\s*,/g, "\n")
);

patch("src/data/toolWhatItDoes/calculators.js", (t) =>
  t.replace(/\n\s*"\/calculators\/option-profit-calculator":\s*\{[\s\S]*?\n\s*\},/g, "\n")
);

patch("src/data/homeSections.js", (t) =>
  t.replace(/\n\s*"option-profit-calculator",/g, "\n")
);

const jsx = path.join(ROOT, "src/tools/calculators/OptionProfitCalculator.jsx");
if (fs.existsSync(jsx)) {
  fs.unlinkSync(jsx);
  console.log("deleted OptionProfitCalculator.jsx");
}

console.log("done");
