import { useMemo, useState } from "react";
import { Scissors, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { splitCsv } from "../../utils/csvUtils";

export default function CsvSplitter() {
  const [csv, setCsv] = useState("");
  const [chunkSize, setChunkSize] = useState("100");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const { parts, error } = useMemo(() => {
    if (!csv.trim()) {
      return { parts: [], error: "" };
    }
    try {
      const size = Number(chunkSize);
      return { parts: splitCsv(csv, size), error: "" };
    } catch (err) {
      return { parts: [], error: err.message || "Could not split CSV." };
    }
  }, [csv, chunkSize]);

  const handleCopy = async (text, index) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <Seo page="csvSplitter" />

      <ToolHeroShell
        icon={Scissors}
        title="CSV Splitter"
        subtitle="Paste CSV and split it into chunks of N data rows. Each part keeps the same header row."
        category="developer-tools"
        layout="stack"
        formLabel="Split CSV"
      >
        <div className="mb-4">
          <label htmlFor="chunk-size" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
            Rows per chunk
          </label>
          <input
            id="chunk-size"
            type="number"
            min={1}
            value={chunkSize}
            onChange={(e) => setChunkSize(e.target.value)}
            placeholder="100"
            className={inputDark}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="csv-input" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
            CSV input
          </label>
          <textarea
            id="csv-input"
            rows={10}
            value={csv}
            onChange={(e) => setCsv(e.target.value)}
            placeholder={'name,email,role\n"Jane Doe",jane@example.com,"Product Lead"\nJohn Smith,john@example.com,Engineer'}
            className={textareaDark}
          />
        </div>

        {parts.length > 0 ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--ftp-ink-soft)]">
              {parts.length} part{parts.length === 1 ? "" : "s"}
            </p>
            {parts.map((part, index) => (
              <div key={index}>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor={`csv-part-${index}`}
                    className="text-sm font-medium text-[var(--ftp-ink-soft)]"
                  >
                    Part {index + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleCopy(part, index)}
                    className="age-btn-ghost px-3 py-1.5 text-xs"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copiedIndex === index ? "Copied" : "Copy"}
                  </button>
                </div>
                <textarea
                  id={`csv-part-${index}`}
                  readOnly
                  rows={6}
                  value={part}
                  className={textareaDark}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--ftp-ink-soft)]">Split parts will appear here...</p>
        )}

        {error ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            {error}
          </p>
        ) : null}
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/csv-splitter"
        faqs={[
          { q: "Is this CSV Splitter free?", a: "Yes—split large CSV files with no account." },
          {
            q: "Does each part include headers?",
            a: "Yes. Every chunk starts with the same header row as the original file.",
          },
          {
            q: "What chunk sizes work?",
            a: "Any positive integer. Use smaller sizes for upload limits or batch imports.",
          },
        ]}
      />
    </>
  );
}
