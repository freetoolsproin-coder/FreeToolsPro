import { Link } from "react-router-dom";
import { ArrowUpRight, Mail } from "lucide-react";
import freetoolsLogo from "../../images/freetoolspro-logo-white.png";
import { CONTACT_EMAIL, CONTACT_MAILTO, LEGAL_LINKS, SITE_PURPOSE } from "../data/siteConstants";

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

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__glow" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 lg:px-8 lg:pt-16">
        <div className="flex flex-col gap-8 border-b border-white/[0.08] pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-md">
            <Link to="/" className="site-footer__brand inline-flex items-center gap-3">
              <img
                src={freetoolsLogo}
                alt=""
                className="h-11 w-auto"
                width={176}
                height={44}
                loading="lazy"
              />
              <span className="sr-only">FreeToolsPro</span>
            </Link>
            <p className="mt-4 text-[0.95rem] leading-7 text-white/50">{SITE_PURPOSE}</p>
            <a
              href={CONTACT_MAILTO}
              className="mt-4 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-teal-300"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {CONTACT_EMAIL}
            </a>
          </div>

          <Link to="/tools" className="site-footer__cta shrink-0 self-start lg:self-auto">
            Explore all tools
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
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
                  <Link to={tool.path} className="site-footer__link">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="site-footer__heading">SEO &amp; AI</p>
            <ul className="mt-4 space-y-2.5">
              {seoDevTools.map((tool) => (
                <li key={tool.path}>
                  <Link to={tool.path} className="site-footer__link">
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="site-footer__heading">Company</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link to="/blog" className="site-footer__link">
                  Blog &amp; Guides
                </Link>
              </li>
              <li>
                <Link to="/tools" className="site-footer__link">
                  All Tools
                </Link>
              </li>
              {LEGAL_LINKS.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="site-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="site-footer__bar flex flex-col gap-3 border-t border-white/[0.08] py-5 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} FreeToolsPro. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <Link key={`bar-${link.path}`} to={link.path} className="transition hover:text-teal-300">
                {link.label.replace(" Policy", "").replace(" & Conditions", "")}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
