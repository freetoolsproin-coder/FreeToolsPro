import { useState } from "react";
import { Plus, Trash2, Copy, Download, AlertTriangle, Check, Code2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function SitemapGenerator() {
  const [baseUrl, setBaseUrl] = useState("");
  const [path, setPath] = useState("/");
  const [priority, setPriority] = useState("0.8");
  const [changefreq, setChangefreq] = useState("weekly");
  const [urls, setUrls] = useState([]);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const normalizeBase = (url) => url.replace(/\/+$/, "").trim();

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
        priority,
        changefreq,
      },
    ]);

    // Reset path field but preserve configs for convenience
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
    (u) => `  <url>
    <loc>${base}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
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

      <ToolHeroShell
        category="developer-tools"
        icon={Code2}
        title="Advanced Sitemap Generator"
        subtitle="Fast, private, and free in your browser."
        formLabel="Start here"
      >
<div className="p-2 sm:p-4 mt-4 bg-white rounded-2xl">
            {/* Base URL */}
            <div className="rounded-2xl mb-4">
              <label className="text-sm font-medium">Base Domain URL</label>
              <input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full mt-2 bg-white/10 border border-gray/40 rounded-2xl p-2 outline-none focus:border-gray-400"
              />
            </div>

            {/* Add Path Configurator */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 mb-6">
              <label className="text-sm font-medium block mb-2">Configure Route Path</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                {/* Path Input */}
                <div>
                  <span className="text-xs text-gray-400">Path</span>
                  <input
                    value={path}
                    onChange={(e) => setPath(e.target.value)}
                    placeholder="/"
                    className="w-full mt-1 p-2 rounded-xl bg-white/10 border border-transparent outline-none focus:border-gray-400"
                  />
                </div>

                {/* Change Frequency */}
                <div>
                  <span className="text-xs text-gray-400">Change Frequency</span>
                  <select
                    value={changefreq}
                    onChange={(e) => setChangefreq(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-800 text-white border border-transparent outline-none focus:border-gray-400"
                  >
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <span className="text-xs text-gray-400">Priority</span>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full mt-1 p-2 rounded-xl bg-neutral-800 text-white border border-transparent outline-none focus:border-gray-400"
                  >
                    <option value="1.0">1.0 (Highest)</option>
                    <option value="0.9">0.9</option>
                    <option value="0.8">0.8 (Default)</option>
                    <option value="0.7">0.7</option>
                    <option value="0.6">0.6</option>
                    <option value="0.5">0.5 (Neutral)</option>
                    <option value="0.4">0.4</option>
                    <option value="0.3">0.3</option>
                    <option value="0.2">0.2</option>
                    <option value="0.1">0.1</option>
                  </select>
                </div>
              </div>

              <button
                onClick={addUrl}
                className="w-full py-2 flex justify-center items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white font-medium"
              >
                <Plus size={18} /> Add Route
              </button>
            </div>

            {/* URL List */}
            {urls.length > 0 && (
              <div className="mb-6 rounded-2xl">
                <span className="text-sm font-medium block mb-2">Added URLs ({urls.length})</span>
                <ul className="space-y-2 text-sm sitemap">
                  {urls.map((u, i) => (
                    <li
                      key={i}
                      className="flex justify-between items-center bg-black/30 rounded-2xl px-4 py-2 border border-white/5"
                    >
                      <div className="flex flex-col sm:flex-row sm:gap-4">
                        <span className="font-mono text-black">{u.path}</span>
                        <span className="text-xs white flex gap-2">
                          <span>
                            Freq: <b>{u.changefreq}</b>
                          </span>
                          <span>
                            Prio: <b>{u.priority}</b>
                          </span>
                        </span>
                      </div>
                      <button
                        onClick={() => removeUrl(i)}
                        className="hover:text-red-400 transition btnSmalText"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Generate Button */}
            <div className="text-center mb-6">
              <button
                onClick={generateSitemap}
                className="btnRegular w-full md:w-auto flex justify-center items-center gap-2 mx-auto"
              >
                <Check size={16} /> Generate Sitemap XML
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                <AlertTriangle size={18} />
                {error}
              </div>
            )}

            {/* Output Editor Window */}
            {output && (
              <div className="relative">
                <div className="absolute top-4 right-4 flex gap-3 z-10 bg-neutral-900/80 p-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
                  <button onClick={copy} className="text-cyan-400 hover:text-cyan-300 transition">
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={download}
                    className="text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <Download size={18} />
                  </button>
                </div>

                <pre className="rounded-2xl resultAge text-xs overflow-auto h-72 p-4 bg-black text-emerald-500 font-mono border border-white/10 whitespace-pre">
                  {output}
                </pre>
              </div>
            )}
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/sitemap-generator" />
    </>
  );
}
