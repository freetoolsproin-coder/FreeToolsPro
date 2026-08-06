import { Activity } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function HttpStatusChecker() {
  return (
    <IoToolShell
      seoKey="httpStatusChecker"
      category="http-tools"
      path="/http-tools/http-status-checker"
      icon={Activity}
      title="HTTP Status Checker"
      subtitle="Check HTTP status for a URL."
      actionLabel="Run"
      transform={transforms.http_status}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
