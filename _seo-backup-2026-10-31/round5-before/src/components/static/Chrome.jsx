// Site header and footer. Server-rendered; src/scripts/navmore.js and palette.js add the small interactive parts.
import { CATEGORIES, TOOLS, toolByPath } from "../../data/catalog.js";
import { SITE } from "../../data/site.js";
import logo from "../../images/freetoolspro-logo.png";
import logowhite from "../../images/freetoolspro-logo.png";
import { CategoryIcon, ChevronRight, SearchIcon, Menu, X } from "./icons.jsx";

/** The section a page belongs to: a hub itself, or the category of the tool on that path. */
function activeSection(path) {
  if (path === "/ebooks" || path.startsWith("/ebooks/")) return "ebooks";
  const hub = CATEGORIES.find((c) => path === c.path || path.startsWith(c.path + "/"));
  if (hub) return hub.id;
  return toolByPath[path]?.cat || null;
}

export function Header({ path = "/" }) {
  const active = activeSection(path);
  const dark = path === "/"; // the home page opens on a dark hero
  const main = CATEGORIES.filter((c) => c.nav !== "more");
  const more = CATEGORIES.filter((c) => c.nav === "more");
  const moreActive = active === "ebooks" || more.some((c) => c.id === active);
  const count = (id) => TOOLS.filter((t) => t.cat === id).length;
  const brand = dark ? logowhite : logo;
  return (
    <header className={`site-head ${dark ? "site-head--dark" : ""}`}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <div className="wrap site-head__in">
        <a href="/" className="logo" aria-label={`${SITE.name} home`}>
          <img className="logo__img" src={brand.src} width={brand.width} height={brand.height} alt={SITE.name} />
        </a>

        <nav className="site-nav" aria-label="Sections">
          <ul>
            {main.map((c) => (
              <li key={c.id}>
                <a href={c.path} aria-current={active === c.id ? "page" : undefined}>
                  {c.short || c.name}
                </a>
              </li>
            ))}
            <li className="navmore">
              <details className="navmore__d">
                <summary className={moreActive ? "is-active" : undefined}>
                  More <ChevronRight size={14} strokeWidth={2.2} aria-hidden="true" className="navmore__chev" />
                </summary>
                <ul className="navmore__menu">
                  {more.map((c) => (
                    <li key={c.id}>
                      <a href={c.path} aria-current={active === c.id ? "page" : undefined}>
                        <CategoryIcon id={c.id} size={16} className="site-nav__icon" />
                        <span>
                          {c.name}
                          <small>{count(c.id)} tools</small>
                        </span>
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="/ebooks" aria-current={active === "ebooks" ? "page" : undefined}>
                      <CategoryIcon id="ebooks" size={16} className="site-nav__icon" />
                      <span>
                        Ebooks
                        <small>Free PDF books</small>
                      </span>
                    </a>
                  </li>
                </ul>
              </details>
            </li>
          </ul>
        </nav>

        <div className="site-head__actions">
          {/* Works as a link to /tools without JavaScript; palette.js turns it into the Ctrl/⌘ K palette. */}
          <a className="ksearch" href="/tools" data-kpal-open aria-keyshortcuts="Control+K Meta+K" aria-haspopup="dialog">
            <SearchIcon size={16} strokeWidth={2.2} aria-hidden="true" />
            <span className="ksearch__label">Search tools</span>
            <kbd className="ksearch__kbd" data-kbd>
              Ctrl K
            </kbd>
          </a>
          <details className="mnav">
            <summary className="mnav__btn" aria-label="Menu">
              <Menu size={20} strokeWidth={2} aria-hidden="true" className="mnav__open" />
              <X size={20} strokeWidth={2} aria-hidden="true" className="mnav__close" />
            </summary>
            <div className="mnav__panel">
              <ul className="mnav__grid">
                {CATEGORIES.map((c) => (
                  <li key={c.id}>
                    <a href={c.path} className={`cat-${c.id}`} aria-current={active === c.id ? "page" : undefined}>
                      <CategoryIcon id={c.id} size={18} />
                      <span>
                        {c.short || c.name}
                        <small>{count(c.id)} tools</small>
                      </span>
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/ebooks" aria-current={active === "ebooks" ? "page" : undefined}>
                    <CategoryIcon id="ebooks" size={18} />
                    <span>
                      Ebooks
                      <small>Free PDF books</small>
                    </span>
                  </a>
                </li>
              </ul>
              <a className="mnav__all" href="/tools">
                Browse all {TOOLS.length} tools
              </a>
            </div>
          </details>
        </div>
      </div>

      <dialog className="kpal" aria-label="Search tools" data-kpal>
        <div className="kpal__box">
          <div className="kpal__search">
            <SearchIcon size={18} strokeWidth={2.2} aria-hidden="true" />
            <label htmlFor="kpal-input" className="visually-hidden">
              Search tools by name or task
            </label>
            <input id="kpal-input" type="search" className="kpal__input" placeholder="Search tools, e.g. compress photo, EMI, JSON" autoComplete="off" spellCheck="false" role="combobox" aria-expanded="true" aria-controls="kpal-list" aria-autocomplete="list" />
            <button type="button" className="kpal__esc" data-kpal-close aria-label="Close search">
              Esc
            </button>
          </div>
          <p className="kpal__label" data-kpal-label>
            Popular tools
          </p>
          <ul className="kpal__list" id="kpal-list" role="listbox" aria-label="Matching tools" />
          <p className="kpal__empty" data-kpal-empty hidden>
            No tool matches that. Try fewer words, or <a href="/tools">browse all {TOOLS.length} tools</a>.
          </p>
          <p className="kpal__foot" aria-hidden="true">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> to move
            </span>
            <span>
              <kbd>Enter</kbd> to open
            </span>
            <span>
              <kbd>Esc</kbd> to close
            </span>
          </p>
        </div>
      </dialog>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="site-foot__grid">
          <div className="site-foot__about">
            <p className="logo__word">
              <a href="/" className="logo" aria-label={`${SITE.name} home`}>
                <img className="logo__img" src={logowhite.src} width={logowhite.width} height={logowhite.height} alt={SITE.name} />
              </a>
            </p>
            <p className="muted">{SITE.description}</p>
            <p className="muted">
              Questions or a tool request? <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
          <nav aria-label="Categories">
            <p className="site-foot__h">Tools</p>
            <ul>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a href={c.path}>{c.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Site">
            <p className="site-foot__h">Site</p>
            <ul>
              <li>
                <a href="/tools">All tools</a>
              </li>
              <li>
                <a href="/ebooks">Ebooks</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/methodology">How we check tools</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/privacy-policy">Privacy policy</a>
              </li>
              <li>
                <a href="/terms">Terms</a>
              </li>
              <li>
                <a href="/disclaimer">Disclaimer</a>
              </li>
              <li>
                <a href="/cookie-policy">Cookies</a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="site-foot__fine muted">
          © {new Date(SITE.updated).getFullYear()} {SITE.name}. All rights reserved. No signup required for most utilities.
          <button type="button" className="linklike" data-consent-open>
             Cookies Settings.
          </button>
        </p>
      </div>
    </footer>
  );
}

/** Cookie consent bar. Hidden until the inline script in Base.astro finds no stored choice. */
export function ConsentBar() {
  return (
    <div className="consent" id="consent" hidden role="region" aria-label="Cookie consent">
      <p>
        We use cookies for ads that keep these tools free, and to measure usage. Your files and inputs are never sent to us. <a href="/cookie-policy">Details</a>
      </p>
      <div className="consent__actions">
        <button type="button" className="btn btn--ghost btn--sm" data-consent="necessary">
          Necessary only
        </button>
        <button type="button" className="btn btn--primary btn--sm" data-consent="all">
          Accept all
        </button>
      </div>
    </div>
  );
}
