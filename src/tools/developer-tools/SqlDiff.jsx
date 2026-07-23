import { useMemo, useState } from "react";
import { GitCompare, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { diffSql } from "../../utils/sqlUtils";

export default function SqlDiff() {
  const [sqlA, setSqlA] = useState("");
  const [sqlB, setSqlB] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!sqlA.trim() && !sqlB.trim()) return { output: "", error: "" };
    try {
      return { output: diffSql(sqlA, sqlB), error: "" };
    } catch (err) {
      return { output: "", error: err.message || "Could not diff SQL." };
    }
  }, [sqlA, sqlB]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="sqlDiff" />

      <ToolHeroShell
        icon={GitCompare}
        title="SQL Diff"
        subtitle="Compare two SQL snippets line-by-line after formatting. Lines marked − / + show changes."
        category="developer-tools"
        layout="stack"
        formLabel="Diff SQL"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="sql-diff-a" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              SQL A (original)
            </label>
            <textarea
              id="sql-diff-a"
              rows={12}
              value={sqlA}
              onChange={(e) => setSqlA(e.target.value)}
              placeholder={"SELECT id, name FROM users WHERE active = 1;"}
              className={textareaDark}
            />
          </div>
          <div>
            <label htmlFor="sql-diff-b" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              SQL B (updated)
            </label>
            <textarea
              id="sql-diff-b"
              rows={12}
              value={sqlB}
              onChange={(e) => setSqlB(e.target.value)}
              placeholder={"SELECT id, name, email FROM users WHERE active = 1 ORDER BY name;"}
              className={textareaDark}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="sql-diff-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              Diff output
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
            id="sql-diff-out"
            readOnly
            rows={12}
            value={output}
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
        currentToolPath="/developer-tools/sql-diff"
        faqs={[
          { q: "Is this SQL Diff tool free?", a: "Yes. Compare SQL snippets with no signup." },
          {
            q: "How are differences shown?",
            a: "Both sides are formatted first, then compared line-by-line with − (removed) and + (added).",
          },
          {
            q: "Is my SQL uploaded?",
            a: "No. Diffing runs entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
