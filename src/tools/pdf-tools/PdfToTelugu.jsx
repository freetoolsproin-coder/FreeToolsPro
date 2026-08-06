import PdfToolPage from "./PdfToolPage";
import PdfToWord from "./PdfToWord";

export default function PdfToTelugu() {
  return (
    <PdfToolPage
      title="PDF to Telugu"
      subtitle="Extract or translate PDF text to Telugu with OCR and page-range controls."
      path="/pdf-tools/pdf-to-telugu"
      seoPage="pdfToTelugu"
    >
      <PdfToWord
        language="Telugu"
        convertLabel="Convert PDF to Telugu"
        downloadLabel="Download Telugu document"
        downloadExt="docx"
        scriptPattern={/[\u0C00-\u0C7F]/}
        translate
      />
    </PdfToolPage>
  );
}
