import { Link2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function UrlDecode() {
  return (
    <IoToolShell
      seoKey="urlDecode"
      category="encoding-tools"
      path="/encoding-tools/url-decode"
      icon={Link2}
      title="URL Decode"
      subtitle="Decode percent-encoded URLs."
      actionLabel="Run"
      transform={transforms.url_decode}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
