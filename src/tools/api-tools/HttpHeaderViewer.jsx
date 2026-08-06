import { ListOrdered } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HttpHeaderViewer() {
  return (
    <IoToolShell
      seoKey="httpHeaderViewer"
      category="api-tools"
      path="/api-tools/http-header-viewer"
      icon={ListOrdered}
      title="HTTP Header Viewer"
      subtitle="Parse and view HTTP headers."
      actionLabel="Run"
      transform={transforms.http_headers}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
