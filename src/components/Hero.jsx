import { Search } from "lucide-react";
import { openCommandPalette } from "../data/homeSections";

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || "");
}

export default function Hero({ onSearch, title, subtitle, searchValue = "" }) {
  const isHome = !title;
  const modKey = isMac() ? "⌘" : "Ctrl";

  if (!isHome) {
    return (
      <section className="flat-hero flat-hero--page" aria-labelledby="flat-hero-heading">
        <div className="flat-hero__inner">
          <p className="flat-hero__brand ftp-display">FreeToolsPro</p>
          <h1 id="flat-hero-heading" className="flat-hero__title ftp-display">
            {title}
          </h1>
          {subtitle ? <p className="flat-hero__text">{subtitle}</p> : null}
        </div>
      </section>
    );
  }

  return (
    <section className="flat-hero" aria-labelledby="flat-hero-heading">
      <div className="mx-auto max-w-2xl text-center">
        <h1 id="flat-hero-heading" className="flat-hero__brand ftp-display">
          The Ultimate Collection of
          <br />
          Free Online Tools
        </h1>
        <p className="flat-hero__text">
          Fast, private, browser-based tools—no install, no signup wall.
        </p>

        <div className="flat-hero__actions">
          <div className="flat-hero__search">
            <Search className="flat-hero__search-icon" aria-hidden="true" />
            <label htmlFor="tool-search" className="sr-only">
              Search tools
            </label>
            <input
              id="tool-search"
              type="search"
              value={searchValue}
              placeholder="Search tools…"
              onChange={(e) => onSearch?.(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                  e.preventDefault();
                  openCommandPalette();
                }
              }}
            />
            <button
              type="button"
              className="flat-hero__kbd"
              onClick={openCommandPalette}
              aria-label="Open command palette"
            >
              {modKey}K
            </button>
          </div>
        </div>

        <div className="flat-hero__stats" aria-label="Site statistics">
          <div className="flat-hero__stat">
            <strong className="flat-hero__stat-value">120+</strong>
            <span className="flat-hero__stat-label">Free tools</span>
          </div>
          <div className="flat-hero__stat-divider" aria-hidden="true" />
          <div className="flat-hero__stat">
            <strong className="flat-hero__stat-value">2K+</strong>
            <span className="flat-hero__stat-label">Visitors</span>
          </div>
        </div>
      </div>
    </section>
  );
}
