import fs from "fs";
import path from "path";

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f, a);
    else if (e.name.endsWith(".jsx")) a.push(f);
  }
  return a;
}

const stats = { hero: 0, pageContent: 0, contentLayout: 0, neither: 0, darkBg: 0 };
const neither = [];
const darkBg = [];

for (const f of walk("src/tools")) {
  const s = fs.readFileSync(f, "utf8");
  if (!s.includes("ToolHeroShell")) continue;
  stats.hero++;
  const rel = path.relative("src/tools", f);
  if (s.includes("ToolPageContent")) stats.pageContent++;
  else if (s.includes("ToolContentLayout")) {
    stats.contentLayout++;
  } else {
    stats.neither++;
    neither.push(rel);
  }
  if (s.includes("bg-[var(--ftp-ink)]") || s.includes('panel="dark"')) {
    stats.darkBg++;
    darkBg.push(rel);
  }
}

console.log(JSON.stringify(stats, null, 2));
console.log("\nNeither sample:", neither.slice(0, 25).join("\n"));
console.log("\nDark bg sample:", darkBg.slice(0, 15).join("\n"));
