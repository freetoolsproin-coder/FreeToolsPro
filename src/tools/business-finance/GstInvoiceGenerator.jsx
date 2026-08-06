import { useMemo, useState } from "react";
import { ReceiptIndianRupee } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function GstInvoiceGenerator() {
  const [seller, setSeller] = useState("Your Business Pvt Ltd");
  const [buyer, setBuyer] = useState("Client Name");
  const [item, setItem] = useState("Consulting services");
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [gstin, setGstin] = useState("22AAAAA0000A1Z5");

  const doc = useMemo(() => {
    const base = Number(amount) || 0;
    const tax = (base * (Number(rate) || 0)) / 100;
    const total = base + tax;
    const cgst = tax / 2;
    const sgst = tax / 2;
    return [
      "INVOICE",
      "Seller: " + seller + " | GSTIN: " + gstin,
      "Bill to: " + buyer,
      "Item: " + item,
      "Taxable: ₹" + base.toLocaleString("en-IN"),
      "CGST: ₹" + Math.round(cgst).toLocaleString("en-IN"),
      "SGST: ₹" + Math.round(sgst).toLocaleString("en-IN"),
      "Total: ₹" + Math.round(total).toLocaleString("en-IN"),
      "Date: " + new Date().toLocaleDateString("en-IN"),
    ].filter(Boolean).join("\n");
  }, [seller, buyer, item, amount, rate, gstin]);

  return (
    <>
      <Seo page="gstInvoiceGenerator" />
      <ToolHeroShell category="business-finance" icon={ReceiptIndianRupee} title="GST Invoice Generator" subtitle="Generate a GST-style invoice with taxable value and tax." layout="stack" panel="light">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Seller<input className={inputDark + " mt-1.5"} value={seller} onChange={(e) => setSeller(e.target.value)} /></label>
          <label className="text-sm">Buyer<input className={inputDark + " mt-1.5"} value={buyer} onChange={(e) => setBuyer(e.target.value)} /></label>
          <label className="text-sm sm:col-span-2">Item / description<input className={inputDark + " mt-1.5"} value={item} onChange={(e) => setItem(e.target.value)} /></label>
          <label className="text-sm">Amount (₹)<input type="number" className={inputDark + " mt-1.5"} value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
          <label className="text-sm">GST %<input type="number" className={inputDark + " mt-1.5"} value={rate} onChange={(e) => setRate(e.target.value)} /></label>
          <label className="text-sm sm:col-span-2">GSTIN<input className={inputDark + " mt-1.5"} value={gstin} onChange={(e) => setGstin(e.target.value)} /></label>
        </div>
        <textarea className={textareaDark + " mt-4 min-h-[200px]"} value={doc} readOnly />
        <button type="button" className="mt-3 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => navigator.clipboard.writeText(doc)}>Copy invoice</button>
      </ToolHeroShell>
      <ToolContentLayout category="business-finance" currentToolPath="/business-finance/gst-invoice-generator" />
    </>
  );
}
