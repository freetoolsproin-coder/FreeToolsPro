import { Receipt } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function InvoiceDescriptionWriter() {
  return (
    <IoToolShell
      seoKey="invoiceDescriptionWriter"
      category="ai-office-tools"
      path="/ai-office-tools/invoice-description-writer"
      icon={Receipt}
      title="Invoice Description Writer"
      subtitle="Write clean invoice line descriptions."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.invoice_desc}
    />
  );
}
