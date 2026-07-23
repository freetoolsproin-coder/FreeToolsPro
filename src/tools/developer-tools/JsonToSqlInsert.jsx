import { useMemo, useState } from "react";
import { Database, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { jsonToSqlInsert } from "../../utils/sqlUtils";

export default function JsonToSqlInsert() {
  const [json, setJson] = useState("");
  const [tableName, setTableName] = useState("data");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    if (!json.trim()) return { output: "", error: "" };
    try {
      return { output: jsonToSqlInsert(json, tableName || "data"), error: "" };
    } catch (err) {
      return { output: "", error: err.message || "Could not convert JSON to SQL." };
    }
  }, [json, tableName]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="jsonToSqlInsert" />

      <ToolHeroShell
        icon={Database}
        title="JSON to SQL INSERT"
        subtitle="Turn a JSON array or object into INSERT INTO statements for a named table."
        category="developer-tools"
        layout="stack"
        formLabel="Convert JSON"
      >
        <div className="mb-4">
          <label htmlFor="json-sql-table" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
            Table name
          </label>
          <input
            id="json-sql-table"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            placeholder="users"
            className={inputDark}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="json-sql-in" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              JSON input
            </label>
            <textarea
              id="json-sql-in"
              rows={14}
              value={json}
              onChange={(e) => setJson(e.target.value)}
              placeholder={'[\n  {"id": 1, "name": "Ada"},\n  {"id": 2, "name": "Grace"}\n]'}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="json-sql-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                SQL INSERT
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
              id="json-sql-out"
              readOnly
              rows={14}
              value={output}
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
        currentToolPath="/developer-tools/json-to-sql-insert"
        faqs={[
          { q: "Is this JSON to SQL INSERT tool free?", a: "Yes. Generate INSERT statements with no signup." },
          {
            q: "What JSON shape works best?",
            a: "An array of objects with shared keys becomes columned INSERT statements.",
          },
          {
            q: "Is my data uploaded?",
            a: "No. Conversion runs entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
