import { Type } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function CaseConverter() {
  return (
    <IoToolShell
      seoKey="caseConverter"
      category="text-tools"
      path="/text-tools/case-converter"
      icon={Type}
      title="Case Converter"
      subtitle="Convert camel, snake, kebab cases."
      actionLabel="Run"
      transform={transforms.case_convert}
      multiline={true}
      placeholder="helloWorld\\nsnake"
    />
  );
}
