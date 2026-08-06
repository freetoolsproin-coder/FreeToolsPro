import bcrypt from "bcryptjs";
import { digest, md5, hmacSha256, isValidUuid } from "./cryptoUtils";

export function formatHtml(html) {
  const tokens = html
    .replace(/>\s*</g, "><")
    .replace(/</g, "\n<")
    .split("\n")
    .filter(Boolean);
  let indent = 0;
  return tokens
    .map((tok) => {
      if (/^<\//.test(tok)) indent = Math.max(0, indent - 1);
      const line = `${"  ".repeat(indent)}${tok.trim()}`;
      if (/^<[^/!][^>]*[^/]>$/.test(tok) && !/^<(br|hr|img|input|meta|link)\b/i.test(tok)) {
        indent += 1;
      }
      return line;
    })
    .join("\n");
}

export function formatJs(code) {
  let out = "";
  let depth = 0;
  for (const ch of code) {
    if (ch === "{" || ch === "(") {
      out += `${ch}\n${"  ".repeat(++depth)}`;
    } else if (ch === "}" || ch === ")") {
      depth = Math.max(0, depth - 1);
      out += `\n${"  ".repeat(depth)}${ch}`;
    } else if (ch === ";") {
      out += `;\n${"  ".repeat(depth)}`;
    } else out += ch;
  }
  return out.replace(/\n\s*\n/g, "\n").trim();
}

export function obfuscateJs(code) {
  let n = 0;
  const map = new Map();
  const reserved = new Set([
    "const", "let", "var", "function", "return", "if", "else", "for", "while", "true", "false",
    "null", "new", "this", "class", "import", "export", "from", "async", "await", "typeof", "in", "of",
  ]);
  return code.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g, (m) => {
    if (reserved.has(m)) return m;
    if (!map.has(m)) map.set(m, `_0x${(n++).toString(16)}`);
    return map.get(m);
  });
}

export function inferSchema(val) {
  if (Array.isArray(val)) return { type: "array", items: val.length ? inferSchema(val[0]) : {} };
  if (val === null) return { type: "null" };
  if (typeof val === "object") {
    const properties = {};
    for (const [k, v] of Object.entries(val)) properties[k] = inferSchema(v);
    return { type: "object", properties, required: Object.keys(properties) };
  }
  return { type: typeof val };
}

export function codeFromJson(input, lang) {
  const obj = JSON.parse(input);
  const sample = Array.isArray(obj) ? obj[0] : obj;
  const fields = Object.entries(sample || {});
  if (lang === "ts") {
    return `export interface Root {\n${fields
      .map(([k, v]) => `  ${k}: ${Array.isArray(v) ? "any[]" : typeof v};`)
      .join("\n")}\n}`;
  }
  if (lang === "java") {
    return `public class Root {\n${fields
      .map(
        ([k, v]) =>
          `  public ${typeof v === "number" ? "double" : typeof v === "boolean" ? "boolean" : "String"} ${k};`
      )
      .join("\n")}\n}`;
  }
  if (lang === "csharp") {
    return `public class Root {\n${fields
      .map(
        ([k, v]) =>
          `  public ${typeof v === "number" ? "double" : typeof v === "boolean" ? "bool" : "string"} ${k} { get; set; }`
      )
      .join("\n")}\n}`;
  }
  if (lang === "go") {
    return `type Root struct {\n${fields
      .map(
        ([k, v]) =>
          `  ${k.charAt(0).toUpperCase() + k.slice(1)} ${
            typeof v === "number" ? "float64" : typeof v === "boolean" ? "bool" : "string"
          } \`json:"${k}"\``
      )
      .join("\n")}\n}`;
  }
  return `class Root {\n${fields
    .map(
      ([k, v]) =>
        `  final ${typeof v === "number" ? "double" : typeof v === "boolean" ? "bool" : "String"} ${k};`
    )
    .join("\n")}\n  Root({${fields.map(([k]) => `required this.${k}`).join(", ")}});\n}`;
}

function toXml(v, name = "root") {
  if (v === null || v === undefined) return `<${name}/>`;
  if (Array.isArray(v)) return v.map((x) => toXml(x, name.replace(/s$/, "") || "item")).join("");
  if (typeof v === "object") {
    return `<${name}>${Object.entries(v)
      .map(([k, val]) => toXml(val, k))
      .join("")}</${name}>`;
  }
  return `<${name}>${String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;")}</${name}>`;
}

