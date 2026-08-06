import PdfToolPage from "./PdfToolPage";
import PdfEditor from "./PdfEditor";

export default function PdfEditorPage() {
  return <PdfToolPage title="PDF Editor" subtitle="Add text overlays to a PDF and download the updated file without uploading it." path="/pdf-tools/pdf-editor" seoPage="pdfEditor">
    <PdfEditor />
  </PdfToolPage>;
}
