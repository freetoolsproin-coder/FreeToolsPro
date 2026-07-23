import { useMemo, useState } from "react";
import { FileCheck2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { validateYaml, stringifyYaml } from "../../utils/yamlUtils";

export default function YamlValidator() {
  const [yaml, setYaml] = useState("");
  const [copied, setCopied] = useState(false);

  const { valid, error, preview } = useMemo(() => {
    if (!yaml.trim()) {
      return { valid: null, error: "", preview: "" };
    }
    const result = validateYaml(yaml);
    if (!result.valid) {
      return { valid: false, error: result.error || "Invalid YAML.", preview: "" };
    }
    try {
      return {
        valid: true,
        error: "",
        preview: stringifyYaml(result.data),
      };
    } catch (err) {
      return { valid: true, error: "", preview: String(result.data) };
    }
  }, [yaml]);

  const handleCopy = async () => {
    if (!preview) return;
    await navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="yamlValidator" />

      <ToolHeroShell
        icon={FileCheck2}
        title="YAML Validator"
        subtitle="Paste YAML and validate syntax instantly. See a normalized preview when the document is valid."
        category="developer-tools"
        layout="stack"
        formLabel="Validate YAML"
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
              placeholder={"name: Jane\nage: 30\nroles:\n  - admin\n  - editor"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="yaml-preview" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Normalized preview
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!preview}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="yaml-preview"
              readOnly
              rows={14}
              value={preview}
              placeholder="Valid YAML preview will appear here..."
              className={textareaDark}
            />
          </div>
        </div>

        {valid === true ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            Valid YAML.
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {error}
          </p>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/yaml-validator"
        faqs={[
          { q: "Is this YAML Validator free?", a: "Yes—validate unlimited YAML documents with no account." },
          {
            q: "Is my YAML uploaded to a server?",
            a: "No. Validation runs entirely in your browser.",
          },
          {
            q: "What does the preview show?",
            a: "When valid, your YAML is re-serialized for a consistent, readable format.",
          },
        ]}
      />
    </>
  );
}
