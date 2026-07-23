import { useMemo, useState } from "react";
import { Database, Copy, Check, Plus, Trash2 } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function createColumn() {
  return { id: crypto.randomUUID(), name: "", type: "VARCHAR(255)", pk: false, nullable: true };
}

function createTable() {
  return {
    id: crypto.randomUUID(),
    name: "",
    columns: [createColumn()],
  };
}

function toSqlIdent(name, fallback = "col") {
  const cleaned = String(name ?? "")
    .trim()
    .replace(/[^A-Za-z0-9_]/g, "_");
  if (!cleaned) return fallback;
  if (/^\d/.test(cleaned)) return `${fallback}_${cleaned}`;
  return cleaned;
}

function buildCreateTableSql(tables) {
  const statements = [];

  tables.forEach((table, tableIndex) => {
    const tableName = toSqlIdent(table.name || `table_${tableIndex + 1}`, `table_${tableIndex + 1}`);
    const cols = table.columns
      .filter((col) => col.name.trim() || col.type.trim())
      .map((col, colIndex) => {
        const colName = toSqlIdent(col.name || `column_${colIndex + 1}`, `column_${colIndex + 1}`);
        const type = (col.type || "VARCHAR(255)").trim();
        const parts = [`  ${colName} ${type}`];
        if (col.pk) parts.push("PRIMARY KEY");
        if (!col.nullable && !col.pk) parts.push("NOT NULL");
        return parts.join(" ");
      });

    if (cols.length === 0) return;

    statements.push(`CREATE TABLE ${tableName} (\n${cols.join(",\n")}\n);`);
  });

  return statements.join("\n\n");
}

export default function DatabaseSchemaDesigner() {
  const [tables, setTables] = useState([createTable()]);
  const [copied, setCopied] = useState(false);

  const { sql, error } = useMemo(() => {
    try {
      const output = buildCreateTableSql(tables);
      return { sql: output, error: "" };
    } catch (err) {
      return { sql: "", error: err.message || "Could not build SQL." };
    }
  }, [tables]);

  const updateTable = (tableId, patch) => {
    setTables((prev) => prev.map((t) => (t.id === tableId ? { ...t, ...patch } : t)));
  };

  const updateColumn = (tableId, columnId, patch) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          columns: t.columns.map((c) => (c.id === columnId ? { ...c, ...patch } : c)),
        };
      })
    );
  };

  const addTable = () => setTables((prev) => [...prev, createTable()]);

  const removeTable = (tableId) => {
    setTables((prev) => (prev.length <= 1 ? prev : prev.filter((t) => t.id !== tableId)));
  };

  const addColumn = (tableId) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, columns: [...t.columns, createColumn()] } : t))
    );
  };

  const removeColumn = (tableId, columnId) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        if (t.columns.length <= 1) return t;
        return { ...t, columns: t.columns.filter((c) => c.id !== columnId) };
      })
    );
  };

  const handleCopy = async () => {
    if (!sql) return;
    await navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="databaseSchemaDesigner" />

      <ToolHeroShell
        icon={Database}
        title="Database Schema Designer"
        subtitle="Add tables and columns (name:type:pk/nullable), then export CREATE TABLE SQL you can copy."
        category="developer-tools"
        layout="stack"
        formLabel="Design schema"
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--ftp-ink-soft)]">Tables</p>
          <button type="button" onClick={addTable} className="age-btn-ghost inline-flex items-center gap-1 px-3 py-1.5 text-xs">
            <Plus className="h-3.5 w-3.5" />
            Add table
          </button>
        </div>

        <div className="space-y-6">
          {tables.map((table, tableIndex) => (
            <div
              key={table.id}
              className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/40 p-4"
            >
              <div className="mb-3 flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                  <label
                    htmlFor={`table-name-${table.id}`}
                    className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]"
                  >
                    Table {tableIndex + 1} name
                  </label>
                  <input
                    id={`table-name-${table.id}`}
                    value={table.name}
                    onChange={(e) => updateTable(table.id, { name: e.target.value })}
                    placeholder="users"
                    className={inputDark}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTable(table.id)}
                  disabled={tables.length <= 1}
                  className="age-btn-ghost px-3 py-2 text-xs"
                  title="Remove table"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2">
                {table.columns.map((col) => (
                  <div key={col.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto_auto] sm:items-center">
                    <input
                      value={col.name}
                      onChange={(e) => updateColumn(table.id, col.id, { name: e.target.value })}
                      placeholder="column_name"
                      className={inputDark}
                      aria-label="Column name"
                    />
                    <input
                      value={col.type}
                      onChange={(e) => updateColumn(table.id, col.id, { type: e.target.value })}
                      placeholder="VARCHAR(255)"
                      className={inputDark}
                      aria-label="Column type"
                    />
                    <select
                      value={col.pk ? "pk" : "no"}
                      onChange={(e) =>
                        updateColumn(table.id, col.id, {
                          pk: e.target.value === "pk",
                          nullable: e.target.value === "pk" ? false : col.nullable,
                        })
                      }
                      className={selectDark}
                      aria-label="Primary key"
                    >
                      <option value="no">Not PK</option>
                      <option value="pk">PK</option>
                    </select>
                    <select
                      value={col.nullable ? "nullable" : "not_null"}
                      onChange={(e) =>
                        updateColumn(table.id, col.id, { nullable: e.target.value === "nullable" })
                      }
                      className={selectDark}
                      aria-label="Nullable"
                      disabled={col.pk}
                    >
                      <option value="nullable">Nullable</option>
                      <option value="not_null">NOT NULL</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => removeColumn(table.id, col.id)}
                      disabled={table.columns.length <= 1}
                      className="age-btn-ghost px-3 py-2 text-xs"
                      title="Remove column"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addColumn(table.id)}
                className="age-btn-ghost mt-3 inline-flex items-center gap-1 px-3 py-1.5 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add column
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="sql-output" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              CREATE TABLE SQL
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
            rows={12}
            value={sql}
            placeholder="CREATE TABLE statements will appear here..."
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
        currentToolPath="/developer-tools/database-schema-designer"
        faqs={[
          { q: "Is this Database Schema Designer free?", a: "Yes—design schemas and export SQL with no account." },
          {
            q: "What does PK / nullable mean?",
            a: "PK marks a primary key column. Nullable controls whether NOT NULL is emitted (PK columns are treated as NOT NULL).",
          },
          {
            q: "Which databases accept the SQL?",
            a: "Generic CREATE TABLE syntax works with PostgreSQL, MySQL, SQLite, and similar engines with minor tweaks.",
          },
        ]}
      />
    </>
  );
}
