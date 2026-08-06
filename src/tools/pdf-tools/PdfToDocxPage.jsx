import PdfToolPage from "./PdfToolPage";
import PdfToWord from "./PdfToWord";

export default function PdfToDocxPage() {
  return (
    <PdfToolPage
      title="PDF to DOCX"
      subtitle="Turn a text-based PDF into DOCX with OCR, page ranges, and live text preview."
      path="/pdf-tools/pdf-to-docx"
    >
      <PdfToWord
        convertLabel="Convert to DOCX"
        downloadLabel="Download DOCX"
        downloadExt="docx"
      />
    </PdfToolPage>
  );
}
