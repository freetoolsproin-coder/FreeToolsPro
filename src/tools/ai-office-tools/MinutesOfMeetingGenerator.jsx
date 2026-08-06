import { ClipboardList } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function MinutesOfMeetingGenerator() {
  return (
    <IoToolShell
      seoKey="minutesOfMeetingGenerator"
      category="ai-office-tools"
      path="/ai-office-tools/minutes-of-meeting-generator"
      icon={ClipboardList}
      title="Minutes of Meeting Generator"
      subtitle="Generate MoM structure from discussion points."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.mom_gen}
    />
  );
}
