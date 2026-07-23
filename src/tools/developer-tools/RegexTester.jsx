import { useMemo, useState } from "react";
import { Code2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const FLAG_OPTIONS = [
  { id: "g", label: "g (global)" },
  { id: "i", label: "i (ignore case)" },
  { id: "m", label: "m (multiline)" },
  { id: "s", label: "s (dotAll)" },
  { id: "u", label: "u (unicode)" },
  { id: "y", label: "y (sticky)" },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false, s: false, u: false, y: false });
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const flagStr = Object.entries(flags)
    .filter(([, on]) => on)
    .map(([f]) => f)
    .join("");

  const { matches, error } = useMemo(() => {
    if (!pattern) return { matches: [], error: "" };
    try {
      const re = new RegExp(pattern, flagStr);
      const found = [];
      if (flagStr.includes("g")) {
        let m;
        const clone = new RegExp(re.source, re.flags);
        while ((m = clone.exec(text)) !== null) {
          found.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
            named: m.groups || null,
          });
          if (m[0].length === 0) clone.lastIndex += 1;
        }
      } else {
        const m = re.exec(text);
        if (m) {
          found.push({
            match: m[0],
            index: m.index,
            groups: m.slice(1),
            named: m.groups || null,
          });
        }
      }
      return { matches: found, error: "" };
    } catch (err) {
      return { matches: [], error: err.message || "Invalid regular expression." };
    }
  }, [pattern, flagStr, text]);

  const output = useMemo(() => {
    if (!pattern) return "";
    if (error) return "";
    if (!matches.length) return "No matches.";
    return matches
      .map((m, i) => {
        const lines = [`Match ${i + 1}: "${m.match}" @ ${m.index}`];
        if (m.groups.length) {
          m.groups.forEach((g, gi) => lines.push(`  Group ${gi + 1}: ${g == null ? "(undefined)" : `"${g}"`}`));
        }
        if (m.named) {
          Object.entries(m.named).forEach(([k, v]) => lines.push(`  Named ${k}: ${v == null ? "(undefined)" : `"${v}"`}`));
        }
        return lines.join("\n");
      })
      .join("\n\n");
  }, [pattern, error, matches]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFlag = (id) => {
    setFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Seo page="regexTester" />

      <ToolHeroShell
        icon={Code2}
        title="Regex Tester"
        subtitle="Test a regular expression against sample text and inspect matches and capture groups."
        category="developer-tools"
        layout="stack"
        formLabel="Test regex"
      >
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="re-pattern" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Pattern
            </label>
            <input
              id="re-pattern"
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder={"(\\w+)@(\\w+\\.\\w+)"}
              className={inputDark}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">Flags</span>
            <div className="flex flex-wrap gap-3 pt-2">
              {FLAG_OPTIONS.map((f) => (
                <label key={f.id} className="inline-flex items-center gap-1.5 text-sm text-[var(--ftp-ink)]">
                  <input
                    type="checkbox"
                    checked={!!flags[f.id]}
                    onChange={() => toggleFlag(f.id)}
                    className="rounded border-black/20"
                  />
                  {f.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="re-text" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Test text
            </label>
            <textarea
              id="re-text"
              rows={12}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste text to match against…"
              className={textareaDark}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label htmlFor="re-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
                Matches ({matches.length})
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
              id="re-out"
              readOnly
              rows={12}
              value={output}
              placeholder="Matches and groups will appear here..."
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
        currentToolPath="/developer-tools/regex-tester"
        faqs={[
          { q: "Is this Regex Tester free?", a: "Yes. Test patterns with no signup." },
          {
            q: "Which flags are supported?",
            a: "g, i, m, s, u, and y — the standard JavaScript RegExp flags.",
          },
          {
            q: "Is my text uploaded?",
            a: "No. Matching runs entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
