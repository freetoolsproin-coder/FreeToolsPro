import { useMemo, useState } from "react";
import { Wand2, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark, inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const PRESETS = {
  email: {
    label: "Email",
    pattern: "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
  },
  url: {
    label: "URL",
    pattern: "^https?:\\/\\/[^\\s/$.?#].[^\\s]*$",
  },
  phone: {
    label: "Phone",
    pattern: "^\\+?[0-9]{1,3}[-.\\s]?\\(?[0-9]{2,4}\\)?[-.\\s]?[0-9]{3,4}[-.\\s]?[0-9]{3,4}$",
  },
  date: {
    label: "Date (YYYY-MM-DD)",
    pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$",
  },
  ipv4: {
    label: "IPv4",
    pattern:
      "^(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)$",
  },
  custom: {
    label: "Custom charset",
    pattern: "",
  },
};

function escapeCharClass(chars) {
  return String(chars).replace(/[\\\]^-]/g, "\\$&");
}

export default function RegexGenerator() {
  const [preset, setPreset] = useState("email");
  const [charset, setCharset] = useState("A-Za-z0-9_");
  const [minLen, setMinLen] = useState("1");
  const [maxLen, setMaxLen] = useState("");
  const [copied, setCopied] = useState(false);

  const { output, error } = useMemo(() => {
    try {
      if (preset !== "custom") {
        return { output: PRESETS[preset].pattern, error: "" };
      }
      const min = Number(minLen);
      const max = maxLen.trim() === "" ? null : Number(maxLen);
      if (!Number.isFinite(min) || min < 0) {
        return { output: "", error: "Min length must be a non-negative number." };
      }
      if (max != null && (!Number.isFinite(max) || max < min)) {
        return { output: "", error: "Max length must be >= min length." };
      }
      if (!charset.trim()) {
        return { output: "", error: "Custom charset is required." };
      }
      const cls = escapeCharClass(charset.trim());
      const quant = max == null ? `{${Math.floor(min)},}` : `{${Math.floor(min)},${Math.floor(max)}}`;
      return { output: `^[${cls}]${quant}$`, error: "" };
    } catch (err) {
      return { output: "", error: err.message || "Could not generate pattern." };
    }
  }, [preset, charset, minLen, maxLen]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="regexGenerator" />

      <ToolHeroShell
        icon={Wand2}
        title="Regex Generator"
        subtitle="Generate common patterns for email, URL, phone, date, IPv4, or a custom character set."
        category="developer-tools"
        layout="stack"
        formLabel="Generate pattern"
      >
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rg-preset" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
              Preset
            </label>
            <select
              id="rg-preset"
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className={selectDark}
            >
              {Object.entries(PRESETS).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
          </div>

          {preset === "custom" ? (
            <>
              <div>
                <label htmlFor="rg-charset" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
                  Allowed characters (character class)
                </label>
                <input
                  id="rg-charset"
                  type="text"
                  value={charset}
                  onChange={(e) => setCharset(e.target.value)}
                  placeholder="A-Za-z0-9_"
                  className={inputDark}
                />
              </div>
              <div>
                <label htmlFor="rg-min" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
                  Min length
                </label>
                <input
                  id="rg-min"
                  type="text"
                  value={minLen}
                  onChange={(e) => setMinLen(e.target.value)}
                  placeholder="1"
                  className={inputDark}
                />
              </div>
              <div>
                <label htmlFor="rg-max" className="mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]">
                  Max length (optional)
                </label>
                <input
                  id="rg-max"
                  type="text"
                  value={maxLen}
                  onChange={(e) => setMaxLen(e.target.value)}
                  placeholder="leave blank for open-ended"
                  className={inputDark}
                />
              </div>
            </>
          ) : null}
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="rg-out" className="text-sm font-medium text-[var(--ftp-ink-soft)]">
              Generated pattern
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
            id="rg-out"
            readOnly
            rows={6}
            value={output}
            placeholder="Pattern will appear here..."
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
        currentToolPath="/developer-tools/regex-generator"
        faqs={[
          { q: "Is this Regex Generator free?", a: "Yes. Generate patterns with no signup." },
          {
            q: "Are presets production-ready?",
            a: "They are practical starting points. Always validate against your real input set.",
          },
          {
            q: "What does custom charset do?",
            a: "It builds ^[chars]{min,max}$ from the characters and lengths you provide.",
          },
        ]}
      />
    </>
  );
}
