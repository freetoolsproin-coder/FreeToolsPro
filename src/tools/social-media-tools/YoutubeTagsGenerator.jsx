import { useState } from "react";
import { Tags, Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell from "../../components/ToolHeroShell";

const inputClass =
  "w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-white outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25 placeholder:text-slate-500";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function generateTags(topic, niche) {
  const base = slugify(topic);
  const words = base.split(" ").filter(Boolean);
  const primary = words.join(" ");
  const joined = words.join("");

  const templates = [
    primary,
    `${primary} tutorial`,
    `${primary} guide`,
    `${primary} tips`,
    `${primary} 2026`,
    `how to ${primary}`,
    `best ${primary}`,
    `${primary} for beginners`,
    `${primary} explained`,
    `${primary} tricks`,
    `${niche} ${primary}`,
    `${niche} tips`,
    `${niche} tutorial`,
    `learn ${primary}`,
    `${joined}`,
    `${primary} review`,
    `${primary} ideas`,
    `${primary} strategy`,
    `${primary} examples`,
    `free ${primary}`,
    `${primary} step by step`,
    `${primary} hacks`,
    `${primary} course`,
    `${primary} online`,
    `top ${primary}`,
  ];

  return [...new Set(templates.map((t) => t.trim()).filter((t) => t.length > 1))].slice(0, 25);
}

export default function YoutubeTagsGenerator() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("youtube");
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 450));
    setTags(generateTags(topic, niche));
    setLoading(false);
  };

  const copyAll = async () => {
    if (!tags.length) return;
    await navigator.clipboard.writeText(tags.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="youtubeTagsGenerator" />

      <ToolHeroShell
        icon={Tags}
        title="YouTube Tags Generator"
        subtitle="Generate SEO-friendly YouTube tags from your video topic to improve discoverability."
        category="social-media-tools"
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_180px_auto]">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300" htmlFor="yt-topic">
              Video Topic / Title Keywords
            </label>
            <input
              id="yt-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., home workout for beginners"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Niche</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className={inputClass}
            >
              <option value="youtube" className="bg-slate-900 text-white">
                General
              </option>
              <option value="fitness" className="bg-slate-900 text-white">
                Fitness
              </option>
              <option value="tech" className="bg-slate-900 text-white">
                Tech
              </option>
              <option value="education" className="bg-slate-900 text-white">
                Education
              </option>
              <option value="gaming" className="bg-slate-900 text-white">
                Gaming
              </option>
              <option value="finance" className="bg-slate-900 text-white">
                Finance
              </option>
              <option value="cooking" className="bg-slate-900 text-white">
                Cooking
              </option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !topic.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-5 py-3 text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Generate
            </button>
          </div>
        </div>

        {tags.length > 0 && (
          <div className="mt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <Tags className="h-4 w-4" /> Suggested Tags ({tags.length})
              </h2>
              <button
                type="button"
                onClick={copyAll}
                className="inline-flex items-center gap-1 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-sm text-slate-200 transition hover:border-slate-500"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy All"}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-2xl border border-red-500/30 bg-red-500/15 px-3 py-1 text-sm font-medium text-red-200"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/80 p-3 text-xs text-slate-400">
              Paste tags into YouTube Studio separated by commas. Prefer relevant, specific tags over keyword stuffing.
            </p>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent
        category="social-media-tools"
        currentToolPath="/social-media-tools/youtube-tags-generator" />
    </>
  );
}
