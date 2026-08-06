import { Link2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function UrlParser() {
  return (
    <IoToolShell
      seoKey="urlParser"
      category="http-tools"
      path="/http-tools/url-parser"
      icon={Link2}
      title="URL Parser"
      subtitle="Parse URL components."
      actionLabel="Run"
      transform={transforms.url_parse}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
