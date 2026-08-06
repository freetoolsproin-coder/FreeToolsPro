import { Search } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function UrlInspector() {
  return (
    <IoToolShell
      seoKey="urlInspector"
      category="http-tools"
      path="/http-tools/url-inspector"
      icon={Search}
      title="URL Inspector"
      subtitle="Inspect URL structure and query params."
      actionLabel="Run"
      transform={transforms.url_inspect}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
