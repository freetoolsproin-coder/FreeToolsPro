import { useMemo, useState } from "react";
import { Lightbulb, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const EXPLAIN = {
  ".": "Matches any character except newline (unless the s flag is set).",
  "\\d": "Matches a digit character (0–9).",
  "\\D": "Matches a non-digit character.",
  "\\w": "Matches a word character: letters, digits, or underscore.",
  "\\W": "Matches a non-word character.",
  "\\s": "Matches whitespace (space, tab, newline, etc.).",
  "\\S": "Matches a non-whitespace character.",
  "^": "Anchors the match at the start of the string (or line with m).",
  $: "Anchors the match at the end of the string (or line with m).",
  "\\b": "Matches a word boundary.",
  "\\B": "Matches a non-word boundary.",
  "*": "Quantifier: zero or more of the previous token.",
  "+": "Quantifier: one or more of the previous token.",
  "?": "Quantifier: zero or one of the previous token (or makes a quantifier lazy).",
  "|": "Alternation: matches the expression on either side.",
  "(": "Starts a capturing group.",
  ")": "Ends a group.",
  "[": "Starts a character class.",
  "]": "Ends a character class.",
  "{": "Starts a counted quantifier.",
  "}": "Ends a counted quantifier.",
  "\\": "Escapes the following special character.",
};

/**
 * Tokenize a regex pattern into explainable pieces (heuristic).
 * @param {string} pattern
 * @returns {{ token: string, note: string }[]}
 */
function tokenizePattern(pattern) {
  const src = String(pattern ?? "");
  const tokens = [];
  let i = 0;

  while (i < src.length) {
    const ch = src[i];
    const next = src[i + 1];

    if (ch === "\\") {
      if (next === "k" && src[i + 2] === "<") {
        const end = src.indexOf(">", i + 3);
        if (end !== -1) {
          const tok = src.slice(i, end + 1);
          tokens.push({ token: tok, note: "Backreference to a named group." });
          i = end + 1;
          continue;
        }
      }
      if (next && /[1-9]/.test(next)) {
        tokens.push({ token: `\\${next}`, note: "Backreference to a numbered capturing group." });
        i += 2;
        continue;
      }
      const esc = `\\${next ?? ""}`;
      tokens.push({
        token: esc,
        note: EXPLAIN[esc] || EXPLAIN["\\"] || `Escaped sequence ${esc}.`,
      });
      i += next ? 2 : 1;
      continue;
    }

    if (ch === "(") {
      if (src.startsWith("(?:", i)) {
        tokens.push({ token: "(?:", note: "Starts a non-capturing group." });
        i += 3;
        continue;
      }
      if (src.startsWith("(?=", i)) {
        tokens.push({ token: "(?=", note: "Positive lookahead: asserts what follows without consuming." });
        i += 3;
        continue;
      }
      if (src.startsWith("(?!", i)) {
        tokens.push({ token: "(?!", note: "Negative lookahead: asserts what must not follow." });
        i += 3;
        continue;
      }
      if (src.startsWith("(?<=", i)) {
        tokens.push({ token: "(?<=", note: "Positive lookbehind: asserts what precedes." });
        i += 4;
        continue;
      }
      if (src.startsWith("(?<!", i)) {
        tokens.push({ token: "(?<!", note: "Negative lookbehind: asserts what must not precede." });
        i += 4;
        continue;
      }
      if (src.startsWith("(?<", i)) {
        const end = src.indexOf(">", i + 3);
        if (end !== -1) {
          const tok = src.slice(i, end + 1);
          tokens.push({ token: tok, note: "Starts a named capturing group." });
          i = end + 1;
          continue;
        }
      }
      tokens.push({ token: "(", note: EXPLAIN["("] });
      i += 1;
      continue;
    }

    if (ch === "{") {
      const end = src.indexOf("}", i + 1);
      if (end !== -1) {
        const tok = src.slice(i, end + 1);
        tokens.push({
          token: tok,
          note: "Counted quantifier for the previous token (exact or range).",
        });
        i = end + 1;
        continue;
      }
    }

    if (ch === "[") {
      let j = i + 1;
      if (src[j] === "^") j += 1;
      while (j < src.length) {
        if (src[j] === "\\" && j + 1 < src.length) {
          j += 2;
          continue;
        }
        if (src[j] === "]") break;
        j += 1;
      }
      if (j < src.length) {
        const tok = src.slice(i, j + 1);
        tokens.push({
          token: tok,
          note: tok.startsWith("[^")
            ? "Negated character class: matches any character not listed."
            : "Character class: matches any one character listed (or in ranges).",
        });
        i = j + 1;
        continue;
      }
    }

    tokens.push({
      token: ch,
      note: EXPLAIN[ch] || (/\s/.test(ch) ? "Literal whitespace." : `Literal character "${ch}".`),
    });
    i += 1;
  }

  return tokens;
}

export default function RegexExplainer() {
  const [pattern, setPattern] = useState("");
  const [copied, setCopied] = useState(false);

  const { tokens, error } = useMemo(() => {
    if (!pattern) return { tokens: [], error: "" };
    try {
      // Validate that the pattern compiles
      void new RegExp(pattern);
      return { tokens: tokenizePattern(pattern), error: "" };
    } catch (err) {
      return { tokens: [], error: err.message || "Invalid regular expression." };
    }
  }, [pattern]);

  const output = useMemo(() => {
    if (!tokens.length) return "";
    return tokens.map((t, i) => `${i + 1}. ${t.token} — ${t.note}`).join("\n");
  }, [tokens]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="regexExplainer" />

      <ToolHeroShell
        icon={Lightbulb}
        title="Regex Explainer"
        subtitle="Tokenize a pattern and get plain-language notes for common regex constructs."
        category="developer-tools"
        layout="stack"
        formLabel="Explain pattern"
      >
        <div className="mb-4">
          <label htmlFor="re-ex-pattern" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
            Pattern
          </label>
          <input
            id="re-ex-pattern"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder={"^[A-Za-z]+\\d{2,}$"}
            className={inputDark}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="re-ex-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              Token explanation
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
            id="re-ex-out"
            readOnly
            rows={14}
            value={output}
            placeholder="Token explanations will appear here..."
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
        currentToolPath="/developer-tools/regex-explainer"
        faqs={[
          { q: "Is this Regex Explainer free?", a: "Yes. Explain patterns with no signup." },
          {
            q: "How accurate is the breakdown?",
            a: "It uses heuristics for common tokens. Complex nesting may need a full parser for perfect detail.",
          },
          {
            q: "Is my pattern uploaded?",
            a: "No. Explanation runs entirely in your browser.",
          },
        ]}
      />
    </>
  );
}
