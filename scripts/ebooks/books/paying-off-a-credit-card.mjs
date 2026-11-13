// Practice material for "Paying Off a Credit Card".
// Payoff figures use the same method as the site's credit card payoff calculator:
// each month, interest = balance × yearly rate / 12, with 18% GST on the interest
// unless stated, then the payment is subtracted.
import { inr } from "../lib/calc.mjs";

const Rs = (n) => `Rs. ${inr(n)}`;
function payoff(balance, apr, pay, gst = true, newSpend = 0) {
  const r = apr / 1200;
  const k = gst ? 1.18 : 1;
  let b = balance;
  let m = 0;
  let interest = 0;
  if (pay <= b * r * k + newSpend) return { never: true, months: Infinity, interest: Infinity, firstInterest: b * r * k };
  while (b > 0.01 && m < 600) {
    const i = b * r * k;
    interest += i;
    b = b + i + newSpend - pay;
    m += 1;
  }
  return { never: false, months: m, interest, firstInterest: balance * r * k };
}
// Minimum due modelled as 5% of balance, floor Rs. 200.
function minimumPath(balance, apr, pct = 5, floor = 200, gst = true) {
  const r = apr / 1200;
  const k = gst ? 1.18 : 1;
  let b = balance;
  let m = 0;
  let interest = 0;
  while (b > 1 && m < 600) {
    const i = b * r * k;
    interest += i;
    const pay = Math.min(b + i, Math.max(floor, (b * pct) / 100));
    b = b + i - pay;
    m += 1;
  }
  return { months: m, interest };
}
function emi(P, rate, months) {
  const r = rate / 1200;
  return (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}
const yrs = (m) => (m >= 12 ? `${Math.floor(m / 12)} years${m % 12 ? ` ${m % 12} months` : ""}` : `${m} months`);
// Avalanche vs snowball for a set of cards with a total monthly budget.
function multi(cards, budget, order) {
  const cs = cards.map((c) => ({ ...c }));
  let m = 0;
  let interest = 0;
  while (cs.some((c) => c.bal > 0.01) && m < 600) {
    m += 1;
    for (const c of cs) {
      if (c.bal <= 0) continue;
      const i = c.bal * (c.apr / 1200) * 1.18;
      interest += i;
      c.bal += i;
    }
    let left = budget;
    for (const c of cs) {
      if (c.bal <= 0) continue;
      const p = Math.min(c.bal, c.min);
      c.bal -= p;
      left -= p;
    }
    const sorted = cs.filter((c) => c.bal > 0).sort(order);
    for (const c of sorted) {
      if (left <= 0) break;
      const p = Math.min(c.bal, left);
      c.bal -= p;
      left -= p;
    }
  }
  return { months: m, interest };
}
const threeCards = [
  { name: "Card A", bal: 120000, apr: 42, min: 6000 },
  { name: "Card B", bal: 45000, apr: 36, min: 2250 },
  { name: "Card C", bal: 15000, apr: 30, min: 750 },
];
const avalanche = multi(threeCards, 18000, (a, b) => b.apr - a.apr);
const snowball = multi(threeCards, 18000, (a, b) => a.bal - b.bal);

const ex1 = payoff(100000, 42, 10000);
const ex1min = minimumPath(100000, 42);

export default {
  checked: "October 2026",
  welcome:
    "A credit card is the cheapest loan you will ever have if you pay the full statement every month, and one of the most expensive if you do not. This book shows exactly how revolving interest builds, why the minimum due is a trap, how to choose a payment you can keep, which balance to attack first, when a personal loan or EMI conversion helps, and how to use a card afterwards without sliding back.",

  chapters: [
    {
      title: "How card interest is really charged",
      paragraphs: [
        "Indian card statements quote a monthly rate, typically between 2.5 and 3.75 percent. Multiply by twelve and you get 30 to 45 percent a year. On top of that, GST at 18 percent is charged on interest and on fees.",
      ],
      sections: [
        {
          heading: "The interest-free period disappears",
          paragraphs: [
            "If you pay the full statement balance by the due date, you pay no interest at all. That is the interest-free period, often 20 to 50 days depending on when in the cycle you spent.",
            "If you pay anything less than the full balance, most issuers charge interest on the purchases from the date of each transaction, not from the due date, and new purchases attract interest from the day they are made until the balance is cleared. Read your card's most important terms and conditions for its exact method; it is the single most expensive clause in the agreement.",
          ],
        },
        {
          heading: "A month of revolving, step by step",
          paragraphs: [
            `Suppose you carry ${Rs(100000)} at 3.5 percent a month, 42 percent a year. One month's interest is ${Rs(3500)}. GST at 18 percent on that interest adds ${Rs(630)}. So the balance grows by ${Rs(4130)} in a month before any payment, about ${Rs(138)} a day.`,
            `If you pay ${Rs(10000)} a month and spend nothing new, the balance is cleared in ${ex1.months} months with about ${Rs(ex1.interest)} of interest and GST. That is the figure the site's payoff calculator shows with GST switched on.`,
          ],
        },
        {
          heading: "Fees that join the balance",
          bullets: [
            "Late payment charge, in slabs by balance, if the minimum is not paid within three days of the due date.",
            "Cash advance fee, usually 2.5 percent or a minimum amount, plus interest from the day of withdrawal with no free period.",
            "Over-limit fees, where the card allows spending beyond the limit.",
            "Annual or renewal fees, sometimes waived on a spending threshold.",
            "GST at 18 percent on all of these.",
          ],
          note: "Under RBI rules, a card account is reported as past due, and late charges apply, only if the minimum amount due is unpaid for more than three days after the due date.",
        },
      ],
    },
    {
      title: "Why the minimum due is a trap",
      paragraphs: [
        "The minimum amount due is set so that the account stays in good standing. It is usually around 5 percent of the balance, or a small fixed amount, plus any EMIs and fees. It is not a repayment plan.",
      ],
      sections: [
        {
          heading: "What paying the minimum does",
          paragraphs: [
            `On ${Rs(100000)} at 42 percent with GST, paying 5 percent of the balance each month (at least Rs. 200) takes about ${yrs(ex1min.months)} to clear and costs about ${Rs(ex1min.interest)} in interest and GST, assuming no new spending. A fixed ${Rs(10000)} clears it in ${ex1.months} months for ${Rs(ex1.interest)}.`,
            "The minimum falls as the balance falls, so the payments shrink with it and the tail drags on for years. That is why the statement now shows how long repayment would take on minimum payments alone; read that line.",
          ],
        },
        {
          heading: "A fixed payment you can keep",
          paragraphs: [
            "The single best change is to choose a fixed monthly payment, well above the minimum, that you can make even in a bad month, and set it up as a standing instruction. As the balance falls, the fixed payment pays down more principal each month, which accelerates the end.",
          ],
          table: {
            caption: `Clearing ${Rs(100000)} at 42 percent plus GST, no new spending.`,
            headers: ["Monthly payment", "Months", "Interest and GST"],
            rows: [5000, 7500, 10000, 15000, 20000, 25000].map((p) => {
              const r = payoff(100000, 42, p);
              return [inr(p), r.never ? "never" : String(r.months), r.never ? "-" : inr(r.interest)];
            }),
          },
        },
      ],
    },
    {
      title: "Several cards: which first",
      paragraphs: [
        "With more than one card, pay every card's minimum on time, then put every spare rupee on one card until it is gone, then move to the next. Splitting the extra evenly is the slowest and most expensive approach.",
      ],
      sections: [
        {
          heading: "Highest rate first, or smallest balance first",
          paragraphs: [
            "Paying the highest-rate card first, sometimes called the avalanche method, saves the most interest. Paying the smallest balance first, the snowball method, closes accounts sooner, which some people find motivating.",
            `With three cards, ${Rs(120000)} at 42 percent, ${Rs(45000)} at 36 percent and ${Rs(15000)} at 30 percent, and Rs. 18,000 a month in total, the avalanche finishes in ${avalanche.months} months with about ${Rs(avalanche.interest)} of interest; the snowball finishes in ${snowball.months} months with about ${Rs(snowball.interest)}.`,
            "The difference is real but often modest. Pick the method you will stick with. What matters far more is the total monthly amount and not adding new spending.",
          ],
        },
        {
          heading: "Stop the inflow",
          paragraphs: [
            "No plan works while new spending lands on the card being repaid. Put the card away, remove it from saved payment details on shopping apps, and pay for daily spending by debit card or UPI from a budget. If you need a card for bookings, use one that you pay in full each month, not the one you are clearing.",
          ],
        },
      ],
    },
    {
      title: "Cheaper money to clear a card",
      paragraphs: [
        "Moving a card balance to a cheaper loan can save a great deal of interest, but only if you then stop using the card and keep paying. Each option has a catch.",
      ],
      sections: [
        {
          heading: "Personal loan",
          paragraphs: [
            `A personal loan at 13 percent for 2 years on ${Rs(150000)} has an EMI of ${Rs(emi(150000, 13, 24))} and total interest of ${Rs(emi(150000, 13, 24) * 24 - 150000)}. Paying the same amount each month on a card at 42 percent plus GST would take ${payoff(150000, 42, emi(150000, 13, 24)).never ? "forever" : `${payoff(150000, 42, emi(150000, 13, 24)).months} months`} and cost ${payoff(150000, 42, emi(150000, 13, 24)).never ? "an unbounded amount" : Rs(payoff(150000, 42, emi(150000, 13, 24)).interest)}.`,
            "Count the processing fee and GST on it, and any prepayment charge. The loan only helps if the card balance stays at zero afterwards; many people end up with both.",
          ],
        },
        {
          heading: "EMI conversion on the card",
          paragraphs: [
            "Most issuers let you convert a large purchase or the outstanding balance into EMIs at a lower rate, often 13 to 24 percent, plus a processing fee and GST. It is usually cheaper than revolving, but compare the effective rate including the fee, and remember that the EMI amount blocks part of your limit and counts towards the minimum due.",
          ],
        },
        {
          heading: "Balance transfer",
          paragraphs: [
            "Some cards offer to take over another card's balance at a low rate for a few months. Check the fee, the rate after the offer ends, and whether new purchases on the receiving card lose their interest-free period while the transferred balance remains. Clear the transferred amount before the offer ends.",
          ],
        },
        {
          heading: "Gold loan or loan against deposit",
          paragraphs: [
            "A loan against gold or a fixed deposit is often far cheaper than a card, sometimes under 10 to 12 percent. Breaking a low-yield deposit to clear a 42 percent card is almost always worthwhile, unless the deposit is your only emergency fund.",
          ],
        },
      ],
    },
    {
      title: "Your rights as a cardholder",
      paragraphs: [
        "RBI's Master Direction on credit and debit cards, issued in 2022 and updated since, gives cardholders several protections worth knowing.",
      ],
      sections: [
        {
          bullets: [
            "Closure: a request to close a card must be processed within seven working days if all dues are paid, with compensation of Rs. 500 a day for delay.",
            "No unsolicited cards or limit increases without your explicit consent.",
            "Late charges only when the minimum due is unpaid for more than three days after the due date.",
            "A one-time option to change the billing cycle.",
            "Interest and charges must be shown clearly; no charge may be levied that was not disclosed.",
            "Unused cards: if a card has not been used for over a year, the issuer must seek your consent and may close it if you do not respond.",
            "Complaints: the issuer must respond within set timelines; if not, you can approach the RBI Ombudsman.",
          ],
          note: "Rules are updated from time to time. Check the current Master Direction on rbi.org.in for exact wording.",
        },
      ],
    },
    {
      title: "Credit score: what repayment does",
      paragraphs: [
        "Every card payment is reported to credit bureaus. Since 2025, lenders report credit information at least every fifteen days, so improvements and lapses both show up faster than they used to.",
      ],
      sections: [
        {
          heading: "What helps and what hurts",
          bullets: [
            "Paying at least the minimum on time every month matters most; a single 30-day late payment can mark your record for years.",
            "Credit utilisation, the balance as a share of the limit, matters; keeping it under about 30 percent is a common guide.",
            "Closing your oldest card can shorten your credit history; closing a newer unused card has less effect.",
            "Many applications for new credit in a short time can lower a score.",
            "Settling a card for less than the full amount is reported as settled, which lenders view poorly for years.",
          ],
        },
        {
          heading: "During repayment",
          paragraphs: [
            "As you pay down a balance, utilisation falls and the score tends to improve, as long as every payment is on time. A personal loan used to clear cards replaces revolving debt with an instalment loan, which many scoring models treat more favourably, provided the cards are not filled again.",
          ],
        },
      ],
    },
    {
      title: "Using a card afterwards",
      paragraphs: [
        "Once the balance is gone, a card can be useful: purchase protection, a record of spending, rewards and an interest-free float. The rule that keeps it useful is simple: pay the full statement balance by auto-debit every month.",
      ],
      sections: [
        {
          steps: [
            "Set an auto-debit for the total amount due, not the minimum, from the account your salary arrives in.",
            "Keep the limit well above what you spend, and spend only what is already in your budget.",
            "Check the statement each month for errors and unfamiliar charges; dispute promptly.",
            "Turn off international and online use in the app when not needed, and set transaction alerts.",
            "Never withdraw cash on a credit card except in a genuine emergency.",
            "Keep an emergency fund in the bank so the card is never the emergency fund.",
          ],
        },
      ],
    },
    {
      title: "Reading your statement line by line",
      paragraphs: [
        "Most people look at two numbers on a card statement: the total due and the minimum due. A few more lines tell you whether you are winning or losing.",
      ],
      sections: [
        {
          table: {
            caption: "Common statement lines and what to do with them.",
            headers: ["Line", "What it means", "What to check"],
            widths: [1.2, 2, 2],
            rows: [
              ["Previous balance", "What you owed at the last statement", "Should fall month by month while you repay"],
              ["Payments and credits", "Money received and refunds", "That every payment you made appears"],
              ["Purchases and debits", "New spending this cycle", "Should be near zero on a card you are clearing"],
              ["Finance charges", "Interest for the cycle", "Compare with last month; it should fall"],
              ["Fees and GST", "Late fees, annual fee, GST", "Any fee you did not expect; ask for a reversal"],
              ["Total amount due", "The full balance", "Pay this to owe no interest"],
              ["Minimum amount due", "Smallest payment to avoid late charges", "Never treat it as the plan"],
              ["Available credit", "Limit minus balance", "A falling figure while repaying means new spending"],
              ["Reward points", "Points earned and expiring", "Redeem before expiry; points do not reduce interest"],
            ],
          },
        },
        {
          heading: "Three questions every month",
          steps: [
            "Is the previous balance lower than last month's?",
            "Are the finance charges lower than last month's?",
            "Is there any new purchase on this card that should not be there?",
          ],
          paragraphs: ["If all three answers are right, the plan is working. If not, find the reason before the next payment."],
        },
        {
          heading: "Asking for a fee reversal",
          paragraphs: [
            "Issuers often reverse a first late fee or an annual fee for customers with a good record, if asked politely. Call or chat, explain, and ask. Keep the reference number. It costs nothing and often works.",
          ],
        },
      ],
    },
    {
      title: "Finding the money for the payment",
      paragraphs: [
        "A payoff plan is only as good as the monthly amount behind it. Most people find that amount in a few places rather than one.",
      ],
      sections: [
        {
          heading: "A short, honest budget",
          paragraphs: [
            "Write down take-home pay, then fixed costs: rent or EMI, utilities, school fees, insurance, transport. Then the flexible categories: groceries, eating out, shopping, subscriptions, travel. The card payment comes from the flexible categories, not from skipping a fixed bill.",
            "For three to six months, set a lower ceiling on two or three flexible categories and move the difference to the card on salary day. A temporary squeeze with an end date is easier to keep than a vague promise to spend less.",
          ],
        },
        {
          heading: "Places money hides",
          bullets: [
            "Subscriptions you no longer use: streaming, apps, gym, cloud storage.",
            "Food delivery and eating out, often the largest flexible category.",
            "Insurance policies bought as investments, which can sometimes be made paid-up.",
            "A phone or internet plan larger than you use.",
            "Cash lying idle in a savings account beyond the emergency fund.",
            "Unused items worth selling.",
          ],
        },
        {
          heading: "Windfalls",
          paragraphs: [
            "Bonuses, tax refunds, gifts and arrears are the fastest way to shorten a payoff. Decide in advance that a fixed share, say half or more, goes to the card the day it arrives. A windfall spent in the first week is a windfall lost.",
          ],
        },
      ],
    },
    {
      title: "When you cannot pay",
      paragraphs: [
        "Job loss, illness or a family crisis can make even the minimum hard. The worst thing to do is go silent. Lenders have more options for customers who contact them early.",
      ],
      sections: [
        {
          steps: [
            "Pay at least the minimum on every account if you possibly can, to avoid late marks.",
            "Call the issuer before a payment is missed. Explain the change and ask what options exist: EMI conversion at a lower rate, a temporary reduced payment, or a restructuring.",
            "Get any arrangement in writing, with the monthly amount, rate, duration and how it will be reported.",
            "Stop all new spending on the cards.",
            "List your debts by rate and size, and protect essentials such as rent, food, school fees and insurance first.",
            "If collection calls become abusive, note the time, number and what was said. RBI rules require recovery agents to act within a code of conduct; complain to the bank and, if needed, the Ombudsman.",
          ],
        },
        {
          heading: "Settlement as the last option",
          paragraphs: [
            "A one-time settlement for less than the dues ends the debt but is reported as settled, which lenders view poorly for years. Consider it only when repayment is not realistic. If you accept, get the terms in writing on the bank's letterhead, pay exactly as agreed, and obtain a no-dues certificate.",
          ],
        },
      ],
    },
    {
      title: "Other ways debt sneaks in",
      paragraphs: [
        "Credit cards are not the only form of easy credit. Several newer products work similarly, with similar risks.",
      ],
      sections: [
        { label: "Buy now, pay later", paragraphs: ["BNPL offers split a purchase into instalments, often interest-free if paid on time, with steep late fees. They are reported to credit bureaus. Several small BNPL plans can add up to a large monthly obligation without a single statement showing the total."] },
        { label: "Credit lines on UPI", paragraphs: ["Banks now offer pre-approved credit lines usable through UPI. They behave like a credit card without the card: convenient and easy to overuse. Treat them with the same rules."] },
        { label: "Instant loan apps", paragraphs: ["Some apps offer small, fast loans at very high effective rates and have been linked to harassment. Use only apps from regulated lenders listed on RBI's or the lender's website, and avoid any that demand access to your contacts and photos."] },
        { label: "Overdrafts", paragraphs: ["An overdraft against salary or a deposit charges interest only on the amount used, often below card rates. It can be a useful bridge, but it is still debt."] },
        { label: "Store credit and EMI cards", paragraphs: ["Consumer finance cards for electronics and appliances make borrowing feel routine. Count all of these together when you ask how much you owe each month."] },
      ],
    },
    {
      title: "Rewards, fees and the right card",
      paragraphs: [
        "Once you pay in full every month, a card's value is the rewards and protections it gives minus its fees. Choosing well is simple arithmetic.",
      ],
      sections: [
        {
          heading: "Does the card pay for itself?",
          paragraphs: [
            `A card with a Rs. 1,000 annual fee plus GST and 1 percent rewards needs about Rs. ${inr((1000 * 1.18) / 0.01)} of yearly spending just to break even. Many fees are waived above a spending threshold; check whether you cross it with spending you would make anyway.`,
            "Lifetime-free cards with modest rewards often beat premium cards for ordinary spending. Premium cards pay off for frequent travellers who use lounge access, insurance and higher reward rates on travel.",
          ],
        },
        {
          heading: "Reward traps",
          bullets: [
            "Points that expire before you reach a useful redemption.",
            "Redemption catalogues where points are worth much less than the advertised rate.",
            "Categories excluded from rewards, often fuel, rent, utilities, insurance or wallet loads.",
            "Spending more than planned to reach a milestone bonus.",
            "Any interest paid, which outweighs rewards almost immediately.",
          ],
        },
        {
          heading: "How many cards?",
          paragraphs: [
            "One or two cards paid in full are enough for most people: one for everyday spending, perhaps one for travel. More cards add more due dates to track, more annual fees, and more temptation. If you have several, set every one to auto-debit the full amount.",
          ],
        },
      ],
    },
    {
      title: "Keeping your card safe",
      paragraphs: ["Most card fraud uses one of a few routes. A handful of settings and habits close nearly all of them."],
      sections: [
        {
          heading: "Settings",
          bullets: [
            "Turn off international, online and contactless usage in the app when you do not need them.",
            "Set per-transaction and daily limits close to your normal spending.",
            "Turn on alerts for every transaction by SMS and app notification.",
            "Register your current mobile number and email with the issuer.",
          ],
        },
        {
          heading: "Habits",
          bullets: [
            "Never share the CVV, OTP or PIN with anyone, including someone claiming to be from the bank.",
            "Do not let a waiter or shopkeeper take the card out of sight.",
            "Type the bank's address yourself or use its app; do not follow links in messages about card upgrades, reward expiry or blocks.",
            "Check every statement within a few days of receiving it.",
            "Shred old statements and expired cards.",
          ],
        },
        {
          heading: "If something goes wrong",
          paragraphs: [
            "Block the card in the app first, then call the issuer's number from the back of the card or its website, and report each unauthorised transaction in writing. Also report to 1930 or cybercrime.gov.in if money was taken by fraud. The faster you report, the better your protection under RBI's liability rules.",
          ],
        },
      ],
    },
    {
      title: "A twelve-month plan, worked",
      paragraphs: [
        `Here is a complete plan for one illustrative borrower. Kavya, in Hyderabad, has a take-home of Rs. 75,000 and two cards: ${Rs(110000)} at 42 percent and ${Rs(40000)} at 36 percent. Minimums total about Rs. 7,500. After a budget review she can put Rs. 16,000 a month towards the cards, and expects a Rs. 40,000 bonus in month six.`,
      ],
      sections: [
        {
          table: {
            caption: "Highest rate first, Rs. 16,000 a month plus the bonus in month 6. Interest includes GST.",
            headers: ["Month", "Card at 42%", "Card at 36%", "Interest that month"],
            rows: (() => {
              const rows = [];
              let a = 110000;
              let b = 40000;
              for (let m = 1; m <= 14 && (a > 0.5 || b > 0.5); m++) {
                const ia = a * 0.035 * 1.18;
                const ib = b * 0.03 * 1.18;
                a += ia;
                b += ib;
                let pay = 16000 + (m === 6 ? 40000 : 0);
                const minB = Math.min(b, Math.max(200, b * 0.05));
                b -= minB;
                pay -= minB;
                const pa = Math.min(a, pay);
                a -= pa;
                pay -= pa;
                const pb = Math.min(b, pay);
                b -= pb;
                rows.push([String(m), inr(Math.max(0, a)), inr(Math.max(0, b)), inr(ia + ib)]);
              }
              return rows;
            })(),
          },
          paragraphs: [
            "The 42 percent card falls fastest because it receives everything above the other card's minimum; the bonus in month six nearly clears it. Once it is gone, the full payment moves to the second card, which then clears quickly. Monthly interest falls from over Rs. 5,800 to nothing.",
            "Kavya keeps the second card, sets it to auto-debit the full balance, and moves the Rs. 16,000 into a recurring deposit for an emergency fund. After a year she has no card debt and the start of a reserve.",
          ],
        },
      ],
    },
    {
      title: "Talking about debt at home",
      paragraphs: [
        "Card debt is often hidden from a partner or parents out of embarrassment, and the secrecy makes it harder to fix. A calm conversation usually helps more than it hurts.",
      ],
      sections: [
        {
          heading: "Before the conversation",
          paragraphs: [
            "Write down every balance, rate and minimum, and the plan you have worked out. A problem presented with a plan is easier to discuss than a confession without one.",
          ],
        },
        {
          heading: "During it",
          paragraphs: [
            "Explain how it happened without blaming, say what you will change, and ask for specific help: support in cutting a spending category, a short loan at a low rate, or simply someone to check the statement with you each month. Agree on what happens to new spending.",
          ],
        },
        {
          heading: "Helping someone else",
          paragraphs: [
            "If you are helping a family member, avoid simply paying off their card unless the spending habits have changed; the balance often returns. Lending at a low rate with a written repayment plan, and helping them set up auto-debit for the full balance afterwards, tends to work better.",
          ],
        },
      ],
    },
    {
      title: "Where to get help",
      paragraphs: ["If debts feel unmanageable, help is available, and some of it is free."],
      sections: [
        { label: "Your bank or card issuer", paragraphs: ["Ask for EMI conversion, a reduced rate, or a restructuring plan. Issuers often prefer a plan to a default."] },
        { label: "Credit counselling", paragraphs: ["Some banks run financial literacy and credit counselling centres that offer free advice on budgets and debt plans. Ask your bank or look for centres set up under RBI's financial literacy initiatives."] },
        { label: "The RBI Ombudsman", paragraphs: ["For complaints about a regulated lender's conduct, charges or recovery practices that are not resolved within 30 days."] },
        { label: "Cyber fraud helpline", paragraphs: ["1930 and cybercrime.gov.in for fraud involving your card or accounts."] },
        { label: "A trusted adviser", paragraphs: ["A SEBI-registered investment adviser or a qualified accountant can help structure a plan, especially when debts, taxes and savings interact."] },
      ],
    },
    {
      title: "Card myths, checked",
      paragraphs: ["Beliefs about cards that cost people money, and what is true."],
      sections: [
        { label: "Myth: Carrying a balance improves my credit score.", paragraphs: ["Paying on time builds your score. Carrying a balance only costs interest. Paying in full every month is reported just as positively."] },
        { label: "Myth: The minimum due is what I owe this month.", paragraphs: ["You owe the total amount due. The minimum only avoids late charges and past-due reporting."] },
        { label: "Myth: Using more of my limit shows I am creditworthy.", paragraphs: ["High utilisation tends to lower scores. Using a small share of the limit and paying in full is better."] },
        { label: "Myth: Closing all my cards will fix my score.", paragraphs: ["It can reduce your available credit and history length. Close the cards you cannot control; keep a well-used old card if you pay it in full."] },
        { label: "Myth: No-cost EMI is always free.", paragraphs: ["There may be GST on interest, processing fees, and a lost cash discount."] },
        { label: "Myth: Rewards make revolving worthwhile.", paragraphs: ["Interest at 3 to 3.75 percent a month dwarfs rewards of 1 to 2 percent of spending."] },
        { label: "Myth: Settlement wipes the slate clean.", paragraphs: ["It ends the debt but is reported as settled, which affects borrowing for years."] },
        { label: "Myth: I cannot be held liable for fraud if I shared my OTP.", paragraphs: ["Sharing an OTP or PIN can make you liable for the loss. Banks never ask for them."] },
      ],
    },
    {
      title: "Before you apply for a new card",
      paragraphs: ["A new card is a new line of credit. A few questions before applying prevent most later problems."],
      sections: [
        {
          steps: [
            "Do I already pay my existing cards in full every month? If not, a new card will not help.",
            "What will this card do that my current one does not, in rupees a year?",
            "What are the joining fee, annual fee and the spending needed to waive it?",
            "What is the interest rate, cash advance fee and late fee?",
            "What credit limit will I ask for, and is it below what would tempt me?",
            "Will I set up auto-debit for the full balance on the first day?",
          ],
        },
        {
          heading: "Pre-approved offers",
          paragraphs: [
            "A pre-approved offer is still an application: it usually creates a credit enquiry and a new account on your report. Accept only if you would have chosen the card anyway. Ignore offers that arrive by message with links; apply through the bank's own app or website.",
          ],
        },
        {
          heading: "Cards against fixed deposits",
          paragraphs: [
            "Secured cards issued against a fixed deposit suit people with no credit history or a damaged one. The limit is a share of the deposit, which keeps spending modest. Used well for a year or two, they can lead to unsecured cards with better terms.",
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Fifteen cardholders, each with a balance and a reason. Figures use the payoff method described in the first chapter, with 18 percent GST on interest unless stated, and assume no new spending on the card being repaid.",

  scenarios: [
    {
      title: "Festival shopping that lingered",
      paragraphs: [
        `Meena in Chennai spent ${Rs(80000)} on her card during Diwali and paid the minimum for four months while she thought about it. By then the balance had barely moved.`,
        `At 39 percent with GST, a fixed ${Rs(8000)} a month clears ${Rs(80000)} in ${payoff(80000, 39, 8000).months} months with about ${Rs(payoff(80000, 39, 8000).interest)} of interest. Paying the minimum would take about ${yrs(minimumPath(80000, 39).months)}.`,
        "She set a standing instruction for Rs. 8,000 on salary day and moved her daily spending to UPI. She also put a reminder in her calendar for next September to start a festival savings jar, so next year's shopping is paid from cash.",
        "Looking back, she worked out that the four months of minimum payments had cost about Rs. 9,000 in interest and GST while reducing the balance by only a few thousand rupees. That number was what convinced her to set the fixed instruction the same evening."
      ],
      lesson: "A seasonal spend becomes a year-round loan if only the minimum is paid. Fix the payment the week the statement arrives.",
    },
    {
      title: "Three cards and one plan",
      paragraphs: [
        "Rahul in Gurugram had three cards with balances of Rs. 1.2 lakh, Rs. 45,000 and Rs. 15,000 at 42, 36 and 30 percent. He could pay Rs. 18,000 a month in total.",
        `He paid all three minimums and put the rest on the 42 percent card first. It cleared in about a year; then the freed money went to the 36 percent card, then the last. Altogether it took ${avalanche.months} months with about ${Rs(avalanche.interest)} of interest.`,
        "His friend suggested clearing the smallest card first for the satisfaction. The arithmetic said that would cost slightly more. Rahul chose the highest rate first but kept a chart on the fridge, crossing off each Rs. 10,000, which gave him the motivation the snowball promises.",
        "The plan also had a safety valve: if a month went badly, he would still pay every minimum and simply put less extra on the target card, rather than skipping a payment. In the eighteen months it never came to that, but knowing the rule kept him calm."
      ],
      lesson: "Pay all minimums, then attack one card at a time. Highest rate first saves most; pick a method you will follow.",
    },
    {
      title: "Personal loan to clear cards",
      paragraphs: [
        `Sunita in Pune owed ${Rs(250000)} across two cards at about 40 percent. Her bank offered a personal loan at 12.5 percent for 3 years with a 1.5 percent fee plus GST.`,
        `The EMI is ${Rs(emi(250000, 12.5, 36))}, total interest ${Rs(emi(250000, 12.5, 36) * 36 - 250000)}, and the fee about ${Rs(250000 * 0.015 * 1.18)}. Paying the same amount on the cards would not even cover their monthly interest and GST of about ${Rs(250000 * (40 / 1200) * 1.18)}, so the balance would keep growing.`,
        "She took the loan, cleared both cards the same day, and asked one issuer to close its card. She kept the other with a lower limit and an auto-debit for the full balance, so it could not quietly fill up again.",
        "Her bank also offered to waive the personal loan's processing fee if she set up the EMI from her salary account. She asked, and it agreed, which saved most of the Rs. 4,400 fee."
      ],
      lesson: "A cheaper loan helps only if the cards stay at zero. Close or restrict them the day you clear them.",
    },
    {
      title: "Cash withdrawal in an emergency",
      paragraphs: [
        "Arjun in Jaipur withdrew Rs. 30,000 in cash on his credit card when his father was admitted to hospital at night.",
        `The cash advance fee was 2.5 percent, Rs. 750, plus GST, and interest at 3.5 percent a month started that day with no free period. Over a month that added about ${Rs(30000 * 0.035 * 1.18 + 750 * 1.18)} including GST.`,
        "He paid it off in full from his salary three weeks later, which kept the cost to a little over a thousand rupees. Afterwards he built an emergency fund of Rs. 50,000 in a sweep account and bought a family health policy, so the next night-time admission would not need the card.",
        "He also asked the hospital for its cashless facility details with his new policy, so that the next time the hospital would bill the insurer directly and he would only need to pay any co-payment."
      ],
      lesson: "Cash on a credit card is expensive from day one. Use it only in a true emergency and repay it first.",
    },
    {
      title: "An EMI conversion that was not cheap",
      paragraphs: [
        "Faisal in Lucknow converted a Rs. 60,000 phone purchase into a 12-month EMI on his card at '1.33 percent a month', plus a processing fee of Rs. 499 and GST.",
        `1.33 percent a month is about 16 percent a year. The EMI is ${Rs(emi(60000, 16, 12))}; interest over the year is ${Rs(emi(60000, 16, 12) * 12 - 60000)}, plus GST on the interest and the fee. The total extra cost was about ${Rs((emi(60000, 16, 12) * 12 - 60000) * 1.18 + 499 * 1.18)}.`,
        "It was still much cheaper than revolving the balance at 42 percent. But he noted that the shop's no-cost EMI offer at another bank would have cost only the fee, and that the cash price was lower still if he had waited two months.",
        "He now asks one question before any EMI offer: what is the total I will pay, including every fee and GST, compared with the cash price today? The answer decides it, not the monthly figure."
      ],
      lesson: "EMI conversion is cheaper than revolving, but compare the effective yearly rate and fees with alternatives.",
    },
    {
      title: "The 'no-cost' EMI",
      paragraphs: [
        "Priya in Hyderabad bought a laptop for Rs. 72,000 on a six-month no-cost EMI. The merchant gave an upfront discount equal to the interest, so six EMIs added up to Rs. 72,000.",
        "But the bank charged GST on the interest component, which the discount does not cover, and a Rs. 199 processing fee plus GST. Her total extra cost was a few hundred rupees.",
        "She also noticed that customers paying in full by debit card received an additional Rs. 2,000 cash discount, which she did not get with the EMI. The real cost of the 'no-cost' EMI was that missed discount plus fees.",
        "The lesson she took was to ask for the cash price first, then the EMI offer, and compare the totals. If the totals are the same and she would otherwise have to break savings, the EMI is fine; if not, the cash discount wins."
      ],
      lesson: "No-cost EMIs usually have small costs: GST on interest, fees, and any cash discount you give up.",
    },
    {
      title: "Payment that does not cover the interest",
      paragraphs: [
        `Ramesh in Nagpur had ${Rs(200000)} on a card at 42 percent and was paying ${Rs(6000)} a month, a little above the minimum.`,
        `Monthly interest with GST was about ${Rs(200000 * 0.035 * 1.18)}, more than his payment. His balance was growing every month even though he never missed a due date.`,
        `He raised the payment to ${Rs(15000)} by cutting a car upgrade, which clears the card in ${payoff(200000, 42, 15000).months} months. He also checked whether a loan against his Rs. 3 lakh fixed deposit at 1 percent above the deposit rate could clear it faster and cheaper, and did that instead.`,
        "He also asked the bank to stop counting the old minimum as his plan. The bank's statement now shows his fixed payment as an auto-debit, and the months-to-repay line on the statement fell from 'more than 20 years' to just over a year."
      ],
      lesson: "If your payment is below the monthly interest, the balance grows forever. Check that line first.",
    },
    {
      title: "Using the deposit to clear the card",
      paragraphs: [
        "Anita in Kolkata had Rs. 1 lakh on a card at 40 percent and Rs. 2.5 lakh in a fixed deposit at 7 percent, kept 'for emergencies'.",
        `Keeping both cost her about ${Rs(100000 * 0.4 * 1.18 - 100000 * 0.07)} a year: card interest and GST far above the deposit's interest. She broke Rs. 1 lakh of the deposit, paid a small premature-withdrawal penalty, and cleared the card.`,
        "Her remaining Rs. 1.5 lakh stayed as the emergency fund. She then rebuilt the broken part by setting the old card payment as a monthly recurring deposit, so in a year the fund was back to Rs. 2.5 lakh.",
        "Her rule now is that the emergency fund must hold at least three months of expenses before any spare money goes elsewhere, and that any spare money beyond that first clears expensive debt."
      ],
      lesson: "Holding savings at 7 percent while owing at 40 percent is a loss. Use spare savings to clear expensive debt, keeping an emergency reserve.",
    },
    {
      title: "A balance transfer deadline",
      paragraphs: [
        "Kiran in Bengaluru moved Rs. 90,000 to a new card offering 1 percent a month for six months, with a 2 percent fee plus GST.",
        "He planned to pay Rs. 15,000 a month, which would clear it within the offer. But in month three he used the new card for shopping too, and found that new purchases attracted full interest from the day of purchase while the transferred balance existed.",
        "He stopped using that card for spending, cleared the transfer by month six, and then the new card returned to normal interest-free terms. The episode cost a few thousand rupees he had not planned for.",
        "He also set an alert two weeks before the promotional period ended, and confirmed by phone that the balance showed zero on the receiving card before the offer expired."
      ],
      lesson: "During a balance transfer, do not spend on the receiving card, and clear the balance before the offer ends.",
    },
    {
      title: "Settling with the bank",
      paragraphs: [
        "After losing his job, Vivek in Indore fell six months behind on a card balance of Rs. 1.8 lakh. The bank's collection team offered a one-time settlement for Rs. 1.1 lakh.",
        "He accepted, got the settlement terms in writing on the bank's letterhead, paid, and received a no-dues letter. His credit report then showed the account as settled, not closed, which made getting a home loan two years later difficult and expensive.",
        "A counsellor later suggested he could have asked for a repayment plan over 12 to 18 months instead, which might have allowed the account to be marked closed once fully paid. Settlement is sometimes the only option, but it has a long tail.",
        "He also learned that settlements can sometimes be negotiated to be reported as closed if the full principal is eventually repaid. He wished he had asked a credit counsellor before signing."
      ],
      lesson: "A settlement ends the debt but marks your credit record for years. Ask for a restructured repayment plan first.",
    },
    {
      title: "An unknown charge on the statement",
      paragraphs: [
        "Deepika in Kochi found an international transaction of Rs. 14,800 she had not made. She blocked the card in the app immediately and reported the transaction as fraudulent the same day.",
        "Under RBI's rules on customer liability for unauthorised electronic transactions, a customer who reports within three working days, where the fault lies neither with the bank nor the customer, has zero liability. The bank reversed the amount provisionally and later permanently.",
        "She now keeps international usage turned off, has transaction alerts on, and checks her statement on the day it arrives. The speed of her report was what protected her.",
        "She also saved the bank's complaint reference number and the reversal confirmation email, in case the charge reappeared on a later statement or a collection call ever came about it."
      ],
      lesson: "Report unauthorised transactions at once. Quick reporting limits your liability.",
    },
    {
      title: "A student's first card",
      paragraphs: [
        "Aman, 21, in Delhi, got his first card against a fixed deposit, with a limit of Rs. 20,000. He used it for a few subscriptions and food delivery.",
        "He set an auto-debit for the full statement amount from his savings account, where his stipend arrived. In two years he never paid a rupee of interest, and his credit score built steadily from nothing.",
        "When a bank offered him an unsecured card with a Rs. 1.5 lakh limit, he accepted but kept his spending the same, which kept his utilisation low and his score rising.",
        "He also set a personal rule never to let the statement exceed half of his monthly stipend, so that even if the auto-debit failed, he could pay manually the same day."
      ],
      lesson: "A small card paid in full every month builds a credit history at no cost.",
    },
    {
      title: "Rewards that cost more than they paid",
      paragraphs: [
        "Mohit in Ahmedabad chased reward points, spending Rs. 60,000 a month on a card that gave 2 percent back. He revolved a balance of about Rs. 1 lakh on average.",
        `His rewards came to about Rs. 14,400 a year. Interest and GST on the revolving Rs. 1 lakh at 42 percent were about ${Rs(100000 * 0.42 * 1.18)} a year.`,
        "He cleared the balance with a personal loan, kept the card for spending he would make anyway, and paid it in full. The rewards became a genuine bonus instead of a discount on a much larger cost.",
        "He now keeps one rewards card for spending he would make anyway, such as groceries and fuel, and checks each year whether the rewards exceed the annual fee. If they do not, he asks for a fee waiver or switches to a lifetime-free card."
      ],
      lesson: "Rewards are worth having only if you never pay interest. One month of revolving can wipe out a year of points.",
    },
    {
      title: "A couple's shared card",
      paragraphs: [
        "Neha and Imran in Hyderabad used an add-on card for household spending. Both assumed the other was watching the bill. For three months, only the minimum was paid.",
        "They agreed that Imran, as primary cardholder, would set an auto-debit for the full balance from their joint account, and Neha would receive the same transaction alerts. They set a monthly household budget and a cap on the add-on card in the app.",
        "Clearing the Rs. 65,000 that had built up took four months at Rs. 17,000 a month. They then reviewed the statement together on the first Sunday of each month.",
        "They also agreed what counts as household spending on the add-on card and what does not. Personal purchases now go on each person's own debit card, which keeps the shared statement easy to read."
      ],
      lesson: "Shared cards need one owner of the payment and shared visibility of spending.",
    },
    {
      title: "Closing a card properly",
      paragraphs: [
        "After clearing her balance, Lakshmi in Mysuru wanted to close a card she no longer used. She called, and was offered a fee waiver to keep it.",
        "She asked for closure in writing through the app, confirmed the balance was zero including any small charges, and received confirmation within a week. Under RBI rules, closure must be completed within seven working days of a request when dues are clear.",
        "She kept her oldest card, which she pays in full each month, to preserve the length of her credit history, and checked her credit report two months later to see the closed card shown correctly.",
        "Before closing, she downloaded the last twelve statements for her records and transferred two subscriptions billed to that card to her remaining card, so none of them would fail and cause a dispute later."
      ],
      lesson: "Close unused cards in writing after clearing every rupee. Keep your oldest card if you use it well.",
    },
    {
      title: "A BNPL stack",
      paragraphs: [
        "Ritika, 26, in Pune used buy-now-pay-later offers for a phone, a sofa, a course and a trip. Each instalment looked small. Together they came to Rs. 14,000 a month, a third of her take-home, spread across four apps with four due dates.",
        "She missed one due date by a week while travelling. The late fee and a mark on her credit report followed, and a bank later questioned the report when she applied for a card.",
        "She listed every plan in one sheet with its amount and end date, set auto-debits for all of them on salary day, and stopped taking new BNPL offers until the existing ones ended. Three of the four ended within six months.",
        "Her rule now is to count BNPL instalments as debt in her budget, exactly like a card EMI, because that is what lenders do.",
      ],
      lesson: "Several small instalment plans can add up to a large monthly obligation. List them together and stop adding new ones.",
    },
    {
      title: "Paying the card before the statement date",
      paragraphs: [
        "Sanjay in Bengaluru pays his card in full every month, yet his credit report showed high utilisation, because he spends about Rs. 80,000 a month on a card with a Rs. 1 lakh limit, and the balance is reported on the statement date.",
        "He began paying most of the month's spending a few days before the statement date, leaving a small balance to be billed. His reported utilisation fell to about 10 percent, and his score improved within two reporting cycles.",
        "He also asked for a limit increase, which the issuer granted on the basis of his record. With the same spending and a higher limit, utilisation stays low even if he forgets the early payment.",
      ],
      lesson: "Utilisation is measured at the statement date. Paying before it, or a higher limit, lowers what is reported.",
    },
    {
      title: "An annual fee that was not worth it",
      paragraphs: [
        "Geeta in Chandigarh held a premium card with a Rs. 5,000 annual fee plus GST for its lounge access and reward rate. She travelled twice a year.",
        "She added up the year: about Rs. 6,000 of reward value and two lounge visits she valued at Rs. 1,500 each. Against Rs. 5,900 in fees, the card came out slightly ahead, but only because she spent heavily on it.",
        "When her spending fell after she changed jobs, she asked for a fee waiver, was refused, and downgraded to a lifetime-free card from the same issuer, keeping her account history intact.",
        "She also redeemed her remaining points before the downgrade, since some issuers reset or reduce point values when a card changes variant.",
      ],
      lesson: "Each year, compare a card's fees with the value you actually use. Downgrading keeps your history and drops the fee.",
    },
    {
      title: "A loan app that demanded contacts",
      paragraphs: [
        "Karthik in Coimbatore needed Rs. 15,000 urgently to pay a card's minimum and found an app offering instant loans. It asked for access to his contacts, photos and location before approval.",
        "A friend warned him that some such apps are not regulated and have harassed borrowers' contacts. He uninstalled it, called his card issuer, and arranged to convert part of the balance into EMIs instead, which reduced the minimum due that month.",
        "He also checked the lender behind any app before borrowing from it: whether it is a bank or an NBFC registered with RBI, and whether the app is listed on that lender's own website.",
        "Two months later the same app was in the news for harassing borrowers. He was glad the card issuer's EMI option had cost a little more in the short term and nothing in peace of mind.",
      ],
      lesson: "Avoid loan apps that demand personal data access. Talk to your card issuer first; it often has cheaper options.",
    },
    {
      title: "Clearing a card in retirement",
      paragraphs: [
        "Mr Srinivasan, 63, in Chennai, carried a Rs. 70,000 card balance from his son's wedding. His pension was steady but modest, and he had Rs. 4 lakh in deposits.",
        `At 39 percent with GST, his Rs. 4,000 monthly payments would take ${payoff(70000, 39, 4000).months} months and cost about ${Rs(payoff(70000, 39, 4000).interest)}. The deposits earned 7.5 percent.`,
        "He broke one Rs. 70,000 deposit and cleared the card, keeping the remaining Rs. 3.3 lakh as his reserve. He then cut the card's limit to Rs. 25,000 and set an auto-debit for the full amount, so it remains a convenience for bookings and nothing more.",
        "His son, who had spent much of the balance, agreed to repay the deposit in monthly instalments, which they wrote down so it would not become a source of friction later.",
      ],
      lesson: "On a fixed income, high-interest debt is especially costly. Use savings beyond the reserve to clear it.",
    },
    {
      title: "A first job and three cards",
      paragraphs: [
        "Aditya, 24, in Noida, accepted three card offers in his first year of work and used all of them. By the end of the year he owed Rs. 1.4 lakh across them and was paying only minimums.",
        `He totalled his take-home, Rs. 55,000, and essentials, Rs. 30,000, and found Rs. 15,000 he could commit. Using the highest rate first, he cleared all three in about ${multi([{ bal: 70000, apr: 42, min: 3500 }, { bal: 45000, apr: 39, min: 2250 }, { bal: 25000, apr: 36, min: 1250 }], 15000, (a, b) => b.apr - a.apr).months} months.`,
        "He closed the two newest cards and kept the oldest with a Rs. 30,000 limit and an auto-debit for the full amount. He also moved to a flat-share for six months to free the money, which he described as the best financial decision of his twenties.",
      ],
      lesson: "Multiple new cards in a first job are a common trap. Commit a fixed sum, attack one at a time, and close the extras.",
    },
    {
      title: "Wedding expenses on a card",
      paragraphs: [
        "Lalitha and Varun in Madurai put Rs. 3 lakh of wedding expenses on two cards, expecting gifts to cover them. The gifts covered half.",
        `For the remaining Rs. 1.5 lakh they compared EMI conversion at 15 percent for 12 months with a personal loan at 12 percent. The conversion EMI was about ${Rs(emi(150000, 15, 12))}; the loan EMI about ${Rs(emi(150000, 12, 12))}, with a fee. The difference over a year was a few thousand rupees in favour of the loan after the fee.`,
        "They chose the card's EMI conversion for simplicity, since it required no paperwork, and agreed not to use the cards for anything else until it ended. They now joke that the wedding's final instalment was their first anniversary present.",
      ],
      lesson: "For large planned expenses, compare EMI conversion and a personal loan before the statement arrives, not after months of revolving.",
    },
    {
      title: "Disputing a duplicate charge",
      paragraphs: [
        "Ravi in Vadodara was charged twice for a Rs. 18,500 flight booking. The airline's support said only one booking existed and the refund would take 'up to 21 working days'.",
        "He raised a dispute with his card issuer, attaching the booking confirmation and the two transaction entries. The issuer marked the duplicate as disputed, so no interest accrued on it while the investigation ran, and he did not have to pay it with the statement.",
        "The duplicate was reversed within the issuer's timeline. He paid the rest of the statement in full on time, so the dispute did not affect his record.",
        "He keeps screenshots of booking confirmations for a month after every large online purchase now. In a dispute, evidence gathered on the day is far easier than evidence reconstructed weeks later.",
      ],
      lesson: "Dispute wrong charges with the issuer promptly, with evidence. Pay the undisputed part on time.",
    },
    {
      title: "A credit limit that kept rising",
      paragraphs: [
        "Every few months, Shabana in Mumbai's card app offered her a higher limit. She accepted each time, and her spending rose to match, until her balance reached Rs. 2.2 lakh on a Rs. 3 lakh limit.",
        "Under RBI rules a limit increase needs her consent, which the app had collected with a single tap. She realised the higher limit had become a target rather than a ceiling.",
        `She asked for the limit to be reduced to Rs. 75,000, set a fixed payment of Rs. 18,000 a month, which clears the balance in about ${payoff(220000, 40, 18000).months} months at 40 percent with GST, and turned off promotional notifications in the app.`,
        "Once the balance is cleared she plans to keep the lower limit, which she says works better for her than willpower.",
      ],
      lesson: "A higher limit is not extra money. Decline increases you do not need, or ask for a lower limit.",
    },
    {
      title: "A medical bill and a hospital plan",
      paragraphs: [
        "Yusuf in Bhopal faced a Rs. 2.4 lakh hospital bill for his mother's surgery. His health policy covered Rs. 1.5 lakh; the rest, Rs. 90,000, went on his card.",
        "Before the statement came, he asked the hospital whether it partnered with any lender for medical EMIs, and asked his card issuer for an EMI conversion. The card offered 14 percent for 12 months; the hospital's partner offered 0 percent for 6 months with a small fee.",
        "He took the hospital's six-month plan for the larger part and paid the rest in full on the card. He also raised his health cover at the next renewal and added a top-up policy, since the gap had come from the limit, not from a denied claim.",
      ],
      lesson: "For large medical bills, ask about hospital payment plans and card EMI conversion before the statement, and review insurance cover afterwards.",
    },
    {
      title: "Self-employed with lumpy income",
      paragraphs: [
        "Farah, a photographer in Goa, earns most of her income in the tourist season and used her card to bridge the monsoon months. Each year the balance grew, because the bridge cost 40 percent.",
        "She worked out her average monthly income across a year and set herself a fixed 'salary' from a business account. In season she pays the surplus into a recurring deposit that funds the monsoon months.",
        "The first year she still used the card in July and August, but cleared it by October from the deposit. By the second year the deposit covered the monsoon and the card stayed at zero.",
        "She also began asking clients for an advance on large bookings, which reduced how much the monsoon buffer had to cover.",
      ],
      lesson: "Smooth uneven income with a savings buffer rather than a card. The buffer costs nothing; the card costs 40 percent.",
    },
    {
      title: "Foreign currency charges on a holiday",
      paragraphs: [
        "Rohan and Diya in Pune spent Rs. 1.6 lakh on their card during a holiday in Europe. Their statement showed an extra Rs. 5,600 in foreign currency markup at 3.5 percent, plus about Rs. 1,000 of GST on it.",
        "They had also accepted the option to pay in rupees at several shops, which looked convenient but used a poorer exchange rate than their card's own conversion, adding more cost.",
        "Before their next trip they compared cards and chose one with a low markup for international spending, loaded part of the budget on a forex card, and always chose to pay in the local currency at the terminal. They paid the card in full on return, so interest added nothing.",
      ],
      lesson: "Abroad, choose to pay in the local currency and use a card with a low markup. Pay the statement in full when you return.",
    },
    {
      title: "Paying for a parent's treatment from abroad",
      paragraphs: [
        "Sneha works in Singapore and paid her father's Rs. 1.2 lakh treatment bill in Kochi with her Indian credit card, which she had kept from before she moved.",
        "She had not updated her address or set up a way to pay from abroad, so the first statement went unpaid for two weeks. The late fee and interest added about Rs. 5,500.",
        "She added auto-debit from her NRO account, updated her contact details with the bank, and set alerts. The next month she paid the full balance, and asked the bank to reverse the late fee given her record, which it did.",
        "She also checked with the hospital whether an international card or a transfer to the hospital's account would have been cheaper; for future bills she sends money to her brother's account in Kochi, who pays locally.",
      ],
      lesson: "If you keep an Indian card while living abroad, set up auto-debit and current contact details before you need it.",
    },
  ],

  problemIntro: "Use the payoff method in the first chapter, or the site's calculator with GST on. Answers are approximate to the rupee and month.",

  problems: [
    {
      title: "One month's interest",
      q: ["A balance of Rs. 60,000 at 3.6 percent a month. Interest plus GST for one month?"],
      steps: ["Interest = 60,000 × 3.6% = 2,160.", "GST = 18% of 2,160 = 388.80."],
      answer: "Rs. 2,548.80.",
    },
    {
      title: "Yearly rate from a monthly rate",
      q: ["A card charges 3.75 percent a month. What is the simple yearly rate, and the yearly rate including GST?"],
      steps: ["3.75 × 12 = 45 percent.", "With GST: 45 × 1.18 = 53.1 percent."],
      answer: "45 percent a year, or about 53 percent including GST, before any compounding.",
    },
    {
      title: "Months to clear",
      q: ["Rs. 50,000 at 36 percent plus GST, paying Rs. 5,000 a month. How long, and how much interest?"],
      steps: ["Each month: add interest × 1.18, subtract 5,000."],
      answer: `${payoff(50000, 36, 5000).months} months; about ${Rs(payoff(50000, 36, 5000).interest)}.`,
    },
    {
      title: "Payment needed for one year",
      q: ["What fixed payment clears Rs. 75,000 at 42 percent plus GST in 12 months?"],
      steps: ["Treat it as a 12-month EMI at 42 × 1.18 = 49.56 percent a year."],
      answer: `About ${Rs(emi(75000, 42 * 1.18, 12))} a month.`,
    },
    {
      title: "Minimum-only path",
      q: ["Rs. 40,000 at 40 percent plus GST, paying 5 percent of the balance (minimum Rs. 200) each month. How long and how much interest?"],
      steps: ["Each month the payment is 5 percent of the current balance, so it shrinks with the balance."],
      answer: `About ${yrs(minimumPath(40000, 40).months)} and ${Rs(minimumPath(40000, 40).interest)} of interest.`,
    },
    {
      title: "Payment below interest",
      q: ["A balance of Rs. 1.5 lakh at 42 percent plus GST. What is the smallest payment that reduces the balance at all?"],
      steps: ["Monthly interest with GST = 1,50,000 × 3.5% × 1.18."],
      answer: `More than ${Rs(150000 * 0.035 * 1.18)} a month; anything less and the balance grows.`,
    },
    {
      title: "Cash advance cost",
      q: ["Rs. 20,000 cash withdrawn on a card: 2.5 percent fee (minimum Rs. 500) and 3.5 percent a month interest from day one, repaid after 30 days. Total cost with GST?"],
      steps: ["Fee = 500. Interest = 700.", "GST = 18% of 1,200 = 216."],
      answer: "About Rs. 1,416 for one month.",
    },
    {
      title: "Personal loan versus card",
      q: ["Rs. 1 lakh: a 2-year personal loan at 14 percent with a 2 percent fee plus GST, or paying the same monthly amount on a 42 percent card plus GST. Compare total interest."],
      steps: [`Loan EMI = ${Rs(emi(100000, 14, 24))}; interest = ${Rs(emi(100000, 14, 24) * 24 - 100000)}; fee = ${Rs(2000 * 1.18)}.`, "Card: pay the same EMI each month until cleared."],
      answer: `Loan costs about ${Rs(emi(100000, 14, 24) * 24 - 100000 + 2360)}; the card about ${Rs(payoff(100000, 42, emi(100000, 14, 24)).interest)} over ${payoff(100000, 42, emi(100000, 14, 24)).months} months.`,
    },
    {
      title: "Avalanche versus snowball",
      q: ["Using the three cards in the chapter and Rs. 18,000 a month, how much interest does the avalanche save over the snowball?"],
      steps: [`Avalanche: ${Rs(avalanche.interest)}.`, `Snowball: ${Rs(snowball.interest)}.`],
      answer: `About ${Rs(snowball.interest - avalanche.interest)}.`,
    },
    {
      title: "Utilisation",
      q: ["Two cards with limits of Rs. 1 lakh and Rs. 50,000 carry Rs. 40,000 and Rs. 35,000. What is overall utilisation, and which card is over 30 percent?"],
      steps: ["Total balance 75,000 ÷ total limit 1,50,000 = 50 percent.", "Card 1: 40 percent; card 2: 70 percent."],
      answer: "50 percent overall; both cards are above 30 percent, card 2 heavily so.",
    },
    {
      title: "EMI conversion effective rate",
      q: ["A Rs. 40,000 balance converted to 6 EMIs at 1.5 percent a month on reducing balance, with a Rs. 299 fee. EMI and total cost including GST on interest and fee?"],
      steps: [`EMI at 18 percent a year for 6 months = ${Rs(emi(40000, 18, 6))}.`, `Interest = ${Rs(emi(40000, 18, 6) * 6 - 40000)}.`],
      answer: `Total extra cost about ${Rs((emi(40000, 18, 6) * 6 - 40000) * 1.18 + 299 * 1.18)}.`,
    },
    {
      title: "Daily cost of a balance",
      q: ["A Rs. 2 lakh balance at 42 percent plus GST. Roughly how much does it cost per day?"],
      steps: ["Yearly cost = 2,00,000 × 42% × 1.18 = 99,120.", "Per day = 99,120 ÷ 365."],
      answer: "About Rs. 272 a day.",
    },
    {
      title: "Late payment timing",
      q: ["The due date is the 15th. You pay the minimum on the 17th. Under RBI rules, can a late charge be levied?"],
      steps: ["Late charges apply only if the minimum is unpaid for more than three days past the due date."],
      answer: "No. Payment within three days avoids the late charge and past-due reporting, though interest still applies to any unpaid balance.",
    },
    {
      title: "Breaking a deposit",
      q: ["You owe Rs. 80,000 at 40 percent plus GST and hold Rs. 80,000 in an FD at 7 percent, not your emergency fund. Breaking the FD costs a 1 percent penalty on interest. What is the yearly saving from clearing the card?"],
      steps: ["Card cost avoided ≈ 80,000 × 40% × 1.18 = 37,760.", "FD interest given up ≈ 80,000 × 7% = 5,600, plus a small penalty."],
      answer: "About Rs. 32,000 a year better off.",
    },
    {
      title: "Fixed payment versus minimum",
      q: ["Rs. 1.2 lakh at 39 percent plus GST. Compare a fixed Rs. 12,000 with 5 percent minimum payments."],
      steps: [`Fixed: ${payoff(120000, 39, 12000).months} months, ${Rs(payoff(120000, 39, 12000).interest)}.`, `Minimum: ${yrs(minimumPath(120000, 39).months)}, ${Rs(minimumPath(120000, 39).interest)}.`],
      answer: `The fixed payment saves about ${Rs(minimumPath(120000, 39).interest - payoff(120000, 39, 12000).interest)}.`,
    },
    {
      title: "New spending during repayment",
      q: ["Rs. 60,000 at 42 percent plus GST, paying Rs. 8,000 a month, but adding Rs. 3,000 of new spending each month. How long now?"],
      steps: ["Each month: add interest, add 3,000, subtract 8,000."],
      answer: `${payoff(60000, 42, 8000, true, 3000).months} months instead of ${payoff(60000, 42, 8000).months}, with about ${Rs(payoff(60000, 42, 8000, true, 3000).interest)} of interest.`,
    },
    {
      title: "Rewards versus interest",
      q: ["A card gives 1.5 percent back on Rs. 40,000 a month of spending. You revolve Rs. 50,000 at 42 percent plus GST. Net yearly result?"],
      steps: ["Rewards: 40,000 × 12 × 1.5% = 7,200.", "Interest: 50,000 × 42% × 1.18 = 24,780."],
      answer: "A net loss of about Rs. 17,580 a year.",
    },
    {
      title: "Balance transfer saving",
      q: ["Rs. 1 lakh moved from 42 percent to 12 percent for 6 months, fee 2 percent plus GST. You pay Rs. 17,500 a month. Rough saving over 6 months?"],
      steps: ["Interest at 42% with GST over 6 months on a falling balance ≈ about 11,000.", "At 12% with GST ≈ about 3,100, plus fee 2,360."],
      answer: "Roughly Rs. 5,500 saved, provided the balance is cleared before the offer ends.",
    },
    {
      title: "Statement and due dates",
      q: ["The statement date is the 20th and the due date the 8th of the next month. You buy something on the 21st. How many interest-free days do you get if you always pay in full?"],
      steps: ["The purchase appears on the next statement, dated the 20th of the next month.", "Its due date is the 8th of the month after that."],
      answer: "About 48 days, the maximum for that cycle.",
    },
    {
      title: "Payoff with a step-up",
      q: ["Rs. 1.5 lakh at 42 percent plus GST. Pay Rs. 9,000 a month, rising by Rs. 1,000 every 3 months. How long?"],
      steps: ["Simulate month by month, raising the payment by 1,000 after each quarter."],
      answer: (() => {
        let b = 150000;
        let m = 0;
        let pay = 9000;
        let i2 = 0;
        while (b > 0.01 && m < 600) {
          const i = b * 0.035 * 1.18;
          i2 += i;
          b = b + i - pay;
          m += 1;
          if (m % 3 === 0) pay += 1000;
        }
        return `About ${m} months with about ${Rs(i2)} of interest, against ${payoff(150000, 42, 9000).never ? "never clearing" : `${payoff(150000, 42, 9000).months} months`} at a flat Rs. 9,000.`;
      })(),
    },
    {
      title: "Loan against gold",
      q: ["A gold loan at 10 percent for 12 months on Rs. 70,000 versus revolving at 40 percent plus GST with the same monthly payment. Compare."],
      steps: [`Gold loan EMI = ${Rs(emi(70000, 10, 12))}; interest = ${Rs(emi(70000, 10, 12) * 12 - 70000)}.`, "Card with the same payment."],
      answer: `Card interest about ${Rs(payoff(70000, 40, emi(70000, 10, 12)).interest)}; the gold loan saves about ${Rs(payoff(70000, 40, emi(70000, 10, 12)).interest - (emi(70000, 10, 12) * 12 - 70000))}.`,
    },
    {
      title: "How much to budget for a large purchase",
      q: ["You want a Rs. 45,000 appliance without paying interest. You can save Rs. 7,500 a month. When can you buy it?"],
      steps: ["45,000 ÷ 7,500 = 6."],
      answer: "In six months, with no interest, or sooner with a small genuine no-cost EMI if the cash price is the same.",
    },
    {
      title: "Settlement cost",
      q: ["A bank offers to settle a Rs. 2 lakh card dues for Rs. 1.3 lakh. What do you save now, and what is the hidden cost?"],
      steps: ["Saving: 70,000.", "Hidden cost: the account is reported as settled, which can raise future loan rates or lead to refusals."],
      answer: "Rs. 70,000 now, against years of harder and costlier borrowing.",
    },
    {
      title: "Interest on a partial payment",
      q: ["A statement of Rs. 30,000 is due. You pay Rs. 25,000. Explain why the next statement may show more interest than 3.5 percent of Rs. 5,000."],
      steps: ["Many issuers charge interest from each transaction date on the whole statement amount when it is not paid in full, then credit your payment from its date.", "New purchases also lose their interest-free period."],
      answer: "Because the interest-free period is lost; the method is in the card's terms. Paying in full is the only way to pay no interest.",
    },
    {
      title: "Months saved by an extra Rs. 2,000",
      q: ["Rs. 90,000 at 42 percent plus GST, paying Rs. 6,000 a month. How many months does an extra Rs. 2,000 a month save?"],
      steps: [`At 6,000: ${payoff(90000, 42, 6000).months} months.`, `At 8,000: ${payoff(90000, 42, 8000).months} months.`],
      answer: `${payoff(90000, 42, 6000).months - payoff(90000, 42, 8000).months} months, and about ${Rs(payoff(90000, 42, 6000).interest - payoff(90000, 42, 8000).interest)} of interest.`,
    },
    {
      title: "Annual fee break-even",
      q: ["A card charges Rs. 1,500 plus GST a year and gives 1.5 percent rewards. What yearly spending breaks even?"],
      steps: ["Fee with GST = 1,770.", "1,770 ÷ 1.5% = 1,18,000."],
      answer: "About Rs. 1.18 lakh a year, or about Rs. 9,833 a month.",
    },
    {
      title: "BNPL total",
      q: ["Four BNPL plans of Rs. 2,500, Rs. 3,200, Rs. 4,800 and Rs. 3,500 a month. What share of a Rs. 45,000 take-home do they take?"],
      steps: ["Total = 14,000.", "14,000 ÷ 45,000."],
      answer: "About 31 percent.",
    },
    {
      title: "Reported utilisation",
      q: ["You spend Rs. 60,000 in a cycle on a Rs. 80,000 limit and pay Rs. 50,000 before the statement date. What utilisation is reported?"],
      steps: ["Balance at statement = 10,000.", "10,000 ÷ 80,000."],
      answer: "12.5 percent, instead of 75 percent.",
    },
    {
      title: "Months to clear with a windfall",
      q: ["Rs. 1 lakh at 42 percent plus GST, paying Rs. 8,000 a month. A Rs. 30,000 bonus arrives in month 4 and goes to the card. How long in total?"],
      steps: ["Simulate: pay 8,000 monthly; in month 4 also pay 30,000."],
      answer: (() => {
        let b = 100000;
        let m = 0;
        let int = 0;
        while (b > 0.01 && m < 600) {
          const i = b * 0.035 * 1.18;
          int += i;
          b = b + i - 8000 - (m === 3 ? 30000 : 0);
          m += 1;
        }
        return `About ${m} months, against ${payoff(100000, 42, 8000).months} without the bonus, saving about ${Rs(payoff(100000, 42, 8000).interest - int)} of interest.`;
      })(),
    },
    {
      title: "Cost of one month of revolving",
      q: ["You usually pay in full, but one month you pay only Rs. 40,000 of a Rs. 60,000 statement. Assume the issuer charges 3.5 percent plus GST on the full Rs. 60,000 for about a month because the interest-free period is lost. Estimate the cost."],
      steps: ["60,000 × 3.5% = 2,100.", "GST 18% = 378."],
      answer: "About Rs. 2,478, plus interest on new purchases until the balance is cleared. Exact methods vary; check your card's terms.",
    },
    {
      title: "Overdraft versus card",
      q: ["An overdraft against an FD charges 8.5 percent on the amount used. You need Rs. 50,000 for 3 months. Compare with revolving on a card at 42 percent plus GST."],
      steps: ["Overdraft: 50,000 × 8.5% × 3/12 ≈ 1,063.", "Card: 50,000 × 42% × 1.18 × 3/12 ≈ 6,195."],
      answer: "The overdraft saves about Rs. 5,100 over three months.",
    },
    {
      title: "Effective rate of a fee",
      q: ["An EMI conversion of Rs. 30,000 for 3 months has 0 percent interest but a 2 percent processing fee plus GST. What is the approximate yearly cost?"],
      steps: ["Fee = 600 + 108 GST = 708.", "708 ÷ 30,000 = 2.36 percent for about half the balance outstanding on average over 3 months.", "Roughly 2.36% ÷ (1.5/12) ≈ 19 percent a year."],
      answer: "About 19 percent a year, despite '0 percent interest'.",
    },
    {
      title: "Daily balance after a cash advance",
      q: ["You withdraw Rs. 10,000 cash on the 5th and repay on the 25th. Interest is 3.5 percent a month from the withdrawal date, plus a Rs. 500 minimum fee. Cost with GST?"],
      steps: ["Interest for 20 days ≈ 10,000 × 3.5% × 20/30 = 233.", "Fee 500.", "GST on 733 = 132."],
      answer: "About Rs. 865.",
    },
    {
      title: "How much the plan saves",
      q: ["Rs. 1.1 lakh at 42 percent plus GST. Compare paying 5 percent minimums with a fixed Rs. 12,000."],
      steps: [`Minimum: about ${yrs(minimumPath(110000, 42).months)}, ${Rs(minimumPath(110000, 42).interest)}.`, `Fixed: ${payoff(110000, 42, 12000).months} months, ${Rs(payoff(110000, 42, 12000).interest)}.`],
      answer: `The fixed payment saves about ${Rs(minimumPath(110000, 42).interest - payoff(110000, 42, 12000).interest)}.`,
    },
    {
      title: "Limit reduction and utilisation",
      q: ["A Rs. 50,000 balance on a Rs. 3 lakh limit. You reduce the limit to Rs. 1 lakh. What happens to utilisation?"],
      steps: ["Before: 50,000 ÷ 3,00,000 = 16.7%.", "After: 50,000 ÷ 1,00,000 = 50%."],
      answer: "It rises from about 17 to 50 percent, which may lower your score temporarily. Reduce the limit after the balance is cleared, or accept the effect for the discipline it gives.",
    },
    {
      title: "Disputed amount and interest",
      q: ["A statement of Rs. 45,000 includes a disputed charge of Rs. 12,000. What should you pay to avoid interest on undisputed spending?"],
      steps: ["Pay the undisputed amount: 45,000 − 12,000.", "Confirm with the issuer that the dispute is recorded."],
      answer: "Rs. 33,000 by the due date, with the dispute registered in writing.",
    },
    {
      title: "Total cost of three months' delay",
      q: ["You plan to start a fixed Rs. 10,000 payment on a Rs. 1 lakh balance at 42 percent plus GST, but delay three months, paying only 5 percent minimums meanwhile. How much more interest does the delay cost?"],
      steps: ["Simulate three months of minimums, then fixed payments; compare with fixed payments from the start."],
      answer: (() => {
        let b = 100000;
        let int = 0;
        for (let m = 0; m < 3; m++) {
          const i = b * 0.035 * 1.18;
          int += i;
          b = b + i - Math.max(200, b * 0.05);
        }
        const rest = payoff(b, 42, 10000);
        return `About ${Rs(int + rest.interest - ex1.interest)} more interest.`;
      })(),
    },
    {
      title: "Card versus BNPL for a phone",
      q: ["A Rs. 24,000 phone: BNPL in 3 interest-free instalments with a Rs. 500 late fee if missed, or the card paid in full at the next statement. Which is cheaper if you pay everything on time?"],
      steps: ["Both cost nothing if paid on time.", "BNPL adds a reported credit line and three due dates; the card adds one statement."],
      answer: "Equal in cost; the card is simpler if you pay it in full. The risk with BNPL is a missed instalment's fee and credit mark.",
    },
    {
      title: "Gift used for debt",
      q: ["You receive Rs. 50,000 as a gift and owe Rs. 80,000 at 40 percent plus GST, paying Rs. 8,000 a month. How many months does using the gift save?"],
      steps: [`Without: ${payoff(80000, 40, 8000).months} months.`, `With Rs. 50,000 applied now: ${payoff(30000, 40, 8000).months} months.`],
      answer: `${payoff(80000, 40, 8000).months - payoff(30000, 40, 8000).months} months and about ${Rs(payoff(80000, 40, 8000).interest - payoff(30000, 40, 8000).interest)} of interest.`,
    },
    {
      title: "Smoothing seasonal income",
      q: ["A freelancer earns Rs. 1.2 lakh a month for 6 months and Rs. 30,000 for 6 months. What fixed monthly 'salary' can they draw, and how much must they save in the good months?"],
      steps: ["Yearly income = 6 × 1,20,000 + 6 × 30,000 = 9,00,000.", "Monthly salary = 9,00,000 ÷ 12 = 75,000.", "Saving in good months = 1,20,000 − 75,000 = 45,000."],
      answer: "Rs. 75,000 a month, saving Rs. 45,000 in each good month to cover the Rs. 45,000 gap in each lean one.",
    },
    {
      title: "Medical EMI comparison",
      q: ["Rs. 60,000 at 0 percent for 6 months with a Rs. 999 fee plus GST, or a card EMI at 14 percent for 6 months with no fee. Which is cheaper?"],
      steps: ["0% plan: 999 × 1.18 = 1,179.", `Card EMI interest: ${Rs(emi(60000, 14, 6) * 6 - 60000)}, plus GST on interest.`],
      answer: `The 0 percent plan costs about Rs. 1,179; the card EMI about ${Rs((emi(60000, 14, 6) * 6 - 60000) * 1.18)}.`,
    },
    {
      title: "Interest-free days from timing",
      q: ["Your statement date is the 1st and the due date the 20th. You buy on the 2nd and on the 30th. How many interest-free days does each purchase get if you pay in full?"],
      steps: ["Purchase on the 2nd: billed on the 1st of next month, due on the 20th: about 48 days.", "Purchase on the 30th: billed on the 1st, due on the 20th: about 20 days."],
      answer: "About 48 days and 20 days.",
    },
    {
      title: "GST on fees",
      q: ["A late fee of Rs. 750 and an annual fee of Rs. 499. How much GST, and the total?"],
      steps: ["Fees = 1,249.", "GST = 18% = 224.82."],
      answer: "About Rs. 1,474 in total.",
    },
    {
      title: "Foreign currency markup",
      q: ["You spend the equivalent of Rs. 80,000 abroad on a card with a 3.5 percent markup plus GST. Extra cost?"],
      steps: ["Markup = 80,000 × 3.5% = 2,800.", "GST = 18% of 2,800 = 504."],
      answer: "Rs. 3,304, before any exchange-rate difference.",
    },
    {
      title: "Late fee reversal value",
      q: ["A late fee of Rs. 900 plus GST and interest of Rs. 2,400 plus GST were charged. If the bank reverses only the late fee, how much do you save?"],
      steps: ["900 × 1.18 = 1,062."],
      answer: "Rs. 1,062; the interest usually stays.",
    },
    {
      title: "Payment needed for 18 months",
      q: ["What fixed payment clears Rs. 1.5 lakh at 40 percent plus GST in 18 months?"],
      steps: ["EMI formula at 40 × 1.18 = 47.2 percent a year over 18 months."],
      answer: `About ${Rs(emi(150000, 47.2, 18))} a month.`,
    },
    {
      title: "Cost of a year of minimums",
      q: ["Rs. 80,000 at 42 percent plus GST, paying 5 percent minimums for 12 months. How much of the balance is left, and how much interest was paid?"],
      steps: ["Simulate 12 months of 5 percent payments."],
      answer: (() => {
        let b = 80000;
        let int = 0;
        for (let m = 0; m < 12; m++) {
          const i = b * 0.035 * 1.18;
          int += i;
          b = b + i - Math.max(200, b * 0.05);
        }
        return `About ${Rs(b)} still owed after paying about ${Rs(int)} in interest.`;
      })(),
    },
  ],

  exercises: {
    warmup: [
      { q: "What is the GST rate on credit card interest and fees?", a: "18 percent." },
      { q: "How do you avoid paying any interest on a credit card?", a: "Pay the full statement balance by the due date every month." },
      { q: "Within how many days after the due date must the minimum be paid to avoid late charges under RBI rules?", a: "Within three days." },
      { q: "What is credit utilisation?", a: "Your card balances as a share of your total credit limits." },
      { q: "Does a cash withdrawal on a credit card get an interest-free period?", a: "No. Interest starts from the day of withdrawal, plus a fee." },
      { q: "What should you do first if you see an unknown transaction?", a: "Block the card and report the transaction to the issuer immediately." },
      { q: "What does BNPL stand for?", a: "Buy now, pay later: instalment plans offered at checkout, reported to credit bureaus." },
      { q: "Where on the card should you look for the issuer's phone number to report fraud?", a: "On the back of the card, or on the issuer's official website or app, not in a message you received." },
      { q: "Does carrying a balance help your credit score?", a: "No. Paying on time helps; carrying a balance only costs interest." },
    ],
    practice: [
      { q: "Rs. 35,000 at 3.5 percent a month. One month's interest plus GST?", a: `${Rs(35000 * 0.035 * 1.18)}.` },
      { q: "Rs. 70,000 at 40 percent plus GST, Rs. 7,000 a month. Months to clear?", a: `${payoff(70000, 40, 7000).months} months.` },
      { q: "What fixed payment clears Rs. 50,000 at 42 percent plus GST in 10 months?", a: `About ${Rs(emi(50000, 42 * 1.18, 10))}.` },
      { q: "List three ways to stop new spending landing on a card you are repaying.", a: "Remove it from saved payments in apps, keep the physical card at home, and use UPI or a debit card from a budget for daily spending." },
      { q: "Two cards: Rs. 30,000 at 30 percent and Rs. 60,000 at 42 percent. Which gets the extra money under the avalanche method?", a: "The Rs. 60,000 card at 42 percent." },
      { q: "A Rs. 15,000 balance on a card with a Rs. 50,000 limit. Utilisation?", a: "30 percent." },
      { q: "A card has a Rs. 750 fee plus GST and gives 1 percent rewards. Break-even yearly spending?", a: `About ${Rs((750 * 1.18) / 0.01)}.` },
      { q: "You spend Rs. 40,000 on a Rs. 50,000-limit card. How much should you pay before the statement date to report under 30 percent?", a: "At least Rs. 25,000, leaving Rs. 15,000 to be billed." },
      { q: "List four statement lines you check every month while repaying.", a: "Previous balance, finance charges, new purchases, and fees." },
      { q: "A purchase made the day after the statement date: roughly how many interest-free days, with a 20-day gap between statement and due date?", a: "About 50 days: roughly 30 days until the next statement, plus 20 until its due date." },
      { q: "Your card has a 3.5 percent foreign markup. What is the extra cost with GST on Rs. 50,000 of spending abroad?", a: "Rs. 1,750 markup plus Rs. 315 GST, Rs. 2,065 in total." },
      { q: "Write a three-line message asking your issuer to reverse a first late fee.", a: "For example: 'I have paid on time for X years. My payment this month was two days late because of a travel delay. Could you please reverse the late fee as a one-time courtesy?'" },
    ],
    stretch: [
      { q: "Rs. 1.8 lakh across two cards at 40 percent. A personal loan at 13 percent for 2 years with a 1 percent fee plus GST. Monthly EMI and total cost?", a: `EMI ${Rs(emi(180000, 13, 24))}; interest ${Rs(emi(180000, 13, 24) * 24 - 180000)}; fee ${Rs(1800 * 1.18)}.` },
      { q: "Explain, with numbers, why minimum payments of 5 percent take so long on Rs. 50,000 at 42 percent plus GST.", a: `Monthly interest with GST is about 4.1 percent of the balance, so a 5 percent payment repays under 1 percent of principal each month at first; it takes about ${yrs(minimumPath(50000, 42).months)}.` },
      { q: "A card offers 'interest at 0.99 percent a month' on EMI conversion. What is the approximate yearly rate including GST?", a: "About 11.9 percent a year, or about 14 percent including GST on interest, plus any fee." },
      { q: "Design a three-month plan to clear Rs. 25,000 on a card when take-home is Rs. 40,000 and essentials are Rs. 28,000.", a: "Surplus Rs. 12,000 a month; pay Rs. 9,000 a month plus any windfalls, cut one discretionary category for three months, and stop all new card spending. About three months clears it with modest interest." },
      { q: "Why might closing your oldest card hurt your credit score?", a: "It can shorten the average length of your credit history and reduce your total limit, raising utilisation." },
      { q: "Compare clearing Rs. 60,000 in 6 months on a card at 42 percent plus GST with a 6-month loan at 15 percent.", a: `Card payment ${Rs(emi(60000, 42 * 1.18, 6))} a month; loan EMI ${Rs(emi(60000, 15, 6))}. The loan saves about ${Rs((emi(60000, 42 * 1.18, 6) - emi(60000, 15, 6)) * 6)}.` },
      { q: "A loan app asks for access to your contacts and photos. Explain the risks and what to check.", a: "It may misuse your data or harass contacts. Check that the lender is a bank or RBI-registered NBFC, that the app is listed on the lender's site, and prefer your bank or card issuer's own options." },
      { q: "Explain why a high limit can make it harder to repay a card.", a: "A high limit removes the natural stopping point, so spending can grow to fill it. The balance and interest grow with it, and the minimum stays small, hiding the problem." },
      { q: "Plan the order of repair for someone with a card balance, a BNPL plan and a loan-app loan.", a: "Pay all minimums and instalments on time; clear the loan-app loan first if it is the most expensive or abusive; then the card at the highest rate; let the BNPL plan run to its end without adding new ones." },
    ],
    challenge: [
      { q: "A friend has Rs. 3 lakh across four cards, a stable job, and Rs. 1 lakh in an FD. Write a full repayment plan.", a: "Keep about Rs. 50,000 of the FD as an emergency fund and use Rs. 50,000 to clear the smallest high-rate card. Take a personal loan for the remaining Rs. 2.5 lakh if the rate is well below the cards', clear all cards, close two, keep two with auto-debit for full payment. Set the loan EMI on salary day and rebuild the FD from any remaining surplus." },
      { q: "Argue for and against the snowball method.", a: "For: quick wins keep motivation, fewer accounts to manage. Against: it can cost more interest than paying the highest rate first. If the rates are similar, the difference is small; if one card is much more expensive, the avalanche saves meaningfully." },
      { q: "When is a settlement the right choice?", a: "When repayment is genuinely impossible in a reasonable time, income has fallen permanently, and a restructured plan has been refused. Get terms in writing, pay exactly as agreed, keep the no-dues letter, and rebuild credit gradually." },
      { q: "Explain how a card can become an emergency fund by accident, and how to prevent it.", a: "Without savings, any unexpected bill goes on the card and is repaid slowly at high interest. Build a cash reserve of at least one to three months' expenses before or alongside repaying cards." },
      { q: "Design rules for using a credit card that guarantee you never pay interest.", a: "Auto-debit the full statement amount; spend only from an existing budget; never withdraw cash; keep an emergency fund; review the statement monthly; keep international and online usage off when not needed." },
      { q: "Design a one-page household rule set for cards, BNPL and UPI credit lines.", a: "One or two cards with full auto-debit; no BNPL or credit line except for planned purchases recorded in the budget; all instalments listed with end dates; no cash on credit; monthly statement review together; an emergency fund so no credit product is used for emergencies." },
      { q: "Write a short guide for a younger sibling receiving their first credit card.", a: "Ask for a modest limit; set auto-debit for the full balance; never withdraw cash; turn off international use; check alerts and the statement; never share OTPs; keep utilisation low; and treat the limit as a ceiling, not a target." },
    ],
  },

  faqs: [
    {
      group: "Interest and charges",
      items: [
        ["Why is my card interest so high?", "Card rates are typically 2.5 to 3.75 percent a month, 30 to 45 percent a year, plus 18 percent GST on interest. Cards are unsecured and convenient, and the price of revolving reflects that."],
        ["If I pay most of the bill, do I pay interest only on the rest?", "Often not. Many issuers charge interest on the purchases from their transaction dates when the full balance is not paid, and new purchases lose the interest-free period. Check your card's terms."],
        ["Is GST charged on card interest?", "Yes. GST at 18 percent applies to interest, late fees, annual fees, cash advance fees and other charges."],
        ["What is the interest-free period?", "The days between a purchase and the payment due date, typically 20 to 50, during which no interest is charged if you pay the full statement balance by the due date."],
        ["Can the bank raise my interest rate?", "The rate must be disclosed, and changes require notice under RBI rules. Some cards set the rate based on your payment behaviour. Read notices from your issuer."],
        ["What is a late payment fee?", "A charge, usually in slabs by outstanding amount, if the minimum due is not paid within three days of the due date, plus GST."],
        ["Are there charges for paying by cheque or at a branch?", "Some issuers charge for cash payments at branches or cheque bounce. Paying by auto-debit or online transfer avoids these."],
        ["What is a finance charge?", "Another name for the interest charged on revolving balances and cash advances. It appears as a separate line on the statement, with GST on it shown separately, and is the clearest single measure of what revolving is costing you each month."],
        ["Why did I get interest when I paid in full?", "Usually because the previous month was not paid in full, so interest was still accruing until the payment date, or because of a cash advance. Check the statement's interest calculation."],
      ],
    },
    {
      group: "Minimum due and repayment",
      items: [
        ["Is paying the minimum enough?", "It keeps the account in good standing and avoids late charges, but most of it goes to interest and the balance falls very slowly. Pay a fixed amount well above the minimum."],
        ["How is the minimum due calculated?", "Usually about 5 percent of the outstanding balance, plus any EMI instalments, fees and overlimit amounts. Each issuer's method is in its terms."],
        ["Should I pay one card fully or all cards partly?", "Pay all minimums on time, then put the rest on one card, usually the highest rate, until it is cleared."],
        ["How long will it take to clear my card?", "Use the site's credit card payoff calculator with your balance, rate and fixed payment, with GST on. Statements also show how long minimum payments would take."],
        ["What happens if I miss a payment?", "A late charge, interest, possible loss of rewards, and if unpaid more than 30 days, a negative mark on your credit report. Pay as soon as you can and contact the issuer."],
        ["Can I ask the bank for a repayment plan?", "Yes. Many issuers offer to convert the balance into EMIs or agree a restructured plan, especially if you contact them before payments are missed."],
        ["Should I stop using the card while repaying?", "Yes. New spending on that card adds to the balance and may attract interest immediately. Use cash, UPI or debit for daily spending."],
        ["Can I pay my credit card bill with another credit card?", "Not directly in most cases. Some apps allow it for a fee, which is just borrowing from one card to pay another at a cost. It delays the problem and adds fees."],
        ["Should I use a credit card for rent?", "Some platforms allow it for a fee of 1 to 2 percent plus GST. It makes sense only if you pay the card in full and the rewards or interest-free days are worth more than the fee."],
        ["Is it better to pay twice a month?", "Paying more often slightly reduces average balance and interest, and can lower the reported utilisation. The bigger gain comes from the total amount you pay."],
      ],
    },
    {
      group: "Loans, EMIs and transfers",
      items: [
        ["Should I take a personal loan to pay off my card?", "Often yes, if the loan rate is much lower and you will not run the card up again. Compare total cost including fees and GST."],
        ["Is converting my balance to EMI a good idea?", "It is usually cheaper than revolving, but compare the effective yearly rate including fees and GST with a personal loan. EMIs also block part of your limit."],
        ["What is a no-cost EMI?", "An offer where the merchant discounts the price by the interest amount, so the total of the EMIs equals the price. You may still pay GST on interest and a processing fee, and may miss a cash discount."],
        ["How does a balance transfer work?", "A new card pays off your old card's balance and you repay the new card at a low promotional rate for a period. Watch the fee, the rate after the offer, and interest on new purchases."],
        ["Can I use a loan against my FD instead?", "Yes. Loans against deposits are usually charged at 1 to 2 percent above the deposit rate, far below card rates, and your deposit keeps earning."],
        ["Is a gold loan a good way to clear a card?", "Gold loans are cheaper than cards and quick, but your gold is at risk if you do not repay. Use them only with a clear repayment plan."],
        ["Will a personal loan hurt my credit score?", "A new loan causes a small temporary dip from the enquiry. Replacing high card utilisation with an instalment loan and paying on time often improves the score over months."],
      ],
    },
    {
      group: "Credit score and reports",
      items: [
        ["How quickly does my score improve after clearing a card?", "Lenders report at least every fifteen days, so lower utilisation can show within a month or two. Past late payments take longer to fade."],
        ["What is a good utilisation?", "Under about 30 percent of your total limit is a common guide, and lower is better. It is measured on the balance reported at the statement date, so paying before the statement date can lower the reported figure."],
        ["Does closing a card improve my score?", "Not usually. It can reduce your total limit and shorten your history. Close cards you cannot control or that charge fees you will not recover."],
        ["What does settled mean on my report?", "That the lender accepted less than the full amount. Lenders treat it as a serious negative for years."],
        ["How do I check my credit report?", "Credit bureaus provide a free report once a year, and many apps and banks show your score. Check for accounts you do not recognise and dispute errors with the bureau."],
        ["Can I remove a late payment from my report?", "Only if it was an error. Correct entries stay for the period the bureau keeps them. Ask the lender to correct genuine mistakes."],
      ],
    },
    {
      group: "Safety, disputes and closure",
      items: [
        ["What if I see a fraudulent transaction?", "Block the card in the app or by phone immediately and report the transaction. Under RBI rules, prompt reporting limits your liability; within three working days it is usually zero where you were not at fault."],
        ["How do I dispute a wrong charge from a merchant?", "Contact the merchant first; if unresolved, raise a dispute with your card issuer with the details. Issuers have formal chargeback processes and timelines."],
        ["How do I close a credit card?", "Clear the full balance, redeem any rewards, and request closure through the app, email or phone. RBI rules require closure within seven working days, with compensation for delay."],
        ["Can a bank issue me a card I did not ask for?", "No. Unsolicited cards and limit increases without consent are not allowed under RBI rules. Report such cards to the issuer and, if unresolved, to the RBI Ombudsman."],
        ["Should I turn off international usage?", "Yes, unless you need it. Most issuers let you switch international, online and contactless usage on or off in their app."],
        ["Where do I complain if the bank does not resolve my issue?", "Use the issuer's grievance process first, then the RBI Integrated Ombudsman Scheme online if there is no satisfactory response within 30 days."],
        ["Is it safe to save my card in shopping apps?", "Card tokenisation means the merchant stores a token, not your card number, which reduces risk. Still remove saved cards from apps you rarely use."],
      ],
    },
    {
      group: "Rewards and choosing a card",
      items: [
        ["Are reward points worth chasing?", "Only if you pay in full every month and would make the spending anyway. Interest on even one month's balance usually exceeds a year of points."],
        ["How do I value my reward points?", "Divide the rupee value of a redemption you would actually use by the points it costs. Catalogue items often give less value than statement credit or travel transfers."],
        ["Should I pay an annual fee for a better card?", "Only if the rewards and benefits you actually use exceed the fee plus GST. Review each year and ask for a waiver or downgrade if not."],
        ["What is a lifetime-free card?", "A card with no joining or annual fee. Rewards are usually lower, but for moderate spending it often gives the best net value."],
        ["Can I convert my card to a different variant?", "Most issuers allow upgrades and downgrades within their range, keeping the account and its history. Ask before closing a card."],
        ["Is it good to have many cards for different rewards?", "It can maximise rewards for disciplined users, but adds due dates and temptation. Most people do better with one or two cards on auto-debit."],
      ],
    },
    {
      group: "Other kinds of easy credit",
      items: [
        ["Is BNPL safer than a credit card?", "BNPL is often interest-free if paid on time, but late fees can be steep and it is reported to credit bureaus. Several plans at once can add up to a heavy monthly load."],
        ["What is a UPI credit line?", "A pre-approved credit line from a bank that can be used for UPI payments. It is debt like a credit card and should be treated with the same discipline."],
        ["Are instant loan apps legal?", "Many are operated by or for regulated lenders, but some are not. Check that the lender is an RBI-regulated bank or NBFC and avoid apps demanding broad access to your phone data."],
        ["Is an overdraft cheaper than a card?", "Usually yes, especially an overdraft against a deposit. Interest is charged only on the amount used, for the days used."],
        ["Do store EMI cards affect my credit score?", "Yes. Consumer durable loans and EMI cards are reported to credit bureaus like any other credit. On-time payments help build history; missed payments harm your record exactly as a missed card payment would."],
      ],
    },
    {
      group: "Family and help",
      items: [
        ["Should I tell my partner about my card debt?", "Usually yes. Shared finances are easier to manage when both people know the full picture, and a plan agreed together is more likely to stick. Bring the numbers and a plan to the conversation."],
        ["Should I pay off my adult child's card?", "Only with a plan to stop the balance returning: a written repayment agreement, a lower limit and auto-debit for the full amount afterwards. Otherwise the balance often comes back."],
        ["Is free credit counselling available in India?", "Some banks run financial literacy and credit counselling centres that offer free guidance. Ask your bank, and be wary of paid 'debt relief' services that promise to erase debts."],
        ["What should I do if recovery agents harass me?", "Note the date, time, caller and what was said, and complain in writing to the lender. RBI's rules restrict calling hours and prohibit intimidation. Escalate to the RBI Ombudsman if needed, and to the police for threats."],
        ["Can a lender contact my relatives about my dues?", "Lenders and their agents must respect privacy and RBI's fair practices code. Contacting relatives or colleagues to shame a borrower is not acceptable conduct; complain if it happens."],
      ],
    },
    {
      group: "Getting and using a card",
      items: [
        ["Can I get a credit card with no credit history?", "Yes. A card secured against a fixed deposit is the usual route. Some banks also issue entry-level cards to salaried customers. Use it lightly and pay in full to build history."],
        ["Does applying for a card lower my score?", "A hard enquiry can lower it slightly for a short time. Several applications in a short period have a bigger effect, so apply only for cards you intend to use."],
        ["What limit should I ask for?", "One that comfortably covers your normal monthly spending with room to spare, but not so high that it tempts you. Utilisation under 30 percent is the aim."],
        ["Should I set auto-debit for the minimum or the full amount?", "The full amount. Auto-debit for the minimum guarantees you will pay interest whenever you forget to top it up."],
        ["Can I use my card abroad?", "Yes, if international usage is enabled. Expect a foreign currency markup of around 2 to 3.5 percent plus GST on each transaction, unless your card waives it."],
      ],
    },
    {
      group: "Quick answers",
      items: [
        ["How much should I pay each month to clear my card in a year?", "Use the site's payoff calculator, or treat it as a 12-month EMI at your card's yearly rate multiplied by 1.18 for GST. On Rs. 1 lakh at 42 percent, that is about Rs. 10,500 a month."],
        ["Does paying early in the cycle reduce interest?", "If you are revolving a balance, yes: interest accrues daily on the outstanding amount, so an earlier payment means a smaller average balance. It also lowers reported utilisation."],
        ["What if my auto-debit fails?", "Pay manually the same day from another account. A failed auto-debit can carry a bank charge, and an unpaid minimum becomes late after three days."],
        ["Can I negotiate my card's interest rate?", "Some issuers lower rates for good customers or offer reduced-rate EMI conversion for existing balances. Ask; the worst outcome is a no."],
        ["How long does a missed payment stay on my report?", "Records are generally kept for several years. Their effect on scores fades with time and a good recent record."],
        ["Should I keep a card I never use?", "If it has no fee and is your oldest account, keeping it can help your history length. Use it occasionally for a small purchase paid in full so the issuer does not close it as inactive."],
      ],
    },
  ],

  glossary: [
    ["Add-on card", "An extra card linked to the primary account, for a family member, sharing the limit."],
    ["Avalanche method", "Paying extra on the highest-rate debt first."],
    ["Balance transfer", "Moving a card balance to another card or lender at a lower promotional rate."],
    ["Billing cycle", "The period, usually about a month, covered by one statement."],
    ["Cash advance", "A cash withdrawal on a credit card, charged a fee and interest from day one."],
    ["Chargeback", "A process to reverse a disputed card transaction through the card network."],
    ["Credit bureau", "A company that collects repayment information and produces credit reports and scores."],
    ["Credit limit", "The maximum balance allowed on a card."],
    ["Credit score", "A number summarising your credit history, used by lenders to judge risk."],
    ["Due date", "The last date to pay the statement without being late."],
    ["EMI conversion", "Turning a purchase or balance into fixed monthly instalments at a set rate."],
    ["Finance charge", "Interest charged on revolving balances and cash advances."],
    ["Interest-free period", "The time between a purchase and the due date during which no interest applies if the full balance is paid."],
    ["Late payment charge", "A fee for paying less than the minimum due within three days after the due date."],
    ["Minimum amount due", "The smallest payment that keeps the account in good standing; not a repayment plan."],
    ["No-cost EMI", "An instalment offer where the merchant discounts the interest; fees and GST may still apply."],
    ["Over-limit", "Spending beyond the credit limit, where permitted, often with a fee."],
    ["Personal loan", "An unsecured instalment loan, usually far cheaper than revolving card debt."],
    ["Revolving", "Carrying a balance from month to month instead of paying in full."],
    ["Settlement", "An agreement to pay less than the full dues to close the account, reported negatively."],
    ["Snowball method", "Paying extra on the smallest balance first."],
    ["Statement date", "The date the billing cycle closes and the statement is generated."],
    ["Tokenisation", "Replacing the card number with a token for online payments, so merchants do not store card details."],
    ["Total amount due", "The full statement balance; paying it by the due date avoids interest."],
    ["Utilisation", "Card balances as a percentage of credit limits."],
    ["Zero liability", "The principle that a customer who reports an unauthorised transaction promptly bears no loss where they were not at fault."],
    ["BNPL", "Buy now, pay later: short instalment plans offered at checkout."],
    ["Credit line on UPI", "A pre-approved bank credit facility that can be spent through UPI."],
    ["Lifetime-free card", "A credit card with no joining or annual fee."],
    ["Overdraft", "A facility to withdraw more than your balance, charged interest on the amount used."],
    ["Recovery agent", "A person or firm engaged by a lender to collect overdue dues, bound by RBI's code of conduct."],
    ["Reward points", "Points earned on card spending, redeemable for goods, travel or statement credit."],
  ],

  references: [
    { title: "Master Direction: Credit Card and Debit Card - Issuance and Conduct Directions, 2022 (as updated)", who: "Reserve Bank of India", where: "rbi.org.in, Master Directions", note: "Rules on closure, unsolicited cards, billing, minimum due, late charges and grievance redress." },
    { title: "Customer Protection: Limiting Liability of Customers in Unauthorised Electronic Banking Transactions", who: "Reserve Bank of India circular, July 2017", where: "rbi.org.in", note: "Zero and limited liability depending on how quickly an unauthorised transaction is reported." },
    { title: "Credit information reporting at fortnightly intervals", who: "Reserve Bank of India", where: "rbi.org.in", note: "Lenders report credit data to bureaus at least every fifteen days." },
    { title: "Most Important Terms and Conditions", who: "Your card issuer", where: "Issuer's website or welcome kit", note: "The authoritative source for your card's interest method, fees and minimum-due calculation." },
    { title: "RBI Integrated Ombudsman Scheme, 2021", who: "Reserve Bank of India", where: "cms.rbi.org.in", note: "Where to complain if your issuer does not resolve a grievance within 30 days." },
    { title: "Free annual credit report", who: "Credit information companies registered with RBI", where: "Each bureau's website", note: "Check your report for errors at least once a year." },
    { title: "National Cyber Crime Reporting Portal", who: "Ministry of Home Affairs", where: "cybercrime.gov.in, helpline 1930", note: "Report card fraud quickly, in addition to informing the issuer." },
  ],
};
