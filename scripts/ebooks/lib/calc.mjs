// Original worked examples for the FreeToolsPro books. Numbers follow the same
// formulas as the on-site calculators. Narrative around them is original.
import { computeTax, emiOf } from "../../../src/tools/calcs.js";

export function inr(n) {
  const v = Math.round(Number(n) || 0);
  const sign = v < 0 ? "-" : "";
  const s = String(Math.abs(v));
  if (s.length <= 3) return sign + s;
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  const parts = [];
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2));
    rest = rest.slice(0, -2);
  }
  if (rest) parts.unshift(rest);
  return sign + parts.join(",") + "," + last3;
}

export function inr2(n) {
  const v = Math.round(Number(n) * 100) / 100;
  const [w, f] = v.toFixed(2).split(".");
  return `${inr(Number(w))}.${f}`;
}

function amortYearly(P, annualRate, months, emi) {
  const r = annualRate / 1200;
  let bal = P;
  const rows = [];
  let yP = 0;
  let yI = 0;
  let year = 1;
  for (let m = 1; m <= months; m++) {
    const interest = bal * r;
    const principal = Math.min(emi - interest, bal);
    yP += principal;
    yI += interest;
    bal = Math.max(0, bal - principal);
    if (m % 12 === 0 || m === months) {
      rows.push([String(year), inr(yP), inr(yI), inr(bal)]);
      yP = 0;
      yI = 0;
      year += 1;
    }
  }
  return rows;
}

export function loanStats(principal, rate, years, extra = 0) {
  const months = Math.round(years * 12);
  const emi = emiOf(principal, rate, months);
  const interest = emi * months - principal;
  let bal = principal;
  const r = rate / 1200;
  let cross = 0;
  for (let m = 1; m <= months; m++) {
    const iPart = bal * r;
    const pPart = Math.min(emi - iPart, bal);
    if (!cross && pPart > iPart) cross = m;
    bal = Math.max(0, bal - pPart);
  }
  let saved = 0;
  let extraMonths = months;
  if (extra > 0) {
    bal = principal;
    let paid = 0;
    let m = 0;
    const cap = months * 2;
    while (bal > 1 && m < cap) {
      m += 1;
      const iPart = bal * r;
      const pay = Math.min(emi + extra, bal + iPart);
      const pPart = pay - iPart;
      paid += pay;
      bal = Math.max(0, bal - pPart);
    }
    extraMonths = m;
    saved = emi * months - paid;
  }
  return {
    months,
    emi,
    interest,
    total: emi * months,
    cross,
    extraMonths,
    saved,
    rows: amortYearly(principal, rate, months, emi),
  };
}

export function loanChapter(scenarios) {
  const openers = [
    (s) => `${s.who}. ${s.want} The figure in front of them is Rs. ${inr(s.loan)} at ${s.rate} percent a year for ${s.years} years.`,
    (s) => `${s.who}. ${s.want} They asked the lender for Rs. ${inr(s.loan)}. The rate on that conversation was ${s.rate} percent, and the tenure was ${s.years} years.`,
    (s) => `Put the people before the product. ${s.who}. ${s.want} The loan they are testing is Rs. ${inr(s.loan)}, ${s.rate} percent, ${s.years} years.`,
    (s) => `${s.want} That is ${s.who}. The quote uses Rs. ${inr(s.loan)} at ${s.rate} percent over ${s.years} years.`,
  ];
  const sections = scenarios.map((s, idx) => {
    const st = loanStats(s.loan, s.rate, s.years, s.extra || 0);
    const who = String(s.who).split(/[ ,]/)[0];
    const paras = [
      openers[idx % openers.length](s),
      `The EMI is Rs. ${inr(st.emi)}. Stay on that payment and the rate, and the loan ends in ${st.months} months. The payments add up to Rs. ${inr(st.total)}. Interest is Rs. ${inr(st.interest)}, about ${Math.round((st.interest / s.loan) * 100)} percent of the amount borrowed.`,
      st.cross
        ? [
            `On ${who}'s loan, month ${st.cross} is the first month when more of the EMI goes to principal than to interest. Before that, the balance falls slowly. After it, the same EMI starts to bite into what you owe.`,
            `For the first ${st.cross - 1} months of ${who}'s loan, interest takes the larger share of every EMI. Only from month ${st.cross} does principal take over, which is why the balance seems stuck for years.`,
            `The turning point for ${who} is month ${st.cross}, about ${Math.round(st.cross / 12)} years in. Every prepayment before that point removes principal that would otherwise have attracted interest for most of the term.`,
          ][idx % 3]
        : `On this shorter tenure the principal part of the EMI is large from the first year, because there are fewer months for interest to occupy.`,
    ];
    if (s.fee) {
      paras.push(
        [
          `A processing fee of Rs. ${inr(s.fee)} never shows up inside the EMI. It leaves the bank account at the start. Spread over the first year it is about Rs. ${inr(s.fee / 12)} a month that a headline EMI comparison will miss.`,
          `${who} also pays a processing fee of Rs. ${inr(s.fee)} on day one. It is not in the EMI, so add it when comparing lenders: over the first year it is worth about Rs. ${inr(s.fee / 12)} a month.`,
          `The Rs. ${inr(s.fee)} processing fee is a cost ${who} pays before the first EMI. Compared with the monthly payment of Rs. ${inr(st.emi)}, it is about ${Math.max(1, Math.round((s.fee / st.emi) * 30))} days of EMI.`,
        ][idx % 3]
      );
    }
    if (s.extra) {
      paras.push(
        `Paying Rs. ${inr(s.extra)} extra every month, on top of the EMI, finishes the loan in ${st.extraMonths} months instead of ${st.months}. The interest saved is about Rs. ${inr(st.saved)}, if the rate does not change and the lender reduces the tenure rather than the EMI.`
      );
    }
    paras.push(s.note);
    const r = s.rate / 1200;
    let bal = s.loan;
    const monthly = [];
    for (let m = 1; m <= 12; m++) {
      const interest = bal * r;
      const principal = Math.min(st.emi - interest, bal);
      bal = Math.max(0, bal - principal);
      monthly.push([String(m), inr(principal), inr(interest), inr(Math.max(0, bal))]);
    }
    return {
      heading: s.title,
      paragraphs: paras,
      tables: [
        {
          caption: "Year by year, if the rate stays where it started. Figures are rounded to the rupee.",
          headers: ["Year", "Principal paid", "Interest paid", "Balance"],
          rows: st.rows,
        },
        {
          caption: "The first twelve months. On a long loan, interest still takes most of each EMI.",
          headers: ["Month", "Principal", "Interest", "Balance"],
          rows: monthly,
        },
      ],
    };
  });
  return { title: "Worked files", sections };
}

