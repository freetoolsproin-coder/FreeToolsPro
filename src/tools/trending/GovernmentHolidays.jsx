import { useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { HOLIDAYS_2026 } from "../../data/india/indiaToolData";

export default function GovernmentHolidays() {
  const [type, setType] = useState("All");
  const rows = useMemo(() => HOLIDAYS_2026.filter((h) => type === "All" || h.type === type), [type]);

  return (
    <>
      <Seo page="governmentHolidays" />
      <ToolHeroShell
        category="trending-tools"
        icon={CalendarDays}
        title="Government Holidays"
        subtitle="Browse sample gazetted and restricted holiday lists by year for India."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <label className="block text-sm text-[var(--ftp-ink-soft)]">Type
          <select className={`${selectDark} mt-1.5 max-w-sm`} value={type} onChange={(e) => setType(e.target.value)}>
            <option>All</option>
            <option>Gazetted</option>
            <option>Restricted/State</option>
            <option>State</option>
          </select>
        </label>
        <ul className="mt-6 divide-y divide-[var(--ftp-line)] rounded-xl border border-[var(--ftp-line)] bg-white">
          {rows.map((h) => (
            <li key={`${h.date}-${h.name}`} className="flex flex-wrap justify-between gap-2 px-4 py-3 text-sm">
              <span className="font-semibold text-[var(--ftp-ink)]">{h.name}</span>
              <span className="text-[var(--ftp-ink-soft)]">{h.date} · {h.type}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">*Festival dates marked with an asterisk can shift; confirm with the official DoPT / state calendar.</p>

      </ToolHeroShell>
      <ToolContentLayout category="trending-tools" currentToolPath="/trending-tools/government-holidays" />
    </>
  );
}
