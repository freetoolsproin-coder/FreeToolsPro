import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import sitemapPlugin from "vite-plugin-sitemap";
import path from "path";

const Sitemap = typeof sitemapPlugin === 'function' ? sitemapPlugin : (sitemapPlugin).default;

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    
    Sitemap({
       hostname: "https://freetoolspro.in",
      dynamicRoutes: [
        "/blog",
        "/blog/category/tutorials",
        "/blog/category/guides",
        "/blog/category/programming",
        "/blog/category/seo",
        "/blog/category/image-optimization",
        "/blog/category/pdf",
        "/blog/category/javascript",
        "/blog/category/ai-articles",
        "/blog/how-to-calculate-emi-and-sip",
        "/blog/freetoolspro-workflow-guide",
        "/blog/regex-and-json-tips-for-developers",
        "/blog/website-seo-checklist",
        "/blog/image-optimization-tips-for-the-web",
        "/blog/pdf-convert-and-prepare-tutorial",
        "/blog/javascript-tips-forms-and-dates",
        "/blog/javascript-execution-context",
        "/blog/javascript-call-stack",
        "/blog/javascript-event-loop",
        "/blog/javascript-microtasks",
        "/blog/javascript-macrotasks",
        "/blog/javascript-hoisting",
        "/blog/javascript-scope",
        "/blog/javascript-lexical-environment",
        "/blog/javascript-closures-explained",
        "/blog/javascript-prototypes",
        "/blog/javascript-prototype-chain",
        "/blog/javascript-classes",
        "/blog/javascript-inheritance",
        "/blog/javascript-modules",
        "/blog/javascript-dynamic-import",
        "/blog/robots-txt-guide",
        "/blog/sitemap-tutorial",
        "/blog/canonical-urls-explained",
        "/blog/open-graph-tags-guide",
        "/blog/schema-markup-guide",
        "/blog/core-web-vitals-guide",
        "/blog/technical-seo-guide",
        "/blog/internal-linking-guide",
        "/blog/keyword-research-guide",
        "/blog/merge-pdf-files-guide",
        "/blog/convert-pdf-to-word-guide",
        "/blog/ocr-explained",
        "/blog/best-ai-prompts",
        "/blog/prompt-engineering-guide",
        "/blog/chatgpt-tips",
        "/blog/ai-for-students",
        "/blog/ai-for-developers",
        "/blog/ai-resume-writing",
        "/blog/ai-email-writing",
        "/blog/ai-productivity",
        "/blog/html-basics-for-web-developers",
        "/blog/css-fundamentals-guide",
        "/blog/javascript-fundamentals-guide",
        "/blog/react-beginners-guide",
        "/blog/nodejs-beginners-guide",
        "/blog/express-js-guide",
        "/blog/mongodb-basics-guide",
        "/blog/git-version-control-guide",
        "/calculators/age-calculator",
        "/calculators/bmi-calculator",
        "/calculators/inflation-calculator",
        "/calculators/ppf-calculator",
        "/social-media-tools/ai-story-generator",
        "/social-media-tools/ai-essay-writer",
        "/social-media-tools/youtube-tags-generator",
        "/developer-tools/website-speed-checker",
        "/developer-tools/domain-age-checker",
        "/developer-tools/ssl-checker",
        "/image-tools/ai-image-generator",
      ],
      // Keep public/robots.txt (GEO AI crawler allows + llms.txt hints)
      generateRobotsTxt: false,
    }),

    // PWA plugin is now always active, preventing "virtual" module resolution errors
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.svg", "favicon.png", "apple-touch-icon.png"],
      manifest: {
        name: "Free Tools Pro",
        short_name: "FreeTools",
        theme_color: "#2cb3f1",
        background_color: "#e8f4fa",
        icons: [
          {
            src: "/favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false, // Ensures PWA service workers don't run in development
      },
    }),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
    proxy: {
      "/api-ip": {
        target: "https://ipapi.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-ip/, ""),
      },
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
}));