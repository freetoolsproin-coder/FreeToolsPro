import { useMemo, useState } from "react";
import { Download, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function JsonToExcel() {
  const [json, setJson] = useState("");
  const [sheetName, setSheetName] = useState("Sheet1");
  const [fileName, setFileName] = useState("data.xlsx");
  const [downloadError, setDownloadError] = useState("");

  const { parsed, error } = useMemo(() => {
    if (!json.trim()) {
      return { parsed: null, error: "" };
    }
    try {
      const data = JSON.parse(json);
      if (!Array.isArray(data)) {
        return { parsed: null, error: "JSON must be an array of objects." };
      }
      return { parsed: data, error: "" };
    } catch (err) {
      return { parsed: null, error: err.message || "Invalid JSON." };
    }
  }, [json]);

  const displayError = downloadError || error;

  const handleDownload = () => {
    setDownloadError("");
    if (!parsed || parsed.length === 0) {
      setDownloadError(parsed ? "Array is empty—nothing to export." : error || "Provide valid JSON first.");
      return;
    }
    try {
      const ws = XLSX.utils.json_to_sheet(parsed);
      const wb = XLSX.utils.book_new();
      const name = (sheetName.trim() || "Sheet1").slice(0, 31);
      XLSX.utils.book_append_sheet(wb, ws, name);
      const outName = fileName.trim().endsWith(".xlsx")
        ? fileName.trim()
        : `${fileName.trim() || "data"}.xlsx`;
      XLSX.writeFile(wb, outName);
    } catch (err) {
      setDownloadError(err.message || "Could not create Excel file.");
    }
  };

  return (
    <>
      <Seo page="jsonToExcel" />

      <ToolHeroShell
        icon={FileSpreadsheet}
        title="JSON to Excel Converter"
        subtitle="Paste an array of JSON objects and download an .xlsx spreadsheet. Choose sheet and file names."
        category="developer-tools"
        layout="stack"
        formLabel="Export Excel"
      >
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sheet-name" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Sheet name
            </label>
            <input
              id="sheet-name"
              type="text"
              value={sheetName}
              onChange={(e) => setSheetName(e.target.value)}
              placeholder="Sheet1"
              className={inputDark}
            />
          </div>
          <div>
            <label htmlFor="file-name" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              File name
            </label>
            <input
              id="file-name"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="data.xlsx"
              className={inputDark}
            />
          </div>
        </div>

        <div>
          <label htmlFor="json-input" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
            JSON input (array of objects)
          </label>
          <textarea
            id="json-input"
            rows={14}
            value={json}
            onChange={(e) => {
              setDownloadError("");
              setJson(e.target.value);
            }}
            placeholder={'[\n  { "name": "Jane", "email": "jane@example.com" },\n  { "name": "John", "email": "john@example.com" }\n]'}
            className={textareaDark}
          />
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!parsed || parsed.length === 0}
            className="age-btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
          >
            <Download className="h-4 w-4" />
            Download .xlsx
          </button>
        </div>

        {displayError ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {displayError}
          </p>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/json-to-excel"
        faqs={[
          { q: "Is this JSON to Excel converter free?", a: "Yes—download spreadsheets with no account." },
          {
            q: "What JSON shape is required?",
            a: "An array of objects. Keys become column headers; each object becomes a row.",
          },
          {
            q: "Does conversion leave my device?",
            a: "No. The .xlsx file is built in your browser with the xlsx library.",
          },
        ]}
      />
    </>
  );
}
