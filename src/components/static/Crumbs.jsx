// Breadcrumb bar for inner pages. Site search lives in the header (Ctrl/⌘ K), not here.
/** trail: [[href, label], …, [null, current page label]] */
export function CrumbBar({ trail, className = "" }) {
  return (
    <div className={`crumbbar ${className}`}>
      <nav className="crumbs" aria-label="Breadcrumb">
        <ol>
          {trail.map(([href, label], i) =>
            href ? (
              <li key={i}>
                <a href={href}>{label}</a>
              </li>
            ) : (
              <li key={i} aria-current="page">
                {label}
              </li>
            )
          )}
        </ol>
      </nav>
    </div>
  );
}
