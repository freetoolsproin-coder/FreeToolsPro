import { useMemo, useState } from "react";
import { Minimize2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { minifySql } from "../../utils/sqlUtils";

export default function SqlMinifier() {
  const [sql, setSql] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!sql.trim()) return { output: "", error: "" };
    try {
      return { output: minifySql(sql), error: "" };
    } catch (err) {
      return { output: "", error: err.message || "Could not minify SQL." };
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
      <Seo page="sqlMinifier" />

      <ToolHeroShell
        icon={Minimize2}
        title="SQL Minifier"
        subtitle="Strip comments and collapse whitespace to shrink SQL for compact storage or logs."
        category="developer-tools"
        layout="stack"
        formLabel="Minify SQL"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="sql-min-in" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              SQL input
            </label>
            <textarea
              id="sql-min-in"
              rows={14}
              value={sql}
              onChange={(e) => setSql(e.target.value)}
              placeholder={"SELECT id, name\nFROM users -- active only\nWHERE active = 1;"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="sql-min-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Minified SQL
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
              id="sql-min-out"
              readOnly
              rows={14}
              value={output}
              placeholder="Minified SQL will appear here..."
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
        currentToolPath="/developer-tools/sql-minifier"
        faqs={[
          { q: "Is this SQL Minifier free?", a: "Yes. Minify SQL instantly with no account." },
          {
            q: "Are comments removed?",
            a: "Yes. Line (--) and block (/* */) comments are stripped, and whitespace is collapsed.",
          },
          {
            q: "Is my SQL uploaded?",
            a: "No. Minification runs entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
