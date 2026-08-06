import { useMemo, useState } from "react";
import { PartyPopper } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { FESTIVALS } from "../../data/india/indiaToolData";

export default function FestivalCalendar() {
  const [month, setMonth] = useState("All");
  const months = useMemo(() => ["All", ...new Set(FESTIVALS.map((f) => f.month))], []);
  const rows = useMemo(() => FESTIVALS.filter((f) => month === "All" || f.month === month), [month]);

  return (
    <>
      <Seo page="festivalCalendar" />
      <ToolHeroShell
        category="trending-tools"
        icon={PartyPopper}
        title="Festival Calendar"
        subtitle="Explore major Indian festivals by month with short cultural notes."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <label className="block text-sm text-[var(--ftp-ink-soft)]">Month / season
          <select className={`${selectDark} mt-1.5 max-w-sm`} value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <ul className="mt-6 space-y-3">
          {rows.map((f) => (
            <li key={`${f.month}-${f.name}`} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">{f.month}</p>
              <p className="mt-1 font-semibold text-[var(--ftp-ink)]">{f.name}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">{f.note}</p>
            </li>
          ))}
        </ul>

      </ToolHeroShell>
      <ToolContentLayout category="trending-tools" currentToolPath="/trending-tools/festival-calendar" />
    </>
  );
}
