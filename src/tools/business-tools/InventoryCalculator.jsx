import { useMemo, useState } from "react";
import {
  Package,
  RefreshCw,
  Layers,
  TrendingUp,
  CircleDollarSign,
  Warehouse,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n || 0);

export default function InventoryCalculator() {
  const [openingStock, setOpeningStock] = useState(500000);
  const [purchases, setPurchases] = useState(300000);
  const [closingStock, setClosingStock] = useState(200000);
  const [sales, setSales] = useState("");

  const stats = useMemo(() => {
    const opening = Number(openingStock) || 0;
    const purch = Number(purchases) || 0;
    const closing = Number(closingStock) || 0;
    const salesVal = sales === "" ? null : Number(sales);

    const cogs = opening + purch - closing;
    const avgInventory = (opening + closing) / 2;

    let turnover = null;
    if (salesVal !== null && !Number.isNaN(salesVal) && avgInventory > 0) {
      turnover = cogs / avgInventory;
    }

    return {
      cogs,
      avgInventory,
      turnover,
      hasSales: salesVal !== null && !Number.isNaN(salesVal),
      salesVal: salesVal || 0,
    };
  }, [openingStock, purchases, closingStock, sales]);

  const resetFields = () => {
    setOpeningStock(500000);
    setPurchases(300000);
    setClosingStock(200000);
    setSales("");
  };

  return (
    <>
      <Seo page="inventoryCalculator" />

      <ToolHeroShell
        icon={Package}
        title="Inventory Calculator"
        subtitle="Calculate COGS, average inventory & turnover from opening stock, purchases, and closing stock."
        category="business-tools"
        formLabel="Stock inputs"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-800">Stock inputs</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="opening">
                  Opening stock (₹)
                </label>
                <input
                  id="opening"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputDark} mt-1.5`}
                  value={openingStock}
                  onChange={(e) => setOpeningStock(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="purchases">
                  Purchases (₹)
                </label>
                <input
                  id="purchases"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputDark} mt-1.5`}
                  value={purchases}
                  onChange={(e) => setPurchases(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="closing">
                  Closing stock (₹)
                </label>
                <input
                  id="closing"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputDark} mt-1.5`}
                  value={closingStock}
                  onChange={(e) => setClosingStock(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="sales">
                  Sales / COGS basis (₹) — optional
                </label>
                <input
                  id="sales"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputDark} mt-1.5`}
                  value={sales}
                  onChange={(e) => setSales(e.target.value)}
                  placeholder="Enter to compute turnover"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Turnover uses COGS ÷ average inventory when sales field is filled.
                </p>
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
            <h2 className="mb-5 text-lg font-bold text-slate-800">Inventory breakdown</h2>

            <div className="grid gap-4 sm:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <CircleDollarSign className="mx-auto mb-2 h-6 w-6 text-emerald-600" />
                <p className="text-xs font-medium text-slate-500">COGS</p>
                <p className="mt-1 text-xl font-bold text-slate-800">{formatINR(stats.cogs)}</p>
                <p className="mt-1 text-[11px] text-slate-500">Opening + Purchases − Closing</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <Warehouse className="mx-auto mb-2 h-6 w-6 text-sky-600" />
                <p className="text-xs font-medium text-slate-500">Avg inventory</p>
                <p className="mt-1 text-xl font-bold text-slate-800">
                  {formatINR(stats.avgInventory)}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">(Opening + Closing) ÷ 2</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
                <TrendingUp className="mx-auto mb-2 h-6 w-6 text-amber-600" />
                <p className="text-xs font-medium text-slate-500">Inventory turnover</p>
                {stats.hasSales && stats.turnover !== null ? (
                  <>
                    <p className="mt-1 text-xl font-bold text-slate-800">
                      {stats.turnover.toFixed(2)}×
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">COGS ÷ Avg inventory</p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">Enter sales to unlock</p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <div className="flex items-start gap-2">
                <Layers className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <p>
                  <strong className="text-slate-800">COGS</strong> = Opening stock + Purchases −
                  Closing stock. Higher turnover usually means inventory is selling through faster.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="business-tools"
        currentToolPath="/business-tools/inventory-calculator" />
    </>
  );
}
