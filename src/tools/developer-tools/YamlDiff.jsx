import { useMemo, useState } from "react";
import { GitCompare, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { diffYaml } from "../../utils/yamlUtils";

export default function YamlDiff() {
  const [yamlA, setYamlA] = useState("");
  const [yamlB, setYamlB] = useState("");
  const [copied, setCopied] = useState(false);

  const { diff, error } = useMemo(() => {
    if (!yamlA.trim() && !yamlB.trim()) {
      return { diff: "", error: "" };
    }
    if (!yamlA.trim() || !yamlB.trim()) {
      return { diff: "", error: "Paste YAML into both panels to compare." };
    }
    try {
      return { diff: diffYaml(yamlA, yamlB), error: "" };
    } catch (err) {
      return { diff: "", error: err.message || "Could not diff YAML." };
    }
  }, [yamlA, yamlB]);

  const handleCopy = async () => {
    if (!diff) return;
    await navigator.clipboard.writeText(diff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="yamlDiff" />

      <ToolHeroShell
        icon={GitCompare}
        title="YAML Diff"
        subtitle="Compare two YAML documents line by line. Lines marked with − / + highlight changes."
        category="developer-tools"
        layout="stack"
        formLabel="Compare YAML"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="yaml-a" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              YAML A
            </label>
            <textarea
              id="yaml-a"
              rows={10}
              value={yamlA}
              onChange={(e) => setYamlA(e.target.value)}
              placeholder={"name: Jane\nage: 30"}
              className={textareaDark}
            />
          </div>
          <div>
            <label htmlFor="yaml-b" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              YAML B
            </label>
            <textarea
              id="yaml-b"
              rows={10}
              value={yamlB}
              onChange={(e) => setYamlB(e.target.value)}
              placeholder={"name: Jane\nage: 31"}
              className={textareaDark}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="yaml-diff" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              Diff output
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!diff}
              className="age-btn-ghost px-3 py-1.5 text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy diff"}
            </button>
          </div>
          <textarea
            id="yaml-diff"
            readOnly
            rows={12}
            value={diff}
            placeholder="Diff will appear here..."
            className={textareaDark}
          />
        </div>

        {error ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {error}
          </p>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/yaml-diff"
        faqs={[
          { q: "Is this YAML Diff tool free?", a: "Yes—compare documents with no signup." },
          {
            q: "How is the diff computed?",
            a: "Both sides are normalized to YAML, then compared line by line with − / + markers.",
          },
          {
            q: "Does invalid YAML work?",
            a: "No. Fix parse errors on either side before a diff can be produced.",
          },
        ]}
      />
    </>
  );
}
