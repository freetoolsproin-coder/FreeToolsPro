import { Bug } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function BugFinder() {
  return (
    <IoToolShell
      seoKey="bugFinder"
      category="ai-coding-tools"
      path="/ai-coding-tools/bug-finder"
      icon={Bug}
      title="Bug Finder"
      subtitle="Scan code for common bug and security patterns."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.bug_finder}
    />
  );
}
