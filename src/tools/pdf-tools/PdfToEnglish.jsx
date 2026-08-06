import PdfToolPage from "./PdfToolPage";
import PdfToWord from "./PdfToWord";

export default function PdfToEnglish() {
  return (
    <PdfToolPage
      title="PDF to English"
      subtitle="Translate regional-language PDF text to English with OCR and page ranges."
      path="/pdf-tools/pdf-to-english"
      seoPage="pdfToEnglish"
    >
      <PdfToWord
        language="English"
        convertLabel="Convert PDF to English"
        downloadLabel="Download English document"
        downloadExt="docx"
        scriptPattern={/[A-Za-z]/}
        translate
      />
    </PdfToolPage>
  );
}
