/**
 * Strip ToolPageContent children + useCases so left column is only
 * how-it-works → steps → FAQ → related tools.
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
  if (!s.includes("ToolPageContent")) continue;
  const orig = s;

  // Collapse <ToolPageContent ...>...</ToolPageContent> → self-closing
  s = s.replace(
    /<ToolPageContent(\s[^>]*)>([\s\S]*?)<\/ToolPageContent>/g,
    (full, attrs) => {
      let a = attrs;

      // Remove useCases={[...]} (multiline)
      a = a.replace(/\s*useCases=\{?\[[\s\S]*?\]\}?/g, "");
      a = a.replace(/\s*useCasesTitle=\{?["'`][^"'`]*["'`]\}?/g, "");
      a = a.replace(/\s*useCasesTitle="[^"]*"/g, "");

      a = a.replace(/\s+$/, "");
      // If attrs ends mid-line without />, become />
      return `<ToolPageContent${a} />`;
    }
  );

  // Also strip useCases on already self-closing ToolPageContent
  s = s.replace(
    /<ToolPageContent(\s[^/]*?)\s*\/>/g,
    (full, attrs) => {
      let a = attrs;
      a = a.replace(/\s*useCases=\{?\[[\s\S]*?\]\}?/g, "");
      a = a.replace(/\s*useCasesTitle=\{?["'`][^"'`]*["'`]\}?/g, "");
      a = a.replace(/\s*useCasesTitle="[^"]*"/g, "");
      a = a.replace(/\s+$/, "");
      return `<ToolPageContent${a} />`;
    }
  );

  if (s !== orig) {
    fs.writeFileSync(file, s);
    changed++;
    console.log("updated", path.relative("src/tools", file));
  }
}

console.log("filesChanged", changed);
