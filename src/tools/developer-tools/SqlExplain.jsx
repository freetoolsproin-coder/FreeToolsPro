import { useMemo, useState } from "react";
import { MessageSquareText, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { explainSql } from "../../utils/sqlUtils";

export default function SqlExplain() {
  const [sql, setSql] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!sql.trim()) return { output: "", error: "" };
    try {
      return { output: explainSql(sql), error: "" };
    } catch (err) {
      return { output: "", error: err.message || "Could not explain SQL." };
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
      <Seo page="sqlExplain" />

      <ToolHeroShell
        icon={MessageSquareText}
        title="SQL Explain"
        subtitle="Get a plain-language explanation of SELECT, JOIN, WHERE, ORDER BY, and other clauses."
        category="developer-tools"
        layout="stack"
        formLabel="Explain SQL"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="sql-exp-in" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              SQL input
            </label>
            <textarea
              id="sql-exp-in"
              rows={14}
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder={
                "SELECT u.name, COUNT(o.id)\nFROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE u.active = 1\nGROUP BY u.name\nORDER BY 2 DESC\nLIMIT 10;"
              }
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="sql-exp-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Explanation
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
              id="sql-exp-out"
              readOnly
              rows={14}
              value={output}
              placeholder="Explanation will appear here..."
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
        currentToolPath="/developer-tools/sql-explain"
        faqs={[
          { q: "Is this SQL Explain tool free?", a: "Yes. Explain SQL clauses with no signup." },
          {
            q: "Does this run EXPLAIN on a database?",
            a: "No. It produces a plain-language summary of detected clauses in your browser.",
          },
          {
            q: "Is my SQL uploaded?",
            a: "No. Explanations are generated entirely on your device.",
          },
        ]}
      />
    </>
  );
}
