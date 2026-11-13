// Practice material for "Salary, PF and Take-home Pay".
// Take-home figures follow the site's in-hand salary calculator: employer PF and a
// 4.81% gratuity provision come out of CTC; employee PF, professional tax and income
// tax come out of gross. PF uses the Rs. 25,000 statutory wage ceiling in force from
// 17 September 2026 when "capped".
import { computeTax } from "../../../src/tools/calcs.js";
import { inr } from "../lib/calc.mjs";

const Rs = (n) => `Rs. ${inr(n)}`;
const CEIL = 25000;
function takeHome({ ctc, basicPct = 50, pf = "capped", grat = true, pt = 2400, regime = "new", ded = 0, employerNps = 0 }) {
  const basicM = (ctc * basicPct) / 100 / 12;
  const pfM = pf === "none" ? 0 : pf === "capped" ? Math.min(basicM, CEIL) * 0.12 : basicM * 0.12;
  const gratY = grat ? basicM * 12 * 0.0481 : 0;
  const gross = ctc - pfM * 12 - gratY;
  const d = regime === "old" ? Math.min(150000, pfM * 12) + ded : 0;
  const t = computeTax({ income: gross - employerNps, regime, deductions: d, salaried: true });
  const net = gross - employerNps - pfM * 12 - pt - t.total;
  return { basicM, pfM, gratY, gross, tax: t.total, net, monthly: net / 12, employerNps };
}
const gratuity = (wages, years) => (wages * 15 * years) / 26;
function epf(basic, years, rate = 8.25, raise = 6, start = 0, ceiling = CEIL, full = false) {
  let bal = start;
  let b = basic;
  let contrib = 0;
  for (let y = 0; y < years; y++) {
    let interest = 0;
    for (let m = 0; m < 12; m++) {
      const wage = full ? b : Math.min(b, ceiling);
      const emp = b * 0.12;
      const eps = Math.min(Math.min(b, ceiling) * 0.0833, 2083);
      const er = (full ? b : wage) * 0.12 - eps;
      const c = emp + Math.max(0, er);
      bal += c;
      contrib += c;
      interest += (bal * rate) / 1200;
    }
    bal += interest;
    b *= 1 + raise / 100;
  }
  return { bal, contrib };
}
const A = takeHome({ ctc: 1200000 });
const B = takeHome({ ctc: 1200000, pf: "full" });

