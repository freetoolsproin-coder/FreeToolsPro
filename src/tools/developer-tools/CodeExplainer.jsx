import { useMemo, useState } from "react";
import { FileCode2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function explainCode(code, language) {
  if (!code.trim()) return "";
  const lines = code.split(/\n/).filter((l) => l.trim());
  const lower = code.toLowerCase();
  const constructs = [];
  if (/\bfunction\b|\bdef\b|=>/.test(code)) constructs.push("functions / methods");
  if (/\bclass\b/.test(code)) constructs.push("classes");
  if (/\bif\b|\belse\b|\bswitch\b/.test(code)) constructs.push("conditionals");
  if (/\bfor\b|\bwhile\b|\.map\(|\.forEach\(/.test(code)) constructs.push("loops / iteration");
  if (/\bimport\b|\brequire\(|\bfrom\b/.test(code)) constructs.push("imports / modules");
  if (/\basync\b|\bawait\b|\.then\(/.test(code)) constructs.push("async / promises");
  if (/\btry\b|\bcatch\b/.test(code)) constructs.push("error handling");
  if (/\breturn\b/.test(code)) constructs.push("return values");

  const steps = lines.slice(0, 12).map((line, i) => {
    const t = line.trim();
    if (/^(import|from|require)/.test(t)) return `${i + 1}. Loads a dependency: \`${t.slice(0, 80)}\``;
    if (/^(function|def|const\s+\w+\s*=\s*(async\s*)?\()/.test(t))
      return `${i + 1}. Defines a callable: \`${t.slice(0, 80)}\``;
    if (/^class\b/.test(t)) return `${i + 1}. Declares a class: \`${t.slice(0, 80)}\``;
    if (/\bif\b|\belse\b/.test(t)) return `${i + 1}. Branches with a condition: \`${t.slice(0, 80)}\``;
    if (/\breturn\b/.test(t)) return `${i + 1}. Returns a result: \`${t.slice(0, 80)}\``;
    if (/\bconsole\.|print\(|System\.out/.test(t))
      return `${i + 1}. Outputs / logs: \`${t.slice(0, 80)}\``;
    return `${i + 1}. Executes: \`${t.slice(0, 80)}\``;
  });

  return [
    `# Code explanation (${language})`,
    "",
    "## Overview",
    `This ${language} snippet has ${lines.length} non-empty line(s). ` +
      (constructs.length
        ? `It primarily uses: ${constructs.join(", ")}.`
        : "It appears to be a short script or configuration fragment."),
    "",
    "## Key constructs",
    constructs.length ? constructs.map((c) => `- ${c}`).join("\n") : "- General statements",
    "",
    "## Step-by-step",
    ...steps,
    "",
    "## Notes",
    lower.includes("todo")
      ? "- Contains TODO markers—likely unfinished work."
      : "- No TODO markers detected.",
    code.includes("eval(") || code.includes("innerHTML")
      ? "- Potential risky APIs detected (eval/innerHTML)—review for security."
      : "- No obvious high-risk APIs flagged by this heuristic.",
  ].join("\n");
}

export default function CodeExplainer() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => explainCode(code, language), [code, language]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="codeExplainer" />
      <ToolHeroShell
        icon={FileCode2}
        title="Code Explainer"
        subtitle="Paste a snippet and get a structured overview, constructs, and step-by-step walkthrough."
        category="developer-tools"
        layout="stack"
        formLabel="Explain code"
      >
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="lang">
            Language
          </label>
          <select
            id="lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={selectDark}
          >
            {["JavaScript", "TypeScript", "Python", "Java", "C#", "Go", "PHP", "SQL", "Other"].map(
              (l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              )
            )}
          </select>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="code-in">
              Code
            </label>
            <textarea
              id="code-in"
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste code…"
              className={textareaDark}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="code-out">
                Explanation
              </label>
              <button type="button" onClick={copy} disabled={!output} className="age-btn-ghost px-3 py-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="code-out"
              readOnly
              rows={16}
              value={output}
              placeholder="Explanation appears here…"
              className={textareaDark}
            />
          </div>
        </div>
      </ToolHeroShell>
      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/code-explainer"
        faqs={[
          { q: "Is this Code Explainer free?", a: "Yes—no account required." },
          {
            q: "Does it send my code to a server?",
            a: "No. Explanations are generated locally in your browser.",
          },
          {
            q: "Which languages work best?",
            a: "JavaScript, TypeScript, Python, Java, C#, Go, PHP, and SQL heuristics are included.",
          },
        ]}
      />
    </>
  );
}
