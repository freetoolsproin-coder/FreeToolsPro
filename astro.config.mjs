import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { ASTRO_REDIRECTS } from "./src/data/redirects.js";

// Static output. Every tool keeps its old URL (no trailing slash). Retired URLs get
// meta-refresh pages here as a fallback; scripts/write-redirects.mjs also writes real
// 301 rules for Netlify/Cloudflare (_redirects), Vercel (vercel.json) and the Node server.
export default defineConfig({
  site: "https://freetoolspro.in",
  output: "static",
  trailingSlash: "never",
  build: {
    format: "file",
    // Ship global.css as one external, cached file (/_astro/*.css) instead of copying it into every page's HTML.
    inlineStylesheets: "never",
  },
  redirects: ASTRO_REDIRECTS,
  integrations: [react()],
  prefetch: { prefetchAll: false, defaultStrategy: "hover" },
  vite: {
    // `astro build` pre-bundles dependencies in production mode. Sharing the cache with `astro dev`
    // gives dev a React without jsxDEV, and every tool island then crashes and renders blank.
    cacheDir: process.argv.includes("dev") ? "node_modules/.vite" : "node_modules/.vite-build",
    build: { assetsInlineLimit: 0 },
  },
});
