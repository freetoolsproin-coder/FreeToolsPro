import { buildVariant } from "./buildVariant.js";

/** Repetitive math / finance formula landings → deep-link to calculators. */
const FORMULAS = [
  {
    slug: "simple-interest-formula",
    parentPath: "/banking-tools/simple-interest-calculator",
    parentName: "Simple Interest Calculator",
    h1: "Simple Interest Formula Calculator Online",
    title: "Simple Interest Formula (SI = PRT/100) Online | FreeToolsPro",
    description:
      "Calculate simple interest online with the SI = P×R×T/100 formula. Free browser calculator—no signup.",
    keywords: ["simple interest formula", "SI = PRT/100", "simple interest calculator online"],
    formula: "SI = (P × R × T) / 100",
    explain: "P is principal, R is annual rate (%), T is time in years.",
  },
  {
    slug: "compound-interest-formula",
    parentPath: "/banking-tools/compound-interest-calculator",
    parentName: "Compound Interest Calculator",
    h1: "Compound Interest Formula Calculator Online",
    title: "Compound Interest Formula Online Free | FreeToolsPro",
    description:
      "Use the compound interest formula online free. Model compounding frequency and growth in your browser.",
    keywords: ["compound interest formula", "compound interest calculator", "A = P(1+r/n)^nt"],
    formula: "A = P (1 + r/n)^(n t)",
    explain: "A is amount, P principal, r rate (decimal), n compounds/year, t years.",
  },
  {
    slug: "emi-formula",
    parentPath: "/calculators/emi-calculator",
    parentName: "EMI Calculator",
    h1: "EMI Formula Calculator Online",
    title: "EMI Formula Calculator Free Online | FreeToolsPro",
    description:
      "Calculate loan EMI online with the standard EMI formula. Free for home, car, and personal loans.",
    keywords: ["emi formula", "loan emi calculator", "emi calculation formula"],
    formula: "EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]",
    explain: "P is loan amount, R monthly rate, N number of months.",
  },
  {
    slug: "bmi-formula",
    parentPath: "/calculators/bmi-calculator",
    parentName: "BMI Calculator",
    h1: "BMI Formula Calculator Online",
    title: "BMI Formula (kg/m²) Online Free | FreeToolsPro",
    description:
      "Calculate BMI online using weight ÷ height². Free BMI formula calculator with category guidance.",
    keywords: ["bmi formula", "body mass index calculator", "bmi kg/m2"],
    formula: "BMI = weight (kg) / [height (m)]²",
    explain: "Or use lb/in with the imperial variant of the same ratio.",
  },
  {
    slug: "sip-future-value-formula",
    parentPath: "/calculators/sip-calculator",
    parentName: "SIP Calculator",
    h1: "SIP Future Value Formula Online",
    title: "SIP Formula Calculator Online Free | FreeToolsPro",
    description:
      "Estimate SIP future value online with the systematic investment formula. Free mutual fund SIP calculator.",
    keywords: ["sip formula", "sip calculator", "future value of sip"],
    formula: "FV = P × ((1 + r)^n – 1) / r × (1 + r)",
    explain: "P is installment, r periodic rate, n number of installments (variant forms exist).",
  },
  {
    slug: "percentage-increase-formula",
    parentPath: "/calculators/inflation-calculator",
    parentName: "Inflation Calculator",
    h1: "Percentage Increase Formula Online",
    title: "Percentage Increase Formula Calculator | FreeToolsPro",
    description:
      "Learn and apply the percentage increase formula online. Pair with inflation and finance calculators on FreeToolsPro.",
    keywords: ["percentage increase formula", "percent change calculator", "% increase"],
    formula: "Increase % = ((New – Old) / Old) × 100",
    explain: "Use absolute values carefully when Old is zero or negative.",
  },
  {
    slug: "gst-amount-formula",
    parentPath: "/business-tools/gst-calculator",
    parentName: "GST Calculator",
    h1: "GST Amount Formula Calculator India",
    title: "GST Formula Calculator India Online | FreeToolsPro",
    description:
      "Calculate GST amount online for India invoices. Inclusive/exclusive GST formula helpers—free, no signup.",
    keywords: ["gst formula india", "gst calculator", "cgst sgst calculation"],
    formula: "GST = Taxable value × (Rate / 100)",
    explain: "Split into CGST/SGST for intra-state or use IGST for inter-state supplies.",
  },
  {
    slug: "loan-eligibility-rule-of-thumb",
    parentPath: "/calculators/loan-eligibility-calculator",
    parentName: "Loan Eligibility Calculator",
    h1: "Loan Eligibility Formula & FOIR Online",
    title: "Loan Eligibility Calculator FOIR Online | FreeToolsPro",
    description:
      "Estimate loan eligibility online using income, obligations, and FOIR-style rules. Free calculator for India loans.",
    keywords: ["loan eligibility formula", "foir calculator", "how much loan can i get"],
    formula: "Eligible EMI ≈ (Income × FOIR) – Existing EMIs",
    explain: "Lenders vary FOIR caps; this is an educational estimate, not a bank offer.",
  },
];

export function buildMathFormulaVariants() {
  return FORMULAS.map((f) =>
    buildVariant({
      slug: f.slug,
      parentPath: f.parentPath,
      parentName: f.parentName,
      category: f.parentPath.split("/")[1] || "calculators",
      h1: f.h1,
      title: f.title,
      description: f.description,
      keywords: f.keywords,
      intro: `${f.explain} Formula: ${f.formula}. Open the free ${f.parentName} to compute values instantly.`,
      steps: [
        `Remember the formula: ${f.formula}`,
        `Open ${f.parentName} on FreeToolsPro.`,
        "Enter your inputs and read the result.",
      ],
      faqs: [
        {
          q: "Is this financial advice?",
          a: "No. Calculators are educational utilities. Confirm important decisions with a qualified advisor or your lender.",
        },
        {
          q: `What is the formula used?`,
          a: f.formula,
        },
      ],
      presets: { formula: f.slug },
      ctaLabel: `Open ${f.parentName}`,
    })
  );
}
