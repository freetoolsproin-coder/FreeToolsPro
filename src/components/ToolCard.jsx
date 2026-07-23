import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const prefetch = (url) => {
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = url;
  document.head.appendChild(link);
};

const removePrefetch = (url) => {
  document
    .querySelectorAll(`link[rel="prefetch"][href="${url}"]`)
    .forEach((link) => link.remove());
};

export default function ToolCard({ tool }) {
  const Icon = tool.icon;

  return (
    <Link
      to={tool.path}
      onMouseEnter={() => prefetch(tool.path)}
      onMouseLeave={() => removePrefetch(tool.path)}
      className="ftp-tool-card group"
    >
      <div className="ftp-tool-card__top">
        <div className="ftp-tool-card__icon">
          {Icon ? <Icon size={18} strokeWidth={1.75} aria-hidden="true" /> : null}
        </div>
        <ArrowUpRight
          size={15}
          className="ftp-tool-card__arrow"
          aria-hidden="true"
        />
      </div>

      <h3 className="ftp-tool-card__title ftp-display">{tool.name}</h3>
      <p className="ftp-tool-card__desc">{tool.desc}</p>
    </Link>
  );
}

export function CollectionCard({ collection }) {
  const Icon = collection.icon;
  const href = `/tools?cat=${collection.id}`;

  return (
    <Link to={href} className="ftp-collection-card group">
      <div className="ftp-collection-card__top">
        <div className="ftp-tool-card__icon">
          {Icon ? <Icon size={18} strokeWidth={1.75} aria-hidden="true" /> : null}
        </div>
        <ArrowUpRight size={15} className="ftp-tool-card__arrow" aria-hidden="true" />
      </div>

      <h3 className="ftp-collection-card__title ftp-display">{collection.label}</h3>
      <p className="ftp-collection-card__blurb">{collection.blurb}</p>

      <div className="ftp-collection-card__count">
        <span className="ftp-collection-card__count-num">{collection.count}</span>
        <span className="ftp-collection-card__count-label">tools</span>
      </div>
    </Link>
  );
}
