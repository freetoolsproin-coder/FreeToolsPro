import { Package } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function DockerfileGenerator() {
  return (
    <IoToolShell
      seoKey="dockerfileGenerator"
      category="ai-dev-tools"
      path="/ai-dev-tools/dockerfile-generator"
      icon={Package}
      title="Dockerfile Generator"
      subtitle="Generate Dockerfiles for common stacks."
      actionLabel="Run"
      transform={transforms.dockerfile}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
