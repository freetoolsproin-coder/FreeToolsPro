import { useMemo, useState } from "react";
import { Landmark } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";
import { SCHEMES } from "../../data/india/indiaToolData";

export default function GovernmentSchemeFinder() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const cats = useMemo(() => ["All", ...new Set(SCHEMES.map((s) => s.category))], []);
  const rows = useMemo(() => SCHEMES.filter((s) => (category === "All" || s.category === category) && (!q.trim() || `${s.name} ${s.note}`.toLowerCase().includes(q.trim().toLowerCase()))), [q, category]);

  return (
    <>
      <Seo page="governmentSchemeFinder" />
      <ToolHeroShell
        category="trending-tools"
        icon={Landmark}
        title="Government Scheme Finder"
        subtitle="Browse popular Central and state scheme names by category and eligibility keywords."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Search
            <input className={`${inputDark} mt-1.5`} value={q} onChange={(e) => setQ(e.target.value)} placeholder="farmer, pension, housing…" />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Category
            <select className={`${selectDark} mt-1.5`} value={category} onChange={(e) => setCategory(e.target.value)}>
              {cats.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <ul className="mt-6 space-y-3">
          {rows.map((s) => (
            <li key={s.name} className="rounded-xl border border-[var(--ftp-line)] bg-white p-4">
              <p className="font-semibold text-[var(--ftp-ink)]">{s.name}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--ftp-ink-soft)]">{s.level} · {s.category}</p>
              <p className="mt-2 text-sm text-[var(--ftp-ink-soft)]">{s.note}</p>
            </li>
          ))}
        </ul>

      </ToolHeroShell>
      <ToolContentLayout category="trending-tools" currentToolPath="/trending-tools/government-scheme-finder" />
    </>
  );
}
