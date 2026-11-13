// Practice material for "PPF, FD and NPS".
// PPF: yearly compounding on deposits made by 5 April (as the site's PPF calculator).
// FD: quarterly compounding unless stated (as the FD calculator).
// NPS: monthly contributions grown at a steady illustrated rate (as the NPS calculator),
// with the December 2025 exit rules for non-government subscribers: up to 80% lump sum,
// at least 20% to an annuity.
import { inr } from "../lib/calc.mjs";

const Rs = (n) => `Rs. ${inr(n)}`;
function ppf(yearly, rate, years) {
  let b = 0;
  const rows = [];
  for (let y = 1; y <= years; y++) {
    b = (b + yearly) * (1 + rate / 100);
    rows.push([y, yearly * y, b]);
  }
  return { value: b, deposited: yearly * years, rows };
}
const fd = (P, rate, years, n = 4) => P * Math.pow(1 + rate / 100 / n, n * years);
const effYield = (rate, n = 4) => (Math.pow(1 + rate / 100 / n, n) - 1) * 100;
function rd(monthly, rate, years) {
  const N = Math.round(years * 12);
  let M = 0;
  for (let k = 1; k <= N; k++) M += monthly * Math.pow(1 + rate / 400, (4 * k) / 12);
  return { value: M, deposited: monthly * N };
}
function nps(monthly, rate, years) {
  const i = rate / 1200;
  let b = 0;
  for (let m = 1; m <= years * 12; m++) b = (b + monthly) * (1 + i);
  return { corpus: b, invested: monthly * years * 12 };
}
const pension = (annuityAmount, annRate) => (annuityAmount * annRate) / 100 / 12;
const p2 = (n) => (Math.round(n * 100) / 100).toFixed(2);

const ppfFull = ppf(150000, 7.1, 15);
const ppf25 = ppf(150000, 7.1, 25);
const npsA = nps(10000, 10, 30);

