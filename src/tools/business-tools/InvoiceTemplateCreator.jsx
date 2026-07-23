import { useMemo, useRef, useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  Printer,
  RefreshCw,
  Check,
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

export default function InvoiceTemplateCreator() {
  const previewRef = useRef(null);
  const [businessName, setBusinessName] = useState("Your Business Pvt Ltd");
  const [clientName, setClientName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [taxPercent, setTaxPercent] = useState(18);
  const [items, setItems] = useState([emptyItem()]);
  const [copied, setCopied] = useState(false);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + (Number(item.qty) || 0) * (Number(item.rate) || 0),
      0
    );
    const tax = (subtotal * (Number(taxPercent) || 0)) / 100;
    return { subtotal, tax, total: subtotal + tax };
  }, [items, taxPercent]);

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((item) => item.id !== id)));
  };

  const buildInvoiceText = () => {
    const lines = [
      `INVOICE`,
      `Business: ${businessName || "—"}`,
      `Client: ${clientName || "—"}`,
      `Invoice #: ${invoiceNumber || "—"}`,
      `Date: ${invoiceDate || "—"}`,
      "",
      "Items:",
      ...items.map(
        (item, i) =>
          `${i + 1}. ${item.description || "Item"} — Qty: ${item.qty} × ${formatINR(item.rate)} = ${formatINR((Number(item.qty) || 0) * (Number(item.rate) || 0))}`
      ),
      "",
      `Subtotal: ${formatINR(totals.subtotal)}`,
      `Tax (${taxPercent}%): ${formatINR(totals.tax)}`,
      `Total: ${formatINR(totals.total)}`,
    ];
    return lines.join("\n");
  };

  const copyInvoice = async () => {
    await navigator.clipboard.writeText(buildInvoiceText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printInvoice = () => {
    const content = previewRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) {
      window.print();
      return;
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceNumber || ""}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 32px; color: #0f172a; }
            h1 { margin: 0 0 4px; font-size: 22px; }
            .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 10px 8px; text-align: left; font-size: 13px; }
            th { background: #f8fafc; }
            .totals { margin-top: 20px; text-align: right; font-size: 14px; }
            .totals strong { font-size: 18px; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  };

  const resetForm = () => {
    setBusinessName("Your Business Pvt Ltd");
    setClientName("");
    setInvoiceNumber("INV-001");
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setTaxPercent(18);
    setItems([emptyItem()]);
  };

  return (
    <>
      <Seo page="invoiceTemplateCreator" />

      <ToolHeroShell
        icon={FileText}
        title="Invoice Template Creator"
        subtitle="Build professional invoices with a live preview—add line items, set tax, then copy or print."
        category="business-tools"
        formLabel="Invoice details"
        layout="stack"
        panel="light"
      >
        <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6">
            <h2 className="mb-5 text-lg font-bold text-slate-800">Invoice details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="biz-name">
                  Business name
                </label>
                <input
                  id="biz-name"
                  className={`${inputDark} mt-1.5`}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="client-name">
                  Client name
                </label>
                <input
                  id="client-name"
                  className={`${inputDark} mt-1.5`}
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client / company"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="inv-no">
                  Invoice number
                </label>
                <input
                  id="inv-no"
                  className={`${inputDark} mt-1.5`}
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600" htmlFor="inv-date">
                  Date
                </label>
                <input
                  id="inv-date"
                  type="date"
                  className={`${inputDark} mt-1.5`}
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Line items</p>
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

            <div className="mt-5">
              <label className="text-sm font-medium text-slate-600" htmlFor="tax-pct">
                Tax %
              </label>
              <input
                id="tax-pct"
                type="number"
                min="0"
                step="0.01"
                className={`${inputDark} mt-1.5`}
                value={taxPercent}
                onChange={(e) => setTaxPercent(e.target.value)}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copyInvoice}
                className="inline-flex items-center gap-2 rounded-2xl bg-[var(--ftp-ink)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Copy invoice text"}
              </button>
              <button
                type="button"
                onClick={printInvoice}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Printer className="h-4 w-4" /> Print preview
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
              <div ref={previewRef} className="invoice-print-area space-y-5 text-slate-900">
              <div>
                <h2 className="text-xl font-bold">{businessName || "Business name"}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Invoice #{invoiceNumber || "—"} · {invoiceDate || "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Bill to
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
              <div className="totals space-y-1.5 text-right text-sm">
                <p>
                  Subtotal: <span className="font-semibold">{formatINR(totals.subtotal)}</span>
                </p>
                <p>
                  Tax ({taxPercent || 0}%):{" "}
                  <span className="font-semibold">{formatINR(totals.tax)}</span>
                </p>
                <p className="pt-2 text-lg">
                  <strong>Total: {formatINR(totals.total)}</strong>
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolPageContent
        category="business-tools"
        currentToolPath="/business-tools/invoice-template-creator" />
    </>
  );
}
