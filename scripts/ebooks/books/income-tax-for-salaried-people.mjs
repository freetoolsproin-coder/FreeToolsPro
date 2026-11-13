// Practice material for "Income Tax for Salaried People".
// Every tax figure is computed with computeTax() from src/tools/calcs.js, the same
// function the site's income tax calculator uses (FY 2026-27 / tax year 2026-27).
import { computeTax } from "../../../src/tools/calcs.js";
import { inr, hraExempt } from "../lib/calc.mjs";

const Rs = (n) => `Rs. ${inr(n)}`;
const tax = (income, regime, deductions = 0, age = "below60") => computeTax({ income, regime, deductions, salaried: true, age });
const T = (income, regime, deductions = 0, age) => tax(income, regime, deductions, age).total;
// Old-regime deductions needed to match the new regime's tax.
function breakEven(income) {
  const target = T(income, "new");
  let lo = 0;
  let hi = income;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    if (T(income, "old", mid) > target) lo = mid;
    else hi = mid;
  }
  return hi;
}
const lakh = (n) => `Rs. ${(n / 100000).toLocaleString("en-IN", { maximumFractionDigits: 2 })} lakh`;
const slabRows = (t) => t.breakdown.filter((b) => b[2] > 0).map(([range, rate, part, amt]) => [range.replace(/₹/g, "Rs. "), `${rate}%`, inr(part), inr(amt)]);

const ex15 = tax(1500000, "new");
const ex13 = tax(1300000, "new");

