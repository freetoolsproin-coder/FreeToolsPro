import { useMemo, useRef, useState } from "react";
import { Receipt, Printer, RefreshCw } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);

const panel =
  "rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] p-5 sm:p-6";

export default function RentReceiptGenerator() {
  const previewRef = useRef(null);
  const [receiptNo, setReceiptNo] = useState("RR-001");
  const [tenant, setTenant] = useState("");
  const [landlord, setLandlord] = useState("");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const receiptDate = useMemo(
    () =>
      new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    []
  );

  const monthLabel = useMemo(() => {
    if (!month) return "—";
    const [year, mon] = month.split("-");
    const date = new Date(Number(year), Number(mon) - 1, 1);
    if (Number.isNaN(date.getTime())) return month;
    return date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  }, [month]);

  const resetForm = () => {
    setReceiptNo("RR-001");
    setTenant("");
    setLandlord("");
    setAddress("");
    setAmount("");
    const d = new Date();
    setMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Seo page="rentReceiptGenerator" />

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .rent-receipt-print-area,
          .rent-receipt-print-area * { visibility: visible; }
          .rent-receipt-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2rem;
            background: white;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      <ToolHeroShell
        category="business-tools"
        icon={Receipt}
        title="Rent Receipt Generator"
        subtitle="Fill tenant and landlord details to generate a printable rent receipt with live preview."
        formLabel="Receipt details"
        formHint="Preview updates as you type"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className={`${panel} no-print`}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[var(--ftp-ink)]">Receipt fields</h2>
              <button
                type="button"
                onClick={resetForm}
                className="age-btn-ghost px-3 py-2 text-xs"
              >
                <RefreshCw size={12} /> Reset
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="receipt-no">
                  Receipt number
                </label>
                <input
                  id="receipt-no"
                  className={`${inputDark} mt-1.5`}
                  value={receiptNo}
                  onChange={(e) => setReceiptNo(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="rent-month">
                  Rent month
                </label>
                <input
                  id="rent-month"
                  type="month"
                  className={`${inputDark} mt-1.5`}
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="tenant-name">
                  Tenant name
                </label>
                <input
                  id="tenant-name"
                  className={`${inputDark} mt-1.5`}
                  value={tenant}
                  onChange={(e) => setTenant(e.target.value)}
                  placeholder="Tenant full name"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="landlord-name">
                  Landlord name
                </label>
                <input
                  id="landlord-name"
                  className={`${inputDark} mt-1.5`}
                  value={landlord}
                  onChange={(e) => setLandlord(e.target.value)}
                  placeholder="Landlord full name"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="property-address">
                  Property address
                </label>
                <textarea
                  id="property-address"
                  rows={3}
                  className={`${inputDark} mt-1.5 resize-y`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat / house, street, city, PIN"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-[var(--ftp-ink-soft)]" htmlFor="rent-amount">
                  Rent amount (INR)
                </label>
                <input
                  id="rent-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputDark} mt-1.5`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 15000"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="age-btn-primary mt-6"
            >
              <Printer className="h-4 w-4" /> Print receipt
            </button>
          </div>

          <div className={`${panel} lg:sticky lg:top-24`}>
            <h2 className="mb-5 text-lg font-bold text-[var(--ftp-ink)]">Live preview</h2>
            <div className="rounded-[1.25rem] border border-[var(--ftp-line)] bg-white p-6 shadow-sm">
              <div ref={previewRef} className="rent-receipt-print-area space-y-5 text-[var(--ftp-ink)]">
                <div className="border-b border-[var(--ftp-line)] pb-4 text-center">
                  <h2 className="text-xl font-bold uppercase tracking-wide">Rent Receipt</h2>
                  <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">
                    Receipt No: {receiptNo || "—"} · Date: {receiptDate}
                  </p>
                </div>

                <div className="space-y-3 text-sm leading-relaxed">
                  <p>
                    Received with thanks from{" "}
                    <strong>{tenant || "[Tenant name]"}</strong> the sum of{" "}
                    <strong>{formatINR(amount)}</strong> (
                    {amount ? `${Number(amount).toLocaleString("en-IN")} rupees only` : "amount in words"})
                    {" "}towards rent for the month of <strong>{monthLabel}</strong>.
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ftp-ink-soft)]">Property:</span>{" "}
                    {address || "[Property address]"}
                  </p>
                </div>

                <div className="grid gap-6 border-t border-[var(--ftp-line)] pt-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">
                      Tenant
                    </p>
                    <p className="mt-2 font-semibold">{tenant || "—"}</p>
                    <p className="mt-6 border-t border-[var(--ftp-line)] pt-2 text-xs text-[var(--ftp-ink-soft)]">
                      Signature
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--ftp-ink-soft)]">
                      Landlord
                    </p>
                    <p className="mt-2 font-semibold">{landlord || "—"}</p>
                    <p className="mt-6 border-t border-[var(--ftp-line)] pt-2 text-xs text-[var(--ftp-ink-soft)]">
                      Signature
                    </p>
                  </div>
                </div>

                <p className="text-center text-xs text-[var(--ftp-ink-soft)]">
                  This is a computer-generated receipt. Retain for your records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="business-tools"
        currentToolPath="/business-tools/rent-receipt-generator"
      />
    </>
  );
}
