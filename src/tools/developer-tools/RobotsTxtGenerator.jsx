import { useState } from "react";
import { Plus,
  Trash2,
  Copy,
  Download,
  AlertTriangle,
  Check,
  FileText,
  HelpCircle,
  RefreshCw, Code2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

// Common bots to help users select quickly without typing
const COMMON_BOTS = [
  { label: "All Bots (*)", value: "*" },
  { label: "Googlebot", value: "Googlebot" },
  { label: "Bingbot", value: "Bingbot" },
  { label: "YandexBot", value: "Yandex" },
  { label: "Baiduspider", value: "Baiduspider" },
  { label: "ChatGPT / OpenAI", value: "GPTBot" },
];

export default function AdvancedRobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState("*");
  const [ruleType, setRuleType] = useState("Disallow"); // Disallow, Allow, Crawl-delay
  const [rulePath, setRulePath] = useState("/");
  const [rules, setRules] = useState([]);
  const [sitemaps, setSitemaps] = useState([]);
  const [currentSitemap, setCurrentSitemap] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const addRule = () => {
    if (ruleType !== "Crawl-delay" && !rulePath.startsWith("/")) {
      setError("Paths must start with a forward slash '/'");
      return;
    }
    if (ruleType === "Crawl-delay" && (isNaN(rulePath) || Number(rulePath) <= 0)) {
      setError("Crawl delay must be a positive number (seconds)");
      return;
    }

    setRules([...rules, { agent: userAgent, type: ruleType, value: rulePath.trim() }]);
    setRulePath(ruleType === "Crawl-delay" ? "5" : "/");
    setError("");
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const addSitemap = () => {
    if (!currentSitemap.startsWith("http://") && !currentSitemap.startsWith("https://")) {
      setError("Sitemap must be a valid absolute URL starting with http:// or https://");
      return;
    }
    if (sitemaps.includes(currentSitemap.trim())) {
      setError("This sitemap has already been added.");
      return;
    }
    setSitemaps([...sitemaps, currentSitemap.trim()]);
    setCurrentSitemap("");
    setError("");
  };

  const removeSitemap = (index) => {
    setSitemaps(sitemaps.filter((_, i) => i !== index));
  };

  const generateRobots = () => {
    if (rules.length === 0 && sitemaps.length === 0) {
      setError("Add at least one rule or a sitemap to generate the file.");
      return;
    }

    let txt = "# Powered by Advanced Robots.txt Generator\n\n";
    const uniqueAgents = [...new Set(rules.map((r) => r.agent))];

    // Grouping rules cleanly by User-agent
    uniqueAgents.forEach((agent) => {
      txt += `User-agent: ${agent}\n`;

      const agentRules = rules.filter((r) => r.agent === agent);

      // Disallow items
      agentRules
        .filter((r) => r.type === "Disallow")
        .forEach((r) => {
          txt += `Disallow: ${r.value}\n`;
        });

      // Allow items
      agentRules
        .filter((r) => r.type === "Allow")
        .forEach((r) => {
          txt += `Allow: ${r.value}\n`;
        });

      // Crawl Delay items
      agentRules
        .filter((r) => r.type === "Crawl-delay")
        .forEach((r) => {
          txt += `Crawl-delay: ${r.value}\n`;
        });

      txt += "\n";
    });

    // Appending multiple sitemaps if present
    if (sitemaps.length > 0) {
      txt += "# Sitemaps\n";
      sitemaps.forEach((sitemap) => {
        txt += `Sitemap: ${sitemap}\n`;
      });
    }

    setOutput(txt.trim());
    setError("");
  };

  const copyToClipboard = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "robots.txt";
    link.click();
  };

  const clearAll = () => {
    setRules([]);
    setSitemaps([]);
    setOutput("");
    setError("");
  };

  return (
    <>
      <Seo page="robotsGenerator" />

      <ToolHeroShell
        category="developer-tools"
        icon={Code2}
        title="Advanced Robots.txt Generator"
        subtitle="Easily control how search engines crawl and index your website."
        formLabel="Start here"
        layout="stack"
      >
<div className="mx-auto flex justify-end">
            {(rules.length > 0 || sitemaps.length > 0) && (
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs bg-white/90 hover:bg-white/30 text-black px-3 py-1.5 rounded-lg font-medium transition"
              >
                <RefreshCw size={14} /> Clear Board
              </button>
            )}
          </div>

          <div className="p-2 md:p-4 grid md:grid-cols-5 gap-8">
            {/* Left Side: Inputs and Configuration */}
            <div className="md:col-span-3 space-y-6">
              {/* Step 1: Rule Configuration */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <FileText size={16} /> 1. Define Directives & Rules
                </h3>

                <div className="space-y-4">
                  {/* Bot Selector Dropdown / Custom Text */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Target Search Bot (User-agent)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={userAgent}
                        onChange={(e) => setUserAgent(e.target.value)}
                        className="w-1/2 p-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        {COMMON_BOTS.map((bot) => (
                          <option key={bot.value} value={bot.value}>
                            {bot.label}
                          </option>
                        ))}
                        <option value="custom">✍️ Custom Bot Name...</option>
                      </select>

                      {userAgent === "custom" ? (
                        <input
                          type="text"
                          placeholder="e.g. BadBot"
                          onChange={(e) => setUserAgent(e.target.value)}
                          className="w-1/2 p-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                        />
                      ) : (
                        <div className="w-1/2 bg-slate-200/60 flex items-center px-3 rounded-lg text-xs text-slate-500 italic">
                          Targeting: {userAgent}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Directive Selector & Value Mapping */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-1">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Action
                      </label>
                      <select
                        value={ruleType}
                        onChange={(e) => {
                          setRuleType(e.target.value);
                          setRulePath(e.target.value === "Crawl-delay" ? "5" : "/");
                        }}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      >
                        <option value="Disallow">Disallow ❌</option>
                        <option value="Allow">Allow ✅</option>
                        <option value="Crawl-delay">Delay ⏳</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        {ruleType === "Crawl-delay" ? "Delay (Seconds)" : "Path Folder / File"}
                      </label>
                      <input
                        value={rulePath}
                        onChange={(e) => setRulePath(e.target.value)}
                        placeholder={ruleType === "Crawl-delay" ? "5" : "/admin/"}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={addRule}
                    className="w-full btnRegular text-white text-sm font-medium py-2 rounded-lg shadow transition flex items-center justify-center gap-1.5"
                  >
                    <Plus size={16} /> Add Rule to Record
                  </button>
                </div>
              </div>

              {/* Step 2: Sitemap Integrations */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <HelpCircle size={16} /> 2. XML Sitemaps (Optional)
                </h3>
                <div className="flex gap-2">
                  <input
                    value={currentSitemap}
                    onChange={(e) => setCurrentSitemap(e.target.value)}
                    placeholder="https://example.com/sitemap.xml"
                    className="flex-1 p-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />
                  <button
                    onClick={addSitemap}
                    className="btnRegular hover:bg-slate-900 text-white text-sm font-medium px-4 rounded-lg shadow transition flex items-center justify-center gap-1"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </div>

              {/* Error Warning Box */}
              {error && (
                <div className="flex items-start gap-2 text-red-700 bg-red-50 border border-red-200 rounded-xl p-3 text-sm">
                  <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-500" />
                  <div>{error}</div>
                </div>
              )}

              {/* Generate Primary CTA Button */}
              <button
                onClick={generateRobots}
                className="w-full btnRegular text-white font-semibold py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-base"
              >
                🛠️ Compile & Generate Robots.txt
              </button>
            </div>

            {/* Right Side: Rule Review Stack & Code Outputs */}
            <div className="md:col-span-2 flex flex-col space-y-6">
              {/* Rules & Sitemaps Dashboard List */}
              <div className="flex-1 flex flex-col min-h-[220px]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Staged Directives Pipeline ({rules.length + sitemaps.length})
                </h3>

                <div className="border border-slate-200 rounded-xl flex-1 p-3 bg-slate-50 overflow-y-auto max-h-[440px] space-y-2 text-xs">
                  {rules.length === 0 && sitemaps.length === 0 && (
                    <div className="text-slate-400 text-center py-10 italic">
                      No rules staging yet. Add entries on the left.
                    </div>
                  )}

                  {/* Rules Mapping view */}
                  {rules.map((r, i) => (
                    <div
                      key={`r-${i}`}
                      className="flex justify-between items-center bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 shadow-sm"
                    >
                      <span className="truncate pr-2">
                        <span className="font-bold text-teal-700 bg-indigo-50 px-1.5 py-0.5 rounded mr-1.5">
                          {r.agent}
                        </span>
                        <span
                          className={`font-semibold ${r.type === "Disallow" ? "text-red-600" : r.type === "Allow" ? "text-emerald-600" : "text-amber-600"}`}
                        >
                          {r.type}
                        </span>{" "}
                        :{" "}
                        <code className="bg-slate-100 px-1 rounded text-slate-700">{r.value}</code>
                      </span>
                      <button
                        onClick={() => removeRule(i)}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Sitemaps view inside stack */}
                  {sitemaps.map((sm, i) => (
                    <div
                      key={`sm-${i}`}
                      className="flex justify-between items-center bg-emerald-50/50 border border-emerald-200 rounded-lg py-1.5 px-2.5 shadow-sm"
                    >
                      <span className="truncate pr-2 text-emerald-800">
                        <span className="font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700 px-1 rounded mr-1.5">
                          Sitemap
                        </span>
                        <code className="text-xs">{sm}</code>
                      </span>
                      <button
                        onClick={() => removeSitemap(i)}
                        className="text-slate-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Output / Terminal Window Panel */}
              {output && (
                <div className="animate-in fade-in-50 duration-200">
                  <div className="flex justify-between items-center bg-slate-900 px-4 py-2 rounded-t-xl">
                    <span className="text-xs text-slate-400 font-mono">Generated Output</span>
                    <div className="flex gap-2">
                      <button
                        onClick={copyToClipboard}
                        className="text-slate-400 hover:text-white transition p-1"
                        title="Copy to Clipboard"
                      >
                        {copied ? (
                          <Check size={16} className="text-emerald-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                      <button
                        onClick={downloadFile}
                        className="text-slate-400 hover:text-white transition p-1"
                        title="Download .txt file"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </div>
                  <pre className="bg-slate-950 text-emerald-400 p-4 font-mono text-xs rounded-b-xl overflow-auto h-48 border-t border-slate-800 shadow-inner leading-relaxed">
                    {output}
                  </pre>
                </div>
              )}
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/robots-txt-generator" />
    </>
  );
}
