import { useMemo, useState } from "react";
import { PiggyBank } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";


export default function EpfChecker() {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(8.25);
  const [years, setYears] = useState(15);
  const [employeeShare, setEmployeeShare] = useState(12);

  const result = useMemo(() => {
    const n = Math.max(0, Number(years) || 0) * 12;
    const r = (Number(rate) || 0) / 100 / 12;
    const p = Number(monthly) || 0;
    if (n === 0) return { corpus: 0, contributed: 0, interest: 0 };
    const corpus = r === 0 ? p * n : p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const contributed = p * n;
    return { corpus, contributed, interest: corpus - contributed };
  }, [monthly, rate, years]);

  return (
    <>
      <Seo page="epfChecker" />
      <ToolHeroShell
        category="business-tools"
        icon={PiggyBank}
        title="EPF Checker"
        subtitle="Estimate EPF balance growth from monthly contribution, interest rate, and tenure."
        layout="stack"
        panel="light"
        formLabel="Try it"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">Monthly contribution (₹)
            <input className={`${inputDark} mt-1.5`} type="number" min="0" value={monthly} onChange={(e) => setMonthly(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Assumed interest rate (% p.a.)
            <input className={`${inputDark} mt-1.5`} type="number" step="0.05" value={rate} onChange={(e) => setRate(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Tenure (years)
            <input className={`${inputDark} mt-1.5`} type="number" min="1" value={years} onChange={(e) => setYears(e.target.value)} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">Employee share note (%)
            <input className={`${inputDark} mt-1.5`} type="number" value={employeeShare} onChange={(e) => setEmployeeShare(e.target.value)} />
          </label>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">Corpus</p>
            <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">₹{Math.round(result.corpus).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">Contributed</p>
            <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">₹{Math.round(result.contributed).toLocaleString("en-IN")}</p>
          </div>
          <div className="rounded-xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">Interest</p>
            <p className="mt-1 text-xl font-semibold text-[var(--ftp-ink)]">₹{Math.round(result.interest).toLocaleString("en-IN")}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--ftp-ink-soft)]">Estimate only. Actual EPF interest is declared yearly; employer share and withdrawals change balances. Employee share field is informational ({employeeShare}% typical on basic).</p>

      </ToolHeroShell>
      <ToolContentLayout category="business-tools" currentToolPath="/business-tools/epf-checker" />
    </>
  );
}
