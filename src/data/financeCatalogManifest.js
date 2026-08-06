/** Finance / loan / tax / salary catalog tools to scaffold. */
export const FINANCE_CATALOG = [
  // Mutual fund
  ["lumpsum-calculator", "Lumpsum Calculator", "Project lumpsum mutual fund growth over time.", "mutual-fund-tools", "LumpsumCalculator", "PiggyBank", "lumpsum", ["lumpsum", "mf"]],
  ["swp-calculator", "SWP Calculator", "Estimate how long a systematic withdrawal lasts.", "mutual-fund-tools", "SwpCalculator", "Wallet", "swp", ["swp"]],
  ["stp-calculator", "STP Calculator", "Model systematic transfer plan from one fund to another.", "mutual-fund-tools", "StpCalculator", "ArrowRightLeft", "stp", ["stp"]],
  ["goal-planner", "Goal Planner", "Find the SIP needed to reach a financial goal.", "mutual-fund-tools", "GoalPlanner", "Target", "goal_planner", ["goal", "sip"]],
  ["retirement-corpus-calculator", "Retirement Corpus Calculator", "Estimate the corpus needed for retirement expenses.", "mutual-fund-tools", "RetirementCorpusCalculator", "Home", "retirement_corpus", ["retirement"]],
  ["child-education-planner", "Child Education Planner", "Plan SIPs for future education costs with inflation.", "mutual-fund-tools", "ChildEducationPlanner", "GraduationCap", "child_education", ["education"]],
  ["fire-calculator", "FIRE Calculator", "Estimate your FIRE number and years to financial independence.", "mutual-fund-tools", "FireCalculator", "Flame", "fire", ["fire"]],

  // Loans
  ["home-loan-calculator", "Home Loan Calculator", "Calculate home loan EMI, interest, and total payout.", "loan-calculators", "HomeLoanCalculator", "Home", "loan_emi", ["home loan", "emi"]],
  ["car-loan-calculator", "Car Loan Calculator", "Calculate car loan EMI and total interest.", "loan-calculators", "CarLoanCalculator", "Car", "loan_emi", ["car loan"]],
  ["personal-loan-calculator", "Personal Loan Calculator", "Calculate personal loan EMI and interest cost.", "loan-calculators", "PersonalLoanCalculator", "Wallet", "loan_emi", ["personal loan"]],
  ["education-loan-calculator", "Education Loan Calculator", "Calculate education loan EMI and total payment.", "loan-calculators", "EducationLoanCalculator", "GraduationCap", "loan_emi", ["education loan"]],
  ["gold-loan-calculator", "Gold Loan Calculator", "Estimate gold loan EMI from amount, rate, and tenure.", "loan-calculators", "GoldLoanCalculator", "Coins", "loan_emi", ["gold loan"]],
  ["business-loan-calculator", "Business Loan Calculator", "Calculate business loan EMI and interest.", "loan-calculators", "BusinessLoanCalculator", "BriefcaseBusiness", "loan_emi", ["business loan"]],
  ["loan-prepayment-calculator", "Loan Prepayment Calculator", "See EMI and interest impact of a loan prepayment.", "loan-calculators", "LoanPrepaymentCalculator", "BadgeIndianRupee", "loan_prepay", ["prepayment"]],
  ["balance-transfer-calculator", "Balance Transfer Calculator", "Compare savings from transferring a loan to a lower rate.", "loan-calculators", "BalanceTransferCalculator", "ArrowRightLeft", "balance_transfer", ["balance transfer"]],

  // Tax
  ["income-tax-calculator", "Income Tax Calculator", "Estimate Indian income tax under old or new regime.", "tax-tools", "IncomeTaxCalculator", "ReceiptIndianRupee", "income_tax", ["income tax"]],
  ["old-vs-new-tax-regime", "Old vs New Tax Regime", "Compare old vs new regime tax side by side.", "tax-tools", "OldVsNewTaxRegime", "GitCompare", "old_vs_new", ["tax regime"]],
  ["hra-calculator", "HRA Calculator", "Calculate HRA exemption for metro and non-metro cities.", "tax-tools", "HraCalculator", "Home", "hra", ["hra"]],
  ["standard-deduction-calculator", "Standard Deduction Calculator", "Apply salaried standard deduction by regime.", "tax-tools", "StandardDeductionCalculator", "FileText", "standard_deduction", ["standard deduction"]],
  ["section-80c-calculator", "Section 80C Calculator", "Track Section 80C investments against the ₹1.5L limit.", "tax-tools", "Section80cCalculator", "PiggyBank", "section_80c", ["80c"]],
  ["capital-gains-tax-calculator", "Capital Gains Tax Calculator", "Estimate capital gains tax on equity and other assets.", "tax-tools", "CapitalGainsTaxCalculator", "LineChart", "capital_gains", ["capital gains"]],
  ["gst-inclusive-exclusive-calculator", "GST Inclusive/Exclusive Calculator", "Convert between GST-inclusive and exclusive amounts.", "tax-tools", "GstInclusiveExclusiveCalculator", "Percent", "gst_calc", ["gst"]],
  ["tds-calculator", "TDS Calculator", "Calculate TDS amount and net payable.", "tax-tools", "TdsCalculator", "Receipt", "tds", ["tds"]],
  ["advance-tax-calculator", "Advance Tax Calculator", "Split annual tax into advance-tax installments.", "tax-tools", "AdvanceTaxCalculator", "CalendarDays", "advance_tax", ["advance tax"]],

  // Salary & HR
  ["in-hand-salary-calculator", "In-hand Salary Calculator", "Estimate monthly in-hand salary from CTC.", "salary-hr", "InHandSalaryCalculator", "Wallet", "inhand_salary", ["in-hand", "salary"]],
  ["ctc-calculator", "CTC Calculator", "Break CTC into basic, HRA, and common components.", "salary-hr", "CtcCalculator", "BriefcaseBusiness", "ctc_breakup", ["ctc"]],
  ["salary-breakup-calculator", "Salary Breakup Calculator", "View an illustrative monthly salary breakup.", "salary-hr", "SalaryBreakupCalculator", "ListOrdered", "ctc_breakup", ["salary breakup"]],
  ["pf-calculator", "PF Calculator", "Calculate employee and employer PF contributions.", "salary-hr", "PfCalculator", "PiggyBank", "pf_calc", ["pf", "epf"]],
  ["epf-interest-calculator", "EPF Interest Calculator", "Project EPF corpus with assumed interest.", "salary-hr", "EpfInterestCalculator", "PiggyBank", "epf_interest", ["epf"]],
  ["leave-encashment-calculator", "Leave Encashment Calculator", "Estimate leave encashment from basic pay and days.", "salary-hr", "LeaveEncashmentCalculator", "CalendarDays", "leave_encash", ["leave encashment"]],
  ["bonus-calculator", "Bonus Calculator", "Calculate bonus as months of salary.", "salary-hr", "BonusCalculator", "Award", "bonus", ["bonus"]],
  ["notice-period-calculator", "Notice Period Calculator", "Estimate notice buyout for unserved days.", "salary-hr", "NoticePeriodCalculator", "Clock3", "notice_period", ["notice period"]],
];

