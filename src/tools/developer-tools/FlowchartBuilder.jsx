import { useMemo, useState } from "react";
import { GitBranch, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function toNodeId(label, index) {
  const cleaned = String(label)
    .trim()
    .replace(/[^A-Za-z0-9_]/g, "_")
    .replace(/^(\d)/, "_$1");
  return cleaned || `step_${index + 1}`;
}

function buildMermaidFlowchart(text) {
  const lines = String(text ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  const decisionRe = /^(.+?)\s*->\s*(.+?)\s*:\s*(.+)$/;
  const edgeRe = /^(.+?)\s*->\s*(.+)$/;

  const nodes = new Map();
  const edges = [];
  const sequence = [];

  lines.forEach((line, index) => {
    const decisionMatch = line.match(decisionRe);
    if (decisionMatch) {
      const [, fromLabel, toLabel, decision] = decisionMatch;
      const fromId = toNodeId(fromLabel, index);
      const toId = toNodeId(toLabel, index + 1000);
      if (!nodes.has(fromId)) nodes.set(fromId, fromLabel.trim());
      if (!nodes.has(toId)) nodes.set(toId, toLabel.trim());
      edges.push({ from: fromId, to: toId, label: decision.trim() });
      return;
    }

    const edgeMatch = line.match(edgeRe);
    if (edgeMatch) {
      const [, fromLabel, toLabel] = edgeMatch;
      const fromId = toNodeId(fromLabel, index);
      const toId = toNodeId(toLabel, index + 2000);
      if (!nodes.has(fromId)) nodes.set(fromId, fromLabel.trim());
      if (!nodes.has(toId)) nodes.set(toId, toLabel.trim());
      edges.push({ from: fromId, to: toId, label: "" });
      return;
    }

    const id = toNodeId(line, index);
    if (!nodes.has(id)) nodes.set(id, line);
    sequence.push(id);
  });

  for (let i = 0; i < sequence.length - 1; i += 1) {
    edges.push({ from: sequence[i], to: sequence[i + 1], label: "" });
  }

  const out = ["flowchart TD"];
  nodes.forEach((label, id) => {
    const safe = label.replace(/"/g, "'");
    out.push(`  ${id}["${safe}"]`);
  });
  edges.forEach(({ from, to, label }) => {
    if (label) {
      out.push(`  ${from} -->|${label.replace(/\|/g, "/")}| ${to}`);
    } else {
      out.push(`  ${from} --> ${to}`);
    }
  });

  return out.join("\n");
}

export default function FlowchartBuilder() {
  const [steps, setSteps] = useState("");
  const [copied, setCopied] = useState(false);

  const { mermaid, error } = useMemo(() => {
    if (!steps.trim()) {
      return { mermaid: "", error: "" };
    }
    try {
      return { mermaid: buildMermaidFlowchart(steps), error: "" };
    } catch (err) {
      return { mermaid: "", error: err.message || "Could not build flowchart." };
    }
  }, [steps]);

  const handleCopy = async () => {
    if (!mermaid) return;
    await navigator.clipboard.writeText(mermaid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="flowchartBuilder" />

      <ToolHeroShell
        icon={GitBranch}
        title="Flowchart Builder"
        subtitle="List steps one per line, or add decisions like A -> B: yes. Get Mermaid flowchart syntax to copy."
        category="developer-tools"
        layout="stack"
        formLabel="Build flowchart"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="steps-input" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Steps (one per line)
            </label>
            <textarea
              id="steps-input"
              rows={14}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder={"Start\nCollect input\nValidate\nValid -> Save: yes\nValid -> Show error: no\nDone"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="mermaid-output" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Mermaid output
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!mermaid}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="mermaid-output"
              readOnly
              rows={14}
              value={mermaid}
              placeholder="Mermaid flowchart will appear here..."
              className={textareaDark}
            />
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {error}
          </p>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/flowchart-builder"
        faqs={[
          { q: "Is this Flowchart Builder free?", a: "Yes—generate Mermaid diagrams with no account." },
          {
            q: "How do decision edges work?",
            a: 'Write lines like "Valid -> Save: yes" to create a labeled edge between nodes.',
          },
          {
            q: "Where can I render the output?",
            a: "Paste into Mermaid Live Editor, GitHub Markdown, Notion, or any Mermaid-compatible viewer.",
          },
        ]}
      />
    </>
  );
}
