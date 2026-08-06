import { GitBranch } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function RedirectChecker() {
  return (
    <IoToolShell
      seoKey="redirectChecker"
      category="http-tools"
      path="/http-tools/redirect-checker"
      icon={GitBranch}
      title="Redirect Checker"
      subtitle="Guidance for redirect-chain QA."
      actionLabel="Run"
      transform={transforms.redirect}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
