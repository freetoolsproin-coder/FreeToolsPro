import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function InvoiceGenerator() {
  const [seller, setSeller] = useState("Your Business Pvt Ltd");
  const [buyer, setBuyer] = useState("Client Name");
  const [item, setItem] = useState("Consulting services");
  const [amount, setAmount] = useState(10000);
  const [rate, setRate] = useState(18);
  const [gstin, setGstin] = useState("22AAAAA0000A1Z5");

  const doc = useMemo(() => {
    const base = Number(amount) || 0;
    const tax = 0;
    const total = base + tax;
    const cgst = tax / 2;
    const sgst = tax / 2;
    return [
      "INVOICE",
      "Seller: " + seller,
      "Bill to: " + buyer,
      "Item: " + item,
      "Taxable: ₹" + base.toLocaleString("en-IN"),
      
      
      "Total: ₹" + Math.round(total).toLocaleString("en-IN"),
      "Date: " + new Date().toLocaleDateString("en-IN"),
    ].filter(Boolean).join("\n");
  }, [seller, buyer, item, amount, rate, gstin]);

  return (
    <>
      <Seo page="invoiceGenerator" />
      <ToolHeroShell category="business-finance" icon={FileText} title="Invoice Generator" subtitle="Create a simple business invoice you can copy or print." layout="stack" panel="light">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">Seller<input className={inputDark + " mt-1.5"} value={seller} onChange={(e) => setSeller(e.target.value)} /></label>
          <label className="text-sm">Buyer<input className={inputDark + " mt-1.5"} value={buyer} onChange={(e) => setBuyer(e.target.value)} /></label>
          <label className="text-sm sm:col-span-2">Item / description<input className={inputDark + " mt-1.5"} value={item} onChange={(e) => setItem(e.target.value)} /></label>
          <label className="text-sm">Amount (₹)<input type="number" className={inputDark + " mt-1.5"} value={amount} onChange={(e) => setAmount(e.target.value)} /></label>
          
        </div>
        <textarea className={textareaDark + " mt-4 min-h-[200px]"} value={doc} readOnly />
        <button type="button" className="mt-3 rounded-[14px] bg-[var(--ftp-ink)] px-5 py-2.5 text-sm font-semibold text-white" onClick={() => navigator.clipboard.writeText(doc)}>Copy invoice</button>
      </ToolHeroShell>
      <ToolContentLayout category="business-finance" currentToolPath="/business-finance/invoice-generator" />
    </>
  );
}
