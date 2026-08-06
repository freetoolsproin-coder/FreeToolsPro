import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),

    // Sitemap: public/sitemap.xml is source of truth (npm run generate:sitemap)
    VitePWA({
      disable: true,
      injectRegister: false,
      manifest: false,
      devOptions: {
        enabled: false,
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
    cssCodeSplit: true,
    // Do not preload lazy chunks from the homepage entry (mobile TBT).
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-dom") || id.includes("node_modules/react/")) {
            return "react";
          }
          if (id.includes("node_modules/react-router")) {
            return "router";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "lucide";
          }
          if (id.includes("node_modules/framer-motion")) {
            return "motion";
          }
          if (id.includes("src/data/toolDefinitions")) {
            return "tool-defs";
          }
          if (id.includes("src/seo/seoConfig") || id.includes("src/components/config/seoRoutes")) {
            return "seo-data";
          }
          if (id.includes("src/routes/appRoutes")) {
            return "app-routes";
          }
        },
      },
    },
  },
}));
