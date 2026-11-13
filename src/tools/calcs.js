// Calculator definitions. Each entry: { inputs: [...], compute(values) => result }.
// Input types: money, number, percent, years, select, date, toggle. `show(v)` hides an input conditionally.
// Result: { primary:{label,value,fmt,sub?}, rows:[{label,value,fmt,strong?}], split?:[{label,value}],
//           table?:{title,cols,rows,fmts}, note?, error? }

// ---------- shared maths ----------
export function emiOf(P, annualRate, months) {
  const r = annualRate / 1200;
  if (months <= 0) return 0;
  if (r === 0) return P / months;
  const f = Math.pow(1 + r, months);
  return (P * r * f) / (f - 1);
}

function amortYearly(P, annualRate, months, emi) {
  const r = annualRate / 1200;
  let bal = P;
  const rows = [];
  let yP = 0,
    yI = 0;
  for (let m = 1; m <= months && bal > 0.005; m++) {
    const interest = bal * r;
    const principal = Math.min(emi - interest, bal);
    bal -= principal;
    yP += principal;
    yI += interest;
    if (m % 12 === 0 || m === months || bal <= 0.005) {
      rows.push([Math.ceil(m / 12), yP, yI, Math.max(bal, 0)]);
      yP = 0;
      yI = 0;
    }
  }
  return rows;
}

function loanResult(P, rate, years, extraRows = []) {
  if (!(P > 0)) return { error: "Enter a loan amount greater than zero." };
  const n = Math.round(years * 12);
  const emi = emiOf(P, rate, n);
  const total = emi * n;
  const interest = total - P;
  return {
    primary: { label: "Monthly EMI", value: emi, fmt: "inr" },
    rows: [
      { label: "Loan amount", value: P, fmt: "inr" },
      { label: "Total interest", value: interest, fmt: "inr" },
      { label: "Total of all EMIs", value: total, fmt: "inr", strong: true },
      ...extraRows,
    ],
    split: [
      { label: "Principal", value: P },
      { label: "Interest", value: interest },
    ],
    table: {
      title: "Year-by-year schedule",
      cols: ["Year", "Principal paid", "Interest paid", "Balance"],
      fmts: ["int", "inr", "inr", "inr"],
      rows: amortYearly(P, rate, n, emi),
    },
  };
}

/** Future value of a monthly SIP (instalment at start of month) with optional yearly step-up. */
function sipSim(monthly, annualReturn, years, stepUpPct = 0) {
  const i = annualReturn / 1200;
  let bal = 0,
    invested = 0,
    p = monthly;
  const rows = [];
  for (let m = 1; m <= Math.round(years * 12); m++) {
    bal = (bal + p) * (1 + i);
    invested += p;
    if (m % 12 === 0) {
      rows.push([m / 12, invested, bal]);
      p = p * (1 + stepUpPct / 100);
    }
  }
  return { value: bal, invested, rows };
}

/** Monthly SIP needed to reach `target` in `years` at `annualReturn`. */
function sipNeeded(target, annualReturn, years) {
  const n = Math.round(years * 12);
  const i = annualReturn / 1200;
  if (target <= 0) return 0;
  if (i === 0) return target / n;
  return (target * i) / ((Math.pow(1 + i, n) - 1) * (1 + i));
}

// ---------- income tax, FY 2026-27 ----------
const NEW_SLABS = [
  [400000, 0],
  [800000, 5],
  [1200000, 10],
  [1600000, 15],
  [2000000, 20],
  [2400000, 25],
  [Infinity, 30],
];
function oldSlabs(age) {
  const exempt = age === "80+" ? 500000 : age === "60-80" ? 300000 : 250000;
  const s = [[exempt, 0]];
  if (exempt < 500000) s.push([500000, 5]);
  s.push([1000000, 20], [Infinity, 30]);
  return s;
}

export function computeTax({ income, regime, age = "below60", deductions = 0, salaried = true }) {
  const std = salaried ? (regime === "new" ? 75000 : 50000) : 0;
  const ded = regime === "old" ? Math.max(0, deductions) : 0;
  const taxable = Math.max(0, income - std - ded);
  const slabs = regime === "new" ? NEW_SLABS : oldSlabs(age);
  let prev = 0,
    tax = 0;
  const breakdown = [];
  for (const [upto, rate] of slabs) {
    const part = Math.max(0, Math.min(taxable, upto) - prev);
    const t = (part * rate) / 100;
    breakdown.push([`${rangeLabel(prev, upto)}`, rate, part, t]);
    tax += t;
    prev = upto;
    if (taxable <= upto) break;
  }
  const slabTax = tax;
  let rebate = 0;
  if (regime === "new") {
    if (taxable <= 1200000) rebate = Math.min(tax, 60000);
    else if (tax > taxable - 1200000) rebate = tax - (taxable - 1200000); // marginal relief
  } else if (taxable <= 500000) rebate = Math.min(tax, 12500);
  tax -= rebate;
  let sRate = 0;
  if (taxable > 50000000) sRate = regime === "new" ? 25 : 37;
  else if (taxable > 20000000) sRate = 25;
  else if (taxable > 10000000) sRate = 15;
  else if (taxable > 5000000) sRate = 10;
  const surcharge = (tax * sRate) / 100;
  const cess = (tax + surcharge) * 0.04;
  const total = tax + surcharge + cess;
  return { std, ded, taxable, slabTax, rebate, surcharge, sRate, cess, total, breakdown };
}
function rangeLabel(a, b) {
  const l = (x) => `₹${x / 100000}L`;
  return b === Infinity ? `Above ${l(a)}` : `${l(a)} – ${l(b)}`;
}

