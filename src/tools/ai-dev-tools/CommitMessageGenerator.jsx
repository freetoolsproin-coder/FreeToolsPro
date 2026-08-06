import { GitBranch } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CommitMessageGenerator() {
  return (
    <IoToolShell
      seoKey="commitMessageGenerator"
      category="ai-dev-tools"
      path="/ai-dev-tools/commit-message-generator"
      icon={GitBranch}
      title="Commit Message Generator"
      subtitle="Draft conventional commit messages."
      actionLabel="Run"
      transform={transforms.commit_msg}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
