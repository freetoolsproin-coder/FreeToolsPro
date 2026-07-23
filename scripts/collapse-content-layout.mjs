/**
 * Collapse ToolContentLayout children blocks — Layout now ignores SEO HTML
 * and renders standard how-it-works → steps → FAQ → related tools.
 * Converts:
 *   <ToolContentLayout ...>...huge...</ToolContentLayout>
 * to:
 *   <ToolContentLayout ... />
 */
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

let changed = 0;
for (const file of walk("src/tools")) {
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes("ToolContentLayout")) continue;

  // Self-closing or already empty — skip
  const openRe = /<ToolContentLayout(\s[^>]*)>([\s\S]*?)<\/ToolContentLayout>/g;
  const next = s.replace(openRe, (full, attrs) => {
    // Keep only props; drop children
    const cleaned = attrs.replace(/\s+$/, "");
    return `<ToolContentLayout${cleaned} />`;
  });

  if (next !== s) {
    fs.writeFileSync(file, next);
    changed++;
    console.log("updated", path.relative("src/tools", file));
  }
}
console.log("filesChanged", changed);
