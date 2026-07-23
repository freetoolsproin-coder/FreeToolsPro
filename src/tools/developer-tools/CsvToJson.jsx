import { useMemo, useState } from "react";
import { FileJson, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function parseCsvRow(row) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i += 1) {
    const char = row[i];
    const next = row[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsv(text) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) return { headers: [], rows: [] };

  const rows = lines.map(parseCsvRow);
  const headers = rows[0];
  const dataRows = rows.slice(1);

  return { headers, rows: dataRows };
}

function csvToJson(text) {
  const { headers, rows } = parseCsv(text);

  if (headers.length === 0) {
    return JSON.stringify([], null, 2);
  }

  const objects = rows.map((row) => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header || `column_${index + 1}`] = row[index] ?? "";
    });
    return obj;
  });

  return JSON.stringify(objects, null, 2);
}

export default function CsvToJson() {
  const [csv, setCsv] = useState("");
  const [copied, setCopied] = useState(false);

  const { json, error } = useMemo(() => {
    if (!csv.trim()) {
      return { json: "", error: "" };
    }
    try {
      return { json: csvToJson(csv), error: "" };
    } catch (err) {
      return { json: "", error: err.message || "Could not parse CSV." };
    }
  }, [csv]);

  const handleCopy = async () => {
    if (!json) return;
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="csvToJson" />

      <ToolHeroShell
        icon={FileJson}
        title="CSV to JSON Converter"
        subtitle="Paste CSV data and convert it to JSON with quoted-field support. Copy the result instantly."
        category="developer-tools"
        layout="stack"
        formLabel="Convert CSV"
      >
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
              <label htmlFor="json-output" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                JSON output
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!json}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy JSON"}
              </button>
            </div>
            <textarea
              id="json-output"
              readOnly
              rows={14}
              value={json}
              placeholder="JSON will appear here..."
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
        currentToolPath="/developer-tools/csv-to-json"
      />
    </>
  );
}
