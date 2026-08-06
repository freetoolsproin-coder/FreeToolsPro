import { Code2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CurlGenerator() {
  return (
    <IoToolShell
      seoKey="curlGenerator"
      category="api-tools"
      path="/api-tools/curl-generator"
      icon={Code2}
      title="cURL Generator"
      subtitle="Generate cURL commands from request fields."
      actionLabel="Run"
      transform={transforms.curl_gen}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
