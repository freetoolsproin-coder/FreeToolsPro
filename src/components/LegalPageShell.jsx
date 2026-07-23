import { Link } from "react-router-dom";
import Seo from "./Seo";
import Hero from "./Hero";
import RelatedTools from "./RelatedTools";
import { CONTACT_EMAIL, CONTACT_MAILTO, LEGAL_LINKS, SITE_NAME } from "../data/siteConstants";

/**
 * Shared layout for About / Privacy / Terms / Disclaimer / Cookie pages.
 */
export default function LegalPageShell({
  seoPage,
  title,
  subtitle,
  lastUpdated = "22 July 2026",
  children,
}) {
  return (
    <>
      <Seo page={seoPage} />
      <main className="ftp-page">
        <Hero showSearch={false} title={title} subtitle={subtitle} />
        <section className="mx-auto mb-6 max-w-7xl px-4 cont-text pt-4 text-left sm:px-6 lg:px-8">
          <div className="gap-8 md:flex">
            <div className="md:w-3/4 space-y-4">
              <p className="text-sm text-[var(--ftp-ink-soft)]">Last updated: {lastUpdated}</p>
              {children}
              <div className="mt-10 rounded-[14px] border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)] px-4 py-4">
                <p className="text-sm font-semibold text-[var(--ftp-ink)]">Need help?</p>
                <p className="mt-2 text-sm leading-6 text-[var(--ftp-ink-soft)]">
                  Email{" "}
                  <a className="underline underline-offset-2" href={CONTACT_MAILTO}>
                    {CONTACT_EMAIL}
                  </a>{" "}
                  or use our{" "}
                  <Link className="underline underline-offset-2" to="/contact">
                    contact form
                  </Link>
                  . Browse {SITE_NAME} policies:
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {LEGAL_LINKS.map((l) => (
                    <li key={l.path}>
                      <Link className="underline underline-offset-2" to={l.path}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-8 md:mt-0 md:w-1/4">
              <RelatedTools />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
