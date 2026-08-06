/**
 * Path-specific example input/result pairs for tool editorial sections.
 * Values match each tool's default form inputs and live calculation logic.
 */
export const TOOL_EXAMPLE_PAIRS = {
  "/calculators/electricity-bill-calculator": [
    {
      input: "State: Maharashtra\nUnits (kWh): 250\nFixed charges: ₹120",
      result: "Energy charge: ₹1,530\nEstimated total: ₹1,650",
      note: "Slab math: 100 units × ₹4.50 + 150 units × ₹7.20, plus fixed charges.",
    },
  ],
  "/calculators/toll-calculator-india": [
    {
      input: "Vehicle: Car / Jeep / Van\nDistance: 120 km\nToll plazas: 3",
      result: "Estimated toll ≈ ₹471",
      note: "Planning estimate from per-km rate and per-plaza fee—not an official NHAI quote.",
    },
  ],
  "/calculators/emi-calculator": [
    {
      input: "Loan amount: ₹5,00,000\nInterest rate: 9.5% p.a.\nTenure: 5 years",
      result:
        "Monthly EMI: ₹10,501\nTotal interest: ₹1,30,056\nTotal repayment: ₹6,30,056",
    },
  ],
  "/calculators/sip-calculator": [
    {
      input: "Monthly SIP: ₹5,000\nExpected return: 12% p.a.\nTenure: 10 years",
      result:
        "Maturity value: ₹11,61,695\nTotal invested: ₹6,00,000\nWealth gained: ₹5,61,695",
    },
  ],
  "/calculators/ppf-calculator": [
    {
      input: "Yearly investment: ₹1,50,000\nInterest rate: 7.1% p.a.\nTenure: 15 years",
      result:
        "Total invested: ₹22,50,000\nInterest earned: ₹18,18,209\nMaturity value: ₹40,68,209",
    },
  ],
  "/calculators/inflation-calculator": [
    {
      input: "Current amount: ₹1,00,000\nInflation rate: 6% p.a.\nPeriod: 10 years",
      result:
        "Future value needed: ₹1,79,085\nPurchasing power today: ₹55,839\nPurchasing power loss: 44.2%",
    },
  ],
  "/calculators/loan-eligibility-calculator": [
    {
      input:
        "Monthly income: ₹80,000\nExisting EMIs: ₹10,000\nRate: 9.5% · Tenure: 20 years\nDesired loan: ₹25,00,000",
      result:
        "Max affordable EMI: ₹30,000\nEligible loan amount: ₹32,18,431\nDesired loan: Eligible",
    },
  ],
  "/calculators/mortgage-calculator": [
    {
      input:
        "Home price: ₹50,00,000\nDown payment: ₹10,00,000 (20%)\nRate: 8.5% p.a. · Tenure: 20 years",
      result:
        "Loan amount: ₹40,00,000\nMonthly EMI: ₹34,713\nTotal interest: ₹43,31,103",
    },
  ],
  "/calculators/gratuity-calculator": [
    {
      input: "Last drawn basic + DA: ₹50,000\nYears of service: 10",
      result: "Estimated gratuity: ₹2,88,462",
      note: "Uses Payment of Gratuity Act formula: (salary × 15 × years) ÷ 26.",
    },
  ],
  "/calculators/gpa-calculator": [
    {
      input: "Course: 3 credits · Grade A (4.0)",
      result: "GPA: 4.00 on a 4.0 scale\nTotal credits: 3",
    },
  ],
  "/calculators/date-add-subtract-calculator": [
    {
      input: "Start date: 15 January 2026\nOperation: Add\nAdd: 2 months, 10 days",
      result: "Result date: 25 March 2026",
    },
  ],
  "/business-tools/gst-calculator": [
    {
      input: "Amount: ₹10,000\nGST rate: 18%\nMode: Exclusive (GST added on top)",
      result: "GST amount: ₹1,800\nTotal payable: ₹11,800",
    },
  ],
  "/social-media-tools/youtube-money-calculator": [
    {
      input: "Monthly views: 1,00,000\nCPM: $2.00",
      result:
        "Estimated monthly earnings: $200.00\nDaily: $6.67 · Yearly: $2,400.00",
      note: "Illustrative CPM-based estimate—actual YouTube revenue varies by niche and geography.",
    },
  ],
  "/trending-tools/unit-converter": [
    {
      input: "Category: Length\nConvert: 1 kilometer → meters",
      result: "1 km = 1,000 meters",
    },
  ],
  "/trending-tools/currency-converter": [
    {
      input: "Amount: $100 USD\nConvert to: INR (sample rate)",
      result: "Live rate lookup updates the converted amount on the page.",
      note: "Exchange rates change frequently—use the live result panel for the current figure.",
    },
  ],
};

export function getToolExamplePairs(toolPath) {
  if (!toolPath) return [];
  return TOOL_EXAMPLE_PAIRS[toolPath] || [];
}