function xmlToJson(input) {
  const doc = new DOMParser().parseFromString(input, "text/xml");
  if (doc.querySelector("parsererror")) throw new Error("Invalid XML");
  const walk = (node) => {
    const kids = [...node.childNodes].filter(
      (n) => n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim())
    );
    if (!kids.some((n) => n.nodeType === 1)) return node.textContent?.trim() || "";
    const obj = {};
    for (const c of kids) {
      if (c.nodeType !== 1) continue;
      const val = walk(c);
      obj[c.nodeName] = obj[c.nodeName] !== undefined ? [].concat(obj[c.nodeName], val) : val;
    }
    return obj;
  };
  return JSON.stringify(walk(doc.documentElement), null, 2);
}

function b64url(obj) {
  return btoa(unescape(encodeURIComponent(typeof obj === "string" ? obj : JSON.stringify(obj))))
    .replace(/=+$/, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function decodeJwtPart(t) {
  return JSON.parse(decodeURIComponent(escape(atob(t.replace(/-/g, "+").replace(/_/g, "/")))));
}

export const transforms = {
  json_validate: async (input) => {
    JSON.parse(input);
    return { output: "Valid JSON ✓", meta: "Parsed successfully." };
  },
  json_minify: async (input) => JSON.stringify(JSON.parse(input)),
  json_pretty: async (input) => JSON.stringify(JSON.parse(input), null, 2),
  json_to_xml: async (input) => toXml(JSON.parse(input)),
  xml_to_json: async (input) => xmlToJson(input),
  json_to_csv: async (input) => {
    const data = JSON.parse(input);
    const rows = Array.isArray(data) ? data : [data];
    if (!rows.length) return "";
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r || {})))];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r?.[k])).join(","))].join("\n");
  },
  json_to_ts: async (input) => codeFromJson(input, "ts"),
  json_to_java: async (input) => codeFromJson(input, "java"),
  json_to_csharp: async (input) => codeFromJson(input, "csharp"),
  json_to_go: async (input) => codeFromJson(input, "go"),
  json_to_dart: async (input) => codeFromJson(input, "dart"),
  json_schema: async (input) => JSON.stringify(inferSchema(JSON.parse(input)), null, 2),
  html_format: async (input) => formatHtml(input),
  html_escape: async (input) =>
    input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;"),
  html_unescape: async (input) => {
    const d = document.createElement("textarea");
    d.innerHTML = input;
    return d.value;
  },
  html_to_md: async (input) =>
    input
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n")
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
      .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .trim(),
  md_to_html: async (input) =>
    input
      .split(/\n/)
      .map((line) => {
        if (/^### /.test(line)) return `<h3>${line.slice(4)}</h3>`;
        if (/^## /.test(line)) return `<h2>${line.slice(3)}</h2>`;
        if (/^# /.test(line)) return `<h1>${line.slice(2)}</h1>`;
        if (/^- /.test(line)) return `<li>${line.slice(2)}</li>`;
        if (!line.trim()) return "";
        return `<p>${line
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")}</p>`;
      })
      .join("\n"),
  html_entity: async (input) =>
    [...input]
      .map((c) => {
        const code = c.codePointAt(0);
        if (c === "<") return "&lt;";
        if (c === ">") return "&gt;";
        if (c === "&") return "&amp;";
        return code > 127 ? `&#${code};` : c;
      })
      .join(""),
  html_email: async (input) => {
    const [title = "Hello", body = "Thanks for reading."] = input.split("\n");
    return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f6f7f9;padding:24px"><table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table width="560" style="background:#fff;border-radius:12px;padding:28px"><tr><td><h1 style="margin:0 0 12px;font-size:22px">${title.trim()}</h1><p style="margin:0;color:#334155;line-height:1.6">${body.trim()}</p></td></tr></table></td></tr></table></body></html>`;
  },
  css_format: async (input) =>
    input
      .replace(/\s*{\s*/g, " {\n  ")
      .replace(/;\s*/g, ";\n  ")
      .replace(/\s*}\s*/g, "\n}\n")
      .replace(/\n\s*\n/g, "\n")
      .trim(),
  css_minify: async (input) =>
    input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\s+/g, " ")
      .replace(/\s*([{}:;,])\s*/g, "$1")
      .trim(),
  js_format: async (input) => formatJs(input),
  js_minify: async (input) =>
    input
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1")
      .replace(/\s+/g, " ")
      .replace(/\s*([{};,:])\s*/g, "$1")
      .trim(),
  js_obfuscate: async (input) => obfuscateJs(input),
  js_deobfuscate: async (input) => formatJs(input.replace(/;+/g, ";\n")),
  js_validate: async (input) => {
    // eslint-disable-next-line no-new-func
    new Function(input);
    return { output: "Syntax looks valid ✓", meta: "Checked with Function constructor (not a full linter)." };
  },
  es6_convert: async (input) =>
    input
      .replace(/\bvar /g, "const ")
      .replace(/function\s*\(([^)]*)\)\s*{/g, "($1) => {")
      .replace(/\.indexOf\(([^)]+)\)\s*!==\s*-1/g, ".includes($1)"),
  babel_play: async (input) => `// Demo down-level rules\n${input.replace(/\bconst /g, "var ").replace(/=>/g, "function")}`,
  url_encode: async (input) => encodeURIComponent(input),
  url_decode: async (input) => decodeURIComponent(input),
  b64_encode: async (input) => btoa(unescape(encodeURIComponent(input))),
  b64_decode: async (input) => decodeURIComponent(escape(atob(input.trim()))),
  unicode: async (input) =>
    [...input].map((c) => `U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`).join(" "),
  utf8: async (input) => [...new TextEncoder().encode(input)].map((b) => b.toString(16).padStart(2, "0")).join(" "),
  ascii: async (input) => [...input].map((c) => c.charCodeAt(0)).join(" "),
  binary: async (input) => [...input].map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" "),
  hex: async (input) => [...new TextEncoder().encode(input)].map((b) => b.toString(16).padStart(2, "0")).join(""),
  octal: async (input) => {
    const n = Number(input.trim());
    if (Number.isFinite(n)) return n.toString(8);
    return [...input].map((c) => c.charCodeAt(0).toString(8)).join(" ");
  },
  md5: async (input) => md5(input),
  sha1: async (input) => digest("SHA-1", input),
  sha256: async (input) => digest("SHA-256", input),
  sha512: async (input) => digest("SHA-512", input),
  hmac: async (input) => {
    const [msg, secret = "secret"] = input.split("\n---\n");
    return hmacSha256(msg || input, secret);
  },
  bcrypt: async (input) => bcrypt.hash(input || "password", 10),
  uuid_gen: async () => crypto.randomUUID(),
  uuid_val: async (input) => (isValidUuid(input) ? "Valid UUID ✓" : "Invalid UUID format"),
  remove_empty: async (input) =>
    input
      .split(/\r?\n/)
      .filter((l) => l.trim().length)
      .join("\n"),
  char_count: async (input) => {
    const chars = input.length;
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const lines = input ? input.split(/\n/).length : 0;
    return { output: `Characters: ${chars}\nWords: ${words}\nLines: ${lines}`, meta: "Counts for the pasted text." };
  },
  case_convert: async (input) => {
    const lines = input.split(/\n/);
    const src = lines[0] || "";
    const mode = (lines[1] || "snake").trim().toLowerCase();
    const words = src
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.toLowerCase());
    if (mode === "camel") return words.map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join("");
    if (mode === "pascal") return words.map((w) => w[0].toUpperCase() + w.slice(1)).join("");
    if (mode === "kebab") return words.join("-");
    if (mode === "title") return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
    return words.join("_");
  },
  slug: async (input) =>
    input
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  random_string: async (input) => {
    const len = Math.min(256, Math.max(4, Number(input) || 16));
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const arr = crypto.getRandomValues(new Uint32Array(len));
    return Array.from(arr, (n) => chars[n % chars.length]).join("");
  },
  sql_beautify: async (input) =>
    input
      .replace(/\s+/g, " ")
      .replace(
        /\b(SELECT|FROM|WHERE|AND|OR|JOIN|LEFT JOIN|GROUP BY|ORDER BY|LIMIT|INSERT INTO|VALUES|UPDATE|SET)\b/gi,
        "\n$1"
      )
      .trim(),
  sql_mongo: async (input) => {
    const m = input.match(/from\s+(\w+)/i);
    const table = m?.[1] || "collection";
    const where = (input.match(/where\s+(.+?)(order by|limit|$)/i) || [])[1] || "";
    const filter = {};
    where.split(/\band\b/i).forEach((part) => {
      const eq = part.match(/(\w+)\s*=\s*'?([^'\s]+)'?/i);
      if (eq) filter[eq[1]] = Number.isNaN(Number(eq[2])) ? eq[2] : Number(eq[2]);
    });
    return `db.${table}.find(${JSON.stringify(filter, null, 2)})`;
  },
  sql_sheet: async () =>
    `SELECT cols FROM table WHERE cond;\nINSERT INTO t (c) VALUES (v);\nUPDATE t SET c=v WHERE id=1;\nDELETE FROM t WHERE id=1;\nJOIN / LEFT JOIN ... ON ...\nGROUP BY ... HAVING ...\nORDER BY ... LIMIT n;`,
  sql_gen: async (input) => {
    const q = input.toLowerCase();
    if (q.includes("insert")) return "INSERT INTO table_name (col1, col2)\nVALUES ('value1', 'value2');";
    if (q.includes("update")) return "UPDATE table_name\nSET col1 = 'value'\nWHERE id = 1;";
    return "SELECT *\nFROM table_name\nWHERE active = 1\nORDER BY created_at DESC\nLIMIT 50;";
  },
  commit_msg: async (input) => {
    const s = input.trim().replace(/\s+/g, " ");
    return `feat: ${s.slice(0, 72)}\n\n${s}`;
  },
  readme: async (input) =>
    `# ${input.trim() || "Project"}\n\n## Overview\n\nDescribe what this project does.\n\n## Install\n\n\`\`\`bash\nnpm install\n\`\`\`\n\n## Usage\n\n\`\`\`bash\nnpm start\n\`\`\`\n`,
  dockerfile: async (input) => {
    const stack = (input || "node").toLowerCase();
    if (stack.includes("python")) {
      return "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD [\"python\",\"app.py\"]";
    }
    return "FROM node:20-alpine\nWORKDIR /app\nCOPY package*.json .\nRUN npm ci\nCOPY . .\nEXPOSE 3000\nCMD [\"npm\",\"start\"]";
  },
  gitignore: async (input) => {
    const s = (input || "node").toLowerCase();
    return [
      "node_modules/",
      "dist/",
      "build/",
      ".env",
      ".DS_Store",
      "coverage/",
      s.includes("python") ? "__pycache__/\n*.pyc" : "",
      s.includes("java") ? "target/\n*.class" : "",
    ]
      .filter(Boolean)
      .join("\n");
  },
  env_template: async (input) =>
    `# ${input || "App"} environment\nNODE_ENV=development\nPORT=3000\nDATABASE_URL=\nAPI_KEY=\n`,
  api_gen: async (input) => {
    const r = (input.trim() || "users").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return [`GET /${r}`, `POST /${r}`, `GET /${r}/:id`, `PUT /${r}/:id`, `DELETE /${r}/:id`].join("\n");
  },
  curl_gen: async (input) => {
    const [method = "GET", url = "https://api.example.com", body = ""] = input.split("\n");
    return `curl -X ${method.trim()} '${url.trim()}' -H 'Content-Type: application/json'${
      body.trim() ? ` -d '${body.trim().replace(/'/g, `'\\''`)}'` : ""
    }`;
  },
  jwt_encode: async (input) => {
    let header = { alg: "none", typ: "JWT" };
    let payload = { sub: "123", name: "Test", iat: Math.floor(Date.now() / 1000) };
    try {
      const parts = input.split(/\n---\n/);
      if (parts[0]) header = JSON.parse(parts[0]);
      if (parts[1]) payload = JSON.parse(parts[1]);
    } catch {
      /* keep defaults */
    }
    return `${b64url(header)}.${b64url(payload)}.`;
  },
  jwt_inspect: async (input) => {
    const [h, p, s] = input.trim().split(".");
    if (!h || !p) throw new Error("Invalid JWT");
    return JSON.stringify({ header: decodeJwtPart(h), payload: decodeJwtPart(p), signature: s || "(none)" }, null, 2);
  },
  jwt_expiry: async (input) => {
    const data = JSON.parse(await transforms.jwt_inspect(input));
    const exp = data.payload?.exp;
    if (!exp) return "No exp claim found";
    const ms = exp * 1000;
    return `${Date.now() > ms ? "EXPIRED" : "VALID"} — exp ${new Date(ms).toISOString()}`;
  },
  jwt_gen: async (input) => {
    const sub = input.trim() || "user_1";
    return transforms.jwt_encode(
      `${JSON.stringify({ alg: "none", typ: "JWT" })}\n---\n${JSON.stringify({
        sub,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      })}`
    );
  },
  url_parse: async (input) => {
    const u = new URL(input.trim());
    return JSON.stringify(
      {
        href: u.href,
        protocol: u.protocol,
        host: u.host,
        pathname: u.pathname,
        search: u.search,
        hash: u.hash,
        searchParams: Object.fromEntries(u.searchParams),
      },
      null,
      2
    );
  },
  url_inspect: async (input) => {
    const u = new URL(input.trim());
    return {
      output: JSON.stringify(
        {
          origin: u.origin,
          pathSegments: u.pathname.split("/").filter(Boolean),
          queryCount: [...u.searchParams].length,
          isHttps: u.protocol === "https:",
        },
        null,
        2
      ),
      meta: "Structural URL inspection.",
    };
  },
  og_gen: async (input) => {
    const [title = "Title", desc = "Description", url = "https://example.com", image = "https://example.com/og.png"] =
      input.split("\n");
    return [
      `<meta property="og:title" content="${title.trim()}" />`,
      `<meta property="og:description" content="${desc.trim()}" />`,
      `<meta property="og:url" content="${url.trim()}" />`,
      `<meta property="og:image" content="${image.trim()}" />`,
    ].join("\n");
  },
  canonical_gen: async (input) => `<link rel="canonical" href="${input.trim()}" />`,
  hreflang: async (input) =>
    input
      .split(/\n/)
      .filter(Boolean)
      .map((line) => {
        const [lang, url] = line.split("|").map((s) => s.trim());
        return `<link rel="alternate" hreflang="${lang}" href="${url}" />`;
      })
      .join("\n"),
  keyword_density: async (input) => {
    const words = input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
    const total = words.length || 1;
    const freq = {};
    words.forEach((w) => {
      freq[w] = (freq[w] || 0) + 1;
    });
    const top = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([w, c]) => `${w}: ${c} (${((c / total) * 100).toFixed(2)}%)`)
      .join("\n");
    return { output: top, meta: `${total} words analyzed.` };
  },
  png_svg_guide: async () =>
    "1. Prefer redrawing logos in Figma/Illustrator as vectors.\n2. Trace only high-contrast flat PNGs (Image Trace / Potrace).\n3. Clean paths, remove embedded rasters.\n4. Optimize with SVGO.\n5. Export SVG; keep PNG fallback for photos.",
  svg_opt: async (input) =>
    input
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\s{2,}/g, " ")
      .replace(/>\s+</g, "><")
      .trim(),
  http_headers: async (input) =>
    input
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const i = line.indexOf(":");
        if (i < 0) return { name: line.trim(), value: "" };
        return { name: line.slice(0, i).trim(), value: line.slice(i + 1).trim() };
      })
      .map((h) => `${h.name}\n  ${h.value}`)
      .join("\n\n"),
  postman: async (input) => {
    const [name = "My API", method = "GET", url = "https://api.example.com"] = input.split("\n");
    return JSON.stringify(
      {
        info: { name: name.trim(), schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
        item: [
          {
            name: `${method.trim()} ${url.trim()}`,
            request: { method: method.trim(), header: [], url: url.trim() },
          },
        ],
      },
      null,
      2
    );
  },
  api_mock: async (input) => {
    const keys = input
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const obj = Object.fromEntries(keys.map((k) => [k, k.includes("id") ? 1 : k.includes("email") ? "user@example.com" : "sample"]));
    return JSON.stringify(obj, null, 2);
  },
  api_docs: async (input) => {
    const [title = "Users API", method = "GET", pathName = "/users", desc = "List users"] = input.split("\n");
    return `# ${title.trim()}\n\n## ${method.trim()} \`${pathName.trim()}\`\n\n${desc.trim()}\n\n### Response\n\n\`\`\`json\n{ "ok": true }\n\`\`\`\n`;
  },
  api_builder: async (input) => {
    const [method = "GET", url = "https://api.example.com", body = ""] = input.split("\n");
    return JSON.stringify(
      {
        method: method.trim(),
        url: url.trim(),
        headers: { "Content-Type": "application/json" },
        body: body.trim() || null,
      },
      null,
      2
    );
  },
  webhook: async (input) => {
    const payload = input.trim() || '{"event":"ping"}';
    const sig = await hmacSha256(payload, "whsec_demo");
    return { output: payload, meta: `Example signature header: X-Signature: sha256=${sig}` };
  },
  graphql: async (input) => {
    const q = input.trim() || "query { user(id: 1) { id name } }";
    return {
      output: JSON.stringify({ data: { user: { id: 1, name: "Ada" } }, query: q }, null, 2),
      meta: "Sample GraphQL response shape for local drafting.",
    };
  },
  pwd_strength: async (input) => {
    const p = input || "";
    let score = 0;
    if (p.length >= 8) score += 1;
    if (p.length >= 12) score += 1;
    if (/[A-Z]/.test(p)) score += 1;
    if (/[0-9]/.test(p)) score += 1;
    if (/[^A-Za-z0-9]/.test(p)) score += 1;
    const label = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"][score];
    return { output: `${label} (${score}/5)`, meta: "Heuristic strength only—use a password manager." };
  },
  csr: async (input) => {
    const [cn = "example.com", org = "Acme", country = "IN"] = input.split("\n");
    return `openssl req -new -newkey rsa:2048 -nodes -keyout ${cn.trim()}.key -out ${cn.trim()}.csr -subj "/C=${country.trim()}/O=${org.trim()}/CN=${cn.trim()}"`;
  },
  cert_decode: async (input) => {
    const pem = input.trim();
    if (!/BEGIN CERTIFICATE/.test(pem)) throw new Error("Paste a PEM certificate");
    const b64 = pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "");
    return {
      output: `PEM length: ${pem.length} chars\nBase64 body: ${b64.length} chars\nApprox DER bytes: ${Math.floor((b64.length * 3) / 4)}`,
      meta: "Browser-side size inspection. Use openssl x509 -text for full decode.",
    };
  },
  cors: async (input) => {
    const [origin = "https://app.example.com", method = "POST"] = input.split("\n");
    return [
      `Access-Control-Allow-Origin: ${origin.trim()}`,
      `Access-Control-Allow-Methods: ${method.trim()}, OPTIONS`,
      "Access-Control-Allow-Headers: Content-Type, Authorization",
      "Access-Control-Max-Age: 86400",
    ].join("\n");
  },
  csp: async (input) => {
    const host = input.trim() || "https://cdn.example.com";
    return `default-src 'self'; script-src 'self' ${host}; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self';`;
  },
  sec_headers: async () =>
    [
      "Strict-Transport-Security: max-age=31536000; includeSubDomains",
      "X-Content-Type-Options: nosniff",
      "X-Frame-Options: DENY",
      "Referrer-Policy: strict-origin-when-cross-origin",
      "Permissions-Policy: camera=(), microphone=(), geolocation=()",
      "Content-Security-Policy: default-src 'self'",
    ].join("\n"),
  dns: async (domain) => {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain.trim())}&type=A`,
      { headers: { accept: "application/dns-json" } }
    );
    if (!res.ok) throw new Error("DNS lookup failed");
    const data = await res.json();
    return { output: JSON.stringify(data.Answer || data, null, 2), meta: "DNS-over-HTTPS via Cloudflare." };
  },
  whois: async (domain) => {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain.trim())}`);
    if (!res.ok) throw new Error(`RDAP lookup failed (${res.status})`);
    const data = await res.json();
    return {
      output: JSON.stringify(
        { ldhName: data.ldhName, status: data.status, events: data.events, nameservers: data.nameservers },
        null,
        2
      ),
      meta: "Public RDAP data.",
    };
  },
  spf: async (domain) => dnsTxt(domain.trim(), "v=spf1"),
  dmarc: async (domain) => dnsTxt(`_dmarc.${domain.trim()}`, "v=DMARC1"),
  dkim: async (input) => {
    const [selector, domain] = (input.includes("\n") ? input.split(/\n/) : input.split(/\s+/)).map((s) =>
      s.trim()
    );
    if (!selector || !domain) throw new Error("Enter selector and domain (two lines)");
    return dnsTxt(`${selector}._domainkey.${domain}`, "v=DKIM1");
  },
  http_status: async (url) => {
    const target = url.trim();
    const res = await fetch(target, { method: "GET", mode: "cors" }).catch(() => null);
    if (!res) {
      return {
        output: "Direct fetch blocked by CORS or network.\nTip: check status with your server, curl, or browser DevTools.",
        meta: "Browsers cannot always read third-party status codes.",
      };
    }
    return { output: `${res.status} ${res.statusText}`, meta: "Fetched with CORS mode." };
  },
  redirect: async (url) => ({
    output: `Start: ${url.trim()}\nNote: browsers hide cross-origin redirect hops from JS.\nUse curl -I -L or an SEO crawler for full chains.`,
    meta: "Guidance for redirect QA.",
  }),
};

async function dnsTxt(name, mustInclude) {
  const res = await fetch(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=TXT`,
    { headers: { accept: "application/dns-json" } }
  );
  if (!res.ok) throw new Error("TXT lookup failed");
  const data = await res.json();
  const records = (data.Answer || []).map((a) => a.data.replace(/"/g, ""));
  const matched = mustInclude ? records.filter((r) => r.includes(mustInclude)) : records;
  return {
    output: (matched.length ? matched : records).join("\n") || "No TXT records found",
    meta: `Queried ${name}`,
  };
}
