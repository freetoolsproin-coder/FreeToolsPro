import { useEffect, useId, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import freetoolsLogo from "../../images/freetoolspro-logo.svg";
import { tools } from "../data/toolDefinitions";
import { openCommandPalette } from "../data/homeSections";

const DESKTOP_MENU = [
  "age-calculator",
  "bmi-calculator",
  "calorie-calculator",
  "sip-calculator",
  "emi-calculator",
  "salary-calculator",
  "gst-calculator",
  "speed-test",
  "currency-converter",
];

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || "");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const modKey = isMac() ? "⌘" : "Ctrl";

  const desktopTools = DESKTOP_MENU.map((id) => tools.find((t) => t.id === id)).filter(Boolean);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="site-header sticky top-0 z-50">
      <div className="site-header__inner mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.25rem] sm:gap-4 sm:px-6 lg:px-8">
        <NavLink
          to="/"
          onClick={() => setOpen(false)}
          className="site-logo group flex max-w-[min(100%,13rem)] shrink-0 items-center gap-2.5 sm:max-w-none"
        >
          <img
            src={freetoolsLogo}
            alt=""
            className="h-12 w-auto max-w-full object-contain object-left sm:h-14"
            width={160}
            height={40}
          />
          <span className="sr-only">FreeToolsPro home</span>
        </NavLink>

        <nav className="site-nav hidden min-w-0 flex-1 items-center justify-center xl:flex" aria-label="Primary">
          <ul className="flex items-center gap-0.5">
            {desktopTools.map((tool) => (
              <li key={tool.id}>
                <NavLink
                  to={tool.path}
                  title={tool.title}
                  className={({ isActive }) =>
                    `site-nav__link ${isActive ? "site-nav__link--active" : ""}`
                  }
                >
                  {tool.navLabel}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="site-header__search"
            onClick={openCommandPalette}
            aria-label="Search tools"
          >
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Search</span>
            <kbd>{modKey}K</kbd>
          </button>

          <Link
            to="/blog"
            className="site-nav__link hidden sm:inline-flex"
          >
            Blog
          </Link>

          <Link to="/tools" className="site-header__cta hidden sm:inline-flex">
            All tools
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          <button
            type="button"
            className="site-header__menu-btn xl:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={menuId}
          >
            {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {open ? (
        <div id={menuId} className="site-drawer xl:hidden">
          <div className="site-drawer__panel mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav aria-label="Mobile">
              <button
                type="button"
                className="mb-4 flex w-full items-center gap-2 rounded-[8px] border border-[var(--ftp-line)] bg-white px-3 py-2.5 text-left text-sm text-[var(--ftp-ink-soft)]"
                onClick={() => {
                  setOpen(false);
                  openCommandPalette();
                }}
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Search tools…
                <kbd className="ml-auto rounded border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-1.5 py-0.5 text-[0.65rem] font-semibold">
                  {modKey}K
                </kbd>
              </button>

              <p className="site-drawer__label">Tools</p>
              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {desktopTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <li key={tool.id}>
                      <NavLink
                        to={tool.path}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) =>
                          `site-drawer__link ${isActive ? "site-drawer__link--active" : ""}`
                        }
                      >
                        {Icon ? (
                          <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />
                        ) : null}
                        <span>{tool.name}</span>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>

              <Link
                to="/blog"
                onClick={() => setOpen(false)}
                className="site-drawer__cta mt-4"
              >
                Guides &amp; tutorials
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                to="/tools"
                onClick={() => setOpen(false)}
                className="site-drawer__cta mt-2"
              >
                Browse entire catalog
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
