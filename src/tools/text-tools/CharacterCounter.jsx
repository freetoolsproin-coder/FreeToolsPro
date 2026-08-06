import { Type } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CharacterCounter() {
  return (
    <IoToolShell
      seoKey="characterCounter"
      category="text-tools"
      path="/text-tools/character-counter"
      icon={Type}
      title="Character Counter"
      subtitle="Count characters, words, and lines."
      actionLabel="Run"
      transform={transforms.char_count}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
