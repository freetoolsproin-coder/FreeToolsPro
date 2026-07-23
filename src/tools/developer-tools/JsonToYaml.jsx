import { useMemo, useState } from "react";
import { FileCode2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { jsonToYaml } from "../../utils/yamlUtils";

export default function JsonToYaml() {
  const [json, setJson] = useState("");
  const [copied, setCopied] = useState(false);

  const { yaml, error } = useMemo(() => {
    if (!json.trim()) {
      return { yaml: "", error: "" };
    }
    try {
      return { yaml: jsonToYaml(json), error: "" };
    } catch (err) {
      return { yaml: "", error: err.message || "Could not convert JSON to YAML." };
    }
  }, [json]);

  const handleCopy = async () => {
    if (!yaml) return;
    await navigator.clipboard.writeText(yaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="jsonToYaml" />

      <ToolHeroShell
        icon={FileCode2}
        title="JSON to YAML Converter"
        subtitle="Paste JSON and convert it to clean YAML. Ideal for configs, Kubernetes, and CI files."
        category="developer-tools"
        layout="stack"
        formLabel="Convert JSON"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="json-input" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              JSON input
            </label>
            <textarea
              id="json-input"
              rows={14}
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder={'{\n  "name": "Jane",\n  "age": 30,\n  "active": true\n}'}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="yaml-output" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                YAML output
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!yaml}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy YAML"}
              </button>
            </div>
            <textarea
              id="yaml-output"
              readOnly
              rows={14}
              value={yaml}
              placeholder="YAML will appear here..."
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
        currentToolPath="/developer-tools/json-to-yaml"
        faqs={[
          { q: "Is this JSON to YAML converter free?", a: "Yes—no account required." },
          {
            q: "What JSON types are supported?",
            a: "Objects, arrays, strings, numbers, booleans, and null convert to equivalent YAML.",
          },
          {
            q: "Does invalid JSON fail loudly?",
            a: "Yes. A clear error appears until the JSON parses successfully.",
          },
        ]}
      />
    </>
  );
}
