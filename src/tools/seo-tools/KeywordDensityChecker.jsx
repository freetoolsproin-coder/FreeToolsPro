import { BarChart3 } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { transforms } from "../_shared/devTransforms";

export default function KeywordDensityChecker() {
  return (
    <IoToolShell
      seoKey="keywordDensityChecker"
      category="seo-tools"
      path="/seo-tools/keyword-density-checker"
      icon={BarChart3}
      title="Keyword Density Checker"
      subtitle="Analyze keyword density."
      actionLabel="Run"
      transform={transforms.keyword_density}
      multiline={true}
      placeholder="Paste input…"
    />
  );
}
