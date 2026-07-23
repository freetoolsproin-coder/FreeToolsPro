import { useMemo, useState } from "react";
import { ShieldCheck, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { validateSql } from "../../utils/sqlUtils";

export default function SqlValidator() {
  const [sql, setSql] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!sql.trim()) return null;
    return validateSql(sql);
  }, [sql]);

  const summary = useMemo(() => {
    if (!result) return "";
    const lines = [
      `Valid: ${result.valid ? "Yes" : "No"}`,
      "",
      result.errors.length ? "Errors:" : "Errors: (none)",
      ...result.errors.map((e) => `• ${e}`),
      "",
      result.warnings.length ? "Warnings:" : "Warnings: (none)",
      ...result.warnings.map((w) => `• ${w}`),
    ];
    return lines.join("\n");
  }, [result]);

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="sqlValidator" />

      <ToolHeroShell
        icon={ShieldCheck}
        title="SQL Validator"
        subtitle="Check SQL for unbalanced quotes, parentheses, missing clauses, and common risks."
        category="developer-tools"
        layout="stack"
        formLabel="Validate SQL"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="sql-val-in" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              SQL input
            </label>
            <textarea
              id="sql-val-in"
              rows={14}
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder={"UPDATE users SET active = 1;"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="sql-val-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Validation result
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!summary}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="sql-val-out"
              readOnly
              rows={14}
              value={summary}
              placeholder="Validation results will appear here..."
              className={textareaDark}
            />
          </div>
        </div>

        {result ? (
          <div className="mt-4 space-y-2">
            <p
              className={`rounded-[14px] border px-3 py-2 text-sm ${
                result.valid
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                  : "border-red-200 bg-red-50 text-red-900"
              }`}
            >
              {result.valid ? "SQL looks valid (heuristic check)." : "SQL has validation errors."}
            </p>
            {result.errors.map((e) => (
              <p
                key={e}
                className="rounded-[14px] border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900"
              >
                Error: {e}
              </p>
            ))}
            {result.warnings.map((w) => (
              <p
                key={w}
                className="rounded-[14px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
              >
                Warning: {w}
              </p>
            ))}
          </div>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/sql-validator"
        faqs={[
          { q: "Is this SQL Validator free?", a: "Yes. Validate SQL heuristics with no signup." },
          {
            q: "Is this a full SQL parser?",
            a: "No. It checks quotes, parentheses, statement keywords, and common risks—not full dialect grammar.",
          },
          {
            q: "Is my SQL uploaded?",
            a: "No. Validation runs entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