export function normalizeFinanceEntry(row) {
  const [id, name, desc, category, component, icon, kind, keywords] = row;
  return {
    id,
    name,
    desc,
    category,
    component,
    icon,
    kind,
    keywords,
    path: `/${category}/${id}`,
    folder: category,
    seoKey: id
      .split("-")
      .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
      .join(""),
  };
}

export const FINANCE_CATALOG_NORMALIZED = FINANCE_CATALOG.map(normalizeFinanceEntry);

/** Field presets by compute kind */
export const FIELD_PRESETS = {
  lumpsum: [
    { key: "amount", label: "Investment (₹)", default: 100000 },
    { key: "rate", label: "Expected return % p.a.", default: 12 },
    { key: "years", label: "Years", default: 10 },
  ],
  swp: [
    { key: "corpus", label: "Starting corpus (₹)", default: 5000000 },
    { key: "withdrawal", label: "Monthly withdrawal (₹)", default: 30000 },
    { key: "rate", label: "Expected return % p.a.", default: 8 },
  ],
  stp: [
    { key: "fromAmount", label: "Source amount (₹)", default: 500000 },
    { key: "transfer", label: "Monthly transfer (₹)", default: 20000 },
    { key: "rate", label: "Dest. return % p.a.", default: 12 },
    { key: "months", label: "Months", default: 24 },
  ],
  goal_planner: [
    { key: "goal", label: "Goal amount (₹)", default: 2000000 },
    { key: "years", label: "Years", default: 8 },
    { key: "rate", label: "Expected return % p.a.", default: 12 },
  ],
  retirement_corpus: [
    { key: "expense", label: "Monthly expense today (₹)", default: 50000 },
    { key: "years", label: "Years to retire", default: 20 },
    { key: "inflation", label: "Inflation %", default: 6 },
    { key: "returnRate", label: "Post-retire return %", default: 7 },
  ],
  child_education: [
    { key: "cost", label: "Today's education cost (₹)", default: 1500000 },
    { key: "years", label: "Years until needed", default: 12 },
    { key: "inflation", label: "Education inflation %", default: 8 },
    { key: "rate", label: "Investment return %", default: 12 },
  ],
  fire: [
    { key: "expense", label: "Monthly expense (₹)", default: 80000 },
    { key: "withdraw", label: "Withdrawal rate %", default: 4, step: 0.25 },
    { key: "savings", label: "Current investments (₹)", default: 2000000 },
    { key: "invest", label: "Monthly invest (₹)", default: 50000 },
    { key: "returnRate", label: "Return % p.a.", default: 12 },
  ],
  loan_emi: [
    { key: "amount", label: "Loan amount (₹)", default: 2500000 },
    { key: "rate", label: "Interest % p.a.", default: 8.5, step: 0.05 },
    { key: "years", label: "Tenure (years)", default: 20 },
  ],
  loan_prepay: [
    { key: "amount", label: "Outstanding (₹)", default: 2000000 },
    { key: "rate", label: "Interest % p.a.", default: 9 },
    { key: "years", label: "Remaining years", default: 15 },
    { key: "prepay", label: "Prepayment (₹)", default: 200000 },
  ],
  balance_transfer: [
    { key: "amount", label: "Outstanding (₹)", default: 3000000 },
    { key: "oldRate", label: "Current rate %", default: 9.5 },
    { key: "newRate", label: "New rate %", default: 8.4 },
    { key: "years", label: "Remaining years", default: 15 },
    { key: "feePct", label: "Transfer fee %", default: 0.5, step: 0.1 },
  ],
  income_tax: [
    { key: "income", label: "Taxable income (₹)", default: 1200000 },
    {
      key: "regime",
      label: "Regime",
      type: "select",
      default: "new",
      options: [
        { value: "new", label: "New" },
        { value: "old", label: "Old" },
      ],
    },
    { key: "deductions", label: "Deductions (old regime)", default: 150000 },
  ],
  old_vs_new: [
    { key: "income", label: "Gross income (₹)", default: 1500000 },
    { key: "deductions", label: "Old-regime deductions (₹)", default: 200000 },
  ],
  hra: [
    { key: "basic", label: "Basic salary (₹ / yr)", default: 600000 },
    { key: "hra", label: "HRA received (₹ / yr)", default: 240000 },
    { key: "rent", label: "Rent paid (₹ / yr)", default: 300000 },
    {
      key: "metro",
      label: "Metro city?",
      type: "select",
      default: "yes",
      options: [
        { value: "yes", label: "Yes" },
        { value: "no", label: "No" },
      ],
    },
  ],
  standard_deduction: [
    { key: "income", label: "Salary income (₹)", default: 1000000 },
    {
      key: "regime",
      label: "Regime",
      type: "select",
      default: "new",
      options: [
        { value: "new", label: "New" },
        { value: "old", label: "Old" },
      ],
    },
  ],
  section_80c: [{ key: "invest", label: "80C investments (₹)", default: 120000 }],
  capital_gains: [
    { key: "buy", label: "Buy value (₹)", default: 200000 },
    { key: "sell", label: "Sell value (₹)", default: 350000 },
    {
      key: "type",
      label: "Gain type",
      type: "select",
      default: "ltcg_equity",
      options: [
        { value: "ltcg_equity", label: "LTCG equity" },
        { value: "stcg_equity", label: "STCG equity" },
        { value: "ltcg_debt", label: "LTCG other/debt" },
        { value: "stcg_other", label: "STCG other" },
      ],
    },
  ],
  gst_calc: [
    { key: "amount", label: "Amount (₹)", default: 10000 },
    { key: "rate", label: "GST %", default: 18 },
    {
      key: "mode",
      label: "Mode",
      type: "select",
      default: "exclusive",
      options: [
        { value: "exclusive", label: "Exclusive (add GST)" },
        { value: "inclusive", label: "Inclusive (extract GST)" },
      ],
    },
  ],
  tds: [
    { key: "amount", label: "Payment amount (₹)", default: 100000 },
    { key: "rate", label: "TDS %", default: 10 },
  ],
  advance_tax: [{ key: "tax", label: "Estimated annual tax (₹)", default: 200000 }],
  inhand_salary: [{ key: "ctc", label: "Annual CTC (₹)", default: 1200000 }],
  ctc_breakup: [{ key: "ctc", label: "Annual CTC (₹)", default: 1200000 }],
  pf_calc: [{ key: "basic", label: "Monthly basic (₹)", default: 40000 }],
  epf_interest: [
    { key: "monthly", label: "Monthly contribution (₹)", default: 5000 },
    { key: "rate", label: "Interest % p.a.", default: 8.25, step: 0.05 },
    { key: "years", label: "Years", default: 15 },
  ],
  leave_encash: [
    { key: "basic", label: "Monthly basic (₹)", default: 40000 },
    { key: "days", label: "Leave days", default: 15 },
  ],
  bonus: [
    { key: "salary", label: "Monthly salary (₹)", default: 50000 },
    { key: "months", label: "Bonus months", default: 1, step: 0.5 },
  ],
  notice_period: [
    { key: "salary", label: "Monthly salary (₹)", default: 60000 },
    { key: "notice", label: "Notice days", default: 90 },
    { key: "served", label: "Days served", default: 30 },
  ],
  gratuity: [
    { key: "salary", label: "Last drawn basic+DA (₹)", default: 50000 },
    { key: "years", label: "Years of service", default: 7 },
  ],
};