// ---------- dates ----------
function parseDate(s) {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}
function ymd(a, b) {
  // whole years, months, days from a to b (a <= b)
  let y = b.getUTCFullYear() - a.getUTCFullYear();
  let m = b.getUTCMonth() - a.getUTCMonth();
  let d = b.getUTCDate() - a.getUTCDate();
  if (d < 0) {
    m -= 1;
    d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate();
  }
  if (m < 0) {
    y -= 1;
    m += 12;
  }
  return { y, m, d };
}
const DAY = 86400000;
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function longDate(dt) {
  return dt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
function addMonthsClamped(dt, months) {
  const y = dt.getUTCFullYear();
  const m = dt.getUTCMonth() + months;
  const target = new Date(Date.UTC(y, m, 1));
  const last = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
  target.setUTCDate(Math.min(dt.getUTCDate(), last));
  return target;
}

// ---------- input helpers ----------
const money = (id, label, def, min, max, step = 1000) => ({ id, label, type: "money", def, min, max, step });
const rate = (id, label, def, min = 1, max = 20, step = 0.05) => ({ id, label, type: "percent", def, min, max, step });
const years = (id, label, def, min = 1, max = 30, step = 1) => ({ id, label, type: "years", def, min, max, step });
const numIn = (id, label, def, min, max, step = 1, unit = "") => ({ id, label, type: "number", def, min, max, step, unit });
const select = (id, label, def, options) => ({ id, label, type: "select", def, options });
const toggle = (id, label, def = false) => ({ id, label, type: "toggle", def });
const dateIn = (id, label, def) => ({ id, label, type: "date", def });

const REGIME = select("regime", "Tax regime", "new", [
  ["new", "New regime (default)"],
  ["old", "Old regime"],
]);
const AGE = select("age", "Age", "below60", [
  ["below60", "Below 60"],
  ["60-80", "60 to 79"],
  ["80+", "80 and above"],
]);

// ---------- calculators ----------
export const CALCS = {
  "emi-calculator": {
    inputs: [money("P", "Loan amount", 1000000, 10000, 20000000, 10000), rate("r", "Interest rate (p.a.)", 9), years("y", "Tenure", 5)],
    compute: (v) => loanResult(v.P, v.r, v.y),
  },
  "home-loan-calculator": {
    inputs: [
      money("price", "Property price", 7500000, 500000, 100000000, 50000),
      money("down", "Down payment", 1500000, 0, 50000000, 50000),
      rate("r", "Interest rate (p.a.)", 8.5, 6, 15),
      years("y", "Tenure", 20, 1, 30),
    ],
    compute: (v) => {
      const P = v.price - v.down;
      if (P <= 0) return { error: "The down payment covers the whole price; there is nothing to borrow." };
      const res = loanResult(P, v.r, v.y);
      const ltv = (P / v.price) * 100;
      res.rows.push({ label: "Total cost incl. down payment", value: v.down + res.rows[2].value, fmt: "inr" });
      res.rows.push({ label: "Loan-to-value", value: ltv, fmt: "pct" });
      if (ltv > 90) res.note = "Banks usually lend at most 75–90% of the property value, so you may need a larger down payment.";
      return res;
    },
  },
  "car-loan-calculator": {
    inputs: [
      money("price", "On-road price", 1000000, 100000, 10000000, 10000),
      money("down", "Down payment", 200000, 0, 5000000, 10000),
      rate("r", "Interest rate (p.a.)", 9.5, 6, 18),
      years("y", "Tenure", 5, 1, 8),
    ],
    compute: (v) => {
      const P = v.price - v.down;
      if (P <= 0) return { error: "The down payment covers the whole price; there is nothing to borrow." };
      const res = loanResult(P, v.r, v.y);
      res.rows.push({ label: "Total cost of the car", value: v.down + res.rows[2].value, fmt: "inr" });
      return res;
    },
  },
  "personal-loan-calculator": {
    inputs: [
      money("P", "Loan amount", 500000, 10000, 5000000, 10000),
      rate("r", "Interest rate (p.a.)", 11.5, 8, 30),
      years("y", "Tenure", 3, 1, 7),
      rate("fee", "Processing fee", 2, 0, 5, 0.25),
    ],
    compute: (v) => {
      const res = loanResult(v.P, v.r, v.y);
      if (res.error) return res;
      const n = Math.round(v.y * 12);
      const emi = res.primary.value;
      const fee = v.P * (v.fee / 100) * 1.18;
      // Effective rate: solve the monthly rate where EMIs repay the amount actually received.
      const net = v.P - fee;
      let lo = 0,
        hi = 1;
      for (let k = 0; k < 80; k++) {
        const mid = (lo + hi) / 2;
        const pv = (emi * (1 - Math.pow(1 + mid, -n))) / mid;
        if (pv > net) lo = mid;
        else hi = mid;
      }
      res.rows.splice(2, 0, { label: "Processing fee + 18% GST", value: fee, fmt: "inr" });
      res.rows.push({ label: "Amount you receive", value: net, fmt: "inr" });
      res.rows.push({ label: "Effective annual rate incl. fee", value: lo * 1200, fmt: "pct" });
      return res;
    },
  },
  "loan-prepayment-calculator": {
    inputs: [
      money("P", "Loan amount", 3000000, 100000, 50000000, 50000),
      rate("r", "Interest rate (p.a.)", 8.5, 5, 18),
      years("y", "Tenure", 20, 1, 30),
      money("pre", "Prepayment amount", 200000, 0, 10000000, 10000),
      numIn("at", "Prepay after", 24, 1, 360, 1, "months"),
      select("mode", "After prepaying", "tenure", [
        ["tenure", "Keep EMI, reduce tenure"],
        ["emi", "Keep tenure, reduce EMI"],
      ]),
    ],
    compute: (v) => {
      const n = Math.round(v.y * 12);
      const r = v.r / 1200;
      const emi = emiOf(v.P, v.r, n);
      const baseInterest = emi * n - v.P;
      if (v.at >= n) return { error: "Prepayment month must be before the end of the tenure." };
      let bal = v.P,
        paidInterest = 0;
      for (let m = 1; m <= v.at; m++) {
        const i = bal * r;
        paidInterest += i;
        bal -= emi - i;
      }
      const pre = Math.min(v.pre, bal);
      bal -= pre;
      let months = v.at,
        newEmi = emi;
      if (v.mode === "emi") {
        newEmi = emiOf(bal, v.r, n - v.at);
        paidInterest += newEmi * (n - v.at) - bal;
        months = n;
      } else {
        while (bal > 0.01 && months < 1000) {
          const i = bal * r;
          paidInterest += i;
          bal -= Math.min(emi - i, bal);
          months++;
        }
      }
      const saved = baseInterest - paidInterest;
      return {
        primary: { label: "Interest saved", value: saved, fmt: "inr" },
        rows: [
          { label: "Current EMI", value: emi, fmt: "inr" },
          v.mode === "emi"
            ? { label: "New EMI after prepayment", value: newEmi, fmt: "inr", strong: true }
            : { label: "Tenure reduced by", value: n - months, fmt: "months", strong: true },
          { label: "Interest without prepayment", value: baseInterest, fmt: "inr" },
          { label: "Interest with prepayment", value: paidInterest, fmt: "inr" },
        ],
        split: [
          { label: "Interest paid", value: paidInterest },
          { label: "Interest saved", value: Math.max(saved, 0) },
        ],
      };
    },
  },
  "loan-eligibility-calculator": {
    inputs: [
      money("inc", "Net monthly income", 80000, 10000, 2000000, 1000),
      money("emis", "Existing EMIs per month", 5000, 0, 500000, 500),
      rate("r", "Interest rate (p.a.)", 8.5, 6, 20),
      years("y", "Tenure", 20, 1, 30),
      rate("foir", "Max share of income for EMIs (FOIR)", 50, 30, 70, 5),
    ],
    compute: (v) => {
      const maxEmi = (v.inc * v.foir) / 100 - v.emis;
      if (maxEmi <= 0) return { error: "Your existing EMIs already use up the allowed share of income." };
      const n = Math.round(v.y * 12);
      const i = v.r / 1200;
      const loan = (maxEmi * (Math.pow(1 + i, n) - 1)) / (i * Math.pow(1 + i, n));
      return {
        primary: { label: "Estimated eligible loan", value: loan, fmt: "inr" },
        rows: [
          { label: "Maximum EMI you can take", value: maxEmi, fmt: "inr", strong: true },
          { label: "Total interest at this amount", value: maxEmi * n - loan, fmt: "inr" },
        ],
        note: "Lenders also look at your credit score, age, employer and the property's value, so the final sanction can differ.",
      };
    },
  },
  "sip-calculator": {
    inputs: [
      money("p", "Monthly investment", 10000, 500, 500000, 500),
      rate("r", "Expected return (p.a.)", 12, 1, 30, 0.5),
      years("y", "Time period", 10, 1, 40),
      rate("step", "Yearly step-up", 0, 0, 50, 1),
    ],
    compute: (v) => {
      const s = sipSim(v.p, v.r, v.y, v.step);
      return {
        primary: { label: "Estimated value", value: s.value, fmt: "inr" },
        rows: [
          { label: "Amount invested", value: s.invested, fmt: "inr" },
          { label: "Estimated returns", value: s.value - s.invested, fmt: "inr", strong: true },
        ],
        split: [
          { label: "Invested", value: s.invested },
          { label: "Returns", value: s.value - s.invested },
        ],
        table: { title: "Growth by year", cols: ["Year", "Invested", "Value"], fmts: ["int", "inr", "inr"], rows: s.rows },
      };
    },
  },
  "lumpsum-calculator": {
    inputs: [money("P", "Investment", 100000, 1000, 100000000, 1000), rate("r", "Expected return (p.a.)", 12, 1, 30, 0.5), years("y", "Time period", 10, 1, 40)],
    compute: (v) => {
      const rows = [];
      for (let y = 1; y <= v.y; y++) rows.push([y, v.P * Math.pow(1 + v.r / 100, y)]);
      const fv = v.P * Math.pow(1 + v.r / 100, v.y);
      return {
        primary: { label: "Estimated value", value: fv, fmt: "inr" },
        rows: [
          { label: "Amount invested", value: v.P, fmt: "inr" },
          { label: "Estimated returns", value: fv - v.P, fmt: "inr", strong: true },
        ],
        split: [
          { label: "Invested", value: v.P },
          { label: "Returns", value: fv - v.P },
        ],
        table: { title: "Growth by year", cols: ["Year", "Value"], fmts: ["int", "inr"], rows },
      };
    },
  },
  "swp-calculator": {
    inputs: [
      money("P", "Total investment", 5000000, 100000, 100000000, 50000),
      money("w", "Monthly withdrawal", 30000, 500, 1000000, 500),
      rate("r", "Expected return (p.a.)", 8, 1, 20, 0.5),
      years("y", "Time period", 20, 1, 40),
    ],
    compute: (v) => {
      const i = v.r / 1200;
      let bal = v.P,
        withdrawn = 0,
        ranOut = 0;
      const rows = [];
      for (let m = 1; m <= v.y * 12; m++) {
        bal = bal * (1 + i);
        const take = Math.min(v.w, bal);
        bal -= take;
        withdrawn += take;
        if (bal <= 0 && !ranOut) ranOut = m;
        if (m % 12 === 0) rows.push([m / 12, withdrawn, bal]);
        if (bal <= 0) break;
      }
      return {
        primary: { label: ranOut ? "Money runs out after" : "Balance at the end", value: ranOut || bal, fmt: ranOut ? "months" : "inr" },
        rows: [
          { label: "Total withdrawn", value: withdrawn, fmt: "inr", strong: true },
          { label: "Monthly return on starting amount", value: v.P * i, fmt: "inr" },
        ],
        note: ranOut
          ? "Withdrawals are larger than what the balance earns, so it shrinks to zero. Lower the withdrawal or invest more to make it last."
          : undefined,
        table: { title: "Balance by year", cols: ["Year", "Withdrawn so far", "Balance"], fmts: ["int", "inr", "inr"], rows },
      };
    },
  },
  "ppf-calculator": {
    inputs: [money("d", "Yearly deposit", 150000, 500, 150000, 500), rate("r", "Interest rate", 7.1, 5, 10, 0.05), years("y", "Duration", 15, 15, 50, 5)],
    compute: (v) => {
      let bal = 0;
      const rows = [];
      for (let y = 1; y <= v.y; y++) {
        bal = (bal + v.d) * (1 + v.r / 100);
        rows.push([y, v.d * y, bal]);
      }
      const inv = v.d * v.y;
      return {
        primary: { label: "Maturity value", value: bal, fmt: "inr" },
        rows: [
          { label: "Total deposited", value: inv, fmt: "inr" },
          { label: "Total interest (tax-free)", value: bal - inv, fmt: "inr", strong: true },
        ],
        split: [
          { label: "Deposited", value: inv },
          { label: "Interest", value: bal - inv },
        ],
        table: { title: "Balance by year", cols: ["Year", "Deposited", "Balance"], fmts: ["int", "inr", "inr"], rows },
        note: "Assumes each year's deposit is made by 5 April so it earns interest for the full year.",
      };
    },
  },
  "fd-calculator": {
    inputs: [
      money("P", "Deposit amount", 100000, 1000, 100000000, 1000),
      rate("r", "Interest rate (p.a.)", 7, 1, 12, 0.05),
      years("y", "Tenure", 5, 1, 10),
      select("n", "Compounding", "4", [
        ["4", "Quarterly (most banks)"],
        ["12", "Monthly"],
        ["2", "Half-yearly"],
        ["1", "Yearly"],
      ]),
    ],
    compute: (v) => {
      const n = Number(v.n);
      const A = v.P * Math.pow(1 + v.r / 100 / n, n * v.y);
      return {
        primary: { label: "Maturity value", value: A, fmt: "inr" },
        rows: [
          { label: "Amount deposited", value: v.P, fmt: "inr" },
          { label: "Interest earned", value: A - v.P, fmt: "inr", strong: true },
          { label: "Effective annual yield", value: (Math.pow(1 + v.r / 100 / n, n) - 1) * 100, fmt: "pct" },
        ],
        split: [
          { label: "Deposit", value: v.P },
          { label: "Interest", value: A - v.P },
        ],
      };
    },
  },
  "rd-calculator": {
    inputs: [money("R", "Monthly deposit", 5000, 100, 1000000, 100), rate("r", "Interest rate (p.a.)", 7, 1, 12, 0.05), years("y", "Tenure", 5, 1, 10)],
    compute: (v) => {
      const N = Math.round(v.y * 12);
      let M = 0;
      for (let k = 1; k <= N; k++) M += v.R * Math.pow(1 + v.r / 400, (4 * k) / 12);
      const inv = v.R * N;
      return {
        primary: { label: "Maturity value", value: M, fmt: "inr" },
        rows: [
          { label: "Total deposited", value: inv, fmt: "inr" },
          { label: "Interest earned", value: M - inv, fmt: "inr", strong: true },
        ],
        split: [
          { label: "Deposited", value: inv },
          { label: "Interest", value: M - inv },
        ],
      };
    },
  },
  "compound-interest-calculator": {
    inputs: [
      money("P", "Principal", 100000, 0, 100000000, 1000),
      rate("r", "Interest rate (p.a.)", 8, 0, 30, 0.1),
      years("y", "Time period", 10, 1, 50),
      select("n", "Compounded", "12", [
        ["1", "Yearly"],
        ["2", "Half-yearly"],
        ["4", "Quarterly"],
        ["12", "Monthly"],
        ["365", "Daily"],
      ]),
      money("add", "Monthly addition", 0, 0, 1000000, 500),
    ],
    compute: (v) => {
      const n = Number(v.n);
      const mRate = Math.pow(1 + v.r / 100 / n, n / 12) - 1;
      let bal = v.P,
        inv = v.P;
      const rows = [];
      for (let m = 1; m <= v.y * 12; m++) {
        bal = bal * (1 + mRate) + v.add;
        inv += v.add;
        if (m % 12 === 0) rows.push([m / 12, inv, bal]);
      }
      return {
        primary: { label: "Final amount", value: bal, fmt: "inr" },
        rows: [
          { label: "Total invested", value: inv, fmt: "inr" },
          { label: "Compound interest", value: bal - inv, fmt: "inr", strong: true },
        ],
        split: [
          { label: "Invested", value: inv },
          { label: "Interest", value: bal - inv },
        ],
        table: { title: "Balance by year", cols: ["Year", "Invested", "Balance"], fmts: ["int", "inr", "inr"], rows },
      };
    },
  },
  "simple-interest-calculator": {
    inputs: [
      money("P", "Principal", 100000, 0, 100000000, 1000),
      rate("r", "Interest rate (p.a.)", 10, 0, 50, 0.1),
      numIn("t", "Time", 3, 0, 1000, 1),
      select("u", "Time in", "y", [
        ["y", "Years"],
        ["m", "Months"],
        ["d", "Days"],
      ]),
    ],
    compute: (v) => {
      const T = v.u === "y" ? v.t : v.u === "m" ? v.t / 12 : v.t / 365;
      const SI = (v.P * v.r * T) / 100;
      return {
        primary: { label: "Simple interest", value: SI, fmt: "inr" },
        rows: [
          { label: "Principal", value: v.P, fmt: "inr" },
          { label: "Total amount", value: v.P + SI, fmt: "inr", strong: true },
        ],
        split: [
          { label: "Principal", value: v.P },
          { label: "Interest", value: SI },
        ],
      };
    },
  },
  "inflation-calculator": {
    inputs: [money("c", "Cost today", 100000, 100, 100000000, 100), rate("i", "Inflation rate (p.a.)", 6, 0, 20, 0.1), years("y", "Years from now", 10, 1, 50)],
    compute: (v) => {
      const f = Math.pow(1 + v.i / 100, v.y);
      return {
        primary: { label: `Cost after ${v.y} years`, value: v.c * f, fmt: "inr" },
        rows: [
          { label: "Increase in cost", value: v.c * f - v.c, fmt: "inr" },
          { label: `What ₹${num0(v.c)} today will buy then`, value: v.c / f, fmt: "inr", strong: true },
          { label: "Loss of purchasing power", value: (1 - 1 / f) * 100, fmt: "pct" },
        ],
      };
    },
  },
  "goal-planner": {
    inputs: [
      money("g", "Goal cost today", 2000000, 10000, 100000000, 10000),
      years("y", "Years to goal", 10, 1, 40),
      rate("i", "Inflation (p.a.)", 6, 0, 15, 0.5),
      rate("r", "Expected return (p.a.)", 12, 1, 20, 0.5),
      money("s", "Savings already set aside", 0, 0, 100000000, 10000),
    ],
    compute: (v) => {
      const fv = v.g * Math.pow(1 + v.i / 100, v.y);
      const grown = v.s * Math.pow(1 + v.r / 100, v.y);
      const gap = Math.max(0, fv - grown);
      const sip = sipNeeded(gap, v.r, v.y);
      return {
        primary: { label: "Monthly SIP needed", value: sip, fmt: "inr" },
        rows: [
          { label: "Goal cost in future", value: fv, fmt: "inr", strong: true },
          { label: "Your savings will grow to", value: grown, fmt: "inr" },
          { label: "Amount still needed", value: gap, fmt: "inr" },
          { label: "Total you will invest", value: sip * v.y * 12, fmt: "inr" },
        ],
      };
    },
  },
  "retirement-planner": {
    inputs: [
      numIn("age", "Current age", 30, 18, 70, 1, "years"),
      numIn("ret", "Retirement age", 60, 35, 80, 1, "years"),
      numIn("life", "Plan until age", 85, 60, 100, 1, "years"),
      money("exp", "Monthly expenses today", 50000, 5000, 1000000, 1000),
      rate("inf", "Inflation (p.a.)", 6, 0, 12, 0.5),
      rate("pre", "Return before retirement", 11, 1, 18, 0.5),
      rate("post", "Return after retirement", 7, 1, 12, 0.5),
      money("sav", "Retirement savings so far", 500000, 0, 100000000, 10000),
    ],
    compute: (v) => {
      const toRet = v.ret - v.age;
      const n = v.life - v.ret;
      if (toRet <= 0) return { error: "Retirement age must be after your current age." };
      if (n <= 0) return { error: "'Plan until age' must be after the retirement age." };
      const yearly = v.exp * 12 * Math.pow(1 + v.inf / 100, toRet);
      const g = v.inf / 100,
        r = v.post / 100;
      const corpus = Math.abs(r - g) < 1e-9 ? yearly * n : ((yearly * (1 - Math.pow((1 + g) / (1 + r), n))) / (r - g)) * (1 + r);
      const grown = v.sav * Math.pow(1 + v.pre / 100, toRet);
      const gap = Math.max(0, corpus - grown);
      return {
        primary: { label: "Retirement corpus needed", value: corpus, fmt: "inr" },
        rows: [
          { label: "Monthly SIP needed from now", value: sipNeeded(gap, v.pre, toRet), fmt: "inr", strong: true },
          { label: "Monthly expenses at retirement", value: yearly / 12, fmt: "inr" },
          { label: "Current savings will grow to", value: grown, fmt: "inr" },
        ],
      };
    },
  },
  "fire-calculator": {
    inputs: [
      money("exp", "Annual expenses today", 600000, 50000, 50000000, 10000),
      numIn("age", "Current age", 30, 18, 65, 1, "years"),
      numIn("fage", "Target FIRE age", 45, 25, 70, 1, "years"),
      rate("inf", "Inflation (p.a.)", 6, 0, 12, 0.5),
      rate("swr", "Safe withdrawal rate", 3.5, 2, 6, 0.25),
      rate("r", "Expected return (p.a.)", 11, 1, 18, 0.5),
      money("sav", "Investments so far", 1000000, 0, 500000000, 10000),
    ],
    compute: (v) => {
      const yrs = v.fage - v.age;
      if (yrs <= 0) return { error: "FIRE age must be after your current age." };
      const expThen = v.exp * Math.pow(1 + v.inf / 100, yrs);
      const target = expThen / (v.swr / 100);
      const grown = v.sav * Math.pow(1 + v.r / 100, yrs);
      const gap = Math.max(0, target - grown);
      return {
        primary: { label: "Your FIRE number", value: target, fmt: "inr" },
        rows: [
          { label: "Monthly investment needed", value: sipNeeded(gap, v.r, yrs), fmt: "inr", strong: true },
          { label: "Annual expenses at FIRE age", value: expThen, fmt: "inr" },
          { label: "Corpus as multiple of expenses", value: `${(100 / v.swr).toFixed(1)}×`, fmt: "text" },
          { label: "Current investments will grow to", value: grown, fmt: "inr" },
        ],
      };
    },
  },
  "nps-calculator": {
    inputs: [
      money("p", "Monthly contribution", 5000, 500, 200000, 500),
      numIn("age", "Current age", 30, 18, 59, 1, "years"),
      rate("r", "Expected return (p.a.)", 10, 5, 14, 0.5),
      rate("a", "Corpus used for annuity", 20, 20, 100, 5),
      rate("ar", "Annuity rate (p.a.)", 6.5, 4, 9, 0.25),
    ],
    compute: (v) => {
      const yrs = 60 - v.age;
      const s = sipSim(v.p, v.r, yrs);
      const ann = (s.value * v.a) / 100;
      return {
        primary: { label: "Monthly pension", value: (ann * v.ar) / 100 / 12, fmt: "inr" },
        rows: [
          { label: "Corpus at 60", value: s.value, fmt: "inr", strong: true },
          { label: "Lump sum you can withdraw", value: s.value - ann, fmt: "inr" },
          { label: "Amount used for annuity", value: ann, fmt: "inr" },
          { label: "Total contributed", value: s.invested, fmt: "inr" },
        ],
        split: [
          { label: "Lump sum", value: s.value - ann },
          { label: "Annuity", value: ann },
        ],
      };
    },
  },
  "credit-card-payoff-calculator": {
    inputs: [
      money("B", "Outstanding balance", 100000, 1000, 5000000, 1000),
      rate("apr", "Interest rate (p.a.)", 42, 10, 50, 0.5),
      money("pay", "Monthly payment", 10000, 500, 1000000, 500),
      toggle("gst", "Add 18% GST on interest", true),
    ],
    compute: (v) => {
      const r = v.apr / 1200;
      const k = v.gst ? 1.18 : 1;
      if (v.pay <= v.B * r * k) return { error: `Your payment does not cover the monthly interest of about ${num0(v.B * r * k)}. Pay more to reduce the balance.` };
      let bal = v.B,
        m = 0,
        interest = 0;
      while (bal > 0.01 && m < 600) {
        const i = bal * r * k;
        interest += i;
        bal = bal + i - v.pay;
        m++;
      }
      return {
        primary: { label: "Time to pay off", value: m, fmt: "months" },
        rows: [
          { label: "Total interest" + (v.gst ? " incl. GST" : ""), value: interest, fmt: "inr", strong: true },
          { label: "Total paid", value: v.B + interest, fmt: "inr" },
        ],
        split: [
          { label: "Balance", value: v.B },
          { label: "Interest", value: interest },
        ],
      };
    },
  },
  "roi-calculator": {
    inputs: [money("a", "Amount invested", 100000, 1, 1000000000, 1000), money("b", "Amount returned", 180000, 0, 1000000000, 1000), years("y", "Holding period", 3, 0.1, 50, 0.1)],
    compute: (v) => {
      if (v.a <= 0) return { error: "Enter the amount invested." };
      const roi = ((v.b - v.a) / v.a) * 100;
      const cagr = (Math.pow(v.b / v.a, 1 / v.y) - 1) * 100;
      return {
        primary: { label: "Return on investment", value: roi, fmt: "pct" },
        rows: [
          { label: "Gain", value: v.b - v.a, fmt: "inr" },
          { label: "Annualised return (CAGR)", value: cagr, fmt: "pct", strong: true },
        ],
      };
    },
  },
  "profit-margin-calculator": {
    inputs: [money("c", "Cost price", 800, 0, 100000000, 1), money("s", "Selling price", 1000, 0, 100000000, 1)],
    compute: (v) => {
      const p = v.s - v.c;
      return {
        primary: { label: "Gross margin", value: v.s ? (p / v.s) * 100 : NaN, fmt: "pct" },
        rows: [
          { label: p >= 0 ? "Profit" : "Loss", value: p, fmt: "inr", strong: true },
          { label: "Markup on cost", value: v.c ? (p / v.c) * 100 : NaN, fmt: "pct" },
        ],
      };
    },
  },
  "break-even-calculator": {
    inputs: [money("f", "Fixed costs (per month)", 200000, 0, 100000000, 1000), money("p", "Price per unit", 500, 1, 10000000, 1), money("vc", "Variable cost per unit", 300, 0, 10000000, 1)],
    compute: (v) => {
      const cm = v.p - v.vc;
      if (cm <= 0) return { error: "Price must be higher than the variable cost per unit, or every sale loses money." };
      const units = v.f / cm;
      return {
        primary: { label: "Break-even units", value: Math.ceil(units), fmt: "int" },
        rows: [
          { label: "Break-even revenue", value: Math.ceil(units) * v.p, fmt: "inr", strong: true },
          { label: "Contribution per unit", value: cm, fmt: "inr" },
          { label: "Contribution margin", value: (cm / v.p) * 100, fmt: "pct" },
        ],
      };
    },
  },

  // ---------- tax & salary ----------
  "income-tax-calculator": {
    inputs: [
      REGIME,
      money("inc", "Annual income (gross)", 1500000, 0, 100000000, 10000),
      toggle("sal", "Salaried or pensioner (standard deduction)", true),
      { ...AGE, show: (v) => v.regime === "old" },
      { ...money("ded", "Deductions (80C, 80D, HRA, home loan…)", 150000, 0, 2000000, 5000), show: (v) => v.regime === "old" },
    ],
    compute: (v) => {
      const t = computeTax({ income: v.inc, regime: v.regime, age: v.age, deductions: v.ded, salaried: v.sal });
      return {
        primary: { label: "Total tax payable", value: t.total, fmt: "inr", sub: v.inc ? `${pctStr((t.total / v.inc) * 100)} of income · ${inr0(t.total / 12)} a month` : "" },
        rows: [
          { label: "Standard deduction", value: t.std, fmt: "inr" },
          ...(v.regime === "old" ? [{ label: "Other deductions", value: t.ded, fmt: "inr" }] : []),
          { label: "Taxable income", value: t.taxable, fmt: "inr", strong: true },
          { label: "Tax on slabs", value: t.slabTax, fmt: "inr" },
          ...(t.rebate ? [{ label: v.regime === "new" && t.taxable > 1200000 ? "Marginal relief (87A)" : "Rebate u/s 87A", value: -t.rebate, fmt: "inr" }] : []),
          ...(t.surcharge ? [{ label: `Surcharge (${t.sRate}%)`, value: t.surcharge, fmt: "inr" }] : []),
          { label: "Health & education cess (4%)", value: t.cess, fmt: "inr" },
        ],
        table: {
          title: "Slab-wise tax",
          cols: ["Slab", "Rate", "Income in slab", "Tax"],
          fmts: ["text", "pctInt", "inr", "inr"],
          rows: t.breakdown,
        },
        note: "Surcharge is shown without marginal relief at the ₹50 lakh and ₹1 crore thresholds. Special-rate income such as capital gains is not included.",
      };
    },
  },
  "old-vs-new-tax-regime": {
    inputs: [
      money("inc", "Annual income (gross)", 1500000, 0, 100000000, 10000),
      toggle("sal", "Salaried or pensioner", true),
      AGE,
      money("c80", "80C (PF, PPF, ELSS, LIC…)", 150000, 0, 150000, 5000),
      money("d80", "80D health insurance", 25000, 0, 100000, 1000),
      money("hra", "HRA exemption", 0, 0, 2000000, 5000),
      money("hl", "Home loan interest (self-occupied)", 0, 0, 200000, 5000),
      money("oth", "Other deductions (NPS 80CCD(1B), 80G…)", 0, 0, 1000000, 5000),
    ],
    compute: (v) => {
      const ded = Math.min(v.c80, 150000) + v.d80 + v.hra + Math.min(v.hl, 200000) + v.oth;
      const o = computeTax({ income: v.inc, regime: "old", age: v.age, deductions: ded, salaried: v.sal });
      const n = computeTax({ income: v.inc, regime: "new", salaried: v.sal });
      const diff = o.total - n.total;
      // Deductions at which both regimes cost the same (search).
      let lo = 0,
        hi = v.inc;
      for (let k = 0; k < 50; k++) {
        const mid = (lo + hi) / 2;
        if (computeTax({ income: v.inc, regime: "old", age: v.age, deductions: mid, salaried: v.sal }).total > n.total) lo = mid;
        else hi = mid;
      }
      const best = diff > 0 ? "New regime" : diff < 0 ? "Old regime" : "Either";
      return {
        primary: { label: "Better for you", value: best, fmt: "text", sub: diff ? `Saves ${inr0(Math.abs(diff))} a year` : "Both cost the same" },
        rows: [
          { label: "Tax under new regime", value: n.total, fmt: "inr", strong: diff > 0 },
          { label: "Tax under old regime", value: o.total, fmt: "inr", strong: diff < 0 },
          { label: "Deductions you entered (old regime)", value: ded, fmt: "inr" },
          { label: "Deductions needed to break even", value: hi >= v.inc - 1 ? NaN : hi, fmt: "inr" },
        ],
        split: [
          { label: "New", value: n.total },
          { label: "Old", value: o.total },
        ],
      };
    },
  },
  "hra-calculator": {
    inputs: [
      money("basic", "Basic salary (monthly)", 50000, 0, 2000000, 500),
      money("da", "Dearness allowance (monthly)", 0, 0, 1000000, 500),
      money("hra", "HRA received (monthly)", 20000, 0, 1000000, 500),
      money("rent", "Rent paid (monthly)", 22000, 0, 1000000, 500),
      toggle("metro", "Living in Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Pune or Ahmedabad", false),
    ],
    compute: (v) => {
      const sal = (v.basic + v.da) * 12;
      const a = v.hra * 12;
      const b = Math.max(0, v.rent * 12 - 0.1 * sal);
      const c = (v.metro ? 0.5 : 0.4) * sal;
      const ex = Math.min(a, b, c);
      return {
        primary: { label: "HRA exempt per year", value: ex, fmt: "inr" },
        rows: [
          { label: "Taxable HRA per year", value: a - ex, fmt: "inr", strong: true },
          { label: "1. Actual HRA received", value: a, fmt: "inr" },
          { label: "2. Rent minus 10% of salary", value: b, fmt: "inr" },
          { label: `3. ${v.metro ? "50" : "40"}% of salary`, value: c, fmt: "inr" },
        ],
        note: "The exemption is the lowest of the three. It applies only under the old regime. If annual rent is above ₹1 lakh you must give your employer the landlord's PAN.",
      };
    },
  },
  "gst-calculator": {
    inputs: [
      money("amt", "Amount", 1000, 0, 1000000000, 1),
      select("rate", "GST rate", "18", [
        ["5", "5%"],
        ["18", "18%"],
        ["40", "40% (special rate)"],
        ["3", "3% (gold, silver)"],
        ["0.25", "0.25% (rough diamonds)"],
        ["12", "12% (before 22 Sep 2025)"],
        ["28", "28% (before 22 Sep 2025)"],
        ["0", "0% (exempt)"],
      ]),
      select("mode", "The amount is", "add", [
        ["add", "Before GST (add GST)"],
        ["remove", "Including GST (remove GST)"],
      ]),
      toggle("inter", "Sale to another state (IGST)", false),
    ],
    compute: (v) => {
      const R = Number(v.rate);
      const base = v.mode === "add" ? v.amt : (v.amt * 100) / (100 + R);
      const gst = (base * R) / 100;
      return {
        primary: { label: v.mode === "add" ? "Price including GST" : "Price before GST", value: v.mode === "add" ? base + gst : base, fmt: "inr2" },
        rows: [
          { label: "GST amount", value: gst, fmt: "inr2", strong: true },
          ...(v.inter
            ? [{ label: `IGST (${R}%)`, value: gst, fmt: "inr2" }]
            : [
                { label: `CGST (${R / 2}%)`, value: gst / 2, fmt: "inr2" },
                { label: `SGST (${R / 2}%)`, value: gst / 2, fmt: "inr2" },
              ]),
          { label: "Net price", value: base, fmt: "inr2" },
        ],
      };
    },
  },
  "in-hand-salary-calculator": {
    inputs: [
      money("ctc", "Annual CTC", 1200000, 100000, 50000000, 10000),
      rate("bp", "Basic as % of CTC", 50, 20, 70, 5),
      select("pf", "Provident fund", "capped", [
        ["capped", "12% of basic, capped at ₹25,000 wage"],
        ["full", "12% of full basic"],
        ["none", "Not deducted"],
      ]),
      toggle("grat", "CTC includes gratuity (4.81% of basic)", true),
      money("pt", "Professional tax (per year)", 2400, 0, 2500, 100),
      REGIME,
      { ...money("ded", "Other deductions (old regime)", 0, 0, 1000000, 5000), show: (v) => v.regime === "old" },
    ],
    compute: (v) => {
      const basicM = (v.ctc * v.bp) / 100 / 12;
      const pfM = v.pf === "none" ? 0 : v.pf === "capped" ? Math.min(basicM, 25000) * 0.12 : basicM * 0.12;
      const grat = v.grat ? basicM * 12 * 0.0481 : 0;
      const gross = v.ctc - pfM * 12 - grat;
      const ded = v.regime === "old" ? Math.min(150000, pfM * 12 + 0) + v.ded : 0;
      const t = computeTax({ income: gross, regime: v.regime, deductions: ded, salaried: true });
      const net = gross - pfM * 12 - v.pt - t.total;
      return {
        primary: { label: "Monthly in-hand salary", value: net / 12, fmt: "inr", sub: `${inr0(net)} a year` },
        rows: [
          { label: "Gross salary (per year)", value: gross, fmt: "inr" },
          { label: "Employer PF (part of CTC)", value: pfM * 12, fmt: "inr" },
          { label: "Gratuity (part of CTC)", value: grat, fmt: "inr" },
          { label: "Your PF contribution", value: pfM * 12, fmt: "inr" },
          { label: "Professional tax", value: v.pt, fmt: "inr" },
          { label: "Income tax incl. cess", value: t.total, fmt: "inr", strong: true },
        ],
        split: [
          { label: "Take-home", value: Math.max(net, 0) },
          { label: "PF (both)", value: pfM * 24 },
          { label: "Tax & PT", value: t.total + v.pt },
        ],
      };
    },
  },
  "pf-calculator": {
    inputs: [
      money("basic", "Monthly basic + DA", 30000, 1000, 1000000, 500),
      numIn("age", "Current age", 28, 18, 57, 1, "years"),
      numIn("ret", "Retirement age", 58, 40, 60, 1, "years"),
      rate("inc", "Expected yearly salary increase", 6, 0, 20, 0.5),
      rate("r", "EPF interest rate", 8.25, 5, 10, 0.05),
      money("bal", "Current EPF balance", 0, 0, 50000000, 1000),
    ],
    compute: (v) => {
      let bal = v.bal,
        basic = v.basic,
        contrib = 0;
      const rows = [];
      const yrs = v.ret - v.age;
      if (yrs <= 0) return { error: "Retirement age must be after your current age." };
      for (let y = 1; y <= yrs; y++) {
        let interest = 0;
        for (let m = 0; m < 12; m++) {
          const eps = Math.min(Math.min(basic, 25000) * 0.0833, 2083);
          const c = basic * 0.12 + (basic * 0.12 - eps);
          bal += c;
          contrib += c;
          interest += (bal * v.r) / 1200;
        }
        bal += interest;
        rows.push([y, contrib, bal]);
        basic *= 1 + v.inc / 100;
      }
      return {
        primary: { label: "EPF balance at retirement", value: bal, fmt: "inr" },
        rows: [
          { label: "Total contributions", value: contrib, fmt: "inr" },
          { label: "Interest earned", value: bal - contrib - v.bal, fmt: "inr", strong: true },
        ],
        table: { title: "Balance by year", cols: ["Year", "Contributed so far", "Balance"], fmts: ["int", "inr", "inr"], rows },
        note: "The employer's 8.33% share, up to ₹2,083 a month on the ₹25,000 wage ceiling, goes to the pension scheme (EPS) and is not included.",
      };
    },
  },
  "gratuity-calculator": {
    inputs: [
      money("sal", "Last drawn basic + DA (monthly)", 50000, 1000, 2000000, 500),
      numIn("y", "Years of service", 7, 0, 50, 1, "years"),
      numIn("m", "Extra months", 7, 0, 11, 1, "months"),
      toggle("act", "Employer covered by the Gratuity Act", true),
    ],
    compute: (v) => {
      const yrs = v.act ? v.y + (v.m > 6 ? 1 : 0) : v.y;
      const g = v.act ? (15 / 26) * v.sal * yrs : (15 / 30) * v.sal * yrs;
      return {
        primary: { label: "Gratuity", value: g, fmt: "inr" },
        rows: [
          { label: "Years counted", value: yrs, fmt: "int" },
          { label: "Tax-free (up to ₹20 lakh)", value: Math.min(g, 2000000), fmt: "inr", strong: true },
          { label: "Taxable", value: Math.max(0, g - 2000000), fmt: "inr" },
        ],
        note: v.y < 5 ? "Most employees need 5 years of continuous service to receive gratuity." : undefined,
      };
    },
  },

  // ---------- everyday ----------
  "age-calculator": {
    inputs: [dateIn("dob", "Date of birth", "2000-01-15"), dateIn("on", "Age on", "today")],
    compute: (v) => {
      const a = parseDate(v.dob),
        b = parseDate(v.on);
      if (!a || !b) return { error: "Enter both dates." };
      if (a > b) return { error: "Date of birth is after the 'age on' date." };
      const { y, m, d } = ymd(a, b);
      let next = new Date(Date.UTC(b.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()));
      if (next < b) next = new Date(Date.UTC(b.getUTCFullYear() + 1, a.getUTCMonth(), a.getUTCDate()));
      const days = Math.round((b - a) / DAY);
      return {
        primary: { label: "Age", value: `${plural(y, "year")}, ${plural(m, "month")}, ${plural(d, "day")}`, fmt: "text" },
        rows: [
          { label: "Total months", value: y * 12 + m, fmt: "int" },
          { label: "Total weeks", value: Math.floor(days / 7), fmt: "int" },
          { label: "Total days", value: days, fmt: "int" },
          { label: "Born on a", value: WEEKDAYS[a.getUTCDay()], fmt: "text" },
          { label: "Next birthday in", value: plural(Math.round((next - b) / DAY), "day"), fmt: "text", strong: true },
        ],
      };
    },
  },
  "percentage-calculator": {
    inputs: [numIn("a", "Value A", 45, -1e12, 1e12, 1), numIn("b", "Value B", 60, -1e12, 1e12, 1)],
    compute: (v) => ({
      primary: { label: `${num0(v.a)} is this % of ${num0(v.b)}`, value: v.b ? (v.a / v.b) * 100 : NaN, fmt: "pct" },
      rows: [
        { label: `${num0(v.a)}% of ${num0(v.b)}`, value: (v.a * v.b) / 100, fmt: "num", strong: true },
        { label: `Change from ${num0(v.a)} to ${num0(v.b)}`, value: v.a ? ((v.b - v.a) / Math.abs(v.a)) * 100 : NaN, fmt: "pct" },
        { label: "Difference (B − A)", value: v.b - v.a, fmt: "num" },
      ],
    }),
  },
  "bmi-calculator": {
    inputs: [numIn("w", "Weight", 68, 10, 300, 0.5, "kg"), numIn("h", "Height", 170, 50, 250, 1, "cm")],
    compute: (v) => {
      const m = v.h / 100;
      const bmi = v.w / (m * m);
      const asian = bmi < 18.5 ? "Underweight" : bmi < 23 ? "Normal" : bmi < 25 ? "Overweight" : "Obese";
      const who = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
      return {
        primary: { label: "Your BMI", value: bmi, fmt: "num", sub: `${asian} (Asian cut-offs)` },
        rows: [
          { label: "Category, WHO ranges", value: who, fmt: "text" },
          { label: "Category, Asian ranges", value: asian, fmt: "text", strong: true },
          { label: "Normal weight for your height (Asian)", value: `${(18.5 * m * m).toFixed(1)} – ${(22.9 * m * m).toFixed(1)} kg`, fmt: "text" },
        ],
      };
    },
  },
  "calorie-calculator": {
    inputs: [
      numIn("age", "Age", 30, 15, 90, 1, "years"),
      select("sex", "Sex", "m", [
        ["m", "Male"],
        ["f", "Female"],
      ]),
      numIn("h", "Height", 170, 120, 230, 1, "cm"),
      numIn("w", "Weight", 68, 30, 250, 0.5, "kg"),
      select("act", "Activity", "1.375", [
        ["1.2", "Little or no exercise"],
        ["1.375", "Light: 1–3 days a week"],
        ["1.55", "Moderate: 3–5 days a week"],
        ["1.725", "Hard: 6–7 days a week"],
        ["1.9", "Very hard or physical job"],
      ]),
    ],
    compute: (v) => {
      const bmr = 10 * v.w + 6.25 * v.h - 5 * v.age + (v.sex === "m" ? 5 : -161);
      const tdee = bmr * Number(v.act);
      return {
        primary: { label: "Maintenance calories", value: Math.round(tdee), fmt: "int", sub: "kcal per day" },
        rows: [
          { label: "BMR (at rest)", value: Math.round(bmr), fmt: "int" },
          { label: "Gradual weight gain (+300)", value: Math.round(tdee + 300), fmt: "int" },
          { label: "Gradual weight loss (−300)", value: Math.round(tdee - 300), fmt: "int" },
        ],
        note: "Estimates only. For a diet plan or medical condition, talk to a doctor or registered dietitian.",
      };
    },
  },
  "date-difference": {
    inputs: [dateIn("a", "Start date", "2026-01-01"), dateIn("b", "End date", "today"), toggle("inc", "Include end date", false)],
    compute: (v) => {
      let a = parseDate(v.a),
        b = parseDate(v.b);
      if (!a || !b) return { error: "Enter both dates." };
      const flipped = a > b;
      if (flipped) [a, b] = [b, a];
      const extra = v.inc ? 1 : 0;
      const days = Math.round((b - a) / DAY) + extra;
      let work = 0;
      for (let t = a.getTime(); t < b.getTime() + extra * DAY; t += DAY) {
        const wd = new Date(t).getUTCDay();
        if (wd !== 0 && wd !== 6) work++;
      }
      const { y, m, d } = ymd(a, new Date(b.getTime() + extra * DAY));
      return {
        primary: { label: "Days between", value: days, fmt: "int", sub: flipped ? "End date is before start date; dates were swapped" : "" },
        rows: [
          { label: "In weeks", value: `${plural(Math.floor(days / 7), "week")}, ${plural(days % 7, "day")}`, fmt: "text" },
          { label: "In months", value: `${plural(y * 12 + m, "month")}, ${plural(d, "day")}`, fmt: "text" },
          { label: "Working days (Mon–Fri)", value: work, fmt: "int", strong: true },
          { label: "Hours", value: days * 24, fmt: "int" },
        ],
      };
    },
  },
  "date-add-subtract-calculator": {
    inputs: [
      dateIn("d", "Start date", "today"),
      select("op", "Operation", "add", [
        ["add", "Add"],
        ["sub", "Subtract"],
      ]),
      numIn("y", "Years", 0, 0, 200, 1),
      numIn("m", "Months", 0, 0, 1200, 1),
      numIn("dd", "Days", 90, 0, 100000, 1),
    ],
    compute: (v) => {
      const s = parseDate(v.d);
      if (!s) return { error: "Enter a start date." };
      const sign = v.op === "add" ? 1 : -1;
      let r = addMonthsClamped(s, sign * (v.y * 12 + v.m));
      r = new Date(r.getTime() + sign * v.dd * DAY);
      return {
        primary: { label: "Result", value: longDate(r), fmt: "text", sub: WEEKDAYS[r.getUTCDay()] },
        rows: [
          { label: "ISO date", value: r.toISOString().slice(0, 10), fmt: "text" },
          { label: "Total days moved", value: Math.abs(Math.round((r - s) / DAY)), fmt: "int" },
        ],
      };
    },
  },
  // ---------- student ----------
  "cgpa-to-percentage-calculator": {
    inputs: [
      numIn("cgpa", "CGPA or SGPA", 8.4, 0, 10, 0.01),
      select("f", "Conversion formula", "cbse", [
        ["cbse", "CBSE: CGPA × 9.5"],
        ["x10", "CGPA × 10 (Anna University and many others)"],
        ["vtu", "VTU: (CGPA − 0.75) × 10"],
        ["gpa4", "4-point GPA: GPA ÷ 4 × 100"],
        ["custom", "Custom multiplier"],
      ]),
      { ...numIn("mult", "Multiply CGPA by", 9.5, 1, 20, 0.05), show: (v) => v.f === "custom" },
    ],
    compute: (v) => {
      const g = Number(v.cgpa);
      const max = v.f === "gpa4" ? 4 : 10;
      if (!(g >= 0)) return { error: "Enter your CGPA." };
      if (g > max) return { error: `A ${max}-point CGPA cannot be above ${max}.` };
      const F = {
        cbse: [(x) => x * 9.5, (p) => p / 9.5, "CGPA × 9.5"],
        x10: [(x) => x * 10, (p) => p / 10, "CGPA × 10"],
        vtu: [(x) => Math.max(0, (x - 0.75) * 10), (p) => p / 10 + 0.75, "(CGPA − 0.75) × 10"],
        gpa4: [(x) => (x / 4) * 100, (p) => (p / 100) * 4, "GPA ÷ 4 × 100"],
        custom: [(x) => x * v.mult, (p) => p / v.mult, `CGPA × ${v.mult}`],
      }[v.f];
      const pct = Math.min(100, F[0](g));
      const cls = pct >= 75 ? "First class with distinction" : pct >= 60 ? "First class" : pct >= 50 ? "Second class" : pct >= 40 ? "Pass" : "Below pass";
      return {
        primary: { label: "Equivalent percentage", value: pct, fmt: "pct", sub: F[2] },
        rows: [
          { label: "Common classification", value: cls, fmt: "text", strong: true },
          { label: "CGPA needed for 60%", value: Math.min(max, F[1](60)).toFixed(2), fmt: "text" },
          { label: "CGPA needed for 75%", value: Math.min(max, F[1](75)).toFixed(2), fmt: "text" },
        ],
        note: "Conversions are set by each board or university and can change. Use the formula printed on your marksheet or in your university's ordinance for official purposes.",
      };
    },
  },
  "marks-grade-calculator": {
    inputs: [
      { id: "marks", label: "Subjects and marks (one per line: name, marks / maximum)", type: "textarea", rows: 6, def: "English 82/100\nMaths 91/100\nScience 78/100\nSocial Science 74/100\nHindi 88/100\nComputer Applications 45/50" },
      numIn("max", "Maximum marks when not given", 100, 1, 1000, 1),
      select("scale", "Grading scale", "cbse", [
        ["cbse", "CBSE 9-point (A1 to E)"],
        ["ten", "10-point university scale (O, A+, A…)"],
        ["letter", "Letter grades (A to F)"],
      ]),
      toggle("best5", "Show best of five", true),
    ],
    compute: (v) => {
      const subs = [];
      const bad = [];
      String(v.marks)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((line) => {
          const m = line.match(/^(.*?)[\s:,–-]*(\d+(?:\.\d+)?)\s*(?:(?:\/|out of|of|,)\s*|\s+)?(\d+(?:\.\d+)?)?\s*$/i);
          if (!m) return bad.push(line);
          const got = Number(m[2]);
          const out = m[3] ? Number(m[3]) : v.max;
          if (!(out > 0) || got > out) return bad.push(line);
          subs.push({ name: m[1].trim() || `Subject ${subs.length + 1}`, got, out, pct: (got / out) * 100 });
        });
      if (!subs.length) return { error: "Type one subject per line, like 'Maths 87/100'." };
      const grade = (p) => {
        if (v.scale === "cbse") return p > 90 ? "A1" : p > 80 ? "A2" : p > 70 ? "B1" : p > 60 ? "B2" : p > 50 ? "C1" : p > 40 ? "C2" : p >= 33 ? "D" : "E";
        if (v.scale === "ten") return p >= 90 ? "O" : p >= 80 ? "A+" : p >= 70 ? "A" : p >= 60 ? "B+" : p >= 50 ? "B" : p >= 45 ? "C" : p >= 40 ? "P" : "F";
        return p >= 90 ? "A" : p >= 80 ? "B" : p >= 70 ? "C" : p >= 60 ? "D" : "F";
      };
      const got = subs.reduce((a, s) => a + s.got, 0);
      const out = subs.reduce((a, s) => a + s.out, 0);
      const pct = (got / out) * 100;
      const top5 = [...subs].sort((a, b) => b.pct - a.pct).slice(0, 5);
      const b5 = (top5.reduce((a, s) => a + s.got, 0) / top5.reduce((a, s) => a + s.out, 0)) * 100;
      const hi = subs.reduce((a, s) => (s.pct > a.pct ? s : a));
      const lo = subs.reduce((a, s) => (s.pct < a.pct ? s : a));
      return {
        primary: { label: "Overall percentage", value: pct, fmt: "pct", sub: `${num0(got)} out of ${num0(out)} · Grade ${grade(pct)}` },
        rows: [
          ...(v.best5 && subs.length > 5 ? [{ label: "Best of five", value: b5, fmt: "pct", strong: true }] : []),
          { label: "Subjects", value: subs.length, fmt: "int" },
          { label: "Highest", value: `${hi.name} (${pctStr(hi.pct)})`, fmt: "text" },
          { label: "Lowest", value: `${lo.name} (${pctStr(lo.pct)})`, fmt: "text" },
          ...(bad.length ? [{ label: "Lines not understood", value: bad.join("; "), fmt: "text" }] : []),
        ],
        table: {
          title: "Subject-wise marks",
          cols: ["Subject", "Marks", "Out of", "Percent", "Grade"],
          fmts: ["text", "num", "num", "pct", "text"],
          rows: subs.map((s) => [s.name, s.got, s.out, s.pct, grade(s.pct)]),
        },
        note: v.scale === "cbse" ? "CBSE grade boundaries shown here use whole-percentage bands (A1 = 91–100, A2 = 81–90 and so on; D = 33–40)." : "Grade bands vary between institutions; check your own scheme.",
      };
    },
  },
  "attendance-calculator": {
    inputs: [
      numIn("held", "Classes held so far", 60, 1, 100000, 1),
      numIn("att", "Classes attended", 42, 0, 100000, 1),
      numIn("req", "Required attendance", 75, 1, 100, 1, "%"),
      numIn("left", "Classes left this term (optional)", 0, 0, 100000, 1),
    ],
    compute: (v) => {
      const held = Math.round(v.held),
        att = Math.round(v.att),
        req = v.req,
        left = Math.round(v.left);
      if (att > held) return { error: "Classes attended cannot be more than classes held." };
      const cur = (att / held) * 100;
      const rows = [
        { label: "Current attendance", value: cur, fmt: "pct", strong: true },
        { label: "Classes missed", value: held - att, fmt: "int" },
      ];
      let primary;
      if (cur >= req) {
        const skip = Math.floor((100 * att - req * held) / req + 1e-9);
        primary = { label: "Classes you can miss", value: skip, fmt: "int", sub: `and stay at or above ${req}%` };
        rows.push({ label: `Attendance if you miss ${skip}`, value: (att / (held + skip)) * 100, fmt: "pct" });
      } else if (req >= 100) {
        primary = { label: "Classes to attend in a row", value: NaN, fmt: "int", sub: "100% is no longer possible after missing a class" };
      } else {
        const need = Math.ceil((req * held - 100 * att) / (100 - req) - 1e-9);
        primary = { label: "Classes to attend in a row", value: need, fmt: "int", sub: `to reach ${req}%` };
        rows.push({ label: `Attendance after ${need} more`, value: ((att + need) / (held + need)) * 100, fmt: "pct" });
        if (left > 0 && need > left) rows.push({ label: "Classes left this term", value: `${num0(left)}: not enough to reach ${req}%`, fmt: "text" });
      }
      if (left > 0) {
        const best = ((att + left) / (held + left)) * 100;
        rows.push({ label: "Best possible by term end", value: best, fmt: "pct" });
        rows.push({ label: "Lowest if you skip every remaining class", value: (att / (held + left)) * 100, fmt: "pct" });
      }
      return { primary, rows, note: "Assumes every class counts equally. Labs, tutorials and medical leave may be counted differently by your college." };
    },
  },
  "exam-countdown": {
    inputs: [
      dateIn("exam", "Exam date", "2027-03-01"),
      dateIn("from", "Counting from", "today"),
      numIn("hours", "Study hours per day", 4, 0.5, 16, 0.5, "hours"),
      numIn("chapters", "Chapters or topics left", 24, 0, 2000, 1),
      numIn("rev", "Days to keep for revision", 10, 0, 365, 1),
      select("off", "Rest days", "sun", [
        ["none", "None"],
        ["sun", "Sundays off"],
        ["weekend", "Saturday and Sunday off"],
      ]),
    ],
    compute: (v) => {
      const exam = parseDate(v.exam),
        from = parseDate(v.from);
      if (!exam || !from) return { error: "Enter the exam date." };
      const days = Math.round((exam - from) / DAY);
      if (days < 0) return { error: "That exam date has already passed." };
      if (days === 0) return { primary: { label: "Days left", value: 0, fmt: "int", sub: "The exam is today. All the best!" } };
      const offDay = (d) => (v.off === "sun" && d === 0) || (v.off === "weekend" && (d === 0 || d === 6));
      let study = 0;
      for (let t = from.getTime(); t < exam.getTime(); t += DAY) if (!offDay(new Date(t).getUTCDay())) study++;
      const revDays = Math.min(v.rev, study);
      const newDays = study - revDays;
      let revStart = exam.getTime();
      for (let k = 0; k < revDays; ) {
        revStart -= DAY;
        if (!offDay(new Date(revStart).getUTCDay())) k++;
      }
      const rows = [
        { label: "Weeks left", value: `${plural(Math.floor(days / 7), "week")}, ${plural(days % 7, "day")}`, fmt: "text" },
        { label: "Study days (after rest days)", value: study, fmt: "int" },
        { label: "Study hours available", value: study * v.hours, fmt: "num" },
      ];
      if (v.chapters > 0) {
        if (newDays <= 0) rows.push({ label: "Chapters per day", value: "No days left before revision; reduce revision days", fmt: "text", strong: true });
        else {
          const perDay = v.chapters / newDays;
          if (perDay >= 1) rows.push({ label: "Chapters per day", value: perDay, fmt: "num", strong: true });
          else rows.push({ label: "Days per chapter", value: newDays / v.chapters, fmt: "num", strong: true });
          rows.push({ label: "Hours per chapter", value: (newDays * v.hours) / v.chapters, fmt: "num" });
        }
      }
      if (revDays > 0) rows.push({ label: "Start revision on", value: longDate(new Date(revStart)), fmt: "text" });
      return {
        primary: { label: "Days left", value: days, fmt: "int", sub: `Exam on ${WEEKDAYS[exam.getUTCDay()]}, ${longDate(exam)}` },
        rows,
      };
    },
  },

  "cgpa-calculator": {
    inputs: [
      { id: "sems", label: "Semesters (one per line: SGPA, then credits)", type: "textarea", rows: 6, def: "Sem 1: 8.2 22\nSem 2: 7.9 24\nSem 3: 8.6 23\nSem 4: 8.4 24" },
      select("scale", "Grade scale", "10", [
        ["10", "10-point (most Indian universities)"],
        ["4", "4-point GPA"],
      ]),
      select("mode", "How to combine semesters", "credits", [
        ["credits", "Weight by credits (official method)"],
        ["simple", "Simple average of SGPAs"],
      ]),
      { ...numIn("defc", "Credits when not given", 20, 1, 100, 1), show: (v) => v.mode === "credits" },
      toggle("plan", "Plan for a target CGPA", false),
      { ...numIn("target", "Target CGPA", 8.5, 0, 10, 0.01), show: (v) => v.plan },
      { ...numIn("remS", "Semesters left", 4, 1, 20, 1), show: (v) => v.plan },
      { ...numIn("remC", "Credits per remaining semester", 22, 1, 100, 1), show: (v) => v.plan && v.mode === "credits" },
    ],
    compute: (v) => {
      const max = Number(v.scale);
      const sems = [];
      const bad = [];
      String(v.sems)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((line) => {
          // Label before ':' / '=' / ' - ', or a leading "Sem 1" / "Semester IV" with no separator.
          let label = "",
            rest = line;
          const cut = line.search(/[:=–—]|\s-\s/);
          if (cut >= 0) {
            label = line.slice(0, cut).trim();
            rest = line.slice(cut + 1);
          } else {
            const m = line.match(/^([A-Za-z.]+\s*(?:\d+|[IVX]+))\b/i);
            if (m && /[A-Za-z]/.test(m[1].replace(/[IVX]+$/i, ""))) {
              label = m[1];
              rest = line.slice(m[0].length);
            }
          }
          const nums = rest.match(/\d+(?:\.\d+)?/g) || [];
          const sg = Number(nums[0]);
          const cr = nums[1] !== undefined ? Number(nums[1]) : v.defc;
          if (!nums.length || !(sg >= 0) || sg > max || !(cr > 0)) return bad.push(line);
          sems.push({ name: label || `Semester ${sems.length + 1}`, sg, cr: v.mode === "credits" ? cr : 1 });
        });
      if (!sems.length) return { error: `Type one semester per line, like 'Sem 1: 8.2 22' (SGPA out of ${max}, then credits).` };
      let pts = 0,
        crs = 0;
      const rows = sems.map((s) => {
        pts += s.sg * s.cr;
        crs += s.cr;
        return v.mode === "credits" ? [s.name, s.sg, s.cr, s.sg * s.cr, pts / crs] : [s.name, s.sg, pts / crs];
      });
      const cg = pts / crs;
      const out = [];
      if (v.mode === "credits") {
        out.push({ label: "Total credits", value: crs, fmt: "num" });
        out.push({ label: "Total credit points", value: pts, fmt: "num" });
      }
      out.push({ label: "Semesters counted", value: sems.length, fmt: "int" });
      if (max === 10) {
        out.push({ label: "Percentage (CGPA × 9.5, CBSE style)", value: cg * 9.5, fmt: "pct" });
        out.push({ label: "Percentage (CGPA × 10)", value: cg * 10, fmt: "pct" });
      } else out.push({ label: "Percentage (GPA ÷ 4 × 100)", value: (cg / 4) * 100, fmt: "pct" });
      if (v.plan) {
        const remCr = v.mode === "credits" ? v.remS * v.remC : v.remS;
        const need = (v.target * (crs + remCr) - pts) / remCr;
        const best = (pts + max * remCr) / (crs + remCr);
        let val;
        if (need > max) val = `Not reachable: the best possible is ${best.toFixed(2)}`;
        else if (need <= 0) val = "Already secured, even with 0 in the rest";
        else val = need.toFixed(2);
        out.push({ label: `SGPA needed in each of the next ${plural(Math.round(v.remS), "semester")}`, value: val, fmt: "text", strong: true });
        out.push({ label: "Highest CGPA still possible", value: best.toFixed(2), fmt: "text" });
      }
      if (bad.length) out.push({ label: "Lines not understood", value: bad.join("; "), fmt: "text" });
      return {
        primary: { label: "Your CGPA", value: cg.toFixed(2), fmt: "text", sub: `out of ${max} · ${v.mode === "credits" ? "credit-weighted" : "simple average"}` },
        rows: out,
        table:
          v.mode === "credits"
            ? { title: "Semester by semester", cols: ["Semester", "SGPA", "Credits", "Credit points", "CGPA so far"], fmts: ["text", "num", "num", "num", "num"], rows }
            : { title: "Semester by semester", cols: ["Semester", "SGPA", "CGPA so far"], fmts: ["text", "num", "num"], rows },
        note: "Universities officially weight each semester by its credits. A simple average is only exact when every semester has the same credits. Percentage conversion rules differ by university; check your ordinance.",
      };
    },
  },
  "gpa-calculator": {
    inputs: [
      { id: "subs", label: "Subjects (one per line: name, grade, credits)", type: "textarea", rows: 7, def: "Engineering Maths A+ 4\nPhysics A 4\nProgramming in C O 3\nEngineering Graphics B+ 3\nPhysics Lab A+ 1.5\nC Lab O 1.5" },
      select("scale", "Grading scale", "ten", [
        ["ten", "10-point: O, A+, A, B+, B, C, P, F"],
        ["four", "4.0 scale: A, A−, B+, B … F"],
      ]),
      numIn("defc", "Credits when not given", 3, 0.5, 30, 0.5),
    ],
    compute: (v) => {
      const TEN = { O: 10, S: 10, "A+": 9, A: 8, "B+": 7, B: 6, C: 5, P: 4, D: 4, E: 4, F: 0, U: 0, RA: 0, AB: 0, FAIL: 0 };
      const FOUR = { "A+": 4, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, "D-": 0.7, F: 0 };
      const map = v.scale === "ten" ? TEN : FOUR;
      const max = v.scale === "ten" ? 10 : 4;
      const pointOf = (tok) => {
        const t = String(tok).toUpperCase().replace(/[−–]/g, "-");
        if (t in map) return { g: t, p: map[t] };
        if (/^\d+(\.\d+)?$/.test(t) && Number(t) <= max) return { g: t, p: Number(t) };
        return null;
      };
      const subs = [];
      const bad = [];
      String(v.subs)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((line) => {
          const tk = line.split(/[\s,;:|\t]+/).filter((t) => t && !/^credits?$/i.test(t));
          let gr, cr, nameT;
          const last = tk[tk.length - 1];
          const prev = tk.length > 1 ? pointOf(tk[tk.length - 2]) : null;
          if (tk.length >= 2 && prev && /^\d+(\.\d+)?$/.test(last)) {
            gr = prev;
            cr = Number(last);
            nameT = tk.slice(0, -2);
          } else if (pointOf(last)) {
            gr = pointOf(last);
            cr = v.defc;
            nameT = tk.slice(0, -1);
          } else return bad.push(line);
          if (!(cr > 0)) return bad.push(line);
          subs.push({ name: nameT.join(" ") || `Subject ${subs.length + 1}`, ...gr, cr });
        });
      if (!subs.length) return { error: "Type one subject per line, like 'Maths A+ 4' (grade, then credits)." };
      const crs = subs.reduce((a, s) => a + s.cr, 0);
      const pts = subs.reduce((a, s) => a + s.p * s.cr, 0);
      const gpa = pts / crs;
      const fails = subs.filter((s) => s.p === 0);
      const hi = subs.reduce((a, s) => (s.p > a.p ? s : a));
      const lo = subs.reduce((a, s) => (s.p < a.p ? s : a));
      return {
        primary: { label: v.scale === "ten" ? "Your SGPA / GPA" : "Your GPA", value: gpa.toFixed(2), fmt: "text", sub: `out of ${max} · ${num0(crs)} credits` },
        rows: [
          { label: "Total credits", value: crs, fmt: "num" },
          { label: "Total credit points", value: pts, fmt: "num" },
          { label: "Subjects", value: subs.length, fmt: "int" },
          { label: "Best subject", value: `${hi.name} (${hi.g})`, fmt: "text" },
          { label: "Weakest subject", value: `${lo.name} (${lo.g})`, fmt: "text" },
          ...(fails.length ? [{ label: "Failed or absent", value: fails.map((s) => s.name).join(", "), fmt: "text", strong: true }] : []),
          ...(bad.length ? [{ label: "Lines not understood", value: bad.join("; "), fmt: "text" }] : []),
        ],
        table: {
          title: "Subject-wise grade points",
          cols: ["Subject", "Grade", "Points", "Credits", "Credit points"],
          fmts: ["text", "text", "num", "num", "num"],
          rows: subs.map((s) => [s.name, s.g, s.p, s.cr, s.p * s.cr]),
        },
        note:
          v.scale === "ten"
            ? "Grade points used: O = 10, A+ = 9, A = 8, B+ = 7, B = 6, C = 5, P = 4, F/U/AB = 0 (the common UGC/AICTE scheme). You can also type grade points as numbers. Failed subjects count as 0 until cleared."
            : "Grade points used: A/A+ = 4.0, A− = 3.7, B+ = 3.3, B = 3.0, B− = 2.7, C+ = 2.3, C = 2.0, C− = 1.7, D+ = 1.3, D = 1.0, F = 0. Some colleges give A+ 4.3; type the number if yours does.",
      };
    },
  },
  "study-hours-planner": {
    inputs: [
      { id: "subs", label: "Subjects (one per line: name, then easy / medium / hard or a weight 1–5)", type: "textarea", rows: 6, def: "Physics hard\nChemistry medium\nMaths hard\nEnglish easy\nComputer Science medium" },
      numIn("wd", "Study hours on a weekday", 3, 0, 16, 0.5, "hours"),
      numIn("we", "Study hours on a weekend day", 5, 0, 16, 0.5, "hours"),
      select("off", "Rest days", "none", [
        ["none", "None"],
        ["sun", "Sundays off"],
      ]),
      select("sess", "Session length", "50", [
        ["25", "25 min focus + 5 min break (Pomodoro)"],
        ["50", "50 min focus + 10 min break"],
        ["90", "90 min focus + 15 min break"],
      ]),
      numIn("rev", "Time kept for revision and mock tests", 20, 0, 80, 5, "%"),
      toggle("useExam", "Count hours until an exam date", true),
      { ...dateIn("exam", "Exam date", "2027-03-01"), show: (v) => v.useExam },
      { ...dateIn("from", "Starting from", "today"), show: (v) => v.useExam },
    ],
    compute: (v) => {
      const W = { easy: 1, light: 1, medium: 2, moderate: 2, avg: 2, hard: 3, tough: 3, difficult: 3, weak: 3 };
      const subs = [];
      const bad = [];
      String(v.subs)
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
        .forEach((line) => {
          const tk = line.split(/[\s,;:|\t–-]+/).filter(Boolean);
          const last = (tk[tk.length - 1] || "").toLowerCase();
          let w = 2,
            name = tk;
          if (last in W) {
            w = W[last];
            name = tk.slice(0, -1);
          } else if (/^\d+(\.\d+)?$/.test(last) && tk.length > 1) {
            w = Number(last);
            name = tk.slice(0, -1);
          }
          if (!(w > 0) || w > 5) return bad.push(line);
          subs.push({ name: name.join(" ") || `Subject ${subs.length + 1}`, w });
        });
      if (!subs.length) return { error: "Type one subject per line, like 'Physics hard'." };
      const focus = Number(v.sess);
      const brk = { 25: 5, 50: 10, 90: 15 }[focus];
      const satH = v.we,
        sunH = v.off === "sun" ? 0 : v.we;
      const week = 5 * v.wd + satH + sunH;
      if (!(week > 0)) return { error: "Enter how many hours you can study." };
      const ratio = focus / (focus + brk);
      const newShare = 1 - v.rev / 100;
      const sumW = subs.reduce((a, s) => a + s.w, 0);
      const sessWeek = Math.floor((week * 60) / (focus + brk));

      let totalH = null,
        days = null;
      if (v.useExam) {
        const exam = parseDate(v.exam),
          from = parseDate(v.from);
        if (!exam || !from) return { error: "Enter the exam date." };
        days = Math.round((exam - from) / DAY);
        if (days <= 0) return { error: "Pick an exam date after the start date." };
        totalH = 0;
        for (let t = from.getTime(); t < exam.getTime(); t += DAY) {
          const d = new Date(t).getUTCDay();
          totalH += d === 0 ? sunH : d === 6 ? satH : v.wd;
        }
      }
      const rows = [
        { label: "Focused study per week (after breaks)", value: week * ratio, fmt: "num" },
        { label: `${focus}-minute sessions per week`, value: sessWeek, fmt: "int", strong: true },
        { label: "Sessions on a weekday", value: Math.floor((v.wd * 60) / (focus + brk)), fmt: "int" },
        { label: "Revision and mock tests per week", value: week * (v.rev / 100), fmt: "num" },
      ];
      if (totalH !== null) {
        rows.push({ label: `Study hours left until the exam (${plural(days, "day")})`, value: totalH, fmt: "num", strong: true });
        rows.push({ label: "Of which kept for revision", value: totalH * (v.rev / 100), fmt: "num" });
      }
      if (bad.length) rows.push({ label: "Lines not understood", value: bad.join("; "), fmt: "text" });
      const cols = ["Subject", "Weight", "Hours / week", "Sessions / week", "Share"];
      const fmts = ["text", "num", "num", "int", "pct"];
      if (totalH !== null) {
        cols.push("Hours until exam");
        fmts.push("num");
      }
      return {
        primary: { label: "Study hours per week", value: week, fmt: "num", sub: `${num0(v.wd)} h × 5 weekdays + ${num0(satH)} h Sat + ${num0(sunH)} h Sun` },
        rows,
        table: {
          title: "Weekly hours by subject (revision share set aside)",
          cols,
          fmts,
          rows: subs.map((s) => {
            const share = (s.w / sumW) * newShare;
            const r = [s.name, s.w, week * share, Math.round(sessWeek * share), share * 100];
            if (totalH !== null) r.push(totalH * share);
            return r;
          }),
        },
        note: "Weights: easy = 1, medium = 2, hard = 3 (or type 1–5). Hours are split in proportion to weight after setting aside the revision share. Hard subjects get more time, so put them in your freshest hours of the day.",
      };
    },
  },

  // ---------- everyday: dates and time ----------
  "working-days-calculator": {
    inputs: [
      dateIn("a", "Start date", "today"),
      dateIn("b", "End date", "2026-12-31"),
      select("week", "Days off each week", "satsun", [
        ["satsun", "Saturday and Sunday"],
        ["sun", "Sunday only"],
        ["bank", "Sundays and 2nd and 4th Saturdays (Indian banks)"],
        ["frisat", "Friday and Saturday"],
      ]),
      { id: "hol", label: "Holidays (one per line or comma-separated)", type: "textarea", rows: 3, def: "2026-11-08\n2026-12-25", placeholder: "2026-11-08, 25/12/2026, 26 Jan 2027" },
      toggle("inc", "Include both dates", true),
    ],
    compute: (v) => {
      let a = parseDate(v.a),
        b = parseDate(v.b);
      if (!a || !b) return { error: "Enter both dates." };
      const flipped = a > b;
      if (flipped) [a, b] = [b, a];
      const MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
      const hols = new Set();
      const unread = [];
      String(v.hol || "")
        .split(/[\n,;]+/)
        .map((x) => x.trim())
        .filter(Boolean)
        .forEach((x) => {
          let m, d;
          if ((m = x.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) d = Date.UTC(+m[1], +m[2] - 1, +m[3]);
          else if ((m = x.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/))) d = Date.UTC(+m[3] < 100 ? 2000 + +m[3] : +m[3], +m[2] - 1, +m[1]);
          else if ((m = x.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3})[a-z]*,?\s+(\d{4})$/i)) && MON[m[2].toLowerCase()] !== undefined) d = Date.UTC(+m[3], MON[m[2].toLowerCase()], +m[1]);
          else if ((m = x.match(/^([a-z]{3})[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i)) && MON[m[1].toLowerCase()] !== undefined) d = Date.UTC(+m[3], MON[m[1].toLowerCase()], +m[2]);
          if (d === undefined || isNaN(d)) unread.push(x);
          else hols.add(d);
        });
      const isOff = (dt) => {
        const wd = dt.getUTCDay();
        if (v.week === "sun") return wd === 0;
        if (v.week === "frisat") return wd === 5 || wd === 6;
        if (v.week === "bank") {
          if (wd === 0) return true;
          if (wd !== 6) return false;
          const nth = Math.ceil(dt.getUTCDate() / 7);
          return nth === 2 || nth === 4;
        }
        return wd === 0 || wd === 6;
      };
      const start = v.inc ? a.getTime() : a.getTime() + DAY;
      let total = 0,
        off = 0,
        hol = 0,
        work = 0;
      const holRows = [];
      for (let t = start; t <= b.getTime(); t += DAY) {
        const dt = new Date(t);
        total++;
        if (isOff(dt)) {
          off++;
          if (hols.has(t)) holRows.push([longDate(dt), WEEKDAYS[dt.getUTCDay()], "Already a day off"]);
        } else if (hols.has(t)) {
          hol++;
          holRows.push([longDate(dt), WEEKDAYS[dt.getUTCDay()], "Counted"]);
        } else work++;
      }
      return {
        primary: { label: "Working days", value: work, fmt: "int", sub: `${longDate(a)} to ${longDate(b)}${flipped ? " (dates swapped)" : ""}` },
        rows: [
          { label: "Calendar days", value: total, fmt: "int" },
          { label: "Weekly days off", value: off, fmt: "int" },
          { label: "Holidays on working days", value: hol, fmt: "int" },
          { label: "Working weeks (5-day)", value: work / 5, fmt: "num" },
          ...(unread.length ? [{ label: "Dates not understood", value: unread.join(", "), fmt: "text" }] : []),
        ],
        table: holRows.length ? { title: "Holidays in this range", cols: ["Date", "Day", "Effect"], rows: holRows } : undefined,
      };
    },
  },
  "time-duration-calculator": {
    inputs: [
      { id: "start", label: "Start time", type: "time", def: "09:30" },
      { id: "end", label: "End time", type: "time", def: "18:15" },
      numIn("brk", "Breaks", 45, 0, 1440, 5, "min"),
      numIn("days", "Number of days", 1, 1, 366, 1),
      money("rate", "Hourly rate (optional)", 0, 0, 100000, 10),
    ],
    compute: (v) => {
      const toMin = (s) => {
        const m = String(s || "").match(/^(\d{1,2}):(\d{2})/);
        return m ? +m[1] * 60 + +m[2] : NaN;
      };
      const a = toMin(v.start),
        b = toMin(v.end);
      if (!Number.isFinite(a) || !Number.isFinite(b)) return { error: "Enter a start and an end time." };
      let span = b - a;
      const overnight = span < 0;
      if (overnight) span += 1440;
      const net = span - v.brk;
      if (net < 0) return { error: "The break is longer than the time between start and end." };
      const hm = (m) => `${Math.floor(m / 60)} h ${String(Math.round(m % 60)).padStart(2, "0")} min`;
      const total = net * Math.max(1, Math.round(v.days));
      const rows = [
        { label: "In decimal hours", value: net / 60, fmt: "num", strong: true },
        { label: "In minutes", value: net, fmt: "int" },
        { label: "Before breaks", value: hm(span), fmt: "text" },
      ];
      if (v.days > 1) {
        rows.push({ label: `Total for ${Math.round(v.days)} days`, value: hm(total), fmt: "text" });
        rows.push({ label: "Total in decimal hours", value: total / 60, fmt: "num" });
      }
      if (v.rate > 0) rows.push({ label: v.days > 1 ? "Pay for all days" : "Pay", value: (total / 60) * v.rate, fmt: "inr2" });
      return { primary: { label: "Duration", value: hm(net), fmt: "text", sub: overnight ? "Ends the next day (overnight)" : "" }, rows };
    },
  },
  "youtube-money-calculator": {
    inputs: [numIn("views", "Daily views", 10000, 0, 100000000, 100), money("rpm", "RPM (₹ per 1,000 views)", 40, 1, 2000, 1)],
    compute: (v) => {
      const d = (v.views / 1000) * v.rpm;
      return {
        primary: { label: "Estimated monthly earnings", value: d * 30, fmt: "inr" },
        rows: [
          { label: "Per day", value: d, fmt: "inr" },
          { label: "Per year", value: d * 365, fmt: "inr", strong: true },
          { label: "Range at half to double this RPM (monthly)", value: `${inr0(d * 15)} – ${inr0(d * 60)}`, fmt: "text" },
        ],
      };
    },
  },
};

function num0(n) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);
}
function inr0(n) {
  return "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(Math.round(n));
}
function pctStr(n) {
  return `${n.toFixed(1)}%`;
}
function plural(n, w) {
  return `${new Intl.NumberFormat("en-IN").format(n)} ${w}${n === 1 ? "" : "s"}`;
}
