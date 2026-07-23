import { Link } from "react-router-dom";
import LegalPageShell from "../components/LegalPageShell";
import {
  CONTACT_EMAIL,
  CONTACT_MAILTO,
  SITE_NAME,
  SITE_PURPOSE,
  SITE_URL,
} from "../data/siteConstants";

export default function About() {
  return (
    <LegalPageShell
      seoPage="about"
      title={`About ${SITE_NAME}`}
      subtitle="Who we are, what we build, and why FreeToolsPro exists—clear purpose, free tools, no signup wall for everyday use."
    >
      <h3>About FreeToolsPro</h3>
      <p>{SITE_PURPOSE}</p>
      <p>
        We started FreeToolsPro because useful utilities should not hide behind installs, paywalls,
        or confusing dashboards. Whether you need an EMI estimate, a trimmed text list, a YAML
        check, or a quick image resize, the goal is the same: open the page, get a clear result,
        move on with your day.
      </p>

      <h4>Clear site purpose</h4>
      <p>
        FreeToolsPro ({SITE_URL}) is a <strong>free online tools platform</strong>. We publish
        original tool workspaces plus explanatory content—what each tool does, how to use it,
        examples, limits, and FAQs—so pages help humans (and search engines) understand the job
        before anyone pastes data.
      </p>
      <p>
        We are not a social network, marketplace, or news site. Our catalog focuses on calculators,
        text tools, developer helpers, image and PDF utilities, business drafts, and everyday
        converters.
      </p>

      <h4>Who it is for</h4>
      <p>
        Students, freelancers, small businesses, developers, marketers, and everyday users who want
        a trustworthy first answer without buying a suite of desktop software. If your task fits in
        a browser tab, we aim to have a tool for it.
      </p>

      <h4>How we build</h4>
      <p>
        <strong>Browser-first:</strong> Whenever practical, math and text transforms run on your
        device so sensitive inputs do not need to leave the page for the core result.
      </p>
      <p>
        <strong>Helpful surrounding content:</strong> Each tool page includes instructions,
        examples, use cases, and FAQs—not just an empty form. That depth is intentional: thin pages
        help nobody.
      </p>
      <p>
        <strong>Honest limits:</strong> We say when a result is an estimate, a heuristic, or a
        draft. Critical finance, health, legal, and production-code decisions still need your
        professional judgment.
      </p>

      <h4>Privacy, ads, and staying free</h4>
      <p>
        FreeToolsPro remains free for standard use. We may show Google AdSense ads and use analytics
        to understand which tools matter. Read the{" "}
        <Link to="/privacy-policy">Privacy Policy</Link>,{" "}
        <Link to="/cookie-policy">Cookie Policy</Link>,{" "}
        <Link to="/terms">Terms &amp; Conditions</Link>, and{" "}
        <Link to="/disclaimer">Disclaimer</Link> for the full picture.
      </p>

      <h4>Contact</h4>
      <p>
        Feedback, bug reports, and partnership notes:{" "}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> or the{" "}
        <Link to="/contact">contact form</Link>. We read every message that includes a clear tool
        URL and steps to reproduce.
      </p>
    </LegalPageShell>
  );
}
