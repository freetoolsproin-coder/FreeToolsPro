import PdfToolPage from "./PdfToolPage";
import ExtractPdfPages from "./ExtractPdfPages";

export default function ExtractPdfPagesPage() {
  return (
    <PdfToolPage
      title="Extract PDF Pages"
      subtitle="Pull selected pages from a PDF into a new file—by range, in your browser."
      path="/pdf-tools/extract-pdf-pages"
    >
      <ExtractPdfPages />
    </PdfToolPage>
  );
}