export default {
  checked: "October 2026",
  welcome:
    "This book compares three of the most common ways Indian households save for the long term: the Public Provident Fund, bank and post office deposits, and the National Pension System. It explains how each one grows, what it locks up, how it is taxed, and how they fit together around your own dates. Rates quoted for small savings schemes are those announced for October to December 2026; they are reset every quarter.",

  chapters: [
    {
      title: "The rates in force",
      paragraphs: [
        "The government announces small savings rates every quarter. For October to December 2026 they were unchanged from the previous quarter. Bank deposit rates are set by each bank and change more often.",
      ],
      sections: [
        {
          table: {
            caption: "Small savings rates, October to December 2026. Source: Ministry of Finance announcement, 30 September 2026.",
            headers: ["Scheme", "Rate a year", "Notes"],
            widths: [1.6, 0.8, 2.4],
            rows: [
              ["Public Provident Fund", "7.1%", "Compounded yearly; tax-free; 15-year term"],
              ["Sukanya Samriddhi Yojana", "8.2%", "For a girl child; tax-free"],
              ["Senior Citizens Savings Scheme", "8.2%", "Interest paid quarterly; taxable"],
              ["National Savings Certificate", "7.7%", "5 years; interest reinvested; taxable"],
              ["Kisan Vikas Patra", "7.5%", "Doubles the deposit over its term"],
              ["Monthly Income Scheme", "7.4%", "Interest paid monthly; taxable"],
              ["Post office time deposit, 1 year", "6.9%", "Taxable"],
              ["Post office time deposit, 2 years", "7.0%", "Taxable"],
              ["Post office time deposit, 3 years", "7.1%", "Taxable"],
              ["Post office time deposit, 5 years", "7.5%", "Taxable"],
              ["Post office recurring deposit, 5 years", "6.7%", "Taxable"],
              ["Post office savings account", "4.0%", "Taxable above exemptions"],
            ],
          },
          note: "Rates are reviewed every quarter. For PPF the rate applies to the whole balance, so the rate you earn changes over the life of the account. Check the current notification before relying on any figure.",
        },
      ],
    },
    {
      title: "PPF in detail",
      paragraphs: [
        "The Public Provident Fund is a government-backed account at a post office or bank. It is one of the few products where the deposits, the interest and the maturity amount are all free of tax, which is why it is called exempt-exempt-exempt. The price is a long lock-in.",
      ],
      sections: [
        {
          heading: "The rules that matter",
          bullets: [
            "Deposit at least Rs. 500 and at most Rs. 1.5 lakh in a financial year, in one go or in instalments.",
            "The account matures after 15 full financial years, counted from the end of the year in which it was opened.",
            "After maturity it can be extended in blocks of five years, with or without fresh deposits.",
            "Interest is calculated monthly on the lowest balance between the 5th and the last day of the month, and credited once a year on 31 March.",
            "Loans are allowed from the third to the sixth year; partial withdrawals from the seventh year, within limits.",
            "One account per person. An account for a minor counts within the guardian's Rs. 1.5 lakh limit.",
          ],
        },
        {
          heading: "Why the 5th of the month matters",
          paragraphs: [
            "Because interest for a month uses the lowest balance between the 5th and the month's end, a deposit made on the 6th earns nothing for that month. A full Rs. 1.5 lakh deposited on 6 April instead of 4 April loses a whole month's interest on that amount: about Rs. 888 at 7.1 percent.",
            "The site's PPF calculator assumes each year's deposit is made by 5 April, so it earns for the full year. If you deposit monthly, the balance builds through the year and the result is lower than the calculator shows.",
          ],
        },
        {
          heading: "What the full deposit grows to",
          paragraphs: [
            `Rs. 1.5 lakh a year for 15 years at a steady 7.1 percent deposits ${Rs(ppfFull.deposited)} and matures at about ${Rs(ppfFull.value)}. Extended for two five-year blocks with continued deposits, 25 years give about ${Rs(ppf25.value)} from ${Rs(ppf25.deposited)} deposited, all tax-free.`,
          ],
          table: {
            caption: "Rs. 1,50,000 deposited by 5 April each year at 7.1 percent.",
            headers: ["Year", "Deposited", "Balance"],
            rows: ppf25.rows.filter((r) => [1, 3, 5, 7, 10, 15, 20, 25].includes(r[0])).map(([y, d, b]) => [String(y), inr(d), inr(b)]),
          },
        },
        {
          heading: "Tax under each regime",
          paragraphs: [
            "Under the old tax regime, deposits count towards the Rs. 1.5 lakh deduction for specified savings. Under the new regime that deduction is not available, but the interest and maturity remain tax-free in both. For someone in the new regime, PPF is a tax-free fixed-income product rather than a tax-saving one.",
          ],
        },
      ],
    },
    {
      title: "Fixed and recurring deposits",
      paragraphs: [
        "A fixed deposit is a contract: you lend the bank a sum for a set period at a set rate. Most banks compound interest quarterly, so the yearly yield is slightly higher than the quoted rate.",
      ],
      sections: [
        {
          heading: "Quoted rate and effective yield",
          paragraphs: [
            `A 7 percent rate compounded quarterly gives an effective yield of ${p2(effYield(7))} percent a year. A 7.5 percent rate gives ${p2(effYield(7.5))} percent. On ${Rs(500000)} for 5 years at 7.25 percent, the maturity value is about ${Rs(fd(500000, 7.25, 5))}.`,
            "Cumulative deposits reinvest the interest until maturity. Non-cumulative deposits pay interest out monthly or quarterly, which suits people who need income but gives a slightly lower total because the interest does not compound.",
          ],
        },
        {
          heading: "Tax and TDS",
          paragraphs: [
            "Deposit interest is added to your income and taxed at your slab rate every year, whether paid out or reinvested. Banks deduct tax at source when interest from one bank in a year exceeds a threshold, which from April 2025 is Rs. 50,000 for most people and Rs. 1 lakh for senior citizens. TDS is 10 percent with a PAN.",
            "TDS is not the final tax. If your slab is higher, you pay the balance when filing. If your total income is below the taxable limit, you can submit Form 15G, or Form 15H if you are a senior citizen, to the bank to avoid TDS.",
          ],
        },
        {
          heading: "Deposit insurance",
          paragraphs: [
            "The Deposit Insurance and Credit Guarantee Corporation insures deposits in a bank up to Rs. 5 lakh per depositor, covering principal and interest together, across all accounts held in the same capacity at that bank. Deposits above that at a single bank are not insured. Spreading large sums across banks keeps each within the limit.",
          ],
        },
        {
          heading: "Breaking a deposit",
          paragraphs: [
            "Most banks allow premature withdrawal with a penalty, often 0.5 to 1 percentage point below the rate for the period actually held. Some offer non-callable deposits at a slightly higher rate that cannot be broken. Check before choosing, and do not lock emergency money into a non-callable deposit.",
          ],
        },
        {
          heading: "Recurring deposits",
          paragraphs: [
            `A recurring deposit builds a sum from monthly instalments. ${Rs(5000)} a month for 5 years at 7 percent matures at about ${Rs(rd(5000, 7, 5).value)} from ${Rs(rd(5000, 7, 5).deposited)} deposited. It suits a near goal funded from salary, such as a down payment or fees.`,
          ],
        },
      ],
    },
    {
      title: "NPS in detail",
      paragraphs: [
        "The National Pension System is a retirement account regulated by PFRDA. You choose a pension fund manager and a mix of equity, corporate bonds and government securities, or let an age-based option choose for you. The value moves with markets. There is no promised return.",
      ],
      sections: [
        {
          heading: "Tier I and Tier II",
          paragraphs: [
            "Tier I is the pension account, with restrictions on withdrawal and tax benefits. Tier II is an optional voluntary account with free withdrawals and, for most people, no tax benefits. When people say NPS they usually mean Tier I.",
          ],
        },
        {
          heading: "Choosing the mix",
          paragraphs: [
            "Under active choice you set the shares yourself, with equity capped at 75 percent up to age 50 and the cap falling after that. Under auto choice, a life-cycle fund lowers the equity share as you age; aggressive, moderate and conservative versions start at different levels. Most people do well with a moderate or aggressive life-cycle option and a yearly look.",
          ],
        },
        {
          heading: "Exit at 60: the rules from December 2025",
          paragraphs: [
            "PFRDA amended the exit rules in December 2025. For subscribers who are not government employees, at normal exit you can take up to 80 percent of the corpus as a lump sum and must use at least 20 percent to buy an annuity. Government employees must still use at least 40 percent for an annuity. If the total corpus is Rs. 8 lakh or less, it can be withdrawn in full. You can stay invested until 85 and spread withdrawals over time.",
            "Leaving before 60 is stricter. In a premature exit, most of the corpus must buy an annuity and only a small part can be taken as cash, unless the corpus is small. Partial withdrawals for specified purposes such as education, marriage, a home or illness are allowed a limited number of times.",
          ],
          note: "Exit and withdrawal rules have changed several times. Check the current PFRDA regulations and how the part of the lump sum above 60 percent is taxed before planning your exit.",
        },
        {
          heading: "An illustration",
          paragraphs: [
            `Rs. 10,000 a month from 30 to 60 at an illustrated 10 percent builds a corpus of about ${Rs(npsA.corpus)} from ${Rs(npsA.invested)} contributed. Under the non-government rule, at least 20 percent, ${Rs(npsA.corpus * 0.2)}, buys an annuity. At an annuity rate of 6.5 percent that pays about ${Rs(pension(npsA.corpus * 0.2, 6.5))} a month for life. The remaining ${Rs(npsA.corpus * 0.8)} can be taken as a lump sum or withdrawn gradually.`,
            `If more is put into the annuity, say 40 percent, the pension doubles to about ${Rs(pension(npsA.corpus * 0.4, 6.5))} a month and the lump sum falls. The choice depends on whether you want certainty of income or control of capital.`,
          ],
        },
        {
          heading: "Tax benefits",
          paragraphs: [
            "Under the old regime, your own contributions qualify for the Rs. 1.5 lakh deduction for specified savings and an extra Rs. 50,000 deduction exclusively for NPS. In both regimes, an employer's contribution to your NPS is deductible within a limit set as a percentage of basic pay and DA, which is higher in the new regime. At exit, 60 percent of the corpus has long been tax-free; annuity income is taxed as income in the year received.",
          ],
        },
      ],
    },
    {
      title: "Matching products to dates",
      paragraphs: [
        "None of these products is best in general. Each is best for a particular date and purpose. Start from the date you need the money, then pick the product whose lock-in ends before it and whose risk you can carry.",
      ],
      sections: [
        {
          table: {
            caption: "A rough guide. Your own taxes and circumstances may change the answer.",
            headers: ["Need", "Fits well", "Fits poorly"],
            widths: [1.4, 1.8, 1.8],
            rows: [
              ["Emergency fund", "Savings account, sweep deposit, liquid fund", "PPF, NPS, long FDs"],
              ["Goal in 1 to 3 years", "FD, RD, post office time deposit", "NPS, equity"],
              ["Goal in 5 to 7 years", "FD ladder, NSC, PPF if timed", "NPS"],
              ["Child's education in 15 years", "PPF, SSY for a daughter, equity funds", "Short FDs"],
              ["Retirement in 20+ years", "NPS, EPF, PPF, equity funds", "Short FDs alone"],
              ["Income after retirement", "SCSS, MIS, FD ladder, annuity", "Locked products you cannot draw"],
            ],
          },
        },
        {
          heading: "The order that protects you",
          steps: [
            "Emergency fund of three to six months' expenses, in something you can withdraw tomorrow.",
            "Health insurance and, if anyone depends on you, term life cover.",
            "Clear high-interest debt such as credit cards and personal loans.",
            "Retirement through EPF, NPS and PPF, plus equity for growth.",
            "Dated goals, each in a product whose lock-in ends before the date.",
          ],
        },
      ],
    },
    {
      title: "Senior citizens and income",
      paragraphs: [
        "After retirement the question changes from growth to steady income that lasts. Several products are designed for this, each with limits.",
      ],
      sections: [
        {
          heading: "Senior Citizens Savings Scheme",
          paragraphs: [
            `SCSS is open to people aged 60 and above, and to some retirees from 55. The maximum investment is Rs. 30 lakh per person. Interest at 8.2 percent is paid every quarter. On Rs. 30 lakh that is ${Rs((3000000 * 8.2) / 100 / 4)} a quarter. The term is five years, extendable by three. Interest is taxable; deposits qualify for the old-regime savings deduction.`,
          ],
        },
        {
          heading: "Monthly Income Scheme",
          paragraphs: [
            `The post office MIS pays 7.4 percent monthly for five years, up to Rs. 9 lakh in a single account or Rs. 15 lakh in a joint one. Rs. 9 lakh gives ${Rs((900000 * 7.4) / 100 / 12)} a month. Interest is taxable.`,
          ],
        },
        {
          heading: "A deposit ladder",
          paragraphs: [
            "Splitting a sum into deposits that mature one, two, three, four and five years apart gives cash every year without breaking anything early. When a deposit matures, spend what you need and reinvest the rest at the long end. The ladder also spreads interest-rate risk: you are never locked entirely into one year's rates.",
          ],
        },
        {
          heading: "Annuities",
          paragraphs: [
            "An annuity converts a lump sum into income for life. Rates depend on age and on options such as return of purchase price to heirs, joint life with a spouse, or increasing payments. A plain life annuity pays the most but returns nothing to heirs. Compare quotes from several insurers; NPS lets you choose the annuity provider and option at exit.",
          ],
        },
      ],
    },
    {
      title: "Sukanya Samriddhi Yojana",
      paragraphs: [
        "SSY is a savings scheme for a girl child, opened by a parent or guardian before she turns 10. It pays one of the highest rates among small savings schemes, 8.2 percent for October to December 2026, and like PPF it is tax-free on interest and maturity.",
      ],
      sections: [
        {
          heading: "How it works",
          bullets: [
            "Minimum Rs. 250 and maximum Rs. 1.5 lakh in a financial year.",
            "Deposits are made for 15 years from opening. The account matures 21 years from opening.",
            "Up to 50 percent of the balance at the end of the previous year can be withdrawn after the girl turns 18 or passes class 10, for education.",
            "The account can be closed early for her marriage after she turns 18.",
            "A family can open accounts for up to two girls, with exceptions for twins or triplets.",
          ],
        },
        {
          heading: "An illustration",
          paragraphs: [
            `Rs. 50,000 a year for 15 years at a steady 8.2 percent, then left for six more years, grows to about ${Rs(ppf(50000, 8.2, 15).value * Math.pow(1.082, 6))} at 21 years. Deposits total Rs. 7.5 lakh. The rate will change over two decades, so treat this as a shape, not a promise.`,
          ],
        },
        {
          heading: "Where it fits",
          paragraphs: [
            "SSY is safe and tax-free, which suits the core of a daughter's education fund. For a goal 15 years away, many parents add an equity SIP for growth, so that the total is not entirely dependent on a fixed rate that may fall. The SSY withdrawal rules are tied to her age and education, which helps protect the money for its purpose.",
          ],
        },
      ],
    },
    {
      title: "Other post office options",
      paragraphs: ["Beyond PPF and SSY, the post office offers several fixed-income products backed by the government. Each has a narrow job."],
      sections: [
        { label: "National Savings Certificate", paragraphs: ["A five-year certificate at 7.7 percent, compounded yearly and paid at maturity. Interest is taxable but, under the old regime, the yearly interest is treated as reinvested and counts towards the savings deduction except in the final year. Good for a five-year safe goal."] },
        { label: "Kisan Vikas Patra", paragraphs: ["A certificate that doubles the deposit over its term, currently 115 months at 7.5 percent. It can be transferred and encashed after a lock-in of about two and a half years. Interest is taxable. Its appeal is simplicity: you know exactly what you will receive."] },
        { label: "Post office time deposits", paragraphs: ["Deposits of one, two, three and five years at 6.9 to 7.5 percent, compounded quarterly with interest paid yearly. The five-year deposit counts for the old-regime savings deduction. Rates are often competitive with large banks."] },
        { label: "Recurring deposit", paragraphs: ["A five-year monthly deposit at 6.7 percent. It suits building a sum from salary, though bank RDs may offer more flexible tenures."] },
        { label: "Monthly Income Scheme", paragraphs: ["A five-year deposit paying 7.4 percent monthly, up to Rs. 9 lakh single or Rs. 15 lakh joint. Useful for retirees or anyone wanting steady income from a lump sum."] },
        { label: "Senior Citizens Savings Scheme", paragraphs: ["Covered in the senior citizens chapter: 8.2 percent quarterly, up to Rs. 30 lakh per person, five years extendable by three."] },
      ],
    },
    {
      title: "Why deposit rates move",
      paragraphs: [
        "Deposit rates are not fixed by nature. They move with the economy, and understanding why helps you decide how long to lock in.",
      ],
      sections: [
        {
          heading: "The repo rate and bank deposits",
          paragraphs: [
            "The Reserve Bank of India sets the repo rate, the rate at which it lends to banks. When RBI raises it to cool inflation, banks pay more for funds and tend to raise deposit rates, usually with a lag. When RBI cuts it, deposit rates tend to fall. Loan rates linked to the repo rate move faster than deposit rates, which is why borrowers feel cuts sooner than savers feel rises.",
          ],
        },
        {
          heading: "Small savings rates",
          paragraphs: [
            "The government sets small savings rates each quarter, guided by a formula linked to government bond yields of similar maturity, with a spread. In practice it often keeps rates unchanged for several quarters, as it did through 2025 and 2026.",
          ],
        },
        {
          heading: "Locking in",
          paragraphs: [
            "If rates seem high and likely to fall, locking a longer deposit secures today's rate. If rates seem low and likely to rise, shorter deposits let you reinvest at higher rates later. Nobody predicts rates reliably, which is why a ladder, with something maturing every year, is a sensible default.",
            "PPF and SSY rates float with each quarter's announcement for the whole balance, so locking in is not possible there. NSC and post office time deposits lock the rate at purchase for their term.",
          ],
        },
        {
          heading: "Inflation and real return",
          paragraphs: [
            "The rate that matters is the real return after tax and inflation. A 7 percent deposit taxed at 30 percent yields 4.9 percent; with 5 percent inflation, the real return is slightly negative. Tax-free PPF at 7.1 percent with the same inflation gives about 2 percent real. Fixed income protects capital; over long periods, it rarely builds wealth on its own.",
          ],
        },
      ],
    },
    {
      title: "Planning the tax on interest",
      paragraphs: ["Interest is the most heavily taxed form of savings income for most households, because it is taxed every year at the full slab rate. A few legal arrangements reduce the bill."],
      sections: [
        { label: "Use tax-free products first for long-term safe money", paragraphs: ["PPF and SSY interest is tax-free in both regimes. For money that can be locked, they beat a taxable deposit for anyone in the 20 or 30 percent slab."] },
        { label: "Understand clubbing", paragraphs: ["Interest on deposits made in a spouse's name from your money is added to your income for tax. So is income on investments in a minor child's name, with a small exemption. Gifts to adult children or parents are not clubbed. Moving money to a spouse's name does not reduce tax unless it is their own money."] },
        { label: "Senior citizens' deduction", paragraphs: ["Under the old regime, senior citizens can deduct up to Rs. 50,000 of interest from deposits each year. Combined with the higher TDS threshold and Form 15H, many retirees pay little or no tax on modest deposits."] },
        { label: "Defer tax where it helps", paragraphs: ["Debt mutual funds are taxed at the slab rate but only on redemption. Cumulative deposits are taxed yearly even though you receive nothing until maturity. For someone who expects a lower slab later, such as after retirement, deferral can help."] },
        { label: "Report everything", paragraphs: ["The tax department receives interest data from banks and the post office through the annual information statement. Check it before filing and report all interest, even where no TDS was deducted."] },
      ],
    },
    {
      title: "Paperwork that protects your family",
      paragraphs: ["The best savings plan fails if your family cannot claim the money. A few hours of paperwork prevents months of difficulty."],
      sections: [
        {
          steps: [
            "Add a nominee to every deposit, PPF, SSY, NSC, NPS and post office account. Many accounts allow more than one nominee with shares.",
            "For deposits, consider joint holding with either-or-survivor operation, so the survivor can operate without a claim process.",
            "Keep KYC current: address, mobile number and email with every bank and the post office.",
            "Make a single list of accounts, with institution, account number, maturity date and nominee, and tell a family member where it is.",
            "Write a will, especially if you want assets to go to someone other than the nominee; a nominee may be a trustee for legal heirs rather than the final owner.",
            "Review the list after any major life event: marriage, birth, death or a move.",
          ],
        },
        {
          heading: "Unclaimed money",
          paragraphs: [
            "Deposits not operated for ten years are transferred by banks to RBI's Depositor Education and Awareness Fund, from which the owner or heirs can still claim them. RBI's UDGAM portal lets you search for unclaimed deposits across banks. Checking once for elderly relatives is worthwhile.",
          ],
        },
      ],
    },
    {
      title: "EPF and VPF beside PPF and NPS",
      paragraphs: [
        "Most salaried people already have a large safe retirement saving without choosing it: the Employees' Provident Fund. Any plan using PPF or NPS should start by counting it.",
      ],
      sections: [
        {
          heading: "How EPF builds",
          paragraphs: [
            "You contribute 12 percent of basic pay plus DA; your employer contributes 12 percent too, of which 8.33 percent goes to the Employees' Pension Scheme on wages up to the ceiling and the rest to your EPF. Since 17 September 2026 the statutory wage ceiling is Rs. 25,000 a month, so the EPS share is at most about Rs. 2,083 a month. Many employers contribute on full basic pay.",
            "Interest is declared each year by EPFO; for 2024-25 it was 8.25 percent. Interest on employee contributions above Rs. 2.5 lakh a year is taxable, and withdrawals before five years of continuous service can be taxed.",
          ],
        },
        {
          heading: "Voluntary Provident Fund",
          paragraphs: [
            "You can ask your employer to deduct more than 12 percent as VPF. It earns the EPF rate, which has usually been above PPF's, with the same tax rules. For someone who wants more safe retirement saving and is under the Rs. 2.5 lakh contribution threshold, VPF is often the first place to add.",
          ],
        },
        {
          heading: "Putting them together",
          paragraphs: [
            "A typical salaried plan might use EPF and VPF as the main safe retirement saving, PPF for additional tax-free safe saving that also suits non-retirement goals after 15 years, NPS for employer contributions and some equity growth with a lock until 60, and equity mutual funds for the rest of the growth.",
            "Count all of them when you work out whether retirement is on track. People who ignore EPF often over-save in deposits and under-invest for growth.",
          ],
        },
      ],
    },
    {
      title: "A retirement income plan, worked",
      paragraphs: [
        "Here is one illustrative plan for a couple retiring together, showing how the products in this book combine. The Menons, both 60, in Thrissur, have Rs. 1.2 crore of savings beyond their house and want Rs. 75,000 a month, rising with inflation.",
      ],
      sections: [
        {
          table: {
            caption: "Allocation and yearly income, before tax. Rates as for October to December 2026 or illustrated.",
            headers: ["Product", "Amount", "Rate", "Yearly income"],
            rows: [
              ["SCSS, each spouse Rs. 30 lakh", "60,00,000", "8.2%", inr(6000000 * 0.082)],
              ["Joint MIS", "15,00,000", "7.4%", inr(1500000 * 0.074)],
              ["Deposit ladder, 1 to 5 years", "15,00,000", "~7%", "Maturities as needed"],
              ["Balanced and index funds", "25,00,000", "Illustrated 8%", "Growth; refills the ladder"],
              ["Savings and sweep deposit", "5,00,000", "~3-6%", "Emergency reserve"],
            ],
          },
          paragraphs: [
            `SCSS and MIS together pay about ${Rs(6000000 * 0.082 + 1500000 * 0.074)} a year, about ${Rs((6000000 * 0.082 + 1500000 * 0.074) / 12)} a month. The ladder tops up the rest to Rs. 75,000. The funds are left to grow and are used to rebuild the ladder in good years, so the plan can keep pace with inflation over a 25-year retirement.`,
            "When SCSS matures after five years they can extend it or reinvest at the rates then available. Each spouse files a return, and each claims the senior citizens' deductions available in their chosen regime.",
          ],
        },
        {
          heading: "What could go wrong",
          bullets: [
            "Inflation higher than expected: increase withdrawals from the fund portion slowly and trim discretionary spending.",
            "A large medical bill: the emergency reserve and health insurance come first; the ladder is second.",
            "Falling interest rates at renewal: the fund portion and an annuity for part of the money can steady income.",
            "One spouse dying: joint holdings and nominations let the survivor continue without delay; SCSS in the deceased's name can usually be continued by a spouse who is eligible.",
          ],
        },
      ],
    },
    {
      title: "Questions to ask at the counter",
      paragraphs: ["Take this list to the bank or post office. Write the answers on the receipt."],
      sections: [
        {
          steps: [
            "What is the exact rate, and is there a higher rate for senior citizens or for a slightly different tenure?",
            "How often is interest compounded, and what is the maturity amount in rupees?",
            "Is the deposit breakable early, and what is the penalty?",
            "Will interest be paid out or reinvested, and when?",
            "Will TDS be deducted, and do you have my Form 15G or 15H for this year?",
            "Who is the nominee, and is the account in either-or-survivor mode if joint?",
            "What happens at maturity: automatic renewal at the then-current rate, or credit to my account?",
            "Is this product a deposit, or is it insurance or a mutual fund being sold at the bank? If it is not a deposit, it is not covered by deposit insurance.",
          ],
          note: "Banks sometimes sell insurance and investment products at the same counter as deposits. Ask plainly whether what you are signing is a fixed deposit. If it involves premiums, it is insurance.",
        },
      ],
    },
    {
      title: "The same money in three homes",
      paragraphs: [
        "To see the products side by side, put Rs. 1 lakh a year into each for 20 years, using the October to December 2026 PPF rate, an illustrative FD rate taxed at 20 percent, and an illustrative NPS return.",
      ],
      sections: [
        {
          table: {
            caption: "Rs. 1,00,000 a year for 20 years. Illustrations, not forecasts.",
            headers: ["Product", "Assumed return", "Value at 20 years", "Tax at the end"],
            rows: [
              ["PPF (extended once)", "7.1% tax-free", inr(ppf(100000, 7.1, 20).value), "None"],
              ["FD, interest taxed yearly at 20%", "7% → 5.6% after tax", inr(ppf(100000, 5.6, 20).value), "Already paid each year"],
              ["NPS, moderate mix", "9% illustrated", inr(ppf(100000, 9, 20).value), "Depends on exit rules"],
            ],
          },
          paragraphs: [
            "PPF beats the taxed deposit by a wide margin over two decades, purely because of tax. NPS shows a higher figure only because the illustration assumes a higher return; in a bad decade it could be lower. And NPS money is locked until 60, with part going to an annuity.",
            "The comparison is useful for one decision: for safe money you can lock for 15 years or more, a taxable deposit is the weakest of the three. For money you may need sooner, the deposit's flexibility is worth its lower after-tax return.",
          ],
        },
      ],
    },
    {
      title: "Mistakes that cost savers most",
      paragraphs: ["These come up again and again in households that save diligently and still fall short."],
      sections: [
        { label: "Locking emergency money", paragraphs: ["Putting the only reserve into PPF, NPS or a non-callable deposit, then borrowing at high rates when an emergency comes."] },
        { label: "Ignoring tax on deposits", paragraphs: ["Comparing a 7.5 percent FD with 7.1 percent PPF without noticing that the FD is taxed every year."] },
        { label: "Concentrating in one bank", paragraphs: ["Keeping far more than Rs. 5 lakh in a single bank, especially a small one, for a slightly higher rate."] },
        { label: "Missing nominations", paragraphs: ["Accounts without nominees, or with outdated ones, leaving families with months of paperwork."] },
        { label: "Letting PPF lapse", paragraphs: ["Missing the Rs. 500 minimum in a year and having to revive the account, or forgetting to apply for extension with deposits on time."] },
        { label: "Treating NPS corpus as spendable", paragraphs: ["Planning retirement as if the whole corpus is available as cash, when part must buy an annuity and the annuity income is taxable."] },
        { label: "Buying insurance as savings", paragraphs: ["Taking low-return endowment policies sold as deposits, and paying surrender charges to get out."] },
        { label: "Only fixed income for a long retirement", paragraphs: ["Holding everything in deposits for 25 or 30 years of retirement, and watching inflation shrink the income each year."] },
      ],
    },
    {
      title: "Choosing an annuity",
      paragraphs: [
        "At NPS exit, and sometimes with other retirement money, you will choose an annuity. The choice is permanent: most annuities cannot be surrendered once bought. A little time comparing options pays for decades.",
      ],
      sections: [
        {
          heading: "The main options",
          table: {
            caption: "Common annuity types. Rates differ by insurer and age; the order of rates is typical, not fixed.",
            headers: ["Option", "What it pays", "On death", "Relative rate"],
            widths: [1.5, 1.6, 1.6, 0.9],
            rows: [
              ["Life annuity", "Fixed income for life", "Stops; nothing to heirs", "Highest"],
              ["Life with return of purchase price", "Fixed income for life", "Purchase price paid to nominee", "Lower"],
              ["Joint life", "Income for life of both spouses", "Continues to survivor", "Lower"],
              ["Joint life with return of purchase price", "Income for both", "Price returned after both die", "Lowest of these"],
              ["Increasing annuity", "Starts lower, rises yearly", "Depends on variant", "Starts lower"],
              ["Deferred annuity", "Starts at a later age", "Depends on variant", "Higher once started"],
            ],
          },
        },
        {
          heading: "How to decide",
          paragraphs: [
            "If you are married and your spouse depends on the income, a joint-life option is usually right. If you want to leave capital to children and have other assets for that, a plain life annuity gives more income now. Return of purchase price suits people who want both income and an inheritance and accept lower income for it.",
            "Annuity rates are fixed at purchase for life, so buying when interest rates are high locks in more income. Some people split the annuity purchase across two or three years to avoid locking everything at one rate.",
          ],
        },
        {
          heading: "Inflation is the hidden cost",
          paragraphs: [
            `A level annuity of Rs. 25,000 a month buys what about ${Rs(25000 / Math.pow(1.06, 20))} buys today after 20 years at 6 percent inflation. If you live long, a level annuity will cover less and less. Pair it with growth assets, or consider an increasing option for part of it.`,
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Fifteen savers, from a new account holder to a retiree choosing an annuity. Small savings rates are those for October to December 2026; deposit and NPS rates are illustrations.",

  scenarios: [
    {
      title: "Opening a PPF at 25",
      paragraphs: [
        `Ankita, 25, in Pune, opened a PPF account with Rs. 50,000 a year, rising as her salary grows. Even at a flat Rs. 50,000 for 15 years at 7.1 percent, it would mature at about ${Rs(ppf(50000, 7.1, 15).value)}, tax-free.`,
        `She plans to extend it twice. At 40, with deposits continuing, a 25-year account at the same rate would hold about ${Rs(ppf(50000, 7.1, 25).value)}. The PPF is the safe part of her retirement plan; an equity SIP is the growth part.`,
        "She sets a standing instruction for 4 April each year, so the deposit earns for the whole year, and keeps the passbook scan in her password manager's notes with the account number.",
      ],
      lesson: "PPF suits the safe part of long-term saving. Deposit by 5 April to earn the full year's interest.",
    },
    {
      title: "Monthly PPF deposits",
      paragraphs: [
        "Vikram in Jaipur deposits Rs. 12,500 in his PPF every month, on salary day, the 10th. Over a year that is Rs. 1.5 lakh, the same as a single deposit.",
        "Because each deposit arrives after the 5th, it earns nothing in the month it is made. And because the balance builds through the year, his yearly interest is noticeably lower than if he deposited Rs. 1.5 lakh in early April.",
        "He moved his deposit date to the 1st of each month by changing his standing instruction to draw from a savings account where he parks money a few days before. Even better, in the years when a bonus arrives in March, he deposits the full Rs. 1.5 lakh on 1 April and stops the monthly instruction.",
      ],
      lesson: "PPF interest uses the lowest balance between the 5th and the month's end. Deposit early in the month, ideally early in the financial year.",
    },
    {
      title: "PPF for a daughter, or SSY",
      paragraphs: [
        "Kavitha in Coimbatore wanted to save for her six-year-old daughter's education and marriage. She compared PPF in the child's name with Sukanya Samriddhi Yojana.",
        `SSY paid 8.2 percent against PPF's 7.1, both tax-free. Rs. 1.5 lakh a year for 15 years at 8.2 percent, left to grow to 21 years from opening, illustrates to about ${Rs(ppf(150000, 8.2, 15).value * Math.pow(1.082, 6))}. SSY allows 50 percent withdrawal for education after 18 and closes at 21 years from opening or on marriage after 18.`,
        "She opened the SSY account. Both accounts would have shared the same Rs. 1.5 lakh deduction limit under the old regime, and she decided the higher rate and the purpose-built rules suited the goal.",
      ],
      lesson: "For a daughter under 10, SSY often pays more than PPF for the same safety and tax treatment.",
    },
    {
      title: "An emergency fund in a long deposit",
      paragraphs: [
        "Prakash in Hubballi had put his entire Rs. 3 lakh emergency fund into a five-year non-callable deposit at a slightly higher rate. When his father needed surgery eight months later, he could not withdraw it.",
        "He borrowed on his credit card for six weeks at a high rate until a relative lent him money. The extra interest he had earned on the deposit was a fraction of what the borrowing cost.",
        "He now keeps three months of expenses in a sweep deposit linked to his savings account, which earns deposit interest but can be drawn instantly, and only the money beyond that in longer deposits.",
        "He also bought a family health insurance policy, which would have covered most of the surgery and made the emergency fund's job much smaller.",
      ],
      lesson: "Emergency money must be instantly available. Never lock it in a non-callable or long deposit.",
    },
    {
      title: "TDS and Form 15H",
      paragraphs: [
        `Mrs Rao, 72, in Hyderabad has ${Rs(1500000)} in deposits earning 7.5 percent, about ${Rs(1500000 * 0.075)} of interest a year, plus a small pension. Her total income is below the taxable limit after the deductions available to her.`,
        "The bank deducted TDS on the interest, because it was above the Rs. 1 lakh threshold for seniors. Each April she now submits Form 15H to the bank, declaring that her income is not taxable, so no TDS is deducted.",
        "In the year before, she filed a return to claim a refund of the TDS deducted. Her son set a calendar reminder for every April to submit the form at each bank.",
      ],
      lesson: "If total income is not taxable, Form 15G or 15H stops TDS. Submit it every year at each bank.",
    },
    {
      title: "Too much in one bank",
      paragraphs: [
        "Ramesh in Kolkata had Rs. 40 lakh in deposits at one cooperative bank because it paid half a point more. When the bank was placed under restrictions, his withdrawals were limited.",
        "Deposit insurance covers up to Rs. 5 lakh per depositor per bank, including interest. Above that, his money depended on the bank's recovery. He eventually received the insured amount and then waited for the rest.",
        "He now keeps no more than about Rs. 5 lakh per bank, in his name and separately in joint names where appropriate, and prefers large banks and post office schemes for the rest, accepting a slightly lower rate for safety.",
        "The extra half point had been worth about Rs. 20,000 a year on his Rs. 40 lakh. The months of uncertainty, and the risk to everything above the insured amount, cost far more in worry than the interest had ever paid.",
      ],
      lesson: "Deposit insurance covers Rs. 5 lakh per depositor per bank. Spread large sums across sound institutions.",
    },
    {
      title: "A deposit ladder for a retired couple",
      paragraphs: [
        "Mr and Mrs D'Souza in Mangaluru retired with Rs. 25 lakh beyond their pensions. They needed about Rs. 4 lakh a year from it.",
        `They split Rs. 20 lakh into five deposits of Rs. 4 lakh maturing in years one to five, and kept Rs. 5 lakh in a sweep account. At 7.25 percent quarterly, the five-year deposit grows to about ${Rs(fd(400000, 7.25, 5))}.`,
        "Each year one deposit matures; they spend Rs. 4 lakh and reinvest any surplus as a new five-year deposit. Rate rises benefit them gradually; rate falls hurt only one-fifth of the money each year.",
        "They chose cumulative deposits for the ladder so that each maturity includes its interest, and submit Form 15H each April at both banks, since their income is below the taxable limit after the senior citizens' deductions.",
      ],
      lesson: "A ladder gives yearly cash without penalties and spreads interest-rate risk.",
    },
    {
      title: "NPS through an employer",
      paragraphs: [
        "Shalini in Gurugram was offered the option of her employer contributing 10 percent of her basic pay to NPS as part of her salary structure, out of the same CTC.",
        "Under the new tax regime, an employer's NPS contribution up to a limit tied to basic pay is deductible, while most other deductions are not. Moving part of her salary into employer NPS reduced her taxable income without changing her CTC.",
        `On a basic of Rs. 60,000 a month, 10 percent is Rs. 6,000 a month. At an illustrated 10 percent for 28 years, that builds about ${Rs(nps(6000, 10, 28).corpus)}. The trade-off is that the money is locked until 60 under NPS rules.`,
      ],
      lesson: "Employer NPS contributions are one of the few deductions in the new regime. Use them for money you are happy to lock until 60.",
    },
    {
      title: "Choosing an annuity share",
      paragraphs: [
        `Gopal, 60, in Nagpur, a private-sector employee, has an NPS corpus of ${Rs(4500000)}. The minimum annuity is 20 percent, ${Rs(900000)}, which at 6.5 percent pays about ${Rs(pension(900000, 6.5))} a month.`,
        `He has no other pension. Putting 50 percent, ${Rs(2250000)}, into an annuity would pay about ${Rs(pension(2250000, 6.5))} a month for life, covering his essential bills.`,
        "He chose a joint-life annuity with return of purchase price for 40 percent, so his wife continues to receive it and his children receive the capital later. The rest he took gradually, keeping two years of spending in deposits and the remainder in a balanced fund.",
        "The return-of-purchase-price option pays a lower monthly amount than a plain life annuity. He accepted that, because it meant the capital would not vanish if both he and his wife died early.",
      ],
      lesson: "The minimum annuity is a floor, not a recommendation. Buy enough guaranteed income to cover essentials.",
    },
    {
      title: "A small NPS corpus",
      paragraphs: [
        "Selvi in Madurai joined NPS at 50 through a bank and contributed for ten years. At 60 her corpus was about Rs. 7 lakh.",
        "Under the December 2025 rules, a total corpus of Rs. 8 lakh or less can be withdrawn in full. She took it as a lump sum and placed it in SCSS and a post office MIS, which together give her a monthly and quarterly income she can see and understand.",
        "Had her corpus been larger, she would have had to buy an annuity with part of it. She was glad she checked the current rules before buying one anyway out of habit.",
        "She also learned that she could have stayed invested and withdrawn later if she had not needed the money immediately. The flexibility to defer exit up to 85 is useful for people who have other income in their early sixties.",
      ],
      lesson: "Check the small-corpus rules at exit. A full withdrawal may be allowed and may suit you better than a small annuity.",
    },
    {
      title: "Comparing NSC and a bank FD",
      paragraphs: [
        `Harpreet in Ludhiana had ${Rs(200000)} for five years and compared NSC at 7.7 percent, compounded yearly, with a bank FD at 7.25 percent, compounded quarterly.`,
        `NSC: ${Rs(200000 * Math.pow(1.077, 5))} at maturity. FD: ${Rs(fd(200000, 7.25, 5))}. Both are taxable; NSC interest is deemed reinvested and, under the old regime, counts towards the savings deduction in the first four years.`,
        "She chose NSC for the higher rate and government backing, noting that unlike the FD it cannot be broken early except in limited cases.",
        "She kept the FD option for a separate Rs. 1 lakh she might need within the five years, because breaking an FD costs a modest penalty while NSC cannot normally be encashed early at all.",
        "In the new tax regime, which she uses, NSC gives no deduction, so the decision rested only on rate, safety and liquidity.",
      ],
      lesson: "Compare maturity values, not quoted rates, because compounding frequencies differ.",
    },
    {
      title: "PPF loan instead of a personal loan",
      paragraphs: [
        "Imtiaz in Srinagar needed Rs. 80,000 for his son's admission in the fourth year of his PPF account. A personal loan was offered at 14 percent.",
        "A PPF loan, available from the third to the sixth year, charges only 1 percentage point above the PPF rate, and can be up to 25 percent of the balance at the end of the second year preceding the loan. His balance qualified.",
        "He took the PPF loan, repaid it within 36 months as required, and noted that the loaned amount earns no PPF interest while outstanding, so the effective cost is about 1 percentage point a year.",
        "Repaying late would have raised the interest on the loan sharply under the scheme rules. He set a monthly instruction for the repayment so the loan cleared within two years.",
      ],
      lesson: "A PPF loan in years 3 to 6 is a cheap source of funds for short needs, if repaid on time.",
    },
    {
      title: "Extending a matured PPF",
      paragraphs: [
        `Nirmala in Bhopal's PPF matured after 15 years with about ${Rs(ppfFull.value)}. She did not need the money and wondered what to do.`,
        "She could close it, extend it for five years with deposits, or extend without deposits. Without deposits, the balance continues to earn the PPF rate tax-free and she can withdraw once a year. With deposits, she must apply within a year of maturity and can withdraw up to 60 percent of the balance at the start of the extension over the block.",
        `She extended with deposits, keeping it as the safe, tax-free core of her retirement savings. Over five more years at 7.1 percent, with Rs. 1.5 lakh a year, it grows to about ${Rs(ppf25.rows[19][2])}.`,
      ],
      lesson: "At maturity, extending PPF keeps tax-free growth. Apply in time if you want to continue deposits.",
    },
    {
      title: "Interest income in the new regime",
      paragraphs: [
        "Ajay in Indore moved to the new tax regime. He had Rs. 12 lakh in bank deposits earning about Rs. 87,000 a year, taxed at his 20 percent slab, so about Rs. 17,400 of tax a year.",
        "He shifted part of it to PPF, up to the yearly limit, because PPF interest is tax-free in both regimes, and part to a debt fund where tax is due only on redemption.",
        "He kept enough in deposits for liquidity. Over time, more of his safe savings sat in tax-free or tax-deferred forms, while the deposits served their real purpose of short-term safety.",
        "He also checked that his wife's deposits were truly hers. Money he had given her and she had deposited would have its interest clubbed with his income, so moving deposits between them would not have saved tax.",
      ],
      lesson: "In the new regime, tax-free PPF interest still matters. Use it for the long-term safe portion.",
    },
    {
      title: "Joint deposits and nominations",
      paragraphs: [
        "When Mr Iyer in Chennai died, his deposits were in his sole name with no nominee. His wife had to obtain a succession certificate before the bank would release them, which took months.",
        "Their daughter helped her mother put new deposits in joint names with either-or-survivor operation and add nominees to every account, PPF and NPS included.",
        "She also made a list of all accounts with bank names, account numbers and nominees, kept with the will, and told her brother where it was.",
        "While making the list, they found a fixed deposit that had matured four years earlier and been renewed automatically at a low rate, and a PPF account that had been discontinued for missed deposits. Both were sorted out in a week.",
        "The bank told them that nomination does not make the nominee the legal owner in every case; the nominee receives the money and may hold it for the legal heirs. Her mother wrote a simple will to make her wishes clear.",
      ],
      lesson: "Nominations and joint operation save families months of paperwork. Check every account.",
    },
    {
      title: "An insurance policy sold as a deposit",
      paragraphs: [
        "Mrs Kulkarni, 67, in Nashik went to her bank to renew a Rs. 5 lakh deposit. A staff member suggested a 'better deposit' with guaranteed returns. She signed, believing it was an FD.",
        "When she tried to withdraw a year later for a family need, she was told it was a single-premium life insurance policy with a five-year lock-in and surrender charges. The returns, once calculated, were below the FD rate she had been earning.",
        "Her son helped her complain to the bank in writing, then to the insurer's grievance cell within the free-look and complaint timelines, citing mis-selling. She recovered most of her money. She now asks one question at every renewal: is this a fixed deposit covered by DICGC?",
      ],
      lesson: "If it has premiums, a policy term or a 'maturity benefit', it is insurance, not a deposit. Ask before signing.",
    },
    {
      title: "VPF before PPF",
      paragraphs: [
        "Siddharth, 30, in Bengaluru, already contributes Rs. 1.5 lakh a year to PPF and wanted to add more safe retirement saving.",
        "His EPF contribution was 12 percent of a Rs. 40,000 basic, Rs. 57,600 a year. He asked HR to add VPF of Rs. 8,000 a month, bringing his own contribution to about Rs. 1.54 lakh a year, under the Rs. 2.5 lakh threshold above which interest on contributions becomes taxable.",
        "VPF earned the declared EPF rate, higher than PPF's 7.1 percent, with the same tax-free treatment within the limit. He kept his PPF going as well, since its 15-year maturity suits a mid-life goal while EPF is for retirement.",
      ],
      lesson: "For salaried savers, VPF can offer a higher safe rate than PPF, within the Rs. 2.5 lakh contribution limit.",
    },
    {
      title: "Automatic renewal at a low rate",
      paragraphs: [
        "Thomas in Kottayam had a five-year FD that matured when rates were low. The bank renewed it automatically for another five years at the rate on that day, which was a full percentage point below what he had been earning.",
        "A year later, rates had risen. He could break the deposit and pay a penalty, or stay locked at the low rate for four more years. He worked out both: the penalty was smaller than four years of lower interest, so he broke it and reinvested.",
        "He now sets maturity instructions to credit his savings account and diarises each maturity date, so every renewal is a decision rather than a default.",
      ],
      lesson: "Automatic renewal is convenient but may lock you into a poor rate. Make each renewal a deliberate choice.",
    },
    {
      title: "NPS for a self-employed designer",
      paragraphs: [
        "Fatima, a freelance designer in Lucknow, has no employer EPF. She opened an NPS account online and contributes irregularly, more in good months and the minimum in lean ones.",
        `She chose an aggressive life-cycle option because she is 32 and retirement is far away. If she averages Rs. 7,000 a month for 28 years at an illustrated 10 percent, the corpus would be about ${Rs(nps(7000, 10, 28).corpus)}.`,
        "Under the old regime she could have claimed the extra Rs. 50,000 NPS deduction; under the new regime, which suits her better overall, there is no deduction for her own contributions. She contributes anyway, for the low cost and the discipline the lock-in gives a self-employed person.",
      ],
      lesson: "Self-employed people without EPF can use NPS as a low-cost retirement base, with flexible contributions.",
    },
    {
      title: "A senior's TDS on SCSS",
      paragraphs: [
        "Mr Bose, 66, in Kolkata invested Rs. 30 lakh in SCSS. Interest of Rs. 2.46 lakh a year exceeded the TDS threshold, so tax was deducted at the post office.",
        "His total income, including a pension, was taxable, so TDS was appropriate. But he had overpaid because TDS was deducted at a flat rate that did not reflect his deductions. He filed a return and received a refund.",
        "He now estimates his tax at the start of each year and, if no tax is due, submits Form 15H; if some is due, he pays advance tax so that TDS and his liability roughly match and no large refund or demand arises.",
      ],
      lesson: "TDS is an advance payment, not the final tax. Match it to your real liability with Form 15H or a return.",
    },
    {
      title: "Reviving a lapsed PPF",
      paragraphs: [
        "Arun in Visakhapatnam opened a PPF in 2017 but deposited nothing in 2021 and 2022 during a job change. The account showed as discontinued.",
        "He visited the bank, paid the minimum Rs. 500 for each missed year plus a penalty of Rs. 50 per year, and the account was revived. The balance had continued to earn interest during the lapse, but he could not take a loan or partial withdrawal while it was discontinued.",
        "He then set a standing instruction for the first week of April each year, for at least the minimum, so the account cannot lapse again even in a difficult year.",
        "He also learned that the 15-year maturity date had not moved because of the lapse; the account still matures on schedule, with whatever he deposits in the remaining years.",
      ],
      lesson: "A lapsed PPF can be revived cheaply. A standing instruction for at least the minimum prevents it.",
    },
    {
      title: "A PPF for a newborn",
      paragraphs: [
        "When their son was born, Nisha and Rohan in Ahmedabad opened a PPF in his name with Nisha as guardian, depositing Rs. 50,000 a year.",
        `In 15 years at 7.1 percent it would hold about ${Rs(ppf(50000, 7.1, 15).value)}, tax-free, just as he finishes school. Because deposits in a minor's account count within the guardian's Rs. 1.5 lakh limit, Nisha's own PPF deposits were reduced to Rs. 1 lakh a year.`,
        "Income from investments in a minor's name is normally clubbed with the parent's, but PPF interest is tax-free anyway, so clubbing makes no difference. The account becomes the son's to operate at 18.",
        "They also named each other as the operating guardian's backup in their wills, so that if anything happened to Nisha, Rohan could take over the account without a delay.",
      ],
      lesson: "A child's PPF suits a goal 15 years away. It shares the guardian's yearly limit.",
    },
    {
      title: "Deposits for a planned purchase",
      paragraphs: [
        `Rekha in Mysuru plans to buy a car in two years for about Rs. 8 lakh. She has Rs. 4 lakh and can save Rs. 15,000 a month.`,
        `A two-year FD for the Rs. 4 lakh at 7 percent grows to about ${Rs(fd(400000, 7, 2))}. A two-year RD of Rs. 15,000 a month at 7 percent matures at about ${Rs(rd(15000, 7, 2).value)}. Together they cover the goal.`,
        "She avoided equity funds for this goal: two years is too short to recover from a fall. The deposits' tax on interest is a small price for certainty of the amount on the date she needs it.",
        "If the car's price rises before she buys, she will take a small loan for the difference rather than stretch the timeline and keep paying for repairs on her old car.",
      ],
      lesson: "For goals within two or three years, deposits give certainty that equity cannot.",
    },
    {
      title: "Government employee and the 40 percent rule",
      paragraphs: [
        "Shanta, a central government employee in Delhi covered by NPS, heard that the annuity minimum had fallen to 20 percent and planned to take 80 percent as cash at retirement.",
        "Her colleague pointed out that the December 2025 change to 20 percent applied to non-government subscribers. Government employees under NPS must still use at least 40 percent for an annuity at normal exit.",
        "She adjusted her plan: 40 percent to a joint-life annuity, 60 percent lump sum to be placed in SCSS and a deposit ladder, and checked whether any newer pension options for government employees applied to her service.",
        "She also confirmed the annuity provider and option she wanted a few months before retirement, so the paperwork would be ready on her last working day and the pension would start without a gap.",
      ],
      lesson: "NPS rules differ for government and non-government subscribers. Check which apply to you.",
    },
    {
      title: "A deposit in a minor's name",
      paragraphs: [
        "Harish in Pune opened FDs in his 12-year-old daughter's name, thinking the interest would be taxed as hers and below the taxable limit.",
        "Under the clubbing rules, income from investments in a minor's name is added to the income of the parent with the higher income, after a small exemption per child. The interest was taxable in Harish's hands at his 30 percent slab.",
        "He moved part of the money to PPF and SSY in her name, where interest is tax-free, and kept the FDs for liquidity, reporting their interest in his own return.",
        "When she turns 18, income from her own investments becomes hers, and with little other income she will pay little or no tax on it. Until then, the tax-free products do the work.",
      ],
      lesson: "Interest on a minor's deposits is usually taxed as the parent's. Tax-free products avoid the issue.",
    },
    {
      title: "Retiring abroad with Indian savings",
      paragraphs: [
        "Mr and Mrs Fernandes, both 61, planned to spend most of each year with their daughter in Canada. Their savings in India were in SCSS, PPF and deposits.",
        "They learned that becoming non-resident for tax could affect some accounts: SCSS and PPF have restrictions for NRIs, and resident savings accounts must be redesignated as NRO. Their tax residency would depend on days spent in India each year.",
        "They decided to keep their residency status clear by planning their stays, kept SCSS until its five-year maturity, and consulted a tax professional on how Canadian and Indian tax would apply to their interest. They also set up internet banking and gave their nephew a limited power of attorney for paperwork in India.",
      ],
      lesson: "Moving abroad can change what you may hold and how it is taxed. Plan residency and accounts before you go.",
    },
    {
      title: "A widow's first year of paperwork",
      paragraphs: [
        "When Mr Kapoor died in Chandigarh, Mrs Kapoor, 64, had never handled the family's savings. She found deposits at three banks, a PPF account, NSCs and her husband's NPS.",
        "Where she was a joint holder with either-or-survivor operation, the banks removed his name with a death certificate. Where she was the nominee, she submitted claim forms. The NPS nominee claim allowed her to take the whole corpus, since he died before 60.",
        "With her son's help she consolidated everything into SCSS in her own name, a joint MIS with her son, and a ladder at one large bank, and wrote a single list of all her accounts and nominees. A year later she says the list is the most useful document in the house.",
      ],
      lesson: "Joint holding and nominations make the hardest year easier. Both spouses should know where everything is.",
    },
    {
      title: "Comparing an FD with a debt fund for three years",
      paragraphs: [
        "Ravi in Hyderabad, in the 30 percent slab, had Rs. 6 lakh for a goal three years away. He compared a three-year FD at 7.25 percent with a short-duration debt fund illustrated at 7.25 percent.",
        "The FD's interest is taxed every year at 30 percent; the fund's gain is taxed at his slab only when he redeems, so the full amount compounds until then. The fund's return is not fixed, though, and could be slightly lower or higher.",
        "He split it: half in the FD for certainty, half in the fund for tax deferral. The difference in outcome is modest either way; the decision was about how much certainty he wanted on the goal date.",
      ],
      lesson: "Debt funds defer tax but do not guarantee returns. Deposits guarantee the rate but tax it yearly.",
    },
  ],

  problemIntro: "Rates are those for October to December 2026 where stated, otherwise illustrations. Use the site's PPF, FD and NPS calculators to check.",

  problems: [
    {
      title: "PPF maturity",
      q: ["Rs. 1 lakh deposited by 5 April each year for 15 years at 7.1 percent. Maturity value and interest?"],
      steps: ["Each year: balance = (balance + 1,00,000) × 1.071."],
      answer: `${Rs(ppf(100000, 7.1, 15).value)}; interest ${Rs(ppf(100000, 7.1, 15).value - 1500000)}, tax-free.`,
    },
    {
      title: "Cost of a late deposit",
      q: ["You deposit Rs. 1.5 lakh in PPF on 6 April instead of 4 April. How much interest is lost for that year, at 7.1 percent?"],
      steps: ["April's interest is calculated on the lowest balance between 5 and 30 April, which excludes the deposit.", "Lost: one month on 1.5 lakh = 1,50,000 × 7.1 ÷ 1200."],
      answer: `About ${Rs((150000 * 7.1) / 1200)}.`,
    },
    {
      title: "FD maturity",
      q: ["Rs. 3 lakh in a 3-year FD at 7.1 percent, compounded quarterly."],
      steps: ["A = P × (1 + 0.071/4)^(12)."],
      answer: `${Rs(fd(300000, 7.1, 3))}; interest ${Rs(fd(300000, 7.1, 3) - 300000)}.`,
    },
    {
      title: "Effective yield",
      q: ["What is the effective yearly yield of 7.5 percent compounded quarterly? Monthly?"],
      steps: ["Quarterly: (1 + 0.075/4)^4 − 1.", "Monthly: (1 + 0.075/12)^12 − 1."],
      answer: `${p2(effYield(7.5))} percent quarterly; ${p2(effYield(7.5, 12))} percent monthly.`,
    },
    {
      title: "Post-tax FD return",
      q: ["A 7.25 percent FD for someone in the 30 percent slab. What is the after-tax yield, roughly, and how does it compare with PPF?"],
      steps: ["After tax ≈ 7.25 × 0.7 = 5.08 percent (ignoring cess and compounding detail).", "PPF 7.1 percent is tax-free."],
      answer: "About 5.1 percent after tax against 7.1 percent tax-free for PPF, for money that can be locked.",
    },
    {
      title: "Recurring deposit",
      q: ["Rs. 8,000 a month for 3 years at 7 percent. Maturity value?"],
      steps: ["Each instalment compounds quarterly from its deposit month to maturity."],
      answer: `About ${Rs(rd(8000, 7, 3).value)} from ${Rs(rd(8000, 7, 3).deposited)} deposited.`,
    },
    {
      title: "SCSS income",
      q: ["Rs. 15 lakh in SCSS at 8.2 percent. Quarterly interest? Yearly?"],
      steps: ["15,00,000 × 8.2 ÷ 100 ÷ 4."],
      answer: `${Rs((1500000 * 8.2) / 400)} a quarter; ${Rs((1500000 * 8.2) / 100)} a year, taxable.`,
    },
    {
      title: "MIS income",
      q: ["A joint MIS account of Rs. 15 lakh at 7.4 percent. Monthly income?"],
      steps: ["15,00,000 × 7.4 ÷ 100 ÷ 12."],
      answer: `${Rs((1500000 * 7.4) / 1200)} a month.`,
    },
    {
      title: "NSC maturity",
      q: ["Rs. 1 lakh in NSC at 7.7 percent, compounded yearly for 5 years."],
      steps: ["1,00,000 × 1.077^5."],
      answer: `${Rs(100000 * Math.pow(1.077, 5))}.`,
    },
    {
      title: "KVP doubling",
      q: ["At 7.5 percent compounded yearly, roughly how long does money take to double? Check with the rule of 72."],
      steps: ["72 ÷ 7.5 = 9.6 years.", `Exact: ln 2 ÷ ln 1.075 = ${(Math.log(2) / Math.log(1.075)).toFixed(2)} years.`],
      answer: "About 9.6 years, a little under 10, which is in line with the scheme's stated term of 115 months.",
    },
    {
      title: "NPS corpus",
      q: ["Rs. 6,000 a month from 35 to 60 at an illustrated 9.5 percent."],
      steps: ["Monthly compounding over 300 months."],
      answer: `About ${Rs(nps(6000, 9.5, 25).corpus)} from ${Rs(nps(6000, 9.5, 25).invested)} contributed.`,
    },
    {
      title: "NPS split at exit",
      q: ["For the corpus in Problem 11, non-government rules: minimum annuity and maximum lump sum?"],
      steps: ["Annuity at least 20 percent; lump sum up to 80 percent."],
      answer: `Annuity at least ${Rs(nps(6000, 9.5, 25).corpus * 0.2)}; lump sum up to ${Rs(nps(6000, 9.5, 25).corpus * 0.8)}.`,
    },
    {
      title: "Pension from an annuity",
      q: ["An annuity purchase of Rs. 12 lakh at 6.75 percent a year. Monthly pension?"],
      steps: ["12,00,000 × 6.75 ÷ 100 ÷ 12."],
      answer: `${Rs(pension(1200000, 6.75))} a month, taxable as income.`,
    },
    {
      title: "Deposit insurance",
      q: ["You hold Rs. 4.2 lakh in an FD and Rs. 1.5 lakh in savings at one bank, all in your sole name. How much is insured if the bank fails?"],
      steps: ["Total = 5.7 lakh, including interest credited.", "Limit = 5 lakh per depositor per bank in the same capacity."],
      answer: "Rs. 5 lakh. Rs. 70,000 is uninsured.",
    },
    {
      title: "TDS threshold",
      q: ["A non-senior earns Rs. 48,000 interest at Bank A and Rs. 30,000 at Bank B in a year. Is TDS deducted?"],
      steps: ["The threshold applies per bank: Rs. 50,000 for non-seniors.", "Neither bank crosses it."],
      answer: "No TDS, but all Rs. 78,000 is still taxable and must be reported in the return.",
    },
    {
      title: "PPF loan limit",
      q: ["In the fourth year of a PPF account, the balance at the end of the second year was Rs. 3.2 lakh. What is the maximum loan?"],
      steps: ["25 percent of the balance at the end of the second year preceding the year of the loan."],
      answer: "Rs. 80,000.",
    },
    {
      title: "Premature FD withdrawal",
      q: ["A 3-year FD of Rs. 2 lakh at 7.1 percent is broken after 18 months. The bank's 1-year rate was 6.8 percent and the penalty is 1 point. Roughly what interest do you get?"],
      steps: ["Applicable rate = rate for the period held (assume 6.8%) minus 1 = 5.8 percent.", "Interest for 1.5 years at 5.8 percent compounded quarterly."],
      answer: `About ${Rs(fd(200000, 5.8, 1.5) - 200000)}, against ${Rs(fd(200000, 7.1, 1.5) - 200000)} had the original rate applied.`,
    },
    {
      title: "Ladder cash flow",
      q: ["A ladder of five deposits of Rs. 3 lakh each, at 7 percent quarterly, maturing in years 1 to 5. What does each pay at maturity?"],
      steps: ["A = 3,00,000 × (1.0175)^(4n) for n = 1 to 5."],
      answer: [1, 2, 3, 4, 5].map((n) => `year ${n}: ${Rs(fd(300000, 7, n))}`).join("; ") + ".",
    },
    {
      title: "Real return on a deposit",
      q: ["An FD pays 7 percent, tax at 20 percent, inflation 5.5 percent. Real after-tax return?"],
      steps: ["After tax: 7 × 0.8 = 5.6 percent.", "Real: 1.056 ÷ 1.055 − 1."],
      answer: `About ${p2((1.056 / 1.055 - 1) * 100)} percent: almost nothing. Deposits preserve money; they rarely grow it in real terms after tax.`,
    },
    {
      title: "PPF in 25 years versus FD",
      q: ["Rs. 1.5 lakh a year for 25 years: PPF at 7.1 percent tax-free, or FDs at 7.25 percent taxed at 30 percent each year. Compare."],
      steps: [`PPF: ${Rs(ppf25.value)}.`, `FD at after-tax ${(7.25 * 0.7).toFixed(2)} percent, compounded yearly for simplicity: ${Rs(ppf(150000, 7.25 * 0.7, 25).value)}.`],
      answer: `PPF ends about ${Rs(ppf25.value - ppf(150000, 7.25 * 0.7, 25).value)} higher.`,
    },
    {
      title: "Employer NPS deduction",
      q: ["Basic plus DA is Rs. 80,000 a month. Under the new regime the employer NPS deduction limit is 14 percent of basic plus DA. What is the maximum yearly deductible contribution?"],
      steps: ["80,000 × 12 × 14%."],
      answer: `${Rs(80000 * 12 * 0.14)} a year. Check the current percentage, which differs between regimes and has changed in recent budgets.`,
    },
    {
      title: "Annuity versus withdrawal",
      q: ["Rs. 20 lakh at 60. An annuity at 6.75 percent, or withdrawals of the same monthly amount from a fund at an illustrated 8 percent. How long would the fund last?"],
      steps: [`Annuity income: ${Rs(pension(2000000, 6.75))} a month for life.`, "Fund: grow monthly at 8/12 percent, subtract that amount, until zero."],
      answer: (() => {
        const w = pension(2000000, 6.75);
        let b = 2000000;
        let m = 0;
        while (b > 0 && m < 1200) {
          b = b * (1 + 8 / 1200) - w;
          m += 1;
        }
        return m >= 1200 ? "The fund would not run out at that steady rate, because withdrawals are below its growth; but returns are not guaranteed, while the annuity is." : `About ${Math.floor(m / 12)} years. The annuity pays for life; the fund keeps the capital for heirs but carries market risk.`;
      })(),
    },
    {
      title: "SSY maturity sketch",
      q: ["Rs. 1 lakh a year in SSY for 15 years at 8.2 percent, then left until year 21. Illustrated maturity?"],
      steps: ["15 years of deposits compounded yearly, then 6 more years of growth."],
      answer: `About ${Rs(ppf(100000, 8.2, 15).value * Math.pow(1.082, 6))}, tax-free.`,
    },
    {
      title: "Splitting across banks",
      q: ["A couple has Rs. 18 lakh to deposit and wants every rupee within deposit insurance. What is the fewest number of banks if each spouse holds deposits in their own name?"],
      steps: ["Each person in each bank: Rs. 5 lakh cover.", "Two people per bank: Rs. 10 lakh per bank.", "18 ÷ 10 = 1.8, so two banks."],
      answer: "Two banks, each with up to Rs. 5 lakh in each spouse's sole name, with interest kept within the limit.",
    },
    {
      title: "Withdrawal from an extended PPF",
      q: ["A PPF account is extended with deposits at maturity, when the balance is Rs. 40 lakh. What is the maximum total withdrawal over the five-year block?"],
      steps: ["Up to 60 percent of the balance at the start of the extension, in one or more withdrawals, one per year."],
      answer: "Rs. 24 lakh over the block.",
    },
    {
      title: "VPF headroom",
      q: ["Basic plus DA is Rs. 1.2 lakh a month. Employee EPF is 12 percent. How much VPF a month keeps total employee contributions at Rs. 2.5 lakh a year?"],
      steps: ["EPF = 1,20,000 × 12% × 12 = 1,72,800.", "Headroom = 2,50,000 − 1,72,800 = 77,200 a year."],
      answer: "About Rs. 6,433 a month.",
    },
    {
      title: "Penalty or stay",
      q: ["A Rs. 5 lakh FD has 4 years left at 6 percent. Current 4-year rates are 7.25 percent. Breaking costs 1 percentage point on the year already held at 6 percent. Should you break it?"],
      steps: ["Penalty: about 1 percent of 5 lakh for one year = Rs. 5,000.", "Extra interest from switching: about 1.25 percent a year for 4 years on 5 lakh ≈ Rs. 25,000 plus compounding."],
      answer: "Break and reinvest: the gain is far larger than the penalty, assuming the money stays deposited for four years.",
    },
    {
      title: "SCSS and MIS together",
      q: ["One spouse has Rs. 30 lakh in SCSS and the couple has Rs. 15 lakh in joint MIS. Total yearly income?"],
      steps: ["SCSS: 30,00,000 × 8.2% = 2,46,000.", "MIS: 15,00,000 × 7.4% = 1,11,000."],
      answer: "Rs. 3,57,000 a year, about Rs. 29,750 a month, before tax.",
    },
    {
      title: "Real value of a pension",
      q: ["An annuity pays Rs. 20,000 a month, fixed. What is it worth in today's money after 15 years at 6 percent inflation?"],
      steps: ["20,000 ÷ 1.06^15."],
      answer: `About ${Rs(20000 / Math.pow(1.06, 15))} a month. Fixed pensions lose a lot of value over a long retirement.`,
    },
    {
      title: "Increasing annuity",
      q: ["An annuity starts at Rs. 15,000 a month and rises 3 percent a year. What does it pay in year 11?"],
      steps: ["15,000 × 1.03^10."],
      answer: `About ${Rs(15000 * Math.pow(1.03, 10))} a month. Increasing annuities start lower than level ones for the same price.`,
    },
    {
      title: "PPF monthly versus yearly",
      q: ["Compare one year of PPF at 7.1 percent: Rs. 1.5 lakh on 1 April, versus Rs. 12,500 on the 1st of every month."],
      steps: ["Yearly: 1,50,000 × 7.1% = 10,650.", "Monthly: each deposit earns interest for the months remaining including its own month: 12,500 × 7.1/1200 × (12 + 11 + ... + 1) = 12,500 × 0.0059167 × 78."],
      answer: `Rs. 10,650 against about ${Rs(12500 * (7.1 / 1200) * 78)}: the single April deposit earns roughly twice the first year's interest.`,
    },
    {
      title: "Insured amount across accounts",
      q: ["You hold Rs. 3 lakh in your name and Rs. 4 lakh jointly with your spouse (you first holder) at the same bank. How much is insured?"],
      steps: ["Deposits held in different capacities are insured separately: sole and joint accounts count separately.", "Sole: 3 lakh, within 5 lakh.", "Joint: 4 lakh, within 5 lakh."],
      answer: "All Rs. 7 lakh, because the sole and joint accounts are in different capacities, each within its Rs. 5 lakh limit.",
    },
    {
      title: "EPS contribution under the new ceiling",
      q: ["Basic plus DA is Rs. 40,000. Under the Rs. 25,000 ceiling, how much of the employer's 12 percent goes to EPS, and how much to EPF?"],
      steps: ["EPS = 8.33% of 25,000 ≈ 2,083.", "Employer total = 12% of 40,000 = 4,800 if on full basic.", "EPF share = 4,800 − 2,083."],
      answer: "About Rs. 2,083 to EPS and Rs. 2,717 to EPF, if the employer contributes on full basic.",
    },
    {
      title: "PPF revival cost",
      q: ["A PPF account missed deposits for 3 years. Revival requires Rs. 500 per missed year plus Rs. 50 penalty per year. Total cost?"],
      steps: ["3 × 500 = 1,500.", "3 × 50 = 150."],
      answer: "Rs. 1,650, of which Rs. 1,500 is deposited into the account.",
    },
    {
      title: "Child PPF and parent limit",
      q: ["A parent deposits Rs. 60,000 in a child's PPF. How much more can the parent deposit in their own PPF that year?"],
      steps: ["Combined limit Rs. 1.5 lakh.", "1,50,000 − 60,000."],
      answer: "Rs. 90,000.",
    },
    {
      title: "Two-year goal with FD and RD",
      q: ["Rs. 3 lakh in a 2-year FD at 7 percent quarterly, plus Rs. 10,000 a month in a 2-year RD at 7 percent. Total at maturity?"],
      steps: [`FD: ${Rs(fd(300000, 7, 2))}.`, `RD: ${Rs(rd(10000, 7, 2).value)}.`],
      answer: `About ${Rs(fd(300000, 7, 2) + rd(10000, 7, 2).value)}.`,
    },
    {
      title: "Government NPS split",
      q: ["A government employee retires with an NPS corpus of Rs. 60 lakh. Minimum annuity purchase and maximum lump sum?"],
      steps: ["Government employees must use at least 40 percent for an annuity."],
      answer: "Annuity at least Rs. 24 lakh; lump sum up to Rs. 36 lakh.",
    },
    {
      title: "After-tax deposit for a senior",
      q: ["A senior in the 20 percent slab, in the old regime, earns Rs. 90,000 interest. With the Rs. 50,000 senior interest deduction, how much tax is saved by the deduction, before cess?"],
      steps: ["Deduction 50,000 × 20%."],
      answer: "Rs. 10,000.",
    },
    {
      title: "Annuity option trade-off",
      q: ["For Rs. 20 lakh, a life annuity pays 7 percent and a joint-life with return of purchase price pays 6 percent. Monthly difference?"],
      steps: [`Life: ${Rs(pension(2000000, 7))}.`, `Joint with ROP: ${Rs(pension(2000000, 6))}.`],
      answer: `${Rs(pension(2000000, 7) - pension(2000000, 6))} a month less for the protected option, which keeps paying the survivor and returns the Rs. 20 lakh.`,
    },
    {
      title: "Splitting an annuity purchase",
      q: ["You will buy annuities with Rs. 30 lakh, half now at 6.5 percent and half in two years at 7 percent. Total monthly income once both are bought?"],
      steps: [`First: ${Rs(pension(1500000, 6.5))}.`, `Second: ${Rs(pension(1500000, 7))}.`],
      answer: `About ${Rs(pension(1500000, 6.5) + pension(1500000, 7))} a month; the split spreads interest-rate risk.`,
    },
    {
      title: "FD versus debt fund for three years",
      q: ["Rs. 6 lakh for 3 years. FD at 7.25 percent, interest taxed yearly at 30 percent; debt fund at 7.25 percent, gain taxed at 30 percent at redemption. Compare net amounts."],
      steps: ["FD: grows at 7.25 × 0.7 = 5.075 percent after tax, compounded yearly for simplicity.", "Fund: 6,00,000 × 1.0725^3, then tax 30 percent on the gain."],
      answer: (() => {
        const a = 600000 * Math.pow(1.05075, 3);
        const g = 600000 * Math.pow(1.0725, 3) - 600000;
        const b = 600000 + g * 0.7;
        return `FD about ${Rs(a)}; fund about ${Rs(b)}. The fund is ahead by ${Rs(b - a)} if it earns the same rate, which it may not.`;
      })(),
    },
    {
      title: "How long PPF takes to double",
      q: ["At 7.1 percent tax-free, how long does a single deposit take to double?"],
      steps: ["Rule of 72: 72 ÷ 7.1.", `Exact: ln 2 ÷ ln 1.071 = ${(Math.log(2) / Math.log(1.071)).toFixed(2)}.`],
      answer: "About 10 years.",
    },
    {
      title: "Months of income from an emergency fund",
      q: ["Essentials cost Rs. 45,000 a month. An emergency fund holds Rs. 2.4 lakh. How many months does it cover, and what amount gives six months?"],
      steps: ["2,40,000 ÷ 45,000 = 5.3.", "6 × 45,000 = 2,70,000."],
      answer: "About 5 months; Rs. 2.7 lakh for six.",
    },
    {
      title: "Senior interest after deductions",
      q: ["A senior in the old regime earns Rs. 1.4 lakh interest a year. After the Rs. 50,000 deduction, how much interest is taxable?"],
      steps: ["1,40,000 − 50,000."],
      answer: "Rs. 90,000, taxed at the senior's slab rate along with other income.",
    },
    {
      title: "NPS corpus needed for a pension target",
      q: ["You want Rs. 30,000 a month from an annuity at 6.5 percent using 40 percent of your NPS corpus. What corpus is needed?"],
      steps: ["Annuity amount = 30,000 × 12 ÷ 0.065.", "Corpus = annuity amount ÷ 0.4."],
      answer: `Annuity purchase ${Rs((30000 * 12) / 0.065)}; corpus about ${Rs((30000 * 12) / 0.065 / 0.4)}.`,
    },
  ],

  exercises: {
    warmup: [
      { q: "What does EEE mean for PPF?", a: "Exempt at deposit (old regime), exempt on interest, exempt at maturity." },
      { q: "What is the maximum PPF deposit in a year?", a: "Rs. 1.5 lakh." },
      { q: "How much of a bank deposit is insured per depositor per bank?", a: "Up to Rs. 5 lakh including interest." },
      { q: "What is the PPF rate for October to December 2026?", a: "7.1 percent a year." },
      { q: "For a non-government NPS subscriber, what is the minimum share of the corpus that must buy an annuity at normal exit?", a: "20 percent, unless the corpus is Rs. 8 lakh or less." },
      { q: "Which form do senior citizens submit to avoid TDS when their income is not taxable?", a: "Form 15H." },
      { q: "What is Tier II in NPS?", a: "An optional voluntary account with flexible withdrawals and, for most people, no tax benefits." },
      { q: "What is VPF?", a: "Voluntary Provident Fund: extra contributions to EPF above the mandatory 12 percent, earning the EPF rate." },
      { q: "What is the EPF statutory wage ceiling from 17 September 2026?", a: "Rs. 25,000 a month." },
      { q: "Can most annuities be surrendered after purchase?", a: "No. Treat an annuity purchase as permanent." },
    ],
    practice: [
      { q: "Rs. 80,000 a year in PPF for 15 years at 7.1 percent. Maturity?", a: `${Rs(ppf(80000, 7.1, 15).value)}.` },
      { q: "Rs. 2 lakh FD for 2 years at 7 percent quarterly. Maturity?", a: `${Rs(fd(200000, 7, 2))}.` },
      { q: "Rs. 10 lakh in SCSS at 8.2 percent. Quarterly interest?", a: `${Rs((1000000 * 8.2) / 400)}.` },
      { q: "Rs. 4,000 a month RD for 5 years at 6.7 percent. Maturity?", a: `About ${Rs(rd(4000, 6.7, 5).value)}.` },
      { q: "NPS corpus Rs. 30 lakh, 25 percent to an annuity at 6.5 percent. Monthly pension?", a: `${Rs(pension(750000, 6.5))}.` },
      { q: "Why should an emergency fund not sit in PPF?", a: "PPF money cannot be withdrawn freely; loans and partial withdrawals are restricted by year and amount." },
      { q: "Rs. 50,000 a year in SSY for 15 years at 8.2 percent, left to 21 years. Illustrated maturity?", a: `About ${Rs(ppf(50000, 8.2, 15).value * Math.pow(1.082, 6))}.` },
      { q: "Explain why a 7 percent FD may give a negative real return.", a: "After tax at 30 percent it yields 4.9 percent; if inflation is above that, purchasing power falls." },
      { q: "A bank renews your FD automatically at a lower rate. What should you set to avoid this in future?", a: "A maturity instruction to credit the savings account, and a diary reminder to decide each renewal." },
      { q: "Compute the yearly interest on Rs. 9 lakh in a single MIS account at 7.4 percent.", a: "Rs. 66,600, paid as Rs. 5,550 a month." },
      { q: "Which annuity option suits a married retiree whose spouse has no income of their own?", a: "A joint-life annuity, so income continues to the survivor." },
      { q: "At 7.1 percent, roughly how many years does a PPF deposit take to double?", a: "About 10 years." },
      { q: "What is the insured limit for a married couple with one sole account each and one joint account at the same bank?", a: "Each capacity is insured separately up to Rs. 5 lakh, so up to Rs. 15 lakh across the three accounts if each is within its limit." },
    ],
    stretch: [
      { q: "Compare a 5-year post office time deposit at 7.5 percent (compounded quarterly) with a bank FD at 7.2 percent for Rs. 5 lakh.", a: `Post office: ${Rs(fd(500000, 7.5, 5))}. Bank: ${Rs(fd(500000, 7.2, 5))}.` },
      { q: "A retiree needs Rs. 50,000 a month. Using SCSS at its Rs. 30 lakh maximum and MIS at Rs. 9 lakh, how much is covered?", a: `SCSS ${Rs((3000000 * 8.2) / 1200)} a month equivalent; MIS ${Rs((900000 * 7.4) / 1200)}; total about ${Rs((3000000 * 8.2) / 1200 + (900000 * 7.4) / 1200)}, before tax.` },
      { q: "Explain why monthly PPF deposits earn less than a single April deposit of the same yearly total.", a: "Each monthly deposit earns interest only from the following month, and the average balance through the year is lower than with the full amount from April." },
      { q: "Design a ladder for Rs. 10 lakh to provide cash every year for five years.", a: "Five deposits of Rs. 2 lakh maturing at 1, 2, 3, 4 and 5 years; each maturity is spent or reinvested at 5 years." },
      { q: "An NPS subscriber at 60 has Rs. 10 lakh. What options does the December 2025 framework give, broadly?", a: "Above Rs. 8 lakh, special arrangements apply for corpuses up to Rs. 12 lakh, with a partial lump sum and the rest by annuity or phased withdrawals. Check the current regulations for the exact split." },
      { q: "A couple wants Rs. 60,000 a month in retirement income with no market risk, from Rs. 75 lakh. Propose a split.", a: `For example: each spouse Rs. 30 lakh in SCSS (${Rs((6000000 * 8.2) / 1200)} a month equivalent together) and Rs. 15 lakh joint MIS (${Rs((1500000 * 7.4) / 1200)} a month), totalling about ${Rs((6000000 * 8.2) / 1200 + (1500000 * 7.4) / 1200)} before tax. Inflation will erode it, so revisit at each five-year renewal.` },
      { q: "Explain why a salaried person might choose VPF over PPF for extra safe saving, and one reason to keep PPF anyway.", a: "VPF usually pays a higher declared rate with similar tax treatment within limits, and is deducted automatically. PPF is portable across jobs and self-employment, matures in 15 years for mid-life goals, and is not tied to an employer." },
      { q: "What is a level Rs. 30,000 monthly annuity worth in today's money after 15 years at 6 percent inflation?", a: `About ${Rs(30000 / Math.pow(1.06, 15))} a month.` },
      { q: "A retiree is offered a 'deposit' at the bank with a sum assured and a ten-year policy term. What is it, and what three questions should they ask?", a: "It is an insurance policy. Ask: what is the guaranteed maturity amount and its effective yearly return; what is the surrender value in each year; and what would the same money earn in SCSS or an FD." },
    ],
    challenge: [
      { q: "Build a safe-savings plan for a 35-year-old in the new regime with Rs. 25,000 a month to put away safely.", a: "PPF up to Rs. 1.5 lakh a year deposited early in April from accumulated savings; employer NPS if offered for the tax deduction; RD or FD for dated goals under five years; a sweep deposit for emergencies. Equity for growth is a separate decision." },
      { q: "Argue whether a non-government NPS subscriber should take the full 80 percent lump sum at 60.", a: "For: flexibility, control, money for heirs. Against: risk of spending too fast or investing badly, and loss of guaranteed lifelong income. Many people are better off buying enough annuity to cover essentials and withdrawing the rest gradually." },
      { q: "A parent asks whether to keep Rs. 40 lakh in one bank because it pays 0.4 percent more. Respond with numbers.", a: "Extra interest is about Rs. 16,000 a year. Only Rs. 5 lakh is insured; Rs. 35 lakh is exposed to the bank's failure. Spreading across banks or using government-backed schemes is worth more than the extra interest." },
      { q: "Explain how inflation and tax together make long FDs a poor retirement-growth tool, with an example.", a: "At 7 percent interest, 30 percent tax and 6 percent inflation, the real after-tax return is about −1 percent a year. Over 20 years, purchasing power falls even as the balance rises." },
      { q: "A grandparent wants to save for a granddaughter's education 14 years away with complete safety. Compare SSY in the child's name (opened by a parent) with PPF in the grandparent's name.", a: "SSY pays more and is purpose-built, but must be opened by a parent or guardian and is tied to the girl's age. PPF in the grandparent's name is flexible about who benefits but pays less and would pass through the grandparent's estate. A gift to the parent to fund SSY may achieve the goal best." },
      { q: "Critique this plan for a 62-year-old: all Rs. 50 lakh in a single bank's five-year FD, interest paid out monthly.", a: "Only Rs. 5 lakh is insured; interest is fully taxable; income is fixed while costs rise; no money matures before five years; no growth for a long retirement. Better: spread across banks and SCSS or MIS, ladder maturities, keep an emergency reserve, and hold some growth assets." },
      { q: "Design an emergency fund and safe-savings plan for a young couple with irregular income, using products from this book.", a: "Six to nine months of expenses in a sweep deposit split across two banks; PPF accounts for each with standing instructions for the minimum and top-ups in good months; an RD for the next year's known expenses; NPS for retirement with flexible contributions." },
    ],
  },

  faqs: [
    {
      group: "PPF",
      items: [
        ["Can I open more than one PPF account?", "No. One account per individual is allowed. You can open one for a minor child as guardian, but deposits in both count within the same Rs. 1.5 lakh yearly limit for the old-regime deduction and the scheme limit."],
        ["What happens if I miss a year's deposit?", "The account becomes discontinued. You can revive it by paying the minimum Rs. 500 for each missed year plus a small penalty per year. Deposit at least Rs. 500 every year to avoid this."],
        ["Can NRIs open or continue PPF?", "NRIs cannot open new PPF accounts. An account opened while resident can continue until maturity, but cannot be extended after that. Check current rules if your status changes."],
        ["Is PPF interest taxable in the new regime?", "No. PPF interest and maturity are tax-free in both regimes. Only the deduction for deposits is unavailable in the new regime."],
        ["Can I close PPF before 15 years?", "Premature closure is allowed after five completed years for specific reasons such as serious illness, higher education or a change in residency, with a reduction of 1 percentage point in interest for the whole period."],
        ["How is PPF interest calculated?", "On the lowest balance between the 5th and the last day of each month, at the rate for that quarter, and credited on 31 March. Deposit by the 5th to earn for that month."],
        ["Can my PPF be attached by a court for a debt?", "PPF balances are protected from attachment under a court decree for most debts, which makes them a safe store for long-term family savings."],
        ["Should I extend PPF after 15 years?", "If you do not need the money, extending keeps tax-free growth at the current rate. Extend with deposits if you want to continue contributing; apply within a year of maturity."],
        ["Does the PPF rate stay at what it was when I opened the account?", "No. The rate applies to the whole balance, old and new deposits alike, and changes whenever the government announces a new rate for the quarter. It has stayed at 7.1 percent for an extended period."],
      ],
    },
    {
      group: "Fixed and recurring deposits",
      items: [
        ["Why is my FD maturity higher than rate × years?", "Interest is usually compounded quarterly, so you earn interest on interest. The effective yearly yield is slightly above the quoted rate."],
        ["Is FD interest taxable even if I do not withdraw it?", "Yes. Interest on cumulative deposits is taxable in the year it accrues, not at maturity. Report it every year."],
        ["What is the TDS threshold on deposit interest?", "From April 2025, Rs. 50,000 a year per bank for most people and Rs. 1 lakh for senior citizens. Above that, TDS of 10 percent applies with a PAN."],
        ["Can I avoid TDS?", "If your total income is not taxable, submit Form 15G, or 15H if you are 60 or older, to each bank at the start of the financial year."],
        ["Are small finance bank deposits safe?", "They are regulated banks and covered by deposit insurance up to Rs. 5 lakh per depositor per bank. Their higher rates reflect higher risk. Keep amounts within the insured limit."],
        ["What is a tax-saving FD?", "A five-year bank deposit whose principal qualifies for the old-regime savings deduction. It cannot be broken early, and its interest is taxable."],
        ["Should I choose cumulative or non-cumulative?", "Cumulative if you do not need income now; it grows more. Non-cumulative if you need regular payouts, such as in retirement."],
        ["What is a sweep-in deposit?", "A savings account linked to a deposit. Money above a threshold moves to the deposit, and comes back automatically when the savings balance is short. It suits emergency funds."],
        ["What is a corporate FD?", "A deposit with a company or NBFC, often at a higher rate, without deposit insurance. Check its credit rating and keep amounts modest."],
      ],
    },
    {
      group: "NPS",
      items: [
        ["Who can join NPS?", "Indian citizens, including NRIs, aged 18 to 70 at joining. Accounts can be opened online or through banks and other points of presence."],
        ["What returns does NPS give?", "There is no fixed return. It depends on the funds and the mix you choose. Past returns of equity and bond funds in NPS have varied by manager and period."],
        ["Can I change my fund manager or mix?", "Yes. You can change the pension fund manager once a year and the asset allocation a few times a year."],
        ["What happens to NPS at 60?", "For non-government subscribers, up to 80 percent can be taken as a lump sum and at least 20 percent must buy an annuity, unless the corpus is Rs. 8 lakh or less. You can defer or phase withdrawals up to 85."],
        ["Is the NPS lump sum tax-free?", "Sixty percent of the corpus at exit has been tax-free for years. Check the current treatment of any lump sum above that before planning around it."],
        ["Is NPS pension taxable?", "Yes. Annuity income is added to your income and taxed at your slab rate in the year you receive it, like a salary or pension. The insurer may deduct TDS."],
        ["Can I withdraw from NPS before 60?", "Partial withdrawals for specified purposes are allowed after a minimum period, a limited number of times. Full exit before 60 requires most of the corpus to buy an annuity unless the corpus is small."],
        ["Should I join NPS in the new regime?", "Your own contributions get no deduction in the new regime, but employer contributions do. NPS can still be a low-cost retirement product; weigh the lock-in against alternatives."],
        ["What happens to NPS if I die before 60?", "The nominee receives the entire corpus, which can usually be taken as a lump sum or used for an annuity."],
      ],
    },
    {
      group: "Senior citizens and income",
      items: [
        ["What is the SCSS limit?", "Rs. 30 lakh per individual. A married couple can each invest up to the limit in their own names."],
        ["Is SCSS interest paid monthly?", "No, quarterly. For monthly income, combine SCSS with the post office MIS or a non-cumulative FD paying monthly."],
        ["Do seniors get higher FD rates?", "Most banks pay senior citizens an extra 0.25 to 0.75 percentage points. Compare the senior rate across banks."],
        ["Can a retiree under 60 invest in SCSS?", "Some retirees from 55, and defence retirees from 50, can invest within a set period after receiving retirement benefits. Check the current rules."],
        ["What is the best monthly income option?", "There is no single best. A mix of SCSS for the highest safe rate, MIS for monthly payouts, a deposit ladder for flexibility and an annuity for lifelong certainty often works well."],
        ["How do I plan for rising costs in retirement?", "Keep a portion in growth assets and increase withdrawals gradually. Fixed income alone loses purchasing power over a long retirement."],
      ],
    },
    {
      group: "Choosing between them",
      items: [
        ["Which is better: PPF or FD?", "For money you can lock for 15 years, PPF usually wins after tax. For money you may need within a few years, an FD is more flexible."],
        ["PPF or NPS for retirement?", "Both can play a part. PPF is guaranteed and tax-free; NPS can grow more through equity and offers an employer deduction in both regimes, but its value moves and part may have to buy an annuity."],
        ["Should I keep my emergency fund in an FD?", "A sweep-in deposit or a short FD you can break easily works. Avoid tax-saving or non-callable deposits for emergency money."],
        ["Are post office schemes safer than bank deposits?", "Post office small savings schemes are backed by the government. Bank deposits are insured up to Rs. 5 lakh per depositor per bank. Both are low risk for amounts within those terms."],
        ["How much should I keep in fixed-income products?", "It depends on your age, goals and tolerance for falls. Many people keep emergency money and near-term goals entirely in fixed income, and a share of long-term savings for stability."],
      ],
    },
    {
      group: "Small savings and post office",
      items: [
        ["How do I open a post office scheme?", "At a post office or, for many schemes, at authorised banks, with KYC documents. Many post offices now offer online access to view and deposit into PPF, RD and SSY accounts."],
        ["Can I transfer PPF between bank and post office?", "Yes. A PPF account can be transferred between post offices and authorised banks, or between branches, without breaking its continuity or its 15-year count. Apply at the office that holds it."],
        ["How often do small savings rates change?", "They are reviewed every quarter. Rates were unchanged through 2025 and 2026, but they can rise or fall with government bond yields."],
        ["Is NSC better than a tax-saving FD?", "Both lock money for five years. NSC currently pays more and is government-backed; the FD is insured up to Rs. 5 lakh. Both are taxable on interest. Compare current rates."],
        ["Can I buy KVP online?", "Availability varies. Many post offices issue it in person against KYC documents, and some authorised banks sell it too. Ask your post office whether online purchase is available for your account."],
        ["What is the minimum in SSY to keep the account active?", "Rs. 250 a year. If missed, the account can be revived with a small penalty for each year of default."],
        ["Can I hold a post office MIS jointly?", "Yes, with up to three adult holders. A joint account has a higher limit of Rs. 15 lakh, against Rs. 9 lakh for a single account, and each holder's share counts towards their own limit."],
        ["Are post office schemes affected by deposit insurance limits?", "No. They are obligations of the government, not of a bank, so the Rs. 5 lakh bank deposit insurance limit does not apply."],
      ],
    },
    {
      group: "Paperwork and family",
      items: [
        ["Who should I name as nominee?", "Usually your spouse or children, or parents if you are single. You can name more than one with shares in many accounts. Update nominations after marriage, birth or death in the family."],
        ["What is either-or-survivor?", "A joint account mode where either holder can operate it, and the survivor continues on the death of the other without a claim process."],
        ["How do heirs claim a deposit without a nominee?", "Usually with a death certificate, proof of relationship and, depending on the amount and bank policy, an indemnity, a legal heir certificate or a succession certificate. Nomination avoids most of this."],
        ["How do I find a forgotten deposit?", "Search RBI's UDGAM portal for unclaimed deposits across participating banks, and ask the bank directly with any old documents."],
      ],
    },
    {
      group: "EPF and VPF",
      items: [
        ["Is EPF better than PPF?", "For salaried people, EPF has usually paid a higher declared rate, and the employer adds a matching contribution. PPF is open to everyone and portable. Most salaried savers benefit from both."],
        ["Can I withdraw EPF before retirement?", "Partial withdrawals are allowed for purposes such as housing, education, marriage and illness after minimum periods of service, and full withdrawal after two months of unemployment. Rules change; check EPFO's current list."],
        ["What happens to EPF when I change jobs?", "Transfer it to the new employer's account using your UAN, rather than withdrawing. Withdrawals before five years of continuous service can be taxable, and you lose compounding."],
        ["Is VPF interest taxable?", "Interest is tax-free on total employee contributions, including VPF, up to Rs. 2.5 lakh a year. Interest on contributions above that is taxable."],
        ["Does the new Rs. 25,000 wage ceiling change my take-home?", "If your employer contributed on the old Rs. 15,000 ceiling, mandatory contributions rise to 12 percent of up to Rs. 25,000, so take-home may fall slightly while your PF and pension contributions rise."],
        ["What is EPS and what will it pay?", "The Employees' Pension Scheme gets 8.33 percent of wages up to the ceiling from the employer's share. It pays a formula-based pension from 58 after ten years of service; with the new ceiling the maximum pension rises."],
      ],
    },
    {
      group: "Mis-selling and safety",
      items: [
        ["How do I know if I am being sold insurance instead of a deposit?", "Words like premium, policy term, sum assured, maturity benefit or surrender value mean insurance. A deposit has a rate, a tenure and a maturity amount, and is covered by DICGC up to Rs. 5 lakh."],
        ["What can I do if I was mis-sold a policy?", "Within the free-look period, usually 15 to 30 days, you can cancel with a refund of premium minus small charges. Later, complain in writing to the insurer and then to the insurance ombudsman or IRDAI's grievance system."],
        ["Are high-rate deposits from companies safe?", "Company deposits and NBFC deposits are not covered by deposit insurance. Their higher rates reflect higher risk. Check the credit rating and limit how much you place with any one issuer."],
        ["Which is safer: a large private bank or a public sector bank?", "Both are regulated by RBI, and deposits at both are insured up to Rs. 5 lakh per depositor. Beyond that, size, capital and supervision matter more than ownership. Spreading deposits is the simplest protection."],
        ["Should I break a high-rate old FD to buy SCSS?", "Compare the remaining interest on the FD with SCSS's rate and the penalty for breaking. If the FD rate is lower than SCSS and the penalty small, switching often pays."],
        ["Is it worth keeping a post office savings account?", "It pays 4 percent and links to post office schemes for interest credits. If you hold MIS or SCSS at a post office, it is a convenient place for payouts."],
        ["Can a bank change my FD rate after I open it?", "No. A fixed deposit's rate is fixed for its term. Only renewals or new deposits take the new rate."],
      ],
    },
    {
      group: "Annuities",
      items: [
        ["Can I surrender an annuity once bought?", "Generally no, except under specific conditions such as return-of-purchase-price variants in limited cases. Treat the decision as permanent."],
        ["Can I choose the insurer for my NPS annuity?", "Yes. NPS lets you choose among empanelled annuity service providers and options at exit. Compare quotes for your age and option before deciding."],
        ["Are annuity payments taxed?", "Yes, annuity income is taxable as income each year. The return of purchase price to a nominee is generally not taxed as income in the nominee's hands."],
        ["What is a good annuity rate?", "It depends on age, option and interest rates at purchase. Older buyers get higher rates. Compare the rate with what SCSS or deposits pay, remembering that annuities pay for life."],
        ["Should I buy an annuity with more than the minimum?", "If you lack other guaranteed income, buying enough to cover essential bills gives security. Keep the rest flexible for emergencies and growth."],
        ["What happens to my annuity if the insurer has problems?", "Insurers are regulated by IRDAI, which sets solvency requirements and supervises insurers so that they can meet long-term promises. Choosing a large, established insurer, and splitting a big purchase between two insurers, reduces the risk further."],
      ],
    },
    {
      group: "Quick checks before you invest",
      items: [
        ["How much should I keep liquid?", "At least three to six months of essential expenses, more if your income is irregular or you support others. Keep it in a savings account, sweep deposit or liquid fund."],
        ["Is it safe to invest through a bank's app?", "Yes, for the bank's own deposits and for government schemes offered through it. Check whether a product shown in the app is a deposit, a mutual fund or insurance, because only deposits are covered by DICGC."],
        ["What documents do I need for small savings schemes?", "PAN, Aadhaar or other KYC documents, photographs and, for some schemes, proof of age or relationship. Keep copies with your account list."],
        ["Should I keep physical certificates?", "Many schemes now issue certificates electronically or credit them to an account. If you hold paper NSCs or KVPs, store them safely and record their numbers in your list."],
        ["What if interest rates fall after I invest?", "Fixed deposits, NSC, KVP, SCSS and post office time deposits keep their rate for the term. PPF, SSY and savings accounts move with announced rates. A mix of both smooths the effect."],
      ],
    },
  ],

  glossary: [
    ["Annuity", "A contract with an insurer paying regular income, often for life, in exchange for a lump sum."],
    ["Auto choice", "An NPS option where a life-cycle fund adjusts your equity share with age."],
    ["Cumulative deposit", "A deposit that reinvests interest until maturity."],
    ["DICGC", "Deposit Insurance and Credit Guarantee Corporation, which insures bank deposits up to Rs. 5 lakh per depositor per bank."],
    ["EEE", "Exempt-exempt-exempt: tax-free at deposit, on growth and at withdrawal."],
    ["Effective yield", "The yearly return including compounding within the year."],
    ["Extension block", "A five-year period by which a matured PPF account can be extended."],
    ["Fixed deposit", "A deposit for a fixed term at a fixed rate."],
    ["Form 15G and 15H", "Declarations that stop TDS on interest when total income is not taxable; 15H is for senior citizens."],
    ["KVP", "Kisan Vikas Patra: a post office certificate that doubles the deposit over a set term."],
    ["Ladder", "Deposits staggered to mature in successive years."],
    ["Lock-in", "A period during which money cannot be withdrawn, or only with penalties."],
    ["MIS", "Post Office Monthly Income Scheme, paying interest monthly for five years."],
    ["Nominee", "The person who receives an account's proceeds on the holder's death."],
    ["Non-callable deposit", "A deposit that cannot be withdrawn before maturity, usually at a slightly higher rate."],
    ["NPS", "National Pension System: a market-linked retirement account regulated by PFRDA."],
    ["NSC", "National Savings Certificate: a five-year post office certificate with yearly compounding."],
    ["PFRDA", "Pension Fund Regulatory and Development Authority, which regulates NPS."],
    ["PPF", "Public Provident Fund: a 15-year government-backed tax-free savings account."],
    ["Premature withdrawal", "Breaking a deposit before maturity, usually with a reduced rate."],
    ["Recurring deposit", "A deposit built from fixed monthly instalments."],
    ["SCSS", "Senior Citizens Savings Scheme, paying quarterly interest for five years."],
    ["SSY", "Sukanya Samriddhi Yojana: a tax-free savings scheme for a girl child."],
    ["Sweep-in deposit", "A savings account that moves surplus into a deposit and draws it back as needed."],
    ["TDS", "Tax deducted at source by the payer, such as a bank on deposit interest."],
    ["Tier I and Tier II", "The pension and voluntary accounts in NPS."],
    ["EPF", "Employees' Provident Fund: a mandatory retirement savings scheme for many salaried employees, with employer matching."],
    ["EPS", "Employees' Pension Scheme: the pension part of the employer's PF contribution."],
    ["Free-look period", "A window after buying an insurance policy during which you can cancel it for a refund."],
    ["Maturity instruction", "Your instruction to a bank on what to do with a deposit when it matures."],
    ["UAN", "Universal Account Number: the identifier that links your EPF accounts across employers."],
    ["VPF", "Voluntary Provident Fund: extra contributions to EPF beyond the mandatory share."],
    ["Wage ceiling", "The monthly wage up to which EPF contributions are mandatory: Rs. 25,000 from 17 September 2026."],
  ],

  references: [
    { title: "Small savings schemes interest rates", who: "Ministry of Finance, Department of Economic Affairs", where: "dea.gov.in and indiapost.gov.in", note: "Quarterly notifications of rates for PPF, SSY, SCSS, NSC, KVP, MIS and post office deposits." },
    { title: "Public Provident Fund Scheme, 2019", who: "Government of India, Ministry of Finance", where: "egazette.gov.in and indiapost.gov.in", note: "The rules on deposits, interest, loans, withdrawals, extension and closure." },
    { title: "PFRDA (Exits and Withdrawals under the National Pension System) Regulations, as amended December 2025", who: "Pension Fund Regulatory and Development Authority", where: "pfrda.org.in", note: "Current exit, annuity and withdrawal rules, including the 80/20 split for non-government subscribers and the Rs. 8 lakh full-withdrawal limit." },
    { title: "Deposit insurance", who: "Deposit Insurance and Credit Guarantee Corporation", where: "dicgc.org.in", note: "Coverage of Rs. 5 lakh per depositor per bank and how claims work." },
    { title: "Income-tax rules on interest, TDS and deductions", who: "Income Tax Department", where: "incometaxindia.gov.in", note: "TDS thresholds, Forms 15G and 15H, and deductions under each regime." },
    { title: "NPS trust and CRA portals", who: "NPS Trust and Central Recordkeeping Agencies", where: "npstrust.org.in", note: "Scheme returns by fund manager, account access and forms." },
    { title: "RBI Integrated Ombudsman Scheme", who: "Reserve Bank of India", where: "cms.rbi.org.in", note: "Complaints about bank deposits and services." },
  ],
};
