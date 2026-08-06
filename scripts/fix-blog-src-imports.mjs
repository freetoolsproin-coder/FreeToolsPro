import fs from "fs";
import path from "path";

function walk(d, acc = []) {
  for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(js|jsx)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

for (const f of walk("blog")) {
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  t = t.replaceAll('from "../../seo/brand"', 'from "../../src/seo/brand"');
  t = t.replaceAll(
    'from "../../data/toolDefinitions"',
    'from "../../src/data/toolDefinitions"'
  );
  if (t !== before) {
    fs.writeFileSync(f, t);
    console.log("fixed", f);
  }
}

{
  const f = "src/App.jsx";
  let t = fs.readFileSync(f, "utf8");
  t = t.replace(
    'from "./pages/blog/BlogRoutes"',
    'from "../blog/pages/BlogRoutes"'
  );
  t = t.replace(
    'from "./pages/blog/BlogRoutes"',
    'from "../blog/pages/BlogRoutes"'
  );
  // also catch if still old
  if (t.includes('"./pages/blog/BlogRoutes"')) {
    t = t.split('"./pages/blog/BlogRoutes"').join('"../blog/pages/BlogRoutes"');
  }
  fs.writeFileSync(f, t);
  console.log("App BlogRoutes import ok?", t.includes('../blog/pages/BlogRoutes'));
}

console.log("done");
