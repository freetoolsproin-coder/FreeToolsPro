import { Link } from "react-router-dom";
import LegalPageShell from "../components/LegalPageShell";
import { CONTACT_EMAIL, CONTACT_MAILTO, SITE_NAME, SITE_PURPOSE, SITE_URL } from "../data/siteConstants";

export default function TermsOfService() {
  return (
    <LegalPageShell
      seoPage="terms"
      title="Terms & Conditions"
      subtitle="The simple rules for using FreeToolsPro—what we offer, what we ask, and where responsibility sits."
    >
      <h3>Terms &amp; Conditions</h3>
      <p>
        Welcome to {SITE_NAME} ({SITE_URL}). These Terms &amp; Conditions explain how you may use
        our website and tools. By accessing or using FreeToolsPro, you agree to these terms. If you
        do not agree, please stop using the site.
      </p>
      <p>{SITE_PURPOSE}</p>

      <h4>1. Who we are</h4>
      <p>
        FreeToolsPro publishes free browser-based utilities for everyday work: calculators, text
        helpers, developer converters, image and PDF utilities, business document drafts, and
        similar tools. We are not a bank, law firm, medical clinic, or government agency. Results
        are educational and practical aids—not official advice.
      </p>

      <h4>2. Eligibility and acceptable use</h4>
      <p>
        You may use FreeToolsPro for lawful personal or business purposes. You agree not to misuse
        the site—for example by attempting to break security, overload servers, scrape in a way that
        harms service availability, upload malware, or use tools to harass others or violate
        applicable law.
      </p>
      <p>
        Do not paste secrets you are not allowed to process (production API keys, other people’s
        private documents, or regulated data) into public browsers or shared machines.
      </p>

      <h4>3. Accounts</h4>
      <p>
        Most tools do not require an account. If a future feature asks you to register, you are
        responsible for accurate details and for keeping login credentials private.
      </p>

      <h4>4. Intellectual property</h4>
      <p>
        The FreeToolsPro name, logo, page layouts, and original editorial content belong to us or
        our licensors. You may use tool outputs you generate (for example a trimmed text list or an
        EMI estimate) for your own work, subject to third-party rights in any content you paste in.
        You may not copy our site wholesale, mirror our branding, or claim our tools as your
        product without permission.
      </p>

      <h4>5. Tool results and “as is” service</h4>
      <p>
        Tools are provided free of charge on an “as is” and “as available” basis. We work to keep
        calculators and utilities accurate, but formulas, tax rules, browser differences, and
        incomplete inputs can produce unexpected results. Always verify critical numbers with your
        bank, accountant, doctor, or official source before acting.
      </p>

      <h4>6. Third-party services</h4>
      <p>
        The site may include advertising (including Google AdSense), analytics, fonts, captcha, or
        email delivery providers. Their terms and privacy practices also apply when those services
        process data. See our{" "}
        <Link to="/privacy-policy">Privacy Policy</Link> and{" "}
        <Link to="/cookie-policy">Cookie Policy</Link> for details.
      </p>

      <h4>7. Limitation of liability</h4>
      <p>
        To the fullest extent allowed by law, FreeToolsPro and its operators are not liable for
        indirect, incidental, or consequential damages arising from use of the site or reliance on
        tool outputs—including financial decisions, missed deadlines, or data loss. Our total
        liability for any claim related to the site is limited to the amount you paid us for the
        service in the prior twelve months (which is typically zero for free tools).
      </p>

      <h4>8. Indemnity</h4>
      <p>
        You agree to indemnify FreeToolsPro against claims arising from your misuse of the site,
        your content, or your violation of these terms or applicable law.
      </p>

      <h4>9. Changes</h4>
      <p>
        We may update tools and these terms from time to time. The “Last updated” date will change
        when we do. Continued use after updates means you accept the revised terms.
      </p>

      <h4>10. Contact</h4>
      <p>
        Questions about these Terms:{" "}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> or{" "}
        <Link to="/contact">freetoolspro.in/contact</Link>.
      </p>
    </LegalPageShell>
  );
}
