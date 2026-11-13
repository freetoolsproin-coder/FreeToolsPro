export default [
  {
    id: "income-tax-calculator",
    path: "/tax-tools/income-tax-calculator",
    engine: "calc",
    popular: true,
    name: "Income Tax Calculator",
    short: "Tax for FY 2026-27, new or old regime, slab by slab",
    title: "Income Tax Calculator FY 2026-27 (AY 2027-28)",
    description:
      "Calculate income tax for FY 2026-27 under the new or old regime with slab-wise tax, 87A rebate, surcharge and 4% cess. Free and up to date.",
    intro:
      "Pick a regime, enter your income and deductions, and see tax for every slab, the Section 87A rebate, surcharge and cess. Under the new regime, salaried income up to ₹12.75 lakh (₹12 lakh plus the ₹75,000 standard deduction) is effectively tax-free.",
    faqs: [
      ["What are the new regime slabs for FY 2026-27?", "Up to ₹4 lakh: nil; ₹4–8 lakh: 5%; ₹8–12 lakh: 10%; ₹12–16 lakh: 15%; ₹16–20 lakh: 20%; ₹20–24 lakh: 25%; above ₹24 lakh: 30%. Budget 2026 left these unchanged."],
      ["How does the 87A rebate work?", "Under the new regime, if taxable income is ₹12 lakh or less the rebate (up to ₹60,000) cancels the tax. Just above ₹12 lakh, marginal relief caps your tax at the amount by which income exceeds ₹12 lakh. Under the old regime the rebate is up to ₹12,500 for income up to ₹5 lakh."],
      ["Does the new Income Tax Act 2025 change my tax?", "It replaces the 1961 Act from 1 April 2026 and renumbers sections, but the slabs, standard deduction and rebate for FY 2026-27 are the same."],
    ],
  },
  {
    id: "old-vs-new-tax-regime",
    path: "/tax-tools/old-vs-new-tax-regime",
    engine: "calc",
    name: "Old vs New Tax Regime",
    short: "Which regime leaves you more money",
    title: "Old vs New Tax Regime Calculator FY 2026-27",
    description:
      "Compare tax under the old and new regimes for FY 2026-27 side by side. Enter your deductions and see which regime saves more and by how much.",
    intro:
      "The new regime has lower rates but few deductions; the old regime has higher rates but allows 80C, 80D, HRA and home loan interest. The break-even depends on how much you can actually claim.",
    faqs: [
      ["Who should choose the old regime?", "Usually people with large deductions, such as a home loan (interest up to ₹2 lakh), full 80C, health insurance under 80D and a big HRA exemption. Enter your numbers to check."],
      ["Can I switch regimes every year?", "Salaried people without business income can choose each year when filing the return. People with business income can switch back to the old regime only once."],
    ],
  },
  {
    id: "hra-calculator",
    path: "/tax-tools/hra-calculator",
    engine: "calc",
    name: "HRA Exemption Calculator",
    short: "Tax-free part of your house rent allowance",
    title: "HRA Exemption Calculator (Section 10(13A))",
    description: "Calculate the tax-exempt part of your house rent allowance using the three-way rule, with the 50% limit for eight cities from April 2026.",
    intro: "The exempt HRA is the lowest of three amounts: HRA received, rent paid minus 10% of salary, and 50% of salary in Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad (40% elsewhere). Salary here means basic plus DA.",
    faqs: [
      ["Which cities get the 50% HRA limit?", "From 1 April 2026, under the Income-tax Rules 2026, eight cities: Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad. Everywhere else the limit is 40%. For years before April 2026, only the first four counted."],
      ["Can I claim HRA in the new regime?", "No. HRA exemption is available only under the old regime."],
    ],
  },
  {
    id: "gst-calculator",
    path: "/business-tools/gst-calculator",
    engine: "calc",
    popular: true,
    name: "GST Calculator",
    short: "Add or remove GST, with CGST/SGST split",
    title: "GST Calculator: Add or Remove GST (5%, 18%, 40%)",
    description: "Add GST to a price or extract GST from an inclusive price. Shows CGST, SGST and IGST for the 5%, 18% and 40% slabs and older rates.",
    intro:
      "Since 22 September 2025 most goods and services fall in the 5% or 18% GST slab, with 40% for a short list of luxury and sin goods. Older 12% and 28% rates are included for invoices from before the change.",
    faqs: [
      ["How do I remove GST from an inclusive price?", "GST amount = Price × Rate ÷ (100 + Rate). For ₹1,180 at 18%, GST is ₹180 and the base price is ₹1,000."],
      ["When is it CGST + SGST and when IGST?", "Within the same state the tax is split equally into CGST and SGST. For a sale to another state, the full amount is IGST."],
    ],
  },
  {
    id: "in-hand-salary-calculator",
    path: "/salary-hr/in-hand-salary-calculator",
    engine: "calc",
    popular: true,
    name: "In-Hand Salary Calculator",
    short: "Monthly take-home pay from CTC",
    title: "In-Hand Salary Calculator: CTC to Take-Home (FY 2026-27)",
    description: "Convert annual CTC to monthly in-hand salary after PF, gratuity, professional tax and income tax under the new regime.",
    intro:
      "CTC includes things you never see in your bank account, like the employer's PF share and gratuity. This calculator removes them, then deducts your PF, professional tax and income tax to estimate monthly take-home pay.",
    faqs: [
      ["Why is my in-hand salary so much lower than CTC?", "CTC includes employer PF (12% of basic), gratuity (about 4.81% of basic) and sometimes insurance and bonuses. Your own PF, professional tax and TDS then come out of what is left."],
      ["Is PF calculated on full basic?", "Statutorily, PF is 12% of basic up to a wage ceiling of ₹25,000 a month (₹3,000), in force since 17 September 2026. Before that the ceiling was ₹15,000 (₹1,800). Many employers contribute on the full basic; switch the option to match your offer letter."],
    ],
  },
  {
    id: "pf-calculator",
    path: "/salary-hr/pf-calculator",
    engine: "calc",
    name: "EPF Calculator",
    short: "PF balance at retirement at 8.25%",
    title: "EPF Calculator: PF Balance at Retirement (8.25%)",
    description: "Estimate your Employees' Provident Fund balance at retirement with yearly salary increases, at the current 8.25% EPF interest rate.",
    intro: "You contribute 12% of basic to EPF. Of the employer's 12%, 3.67% goes to EPF and 8.33% to the pension scheme (EPS), on wages up to the ₹25,000 ceiling, so at most about ₹2,083 a month. Interest is credited yearly.",
    faqs: [
      ["What is the EPF interest rate?", "8.25% a year for FY 2024-25, declared by EPFO. The rate is reviewed every year."],
      ["Is EPF withdrawal tax-free?", "Yes, after 5 years of continuous service. Interest on employee contributions above ₹2.5 lakh a year is taxable."],
    ],
  },
  {
    id: "gratuity-calculator",
    path: "/calculators/gratuity-calculator",
    engine: "calc",
    name: "Gratuity Calculator",
    short: "Gratuity under the Payment of Gratuity Act",
    title: "Gratuity Calculator: 15/26 Formula, ₹20 Lakh Tax-Free Limit",
    description: "Calculate gratuity from your last drawn basic plus DA and years of service using the 15/26 formula. Covers the ₹20 lakh tax-free limit.",
    intro: "For employers covered by the Payment of Gratuity Act, gratuity is 15 days' wages for every completed year of service, where a month counts as 26 working days.",
    faqs: [
      ["How many years do I need for gratuity?", "Five years of continuous service, though the new labour codes allow fixed-term employees to qualify after one year. Service of more than 6 months in the last year counts as a full year."],
      ["Is gratuity taxable?", "For private-sector employees, gratuity up to ₹20 lakh over your career is tax-free. Government employees' gratuity is fully exempt. The ₹25 lakh figure you may see is the ceiling on gratuity paid to central government employees, not the tax-free limit."],
    ],
  },
];
