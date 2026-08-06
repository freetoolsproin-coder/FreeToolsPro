import PdfToolPage from "./PdfToolPage";
import PdfToWord from "./PdfToWord";

export default function PdfToHindi() {
  return (
    <PdfToolPage
      title="PDF to Hindi"
      subtitle="Extract or translate PDF text to Hindi with OCR and page-range controls."
      path="/pdf-tools/pdf-to-hindi"
      seoPage="pdfToHindi"
    >
      <PdfToWord
        language="Hindi"
        convertLabel="Convert PDF to Hindi"
        downloadLabel="Download Hindi document"
        downloadExt="docx"
        scriptPattern={/[\u0900-\u097F]/}
        translate
      />
    </PdfToolPage>
  );
}
