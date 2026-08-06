import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import freetoolsLogo from "../../images/freetoolspro-logo-white.png";
import { CONTACT_EMAIL, CONTACT_MAILTO, LEGAL_LINKS, SITE_PURPOSE } from "../data/siteConstants";
import { PRODUCT_HUNT } from "../data/productHunt";
import {
  BLOG_NAV_VISIBLE,
  apexNavHref,
  apexNavIsExternal,
  blogHomePath,
  blogNavHref,
  blogNavIsExternal,
} from "../../blog/data/blogSite";

const popularTools = [
  { label: "Age Calculator", path: "/calculators/age-calculator" },
  { label: "EMI Calculator", path: "/calculators/emi-calculator" },
  { label: "Mortgage Calculator", path: "/calculators/mortgage-calculator" },
  { label: "Loan Eligibility", path: "/calculators/loan-eligibility-calculator" },
  { label: "GST Calculator", path: "/business-tools/gst-calculator" },
  { label: "Invoice Creator", path: "/business-tools/invoice-template-creator" },
];

const seoDevTools = [
  { label: "Website SEO Audit", path: "/developer-tools/website-seo-audit" },
  { label: "Backlink Checker", path: "/developer-tools/backlink-checker" },
  { label: "SSL Checker", path: "/developer-tools/ssl-checker" },
  { label: "Domain Age Checker", path: "/developer-tools/domain-age-checker" },
  { label: "AI Resume Builder", path: "/social-media-tools/ai-resume-builder" },
  { label: "AI Image Generator", path: "/image-tools/ai-image-generator" },
];

function ApexAwareLink({ to, className, children }) {
  if (apexNavIsExternal()) {
    return (
      <a href={apexNavHref(to)} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <div className="flex flex-col gap-8 border-b border-white/[0.08] pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <ApexAwareLink to="/" className="site-footer__brand inline-flex items-center gap-3">
              <img
                src={freetoolsLogo}
                alt=""
                className="h-11 w-auto"
                width={176}
                height={44}
                loading="lazy"
              />
              <span className="sr-only">FreeToolsPro</span>
            </ApexAwareLink>
            <p className="mt-4 text-[0.95rem] leading-7 text-white/50">{SITE_PURPOSE}</p>
            <a
              href={CONTACT_MAILTO}
              className="mt-4 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-teal-300"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <ApexAwareLink to="/tools" className="site-footer__cta shrink-0 self-start lg:self-auto">
            Explore all tools
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </ApexAwareLink>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <p className="site-footer__heading">Contact</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href={CONTACT_MAILTO} className="site-footer__link inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="site-footer__heading">Popular</p>
            <ul className="mt-4 space-y-2.5">
              {popularTools.map((tool) => (
                <li key={tool.path}>
                  <ApexAwareLink to={tool.path} className="site-footer__link">
                    {tool.label}
                  </ApexAwareLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="site-footer__heading">SEO &amp; AI</p>
            <ul className="mt-4 space-y-2.5">
              {seoDevTools.map((tool) => (
                <li key={tool.path}>
                  <ApexAwareLink to={tool.path} className="site-footer__link">
                    {tool.label}
                  </ApexAwareLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="site-footer__heading">Company</p>
            <ul className="mt-4 space-y-2.5">
              {BLOG_NAV_VISIBLE ? (
                <li>
                  {blogNavIsExternal() ? (
                    <a href={blogNavHref("/")} className="site-footer__link" rel="noopener noreferrer">
                      Blog &amp; Guides
                    </a>
                  ) : (
                    <Link to={blogHomePath()} className="site-footer__link">
                      Blog &amp; Guides
                    </Link>
                  )}
                </li>
              ) : null}
              <li>
                <ApexAwareLink to="/tools" className="site-footer__link">
                  All Tools
                </ApexAwareLink>
              </li>
              {LEGAL_LINKS.map((link) => (
                <li key={link.path}>
                  <ApexAwareLink to={link.path} className="site-footer__link">
                    {link.label}
                  </ApexAwareLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {PRODUCT_HUNT.productUrl ? (
          <div className="border-t border-white/[0.08] py-5">
            <p className="site-footer__heading">As seen on</p>
            <a
              href={PRODUCT_HUNT.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-[#ff6154]"
            >
              Product Hunt
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-white/[0.08] py-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} FreeToolsPro. All rights reserved.</p>
          <p className="text-white/30">Free online tools. No signup required for most utilities.</p>
        </div>
      </div>
    </footer>
  );
}
