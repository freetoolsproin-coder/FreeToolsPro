/** Retirement, banking, insurance, business finance, and daily market pages. */

export const FINANCE2_CATALOG = [
  // Retirement
  ["pension-calculator", "Pension Calculator", "Estimate pension income from a retirement corpus and annuity rate.", "retirement-tools", "PensionCalculator", "Landmark", "pension", ["pension"], "calc"],
  ["nps-calculator", "NPS Calculator", "Project NPS corpus, lump sum, and annuity pension.", "retirement-tools", "NpsCalculator", "PiggyBank", "nps", ["nps"], "calc"],
  ["epf-pension-estimator", "EPF Pension Estimator", "Estimate EPS pension from pensionable salary and service years.", "retirement-tools", "EpfPensionEstimator", "PiggyBank", "epf_pension", ["epf", "eps"], "calc"],
  ["retirement-planner", "Retirement Planner", "Compare corpus needed versus SIP accumulation for retirement.", "retirement-tools", "RetirementPlanner", "Home", "retirement_planner", ["retirement"], "calc"],
  ["safe-withdrawal-rate-calculator", "Safe Withdrawal Rate Calculator", "Calculate sustainable withdrawal amounts from a corpus.", "retirement-tools", "SafeWithdrawalRateCalculator", "Percent", "swr", ["swr", "fire"], "calc"],

  // Banking
  ["fd-calculator", "FD Calculator", "Calculate fixed deposit maturity value and interest.", "banking-tools", "FdCalculator", "Landmark", "fd", ["fd", "fixed deposit"], "calc"],
  ["rd-calculator", "RD Calculator", "Calculate recurring deposit maturity value.", "banking-tools", "RdCalculator", "PiggyBank", "rd", ["rd"], "calc"],
  ["compound-interest-calculator", "Compound Interest Calculator", "Compute compound interest with flexible compounding.", "banking-tools", "CompoundInterestCalculator", "TrendingUp", "compound_interest", ["compound interest"], "calc"],
  ["simple-interest-calculator", "Simple Interest Calculator", "Compute simple interest and total amount.", "banking-tools", "SimpleInterestCalculator", "Percent", "simple_interest", ["simple interest"], "calc"],
  ["savings-interest-calculator", "Savings Interest Calculator", "Estimate savings-account interest for a period.", "banking-tools", "SavingsInterestCalculator", "Wallet", "savings_interest", ["savings"], "calc"],
  ["credit-card-emi-calculator", "Credit Card EMI Calculator", "Calculate credit card EMI, interest, and total payable.", "banking-tools", "CreditCardEmiCalculator", "CreditCard", "cc_emi", ["credit card", "emi"], "calc"],
  ["credit-card-payoff-calculator", "Credit Card Payoff Calculator", "Estimate months to pay off a credit card balance.", "banking-tools", "CreditCardPayoffCalculator", "CreditCard", "cc_payoff", ["credit card", "payoff"], "calc"],
  ["credit-utilization-calculator", "Credit Utilization Calculator", "Check credit utilization ratio against your limit.", "banking-tools", "CreditUtilizationCalculator", "Gauge", "credit_util", ["credit utilization"], "calc"],

  // Insurance
  ["term-insurance-calculator", "Term Insurance Calculator", "Ballpark term life premium from cover, age, and tenure.", "insurance-tools", "TermInsuranceCalculator", "Shield", "term_insurance", ["term insurance"], "calc"],
  ["life-insurance-calculator", "Life Insurance Calculator", "Estimate life cover needs from income and liabilities.", "insurance-tools", "LifeInsuranceCalculator", "ShieldCheck", "life_insurance", ["life insurance"], "calc"],
  ["health-insurance-premium-estimator", "Health Insurance Premium Estimator", "Estimate family health insurance premiums.", "insurance-tools", "HealthInsurancePremiumEstimator", "HeartPulse", "health_premium", ["health insurance"], "calc"],
  ["vehicle-insurance-estimator", "Vehicle Insurance Estimator", "Estimate OD + TP vehicle insurance premium.", "insurance-tools", "VehicleInsuranceEstimator", "Car", "vehicle_insurance", ["vehicle insurance"], "calc"],

  // Business finance
  ["invoice-generator", "Invoice Generator", "Create a simple business invoice you can copy or print.", "business-finance", "InvoiceGenerator", "FileText", "invoice", ["invoice"], "invoice"],
  ["gst-invoice-generator", "GST Invoice Generator", "Generate a GST-style invoice with taxable value and tax.", "business-finance", "GstInvoiceGenerator", "ReceiptIndianRupee", "gst_invoice", ["gst invoice"], "invoice"],
  ["profit-margin-calculator", "Profit Margin Calculator", "Calculate profit, margin %, and markup %.", "business-finance", "ProfitMarginCalculator", "Percent", "profit_margin", ["margin"], "calc"],
  ["break-even-calculator", "Break-even Calculator", "Find break-even units and revenue.", "business-finance", "BreakEvenCalculator", "Target", "breakeven", ["break even"], "calc"],
  ["depreciation-calculator", "Depreciation Calculator", "Calculate straight-line or WDV depreciation.", "business-finance", "DepreciationCalculator", "Calculator", "depreciation", ["depreciation"], "calc"],
  ["roi-calculator", "ROI Calculator", "Measure return on investment for a project or campaign.", "business-finance", "RoiCalculator", "TrendingUp", "roi", ["roi"], "calc"],
  ["business-valuation-calculator", "Business Valuation Calculator", "Estimate business value using an earnings multiple.", "business-finance", "BusinessValuationCalculator", "BriefcaseBusiness", "business_valuation", ["valuation"], "calc"],
];

