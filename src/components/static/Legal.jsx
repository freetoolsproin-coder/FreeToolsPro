// Content for About, Contact and policy pages. Review with your own adviser before publishing changes.
import { SITE } from "../../data/site.js";
import { TOOLS } from "../../data/catalog.js";

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
          Financial and tax calculators use the rules for FY 2026-27 and current scheme rates, which we review regularly. They are estimates for planning, not advice. For decisions about money, tax or health, check with your bank, employer, a chartered accountant or a doctor. <a href="/methodology">How we build and check our tools</a> explains the formulas, sources, reviews and how corrections are handled.
        </p>
        <h2 id="author">Who builds {SITE.name}</h2>
        <p>
          {SITE.name} is built and maintained by our team. We have years of experience in UI architecture, UX and front-end development, and we have designed and delivered web applications across education, e-commerce and enterprise platforms. That background shapes how the tools are built: fast on an ordinary phone, clear to use and private by default.
        </p>
        <p>
          We also publish the site's <a href="/ebooks">free ebooks</a> on loans, tax, salary, study and everyday files.
        </p>
        <h2>How the site is funded</h2>
        <p>The tools are free to use. We do not sell data and do not ask you to create an account.</p>
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
    updated: "2026-11-07",
    description: "How FreeToolsPro handles your data: tools run in your browser, files are never uploaded, and analytics are used only with consent.",
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
        <h2>Analytics</h2>
        <p>
          We use Google Analytics (loaded through Google Tag Manager) to understand which pages and tools are used, so we can improve them. It records things like pages viewed, approximate location (country or city), device and browser type, and how you arrived at the site. Analytics cookies are only set if you accept them in our cookie banner. Google Analytics does not receive anything you type, paste or upload into a tool. You can also install the{" "}
          <a href="https://tools.google.com/dlpage/gaoptout" rel="noopener">
            Google Analytics opt-out browser add-on
          </a>
          .
        </p>
        <p>We do not sell your personal data.</p>
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
  methodology: {
    title: "How we build and check our tools",
    description: "How FreeToolsPro calculators and converters work, where their rules and rates come from, how they are tested and reviewed, and how to report a mistake.",
    body: () => (
      <>
        <p>
          Every tool on {SITE.name} is built and maintained by <a href="/about">our team</a>. This page explains how the tools work, where their numbers come from and what happens when something is wrong.
        </p>
        <h2>How calculations are done</h2>
        <p>
          Calculators use the standard published formulas for each job: the reducing-balance formula for loan EMIs, monthly compounding for SIPs, quarterly compounding for most bank FDs and RDs, and the slab, rebate, surcharge and cess rules of the Income-tax Act for tax. Each tool page has a "How it's calculated" section with the formula and a worked example produced by the calculator itself, so the example and the tool always agree.
        </p>
        <p>
          Amounts are shown rounded to the nearest rupee. Banks, employers and the tax department sometimes round, time or define inputs differently, so small differences from an official statement are normal. Results are estimates for planning, not financial, tax or medical advice.
        </p>
        <h2>Where rules and rates come from</h2>
        <p>
          Tax slabs, deductions and limits follow the Income Tax Department for the financial year shown on each page (currently FY 2026-27). Scheme rates such as PPF and EPF follow the rates notified by the Government of India and EPFO. GST rates follow the GST Council and CBIC. Grade conversions follow the formula each board or university publishes. Tool pages link to these official sources under "Sources".
        </p>
        <h2>How tools are tested</h2>
        <p>
          Every build of the site runs automatic checks: each tool must have a working implementation, a description, questions and answers, and links that point to real pages. Worked examples on tool pages are generated by running each calculator, so a formula change shows up in its example straight away. Images, PDFs and text are processed in your browser and never uploaded.
        </p>
        <h2>Reviews</h2>
        <p>
          Tax, salary and scheme-rate tools are reviewed when the rules or rates they use change, such as after the Union Budget or a quarterly small-savings rate revision. The date of the last review is shown at the bottom of every tool page.
        </p>
        <h2 id="corrections">Corrections</h2>
        <p>
          If you find a result that looks wrong, email {mail} with the tool, the values you entered and what you expected. Confirmed errors are fixed as soon as possible, and the review date on the affected pages is updated. Corrections that change a calculated result are listed below with the date of the fix.
        </p>
        <p className="muted">No corrections have been recorded since this policy was published on 31 October 2026.</p>
        <h2>Use of AI</h2>
        <p>
          The study and writing tools use rules that run on your device rather than a remote AI model. The concept explainer can optionally look a term up on Wikipedia; only the term is sent. No tool sends your files or notes to an AI service.
        </p>
        <h2>Independence</h2>
        <p>
          No tool recommends a particular bank, fund or product.
        </p>
      </>
    ),
  },
  "cookie-policy": {
    title: "Cookie policy",
    updated: "2026-11-07",
    description: "Which cookies and local storage FreeToolsPro uses for your cookie choice and analytics, why they are used, and how to change your choice.",
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
                <td>_ga, _ga_* (Google Analytics)</td>
                <td>Google</td>
                <td>Count visits and see which pages and tools are used</td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h2>Changing your choice</h2>
        <p>Use "Cookies Settings" at the bottom of any page. You can also clear cookies and site data in your browser settings.</p>
      </>
    ),
  },
};
