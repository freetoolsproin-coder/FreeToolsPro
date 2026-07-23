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

export default function RelatedTools({ category, currentToolPath }) {
  const relatedTools = category
    ? shuffleArray(
        tools.filter((tool) => tool.category === category && tool.path !== currentToolPath)
      ).slice(0, 12)
    : shuffleArray(tools.filter((tool) => !tool.isPageLink)).slice(0, 12);

  if (relatedTools.length === 0) return null;

  return (
    <nav
      aria-label="Related tools"
      className="rounded-[1.25rem] border border-[var(--ftp-line)] bg-white/70 p-5 shadow-[0_16px_40px_rgba(7,16,31,0.05)] backdrop-blur-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--ftp-ink-soft)]">
        Related
      </p>
      <ul className="mt-4 space-y-1">
        {relatedTools.map((tool) => (
          <li key={tool.id}>
            <Link
              to={tool.path}
              className="group flex items-center justify-between rounded-lg px-2 py-2.5 text-sm font-medium text-[var(--ftp-ink-soft)] transition hover:bg-teal-50/80 hover:text-teal-900"
            >
              <span className="pr-2">{tool.name}</span>
              <ArrowRight
                size={14}
                className="shrink-0 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
