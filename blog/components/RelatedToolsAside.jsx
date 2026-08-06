import { Link } from "react-router-dom";
import { ArrowUpRight, Wrench } from "lucide-react";
import { tools } from "../../src/data/toolDefinitions";
import { BRAND } from "../../src/seo/brand";
import { isBlogHostname } from "../data/blogSite";

export default function RelatedToolsAside({ paths = [], title = "Related tools" }) {
  const related = paths
    .map((path) => tools.find((t) => t.path === path && !t.isPageLink))
    .filter(Boolean);
  const blogHost = isBlogHostname();

  if (!related.length) return null;

  return (
    <div className="blog-aside-panel">
      <div className="blog-aside-panel__head">
        <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
        <p>{title}</p>
      </div>
      <ul className="blog-aside-panel__list">
        {related.map((tool) => (
          <li key={tool.path}>
            {blogHost ? (
              <a href={`${BRAND.url}${tool.path}`} className="blog-aside-panel__link">
                <span>{tool.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden="true" />
              </a>
            ) : (
              <Link to={tool.path} className="blog-aside-panel__link">
                <span>{tool.name}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-40" aria-hidden="true" />
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
