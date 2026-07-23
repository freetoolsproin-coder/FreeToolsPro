import { useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const HOLDER_TYPES = {
  P: "Person / Individual",
  C: "Company",
  H: "Hindu Undivided Family (HUF)",
  F: "Firm",
  A: "Association of Persons (AOP)",
  T: "Trust",
  B: "Body of Individuals (BOI)",
  L: "Local Authority",
  J: "Artificial Juridical Person",
  G: "Government",
};

const panel =
  "rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-5 sm:p-6";

export default function PanCardNameChecker() {
  const [pan, setPan] = useState("");
  const [name, setName] = useState("");

  const normalizedPan = pan.trim().toUpperCase();

  const result = useMemo(() => {
    if (!normalizedPan) {
      return { status: "idle", message: "Enter a PAN to validate format and decode holder type." };
    }

    if (normalizedPan.length < 10) {
      return {
        status: "incomplete",
        message: `${10 - normalizedPan.length} character(s) remaining. Format: AAAAA9999A`,
      };
    }

    if (!PAN_REGEX.test(normalizedPan)) {
      return {
        status: "invalid",
        message:
          "Invalid PAN format. Use 5 letters, 4 digits, and 1 letter (e.g. ABCDE1234F).",
      };
    }

    const holderCode = normalizedPan.charAt(3);
    const holderType = HOLDER_TYPES[holderCode] || "Unknown holder category";

    return {
      status: "valid",
      message: "PAN format is valid.",
      holderCode,
      holderType,
      serial: normalizedPan.slice(5, 9),
      checkChar: normalizedPan.charAt(9),
    };
  }, [normalizedPan]);

  const handlePanChange = (value) => {
    setPan(value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10));
  };

  return (
    <>
      <Seo page="panCardNameChecker" />

      <ToolHeroShell
        category="business-tools"
        icon={BadgeCheck}
        title="PAN Card Name Checker"
        subtitle="Validate Indian PAN format and decode the holder type from the fourth character."
        formLabel="PAN details"
        formHint="Validation runs as you type"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className={panel}>
            <h2 className="mb-5 text-lg font-bold text-[var(--ftp-ink)]">Enter PAN</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="pan-number">
                  PAN number
                </label>
                <input
                  id="pan-number"
                  className={`${inputDark} mt-1.5 font-mono uppercase tracking-widest`}
                  value={pan}
                  onChange={(e) => handlePanChange(e.target.value)}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  autoComplete="off"
                  spellCheck={false}
                />
                <p className="mt-2 text-xs text-[var(--ftp-ink-soft)]">
                  Format: 5 uppercase letters, 4 digits, 1 uppercase letter.
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="holder-name">
                  Name on PAN (optional)
                </label>
                <input
                  id="holder-name"
                  className={`${inputDark} mt-1.5`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As printed on PAN card"
                />
                <p className="mt-2 text-xs leading-relaxed text-[var(--ftp-ink-soft)]">
                  Name matching against the Income Tax portal requires official verification on{" "}
                  <span className="font-medium text-[var(--ftp-ink)]">incometax.gov.in</span>.
                  This tool only checks PAN structure and holder category.
                </p>
              </div>
            </div>
          </div>

          <div className={`${panel} lg:sticky lg:top-24`}>
            <h2 className="mb-5 text-lg font-bold text-[var(--ftp-ink)]">Validation result</h2>

            <div
              className={`rounded-2xl border p-5 ${
                result.status === "valid"
                  ? "border-[var(--ftp-teal)] bg-white"
                  : "border-[var(--ftp-line)] bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <BadgeCheck
                  className={`mt-0.5 h-5 w-5 shrink-0 ${
                    result.status === "valid"
                      ? "text-[var(--ftp-teal)]"
                      : "text-[var(--ftp-ink-soft)]"
                  }`}
                />
                <div>
                  <p
                    className={`font-semibold ${
                      result.status === "valid"
                        ? "text-[var(--ftp-teal)]"
                        : "text-[var(--ftp-ink)]"
                    }`}
                  >
                    {result.status === "valid"
                      ? "Valid PAN format"
                      : result.status === "invalid"
                        ? "Invalid PAN"
                        : result.status === "incomplete"
                          ? "Incomplete PAN"
                          : "Awaiting input"}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[var(--ftp-ink-soft)]">
                    {result.message}
                  </p>
                </div>
              </div>
            </div>

            {result.status === "valid" && (
              <dl className="mt-5 space-y-3 rounded-2xl border border-[var(--ftp-line)] bg-white p-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ftp-ink-soft)]">PAN</dt>
                  <dd className="font-mono font-semibold text-[var(--ftp-ink)]">{normalizedPan}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ftp-ink-soft)]">4th character</dt>
                  <dd className="font-mono font-semibold text-[var(--ftp-ink)]">
                    {result.holderCode}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ftp-ink-soft)]">Holder type</dt>
                  <dd className="text-right font-semibold text-[var(--ftp-ink)]">
                    {result.holderType}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ftp-ink-soft)]">Serial digits</dt>
                  <dd className="font-mono font-semibold text-[var(--ftp-ink)]">{result.serial}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[var(--ftp-ink-soft)]">Check letter</dt>
                  <dd className="font-mono font-semibold text-[var(--ftp-ink)]">{result.checkChar}</dd>
                </div>
                {name.trim() && (
                  <div className="border-t border-[var(--ftp-line)] pt-3">
                    <dt className="text-[var(--ftp-ink-soft)]">Name entered</dt>
                    <dd className="mt-1 font-semibold text-[var(--ftp-ink)]">{name.trim()}</dd>
                    <p className="mt-2 text-xs text-[var(--ftp-ink-soft)]">
                      Confirm name match on the official IT portal before KYC or filing.
                    </p>
                  </div>
                )}
              </dl>
            )}

            <div className="mt-5 rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">
                Holder type key (4th character)
              </p>
              <ul className="mt-3 grid gap-1.5 text-xs text-[var(--ftp-ink-soft)] sm:grid-cols-2">
                {Object.entries(HOLDER_TYPES).map(([code, label]) => (
                  <li key={code}>
                    <span className="font-mono font-semibold text-[var(--ftp-ink)]">{code}</span>
                    {" — "}
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="business-tools"
        currentToolPath="/business-tools/pan-card-name-checker"
      />
    </>
  );
}
