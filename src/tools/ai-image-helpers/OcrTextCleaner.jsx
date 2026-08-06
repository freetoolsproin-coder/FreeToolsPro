import { ScanText } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function OcrTextCleaner() {
  return (
    <IoToolShell
      seoKey="ocrTextCleaner"
      category="ai-image-helpers"
      path="/ai-image-helpers/ocr-text-cleaner"
      icon={ScanText}
      title="OCR Text Cleaner"
      subtitle="Clean messy OCR text for reuse."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.ocr_clean}
    />
  );
}
