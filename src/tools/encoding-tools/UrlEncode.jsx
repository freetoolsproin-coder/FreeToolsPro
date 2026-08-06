import { Link2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function UrlEncode() {
  return (
    <IoToolShell
      seoKey="urlEncode"
      category="encoding-tools"
      path="/encoding-tools/url-encode"
      icon={Link2}
      title="URL Encode"
      subtitle="Percent-encode URL strings."
      actionLabel="Run"
      transform={transforms.url_encode}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
