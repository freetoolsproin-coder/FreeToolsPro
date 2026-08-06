import PdfToolPage from "./PdfToolPage";
import ProtectUnlockPdf from "./ProtectUnlockPdf";

export default function ProtectUnlockPdfPage() {
  return (
    <PdfToolPage
      title="Protect & Unlock PDF"
      subtitle="Add a password to a PDF or remove an open password—processed locally in your browser."
      path="/pdf-tools/protect-unlock-pdf"
    >
      <ProtectUnlockPdf />
    </PdfToolPage>
  );
}
