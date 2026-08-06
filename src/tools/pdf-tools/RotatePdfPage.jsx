import PdfToolPage from "./PdfToolPage";
import RotatePdf from "./RotatePdf";

export default function RotatePdfPage() {
  return (
    <PdfToolPage
      title="Rotate PDF"
      subtitle="Rotate all pages or one page in a PDF—90°, 180°, or 270°—in your browser."
      path="/pdf-tools/rotate-pdf"
    >
      <RotatePdf />
    </PdfToolPage>
  );
}
