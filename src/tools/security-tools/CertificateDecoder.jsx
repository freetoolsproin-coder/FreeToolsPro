import { FileCheck2 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CertificateDecoder() {
  return (
    <IoToolShell
      seoKey="certificateDecoder"
      category="security-tools"
      path="/security-tools/certificate-decoder"
      icon={FileCheck2}
      title="Certificate Decoder"
      subtitle="Inspect PEM certificate size/fields."
      actionLabel="Run"
      transform={transforms.cert_decode}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
