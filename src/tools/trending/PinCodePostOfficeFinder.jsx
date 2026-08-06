import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { PIN_CODES } from "../../data/india/indiaToolData";

export default function PinCodePostOfficeFinder() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PIN_CODES;
    return PIN_CODES.filter((r) => r.pin.includes(q) || r.office.toLowerCase().includes(q) || r.district.toLowerCase().includes(q) || r.state.toLowerCase().includes(q));
  }, [query]);

  return (
    <>
      <Seo page="pinCodePostOfficeFinder" />
      <ToolHeroShell
        category="trending-tools"
        icon={MapPin}
        title="PIN Code & Post Office Finder"
        subtitle="Look up sample Indian PIN codes, post offices, districts, and states."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <label className="block text-sm text-[var(--ftp-ink-soft)]">PIN, post office, district, or state
          <input className={`${inputDark} mt-1.5`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. 560001 or Bengaluru" />
        </label>
        <ul className="mt-6 divide-y divide-[var(--ftp-line)] rounded-xl border border-[var(--ftp-line)] bg-white">
          {matches.map((r) => (
            <li key={r.pin} className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm">
              <span className="font-semibold text-[var(--ftp-ink)]">{r.pin}</span>
              <span className="text-[var(--ftp-ink-soft)]">{r.office} · {r.district}, {r.state}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Sample PIN directory. For official delivery area checks use India Post.</p>

      </ToolHeroShell>
      <ToolContentLayout category="trending-tools" currentToolPath="/trending-tools/pin-code-post-office-finder" />
    </>
  );
}
