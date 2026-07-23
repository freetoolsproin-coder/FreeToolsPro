import { useMemo, useState } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw,
} from "lucide-react";
import Seo from "../../components/Seo";
import ToolPageContent from "../../components/ToolPageContent";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";

const emptyItem = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  description: "",
  qty: 1,
  rate: 0,
});

const formatINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n || 0);

export default function QuotationGenerator() {
  const [companyName, setCompanyName] = useState("Your Company Pvt Ltd");
  const [clientName, setClientName] = useState("");
  const [quoteNumber, setQuoteNumber] = useState("QT-001");
  const [validityDays, setValidityDays] = useState(30);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(18);
  const [items, setItems] = useState([emptyItem()]);
  const [copied, setCopied] = useState(false);

  const quoteDate = useMemo(() => new Date().toLocaleDateString("en-IN"), []);

  const validUntil = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + (Number(validityDays) || 0));
    return d.toLocaleDateString("en-IN");
  }, [validityDays]);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0),
      0
    );
    const discount = (subtotal * (Number(discountPercent) || 0)) / 100;
    const taxable = Math.max(0, subtotal - discount);
    const tax = (taxable * (Number(taxPercent) || 0)) / 100;
    return { subtotal, discount, taxable, tax, total: taxable + tax };
  }, [items, discountPercent, taxPercent]);

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((item) => item.id !== id)));
  };

  const buildQuoteText = () => {
    const lines = [
      `QUOTATION`,
      `Company: ${companyName || "—"}`,
      `Client: ${clientName || "—"}`,
      `Quote #: ${quoteNumber || "—"}`,
      `Date: ${quoteDate}`,
      `Valid for: ${validityDays || 0} days (until ${validUntil})`,
      "",
      "Items:",
      ...items.map(
        (item, i) =>
          `${i + 1}. ${item.description || "Item"} — Qty: ${item.qty} × ${formatINR(item.rate)} = ${formatINR((Number(item.qty) || 0) * (Number(item.rate) || 0))}`
      ),
      "",
      `Subtotal: ${formatINR(totals.subtotal)}`,
      `Discount (${discountPercent}%): -${formatINR(totals.discount)}`,
      `Taxable: ${formatINR(totals.taxable)}`,
      `Tax (${taxPercent}%): ${formatINR(totals.tax)}`,
      `Grand Total: ${formatINR(totals.total)}`,
    ];
    return lines.join("\n");
  };

  const copyQuote = async () => {
    await navigator.clipboard.writeText(buildQuoteText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setCompanyName("Your Company Pvt Ltd");
    setClientName("");
    setQuoteNumber("QT-001");
    setValidityDays(30);
    setDiscountPercent(0);
    setTaxPercent(18);
    setItems([emptyItem()]);
  };

  return (
    <>
      <Seo page="quotationGenerator" />

      <ToolHeroShell
        icon={ClipboardList}
        title="Quotation Generator"
        subtitle="Create price quotes with discount, tax & validity—then copy the live preview to send."
        category="business-tools"
        formLabel="Quote details"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-800">Quote details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="company-name">
                  Company name
                </label>
                <input
                  id="company-name"
                  className={`${inputDark} mt-1.5`}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="q-client">
                  Client name
                </label>
                <input
                  id="q-client"
                  className={`${inputDark} mt-1.5`}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Prospect / client"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="quote-no">
                  Quote number
                </label>
                <input
                  id="quote-no"
                  className={`${inputDark} mt-1.5`}
                  value={quoteNumber}
                  onChange={(e) => setQuoteNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="validity">
                  Validity (days)
                </label>
                <input
                  id="validity"
                  type="number"
                  min="1"
                  className={`${inputDark} mt-1.5`}
                  value={validityDays}
                  onChange={(e) => setValidityDays(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="discount">
                  Discount %
                </label>
                <input
                  id="discount"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputDark} mt-1.5`}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="q-tax">
                  Tax %
                </label>
                <input
                  id="q-tax"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`${inputDark} mt-1.5`}
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Quote items</p>
                <button
                  type="button"
                  onClick={() => setItems((prev) => [...prev, emptyItem()])}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-50"
                >
                  <Plus className="h-3.5 w-3.5" /> Add item
                </button>
              </div>
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 sm:grid-cols-[1fr_70px_100px_36px]"
                  >
                    <input
                      className={`${inputDark} mt-0`}
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      className={`${inputDark} mt-0`}
                      placeholder="Qty"
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className={`${inputDark} mt-0`}
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex h-10 items-center justify-center rounded-xl text-rose-500 transition hover:bg-rose-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyQuote}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--ftp-ink)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy quotation"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-700"
              >
                <RefreshCw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="mb-5 text-lg font-bold text-slate-800">Live preview</h2>
            <div className="rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-5 text-slate-900">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
                    Quotation
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{companyName || "Company name"}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Quote #{quoteNumber || "—"} · {quoteDate}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                  <p className="text-slate-500">Valid until</p>
                  <p className="font-semibold text-slate-900">{validUntil}</p>
                  <p className="text-xs text-slate-400">({validityDays || 0} days)</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Prepared for
                </p>
                <p className="mt-1 font-semibold">{clientName || "Client name"}</p>
              </div>

              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-2 font-medium">Description</th>
                    <th className="pb-2 font-medium">Qty</th>
                    <th className="pb-2 font-medium">Rate</th>
                    <th className="pb-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const amount =
                      (Number(item.qty) || 0) * (Number(item.rate) || 0);
                    return (
                      <tr key={item.id} className="border-b border-slate-100">
                        <td className="py-2.5">{item.description || "—"}</td>
                        <td className="py-2.5">{item.qty || 0}</td>
                        <td className="py-2.5">{formatINR(item.rate)}</td>
                        <td className="py-2.5 text-right font-medium">
                          {formatINR(amount)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="space-y-1.5 text-right text-sm">
                <p>
                  Subtotal: <span className="font-semibold">{formatINR(totals.subtotal)}</span>
                </p>
                <p>
                  Discount ({discountPercent || 0}%):{" "}
                  <span className="font-semibold text-rose-600">
                    −{formatINR(totals.discount)}
                  </span>
                </p>
                <p>
                  Taxable amount:{" "}
                  <span className="font-semibold">{formatINR(totals.taxable)}</span>
                </p>
                <p>
                  Tax ({taxPercent || 0}%):{" "}
                  <span className="font-semibold">{formatINR(totals.tax)}</span>
                </p>
                <p className="pt-2 text-lg font-bold text-slate-950">
                  Grand total: {formatINR(totals.total)}
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="business-tools"
        currentToolPath="/business-tools/quotation-generator" />
    </>
  );
}