export function sipRows(monthly, rate, years, step = 0) {
  const i = rate / 1200;
  let bal = 0;
  let invested = 0;
  let p = monthly;
  const rows = [];
  for (let m = 1; m <= years * 12; m++) {
    bal = (bal + p) * (1 + i);
    invested += p;
    if (m % 12 === 0) {
      rows.push([String(m / 12), inr(invested), inr(bal), inr(bal - invested)]);
      p = p * (1 + step / 100);
    }
  }
  return { invested, value: bal, rows };
}

export function lumpsum(amount, rate, years) {
  const value = amount * Math.pow(1 + rate / 100, years);
  return { invested: amount, value, gain: value - amount };
}

export function ppfBalance(yearly, rate, years) {
  let bal = 0;
  const rows = [];
  for (let y = 1; y <= years; y++) {
    bal = (bal + yearly) * (1 + rate / 100);
    rows.push([String(y), inr(yearly * y), inr(bal)]);
  }
  return { value: bal, rows };
}

export function fdMaturity(principal, rate, years) {
  const value = principal * Math.pow(1 + rate / 400, 4 * years);
  return { value, interest: value - principal };
}

export function cardPayoff(balance, apr, payment) {
  const r = apr / 1200;
  let bal = balance;
  let months = 0;
  let interest = 0;
  const rows = [];
  while (bal > 1 && months < 360) {
    months += 1;
    const iPart = bal * r;
    interest += iPart;
    const pPart = Math.min(Math.max(payment - iPart, 0), bal);
    if (pPart <= 0) return { never: true, months, interest, rows };
    bal = bal - pPart;
    if (months <= 18 || months % 6 === 0) rows.push([String(months), inr(iPart), inr(pPart), inr(bal)]);
  }
  return { never: false, months, interest, rows };
}

export function gstSplit(amount, rate, inclusive, inter) {
  const base = inclusive ? (amount * 100) / (100 + rate) : amount;
  const gst = (base * rate) / 100;
  return { base, gst, total: base + gst, half: gst / 2, inter };
}

export function taxStory(income, regime, deductions = 0) {
  const t = computeTax({ income, regime, deductions, salaried: true, age: "below60" });
  return t;
}

export function cgpa(subjects) {
  const credits = subjects.reduce((s, x) => s + x.credits, 0);
  const points = subjects.reduce((s, x) => s + x.credits * x.grade, 0);
  return { credits, cgpa: credits ? points / credits : 0 };
}

export function attendance(held, attended, needPct, remaining) {
  const now = held ? (attended / held) * 100 : 0;
  const must = Math.ceil(((needPct / 100) * (held + remaining) - attended));
  const canMiss = remaining - Math.max(0, must);
  return { now, must: Math.max(0, must), canMiss };
}

// From 1 April 2026 the 50% limit covers eight cities: Delhi, Mumbai, Kolkata,
// Chennai, Bengaluru, Hyderabad, Pune and Ahmedabad. "metro" means one of these.
export const HRA_50_CITIES = ["Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru", "Hyderabad", "Pune", "Ahmedabad"];

export function hraExempt({ basicMonthly, hraMonthly, rentMonthly, metro }) {
  const salary = basicMonthly * 12;
  const hra = hraMonthly * 12;
  const rentMinus = Math.max(0, rentMonthly * 12 - 0.1 * salary);
  const cap = (metro ? 0.5 : 0.4) * salary;
  const exempt = Math.min(hra, rentMinus, cap);
  return { hra, rentMinus, cap, exempt };
}

export const GRATUITY_TAX_FREE = 2000000;
export const EPF_WAGE_CEILING = 25000;

export function gratuity(basicDa, years) {
  return Math.round((basicDa * 15 * years) / 26);
}