export default {
  checked: "October 2026",
  welcome:
    "This book is about the gap between the number on an offer letter and the money that reaches your bank account. It explains CTC, basic pay, allowances, provident fund, the pension scheme, gratuity, professional tax and income tax, and shows how each one changes take-home pay and long-term savings. It includes two changes that matter in 2026: the labour codes in force since November 2025, and the EPF wage ceiling raised to Rs. 25,000 from 17 September 2026.",

  chapters: [
    {
      title: "From CTC to the bank account",
      paragraphs: [
        "Cost to company is everything the employer spends on you in a year. Take-home is what lands in your account each month. Between them sit several layers.",
      ],
      sections: [
        {
          steps: [
            "Start with CTC.",
            "Remove items the employer pays that never reach you as salary: employer PF, gratuity provision, and sometimes insurance premiums. What remains is gross salary.",
            "Remove variable pay you are not certain to receive, for budgeting purposes.",
            "From gross, deduct your own PF contribution, professional tax where your state levies it, and income tax.",
            "Divide by twelve for monthly take-home.",
          ],
        },
        {
          heading: "A Rs. 12 lakh CTC",
          paragraphs: [
            `With basic at 50 percent of CTC, monthly basic is ${Rs(A.basicM)}. Employee PF on the Rs. 25,000 ceiling is ${Rs(A.pfM)} a month, and the employer matches it inside CTC. The gratuity provision is ${Rs(A.gratY)} a year. Gross salary is ${Rs(A.gross)}. In the new regime, income tax is ${Rs(A.tax)}, and with Rs. 2,400 of professional tax, take-home is about ${Rs(A.monthly)} a month.`,
            `If PF is calculated on the full basic instead of the ceiling, both PF shares rise to ${Rs(B.pfM)} a month, gross falls to ${Rs(B.gross)}, and take-home falls to about ${Rs(B.monthly)} a month. The difference is not lost: it goes into your PF account.`,
          ],
          table: {
            caption: "Rs. 12 lakh CTC, basic 50 percent, new regime, professional tax Rs. 2,400.",
            headers: ["Item", "PF on Rs. 25,000 ceiling", "PF on full basic"],
            rows: [
              ["Employer PF (in CTC)", inr(A.pfM * 12), inr(B.pfM * 12)],
              ["Gratuity provision", inr(A.gratY), inr(B.gratY)],
              ["Gross salary", inr(A.gross), inr(B.gross)],
              ["Your PF", inr(A.pfM * 12), inr(B.pfM * 12)],
              ["Income tax", inr(A.tax), inr(B.tax)],
              ["Take-home a year", inr(A.net), inr(B.net)],
              ["Take-home a month", inr(A.monthly), inr(B.monthly)],
            ],
          },
        },
      ],
    },
    {
      title: "The parts of a salary",
      paragraphs: ["Salary structures vary by employer, but most use the same building blocks."],
      sections: [
        { label: "Basic pay", paragraphs: ["The core of the salary. PF, gratuity, HRA and many other items are calculated as a percentage of it. Typically 35 to 50 percent of CTC; under the labour codes, wages including basic and DA must be at least half of total remuneration for many purposes."] },
        { label: "Dearness allowance", paragraphs: ["Common in government and some public-sector jobs, linked to inflation. Treated with basic for PF, gratuity and HRA."] },
        { label: "House rent allowance", paragraphs: ["Paid for rent. Partly exempt from tax in the old regime; fully taxable in the new."] },
        { label: "Special allowance", paragraphs: ["The balancing figure that brings the structure up to CTC. Fully taxable."] },
        { label: "Leave travel allowance", paragraphs: ["For domestic travel on leave; exempt within rules in the old regime only."] },
        { label: "Reimbursements", paragraphs: ["Phone, internet, fuel or books, against bills. Often not taxable when for official use."] },
        { label: "Variable pay and bonus", paragraphs: ["Performance-linked pay, often annual. Include it in your budget only when received."] },
        { label: "Employer contributions", paragraphs: ["PF, NPS, gratuity provision and insurance premiums. Part of CTC, not of take-home."] },
      ],
    },
    {
      title: "The labour codes and your salary",
      paragraphs: [
        "Four labour codes replaced 29 older labour laws and took effect on 21 November 2025. Two parts of them change salary arithmetic for most employees.",
      ],
      sections: [
        {
          heading: "The 50 percent wage rule",
          paragraphs: [
            "The codes define wages to include basic pay, dearness allowance and retaining allowance, and require that wages are not less than half of total remuneration. If allowances exceed half, the excess is added back to wages. Wages in this sense are the base for gratuity and other benefits.",
            "Many employers had kept basic low, around 30 to 40 percent of CTC, with large allowances. Under the codes, such structures are being revised so that basic and DA make up at least half. That can raise PF and gratuity and, within the same CTC, lower monthly take-home, while increasing long-term savings.",
          ],
        },
        {
          heading: "Gratuity for fixed-term employees",
          paragraphs: [
            "Permanent employees still need five years of continuous service for gratuity, with exceptions such as death or disability. Fixed-term employees now become eligible after one year of service, on a pro-rata basis.",
          ],
        },
        {
          heading: "What to check in your own structure",
          bullets: [
            "Is basic plus DA at least half of your total remuneration?",
            "Has PF been recalculated on the new wage base, and on the new Rs. 25,000 ceiling?",
            "If you are on a fixed-term contract, does your letter mention gratuity?",
            "Has your take-home changed, and does the change appear as higher PF and gratuity?",
          ],
          note: "Implementation details are set by central and state rules and continue to evolve. Ask your HR team how your structure has been adjusted.",
        },
      ],
    },
    {
      title: "PF, EPS and EDLI in detail",
      paragraphs: [
        "The Employees' Provident Fund Organisation runs three schemes that your payslip touches: the provident fund, the pension scheme and an insurance scheme.",
      ],
      sections: [
        {
          heading: "Who pays what",
          table: {
            caption: "Contributions as a share of PF wages. The ceiling is Rs. 25,000 a month from 17 September 2026.",
            headers: ["Contribution", "Rate", "Goes to"],
            rows: [
              ["Employee", "12%", "Your EPF account"],
              ["Employer, pension part", "8.33% of wages up to the ceiling (max about Rs. 2,083)", "Employees' Pension Scheme"],
              ["Employer, PF part", "Rest of the employer's 12%", "Your EPF account"],
              ["Employer, insurance", "0.5% up to the ceiling", "EDLI scheme"],
              ["Employer, administration", "0.5%", "EPFO charges"],
            ],
          },
        },
        {
          heading: "The new ceiling",
          paragraphs: [
            "From 17 September 2026, the statutory wage ceiling rose from Rs. 15,000 to Rs. 25,000 a month. For employees whose PF is calculated on the ceiling, the employee and employer shares each rise from Rs. 1,800 to Rs. 3,000 a month. More employees, those earning up to Rs. 25,000, are now covered compulsorily. The maximum EPS pension for 35 years of service rises with the ceiling.",
            "If your employer already calculated PF on full basic, the ceiling change affects mainly the EPS share and coverage rules, not your total contribution.",
          ],
        },
        {
          heading: "Interest",
          paragraphs: [
            "EPFO declares the interest rate each year; for 2024-25 it was 8.25 percent. Interest is calculated monthly on the running balance and credited yearly. It is tax-free on employee contributions up to Rs. 2.5 lakh a year; interest on the excess is taxable.",
          ],
        },
        {
          heading: "The pension scheme",
          paragraphs: [
            "EPS pays a monthly pension from 58 after at least ten years of service. The formula is pensionable salary times pensionable service, divided by 70, with pensionable salary capped at the ceiling. With service under ten years, you can withdraw a lump sum or take a scheme certificate to carry service forward.",
          ],
        },
        {
          heading: "EDLI",
          paragraphs: [
            "The Employees' Deposit Linked Insurance scheme pays the nominee a lump sum if an employee dies in service, within minimum and maximum limits linked to wages and PF balance. Employees pay nothing for it. Keep your nominee updated on the EPFO portal.",
          ],
        },
      ],
    },
    {
      title: "UAN, transfers and withdrawals",
      paragraphs: [
        "Your Universal Account Number stays with you across employers. Each employer opens a member ID under it. Keeping the UAN active and linked is the single most useful PF habit.",
      ],
      sections: [
        {
          heading: "On changing jobs",
          paragraphs: [
            "Give your UAN to the new employer so it links your new member ID. Transfer the old balance online through the portal, or let it be transferred automatically where the system allows. Avoid withdrawing; withdrawals before five years of continuous service, counting transferred service, can be taxed, and they end compounding.",
          ],
        },
        {
          heading: "Partial withdrawals",
          paragraphs: [
            "EPFO allows partial withdrawals for purposes such as buying or building a home, repaying a home loan, medical treatment, education and marriage, after minimum periods of membership and within limits. Rules were simplified in recent years and claims can be made online with Aadhaar-based verification.",
          ],
        },
        {
          heading: "Keeping records clean",
          bullets: [
            "Link Aadhaar, PAN and bank account to the UAN, and keep the mobile number current.",
            "Check that your name and date of birth match across records; mismatches are the most common reason claims are rejected.",
            "Download the passbook twice a year and confirm each employer's contributions appear.",
            "Make sure each employer marks your exit date; a missing exit date blocks transfers.",
            "Add or update your nominee.",
          ],
        },
      ],
    },
    {
      title: "Gratuity",
      paragraphs: [
        "Gratuity is a lump sum paid when you leave after qualifying service. Under the Payment of Gratuity Act, now part of the Code on Social Security, it is 15 days of last drawn wages for each completed year of service, with a month counted as 26 days.",
      ],
      sections: [
        {
          heading: "The formula",
          paragraphs: [
            `Gratuity = last drawn wages × 15 ÷ 26 × years of service. With wages of Rs. 50,000 a month and 8 years, gratuity is ${Rs(gratuity(50000, 8))}. Service of more than six months in the final year counts as a full year.`,
            "The maximum gratuity payable under the law is Rs. 20 lakh, and for private-sector employees the tax-free limit is also Rs. 20 lakh over a career. Employers may pay more under their own schemes; the excess is taxable.",
          ],
          table: {
            caption: "Gratuity by last wages and years.",
            headers: ["Wages a month", "5 years", "10 years", "20 years"],
            rows: [25000, 50000, 75000, 100000].map((w) => [inr(w), inr(gratuity(w, 5)), inr(gratuity(w, 10)), inr(Math.min(2000000, gratuity(w, 20)))]),
          },
        },
        {
          heading: "Eligibility",
          paragraphs: [
            "Permanent employees qualify after five years of continuous service. Fixed-term employees qualify after one year. On death or disablement, the five-year condition does not apply. Gratuity in CTC is a provision, often shown as 4.81 percent of basic, which is 15 ÷ 26 ÷ 12; it is not paid monthly.",
          ],
        },
      ],
    },
    {
      title: "Professional tax and other deductions",
      paragraphs: [
        "Several states levy professional tax on salaries, deducted monthly by employers. The maximum is Rs. 2,500 a year. Rates and slabs differ by state; some states, such as Delhi, do not levy it.",
        "Other deductions you may see include labour welfare fund contributions in some states, group health insurance premiums for dependants, voluntary PF and loan recoveries. Each should be explained on the payslip.",
      ],
    },
    {
      title: "Comparing two offers",
      paragraphs: [
        "When two offers state similar CTCs, the comparison lies in the details. Put them side by side on monthly take-home and on long-term benefits, separately.",
      ],
      sections: [
        {
          table: {
            caption: "Two Rs. 18 lakh offers in the new regime.",
            headers: ["", "Offer A: basic 40%, PF capped", "Offer B: basic 50%, PF full, NPS 10% of basic"],
            rows: (() => {
              const a = takeHome({ ctc: 1800000, basicPct: 40 });
              const bBasicY = 1800000 * 0.5;
              const b = takeHome({ ctc: 1800000, basicPct: 50, pf: "full", employerNps: bBasicY * 0.1 });
              return [
                ["Monthly basic", inr(a.basicM), inr(b.basicM)],
                ["PF a month (each side)", inr(a.pfM), inr(b.pfM)],
                ["Employer NPS a year", "0", inr(b.employerNps)],
                ["Income tax", inr(a.tax), inr(b.tax)],
                ["Monthly take-home", inr(a.monthly), inr(b.monthly)],
                ["Yearly retirement savings (PF both sides + NPS)", inr(a.pfM * 24), inr(b.pfM * 24 + b.employerNps)],
              ];
            })(),
          },
          paragraphs: [
            "Offer A pays more each month. Offer B pays less now, builds far more retirement savings and less tax. Which is better depends on whether you need the monthly money now. Neither is wrong; both should be compared on both lines.",
          ],
        },
      ],
    },
    {
      title: "Reading a payslip line by line",
      paragraphs: ["A payslip has two halves: earnings and deductions. Checking a few lines each month catches most errors early."],
      sections: [
        {
          table: {
            caption: "What to check on each payslip.",
            headers: ["Line", "Check"],
            widths: [1.3, 3],
            rows: [
              ["Days paid", "Matches days worked, leave and any unpaid leave."],
              ["Basic and DA", "Matches your structure; changes only on revision."],
              ["HRA and allowances", "Match the structure; any new allowance is explained."],
              ["Arrears", "Explained by a revision letter or correction."],
              ["Employee PF", "12 percent of the right wage base, capped or full as agreed."],
              ["VPF", "The amount you asked for, not more."],
              ["Professional tax", "Correct for your state and month."],
              ["Income tax", "Consistent with your regime and declarations."],
              ["Other deductions", "Loan recoveries, canteen, insurance for dependants: each one you agreed to."],
              ["Net pay", "Equals what reached your bank account."],
            ],
          },
        },
        {
          heading: "Year-to-date figures",
          paragraphs: [
            "Most payslips show totals so far in the year for each line. Compare year-to-date income tax with your estimated yearly tax: if far below, expect larger deductions later, or a balance due when filing.",
          ],
        },
      ],
    },
    {
      title: "Bonuses, increments and arrears",
      paragraphs: ["Pay changes during the year affect take-home and tax in ways that surprise people."],
      sections: [
        {
          heading: "Statutory bonus",
          paragraphs: [
            "Under the labour codes' bonus provisions, employees below a wage threshold in covered establishments are entitled to a minimum bonus each year, linked to profits and wages. Many professionals earn above the threshold and receive performance bonuses instead, under company policy.",
          ],
        },
        {
          heading: "Annual increments",
          paragraphs: [
            "An increment usually takes effect from a set month, sometimes with arrears paid later for the months already passed. The arrears are taxed in the month paid, which can make one payslip's tax unusually high. Relief for arrears exists if they push you into a higher slab for that year.",
          ],
        },
        {
          heading: "Performance bonus and TDS",
          paragraphs: [
            "When a large bonus is paid, payroll recalculates the year's tax including it and deducts the extra in that month or spread over the remaining months. It is not a higher tax rate on the bonus, but it can look like one.",
          ],
        },
      ],
    },
    {
      title: "Benefits beyond salary",
      paragraphs: ["Several benefits appear in offers but not in take-home. Knowing their value helps compare offers fairly."],
      sections: [
        { label: "Group health insurance", paragraphs: ["Employer-paid cover for you and often family. Worth the premium you would otherwise pay; check sum insured, room-rent limits and whether parents can be added."] },
        { label: "Group term life cover", paragraphs: ["Often a multiple of CTC. It ends when you leave, so keep your own term policy too."] },
        { label: "Meal cards and food benefits", paragraphs: ["Treated differently in each regime; useful as spending, with tax treatment set by the rules for perquisites."] },
        { label: "Employee stock options", paragraphs: ["Valuable only if the company does well and you stay through vesting. Exercise creates a taxable perquisite."] },
        { label: "Learning budgets and certifications", paragraphs: ["Useful for careers; sometimes tied to a bond that requires repayment if you leave early. Read the terms."] },
        { label: "Relocation and joining bonuses", paragraphs: ["Taxable as salary; often recoverable if you leave within a set period."] },
      ],
    },
    {
      title: "Salary in different kinds of work",
      paragraphs: ["Take-home works differently depending on how you are engaged."],
      sections: [
        { label: "Permanent employee", paragraphs: ["Full PF, gratuity after five years, leave, and TDS on salary."] },
        { label: "Fixed-term employee", paragraphs: ["Same wages and benefits as permanent staff doing similar work under the labour codes, with gratuity after one year."] },
        { label: "Contract staff through an agency", paragraphs: ["The agency is the employer for PF and payroll; check that it deposits PF under your UAN. The principal employer has responsibilities if the agency defaults."] },
        { label: "Consultant or freelancer", paragraphs: ["No PF or gratuity; clients may deduct TDS on fees; you are responsible for advance tax and your own retirement savings, such as PPF and NPS."] },
        { label: "Gig and platform work", paragraphs: ["The Code on Social Security provides for social security schemes for gig and platform workers, funded partly by platforms. Registration on the government portal is the starting point."] },
      ],
    },
    {
      title: "A salary health check",
      paragraphs: ["Once a year, take thirty minutes to review the whole picture."],
      sections: [
        {
          steps: [
            "Download the PF passbook and confirm every month's contribution from both sides.",
            "Check the PF wage basis and the effect of the new ceiling.",
            "Compare the tax regime choice with this year's deductions.",
            "Review VPF and employer NPS against your retirement plan.",
            "Note your gratuity eligibility date and current entitlement.",
            "Check nominees on EPFO, NPS, insurance and bank accounts.",
            "Update your budget with the current take-home, not last year's.",
          ],
        },
      ],
    },
    {
      title: "How a raise flows to take-home",
      paragraphs: [
        "A raise in CTC does not reach take-home one for one. Part goes to PF if your basic rises, part to tax at your marginal rate, and sometimes part to gratuity provision.",
      ],
      sections: [
        {
          table: {
            caption: "A 10 percent raise at different CTCs, basic 50 percent, PF capped, new regime.",
            headers: ["CTC before", "CTC after", "Monthly take-home before", "After", "Share of raise kept"],
            rows: [800000, 1200000, 1600000, 2400000, 3600000].map((c) => {
              const a = takeHome({ ctc: c });
              const b = takeHome({ ctc: c * 1.1 });
              return [inr(c), inr(c * 1.1), inr(a.monthly), inr(b.monthly), `${Math.round(((b.net - a.net) / (c * 0.1)) * 100)}%`];
            }),
          },
          paragraphs: [
            "At lower salaries, where the rebate keeps tax at zero, almost all of a raise reaches take-home, minus PF and gratuity effects. Near the Rs. 12.75 lakh line, marginal relief takes a large bite of the raise. At higher salaries, about 70 percent or less of each extra rupee survives tax and contributions.",
            "When negotiating, compare offers on take-home and on retirement contributions, not on CTC percentages alone.",
          ],
        },
      ],
    },
    {
      title: "When the employer gets PF wrong",
      paragraphs: [
        "Most employers handle PF correctly. When they do not, the employee is usually the one who notices first, through the passbook.",
      ],
      sections: [
        {
          heading: "Common problems",
          bullets: [
            "Contributions deducted from salary but not deposited with EPFO.",
            "Contributions deposited late, sometimes months later.",
            "Wrong wage base, such as PF on a lower amount than agreed.",
            "Exit date not marked, blocking transfers.",
            "Name, date of birth or bank details not matching.",
            "A new UAN created instead of linking your existing one.",
          ],
        },
        {
          heading: "What to do",
          steps: [
            "Check your passbook every few months; it shows each month's deposit and the date it was credited.",
            "Raise discrepancies with HR in writing, with payslips showing the deduction.",
            "If unresolved, file a grievance on EPFO's online grievance system, EPFiGMS, with your UAN and evidence.",
            "If you have two UANs, ask EPFO to merge them; keep one for life.",
          ],
          note: "An employer deducting PF and not depositing it is a serious violation. EPFO can recover dues with interest and damages. Payslips are your evidence: keep them.",
        },
      ],
    },
    {
      title: "Salary for a household budget",
      paragraphs: [
        "Take-home is the starting line of a household budget. A simple split helps most people plan without detailed tracking.",
      ],
      sections: [
        {
          heading: "A three-part split",
          paragraphs: [
            "A common guide is roughly half of take-home for needs (rent or EMI, groceries, utilities, transport, insurance, school fees), up to a third for wants (eating out, travel, shopping, subscriptions), and at least a fifth for savings and debt repayment beyond the minimum. These are guides, not rules. In expensive cities, needs often take more.",
            `On a take-home of ${Rs(A.monthly)} a month from the Rs. 12 lakh example, that is about ${Rs(A.monthly * 0.5)} for needs, ${Rs(A.monthly * 0.3)} for wants and ${Rs(A.monthly * 0.2)} for savings. PF is already saving for you on top of this, which is worth remembering when the savings line feels small.`,
          ],
        },
        {
          heading: "Pay yourself first",
          paragraphs: [
            "Set SIPs, recurring deposits and VPF to go out within days of salary day, before spending begins. Whatever is left is free to spend. Saving what is left at the end of the month rarely works as well.",
          ],
        },
        {
          heading: "When take-home falls",
          paragraphs: [
            "Restructuring under the labour codes, a higher PF ceiling or a regime change can lower take-home without any change in your work. Adjust the wants line first, keep savings steady if possible, and remember that the money moved into PF is still yours.",
          ],
        },
      ],
    },
    {
      title: "Planning retirement from your salary",
      paragraphs: [
        "PF and gratuity do a lot of retirement saving without any decision from you. Seeing how much helps you decide what else to add.",
      ],
      sections: [
        {
          heading: "What PF alone can build",
          paragraphs: [
            `A 25-year-old with a basic of Rs. 30,000, rising 6 percent a year, with PF on full basic at 8.25 percent, could build about ${Rs(epf(30000, 33, 8.25, 6, 0, CEIL, true).bal)} by 58, before EPS. With PF capped at the ceiling instead, the same career builds about ${Rs(epf(30000, 33, 8.25, 6, 0, CEIL, false).bal)}.`,
            "Those are large sums in rupees but must be read in future money. At 6 percent inflation over 33 years, prices rise about sevenfold. PF is a strong foundation, not usually the whole retirement.",
          ],
          table: {
            caption: "EPF at 58 by starting basic and PF basis. 8.25 percent interest, 6 percent yearly raises, start at 25. Excludes EPS.",
            headers: ["Starting basic", "PF on ceiling", "PF on full basic"],
            rows: [20000, 30000, 50000, 80000].map((b) => [inr(b), inr(epf(b, 33, 8.25, 6, 0, CEIL, false).bal), inr(epf(b, 33, 8.25, 6, 0, CEIL, true).bal)]),
          },
        },
        {
          heading: "Filling the gap",
          paragraphs: [
            "If PF and gratuity will not cover the retirement you want, add VPF for more safe saving, employer NPS for tax-efficient market-linked saving, PPF for tax-free saving outside the employer, and equity mutual funds for growth. The other books in this series cover each in detail.",
          ],
        },
        {
          heading: "Do not break the foundation",
          paragraphs: [
            "The most common way people weaken their retirement is by withdrawing PF on job changes. Each withdrawal resets the clock and loses decades of compounding. Transfer every time.",
          ],
        },
      ],
    },
    {
      title: "Leave, attendance and pay",
      paragraphs: [
        "Leave policies affect take-home in ways people often discover only on exit.",
      ],
      sections: [
        { label: "Earned or privilege leave", paragraphs: ["Accrues with service. Under the labour codes, workers can carry forward and encash leave within limits. Encashment on resignation is taxable; on retirement, exempt within limits."] },
        { label: "Sick and casual leave", paragraphs: ["Usually not encashable. Check whether unused leave lapses at year end."] },
        { label: "Loss of pay", paragraphs: ["Days of unpaid leave reduce salary by a daily rate, typically monthly salary divided by the days in the month or by 30. Check which divisor your employer uses."] },
        { label: "Maternity and paternity leave", paragraphs: ["Maternity benefit allows up to 26 weeks of paid leave for eligible women in covered establishments. Paternity leave depends on employer policy outside government rules."] },
        { label: "Notice period", paragraphs: ["Unserved notice may be recovered from the final settlement at the basic or gross rate, as the contract says. Leave balance can sometimes be adjusted against notice."] },
      ],
    },
    {
      title: "Questions to ask before accepting an offer",
      paragraphs: ["Take this list to the HR conversation."],
      sections: [
        {
          steps: [
            "What is the full salary structure, line by line?",
            "Is PF calculated on the ceiling or on full basic? Is employer PF inside CTC?",
            "Is gratuity provision inside CTC? Is the role permanent or fixed-term?",
            "How much variable pay was actually paid in each of the last three years?",
            "Is employer NPS available, and at what percentage?",
            "What health and life cover is provided, for whom, and with what limits?",
            "What is the notice period, and can leave be adjusted against it?",
            "Are there joining or relocation bonuses with clawback conditions?",
            "When is the first salary paid, and when is the annual increment cycle?",
          ],
        },
      ],
    },
    {
      title: "Myths about salary and PF",
      paragraphs: ["Beliefs that lead to poor decisions, and what is actually true."],
      sections: [
        { label: "Myth: CTC is what I earn.", paragraphs: ["CTC includes employer PF, gratuity provision and benefits that never reach your account monthly. Budget from take-home."] },
        { label: "Myth: PF is the employer's money.", paragraphs: ["Both shares, with interest, belong to you, subject to the scheme's rules. The EPS part funds your pension."] },
        { label: "Myth: Withdrawing PF on a job change is free money.", paragraphs: ["It is your retirement savings; early withdrawal can be taxed and ends compounding."] },
        { label: "Myth: Gratuity is paid every year.", paragraphs: ["It is paid only on leaving after qualifying service. The CTC figure is a provision."] },
        { label: "Myth: A higher basic means a higher salary.", paragraphs: ["Within the same CTC, it means more PF and gratuity and less take-home."] },
        { label: "Myth: The PF ceiling change cuts my salary.", paragraphs: ["It moves more of your salary into PF, which remains yours, and raises the employer's contribution too."] },
        { label: "Myth: Fixed-term workers never get gratuity.", paragraphs: ["Under the labour codes they qualify after one year."] },
        { label: "Myth: Bonus is taxed at a special higher rate.", paragraphs: ["It is taxed at your normal slab rates; TDS in the month of payment can just look high."] },
      ],
    },
    {
      title: "A worked year of payslips",
      paragraphs: [
        "To see how changes through a year show up, here is one illustrative employee's year. Kavitha in Hyderabad has a Rs. 18 lakh CTC, basic 50 percent, PF on the ceiling, new regime, professional tax of Rs. 200 a month.",
      ],
      sections: [
        {
          table: {
            caption: "Selected months. Figures rounded; tax spread evenly except where noted.",
            headers: ["Month", "Event", "Employee PF", "Effect on take-home"],
            widths: [0.8, 2.2, 1, 1.6],
            rows: [
              ["April", "New year; regime declared as new", "1,800", "Normal month"],
              ["July", "Increment of 8 percent from July", "1,800", "Take-home rises; arrears none"],
              ["September", "PF ceiling rises from the 17th", "1,800 then 3,000", "Pro-rated rise in PF for part of the month"],
              ["October", "First full month at new ceiling", "3,000", "Take-home falls by about Rs. 1,200"],
              ["December", "Annual bonus paid", "3,000", "Large TDS this month"],
              ["February", "Proofs window (not needed in new regime)", "3,000", "No change"],
              ["March", "Final tax adjustment", "3,000", "TDS trued up to the year's tax"],
            ],
          },
          paragraphs: [
            "No single month tells the whole story. The increment, the ceiling change and the bonus each moved take-home in a different direction. Looking at year-to-date figures in March, Kavitha could see her PF account had grown faster than in any previous year, while total take-home rose roughly in line with her increment after tax.",
          ],
        },
      ],
    },
    {
      title: "Keeping your salary records",
      paragraphs: ["Salary records are needed for loans, visas, tax, PF and disputes, sometimes years later. A simple system keeps them findable."],
      sections: [
        {
          bullets: [
            "Offer letter and every revision letter.",
            "All payslips, monthly, in one folder per year.",
            "Form 16 for every employer and year.",
            "PF passbook downloads, twice a year.",
            "Relieving letter and full and final settlement statement from each employer.",
            "Gratuity and leave encashment calculations on exit.",
            "Any loan or advance agreements with employers.",
          ],
          paragraphs: [
            "Scan paper copies and keep them in two places, such as a cloud folder and an external drive. Name files by date and employer so they sort themselves. Background checks for a new job, a home-loan application and an EPFO grievance all ask for these documents, and having them ready saves weeks.",
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Eighteen employees reading offers, payslips and PF passbooks. Take-home figures use the new tax regime unless stated, professional tax of Rs. 2,400 where the state levies it, and the Rs. 25,000 PF ceiling.",

  scenarios: [
    {
      title: "A first offer of Rs. 6 lakh",
      paragraphs: [
        (() => {
          const t = takeHome({ ctc: 600000, pt: 0 });
          return `Ritika in Ranchi received her first offer: Rs. 6 lakh CTC, basic 50 percent. With PF on the ceiling, monthly basic is ${Rs(t.basicM)} and her PF is ${Rs(t.pfM)} a month. Income tax is ${Rs(t.tax)} in the new regime. Take-home is about ${Rs(t.monthly)} a month.`;
        })(),
        "She had expected Rs. 50,000 a month, since six lakh divided by twelve is fifty thousand. The difference was employer PF and gratuity inside CTC, and her own PF.",
        "She opened her UAN account online in the first week, linked Aadhaar and her bank account, and set her nominee. She also started a small SIP with the first salary, sized on the actual take-home, not the CTC.",
        "Her manager suggested she ask HR for the full salary structure on day one, which lists every component of CTC. It became the document she used to understand each payslip that followed."
      ],
      lesson: "CTC divided by twelve is not take-home. Budget from the payslip.",
    },
    {
      title: "Restructured for the labour codes",
      paragraphs: [
        (() => {
          const before = takeHome({ ctc: 1500000, basicPct: 35, pf: "full" });
          const after = takeHome({ ctc: 1500000, basicPct: 50, pf: "full" });
          return `Sanjay in Gurugram had a Rs. 15 lakh CTC with basic at 35 percent and PF on full basic. After his employer restructured to meet the labour codes' 50 percent wage rule, basic rose to 50 percent. His PF rose from ${Rs(before.pfM)} to ${Rs(after.pfM)} a month, and take-home fell from about ${Rs(before.monthly)} to ${Rs(after.monthly)}.`;
        })(),
        "He was annoyed until he looked at the other side: his employer's PF share rose by the same amount, and his gratuity entitlement rose because it is calculated on wages. His yearly retirement saving went up by more than his take-home went down.",
        "He adjusted his budget, reduced a voluntary SIP slightly since PF now did more of the retirement saving, and checked that the new structure appeared correctly in his PF passbook.",
        "He also asked HR whether the restructuring changed his gratuity calculation retrospectively. It did not: gratuity is computed on last drawn wages at exit, so the higher wages would count for his whole service if he stayed."
      ],
      lesson: "Higher basic under the labour codes lowers take-home but raises PF and gratuity. Look at both lines.",
    },
    {
      title: "The ceiling rises mid-year",
      paragraphs: [
        "Priya in Chennai earns a basic of Rs. 22,000 a month, and her employer calculated PF on the old Rs. 15,000 ceiling: Rs. 1,800 a month from each side.",
        "From 17 September 2026, the ceiling became Rs. 25,000. Since her basic is below the new ceiling, PF is now 12 percent of her full basic, Rs. 2,640 a month from each side. Her take-home fell by Rs. 840 a month.",
        "Her employer's share rose by the same Rs. 840, part of it to EPS and part to EPF. Over a year, her PF account receives about Rs. 10,000 more from her and somewhat more from the employer. She noted the change on her October payslip and checked the passbook in November.",
        "Her employer also stopped recording the old ceiling in its payroll settings the same week, which she confirmed by looking at the PF line on her October payslip rather than assuming the change had been made."
      ],
      lesson: "The higher PF ceiling raises contributions for many employees. Take-home dips; savings rise.",
    },
    {
      title: "Withdrawing PF on changing jobs",
      paragraphs: [
        "Aman in Hyderabad changed jobs after three years and withdrew his Rs. 2.8 lakh PF balance to fund a holiday and a new phone.",
        "Because his service was under five years, the withdrawal was taxable, and TDS was deducted. He also lost the compounding on that balance. Had he left it at 8.25 percent for 30 years, it would have grown to about Rs. 30 lakh.",
        "His new employer's HR explained that transferring the balance under his UAN would have kept his service continuous and the money tax-free. For his next change he plans a transfer, not a withdrawal.",
        "He now keeps a note of his UAN and EPFO password in his password manager, and checks the passbook after every job change to confirm the transfer reached the right account."
      ],
      lesson: "Transfer PF on changing jobs. A withdrawal before five years can be taxed and ends decades of compounding.",
    },
    {
      title: "A mismatch that blocked a claim",
      paragraphs: [
        "Mrs Fernandes in Mangaluru tried to withdraw part of her PF for her daughter's wedding. The claim was rejected because her date of birth in EPFO records differed from her Aadhaar by a year.",
        "She submitted a joint declaration with her employer to correct the date, with supporting documents. The correction took several weeks, and she had to borrow briefly for the wedding expenses.",
        "She now advises colleagues to check their PF records against Aadhaar and PAN once, early, when nothing is urgent.",
        "She also updated her bank account details on the portal, since an old account linked to the UAN would have caused the next claim to fail as well."
      ],
      lesson: "Fix name and date-of-birth mismatches in PF records before you need a claim.",
    },
    {
      title: "Gratuity after four years and seven months",
      paragraphs: [
        "Kiran in Pune had worked four years and seven months when offered a new job. A friend told him he would get no gratuity before five years.",
        "He checked: for continuous service, the law counts four years and 240 working days in the fifth year as qualifying in many cases, and service of more than six months in the final year counts as a full year in the formula. He confirmed with HR how his employer applied the rule.",
        `His employer agreed he qualified for five years' gratuity on his last basic of Rs. 60,000: about ${Rs(gratuity(60000, 5))}. He timed his notice period so his last day fell after the threshold.`,
        "He also learned that the notice period counted towards service, so serving the full notice rather than buying it out made the difference between qualifying and not."
      ],
      lesson: "Gratuity eligibility near five years depends on days worked. Check before resigning.",
    },
    {
      title: "Fixed-term contract and gratuity",
      paragraphs: [
        "Aisha in Bengaluru joined a project on a two-year fixed-term contract in January 2026. Under the labour codes, fixed-term employees become eligible for gratuity after one year, pro rata.",
        `At the end of her two-year contract, with last wages of Rs. 70,000, she would receive about ${Rs(gratuity(70000, 2))}.`,
        "Her contract letter did not mention gratuity. She asked HR to confirm in writing how it would be calculated, and noted it in her personal records along with the contract's end date.",
        "She also noted that if the contract were renewed, her service would continue to count, and gratuity would be calculated on her last wages at the final exit.",
        "She shared the clarification with two colleagues on similar contracts, who had assumed fixed-term work never carried gratuity."
      ],
      lesson: "Fixed-term employees now qualify for gratuity after a year. Ask for it in writing.",
    },
    {
      title: "Old regime with HRA in a new city",
      paragraphs: [
        (() => {
          const n = takeHome({ ctc: 2000000, regime: "new" });
          const o = takeHome({ ctc: 2000000, regime: "old", ded: 300000 });
          return `Rahul in Ahmedabad has a Rs. 20 lakh CTC and pays high rent. With Ahmedabad now in the eight-city HRA list, his exempt HRA and other deductions total about Rs. 3 lakh besides PF. Take-home in the new regime: about ${Rs(n.monthly)} a month; in the old: about ${Rs(o.monthly)}.`;
        })(),
        "He chose the old regime with his employer and submitted rent receipts and his landlord's PAN.",
        "He also set a reminder to compare again when he buys a home, since HRA will then end.",
        "He also kept a copy of the rental agreement, since his landlord changed in the middle of the year and both landlords' PANs had to be submitted for their respective months."
      ],
      lesson: "HRA in one of the eight cities can make the old regime worthwhile. Compare take-home both ways.",
    },
    {
      title: "Variable pay that did not arrive",
      paragraphs: [
        "Meena in Mumbai accepted a Rs. 24 lakh CTC including Rs. 4 lakh of variable pay, and budgeted on Rs. 2 lakh a month.",
        "In her first year, the company paid 60 percent of variable. Her actual cash income was Rs. 1.6 lakh lower than budgeted, and her EMI and rent had been set on the higher figure.",
        "She rebuilt her budget on fixed pay alone and now treats any variable as a lumpsum for savings or debt repayment. When negotiating her next offer, she asked how much variable had been paid in each of the last three years.",
        "Her next offer letter, from another company, stated the variable component separately with its payout history, and she compared offers only on the fixed portion."
      ],
      lesson: "Budget on fixed pay. Treat variable pay as a bonus when it arrives.",
    },
    {
      title: "VPF to build retirement savings",
      paragraphs: [
        "Sunil, 40, in Nagpur realised his retirement savings were behind. His employee PF was Rs. 3,000 a month on the ceiling.",
        "He asked HR to deduct an extra Rs. 10,000 a month as VPF. It earns the EPF rate, tax-free within the Rs. 2.5 lakh contribution limit, and is deducted before he sees it.",
        `Over 18 years at 8.25 percent, Rs. 10,000 a month grows to about ${Rs(epf(0, 0).bal + (() => { let b = 0; for (let m = 0; m < 216; m++) b = (b + 10000) * (1 + 8.25 / 1200); return b; })())}. He accepted the lower take-home as the price of catching up.`,
        "He reviews the VPF amount every April against the Rs. 2.5 lakh limit, since salary increases raise his compulsory PF and leave less room for VPF.",
        "He also counted his EPS pension and PPF in the retirement plan, so the VPF figure was set against a clear gap rather than a guess."
      ],
      lesson: "VPF is a simple way to raise safe retirement savings through payroll, within the tax-free limit.",
    },
    {
      title: "Employer NPS in the new regime",
      paragraphs: [
        (() => {
          const base = takeHome({ ctc: 2500000 });
          const nps = takeHome({ ctc: 2500000, employerNps: 2500000 * 0.5 * 0.14 });
          return `Divya in Hyderabad, on a Rs. 25 lakh CTC with basic at 50 percent, opted for employer NPS of 14 percent of basic, the maximum deductible in the new regime: ${Rs(2500000 * 0.5 * 0.14)} a year. Her monthly take-home fell from about ${Rs(base.monthly)} to ${Rs(nps.monthly)}, while her tax fell by ${Rs(base.tax - nps.tax)} a year.`;
        })(),
        "The NPS money is locked until 60 under NPS rules, but she was saving for retirement anyway. Moving part of it through employer NPS cut her tax.",
        "She chose an auto life-cycle fund and set a yearly reminder to check its allocation.",
        "She also learned that if she changes employers, her NPS account goes with her; the new employer can contribute to the same account if it offers corporate NPS."
      ],
      lesson: "Employer NPS is one of the few tax savers in the new regime. Use it for money you would save for retirement anyway.",
    },
    {
      title: "Professional tax across states",
      paragraphs: [
        "Arjun moved from Bengaluru to Delhi with the same employer. His payslip stopped showing professional tax, because Delhi does not levy it.",
        "In Karnataka he had paid Rs. 200 a month. The change raised his take-home slightly. In the old regime, professional tax is deductible; in the new regime, which he uses, it is not, so the saving was the full amount.",
        "A colleague moving to Maharashtra saw the opposite. Professional tax is a state matter, and the payslip follows the state where you work.",
        "He also confirmed that his previous employer had issued Form 16 for the months in Bengaluru, showing the professional tax deducted there.",
        "Because he uses the new regime, the professional tax he had paid in Karnataka earned no deduction; it was simply a cost of working there."
      ],
      lesson: "Professional tax depends on the state you work in. Check after a transfer.",
    },
    {
      title: "Gratuity provision in CTC",
      paragraphs: [
        `Leela in Thiruvananthapuram saw ${Rs(takeHome({ ctc: 960000 }).gratY)} of gratuity in her Rs. 9.6 lakh CTC and asked why it never appeared in her salary.`,
        "Gratuity is paid only when you leave after qualifying service. The amount in CTC is the employer's yearly provision, 4.81 percent of basic. If she leaves before qualifying, she will not receive it.",
        "She now compares offers in two parts: what she gets monthly, and what she builds in PF and gratuity if she stays. A job she might leave in two years is worth less than its CTC suggests.",
        "She also asked whether her company paid gratuity through an insurer-managed fund, which protects the money even if the company itself runs into difficulty. It did."
      ],
      lesson: "Gratuity in CTC is a promise, not monthly pay. It counts only if you stay long enough.",
    },
    {
      title: "Two employers' PF accounts merged",
      paragraphs: [
        "Ravi in Indore had three member IDs under one UAN from three employers. The first employer had not marked his exit date, which blocked the transfer of that balance.",
        "He asked the old employer to update the exit date. When it did not respond, he used the portal's facility to mark the exit himself, which is allowed after a set period with Aadhaar-based verification.",
        "He then transferred both older balances to his current account and checked the passbook to confirm the service period was carried over.",
        "He found two more old member IDs that he had forgotten, from internships. They had small balances, which he also transferred, ending with a single consolidated history."
      ],
      lesson: "Missing exit dates block transfers. Check each past employer has marked yours, or mark it yourself on the portal.",
    },
    {
      title: "Salary advance and loan recovery",
      paragraphs: [
        "Mohan in Coimbatore took a Rs. 60,000 salary advance from his employer for a family emergency, repaid over six months by deduction.",
        "His payslip showed Rs. 10,000 a month as 'loan recovery'. Interest-free loans from employers above a small threshold can create a taxable perquisite, valued at the interest saved compared with a bank's rate.",
        "For his small, short loan the perquisite was minor; for a larger loan it would have shown in Form 16. He kept the loan letter and repayment schedule in his tax folder.",
        "He also asked HR whether the advance could be treated as a loan from a welfare fund instead, which some employers run for staff emergencies at low cost."
      ],
      lesson: "Employer loans and advances appear as recoveries on payslips and can create a small taxable perquisite.",
    },
    {
      title: "Notice period and final settlement",
      paragraphs: [
        "Shalini in Kolkata resigned and served her notice. Her full and final settlement included salary for the last month, leave encashment, gratuity and a deduction for a laptop not returned on time.",
        "She checked each line: leave days against her records, gratuity against the formula, and the laptop deduction against the policy. She returned the laptop and the deduction was reversed.",
        "Under the labour codes, wages on separation are to be paid within two working days of the last day. Her employer paid within a week, after the laptop issue was resolved, and issued Form 16 for her months with them.",
        "She also confirmed that her new employer had received her previous salary details on Form 12B, so the new TDS would account for the whole year."
      ],
      lesson: "Check every line of the final settlement against your records and the policy before accepting it.",
    },
    {
      title: "An intern's stipend",
      paragraphs: [
        "Nikhil, a final-year student in Bhopal, received a Rs. 25,000 monthly stipend for six months. No PF was deducted, because interns are often not employees for PF purposes.",
        "His income for the year, Rs. 1.5 lakh, was below the taxable limit. He still filed a return, partly because the company had deducted TDS on one payment by mistake and he wanted the refund.",
        "When he joined as a full-time employee, a new UAN was created, and he made sure it was the only one in his name.",
        "He also set up his DigiLocker account to store the internship certificate and payslips, which a later employer asked for during background verification."
      ],
      lesson: "Internship pay may have no PF. File a return to recover any TDS and keep one UAN for life.",
    },
    {
      title: "EPS pension estimate",
      paragraphs: [
        "Mr Iyer, 52, in Chennai had been a PF member for 28 years and wanted to estimate his EPS pension at 58.",
        "The formula is pensionable salary times pensionable service divided by 70. With pensionable salary at the ceiling and 34 years of service by 58, the pension would be based on those inputs, subject to the rules applying to service before and after the ceiling changes.",
        "He requested an estimate from the EPFO portal and his employer's HR, since service before September 2014 and higher-pension options have their own rules. He planned his retirement income assuming the EPS figure was modest, with PF, PPF and savings doing most of the work.",
        "He also checked that his EPS service history was continuous across employers, since gaps or missing transfers reduce pensionable service."
      ],
      lesson: "EPS gives a modest pension by formula. Get an official estimate and plan retirement mainly from savings.",
    },
    {
      title: "PF deducted but not deposited",
      paragraphs: [
        "Zoya in Lucknow worked for a small firm for two years. Her payslips showed PF deductions every month, but her passbook showed deposits for only the first eight months.",
        "She raised it with the firm's accountant, who promised to deposit the arrears. After three months nothing had changed. She filed a grievance on EPFO's online system with her UAN and copies of payslips showing the deductions.",
        "EPFO took up the matter with the employer, which deposited the dues with interest. The process took several months. She now checks her passbook every quarter, and advised her former colleagues to do the same.",
        "Her payslips were the deciding evidence; without them, proving the deductions would have been much harder.",
      ],
      lesson: "Check your passbook regularly. Payslips are your evidence if PF is deducted but not deposited.",
    },
    {
      title: "Two UANs from two employers",
      paragraphs: [
        "Harsh in Jaipur joined his second employer and did not mention his existing UAN. The new employer created a fresh one. He now had two UANs, each with its own balance and service.",
        "Two UANs complicate transfers and can break service continuity for tax and EPS. He requested EPFO to deactivate the newer UAN and transferred its balance to the original one, with his employer's help.",
        "Since then he gives his UAN in the joining form and checks in the first month that the new member ID appears under it on the portal.",
        "The merge also restored his service continuity, which matters for tax on any future withdrawal and for the ten years of service needed for an EPS pension.",
      ],
      lesson: "Keep one UAN for life. Give it to every new employer and check the link in the first month.",
    },
    {
      title: "A raise near the rebate line",
      paragraphs: [
        (() => {
          const a = takeHome({ ctc: 1400000 });
          const b = takeHome({ ctc: 1500000 });
          return `Vinod in Mysuru received a raise from Rs. 14 lakh to Rs. 15 lakh CTC. His monthly take-home rose only from about ${Rs(a.monthly)} to ${Rs(b.monthly)}.`;
        })(),
        "His gross salary crossed the point where the rebate no longer covers tax, and marginal relief took much of the increase. Part of the raise also went to gratuity provision inside CTC.",
        "He asked HR to route part of next year's raise to employer NPS, which is deductible in the new regime, so that more of it went to his own savings rather than to tax.",
        "He reminded himself that a raise is still a raise: the extra gratuity provision and PF are his money too, just not this month's.",
      ],
      lesson: "Near the rebate line, a raise can add little to take-home. Employer NPS can redirect part of it to savings.",
    },
    {
      title: "A contract worker through an agency",
      paragraphs: [
        "Raju works as a technician at a factory in Pune through a manpower agency. His payslip comes from the agency, which deducts PF.",
        "When he checked his UAN, he found the agency had deposited PF for some months and not others. The factory, as principal employer, has responsibilities if a contractor fails to pay PF for workers it engages.",
        "He raised it with the agency and, with the help of a union representative, with the factory's HR. The arrears were deposited. He now saves every payslip on his phone and checks the passbook every quarter.",
        "He also registered his mobile number with his UAN so that he receives an SMS each time a contribution is credited, which makes missing months obvious.",
      ],
      lesson: "Contract workers have the same PF rights. Check deposits, and know that the principal employer has responsibilities too.",
    },
    {
      title: "Maternity leave and take-home",
      paragraphs: [
        "Ananya in Bengaluru planned 26 weeks of maternity leave. Under the maternity benefit provisions, eligible women in covered establishments receive full average daily wages for the leave period.",
        "Her employer paid her salary as usual during the leave. PF continued on the wages paid. Her variable pay for the year was prorated under company policy, which she checked in writing before the leave began.",
        "She also planned her tax: with salary unchanged and variable lower, her TDS fell slightly. She used the leave months to review insurance and nominees, adding her newborn to the employer's group health policy within the allowed window.",
        "On return, she asked about the creche facility that establishments above a certain size must provide, and about work-from-home options the law allows by agreement.",
      ],
      lesson: "Check maternity pay, variable-pay treatment and insurance additions in writing before the leave starts.",
    },
    {
      title: "Moving from a startup to a large company",
      paragraphs: [
        "Rohit in Pune moved from a startup paying Rs. 22 lakh with no PF and large allowances to a large firm offering Rs. 24 lakh with PF on full basic and basic at 50 percent.",
        (() => {
          const a = takeHome({ ctc: 2200000, basicPct: 40, pf: "none", grat: false });
          const b = takeHome({ ctc: 2400000, basicPct: 50, pf: "full" });
          return `His monthly take-home went from about ${Rs(a.monthly)} to ${Rs(b.monthly)}, almost unchanged despite the higher CTC, because PF and gratuity now took a share. His yearly retirement saving through PF rose from nothing to about ${Rs(b.pfM * 24)}.`;
        })(),
        "He had been investing on his own at the startup. With PF now doing much of the safe saving, he moved his own SIPs further towards equity and stopped a recurring deposit he had used as a substitute for PF.",
      ],
      lesson: "Moving into a PF-covered job can leave take-home flat while retirement savings jump. Rebalance your own savings around it.",
    },
    {
      title: "An NRI returning to work in India",
      paragraphs: [
        "Suresh returned to Chennai after eight years in the Gulf and joined an Indian company. His old UAN from before he left was still active, with a balance that had kept earning interest for some years.",
        "He gave the UAN to his new employer, updated his KYC with his current address and bank account, and checked that interest had been credited. Accounts can become inoperative after long periods without contributions under EPFO's rules, which affects interest.",
        "He also started VPF to rebuild retirement savings faster, since his Gulf employment had no Indian PF.",
        "He also checked his tax residency for the year of return, since the number of days in India decides whether his foreign income for that year is taxable in India, and kept his foreign salary records for the return.",
      ],
      lesson: "An old UAN can be revived on return. Update KYC and check interest on long-idle balances.",
    },
    {
      title: "A gig worker registers",
      paragraphs: [
        "Imran delivers food in Lucknow through two platforms. He has no employer PF or gratuity, and his income varies week to week.",
        "The Code on Social Security provides for social security schemes for gig and platform workers, with platforms contributing to a fund. He registered on the government's portal for unorganised and platform workers, which is the first step to accessing such schemes as they are notified.",
        "Meanwhile he opened a PPF account and an NPS account with small, flexible contributions, and kept a term insurance policy and a basic health policy. His savings are smaller than a salaried worker's PF, but they are his and portable across platforms.",
        "He keeps a simple notebook of weekly earnings and platform payouts, which helps him budget in slow weeks and will support any future benefit application.",
      ],
      lesson: "Gig workers should register for social security schemes and build their own portable savings meanwhile.",
    },
    {
      title: "A government employee's DA increase",
      paragraphs: [
        "Shanthi, a central government employee in Chennai, received a DA increase announced in October with effect from July, paid with arrears for three months.",
        "Because DA counts with basic for PF-type contributions and HRA, her HRA and deductions changed too. The arrears were taxed in the month paid. Her NPS contribution, as a government employee under NPS, rose with basic plus DA.",
        "She checked the arrears calculation on her payslip against the order, and filed the relief form for arrears when it would reduce tax, which in her case it did not because her slab did not change.",
        "She also noted the revised HRA in her old-regime calculation, since a higher salary base changes both the HRA received and the 10 percent of salary subtracted from rent.",
      ],
      lesson: "DA changes ripple through HRA, pension contributions and tax. Check arrears against the official order.",
    },
    {
      title: "Reading the passbook after a promotion",
      paragraphs: [
        "Deepak in Kochi was promoted in January with a large raise. His payslip showed higher PF from February, since his employer contributes on full basic.",
        "In June he downloaded his passbook and found the February to April contributions still at the old amount. His employer had updated payroll but not the PF wage in the monthly return.",
        "HR corrected the returns and deposited the difference with interest. Deepak now compares the PF line on his payslip with the passbook entry for the same month after every change in pay, because small mismatches are easiest to fix early.",
        "The correction also raised his EPS service record and the interest credited for the year, which would otherwise have been lower without anyone noticing.",
      ],
      lesson: "After any pay change, compare the payslip's PF line with the passbook for the same months.",
    },
  ],

  problemIntro: "Use the take-home method in the first chapter, the site's in-hand salary calculator, or the formulas shown. New regime and Rs. 25,000 PF ceiling unless stated.",

  problems: [
    ...[[800000, 50], [1500000, 40], [2000000, 50], [3000000, 45]].map(([ctc, bp]) => {
      const t = takeHome({ ctc, basicPct: bp });
      return {
        title: `Take-home on Rs. ${ctc / 100000} lakh CTC`,
        q: [`CTC Rs. ${inr(ctc)}, basic ${bp} percent, PF on the ceiling, professional tax Rs. 2,400, new regime. Monthly take-home?`],
        steps: [`Monthly basic = ${inr(t.basicM)}.`, `PF each side = ${inr(t.pfM)} a month.`, `Gratuity provision = ${inr(t.gratY)} a year.`, `Gross = ${inr(t.gross)}.`, `Tax = ${inr(t.tax)}.`],
        answer: `About ${Rs(t.monthly)} a month.`,
      };
    }),
    {
      title: "PF on full basic",
      q: ["CTC Rs. 15 lakh, basic 50 percent. Compare take-home with PF on the ceiling and on full basic."],
      steps: [`Ceiling: ${Rs(takeHome({ ctc: 1500000 }).monthly)}.`, `Full: ${Rs(takeHome({ ctc: 1500000, pf: "full" }).monthly)}.`],
      answer: `Full-basic PF lowers take-home by about ${Rs(takeHome({ ctc: 1500000 }).monthly - takeHome({ ctc: 1500000, pf: "full" }).monthly)} a month and adds the same, from each side, to PF.`,
    },
    {
      title: "PF at the new ceiling",
      q: ["Basic Rs. 40,000 a month. Employee PF on the ceiling before and after 17 September 2026?"],
      steps: ["Before: 12% of 15,000 = 1,800.", "After: 12% of 25,000 = 3,000."],
      answer: "Rs. 1,800 before and Rs. 3,000 after, a rise of Rs. 1,200 a month, matched by the employer.",
    },
    {
      title: "EPS share",
      q: ["Basic Rs. 40,000, PF on full basic. How is the employer's 12 percent split?"],
      steps: ["Employer total = 4,800.", "EPS = 8.33% of 25,000 ≈ 2,083.", "EPF = 4,800 − 2,083."],
      answer: "About Rs. 2,083 to EPS and Rs. 2,717 to EPF.",
    },
    {
      title: "Gratuity",
      q: ["Last wages Rs. 65,000; service 12 years 8 months. Gratuity?"],
      steps: ["Years counted: 13, since the part-year exceeds six months.", "65,000 × 15 ÷ 26 × 13."],
      answer: `${Rs(gratuity(65000, 13))}.`,
    },
    {
      title: "Gratuity cap",
      q: ["Last wages Rs. 2.5 lakh; 25 years of service. Gratuity under the formula and under the cap?"],
      steps: [`Formula: ${inr(gratuity(250000, 25))}.`, "Statutory maximum: Rs. 20 lakh."],
      answer: `Formula gives ${Rs(gratuity(250000, 25))}; the statutory maximum is Rs. 20 lakh. Any amount the employer pays above that under its own scheme is taxable.`,
    },
    {
      title: "Fixed-term gratuity",
      q: ["A fixed-term employee with wages of Rs. 45,000 completes 1 year 9 months. Gratuity?"],
      steps: ["Eligible after 1 year.", "Years counted: 2 (more than six months in the final year).", "45,000 × 15 ÷ 26 × 2."],
      answer: `${Rs(gratuity(45000, 2))}.`,
    },
    {
      title: "50 percent wage rule",
      q: ["Total remuneration Rs. 1 lakh a month: basic Rs. 35,000, allowances Rs. 65,000. Under the 50 percent rule, what are wages for gratuity?"],
      steps: ["Allowances above 50% = 65,000 − 50,000 = 15,000.", "Add back: 35,000 + 15,000."],
      answer: "Rs. 50,000 a month.",
    },
    {
      title: "PF balance projection",
      q: ["Basic Rs. 40,000, rising 6 percent a year; PF on full basic; 25 years at 8.25 percent; starting balance zero. Estimate the EPF balance (excluding EPS)."],
      steps: ["Each month: employee 12% plus employer 12% minus EPS; interest monthly on the running balance, credited yearly."],
      answer: `About ${Rs(epf(40000, 25, 8.25, 6, 0, CEIL, true).bal)}.`,
    },
    {
      title: "Cost of withdrawing PF",
      q: ["Rs. 3 lakh withdrawn at 30 instead of left to 58 at 8.25 percent. What is given up?"],
      steps: ["3,00,000 × 1.0825^28."],
      answer: `About ${Rs(300000 * Math.pow(1.0825, 28))} at 58.`,
    },
    {
      title: "VPF and the Rs. 2.5 lakh limit",
      q: ["Your PF is Rs. 6,000 a month. How much VPF a month keeps your total contributions at Rs. 2.5 lakh a year?"],
      steps: ["Yearly PF = 72,000.", "Room = 1,78,000.", "÷ 12."],
      answer: "About Rs. 14,833 a month.",
    },
    {
      title: "Employer NPS tax saving",
      q: ["CTC Rs. 20 lakh, basic 50 percent. Employer NPS at 10 percent of basic. Tax saving in the new regime?"],
      steps: [`Without: tax ${inr(takeHome({ ctc: 2000000 }).tax)}.`, `With NPS of ${inr(100000)}: tax ${inr(takeHome({ ctc: 2000000, employerNps: 100000 }).tax)}.`],
      answer: `${Rs(takeHome({ ctc: 2000000 }).tax - takeHome({ ctc: 2000000, employerNps: 100000 }).tax)} a year.`,
    },
    {
      title: "Professional tax effect",
      q: ["Moving from a state with Rs. 2,500 professional tax to one with none, in the new regime. Change in yearly take-home?"],
      steps: ["Professional tax is not deductible in the new regime, so the full Rs. 2,500 returns to take-home."],
      answer: "Rs. 2,500 more a year, about Rs. 208 a month.",
    },
    {
      title: "Variable pay in a budget",
      q: ["CTC Rs. 20 lakh including Rs. 3 lakh variable. Monthly take-home on fixed pay only?"],
      steps: [`Take-home on Rs. 17 lakh fixed: ${inr(takeHome({ ctc: 1700000 }).monthly)} a month.`],
      answer: `About ${Rs(takeHome({ ctc: 1700000 }).monthly)} a month to budget on.`,
    },
    {
      title: "Old regime with HRA",
      q: ["CTC Rs. 16 lakh; old-regime deductions besides PF of Rs. 2.5 lakh. Compare monthly take-home in each regime."],
      steps: [`New: ${inr(takeHome({ ctc: 1600000 }).monthly)}.`, `Old: ${inr(takeHome({ ctc: 1600000, regime: "old", ded: 250000 }).monthly)}.`],
      answer: takeHome({ ctc: 1600000 }).monthly >= takeHome({ ctc: 1600000, regime: "old", ded: 250000 }).monthly ? "The new regime gives more take-home." : "The old regime gives more take-home.",
    },
    {
      title: "Gratuity provision rate",
      q: ["Show that 4.81 percent of yearly basic equals the yearly gratuity accrual under the 15/26 formula."],
      steps: ["Yearly accrual = monthly basic × 15/26 = monthly basic × 0.5769.", "As a share of yearly basic: 0.5769 ÷ 12 = 0.0481."],
      answer: "4.81 percent.",
    },
    {
      title: "Final settlement leave encashment",
      q: ["30 days of earned leave encashed at basic plus DA of Rs. 52,000 a month, using 30 days a month. Amount?"],
      steps: ["52,000 ÷ 30 × 30."],
      answer: "Rs. 52,000, taxable as salary when encashed on resignation; exempt within limits on retirement.",
    },
    {
      title: "EDLI cover",
      q: ["Why should an employee check the nominee on the EPFO portal even though EDLI needs no contribution from them?"],
      steps: ["EDLI pays the nominee a lump sum on death in service.", "Without a valid nominee, the family must go through a longer claims process."],
      answer: "So that the insurance and PF balance reach the family quickly.",
    },
    {
      title: "Comparing offers on two lines",
      q: ["Offer A: take-home Rs. 1.1 lakh a month, retirement savings Rs. 72,000 a year. Offer B: take-home Rs. 1.04 lakh, retirement savings Rs. 1.9 lakh. What is the trade?"],
      steps: ["Monthly difference = 6,000; yearly = 72,000.", "Extra retirement saving in B = 1,18,000."],
      answer: "B gives up Rs. 72,000 a year of take-home for Rs. 1.18 lakh more retirement saving and usually less tax.",
    },
    {
      title: "PF interest tax",
      q: ["Employee PF plus VPF is Rs. 3.2 lakh a year. Roughly how much interest becomes taxable after a year at 8.25 percent?"],
      steps: ["Excess = 70,000.", "Interest on excess ≈ 70,000 × 8.25%."],
      answer: "About Rs. 5,775, taxable at your slab.",
    },
    {
      title: "Months to rebuild after a withdrawal",
      q: ["You withdrew Rs. 1.5 lakh of PF. If you add Rs. 5,000 a month of VPF at 8.25 percent, how long to put it back?"],
      steps: ["Grow monthly contributions until the balance reaches 1.5 lakh."],
      answer: (() => {
        let b = 0;
        let m = 0;
        while (b < 150000 && m < 600) {
          b = (b + 5000) * (1 + 8.25 / 1200);
          m += 1;
        }
        return `About ${m} months.`;
      })(),
    },
    {
      title: "Basic share and HRA",
      q: ["Basic rises from 40 to 50 percent of a Rs. 18 lakh CTC. If HRA is 40 percent of basic, what happens to HRA?"],
      steps: ["Monthly basic: 60,000 to 75,000.", "HRA: 24,000 to 30,000."],
      answer: "HRA rises by Rs. 6,000 a month, which helps old-regime tenants; in the new regime it is simply taxable salary.",
    },
    {
      title: "Wages paid on exit",
      q: ["Under the labour codes, how soon after the last working day should final wages be paid?"],
      steps: ["The codes require payment within two working days of removal, dismissal, retrenchment or resignation."],
      answer: "Within two working days, though full and final settlement of other dues may follow its own process.",
    },
    {
      title: "Share of a raise kept",
      q: ["CTC rises from Rs. 16 lakh to Rs. 17.6 lakh. What share of the Rs. 1.6 lakh raise reaches yearly take-home, new regime, basic 50 percent, PF capped?"],
      steps: [`Take-home before: ${inr(takeHome({ ctc: 1600000 }).net)}.`, `After: ${inr(takeHome({ ctc: 1760000 }).net)}.`],
      answer: `${Rs(takeHome({ ctc: 1760000 }).net - takeHome({ ctc: 1600000 }).net)}, about ${Math.round(((takeHome({ ctc: 1760000 }).net - takeHome({ ctc: 1600000 }).net) / 160000) * 100)} percent.`,
    },
    {
      title: "Loss of pay",
      q: ["Monthly gross Rs. 90,000. Three days of unpaid leave in a 30-day month. Deduction?"],
      steps: ["Daily rate = 90,000 ÷ 30 = 3,000.", "× 3."],
      answer: "Rs. 9,000, if the employer uses a 30-day divisor.",
    },
    {
      title: "Notice shortfall",
      q: ["Notice period 60 days; you serve 40. Recovery at basic of Rs. 60,000 a month, 30-day month. Amount?"],
      steps: ["Shortfall 20 days × 2,000."],
      answer: "Rs. 40,000, unless leave can be adjusted against it.",
    },
    {
      title: "EPF from a later start",
      q: ["Compare EPF at 58 for someone starting at 25 with someone starting at 35, both with basic Rs. 30,000 at start, 6 percent raises, PF on full basic, 8.25 percent."],
      steps: [`From 25: ${inr(epf(30000, 33, 8.25, 6, 0, CEIL, true).bal)}.`, `From 35: ${inr(epf(30000, 23, 8.25, 6, 0, CEIL, true).bal)}.`],
      answer: "The ten-year head start roughly triples the balance.",
    },
    {
      title: "Daily wage for leave encashment",
      q: ["Basic plus DA Rs. 78,000 a month; 45 days of leave encashed on resignation, using 26 working days a month. Amount?"],
      steps: ["78,000 ÷ 26 × 45."],
      answer: `${Rs((78000 / 26) * 45)}, taxable as salary. Divisors vary by policy; some use 30.`,
    },
    {
      title: "Startup versus large firm",
      q: ["Offer A: Rs. 22 lakh, no PF, no gratuity, basic 40 percent. Offer B: Rs. 24 lakh, basic 50 percent, PF on full basic. Monthly take-home and yearly PF saving in each?"],
      steps: [`A: ${inr(takeHome({ ctc: 2200000, basicPct: 40, pf: "none", grat: false }).monthly)} a month, no PF.`, `B: ${inr(takeHome({ ctc: 2400000, basicPct: 50, pf: "full" }).monthly)} a month, PF ${inr(takeHome({ ctc: 2400000, basicPct: 50, pf: "full" }).pfM * 24)} a year.`],
      answer: "Take-home is similar; B adds substantial retirement saving.",
    },
    {
      title: "Group health cover value",
      q: ["An employer's family floater of Rs. 5 lakh would cost about Rs. 25,000 a year to buy yourself. How should you count it when comparing offers?"],
      steps: ["Add its value to the offer that has it, or subtract the cost of buying cover from the offer that lacks it."],
      answer: "As roughly Rs. 25,000 a year of benefit, while remembering it ends when you leave the job.",
    },
    {
      title: "Bonus TDS in one month",
      q: ["Salary Rs. 18 lakh, new regime. A Rs. 2 lakh bonus is paid in December, and the extra tax is deducted in that month. Extra TDS?"],
      steps: [`Tax on salary including bonus minus tax on salary alone: ${inr(takeHome({ ctc: 2000000 }).tax - takeHome({ ctc: 1800000 }).tax)} using the in-hand model.`],
      answer: `About ${Rs(takeHome({ ctc: 2000000 }).tax - takeHome({ ctc: 1800000 }).tax)}, deducted from December's pay.`,
    },
    {
      title: "DA arrears",
      q: ["Basic Rs. 56,100; DA rises from 50 to 53 percent from July; paid in October with arrears. Monthly increase and arrears for July to September?"],
      steps: ["Increase = 3% of 56,100 = 1,683 a month.", "Arrears = 3 × 1,683."],
      answer: "Rs. 1,683 a month more, and Rs. 5,049 of arrears, before related changes to HRA and deductions.",
    },
    {
      title: "PF on part of a month",
      q: ["PF wages Rs. 40,000 a month, capped. The ceiling rises from Rs. 15,000 to Rs. 25,000 on the 17th of a 30-day month. If the employer pro-rates, what is September's employee PF?"],
      steps: ["16 days at 12% of 15,000 = 960.", "14 days at 12% of 25,000 = 1,400."],
      answer: "About Rs. 2,360, if pro-rated by days. Employers may handle the transition month differently.",
    },
    {
      title: "Gratuity with variable last wages",
      q: ["Wages were Rs. 70,000 for most of the last year but Rs. 80,000 in the final month after an increment. On which figure is gratuity calculated?"],
      steps: ["Gratuity uses last drawn wages."],
      answer: "Rs. 80,000, the last drawn wages, under the formula.",
    },
  ],

  exercises: {
    warmup: [
      { q: "What is the employee PF rate?", a: "12 percent of PF wages." },
      { q: "What is the PF wage ceiling from 17 September 2026?", a: "Rs. 25,000 a month." },
      { q: "What is the gratuity formula?", a: "Last drawn wages × 15 ÷ 26 × years of service." },
      { q: "After how long are fixed-term employees eligible for gratuity under the labour codes?", a: "One year." },
      { q: "What does UAN stand for?", a: "Universal Account Number: your lifelong PF account identifier." },
      { q: "What is the maximum professional tax a year?", a: "Rs. 2,500." },
      { q: "Is gratuity in CTC paid monthly?", a: "No. It is a provision paid only on leaving after qualifying service." },
      { q: "What is the main way people weaken their PF savings?", a: "Withdrawing PF when changing jobs instead of transferring it." },
      { q: "Name the EPFO online grievance system.", a: "EPFiGMS." },
      { q: "Does DA count with basic for HRA and pension contributions?", a: "Yes, in most structures, especially in government employment." },
    ],
    practice: [
      { q: "Take-home on Rs. 10 lakh CTC, basic 50 percent, PF capped, PT Rs. 2,400, new regime?", a: `About ${Rs(takeHome({ ctc: 1000000 }).monthly)} a month.` },
      { q: "Gratuity for wages Rs. 40,000 and 7 years?", a: `${Rs(gratuity(40000, 7))}.` },
      { q: "Employee PF on a basic of Rs. 20,000 after the ceiling change?", a: "Rs. 2,400 a month, 12 percent of the full basic, since it is below the ceiling." },
      { q: "Total remuneration Rs. 80,000, basic Rs. 30,000. Wages under the 50 percent rule?", a: "Rs. 40,000: allowances of Rs. 50,000 exceed half by Rs. 10,000, which is added back." },
      { q: "Name three items that are in CTC but not in take-home.", a: "Employer PF, gratuity provision and employer-paid insurance or NPS." },
      { q: "What should you do with PF when changing jobs?", a: "Give your UAN to the new employer and transfer the balance, not withdraw it." },
      { q: "A payslip shows PF deducted for 12 months, but the passbook shows 9. What do you do?", a: "Raise it with HR in writing with payslips; if unresolved, file a grievance with EPFO with the UAN and evidence." },
      { q: "A 10 percent raise on a Rs. 24 lakh CTC: share kept in take-home?", a: `About ${Math.round(((takeHome({ ctc: 2640000 }).net - takeHome({ ctc: 2400000 }).net) / 240000) * 100)} percent.` },
      { q: "List five questions to ask HR before accepting an offer.", a: "Full structure; PF basis; gratuity and employment type; history of variable pay; employer NPS; insurance cover; notice period." },
      { q: "Gratuity for last wages Rs. 80,000 and 6 years 7 months?", a: `${Rs(gratuity(80000, 7))}, counting 7 years.` },
      { q: "Name two things a gig worker can do for social security today.", a: "Register on the government portal for unorganised and platform workers, and build portable savings through PPF and NPS, with term and health insurance." },
      { q: "Which documents should you keep from every employer when you leave?", a: "Relieving letter, full and final settlement statement, last payslips, Form 16, and gratuity and leave encashment calculations." },
      { q: "Employee PF on a basic of Rs. 32,000 with PF capped at the new ceiling?", a: "Rs. 3,000 a month: 12 percent of Rs. 25,000." },
    ],
    stretch: [
      { q: "Compare take-home for Rs. 18 lakh CTC at basic 40 percent and 50 percent, PF on full basic.", a: `40%: ${Rs(takeHome({ ctc: 1800000, basicPct: 40, pf: "full" }).monthly)}; 50%: ${Rs(takeHome({ ctc: 1800000, basicPct: 50, pf: "full" }).monthly)} a month.` },
      { q: "Estimate EPF at 60 for basic Rs. 30,000 at 30, rising 7 percent a year, PF on full basic, 8.25 percent.", a: `About ${Rs(epf(30000, 30, 8.25, 7, 0, CEIL, true).bal)}.` },
      { q: "Explain why a higher basic can be good for you even though take-home falls.", a: "Higher basic raises PF from both sides, gratuity and often HRA. Long-term savings rise by more than take-home falls, and some of it is tax-efficient." },
      { q: "Your old employer has not marked your exit date. List the steps to fix it.", a: "Ask the employer to update it; if not done, use the portal facility to mark the exit with Aadhaar verification after the allowed period; then submit the transfer claim and check the passbook." },
      { q: "A Rs. 2 lakh employer loan at no interest. What tax issue may arise?", a: "An interest-free or concessional loan above a small threshold creates a taxable perquisite equal to the interest saved at a prescribed rate." },
      { q: "Estimate EPF at 58 for a starting basic of Rs. 50,000 at 30, raises 5 percent, PF on full basic, 8.25 percent.", a: `About ${Rs(epf(50000, 28, 8.25, 5, 0, CEIL, true).bal)}.` },
      { q: "Explain how agency contract workers can protect their PF.", a: "Keep payslips, check the passbook, register the mobile number for SMS alerts, raise gaps with the agency and principal employer, and file an EPFO grievance if needed." },
      { q: "Explain why take-home can stay flat when moving from a startup with no PF to a firm with PF, even with a higher CTC.", a: "The new CTC includes employer PF and gratuity, and your own PF is deducted; the extra CTC flows into retirement savings rather than monthly pay." },
      { q: "Your employer pro-rates PF in September when the ceiling rises on the 17th. Estimate the month's employee PF on capped wages.", a: "About Rs. 2,360 on a 30-day month: 16 days at 12 percent of Rs. 15,000 plus 14 days at 12 percent of Rs. 25,000." },
      { q: "Compare monthly take-home for Rs. 30 lakh CTC with PF capped and PF on full basic, basic 50 percent.", a: `Capped: ${Rs(takeHome({ ctc: 3000000 }).monthly)}; full: ${Rs(takeHome({ ctc: 3000000, pf: "full" }).monthly)}.` },
    ],
    challenge: [
      { q: "Design a salary structure for a Rs. 20 lakh CTC that suits a tenant in Pune using the old regime and complies with the 50 percent wage rule.", a: "Basic plus DA at least Rs. 10 lakh; HRA of 40 to 50 percent of basic; LTA; PF on the ceiling or full basic as chosen; a modest special allowance; reimbursements for phone and internet. Check the HRA exemption with the eight-city 50 percent rule." },
      { q: "Argue whether a 28-year-old should prefer an offer with higher take-home or one with higher PF and gratuity.", a: "Higher take-home helps with near goals and flexibility; higher PF and gratuity build retirement savings automatically and tax-efficiently. If the person would save the difference anyway, take-home gives choice; if not, the forced saving may be worth more." },
      { q: "Write a checklist for the first week in a new job.", a: "Share UAN; confirm PF wage basis and ceiling; check payslip lines; choose tax regime; submit Form 12B for previous salary; set nominee on EPFO; note gratuity eligibility date; set up any VPF or employer NPS." },
      { q: "Explain how the labour codes and the PF ceiling change together affect a mid-level employee.", a: "The 50 percent wage rule may raise basic within CTC; the higher ceiling raises PF where PF was capped. Both lower take-home and raise PF, EPS and gratuity, shifting money from now to later." },
      { q: "Estimate the gratuity forgone by leaving at 4 years 5 months instead of 5 years, on wages of Rs. 80,000.", a: `About ${Rs(gratuity(80000, 5))}, the full amount, since eligibility needs five years for permanent employees.` },
      { q: "Design a retirement plan for a 30-year-old whose PF projection covers half their target.", a: "Keep PF untouched across jobs; add VPF up to the tax-free limit; take employer NPS if available; fund PPF; invest monthly in equity index funds for the rest; review yearly and increase with raises." },
      { q: "Write a one-page note for new joiners at a small firm explaining PF, gratuity and take-home.", a: "Explain CTC versus take-home with one worked example; list the PF rates, the Rs. 25,000 ceiling and the UAN; explain gratuity eligibility and the formula; show how to check the passbook; and say whom to contact for problems." },
    ],
  },

  faqs: [
    {
      group: "CTC and take-home",
      items: [
        ["Why is my take-home so much lower than CTC divided by twelve?", "CTC includes employer PF, gratuity provision and sometimes insurance, which you do not receive monthly. Your own PF, professional tax and income tax then come out of gross salary."],
        ["What is gross salary?", "CTC minus employer-side items such as employer PF and gratuity provision. It is the salary before your own deductions."],
        ["How do I calculate take-home quickly?", "Use the site's in-hand salary calculator with your CTC, basic share, PF basis, professional tax and regime. It removes employer PF and gratuity from CTC, then your PF, professional tax and income tax, and shows the monthly figure."],
        ["Should I negotiate CTC or take-home?", "Negotiate CTC but compare offers on monthly take-home and on retirement benefits separately. Ask for the full salary structure."],
        ["Is variable pay guaranteed?", "No. It depends on performance and company results. Ask how much was paid in recent years and budget only on fixed pay."],
        ["Does a higher basic mean higher salary?", "Not within the same CTC. A higher basic usually means higher PF from both sides and a larger gratuity, so monthly take-home falls while long-term savings rise. Across different CTCs, compare take-home directly."],
        ["What is a salary slip and why keep it?", "A monthly statement of earnings and deductions. It is evidence for loans, visas, tax, PF and gratuity disputes. Keep them for several years."],
        ["Why did my take-home fall after November 2025?", "Many employers restructured salaries to meet the labour codes' rule that wages be at least half of remuneration. That can raise PF and lower take-home."],
      ],
    },
    {
      group: "Provident fund",
      items: [
        ["How much PF is deducted?", "12 percent of PF wages from you and a matching 12 percent from your employer, of which part goes to the pension scheme."],
        ["What is the PF wage ceiling?", "Rs. 25,000 a month from 17 September 2026. Contributions are compulsory on wages up to the ceiling; employers may contribute on higher wages."],
        ["Can I opt out of PF?", "New employees earning above the ceiling at joining may be able to opt out in some cases. Those already members generally cannot. Check with HR."],
        ["What interest does EPF earn?", "The rate EPFO declares each year after approval by its board and the finance ministry; it was 8.25 percent for 2024-25. Check the latest declared rate on the EPFO website before projecting."],
        ["Is PF withdrawal taxable?", "Tax-free after five years of continuous service, counting transfers. Earlier withdrawals can be taxed, and TDS may apply."],
        ["How do I transfer PF on changing jobs?", "Link the new member ID to your UAN and file a transfer claim online, or rely on automatic transfer where available. Make sure the old employer marked your exit."],
        ["Can I withdraw PF for a home?", "Yes, partial withdrawals are allowed for buying or building a home and repaying a home loan, after minimum membership and within limits."],
        ["What is VPF?", "Voluntary Provident Fund: extra contributions you ask your employer to deduct beyond the compulsory 12 percent. They earn the EPF rate and are tax-free within the Rs. 2.5 lakh yearly contribution limit for interest."],
        ["Is interest on all my PF tax-free?", "Interest on your contributions up to Rs. 2.5 lakh a year is tax-free; interest on the excess is taxable each year."],
        ["How long does a PF transfer take?", "Online transfers often complete within a few weeks once both employers have approved and KYC is complete. Track the status on the portal and follow up with HR if it stalls."],
        ["Do I need to transfer PF if both employers use the same UAN?", "The member IDs are linked under one UAN, but the balance from the old member ID still needs a transfer claim unless it is moved automatically. Check the passbook to confirm."],
        ["Can I see my employer's contributions separately?", "Yes. The passbook shows the employee share, the employer share and the pension contribution separately for each month, with the date each was credited, so you can spot missing or late deposits."],
        ["Is the interest credited every month?", "Interest is calculated monthly on the running balance but credited to the account once a year, after the rate is declared."],
        ["How do I check my PF balance?", "On the EPFO member portal or app with your UAN, by missed call or SMS from your registered mobile, or through the UMANG app."],
      ],
    },
    {
      group: "Pension and insurance",
      items: [
        ["What is EPS?", "The Employees' Pension Scheme. Part of the employer's PF contribution, 8.33 percent of wages up to the ceiling, funds a monthly pension from 58 after at least ten years of service."],
        ["How is the EPS pension calculated?", "Pensionable salary × pensionable service ÷ 70, with pensionable salary capped at the ceiling and special rules for older service."],
        ["What if I leave before ten years of service?", "You can withdraw the EPS amount as per a table, or take a scheme certificate to carry the service to a future employer."],
        ["What is EDLI?", "Employees' Deposit Linked Insurance: life cover for PF members, paid by the employer, payable to the nominee on death in service."],
        ["Does the ceiling change affect EPS?", "Yes. With the ceiling at Rs. 25,000, the maximum monthly EPS contribution rises to about Rs. 2,083, and the maximum pension for 35 years of service rises with it. The employer's EPF share falls correspondingly where PF is on full basic."],
      ],
    },
    {
      group: "Gratuity",
      items: [
        ["When am I eligible for gratuity?", "Permanent employees after five years of continuous service; fixed-term employees after one year under the labour codes; no minimum on death or disablement."],
        ["How is gratuity calculated?", "Last drawn wages × 15 ÷ 26 × completed years, with more than six months in the last year counted as a full year."],
        ["Is gratuity taxable?", "For private-sector employees, up to Rs. 20 lakh over a career is exempt. Government employees' gratuity is fully exempt."],
        ["What is the maximum gratuity?", "Rs. 20 lakh under the law. Employers can pay more under their own policies; the excess is taxable."],
        ["Is gratuity part of CTC?", "Many employers show a provision of 4.81 percent of basic in CTC. It is paid only on leaving after qualifying service."],
        ["Can an employer refuse gratuity?", "Only in limited cases such as termination for specified misconduct causing loss. Otherwise it must be paid within the legal time limit."],
        ["Does notice period count for gratuity?", "Yes. If you serve the notice period and are paid for it, it counts as service for gratuity. If you buy out the notice and leave early, service ends on the last day worked, which can matter near the five-year mark."],
      ],
    },
    {
      group: "Taxes on salary",
      items: [
        ["Which regime should I choose?", "Compare take-home in both. The new regime usually wins unless you have large deductions such as HRA in a high-rent city and a self-occupied home loan."],
        ["Is professional tax deductible?", "In the old regime, yes, up to the amount paid. Not in the new regime, though the employer still deducts it where the state levies it."],
        ["Is employer NPS taxable?", "It is part of salary but deductible up to 14 percent of basic and DA in the new regime, and 10 percent in the old."],
        ["Are employer PF contributions taxable?", "Not up to 12 percent of salary, and not if total employer contributions to PF, NPS and superannuation stay within Rs. 7.5 lakh a year."],
        ["Is a salary advance taxable?", "An advance is taxed as salary in the year received. An employer loan is not salary, but an interest-free loan can create a perquisite."],
      ],
    },
    {
      group: "Leaving a job",
      items: [
        ["What is included in full and final settlement?", "Last salary, leave encashment, gratuity if eligible, bonuses due, minus recoveries for notice shortfall, loans or company property."],
        ["How quickly must final wages be paid?", "Under the labour codes, wages on separation are to be paid within two working days of the last day."],
        ["Is leave encashment on resignation taxable?", "Yes, fully, as salary in the year received. On retirement, non-government employees can claim exemption up to Rs. 25 lakh over a career, subject to a formula; government employees' encashment on retirement is fully exempt."],
        ["Do I get a Form 16 when I leave mid-year?", "Yes. Each employer issues a Form 16 for the months you worked there, after the tax year ends. Give your new employer the earlier salary details on Form 12B so TDS covers the whole year."],
        ["What happens to my PF if I stop working?", "The balance continues to earn interest until it becomes inoperative under EPFO rules after a long period. You can also withdraw after two months of unemployment."],
      ],
    },
    {
      group: "Problems and complaints",
      items: [
        ["My PF is deducted but not showing in the passbook. What should I do?", "Ask HR in writing with payslips as evidence. If unresolved, file a grievance on EPFO's online grievance system with your UAN. EPFO can recover dues from the employer with interest and damages."],
        ["I have two UANs. Is that a problem?", "Yes. It can break service continuity and complicate claims. Ask EPFO, with your employer's help, to transfer the balance to one UAN and deactivate the other."],
        ["My PF claim was rejected. Why?", "Common reasons are mismatched name or date of birth, unverified bank details, a missing exit date, or incomplete KYC. The rejection message usually states the reason."],
        ["How do I correct my date of birth in PF records?", "Submit a correction request online with supporting documents, usually approved by the employer, or through the joint declaration process."],
        ["Can my employer deduct PF from my salary for its own share?", "No. The employer's contribution must come from the employer, not from your salary. If CTC includes it, that is a structuring choice, but it must not be deducted again from your gross."],
        ["What if my employer delays salary?", "Under the labour codes, wages must be paid within set time limits. Raise it with HR, keep records, and if needed approach the labour department."],
        ["Where can I complain about gratuity not being paid?", "To the employer first, in writing, then to the controlling authority under the gratuity provisions, usually through the labour department."],
      ],
    },
    {
      group: "Offers and negotiation",
      items: [
        ["Should I ask for a higher basic?", "If you value retirement savings and gratuity, yes. If you need monthly cash, a lower basic within the labour codes' limits gives higher take-home. Ask to see both versions of the structure."],
        ["Is a joining bonus worth negotiating?", "It can cover a gap such as lost bonus from the old job. Check the clawback clause: many must be repaid if you leave within a year."],
        ["How do I compare an offer with ESOPs?", "Value the fixed salary first. Treat ESOPs as uncertain, valuable only if the company does well and you stay through vesting, and remember exercise is taxable."],
        ["Should I accept a role without PF?", "Consultant or contract roles may have none. Make sure the fee is high enough to fund your own retirement savings through PPF, NPS and investments."],
        ["How much should take-home rise when switching jobs?", "Compare take-home and retirement contributions separately. A switch that raises CTC by 20 percent may raise take-home by less if basic or PF basis changes."],
      ],
    },
    {
      group: "Life events",
      items: [
        ["Does salary continue during maternity leave?", "Eligible women in covered establishments receive maternity benefit at their average daily wages for up to 26 weeks, with conditions. Many employers pay it as normal salary."],
        ["What happens to PF if I take a career break?", "The balance continues to earn interest for some years without contributions, under EPFO's rules on inoperative accounts. Keep KYC updated and rejoin with the same UAN."],
        ["Can I withdraw PF if I lose my job?", "After one month of unemployment, part can be withdrawn under the rules; after two months, the full balance. Consider whether you can avoid it, since withdrawal ends compounding."],
        ["How do I add my spouse or newborn to employer health insurance?", "Most policies allow additions within a set period after marriage or birth. Inform HR quickly with the documents they need."],
        ["What happens to my salary benefits if I die in service?", "The nominee receives PF, EDLI insurance, gratuity without the five-year condition, and pension under EPS. Keep nominees updated with EPFO and HR."],
      ],
    },
    {
      group: "Government and special cases",
      items: [
        ["Do government employees have EPF?", "Most central government employees who joined from 2004 are under NPS, not EPF. Older employees may have GPF and a defined pension. Rules differ by service and state."],
        ["What is DA and why does it change?", "Dearness allowance compensates for inflation and is revised periodically, usually twice a year for central government employees, based on a price index."],
        ["Are gig workers covered by PF?", "Not through employer PF. The Code on Social Security provides for separate schemes for gig and platform workers; registration on the national portal is the starting point."],
        ["Do apprentices and interns get PF?", "Often not, depending on how they are engaged. If PF is not deducted, build your own savings and keep payslips as proof of earnings."],
        ["Is PF compulsory for small companies?", "EPF applies to establishments with at least 20 employees, and voluntarily to smaller ones. Many small firms are covered; ask HR."],
      ],
    },
  ],

  glossary: [
    ["Basic pay", "The core component of salary on which PF, gratuity and HRA are usually based."],
    ["CTC", "Cost to company: the employer's total yearly cost for an employee."],
    ["DA", "Dearness allowance: an inflation-linked allowance, treated with basic for many purposes."],
    ["EDLI", "Employees' Deposit Linked Insurance: life cover for PF members."],
    ["EPF", "Employees' Provident Fund: the retirement savings account funded by employee and employer."],
    ["EPFO", "Employees' Provident Fund Organisation, which runs EPF, EPS and EDLI."],
    ["EPS", "Employees' Pension Scheme, funded from part of the employer's contribution."],
    ["Exit date", "The date an employer records as your last day, needed for PF transfers."],
    ["Fixed-term employment", "Employment for a set period, now eligible for gratuity after one year."],
    ["Full and final settlement", "The final payment of dues and recoveries on leaving a job."],
    ["Gratuity", "A lump sum paid on leaving after qualifying service, by the 15/26 formula."],
    ["Gross salary", "CTC minus employer-side contributions, before your own deductions."],
    ["HRA", "House rent allowance."],
    ["Labour codes", "Four codes that replaced 29 labour laws, in force from 21 November 2025."],
    ["Member ID", "An account under your UAN for each employer."],
    ["Nominee", "The person who receives PF, EPS and EDLI benefits on a member's death."],
    ["Pensionable service", "Years of EPS membership counted for pension."],
    ["Perquisite", "A non-cash benefit from an employer, taxable as salary."],
    ["PF wages", "The wages on which PF is calculated, subject to the ceiling."],
    ["Professional tax", "A state tax on employment, up to Rs. 2,500 a year."],
    ["Special allowance", "A balancing, fully taxable salary component."],
    ["Take-home", "Monthly pay credited after all deductions."],
    ["UAN", "Universal Account Number: your lifelong EPF identifier."],
    ["Variable pay", "Performance-linked pay, not guaranteed."],
    ["VPF", "Voluntary Provident Fund: extra PF contributions beyond 12 percent."],
    ["Wage ceiling", "The wage up to which PF is compulsory: Rs. 25,000 a month from 17 September 2026."],
    ["Wages (labour codes)", "Basic, DA and retaining allowance, at least half of total remuneration."],
    ["EPFiGMS", "EPFO's online grievance management system."],
    ["Loss of pay", "A salary deduction for unpaid leave."],
    ["Notice period", "The time an employee must work after resigning, or pay in lieu."],
    ["Principal employer", "The organisation that engages workers through a contractor, with some responsibilities for their PF."],
  ],

  references: [
    { title: "Notification raising the EPF wage ceiling to Rs. 25,000", who: "Ministry of Labour and Employment, S.O. 5109(E), 17 September 2026", where: "egazette.gov.in and epfindia.gov.in", note: "The new statutory ceiling for EPF coverage and contributions." },
    { title: "The Code on Wages, 2019 and the Code on Social Security, 2020", who: "Ministry of Labour and Employment", where: "labour.gov.in", note: "In force from 21 November 2025; the definition of wages, gratuity rules and payment timelines." },
    { title: "EPFO member portal and FAQs", who: "Employees' Provident Fund Organisation", where: "epfindia.gov.in", note: "UAN services, passbooks, claims, transfers, nominations and interest rates." },
    { title: "Employees' Pension Scheme, 1995", who: "EPFO", where: "epfindia.gov.in", note: "Pension formula, eligibility and withdrawal tables." },
    { title: "Income-tax rules on salary", who: "Income Tax Department", where: "incometaxindia.gov.in", note: "Treatment of PF, NPS, gratuity, leave encashment and perquisites." },
    { title: "State professional tax laws", who: "State commercial tax departments", where: "Each state's tax department website", note: "Slabs and rates where professional tax is levied." },
    { title: "In-hand salary, PF and gratuity calculators", who: "FreeToolsPro", where: "freetoolspro.in", note: "Calculators using the same methods as this book." },
  ],
};
