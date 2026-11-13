// Content for About, Contact and policy pages. Review with your own adviser before publishing changes.
import { SITE } from "../../data/site.js";
import { TOOLS } from "../../data/catalog.js";
import { AUTHOR } from "../../data/author.js";

const mail = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

export const LEGAL = {
  about: {
    title: "About FreeToolsPro",
    description: `FreeToolsPro is a free collection of ${TOOLS.length} browser-based tools for money, tax, study, writing, SEO, code, images and PDFs, built for people in India.`,
    body: () => (
      <>
        <p>
          {SITE.name} is a collection of {TOOLS.length} free tools for jobs that come up every week: checking an EMI before signing a loan, working out tax under the new regime, shrinking a photo for an exam form, merging PDFs for a visa application, or tidying up JSON from an API.
        </p>
        <h2>How the tools work</h2>
        <p>
          Every tool runs inside your browser. When you compress an image or merge a PDF, the file is read and written on your own device; it is never uploaded to us. That makes the tools fast, and it means we cannot see your documents even if we wanted to.
        </p>
        <h2>Fewer, better tools</h2>
        <p>
          We used to offer several hundred. Many were near-duplicates or did not work well enough. We kept the tools people actually use, rebuilt them to the same standard, and made each one load quickly on an ordinary phone. New tools are added only when they meet the same bar.
        </p>
        <h2>Accuracy</h2>
        <p>
          Financial and tax calculators use the rules for FY 2026-27 and current scheme rates, which we review regularly. They are estimates for planning, not advice. For decisions about money, tax or health, check with your bank, employer, a chartered accountant or a doctor.
        </p>
        <h2 id="author">Who builds {SITE.name}</h2>
        <p>
          {SITE.name} is built and maintained by {AUTHOR.name}. {AUTHOR.bio.slice(0, 2).join(" ").replace(`${AUTHOR.name} is`, "He is")}
        </p>
        <p>
          He also writes the site's <a href="/ebooks">free ebooks</a> on loans, tax, salary, study and everyday files.
        </p>
        <h2>How the site is funded</h2>
        <p>The tools are free and supported by advertising. We do not sell data and do not ask you to create an account.</p>
        <p>Spotted a mistake or want a tool added? Write to {mail}.</p>
      </>
    ),
  },
  contact: {
    title: "Contact",
    description: `Contact FreeToolsPro: report a bug, suggest a tool or ask a question. Email ${SITE.email}.`,
    body: () => (
      <>
        <p>The quickest way to reach us is email: {mail}. We read every message and usually reply within two working days.</p>
        <h2>Reporting a problem with a tool</h2>
        <p>Tell us which tool you used, what you entered and what you expected to see. A screenshot helps. Please do not send real documents or personal data; describe the problem instead.</p>
        <h2>Suggesting a tool</h2>
        <p>We add tools that many people need and that we can build to run fully in the browser. Tell us what you need it for and we will consider it.</p>
      </>
    ),
  },
  "privacy-policy": {
    title: "Privacy policy",
    description: "How FreeToolsPro handles your data: tools run in your browser, files are never uploaded, and advertising cookies are used only with consent.",
    body: () => (
      <>
        <p>This policy explains what information {SITE.name} ({SITE.url}) collects and why.</p>
        <h2>What you enter into tools</h2>
        <p>
          Text, numbers, images and PDFs you use with our tools are processed in your browser and are not sent to our servers. Calculator values may appear in the page address if you choose "Copy link with these values"; that link is only shared if you share it.
        </p>
        <h2>Information collected automatically</h2>
        <p>
          Like most websites, our hosting provider records standard server logs (IP address, browser type, pages requested and time) for security and to keep the site running. These logs are kept for a limited time and are not used to identify you.
        </p>
        <h2>Advertising</h2>
        <p>
          We use Google AdSense to show ads. Google and its partners may use cookies to show ads based on your visits to this and other websites. Personalised advertising cookies are only used if you accept them in our cookie banner. You can change your choice at any time using "Cookie settings" at the bottom of every page, and you can manage Google's ad personalisation at{" "}
          <a href="https://adssettings.google.com" rel="noopener">
            adssettings.google.com
          </a>
          .
        </p>
        <h2>Cookies and local storage</h2>
        <p>
          We store your cookie choice in your browser's local storage so we do not ask again. See the <a href="/cookie-policy">cookie policy</a> for details.
        </p>
        <h2>Your rights</h2>
        <p>
          Under India's Digital Personal Data Protection Act, 2023 and other applicable laws you may ask what personal data we hold about you, and ask us to correct or delete it. Because the tools do not send your inputs to us, we usually hold no personal data beyond server logs and any email you send us. Write to {mail}.
        </p>
        <h2>Children</h2>
        <p>The site is meant for a general audience and is not directed at children under 13. We do not knowingly collect their personal data.</p>
        <h2>Changes</h2>
        <p>If we change this policy we will update the date at the top of this page.</p>
      </>
    ),
  },
  terms: {
    title: "Terms of use",
    description: "Terms of use for FreeToolsPro's free online calculators, converters, PDF and image tools: acceptable use, no warranty, liability and your content.",
    body: () => (
      <>
        <p>By using {SITE.name} you agree to these terms.</p>
        <h2>Use of the tools</h2>
        <p>You may use the tools for personal and commercial purposes free of charge. Do not use them to break the law, to infringe someone else's rights, or to disrupt the site.</p>
        <h2>No warranty</h2>
        <p>
          The tools are provided "as is". We work to keep them accurate, but we do not guarantee that results are correct, complete or suitable for any purpose. Check important results independently, especially for tax, legal, financial or medical decisions.
        </p>
        <h2>Limitation of liability</h2>
        <p>To the extent permitted by law, we are not liable for any loss arising from your use of the site or reliance on its results.</p>
        <h2>Your content</h2>
        <p>Files and text you use with the tools remain yours. Because processing happens in your browser, we do not receive or store them.</p>
        <h2>Changes and governing law</h2>
        <p>We may update these terms; the date above shows the latest version. These terms are governed by the laws of India.</p>
        <p>Questions: {mail}.</p>
      </>
    ),
  },
  disclaimer: {
    title: "Disclaimer",
    description: "FreeToolsPro's calculators give estimates for planning. They are not financial, tax, legal or medical advice.",
    body: () => (
      <>
        <p>
          The calculators and tools on {SITE.name} give estimates based on the information you enter and on rules and rates we believe to be current. They are for education and planning only and are not financial, investment, tax, legal or medical advice.
        </p>
        <p>
          Interest rates, tax laws and scheme rules change. Banks, employers and government bodies may calculate figures differently, for example with different rounding, compounding or day counts. Always confirm important figures with the relevant institution or a qualified professional before acting on them.
        </p>
        <p>Returns on market-linked investments such as mutual funds and NPS are not guaranteed. Past performance does not indicate future results.</p>
        <p>Health calculators such as BMI and calorie estimates are general screening tools and do not replace advice from a doctor.</p>
      </>
    ),
  },
  "cookie-policy": {
    title: "Cookie policy",
    description: "Which cookies and local storage FreeToolsPro uses for your cookie choice, analytics and advertising, why they are used, and how to change your choice.",
    body: () => (
      <>
        <h2>What we store</h2>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Set by</th>
                <th scope="col">Purpose</th>
                <th scope="col">Needs consent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>ftp_cookie_consent</td>
                <td>{SITE.name} (local storage)</td>
                <td>Remembers your cookie choice</td>
                <td>No</td>
              </tr>
              <tr>
                <td>Google AdSense cookies</td>
                <td>Google</td>
                <td>Show and measure ads; personalise ads if you allow it</td>
                <td>Yes, for personalised ads</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>Changing your choice</h2>
        <p>Use "Cookie settings" at the bottom of any page. You can also clear cookies and site data in your browser settings.</p>
        <p>
          If you choose "Necessary only", Google may still show non-personalised ads, which use limited cookies for frequency capping and fraud prevention. See{" "}
          <a href="https://policies.google.com/technologies/ads" rel="noopener">
            how Google uses cookies in advertising
          </a>
          .
        </p>
      </>
    ),
  },
};
