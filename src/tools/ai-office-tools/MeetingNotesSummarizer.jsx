import { FileText } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function MeetingNotesSummarizer() {
  return (
    <IoToolShell
      seoKey="meetingNotesSummarizer"
      category="ai-office-tools"
      path="/ai-office-tools/meeting-notes-summarizer"
      icon={FileText}
      title="Meeting Notes Summarizer"
      subtitle="Turn rough notes into a concise meeting summary."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.meeting_summary}
    />
  );
}
