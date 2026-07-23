import { useMemo, useState } from "react";
import { Filter, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function removeDuplicateLines(text, caseInsensitive) {
  const lines = text.split(/\r?\n/);
  const seen = new Set();
  const kept = [];
  let removed = 0;

  for (const line of lines) {
    const key = caseInsensitive ? line.toLowerCase() : line;
    if (seen.has(key)) {
      removed += 1;
      continue;
    }
    seen.add(key);
    kept.push(line);
  }

  return { output: kept.join("\n"), removed, kept: kept.length, total: lines.length };
}

export default function DuplicateLineRemover() {
  const [text, setText] = useState("");
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  const { output, removed, kept, total } = useMemo(
    () => removeDuplicateLines(text, caseInsensitive),
    [text, caseInsensitive]
  );

  const handleCopy = async () => {
    if (!output && text === "") return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="duplicateLineRemover" />

      <ToolHeroShell
        icon={Filter}
        title="Duplicate Line Remover"
        subtitle="Remove duplicate lines while keeping first-seen order. Optionally ignore case."
        category="text-tools"
        layout="stack"
        formLabel="Remove duplicates"
      >
        <label className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--ftp-ink)]">
          <input
            type="checkbox"
            checked={caseInsensitive}
            onChange={(e) => setCaseInsensitive(e.target.checked)}
            className="rounded border-black/20"
          />
          Case-insensitive matching
        </label>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="dup-in" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Input text
            </label>
            <textarea
              id="dup-in"
              rows={14}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"apple\nbanana\napple\nCherry\nbanana"}
              className={textareaDark}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="dup-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Unique lines
              </label>
              <button
                type="button"
                onClick={handleCopy}
                disabled={!text}
                className="age-btn-ghost px-3 py-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <textarea
              id="dup-out"
              readOnly
              rows={14}
              value={text ? output : ""}
              placeholder="Deduplicated text will appear here..."
              className={textareaDark}
            />
          </div>
        </div>

        {text ? (
          <p className="mt-4 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-3 py-2 text-sm text-[var(--ftp-ink)]">
            Removed {removed} duplicate line{removed === 1 ? "" : "s"} — kept {kept} of {total}.
          </p>
        ) : null}

        <div className="mt-6 rounded-[14px] border border-[var(--ftp-line)] bg-white/80 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--age-teal-deep,#0f766e)]">
            Example
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--ftp-ink-soft)]">
            First occurrence is kept; later duplicates are removed.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold text-[var(--ftp-ink)]">Before</p>
              <pre className="whitespace-pre-wrap rounded-lg bg-[var(--ftp-porcelain)] p-3 text-xs leading-5 text-[var(--ftp-ink)]">
                {"apple\nbanana\napple\nCherry\nbanana"}
              </pre>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-[var(--ftp-ink)]">After</p>
              <pre className="whitespace-pre-wrap rounded-lg bg-[var(--ftp-porcelain)] p-3 text-xs leading-5 text-[var(--ftp-ink)]">
                {"apple\nbanana\nCherry"}
              </pre>
            </div>
          </div>
          <button
            type="button"
            className="age-btn-ghost mt-3 px-3 py-1.5 text-xs"
            onClick={() => setText("apple\nbanana\napple\nCherry\nbanana")}
          >
            Try this example
          </button>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="text-tools"
        currentToolPath="/text-tools/duplicate-line-remover"
        faqs={[
          { q: "Is this Duplicate Line Remover free?", a: "Yes. Deduplicate lines with no signup." },
          {
            q: "Does order stay the same?",
            a: "Yes. The first occurrence of each line is kept; later duplicates are removed.",
          },
          {
            q: "Is my text uploaded?",
            a: "No. Deduplication runs entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
