import { tools } from "../data/toolDefinitions";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function shuffleArray(array) {
  const next = [...array];
  let currentIndex = next.length;
  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [next[currentIndex], next[randomIndex]] = [next[randomIndex], next[currentIndex]];
  }
  return next;
}

export default function ExploreRelatedTools({ currentToolPath }) {
  const relatedTools = shuffleArray(
    tools.filter((tool) => !tool.isPageLink && tool.path !== currentToolPath)
  ).slice(0, 5);

  return (
    <div className="mt-10">
      <h4 className="ftp-display !text-xl !font-semibold !tracking-tight">Continue exploring</h4>
      <p className="!pb-2 text-[var(--ftp-ink-soft)]">
        More free utilities from the FreeToolsPro suite.
      </p>
      <div className="tools-container">
        {relatedTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link to={tool.path} key={tool.id} className="tool-card">
              <div className="tool-icon">{Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : null}</div>
              <div className="tool-name">{tool.name}</div>
              <div className="tool-desc">{tool.desc}</div>
              <div className="tool-arrow" aria-hidden="true">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
