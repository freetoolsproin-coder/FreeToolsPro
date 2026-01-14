import { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Download,
  Bot,
  AlertTriangle,
} from "lucide-react";
import Seo from "../../components/Seo";

export default function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState("*");
  const [rule, setRule] = useState("/");
  const [rules, setRules] = useState([]);
  const [sitemap, setSitemap] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const addRule = () => {
    if (!rule.startsWith("/")) {
      setError("Rule must start with /");
      return;
    }

    setRules([...rules, { agent: userAgent, path: rule }]);
    setRule("/");
    setError("");
  };

  const removeRule = (index) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const generateRobots = () => {
    if (rules.length === 0) {
      setError("Add at least one rule");
      return;
    }

    let txt = "";
    const agents = [...new Set(rules.map((r) => r.agent))];

    agents.forEach((agent) => {
      txt += `User-agent: ${agent}\n`;
      rules
        .filter((r) => r.agent === agent)
        .forEach((r) => {
          txt += `Disallow: ${r.path}\n`;
        });
      txt += "\n";
    });

    if (sitemap) {
      txt += `Sitemap: ${sitemap.trim()}\n`;
    }

    setOutput(txt.trim());
    setError("");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    alert("📋 robots.txt copied");
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "robots.txt";
    link.click();
  };

  return (
    <>

    <Seo page="robotstxtGenerator" />
    <main className="min-h-screen bg-black text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold text-center mb-8
          bg-gradient-to-r from-cyan-400 to-blue-500
          bg-clip-text text-transparent flex justify-center items-center gap-2">
          <Bot /> Robots.txt Generator
        </h1>

        {/* Rule Input */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <input
            value={userAgent}
            onChange={(e) => setUserAgent(e.target.value)}
            placeholder="User-agent (e.g. *)"
            className="bg-black/40 border border-white/10 rounded-xl p-2 outline-none focus:border-cyan-400"
          />

          <input
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            placeholder="/admin"
            className="bg-black/40 border border-white/10 rounded-xl p-2 outline-none focus:border-cyan-400"
          />

          <button
            onClick={addRule}
            className="rounded-xl bg-cyan-500 hover:bg-cyan-600 font-medium flex justify-center items-center"
          >
            <Plus />
          </button>
        </div>

        {/* Rule List */}
        {rules.length > 0 && (
          <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">
            <h2 className="font-semibold mb-3">Rules</h2>
            <ul className="space-y-2 text-sm">
              {rules.map((r, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-black/30 rounded-lg px-3 py-2"
                >
                  <span>
                    <strong>{r.agent}</strong> → Disallow {r.path}
                  </span>
                  <button onClick={() => removeRule(i)}>
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sitemap */}
        <div className="mb-6 rounded-2xl bg-white/5 border border-white/10 p-4">
          <label className="text-sm text-gray-300 mb-1 block">
            Sitemap URL (optional)
          </label>
          <input
            value={sitemap}
            onChange={(e) => setSitemap(e.target.value)}
            placeholder="https://example.com/sitemap.xml"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-2 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Generate */}
        <div className="text-center mb-6">
          <button
            onClick={generateRobots}
            className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 font-medium"
          >
            Generate robots.txt
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

            <pre className="bg-black/40 border border-white/10 rounded-xl p-3 text-sm overflow-auto h-64">
              {output}
            </pre>
          </div>
        )}
      </div>
    </main>

    </>
  );
}
