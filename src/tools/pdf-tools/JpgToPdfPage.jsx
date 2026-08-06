import PdfToolPage from "./PdfToolPage";
import JpgToPdf from "./JpgToPdf";

export default function JpgToPdfPage() {
  return (
    <PdfToolPage
      title="JPG to PDF"
      subtitle="Combine JPG, PNG, or WebP images into one PDF with A4/Letter sizing and reordering."
      path="/pdf-tools/jpg-to-pdf"
    >
      <JpgToPdf />
    </PdfToolPage>
  );
}
