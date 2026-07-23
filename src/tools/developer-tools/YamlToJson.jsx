import { useMemo, useState } from "react";
import { FileJson, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { yamlToJson } from "../../utils/yamlUtils";

export default function YamlToJson() {
  const [yaml, setYaml] = useState("");
  const [copied, setCopied] = useState(false);

  const { json, error } = useMemo(() => {
    if (!yaml.trim()) {
      return { json: "", error: "" };
    }
    try {
      return { json: yamlToJson(yaml, true), error: "" };
    } catch (err) {
      return { json: "", error: err.message || "Could not convert YAML to JSON." };
    }
  }, [yaml]);

  const handleCopy = async () => {
    if (!json) return;
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="yamlToJson" />

      <ToolHeroShell
        icon={FileJson}
        title="YAML to JSON Converter"
        subtitle="Paste YAML and convert it to pretty-printed JSON. Copy the result in one click."
        category="developer-tools"
        layout="stack"
        formLabel="Convert YAML"
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
              placeholder={"name: Jane\nage: 30\nactive: true"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="json-output" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                JSON output
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!json}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <textarea
              id="json-output"
              readOnly
              rows={14}
              value={json}
              placeholder="JSON will appear here..."
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
        currentToolPath="/developer-tools/yaml-to-json"
        faqs={[
          { q: "Is this YAML to JSON converter free?", a: "Yes—convert unlimited documents in your browser." },
          {
            q: "Are nested maps and lists supported?",
            a: "Yes. Standard YAML structures convert to JSON objects and arrays.",
          },
          {
            q: "Is my data sent to a server?",
            a: "No. Conversion happens locally on your device.",
          },
        ]}
      />
    </>
  );
}
