import PdfToolPage from "./PdfToolPage";
import PdfToJpg from "./PdfToJpg";

export default function PdfToJpgPage() {
  return <PdfToolPage title="PDF to JPG" subtitle="Export PDF pages as JPG, PNG, or WebP with quality, scale, and range controls." path="/pdf-tools/pdf-to-jpg" seoPage="pdfToJpg">
    <PdfToJpg />
  </PdfToolPage>;
}
