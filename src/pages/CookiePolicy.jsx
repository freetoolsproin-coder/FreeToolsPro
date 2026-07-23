import { Link } from "react-router-dom";
import LegalPageShell from "../components/LegalPageShell";
import { CONTACT_EMAIL, CONTACT_MAILTO, SITE_NAME, SITE_PURPOSE } from "../data/siteConstants";

export default function CookiePolicy() {
  return (
    <LegalPageShell
      seoPage="cookiePolicy"
      title="Cookie Policy"
      subtitle="How FreeToolsPro uses cookies and similar technologies—and the choices you have."
    >
      <h3>Cookie Policy</h3>
      <p>
        This Cookie Policy explains how {SITE_NAME} uses cookies and similar technologies when you
        visit our website. It should be read together with our{" "}
        <Link to="/privacy-policy">Privacy Policy</Link>.
      </p>
      <p>{SITE_PURPOSE}</p>

      <h4>What are cookies?</h4>
      <p>
        Cookies are small text files stored on your device. They help websites remember preferences,
        understand traffic, and—where allowed—support advertising. Similar technologies include
        local storage and pixels used by analytics or ad partners.
      </p>

      <h4>How we use cookies</h4>
      <p>
        <strong>Essential / functional:</strong> We may store a cookie consent choice and basic
        preferences so the site behaves consistently on return visits.
      </p>
      <p>
        <strong>Analytics:</strong> We use Google Analytics (or similar) to learn which pages are
        useful, how visitors arrive, and where the experience breaks. These reports are typically
        aggregated.
      </p>
      <p>
        <strong>Advertising:</strong> FreeToolsPro uses <strong>Google AdSense</strong> to display
        ads that help keep tools free. Google and its partners may use cookies to serve ads based
        on your prior visits to this or other sites, subject to your consent choices and regional
        rules. You can manage ad personalization at{" "}
        <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
          Google Ads Settings
        </a>
        .
      </p>

      <h4>Your choices</h4>
      <p>
        When you first visit, a cookie banner lets you <strong>Accept all</strong>,{" "}
        <strong>Reject non-essential</strong>, or <strong>Manage</strong> analytics and advertising
        separately. Essential cookies (including your consent choice) stay on so the site can
        remember that decision.
      </p>
      <p>
        Most browsers also let you block or delete cookies in settings or private browsing mode.
        Blocking all cookies may limit analytics quality or ad relevance; essential tool features
        should still work for standard use.
      </p>
      <p>
        Analytics and AdSense scripts load <strong>only after</strong> you allow those categories.
        If you reject non-essential cookies, we do not load Google Analytics or AdSense on that
        visit until you change your preferences.
      </p>

      <h4>More about Google partners</h4>
      <p>
        Learn how Google uses data from partner sites here:{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          How Google uses information from sites that use our services
        </a>
        .
      </p>

      <h4>Updates</h4>
      <p>
        We may update this Cookie Policy when our tools or partners change. The “Last updated” date
        at the top of this page will reflect the latest revision.
      </p>

      <h4>Contact</h4>
      <p>
        Cookie or privacy questions:{" "}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> or{" "}
        <Link to="/contact">contact form</Link> (subject: “Cookie / Privacy”).
      </p>
    </LegalPageShell>
  );
}