export function normalizeFinance2(row) {
  const [id, name, desc, category, component, icon, kind, keywords, ui] = row;
  return {
    id,
    name,
    desc,
    category,
    component,
    icon,
    kind,
    keywords,
    ui,
    path: `/${category}/${id}`,
    folder: category,
    seoKey: id
      .split("-")
      .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
      .join(""),
  };
}

export const FINANCE2_NORMALIZED = FINANCE2_CATALOG.map(normalizeFinance2);

export const FIELD_PRESETS_2 = {
  pension: [
    { key: "corpus", label: "Corpus (₹)", default: 5000000 },
    { key: "rate", label: "Annuity rate % p.a.", default: 6, step: 0.1 },
  ],
  nps: [
    { key: "monthly", label: "Monthly contribution (₹)", default: 10000 },
    { key: "years", label: "Years to retire", default: 25 },
    { key: "rate", label: "Expected return %", default: 10 },
    { key: "annuityRate", label: "Annuity rate %", default: 6 },
  ],
  epf_pension: [
    { key: "pensionable", label: "Pensionable salary (₹)", default: 15000 },
    { key: "service", label: "Years of service", default: 20 },
  ],
  retirement_planner: [
    { key: "expense", label: "Monthly expense today (₹)", default: 60000 },
    { key: "years", label: "Years to retire", default: 20 },
    { key: "inflation", label: "Inflation %", default: 6 },
    { key: "returnRate", label: "Return %", default: 10 },
    { key: "sip", label: "Monthly SIP (₹)", default: 25000 },
  ],
  swr: [
    { key: "corpus", label: "Corpus (₹)", default: 10000000 },
    { key: "rate", label: "Withdrawal rate %", default: 4, step: 0.25 },
  ],
  fd: [
    { key: "amount", label: "Deposit (₹)", default: 200000 },
    { key: "rate", label: "Interest % p.a.", default: 6.5, step: 0.05 },
    { key: "years", label: "Years", default: 3 },
    {
      key: "freq",
      label: "Compounding",
      type: "select",
      default: "4",
      options: [
        { value: "1", label: "Yearly" },
        { value: "2", label: "Half-yearly" },
        { value: "4", label: "Quarterly" },
      ],
    },
  ],
  rd: [
    { key: "monthly", label: "Monthly deposit (₹)", default: 5000 },
    { key: "rate", label: "Interest % p.a.", default: 6.5 },
    { key: "months", label: "Months", default: 36 },
  ],
  compound_interest: [
    { key: "principal", label: "Principal (₹)", default: 100000 },
    { key: "rate", label: "Rate % p.a.", default: 8 },
    { key: "years", label: "Years", default: 5 },
    {
      key: "freq",
      label: "Compounding / year",
      type: "select",
      default: "4",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "4", label: "4" },
        { value: "12", label: "12" },
      ],
    },
  ],
  simple_interest: [
    { key: "principal", label: "Principal (₹)", default: 100000 },
    { key: "rate", label: "Rate % p.a.", default: 8 },
    { key: "years", label: "Years", default: 3 },
  ],
  savings_interest: [
    { key: "balance", label: "Average balance (₹)", default: 150000 },
    { key: "rate", label: "Interest % p.a.", default: 3 },
    { key: "days", label: "Days", default: 30 },
  ],
  cc_emi: [
    { key: "amount", label: "Amount (₹)", default: 50000 },
    { key: "rate", label: "Interest % p.a.", default: 15 },
    { key: "months", label: "Tenure (months)", default: 12 },
  ],
  cc_payoff: [
    { key: "balance", label: "Card balance (₹)", default: 80000 },
    { key: "apr", label: "APR %", default: 36 },
    { key: "payment", label: "Monthly payment (₹)", default: 8000 },
  ],
  credit_util: [
    { key: "limit", label: "Credit limit (₹)", default: 200000 },
    { key: "used", label: "Used credit (₹)", default: 45000 },
  ],
  term_insurance: [
    { key: "cover", label: "Cover (₹)", default: 10000000 },
    { key: "age", label: "Age", default: 30 },
    { key: "years", label: "Policy term (years)", default: 30 },
  ],
  life_insurance: [
    { key: "income", label: "Annual income (₹)", default: 1200000 },
    { key: "years", label: "Income years to replace", default: 15 },
    { key: "liabilities", label: "Liabilities (₹)", default: 2000000 },
  ],
  health_premium: [
    { key: "cover", label: "Cover (₹)", default: 1000000 },
    { key: "age", label: "Oldest member age", default: 35 },
    { key: "members", label: "Members", default: 3 },
  ],
  vehicle_insurance: [
    { key: "idv", label: "IDV (₹)", default: 600000 },
    { key: "rate", label: "OD rate %", default: 1.5, step: 0.1 },
    { key: "tp", label: "Third-party premium (₹)", default: 3500 },
  ],
  profit_margin: [
    { key: "cost", label: "Cost (₹)", default: 800 },
    { key: "price", label: "Selling price (₹)", default: 1000 },
  ],
  breakeven: [
    { key: "fixed", label: "Fixed costs (₹)", default: 500000 },
    { key: "price", label: "Price / unit (₹)", default: 500 },
    { key: "variable", label: "Variable cost / unit (₹)", default: 300 },
  ],
  depreciation: [
    { key: "cost", label: "Asset cost (₹)", default: 500000 },
    { key: "salvage", label: "Salvage value (₹)", default: 50000 },
    { key: "years", label: "Useful life (years)", default: 5 },
    { key: "rate", label: "WDV rate %", default: 15 },
    {
      key: "method",
      label: "Method",
      type: "select",
      default: "slm",
      options: [
        { value: "slm", label: "Straight line" },
        { value: "wdv", label: "WDV" },
      ],
    },
  ],
  roi: [
    { key: "invest", label: "Investment (₹)", default: 200000 },
    { key: "gain", label: "Final value / returns (₹)", default: 260000 },
  ],
  business_valuation: [
    { key: "earnings", label: "Annual earnings (₹)", default: 5000000 },
    { key: "multiple", label: "Earnings multiple", default: 8, step: 0.5 },
  ],
};

