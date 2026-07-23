import { useMemo, useState } from "react";
import { FileSpreadsheet, Copy, Check } from "lucide-react";
import * as XLSX from "xlsx";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function ExcelToJson() {
  const [json, setJson] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError("");
    setJson("");

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        setError("No sheets found in this workbook.");
        return;
      }
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setJson(JSON.stringify(rows, null, 2));
    } catch (err) {
      setError(err.message || "Could not read Excel file.");
      setJson("");
    }
  };

  const handleCopy = async () => {
    if (!json) return;
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const status = useMemo(() => {
    if (!fileName) return "";
    return `Loaded: ${fileName}`;
  }, [fileName]);

  return (
    <>
      <Seo page="excelToJson" />

      <ToolHeroShell
        icon={FileSpreadsheet}
        title="Excel to JSON Converter"
        subtitle="Upload an .xlsx or .xls file and convert the first sheet to JSON. Copy the result instantly."
        category="developer-tools"
        layout="stack"
        formLabel="Convert Excel"
      >
        <div className="mb-4">
          <label htmlFor="excel-file" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
            Excel file
          </label>
          <input
            id="excel-file"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFile}
            className="block w-full text-sm text-[var(--ftp-ink-soft)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--ftp-porcelain)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--ftp-ink)]"
          />
          {status ? (
            <p className="mt-2 text-xs text-[var(--ftp-ink-soft)]">{status}</p>
          ) : null}
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
            rows={16}
            value={json}
            placeholder="JSON will appear here after you upload a file..."
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
        currentToolPath="/developer-tools/excel-to-json"
        faqs={[
          { q: "Is this Excel to JSON converter free?", a: "Yes—convert spreadsheets with no account." },
          {
            q: "Which sheet is converted?",
            a: "The first sheet in the workbook is converted to an array of row objects.",
          },
          {
            q: "Is my file uploaded to a server?",
            a: "No. The file is read and converted entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
