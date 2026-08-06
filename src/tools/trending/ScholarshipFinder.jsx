import { useMemo, useState } from "react";
import { GraduationCap } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { SCHOLARSHIPS } from "../../data/india/indiaToolData";

export default function ScholarshipFinder() {
  const [level, setLevel] = useState("All");
  const [q, setQ] = useState("");
  const levels = useMemo(() => ["All", ...new Set(SCHOLARSHIPS.map((s) => s.level))], []);
  const rows = useMemo(() => SCHOLARSHIPS.filter((s) => (level === "All" || s.level === level) && (!q.trim() || `${s.name} ${s.category}`.toLowerCase().includes(q.trim().toLowerCase()))), [level, q]);

  return (
    <>
      <Seo page="scholarshipFinder" />
      <ToolHeroShell
        category="trending-tools"
        icon={GraduationCap}
        title="Scholarship Finder"
        subtitle="Filter sample scholarships by level, category, and deadline window."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Level
            <select className={`${selectDark} mt-1.5`} value={level} onChange={(e) => setLevel(e.target.value)}>
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Search
            <input className={`${inputDark} mt-1.5`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="NSP, AICTE, merit…" />
          </label>
        </div>
        <ul className="mt-6 space-y-3">
          {rows.map((s) => (
            <li key={s.name} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="font-semibold text-[var(--ftp-ink)]">{s.name}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">{s.level} · {s.category}</p>
              <p className="mt-1 text-sm text-[var(--ftp-ink)]">Deadline: {s.deadline}</p>
            </li>
          ))}
        </ul>

      </ToolHeroShell>
      <ToolContentLayout category="trending-tools" currentToolPath="/trending-tools/scholarship-finder" />
    </>
  );
}
