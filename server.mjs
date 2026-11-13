// Minimal production server for dist/ with real 301s and long-lived caching for hashed assets.
// Usage: npm run build && node server.mjs   (PORT env var, default 3000)
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = join(process.cwd(), "dist");
const { exact, prefixes, gone } = JSON.parse(await readFile(join(ROOT, "redirects.json"), "utf8"));
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".xml": "application/xml; charset=utf-8", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ico": "image/x-icon", ".woff2": "font/woff2", ".webmanifest": "application/manifest+json" };

async function file(p) {
  try {
    const s = await stat(p);
    return s.isFile() ? p : null;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  let path = decodeURIComponent(url.pathname);
  // The deleted blog answers 410 Gone so search engines drop it.
  const host = (req.headers.host || "").split(":")[0].toLowerCase();
  const p = path.replace(/(.)\/+$/, "$1");
  if (gone && (host === gone.host || gone.exact.includes(p) || gone.prefixes.some((pre) => path.startsWith(pre)))) return send410(res);
  if (path.length > 1 && path.endsWith("/")) return send301(res, path.replace(/\/+$/, "") + url.search);
  if (exact[path]) return send301(res, exact[path] + url.search);
  for (const [pre, to] of prefixes) if (path.startsWith(pre)) return send301(res, to);

  const safe = normalize(path).replace(/^(\.\.[/\\])+/, "");
  const found = (await file(join(ROOT, safe))) || (await file(join(ROOT, safe + ".html"))) || (path === "/" && (await file(join(ROOT, "index.html"))));
  const target = found || join(ROOT, "404.html");
  let body = await readFile(target);
  const type = TYPES[extname(target)] || "application/octet-stream";
  const headers = { "Content-Type": type, "X-Content-Type-Options": "nosniff" };
  headers["Cache-Control"] = path.startsWith("/_astro/") ? "public, max-age=31536000, immutable" : "public, max-age=600";
  if (/text|javascript|json|xml|svg/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    body = gzipSync(body);
    headers["Content-Encoding"] = "gzip";
  }
  res.writeHead(found ? 200 : 404, headers);
  res.end(body);
}).listen(process.env.PORT || 3000, () => console.log(`Serving dist/ on :${process.env.PORT || 3000}`));

async function send410(res) {
  res.writeHead(410, { "Content-Type": "text/html; charset=utf-8", "X-Robots-Tag": "noindex" });
  res.end(await readFile(join(ROOT, "404.html")));
}

function send301(res, to) {
  res.writeHead(301, { Location: to, "Cache-Control": "public, max-age=86400" });
  res.end();
}
