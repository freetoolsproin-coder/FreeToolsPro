/**
 * Fix pass: add missing ToolHeroShell imports + clean title/broken JSX leftovers
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toolsRoot = path.join(__dirname, "..", "src", "tools");

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith(".jsx")) out.push(full);
  }
  return out;
}

let importFixes = 0;
for (const file of walk(toolsRoot)) {
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("<ToolHeroShell")) continue;
  if (src.includes("import ToolHeroShell")) continue;

  if (/from ["'][^"']*components\/Seo["']/.test(src)) {
    src = src.replace(
      /(from ["'][^"']*components\/Seo["'];?)/,
      `$1\nimport ToolHeroShell from "../../components/ToolHeroShell";`
    );
  } else {
    src = `import ToolHeroShell from "../../components/ToolHeroShell";\n` + src;
  }
  fs.writeFileSync(file, src);
  importFixes++;
  console.log("import+", path.relative(toolsRoot, file));
}
console.log("imports fixed:", importFixes);

// Targeted title + JSX repairs
const repairs = {
  "developer-tools/UseSpeedTest.jsx": (src) => {
    src = src.replace(
      /title="Tool"\s*\n\s*subtitle="Fast, private, and free in your browser\."/,
      `title="Internet Speed Test"
        subtitle="Check download, upload, ping, and performance"`
    );
    // Remove leftover header fragment from broken migration
    src = src.replace(
      />\s*<\/h2>\s*<p class="text-slate-400 mt-2 max-w-2xl mx-auto text-sm md:text-base">\s*\{phase === "idle" \? "Check internet speed, ping, and performance" : `\$\{phase\}ing\.\.\.`\}\s*<\/p>\s*<\/div>\s*/,
      ">\n"
    );
    return src;
  },
  "trending/QrCodeGenerator.jsx": (src) => {
    src = src.replace(
      /title="Tool"\s*\n\s*subtitle="Fast, private, and free in your browser\."/,
      `title="QR Code Generator Studio"
        subtitle="Configure options, preview live, and download instantly."`
    );
    src = src.replace(
      /<div className="max-w-6xl mx-auto">\s*<div className="text-center mb-8">\s*<h2[\s\S]*?<\/h2>\s*<p className="text-slate-400[\s\S]*?<\/p>\s*<\/div>\s*/,
      `<div className="max-w-6xl mx-auto">\n`
    );
    return src;
  },
  "trending/FancyTextGenerator.jsx": (src) => {
    return src.replace(
      /title="Fancy Text \{\\" \\"\} Generator"/,
      `title="Fancy Text Generator"`
    );
  },
};

for (const [rel, fn] of Object.entries(repairs)) {
  const file = path.join(toolsRoot, rel);
  const before = fs.readFileSync(file, "utf8");
  const after = fn(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    console.log("repaired", rel);
  } else {
    console.log("no-change", rel);
  }
}

// Scan for obvious broken leftovers right after ToolHeroShell >
const leftovers = [];
for (const file of walk(toolsRoot)) {
  const src = fs.readFileSync(file, "utf8");
  if (!src.includes("<ToolHeroShell")) continue;
  if (/<\/ToolHeroShell>[\s\S]{0,200}<\/ToolHeroShell>/.test(src) === false) {
    // ok
  }
  if (/formLabel="[^"]*"\s*>\s*<\/h[12]>/.test(src) || /formLabel="[^"]*"\s*>\s*<p class="/.test(src)) {
    leftovers.push(path.relative(toolsRoot, file));
  }
}
console.log("leftover header fragments:", leftovers.length);
leftovers.forEach((x) => console.log(" !", x));
