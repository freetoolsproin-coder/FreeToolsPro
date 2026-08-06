import { Layers } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function KeywordClustering() {
  return (
    <IoToolShell
      seoKey="keywordClustering"
      category="ai-seo-tools"
      path="/ai-seo-tools/keyword-clustering"
      icon={Layers}
      title="Keyword Clustering"
      subtitle="Group keywords into topical clusters."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.keyword_cluster}
    />
  );
}
