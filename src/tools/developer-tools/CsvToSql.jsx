import { useMemo, useState } from "react";
import { Database, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { csvToSql } from "../../utils/csvUtils";

export default function CsvToSql() {
  const [csv, setCsv] = useState("");
  const [tableName, setTableName] = useState("data");
  const [copied, setCopied] = useState(false);

  const { sql, error } = useMemo(() => {
    if (!csv.trim()) {
      return { sql: "", error: "" };
    }
    try {
      return { sql: csvToSql(csv, tableName || "data"), error: "" };
    } catch (err) {
      return { sql: "", error: err.message || "Could not convert CSV to SQL." };
    }
  }, [csv, tableName]);

  const handleCopy = async () => {
    if (!sql) return;
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="csvToSql" />

      <ToolHeroShell
        icon={Database}
        title="CSV to SQL Converter"
        subtitle="Paste CSV and generate INSERT statements for a table name you choose. Copy ready-to-run SQL."
        category="developer-tools"
        layout="stack"
        formLabel="Convert CSV"
      >
        <div className="mb-4">
          <label htmlFor="table-name" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
            Table name
          </label>
          <input
            id="table-name"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="data"
            className={inputDark}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="csv-input" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              CSV input
            </label>
            <textarea
              id="csv-input"
              rows={14}
              value={csv}
              onChange={(e) => setCsv(e.target.value)}
              placeholder={'name,email,role\n"Jane Doe",jane@example.com,"Product Lead"\nJohn Smith,john@example.com,Engineer'}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="sql-output" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                SQL output
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!sql}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy SQL"}
              </button>
            </div>
            <textarea
              id="sql-output"
              readOnly
              rows={14}
              value={sql}
              placeholder="INSERT statements will appear here..."
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
        currentToolPath="/developer-tools/csv-to-sql"
        faqs={[
          { q: "Is this CSV to SQL converter free?", a: "Yes—generate INSERT statements with no account." },
          {
            q: "What SQL dialect is used?",
            a: "Generic INSERT INTO syntax that works with most relational databases.",
          },
          {
            q: "How are empty values handled?",
            a: "Empty cells become NULL; numeric-looking values stay unquoted.",
          },
        ]}
      />
    </>
  );
}
