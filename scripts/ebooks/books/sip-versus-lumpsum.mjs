// Practice material for "SIP, Lumpsum and a Savings Goal".
// Uses the same monthly compounding as the site's SIP calculator: each month's
// instalment is added, then the month's return (yearly rate / 12) is applied.
import { inr } from "../lib/calc.mjs";

function sip(monthly, rate, years, step = 0) {
  const i = rate / 1200;
  let bal = 0;
  let inv = 0;
  let p = monthly;
  const rows = [];
  for (let m = 1; m <= Math.round(years * 12); m++) {
    bal = (bal + p) * (1 + i);
    inv += p;
    if (m % 12 === 0) {
      rows.push([m / 12, inv, bal]);
      p *= 1 + step / 100;
    }
  }
  return { value: bal, invested: inv, gain: bal - inv, rows };
}
const lump = (amt, rate, years) => amt * Math.pow(1 + rate / 100, years);
function sipNeeded(target, rate, years) {
  const n = Math.round(years * 12);
  const i = rate / 1200;
  return (target * i) / ((Math.pow(1 + i, n) - 1) * (1 + i));
}
const lumpNeeded = (target, rate, years) => target / Math.pow(1 + rate / 100, years);
const real = (amt, infl, years) => amt / Math.pow(1 + infl / 100, years);
const Rs = (n) => `Rs. ${inr(n)}`;
const pct = (n) => `${(Math.round(n * 10) / 10).toFixed(1)} percent`;
// Compound annual growth rate.
const cagr = (start, end, years) => (Math.pow(end / start, 1 / years) - 1) * 100;

const ex10k = sip(10000, 12, 10);
const ex10k20 = sip(10000, 12, 20);

// Sequence-of-returns illustration: same average, different order.
function sipPath(monthly, yearlyReturns) {
  let bal = 0;
  let inv = 0;
  for (const r of yearlyReturns) {
    const i = r / 1200;
    for (let m = 0; m < 12; m++) {
      bal = (bal + monthly) * (1 + i);
      inv += monthly;
    }
  }
  return { bal, inv };
}
const goodEarly = sipPath(10000, [20, 18, 15, 12, 10, 8, 6, 4, 2, 5]);
const goodLate = sipPath(10000, [5, 2, 4, 6, 8, 10, 12, 15, 18, 20]);
const lumpPath = (amt, rs) => rs.reduce((a, r) => a * (1 + r / 100), amt);

