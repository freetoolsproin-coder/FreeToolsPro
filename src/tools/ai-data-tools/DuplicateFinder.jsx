import { Files } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function DuplicateFinder() {
  return (
    <IoToolShell
      seoKey="duplicateFinder"
      category="ai-data-tools"
      path="/ai-data-tools/duplicate-finder"
      icon={Files}
      title="Duplicate Finder"
      subtitle="Find duplicate lines in a dataset dump."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.duplicate_finder}
    />
  );
}
