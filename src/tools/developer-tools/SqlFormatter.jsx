import { useMemo, useState } from "react";
import { Braces, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { beautifySql, formatSql } from "../../utils/sqlUtils";

export default function SqlFormatter() {
  const [sql, setSql] = useState("");
  const [extraSpacing, setExtraSpacing] = useState(false);
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!sql.trim()) return { output: "", error: "" };
    try {
      return {
        output: extraSpacing ? beautifySql(sql) : formatSql(sql),
        error: "",
      };
    } catch (err) {
      return { output: "", error: err.message || "Could not format SQL." };
    }
  }, [sql, extraSpacing]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="sqlFormatter" />

      <ToolHeroShell
        icon={Braces}
        title="SQL Formatter"
        subtitle="Paste messy SQL and format it with uppercase keywords, readable clause breaks, and optional extra spacing."
        category="developer-tools"
        layout="stack"
        formLabel="Format SQL"
      >
        <label className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--ftp-ink)]">
          <input
            type="checkbox"
            checked={extraSpacing}
            onChange={(e) => setExtraSpacing(e.target.checked)}
          />
          Extra spacing between statements (beautify)
        </label>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="sql-fmt-in" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              SQL input
            </label>
            <textarea
              id="sql-fmt-in"
              rows={14}
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder={"select id, name from users where active = 1 order by name;"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="sql-fmt-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Formatted SQL
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
              id="sql-fmt-out"
              readOnly
              rows={14}
              value={output}
              placeholder="Formatted SQL will appear here..."
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
        currentToolPath="/developer-tools/sql-formatter"
        faqs={[
          { q: "Is this SQL Formatter free?", a: "Yes. Format SQL in your browser with no signup." },
          {
            q: "Does it change query meaning?",
            a: "No. It uppercases keywords and adds line breaks for readability without changing logic.",
          },
          {
            q: "What does extra spacing do?",
            a: "It adds blank lines before top-level statements (the old SQL Beautifier behavior). The /sql-beautifier URL redirects here.",
          },
          {
            q: "Is my SQL uploaded?",
            a: "No. Formatting runs entirely on your device.",
          },
        ]}
      />
    </>
  );
}
