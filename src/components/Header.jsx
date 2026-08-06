import { useEffect, useId, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import freetoolsLogo from "../../images/freetoolspro-logo.svg";
import { openCommandPalette } from "../utils/openCommandPalette";
import {
  BLOG_NAV_VISIBLE,
  apexNavHref,
  apexNavIsExternal,
  blogHomePath,
  blogNavHref,
  blogNavIsExternal,
} from "../../blog/data/blogSite";

/** Static nav — avoid importing toolDefinitions (pulls all Lucide icons into the shell). */
const DESKTOP_TOOLS = [
  { id: "age-calculator", path: "/calculators/age-calculator", navLabel: "Age", title: "Age Calculator" },
  { id: "bmi-calculator", path: "/calculators/bmi-calculator", navLabel: "BMI", title: "BMI Calculator" },
  { id: "calorie-calculator", path: "/calculators/calorie-calculator", navLabel: "Calories", title: "Calorie Calculator" },
  { id: "sip-calculator", path: "/calculators/sip-calculator", navLabel: "SIP", title: "SIP Calculator" },
  { id: "emi-calculator", path: "/calculators/emi-calculator", navLabel: "EMI", title: "EMI Calculator" },
  { id: "salary-calculator", path: "/business-tools/salary-calculator", navLabel: "Salary", title: "Salary Calculator" },
  { id: "gst-calculator", path: "/business-tools/gst-calculator", navLabel: "GST", title: "GST Calculator" },
  { id: "speed-test", path: "/developer-tools/speed-test", navLabel: "Speed Test", title: "Speed Test" },
  { id: "currency-converter", path: "/trending-tools/currency-converter", navLabel: "Currency", title: "Currency Converter" },
];

function isMac() {
  if (typeof navigator === "undefined") return false;
  return /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || "");
}

function ApexAwareLink({ to, className, onClick, children, ...rest }) {
  if (apexNavIsExternal()) {
    const resolvedClass =
      typeof className === "function" ? className({ isActive: false }) : className;
    return (
      <a href={apexNavHref(to)} className={resolvedClass} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  if (typeof className === "function") {
    return (
      <NavLink to={to} className={className} onClick={onClick} {...rest}>
        {children}
      </NavLink>
    );
  }
  return (
    <Link to={to} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const modKey = isMac() ? "⌘" : "Ctrl";

  const desktopTools = DESKTOP_TOOLS;

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
        <ApexAwareLink
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
            decoding="async"
            fetchpriority="high"
          />
          <span className="sr-only">FreeToolsPro home</span>
        </ApexAwareLink>

        <nav className="site-nav hidden min-w-0 flex-1 items-center justify-center xl:flex" aria-label="Primary">
          <ul className="flex items-center gap-0.5">
            {desktopTools.map((tool) => (
              <li key={tool.id}>
                <ApexAwareLink
                  to={tool.path}
                  title={tool.title}
                  className={({ isActive }) =>
                    `site-nav__link ${isActive ? "site-nav__link--active" : ""}`
                  }
                >
                  {tool.navLabel}
                </ApexAwareLink>
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

          {BLOG_NAV_VISIBLE ? (
            blogNavIsExternal() ? (
              <a
                href={blogNavHref("/")}
                className="site-nav__link hidden sm:inline-flex"
                rel="noopener noreferrer"
              >
                Blog
              </a>
            ) : (
              <Link to={blogHomePath()} className="site-nav__link hidden sm:inline-flex">
                Blog
              </Link>
            )
          ) : null}

          <ApexAwareLink to="/tools" className="site-header__cta hidden sm:inline-flex">
            All tools
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </ApexAwareLink>

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
                {desktopTools.map((tool) => (
                  <li key={tool.id}>
                    <ApexAwareLink
                      to={tool.path}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `site-drawer__link ${isActive ? "site-drawer__link--active" : ""}`
                      }
                    >
                      <span>{tool.title || tool.navLabel}</span>
                    </ApexAwareLink>
                  </li>
                ))}
              </ul>

              {BLOG_NAV_VISIBLE ? (
                blogNavIsExternal() ? (
                  <a
                    href={blogNavHref("/")}
                    onClick={() => setOpen(false)}
                    className="site-drawer__cta mt-4"
                    rel="noopener noreferrer"
                  >
                    Guides &amp; tutorials
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    to={blogHomePath()}
                    onClick={() => setOpen(false)}
                    className="site-drawer__cta mt-4"
                  >
                    Guides &amp; tutorials
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )
              ) : null}

              <ApexAwareLink
                to="/tools"
                onClick={() => setOpen(false)}
                className="site-drawer__cta mt-2"
              >
                Browse entire catalog
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </ApexAwareLink>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
