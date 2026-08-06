import PdfToolPage from "./PdfToolPage";
import CompressPdf from "./CompressPdf";

export default function CompressPdfPage() {
  return (
    <PdfToolPage
      title="Compress PDF"
      subtitle="Reduce PDF file size with light, balanced, or maximum compression modes."
      path="/pdf-tools/compress-pdf"
    >
      <CompressPdf />
    </PdfToolPage>
  );
}
