import { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Download,
  AlertTriangle,
} from "lucide-react";
import Seo from "../../components/Seo";

export default function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState("");
  const [path, setPath] = useState("/");
  const [urls, setUrls] = useState([]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const normalizeBase = (url) =>
    url.replace(/\/+$/, "").trim();

  const addUrl = () => {
    if (!path.startsWith("/")) {
      setError("Path must start with /");
      return;
    }

    if (urls.some((u) => u.path === path)) {
      setError("URL already added");
      return;
    }

    setUrls([
      ...urls,
      {
        path,
        priority: "0.8",
        changefreq: "weekly",
      },
    ]);

    setPath("/");
    setError("");
  };

  const removeUrl = (index) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const generateSitemap = () => {
    if (!baseUrl) {
      setError("Base URL is required");
      return;
    }

    if (urls.length === 0) {
      setError("Add at least one page");
      return;
    }

    const base = normalizeBase(baseUrl);
    const today = new Date().toISOString().split("T")[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          (u) => `
        <url>
          <loc>${base}${u.path}</loc>
          <lastmod>${today}</lastmod>
          <changefreq>${u.changefreq}</changefreq>
          <priority>${u.priority}</priority>
        </url>`
        )
        .join("")}
      </urlset>`;

    setOutput(xml);
    setError("");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    alert("📋 Sitemap copied");
  };

  const download = () => {
    const blob = new Blob([output], { type: "application/xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sitemap.xml";
    link.click();
  };

  return (
    <>

    <Seo page="sitemapGenerator" />
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Advanced Sitemap Generator
        </h1>

        {/* Base URL */}
        <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">
          <label className="text-sm text-gray-300">Base URL</label>
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl p-2 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Add Path */}
        <div className="flex gap-2 mb-6">
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/"
            className="flex-1 bg-black/40 border border-white/10 rounded-xl p-2 outline-none focus:border-cyan-400"
          />
          <button
            onClick={addUrl}
            className="px-4 rounded-xl bg-cyan-500 hover:bg-cyan-600"
          >
            <Plus />
          </button>
        </div>

        {/* URL List */}
        {urls.length > 0 && (
          <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">
            <h2 className="font-semibold mb-3">Pages</h2>
            <ul className="space-y-2 text-sm">
              {urls.map((u, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-black/30 rounded-lg px-3 py-2"
                >
                  <span>{u.path}</span>
                  <button onClick={() => removeUrl(i)}>
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Generate */}
        <div className="text-center mb-6">
          <button
            onClick={generateSitemap}
            className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-medium"
          >
            Generate Sitemap
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div className="relative rounded-2xl bg-white/5 border border-white/10 p-4">
            <div className="absolute top-4 right-4 flex gap-3">
              <button onClick={copy} className="text-cyan-400">
                <Copy size={18} />
              </button>
              <button onClick={download} className="text-emerald-400">
                <Download size={18} />
              </button>
            </div>

            <pre className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs overflow-auto h-72">
              {output}
            </pre>
          </div>
        )}
      </div>
    </main>

    </>
  );
}
