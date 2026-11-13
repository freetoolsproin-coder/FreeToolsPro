// Practice material for "EMI and Home Loans in Plain Language".
// Every figure is computed below with the same formula as the site's EMI calculator.
import { inr } from "../lib/calc.mjs";

const r12 = (rate) => rate / 1200;
export function emi(P, rate, months) {
  const r = r12(rate);
  return r === 0 ? P / months : (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
function balanceAfter(P, rate, months, k, pay = emi(P, rate, months)) {
  const r = r12(rate);
  let b = P;
  for (let m = 0; m < k; m++) b = b * (1 + r) - pay;
  return Math.max(0, b);
}
function monthsToClose(P, rate, pay) {
  const r = r12(rate);
  let b = P;
  let m = 0;
  let interest = 0;
  while (b > 0.5 && m < 1200) {
    const i = b * r;
    interest += i;
    b = b + i - pay;
    m += 1;
  }
  return { months: m, interest };
}
function interestOf(P, rate, months) {
  return emi(P, rate, months) * months - P;
}
// Largest loan for a given EMI.
function loanFor(pay, rate, months) {
  const r = r12(rate);
  return (pay * (Math.pow(1 + r, months) - 1)) / (r * Math.pow(1 + r, months));
}
const yrs = (m) => `${Math.floor(m / 12)} years${m % 12 ? ` ${m % 12} months` : ""}`;
const Rs = (n) => `Rs. ${inr(n)}`;

// Pre-computed cases used in the text.
const A = { P: 5000000, rate: 8.5, n: 240 };
const A_emi = emi(A.P, A.rate, A.n);
const A_int = interestOf(A.P, A.rate, A.n);
const A30 = emi(A.P, A.rate, 360);
const A15 = emi(A.P, A.rate, 180);

const pre = (() => {
  // 5 lakh prepaid after 5 years on case A.
  const bal = balanceAfter(A.P, A.rate, A.n, 60);
  const after = bal - 500000;
  const keepEmi = monthsToClose(after, A.rate, A_emi);
  const newEmi = emi(after, A.rate, A.n - 60);
  const intNewEmi = newEmi * (A.n - 60) - after;
  const intNoPre = A_emi * (A.n - 60) - bal;
  return { bal, after, keepEmi, newEmi, intNewEmi, intNoPre };
})();

const rateUp = (() => {
  // Rate rises from 8.5 to 9.5 after 3 years. Two responses.
  const bal = balanceAfter(A.P, 8.5, 240, 36);
  const emiUp = emi(bal, 9.5, 204);
  const stretch = monthsToClose(bal, 9.5, A_emi);
  return { bal, emiUp, stretch };
})();

export default {
  checked: "October 2026",
  welcome:
    "This book takes the EMI apart so that a loan quote stops being a single number you have to trust. It shows how rate, tenure, fees and prepayment change the total you pay, how to size a loan to a household budget rather than to a bank's limit, and what to ask before you sign.",

  chapters: [
    {
      title: "The EMI formula, once, slowly",
      paragraphs: [
        "Every EMI calculator, including the one on this site, uses the same formula. You never need to work it by hand, but seeing it once explains why the numbers behave the way they do.",
        "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1). P is the amount borrowed. r is the monthly rate, which is the yearly rate divided by 12 and then by 100. n is the number of monthly payments.",
      ],
      sections: [
        {
          heading: "A worked example",
          paragraphs: [
            `Take ${Rs(A.P)} at 8.5 percent a year for 20 years. The monthly rate r is 8.5 ÷ 1200 = 0.0070833. The number of payments n is 240. (1 + r)^240 comes to about ${Math.pow(1 + r12(8.5), 240).toFixed(3)}.`,
            `Put those in: EMI = 50,00,000 × 0.0070833 × ${Math.pow(1 + r12(8.5), 240).toFixed(3)} ÷ (${Math.pow(1 + r12(8.5), 240).toFixed(3)} − 1) = ${Rs(A_emi)}. Over 240 months you pay ${Rs(A_emi * 240)}, of which ${Rs(A_int)} is interest.`,
          ],
        },
        {
          heading: "What the formula is really doing",
          paragraphs: [
            "Each month the lender charges interest on the balance still owed. The EMI is fixed so that, after paying that month's interest, whatever is left of the EMI reduces the balance, and the balance reaches zero exactly at the last payment.",
            `In the first month the interest is 50,00,000 × 0.0070833 = ${Rs(A.P * r12(8.5))}. Only ${Rs(A_emi - A.P * r12(8.5))} of the first EMI reduces what you owe. Near the end, the balance is small, so almost the whole EMI goes to principal. That is the slow start every borrower notices.`,
          ],
        },
        {
          heading: "A rule of thumb",
          paragraphs: [
            `For long home loans, an EMI per lakh is a handy mental unit. At 8.5 percent over 20 years it is about ${Rs(emi(100000, 8.5, 240))} per lakh borrowed. At 9 percent, ${Rs(emi(100000, 9, 240))}. Over 30 years at 8.5 percent, ${Rs(emi(100000, 8.5, 360))}. Multiply by the number of lakhs to sanity-check any quote in your head.`,
          ],
          table: {
            caption: "EMI per Rs. 1 lakh borrowed.",
            headers: ["Rate", "10 years", "15 years", "20 years", "25 years", "30 years"],
            rows: [7.5, 8, 8.5, 9, 9.5, 10].map((rt) => [`${rt}%`, ...[120, 180, 240, 300, 360].map((n) => inr(emi(100000, rt, n)))]),
          },
        },
      ],
    },
    {
      title: "Tenure: what the extra years cost",
      paragraphs: [
        `Stretching the tenure lowers the EMI, but by less than people expect, while the total interest climbs steeply. For the same ${Rs(A.P)} at 8.5 percent:`,
      ],
      sections: [
        {
          table: {
            caption: "Same loan, different tenures.",
            headers: ["Tenure", "EMI", "Total interest", "Interest as % of loan"],
            rows: [10, 15, 20, 25, 30].map((y) => {
              const e = emi(A.P, 8.5, y * 12);
              const i = e * y * 12 - A.P;
              return [`${y} years`, inr(e), inr(i), `${Math.round((i / A.P) * 100)}%`];
            }),
          },
          paragraphs: [
            `Going from 20 to 30 years lowers the EMI by ${Rs(A_emi - A30)} a month but adds ${Rs(interestOf(A.P, 8.5, 360) - A_int)} of interest. Going from 20 to 15 years raises the EMI by ${Rs(A15 - A_emi)} and saves ${Rs(A_int - interestOf(A.P, 8.5, 180))}.`,
            "A long tenure is not wrong. It gives a household room in a bad year, and you can always prepay to shorten it. The mistake is choosing the long tenure because the EMI looks comfortable and then never prepaying.",
          ],
        },
      ],
    },
    {
      title: "Prepayment: shorter tenure or smaller EMI",
      paragraphs: [
        `Suppose that after five years on the ${Rs(A.P)} loan you have ${Rs(500000)} to prepay. The balance at that point is about ${Rs(pre.bal)}. After the prepayment it is ${Rs(pre.after)}. The lender will usually offer two choices.`,
      ],
      sections: [
        {
          heading: "Keep the EMI, cut the tenure",
          paragraphs: [
            `Paying the same ${Rs(A_emi)} on the smaller balance clears the loan in ${yrs(pre.keepEmi.months)} instead of the 15 years that remained. Interest from here on is about ${Rs(pre.keepEmi.interest)}.`,
          ],
        },
        {
          heading: "Keep the tenure, cut the EMI",
          paragraphs: [
            `Keeping the remaining 15 years lowers the EMI to ${Rs(pre.newEmi)}. Interest from here on is about ${Rs(pre.intNewEmi)}.`,
            `Without any prepayment, the remaining interest would have been about ${Rs(pre.intNoPre)}. Cutting the tenure saves ${Rs(pre.intNoPre - pre.keepEmi.interest)}; cutting the EMI saves ${Rs(pre.intNoPre - pre.intNewEmi)}.`,
          ],
          note: "Cutting the tenure saves more because the money keeps working at the full EMI. Cut the EMI only if the monthly budget genuinely needs the room.",
        },
        {
          heading: "Prepayment charges",
          paragraphs: [
            "Under the Reserve Bank of India's Pre-payment Charges on Loans Directions, 2025, banks and other regulated lenders may not charge for prepaying or closing a floating-rate loan taken by an individual for a non-business purpose, such as a home loan, for loans sanctioned or renewed from 1 January 2026. Earlier RBI instructions had already stopped such charges for most floating-rate home loans. Fixed-rate loans and some business loans can still carry a charge. Read your sanction letter and Key Fact Statement for the exact rule on your loan.",
          ],
        },
      ],
    },
    {
      title: "When the rate moves",
      paragraphs: [
        `Most home loans in India are floating-rate and linked to an external benchmark, usually the RBI repo rate plus a spread. When the benchmark moves, the lender resets your rate. Suppose that after three years the rate on our example loan rises from 8.5 to 9.5 percent. The balance then is about ${Rs(rateUp.bal)}, with 17 years left.`,
      ],
      sections: [
        {
          heading: "Two ways to absorb a rise",
          paragraphs: [
            `If the EMI goes up to keep the end date, the new EMI is ${Rs(rateUp.emiUp)}, an increase of ${Rs(rateUp.emiUp - A_emi)} a month.`,
            `If the EMI stays at ${Rs(A_emi)} and the tenure stretches, the loan now takes ${yrs(rateUp.stretch.months)} from this point instead of 17 years. That is ${yrs(rateUp.stretch.months - 204)} longer.`,
            "Lenders often stretch the tenure by default because the borrower does not notice. RBI's 2023 instructions on resetting floating rates require lenders to tell you about the change and to offer a choice of a higher EMI, a longer tenure or a combination, and an option to switch to a fixed rate where the lender's policy allows. Ask for the choice in writing.",
          ],
        },
        {
          heading: "The tenure trap",
          paragraphs: [
            "If rates rise far enough, an unchanged EMI may barely cover the interest, and the tenure stretches enormously or the balance stops falling. A lender should not let a loan reach that point without raising it with you. Check your loan statement once a year: if the remaining tenure is longer than it was last year, ask why.",
          ],
        },
      ],
    },
    {
      title: "How much loan a salary can carry",
      paragraphs: [
        "Lenders size loans by FOIR, the fixed obligations to income ratio: all your EMIs, including the new one, as a share of net monthly income. Many lenders accept 50 to 60 percent for higher incomes. That is the most they will lend, not the most you should borrow.",
      ],
      sections: [
        {
          heading: "A household budget test",
          paragraphs: [
            "A safer test starts from your own month. Take net income, subtract regular spending you cannot avoid, school fees, insurance premiums, and a monthly saving for emergencies and retirement. What is left is the most the EMI can be. Then check whether that EMI still works if the rate is two percentage points higher.",
            `Example: a net income of ${Rs(150000)} a month and essential spending and savings of ${Rs(95000)} leave ${Rs(55000)}. At 8.5 percent for 20 years that supports a loan of about ${Rs(loanFor(55000, 8.5, 240))}. Tested at 10.5 percent, the same EMI supports only ${Rs(loanFor(55000, 10.5, 240))}. Borrowing the smaller amount, or keeping a buffer, protects you if rates rise.`,
          ],
        },
        {
          heading: "Down payment and LTV",
          paragraphs: [
            "RBI caps the loan-to-value ratio for housing loans by loan size: up to 90 percent for loans up to Rs. 30 lakh, 80 percent above that up to Rs. 75 lakh, and 75 percent above Rs. 75 lakh. Stamp duty and registration are usually excluded from the property value for this purpose, so they come from your own pocket too. Plan the down payment, stamp duty, registration, interiors and moving costs before you plan the EMI.",
          ],
        },
      ],
    },
    {
      title: "Tax and the home loan",
      paragraphs: [
        "Under the old tax regime, interest on a loan for a self-occupied home has long been deductible up to Rs. 2 lakh a year, and principal repayment counts towards the Rs. 1.5 lakh limit for specified savings and payments. Under the new regime, which is the default, those deductions are not available for a self-occupied home. Interest on a let-out property is treated differently in both regimes.",
        "Do not choose a loan size for the tax break. A deduction saves at most your marginal tax rate on the interest; the rest of the interest is still a cost. Run your numbers through the old-versus-new regime comparison each year, and see the income tax book in this series for the detail.",
      ],
    },
  ],

  scenarioIntro:
    "Fifteen households deciding about a home loan. Every figure is worked with the standard EMI formula at the rate stated; your lender's figures may differ by a few rupees because of rounding and the day interest starts.",

  scenarios: [
    {
      title: "Choosing between 20 and 25 years",
      paragraphs: [
        `Prakash and Jyoti in Pune are borrowing ${Rs(6000000)} at 8.4 percent. Twenty years means an EMI of ${Rs(emi(6000000, 8.4, 240))}. Twenty-five years means ${Rs(emi(6000000, 8.4, 300))}, a difference of ${Rs(emi(6000000, 8.4, 240) - emi(6000000, 8.4, 300))} a month.`,
        `Over the full term, the 25-year loan costs ${Rs(interestOf(6000000, 8.4, 300) - interestOf(6000000, 8.4, 240))} more in interest. Jyoti's job is on contract and renews yearly, so they chose 25 years for the safety of the lower EMI, and set a standing instruction to prepay the difference each month while both salaries are coming in.`,
        "If the contract renews for good, the prepayment makes the loan behave like a 20-year one. If it does not, they can stop the prepayment without asking the bank for anything.",
      ],
      lesson: "A longer tenure with voluntary prepayment buys flexibility. It only saves money if the prepayment actually happens.",
    },
    {
      title: "A bonus every March",
      paragraphs: [
        `Kiran in Hyderabad has a ${Rs(4500000)} loan at 8.6 percent for 20 years, EMI ${Rs(emi(4500000, 8.6, 240))}. He receives a performance bonus each March and plans to prepay ${Rs(100000)} a year from it.`,
        (() => {
          // Annual prepayment simulation.
          const r = r12(8.6);
          const pay = emi(4500000, 8.6, 240);
          let b = 4500000;
          let m = 0;
          let int = 0;
          while (b > 0.5 && m < 400) {
            const i = b * r;
            int += i;
            b = b + i - pay;
            m += 1;
            if (m % 12 === 0 && b > 0) b -= Math.min(100000, b);
          }
          return `With a ${Rs(100000)} prepayment at the end of every year, and the EMI unchanged, the loan closes in about ${yrs(m)} instead of 20 years. Total interest falls from ${Rs(interestOf(4500000, 8.6, 240))} to about ${Rs(int)}.`;
        })(),
        "He asks the bank each time to reduce the tenure, not the EMI, and downloads the revised schedule so he can see the end date move.",
        "In a year without a bonus he skips the prepayment and nothing changes: the EMI is the same, and the loan simply ends a little later than the plan said. That flexibility is why he prefers voluntary prepayment to a shorter tenure he might struggle with.",
      ],
      lesson: "Small, regular prepayments early in a loan have a large effect, because every rupee repaid stops attracting interest for the rest of the term.",
    },
    {
      title: "The 30-year EMI that looked affordable",
      paragraphs: [
        `Sneha, 29, in Bengaluru, was offered ${Rs(8000000)} at 8.5 percent over 30 years, an EMI of ${Rs(emi(8000000, 8.5, 360))}. Over 20 years the EMI would have been ${Rs(emi(8000000, 8.5, 240))}.`,
        `The 30-year loan would cost ${Rs(interestOf(8000000, 8.5, 360))} in interest, more than the amount borrowed. She would be 59 when it ended. The lender's rules also limit how long a loan can run past retirement age.`,
        `She looked at a smaller flat instead. ${Rs(6000000)} over 20 years gives an EMI of ${Rs(emi(6000000, 8.5, 240))}, close to what she had wanted to pay, with interest of ${Rs(interestOf(6000000, 8.5, 240))} and an end date at 49.`,
        "She kept the larger flat on her list for later. If her income grows, she can sell and move up with equity built in the first home, rather than starting her working life with a loan she would still be paying in her late fifties.",
      ],
      lesson: "If only a 30-year tenure makes the EMI fit, the loan may be too large for the income.",
    },
    {
      title: "Balance transfer with fees",
      paragraphs: [
        `Manjula in Mysuru has ${Rs(3200000)} left on her loan at 9.4 percent with 15 years to go. Another bank offers 8.6 percent with a processing fee of ${Rs(15000)} and legal and valuation charges of ${Rs(10000)}.`,
        `At 9.4 percent her EMI is ${Rs(emi(3200000, 9.4, 180))}. At 8.6 percent it would be ${Rs(emi(3200000, 8.6, 180))}, a saving of ${Rs(emi(3200000, 9.4, 180) - emi(3200000, 8.6, 180))} a month. The ${Rs(25000)} of costs are recovered in about ${Math.ceil(25000 / (emi(3200000, 9.4, 180) - emi(3200000, 8.6, 180)))} months.`,
        "Before moving, she asked her own bank to match. It offered 8.75 percent for a conversion fee of Rs. 5,000. She took that: less saving each month, but almost no paperwork and the cost was recovered within a year.",
      ],
      lesson: "Compare the monthly saving with the full cost of switching. Ask your current lender for a better rate first.",
    },
    {
      title: "Pre-EMI during construction",
      paragraphs: [
        `Rajesh in Greater Noida bought an under-construction flat with a ${Rs(5000000)} loan at 8.7 percent. The bank released money in stages. In the first year ${Rs(2000000)} had been disbursed, and he paid interest only on that: about ${Rs(2000000 * r12(8.7))} a month.`,
        "That is pre-EMI interest. It does not reduce the principal. When possession is delayed, months of pre-EMI add up while the full loan has not even started.",
        `Two years later the full amount was out and the full EMI of ${Rs(emi(5000000, 8.7, 240))} began. With Rs. 20 lakh out in the first year and Rs. 35 lakh in the second, he had paid about ${Rs(2000000 * r12(8.7) * 12 + 3500000 * r12(8.7) * 12)} in pre-EMI interest by then, while also paying rent.`,
      ],
      lesson: "For under-construction property, budget for rent plus pre-EMI interest for longer than the builder promises.",
    },
    {
      title: "A rate rise absorbed by tenure",
      paragraphs: [
        `Fatima in Lucknow took ${Rs(3500000)} at 8.3 percent for 20 years in 2022, EMI ${Rs(emi(3500000, 8.3, 240))}. Two years later the rate had been reset to 9.3 percent. She never received a higher EMI, so assumed nothing had changed.`,
        (() => {
          const bal = balanceAfter(3500000, 8.3, 240, 24);
          const st = monthsToClose(bal, 9.3, emi(3500000, 8.3, 240));
          return `Her annual statement showed the remaining tenure had grown. With ${Rs(bal)} outstanding and the same EMI at 9.3 percent, the loan now needed ${yrs(st.months)} more, instead of 18 years. Raising the EMI to ${Rs(emi(bal, 9.3, 216))} would restore the original end date.`;
        })(),
        "She chose a middle path: an EMI increase of Rs. 1,500 and a yearly prepayment, which brought the end date back within a year of the original.",
      ],
      lesson: "Read the remaining-tenure line on your statement every year. A silent stretch is still a cost.",
    },
    {
      title: "Joint loan, two incomes, one risk",
      paragraphs: [
        `Ankit and Ruchi in Gurugram are applying jointly for ${Rs(9000000)} at 8.45 percent over 20 years, EMI ${Rs(emi(9000000, 8.45, 240))}. Their combined take-home is ${Rs(260000)} a month, so the EMI is about ${Math.round((emi(9000000, 8.45, 240) / 260000) * 100)} percent of it.`,
        `They tested one income stopping for six months. Ruchi's take-home alone is ${Rs(120000)}. The EMI would be ${Math.round((emi(9000000, 8.45, 240) / 120000) * 100)} percent of that, which their budget cannot carry for long.`,
        `So they decided to build an emergency fund of six EMIs, about ${Rs(6 * emi(9000000, 8.45, 240))}, before taking possession, and to buy term life cover for each of them for at least the loan amount.`,
        "They also agreed in writing how the flat would be shared if they separated, since both names would be on the loan and the title. It was an awkward conversation, and a short one, and it made the bank meeting much easier.",
      ],
      lesson: "A joint loan should be tested against one income, and protected by an emergency fund and life cover.",
    },
    {
      title: "Paying off early versus investing",
      paragraphs: [
        `Suresh in Coimbatore has ${Rs(2500000)} left at 8.5 percent and ${Rs(500000)} of savings beyond his emergency fund. He wonders whether to prepay or invest.`,
        "Prepaying earns a guaranteed 8.5 percent, the rate he stops paying, with no tax and no risk. Investing could earn more or less. Under the new tax regime he gets no deduction for the interest, so the full 8.5 percent is the real saving.",
        "He split it: Rs. 3 lakh prepaid, Rs. 2 lakh invested for his daughter's education in eight years. He said the split was as much about sleep as arithmetic, which is a legitimate reason.",
        "Had he still been in the old tax regime and claiming the interest deduction at a 30 percent rate, the effective cost of the loan would have been lower than 8.5 percent, and investing would have looked relatively better. The decision changes with the tax regime, so he revisits it each year.",
      ],
      lesson: "Prepayment is a risk-free return equal to your loan rate. Compare any investment with that, after tax.",
    },
    {
      title: "Insurance bundled into the loan",
      paragraphs: [
        `When Vandana in Indore signed her ${Rs(3000000)} loan, the bank added a single-premium home-loan protection policy of ${Rs(90000)} to the loan amount. She did not notice until the first statement.`,
        `Financing the premium meant paying interest on it for 20 years. At 8.6 percent, ${Rs(90000)} over 240 months adds ${Rs(emi(90000, 8.6, 240))} to the EMI and costs ${Rs(interestOf(90000, 8.6, 240))} in interest.`,
        "Such cover can be useful, but it is optional, and a plain term policy from any insurer often gives more cover for less. She asked for the policy terms, checked the cancellation window, and replaced it with a term policy covering the loan and more.",
        "The term policy also stays with her if she moves the loan to another bank, while the bundled policy was tied to this lender. She keeps the policy document with the loan papers and has told her brother where both are.",
      ],
      lesson: "Check what has been added to the loan amount. Insurance is optional and can be bought separately.",
    },
    {
      title: "A smaller city, a smaller loan",
      paragraphs: [
        `Rekha moved from Mumbai to Nashik for family reasons. In Mumbai she had been approved for ${Rs(9000000)}. In Nashik, a similar flat cost about half.`,
        `She took ${Rs(3500000)} at 8.5 percent for 15 years, an EMI of ${Rs(emi(3500000, 8.5, 180))}, which is about a third of her new salary. Total interest is ${Rs(interestOf(3500000, 8.5, 180))}.`,
        "The bank would have lent her more. She used the room to keep a larger emergency fund, since her new job was with a smaller employer.",
        "She also checked resale: a flat in a well-connected part of Nashik would be easier to sell if she ever moved back. That narrowed her search to three areas and kept the loan comfortably within what her salary could carry.",
        "Her rule for the EMI was simple: it had to leave enough each month for her savings and her mother's medicines, even in a month with an unexpected expense.",
      ],
      lesson: "The sanction amount is a ceiling. Size the loan to the life you are moving into.",
    },
    {
      title: "Retiring in 12 years",
      paragraphs: [
        `Mohan, 48, in Chennai wants ${Rs(4000000)} for a flat near his daughter. He retires at 60. Over 12 years at 8.6 percent the EMI is ${Rs(emi(4000000, 8.6, 144))}.`,
        `The bank offered 20 years by adding his daughter as co-borrower. That would lower the EMI to ${Rs(emi(4000000, 8.6, 240))} but would place the last eight years on her.`,
        "They agreed that Mohan would take the 12-year loan alone, with a plan to prepay from his gratuity at retirement if anything was left. His daughter's own future home loan stays unaffected.",
        "To make the higher EMI fit, he put a little less into new investments for the next decade, reasoning that a paid-off flat is itself a retirement asset. He kept his emergency fund and health insurance untouched.",
        "Lenders usually cap the loan so that it ends by a certain age. Asking about that rule before choosing the flat saved him from falling for a home the bank would not finance on his own income.",
      ],
      lesson: "Tenure should end before regular income does, unless someone else has knowingly agreed to carry it.",
    },
    {
      title: "Comparing two quotes properly",
      paragraphs: [
        "Shabnam in Kolkata had two offers for Rs. 40 lakh over 20 years. Bank A: 8.40 percent, processing fee Rs. 30,000. Bank B: 8.55 percent, no fee.",
        `Bank A's EMI is ${Rs(emi(4000000, 8.4, 240))} and Bank B's is ${Rs(emi(4000000, 8.55, 240))}, a difference of ${Rs(emi(4000000, 8.55, 240) - emi(4000000, 8.4, 240))} a month. The fee is recovered in about ${Math.ceil(30000 / (emi(4000000, 8.55, 240) - emi(4000000, 8.4, 240)))} months.`,
        "Both banks quoted floating rates on the same benchmark, but she asked how each spread could change over the loan. Bank A's sanction letter allowed the spread to be revised on a credit review; Bank B's did not. She picked A anyway, for the lower total cost, and noted the clause.",
        "She also compared the Key Fact Statements, which show each loan's APR including fees. The APR made the comparison quick: it folded the fee into a single yearly figure she could set side by side.",
      ],
      lesson: "Compare total cost over a realistic period, and read the clause that says how your spread can change.",
    },
    {
      title: "An EMI date that fought the salary date",
      paragraphs: [
        "Vikas's salary arrived on the 7th; his EMI was debited on the 2nd. For three months the auto-debit bounced because the account had been drained by month-end bills, and each bounce brought a charge from the bank and a mark on his repayment record.",
        "He asked the lender to move the EMI date to the 10th. It agreed for a small fee and adjusted one month's interest. He also set a standing instruction to move the EMI amount into a separate account on salary day.",
        "Under RBI's 2023 instructions, lenders now levy penal charges rather than penal interest for such defaults, and must disclose them. That limits the cost but does not remove it, and the credit record still notes the late payment.",
      ],
      lesson: "Align the EMI date with the salary date. A bounced EMI costs money and credit history.",
    },
    {
      title: "Closing the loan and the paperwork",
      paragraphs: [
        "Ganesh in Madurai made his last EMI after 15 years. He assumed that was the end. Six months later he discovered the bank still held his original sale deed, and the charge registered against the property had not been removed.",
        "Under RBI's 2023 instructions, lenders must return original property documents and release any registered charge within 30 days of full repayment, and must compensate the borrower for each day of delay beyond that, where the delay is the lender's fault.",
        "He collected the deed, the no-dues certificate and the closure letter, checked that the bank had filed for removal of the charge, and updated his credit report entry, which still showed the loan as active.",
      ],
      lesson: "On closure, collect the original documents, the no-dues certificate and proof that the charge on the property has been removed.",
    },
    {
      title: "Top-up loan for renovation",
      paragraphs: [
        `Ayesha in Ahmedabad has ${Rs(1800000)} left on her home loan at 8.5 percent and wants ${Rs(600000)} for renovation. Her bank offered a top-up at 9.25 percent over 10 years; a personal loan would be about 12.5 percent over 5 years.`,
        `Top-up EMI: ${Rs(emi(600000, 9.25, 120))}, total interest ${Rs(interestOf(600000, 9.25, 120))}. Personal loan EMI: ${Rs(emi(600000, 12.5, 60))}, total interest ${Rs(interestOf(600000, 12.5, 60))}.`,
        "The top-up was cheaper per year but ran twice as long, so total interest was not much lower. She took the top-up over 5 years instead, at the lower rate and the shorter term, getting the best of both.",
        `Over 5 years at 9.25 percent the EMI is ${Rs(emi(600000, 9.25, 60))} and interest is ${Rs(interestOf(600000, 9.25, 60))}, well below both of the original choices.`,
      ],
      lesson: "Compare rate and tenure together. A cheaper rate over a longer term can cost as much as a dearer rate over a short one.",
    },
  ],

  problemIntro:
    "Use the EMI formula, the per-lakh table, or the site's EMI calculator. Answers are rounded to the nearest rupee.",

  problems: [
    {
      title: "Basic EMI",
      q: ["Find the EMI for Rs. 30 lakh at 8.75 percent over 20 years."],
      steps: ["r = 8.75 ÷ 1200 = 0.0072917; n = 240.", `(1 + r)^240 = ${Math.pow(1 + r12(8.75), 240).toFixed(4)}.`, "EMI = 30,00,000 × r × (1+r)^n ÷ ((1+r)^n − 1)."],
      answer: `${Rs(emi(3000000, 8.75, 240))} a month.`,
    },
    {
      title: "Total interest",
      q: ["For the loan in Problem 1, how much interest is paid over the full term?"],
      steps: [`Total paid = EMI × 240 = ${Rs(emi(3000000, 8.75, 240) * 240)}.`, "Interest = total paid − 30,00,000."],
      answer: `${Rs(interestOf(3000000, 8.75, 240))}.`,
    },
    {
      title: "Per-lakh shortcut",
      q: ["Using the per-lakh figure at 8.5 percent over 20 years, estimate the EMI on Rs. 72 lakh."],
      steps: [`EMI per lakh = ${Rs(emi(100000, 8.5, 240))}.`, `72 × ${inr(emi(100000, 8.5, 240))} = ${inr(72 * emi(100000, 8.5, 240))}.`],
      answer: `About ${Rs(emi(7200000, 8.5, 240))}.`,
    },
    {
      title: "First month's split",
      q: ["On Rs. 40 lakh at 9 percent over 15 years, how much of the first EMI is interest and how much is principal?"],
      steps: [`EMI = ${Rs(emi(4000000, 9, 180))}.`, `Interest = 40,00,000 × 9 ÷ 1200 = ${Rs(4000000 * r12(9))}.`, `Principal = EMI − interest = ${Rs(emi(4000000, 9, 180) - 4000000 * r12(9))}.`],
      answer: `Interest ${Rs(4000000 * r12(9))}; principal ${Rs(emi(4000000, 9, 180) - 4000000 * r12(9))}.`,
    },
    {
      title: "Balance after 5 years",
      q: ["On Rs. 50 lakh at 8.5 percent over 20 years, what is the outstanding balance after 60 EMIs?"],
      steps: ["Balance = what remains after 60 months of interest added and EMIs subtracted.", "Use the amortisation schedule on the calculator, or the formula B = P(1+r)^k − EMI × ((1+r)^k − 1) ÷ r."],
      answer: `About ${Rs(balanceAfter(5000000, 8.5, 240, 60))}. After a quarter of the term, only about ${Math.round((1 - balanceAfter(5000000, 8.5, 240, 60) / 5000000) * 100)} percent of the loan is repaid.`,
    },
    {
      title: "Crossover month",
      q: ["In which month does the principal part of the EMI first exceed the interest part, for Rs. 50 lakh at 8.5 percent over 20 years?"],
      steps: ["The principal part grows each month as the balance falls.", "Find the first month where EMI − balance × r > balance × r, that is, balance < EMI ÷ (2r)."],
      answer: (() => {
        const pay = emi(5000000, 8.5, 240);
        let b = 5000000;
        for (let m = 1; m <= 240; m++) {
          const i = b * r12(8.5);
          if (pay - i > i) return `Month ${m}, about ${yrs(m - 1)} into the loan.`;
          b = b + i - pay;
        }
        return "Not reached.";
      })(),
    },
    {
      title: "Effect of half a percent",
      q: ["How much more interest does Rs. 50 lakh over 20 years cost at 9 percent than at 8.5 percent?"],
      steps: [`At 8.5%: ${Rs(interestOf(5000000, 8.5, 240))}.`, `At 9%: ${Rs(interestOf(5000000, 9, 240))}.`],
      answer: `${Rs(interestOf(5000000, 9, 240) - interestOf(5000000, 8.5, 240))} more, and ${Rs(emi(5000000, 9, 240) - emi(5000000, 8.5, 240))} more each month.`,
    },
    {
      title: "Maximum loan for an EMI",
      q: ["You can afford Rs. 35,000 a month. What is the largest loan at 8.6 percent over 20 years?"],
      steps: ["Invert the formula: P = EMI × ((1+r)^n − 1) ÷ (r × (1+r)^n).", "r = 8.6 ÷ 1200; n = 240."],
      answer: `About ${Rs(loanFor(35000, 8.6, 240))}.`,
    },
    {
      title: "Stress test",
      q: ["For the loan in Problem 8, what would the EMI be if the rate rose to 10.6 percent with the same 20-year term?"],
      steps: [`EMI at 10.6% on ${Rs(loanFor(35000, 8.6, 240))} over 240 months.`],
      answer: `${Rs(emi(loanFor(35000, 8.6, 240), 10.6, 240))}, about ${Rs(emi(loanFor(35000, 8.6, 240), 10.6, 240) - 35000)} more a month than planned.`,
    },
    {
      title: "Extra Rs. 5,000 a month",
      q: ["On Rs. 40 lakh at 8.5 percent over 20 years, how much sooner does the loan close if you pay Rs. 5,000 more every month from the start?"],
      steps: [`Normal EMI = ${Rs(emi(4000000, 8.5, 240))}.`, `With extra: pay ${Rs(emi(4000000, 8.5, 240) + 5000)} until the balance is zero.`],
      answer: (() => {
        const st = monthsToClose(4000000, 8.5, emi(4000000, 8.5, 240) + 5000);
        return `It closes in ${yrs(st.months)}, saving about ${Rs(interestOf(4000000, 8.5, 240) - st.interest)} in interest.`;
      })(),
    },
    {
      title: "Lump-sum prepayment, tenure reduced",
      q: ["After 3 years on Rs. 30 lakh at 8.75 percent over 20 years, you prepay Rs. 3 lakh and keep the EMI. When does the loan end?"],
      steps: [`Balance after 36 months ≈ ${Rs(balanceAfter(3000000, 8.75, 240, 36))}.`, `After prepayment ≈ ${Rs(balanceAfter(3000000, 8.75, 240, 36) - 300000)}.`, `Pay ${Rs(emi(3000000, 8.75, 240))} until it reaches zero.`],
      answer: (() => {
        const st = monthsToClose(balanceAfter(3000000, 8.75, 240, 36) - 300000, 8.75, emi(3000000, 8.75, 240));
        return `About ${yrs(st.months)} after the prepayment, instead of 17 years.`;
      })(),
    },
    {
      title: "Lump-sum prepayment, EMI reduced",
      q: ["Same as Problem 11, but you keep the remaining 17 years and reduce the EMI. What is the new EMI?"],
      steps: ["New EMI = EMI on the reduced balance over 204 months."],
      answer: `${Rs(emi(balanceAfter(3000000, 8.75, 240, 36) - 300000, 8.75, 204))}, down from ${Rs(emi(3000000, 8.75, 240))}.`,
    },
    {
      title: "Fee break-even",
      q: ["Switching lenders saves Rs. 1,150 a month and costs Rs. 18,000 in fees. How many months to break even?"],
      steps: ["18,000 ÷ 1,150 = 15.7."],
      answer: "16 months. Worth it if you expect to keep the loan well beyond that.",
    },
    {
      title: "LTV limit",
      q: ["A flat costs Rs. 60 lakh. Under RBI's LTV caps, what is the largest housing loan, and the smallest down payment?"],
      steps: ["The loan would exceed Rs. 30 lakh and not exceed Rs. 75 lakh, so the cap is 80 percent.", "80% of 60 lakh = 48 lakh."],
      answer: "Loan up to Rs. 48 lakh; down payment at least Rs. 12 lakh, plus stamp duty and registration.",
    },
    {
      title: "FOIR",
      q: ["Net income is Rs. 1,20,000 a month. A car loan EMI is Rs. 14,000. A lender allows 55 percent FOIR. What is the highest home-loan EMI it will accept?"],
      steps: ["55% of 1,20,000 = 66,000.", "Subtract existing EMIs: 66,000 − 14,000 = 52,000."],
      answer: "Rs. 52,000 a month. That is the lender's ceiling, not a recommendation.",
    },
    {
      title: "Rate rise, EMI kept",
      q: ["A Rs. 25 lakh balance with 15 years left at 8 percent has its rate reset to 9 percent. If the EMI stays the same, how much longer does the loan run?"],
      steps: [`EMI at 8% over 180 months = ${Rs(emi(2500000, 8, 180))}.`, "Months to close at 9% with that EMI."],
      answer: (() => {
        const st = monthsToClose(2500000, 9, emi(2500000, 8, 180));
        return `${yrs(st.months)} instead of 15 years, ${yrs(st.months - 180)} longer.`;
      })(),
    },
    {
      title: "Rate rise, tenure kept",
      q: ["Same as Problem 16, but the tenure is kept. What is the new EMI?"],
      steps: ["EMI at 9% on Rs. 25 lakh over 180 months."],
      answer: `${Rs(emi(2500000, 9, 180))}, up ${Rs(emi(2500000, 9, 180) - emi(2500000, 8, 180))}.`,
    },
    {
      title: "Pre-EMI interest",
      q: ["Rs. 18 lakh of a home loan has been disbursed at 8.8 percent and the rest is pending. What is the monthly pre-EMI interest?"],
      steps: ["18,00,000 × 8.8 ÷ 1200."],
      answer: `${Rs(1800000 * r12(8.8))} a month, none of which reduces the principal.`,
    },
    {
      title: "Financed insurance premium",
      q: ["A Rs. 75,000 single premium is added to a home loan at 8.5 percent over 20 years. How much does it add to the EMI and to total interest?"],
      steps: ["EMI on 75,000 at 8.5% over 240 months.", "Interest = EMI × 240 − 75,000."],
      answer: `${Rs(emi(75000, 8.5, 240))} a month; ${Rs(interestOf(75000, 8.5, 240))} of interest.`,
    },
    {
      title: "Tax value of interest under the old regime",
      q: ["A taxpayer in the 30 percent slab under the old regime pays Rs. 2,60,000 interest on a self-occupied home in a year. How much tax does the deduction save, before cess?"],
      steps: ["Deduction is capped at Rs. 2,00,000.", "Saving = 2,00,000 × 30% = 60,000."],
      answer: "Rs. 60,000, plus 4 percent cess on that. The remaining Rs. 2 lakh of interest is still a real cost.",
    },
    {
      title: "Comparing two offers over 5 years",
      q: ["Rs. 35 lakh over 20 years. Offer A: 8.4 percent, fee Rs. 25,000. Offer B: 8.6 percent, no fee. If you will refinance or close after 5 years, which costs less?"],
      steps: [`A: EMI ${Rs(emi(3500000, 8.4, 240))}; 60 EMIs + fee + balance after 60 = ${Rs(emi(3500000, 8.4, 240) * 60 + 25000 + balanceAfter(3500000, 8.4, 240, 60))}.`, `B: EMI ${Rs(emi(3500000, 8.6, 240))}; 60 EMIs + balance after 60 = ${Rs(emi(3500000, 8.6, 240) * 60 + balanceAfter(3500000, 8.6, 240, 60))}.`],
      answer: (() => {
        const a = emi(3500000, 8.4, 240) * 60 + 25000 + balanceAfter(3500000, 8.4, 240, 60);
        const b = emi(3500000, 8.6, 240) * 60 + balanceAfter(3500000, 8.6, 240, 60);
        return `${a < b ? "A" : "B"} is cheaper by about ${Rs(Math.abs(a - b))} over 5 years.`;
      })(),
    },
    {
      title: "Short loan, small amount",
      q: ["Rs. 8 lakh at 9.5 percent: compare 5 and 10 years."],
      steps: [`5 years: EMI ${Rs(emi(800000, 9.5, 60))}, interest ${Rs(interestOf(800000, 9.5, 60))}.`, `10 years: EMI ${Rs(emi(800000, 9.5, 120))}, interest ${Rs(interestOf(800000, 9.5, 120))}.`],
      answer: `The longer loan lowers the EMI by ${Rs(emi(800000, 9.5, 60) - emi(800000, 9.5, 120))} but costs ${Rs(interestOf(800000, 9.5, 120) - interestOf(800000, 9.5, 60))} more interest.`,
    },
    {
      title: "Yearly step-up in EMI",
      q: ["On Rs. 50 lakh at 8.5 percent over 20 years, you raise your payment by 5 percent every year. Roughly when does the loan close?"],
      steps: ["Start at the normal EMI, increase it by 5 percent after every 12 months, and run until the balance is zero."],
      answer: (() => {
        let b = 5000000;
        let pay = A_emi;
        let m = 0;
        let int = 0;
        while (b > 0.5 && m < 400) {
          const i = b * r12(8.5);
          int += i;
          b = b + i - pay;
          m += 1;
          if (m % 12 === 0) pay *= 1.05;
        }
        return `In about ${yrs(m)}, with total interest of about ${Rs(int)} against ${Rs(A_int)}.`;
      })(),
    },
    {
      title: "Zero-cost EMI check",
      q: ["A shop offers a phone for Rs. 60,000 on a 'no-cost EMI' of Rs. 10,000 for 6 months. The bank charges a processing fee of Rs. 199 plus GST, and the shop gives no discount for cash. What is the real cost?"],
      steps: ["Six EMIs = 60,000.", "Fee with 18% GST = 199 × 1.18 = 234.82.", "If cash buyers get a discount you do not, that discount is the hidden interest too."],
      answer: "About Rs. 60,235. Ask the cash price first; if it is lower, the difference is the interest.",
    },
    {
      title: "How much house for a rent",
      q: ["You pay Rs. 28,000 rent and would accept an EMI 30 percent higher. At 8.5 percent over 20 years, what loan does that support?"],
      steps: ["EMI = 28,000 × 1.3 = 36,400.", "Loan = EMI × ((1+r)^n − 1) ÷ (r (1+r)^n)."],
      answer: `About ${Rs(loanFor(36400, 8.5, 240))}, before down payment and costs.`,
    },
  ],

  exercises: {
    warmup: [
      { q: "What is the monthly rate for a loan at 9 percent a year?", a: "0.75 percent, or 0.0075 as a decimal." },
      { q: "Does a longer tenure raise or lower the EMI? The total interest?", a: "It lowers the EMI and raises the total interest." },
      { q: "What is pre-EMI interest?", a: "Interest charged on the part of a loan already disbursed, before full EMIs start. It does not reduce principal." },
      { q: "Which usually saves more interest after a prepayment: reducing the EMI or reducing the tenure?", a: "Reducing the tenure." },
      { q: "What does FOIR measure?", a: "All fixed EMIs as a share of net monthly income." },
      { q: "Name two costs of buying a home that the loan usually does not cover.", a: "Any two of: down payment, stamp duty, registration, interiors, moving, brokerage." },
    ],
    practice: [
      { q: "Find the EMI for Rs. 25 lakh at 8.4 percent over 15 years.", a: `${Rs(emi(2500000, 8.4, 180))}.` },
      { q: "Using the per-lakh table, estimate the EMI for Rs. 45 lakh at 9 percent over 20 years.", a: `45 × ${inr(emi(100000, 9, 240))} ≈ ${Rs(emi(4500000, 9, 240))}.` },
      { q: "What is the total interest on Rs. 20 lakh at 8.5 percent over 10 years?", a: `${Rs(interestOf(2000000, 8.5, 120))}.` },
      { q: "A lender charges a Rs. 12,000 fee to lower your rate, saving Rs. 900 a month. Break-even?", a: "12,000 ÷ 900 = 13.3, so 14 months." },
      { q: "What is the largest loan an EMI of Rs. 25,000 supports at 9 percent over 20 years?", a: `About ${Rs(loanFor(25000, 9, 240))}.` },
      { q: "Write three questions to ask a lender about a floating rate.", a: "Which benchmark and spread apply, and can the spread change? When the rate changes, will the EMI or the tenure change, and can I choose? Is there an option to switch to a fixed rate, and at what cost?" },
    ],
    stretch: [
      { q: "On Rs. 60 lakh at 8.5 percent over 25 years, how much interest is saved by paying Rs. 10,000 extra a month from the start?", a: (() => { const st = monthsToClose(6000000, 8.5, emi(6000000, 8.5, 300) + 10000); return `The loan closes in ${yrs(st.months)}; interest falls by about ${Rs(interestOf(6000000, 8.5, 300) - st.interest)}.`; })() },
      { q: "A Rs. 30 lakh balance with 12 years left at 8.5 percent faces a rise to 10 percent. Compare raising the EMI with stretching the tenure.", a: (() => { const e0 = emi(3000000, 8.5, 144); const st = monthsToClose(3000000, 10, e0); return `Raising: EMI goes from ${Rs(e0)} to ${Rs(emi(3000000, 10, 144))}. Stretching: the loan runs ${yrs(st.months)} instead of 12 years.`; })() },
      { q: "Show that doubling the tenure does not halve the EMI, using Rs. 10 lakh at 9 percent over 10 and 20 years.", a: `10 years: ${Rs(emi(1000000, 9, 120))}. 20 years: ${Rs(emi(1000000, 9, 240))}. The EMI falls by only about ${Math.round((1 - emi(1000000, 9, 240) / emi(1000000, 9, 120)) * 100)} percent because interest on the larger balance fills much of each payment.` },
      { q: "A couple's take-home is Rs. 2 lakh; one income is Rs. 80,000. What EMI keeps them safe if the larger income stops, assuming the smaller must cover the EMI and Rs. 45,000 of essentials?", a: "80,000 − 45,000 = Rs. 35,000. A higher EMI is possible only with a large emergency fund." },
      { q: "Explain why prepaying in year 2 saves more than the same prepayment in year 15.", a: "A rupee repaid in year 2 stops attracting interest for the remaining 18 years; in year 15, only for the remaining 5. Interest saved is roughly the amount times the rate times the years remaining, compounded." },
    ],
    challenge: [
      { q: "You can either prepay Rs. 2 lakh a year on an 8.5 percent home loan or invest it. Under what conditions does investing make more sense?", a: "When the investment's expected after-tax return is clearly above 8.5 percent, the money will stay invested for many years, you can tolerate losses in bad years, and you already have an emergency fund and cover. If you claim interest under the old regime, the effective loan rate is lower, which tilts towards investing." },
      { q: "Design a home-loan plan for a 32-year-old with a Rs. 1.4 lakh take-home, Rs. 15 lakh saved, and a flat costing Rs. 70 lakh.", a: "Down payment of at least 20 percent (Rs. 14 lakh) plus stamp duty and costs exceeds savings, so either save longer or choose a cheaper flat. A Rs. 55 lakh loan at 8.5% over 20 years is an EMI of about Rs. 47,700, a third of take-home, tested at a 2-point rise. Keep six EMIs as an emergency fund, buy term cover for the loan, and prepay from raises." },
      { q: "Argue for and against a fixed-rate home loan in India.", a: "For: certainty, protection from rate rises. Against: fixed rates are usually higher, may reset after a few years, and may carry prepayment charges, while floating rates fall when the benchmark falls. Most borrowers take floating rates and manage the risk with a buffer and prepayments." },
      { q: "A friend says the bank's EMI calculator is wrong by Rs. 40. Give three likely reasons.", a: "Rounding of the monthly rate or EMI; interest calculated on a daily or broken-period basis for the first month; fees or insurance added to the loan amount; or a slightly different rate from the one entered." },
      { q: "Write a one-page checklist for the day the loan is sanctioned.", a: "Check the amount, rate, benchmark and spread; tenure and EMI date; fees and anything added to the loan; prepayment rules; how rate changes are handled; insurance terms; the Key Fact Statement and APR; documents held by the bank and how they are returned on closure." },
    ],
  },

  faqs: [
    {
      group: "The EMI",
      items: [
        ["Why does most of my EMI go to interest at the start?", "Interest each month is charged on the balance still owed, and at the start the balance is the whole loan. As principal is repaid, the interest part shrinks and the principal part grows, though the EMI stays the same."],
        ["Is the EMI the same every month?", "For a fixed rate, yes. For a floating rate the EMI stays the same until the rate is reset; then either the EMI or the tenure changes. The first and last EMIs can differ slightly because of broken periods."],
        ["Why does my bank's EMI differ from the calculator by a few rupees?", "Banks may round the monthly rate or the EMI differently, charge interest for the days between disbursement and the first EMI, or include fees or insurance in the loan amount. Small differences are normal; large ones need an explanation."],
        ["What is broken-period interest?", "Interest for the days between the disbursement date and the start of the regular EMI cycle. It is usually collected separately or with the first EMI."],
        ["Does paying the EMI early in the month save interest?", "Usually no; interest is charged on the schedule's dates. Paying extra towards principal saves interest. Paying the same EMI a few days early does not change the schedule."],
        ["How is a reducing-balance rate different from a flat rate?", "A reducing-balance rate charges interest only on what you still owe. A flat rate charges it on the original amount for the whole term, so the true cost is much higher than the quoted figure. Home loans use reducing balance; check any other loan quoted as flat."],
        ["What is the APR in the Key Fact Statement?", "The annual percentage rate, which includes fees and charges as well as interest. RBI requires a Key Fact Statement with the APR for retail loans, so you can compare offers on the full cost."],
        ["Can I choose my EMI date?", "Many lenders allow a choice at sanction and sometimes a change later. Pick a date a few days after your salary arrives so the debit never bounces."],
      ],
    },
    {
      group: "Tenure and prepayment",
      items: [
        ["Is a longer tenure always bad?", "No. It lowers the EMI and gives breathing room. It costs more interest only if you keep it to the end. A long tenure plus regular prepayment can be a sensible plan."],
        ["Are there charges for prepaying a home loan?", "For floating-rate loans to individuals for non-business purposes, regulated lenders may not charge prepayment or foreclosure fees. Fixed-rate loans may carry a charge. Check the sanction letter and Key Fact Statement."],
        ["Should I reduce the EMI or the tenure after prepaying?", "Reducing the tenure saves more interest, because you keep paying the full EMI on a smaller balance. Reduce the EMI only if your monthly budget genuinely needs the room, for example after a drop in income."],
        ["Is there a minimum prepayment amount?", "Some lenders set a minimum, often a multiple of the EMI, and may limit how often you can prepay. Ask, and get the rule in writing."],
        ["When is the best time to prepay?", "As early as you can, because each rupee repaid stops attracting interest for all the remaining years. Keep your emergency fund intact first."],
        ["Does prepaying hurt my credit score?", "No. Repaying early is good behaviour. Make sure the lender reports the closed loan correctly when it is fully repaid."],
        ["Should I break a fixed deposit to prepay?", "If the deposit earns less after tax than your loan rate and it is not your emergency money, prepaying usually wins. Count any premature-withdrawal penalty."],
        ["Can I prepay using my EPF?", "EPF rules allow withdrawals for some housing purposes after a minimum period of membership. Check the current EPFO rules and remember that EPF money is meant for retirement."],
      ],
    },
    {
      group: "Rates",
      items: [
        ["What is an external benchmark?", "A rate set outside the bank, such as the RBI repo rate, to which most new floating-rate home loans from banks are linked. Your rate is the benchmark plus a spread."],
        ["Can the spread change?", "Some sanction letters allow the spread to change on a credit review or after a set period. Read the clause; it decides whether your rate can rise when the benchmark does not."],
        ["My rate fell but my EMI did not. Why?", "Many lenders shorten the tenure instead of cutting the EMI. Check the remaining tenure on your statement. You can usually ask for the EMI to change instead."],
        ["What happens to my EMI if the RBI raises rates?", "If your loan is linked to the repo rate, your rate is reset at the next reset date. The lender must tell you and, under RBI's instructions, offer a choice between a higher EMI, a longer tenure or both."],
        ["Is a fixed rate better?", "It gives certainty but usually starts higher and may reset after a few years. It can carry prepayment charges. Most home borrowers in India choose floating rates and keep a buffer."],
        ["Should I switch my old loan from MCLR to the repo-linked rate?", "Often yes, if the new rate after any conversion fee is lower and you are comfortable with faster pass-through of changes in both directions. Compare the total cost."],
      ],
    },
    {
      group: "Choosing and sizing a loan",
      items: [
        ["How much home loan can I get?", "Lenders look at FOIR, typically allowing all EMIs to take up 50 to 60 percent of net income, along with age, credit score and property value. Use the home loan calculator for an estimate."],
        ["How much should I borrow?", "Less than the maximum. Size the EMI so you can still save, keep an emergency fund, and survive a two-point rate rise."],
        ["What is the minimum down payment?", "RBI's LTV caps mean at least 10 percent for loans up to Rs. 30 lakh, 20 percent up to Rs. 75 lakh, and 25 percent above that, plus stamp duty and registration from your own funds."],
        ["Does a co-applicant help?", "Adding an earning co-applicant can raise the eligible amount. They share responsibility for the whole loan. Make sure both understand that."],
        ["What credit score do lenders look for?", "Each lender has its own cut-offs, but a higher score usually means a better rate. Check your report before applying and fix errors first."],
        ["Is a processing fee negotiable?", "Often, especially during festive offers or for applicants with a strong income and credit score. Ask for a waiver or a cap, and compare offers by total cost including fees rather than by rate alone."],
        ["What is a balance transfer?", "Moving your outstanding loan to another lender at a lower rate. It makes sense when the monthly saving recovers the fees within a reasonable time."],
        ["Should I take a top-up loan?", "A top-up can be cheaper than a personal loan, but it may run for many years and is secured on your home. Keep the tenure short and use it for lasting purposes."],
      ],
    },
    {
      group: "Insurance, tax and paperwork",
      items: [
        ["Is home-loan insurance compulsory?", "Property insurance may be required by the lender. Life or credit-protection cover is optional. You can buy a term policy from any insurer instead of a bundled one."],
        ["Can I claim tax benefits on my home loan?", "Under the old regime, interest on a self-occupied home is deductible up to Rs. 2 lakh a year and principal counts towards the Rs. 1.5 lakh savings limit. The new regime does not allow these for a self-occupied home."],
        ["What documents should I keep?", "The sanction letter, Key Fact Statement, loan agreement, disbursement letters, yearly interest certificates, rate-change letters and the final closure documents."],
        ["What happens when I finish paying?", "The lender must return your original property documents and release any registered charge within 30 days of full repayment, or compensate you for delay. Collect a no-dues certificate and check your credit report."],
        ["What if I miss an EMI?", "The lender will levy a penal charge, report the delay to credit bureaus, and contact you. Pay as soon as you can and talk to the lender early if you expect trouble; restructuring is easier before defaults pile up."],
        ["Can I transfer a home loan if I sell the house?", "Usually the loan is closed from the sale proceeds. The buyer takes a new loan. Plan the closure so documents can be handed over on the day of sale."],
        ["What is a Key Fact Statement?", "A short standard document every retail borrower must receive before signing, showing the amount, rate, APR, fees, repayment schedule and grievance contacts. Compare offers using it."],
      ],
    },
    {
      group: "Practical questions",
      items: [
        ["Can I pay two EMIs in one month to get ahead?", "You can usually pay extra, but the lender treats it as a part-prepayment of principal, not as an advance EMI. Ask for it to be applied to principal and for a revised schedule; that is what saves interest."],
        ["How do I read my annual loan statement?", "Look for the opening and closing principal, the interest charged during the year, the current rate, and the remaining tenure. Compare the remaining tenure with last year's: it should fall by twelve months unless you prepaid or the rate changed."],
        ["What is the difference between sanction and disbursement?", "Sanction is the lender's approval of an amount and terms. Disbursement is the actual payment of money, which may happen in stages. Interest runs only on what has been disbursed."],
        ["Can I get a home loan for a resale flat?", "Yes. The lender values the property, checks the title and pays the seller, often clearing the seller's existing loan first. Budget for stamp duty and registration on the full value."],
        ["Is it wise to take the maximum tenure the bank offers?", "Only if you have a plan to prepay. Otherwise you pay much more interest. Choose a tenure where the EMI fits comfortably and the loan ends before retirement."],
        ["How does a step-up EMI loan work?", "The EMI starts lower and rises over time, matching an expected salary increase. It costs more interest early on and is risky if raises do not come. A normal EMI with voluntary step-up prepayments gives the same benefit with less risk."],
        ["Should I keep some savings rather than prepay everything?", "Yes. Keep at least six months of expenses including EMIs in an emergency fund. A loan you can prepay is useless in a crisis if all your cash went into it."],
        ["What is a part-disbursement and does it affect my EMI?", "For property under construction, money is released in stages. Until the full amount is released, you pay interest on what has been released, or a proportionate EMI if the lender allows. The full EMI begins after final disbursement."],
        ["What happens to the loan if the borrower dies?", "The outstanding loan remains due and is recovered from the estate or the property unless insurance covers it. A term life policy for at least the loan amount protects the family from having to sell the home."],
        ["Can NRIs take home loans in India?", "Yes, many lenders offer loans to non-resident Indians under RBI and FEMA rules, with repayment from NRE or NRO accounts or from income in India. Documentation differs; check with the lender."],
        ["Is a home loan from a housing finance company different from a bank loan?", "Housing finance companies are regulated as well, and many rules on fair practice apply to both. They may use different internal benchmarks. Compare rates, fees, reset rules and service, not the type of lender."],
        ["How do I complain about a lender?", "Write to the lender's grievance officer first, keeping a copy. If there is no satisfactory reply within 30 days, you can complain under the RBI Integrated Ombudsman Scheme online."],
        ["Does a lower EMI after a rate cut happen automatically?", "Not always. Many lenders reduce the tenure instead. If you want a lower EMI, ask for it in writing after the reset."],
      ],
    },
  ],

  glossary: [
    ["Amortisation schedule", "A table showing, for each EMI, the interest part, the principal part and the balance left."],
    ["APR", "Annual percentage rate: the yearly cost of a loan including fees and charges, shown in the Key Fact Statement."],
    ["Balance transfer", "Moving an outstanding loan to another lender, usually for a lower rate."],
    ["Benchmark rate", "The external or internal rate to which a floating loan rate is linked, such as the RBI repo rate."],
    ["Broken-period interest", "Interest for the days between disbursement and the start of regular EMIs."],
    ["Co-applicant", "A second person on the loan who shares responsibility for repayment and whose income may count towards eligibility."],
    ["Credit score", "A number from a credit bureau summarising your repayment history, used by lenders to judge risk."],
    ["Disbursement", "The release of loan money, all at once or in stages for property under construction."],
    ["Down payment", "The part of the property price you pay from your own funds."],
    ["EMI", "Equated monthly instalment: the fixed monthly payment covering interest and principal."],
    ["Fixed rate", "A rate that does not change for a stated period."],
    ["Floating rate", "A rate that moves with a benchmark and is reset at set intervals."],
    ["FOIR", "Fixed obligations to income ratio: all EMIs as a share of net monthly income."],
    ["Foreclosure", "Repaying the whole outstanding loan before the end of the tenure."],
    ["Key Fact Statement", "A standard summary of a loan's terms, cost and schedule that lenders must give retail borrowers."],
    ["LTV", "Loan to value: the loan as a percentage of the property value accepted by the lender."],
    ["MCLR", "Marginal cost of funds based lending rate, an internal benchmark used by banks for many older loans."],
    ["No-dues certificate", "A letter from the lender confirming the loan is fully repaid."],
    ["Penal charges", "Charges for late or missed payments, which RBI now requires to be fixed charges rather than added interest."],
    ["Pre-EMI", "Interest-only payments on the disbursed part of a loan before full EMIs start."],
    ["Prepayment", "Paying back part of the principal earlier than scheduled."],
    ["Principal", "The amount borrowed, or the part of it still owed."],
    ["Processing fee", "A one-time charge for handling the loan application."],
    ["Repo rate", "The rate at which the RBI lends to banks; many home loans are linked to it."],
    ["Reset", "The date on which a floating rate is recalculated from its benchmark."],
    ["Sanction letter", "The lender's written approval stating amount, rate, tenure and conditions."],
    ["Spread", "The margin a lender adds to the benchmark to set your rate."],
    ["Stamp duty", "A state tax on property transactions, paid when the sale deed is registered."],
    ["Tenure", "The length of the loan, usually stated in months or years."],
    ["Top-up loan", "An additional loan on top of an existing home loan, secured on the same property."],
  ],

  references: [
    { title: "Reserve Bank of India (Pre-payment Charges on Loans) Directions, 2025", who: "Reserve Bank of India, July 2025", where: "rbi.org.in, Notifications", note: "No prepayment or foreclosure charges on floating-rate loans to individuals for non-business purposes, for loans sanctioned or renewed from 1 January 2026." },
    { title: "Reset of Floating Interest Rate on Equated Monthly Instalments based Personal Loans", who: "Reserve Bank of India circular, August 2023", where: "rbi.org.in", note: "Requires lenders to communicate rate resets and offer a choice of EMI increase, tenure extension, a combination, or a switch to a fixed rate." },
    { title: "Fair Lending Practice: Penal Charges in Loan Accounts", who: "Reserve Bank of India circular, August 2023", where: "rbi.org.in", note: "Penal charges replace penal interest and may not be capitalised." },
    { title: "Responsible Lending Conduct: Release of Movable / Immovable Property Documents on Repayment", who: "Reserve Bank of India circular, September 2023", where: "rbi.org.in", note: "Documents must be returned within 30 days of full repayment, with compensation for delay." },
    { title: "Key Facts Statement for Loans and Advances", who: "Reserve Bank of India circular, April 2024", where: "rbi.org.in", note: "A standard KFS with APR for retail and MSME loans from 1 October 2024." },
    { title: "Master Circular on Housing Finance", who: "Reserve Bank of India", where: "rbi.org.in, Master Circulars", note: "Includes the loan-to-value limits for housing loans." },
    { title: "Income-tax Act and Rules", who: "Income Tax Department, Government of India", where: "incometaxindia.gov.in", note: "Current rules on deductions for home-loan interest and principal under each regime." },
    { title: "RBI Integrated Ombudsman Scheme", who: "Reserve Bank of India", where: "cms.rbi.org.in", note: "Where to complain if a regulated lender does not resolve a grievance within 30 days." },
  ],
};
