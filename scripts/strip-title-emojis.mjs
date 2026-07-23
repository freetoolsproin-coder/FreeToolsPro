/**
 * Strip leading emoji clusters from ToolHeroShell title props
 */
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

// Match common emoji / pictograph runs at start of title=
const emojiStart =
  /^([\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}\u{20E3}\s]+)/u;

let n = 0;
for (const file of walk(toolsRoot)) {
  let src = fs.readFileSync(file, "utf8");
  const next = src.replace(/title="([^"]+)"/g, (full, title) => {
    const cleaned = title.replace(emojiStart, "").replace(/^\s+/, "").trim();
    if (cleaned !== title) {
      n++;
      return `title="${cleaned}"`;
    }
    return full;
  });
  if (next !== src) fs.writeFileSync(file, next);
}
console.log("titles cleaned:", n);
