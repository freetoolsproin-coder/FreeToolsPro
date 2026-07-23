import { Link } from "react-router-dom";
import { tools } from "../../data/toolDefinitions";

export default function RelatedToolsAside({ paths = [], title = "Related tools" }) {
  const related = paths
    .map((path) => tools.find((t) => t.path === path && !t.isPageLink))
    .filter(Boolean);

  if (!related.length) return null;

  return (
    <div className="rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-4">
      <p className="text-sm font-semibold text-[var(--ftp-ink)]">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {related.map((tool) => (
          <li key={tool.path}>
            <Link
              to={tool.path}
              className="text-sm leading-6 text-[var(--ftp-ink-soft)] underline-offset-2 hover:text-[var(--ftp-ink)] hover:underline"
            >
              {tool.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
