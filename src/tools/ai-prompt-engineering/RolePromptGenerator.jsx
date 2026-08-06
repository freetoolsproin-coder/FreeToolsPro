import { UserRound } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function RolePromptGenerator() {
  return (
    <IoToolShell
      seoKey="rolePromptGenerator"
      category="ai-prompt-engineering"
      path="/ai-prompt-engineering/role-prompt-generator"
      icon={UserRound}
      title="Role Prompt Generator"
      subtitle="Generate role-based system prompts."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.role_prompt}
    />
  );
}
