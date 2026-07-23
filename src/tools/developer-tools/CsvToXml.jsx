import { useMemo, useState } from "react";
import { FileCode, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { csvToXml } from "../../utils/csvUtils";

export default function CsvToXml() {
  const [csv, setCsv] = useState("");
  const [copied, setCopied] = useState(false);

  const { xml, error } = useMemo(() => {
    if (!csv.trim()) {
      return { xml: "", error: "" };
    }
    try {
      return { xml: csvToXml(csv), error: "" };
    } catch (err) {
      return { xml: "", error: err.message || "Could not convert CSV to XML." };
    }
  }, [csv]);

  const handleCopy = async () => {
    if (!xml) return;
    await navigator.clipboard.writeText(xml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="csvToXml" />

      <ToolHeroShell
        icon={FileCode}
        title="CSV to XML Converter"
        subtitle="Paste CSV data and convert it to a simple XML document. Copy the result instantly."
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
              <label htmlFor="xml-output" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                XML output
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!xml}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy XML"}
              </button>
            </div>
            <textarea
              id="xml-output"
              readOnly
              rows={14}
              value={xml}
              placeholder="XML will appear here..."
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
        currentToolPath="/developer-tools/csv-to-xml"
        faqs={[
          { q: "Is this CSV to XML converter free?", a: "Yes—convert unlimited CSV files locally." },
          {
            q: "How are columns mapped?",
            a: "The first row becomes element names; each following row becomes a <row> with child fields.",
          },
          {
            q: "Are special characters escaped?",
            a: "Yes. &, &lt;, &gt;, quotes, and apostrophes are escaped for valid XML.",
          },
        ]}
      />
    </>
  );
}
