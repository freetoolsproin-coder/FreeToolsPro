import { useMemo, useState } from "react";
import { AlignLeft, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { formatYaml } from "../../utils/yamlUtils";

export default function YamlFormatter() {
  const [yaml, setYaml] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!yaml.trim()) {
      return { output: "", error: "" };
    }
    try {
      return { output: formatYaml(yaml), error: "" };
    } catch (err) {
      return { output: "", error: err.message || "Could not format YAML." };
    }
  }, [yaml]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="yamlFormatter" />

      <ToolHeroShell
        icon={AlignLeft}
        title="YAML Formatter"
        subtitle="Paste messy YAML and get clean, consistently indented output you can copy instantly."
        category="developer-tools"
        layout="stack"
        formLabel="Format YAML"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="yaml-input" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              YAML input
            </label>
            <textarea
              id="yaml-input"
              rows={14}
              value={yaml}
              onChange={(e) => setYaml(e.target.value)}
              placeholder={"apiVersion: v1\nkind: ConfigMap\ndata: { key: value }"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="yaml-output" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Formatted YAML
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!output}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="yaml-output"
              readOnly
              rows={14}
              value={output}
              placeholder="Formatted YAML will appear here..."
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
        currentToolPath="/developer-tools/yaml-formatter"
        faqs={[
          { q: "Is this YAML Formatter free?", a: "Yes—format as much YAML as you need, no signup." },
          {
            q: "Does formatting change meaning?",
            a: "It parses then re-serializes your document, preserving structure while normalizing indentation.",
          },
          {
            q: "What if my YAML is invalid?",
            a: "An error message appears and no formatted output is shown until the syntax is fixed.",
          },
        ]}
      />
    </>
  );
}
