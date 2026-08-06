import { useMemo, useState } from "react";
import { Landmark, Search } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const SAMPLE_BANKS = [
  {
    ifsc: "SBIN0000456",
    bank: "State Bank of India",
    branch: "Mumbai Main Branch",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    ifsc: "HDFC0000123",
    bank: "HDFC Bank",
    branch: "Mumbai Fort",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    ifsc: "ICIC0000001",
    bank: "ICICI Bank",
    branch: "Mumbai Nariman Point",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    ifsc: "UTIB0000001",
    bank: "Axis Bank",
    branch: "Mumbai Fort",
    city: "Mumbai",
    state: "Maharashtra",
  },
  {
    ifsc: "PUNB0123456",
    bank: "Punjab National Bank",
    branch: "Connaught Place",
    city: "New Delhi",
    state: "Delhi",
  },
  {
    ifsc: "CNRB0000001",
    bank: "Canara Bank",
    branch: "Bangalore Main",
    city: "Bangalore",
    state: "Karnataka",
  },
];

const panel =
  "rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-5 sm:p-6";

export default function IfscCodeFinder() {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toUpperCase();

  const formatResult = useMemo(() => {
    if (!normalizedQuery) {
      return { status: "idle", message: "Search by IFSC, bank name, branch, or city." };
    }

    if (normalizedQuery.length < 11 && IFSC_REGEX.test(normalizedQuery) === false) {
      if (/^[A-Z0-9]*$/.test(normalizedQuery) && normalizedQuery.length < 11) {
        return {
          status: "incomplete",
          message: `${11 - normalizedQuery.length} character(s) remaining for a full IFSC.`,
        };
      }
    }

    if (normalizedQuery.length === 11) {
      if (!IFSC_REGEX.test(normalizedQuery)) {
        return {
          status: "invalid",
          message:
            "Invalid IFSC format. Expected 4 letters, digit 0, then 6 alphanumeric characters.",
        };
      }
      return {
        status: "valid-format",
        message: "IFSC format is valid.",
        ifsc: normalizedQuery,
        bankCode: normalizedQuery.slice(0, 4),
      };
    }

    return { status: "search", message: null };
  }, [normalizedQuery]);

  const matches = useMemo(() => {
    if (!normalizedQuery || formatResult.status === "incomplete") return [];

    const q = normalizedQuery.toLowerCase();
    return SAMPLE_BANKS.filter(
      (row) =>
        row.ifsc.includes(normalizedQuery) ||
        row.bank.toLowerCase().includes(q) ||
        row.branch.toLowerCase().includes(q) ||
        row.city.toLowerCase().includes(q) ||
        row.state.toLowerCase().includes(q)
    );
  }, [normalizedQuery, formatResult.status]);

  const exactMatch = useMemo(
    () => SAMPLE_BANKS.find((row) => row.ifsc === normalizedQuery),
    [normalizedQuery]
  );

  const handleQueryChange = (value) => {
    setQuery(value.toUpperCase().replace(/[^A-Z0-9\s]/g, ""));
  };

  return (
    <>
      <Seo page="ifscCodeFinder" />

      <ToolHeroShell
        category="business-tools"
        icon={Landmark}
        title="IFSC + Bank Branch Finder"
        subtitle="Validate IFSC format and look up bank branch details for NEFT, RTGS, and IMPS."
        formLabel="IFSC search"
        formHint="Results update as you type"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className={panel}>
            <h2 className="mb-5 text-lg font-bold text-[var(--ftp-ink)]">Search IFSC</h2>

            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ftp-ink-soft)]"
                aria-hidden="true"
              />
              <input
                type="text"
                className={`${inputDark} pl-10 font-mono uppercase tracking-wide`}
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="SBIN0000456 or bank name"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            <p className="mt-3 text-xs leading-relaxed text-[var(--ftp-ink-soft)]">
              Format: <span className="font-mono text-[var(--ftp-ink)]">AAAA0BBBBBB</span> — four
              bank letters, zero, six branch characters. Sample dataset includes SBI, HDFC, ICICI,
              Axis, PNB, and Canara Bank.
            </p>

            {formatResult.status !== "idle" && formatResult.status !== "search" && (
              <div
                className={`mt-4 rounded-xl border p-4 text-sm ${
                  formatResult.status === "valid-format"
                    ? "border-[var(--ftp-teal)] bg-white text-[var(--ftp-ink)]"
                    : "border-[var(--ftp-line)] bg-white text-[var(--ftp-ink-soft)]"
                }`}
              >
                <p
                  className={`font-semibold ${
                    formatResult.status === "valid-format"
                      ? "text-[var(--ftp-teal)]"
                      : "text-[var(--ftp-ink)]"
                  }`}
                >
                  {formatResult.status === "valid-format"
                    ? "Valid IFSC format"
                    : formatResult.status === "invalid"
                      ? "Invalid IFSC"
                      : "Incomplete IFSC"}
                </p>
                <p className="mt-1">{formatResult.message}</p>
              </div>
            )}
          </div>

          <div className={`${panel} lg:sticky lg:top-24`}>
            <h2 className="mb-5 text-lg font-bold text-[var(--ftp-ink)]">Search results</h2>

            {exactMatch && (
              <div className="mb-4 rounded-2xl border border-[var(--ftp-teal)] bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--ftp-teal)]">
                  Exact match
                </p>
                <p className="mt-2 font-mono text-lg font-bold text-[var(--ftp-ink)]">
                  {exactMatch.ifsc}
                </p>
                <p className="mt-1 font-semibold text-[var(--ftp-ink)]">{exactMatch.bank}</p>
                <p className="text-sm text-[var(--ftp-ink-soft)]">
                  {exactMatch.branch}, {exactMatch.city}, {exactMatch.state}
                </p>
              </div>
            )}

            {!normalizedQuery ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--ftp-line)] bg-white">
                  <Landmark className="h-6 w-6 text-[var(--ftp-teal)]" />
                </div>
                <p className="max-w-xs text-sm leading-relaxed text-[var(--ftp-ink-soft)]">
                  Type an IFSC code or bank name to search the sample directory.
                </p>
              </div>
            ) : matches.length > 0 ? (
              <ul className="space-y-3">
                {matches.map((row) => (
                  <li
                    key={row.ifsc}
                    className="rounded-xl border border-[var(--ftp-line)] bg-white p-4 transition hover:border-[var(--ftp-teal)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="font-mono text-sm font-bold text-[var(--ftp-teal)]">
                        {row.ifsc}
                      </span>
                      <span className="text-xs font-medium text-[var(--ftp-ink-soft)]">
                        {row.city}, {row.state}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-[var(--ftp-ink)]">{row.bank}</p>
                    <p className="text-sm text-[var(--ftp-ink-soft)]">{row.branch}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-6 text-center">
                <p className="font-semibold text-[var(--ftp-ink)]">No matches found</p>
                <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">
                  Try a full IFSC code or search by bank name, branch, or city from the sample list.
                </p>
              </div>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="business-tools"
        currentToolPath="/business-tools/ifsc-code-finder"
      />
    </>
  );
}
