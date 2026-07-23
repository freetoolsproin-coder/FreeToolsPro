import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const toolsRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "src", "tools");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out);
    else if (e.name.endsWith(".jsx")) out.push(f);
  }
  return out;
}

let n = 0;
for (const f of walk(toolsRoot)) {
  let s = fs.readFileSync(f, "utf8");
  if (!s.includes("<ToolContentLayout")) continue;
  if (s.includes("import ToolContentLayout")) continue;

  if (/from ["'][^"']*components\/Seo["']/.test(s)) {
    s = s.replace(
      /(from ["'][^"']*components\/Seo["'];?)/,
      `$1\nimport ToolContentLayout from "../../components/ToolContentLayout";`
    );
  } else if (/from ["'][^"']*components\/ToolHeroShell["']/.test(s)) {
    s = s.replace(
      /(from ["'][^"']*components\/ToolHeroShell["'];?)/,
      `$1\nimport ToolContentLayout from "../../components/ToolContentLayout";`
    );
  } else {
    s = `import ToolContentLayout from "../../components/ToolContentLayout";\n` + s;
  }
  fs.writeFileSync(f, s);
  n++;
  console.log("fixed", path.relative(toolsRoot, f));
}
console.log("total", n);
