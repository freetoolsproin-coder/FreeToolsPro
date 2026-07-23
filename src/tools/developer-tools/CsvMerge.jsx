import { useMemo, useState } from "react";
import { Merge, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { mergeCsv } from "../../utils/csvUtils";

export default function CsvMerge() {
  const [csvA, setCsvA] = useState("");
  const [csvB, setCsvB] = useState("");
  const [copied, setCopied] = useState(false);

  const { merged, error } = useMemo(() => {
    if (!csvA.trim() && !csvB.trim()) {
      return { merged: "", error: "" };
    }
    try {
      return { merged: mergeCsv(csvA, csvB), error: "" };
    } catch (err) {
      return { merged: "", error: err.message || "Could not merge CSV." };
    }
  }, [csvA, csvB]);

  const handleCopy = async () => {
    if (!merged) return;
    await navigator.clipboard.writeText(merged);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="csvMerge" />

      <ToolHeroShell
        icon={Merge}
        title="CSV Merge"
        subtitle="Paste two CSV datasets and merge them by union of headers. Rows from A come first, then B."
        category="developer-tools"
        layout="stack"
        formLabel="Merge CSV"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="csv-a" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              CSV A
            </label>
            <textarea
              id="csv-a"
              rows={10}
              value={csvA}
              onChange={(e) => setCsvA(e.target.value)}
              placeholder={"name,email\nJane,jane@example.com"}
              className={textareaDark}
            />
          </div>
          <div>
            <label htmlFor="csv-b" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              CSV B
            </label>
            <textarea
              id="csv-b"
              rows={10}
              value={csvB}
              onChange={(e) => setCsvB(e.target.value)}
              placeholder={"name,role\nJohn,Engineer"}
              className={textareaDark}
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="csv-merged" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              Merged CSV
            </label>
            <button
              type="button"
              onClick={handleCopy}
              disabled={!merged}
              className="age-btn-ghost px-3 py-1.5 text-xs"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy CSV"}
            </button>
          </div>
          <textarea
            id="csv-merged"
            readOnly
            rows={10}
            value={merged}
            placeholder="Merged CSV will appear here..."
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
        currentToolPath="/developer-tools/csv-merge"
        faqs={[
          { q: "Is this CSV Merge tool free?", a: "Yes—merge datasets with no account." },
          {
            q: "How are different columns handled?",
            a: "Headers are unioned. Missing values in either file become empty cells.",
          },
          {
            q: "Does row order matter?",
            a: "Yes. All rows from CSV A appear first, followed by rows from CSV B.",
          },
        ]}
      />
    </>
  );
}
