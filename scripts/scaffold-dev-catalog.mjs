/**
 * Generate missing catalog tools + register categories/routes/SEO/home/sitemap.
 * node scripts/scaffold-dev-catalog.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const { DEV_CATALOG_NORMALIZED } = await import(
  pathToFileURL(path.join(ROOT, "src/data/devCatalogManifest.js")).href
);

const NEW_CATEGORIES = [
  ["json-tools", "JSON Tools", "Braces", "/json-tools"],
  ["html-tools", "HTML Tools", "FileCode2", "/html-tools"],
  ["css-tools", "CSS Tools", "Palette", "/css-tools"],
  ["javascript-tools", "JavaScript Tools", "Code2", "/javascript-tools"],
  ["api-tools", "API Tools", "Network", "/api-tools"],
  ["jwt-tools", "JWT Tools", "KeyRound", "/jwt-tools"],
  ["encoding-tools", "Encoding Tools", "Binary", "/encoding-tools"],
  ["hash-tools", "Hash & Crypto Tools", "ShieldCheck", "/hash-tools"],
  ["security-tools", "Security Tools", "Shield", "/security-tools"],
  ["http-tools", "HTTP Tools", "Globe", "/http-tools"],
  ["ai-dev-tools", "AI Developer Tools", "Sparkles", "/ai-dev-tools"],
  ["seo-tools", "SEO Tools", "Search", "/seo-tools"],
];

// Safer lucide icon fallbacks
const ICON_FIX = {
  PanelsTopLeft: "LayoutGrid",
  Square: "Box",
  Unlock: "Lock",
  Terminal: "Code2",
  Webhook: "Network",
  FileKey: "KeyRound",
  Crop: "Scissors",
  Info: "CircleAlert",
  Binary: "Hash",
  Shield: "ShieldCheck",
  Layout: "LayoutGrid",
  RefreshCw: "RefreshCw",
};

function fixIcon(icon) {
  return ICON_FIX[icon] || icon;
}

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

function emitIo(tool) {
  const icon = fixIcon(tool.icon);
  return `import { ${icon} } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function ${tool.component}() {
  return (
    <IoToolShell
      seoKey="${tool.seoKey}"
      category="${tool.category}"
      path="${tool.path}"
      icon={${icon}}
      title=${JSON.stringify(tool.name)}
      subtitle=${JSON.stringify(tool.desc)}
      actionLabel="Run"
      transform={transforms.${tool.kind}}
      multiline={${!["dns", "whois", "spf", "dmarc", "uuid_gen", "uuid_val", "slug", "random_string", "canonical_gen", "http_status", "redirect", "url_parse", "url_inspect"].includes(tool.kind)}}
      placeholder=${JSON.stringify(
        tool.kind === "hmac"
          ? "message\\n---\\nsecret"
          : tool.kind === "dkim"
            ? "selector\\nexample.com"
            : tool.kind === "case_convert"
              ? "helloWorld\\nsnake"
              : "Paste input…"
      )}
    />
  );
}
`;
}

function emitCss(tool) {
  const icon = fixIcon(tool.icon);
  return `import { ${icon} } from "lucide-react";
import CssGeneratorShell from "../_shared/CssGeneratorShell";

export default function ${tool.component}() {
  return (
    <CssGeneratorShell
      seoKey="${tool.seoKey}"
      category="${tool.category}"
      path="${tool.path}"
      icon={${icon}}
      title=${JSON.stringify(tool.name)}
      subtitle=${JSON.stringify(tool.desc)}
      kind="${tool.kind}"
    />
  );
}
`;
}

function emitSpecial(tool) {
  const icon = fixIcon(tool.icon);
  if (tool.kind === "json_compare") {
    return `import { useState } from "react";
import { ${icon} } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function flatten(obj, prefix = "") {
  if (obj === null || typeof obj !== "object") return { [prefix || "(root)"]: obj };
  return Object.entries(obj).reduce((acc, [k, v]) => Object.assign(acc, flatten(v, prefix ? prefix + "." + k : k)), {});
}

export default function ${tool.component}() {
  const [a, setA] = useState('{"name":"Ada","role":"admin"}');
  const [b, setB] = useState('{"name":"Ada","role":"editor"}');
  const [diff, setDiff] = useState([]);
  const run = () => {
    try {
      const left = flatten(JSON.parse(a));
      const right = flatten(JSON.parse(b));
      const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
      setDiff([...keys].map((k) => ({
        key: k,
        left: left[k] === undefined ? "∅" : JSON.stringify(left[k]),
        right: right[k] === undefined ? "∅" : JSON.stringify(right[k]),
        same: JSON.stringify(left[k]) === JSON.stringify(right[k]),
      })));
    } catch (e) {
      setDiff([{ key: "error", left: e.message, right: "", same: false }]);
    }
  };
  return (
    <>
      <Seo page="${tool.seoKey}" />
      <ToolHeroShell category="${tool.category}" icon={${icon}} title=${JSON.stringify(tool.name)} subtitle=${JSON.stringify(tool.desc)} layout="stack" panel="light">
        <div className="grid gap-4 lg:grid-cols-2">
          <textarea className={textareaDark + " min-h-[180px]"} value={a} onChange={(e) => setA(e.target.value)} />
          <textarea className={textareaDark + " min-h-[180px]"} value={b} onChange={(e) => setB(e.target.value)} />
        </div>
        <button type="button" onClick={run} className="mt-4 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white">Compare</button>
        <ul className="mt-4 space-y-2">
          {diff.map((row) => (
            <li key={row.key} className={"rounded-xl border px-3 py-2 text-sm " + (row.same ? "border-[var(--ftp-line)] bg-white" : "border-amber-200 bg-amber-50")}>
              <span className="font-semibold">{row.key}</span>
              <div className="mt-1 grid gap-1 text-[var(--ftp-ink-soft)] sm:grid-cols-2"><span>A: {row.left}</span><span>B: {row.right}</span></div>
            </li>
          ))}
        </ul>
      </ToolHeroShell>
      <ToolContentLayout category="${tool.category}" currentToolPath="${tool.path}" />
    </>
  );
}
`;
  }
  if (tool.kind === "json_tree") {
    return `import { useMemo, useState } from "react";
import { ${icon} } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function Node({ name, value, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const isObj = value !== null && typeof value === "object";
  if (!isObj) return <div style={{ paddingLeft: depth * 14 }} className="font-mono text-sm"><span className="text-teal-700">{name}</span>: {JSON.stringify(value)}</div>;
  const entries = Array.isArray(value) ? value.map((v, i) => [String(i), v]) : Object.entries(value);
  return (
    <div style={{ paddingLeft: depth * 14 }}>
      <button type="button" onClick={() => setOpen(!open)} className="font-mono text-sm font-semibold">{open ? "▼" : "▶"} {name}</button>
      {open ? entries.map(([k, v]) => <Node key={k} name={k} value={v} depth={depth + 1} />) : null}
    </div>
  );
}

export default function ${tool.component}() {
  const [input, setInput] = useState('{"user":{"id":1,"tags":["a","b"]}}');
  const tree = useMemo(() => { try { return JSON.parse(input); } catch { return null; } }, [input]);
  return (
    <>
      <Seo page="${tool.seoKey}" />
      <ToolHeroShell category="${tool.category}" icon={${icon}} title=${JSON.stringify(tool.name)} subtitle=${JSON.stringify(tool.desc)} layout="stack" panel="light">
        <textarea className={textareaDark + " min-h-[160px]"} value={input} onChange={(e) => setInput(e.target.value)} />
        <div className="mt-4 rounded-xl border border-[var(--ftp-line)] bg-white p-4">{tree ? <Node name="root" value={tree} /> : <p className="text-sm text-rose-600">Invalid JSON</p>}</div>
      </ToolHeroShell>
      <ToolContentLayout category="${tool.category}" currentToolPath="${tool.path}" />
    </>
  );
}
`;
  }
  if (tool.kind === "html_preview" || tool.kind === "svg_view") {
    const sample =
      tool.kind === "svg_view"
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><circle cx="60" cy="60" r="50" fill="#0f766e" /></svg>`
        : `<h1>Hello</h1><p>Preview HTML here.</p>`;
    return `import { useState } from "react";
import { ${icon} } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function ${tool.component}() {
  const [code, setCode] = useState(${JSON.stringify(sample)});
  return (
    <>
      <Seo page="${tool.seoKey}" />
      <ToolHeroShell category="${tool.category}" icon={${icon}} title=${JSON.stringify(tool.name)} subtitle=${JSON.stringify(tool.desc)} layout="stack" panel="light">
        <textarea className={textareaDark + " min-h-[180px]"} value={code} onChange={(e) => setCode(e.target.value)} />
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--ftp-line)] bg-white">
          <iframe title="preview" sandbox="" className="h-72 w-full" srcDoc={code} />
        </div>
      </ToolHeroShell>
      <ToolContentLayout category="${tool.category}" currentToolPath="${tool.path}" />
    </>
  );
}
`;
  }
  if (tool.kind === "js_playground" || tool.kind === "js_console") {
    return `import { useState } from "react";
import { ${icon} } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function ${tool.component}() {
  const [code, setCode] = useState(${JSON.stringify(
    tool.kind === "js_console" ? "1 + 2 * 3" : "const n = [1,2,3].map(x => x * 2);\\nconsole.log(n);\\nn;"
  )});
  const [out, setOut] = useState("");
  const run = () => {
    const logs = [];
    const fake = { log: (...a) => logs.push(a.map(String).join(" ")) };
    try {
      const fn = new Function("console", ${tool.kind === "js_console" ? '"return (" + code + ")"' : "code"});
      const result = fn(fake);
      setOut([...logs, result !== undefined ? "⇒ " + String(result) : ""].filter(Boolean).join("\\n") || "(no output)");
    } catch (e) {
      setOut(String(e.message || e));
    }
  };
  return (
    <>
      <Seo page="${tool.seoKey}" />
      <ToolHeroShell category="${tool.category}" icon={${icon}} title=${JSON.stringify(tool.name)} subtitle=${JSON.stringify(tool.desc)} layout="stack" panel="light">
        <textarea className={textareaDark + " min-h-[180px] font-mono"} value={code} onChange={(e) => setCode(e.target.value)} />
        <button type="button" onClick={run} className="mt-3 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white">Run</button>
        <pre className="mt-4 overflow-auto rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4 text-sm">{out}</pre>
      </ToolHeroShell>
      <ToolContentLayout category="${tool.category}" currentToolPath="${tool.path}" />
    </>
  );
}
`;
  }
  if (tool.kind === "html_table") {
    return `import { useState } from "react";
import { ${icon} } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function ${tool.component}() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [out, setOut] = useState("");
  const gen = () => {
    let h = "<table>\\n";
    for (let r = 0; r < rows; r++) h += "  <tr>" + Array.from({ length: cols }, (_, c) => "<td>R" + (r + 1) + "C" + (c + 1) + "</td>").join("") + "</tr>\\n";
    setOut(h + "</table>");
  };
  return (
    <>
      <Seo page="${tool.seoKey}" />
      <ToolHeroShell category="${tool.category}" icon={${icon}} title=${JSON.stringify(tool.name)} subtitle=${JSON.stringify(tool.desc)} layout="stack" panel="light">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Rows<input type="number" className={inputDark + " mt-1.5"} value={rows} onChange={(e) => setRows(+e.target.value)} /></label>
          <label className="text-sm">Cols<input type="number" className={inputDark + " mt-1.5"} value={cols} onChange={(e) => setCols(+e.target.value)} /></label>
        </div>
        <button type="button" onClick={gen} className="mt-3 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white">Generate</button>
        <textarea className={textareaDark + " mt-4 min-h-[180px]"} value={out} readOnly />
      </ToolHeroShell>
      <ToolContentLayout category="${tool.category}" currentToolPath="${tool.path}" />
    </>
  );
}
`;
  }
  if (["svg_png", "image_compress", "image_crop", "image_meta", "exif", "ico"].includes(tool.kind)) {
    return emitImageTool(tool, icon);
  }
  return emitIo(tool);
}

function emitImageTool(tool, icon) {
  return `import { useRef, useState } from "react";
import { ${icon} } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function ${tool.component}() {
  const [info, setInfo] = useState("");
  const [preview, setPreview] = useState("");
  const canvasRef = useRef(null);

  const onFile = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    if (${JSON.stringify(["image_meta", "exif"].includes(tool.kind))}) {
      setInfo("Name: " + file.name + "\\nType: " + file.type + "\\nSize: " + (file.size / 1024).toFixed(1) + " KB");
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const size = ${tool.kind === "ico" ? 64 : tool.kind === "image_crop" ? "Math.min(img.width, img.height)" : "img.width"};
      const w = ${tool.kind === "ico" ? 64 : tool.kind === "image_crop" ? "Math.min(img.width, img.height)" : "Math.min(img.width, 1200)"};
      const h = ${tool.kind === "ico" || tool.kind === "image_crop" ? "w" : "Math.round(img.height * (w / img.width))"};
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ${
        tool.kind === "image_crop"
          ? "const side = Math.min(img.width, img.height); const sx=(img.width-side)/2, sy=(img.height-side)/2; ctx.drawImage(img,sx,sy,side,side,0,0,w,h);"
          : "ctx.drawImage(img,0,0,w,h);"
      }
      ${
        tool.kind === "image_compress" || tool.kind === "ico"
          ? 'const data = canvas.toDataURL("image/png", 0.72); setPreview(data); setInfo("Output ~ " + Math.round((data.length * 3) / 4 / 1024) + " KB (estimate)");'
          : tool.kind === "svg_png"
            ? 'setInfo("Rasterized preview ready — right-click image to save.");'
            : 'setInfo("Processed " + w + "×" + h);'
      }
    };
    ${
      tool.kind === "svg_png"
        ? `if (file.type.includes("svg") || file.name.endsWith(".svg")) {
      file.text().then((txt) => { img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(txt); });
    } else img.src = url;`
        : "img.src = url;"
    }
  };

  return (
    <>
      <Seo page="${tool.seoKey}" />
      <ToolHeroShell category="${tool.category}" icon={${icon}} title=${JSON.stringify(tool.name)} subtitle=${JSON.stringify(tool.desc)} layout="stack" panel="light">
        <input type="file" accept=${tool.kind === "svg_png" ? '"image/svg+xml,.svg"' : '"image/*"'} onChange={(e) => onFile(e.target.files?.[0])} />
        <canvas ref={canvasRef} className="mt-4 max-h-72 max-w-full rounded-xl border border-[var(--ftp-line)]" />
        {preview ? <img src={preview} alt="preview" className="mt-3 max-h-48 rounded-xl border border-[var(--ftp-line)]" /> : null}
        {info ? <pre className="mt-3 text-sm text-[var(--ftp-ink-soft)]">{info}</pre> : null}
      </ToolHeroShell>
      <ToolContentLayout category="${tool.category}" currentToolPath="${tool.path}" />
    </>
  );
}
`;
}

function generateTools() {
  let count = 0;
  for (const tool of DEV_CATALOG_NORMALIZED) {
    tool.icon = fixIcon(tool.icon);
    const file = path.join(ROOT, "src/tools", tool.folder, `${tool.component}.jsx`);
    let content;
    if (tool.ui === "css") content = emitCss(tool);
    else if (tool.ui === "special") content = emitSpecial(tool);
    else content = emitIo(tool);
    write(file, content);
    count += 1;
  }
  console.log("wrote", count, "tool components");
}

function patchCategories() {
  const defPath = path.join(ROOT, "src/data/toolDefinitions.js");
  let text = fs.readFileSync(defPath, "utf8");

  // Ensure icons imported
  const needed = [
    "Binary",
    "Hash",
    "Shield",
    "LayoutGrid",
    "Box",
    "Unlock",
    "Webhook",
    "FileKey",
    "Crop",
    "CircleAlert",
    "Terminal",
  ];
  // Use only icons we actually reference after fix
  const used = new Set(DEV_CATALOG_NORMALIZED.map((t) => fixIcon(t.icon)));
  NEW_CATEGORIES.forEach(([, , icon]) => used.add(fixIcon(icon)));
  const missing = [...used].filter((i) => !new RegExp(`\\b${i}\\b`).test(text.split('} from "lucide-react"')[0]));
  if (missing.length) {
    text = text.replace(
      /(\n\} from "lucide-react";)/,
      `\n  ${missing.join(",\n  ")},\n} from "lucide-react";`
    );
  }

  // Insert new categories before closing of categories array if missing
  if (!text.includes('id: "json-tools"')) {
    const catBlocks = NEW_CATEGORIES.map(
      ([id, name, icon, p]) => `  {
    id: "${id}",
    name: "${name}",
    icon: ${fixIcon(icon)},
    path: "${p}",
  },`
    ).join("\n");
    text = text.replace(
      /(export const categories = \[[\s\S]*?)(\n\];)/,
      `$1\n${catBlocks}$2`
    );
  }

  // Remap existing tools to new categories (keep paths)
  const remaps = [
    ['id: "json-formatter"', 'category: "developer-tools"', 'category: "json-tools"'],
    ['id: "csv-to-json"', 'category: "developer-tools"', 'category: "json-tools"'],
    ['id: "json-to-yaml"', 'category: "developer-tools"', 'category: "json-tools"'],
    ['id: "yaml-to-json"', 'category: "developer-tools"', 'category: "json-tools"'],
    ['id: "html-minifier"', 'category: "developer-tools"', 'category: "html-tools"'],
    ['id: "css-beautifier"', 'category: "developer-tools"', 'category: "css-tools"'],
    ['id: "gradient-generator"', 'category: "trending-tools"', 'category: "css-tools"'],
    ['id: "glassmorphism-generator"', 'category: "trending-tools"', 'category: "css-tools"'],
    ['id: "api-tester"', 'category: "developer-tools"', 'category: "api-tools"'],
    ['id: "jwt-decoder"', 'category: "developer-tools"', 'category: "jwt-tools"'],
    ['id: "regex-tester"', 'category: "developer-tools"', 'category: "developer-tools"'],
    ['id: "base64-encoder"', 'category: "image-tools"', 'category: "encoding-tools"'],
    ['id: "password-generator"', 'category: "trending-tools"', 'category: "security-tools"'],
    ['id: "ssl-checker"', 'category: "developer-tools"', 'category: "security-tools"'],
    ['id: "meta-tag-generator"', 'category: "developer-tools"', 'category: "seo-tools"'],
    ['id: "robots-generator"', 'category: "developer-tools"', 'category: "seo-tools"'],
    ['id: "sitemap-generator"', 'category: "developer-tools"', 'category: "seo-tools"'],
    ['id: "schema-markup-generator"', 'category: "image-tools"', 'category: "seo-tools"'],
    ['id: "page-speed-analyzer"', 'category: "developer-tools"', 'category: "seo-tools"'],
    ['id: "broken-link-checker"', 'category: "developer-tools"', 'category: "seo-tools"'],
    ['id: "ai-prompt-optimizer"', 'category: "social-media-tools"', 'category: "ai-dev-tools"'],
    ['id: "code-explainer"', 'category: "developer-tools"', 'category: "ai-dev-tools"'],
    ['id: "regex-generator"', 'category: "developer-tools"', 'category: "ai-dev-tools"'],
  ];

  // Safer remap: find block by id and replace first category inside that object
  for (const [idLine, , newCat] of remaps) {
    const idIdx = text.indexOf(idLine);
    if (idIdx < 0) continue;
    const slice = text.slice(idIdx, idIdx + 500);
    const catMatch = slice.match(/category: "[^"]+"/);
    if (catMatch) {
      text = text.slice(0, idIdx) + slice.replace(catMatch[0], `category: "${newCat.split('"')[1] || newCat.replace('category: "', "").replace('"', "")}"`) + text.slice(idIdx + slice.length);
    }
  }
  // Fix botched remap - do properly
  text = fs.readFileSync(defPath, "utf8");
  // re-apply icon + categories insert only if needed from fresh... too messy. Simpler approach below.
  fs.writeFileSync(defPath, text, "utf8");
}

function patchDefinitionsClean() {
  const defPath = path.join(ROOT, "src/data/toolDefinitions.js");
  let text = fs.readFileSync(defPath, "utf8");

  const used = new Set(DEV_CATALOG_NORMALIZED.map((t) => fixIcon(t.icon)));
  NEW_CATEGORIES.forEach(([, , icon]) => used.add(fixIcon(icon)));
  // common extras
  ["LayoutGrid", "Box", "Hash", "CircleAlert", "Shield"].forEach((i) => used.add(i));
  const importSection = text.split('} from "lucide-react"')[0];
  const missing = [...used].filter((i) => !new RegExp(`\\b${i}\\b`).test(importSection));
  if (missing.length) {
    text = text.replace(/\n\} from "lucide-react";/, `\n  ${missing.join(",\n  ")},\n} from "lucide-react";`);
  }

  if (!text.includes('id: "json-tools"')) {
    const catBlocks = NEW_CATEGORIES.map(
      ([id, name, icon, p]) => `  {
    id: "${id}",
    name: "${name}",
    icon: ${fixIcon(icon)},
    path: "${p}",
  },`
    ).join("\n");
    text = text.replace(/\n\];\n\n\/\* ===========================\n   Tools/, `\n${catBlocks}\n];\n\n/* ===========================\n   Tools`);
  }

  // Update API tester name
  text = text.replace(
    /id: "api-tester",\n  path: "\/developer-tools\/api-tester",\n  name: "API Tester",/,
    'id: "api-tester",\n  path: "/developer-tools/api-tester",\n  name: "REST API Tester",'
  );

  // Category remaps by id using regex on object blocks
  const categoryById = {
    "json-formatter": "json-tools",
    "csv-to-json": "json-tools",
    "json-to-yaml": "json-tools",
    "yaml-to-json": "json-tools",
    "html-minifier": "html-tools",
    "css-beautifier": "css-tools",
    "gradient-generator": "css-tools",
    "glassmorphism-generator": "css-tools",
    "api-tester": "api-tools",
    "jwt-decoder": "jwt-tools",
    "base64-encoder": "encoding-tools",
    "password-generator": "security-tools",
    "ssl-checker": "security-tools",
    "meta-tag-generator": "seo-tools",
    "robots-generator": "seo-tools",
    "sitemap-generator": "seo-tools",
    "schema-markup-generator": "seo-tools",
    "page-speed-analyzer": "seo-tools",
    "broken-link-checker": "seo-tools",
    "ai-prompt-optimizer": "ai-dev-tools",
    "code-explainer": "ai-dev-tools",
    "word-counter": "text-tools",
    "lorem-ipsum-generator": "text-tools",
    "duplicate-line-remover": "text-tools",
  };

  for (const [id, cat] of Object.entries(categoryById)) {
    const re = new RegExp(`(id: "${id}",[\\s\\S]*?category: ")([^"]+)(")`);
    if (re.test(text)) text = text.replace(re, `$1${cat}$3`);
  }

  // Append new tool definitions if not present
  if (!text.includes('id: "json-validator"')) {
    const defs = DEV_CATALOG_NORMALIZED.map((tool) => {
      const icon = fixIcon(tool.icon);
      const kws = tool.keywords.map((k) => `"${k}"`).join(", ");
      return `
{
  id: "${tool.id}",
  path: "${tool.path}",
  name: ${JSON.stringify(tool.name)},
  desc: ${JSON.stringify(tool.desc)},
  icon: ${icon},
  category: "${tool.category}",
  keywords: [${kws}],
  navLabel: ${JSON.stringify(tool.name.split(" ").slice(0, 2).join(" "))},
  title: ${JSON.stringify(tool.name)},
  showInDesktopNav: true,
  showInMobileNav: true,
},`;
    }).join("\n");
    text = text.replace(/\n\];\s*$/, `${defs}\n];\n`);
  }

  fs.writeFileSync(defPath, text, "utf8");
  console.log("patched toolDefinitions.js");
}

function patchRoutes() {
  const p = path.join(ROOT, "src/routes/appRoutes.jsx");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes("JsonValidator")) {
    console.log("routes already have JsonValidator");
    return;
  }
  const lazies = DEV_CATALOG_NORMALIZED.map(
    (t) => `const ${t.component} = lazy(() => import("../tools/${t.folder}/${t.component}"));`
  ).join("\n");
  text = text.replace(
    /const DocumentationGenerator = lazy\(\(\) => import\("\.\.\/tools\/developer-tools\/DocumentationGenerator"\)\);\n/,
    (m) => m + lazies + "\n"
  );

  const routes = DEV_CATALOG_NORMALIZED.map(
    (t) => `  {
    path: "${t.path}",
    element: (
      <Suspense fallback={fallback}>
        <${t.component} />
      </Suspense>
    ),
  },`
  ).join("\n");

  text = text.replace(
    /path: "\/business-tools\/ifsc-code-finder",[\s\S]*?<\/Suspense>\s*\),\s*\},/,
    (m) => m + "\n" + routes
  );
  fs.writeFileSync(p, text, "utf8");
  console.log("patched appRoutes.jsx");
}

function patchSeo() {
  const p = path.join(ROOT, "src/seo/seoConfig.js");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes("jsonValidator:")) {
    console.log("seo already patched");
  } else {
    const blocks = DEV_CATALOG_NORMALIZED.map(
      (t) => `
  ${t.seoKey}: {
    title: ${JSON.stringify(t.name + " | FreeToolsPro")},
    description: ${JSON.stringify(t.desc)},
    keywords: ${JSON.stringify(t.keywords.join(", "))},
    path: "${t.path}",
    type: "tool",
    category: "DeveloperApplication",
  },`
    ).join("\n");
    text = text.replace(/\n\};\s*$/, `${blocks}\n};\n`);
    fs.writeFileSync(p, text, "utf8");
  }

  const sr = path.join(ROOT, "src/components/config/seoRoutes.js");
  let srt = fs.readFileSync(sr, "utf8");
  if (!srt.includes("/json-tools/json-validator")) {
    const blocks = DEV_CATALOG_NORMALIZED.map(
      (t) => `  "${t.path}": {
    title: ${JSON.stringify(t.name + " | FreeToolsPro")},
    description: ${JSON.stringify(t.desc)},
  },`
    ).join("\n");
    srt = srt.replace(/\n\};\s*$/, `\n${blocks}\n};\n`);
    fs.writeFileSync(sr, srt, "utf8");
  }
  console.log("patched SEO");
}

function patchThemes() {
  const p = path.join(ROOT, "src/data/categoryThemes.js");
  let text = fs.readFileSync(p, "utf8");
  if (text.includes('"json-tools"')) {
    console.log("themes already patched");
    return;
  }
  const themeBlock = NEW_CATEGORIES.map(([id, label]) => `  "${id}": {
    id: "${id}",
    label: "${label.replace(/ Tools$/, "")}",
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.14)",
    glowA: "rgba(34, 211, 238, 0.16)",
    glowB: "rgba(56, 189, 248, 0.12)",
    hint: "${label}",
  },`).join("\n");
  text = text.replace(
    /  "ai-tools": \{[\s\S]*?hint: "Intelligent helpers",\n  },\n\};/,
    (m) => m.replace(/\n\};$/, `\n${themeBlock}\n};`)
  );
  // folder map + path prefixes
  const folderLines = NEW_CATEGORIES.map(([id]) => `  "${id}": "${id}",`).join("\n");
  text = text.replace(
    /  "ai-tools": "ai-tools",\n\};/,
    `  "ai-tools": "ai-tools",\n${folderLines}\n};`
  );
  const prefixLines = NEW_CATEGORIES.map(([id, , , p]) => `  ["${p}/", "${id}"],`).join("\n");
  text = text.replace(
    /  \["\/ai-tools\/", "ai-tools"\],\n\];/,
    `  ["/ai-tools/", "ai-tools"],\n${prefixLines}\n];`
  );
  fs.writeFileSync(p, text, "utf8");
  console.log("patched categoryThemes.js");
}

function patchHome() {
  const p = path.join(ROOT, "src/data/homeSections.js");
  let text = fs.readFileSync(p, "utf8");
  const ids = DEV_CATALOG_NORMALIZED.map((t) => t.id);
  // high traffic first for recently added
  const priority = [
    "json-validator",
    "jwt-generator",
    "sha256-generator",
    "curl-generator",
    "javascript-playground",
    "dns-lookup",
    "open-graph-generator",
    "css-flexbox-generator",
    "uuid-generator",
    "html-preview",
    "graphql-explorer",
    "password-strength-checker",
    "url-encode",
    "sql-generator",
    "hreflang-generator",
    "json-to-typescript",
  ];
  const ordered = [...priority.filter((id) => ids.includes(id)), ...ids.filter((id) => !priority.includes(id))];
  if (!text.includes('"json-validator"')) {
    text = text.replace(
      /export const RECENTLY_ADDED_IDS = \[/,
      `export const RECENTLY_ADDED_IDS = [\n${ordered
        .slice(0, 24)
        .map((id) => `  "${id}",`)
        .join("\n")}`
    );
  }
  // blurbs
  const blurbs = NEW_CATEGORIES.map(
    ([id, name]) => `  "${id}": "${name.replace(/ Tools$/, "")} utilities for everyday workflows.",`
  ).join("\n");
  if (!text.includes('"json-tools":')) {
    text = text.replace(/export const COLLECTION_BLURBS = \{/, `export const COLLECTION_BLURBS = {\n${blurbs}`);
  }
  fs.writeFileSync(p, text, "utf8");
  console.log("patched homeSections.js");
}

function patchSitemapVite() {
  const sm = path.join(ROOT, "public/sitemap.xml");
  let text = fs.readFileSync(sm, "utf8");
  if (!text.includes("/json-tools/json-validator")) {
    const urls = DEV_CATALOG_NORMALIZED.map(
      (t) => `  <url>
    <loc>https://freetoolspro.in${t.path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
    ).join("\n");
    text = text.replace("</urlset>", `${urls}\n</urlset>`);
    fs.writeFileSync(sm, text, "utf8");
  }
  const vite = path.join(ROOT, "vite.config.js");
  let vt = fs.readFileSync(vite, "utf8");
  if (!vt.includes("/json-tools/json-validator")) {
    const paths = DEV_CATALOG_NORMALIZED.map((t) => `        "${t.path}"`).join(",\n");
    vt = vt.replace(/dynamicRoutes:\s*\[/, `dynamicRoutes: [\n${paths},`);
    fs.writeFileSync(vite, vt, "utf8");
  }
  console.log("patched sitemap + vite");
}

function patchWhatItDoes() {
  const p = path.join(ROOT, "src/data/toolWhatItDoes/newTools.js");
  let text = fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "export default {\n};\n";
  if (text.includes("/json-tools/json-validator")) return;
  const entries = DEV_CATALOG_NORMALIZED.map(
    (t) => `  "${t.path}": {
    paragraphs: [
      ${JSON.stringify(t.name + " on FreeToolsPro: " + t.desc)},
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },`
  ).join("\n");
  text = text.replace(/\n\};\s*$/, `\n${entries}\n};\n`);
  fs.writeFileSync(p, text, "utf8");
  console.log("patched what-it-does");
}

// Fix Binary icon in NEW_CATEGORIES - lucide may have Binary in newer versions; we map to Hash
NEW_CATEGORIES.forEach((row) => {
  row[2] = fixIcon(row[2]);
});

generateTools();
patchDefinitionsClean();
patchRoutes();
patchSeo();
patchThemes();
patchHome();
patchSitemapVite();
patchWhatItDoes();
console.log("DONE", DEV_CATALOG_NORMALIZED.length);
