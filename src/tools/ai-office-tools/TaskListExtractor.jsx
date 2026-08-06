import { ListChecks } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function TaskListExtractor() {
  return (
    <IoToolShell
      seoKey="taskListExtractor"
      category="ai-office-tools"
      path="/ai-office-tools/task-list-extractor"
      icon={ListChecks}
      title="Task List Extractor"
      subtitle="Extract action items from notes or transcripts."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.task_extract}
    />
  );
}
