import { useMemo, useState } from "react";
import { FileJson, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { sqlToJson } from "../../utils/sqlUtils";

export default function SqlToJson() {
  const [sql, setSql] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!sql.trim()) return { output: "", error: "" };
    try {
      const data = sqlToJson(sql);
      return { output: JSON.stringify(data, null, 2), error: "" };
    } catch (err) {
      return { output: "", error: err.message || "Could not convert SQL to JSON." };
    }
  }, [sql]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="sqlToJson" />

      <ToolHeroShell
        icon={FileJson}
        title="SQL to JSON"
        subtitle="Convert INSERT VALUES or SELECT statements into structured JSON for inspection."
        category="developer-tools"
        layout="stack"
        formLabel="Convert SQL"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="sql-json-in" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              SQL input
            </label>
            <textarea
              id="sql-json-in"
              rows={14}
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder={"INSERT INTO users (id, name) VALUES (1, 'Ada'), (2, 'Grace');"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="sql-json-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                JSON output
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
              id="sql-json-out"
              readOnly
              rows={14}
              value={output}
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
        currentToolPath="/developer-tools/sql-to-json"
        faqs={[
          { q: "Is this SQL to JSON converter free?", a: "Yes. Convert SQL to JSON with no signup." },
          {
            q: "What SQL is supported?",
            a: "Best with INSERT INTO … VALUES and simple SELECT … FROM statements; others fall back to tokens.",
          },
          {
            q: "Is my SQL uploaded?",
            a: "No. Conversion runs entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
