/**
 * Generates all new tool React components + registry patch snippets.
 * Run: node scripts/write-tool-components.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const faqs = (name) => `[
  { q: "Is this ${name} free?", a: "Yes. FreeToolsPro tools are free to use with no signup wall." },
  { q: "Does my data leave this device?", a: "Processing runs in your browser whenever possible. Nothing is stored on our servers for this tool." },
  { q: "Does it work on mobile?", a: "Yes. The layout is responsive for phone, tablet, and desktop." },
]`;

function dualPaneShell({
  file,
  folder,
  seoKey,
  icon,
  iconImport,
  title,
  subtitle,
  category,
  toolPath,
  name,
  body,
  extraImports = "",
}) {
  return `import { useMemo, useState } from "react";
import { ${iconImport}, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
${extraImports}

export default function ${file.replace(".jsx", "")}() {
${body}

  return (
    <>
      <Seo page="${seoKey}" />
      <ToolHeroShell
        icon={${icon}}
        title="${title}"
        subtitle="${subtitle}"
        category="${category}"
        layout="stack"
        formLabel="Start here"
      >
        {ui}
      </ToolHeroShell>
      <ToolContentLayout
        category="${category}"
        currentToolPath="${toolPath}"
        faqs={${faqs(name)}}
      />
    </>
  );
}
`;
}

const components = {};

// ——— Email Rewriter ———
components["text-tools/EmailRewriter.jsx"] = `import { useMemo, useState } from "react";
import { Mail, Copy, Check, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const TONES = {
  Professional: {
    greet: "Dear Team,",
    close: "Best regards",
    swaps: [
      [/hey\\b/gi, "Hello"],
      [/thanks a lot/gi, "Thank you"],
      [/asap/gi, "as soon as possible"],
      [/gonna/gi, "going to"],
      [/wanna/gi, "want to"],
    ],
  },
  Friendly: {
    greet: "Hi there,",
    close: "Cheers",
    swaps: [
      [/Dear\\s+/gi, "Hi "],
      [/I am writing to/gi, "Just wanted to"],
      [/Please be advised/gi, "Quick note:"],
    ],
  },
  Concise: {
    greet: "",
    close: "Thanks",
    swaps: [
      [/I hope this (email|message) finds you well[.,]?\\s*/gi, ""],
      [/Just wanted to reach out (to|and)\\s*/gi, ""],
      [/in order to/gi, "to"],
      [/at this point in time/gi, "now"],
    ],
  },
  Persuasive: {
    greet: "Hi,",
    close: "Looking forward to your reply",
    swaps: [
      [/I think/gi, "I'm confident"],
      [/maybe we could/gi, "let's"],
      [/would you mind/gi, "could you"],
    ],
  },
  Formal: {
    greet: "Dear Sir/Madam,",
    close: "Yours sincerely",
    swaps: [
      [/Hi\\b/gi, "Dear"],
      [/Hey\\b/gi, "Dear"],
      [/Thanks/gi, "Thank you"],
      [/can't/gi, "cannot"],
      [/won't/gi, "will not"],
    ],
  },
};

function rewriteEmail(text, tone) {
  if (!text.trim()) return "";
  const cfg = TONES[tone] || TONES.Professional;
  let body = text.trim();
  for (const [re, rep] of cfg.swaps) body = body.replace(re, rep);
  const lines = body.split(/\\n+/).filter(Boolean);
  const hasGreeting = /^(hi|hello|dear|hey)\\b/i.test(lines[0] || "");
  const parts = [];
  if (cfg.greet && !hasGreeting) parts.push(cfg.greet, "");
  parts.push(body);
  if (cfg.close && !/regards|sincerely|cheers|thanks\\b/i.test(body.slice(-80))) {
    parts.push("", cfg.close);
  }
  return parts.join("\\n");
}

export default function EmailRewriter() {
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("Professional");
  const [copied, setCopied] = useState(false);
  const output = useMemo(() => rewriteEmail(input, tone), [input, tone]);

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="emailRewriter" />
      <ToolHeroShell
        icon={Mail}
        title="Email Rewriter"
        subtitle="Rewrite any email into a clearer tone—professional, friendly, concise, persuasive, or formal."
        category="text-tools"
        layout="stack"
        formLabel="Rewrite email"
      >
        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="tone">
            Tone
          </label>
          <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} className={selectDark}>
            {Object.keys(TONES).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="email-in">Original email</label>
            <textarea id="email-in" rows={14} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Paste your draft email…" className={textareaDark} />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="email-out">Rewritten</label>
              <button type="button" onClick={copy} disabled={!output} className="age-btn-ghost px-3 py-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea id="email-out" readOnly rows={14} value={output} placeholder="Rewritten email appears here…" className={textareaDark} />
          </div>
        </div>
        <button type="button" onClick={() => { setInput(""); }} className="age-btn-ghost mt-4 inline-flex items-center gap-2 px-4 py-2 text-sm">
          <RefreshCw className="h-4 w-4" /> Clear
        </button>
      </ToolHeroShell>
      <ToolContentLayout
        category="text-tools"
        currentToolPath="/text-tools/email-rewriter"
        faqs={[
          { q: "Is this Email Rewriter free?", a: "Yes. Rewrite drafts freely—no account required." },
          { q: "Is my email uploaded?", a: "No. Rewrites run in your browser; nothing is stored on our servers." },
          { q: "Which tones are available?", a: "Professional, Friendly, Concise, Persuasive, and Formal." },
        ]}
      />
    </>
  );
}
`;

// ——— Code Explainer ———
components["developer-tools/CodeExplainer.jsx"] = `import { useMemo, useState } from "react";
import { FileCode2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function explainCode(code, language) {
  if (!code.trim()) return "";
  const lines = code.split(/\\n/).filter((l) => l.trim());
  const lower = code.toLowerCase();
  const constructs = [];
  if (/\\bfunction\\b|\\bdef\\b|\\b=>\\b/.test(code)) constructs.push("functions / methods");
  if (/\\bclass\\b/.test(code)) constructs.push("classes");
  if (/\\bif\\b|\\belse\\b|\\bswitch\\b/.test(code)) constructs.push("conditionals");
  if (/\\bfor\\b|\\bwhile\\b|\\.map\\(|\\.forEach\\(/.test(code)) constructs.push("loops / iteration");
  if (/\\bimport\\b|\\brequire\\(|\\bfrom\\b/.test(code)) constructs.push("imports / modules");
  if (/\\basync\\b|\\bawait\\b|\\.then\\(/.test(code)) constructs.push("async / promises");
  if (/\\btry\\b|\\bcatch\\b/.test(code)) constructs.push("error handling");
  if (/\\breturn\\b/.test(code)) constructs.push("return values");

  const steps = lines.slice(0, 12).map((line, i) => {
    const t = line.trim();
    if (/^(import|from|require)/.test(t)) return \`\${i + 1}. Loads a dependency: \\\`\${t.slice(0, 80)}\\\`\`;
    if (/^(function|def|const\\s+\\w+\\s*=\\s*(async\\s*)?\\()/.test(t)) return \`\${i + 1}. Defines a callable: \\\`\${t.slice(0, 80)}\\\`\`;
    if (/^class\\b/.test(t)) return \`\${i + 1}. Declares a class: \\\`\${t.slice(0, 80)}\\\`\`;
    if (/\\bif\\b|\\belse\\b/.test(t)) return \`\${i + 1}. Branches with a condition: \\\`\${t.slice(0, 80)}\\\`\`;
    if (/\\breturn\\b/.test(t)) return \`\${i + 1}. Returns a result: \\\`\${t.slice(0, 80)}\\\`\`;
    if (/\\bconsole\\.|print\\(|System\\.out/.test(t)) return \`\${i + 1}. Outputs / logs: \\\`\${t.slice(0, 80)}\\\`\`;
    return \`\${i + 1}. Executes: \\\`\${t.slice(0, 80)}\\\`\`;
  });

  return [
    \`# Code explanation (\${language})\`,
    "",
    "## Overview",
    \`This \${language} snippet has \${lines.length} non-empty line(s). \` +
      (constructs.length
        ? \`It primarily uses: \${constructs.join(", ")}.\`
        : "It appears to be a short script or configuration fragment."),
    "",
    "## Key constructs",
    constructs.length ? constructs.map((c) => \`- \${c}\`).join("\\n") : "- General statements",
    "",
    "## Step-by-step",
    ...steps,
    "",
    "## Notes",
    lower.includes("todo") ? "- Contains TODO markers—likely unfinished work." : "- No TODO markers detected.",
    code.includes("eval(") || code.includes("innerHTML")
      ? "- Potential risky APIs detected (eval/innerHTML)—review for security."
      : "- No obvious high-risk APIs flagged by this heuristic.",
  ].join("\\n");
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
          <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="lang">Language</label>
          <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)} className={selectDark}>
            {["JavaScript","TypeScript","Python","Java","C#","Go","PHP","SQL","Other"].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="code-in">Code</label>
            <textarea id="code-in" rows={16} value={code} onChange={(e) => setCode(e.target.value)} placeholder="Paste code…" className={textareaDark} />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="code-out">Explanation</label>
              <button type="button" onClick={copy} disabled={!output} className="age-btn-ghost px-3 py-1.5 text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea id="code-out" readOnly rows={16} value={output} placeholder="Explanation appears here…" className={textareaDark} />
          </div>
        </div>
      </ToolHeroShell>
      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/code-explainer"
        faqs={[
          { q: "Is this Code Explainer free?", a: "Yes—no account required." },
          { q: "Does it send my code to a server?", a: "No. Explanations are generated locally in your browser." },
          { q: "Which languages work best?", a: "JavaScript, TypeScript, Python, Java, C#, Go, PHP, and SQL heuristics are included." },
        ]}
      />
    </>
  );
}
`;

fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
fs.writeFileSync(
  path.join(root, "scripts", "_component-batch1.json"),
  JSON.stringify(Object.keys(components))
);

// Write first two immediately; rest continue below in same file via dynamic generation
for (const [rel, src] of Object.entries(components)) {
  const out = path.join(root, "src", "tools", rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, src);
  console.log("Wrote", rel);
}

console.log("Batch 1 done (EmailRewriter, CodeExplainer). Continuing in write-tool-components-rest.mjs");
