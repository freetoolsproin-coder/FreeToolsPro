import { useMemo, useState } from "react";
import { Table2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { parseCsv } from "../../utils/csvUtils";

export default function CsvViewer() {
  const [csv, setCsv] = useState("");
  const [copied, setCopied] = useState(false);

  const { headers, rows, error } = useMemo(() => {
    if (!csv.trim()) {
      return { headers: [], rows: [], error: "" };
    }
    try {
      const parsed = parseCsv(csv);
      return { headers: parsed.headers, rows: parsed.rows, error: "" };
    } catch (err) {
      return { headers: [], rows: [], error: err.message || "Could not parse CSV." };
    }
  }, [csv]);

  const handleCopy = async () => {
    if (!csv.trim()) return;
    await navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="csvViewer" />

      <ToolHeroShell
        icon={Table2}
        title="CSV Viewer"
        subtitle="Paste CSV and preview it as a table with quoted-field support. Inspect headers and rows instantly."
        category="developer-tools"
        layout="stack"
        formLabel="View CSV"
      >
        <div className="mb-4">
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="csv-input" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              CSV input
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!csv.trim()}
              className="age-btn-ghost px-3 py-1.5 text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy CSV"}
            </button>
          </div>
          <textarea
            id="csv-input"
            rows={8}
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder={'name,email,role\n"Jane Doe",jane@example.com,"Product Lead"\nJohn Smith,john@example.com,Engineer'}
            className={textareaDark}
          />
        </div>

        {headers.length > 0 ? (
          <div className="overflow-x-auto rounded-[14px] border border-[var(--ftp-line)]">
            <table className="min-w-full text-left text-sm text-[var(--ftp-ink)]">
              <thead className="bg-[var(--ftp-porcelain)]">
                <tr>
                  {headers.map((header, index) => (
                    <th key={`${header}-${index}`} className="whitespace-nowrap px-3 py-2 font-semibold">
                      {header || `column_${index + 1}`}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-t border-[var(--ftp-line)]">
                    {headers.map((_, colIndex) => (
                      <td key={colIndex} className="whitespace-nowrap px-3 py-2">
                        {row[colIndex] ?? ""}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="border-t border-[var(--ftp-line)] px-3 py-2 text-xs text-[var(--ftp-ink-soft)]">
              {rows.length} row{rows.length === 1 ? "" : "s"} · {headers.length} column
              {headers.length === 1 ? "" : "s"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[var(--ftp-ink-soft)]">Table preview will appear here...</p>
        )}

        {error ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {error}
          </p>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/csv-viewer"
        faqs={[
          { q: "Is this CSV Viewer free?", a: "Yes—preview CSV tables with no account." },
          {
            q: "Are quoted fields supported?",
            a: "Yes. Commas and newlines inside quotes are handled correctly.",
          },
          {
            q: "Is my CSV uploaded?",
            a: "No. Parsing and rendering happen entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