export default {
  checked: "October 2026",
  welcome:
    "This book walks a salaried person through their own tax: how the slabs work, what the rebate and marginal relief do, which regime suits which pay packet, what the employer's TDS and Form 16 mean, and how to file a return without surprises. Rates are those for the tax year 2026-27, which runs from April 2026 to March 2027. Budget 2026 left the slabs, the rebate and the standard deduction unchanged.",

  chapters: [
    {
      title: "The new law and the old names",
      paragraphs: [
        "The Income-tax Act, 2025 replaced the Income-tax Act, 1961 from 1 April 2026, together with new Income-tax Rules. It uses the term tax year in place of the old pair of previous year and assessment year, and renumbers almost every section. Familiar names such as 80C, 80D, 24(b) and 10(13A) refer to the 1961 Act's numbering; the same reliefs now sit under new section numbers.",
        "This book uses plain descriptions, such as the deduction for specified savings, with the old section name in brackets where it helps you recognise the item on a form or in conversation. Your employer's payroll and the e-filing portal will show the new numbering.",
      ],
    },
    {
      title: "How the tax is worked out",
      paragraphs: [
        "Every calculation follows the same five steps, whichever regime you use.",
      ],
      sections: [
        {
          steps: [
            "Start with gross salary for the year, plus any other income such as interest or rent.",
            "Subtract exemptions and deductions allowed in your regime, including the standard deduction for salaried people.",
            "Apply the slab rates to the taxable income that remains.",
            "Subtract the rebate if taxable income is within the rebate limit, and apply marginal relief just above it.",
            "Add surcharge if income is very high, then add health and education cess at 4 percent.",
          ],
        },
        {
          heading: "New regime slabs, tax year 2026-27",
          table: {
            caption: "The default regime. Standard deduction for salaried people: Rs. 75,000.",
            headers: ["Taxable income", "Rate"],
            rows: [["Up to Rs. 4 lakh", "Nil"], ["Rs. 4 to 8 lakh", "5%"], ["Rs. 8 to 12 lakh", "10%"], ["Rs. 12 to 16 lakh", "15%"], ["Rs. 16 to 20 lakh", "20%"], ["Rs. 20 to 24 lakh", "25%"], ["Above Rs. 24 lakh", "30%"]],
          },
        },
        {
          heading: "Old regime slabs",
          table: {
            caption: "Optional regime. Standard deduction Rs. 50,000. The nil band is Rs. 3 lakh for ages 60 to 80 and Rs. 5 lakh for 80 and above.",
            headers: ["Taxable income (below 60)", "Rate"],
            rows: [["Up to Rs. 2.5 lakh", "Nil"], ["Rs. 2.5 to 5 lakh", "5%"], ["Rs. 5 to 10 lakh", "20%"], ["Above Rs. 10 lakh", "30%"]],
          },
        },
        {
          heading: "A full example",
          paragraphs: [
            `A salary of Rs. 15 lakh in the new regime: taxable income after the Rs. 75,000 standard deduction is ${Rs(ex15.taxable)}. The slabs give ${Rs(ex15.slabTax)}. No rebate applies above Rs. 12 lakh of taxable income. Cess at 4 percent adds ${Rs(ex15.cess)}. Total tax: ${Rs(ex15.total)}, about ${Rs(ex15.total / 12)} a month.`,
          ],
          table: { caption: "Slab by slab for Rs. 15 lakh salary, new regime.", headers: ["Band", "Rate", "Income in band", "Tax"], rows: slabRows(ex15) },
        },
      ],
    },
    {
      title: "The rebate and marginal relief",
      paragraphs: [
        "In the new regime, a resident individual whose taxable income does not exceed Rs. 12 lakh receives a rebate of up to Rs. 60,000, which cancels the slab tax completely. With the Rs. 75,000 standard deduction, a salary of up to Rs. 12.75 lakh pays no tax at all.",
        "In the old regime the rebate is up to Rs. 12,500 for taxable income up to Rs. 5 lakh.",
      ],
      sections: [
        {
          heading: "Just above the line",
          paragraphs: [
            `Without relief, crossing Rs. 12 lakh of taxable income by a rupee would bring a tax bill of over Rs. 60,000. Marginal relief caps the tax at the amount by which income exceeds Rs. 12 lakh. A salary of Rs. 13 lakh gives taxable income of ${Rs(ex13.taxable)}; slab tax would be ${Rs(ex13.slabTax)}, but relief limits it to ${Rs(ex13.taxable - 1200000)}. With cess, ${Rs(ex13.total)}.`,
            "Relief fades out as income rises; by about Rs. 12.7 lakh of taxable income the normal slab tax applies again. The rebate and relief apply to slab-rate income; some special-rate income, such as certain capital gains, is treated differently.",
          ],
          table: {
            caption: "Tax around the rebate line, new regime, salaried.",
            headers: ["Salary", "Taxable", "Tax with cess", "Take-home after tax"],
            rows: [1200000, 1275000, 1290000, 1300000, 1325000, 1350000, 1400000, 1500000].map((s) => {
              const t = tax(s, "new");
              return [inr(s), inr(t.taxable), inr(t.total), inr(s - t.total)];
            }),
          },
        },
      ],
    },
    {
      title: "Old or new: finding your break-even",
      paragraphs: [
        "The new regime has lower rates and almost no deductions. The old regime has higher rates and many deductions. For each income there is a level of deductions at which the two give the same tax. Above it, the old regime wins; below it, the new regime wins.",
      ],
      sections: [
        {
          table: {
            caption: "Old-regime deductions (beyond the Rs. 50,000 standard deduction) needed to match the new regime. Salaried, below 60.",
            headers: ["Salary", "New regime tax", "Deductions needed in old regime"],
            rows: [1000000, 1275000, 1500000, 1800000, 2000000, 2500000, 3000000, 4000000].map((s) => {
              const be = breakEven(s);
              return [inr(s), inr(T(s, "new")), be >= s - 60000 ? "Old cannot match" : inr(be)];
            }),
          },
          paragraphs: [
            "At most incomes, you would need deductions of several lakh rupees in the old regime, from HRA, a home loan's interest, the Rs. 1.5 lakh savings deduction, health insurance and NPS, before it beats the new regime. Many salaried people do not reach that, which is why the new regime became the default.",
            "Count only deductions you would claim anyway with real expenses. Buying a product only to save tax is a cost, not a strategy.",
          ],
        },
        {
          heading: "Switching",
          paragraphs: [
            "Salaried people without business income can choose the regime each year when filing. Tell your employer your choice at the start of the year so the monthly TDS matches; if you choose differently when filing, the return settles the difference as a refund or extra tax.",
          ],
        },
      ],
    },
    {
      title: "Deductions in the old regime",
      paragraphs: [
        "If you use the old regime, these are the deductions most salaried people use. Limits are yearly. Keep the proof for each.",
      ],
      sections: [
        {
          table: {
            caption: "Common old-regime deductions. Section names are those of the 1961 Act.",
            headers: ["Deduction", "Limit", "Examples"],
            widths: [1.6, 1.1, 2.3],
            rows: [
              ["Specified savings and payments (80C)", "Rs. 1.5 lakh", "EPF, PPF, ELSS, life insurance premium, home-loan principal, tuition fees, 5-year tax-saving FD, NSC, SSY"],
              ["Additional NPS (80CCD(1B))", "Rs. 50,000", "Own contributions to NPS Tier I"],
              ["Health insurance (80D)", "Rs. 25,000; Rs. 50,000 if senior", "Self, spouse, children; separate limit for parents"],
              ["Home-loan interest, self-occupied (24(b))", "Rs. 2 lakh", "Interest on a loan to buy or build a home"],
              ["HRA exemption (10(13A))", "Formula", "Rent paid by an employee receiving HRA"],
              ["Savings account interest (80TTA)", "Rs. 10,000", "Interest on savings accounts; seniors use a Rs. 50,000 limit covering deposits (80TTB)"],
              ["Education loan interest (80E)", "No limit, 8 years", "Interest on a loan for higher education"],
              ["Donations (80G)", "50% or 100%, some limits", "Approved charities and funds"],
              ["Professional tax", "Actual, up to Rs. 2,500", "Deducted by employer in some states"],
            ],
          },
        },
        {
          heading: "HRA in brief",
          paragraphs: [
            "The exempt part of house rent allowance is the least of three amounts: the HRA received, rent paid minus 10 percent of salary, and 50 percent of salary in Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune or Ahmedabad, or 40 percent elsewhere. Salary here means basic pay plus dearness allowance. The four cities after Chennai were added from 1 April 2026.",
            (() => {
              const h = hraExempt({ basicMonthly: 60000, hraMonthly: 24000, rentMonthly: 25000, metro: true });
              return `Example: basic Rs. 60,000 a month, HRA Rs. 24,000, rent Rs. 25,000 in Pune. HRA received is ${Rs(h.hra)}; rent minus 10 percent of salary is ${Rs(h.rentMinus)}; 50 percent of salary is ${Rs(h.cap)}. Exempt HRA is ${Rs(h.exempt)}.`;
            })(),
            "If yearly rent exceeds Rs. 1 lakh, give your employer the landlord's PAN. Rent paid to a parent is allowed if it is genuine, paid, and the parent declares it as income.",
          ],
        },
      ],
    },
    {
      title: "What the new regime still allows",
      paragraphs: [
        "The new regime is not completely without reliefs. These apply to salaried people:",
      ],
      sections: [
        {
          bullets: [
            "Standard deduction of Rs. 75,000.",
            "Employer's contribution to your NPS, up to 14 percent of basic pay plus DA.",
            "Employer's contribution to EPF within the overall limits for retirement contributions.",
            "Exemptions on gratuity up to Rs. 20 lakh, leave encashment on retirement up to Rs. 25 lakh for non-government employees, and statutory retirement benefits.",
            "Interest on a home loan for a let-out property, set against the rental income.",
            "Deduction for family pension up to a limit.",
            "Contribution to the Agniveer Corpus Fund, where applicable.",
          ],
          note: "Not allowed in the new regime: HRA exemption, leave travel allowance, the specified savings deduction, health insurance deduction, interest on a self-occupied home loan, professional tax and most other deductions.",
        },
        {
          heading: "Restructuring salary for the new regime",
          paragraphs: [
            "Because employer NPS contributions are deductible in the new regime, some employers let staff move part of their CTC into NPS. It reduces taxable salary without changing CTC, at the cost of locking that money until 60. It suits people who would save for retirement anyway.",
          ],
        },
      ],
    },
    {
      title: "TDS, Form 16 and the annual statements",
      paragraphs: [
        "Your employer deducts tax from salary every month, based on your expected yearly income, your chosen regime, and any declarations you made. That is TDS. It is an advance payment of your tax, not a separate tax.",
      ],
      sections: [
        {
          heading: "Declarations and proofs",
          paragraphs: [
            "At the start of the year, employers ask for your regime choice and, in the old regime, planned investments and rent. Near the end of the year they ask for proofs. If you do not submit proofs, they deduct more tax in the last months. You can still claim genuine deductions when filing your return.",
            "If you have other income, such as interest, you can tell your employer so it deducts enough tax; otherwise you may owe tax when filing.",
          ],
        },
        {
          heading: "Form 16",
          paragraphs: [
            "After the year ends, your employer issues Form 16, usually by mid-June. Part A shows the tax deducted and deposited each quarter. Part B shows salary, exemptions, deductions and the tax computation. It is the starting point for your return, not the return itself.",
          ],
        },
        {
          heading: "Form 26AS and the AIS",
          paragraphs: [
            "Form 26AS lists the tax deducted and deposited against your PAN by all deductors. The Annual Information Statement goes further, listing interest, dividends, securities transactions, rent and other information reported by banks and others. Check both before filing. Income in the AIS that is missing from your return is a common reason for notices.",
          ],
        },
        {
          heading: "Two employers in a year",
          paragraphs: [
            "If you changed jobs, each employer may have given you the full standard deduction and the lower slabs, so too little tax was deducted overall. Declare the previous employer's salary and TDS to the new employer, or expect to pay the difference when filing.",
          ],
        },
      ],
    },
    {
      title: "Filing the return",
      paragraphs: [
        "Most salaried people file on the government's e-filing portal, where much of the form is pre-filled from Form 16, 26AS and the AIS. Filing is required if income exceeds the basic exemption limit, and in some other cases, such as large foreign travel spending or high electricity bills.",
      ],
      sections: [
        {
          heading: "Which form",
          bullets: [
            "ITR-1 for residents with salary, one house property, other sources such as interest, and total income up to Rs. 50 lakh, with limited capital gains.",
            "ITR-2 for those with capital gains beyond what ITR-1 allows, more than one house property, foreign assets or income above Rs. 50 lakh, and no business income.",
            "ITR-3 or ITR-4 where there is business or professional income.",
          ],
          note: "Form rules are revised each year. The portal suggests the right form after you answer a few questions.",
        },
        {
          heading: "Steps",
          steps: [
            "Download Form 16, Form 26AS and the AIS.",
            "Check that salary, TDS and other income match across them.",
            "Choose the regime and enter deductions you can prove.",
            "Report interest, dividends and capital gains from the AIS, even where tax was deducted.",
            "Compare the computed tax with TDS; pay any balance as self-assessment tax before filing.",
            "Submit, then e-verify within the deadline, usually by Aadhaar OTP or net banking.",
            "Track the processing status and any refund on the portal.",
          ],
        },
        {
          heading: "Dates",
          paragraphs: [
            "The due date for salaried individuals without an audit has usually been 31 July after the tax year ends, though it has sometimes been extended. Belated and revised returns can be filed later, within limits, with a fee for late filing. An updated return can be filed within a longer window to report missed income, with additional tax. Check the current year's dates on the portal.",
          ],
        },
      ],
    },
    {
      title: "Other income a salaried person has",
      paragraphs: [
        "Salary is rarely the only income. Each of these needs to be reported, and some are taxed differently.",
      ],
      sections: [
        { label: "Interest", paragraphs: ["Savings, deposit and bond interest is added to income and taxed at slab rates. TDS by a bank is not the final tax if your slab is higher."] },
        { label: "Rent from a property", paragraphs: ["Taxable after a standard deduction of 30 percent of the net annual value for repairs, and after interest on a loan for that property. Losses from house property can be set off against salary up to Rs. 2 lakh a year in the old regime; in the new regime they cannot be set off against salary."] },
        { label: "Capital gains on shares and equity funds", paragraphs: ["Long-term gains above Rs. 1.25 lakh a year are taxed at 12.5 percent; short-term gains at 20 percent. These special rates are separate from slab rates."] },
        { label: "Dividends", paragraphs: ["Taxable at slab rates. Companies deduct TDS above a threshold."] },
        { label: "Freelance or side income", paragraphs: ["Taxed as business or professional income, which may need ITR-3 or ITR-4 and possibly advance tax. A presumptive scheme simplifies small professional incomes."] },
        { label: "Gifts", paragraphs: ["Gifts from relatives are exempt. Gifts from others above Rs. 50,000 in a year are taxable, with exceptions such as wedding gifts."] },
      ],
    },
    {
      title: "Advance tax and interest",
      paragraphs: [
        "If your tax for the year, after TDS, is Rs. 10,000 or more, you must pay advance tax in instalments: at least 15 percent by 15 June, 45 percent by 15 September, 75 percent by 15 December and 100 percent by 15 March. Most salaried people do not need to, because TDS covers their tax. Those with significant interest, rent, capital gains or freelance income often do.",
        "Missing advance tax leads to interest of 1 percent a month on the shortfall under the relevant provisions. The simplest way to avoid it is to tell your employer about other income so TDS rises, or to pay self-assessment instalments yourself on the dates above.",
      ],
    },
    {
      title: "Evaluating a raise or a new offer",
      paragraphs: [
        "A job offer is usually stated as CTC. What you can spend is take-home after tax, PF and other deductions. Comparing two offers properly takes five minutes.",
      ],
      sections: [
        {
          steps: [
            "Subtract from each CTC the employer's PF, gratuity provision and any variable pay you are not sure to receive.",
            "Subtract your own PF and professional tax.",
            "Compute tax in your likely regime on the remaining gross salary.",
            "Divide by twelve for monthly take-home.",
            "Add back any genuine long-term benefits, such as employer NPS or PF, separately as retirement saving, not as monthly money.",
          ],
        },
        {
          heading: "An example",
          paragraphs: [
            `Offer A: Rs. 20 lakh fixed. Offer B: Rs. 18 lakh fixed plus up to Rs. 3 lakh variable. In the new regime, tax on Rs. 20 lakh is ${Rs(T(2000000, "new"))}, and on Rs. 18 lakh ${Rs(T(1800000, "new"))}; on Rs. 21 lakh, if the full variable is paid, ${Rs(T(2100000, "new"))}.`,
            "If the variable pay is uncertain, Offer A gives the higher assured take-home. If B's variable is reliably paid, B gives slightly more. Ask how much of the variable was paid in each of the last three years.",
          ],
        },
        {
          heading: "Salary structure in each regime",
          paragraphs: [
            "In the old regime, a structure with HRA, LTA and reimbursements can lower tax. In the new regime, those components save nothing, and what matters is employer NPS and simply the gross salary. Ask the employer whether it offers flexible structures, and choose the one that suits your regime.",
          ],
        },
      ],
    },
    {
      title: "Couples, parents and children",
      paragraphs: [
        "Tax in India is individual. Each spouse is taxed on their own income, chooses their own regime and files their own return. A few rules connect family members.",
      ],
      sections: [
        { label: "Clubbing", paragraphs: ["Income from money you give your spouse, or invest in your minor child's name, is generally added to your income. Gifts to adult children or parents are not clubbed, and income they earn on it is theirs."] },
        { label: "Joint home loans", paragraphs: ["Co-owners who are also co-borrowers can each claim interest and principal deductions in the old regime, in proportion to their share, within their own limits. This can double the benefit for a couple both using the old regime."] },
        { label: "Health insurance for parents", paragraphs: ["In the old regime, premiums paid for parents get a separate deduction from your own family's. Siblings can share the premium and each claim their share."] },
        { label: "Rent to parents", paragraphs: ["Paying rent to a parent who owns your home can support an HRA claim in the old regime, if it is genuine and the parent declares it."] },
        { label: "Children's income", paragraphs: ["Income from a minor's own skill or work is theirs. Other income is clubbed with the parent who earns more, with a small exemption per child."] },
      ],
    },
    {
      title: "What commonly triggers a notice",
      paragraphs: ["Most notices to salaried people come from a handful of avoidable mismatches."],
      sections: [
        {
          bullets: [
            "Interest from deposits or savings shown in the AIS but missing from the return.",
            "Capital gains from shares or mutual funds not reported, often because a statement was overlooked.",
            "Deductions claimed in the return that the employer did not allow, without proof.",
            "TDS claimed that does not appear in Form 26AS, often because a deductor did not file its TDS return.",
            "Large cash deposits, property purchases or foreign spending reported by banks and registrars.",
            "Salary from two employers with the standard deduction claimed twice.",
            "Using ITR-1 when income included items requiring ITR-2.",
          ],
          note: "The fix for almost all of these is to download the AIS and Form 26AS before filing and make sure every item is either reported or explained.",
        },
      ],
    },
    {
      title: "A tax calendar for salaried people",
      paragraphs: ["The same few tasks come round each year. Putting them in a calendar removes most of the stress."],
      sections: [
        {
          table: {
            caption: "Typical dates; check each year's notifications.",
            headers: ["When", "Task"],
            widths: [1, 3],
            rows: [
              ["April", "Choose regime with employer; plan investments if using the old regime; submit Form 15G or 15H to banks if eligible."],
              ["June", "Collect Form 16 by mid-June; download Form 26AS and AIS; first advance tax instalment due on 15 June if applicable."],
              ["July", "File the return by the due date; e-verify promptly."],
              ["September", "Second advance tax instalment, 15 September."],
              ["December", "Third advance tax instalment, 15 December; last date for belated or revised returns in many years."],
              ["January to February", "Submit investment and rent proofs to the employer."],
              ["March", "Final advance tax instalment, 15 March; complete any old-regime investments before 31 March."],
            ],
          },
        },
      ],
    },
    {
      title: "Reading your payslip",
      paragraphs: ["The payslip is where tax becomes real each month. A few lines tell you whether TDS is on track."],
      sections: [
        {
          table: {
            caption: "Common payslip lines.",
            headers: ["Line", "What it is", "Tax point"],
            widths: [1.2, 2, 2],
            rows: [
              ["Basic and DA", "Core salary", "PF, gratuity and HRA are calculated on it"],
              ["HRA", "House rent allowance", "Partly exempt only in the old regime"],
              ["Special allowance", "The balancing figure", "Fully taxable"],
              ["LTA", "Leave travel allowance", "Exempt within rules only in the old regime"],
              ["Employer NPS", "Employer's contribution", "Deductible in both regimes within limits"],
              ["Employee PF", "Your 12 percent", "Counts towards the savings deduction in the old regime"],
              ["Professional tax", "State levy", "Deductible only in the old regime"],
              ["Income tax (TDS)", "Monthly tax deducted", "Should be about one-twelfth of your yearly estimate"],
            ],
          },
        },
        {
          heading: "Checking TDS",
          paragraphs: [
            "Multiply the monthly TDS by the months remaining and add what has been deducted so far. Compare with your estimated tax for the year from the site's calculator. If TDS is well short, tell payroll about any income or declaration change, or set aside the difference.",
          ],
        },
      ],
    },
    {
      title: "Capital gains for salaried investors",
      paragraphs: [
        "Many salaried people now hold shares and mutual funds. Gains on them are taxed separately from salary, at special rates, and must be reported even when small.",
      ],
      sections: [
        {
          table: {
            caption: "Main rates from 23 July 2024 for listed equity shares and equity-oriented funds.",
            headers: ["Holding", "Type", "Rate", "Exemption"],
            rows: [["More than 12 months", "Long-term", "12.5%", "First Rs. 1.25 lakh a year"], ["12 months or less", "Short-term", "20%", "None"]],
          },
          paragraphs: [
            "Debt mutual funds bought on or after 1 April 2023 are taxed at slab rates whatever the holding period. Property, gold and unlisted shares have their own rules and holding periods.",
          ],
        },
        {
          heading: "Losses",
          paragraphs: [
            "Short-term capital losses can be set off against both short-term and long-term gains; long-term losses only against long-term gains. Unused losses can be carried forward for eight years if the return is filed on time. That alone is a reason to file before the due date.",
          ],
        },
        {
          heading: "Where to find the figures",
          paragraphs: [
            "Mutual fund registrars and brokers provide capital gains statements for the year, with each sale's cost, sale value and holding period. The AIS also lists sales. Use the statements to fill the capital gains schedule in ITR-2.",
          ],
        },
      ],
    },
    {
      title: "Retirement benefits and tax",
      paragraphs: ["The money received at the end of a career has its own tax rules. Most of it is exempt within limits."],
      sections: [
        { label: "Gratuity", paragraphs: ["For private-sector employees, exempt up to Rs. 20 lakh over a career, subject to a formula; for government employees fully exempt."] },
        { label: "Leave encashment", paragraphs: ["On retirement, exempt up to Rs. 25 lakh for non-government employees, subject to a formula; fully exempt for government employees."] },
        { label: "Provident fund", paragraphs: ["Withdrawals after five years of continuous service are exempt, except interest on contributions above the Rs. 2.5 lakh yearly threshold, which is taxed as it accrues."] },
        { label: "NPS", paragraphs: ["Sixty percent of the corpus at exit has long been tax-free; annuity income is taxable as it is received. Check the current treatment of any lump sum above 60 percent."] },
        { label: "Pension", paragraphs: ["Uncommuted pension is taxed as salary with the standard deduction. Commuted pension is fully exempt for government employees and partly exempt for others."] },
        { label: "Voluntary retirement compensation", paragraphs: ["Exempt up to Rs. 5 lakh under the relevant rules, once in a lifetime, if the scheme meets the conditions."] },
      ],
    },
  ],

  scenarioIntro:
    "Eighteen salaried people choosing a regime, claiming what they are entitled to, and filing without surprises. Tax figures use the tax year 2026-27 rules for a resident individual below 60, unless stated, and include 4 percent cess.",

  scenarios: [
    {
      title: "Just below the rebate line",
      paragraphs: [
        `Rohit in Indore earns Rs. 12.5 lakh. In the new regime his taxable income is ${Rs(tax(1250000, "new").taxable)}, below Rs. 12 lakh, so the rebate wipes out the tax: he pays ${Rs(T(1250000, "new"))}.`,
        `In the old regime, with the Rs. 1.5 lakh savings deduction and Rs. 25,000 of health insurance, he would pay ${Rs(T(1250000, "old", 175000))}. The choice is easy.`,
        "He still files a return, because his income is above the basic exemption limit and because it records the TDS, if any, and his interest income. He also notes that a raise of even Rs. 50,000 next year would take him slightly over the line, where marginal relief will soften the effect.",
        "He set a reminder for next April to recheck, because a promotion could change the answer, and because the employer asks for a regime choice at the start of every year."
      ],
      lesson: "Up to Rs. 12.75 lakh of salary, the new regime usually means no tax. File anyway.",
    },
    {
      title: "A raise that crosses the line",
      paragraphs: [
        `Anjali in Pune moved from Rs. 12.7 lakh to Rs. 13.2 lakh. Her tax rose from ${Rs(T(1270000, "new"))} to ${Rs(T(1320000, "new"))}.`,
        `She worried the raise would be eaten by tax. Marginal relief limited the slab tax to the excess over Rs. 12 lakh of taxable income, so of the Rs. 50,000 raise she keeps ${Rs(50000 - (T(1320000, "new") - T(1270000, "new")))}.`,
        "She asked HR whether part of the raise could go to employer NPS, which is deductible in the new regime. Moving Rs. 50,000 a year into NPS would bring her taxable income back near the line, at the cost of locking that money until 60. She chose a smaller NPS contribution as a compromise.",
        "She also noted that her own contribution to NPS would give no deduction in the new regime; only the employer's does. The distinction mattered when HR offered both options."
      ],
      lesson: "Marginal relief protects raises near the rebate line. Employer NPS can reduce taxable salary in the new regime.",
    },
    {
      title: "A tenant in Bengaluru with a home loan elsewhere",
      paragraphs: [
        "Karthik earns Rs. 24 lakh in Bengaluru, pays Rs. 40,000 a month in rent, and receives HRA of Rs. 40,000 a month on a basic of Rs. 1 lakh. He also pays Rs. 2.2 lakh of interest on a loan for a flat in Mysuru, let out to tenants.",
        (() => {
          const h = hraExempt({ basicMonthly: 100000, hraMonthly: 40000, rentMonthly: 40000, metro: true });
          const ded = h.exempt + 150000 + 25000 + 50000;
          return `With Bengaluru now in the 50 percent list, his exempt HRA is ${Rs(h.exempt)}. Adding Rs. 1.5 lakh of savings, Rs. 25,000 of health insurance and Rs. 50,000 of NPS gives old-regime deductions of ${Rs(ded)}. Old-regime tax: ${Rs(T(2400000, "old", ded))}. New regime: ${Rs(T(2400000, "new"))}.`;
        })(),
        "The let-out flat's interest is set against its rent in both regimes, so it does not change the comparison much. The HRA change made the old regime competitive for him for the first time.",
        "He also checked that his landlord had a PAN, since his rent exceeds Rs. 1 lakh a year, and collected monthly rent receipts. Without those, his employer would not have allowed the exemption during the year."
      ],
      lesson: "The 2026 HRA change can tip the balance for tenants in the four newly added cities. Recalculate.",
    },
    {
      title: "Old regime with a full house of deductions",
      paragraphs: [
        "Meera, 38, in Chennai earns Rs. 30 lakh. She has a self-occupied home loan with Rs. 2 lakh of interest a year, contributes fully to the savings deduction through EPF and PPF, pays Rs. 50,000 of health insurance for herself and her senior parents, and Rs. 50,000 into NPS.",
        `Her old-regime deductions total Rs. 4.5 lakh. Old-regime tax: ${Rs(T(3000000, "old", 450000))}. New regime: ${Rs(T(3000000, "new"))}.`,
        `The break-even for her income is about ${Rs(breakEven(3000000))} of deductions. She is above it, so the old regime saves her money, as long as the home loan lasts. She plans to recheck once the loan interest falls.`,
        "Her calculation assumes the deductions are real expenses she would make anyway. She would not take a larger home loan or buy insurance she does not need just to stay above the break-even."
      ],
      lesson: "Large real deductions, especially a self-occupied home loan and HRA, are what make the old regime worth it.",
    },
    {
      title: "Two jobs in one year",
      paragraphs: [
        "Vivek in Hyderabad worked for one employer from April to September on Rs. 1.2 lakh a month, then joined another at Rs. 1.5 lakh a month. Each employer computed TDS as if its salary were his only income for the year.",
        `His total salary was Rs. 16.2 lakh, with tax of ${Rs(T(1620000, "new"))} in the new regime. The two employers together deducted much less, because each applied the standard deduction and the lower slabs separately.`,
        "When filing, he found a balance due of tens of thousands of rupees, which he paid as self-assessment tax. Next time, he will give the new employer the old employer's Form 12B details so TDS covers the whole year.",
        "He also learned that the previous employer's Form 16 and the new one's would both show the standard deduction, but he could claim it only once in the return. The portal's pre-filled data caught the duplication."
      ],
      lesson: "When you change jobs, declare the previous salary and TDS to the new employer, or expect tax due at filing.",
    },
    {
      title: "Interest income nobody mentioned",
      paragraphs: [
        "Lakshmi in Coimbatore earns Rs. 18 lakh and has Rs. 15 lakh in fixed deposits earning about Rs. 1.1 lakh of interest a year. Her bank deducted 10 percent TDS.",
        `Her salary TDS covered the tax on salary alone. With interest added, her total income is Rs. 19.1 lakh, and the extra Rs. 1.1 lakh falls in the 20 percent slab, so she owed about ${Rs(T(1910000, "new") - T(1800000, "new"))} on it, against the Rs. 11,000 the bank had deducted.`,
        "She paid the balance before filing, and now tells her employer about the interest each year so that salary TDS includes it. She also moved part of the deposits into PPF, where interest is tax-free.",
        "She also realised that the extra tax had been due all along; she simply had not been paying it through the year. Spreading it through TDS made the July bill disappear."
      ],
      lesson: "Bank TDS on interest is 10 percent; your slab may be higher. Report interest and pay the difference.",
    },
    {
      title: "Rent paid to a parent",
      paragraphs: [
        "Nikhil in Delhi lives in his mother's flat and pays her Rs. 30,000 a month by bank transfer under a rent agreement. He receives HRA and uses the old regime.",
        "Rent to a parent is allowed for the HRA exemption if it is genuinely paid and the parent owns the property. His mother declares the rent as income in her return; with her pension, she pays little tax on it because of her lower slab and the 30 percent standard deduction on house property.",
        "They keep the agreement, bank records and her return as evidence. Paying in cash or on paper only would invite questions.",
        "His mother also checked whether the extra income would affect her own tax. It did not, because her pension and the rent together stayed within her rebate in the new regime."
      ],
      lesson: "Rent to a parent can support an HRA claim if it is real, documented and reported by the parent.",
    },
    {
      title: "Form 16 that did not match the AIS",
      paragraphs: [
        "Farida in Kolkata downloaded her AIS and found an entry for the sale of mutual fund units she had forgotten, with a short-term gain of Rs. 45,000, and dividends of Rs. 8,000.",
        "Neither appeared in Form 16, which covers only salary. She reported both in her return, using ITR-2 because of the capital gain, and paid tax on the short-term gain at 20 percent and on the dividends at her slab rate.",
        "Had she filed using Form 16 alone, the mismatch with the AIS would likely have led to a notice and interest. She now checks the AIS every July before filing.",
        "She also learned to look for entries she did not recognise. One year the AIS showed interest from a bank where she had no account; feedback through the portal corrected it, avoiding a needless notice."
      ],
      lesson: "Form 16 covers salary only. The AIS shows everything else reported against your PAN; match it before filing.",
    },
    {
      title: "Choosing the regime with the employer",
      paragraphs: [
        "Arvind in Ahmedabad told his employer in April he would use the old regime because he expected to buy a home. The purchase was delayed to the next year.",
        "His employer deducted TDS based on old-regime declarations that he could not prove by January, so it increased the deduction in the last three months, causing a thin salary in March.",
        "When filing, he chose the new regime instead, which suited his actual deductions, and received a refund. The lesson he took was to choose the regime with the employer based on what he already had, not on plans.",
        "The extra TDS in the last quarter was not lost money; it came back as a refund. But it had made March difficult, and he now plans his declarations more conservatively."
      ],
      lesson: "Pick the employer regime on deductions you are sure of. You can change at filing, but TDS during the year follows your declaration.",
    },
    {
      title: "Health insurance for parents",
      paragraphs: [
        "Pooja in Lucknow pays Rs. 45,000 a year for her senior parents' health insurance and Rs. 22,000 for her own family. In the old regime she can deduct up to Rs. 50,000 for senior parents and Rs. 25,000 for her family.",
        `That is Rs. 67,000 of deductions. Along with Rs. 1.5 lakh of savings, her total is Rs. 2.17 lakh. On a salary of Rs. 16 lakh, old-regime tax would be ${Rs(T(1600000, "old", 217000))} and new-regime tax ${Rs(T(1600000, "new"))}.`,
        "The new regime still wins for her, but she keeps the parents' policy regardless; its value is the cover, not the deduction. If she adds a home loan later, she will recheck.",
        "She also keeps the policy for the cover itself, recognising that her parents' health costs would be far higher than any tax saving. Insurance first, deduction second."
      ],
      lesson: "Buy insurance for cover, not for deductions. Recheck the regime when deductions change substantially.",
    },
    {
      title: "Leave encashment at retirement",
      paragraphs: [
        "Mr Joseph, 60, retired from a private company in Kochi and received Rs. 9 lakh of leave encashment along with his final salary.",
        "Leave encashment on retirement is exempt for non-government employees up to Rs. 25 lakh over a working life, subject to a formula based on average salary and leave balance. His was fully exempt. His gratuity of Rs. 14 lakh was also exempt, being within Rs. 20 lakh.",
        "His Form 16 showed both exemptions. He checked them against the formula before filing, and moved part of the money into the Senior Citizens Savings Scheme.",
        "He also checked the leave balance shown on the final settlement against his own records, and found two days missing, which HR corrected before Form 16 was issued."
      ],
      lesson: "Retirement benefits have their own exemptions. Check Form 16 applies them correctly.",
    },
    {
      title: "A refund that did not arrive",
      paragraphs: [
        "Sameer in Nagpur filed in July expecting a Rs. 18,000 refund. By October nothing had arrived.",
        "On the portal he found the refund had failed because the bank account in his profile was not pre-validated after he changed banks. He validated the new account and raised a refund reissue request.",
        "The refund arrived with interest a few weeks later. He now checks the bank account validation before filing each year.",
        "He also updated his profile with the new bank's details for future refunds and removed the old account once it was closed, so a refund could never be sent to a dormant account again.",
        "The interest on the delayed refund was small, but it was paid automatically for the period of delay, which he had not known would happen."
      ],
      lesson: "Refunds go only to a pre-validated bank account linked to your PAN. Check it before filing.",
    },
    {
      title: "A notice for mismatch",
      paragraphs: [
        "Deepa in Bhopal received a communication pointing out that interest of Rs. 32,000 in her AIS was not in her return. She had forgotten a recurring deposit.",
        "She logged in, read the details, and filed a revised return within the time allowed, adding the interest and paying the small extra tax with interest. The matter closed without penalty.",
        "Many such communications are automated and simple to resolve if you respond promptly through the portal. Ignoring them is what makes them serious.",
        "She keeps a list of every deposit and its interest certificate now, and checks it against the AIS each year before filing. It takes ten minutes and avoids the stress of a letter."
      ],
      lesson: "Respond to tax communications promptly on the portal. Most mismatches are easy to fix early.",
    },
    {
      title: "A freelance side income",
      paragraphs: [
        "Asha, a salaried designer in Bengaluru, earns Rs. 3 lakh a year from freelance logo work alongside a Rs. 14 lakh salary.",
        "Her freelance income is business or professional income, not salary. She uses ITR-3, or ITR-4 under the presumptive scheme for professionals, where a set share of receipts is treated as income. Clients deducted TDS on some payments, which she claims.",
        "Because her tax after TDS exceeded Rs. 10,000, she paid advance tax in instalments. Otherwise interest would have applied. She keeps invoices and bank records for every client.",
        "She also learned that some clients deduct TDS at 10 percent on professional fees and others do not deduct at all. Her advance tax payments make up the difference, so July brings no surprise."
      ],
      lesson: "Side income changes your form and may require advance tax. Keep records from the first invoice.",
    },
    {
      title: "Senior citizen still working",
      paragraphs: [
        "Mrs Rao, 62, in Visakhapatnam earns a Rs. 9 lakh salary as a consultant to her former employer and has Rs. 2 lakh of deposit interest.",
        `In the old regime, seniors have a Rs. 3 lakh nil band and can deduct up to Rs. 50,000 of deposit interest. With Rs. 1.5 lakh of savings and that interest deduction, her old-regime tax is ${Rs(T(1100000, "old", 200000, "60-80"))}. In the new regime: ${Rs(T(1100000, "new"))}.`,
        "The new regime's rebate covers her completely, since taxable income is under Rs. 12 lakh. She chose it and submitted Form 15H to her bank only if her estimated tax was nil, which it was.",
        "Her son helped her estimate her income at the start of the year, which is what Form 15H requires. Had her income been taxable, submitting 15H would have been wrong and could have caused trouble."
      ],
      lesson: "Seniors get a higher nil band in the old regime, but the new regime's rebate often wins anyway.",
    },
    {
      title: "LTA and the new regime",
      paragraphs: [
        "Ravi in Gurugram's salary includes a leave travel allowance of Rs. 60,000. In the old regime, LTA for domestic travel by the shortest route is exempt for two journeys in a block of four years.",
        "He chose the new regime, where LTA is not exempt and is simply taxed as salary. He was tempted to switch to the old regime for the LTA alone, but the arithmetic showed his other deductions were too small to make it worthwhile.",
        "He asked HR to restructure the LTA into basic pay, since in the new regime it served no tax purpose and complicated his payslip.",
        "Restructuring took one conversation with HR and simplified his payslip, but he understood that if he ever returned to the old regime, he would want the LTA component back."
      ],
      lesson: "Many salary allowances only help in the old regime. In the new regime, simpler structures are fine.",
    },
    {
      title: "Capital gains and the rebate",
      paragraphs: [
        "Imran in Hyderabad earns Rs. 10 lakh salary and sold shares with a short-term gain of Rs. 1.5 lakh.",
        "His taxable salary income, Rs. 9.25 lakh, is below Rs. 12 lakh, so the rebate covers the slab tax on salary. Short-term gains on listed shares are taxed at a special 20 percent rate, and the rebate does not apply to that special-rate income.",
        "He paid tax of about Rs. 30,000 plus cess on the gain. He had expected zero because of the 'Rs. 12 lakh' headline, and learned that the headline applies to slab-rate income.",
        "He now estimates tax on any large share sale before making it, using the special rates, and sets aside the amount immediately so that it is ready when he files."
      ],
      lesson: "The new-regime rebate covers slab-rate income. Special-rate capital gains can still be taxed.",
    },
    {
      title: "Keeping records for eight years",
      paragraphs: [
        "When Seema in Jaipur received a query about a deduction claimed four years earlier, she found the receipt in a folder labelled by year, with rent receipts, insurance certificates and Form 16.",
        "She uploaded the documents and the query closed. Her colleague, who had kept nothing, had to request copies from an insurer and a former landlord, which took weeks.",
        "She keeps a digital folder for each tax year with Form 16, 26AS, AIS, the filed return, proofs of deductions and capital gains statements, and a paper copy of the most important ones.",
        "She also scans each document into the folder as soon as it arrives, rather than gathering them in July. The habit takes a minute a month and saves a day of searching each year."
      ],
      lesson: "Keep a folder for each tax year for several years. Queries can come long after filing.",
    },
    {
      title: "A first salary and a first return",
      paragraphs: [
        "Neha, 22, joined a firm in Noida in September on Rs. 60,000 a month. Her income for the tax year was Rs. 4.2 lakh, so no tax was due in the new regime and her employer deducted none.",
        "She wondered whether to file at all. Her father advised her to: filing builds a record useful for loans and visas, and she had a small bank interest income to report. She used ITR-1, which took twenty minutes with the pre-filled data.",
        "The next year, on a full year's salary of Rs. 7.2 lakh, she still paid no tax because of the rebate, and filing was even quicker. She set up her e-filing account with two-factor login and a strong password from the start.",
      ],
      lesson: "File from your first job, even with no tax due. It builds a record and the habit is easy to keep.",
    },
    {
      title: "An ESOP exercise",
      paragraphs: [
        "Raghav, a product manager in Bengaluru, exercised 2,000 stock options at Rs. 100 each when the fair value was Rs. 600. The Rs. 10 lakh difference was taxed as a perquisite in his salary that year.",
        `His salary was Rs. 30 lakh, so the perquisite raised taxable salary to Rs. 40 lakh and tax from ${Rs(T(3000000, "new"))} to ${Rs(T(4000000, "new"))}, even though he had not sold a single share. His employer recovered the extra TDS over the remaining months.`,
        "When he later sells, the gain over Rs. 600 a share will be a capital gain. He plans exercises in years when cash is available for the tax, and asked whether his start-up employer qualified for the deferral that eligible start-ups can offer.",
      ],
      lesson: "Exercising options creates tax before any sale. Plan the cash for it.",
    },
    {
      title: "Arrears from a pay revision",
      paragraphs: [
        "Gopal, a government employee in Patna, received Rs. 2.4 lakh of salary arrears for the previous two years in one lump. Added to his salary, it pushed him into a higher slab for the year.",
        "He used the relief available for arrears by filing the prescribed form, which recalculates tax as if the arrears had been received in the years they related to, and gives relief for the difference.",
        "The relief reduced his tax for the year by several thousand rupees. He had to file the form before filing his return; the portal blocks the relief claim otherwise.",
        "He kept the arrears statement from his office showing which months each amount related to, since the relief calculation needs the tax position of each earlier year.",
      ],
      lesson: "Arrears can be spread back to the years they belong to for tax. File the relief form before the return.",
    },
    {
      title: "Losses that were never carried forward",
      paragraphs: [
        "Tanvi in Pune sold some shares at a short-term loss of Rs. 80,000 in a falling market. She filed her return in October, after the due date, as a belated return.",
        "Two years later she made a short-term gain of Rs. 1 lakh and expected to set the old loss against it. Her accountant explained that capital losses can be carried forward only if the return for the year of the loss was filed by the due date.",
        "She paid tax on the full gain. Since then she files in July every year, even when she expects no tax due, because the deadline protects losses and avoids late fees.",
        "She also keeps her broker's capital gains statement in her tax folder, since it is the easiest source for the loss figures when she needs them years later.",
      ],
      lesson: "File by the due date. A late return can cost you the right to carry losses forward.",
    },
    {
      title: "Voluntary contributions above the PF threshold",
      paragraphs: [
        "Sudhir, a senior manager in Mumbai, contributes 12 percent of a large basic plus VPF, totalling Rs. 4 lakh a year of his own contributions to PF.",
        "Interest on employee contributions above Rs. 2.5 lakh a year is taxable each year. His PF statement now shows taxable and non-taxable accounts separately, and the interest on the taxable part appears in his AIS.",
        "He reduced his VPF so his own contributions stay just under the threshold, and put the difference into his PPF, where interest remains tax-free within its own limit.",
        "He checked the arithmetic before deciding: the taxable interest was modest, so the change saved only a few thousand rupees a year, but it also simplified his return, which he valued as much as the saving.",
      ],
      lesson: "PF interest is tax-free only on contributions up to Rs. 2.5 lakh a year. Above that, consider other safe options.",
    },
    {
      title: "Switching to the new regime at 50",
      paragraphs: [
        "Ramesh, 50, in Chennai had used the old regime for twenty years, claiming HRA, a home loan and the savings deduction. His home loan ended this year and he moved into his own flat, so HRA ended too.",
        `With only Rs. 1.5 lakh of savings deductions and Rs. 25,000 of health insurance left, his old-regime tax on a Rs. 28 lakh salary would be ${Rs(T(2800000, "old", 175000))} against ${Rs(T(2800000, "new"))} in the new regime.`,
        "He switched, and stopped buying a life insurance policy he had held mainly for the deduction, after checking its surrender value. He kept his PPF and EPF for their own merits as safe retirement savings.",
        "He also told his employer of the switch in April, so TDS fell from the first month instead of coming back as a refund the following year.",
      ],
      lesson: "When big deductions end, the new regime usually wins. Review products bought mainly for a deduction.",
    },
    {
      title: "A spouse's investments in her own name",
      paragraphs: [
        "Prakash in Hyderabad wanted to reduce tax by moving deposits into his wife's name, since she earned less. His wife, Shalini, had her own income from tuition classes.",
        "Their accountant explained that interest on money Prakash gave her would be clubbed with his income. But Shalini's own savings from her tuition income were hers, and interest on them was taxed in her hands at her lower rate.",
        "They kept clear records of which deposits came from whose income. The tax saving was real but only on Shalini's own money, and they avoided an arrangement that would have looked like a transfer to save tax.",
        "Shalini also began filing her own return each year, reporting her tuition income and interest, which built her own financial record for the first time.",
      ],
      lesson: "Income from money you give your spouse is taxed as yours. Their own savings are theirs.",
    },
  ],

  problemIntro: "Use the slab tables in this book or the site's income tax calculator. Salaried, resident, below 60, tax year 2026-27, cess included, unless stated.",

  problems: [
    ...[800000, 1000000, 1275000, 1600000, 2000000, 2500000].map((s, i) => ({
      title: `New regime tax on Rs. ${s / 100000} lakh`,
      q: [`What is the new-regime tax on a salary of Rs. ${inr(s)}?`],
      steps: [`Taxable = ${inr(s)} − 75,000 = ${inr(tax(s, "new").taxable)}.`, `Slab tax = ${inr(tax(s, "new").slabTax)}.`, `Rebate or relief: ${inr(tax(s, "new").rebate)}.`, `Cess: ${inr(tax(s, "new").cess)}.`],
      answer: `${Rs(T(s, "new"))}.`,
      table: i === 4 ? { caption: "Slab by slab.", headers: ["Band", "Rate", "Income in band", "Tax"], rows: slabRows(tax(s, "new")) } : undefined,
    })),
    ...[[1200000, 200000], [1800000, 300000], [2500000, 400000]].map(([s, d]) => ({
      title: `Old regime tax on Rs. ${s / 100000} lakh with Rs. ${d / 100000} lakh deductions`,
      q: [`Salary Rs. ${inr(s)}, old-regime deductions Rs. ${inr(d)} besides the standard deduction. Tax?`],
      steps: [`Taxable = ${inr(s)} − 50,000 − ${inr(d)} = ${inr(tax(s, "old", d).taxable)}.`, `Slab tax = ${inr(tax(s, "old", d).slabTax)}.`, `Cess = ${inr(tax(s, "old", d).cess)}.`],
      answer: `${Rs(T(s, "old", d))}, against ${Rs(T(s, "new"))} in the new regime.`,
    })),
    {
      title: "Marginal relief",
      q: ["Salary Rs. 13.1 lakh, new regime. Show the effect of marginal relief."],
      steps: [`Taxable = ${inr(tax(1310000, "new").taxable)}.`, `Slab tax = ${inr(tax(1310000, "new").slabTax)}.`, `Excess over Rs. 12 lakh = ${inr(tax(1310000, "new").taxable - 1200000)}; tax limited to that.`],
      answer: `${Rs(T(1310000, "new"))} including cess.`,
    },
    {
      title: "Break-even deductions",
      q: ["At a salary of Rs. 20 lakh, how much in old-regime deductions makes the two regimes equal?"],
      steps: ["Find the deduction at which old-regime tax equals new-regime tax."],
      answer: `About ${Rs(breakEven(2000000))}.`,
    },
    {
      title: "HRA exemption",
      q: ["Basic Rs. 45,000, HRA Rs. 18,000, rent Rs. 20,000 a month in Hyderabad. Exempt HRA a year?"],
      steps: (() => {
        const h = hraExempt({ basicMonthly: 45000, hraMonthly: 18000, rentMonthly: 20000, metro: true });
        return [`HRA received = ${inr(h.hra)}.`, `Rent − 10% of salary = ${inr(h.rentMinus)}.`, `50% of salary (Hyderabad) = ${inr(h.cap)}.`];
      })(),
      answer: `${Rs(hraExempt({ basicMonthly: 45000, hraMonthly: 18000, rentMonthly: 20000, metro: true }).exempt)}.`,
    },
    {
      title: "HRA outside the eight cities",
      q: ["Same as the previous problem, but in Jaipur."],
      steps: (() => {
        const h = hraExempt({ basicMonthly: 45000, hraMonthly: 18000, rentMonthly: 20000, metro: false });
        return [`40% of salary = ${inr(h.cap)}.`, `Least of ${inr(h.hra)}, ${inr(h.rentMinus)}, ${inr(h.cap)}.`];
      })(),
      answer: `${Rs(hraExempt({ basicMonthly: 45000, hraMonthly: 18000, rentMonthly: 20000, metro: false }).exempt)}.`,
    },
    {
      title: "Tax per month",
      q: ["Salary Rs. 18 lakh, new regime. Approximate monthly TDS?"],
      steps: [`Yearly tax = ${inr(T(1800000, "new"))}.`, "÷ 12."],
      answer: `About ${Rs(T(1800000, "new") / 12)} a month.`,
    },
    {
      title: "Effective tax rate",
      q: ["What share of a Rs. 25 lakh salary goes in tax in the new regime?"],
      steps: [`Tax = ${inr(T(2500000, "new"))}.`, "÷ 25,00,000."],
      answer: `About ${((T(2500000, "new") / 2500000) * 100).toFixed(1)} percent, though the top slab rate is 30 percent.`,
    },
    {
      title: "Marginal rate on a raise",
      q: ["Salary rises from Rs. 20 lakh to Rs. 21 lakh, new regime. How much of the Rs. 1 lakh raise is tax?"],
      steps: [`Tax at 20 lakh = ${inr(T(2000000, "new"))}.`, `Tax at 21 lakh = ${inr(T(2100000, "new"))}.`],
      answer: `${Rs(T(2100000, "new") - T(2000000, "new"))}, a marginal rate of about ${(((T(2100000, "new") - T(2000000, "new")) / 100000) * 100).toFixed(0)} percent including cess.`,
    },
    {
      title: "Employer NPS in the new regime",
      q: ["Salary Rs. 16 lakh with basic plus DA of Rs. 8 lakh. The employer puts 10 percent of basic into NPS out of CTC. Tax saving?"],
      steps: ["NPS contribution = 80,000, deductible in the new regime (within 14% of basic).", `Tax without = ${inr(T(1600000, "new"))}; with = ${inr(T(1520000, "new"))}.`],
      answer: `${Rs(T(1600000, "new") - T(1520000, "new"))} a year.`,
    },
    {
      title: "Interest income and slab",
      q: ["Salary Rs. 15 lakh, new regime, plus Rs. 60,000 of FD interest with 10 percent TDS by the bank. How much more tax is due on the interest beyond the TDS?"],
      steps: [`Tax on 15.6 lakh total minus tax on 15 lakh = ${inr(T(1560000, "new") - T(1500000, "new"))}.`, "Bank TDS = 6,000."],
      answer: `About ${Rs(T(1560000, "new") - T(1500000, "new") - 6000)} more.`,
    },
    {
      title: "Advance tax instalments",
      q: ["A person expects Rs. 80,000 of tax beyond TDS for the year. What should be paid by each advance tax date?"],
      steps: ["15 June: 15% = 12,000.", "15 Sep: 45% cumulative = 36,000.", "15 Dec: 75% = 60,000.", "15 Mar: 100% = 80,000."],
      answer: "Rs. 12,000, then Rs. 24,000, Rs. 24,000 and Rs. 20,000 in each instalment.",
    },
    {
      title: "Senior in the old regime",
      q: ["A 65-year-old has Rs. 8 lakh pension and Rs. 1.5 lakh deposit interest, with Rs. 1.5 lakh of savings deductions and Rs. 50,000 interest deduction. Old-regime tax?"],
      steps: [`Gross = 9,50,000; deductions 2,00,000 + standard 50,000.`, `Taxable = ${inr(tax(950000, "old", 200000, "60-80").taxable)} with a Rs. 3 lakh nil band.`],
      answer: `${Rs(T(950000, "old", 200000, "60-80"))}, against ${Rs(T(950000, "new"))} in the new regime.`,
    },
    {
      title: "Two employers",
      q: ["Salary Rs. 9 lakh from employer A (April to September) and Rs. 9 lakh from B (October to March). Neither knew about the other, so each computed TDS only on the Rs. 9 lakh it paid. New regime. How much is due at filing?"],
      steps: [`Tax each employer computed on Rs. 9 lakh = ${inr(T(900000, "new"))}, because Rs. 9 lakh is within the rebate.`, `Actual tax on Rs. 18 lakh = ${inr(T(1800000, "new"))}.`],
      answer: `About ${Rs(T(1800000, "new") - 2 * T(900000, "new"))} due, if each employer computed TDS only on what it paid.`,
    },
    {
      title: "Home-loan interest cap",
      q: ["Old regime: interest on a self-occupied home loan is Rs. 2.6 lakh. How much is deductible, and what is the tax value at a 30 percent rate?"],
      steps: ["Cap is Rs. 2 lakh.", "2,00,000 × 30% × 1.04 cess."],
      answer: "Rs. 2 lakh deductible; worth about Rs. 62,400.",
    },
    {
      title: "Health insurance deduction",
      q: ["Old regime: premiums of Rs. 28,000 for self and family (below 60) and Rs. 55,000 for senior parents. Deductible?"],
      steps: ["Self and family: capped at 25,000.", "Senior parents: capped at 50,000."],
      answer: "Rs. 75,000.",
    },
    {
      title: "Savings deduction cap",
      q: ["Old regime: EPF Rs. 86,400, PPF Rs. 1 lakh, life premium Rs. 30,000, children's tuition Rs. 60,000. Deductible?"],
      steps: ["Total = 2,76,400.", "Cap = 1,50,000."],
      answer: "Rs. 1.5 lakh; the rest gives no further deduction.",
    },
    {
      title: "Surcharge",
      q: ["Salary Rs. 60 lakh in the new regime. Is surcharge payable, and at what rate?"],
      steps: ["Taxable above Rs. 50 lakh and up to Rs. 1 crore: 10 percent surcharge on tax, with marginal relief near the threshold."],
      answer: `Yes, 10 percent. Total tax with surcharge and cess: ${Rs(T(6000000, "new"))}.`,
    },
    {
      title: "Gift taxability",
      q: ["In a year, you receive Rs. 40,000 from a friend, Rs. 2 lakh from your uncle, and Rs. 30,000 from a colleague. What is taxable?"],
      steps: ["Gifts from relatives (an uncle counts) are exempt.", "Gifts from non-relatives: 40,000 + 30,000 = 70,000, above Rs. 50,000."],
      answer: "Rs. 70,000 is taxable as other income, because the non-relative total exceeds Rs. 50,000.",
    },
    {
      title: "Long-term gains exemption",
      q: ["Long-term gain on equity funds of Rs. 2 lakh. Tax?"],
      steps: ["Exempt: 1,25,000.", "Taxable: 75,000 × 12.5% = 9,375.", "Cess 4%."],
      answer: "About Rs. 9,750.",
    },
    {
      title: "Let-out property income",
      q: ["Rent received Rs. 3 lakh, municipal tax paid Rs. 10,000, home-loan interest Rs. 1.5 lakh. Income from house property?"],
      steps: ["Net annual value = 2,90,000.", "Standard deduction 30% = 87,000.", "Less interest 1,50,000."],
      answer: "Rs. 53,000 taxable as income from house property.",
    },
    {
      title: "Comparing two offers",
      q: ["Offer A: Rs. 22 lakh fixed. Offer B: Rs. 20 lakh fixed plus Rs. 2.5 lakh variable that was paid in full last year. New regime. Take-home after tax in each case?"],
      steps: [`A: 22,00,000 − ${inr(T(2200000, "new"))}.`, `B: 22,50,000 − ${inr(T(2250000, "new"))} if variable paid; 20,00,000 − ${inr(T(2000000, "new"))} if not.`],
      answer: `A: ${Rs(2200000 - T(2200000, "new"))}. B: ${Rs(2250000 - T(2250000, "new"))} with full variable, ${Rs(2000000 - T(2000000, "new"))} without.`,
    },
    {
      title: "ESOP perquisite",
      q: ["1,000 options exercised at Rs. 50 when fair value is Rs. 450. Perquisite value, and extra tax for someone with Rs. 25 lakh salary in the new regime?"],
      steps: ["Perquisite = 1,000 × (450 − 50) = 4,00,000.", `Tax on 29 lakh − tax on 25 lakh.`],
      answer: `Perquisite Rs. 4 lakh; extra tax about ${Rs(T(2900000, "new") - T(2500000, "new"))}.`,
    },
    {
      title: "TDS on track",
      q: ["Estimated tax for the year is Rs. 1.8 lakh. By December, Rs. 1.05 lakh has been deducted over nine months. What monthly TDS is needed for January to March?"],
      steps: ["Remaining = 1,80,000 − 1,05,000 = 75,000.", "÷ 3."],
      answer: "Rs. 25,000 a month.",
    },
    {
      title: "Joint home loan in the old regime",
      q: ["A couple co-own a self-occupied flat 50:50 and pay Rs. 3.6 lakh of interest and Rs. 2 lakh of principal a year. What can each claim in the old regime?"],
      steps: ["Interest share 1.8 lakh each; cap 2 lakh each: 1.8 lakh each.", "Principal share 1 lakh each, within the Rs. 1.5 lakh savings limit with other items."],
      answer: "Each can claim Rs. 1.8 lakh of interest and Rs. 1 lakh of principal, subject to their other savings deductions.",
    },
    {
      title: "Gross from net",
      q: ["You want Rs. 1.2 lakh a month after tax in the new regime, ignoring PF. Roughly what gross salary is needed?"],
      steps: ["Try values until gross minus tax equals 14.4 lakh a year."],
      answer: (() => {
        let lo = 1440000;
        let hi = 3000000;
        for (let k = 0; k < 60; k++) {
          const mid = (lo + hi) / 2;
          if (mid - T(mid, "new") < 1440000) lo = mid;
          else hi = mid;
        }
        return `About ${Rs(hi)} a year.`;
      })(),
    },
    {
      title: "Health check-up within the limit",
      q: ["Old regime: Rs. 18,000 premium for self and family and Rs. 7,000 in cash for preventive check-ups. Deductible?"],
      steps: ["Check-ups are allowed up to Rs. 5,000 within the Rs. 25,000 limit.", "18,000 + 5,000 = 23,000."],
      answer: "Rs. 23,000.",
    },
    {
      title: "Loss set-off",
      q: ["This year you have a short-term loss of Rs. 60,000 and a long-term gain of Rs. 2 lakh on equity. What long-term gain is taxed?"],
      steps: ["Short-term losses can be set off against long-term gains.", "2,00,000 − 60,000 = 1,40,000.", "Exemption 1,25,000; taxable 15,000."],
      answer: "Rs. 15,000 at 12.5 percent: Rs. 1,875 before cess.",
    },
    {
      title: "PF interest above the threshold",
      q: ["Your own PF contributions are Rs. 3.5 lakh this year. Interest is 8.25 percent. Roughly how much interest becomes taxable for the excess?"],
      steps: ["Excess = 1,00,000.", "Interest on the excess, about 8.25 percent a year once it has been in the account a full year."],
      answer: "About Rs. 8,250 a year of taxable interest on that excess, growing as it compounds.",
    },
    {
      title: "Commuted pension",
      q: ["A non-government retiree who also receives gratuity commutes one-third of pension for Rs. 6 lakh. How much is exempt?"],
      steps: ["For non-government employees receiving gratuity, one-third of the full commuted value is exempt.", "The amount commuted is one-third, so the full commuted value would be 18 lakh; one-third is 6 lakh."],
      answer: "All Rs. 6 lakh is exempt in this case.",
    },
    {
      title: "Debt fund gain",
      q: ["A debt fund bought in 2024 is sold with a gain of Rs. 50,000. Your slab is 20 percent. Tax?"],
      steps: ["Bought after 1 April 2023: taxed at slab rate.", "50,000 × 20% × 1.04."],
      answer: "About Rs. 10,400.",
    },
    {
      title: "Old regime after a loan ends",
      q: ["Salary Rs. 28 lakh. Last year deductions were Rs. 5 lakh; this year Rs. 1.75 lakh. Compare old-regime tax in each year with the new regime."],
      steps: [`Old, 5 lakh deductions: ${inr(T(2800000, "old", 500000))}.`, `Old, 1.75 lakh: ${inr(T(2800000, "old", 175000))}.`, `New: ${inr(T(2800000, "new"))}.`],
      answer: "The old regime won with Rs. 5 lakh of deductions and loses with Rs. 1.75 lakh. Switch when the large deductions end.",
    },
    {
      title: "Tax on a bonus",
      q: ["Salary Rs. 18 lakh plus a Rs. 2 lakh bonus, new regime. Extra tax on the bonus?"],
      steps: [`Tax on 20 lakh − tax on 18 lakh.`],
      answer: `${Rs(T(2000000, "new") - T(1800000, "new"))}.`,
    },
    {
      title: "Exempt gratuity",
      q: ["A private-sector employee receives Rs. 23 lakh gratuity. How much is taxable?"],
      steps: ["Exempt limit Rs. 20 lakh (subject to the formula)."],
      answer: "At least Rs. 3 lakh, taxed as salary; more if the formula gives less than Rs. 20 lakh.",
    },
  ],

  exercises: {
    warmup: [
      { q: "What is the standard deduction for salaried people in the new regime? In the old?", a: "Rs. 75,000 in the new regime; Rs. 50,000 in the old." },
      { q: "Up to what salary does a salaried person pay no tax in the new regime?", a: "Rs. 12.75 lakh, because of the Rs. 75,000 standard deduction and the rebate up to Rs. 12 lakh of taxable income." },
      { q: "What is the cess rate?", a: "4 percent of tax plus surcharge." },
      { q: "Which form shows tax deducted against your PAN by all deductors?", a: "Form 26AS, with more detail in the Annual Information Statement." },
      { q: "Is HRA exemption available in the new regime?", a: "No." },
      { q: "Name the eight cities where the 50 percent HRA limit applies from April 2026.", a: "Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad." },
      { q: "What replaced the terms previous year and assessment year under the 2025 Act?", a: "The tax year." },
      { q: "Which form gives a new employer details of salary from a previous employer in the same year?", a: "Form 12B." },
    ],
    practice: [
      { q: "New-regime tax on Rs. 11 lakh salary?", a: `${Rs(T(1100000, "new"))}.` },
      { q: "New-regime tax on Rs. 14 lakh salary?", a: `${Rs(T(1400000, "new"))}.` },
      { q: "Old-regime tax on Rs. 14 lakh with Rs. 2.5 lakh deductions?", a: `${Rs(T(1400000, "old", 250000))}.` },
      { q: "Basic Rs. 50,000, HRA Rs. 25,000, rent Rs. 30,000 in Ahmedabad. Exempt HRA?", a: `${Rs(hraExempt({ basicMonthly: 50000, hraMonthly: 25000, rentMonthly: 30000, metro: true }).exempt)}.` },
      { q: "List four documents to check before filing.", a: "Form 16, Form 26AS, the Annual Information Statement, and proofs of deductions and capital gains statements." },
      { q: "When must advance tax be paid, and when is it required?", a: "In instalments by 15 June, 15 September, 15 December and 15 March, when tax after TDS for the year is Rs. 10,000 or more." },
      { q: "A friend says gifts are always tax-free. Correct them.", a: "Gifts from relatives are exempt; gifts from non-relatives totalling more than Rs. 50,000 in a year are taxable, with some exceptions such as on marriage." },
      { q: "Gross salary for Rs. 1 lakh a month after tax in the new regime, ignoring PF?", a: (() => { let lo = 1200000, hi = 2500000; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (m - T(m, "new") < 1200000) lo = m; else hi = m; } return `About ${Rs(hi)} a year.`; })() },
      { q: "Name three lines on a payslip that matter only in the old regime.", a: "HRA, LTA and professional tax." },
      { q: "Salary Rs. 22 lakh plus Rs. 3 lakh bonus, new regime. Extra tax on the bonus?", a: `${Rs(T(2500000, "new") - T(2200000, "new"))}.` },
      { q: "You move into your own flat in October after renting in Pune. How does HRA work for the year?", a: "HRA exemption applies only for the months rent was paid, April to September, using the formula for that period; from October the HRA is fully taxable." },
    ],
    stretch: [
      { q: "Find the break-even old-regime deductions at Rs. 25 lakh salary.", a: `About ${Rs(breakEven(2500000))}.` },
      { q: "Explain why someone earning Rs. 13 lakh pays much less than 10 percent of the excess over Rs. 12 lakh.", a: "Marginal relief caps the tax at the income above Rs. 12 lakh of taxable income, so tax rises gradually instead of jumping to over Rs. 60,000." },
      { q: "A salaried person with Rs. 2 lakh short-term equity gains and Rs. 9 lakh salary assumes zero tax. What is wrong?", a: "The rebate applies to slab-rate income; short-term gains on listed equity are taxed at a special 20 percent rate, which remains payable." },
      { q: "Compute the monthly TDS difference between regimes for Rs. 24 lakh salary with Rs. 4 lakh of old-regime deductions.", a: `Old: ${Rs(T(2400000, "old", 400000) / 12)} a month; new: ${Rs(T(2400000, "new") / 12)}.` },
      { q: "Rent paid is Rs. 1.2 lakh a year to a landlord without a PAN. What must the employee provide?", a: "Above Rs. 1 lakh a year, the landlord's PAN is required, or a declaration if the landlord has none; without it the employer may not allow the exemption." },
      { q: "Explain how ESOP exercise can raise tax in a year with no cash from the shares.", a: "The difference between fair value and exercise price is a salary perquisite taxed in the year of exercise; the shares may not be sold until later." },
      { q: "How does relief for arrears work in principle?", a: "Tax is recalculated as if arrears were received in the years they relate to; if that gives less tax overall, the difference is allowed as relief, claimed by filing the prescribed form." },
      { q: "Show that the new regime wins at Rs. 28 lakh salary with Rs. 1.75 lakh of old-regime deductions.", a: `Old ${Rs(T(2800000, "old", 175000))}; new ${Rs(T(2800000, "new"))}.` },
      { q: "A short-term loss of Rs. 40,000 and a long-term gain of Rs. 1.5 lakh. Taxable long-term gain?", a: "Rs. 1.1 lakh after set-off, which is within the Rs. 1.25 lakh exemption, so no tax." },
    ],
    challenge: [
      { q: "Design a decision rule a salaried person can use each April to pick a regime.", a: "List deductions you will certainly have this year with proof: HRA, home-loan interest, savings, health insurance, NPS. Compare their total with the break-even for your expected salary. Above it, old regime; below or close, new regime, which is simpler. Recheck at filing." },
      { q: "A couple both earn Rs. 20 lakh. One pays rent and the other the home loan for a let-out flat. How should they think about regimes?", a: "Each chooses separately based on their own deductions. The tenant may benefit from HRA in the old regime if the city and rent are high; the owner sets interest against rent in either regime. Run both numbers for each person." },
      { q: "Explain how changing jobs mid-year leads to tax due, and three ways to prevent it.", a: "Each employer applies the standard deduction and low slabs to its own part. Prevent by declaring previous salary to the new employer, asking for higher TDS, or paying self-assessment or advance tax." },
      { q: "Write a year-end tax checklist for a salaried person.", a: "Confirm regime with employer; submit proofs by the deadline; check payslips' TDS; gather interest certificates and capital gains statements; download Form 16, 26AS and AIS in June; reconcile; pay any balance; file by the due date; e-verify; track the refund." },
      { q: "A salaried person also earns Rs. 6 lakh from consulting. Outline the tax implications.", a: "Consulting is professional income, needing ITR-3 or ITR-4 under the presumptive scheme if eligible; TDS by clients counts as credit; advance tax is likely needed; expenses can be claimed under regular rules; both regimes are possible, but switching rules differ for business income." },
      { q: "Write a short guide for a new employee choosing a regime on the first day of work.", a: "If you rent in a high-rent city and receive HRA, or have a home loan, estimate old-regime deductions and compare with the break-even table. If not, choose the new regime. Tell HR, keep rent receipts and proofs if old, and revisit each April and at filing." },
    ],
  },

  faqs: [
    {
      group: "Slabs and regimes",
      items: [
        ["Which regime is the default?", "The new regime. You must actively choose the old regime, with your employer at the start of the year and in your return."],
        ["Can I switch regimes every year?", "Salaried people without business income can choose each year at filing. Those with business income have restrictions on switching back and forth."],
        ["Is income up to Rs. 12 lakh really tax-free?", "For slab-rate income in the new regime, yes, through the rebate. For salaried people the limit is effectively Rs. 12.75 lakh because of the standard deduction. Special-rate income such as some capital gains can still be taxed."],
        ["What is marginal relief?", "A cap that stops tax jumping sharply just above a threshold. In the new regime, tax just above Rs. 12 lakh of taxable income cannot exceed the income above Rs. 12 lakh."],
        ["Why do people still use the old regime?", "Those with large deductions, typically HRA in a high-rent city, a self-occupied home loan and full use of the savings deduction, can pay less tax under it."],
        ["Did Budget 2026 change the slabs?", "No. The slabs, rebate and standard deduction for the tax year 2026-27 are the same as for 2025-26."],
        ["Does the new Act change how much tax I pay?", "Not by itself. The 2025 Act reorganises and renumbers the law and introduces the term tax year; rates are set separately by the Finance Act each year."],
        ["Is there a surcharge in the new regime?", "Yes, on very high incomes: 10 percent above Rs. 50 lakh, 15 percent above Rs. 1 crore, and 25 percent above Rs. 2 crore, with the top rate capped at 25 percent in the new regime."],
      ],
    },
    {
      group: "Salary components",
      items: [
        ["Is my entire CTC taxable?", "No. Employer contributions to PF within limits, gratuity provisions and some reimbursements are not taxable as salary when provided. Your Form 16 shows what is taxed."],
        ["Are meal cards or vouchers taxable?", "In the old regime, meal vouchers up to set limits per meal have been exempt; newer rules have revised limits. In the new regime, check whether the benefit is a perquisite taxed as salary. Ask payroll for its treatment."],
        ["Is professional tax deductible?", "In the old regime, yes, up to the amount actually paid, which is at most Rs. 2,500 a year in the states that levy it. In the new regime it is not deductible, though your employer still deducts it from salary where the state requires."],
        ["How is a company car taxed?", "As a perquisite valued under the rules, depending on engine size and use. The value is added to salary in Form 16."],
        ["Is employer's PF contribution taxable?", "Employer contributions to PF, NPS and superannuation together are exempt up to Rs. 7.5 lakh a year; above that, the excess and related income are taxable."],
        ["What about joining bonuses and retention bonuses?", "They are fully taxable as salary in the year received, and TDS on them can make one month's deduction unusually large. If you repay a joining bonus on leaving early, tax treatment of the repayment depends on the facts; keep the documents."],
        ["Are reimbursements for phone and internet taxable?", "Reimbursements for official use against bills are generally not taxable. Fixed allowances without bills are taxable as salary."],
      ],
    },
    {
      group: "Deductions and exemptions",
      items: [
        ["What counts towards the Rs. 1.5 lakh savings deduction?", "EPF and VPF, PPF, ELSS, life insurance premiums, home-loan principal, children's tuition fees, NSC, SSY, tax-saving FDs, among others. Old regime only."],
        ["Can I claim HRA and home-loan interest together?", "Yes, in the old regime, if you live in a rented home in one city and own a home elsewhere, or have genuine reasons. Each claim must stand on its own facts."],
        ["Is rent paid to my spouse allowed for HRA?", "Generally not accepted, because tax authorities view such arrangements sceptically. Rent to a parent who owns the home is more commonly accepted with proper documents."],
        ["Can I claim health check-ups?", "Up to Rs. 5,000 for preventive check-ups within the health insurance limit, in the old regime, including cash payments for the check-up."],
        ["Is NPS deductible in the new regime?", "Your own contributions are not. Your employer's contributions are, up to 14 percent of basic pay plus DA."],
        ["Is education loan interest deductible?", "In the old regime, yes, without an upper limit, for up to eight years, for higher education of yourself, spouse or children."],
        ["Are donations deductible?", "In the old regime, to approved institutions, at 50 or 100 percent, sometimes with limits. Cash donations above Rs. 2,000 are not allowed. Not available in the new regime."],
        ["What is the leave encashment exemption?", "On retirement, non-government employees can claim exemption up to Rs. 25 lakh over their working life, subject to a formula. Encashment while in service is taxable."],
      ],
    },
    {
      group: "TDS, Form 16 and statements",
      items: [
        ["Why is my TDS high in the last months of the year?", "If you did not submit proofs for declared deductions, the employer recomputes tax without them and deducts the shortfall over the remaining months."],
        ["When will I get Form 16?", "Employers must issue it by 15 June after the tax year ends, after filing their TDS returns. If you changed jobs, you get one from each employer for the period you worked there."],
        ["What if my Form 16 has an error?", "Ask your employer to correct it and file a revised TDS return. If TDS deposited is wrong, Form 26AS will not show it correctly, and you will not get credit."],
        ["What is the AIS?", "The Annual Information Statement lists income and transactions reported by banks, companies, registrars and others against your PAN. Use it to make sure your return includes everything."],
        ["My AIS shows something wrong. What do I do?", "Submit feedback on the AIS item through the portal, explaining the error. Report the correct figure in your return."],
        ["Does TDS mean I do not need to file?", "No. Filing is required if income exceeds the basic exemption limit, and it is the only way to claim refunds and carry forward losses."],
      ],
    },
    {
      group: "Filing and after",
      items: [
        ["Which ITR form should I use?", "ITR-1 for most salaried people with simple income up to Rs. 50 lakh; ITR-2 if you have capital gains beyond ITR-1's limits, foreign assets or more than one house; ITR-3 or 4 for business or professional income."],
        ["What is the due date?", "Usually 31 July after the tax year for salaried individuals not requiring audit, though it has sometimes been extended. Check the portal each year."],
        ["What if I miss the due date?", "You can file a belated return within the allowed time, with a late fee and interest on any tax due, and you may lose the right to carry forward some losses."],
        ["How do I e-verify?", "By Aadhaar OTP, net banking, a pre-validated bank or demat account, or by sending a signed form. Verify within the deadline, or the return is treated as not filed."],
        ["How long does a refund take?", "Often a few weeks after processing, if the bank account is pre-validated and details match. Track it on the portal."],
        ["What is a revised return?", "A corrected return filed within the allowed time if you find a mistake or omission in the original."],
        ["What is an updated return?", "A return filed after the normal deadlines to report missed income, within a longer window, with additional tax as a percentage of the tax due. It cannot be used to reduce tax."],
        ["I got a notice. What now?", "Read it on the portal, note the deadline, and respond with documents. Many are automated mismatch communications that close once you respond or revise."],
        ["How long should I keep tax documents?", "Several years: queries can be raised for past years. Keep each year's Form 16, AIS, return and proofs in a folder."],
      ],
    },
    {
      group: "Special situations",
      items: [
        ["Do NRIs pay tax in India on salary abroad?", "Non-residents are taxed in India only on income earned or received in India. Residency depends on days spent in India. Check the rules carefully if you move."],
        ["How is a pension taxed?", "Pension from a former employer is taxed as salary, with the standard deduction. Commuted pension is partly or fully exempt depending on the case."],
        ["Is arrear salary taxed in the year received?", "Yes, but relief may be available to spread the tax as if received in the years it related to, by filing the prescribed form."],
        ["How is ESOP income taxed?", "At exercise, the difference between fair value and exercise price is taxed as salary; later sale gains are capital gains. Some start-up employees can defer tax."],
        ["Do I pay tax on a matured life insurance policy?", "Maturity proceeds are exempt in many cases, but policies with high premiums relative to sum assured, or above certain premium limits, can be taxable."],
      ],
    },
    {
      group: "Quick answers",
      items: [
        ["Do I need to file if my income is below Rs. 12.75 lakh?", "If your income exceeds the basic exemption limit, filing is required even when the rebate brings tax to zero. Filing also records your income for loans and visas."],
        ["Can I claim deductions my employer did not allow?", "Yes, in the old regime, if you have proof. Enter them in the return; the refund comes after processing."],
        ["Does my spouse's income affect my tax?", "No. Each spouse is taxed separately on their own income and chooses their own regime. The exception is clubbing: income from money you gave your spouse is added to your income, not theirs."],
        ["Is interest on my savings account taxable?", "Yes, at slab rates. In the old regime up to Rs. 10,000 of savings interest is deductible, Rs. 50,000 of all deposit interest for seniors."],
        ["Is income from a fixed deposit in my child's name taxable?", "It is generally clubbed with the income of the parent who earns more, after a small exemption per child."],
        ["Can I file my return myself?", "Yes. The e-filing portal pre-fills most data for salaried people, and ITR-1 can be completed online in under an hour once you have your documents."],
        ["What if my employer did not deposit the TDS it deducted?", "It will not appear in Form 26AS. Ask the employer to deposit it and file its TDS return; keep payslips as evidence. Credit is given based on Form 26AS."],
        ["Is a bonus taxed at a higher rate?", "No. It is added to salary and taxed at your slab rates. TDS in the month of the bonus may be high because the employer recalculates the year's tax."],
        ["Can I carry forward capital losses if I file late?", "Generally not. Capital losses can be carried forward only if the return for the year of the loss is filed by the due date."],
        ["Are mutual fund switches taxable?", "Yes. Switching between schemes, even within one fund house, is a sale and a fresh purchase, so any gain is taxable."],
        ["Is interest on my EPF taxable?", "It is tax-free on contributions up to Rs. 2.5 lakh a year of your own money. Interest on the excess is taxable each year."],
        ["Can I claim both HRA and a home loan if I live in my own house?", "No. HRA exemption requires rent actually paid for accommodation you occupy. If you live in your own house, there is no rent to claim."],
        ["Is tax deducted on my bonus at a higher rate?", "No special rate applies; the employer simply recalculates the year's tax including the bonus, which can make that month's TDS large."],
        ["Do I need to report exempt income?", "Yes. The return has schedules for exempt income such as PPF interest and gratuity. Reporting it keeps your records consistent."],
        ["Is there tax on income from a recurring deposit?", "Yes, interest is taxable each year as it accrues, and the bank may deduct TDS above the threshold."],
        ["Should I choose the new regime if I have a home loan?", "Only after comparing. For a self-occupied home, the interest and principal deductions exist only in the old regime; whether they outweigh the new regime's lower rates depends on your income and other deductions."],
      ],
    },
  ],

  glossary: [
    ["Advance tax", "Tax paid in instalments during the year when liability after TDS is Rs. 10,000 or more."],
    ["AIS", "Annual Information Statement: a record of income and transactions reported against your PAN."],
    ["Cess", "Health and education cess: 4 percent added to tax and surcharge."],
    ["CTC", "Cost to company: the employer's total cost of employing you, including items you do not receive as cash."],
    ["Deduction", "An amount subtracted from income before tax is calculated."],
    ["E-verification", "Confirming a filed return electronically, required to complete filing."],
    ["Exemption", "Income or a part of it that is not taxed, such as part of HRA."],
    ["Form 12B", "A form to tell a new employer about salary and TDS from a previous employer in the same year."],
    ["Form 16", "Certificate of salary and TDS issued by the employer after the year."],
    ["Form 26AS", "Statement of tax deducted and deposited against your PAN."],
    ["HRA", "House rent allowance: part of salary for rent, partly exempt in the old regime."],
    ["ITR", "Income tax return."],
    ["LTA", "Leave travel allowance, exempt within limits in the old regime."],
    ["Marginal relief", "A cap that limits tax just above a threshold to the income above it."],
    ["New regime", "The default tax regime with lower slab rates and few deductions."],
    ["Old regime", "The optional regime with higher slab rates and many deductions."],
    ["Perquisite", "A non-cash benefit from an employer, such as a car, taxed as part of salary."],
    ["Rebate", "A reduction in tax for incomes within a limit; Rs. 60,000 up to Rs. 12 lakh taxable in the new regime."],
    ["Refund", "Tax paid in excess of liability, returned after processing."],
    ["Revised return", "A corrected return filed within the allowed time."],
    ["Self-assessment tax", "Tax paid by the taxpayer before filing to cover any balance."],
    ["Slab", "A band of income taxed at one rate."],
    ["Standard deduction", "A flat deduction for salaried people: Rs. 75,000 new regime, Rs. 50,000 old."],
    ["Surcharge", "An additional tax on tax for high incomes."],
    ["Taxable income", "Income after exemptions and deductions, on which slab rates apply."],
    ["Tax year", "Under the 2025 Act, the twelve-month period from April to March for which income is taxed."],
    ["TDS", "Tax deducted at source by an employer, bank or other payer."],
    ["Updated return", "A return filed late to report missed income, with additional tax."],
  ],

  references: [
    { title: "Income-tax Act, 2025 and Income-tax Rules, 2026", who: "Ministry of Finance and Central Board of Direct Taxes", where: "incometaxindia.gov.in", note: "The law in force from 1 April 2026, including the tax year concept and renumbered sections." },
    { title: "Finance Act, 2026", who: "Government of India", where: "indiabudget.gov.in", note: "Confirms slab rates, rebate and standard deduction for the tax year 2026-27." },
    { title: "Income Tax e-filing portal", who: "Income Tax Department", where: "incometax.gov.in", note: "Filing, AIS, Form 26AS, refund status and responses to communications." },
    { title: "Income tax calculator and tax regime comparison", who: "Income Tax Department", where: "incometax.gov.in, Tax Tools", note: "The department's own calculators to cross-check your figures." },
    { title: "Income-tax Rules 2026 on HRA", who: "Central Board of Direct Taxes", where: "incometaxindia.gov.in", note: "The eight cities for the 50 percent HRA limit from 1 April 2026." },
    { title: "TRACES", who: "Income Tax Department", where: "tdscpc.gov.in", note: "For TDS certificates and Form 16 issued by deductors." },
    { title: "Taxpayer services and FAQs", who: "Income Tax Department", where: "incometax.gov.in, Help", note: "Official answers on forms, deadlines and processes." },
  ],
};
