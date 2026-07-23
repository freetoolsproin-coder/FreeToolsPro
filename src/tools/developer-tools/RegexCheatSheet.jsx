import { useMemo, useState } from "react";
import { BookOpen, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const TOKENS = [
  { token: ".", meaning: "Any character except newline (unless s/dotAll)" },
  { token: "\\d", meaning: "Digit (0–9)" },
  { token: "\\D", meaning: "Non-digit" },
  { token: "\\w", meaning: "Word character [A-Za-z0-9_]" },
  { token: "\\W", meaning: "Non-word character" },
  { token: "\\s", meaning: "Whitespace" },
  { token: "\\S", meaning: "Non-whitespace" },
  { token: "^", meaning: "Start of string (or line with m)" },
  { token: "$", meaning: "End of string (or line with m)" },
  { token: "\\b", meaning: "Word boundary" },
  { token: "\\B", meaning: "Non-word boundary" },
  { token: "*", meaning: "0 or more of previous" },
  { token: "+", meaning: "1 or more of previous" },
  { token: "?", meaning: "0 or 1 of previous" },
  { token: "{n}", meaning: "Exactly n of previous" },
  { token: "{n,}", meaning: "n or more of previous" },
  { token: "{n,m}", meaning: "Between n and m of previous" },
  { token: "*?", meaning: "Lazy: 0 or more (non-greedy)" },
  { token: "+?", meaning: "Lazy: 1 or more (non-greedy)" },
  { token: "??", meaning: "Lazy: 0 or 1 (non-greedy)" },
  { token: "|", meaning: "Alternation (OR)" },
  { token: "()", meaning: "Capturing group" },
  { token: "(?:)", meaning: "Non-capturing group" },
  { token: "(?<name>)", meaning: "Named capturing group" },
  { token: "[]", meaning: "Character class" },
  { token: "[^]", meaning: "Negated character class" },
  { token: "[a-z]", meaning: "Range inside a character class" },
  { token: "\\", meaning: "Escape next special character" },
  { token: "(?=)", meaning: "Positive lookahead" },
  { token: "(?!)", meaning: "Negative lookahead" },
  { token: "(?<=)", meaning: "Positive lookbehind" },
  { token: "(?<!)", meaning: "Negative lookbehind" },
  { token: "g", meaning: "Flag: global (find all)" },
  { token: "i", meaning: "Flag: ignore case" },
  { token: "m", meaning: "Flag: multiline ^/$" },
  { token: "s", meaning: "Flag: dotAll (. matches newline)" },
  { token: "u", meaning: "Flag: unicode mode" },
  { token: "y", meaning: "Flag: sticky (from lastIndex)" },
];

export default function RegexCheatSheet() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TOKENS;
    return TOKENS.filter(
      (row) => row.token.toLowerCase().includes(q) || row.meaning.toLowerCase().includes(q)
    );
  }, [query]);

  const handleCopy = async () => {
    const text = filtered.map((r) => `${r.token}\t${r.meaning}`).join("\n");
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="regexCheatSheet" />

      <ToolHeroShell
        icon={BookOpen}
        title="Regex Cheat Sheet"
        subtitle="Searchable reference of common regex tokens, quantifiers, groups, and flags."
        category="developer-tools"
        layout="stack"
        formLabel="Browse tokens"
      >
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[220px] flex-1">
            <label htmlFor="re-cs-q" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Search
            </label>
            <input
              id="re-cs-q"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. lookahead, \\d, flag…"
              className={inputDark}
            />
          </div>
          <button type="button" onClick={handleCopy} disabled={!filtered.length} className="age-btn-ghost px-3 py-3 text-xs">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy visible"}
          </button>
        </div>

        <div className="overflow-x-auto rounded-[14px] border border-[var(--ftp-line)]">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-[var(--ftp-porcelain)] text-[var(--ftp-ink-soft)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Token</th>
                <th className="px-4 py-3 font-semibold">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={`${row.token}-${row.meaning}`} className="border-t border-[var(--ftp-line)]">
                  <td className="px-4 py-2.5 font-mono text-[var(--ftp-ink)]">{row.token}</td>
                  <td className="px-4 py-2.5 text-[var(--ftp-ink)]">{row.meaning}</td>
                </tr>
              ))}
              {!filtered.length ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-[var(--ftp-ink-soft)]">
                    No tokens match your search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/regex-cheat-sheet"
        faqs={[
          { q: "Is this Regex Cheat Sheet free?", a: "Yes. Browse and search tokens with no signup." },
          {
            q: "Which flavor is this for?",
            a: "JavaScript / ECMAScript-style regex (the same engine used in browsers).",
          },
          {
            q: "Can I copy the table?",
            a: "Yes. Use Copy visible to copy the filtered token list as text.",
          },
        ]}
      />
    </>
  );
}
