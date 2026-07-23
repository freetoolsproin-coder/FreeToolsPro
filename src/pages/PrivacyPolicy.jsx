import { Link } from "react-router-dom";
import LegalPageShell from "../components/LegalPageShell";
import { CONTACT_EMAIL, CONTACT_MAILTO, SITE_NAME, SITE_PURPOSE, SITE_URL } from "../data/siteConstants";

export default function PrivacyPolicy() {
  return (
    <LegalPageShell
      seoPage="privacyPolicy"
      title="Privacy Policy"
      subtitle="How FreeToolsPro collects, uses, and protects information—including analytics, AdSense, and browser-local tools."
    >
      <h3>Privacy Policy</h3>
      <p>
        This Privacy Policy describes how {SITE_NAME} ({SITE_URL}) handles information when you use
        our website and tools. {SITE_PURPOSE}
      </p>

      <h4>Information we collect</h4>
      <p>
        Most tools do not require registration. We may collect limited technical and usage data to
        run and improve the site:
      </p>
      <p>
        <strong>Usage and device data:</strong> pages visited, approximate location from IP (via
        analytics providers), browser/device type, referral URL, and interaction patterns.
      </p>
      <p>
        <strong>Cookies:</strong> used for consent preferences, analytics, and advertising. See the{" "}
        <Link to="/cookie-policy">Cookie Policy</Link>.
      </p>
      <p>
        <strong>Contact messages:</strong> if you email{" "}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> or use the{" "}
        <Link to="/contact">contact form</Link>, we receive your name, email, subject, and message
        so we can reply.
      </p>

      <h4>Browser-local tool processing</h4>
      <p>
        Many calculators and text utilities process inputs in your browser. In those cases, values
        such as dates, amounts, or pasted text are <strong>not uploaded to FreeToolsPro servers</strong>{" "}
        for the core calculation. Features that need a network call send only what that feature
        requires. Avoid pasting passwords or private keys on shared machines.
      </p>

      <h4>Google Analytics</h4>
      <p>
        We use <strong>Google Analytics</strong> to measure aggregated traffic. Google processes
        data under its own policies:{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>
        .
      </p>

      <h4>Google AdSense and advertising</h4>
      <p>
        FreeToolsPro uses <strong>Google AdSense</strong> to display ads. Google and partners may
        use cookies for personalized advertising based on prior visits, subject to your choices.
        AdSense and Analytics scripts load only after you allow those categories in the cookie banner.
        Manage ads at{" "}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>
        . Partner data use:{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          How Google uses information from sites that use our services
        </a>
        . We do not sell contact-form messages to advertisers.
      </p>

      <h4>Other processors</h4>
      <p>
        Contact delivery, captcha, fonts, or CDNs may process data under their terms when you use
        those features.
      </p>

      <h4>Retention and requests</h4>
      <p>
        Analytics and ads follow provider retention schedules. Contact emails are kept as needed to
        respond. For privacy requests about information you sent us, email{" "}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> with subject “Privacy request”.
      </p>

      <h4>Children</h4>
      <p>
        FreeToolsPro is not directed at children under 13. We do not knowingly collect their
        personal information.
      </p>

      <h4>International visitors</h4>
      <p>
        Providers may process data in countries other than your own. By using the site you
        understand transfers may occur as needed to operate FreeToolsPro.
      </p>

      <h4>Changes</h4>
      <p>
        We may update this policy; the “Last updated” date will change. Continued use means you
        accept the revised policy.
      </p>

      <h4>Contact</h4>
      <p>
        Privacy questions: <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> ·{" "}
        <Link to="/contact">Contact form</Link> · <Link to="/about">About</Link>
      </p>
    </LegalPageShell>
  );
}
