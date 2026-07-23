import { Link } from "react-router-dom";
import LegalPageShell from "../components/LegalPageShell";
import { CONTACT_EMAIL, CONTACT_MAILTO, SITE_NAME, SITE_PURPOSE } from "../data/siteConstants";

export default function Disclaimer() {
  return (
    <LegalPageShell
      seoPage="disclaimer"
      title="Disclaimer"
      subtitle="What FreeToolsPro is—and what it is not. Please read before relying on any calculator or utility result."
    >
      <h3>Disclaimer</h3>
      <p>{SITE_PURPOSE}</p>
      <p>
        The information and tool outputs on {SITE_NAME} are for general informational and
        productivity purposes only. They are not a substitute for professional advice.
      </p>

      <h4>No professional advice</h4>
      <p>
        <strong>Finance:</strong> EMI, SIP, GST, salary, and investment-style calculators produce
        estimates based on the numbers you enter. They are not lending offers, tax filings, or
        personalized financial planning.
      </p>
      <p>
        <strong>Health:</strong> BMI, calorie, and similar tools are screening aids, not diagnoses
        or treatment plans. Talk to a qualified clinician for medical decisions.
      </p>
      <p>
        <strong>Legal / identity:</strong> Document helpers, PAN/IFSC format checks, and masking
        utilities do not replace official portals, notarization, or legal counsel.
      </p>
      <p>
        <strong>Technical:</strong> Formatters, validators, and explainers are heuristics. Always
        confirm critical SQL, YAML, regex, or security choices in your own toolchain.
      </p>

      <h4>Accuracy and availability</h4>
      <p>
        We aim for clear, careful tools, but we do not warrant that every result is complete,
        current, or error-free. Browser quirks, outdated assumptions, or unusual inputs can change
        outcomes. The site may be unavailable during maintenance or outages.
      </p>

      <h4>External links and ads</h4>
      <p>
        FreeToolsPro may show third-party advertisements or link to external sites. We do not
        control those destinations and are not responsible for their content, policies, or offers.
        Review our <Link to="/privacy-policy">Privacy Policy</Link> and{" "}
        <Link to="/cookie-policy">Cookie Policy</Link> for how ads and cookies work on our pages.
      </p>

      <h4>Your responsibility</h4>
      <p>
        You are responsible for how you use tool outputs—including decisions about money, health,
        publishing content, or deploying code. Keep backups of important files. Do not upload
        content you lack rights to process.
      </p>

      <h4>Contact</h4>
      <p>
        If you spot a clear calculation bug or misleading page, email{" "}
        <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a> with the tool URL and steps to reproduce, or
        use the <Link to="/contact">contact form</Link>.
      </p>
    </LegalPageShell>
  );
}
