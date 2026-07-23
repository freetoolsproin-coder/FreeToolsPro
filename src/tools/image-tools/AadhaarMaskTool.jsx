import { useMemo, useState } from "react";
import { Shield, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

function extractDigits(value) {
  return value.replace(/\D/g, "").slice(0, 12);
}

function formatAadhaar(digits) {
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.slice(i, i + 4));
  }
  return parts.join(" ");
}

function maskAadhaar(digits, visibleCount) {
  if (!digits) return "";
  const keep = Math.min(Math.max(visibleCount, 0), 4);
  const maskedLen = Math.max(0, digits.length - keep);
  const masked = "X".repeat(maskedLen) + digits.slice(maskedLen);
  return formatAadhaar(masked);
}

export default function AadhaarMaskTool() {
  const [input, setInput] = useState("");
  const [visibleDigits, setVisibleDigits] = useState(4);
  const [copied, setCopied] = useState(false);

  const digits = useMemo(() => extractDigits(input), [input]);
  const masked = useMemo(() => maskAadhaar(digits, visibleDigits), [digits, visibleDigits]);

  const handleInput = (e) => {
    setInput(formatAadhaar(extractDigits(e.target.value)));
  };

  const handleCopy = async () => {
    if (!masked) return;
    await navigator.clipboard.writeText(masked);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

  return (
    <>
      <Seo page="aadhaarMaskTool" />

      <ToolHeroShell
        icon={Shield}
        title="Aadhaar Mask Tool"
        subtitle="Mask Aadhaar digits client-side. Replace leading digits with X and keep only the last few visible."
        category="image-tools"
        layout="stack"
        formLabel="Mask number"
      >
        <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-3 text-sm text-[var(--ftp-ink-soft)]">
          Privacy note: all masking happens in your browser. Your Aadhaar number is never sent to a server.
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="aadhaar-input" className={labelClass}>
              Aadhaar number
            </label>
            <input
              id="aadhaar-input"
              type="text"
              inputMode="numeric"
              value={input}
              onChange={handleInput}
              placeholder="XXXX XXXX XXXX"
              className={inputDark}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="aadhaar-visible" className={labelClass}>
              Visible last digits (0-4)
            </label>
            <select
              id="aadhaar-visible"
              value={visibleDigits}
              onChange={(e) => setVisibleDigits(Number(e.target.value))}
              className={selectDark}
            >
              {[0, 1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 rounded-[14px] border border-[var(--ftp-line)] bg-white p-5">
          <p className="text-sm font-medium text-[var(--ftp-ink-soft)]">Masked output</p>
          <p className="age-display mt-2 text-2xl font-semibold tracking-wide text-[var(--ftp-ink)]">
            {masked || "Enter a 12-digit Aadhaar number"}
          </p>
          {digits.length > 0 && digits.length < 12 ? (
            <p className="mt-2 text-xs text-[var(--ftp-ink-soft)]">
              {12 - digits.length} more digit{12 - digits.length === 1 ? "" : "s"} needed for a full Aadhaar number.
            </p>
          ) : null}
          <button
            type="button"
            onClick={handleCopy}
            disabled={!masked}
            className="age-btn-primary mt-4"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy masked number"}
          </button>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/aadhaar-mask-tool"
      />
    </>
  );
}