export default {
  checked: "October 2026",
  welcome:
    "This book is about turning a goal into a monthly number. It explains what a SIP and a lumpsum really do, how compounding behaves over short and long periods, why the order of good and bad years matters, and how to work backwards from a target amount and date. It uses teaching rates throughout. No rate here is a forecast or a promise.",

  chapters: [
    {
      title: "How the calculator counts",
      paragraphs: [
        "The site's SIP calculator assumes you invest at the start of each month and that the investment grows at a steady yearly rate, applied as one twelfth each month. Real funds do not grow steadily. The calculator gives a smooth line through a bumpy road, which is useful for planning as long as you remember the bumps.",
      ],
      sections: [
        {
          heading: "Ten thousand a month",
          paragraphs: [
            `At an illustrated 12 percent, Rs. 10,000 a month for 10 years puts in ${Rs(ex10k.invested)} and shows a value of about ${Rs(ex10k.value)}. Growth is ${Rs(ex10k.gain)}. Over 20 years, the same SIP puts in ${Rs(ex10k20.invested)} and shows about ${Rs(ex10k20.value)}. Twice the years produced more than three times the value.`,
          ],
          table: {
            caption: "Rs. 10,000 a month at an illustrated 12 percent.",
            headers: ["Year", "Invested", "Value", "Growth"],
            rows: ex10k20.rows.filter((r) => [1, 3, 5, 8, 10, 12, 15, 18, 20].includes(r[0])).map(([y, i, v]) => [String(y), inr(i), inr(v), inr(v - i)]),
          },
        },
        {
          heading: "Why the later years do the work",
          paragraphs: [
            "In the early years, most of the value is your own money. Growth is earning on a small base. In the later years the base is large, and a year's growth can exceed a year's contributions. In the table, growth passes the amount invested at around year 11. That is why stopping a SIP in year four gives up so much: you leave just before the part that compounds.",
          ],
        },
        {
          heading: "The rule of 72",
          paragraphs: [
            "Divide 72 by the yearly return to estimate how many years money takes to double. At 12 percent, about 6 years. At 8 percent, about 9. At 6 percent, about 12. It is an approximation that works well between about 4 and 15 percent, and it is handy for checking whether a projection is plausible.",
          ],
        },
      ],
    },
    {
      title: "SIP or lumpsum: what actually differs",
      paragraphs: [
        "A SIP and a lumpsum are not rival products. They are two ways of putting money into the same fund. The question is only when the money goes in.",
      ],
      sections: [
        {
          heading: "If returns were smooth",
          paragraphs: [
            `With a steady return, a lumpsum invested today always beats the same total spread over later months, because every rupee is invested for longer. Rs. 12 lakh invested at once at 12 percent for 10 years grows to about ${Rs(lump(1200000, 12, 10))}. Rs. 10,000 a month for 10 years, also Rs. 12 lakh in total, grows to about ${Rs(ex10k.value)}.`,
            "That comparison is unfair to the SIP for most people, because most people do not have Rs. 12 lakh today. They have a salary each month. For salaried savers the SIP is not a choice against a lumpsum; it is the only way the money exists.",
          ],
        },
        {
          heading: "When returns are bumpy",
          paragraphs: [
            "With real markets, a lumpsum carries timing risk. Invest just before a fall and the whole amount falls. A SIP spreads purchases, buying more units when prices are low and fewer when high. This is called rupee-cost averaging. It does not guarantee a better result; in a market that rises steadily, the lumpsum still wins. What it does is reduce regret and the risk of one bad start.",
          ],
        },
        {
          heading: "Same average, different order",
          paragraphs: [
            "Two ten-year paths below have exactly the same yearly returns, in opposite order. Path A has the good years first; Path B has them last.",
            `A Rs. 10,000 monthly SIP ends at ${Rs(goodEarly.bal)} on Path A and ${Rs(goodLate.bal)} on Path B. A Rs. 12 lakh lumpsum ends at ${Rs(lumpPath(1200000, [20, 18, 15, 12, 10, 8, 6, 4, 2, 5]))} on either path, because multiplication does not care about order.`,
            "The SIP does better when the good years come late, because by then more money is invested. That is good news for a young saver who meets a bad market early, and a warning for anyone close to a goal: a fall in the last years hits the largest balance.",
          ],
          table: {
            caption: "Yearly returns used in the two paths, in percent.",
            headers: ["Year", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
            rows: [
              ["Path A", "20", "18", "15", "12", "10", "8", "6", "4", "2", "5"],
              ["Path B", "5", "2", "4", "6", "8", "10", "12", "15", "18", "20"],
            ],
          },
        },
        {
          heading: "Spreading a lumpsum",
          paragraphs: [
            "If you have a large sum and fear investing it all at once, a systematic transfer plan moves it from a liquid or short-term debt fund into an equity fund in monthly instalments over six to twelve months. It costs some expected return in a rising market and buys peace of mind. Over long periods, the start date matters less and less.",
          ],
        },
      ],
    },
    {
      title: "Working backwards from a goal",
      paragraphs: [
        "Start with what you need, by when, then find the monthly amount. Three numbers do the job: the target in future rupees, the number of years, and a cautious return.",
      ],
      sections: [
        {
          heading: "Step 1: put the goal in future rupees",
          paragraphs: [
            `A college fee of Rs. 10 lakh today, rising with 6 percent inflation, will be about ${Rs(lump(1000000, 6, 12))} in 12 years. Planning for Rs. 10 lakh would leave a gap of a third.`,
          ],
        },
        {
          heading: "Step 2: choose a cautious return",
          paragraphs: [
            "For long goals invested in equity funds, many planners use 10 to 12 percent as an illustration. For goals within five years, use a debt-like rate, perhaps 6 to 7 percent, because you cannot afford a fall just before the date. A cautious rate means a larger monthly amount, which is the point: it protects the goal against an ordinary bad decade.",
          ],
        },
        {
          heading: "Step 3: compute the SIP",
          paragraphs: [
            `For ${Rs(lump(1000000, 6, 12))} in 12 years at 10 percent, the monthly SIP is about ${Rs(sipNeeded(lump(1000000, 6, 12), 10, 12))}. At 8 percent, ${Rs(sipNeeded(lump(1000000, 6, 12), 8, 12))}. At 12 percent, ${Rs(sipNeeded(lump(1000000, 6, 12), 12, 12))}. Choose the 10 percent figure, then treat any extra return as a bonus.`,
          ],
          table: {
            caption: "Monthly SIP needed for Rs. 10 lakh, by years and return.",
            headers: ["Years", "8%", "10%", "12%"],
            rows: [3, 5, 7, 10, 15, 20].map((y) => [String(y), inr(sipNeeded(1000000, 8, y)), inr(sipNeeded(1000000, 10, y)), inr(sipNeeded(1000000, 12, y))]),
          },
        },
        {
          heading: "Step 4: move to safety near the date",
          paragraphs: [
            "Two or three years before the goal, start moving the accumulated amount from equity to a steadier home, such as a short-term debt fund or deposits, a part each month. The goal's date does not move if markets fall, so the money must stop depending on markets before the date arrives.",
          ],
        },
      ],
    },
    {
      title: "Inflation, taxes and costs",
      paragraphs: [
        "A projection in today's money is the only one that tells you what you can buy. Taxes and fund costs then take a share of the growth.",
      ],
      sections: [
        {
          heading: "Real value",
          paragraphs: [
            `${Rs(ex10k20.value)} in 20 years, discounted at 6 percent inflation, is worth about ${Rs(real(ex10k20.value, 6, 20))} in today's money. Still a large sum, but less than half the headline. Always look at both.`,
          ],
        },
        {
          heading: "Tax on gains",
          paragraphs: [
            "For equity-oriented mutual funds, gains on units held more than 12 months are long-term. Since 23 July 2024, long-term gains above Rs. 1.25 lakh in a financial year are taxed at 12.5 percent, and short-term gains at 20 percent. Each SIP instalment is a separate purchase with its own holding period, and units are redeemed first-in, first-out.",
            "For debt funds bought on or after 1 April 2023, gains are generally added to income and taxed at your slab rate regardless of holding period. Tax rules change with budgets; check the current rules before you redeem.",
          ],
        },
        {
          heading: "Expense ratio",
          paragraphs: [
            `Every fund deducts a yearly expense ratio from its assets. Direct plans, bought without a distributor, have lower expense ratios than regular plans. A difference of 1 percentage point sounds small. On Rs. 10,000 a month for 20 years, 12 percent against 11 percent ends at ${Rs(ex10k20.value)} against ${Rs(sip(10000, 11, 20).value)}, a gap of ${Rs(ex10k20.value - sip(10000, 11, 20).value)}.`,
            "A regular plan includes payment for advice. If you get good advice, it may be worth it. If you do not use the advice, the direct plan of the same fund is the same portfolio for less.",
          ],
        },
        {
          heading: "Exit loads and lock-ins",
          paragraphs: [
            "Many equity funds charge an exit load, often 1 percent, if units are redeemed within a year. ELSS funds have a three-year lock-in for each instalment. Check the scheme information document before you invest money you might need soon.",
          ],
        },
      ],
    },
    {
      title: "Keeping the habit",
      paragraphs: [
        "The arithmetic of SIPs is easy. The difficult part is behaviour: continuing through falls, raising the amount when income rises, and not stopping for reasons that feel urgent and are not.",
      ],
      sections: [
        {
          heading: "Step up with your salary",
          paragraphs: [
            `A SIP that rises 10 percent a year, starting at Rs. 10,000, invests ${Rs(sip(10000, 12, 20, 10).invested)} over 20 years and shows about ${Rs(sip(10000, 12, 20, 10).value)} at an illustrated 12 percent. A flat Rs. 10,000 shows ${Rs(ex10k20.value)}. The step-up matches how most incomes grow and keeps the SIP meaningful as life gets more expensive.`,
            "Change the mandate in the month your raise arrives. A step-up planned in a spreadsheet and never instructed to the bank does nothing.",
          ],
        },
        {
          heading: "Falls are when SIPs buy cheaply",
          paragraphs: [
            "When a fund falls 20 percent, the same SIP buys 25 percent more units. Stopping during the fall locks in the worst purchases and skips the best. If a fall frightens you so much that you would stop, the allocation is too aggressive for you, and the fix is a calmer mix of funds, not stopping.",
          ],
        },
        {
          heading: "Pause, do not cancel",
          paragraphs: [
            "Many fund houses let you pause a SIP for a few months. If you lose a job or face a medical bill, pause rather than cancel and restart, and keep the emergency fund for the emergency. The SIP is for goals; the emergency fund is for the unexpected.",
          ],
        },
      ],
    },
    {
      title: "Fund types in plain words",
      paragraphs: [
        "SEBI groups mutual fund schemes into categories so that a fund's name tells you roughly what it holds. You do not need all of them. Most goals can be met with two or three.",
      ],
      sections: [
        {
          heading: "Equity funds",
          paragraphs: [
            "Large-cap funds hold the biggest listed companies, which tend to be steadier. Mid-cap and small-cap funds hold smaller companies, which can grow faster and fall harder. Flexi-cap and multi-cap funds mix sizes; a multi-cap fund must hold a minimum share in each of large, mid and small companies, while a flexi-cap fund can move freely. Sector and thematic funds concentrate on one industry or idea and are the most volatile.",
            "Index funds and exchange-traded funds copy an index such as the Nifty 50 or Sensex at low cost. They will never beat the index, and they will rarely trail it by more than their small expense ratio.",
          ],
        },
        {
          heading: "Debt funds",
          paragraphs: [
            "Liquid and overnight funds hold very short-term instruments and are used to park money for days or weeks. Short-duration and corporate bond funds hold bonds for a few years and suit goals two to five years away. Gilt funds hold government bonds; they carry no credit risk but can swing with interest rates, especially long-duration ones.",
            "Debt funds are not deposits. Their value can fall when interest rates rise or when a bond they hold defaults. Read the scheme's average maturity and credit quality before investing.",
          ],
        },
        {
          heading: "Hybrid funds",
          paragraphs: [
            "Aggressive hybrid funds keep most money in equity with some debt. Conservative hybrid funds do the reverse. Balanced advantage or dynamic asset allocation funds change the equity share according to a model, aiming for smoother returns. Multi-asset funds add gold. Hybrids suit people who want one fund to do the balancing, at some cost in flexibility and sometimes in tax treatment.",
          ],
        },
        {
          heading: "A simple set for most people",
          bullets: [
            "For goals more than seven years away: a broad index fund and, if you like, one flexi-cap fund.",
            "For goals three to seven years away: a hybrid fund, or a mix of equity index and short-duration debt.",
            "For goals under three years and emergencies: liquid or short-duration debt funds, deposits or a savings account.",
          ],
        },
      ],
    },
    {
      title: "Reading a fund factsheet",
      paragraphs: [
        "Every fund publishes a monthly factsheet. Five items on it tell you most of what you need.",
      ],
      sections: [
        { label: "Benchmark and returns", paragraphs: ["Compare the fund's 3-, 5- and 10-year returns with its benchmark over the same periods, not with other funds' best years. A fund that trails its benchmark for years is costing you its fee for nothing."] },
        { label: "Expense ratio", paragraphs: ["Look at the direct plan's figure. For index funds it is usually well under half a percent; for active equity funds, often between half and one and a half percent."] },
        { label: "Portfolio and concentration", paragraphs: ["The top ten holdings and sector weights show whether the fund is diversified or making a big bet. Two funds with the same top holdings are not giving you diversification."] },
        { label: "Fund size and age", paragraphs: ["Very small funds can be closed or merged; very new funds have no record through a bad market. Neither is disqualifying, but both are worth noting."] },
        { label: "Riskometer", paragraphs: ["The SEBI riskometer shows the scheme's risk level. Match it to the goal's date. A very high risk fund does not belong in money you need in two years."] },
        { label: "Debt funds only", paragraphs: ["Check average maturity or modified duration, which shows sensitivity to interest-rate changes, and credit quality, which shows how much is in lower-rated bonds."] },
      ],
    },
    {
      title: "Portfolios through a life",
      paragraphs: [
        "A rough rule many planners use is to hold less equity as you get older and goals get closer. The exact numbers matter less than having a plan you will follow.",
      ],
      sections: [
        {
          heading: "In your twenties",
          paragraphs: [
            "Build an emergency fund of three to six months' expenses first. Then start a SIP, even a small one, mostly in equity for retirement. Buy term life cover if anyone depends on you and health insurance regardless. Avoid expensive debt.",
          ],
        },
        {
          heading: "Thirties and forties",
          paragraphs: [
            "Goals multiply: a home, children, perhaps parents' care. Give each goal its own SIP and fund type. Step up SIPs with raises. Keep retirement saving going even when nearer goals compete; it is the goal with no loan available.",
          ],
        },
        {
          heading: "Fifties",
          paragraphs: [
            "Start shifting retirement money gradually towards debt and hybrid funds, so a market fall at 58 cannot cut your corpus by a third just before you need it. Clear remaining loans. Check that health insurance will continue past retirement.",
          ],
        },
        {
          heading: "After retirement",
          paragraphs: [
            "Keep the next three to five years of spending in safe instruments, and the rest in a mix that can still grow, because retirement may last thirty years. Draw from the safe part, refill it from the growth part in good years.",
          ],
          table: {
            caption: "One illustrative glide path for retirement money. Adjust for your own tolerance for falls.",
            headers: ["Years to retirement", "Equity", "Debt and deposits"],
            rows: [["25 or more", "75-85%", "15-25%"], ["15", "65-75%", "25-35%"], ["10", "55-65%", "35-45%"], ["5", "40-50%", "50-60%"], ["At retirement", "30-40%", "60-70%"]],
          },
        },
      ],
    },
    {
      title: "The mistakes that cost the most",
      paragraphs: ["Most of the damage to long-term returns comes from a few repeated behaviours, not from choosing the second-best fund."],
      sections: [
        { label: "Stopping after a fall", paragraphs: ["It sells or skips units at the cheapest prices and often means missing the recovery. If you cannot bear the falls, choose a calmer fund mix in advance."] },
        { label: "Starting late", paragraphs: ["Each year of delay removes a year of compounding from the end, which is the most valuable year. A small SIP started now beats a large one planned for later."] },
        { label: "Not raising the SIP", paragraphs: ["Incomes rise; a flat SIP shrinks as a share of income and in real terms. Tie step-ups to raises."] },
        { label: "Chasing recent winners", paragraphs: ["Last year's top fund often lags next year. Switching adds costs and taxes."] },
        { label: "Too many funds", paragraphs: ["Ten funds with overlapping holdings are harder to track and no more diversified than three good ones."] },
        { label: "Ignoring costs", paragraphs: ["A one-point higher expense ratio can cost lakhs over two decades. Prefer direct plans unless the advice is worth the difference."] },
        { label: "Taking equity risk with near money", paragraphs: ["Money needed within three years should not depend on the stock market."] },
        { label: "Forgetting nominees and records", paragraphs: ["Unclaimed investments cause distress for families. Keep nominations current and a list of folios where your family can find it."] },
      ],
    },
    {
      title: "Turning a corpus into income",
      paragraphs: [
        "Saving for retirement is half the job. The other half is drawing the money out so it lasts, without either spending too fast or living too frugally out of fear.",
      ],
      sections: [
        {
          heading: "Three buckets",
          paragraphs: [
            "A simple structure: bucket one holds two to three years of spending in a savings account, sweep deposit or liquid fund. Bucket two holds the next four to seven years in short-duration debt funds, deposits or senior citizens' schemes. Bucket three holds the rest in a mix that can grow, such as hybrid or index funds.",
            "You spend from bucket one. Each year, refill it from bucket two, and refill bucket two from bucket three after good years. In a bad year for markets, you leave bucket three alone and let it recover.",
          ],
        },
        {
          heading: "How much can you draw?",
          paragraphs: [
            "A common rule of thumb from overseas research is to draw about 4 percent of the starting corpus in year one and raise it with inflation each year. Indian inflation has been higher than in the countries that research studied, so many Indian planners suggest starting lower, around 3 to 3.5 percent, for a retirement that may last 30 years.",
            `On Rs. 1 crore, 3.5 percent is Rs. 3.5 lakh in the first year, about ${Rs(350000 / 12)} a month. If that is not enough, the realistic options are to work longer, spend less, or accept a higher risk of running short.`,
          ],
        },
        {
          heading: "Guaranteed income",
          paragraphs: [
            "Annuities from insurers pay a fixed income for life in exchange for a lump sum. Government schemes for senior citizens pay fixed interest for a set term within investment limits. These remove market risk from part of your income at the cost of flexibility and, for annuities, the lump sum itself. Many retirees combine a guaranteed base with a withdrawal plan from funds.",
          ],
        },
      ],
    },
    {
      title: "Records and tax housekeeping",
      paragraphs: ["Good records make tax season and family transitions easy. Five habits cover almost everything."],
      sections: [
        { label: "Keep one list of folios", paragraphs: ["Fund house, folio number, scheme, nominee and the goal it serves. Update it when you start or stop a SIP. Tell one family member where it is."] },
        { label: "Download the consolidated statement yearly", paragraphs: ["It lists every holding linked to your PAN. Compare it with your list to catch forgotten folios."] },
        { label: "Use the yearly exemption", paragraphs: ["Long-term equity gains up to Rs. 1.25 lakh a year are exempt. If you hold funds with large unrealised gains, redeeming and reinvesting enough each year to use the exemption raises your cost price and reduces tax later. Watch exit loads and do not disturb near-term goals for it."] },
        { label: "Report everything", paragraphs: ["Capital gains statements from fund registrars show each redemption's gain and holding period. Use them when filing; the tax department receives the same data."] },
        { label: "Keep KYC and bank details current", paragraphs: ["A changed bank account or mobile number not updated with the fund house can block redemptions or send messages to the wrong place."] },
      ],
    },
    {
      title: "Mutual funds beside other savings",
      paragraphs: [
        "A SIP in a mutual fund is one of several ways to save regularly. Each has a different job. The table compares the most common ones in broad terms; check current rates and rules before choosing.",
      ],
      sections: [
        {
          table: {
            caption: "Broad comparison of regular-saving options. Rates and rules change; these are characteristics, not quotes.",
            headers: ["Option", "Return", "Risk of loss", "Access", "Tax on growth"],
            widths: [1.3, 1.2, 1, 1.3, 1.6],
            rows: [
              ["Equity fund SIP", "Market-linked, highest long-run potential", "Yes, can fall sharply", "Any time, after exit-load period", "LTCG 12.5% above Rs. 1.25 lakh; STCG 20%"],
              ["Debt fund SIP", "Market-linked, moderate", "Small, rate and credit risk", "Any time", "At slab rate"],
              ["Recurring deposit", "Fixed for the term", "No (insured up to limits)", "Penalty if broken", "Interest at slab rate yearly"],
              ["PPF", "Declared quarterly by government", "No", "15-year lock, partial withdrawals", "Tax-free"],
              ["EPF and VPF", "Declared yearly", "No", "Restricted until retirement or job change", "Tax-free within limits"],
              ["Gold funds or ETFs", "Follows gold price", "Yes", "Any time", "Varies by product and holding period"],
            ],
          },
          paragraphs: [
            "No option wins on every column. Safe options lose to inflation over long periods after tax; growth options can fall when you need the money. A household plan usually combines a guaranteed base, such as EPF and PPF, with equity funds for growth and liquid money for emergencies.",
          ],
        },
        {
          heading: "Insurance-cum-investment products",
          paragraphs: [
            "Endowment and money-back policies combine life cover with savings. Their returns have typically been modest, often in the range of deposit rates, and surrendering early can cost a large part of the premiums paid. Unit-linked plans invest in funds but carry their own charges and a five-year lock-in.",
            "Many people are better served by a pure term policy for protection and separate investments for growth. If you already hold such a policy, look up its surrender value and projected maturity before deciding; continuing can make sense once the early years' charges are behind you.",
          ],
        },
      ],
    },
    {
      title: "Questions to ask before you buy any investment",
      paragraphs: ["Use these whether the product is offered by a bank, an app, an agent or a relative."],
      sections: [
        {
          steps: [
            "Which goal is this money for, and when will I need it?",
            "Can this investment fall in value? By how much in a bad year?",
            "What are all the costs: entry, yearly, exit, and commission?",
            "Is there a lock-in or a penalty for leaving early?",
            "How is the return taxed, and when?",
            "Is the seller registered with SEBI, AMFI, IRDAI or RBI as appropriate?",
            "In whose name are the units or policy held, and can I see them independently?",
            "What happens if I stop paying or need the money in an emergency?",
            "Would a simpler, cheaper product do the same job?",
          ],
          note: "Be wary of guaranteed high returns, pressure to decide today, and requests to transfer money to a personal account. Check registrations on the regulator's website before you invest.",
        },
      ],
    },
    {
      title: "A year of SIP housekeeping",
      paragraphs: ["Investing well is mostly a few small tasks done on time. Spread across a year, they take an hour or two in total."],
      sections: [
        {
          table: {
            caption: "One possible calendar. Move the months to suit your salary cycle and financial year.",
            headers: ["When", "Task"],
            widths: [1, 3],
            rows: [
              ["April", "Decide this year's step-ups after appraisals; update mandates the month the raise is paid."],
              ["June", "Download the consolidated account statement; check every folio has a nominee and current bank details."],
              ["July", "Use capital gains statements from the registrars when filing the income tax return."],
              ["October", "Review each goal: amount needed in that year's rupees, amount saved, and whether the SIP is enough."],
              ["December", "Compare each fund with its benchmark over 3 and 5 years. Act only on long, clear underperformance."],
              ["February", "Rebalance if any goal's mix has drifted more than 5 to 10 points from target."],
              ["March", "Harvest long-term gains within the yearly exemption if it suits you; move money for goals due within a year."],
            ],
          },
        },
        {
          heading: "What not to do",
          paragraphs: [
            "Do not check daily values, switch funds after one bad quarter, or redeem to 'book profit' without a goal that needs the money. Each of these feels like activity and usually costs return.",
          ],
        },
      ],
    },
    {
      title: "Talking about money at home",
      paragraphs: [
        "Plans fail more often from disagreement than from arithmetic. A household that agrees on goals, and on who does what, keeps its SIPs running through bad years.",
      ],
      sections: [
        {
          heading: "Agree the goals together",
          paragraphs: [
            "Sit down once a year and list the household's goals with rough amounts and dates. Write them on one page. When a new expense appears, such as a relative's wedding or a new car, the page makes it clear which goal it competes with.",
          ],
        },
        {
          heading: "Make sure both partners can find everything",
          paragraphs: [
            "In many households one person manages investments. If that person is ill or dies, the other may not know where anything is. Keep a shared list of accounts, folios, insurance policies and passwords stored in a password manager with emergency access, and walk through it together once a year.",
          ],
        },
        {
          heading: "Teach children with small amounts",
          paragraphs: [
            "A teenager who watches a small SIP in their own name for a few years learns more about compounding and patience than any lecture can teach. Show them the yearly statement and let them decide on the step-up from their own pocket money or first earnings.",
          ],
        },
        {
          heading: "Parents and in-laws",
          paragraphs: [
            "Older relatives often hold money in deposits, post office schemes and insurance policies, sometimes with lapsed nominations. Offer to help list them, update nominees and KYC, and check that maturity proceeds are not sitting idle in a savings account. Respect their choices about risk; safety matters more at their stage.",
          ],
        },
      ],
    },
    {
      title: "One household's plan, start to finish",
      paragraphs: [
        "Here is a complete plan for one illustrative household, so you can see the pieces working together. Kavya, 32, and Rohit, 34, live in Bengaluru with a daughter aged 2. Their combined take-home is Rs. 2.2 lakh a month, essential spending is Rs. 1.1 lakh, and they have Rs. 6 lakh saved.",
      ],
      sections: [
        {
          heading: "First, the foundations",
          bullets: [
            "Emergency fund: six months of essentials, Rs. 6.6 lakh, in a sweep deposit and liquid fund. Their savings cover most of it; they add Rs. 10,000 a month until it is full.",
            "Term life cover for each, about ten times annual income, and a family floater health policy with a top-up.",
            "No credit card balances carried; one car loan with two years left.",
          ],
        },
        {
          heading: "Then the goals",
          table: {
            caption: "Goals in future rupees. Rates are planning assumptions.",
            headers: ["Goal", "Today's cost", "Years", "Future cost", "Rate", "Monthly SIP"],
            rows: [
              ["Car replacement", "8,00,000", "5", inr(lump(800000, 5, 5)), "7%", inr(sipNeeded(lump(800000, 5, 5), 7, 5))],
              ["Home down payment", "25,00,000", "6", inr(lump(2500000, 6, 6)), "8%", inr(sipNeeded(lump(2500000, 6, 6), 8, 6))],
              ["Daughter's education", "20,00,000", "16", inr(lump(2000000, 7, 16)), "11%", inr(sipNeeded(lump(2000000, 7, 16), 11, 16))],
              ["Retirement corpus", "3,00,00,000", "26", inr(lump(30000000, 6, 26)), "11%", inr(sipNeeded(lump(30000000, 6, 26), 11, 26))],
            ],
          },
          paragraphs: [
            "The total is more than their surplus today. So they start the near goals in full, start education and retirement at what is left, and add a 10 percent yearly step-up to the long goals. When the car loan ends, its EMI moves to retirement. When the down payment is spent, its SIP moves to education and retirement.",
            "Their EPF contributions also count towards retirement and reduce the SIP needed. They review in October each year, when appraisals are known.",
          ],
        },
        {
          heading: "What makes the plan work",
          paragraphs: [
            "Not the precise numbers, which will be wrong in both directions, but the structure: foundations first, each goal with its own money and risk level, step-ups tied to income, and a yearly review. A plan like this survives job changes, market falls and new goals because each piece can be adjusted without disturbing the rest.",
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Fifteen savers with different goals and dates. All projections use steady teaching rates and are not forecasts. Real results will be higher or lower.",

  scenarios: [
    {
      title: "First salary, first SIP",
      paragraphs: [
        `Aditya, 23, in Pune, starts a Rs. 3,000 SIP in an index fund with his first salary. At an illustrated 11 percent for 35 years that grows to about ${Rs(sip(3000, 11, 35).value)}, from ${Rs(sip(3000, 11, 35).invested)} invested.`,
        `If he waits until 30 to start the same SIP, 28 years at the same rate give ${Rs(sip(3000, 11, 28).value)}. The seven-year delay costs about ${Rs(sip(3000, 11, 35).value - sip(3000, 11, 28).value)}, even though only ${Rs(3000 * 12 * 7)} less was invested.`,
        "He sets the SIP date two days after salary day, so it goes before he can spend it, and adds a yearly 10 percent step-up on the same mandate.",
        "He also kept three months of expenses in a savings account before starting, so a broken phone or a family trip would not force him to redeem units in a bad month. The SIP is for the long goal; the savings account is for life's surprises.",
      ],
      lesson: "Starting early matters more than starting big. The first years buy the longest compounding.",
    },
    {
      title: "A bonus and a nervous investor",
      paragraphs: [
        `Rukhsana in Hyderabad received a Rs. 6 lakh bonus. She planned to invest it in an equity fund for her son's education in 12 years, but the market had just risen sharply and she was afraid of investing at the top.`,
        `She parked it in a liquid fund and set a systematic transfer of Rs. 50,000 a month into the equity fund for twelve months. If the market falls during the year, later instalments buy more units. If it rises, she will have missed a little.`,
        `At an illustrated 11 percent, Rs. 6 lakh invested at once for 12 years would reach ${Rs(lump(600000, 11, 12))}. Spreading it over the first year costs a few months of growth on part of the money in a steadily rising market, a price she accepted for peace of mind.`,
      ],
      lesson: "A systematic transfer trades a little expected return for less timing risk. Both are reasonable; choose the one you will stick with.",
    },
    {
      title: "The SIP stopped in a fall",
      paragraphs: [
        "Harish in Chennai started a Rs. 15,000 SIP in a mid-cap fund. In the second year the fund fell about 25 percent and his statement showed a loss. He stopped the SIP and kept the units.",
        "Over the next two years the fund recovered and rose further. Had he continued, the instalments during the fall would have bought units at the lowest prices of the whole period, which in hindsight were the best purchases of all.",
        "He restarted, but in a large-cap index fund for half the amount, keeping the mid-cap fund for the rest. He had learned that he cared more about not seeing large losses than about the last bit of return, and chose a mix he could hold through a fall.",
      ],
      lesson: "If a fall makes you stop, the fund is too volatile for you. Change the mix, not the habit.",
    },
    {
      title: "Down payment in five years",
      paragraphs: [
        `Meghna and Arvind in Bengaluru want Rs. 20 lakh for a down payment in five years. At an illustrated 7 percent, typical of short-term debt funds or deposits, they need about ${Rs(sipNeeded(2000000, 7, 5))} a month.`,
        `A friend suggested an equity fund at an assumed 12 percent, which would need only ${Rs(sipNeeded(2000000, 12, 5))}. But five years is short. A fall in year four or five could leave them well short at the moment they need the money, with no time to recover.`,
        "They chose a mix: two thirds in a short-term debt fund and a recurring deposit, one third in a balanced fund, with a monthly total near the 7 percent figure. Anything extra the balanced fund earns will go towards stamp duty and interiors.",
      ],
      lesson: "Near goals need calm money. Plan with a low rate and treat any extra as a bonus.",
    },
    {
      title: "Retirement at 60 from 35",
      paragraphs: [
        `Sunita, 35, in Jaipur, wants a retirement corpus worth Rs. 2 crore in today's money at 60. At 6 percent inflation that is about ${Rs(lump(20000000, 6, 25))} in 25 years.`,
        `At an illustrated 11 percent, the flat monthly SIP needed is about ${Rs(sipNeeded(lump(20000000, 6, 25), 11, 25))}. That is more than her current surplus, so she uses a step-up instead: starting at Rs. 25,000 with a 10 percent yearly increase gives about ${Rs(sip(25000, 11, 25, 10).value)}.`,
        "She also counts her EPF, which will contribute a large part. Planning retirement from the SIP alone would have overstated the gap and discouraged her.",
        "Each year, on her birthday, she converts the goal into that year's rupees, compares it with what she has, and adjusts the step-up. The plan is a living document rather than a single calculation made at 35.",
      ],
      lesson: "Large long goals become reachable with a step-up SIP and by counting every retirement account you already have.",
    },
    {
      title: "Direct plan or regular plan",
      paragraphs: [
        "Omkar in Nagpur had held a regular-plan equity fund for six years through a bank's relationship manager. He discovered the direct plan of the same fund had an expense ratio about 0.9 percentage points lower.",
        `On his Rs. 20,000 monthly SIP, 0.9 points a year over a further 15 years at an illustrated 12 percent means ${Rs(sip(20000, 12, 15).value)} against ${Rs(sip(20000, 11.1, 15).value)}, a difference of about ${Rs(sip(20000, 12, 15).value - sip(20000, 11.1, 15).value)}.`,
        "He started new SIPs in the direct plan and kept the old units to avoid triggering tax and exit loads. He reviews the portfolio himself once a year, which is the work the commission had been paying someone else to do.",
        "Later, when his yearly long-term gains were below the exemption limit, he switched some old regular-plan units to the direct plan each year, using the exemption to avoid tax on the move.",
      ],
      lesson: "Same fund, different plan, different cost. Pay for advice only if you use it.",
    },
    {
      title: "A child's education in 15 years",
      paragraphs: [
        `Ramesh and Kavitha in Kochi want to fund an engineering degree costing Rs. 15 lakh today, for their daughter who is 3. In 15 years at 7 percent education inflation, the cost will be about ${Rs(lump(1500000, 7, 15))}.`,
        `At an illustrated 11 percent, the flat SIP needed is about ${Rs(sipNeeded(lump(1500000, 7, 15), 11, 15))} a month. They start at Rs. 8,000 with a 10 percent step-up, which projects to about ${Rs(sip(8000, 11, 15, 10).value)}.`,
        "They plan to move the money into a debt fund gradually from year 12, so a market fall in the last three years cannot derail admission.",
        "They also note that the goal might change. Their daughter may choose a different course, study abroad, or win a scholarship. The money is earmarked for her education, not for one specific degree, and they will revisit the amount when she is in class 8.",
      ],
      lesson: "Education costs rise faster than general prices. Use a higher inflation rate for this goal.",
    },
    {
      title: "Lumpsum from a maturing policy",
      paragraphs: [
        `Gurpreet in Ludhiana received Rs. 8 lakh from a maturing insurance policy at 50. She wants to use it for retirement at 60. At an illustrated 10 percent, Rs. 8 lakh grows to about ${Rs(lump(800000, 10, 10))} in 10 years; at 7 percent, ${Rs(lump(800000, 7, 10))}.`,
        "Ten years is long enough for some equity but not for all of it. She put half in a hybrid fund and half in a balanced advantage fund, both of which adjust between equity and debt.",
        "She also added a SIP from her salary for the remaining ten years, because a lumpsum alone would not build the corpus she needs.",
        "Before investing, she checked that the policy's maturity amount was what she expected and that tax had been handled correctly on it. She kept the maturity letter with her retirement papers.",
      ],
      lesson: "A lumpsum and a SIP can work together: the lumpsum gets time, the SIP keeps adding.",
    },
    {
      title: "Two goals, one SIP",
      paragraphs: [
        "Faizan in Lucknow was running one Rs. 20,000 SIP in a flexi-cap fund for both a car in four years and retirement in 25. When the car date approached, the market fell and he had to sell units at a loss.",
        `He split the goals. For the car, about Rs. 6 lakh in four years, a recurring deposit or short-term debt fund at 7 percent needs ${Rs(sipNeeded(600000, 7, 4))} a month. The rest stays in equity for retirement, where a bad year in between does not matter.`,
        "Each goal now has its own SIP, its own fund type and its own date written beside it. He can see at a glance whether each is on track.",
      ],
      lesson: "Give each goal its own money and risk level. A shared SIP forces near goals to take long-goal risk.",
    },
    {
      title: "The tax-saving SIP that kept going",
      paragraphs: [
        "Naveen in Indore started an ELSS SIP of Rs. 12,500 a month in his first job, to use the Rs. 1.5 lakh deduction under the old tax regime. Each instalment is locked for three years.",
        "When he switched to the new tax regime, which does not allow the deduction, he wondered whether to stop. The fund itself had done well, and the lock-in, which had felt like a drawback, had kept him invested through two falls.",
        "He moved new SIPs to a flexi-cap fund without a lock-in, since the tax reason had gone, and left the ELSS units invested until they suited a goal. Instalments become free to redeem three years after each was made.",
      ],
      lesson: "Tax reasons for a product can disappear. Judge the investment on its own merits once they do.",
    },
    {
      title: "Retired and drawing down",
      paragraphs: [
        `Mr Pillai, 62, in Thiruvananthapuram has Rs. 40 lakh in a balanced fund and wants Rs. 25,000 a month. A systematic withdrawal plan pays that monthly by redeeming units.`,
        (() => {
          let b = 4000000;
          let m = 0;
          while (b > 0 && m < 600) {
            b = b * (1 + 8 / 1200) - 25000;
            m += 1;
          }
          return `At an illustrated 8 percent and a constant Rs. 25,000, the money would last about ${Math.floor(m / 12)} years. If he raises the withdrawal by 6 percent a year for inflation, it lasts much less, so he keeps a deposit ladder for the first three years of spending and adjusts withdrawals after bad years.`;
        })(),
        "Withdrawals are taxed only on the gain portion of each redemption, which in the early years is small. He keeps a simple sheet of each year's redemptions for his return.",
      ],
      lesson: "Drawing down needs the same caution as saving: a calm return assumption and a cash buffer for bad years.",
    },
    {
      title: "Chasing last year's best fund",
      paragraphs: [
        "Priyanka in Gurugram moved her SIP every year to the fund at the top of the previous year's return table. After five years her portfolio had underperformed a plain index fund.",
        "Funds that top one year's table often hold whatever was in fashion and rarely stay on top. Switching also triggered exit loads and short-term tax on units held less than a year.",
        "She consolidated into an index fund and one actively managed flexi-cap fund, and now reviews them once a year against their benchmarks, not against last year's winner.",
        "Her new rule: she will replace a fund only if it trails its benchmark for three years running, or if its mandate or costs change. That rule has not triggered once, and she spends far less time on her investments than before.",
      ],
      lesson: "Past one-year returns are a poor guide. Consistency, cost and fit matter more.",
    },
    {
      title: "A shopkeeper's uneven months",
      paragraphs: [
        "Mukesh runs a garment shop in Surat. Income is strong around festivals and weak in the monsoon. A fixed SIP bounced twice in slow months, and each bounce cost a bank charge.",
        "He set a small SIP of Rs. 5,000 that never bounces, and adds lumpsums after Diwali and the wedding season. Over a year his total is close to what a large SIP would have invested.",
        "He keeps a separate account for the shop's GST and stock purchases, so investment money is never borrowed for business, and business money never sits in a fund that might be down when the supplier needs paying.",
        "Each April he looks back at the year's total invested and compares it with his target. In a good year he invests a little extra in March; in a weak one he lets the total be lower and does not borrow to catch up.",
      ],
      lesson: "Match the method to the income. A small fixed SIP plus seasonal lumpsums suits uneven earnings.",
    },
    {
      title: "Inflation in the corner",
      paragraphs: [
        `Teresa in Goa saw a projection of Rs. 1 crore for her retirement in 25 years and felt she was done. Her daughter pointed out that at 6 percent inflation, Rs. 1 crore then buys what about ${Rs(real(10000000, 6, 25))} buys today.`,
        `Her current spending is Rs. 40,000 a month. In 25 years at 6 percent that becomes about ${Rs(lump(40000, 6, 25))} a month. A corpus of Rs. 1 crore would not last long at that rate.`,
        "She raised her SIP and began counting her PPF and EPF towards retirement too. The goal became an amount in today's rupees, converted each year, so it never looks smaller than it really is.",
        "She also realised that some spending will fall in retirement, such as commuting and work clothes, while health costs will rise. She now plans with her expected retirement budget rather than simply her current one.",
      ],
      lesson: "Always convert long projections into today's money before deciding whether they are enough.",
    },
    {
      title: "Starting late, at 45",
      paragraphs: [
        `Rajiv, 45, in Kolkata had no investments besides EPF. Fifteen years to retirement felt too short to bother. At an illustrated 10 percent, Rs. 30,000 a month for 15 years shows about ${Rs(sip(30000, 10, 15).value)}, from ${Rs(sip(30000, 10, 15).invested)} invested.`,
        "That is not the corpus he would have had starting at 30, but it is far better than nothing. He also planned to work two years longer if needed, which adds both contributions and growth while reducing the years the money must last.",
        "He chose a balanced mix rather than all equity, because a severe fall at 57 would hurt more than the extra return would help.",
        "He also cleared a car loan first, which freed Rs. 9,000 a month for the SIP. Paying off an expensive loan is itself a safe return equal to its interest rate.",
      ],
      lesson: "Late starters gain most from saving more, working a little longer, and keeping risk moderate.",
    },
    {
      title: "A couple who saved in deposits only",
      paragraphs: [
        `Dinesh and Lata in Varanasi had saved Rs. 25 lakh, all in fixed deposits at about 7 percent, for retirement 18 years away. After tax at 20 percent, the deposits earn about 5.6 percent, barely above inflation.`,
        `At 5.6 percent, Rs. 25 lakh grows to about ${Rs(lump(2500000, 5.6, 18))} in 18 years. In today's money at 6 percent inflation that is slightly less than they have now.`,
        `They moved half into a mix of index and hybrid funds over a year through a systematic transfer. At an illustrated 10 percent for that half and 5.6 percent for the rest, the total projects to about ${Rs(lump(1250000, 10, 18) + lump(1250000, 5.6, 18))}. They kept the deposit half for safety and for the early years of retirement.`,
      ],
      lesson: "Deposits are safe from falls but not from inflation and tax. Long goals need some growth assets.",
    },
    {
      title: "SIP for a parent's care",
      paragraphs: [
        `Swati in Pune expects to support her mother's medical costs more heavily in about eight years. She estimates Rs. 6 lakh in today's money for a reserve. At 8 percent healthcare inflation, that is about ${Rs(lump(600000, 8, 8))} in eight years.`,
        `At an illustrated 9 percent in a hybrid fund, the SIP needed is about ${Rs(sipNeeded(lump(600000, 8, 8), 9, 8))} a month.`,
        "She also bought a health insurance policy for her mother while she was still eligible at a reasonable premium. The SIP is for the costs insurance will not cover: co-payments, home nursing, and the months between claims.",
        "Her brother agreed to contribute a third each month. They set up the SIP in Swati's name with a shared note of who paid what, so the arrangement stays clear if either of their circumstances changes.",
      ],
      lesson: "Health costs rise faster than general prices. Insurance first, then a fund for the gaps.",
    },
    {
      title: "Using the yearly tax exemption",
      paragraphs: [
        "Ramya in Chennai has held an index fund for nine years with unrealised long-term gains of about Rs. 9 lakh. If she redeems it all for retirement in four years, she will pay 12.5 percent on everything above the Rs. 1.25 lakh exemption in that one year.",
        "Instead, each year she redeems units with about Rs. 1.25 lakh of gains and reinvests immediately in the same fund. The gain is exempt, and the reinvested units have a higher cost price. Over four years she lifts the cost of Rs. 5 lakh of gains tax-free.",
        "At 12.5 percent, that saves about Rs. 62,500 of tax at the final redemption, for a few minutes' work each March. She checks there is no exit load on old units and keeps the redemption and purchase on the same day to stay invested.",
      ],
      lesson: "The yearly long-term gains exemption is use-it-or-lose-it. Harvesting gains within it reduces future tax.",
    },
    {
      title: "Children's SIPs in their own names",
      paragraphs: [
        "The Mathew family in Kottayam started SIPs for each of their two children at birth, in the children's names with a parent as guardian. When the elder turned 18, the fund house required the account status to change from minor to major, with the child's own KYC and bank account.",
        "Until then, income from the investments had been clubbed with a parent's income for tax. After 18, the gains are the child's. The family had not known about the status change and found redemptions blocked until it was done.",
        `The SIPs had grown well: Rs. 3,000 a month for 18 years at an illustrated 11 percent shows about ${Rs(sip(3000, 11, 18).value)}. The children now know the money is for education and have agreed not to touch it for anything else.`,
      ],
      lesson: "Investments in a minor's name need a status change at 18. Plan the paperwork before the money is needed.",
    },
    {
      title: "A windfall and a family",
      paragraphs: [
        "Hamid in Bhopal sold an ancestral plot for Rs. 30 lakh, his share after the family settlement. Relatives suggested property, gold and a cousin's business.",
        "He wrote down his goals first: clear his home loan's remaining Rs. 8 lakh, add Rs. 4 lakh to the emergency fund, fund his daughter's education in six years, and add to retirement in 20 years. The money then had a job in each category before any product was chosen.",
        `He prepaid the loan, topped up the emergency fund, put Rs. 8 lakh in a hybrid fund for education, and moved the remaining Rs. 10 lakh into equity index funds over a year. At an illustrated 11 percent, that Rs. 10 lakh grows to about ${Rs(lump(1000000, 11, 20))} in 20 years.`,
      ],
      lesson: "Assign a windfall to goals before choosing products. Debt and emergencies first, then dated goals.",
    },
    {
      title: "An NRI's SIP back home",
      paragraphs: [
        "Sameer works in Dubai and wanted to invest in Indian equity funds for a home he plans to buy in Kochi in ten years. He completed KYC as a non-resident, linked his NRE account, and confirmed with each fund house that it accepted investors resident in the UAE.",
        `At an illustrated 11 percent, Rs. 40,000 a month for ten years shows about ${Rs(sip(40000, 11, 10).value)}. Because the goal is in rupees, investing in rupees avoids exchange-rate risk on the goal itself, though his savings are earned in dirhams.`,
        "He noted that tax on gains is deducted at source for non-residents, and that he may be able to claim relief under the tax treaty in his country of residence. He keeps the tax certificates from each fund house for both countries' records.",
        "When he moves back, he will update his residential status with every fund house so the right tax rules and bank accounts apply.",
      ],
      lesson: "Non-residents can invest through SIPs with the right KYC and account, but must track residency, tax deduction and fund-house restrictions.",
    },
    {
      title: "A SIP that outlived its goal",
      paragraphs: [
        "Pallavi in Chandigarh began a SIP twelve years ago for a wedding that, in the end, was small and paid from savings. The SIP kept running, now worth a sizeable sum with no goal attached.",
        "She thought about spending it on a car. Instead she wrote down her current goals and found the biggest gap was retirement, which she had been funding only through EPF. She re-labelled the SIP as retirement money and moved part of it each year into an index fund, using the yearly gains exemption.",
        "The lesson she took was not that the SIP had been wrong but that goals change and the labels must change with them. Money without a stated purpose tends to be spent on whatever comes along first.",
      ],
      lesson: "Review goals periodically. Give every investment a current purpose or it will drift towards spending.",
    },
    {
      title: "Two siblings, two temperaments",
      paragraphs: [
        "Asha and Vikram in Mysuru each began Rs. 10,000 SIPs in the same flexi-cap fund in the same month. Asha never looked at her statements except once a year. Vikram checked daily and stopped twice during falls, restarting each time after the market had already recovered.",
        "After ten years their invested amounts differed by only a few months of instalments, but Vikram's value was noticeably lower, because the months he skipped were the ones that would have bought the cheapest units.",
        "Vikram now has his SIP mandate set for five years with no alerts on his phone. He reviews in December, like his sister, and finds the investment much less stressful.",
      ],
      lesson: "The same fund can give different results to different investors. Behaviour, not the fund, made the difference.",
    },
  ],

  problemIntro: "Use the site's SIP, lumpsum and goal planner calculators, or the formulas shown. All rates are teaching rates.",

  problems: [
    {
      title: "Basic SIP value",
      q: ["Rs. 5,000 a month for 15 years at an illustrated 12 percent. What is the value, and how much is growth?"],
      steps: ["Monthly rate = 1 percent. 180 instalments, each added at the start of the month and grown for the month."],
      answer: `Value ${Rs(sip(5000, 12, 15).value)}; invested ${Rs(sip(5000, 12, 15).invested)}; growth ${Rs(sip(5000, 12, 15).gain)}.`,
    },
    {
      title: "Lumpsum value",
      q: ["Rs. 3 lakh invested once for 10 years at an illustrated 10 percent a year."],
      steps: ["Value = 3,00,000 × 1.10^10.", `1.10^10 = ${Math.pow(1.1, 10).toFixed(4)}.`],
      answer: `${Rs(lump(300000, 10, 10))}.`,
    },
    {
      title: "Rule of 72",
      q: ["Estimate how long money takes to double at 9 percent, and check it exactly."],
      steps: ["72 ÷ 9 = 8 years.", `Exact: log 2 ÷ log 1.09 = ${(Math.log(2) / Math.log(1.09)).toFixed(2)} years.`],
      answer: "About 8 years by the rule; 8.04 exactly.",
    },
    {
      title: "SIP needed for a target",
      q: ["How much a month for Rs. 25 lakh in 10 years at 11 percent?"],
      steps: ["Use SIP = target × i ÷ (((1 + i)^n − 1) × (1 + i)) with i = 11 ÷ 1200 and n = 120."],
      answer: `About ${Rs(sipNeeded(2500000, 11, 10))} a month.`,
    },
    {
      title: "Lumpsum needed today",
      q: ["How much must be invested once today to reach Rs. 25 lakh in 10 years at 11 percent?"],
      steps: ["Lumpsum = 25,00,000 ÷ 1.11^10."],
      answer: `About ${Rs(lumpNeeded(2500000, 11, 10))}.`,
    },
    {
      title: "Cost of a five-year delay",
      q: ["Rs. 10,000 a month at 12 percent until age 60. Compare starting at 30 with starting at 35."],
      steps: [`From 30: 30 years, value ${Rs(sip(10000, 12, 30).value)}.`, `From 35: 25 years, value ${Rs(sip(10000, 12, 25).value)}.`],
      answer: `The delay costs about ${Rs(sip(10000, 12, 30).value - sip(10000, 12, 25).value)}, while only ${Rs(600000)} less is invested.`,
    },
    {
      title: "Step-up effect",
      q: ["Rs. 8,000 a month for 20 years at 11 percent, flat versus a 10 percent yearly step-up."],
      steps: [`Flat: invested ${Rs(sip(8000, 11, 20).invested)}, value ${Rs(sip(8000, 11, 20).value)}.`, `Step-up: invested ${Rs(sip(8000, 11, 20, 10).invested)}, value ${Rs(sip(8000, 11, 20, 10).value)}.`],
      answer: `The step-up adds about ${Rs(sip(8000, 11, 20, 10).value - sip(8000, 11, 20).value)}.`,
    },
    {
      title: "Inflation-adjusted goal",
      q: ["A goal costs Rs. 8 lakh today and is 9 years away. At 6 percent inflation, what amount should you plan for?"],
      steps: ["Future cost = 8,00,000 × 1.06^9."],
      answer: `About ${Rs(lump(800000, 6, 9))}.`,
    },
    {
      title: "Real value of a projection",
      q: ["A projection shows Rs. 50 lakh in 15 years. What is that in today's money at 6 percent inflation?"],
      steps: ["Real value = 50,00,000 ÷ 1.06^15."],
      answer: `About ${Rs(real(5000000, 6, 15))}.`,
    },
    {
      title: "CAGR",
      q: ["A fund's NAV rose from 42 to 97 in 8 years. What is its compound annual growth rate?"],
      steps: ["CAGR = (97 ÷ 42)^(1/8) − 1."],
      answer: `About ${pct(cagr(42, 97, 8))} a year.`,
    },
    {
      title: "Units bought in a fall",
      q: ["A SIP of Rs. 10,000 buys units at NAV 50 one month and NAV 40 the next. How many units in total, and what is the average cost per unit?"],
      steps: ["10,000 ÷ 50 = 200 units; 10,000 ÷ 40 = 250 units.", "Total 450 units for Rs. 20,000.", "Average cost = 20,000 ÷ 450."],
      answer: "450 units at an average of Rs. 44.44, below the simple average NAV of 45. That is rupee-cost averaging.",
    },
    {
      title: "Expense ratio drag",
      q: ["Rs. 15,000 a month for 25 years: 11.5 percent versus 10.5 percent after costs. What is the difference?"],
      steps: [`At 11.5%: ${Rs(sip(15000, 11.5, 25).value)}.`, `At 10.5%: ${Rs(sip(15000, 10.5, 25).value)}.`],
      answer: `About ${Rs(sip(15000, 11.5, 25).value - sip(15000, 10.5, 25).value)}.`,
    },
    {
      title: "Long-term gains tax",
      q: ["You redeem equity fund units held over a year with a gain of Rs. 3,00,000, and have no other equity gains this year. What is the tax at current rates, before cess?"],
      steps: ["The first Rs. 1,25,000 of long-term gains is exempt.", "Taxable = 1,75,000.", "Tax at 12.5% = 21,875."],
      answer: "Rs. 21,875, plus any surcharge and 4 percent cess. Spreading redemptions across years can use the exemption more than once.",
    },
    {
      title: "Short-term gains tax",
      q: ["Units of an equity fund held 8 months are sold at a gain of Rs. 40,000. What is the tax, before cess?"],
      steps: ["Held under 12 months: short-term.", "Rate 20 percent."],
      answer: "Rs. 8,000, plus cess. Waiting past 12 months would make the gain long-term and, within the yearly exemption, untaxed.",
    },
    {
      title: "Exit load",
      q: ["You redeem Rs. 1,20,000 of units bought 7 months ago in a fund with a 1 percent exit load within one year. What is the load?"],
      steps: ["1 percent of the redemption value."],
      answer: "Rs. 1,200, deducted from the payout.",
    },
    {
      title: "SIP versus lumpsum, smooth returns",
      q: ["Rs. 6 lakh now versus Rs. 10,000 a month for 5 years, both at 10 percent. Which is larger at the end of 5 years?"],
      steps: [`Lumpsum: ${Rs(lump(600000, 10, 5))}.`, `SIP: ${Rs(sip(10000, 10, 5).value)}.`],
      answer: "The lumpsum, because every rupee is invested longer. In real markets the order of returns could change that.",
    },
    {
      title: "Sequence of returns",
      q: ["Using Path A and Path B from the chapter, why does the lumpsum end at the same value on both paths but the SIP does not?"],
      steps: ["A lumpsum is multiplied by every year's growth factor once; multiplication is the same in any order.", "A SIP adds money over time, so late years act on a larger balance. Good late years help it more."],
      answer: `The SIP ends at ${Rs(goodEarly.bal)} on A and ${Rs(goodLate.bal)} on B; the lumpsum is the same on both.`,
    },
    {
      title: "Systematic withdrawal",
      q: ["Rs. 30 lakh at an illustrated 7 percent, withdrawing Rs. 20,000 a month. How long does it last?"],
      steps: ["Each month: grow by 7/12 percent, then subtract 20,000, until the balance runs out."],
      answer: (() => {
        let b = 3000000;
        let m = 0;
        while (b > 0 && m < 1200) {
          b = b * (1 + 7 / 1200) - 20000;
          m += 1;
        }
        return `About ${Math.floor(m / 12)} years ${m % 12} months.`;
      })(),
    },
    {
      title: "Goal with an existing amount",
      q: ["You need Rs. 30 lakh in 8 years and already have Rs. 5 lakh invested. At 10 percent, what monthly SIP closes the gap?"],
      steps: [`Rs. 5 lakh grows to ${Rs(lump(500000, 10, 8))}.`, `Gap = 30,00,000 − ${inr(lump(500000, 10, 8))} = ${Rs(3000000 - lump(500000, 10, 8))}.`, "SIP for the gap over 96 months."],
      answer: `About ${Rs(sipNeeded(3000000 - lump(500000, 10, 8), 10, 8))} a month.`,
    },
    {
      title: "Growth overtakes contributions",
      q: ["For Rs. 10,000 a month at 12 percent, in which year does the value first exceed twice the amount invested?"],
      steps: ["Check the yearly table: value ÷ invested."],
      answer: (() => {
        const r = sip(10000, 12, 30).rows.find(([, i, v]) => v >= 2 * i);
        return r ? `Year ${r[0]}, when ${Rs(r[1])} invested shows ${Rs(r[2])}.` : "Not within 30 years.";
      })(),
    },
    {
      title: "Required return",
      q: ["You can invest Rs. 15,000 a month for 12 years and need Rs. 40 lakh. What return is required?"],
      steps: ["Try rates until the SIP value reaches 40 lakh: at 9% and 10% and so on."],
      answer: (() => {
        let lo = 0.1;
        let hi = 30;
        for (let k = 0; k < 60; k++) {
          const mid = (lo + hi) / 2;
          if (sip(15000, mid, 12).value < 4000000) lo = mid;
          else hi = mid;
        }
        return `About ${pct(hi)} a year. If that seems high, invest more or extend the date.`;
      })(),
    },
    {
      title: "Stopping for a year",
      q: ["Rs. 10,000 a month at 12 percent for 20 years, but with no instalments in year 6. How much less is the final value?"],
      steps: ["Compute the full SIP, and a version with zero contributions in months 61 to 72."],
      answer: (() => {
        const i = 0.01;
        let b = 0;
        for (let m = 1; m <= 240; m++) b = (b + (m > 60 && m <= 72 ? 0 : 10000)) * (1 + i);
        return `About ${Rs(ex10k20.value - b)} less, from skipping Rs. 1.2 lakh of instalments.`;
      })(),
    },
    {
      title: "Recurring deposit comparison",
      q: ["A recurring deposit pays 7 percent with quarterly compounding. A short-term debt fund is illustrated at 7 percent too. Why might the outcomes differ?"],
      steps: ["The deposit's rate is fixed for the term; the fund's return varies.", "Deposit interest is taxed every year as it accrues; fund gains are taxed at slab rates when you redeem.", "The fund can be redeemed early without a penalty after any exit load period; the deposit may charge one."],
      answer: "Fixed versus variable return, different timing of tax, and different exit rules.",
    },
    {
      title: "Retirement corpus from spending",
      q: ["Spending is Rs. 50,000 a month today; retirement is in 20 years; inflation 6 percent. Using a 25-times-annual-spending rule, what corpus is needed?"],
      steps: [`Monthly spending in 20 years = ${Rs(lump(50000, 6, 20))}.`, `Annual = ${Rs(lump(50000, 6, 20) * 12)}.`, "× 25."],
      answer: `About ${Rs(lump(50000, 6, 20) * 12 * 25)}. The rule is a rough guide, not a guarantee.`,
    },
    {
      title: "SIP for that corpus",
      q: ["What monthly SIP at 11 percent over 20 years reaches the corpus from Problem 24?"],
      steps: ["Use the SIP-needed formula with the corpus as the target."],
      answer: `About ${Rs(sipNeeded(lump(50000, 6, 20) * 12 * 25, 11, 20))} a month, less whatever EPF, PPF and NPS will contribute.`,
    },
    {
      title: "Real return",
      q: ["A fund returns 11 percent in a year when inflation is 6 percent. What is the real return?"],
      steps: ["Real return = (1.11 ÷ 1.06) − 1."],
      answer: `About ${pct((1.11 / 1.06 - 1) * 100)}, slightly less than the simple difference of 5 percent.`,
    },
    {
      title: "Average cost after three months",
      q: ["A Rs. 6,000 monthly SIP buys at NAVs of 30, 24 and 36. Find total units and average cost per unit."],
      steps: ["6,000 ÷ 30 = 200; 6,000 ÷ 24 = 250; 6,000 ÷ 36 = 166.67.", "Total = 616.67 units for Rs. 18,000.", "Average = 18,000 ÷ 616.67."],
      answer: "616.67 units at about Rs. 29.19, below the simple average NAV of 30.",
    },
    {
      title: "Value after a fall",
      q: ["A portfolio of Rs. 12 lakh falls 25 percent. What return is needed to get back to Rs. 12 lakh?"],
      steps: ["After the fall: 9 lakh.", "Needed: 12 ÷ 9 − 1 = 33.3 percent."],
      answer: "33.3 percent. Losses need larger gains to recover, which is why near goals should avoid big falls.",
    },
    {
      title: "Glide path amounts",
      q: ["With Rs. 40 lakh for retirement five years away, using the 45 percent equity midpoint from the chapter's table, how much is in equity and how much in debt?"],
      steps: ["Equity 45% of 40 lakh = 18 lakh.", "Debt 55% = 22 lakh."],
      answer: "Rs. 18 lakh in equity and Rs. 22 lakh in debt and deposits.",
    },
    {
      title: "Rebalancing",
      q: ["A target of 60 percent equity and 40 percent debt drifts after a good year to Rs. 7.2 lakh equity and Rs. 3.8 lakh debt. What switch restores the target?"],
      steps: ["Total = 11 lakh. Target equity = 6.6 lakh.", "Move 0.6 lakh from equity to debt."],
      answer: "Move Rs. 60,000 from equity to debt, watching for exit loads and tax.",
    },
    {
      title: "Monthly withdrawals from a lumpsum",
      q: ["What monthly withdrawal can Rs. 50 lakh support for 25 years at an illustrated 7 percent, running to zero?"],
      steps: ["This is the EMI formula with the corpus as the loan: W = P × i × (1+i)^n ÷ ((1+i)^n − 1), i = 7/1200, n = 300."],
      answer: (() => { const i = 7 / 1200; const n = 300; const w = (5000000 * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1); return `About ${Rs(w)} a month, flat. Rising withdrawals for inflation would need a larger corpus.`; })(),
    },
    {
      title: "Two SIPs for two goals",
      q: ["Goal A: Rs. 5 lakh in 3 years at 7 percent. Goal B: Rs. 50 lakh in 18 years at 11 percent. What are the two SIPs?"],
      steps: [`A: ${Rs(sipNeeded(500000, 7, 3))}.`, `B: ${Rs(sipNeeded(5000000, 11, 18))}.`],
      answer: `${Rs(sipNeeded(500000, 7, 3))} and ${Rs(sipNeeded(5000000, 11, 18))} a month.`,
    },
    {
      title: "Value of an extra year",
      q: ["Rs. 20,000 a month at 11 percent. How much does the 25th year add compared with stopping after 24 years?"],
      steps: [`After 24 years: ${Rs(sip(20000, 11, 24).value)}.`, `After 25 years: ${Rs(sip(20000, 11, 25).value)}.`],
      answer: `About ${Rs(sip(20000, 11, 25).value - sip(20000, 11, 24).value)}, of which only Rs. 2.4 lakh is new money.`,
    },
    {
      title: "Comparing deposit and fund after tax",
      q: ["Rs. 5 lakh for 7 years. A deposit at 7 percent taxed yearly at 30 percent, or a debt fund at 7 percent taxed at 30 percent only at redemption. Which ends higher?"],
      steps: ["Deposit grows at 7 × 0.7 = 4.9 percent after tax each year.", `Deposit: ${Rs(lump(500000, 4.9, 7))}.`, `Fund: grows to ${Rs(lump(500000, 7, 7))}; gain ${Rs(lump(500000, 7, 7) - 500000)} taxed at 30%; net ${Rs(500000 + (lump(500000, 7, 7) - 500000) * 0.7)}.`],
      answer: "The fund ends slightly higher because tax is deferred to the end, though its return is not fixed.",
    },
    {
      title: "Three-bucket sizing",
      q: ["A retiree spends Rs. 6 lakh a year. Size bucket one at 2 years and bucket two at 5 years of spending, ignoring inflation for simplicity."],
      steps: ["Bucket one = 2 × 6 = 12 lakh.", "Bucket two = 5 × 6 = 30 lakh.", "The rest of the corpus goes to bucket three."],
      answer: "Rs. 12 lakh and Rs. 30 lakh; the remainder in growth assets.",
    },
    {
      title: "Withdrawal rate",
      q: ["A corpus of Rs. 1.2 crore and a first-year withdrawal of Rs. 4.8 lakh. What is the withdrawal rate, and is it cautious by the chapter's guide?"],
      steps: ["4.8 ÷ 120 = 0.04."],
      answer: "4 percent, above the 3 to 3.5 percent many Indian planners suggest for a long retirement.",
    },
    {
      title: "Healthcare inflation",
      q: ["A medical reserve of Rs. 4 lakh today, needed in 12 years, at 8 percent healthcare inflation."],
      steps: ["4,00,000 × 1.08^12."],
      answer: `About ${Rs(lump(400000, 8, 12))}.`,
    },
    {
      title: "Gain harvesting saving",
      q: ["You harvest Rs. 1.25 lakh of long-term gains tax-free each year for 5 years. How much tax does that avoid at a final redemption taxed at 12.5 percent?"],
      steps: ["Gains lifted = 5 × 1.25 = 6.25 lakh.", "Tax avoided = 6.25 lakh × 12.5%."],
      answer: "About Rs. 78,125, before cess, if the gains would otherwise have been taxable in one year.",
    },
    {
      title: "Monthly SIP from a yearly target",
      q: ["You want to invest Rs. 2.4 lakh this year. Compare one SIP of Rs. 20,000 a month with a lumpsum in April, at an illustrated 10 percent, measured at the year's end."],
      steps: [`SIP: ${Rs(sip(20000, 10, 1).value)}.`, `Lumpsum: ${Rs(240000 * Math.pow(1 + 10 / 1200, 12))} (monthly compounding for a year).`],
      answer: "The lumpsum ends a little higher with steady returns; the SIP spreads the timing risk. The difference over one year is small.",
    },
    {
      title: "How much is enough for a goal already",
      q: ["You have Rs. 9 lakh for a goal of Rs. 15 lakh in 6 years. At 8 percent, do you need any SIP?"],
      steps: [`Rs. 9 lakh grows to ${Rs(lump(900000, 8, 6))}.`],
      answer: lump(900000, 8, 6) >= 1500000 ? "No; the existing amount reaches the goal at 8 percent." : `Yes, about ${Rs(sipNeeded(1500000 - lump(900000, 8, 6), 8, 6))} a month to close the gap.`,
    },
    {
      title: "Value of starting a step-up later",
      q: ["Rs. 10,000 a month at 11 percent for 20 years. Compare a 10 percent step-up from year 1 with a 10 percent step-up starting only in year 6."],
      steps: ["From year 1: use the step-up SIP directly.", "From year 6: five years flat, then the step-up on the remaining fifteen."],
      answer: (() => {
        const a = sip(10000, 11, 20, 10).value;
        const i = 11 / 1200;
        let b = 0;
        let p = 10000;
        for (let m = 1; m <= 240; m++) {
          b = (b + p) * (1 + i);
          if (m % 12 === 0 && m >= 60) p *= 1.1;
        }
        return `${Rs(a)} against ${Rs(b)}; the five-year delay in stepping up costs about ${Rs(a - b)}.`;
      })(),
    },
    {
      title: "Required SIP if returns are lower",
      q: ["A goal of Rs. 30 lakh in 15 years was planned at 12 percent. If returns turn out to be 9 percent, how much higher must the SIP be?"],
      steps: [`At 12%: ${Rs(sipNeeded(3000000, 12, 15))}.`, `At 9%: ${Rs(sipNeeded(3000000, 9, 15))}.`],
      answer: `About ${Rs(sipNeeded(3000000, 9, 15) - sipNeeded(3000000, 12, 15))} more a month, which is why cautious assumptions are safer.`,
    },
    {
      title: "Lumpsum versus SIP for a 20-year goal",
      q: ["Rs. 10 lakh now, or Rs. 10 lakh spread as Rs. 50,000 a month over 20 months, each at 11 percent and measured at year 20."],
      steps: [`Lumpsum: ${Rs(lump(1000000, 11, 20))}.`, "Spread: each instalment invested later, so slightly less time in the market."],
      answer: (() => {
        const i = 11 / 1200;
        let b = 0;
        for (let m = 1; m <= 240; m++) b = (b + (m <= 20 ? 50000 : 0)) * (1 + i);
        return `About ${Rs(b)} for the spread version, a difference of ${Rs(lump(1000000, 11, 20) - b)} with steady returns. Over 20 years the start method matters little.`;
      })(),
    },
    {
      title: "Units after a merger",
      q: ["You hold 1,000 units of Fund A at NAV 50. It merges into Fund B at NAV 80. How many units of B do you receive?"],
      steps: ["Value held = 1,000 × 50 = 50,000.", "Units of B = 50,000 ÷ 80."],
      answer: "625 units. The value is unchanged; only the unit count changes.",
    },
    {
      title: "Comparing two funds fairly",
      q: ["Fund X returned 18 percent last year and 9 percent a year over five years. Fund Y returned 11 percent last year and 13 percent a year over five years. Both have the same benchmark, which returned 12 percent a year over five years. Which has the better record?"],
      steps: ["Compare over the longer period against the benchmark.", "X trailed by 3 points a year; Y beat it by 1 point."],
      answer: "Fund Y, despite the lower one-year figure.",
    },
  ],

  exercises: {
    warmup: [
      { q: "What does SIP stand for?", a: "Systematic investment plan: investing a fixed amount at regular intervals, usually monthly." },
      { q: "Using the rule of 72, how long does money take to double at 12 percent?", a: "About 6 years." },
      { q: "What is rupee-cost averaging?", a: "Buying with a fixed amount regularly, so more units are bought when prices are low and fewer when high." },
      { q: "Is an illustrated 12 percent return guaranteed?", a: "No. It is a planning assumption. Real returns vary from year to year and over periods." },
      { q: "Which is cheaper to hold: the direct or the regular plan of the same fund?", a: "The direct plan, because it does not include distributor commission in its expense ratio." },
      { q: "How long is the lock-in for each ELSS instalment?", a: "Three years from the date of that instalment." },
      { q: "Name one fund type suitable for money needed in six months.", a: "A liquid fund, an overnight fund, or a short-term deposit." },
      { q: "What does a falling NAV mean for a SIP investor?", a: "Each instalment buys more units." },
      { q: "What is a consolidated account statement?", a: "A statement listing all your mutual fund holdings across fund houses under your PAN." },
    ],
    practice: [
      { q: "Rs. 2,000 a month for 25 years at 12 percent. Value?", a: `${Rs(sip(2000, 12, 25).value)}, from ${Rs(sip(2000, 12, 25).invested)} invested.` },
      { q: "Rs. 1 lakh invested once for 20 years at 11 percent. Value?", a: `${Rs(lump(100000, 11, 20))}.` },
      { q: "A goal of Rs. 12 lakh in 6 years at 8 percent. Monthly SIP?", a: `${Rs(sipNeeded(1200000, 8, 6))}.` },
      { q: "What is Rs. 1 crore in 30 years worth today at 6 percent inflation?", a: `About ${Rs(real(10000000, 6, 30))}.` },
      { q: "A fund doubled in 7 years. What was its CAGR?", a: `About ${pct(cagr(1, 2, 7))}.` },
      { q: "You hold units bought 14 months ago with a gain of Rs. 90,000 and no other gains. Tax due?", a: "None, because long-term equity gains up to Rs. 1.25 lakh a year are exempt." },
      { q: "A fund returned 14 percent while its benchmark returned 16 percent over five years. What do you conclude?", a: "It trailed its benchmark by about 2 points a year. If that continues, an index fund tracking the benchmark would have been better." },
      { q: "Rs. 20,000 a month at 10 percent for 20 years. Value in today's money at 6 percent inflation?", a: `Nominal ${Rs(sip(20000, 10, 20).value)}; real about ${Rs(real(sip(20000, 10, 20).value, 6, 20))}.` },
      { q: "A portfolio fell 40 percent. What gain restores it?", a: "About 66.7 percent." },
      { q: "A goal needs Rs. 8 lakh in 4 years. You have Rs. 2 lakh. At 7 percent, what SIP closes the gap?", a: `Rs. 2 lakh grows to ${Rs(lump(200000, 7, 4))}; the SIP for the rest is about ${Rs(sipNeeded(800000 - lump(200000, 7, 4), 7, 4))}.` },
      { q: "List four items on a fund factsheet you would check before investing.", a: "Returns against the benchmark over 3 and 5 years, expense ratio of the direct plan, top holdings and sector weights, and the riskometer level." },
    ],
    stretch: [
      { q: "Compare Rs. 5,000 a month from age 25 to 35 then stopping, with Rs. 5,000 a month from 35 to 60, both at 12 percent and measured at 60.", a: (() => { const early = sip(5000, 12, 10).value * Math.pow(1.01, 300); const late = sip(5000, 12, 25).value; return `Early ten years then left to grow: about ${Rs(early)}. Twenty-five years from 35: about ${Rs(late)}. The early saver invested Rs. 6 lakh, the late saver Rs. 15 lakh.`; })() },
      { q: "You need Rs. 15 lakh in 3 years. Explain why an equity SIP is a poor fit, using what could happen in year 3.", a: "Equity funds can fall 20 to 30 percent in a year. A fall in year 3 would cut the amount just when it is needed, with no time to recover. Debt funds or deposits fit short goals." },
      { q: "A SIP of Rs. 10,000 at 11 percent for 15 years with a 5 percent step-up. Value and total invested?", a: `Value ${Rs(sip(10000, 11, 15, 5).value)}; invested ${Rs(sip(10000, 11, 15, 5).invested)}.` },
      { q: "A friend's fund returned 45 percent last year. Give three reasons not to switch to it.", a: "One year's return says little about the next; the fund may be concentrated in a sector that has peaked; switching may trigger exit loads and short-term capital gains tax." },
      { q: "Work out how much a 1.2 percentage point higher expense ratio costs on Rs. 25,000 a month over 20 years at a gross 12 percent.", a: `${Rs(sip(25000, 12, 20).value - sip(25000, 10.8, 20).value)}.` },
      { q: "Design a glide path for a goal 10 years away, moving from 80 percent equity to 20 percent at the goal date in steps.", a: "For example: 80% until year 7, then 60% at 3 years to go, 40% at 2 years, 20% at 1 year, moving monthly within each step." },
      { q: "Compare holding 8 equity funds with 3. What are the costs of the larger number?", a: "More overlap, more statements to track, harder rebalancing, and often accidental concentration in the same stocks, with no real gain in diversification." },
      { q: "A retiree has Rs. 80 lakh and spends Rs. 3 lakh a year. What is the withdrawal rate, and what does it suggest?", a: "3.75 percent. Slightly above the cautious 3 to 3.5 percent range; keep a cash bucket and be ready to trim spending after bad years." },
      { q: "Explain why a SIP into a debt fund might beat a recurring deposit after tax for a high-slab investor even at the same return.", a: "The deposit's interest is taxed every year as it accrues, reducing what compounds; the fund's gain is taxed only on redemption, so the full amount compounds until then." },
    ],
    challenge: [
      { q: "Build a plan for a 30-year-old with Rs. 40,000 to invest monthly, goals of a car in 3 years (Rs. 6 lakh), a down payment in 7 years (Rs. 20 lakh) and retirement.", a: `Car: debt fund or RD, about ${Rs(sipNeeded(600000, 7, 3))} a month at 7%. Down payment: hybrid or balanced, about ${Rs(sipNeeded(2000000, 9, 7))} at 9%. Remainder, about ${Rs(40000 - sipNeeded(600000, 7, 3) - sipNeeded(2000000, 9, 7))}, to equity for retirement, rising as the car goal ends.` },
      { q: "Argue whether a retired person should keep any money in equity funds.", a: "Yes, usually some: retirement can last 25 years or more, and inflation erodes fixed income. But the first several years of spending should be in safe instruments so a market fall does not force sales. The equity share is often modest and falls with age." },
      { q: "Explain to a sceptical parent why a SIP is not a guaranteed product, and why it is still worth considering.", a: "A SIP is a way of investing in a fund whose value moves with markets, so returns are not guaranteed and can be negative over short periods. Over long periods diversified equity has historically beaten inflation, and a SIP makes regular investing automatic." },
      { q: "Design a rule for when to move a goal's money from equity to debt.", a: "For example: three years before the goal, move a third; two years before, another third; one year before, the rest. Pause the moves only if the goal date changes." },
      { q: "Estimate the impact of continuing a SIP through a 30 percent fall in year 3 of a 15-year plan, versus stopping for two years.", a: "Continuing buys units about 30 percent cheaper for those months, which typically adds noticeably to the final value once prices recover. Stopping misses those purchases and two years of contributions, and the gap compounds for the remaining years." },
      { q: "Write a one-page investment policy for yourself: goals, fund types, SIP amounts, review dates and rules for switching.", a: "List each goal with amount, date and fund type; the SIP and step-up for each; a yearly review date; rules such as switching only after three years of trailing the benchmark; and the glide path for each goal's last three years." },
      { q: "A relative offers a scheme promising 3 percent a month, guaranteed. Using what you know about returns and regulation, explain your response.", a: "Three percent a month is over 42 percent a year, far above what any legitimate low-risk investment offers. Guarantees of high returns are a hallmark of fraud. Ask for the regulator's registration; if there is none, decline, and warn others." },
    ],
  },

  faqs: [
    {
      group: "SIP basics",
      items: [
        ["What is the minimum SIP amount?", "Many funds accept SIPs from Rs. 500 or even less a month, and some from Rs. 100. Starting small and stepping up is better than waiting until you can afford a large amount."],
        ["Which date is best for a SIP?", "A date just after your salary is credited, so the instalment is invested before you spend. Over long periods, the date within the month makes little difference to returns."],
        ["Can I change the SIP amount?", "Most fund houses let you add a step-up, or you can stop the old SIP and start a new one for a different amount. Plan increases for the month your income rises."],
        ["What happens if a SIP instalment bounces?", "The fund house skips that instalment; several consecutive failures may cancel the SIP. Your bank may charge a fee for the failed debit. Keep enough in the account on the SIP date."],
        ["Can I pause a SIP?", "Many fund houses allow a pause for a few months. It is better than cancelling during a temporary cash shortage, because restarting is easy and the habit continues."],
        ["Is a daily or weekly SIP better than monthly?", "Over long periods the difference is small. Monthly suits most people because it matches the salary cycle and is simpler to track."],
        ["Do SIPs guarantee returns?", "No. A SIP is a method of investing. The returns depend entirely on the fund, which can lose value, especially over short periods."],
        ["How many SIPs should I have?", "Enough to cover your goals and risk levels, usually two to four funds. More funds often overlap and add complexity without adding diversification."],
      ],
    },
    {
      group: "Lumpsum and timing",
      items: [
        ["Should I wait for a market fall before investing a lumpsum?", "Nobody can reliably time falls. Waiting often means missing rises. If the timing worries you, spread the sum over six to twelve months with a systematic transfer plan."],
        ["What is a systematic transfer plan?", "An instruction to move a fixed amount regularly from one fund, usually a liquid or debt fund, to another, usually an equity fund, within the same fund house."],
        ["Is a lumpsum better than a SIP?", "With steady returns, money invested earlier grows more, so a lumpsum wins. With real ups and downs, it depends on the sequence of returns. For salaried savers, SIP is simply how money becomes available."],
        ["What should I do with a bonus?", "First top up the emergency fund and clear expensive debt. Then invest towards a goal: as a lumpsum if the horizon is long and you are comfortable, or spread over a few months if not."],
        ["Does investing during a market high ruin returns?", "Over 10 years or more, the entry point matters much less than staying invested. Over 2 or 3 years it can matter a lot, which is why near goals belong in calmer funds."],
        ["What is the difference between NAV and price?", "NAV is the value of one unit of a mutual fund, calculated each business day. You buy and sell units at that day's NAV, subject to cut-off times."],
      ],
    },
    {
      group: "Goals and planning",
      items: [
        ["What return should I assume for planning?", "A cautious one: around 10 to 12 percent for long-term diversified equity, 6 to 7 percent for debt and deposits. Lower assumptions protect the goal; higher ones lead to under-saving."],
        ["How do I include inflation in a goal?", "Grow today's cost by an inflation rate for the number of years: future cost = cost today × (1 + inflation)^years. Use a higher rate for education and healthcare."],
        ["Should each goal have a separate SIP?", "Yes, ideally. Different dates need different risk levels, and separate SIPs make it easy to see whether each goal is on track."],
        ["When should I move money out of equity for a goal?", "Start two to three years before the goal, moving a part each month or quarter into debt or deposits. Never leave a near-term goal fully exposed to a market fall."],
        ["How much do I need for retirement?", "A rough guide is 25 to 30 times your annual spending at retirement, in the money of that time. Count EPF, PPF and NPS along with mutual funds."],
        ["Is the goal planner's result exact?", "It is exact for the steady rate you enter, which real markets never deliver. Treat it as a plan to revisit each year, not a forecast."],
        ["What if I cannot afford the SIP the planner suggests?", "Start with what you can, add a yearly step-up, extend the date if possible, or reduce the goal. A partial plan that runs is better than a perfect one that never starts."],
      ],
    },
    {
      group: "Costs and taxes",
      items: [
        ["What is an expense ratio?", "The yearly fee a fund charges, as a percentage of assets, deducted from the NAV. It covers management and running costs, and distributor commission in regular plans."],
        ["Direct or regular plan?", "Direct plans cost less. Regular plans pay a distributor. If you get ongoing advice that you value, the regular plan's extra cost may be worth it; if not, the direct plan is the same portfolio for less."],
        ["How are equity fund gains taxed?", "Units held over 12 months: long-term gains above Rs. 1.25 lakh a year are taxed at 12.5 percent. Under 12 months: short-term gains at 20 percent. Rates apply from 23 July 2024; check for later changes."],
        ["How are debt fund gains taxed?", "For units bought on or after 1 April 2023, gains are generally taxed at your income slab rate regardless of holding period."],
        ["How is each SIP instalment taxed?", "Each instalment is a separate purchase with its own date. When you redeem, the oldest units are sold first, and each unit's holding period decides whether its gain is short or long term."],
        ["What is an exit load?", "A charge, often 1 percent, if you redeem within a set period after buying, usually a year for equity funds. It is deducted from the redemption amount."],
        ["Do I pay tax on SIP returns every year?", "No. Gains are taxed when you redeem units, not while they grow. Dividends from IDCW options are taxed in the year received at your slab rate."],
        ["Is there stamp duty on mutual fund purchases?", "Yes, a small stamp duty of 0.005 percent applies to purchases, including each SIP instalment, deducted before units are allotted."],
      ],
    },
    {
      group: "Behaviour and risk",
      items: [
        ["My SIP shows a loss. Should I stop?", "Short-term losses are normal in equity funds. Continuing buys more units at lower prices. Stop only if your goal or risk tolerance has changed, and then change the fund mix rather than abandoning saving."],
        ["How often should I check my funds?", "Once or twice a year is enough for long goals: check the amount against the plan, compare each fund with its benchmark, and raise the SIP if income has grown. Checking daily encourages reacting to noise."],
        ["What is a fund's riskometer?", "A label required by SEBI showing a scheme's risk level, from low to very high. Match it to the goal's date and your comfort with falls."],
        ["Are index funds better than active funds?", "Index funds track a market index at low cost. Many active funds fail to beat their index after costs over long periods. A mix, or index funds alone, both suit many investors."],
        ["Should I copy a friend's portfolio?", "Only if your goals, dates and tolerance for losses are the same, which is rare. Build around your own goals."],
        ["Is it safe to invest through apps?", "Use apps registered with SEBI or AMFI, and check that units are held in your name with the fund house or depository. Do not share OTPs or passwords with anyone offering to manage your account."],
        ["What if a fund manager changes?", "Review the fund's performance against its benchmark over the following year or two. A single change is not a reason to sell immediately."],
      ],
    },
    {
      group: "Practical matters",
      items: [
        ["What documents do I need to start a SIP?", "KYC is required: PAN, address proof and a photograph, usually completed online once. After that, a bank mandate for the auto-debit."],
        ["Should I add a nominee?", "Yes. Nomination makes transmission to your family much simpler. Since 2023, investors must either nominate or formally opt out."],
        ["Can I invest for my child?", "Yes, in the child's name with a parent as guardian, or in your own name earmarked for the child. Income from investments in a minor's name is generally clubbed with the parent's income for tax."],
        ["What happens to SIPs if I move abroad?", "NRIs can generally continue to invest subject to FEMA rules and the fund house's policy, with KYC and bank details updated. Some fund houses restrict investors in certain countries."],
      ],
    },
    {
      group: "Common situations",
      items: [
        ["Should I invest or repay my home loan?", "Prepaying earns your loan rate, risk-free and after tax. Investing may earn more over long periods but with risk. Many people do both: keep SIPs for long goals and prepay with bonuses."],
        ["I have a SIP and a credit card balance. Which first?", "Clear the card. Card interest at 36 to 42 percent a year is far higher than any reasonable expected return. Pause the SIP if needed until the card is clear."],
        ["Can I use a SIP as an emergency fund?", "Not an equity SIP, because it may be down when you need it. Keep emergency money in a savings account, sweep deposit or liquid fund."],
        ["Is gold a good SIP option?", "Gold can diversify a portfolio and has protected against currency falls, but it does not produce income and has had long flat periods. Many planners limit it to a small share."],
        ["Should I invest in international funds?", "They add diversification across economies and currencies. SEBI and RBI limits have at times stopped fresh investments in some schemes. Check availability and tax treatment before you start."],
        ["My employer offers a voluntary PF contribution. Should I use it instead of a SIP?", "Voluntary PF earns the EPF rate with tax benefits on contributions and interest within limits, with long lock-in. It suits the safe part of retirement savings; equity SIPs suit the growth part."],
        ["How do I consolidate many small SIPs?", "Stop new instalments in funds you do not want, start the SIP in the chosen funds, and redeem the old units gradually, timing redemptions to use the yearly long-term gains exemption and avoid exit loads."],
        ["What if the fund I hold is merged?", "SEBI rules require notice and an exit option without load when a scheme's fundamental attributes change. Review the merged fund's objective and costs, and decide whether it still fits."],
        ["Does a SIP need a demat account?", "No. Mutual fund units can be held directly with the fund house through a folio. A demat account is optional."],
        ["Are endowment policies a good way to save?", "They combine insurance with savings but have typically returned modest amounts after charges, with heavy costs for early surrender. A term policy plus separate investments usually gives more cover and more growth."],
        ["Should I surrender an old endowment policy?", "Check the surrender value against the projected maturity and how many premiums remain. If the early years' charges are already paid, continuing may be reasonable; if many years remain, compare with investing the premiums elsewhere."],
        ["How do I check if an adviser is registered?", "Investment advisers register with SEBI; mutual fund distributors hold an AMFI registration number. Both can be verified on the regulators' websites."],
        ["What is the difference between an adviser and a distributor?", "A SEBI-registered investment adviser charges you a fee and must act in your interest. A distributor earns commission from the products sold. Both can be useful; know which you are dealing with."],
        ["What is a SIP top-up and how is it different from a step-up?", "The terms are often used interchangeably for an automatic yearly increase in the SIP amount, by a fixed sum or percentage. Some fund houses also allow one-off additional purchases in the same folio, which are simply lumpsums."],
        ["Can I choose the day my SIP is debited in a short month?", "If you pick the 29th, 30th or 31st, fund houses usually debit on the last business day or the next one. Choosing a date between the 1st and the 28th avoids confusion."],
        ["Is there a penalty for cancelling a SIP?", "No penalty for stopping. Units already bought stay invested. Exit loads apply only if you redeem units within the load period."],
        ["Can I switch from a regular plan to a direct plan of the same fund?", "Yes, but it counts as a redemption and a fresh purchase, so exit loads and capital gains tax may apply. Many investors stop new instalments in the regular plan and start a direct SIP, switching old units gradually."],
        ["What is the cut-off time for SIP purchases?", "For most equity and debt funds, money must reach the fund by the cut-off, typically 3 pm on a business day, for that day's NAV. SIP debits are usually processed so that you get the NAV of the debit date or the next business day."],
        ["How do I track all my funds in one place?", "A consolidated account statement from the registrars lists all your mutual fund holdings across fund houses linked to your PAN. Request it periodically."],
      ],
    },
    {
      group: "Retirement and withdrawals",
      items: [
        ["What is a safe withdrawal rate in India?", "There is no guaranteed safe rate. Many planners suggest starting around 3 to 3.5 percent of the corpus a year, adjusted for inflation, because Indian inflation has been higher than in the studies behind the well-known 4 percent rule."],
        ["Is an SWP better than a fixed deposit for monthly income?", "An SWP from a fund is taxed only on the gain portion of each withdrawal, which can be efficient, but the fund's value can fall. A deposit pays fixed, fully taxable interest. Many retirees use both."],
        ["Should retirees hold equity?", "Usually some, because retirement can last decades and inflation erodes fixed income. Keep the next few years of spending safe so you never have to sell equity in a fall."],
        ["How do I make retirement money last if I live to 95?", "Plan for a long life: a cautious withdrawal rate, a growth portion, guaranteed income for essentials, and health insurance that continues for life."],
        ["Should I buy an annuity with part of my corpus?", "An annuity removes the risk of outliving your money for the portion you buy, at the cost of the lump sum and usually low rates. It suits people who want certainty for essential spending."],
        ["What happens to my SWP when the market falls?", "Each fixed withdrawal sells more units at lower prices, which depletes the fund faster. That is why a cash bucket for bad years helps: pause or reduce the SWP and spend from the bucket."],
        ["How should I plan for medical costs in retirement?", "Keep a health insurance policy that continues for life, add a top-up policy if needed, and keep a separate reserve for costs insurance does not cover."],
        ["Can I continue SIPs after retiring?", "Yes, if you have surplus income, such as rent or pension. Many retirees stop SIPs and instead rebalance between buckets."],
      ],
    },
    {
      group: "Doubts people rarely say aloud",
      items: [
        ["I do not understand markets. Should I still invest?", "You do not need to predict markets to use a diversified index fund through a SIP. Understanding the goal, the time horizon and the fact that values will fall sometimes is enough to begin."],
        ["Is it too late to start at 50?", "No. Ten to fifteen years is still long enough for a sensible mix to grow, and retirement itself may last decades. Save more, keep risk moderate, and consider working a little longer."],
        ["What if the fund house shuts down?", "Mutual fund assets are held by an independent custodian, separate from the fund house's own money. If an AMC exits, schemes are usually transferred to another AMC or wound up with proceeds returned to investors."],
        ["Is it wrong to spend investment gains on a holiday?", "Not if the holiday was a goal you planned for. It is a problem only when spending takes money meant for retirement or education. Give the holiday its own small SIP."],
        ["My partner wants to invest in property instead. How do we decide?", "Compare on the same terms: expected return after costs and tax, how easily you can sell, how much you must borrow, and how it fits your goals. Property and funds can coexist; the danger is putting everything in one illiquid asset."],
      ],
    },
  ],

  glossary: [
    ["AMC", "Asset management company: the firm that runs a mutual fund's schemes."],
    ["Asset allocation", "How money is split between equity, debt, gold and cash."],
    ["Balanced advantage fund", "A hybrid fund that changes its equity share according to a model, aiming for smoother returns."],
    ["Benchmark", "An index a fund's performance is compared against."],
    ["CAGR", "Compound annual growth rate: the steady yearly rate that turns a start value into an end value over a period."],
    ["Debt fund", "A mutual fund that invests mainly in bonds and money-market instruments."],
    ["Direct plan", "A version of a fund bought directly from the AMC, without distributor commission."],
    ["ELSS", "Equity-linked savings scheme: an equity fund with a three-year lock-in that qualified for a deduction under the old tax regime."],
    ["Equity fund", "A mutual fund that invests mainly in shares."],
    ["Exit load", "A charge for redeeming units within a set period after purchase."],
    ["Expense ratio", "The yearly cost of running a fund, as a percentage of its assets."],
    ["Flexi-cap fund", "An equity fund free to invest in companies of any size."],
    ["Goal-based investing", "Planning investments around specific goals, each with an amount, date and suitable risk."],
    ["Hybrid fund", "A fund that holds both equity and debt."],
    ["IDCW", "Income distribution cum capital withdrawal: the option under which a fund pays out distributions, formerly called the dividend option."],
    ["Index fund", "A fund that tracks a market index, usually at low cost."],
    ["Inflation", "The general rise in prices over time, which reduces what money can buy."],
    ["KYC", "Know your customer: the identity verification needed before investing."],
    ["Liquid fund", "A debt fund that invests in very short-term instruments, used to park money briefly."],
    ["Lumpsum", "A single, one-time investment."],
    ["NAV", "Net asset value: the value of one unit of a fund."],
    ["Real return", "Return after allowing for inflation."],
    ["Regular plan", "A version of a fund bought through a distributor, with commission included in its expense ratio."],
    ["Riskometer", "A SEBI-mandated label showing a fund's risk level."],
    ["Rupee-cost averaging", "Buying with a fixed amount at intervals, so more units are bought when prices are low."],
    ["Sequence of returns", "The order in which good and bad years occur, which affects SIPs and withdrawals."],
    ["SIP", "Systematic investment plan: regular fixed investments into a fund."],
    ["Step-up SIP", "A SIP whose amount increases by a set percentage or sum each year."],
    ["STP", "Systematic transfer plan: regular transfers from one fund to another."],
    ["SWP", "Systematic withdrawal plan: regular redemptions from a fund to provide income."],
    ["Annuity", "A contract with an insurer that pays a regular income, often for life, in exchange for a lump sum."],
    ["Bucket strategy", "Dividing retirement money into near, middle and long-term pots with different risk levels."],
    ["Consolidated account statement", "A statement listing all mutual fund holdings across fund houses linked to a PAN."],
    ["Folio", "An account number with a fund house under which your units in its schemes are held."],
    ["Gain harvesting", "Redeeming and reinvesting units to use the yearly tax exemption on long-term gains."],
    ["Glide path", "A planned shift from growth assets to safer ones as a goal approaches."],
    ["Rebalancing", "Moving money between asset types to restore a target mix."],
    ["Withdrawal rate", "The share of a corpus drawn as income each year."],
  ],

  references: [
    { title: "Mutual fund investor education", who: "Association of Mutual Funds in India", where: "amfiindia.com, Investor Corner", note: "Explanations of fund types, SIPs, NAV and how to verify registered distributors." },
    { title: "SEBI (Mutual Funds) Regulations and circulars", who: "Securities and Exchange Board of India", where: "sebi.gov.in", note: "Rules on scheme categories, the riskometer, expense ratios and investor protection." },
    { title: "SEBI investor website", who: "Securities and Exchange Board of India", where: "investor.sebi.gov.in", note: "Plain-language material for investors and the SCORES complaints system." },
    { title: "Income-tax rules on capital gains", who: "Income Tax Department, Government of India", where: "incometaxindia.gov.in", note: "Current rates and exemptions for equity and debt fund gains." },
    { title: "Union Budget 2024-25, Finance (No. 2) Act, 2024", who: "Ministry of Finance, Government of India", where: "indiabudget.gov.in", note: "Introduced the 12.5 percent long-term and 20 percent short-term rates and the Rs. 1.25 lakh exemption from 23 July 2024." },
    { title: "Scheme Information Document and Key Information Memorandum", who: "Each mutual fund", where: "The AMC's website", note: "The authoritative source for a scheme's objective, risk, costs, exit load and lock-in." },
    { title: "Consumer Price Index releases", who: "Ministry of Statistics and Programme Implementation", where: "mospi.gov.in", note: "Official inflation figures to choose a realistic inflation assumption." },
  ],
};
