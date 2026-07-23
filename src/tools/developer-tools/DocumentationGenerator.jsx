import { useMemo, useState } from "react";
import { BookOpen, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function extractDocs(code) {
  if (!code.trim()) return "";
  const fn =
    code.match(
      /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)|const\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>|def\s+(\w+)\s*\(([^)]*)\)/
    ) || [];
  const name = fn[1] || fn[3] || fn[5] || "untitled";
  const paramsRaw = fn[2] || fn[4] || fn[6] || "";
  const params = paramsRaw
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/=.*/, "").replace(/:.*/, "").trim());

  const classMatch = code.match(/class\s+(\w+)/);
  const returns = /\breturn\b/.test(code);
  const isAsync = /\basync\b|\bawait\b/.test(code);

  const lines = [
    `# ${classMatch ? classMatch[1] : name}`,
    "",
    classMatch
      ? `Class \`${classMatch[1]}\` encapsulating related behavior.`
      : `Function \`${name}\`${isAsync ? " (async)" : ""} generated from source heuristics.`,
    "",
    "## Signature",
    "```",
    classMatch ? `class ${classMatch[1]}` : `${name}(${params.join(", ")})`,
    "```",
    "",
    "## Parameters",
  ];

  if (params.length) {
    params.forEach((p) => lines.push(`- \`${p}\` — _Describe this parameter._`));
  } else {
    lines.push("- None detected.");
  }

  lines.push(
    "",
    "## Returns",
    returns ? "- Returns a value (see `return` statements in source)." : "- No explicit return detected (may be void / side-effect only).",
    "",
    "## Description",
    "Add a short summary of purpose, side effects, and error cases.",
    "",
    "## Example",
    "```",
    params.length ? `${name}(${params.map((_, i) => `arg${i + 1}`).join(", ")})` : `${name}()`,
    "```"
  );

  return lines.join("\n");
}

export default function DocumentationGenerator() {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => extractDocs(code), [code]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="documentationGenerator" />
      <ToolHeroShell
        icon={BookOpen}
        title="Documentation Generator"
        subtitle="Paste a function or class and generate Markdown docs with signature, params, and returns."
        category="developer-tools"
        layout="stack"
        formLabel="Generate docs"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="doc-in">
              Source code
            </label>
            <textarea
              id="doc-in"
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={"function add(a, b) {\n  return a + b;\n}"}
              className={textareaDark}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="doc-out">
                Markdown docs
              </label>
              <button type="button" onClick={copy} disabled={!output} className="age-btn-ghost px-3 py-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="doc-out"
              readOnly
              rows={16}
              value={output}
              placeholder="Documentation appears here…"
              className={textareaDark}
            />
          </div>
        </div>
      </ToolHeroShell>
      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/documentation-generator"
        faqs={[
          { q: "Is this Documentation Generator free?", a: "Yes. Generate Markdown docs with no signup." },
          {
            q: "What languages are supported?",
            a: "Heuristics work best for JavaScript/TypeScript and Python function/class declarations.",
          },
          {
            q: "Is my code uploaded?",
            a: "No. Docs are generated entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
