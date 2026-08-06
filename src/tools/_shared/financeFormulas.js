import { inr, inrDec } from "./FinanceCalcShell";

const n = (v, d = 0) => {
  const x = Number(v);
  return Number.isFinite(x) ? x : d;
};

export function emi(P, annualRate, years) {
  const r = annualRate / 12 / 100;
  const m = years * 12;
  if (P <= 0 || annualRate <= 0 || years <= 0) return null;
  const e = (P * r * Math.pow(1 + r, m)) / (Math.pow(1 + r, m) - 1);
  return { emi: e, months: m, total: e * m, interest: e * m - P };
}

export const financeCompute = {

  lumpsum: (v) => {
    const P = n(v.amount);
    const r = n(v.rate) / 100;
    const y = n(v.years);
    const fv = P * Math.pow(1 + r, y);
    return {
      results: [
        { label: "Invested", value: inr.format(P) },
        { label: "Est. returns", value: inr.format(fv - P), tone: "up" },
        { label: "Future value", value: inr.format(fv) },
      ],
    };
  },

  swp: (v) => {
    const corpus = n(v.corpus);
    const monthly = n(v.withdrawal);
    const rate = n(v.rate) / 100 / 12;
    let bal = corpus;
    let months = 0;
    const max = 600;
    while (bal > 0 && months < max) {
      bal = bal * (1 + rate) - monthly;
      months += 1;
      if (bal <= 0) break;
    }
    return {
      results: [
        { label: "Months lasting", value: String(Math.min(months, max)) },
        { label: "Years lasting", value: (Math.min(months, max) / 12).toFixed(1) },
        { label: "Total withdrawn (approx)", value: inr.format(monthly * Math.min(months, max)) },
      ],
      note: months >= max ? "Still lasting beyond 50 years at these assumptions." : "Until corpus depletes.",
    };
  },

  stp: (v) => {
    const from = n(v.fromAmount);
    const monthly = n(v.transfer);
    const rate = n(v.rate) / 100 / 12;
    const months = n(v.months);
    let source = from;
    let dest = 0;
    for (let i = 0; i < months; i += 1) {
      const move = Math.min(monthly, source);
      source -= move;
      source *= 1 + rate * 0.3; // residual earns less illustrative
      dest = (dest + move) * (1 + rate);
    }
    return {
      results: [
        { label: "Source left", value: inr.format(Math.max(source, 0)) },
        { label: "Destination value", value: inr.format(dest) },
        { label: "Transferred", value: inr.format(Math.min(monthly * months, from)) },
      ],
      note: "Simplified STP model for planning.",
    };
  },

  goal_planner: (v) => {
    const goal = n(v.goal);
    const years = n(v.years);
    const rate = n(v.rate) / 100 / 12;
    const nM = years * 12;
    const sip = rate === 0 ? goal / nM : (goal * rate) / ((Math.pow(1 + rate, nM) - 1) * (1 + rate));
    return {
      results: [
        { label: "Required monthly SIP", value: inr.format(sip) },
        { label: "Total invest (approx)", value: inr.format(sip * nM) },
        { label: "Goal", value: inr.format(goal) },
      ],
    };
  },

  retirement_corpus: (v) => {
    const expense = n(v.expense);
    const years = n(v.years);
    const infl = n(v.inflation) / 100;
    const ret = n(v.returnRate) / 100;
    const futureAnnual = expense * 12 * Math.pow(1 + infl, years);
    const corpus = ret > infl ? futureAnnual / (ret - infl) : futureAnnual * 25;
    return {
      results: [
        { label: "Future annual expense", value: inr.format(futureAnnual) },
        { label: "Corpus needed", value: inr.format(corpus) },
        { label: "Years to retire", value: String(years) },
      ],
      note: "Uses a simplified withdrawal-rate model.",
    };
  },

  child_education: (v) => {
    const cost = n(v.cost);
    const years = n(v.years);
    const infl = n(v.inflation) / 100;
    const rate = n(v.rate) / 100 / 12;
    const future = cost * Math.pow(1 + infl, years);
    const nM = years * 12;
    const sip = rate === 0 ? future / nM : (future * rate) / ((Math.pow(1 + rate, nM) - 1) * (1 + rate));
    return {
      results: [
        { label: "Future education cost", value: inr.format(future) },
        { label: "Monthly SIP needed", value: inr.format(sip) },
        { label: "Years left", value: String(years) },
      ],
    };
  },

  fire: (v) => {
    const expense = n(v.expense) * 12;
    const rate = n(v.withdraw) / 100;
    const corpus = rate > 0 ? expense / rate : expense * 25;
    const savings = n(v.savings);
    const invest = n(v.invest);
    const ret = n(v.returnRate) / 100 / 12;
    let bal = savings;
    let months = 0;
    while (bal < corpus && months < 600) {
      bal = (bal + invest) * (1 + ret);
      months += 1;
    }
    return {
      results: [
        { label: "FIRE number", value: inr.format(corpus) },
        { label: "Years to FIRE", value: (months / 12).toFixed(1) },
        { label: "Monthly invest", value: inr.format(invest) },
      ],
      note: "4% rule style planning—adjust withdrawal rate to your risk.",
    };
  },

  loan_emi: (v) => {
    const res = emi(n(v.amount), n(v.rate), n(v.years));
    if (!res) return { results: [], note: "Enter valid loan details." };
    return {
      results: [
        { label: "EMI", value: inr.format(res.emi) },
        { label: "Total interest", value: inr.format(res.interest) },
        { label: "Total payment", value: inr.format(res.total) },
      ],
    };
  },

  loan_prepay: (v) => {
    const res = emi(n(v.amount), n(v.rate), n(v.years));
    if (!res) return { results: [], note: "Enter valid loan details." };
    const prepay = n(v.prepay);
    const newPrincipal = Math.max(n(v.amount) - prepay, 0);
    const res2 = emi(newPrincipal, n(v.rate), n(v.years));
    const saved = res.interest - (res2?.interest || 0);
    return {
      results: [
        { label: "New EMI (same tenure)", value: inr.format(res2?.emi || 0) },
        { label: "Interest saved (approx)", value: inr.format(Math.max(saved, 0)), tone: "up" },
        { label: "Prepayment", value: inr.format(prepay) },
      ],
      note: "Assumes prepay at start; actual savings depend on when you prepay.",
    };
  },

  balance_transfer: (v) => {
    const oldE = emi(n(v.amount), n(v.oldRate), n(v.years));
    const newE = emi(n(v.amount), n(v.newRate), n(v.years));
    if (!oldE || !newE) return { results: [], note: "Enter valid details." };
    const fee = (n(v.amount) * n(v.feePct)) / 100;
    const monthlySave = oldE.emi - newE.emi;
    const interestSave = oldE.interest - newE.interest - fee;
    return {
      results: [
        { label: "Monthly EMI save", value: inr.format(monthlySave), tone: monthlySave > 0 ? "up" : "down" },
        { label: "Net interest save", value: inr.format(interestSave), tone: interestSave > 0 ? "up" : "down" },
        { label: "Transfer fee", value: inr.format(fee) },
      ],
    };
  },

  income_tax: (v) => {
    const income = n(v.income);
    const regime = v.regime;
    let tax = 0;
    if (regime === "new") {
      const slabs = [
        [400000, 0],
        [800000, 0.05],
        [1200000, 0.1],
        [1600000, 0.15],
        [2000000, 0.2],
        [2400000, 0.25],
        [Infinity, 0.3],
      ];
      let prev = 0;
      for (const [upto, rate] of slabs) {
        const chunk = Math.max(0, Math.min(income, upto) - prev);
        tax += chunk * rate;
        prev = upto;
        if (income <= upto) break;
      }
      if (income <= 1200000) tax = 0; // rebate illustration FY25-26 style simplified
    } else {
      const taxable = Math.max(income - n(v.deductions), 0);
      const slabs = [
        [250000, 0],
        [500000, 0.05],
        [1000000, 0.2],
        [Infinity, 0.3],
      ];
      let prev = 0;
      for (const [upto, rate] of slabs) {
        const chunk = Math.max(0, Math.min(taxable, upto) - prev);
        tax += chunk * rate;
        prev = upto;
        if (taxable <= upto) break;
      }
      if (taxable <= 500000) tax = 0;
    }
    const cess = tax * 0.04;
    return {
      results: [
        { label: "Income tax", value: inr.format(tax) },
        { label: "Cess 4%", value: inr.format(cess) },
        { label: "Total tax", value: inr.format(tax + cess) },
      ],
      note: "Simplified slab illustration—not official e-filing advice.",
    };
  },

  old_vs_new: (v) => {
    const oldRes = financeCompute.income_tax({ income: v.income, regime: "old", deductions: v.deductions });
    const newRes = financeCompute.income_tax({ income: v.income, regime: "new", deductions: 0 });
    const parse = (s) => Number(String(s).replace(/[^\d.-]/g, "")) || 0;
    const oldT = parse(oldRes.results[2].value);
    const newT = parse(newRes.results[2].value);
    const better = oldT === newT ? "Similar" : oldT < newT ? "Old regime" : "New regime";
    return {
      results: [
        { label: "Old regime total", value: oldRes.results[2].value },
        { label: "New regime total", value: newRes.results[2].value },
        { label: "Better option", value: better, tone: "up" },
      ],
      note: "Pick the lower total tax after your real deductions.",
    };
  },

  hra: (v) => {
    const basic = n(v.basic);
    const hra = n(v.hra);
    const rent = n(v.rent);
    const metro = v.metro === "yes";
    const a = hra;
    const b = rent - 0.1 * basic;
    const c = (metro ? 0.5 : 0.4) * basic;
    const exempt = Math.max(0, Math.min(a, b, c));
    return {
      results: [
        { label: "HRA exempt", value: inr.format(exempt), tone: "up" },
        { label: "Taxable HRA", value: inr.format(Math.max(hra - exempt, 0)) },
      ],
      note: "Standard three-way HRA exemption rule.",
    };
  },

  standard_deduction: (v) => {
    const regime = v.regime;
    const ded = regime === "new" ? 75000 : 50000;
    const income = n(v.income);
    return {
      results: [
        { label: "Standard deduction", value: inr.format(ded) },
        { label: "Income after deduction", value: inr.format(Math.max(income - ded, 0)) },
      ],
      note: "Illustrative salaried standard deduction amounts.",
    };
  },

  section_80c: (v) => {
    const invest = n(v.invest);
    const eligible = Math.min(invest, 150000);
    return {
      results: [
        { label: "Eligible 80C", value: inr.format(eligible) },
        { label: "Unused limit", value: inr.format(Math.max(150000 - invest, 0)) },
      ],
      note: "Max ₹1.5 lakh under section 80C (old regime).",
    };
  },

  capital_gains: (v) => {
    const buy = n(v.buy);
    const sell = n(v.sell);
    const type = v.type;
    const gain = sell - buy;
    let rate = 0.125;
    if (type === "stcg_equity") rate = 0.2;
    if (type === "ltcg_debt") rate = 0.125;
    if (type === "stcg_other") rate = 0.3;
    const tax = Math.max(gain, 0) * rate;
    return {
      results: [
        { label: "Capital gain", value: inr.format(gain), tone: gain >= 0 ? "up" : "down" },
        { label: "Est. tax", value: inr.format(tax) },
        { label: "Rate used", value: `${(rate * 100).toFixed(1)}%` },
      ],
      note: "Simplified post-Budget style rates for education—confirm current law.",
    };
  },

  gst_calc: (v) => {
    const amount = n(v.amount);
    const rate = n(v.rate) / 100;
    const mode = v.mode;
    if (mode === "inclusive") {
      const base = amount / (1 + rate);
      const tax = amount - base;
      return {
        results: [
          { label: "Base", value: inrDec.format(base) },
          { label: "GST", value: inrDec.format(tax) },
          { label: "Total", value: inrDec.format(amount) },
        ],
      };
    }
    const tax = amount * rate;
    return {
      results: [
        { label: "Base", value: inrDec.format(amount) },
        { label: "GST", value: inrDec.format(tax) },
        { label: "Total", value: inrDec.format(amount + tax) },
      ],
    };
  },

  tds: (v) => {
    const amount = n(v.amount);
    const rate = n(v.rate) / 100;
    const tdsAmt = amount * rate;
    return {
      results: [
        { label: "TDS", value: inr.format(tdsAmt) },
        { label: "Net payable", value: inr.format(amount - tdsAmt) },
      ],
    };
  },

  advance_tax: (v) => {
    const tax = n(v.tax);
    return {
      results: [
        { label: "15 Jun (15%)", value: inr.format(tax * 0.15) },
        { label: "15 Sep (45% cum.)", value: inr.format(tax * 0.45) },
        { label: "15 Dec (75% cum.)", value: inr.format(tax * 0.75) },
        { label: "15 Mar (100%)", value: inr.format(tax) },
      ],
      note: "Standard advance-tax installment schedule for individuals.",
    };
  },

  ctc_breakup: (v) => {
    const ctc = n(v.ctc);
    const basic = ctc * 0.4;
    const hra = basic * 0.4;
    const special = ctc * 0.25;
    const employerPf = basic * 0.12;
    const gratuity = (basic * 15) / 26 / 12;
    return {
      results: [
        { label: "Basic (40%)", value: inr.format(basic) },
        { label: "HRA", value: inr.format(hra) },
        { label: "Special allowance", value: inr.format(special) },
        { label: "Employer PF (est.)", value: inr.format(employerPf) },
      ],
      note: "Illustrative CTC structure—offers vary by company.",
    };
  },

  inhand_salary: (v) => {
    const ctc = n(v.ctc) / 12;
    const basic = ctc * 0.4;
    const empPf = basic * 0.12;
    const profTax = 200;
    const gross = ctc - basic * 0.12; // remove employer pf from monthly credit approx
    const inhand = gross - empPf - profTax;
    return {
      results: [
        { label: "Monthly gross (approx)", value: inr.format(gross) },
        { label: "Employee PF", value: inr.format(empPf) },
        { label: "Est. in-hand", value: inr.format(inhand) },
      ],
      note: "Rough take-home before income-tax TDS.",
    };
  },

  pf_calc: (v) => {
    const basic = n(v.basic);
    const emp = basic * 0.12;
    const er = basic * 0.12;
    return {
      results: [
        { label: "Employee PF / mo", value: inr.format(emp) },
        { label: "Employer PF / mo", value: inr.format(er) },
        { label: "Total PF / mo", value: inr.format(emp + er) },
      ],
    };
  },

  epf_interest: (v) => {
    const monthly = n(v.monthly);
    const rate = n(v.rate) / 100 / 12;
    const years = n(v.years);
    const m = years * 12;
    const corpus =
      rate === 0 ? monthly * m : monthly * ((Math.pow(1 + rate, m) - 1) / rate) * (1 + rate);
    return {
      results: [
        { label: "Corpus", value: inr.format(corpus) },
        { label: "Contributed", value: inr.format(monthly * m) },
        { label: "Interest", value: inr.format(corpus - monthly * m), tone: "up" },
      ],
    };
  },

  leave_encash: (v) => {
    const basic = n(v.basic);
    const days = n(v.days);
    const amount = (basic / 30) * days;
    return {
      results: [
        { label: "Encashment", value: inr.format(amount) },
        { label: "Per day rate", value: inrDec.format(basic / 30) },
      ],
    };
  },

  bonus: (v) => {
    const salary = n(v.salary);
    const months = n(v.months);
    return {
      results: [
        { label: "Bonus", value: inr.format(salary * months) },
        { label: "As % of annual", value: `${((months / 12) * 100).toFixed(1)}%` },
      ],
    };
  },

  notice_period: (v) => {
    const days = n(v.notice);
    const served = n(v.served);
    const daily = n(v.salary) / 30;
    const shortfall = Math.max(days - served, 0);
    return {
      results: [
        { label: "Days short", value: String(shortfall) },
        { label: "Buyout (approx)", value: inr.format(shortfall * daily) },
      ],
      note: "Company policy may use basic or gross—confirm with HR.",
    };
  },

  gratuity: (v) => {
    const salary = n(v.salary);
    const years = n(v.years);
    const amount = years >= 5 ? (salary * 15 * years) / 26 : 0;
    return {
      results: [
        { label: "Gratuity", value: inr.format(amount) },
        { label: "Eligible", value: years >= 5 ? "Yes (5+ years)" : "No (< 5 years)" },
      ],
    };
  },

  pension: (v) => {
    const corpus = n(v.corpus);
    const rate = n(v.rate) / 100;
    const annual = corpus * rate;
    return {
      results: [
        { label: "Annual pension (est.)", value: inr.format(annual) },
        { label: "Monthly pension (est.)", value: inr.format(annual / 12) },
        { label: "Corpus", value: inr.format(corpus) },
      ],
      note: "Annuity-rate illustration only—actual pension depends on annuity product.",
    };
  },

  nps: (v) => {
    const monthly = n(v.monthly);
    const years = n(v.years);
    const rate = n(v.rate) / 100 / 12;
    const m = years * 12;
    const corpus =
      rate === 0 ? monthly * m : monthly * ((Math.pow(1 + rate, m) - 1) / rate) * (1 + rate);
    const lump = corpus * 0.6;
    const annuity = corpus * 0.4;
    const pension = (annuity * (n(v.annuityRate) / 100)) / 12;
    return {
      results: [
        { label: "Est. corpus", value: inr.format(corpus) },
        { label: "Lump sum (60%)", value: inr.format(lump) },
        { label: "Annuity corpus (40%)", value: inr.format(annuity) },
        { label: "Monthly pension (est.)", value: inr.format(pension) },
      ],
      note: "Simplified NPS accumulation + 40% annuity assumption.",
    };
  },

  epf_pension: (v) => {
    const pensionable = n(v.pensionable);
    const service = n(v.service);
    // simplified EPS-style: pensionable salary * service / 70
    const monthly = service >= 10 ? (pensionable * service) / 70 : 0;
    return {
      results: [
        { label: "Est. monthly EPS pension", value: inr.format(monthly) },
        { label: "Eligible (10+ yrs)", value: service >= 10 ? "Yes" : "No" },
      ],
      note: "Educational EPS formula sketch—confirm with EPFO passbook/rules.",
    };
  },

  retirement_planner: (v) => {
    const expense = n(v.expense);
    const years = n(v.years);
    const infl = n(v.inflation) / 100;
    const ret = n(v.returnRate) / 100;
    const sip = n(v.sip);
    const futureExp = expense * 12 * Math.pow(1 + infl, years);
    const corpusNeed = ret > infl ? futureExp / (ret - infl) : futureExp * 25;
    const r = ret / 12;
    const m = years * 12;
    const fv =
      r === 0 ? sip * m : sip * ((Math.pow(1 + r, m) - 1) / r) * (1 + r);
    return {
      results: [
        { label: "Corpus needed", value: inr.format(corpusNeed) },
        { label: "SIP corpus (est.)", value: inr.format(fv) },
        {
          label: "Gap / surplus",
          value: inr.format(fv - corpusNeed),
          tone: fv >= corpusNeed ? "up" : "down",
        },
      ],
    };
  },

  swr: (v) => {
    const corpus = n(v.corpus);
    const rate = n(v.rate) / 100;
    const annual = corpus * rate;
    return {
      results: [
        { label: "Safe annual withdrawal", value: inr.format(annual) },
        { label: "Monthly withdrawal", value: inr.format(annual / 12) },
        { label: "SWR used", value: `${n(v.rate)}%` },
      ],
      note: "Classic 4% rule style—adjust for Indian inflation and equity mix.",
    };
  },

  fd: (v) => {
    const P = n(v.amount);
    const r = n(v.rate) / 100;
    const y = n(v.years);
    const freq = Number(v.freq) || 4;
    const fv = P * Math.pow(1 + r / freq, freq * y);
    return {
      results: [
        { label: "Maturity value", value: inr.format(fv) },
        { label: "Interest earned", value: inr.format(fv - P), tone: "up" },
        { label: "Invested", value: inr.format(P) },
      ],
    };
  },

  rd: (v) => {
    const P = n(v.monthly);
    const r = n(v.rate) / 100 / 12;
    const nM = n(v.months);
    const fv = r === 0 ? P * nM : P * ((Math.pow(1 + r, nM) - 1) / r) * (1 + r);
    return {
      results: [
        { label: "Maturity value", value: inr.format(fv) },
        { label: "Total deposited", value: inr.format(P * nM) },
        { label: "Interest", value: inr.format(fv - P * nM), tone: "up" },
      ],
    };
  },

  compound_interest: (v) => {
    const P = n(v.principal);
    const r = n(v.rate) / 100;
    const y = n(v.years);
    const freq = Number(v.freq) || 1;
    const fv = P * Math.pow(1 + r / freq, freq * y);
    return {
      results: [
        { label: "Future value", value: inr.format(fv) },
        { label: "Interest", value: inr.format(fv - P), tone: "up" },
      ],
    };
  },

  simple_interest: (v) => {
    const P = n(v.principal);
    const r = n(v.rate) / 100;
    const y = n(v.years);
    const interest = P * r * y;
    return {
      results: [
        { label: "Interest", value: inr.format(interest), tone: "up" },
        { label: "Total amount", value: inr.format(P + interest) },
      ],
    };
  },

  savings_interest: (v) => {
    const bal = n(v.balance);
    const rate = n(v.rate) / 100;
    const days = n(v.days);
    const interest = (bal * rate * days) / 365;
    return {
      results: [
        { label: "Interest for period", value: inrDec.format(interest) },
        { label: "Annualised (approx)", value: inr.format(bal * rate) },
      ],
    };
  },

  cc_emi: (v) => {
    const res = emi(n(v.amount), n(v.rate), n(v.months) / 12);
    if (!res) return { results: [], note: "Enter valid card EMI details." };
    return {
      results: [
        { label: "EMI", value: inr.format(res.emi) },
        { label: "Total interest", value: inr.format(res.interest) },
        { label: "Total payable", value: inr.format(res.total) },
      ],
    };
  },

  cc_payoff: (v) => {
    const bal = n(v.balance);
    const apr = n(v.apr) / 100 / 12;
    const pay = n(v.payment);
    let months = 0;
    let left = bal;
    let interestPaid = 0;
    while (left > 0 && months < 600) {
      const interest = left * apr;
      interestPaid += interest;
      left = left + interest - pay;
      months += 1;
      if (pay <= interest + 1) {
        return {
          results: [{ label: "Status", value: "Payment too low to pay off" }],
          note: "Increase monthly payment above interest.",
        };
      }
    }
    return {
      results: [
        { label: "Months to payoff", value: String(months) },
        { label: "Years", value: (months / 12).toFixed(1) },
        { label: "Interest paid", value: inr.format(interestPaid) },
      ],
    };
  },

  credit_util: (v) => {
    const limit = n(v.limit);
    const used = n(v.used);
    const util = limit > 0 ? (used / limit) * 100 : 0;
    const tone = util <= 30 ? "up" : util <= 50 ? undefined : "down";
    return {
      results: [
        { label: "Utilization", value: `${util.toFixed(1)}%`, tone },
        { label: "Available credit", value: inr.format(Math.max(limit - used, 0)) },
      ],
      note: "Many scorers prefer utilization under ~30%.",
    };
  },

  term_insurance: (v) => {
    const cover = n(v.cover);
    const age = n(v.age);
    const years = n(v.years);
    // rough annual premium heuristic
    const perLakh = 8 + Math.max(age - 25, 0) * 0.35 + years * 0.05;
    const annual = (cover / 100000) * perLakh;
    return {
      results: [
        { label: "Est. annual premium", value: inr.format(annual) },
        { label: "Est. monthly", value: inr.format(annual / 12) },
        { label: "Cover", value: inr.format(cover) },
      ],
      note: "Ballpark term premium heuristic—not a quote from an insurer.",
    };
  },

  life_insurance: (v) => {
    const income = n(v.income);
    const years = n(v.years);
    const liabilities = n(v.liabilities);
    const cover = income * years + liabilities;
    return {
      results: [
        { label: "Suggested cover", value: inr.format(cover) },
        { label: "Income multiple", value: `${years}x` },
      ],
      note: "Human-life-value style estimate for planning conversations.",
    };
  },

  health_premium: (v) => {
    const cover = n(v.cover);
    const age = n(v.age);
    const members = n(v.members);
    const base = (cover / 500000) * (4500 + Math.max(age - 30, 0) * 180);
    const premium = base * (1 + (members - 1) * 0.55);
    return {
      results: [
        { label: "Est. annual premium", value: inr.format(premium) },
        { label: "Per member (approx)", value: inr.format(premium / members) },
      ],
      note: "Illustrative family-floater style estimate.",
    };
  },

  vehicle_insurance: (v) => {
    const idv = n(v.idv);
    const rate = n(v.rate) / 100;
    const od = idv * rate;
    const tp = n(v.tp);
    return {
      results: [
        { label: "Own damage (est.)", value: inr.format(od) },
        { label: "Third party", value: inr.format(tp) },
        { label: "Total premium (est.)", value: inr.format(od + tp) },
      ],
      note: "OD + TP sketch—add-ons and NCB change real quotes.",
    };
  },

  profit_margin: (v) => {
    const cost = n(v.cost);
    const price = n(v.price);
    const profit = price - cost;
    const margin = price > 0 ? (profit / price) * 100 : 0;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;
    return {
      results: [
        { label: "Profit", value: inr.format(profit), tone: profit >= 0 ? "up" : "down" },
        { label: "Margin %", value: `${margin.toFixed(2)}%` },
        { label: "Markup %", value: `${markup.toFixed(2)}%` },
      ],
    };
  },

  breakeven: (v) => {
    const fixed = n(v.fixed);
    const price = n(v.price);
    const variable = n(v.variable);
    const contrib = price - variable;
    const units = contrib > 0 ? fixed / contrib : 0;
    return {
      results: [
        { label: "Break-even units", value: units.toFixed(0) },
        { label: "Break-even revenue", value: inr.format(units * price) },
        { label: "Contribution / unit", value: inr.format(contrib) },
      ],
    };
  },

  depreciation: (v) => {
    const cost = n(v.cost);
    const salvage = n(v.salvage);
    const years = n(v.years);
    const method = v.method;
    if (method === "wdv") {
      const rate = n(v.rate) / 100;
      const value = cost * Math.pow(1 - rate, years);
      return {
        results: [
          { label: "Book value", value: inr.format(value) },
          { label: "Depreciated", value: inr.format(cost - value) },
        ],
        note: "Written-down value method.",
      };
    }
    const annual = years > 0 ? (cost - salvage) / years : 0;
    return {
      results: [
        { label: "Annual depreciation", value: inr.format(annual) },
        { label: "Book value after tenure", value: inr.format(salvage) },
      ],
      note: "Straight-line method.",
    };
  },

  roi: (v) => {
    const invest = n(v.invest);
    const gain = n(v.gain);
    const roi = invest > 0 ? ((gain - invest) / invest) * 100 : 0;
    return {
      results: [
        { label: "Net profit", value: inr.format(gain - invest), tone: gain >= invest ? "up" : "down" },
        { label: "ROI", value: `${roi.toFixed(2)}%`, tone: roi >= 0 ? "up" : "down" },
      ],
    };
  },

  business_valuation: (v) => {
    const earnings = n(v.earnings);
    const multiple = n(v.multiple);
    const value = earnings * multiple;
    return {
      results: [
        { label: "Estimated value", value: inr.format(value) },
        { label: "Earnings", value: inr.format(earnings) },
        { label: "Multiple used", value: `${multiple}x` },
      ],
      note: "Simple earnings-multiple valuation for early planning.",
    };
  },
};
