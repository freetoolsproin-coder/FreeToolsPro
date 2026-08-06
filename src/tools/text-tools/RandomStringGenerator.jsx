import { Shuffle } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function RandomStringGenerator() {
  return (
    <IoToolShell
      seoKey="randomStringGenerator"
      category="text-tools"
      path="/text-tools/random-string-generator"
      icon={Shuffle}
      title="Random String Generator"
      subtitle="Generate random strings."
      actionLabel="Run"
      transform={transforms.random_string}
      multiline={false}
      placeholder="Paste input…"
    />
  );
}
