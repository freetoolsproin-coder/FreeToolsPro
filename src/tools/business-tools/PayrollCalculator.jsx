import { useMemo, useState } from "react";
import {
  Wallet,
  RefreshCw,
  Home,
  BadgePercent,
  Landmark,
  Receipt,
  IndianRupee,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function PayrollCalculator() {
  const [basicSalary, setBasicSalary] = useState(40000);
  const [hraPercent, setHraPercent] = useState(40);
  const [specialAllowance, setSpecialAllowance] = useState(10000);
  const [pfPercent, setPfPercent] = useState(12);
  const [professionalTax, setProfessionalTax] = useState(200);

  const result = useMemo(() => {
    const basic = Number(basicSalary) || 0;
    const hra = (basic * (Number(hraPercent) || 0)) / 100;
    const special = Number(specialAllowance) || 0;
    const gross = basic + hra + special;

    const pf = (basic * (Number(pfPercent) || 0)) / 100;
    const pt = Number(professionalTax) || 0;
    const deductions = pf + pt;
    const net = gross - deductions;

    return { basic, hra, special, gross, pf, pt, deductions, net };
  }, [basicSalary, hraPercent, specialAllowance, pfPercent, professionalTax]);

  const resetFields = () => {
    setBasicSalary(40000);
    setHraPercent(40);
    setSpecialAllowance(10000);
    setPfPercent(12);
    setProfessionalTax(200);
  };

  return (
    <>
      <Seo page="payrollCalculator" />

      <ToolHeroShell
        icon={Wallet}
        title="Payroll Calculator"
        subtitle="Estimate gross pay, deductions & net salary from basic, HRA, allowances, PF, and professional tax."
        category="business-tools"
        formLabel="Salary inputs"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-800">Salary inputs</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="basic">
                  Basic salary (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="basic"
                    type="number"
                    min="0"
                    className={`${inputDark} mt-1.5 pl-9`}
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="hra">
                  HRA %
                </label>
                <div className="relative">
                  <Home className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="hra"
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${inputDark} mt-1.5 pl-9`}
                    value={hraPercent}
                    onChange={(e) => setHraPercent(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="special">
                  Special allowance (₹)
                </label>
                <div className="relative">
                  <BadgePercent className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="special"
                    type="number"
                    min="0"
                    className={`${inputDark} mt-1.5 pl-9`}
                    value={specialAllowance}
                    onChange={(e) => setSpecialAllowance(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="pf">
                  PF employee % (of basic)
                </label>
                <div className="relative">
                  <Landmark className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="pf"
                    type="number"
                    min="0"
                    step="0.01"
                    className={`${inputDark} mt-1.5 pl-9`}
                    value={pfPercent}
                    onChange={(e) => setPfPercent(e.target.value)}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-600" htmlFor="ptax">
                  Professional tax (₹)
                </label>
                <div className="relative">
                  <Receipt className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="ptax"
                    type="number"
                    min="0"
                    className={`${inputDark} mt-1.5 pl-9`}
                    value={professionalTax}
                    onChange={(e) => setProfessionalTax(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFields}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" /> Reset
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-5 text-lg font-bold text-slate-800">Payroll breakdown</h2>

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-sky-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Net pay
              </p>
              <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-700">
                {formatINR(result.net)}
              </p>
              <p className="mt-2 text-sm text-slate-600">
                After PF and professional tax deductions
              </p>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">Gross salary</p>
                <p className="mt-1 text-xl font-bold text-slate-800">{formatINR(result.gross)}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  Basic {formatINR(result.basic)} + HRA {formatINR(result.hra)} + Special{" "}
                  {formatINR(result.special)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">Deductions</p>
                <p className="mt-1 text-xl font-bold text-rose-600">
                  {formatINR(result.deductions)}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  PF {formatINR(result.pf)} + Prof. tax {formatINR(result.pt)}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">HRA amount</p>
                <p className="mt-1 text-xl font-bold text-sky-700">{formatINR(result.hra)}</p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  {hraPercent || 0}% of basic
                </p>
              </div>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="business-tools"
        currentToolPath="/business-tools/payroll-calculator" />
    </>
  );
}
