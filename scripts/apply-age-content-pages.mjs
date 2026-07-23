/**
 * Replace ToolContentLayout SEO dumps with Age-style ToolPageContent on key tools.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const PAGES = {
  "src/tools/calculators/SipCalculator.jsx": {
    importReplace: true,
    block: `      <ToolPageContent
        category="calculators"
        currentToolPath="/calculators/sip-calculator"
        howTitle="Compound SIP math, zero friction."
        howBody="FreeToolsPro SIP Calculator estimates maturity value from monthly investment, expected return, and tenure—then breaks out total invested vs wealth gained so you can plan retirement, education, or goal-based wealth building with clarity."
        steps={[
          { title: "Set monthly SIP", body: "Choose how much you invest every month." },
          { title: "Add return & tenure", body: "Expected annual return and years drive the compound projection." },
          { title: "Read the corpus", body: "See maturity value, total invested, and estimated gains instantly." },
        ]}
        useCases={[
          "Retirement and long-term wealth planning",
          "Child education and goal-based SIPs",
          "Comparing monthly amount vs tenure scenarios",
        ]}
        faqs={[
          { q: "Is this SIP Calculator free?", a: "Yes. Use it unlimited times with no signup or hidden fees." },
          { q: "Does it guarantee returns?", a: "No. Results are estimates based on the return rate you enter; markets vary." },
          { q: "Is my data stored?", a: "No. Calculations run in your browser and stay private." },
          { q: "Can beginners use SIP?", a: "Yes. SIP is one of the simplest ways to start disciplined mutual fund investing." },
        ]}
        trustBullets={[
          "Browser-local SIP math—inputs stay private",
          "Clear invested vs gain breakdown",
          "Mobile-ready for quick planning anywhere",
        ]}
        ctaLabel="Calculate SIP"
        exploreLabel="More calculators from the FreeToolsPro suite."
      />`,
  },
  "src/tools/calculators/EmiCalculator.jsx": {
    importReplace: true,
    block: `      <ToolPageContent
        category="calculators"
        currentToolPath="/calculators/emi-calculator"
        howTitle="Bank-formula EMI, instantly clear."
        howBody="FreeToolsPro EMI Calculator turns loan amount, interest rate, and tenure into monthly EMI, total interest, and overall repayment—using the same amortization math banks rely on."
        steps={[
          { title: "Enter loan amount", body: "Set the principal you plan to borrow." },
          { title: "Set rate & tenure", body: "Annual interest and years define monthly installments." },
          { title: "Review the breakdown", body: "See EMI, interest share, and total cost before you commit." },
        ]}
        useCases={[
          "Home, car, and personal loan planning",
          "Comparing tenure vs EMI trade-offs",
          "Budgeting total interest before applying",
        ]}
        faqs={[
          { q: "Is the EMI Calculator free?", a: "Yes. Unlimited use, no registration required." },
          { q: "Which formula does it use?", a: "The standard reducing-balance EMI formula used by banks and NBFCs." },
          { q: "Does it store loan details?", a: "No. Everything is calculated locally in your browser." },
          { q: "Can I model prepayments?", a: "Use different tenure and principal scenarios to approximate the impact of paying down faster." },
        ]}
        trustBullets={[
          "Standard bank EMI amortization",
          "Private local calculations",
          "Clear principal vs interest split",
        ]}
        ctaLabel="Calculate EMI"
        exploreLabel="More calculators from the FreeToolsPro suite."
      />`,
  },
  "src/tools/business-tools/SalaryCalculator.jsx": {
    importReplace: true,
    block: `      <ToolPageContent
        category="business-tools"
        currentToolPath="/business-tools/salary-calculator"
        howTitle="In-hand salary, tax-aware clarity."
        howBody="FreeToolsPro Salary Calculator estimates take-home pay with HRA, deductions, and new vs old regime comparison—so offers, appraisals, and monthly budgeting stay grounded in numbers."
        steps={[
          { title: "Add compensation inputs", body: "Monthly base, rent, bonus, and other income as needed." },
          { title: "Choose metro & regime", body: "Metro status and tax regime shape HRA and tax liability." },
          { title: "Read in-hand pay", body: "See net salary, tax, and deductions in a clean breakdown." },
        ]}
        useCases={[
          "Job offer and appraisal comparisons",
          "HRA and deduction planning",
          "New vs old tax regime checks",
        ]}
        faqs={[
          { q: "Is the Salary Calculator free?", a: "Yes. Use it freely with no account required." },
          { q: "Does it replace a tax professional?", a: "No. It is an estimate for planning—confirm filings with an advisor when needed." },
          { q: "Are my salary details uploaded?", a: "No. Calculations stay in your browser." },
          { q: "Can I compare tax regimes?", a: "Yes. Switch regimes to preview how take-home pay changes." },
        ]}
        trustBullets={[
          "Private, browser-local salary math",
          "HRA and deduction aware",
          "Regime comparison without spreadsheets",
        ]}
        ctaLabel="Calculate salary"
        exploreLabel="More business tools from FreeToolsPro."
      />`,
  },
  "src/tools/business-tools/GstCalculator.jsx": {
    importReplace: true,
    block: `      <ToolPageContent
        category="business-tools"
        currentToolPath="/business-tools/gst-calculator"
        howTitle="GST-inclusive or exclusive—sorted."
        howBody="FreeToolsPro GST Calculator adds or removes GST by slab, then splits CGST/SGST or IGST so invoices, quotes, and pricing stay accurate without spreadsheet fuss."
        steps={[
          { title: "Enter taxable amount", body: "Type the base price or GST-inclusive total." },
          { title: "Pick rate & mode", body: "Choose the GST slab and inclusive vs exclusive calculation." },
          { title: "Use the breakdown", body: "Copy base, GST, and payable totals for billing." },
        ]}
        useCases={[
          "Invoice and quotation pricing",
          "CGST/SGST vs IGST checks",
          "Quick slab comparisons for products",
        ]}
        faqs={[
          { q: "Is the GST Calculator free?", a: "Yes. Unlimited calculations with no signup." },
          { q: "Can it remove GST from a total?", a: "Yes. Switch to inclusive mode to back-calculate taxable value." },
          { q: "Does it store invoice data?", a: "No. All math runs locally in your browser." },
          { q: "Which slabs are supported?", a: "Common Indian GST slabs including 5%, 12%, 18%, and 28%." },
        ]}
        trustBullets={[
          "Inclusive and exclusive GST modes",
          "CGST/SGST and IGST splits",
          "Private local calculations",
        ]}
        ctaLabel="Calculate GST"
        exploreLabel="More business tools from FreeToolsPro."
      />`,
  },
  "src/tools/developer-tools/UseSpeedTest.jsx": {
    importReplace: true,
    block: `      <ToolPageContent
        category="developer-tools"
        currentToolPath="/developer-tools/speed-test"
        howTitle="Download, upload, ping—measured fast."
        howBody="FreeToolsPro Speed Test estimates download and upload throughput plus latency and jitter so you can validate home Wi‑Fi, office links, or ISP claims without installing an app."
        steps={[
          { title: "Pick a server region", body: "Choose a test endpoint closer to your location." },
          { title: "Run the test", body: "We sample ping, then estimate download and upload speeds." },
          { title: "Review history", body: "Compare recent runs to spot congestion or ISP variance." },
        ]}
        useCases={[
          "Checking ISP speed claims",
          "Diagnosing Wi‑Fi vs ethernet issues",
          "Validating call and stream readiness",
        ]}
        faqs={[
          { q: "Is the speed test free?", a: "Yes. Run it anytime without registration." },
          { q: "Why do results vary?", a: "Wi‑Fi interference, VPN, server load, and ISP throttling can all change readings." },
          { q: "Do you store my IP or results?", a: "History stays in your session/browser context; we do not require an account." },
          { q: "Can I use it on mobile?", a: "Yes. The test works on phones, tablets, and desktops." },
        ]}
        trustBullets={[
          "No app install required",
          "Ping, download, and upload in one flow",
          "Recent run history for quick comparison",
        ]}
        ctaLabel="Run speed test"
        exploreLabel="More developer tools from FreeToolsPro."
      />`,
  },
  "src/tools/trending/CurrencyConverter.jsx": {
    importReplace: true,
    block: `      <ToolPageContent
        category="trending-tools"
        currentToolPath="/trending-tools/currency-converter"
        howTitle="Live FX, chart-backed conversion."
        howBody="FreeToolsPro Currency Converter converts amounts with up-to-date exchange rates and a short historical trend so travel, invoicing, and shopping abroad stay easy to price."
        steps={[
          { title: "Enter an amount", body: "Type the value you want to convert." },
          { title: "Choose currencies", body: "Pick from and to codes—swap anytime." },
          { title: "Read the result", body: "See the converted total plus a recent rate trend." },
        ]}
        useCases={[
          "Travel budgeting and trip planning",
          "Cross-border invoices and freelancing",
          "Quick shopping and remittance estimates",
        ]}
        faqs={[
          { q: "Are rates live?", a: "Rates refresh from market sources periodically; treat them as estimates, not bank quotes." },
          { q: "Is the converter free?", a: "Yes. Unlimited conversions without signup." },
          { q: "Can I favorite currencies?", a: "Yes. Bookmark common pairs for faster selection." },
          { q: "Does it work offline?", a: "A network connection is needed for fresh rates; fallback defaults may apply if fetch fails." },
        ]}
        trustBullets={[
          "Auto-refreshing exchange rates",
          "Favorites for frequent pairs",
          "Trend view for recent movement",
        ]}
        ctaLabel="Convert currency"
        exploreLabel="More trending tools from FreeToolsPro."
      />`,
  },
};

function replaceBlock(src) {
  const start = src.search(/<\s*ToolContentLayout\b/);
  if (start < 0) return null;
  const end = src.indexOf("</ToolContentLayout>", start);
  if (end < 0) return null;
  return {
    start,
    end: end + "</ToolContentLayout>".length,
  };
}

for (const [rel, cfg] of Object.entries(PAGES)) {
  const file = path.join(root, rel);
  let src = fs.readFileSync(file, "utf8");
  const span = replaceBlock(src);
  if (!span) {
    console.log("missing block", rel);
    continue;
  }
  src = src.slice(0, span.start) + cfg.block + src.slice(span.end);
  if (src.includes("import ToolContentLayout")) {
    src = src.replace(
      /import ToolContentLayout from ["'][^"']+["'];?\r?\n?/,
      `import ToolPageContent from "../../components/ToolPageContent";\n`
    );
  } else if (!src.includes("import ToolPageContent")) {
    src = src.replace(
      /(import Seo from ["'][^"']+["'];?\r?\n?)/,
      `$1import ToolPageContent from "../../components/ToolPageContent";\n`
    );
  }
  fs.writeFileSync(file, src);
  console.log("updated", rel);
}
