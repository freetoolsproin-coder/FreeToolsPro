import { useMemo, useState } from "react";
import { Table2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { buildSelectQuery } from "../../utils/sqlUtils";

export default function SqlQueryBuilder() {
  const [table, setTable] = useState("");
  const [columns, setColumns] = useState("");
  const [where, setWhere] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [limit, setLimit] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!table.trim()) return { output: "", error: "" };
    try {
      const cols = columns
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const sql = buildSelectQuery({
        table,
        columns: cols.length ? cols : "*",
        where,
        orderBy,
        limit: limit.trim() === "" ? undefined : limit,
      });
      return { output: sql, error: "" };
    } catch (err) {
      return { output: "", error: err.message || "Could not build query." };
    }
  }, [table, columns, where, orderBy, limit]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="sqlQueryBuilder" />

      <ToolHeroShell
        icon={Table2}
        title="SQL Query Builder"
        subtitle="Build a SELECT query from table, columns, WHERE, ORDER BY, and LIMIT fields."
        category="developer-tools"
        layout="stack"
        formLabel="Build query"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="qb-table" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Table
            </label>
            <input
              id="qb-table"
              type="text"
              value={table}
              onChange={(e) => setTable(e.target.value)}
              placeholder="users"
              className={inputDark}
            />
          </div>
          <div>
            <label htmlFor="qb-cols" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Columns (comma-separated)
            </label>
            <input
              id="qb-cols"
              type="text"
              value={columns}
              onChange={(e) => setColumns(e.target.value)}
              placeholder="id, name, email"
              className={inputDark}
            />
          </div>
          <div>
            <label htmlFor="qb-where" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              WHERE
            </label>
            <input
              id="qb-where"
              type="text"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="active = 1"
              className={inputDark}
            />
          </div>
          <div>
            <label htmlFor="qb-order" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              ORDER BY
            </label>
            <input
              id="qb-order"
              type="text"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              placeholder="name ASC"
              className={inputDark}
            />
          </div>
          <div>
            <label htmlFor="qb-limit" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              LIMIT
            </label>
            <input
              id="qb-limit"
              type="text"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="50"
              className={inputDark}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="qb-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              Generated SQL
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
            id="qb-out"
            readOnly
            rows={10}
            value={output}
            placeholder="SELECT query will appear here..."
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
        currentToolPath="/developer-tools/sql-query-builder"
        faqs={[
          { q: "Is this SQL Query Builder free?", a: "Yes. Build SELECT statements with no account." },
          {
            q: "What if I leave columns blank?",
            a: "Blank columns default to SELECT * from your table.",
          },
          {
            q: "Is my input uploaded?",
            a: "No. Queries are built entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
