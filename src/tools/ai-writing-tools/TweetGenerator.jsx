import { MessageSquareText } from "lucide-react";
import IoToolShell from "../_shared/IoToolShell";
import { aiTransforms } from "../_shared/aiTransforms";

export default function TweetGenerator() {
  return (
    <IoToolShell
      seoKey="tweetGenerator"
      category="ai-writing-tools"
      path="/ai-writing-tools/tweet-generator"
      icon={MessageSquareText}
      title="Tweet Generator"
      subtitle="Generate short tweet options from an idea."
      actionLabel="Generate"
      multiline={true}
      placeholder="Paste input or topic…"
      transform={aiTransforms.tweet_gen}
    />
  );
}
