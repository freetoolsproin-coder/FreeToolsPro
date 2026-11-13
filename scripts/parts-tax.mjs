import { computeTax } from "../src/tools/calcs.js";
import { inr, inr2, gstSplit, hraExempt, gratuity, taxStory } from "./lib/bookcraft.mjs";

function ch(title, paragraphs, sections) {
  return { title, paragraphs, sections };
}

function slabTable(t, caption) {
  return {
    caption,
    headers: ["Slab", "Rate", "Income in slab", "Tax"],
    rows: t.breakdown.map((row) => [String(row[0]).replaceAll("₹", "Rs. "), String(row[1]), inr(row[2]), inr(row[3])]),
  };
}

function taxFile(p) {
  const newer = taxStory(p.income, "new", 0);
  const older = taxStory(p.income, "old", p.deductions);
  const better = newer.total <= older.total ? "new" : "old";
  return {
    heading: p.title,
    paragraphs: [
      `${p.who} ${p.note}`,
      `Gross salary in this file is Rs. ${inr(p.income)}. Under the new regime the standard deduction used by the site calculator is Rs. ${inr(newer.std)}, so taxable income is Rs. ${inr(newer.taxable)}. Slab tax is Rs. ${inr(newer.slabTax)}. Rebate is Rs. ${inr(newer.rebate)}. Cess takes it to about Rs. ${inr(newer.total)}.`,
      `Under the old regime the standard deduction in the same calculator is Rs. ${inr(older.std)}, and this file allows Rs. ${inr(p.deductions)} of other deductions. Taxable income is Rs. ${inr(older.taxable)}. Tax after rebate and cess is about Rs. ${inr(older.total)}.`,
      better === "new"
        ? `On these deductions the new regime is the smaller bill, by about Rs. ${inr(older.total - newer.total)}. That is not a personality. If the deductions were larger, the old regime could win. ${p.who.split(" ")[0]} should not invent deductions to force that win.`
        : `On these deductions the old regime is smaller, by about Rs. ${inr(newer.total - older.total)}. The deductions have to be real and supported. A deduction that costs more than the tax it saves is not a saving.`,
      "Figures follow the FY 2026-27 slabs used on FreeToolsPro: new-regime bands at nil, 5, 10, 15, 20, 25 and 30 percent, a Rs. 75,000 standard deduction for salaried people, and the Section 87A rebate on taxable income up to Rs. 12 lakh. Confirm the year you are filing. A later budget can move a line.",
    ],
    tables: [
      slabTable(newer, "New regime, slab by slab."),
      slabTable(older, "Old regime, with the deductions stated in this file."),
    ],
  };
}

export function taxBook() {
  const people = [
    { title: "Just under the rebate line", who: "Asha earns a salary in Nagpur.", income: 1200000, deductions: 150000, note: "She wants to know why colleagues talk about a tax-free salary near this level. The new regime's rebate is about taxable income, after the standard deduction, not about the gross figure printed on the appointment letter." },
    { title: "A bonus that crosses the line", who: "Karan has a steady salary and a bonus in Pune.", income: 1450000, deductions: 200000, note: "The bonus is the part that changes the year. He does not annualise a good month and then forget it in July. The file uses the whole year's expected gross." },
    { title: "A large HRA city", who: "Nidhi rents in Mumbai.", income: 1800000, deductions: 450000, note: "The deduction figure includes a serious HRA exemption and 80C, which exist only if she is in the old regime and has the papers. She does not get to use them and also take the new-regime slabs." },
    { title: "Almost no deductions", who: "Rohit lives with his parents in Jaipur and invests little.", income: 1100000, deductions: 0, note: "He could open a tax-saving deposit in March. He should not, unless he wanted the product anyway. A empty deduction column usually means the new regime." },
    { title: "A home loan in the old regime", who: "Meenal pays home-loan interest in Coimbatore.", income: 2200000, deductions: 350000, note: "Interest on a self-occupied house has a cap in the old regime. She entered only what she can claim, not the whole interest the bank charged." },
    { title: "Two incomes in one return", who: "Farhan has a salary and a small freelance fee in Lucknow.", income: 1600000, deductions: 100000, note: "The freelance fee is inside the gross for this illustration. Real life may need a different head of income and may restrict regime switching. He should not paste this file into a return without reading that rule." },
    { title: "A first job", who: "Sana started work in October in Bhopal.", income: 700000, deductions: 0, note: "Half a year of salary is not a full-year salary. She uses the amount she will actually receive in the financial year. TDS on a new job is often clumsy. The return is where it gets corrected." },
    { title: "High salary, surcharge still far", who: "Vikram leads a team in Hyderabad.", income: 4200000, deductions: 200000, note: "He is not in surcharge territory. The marginal rate is still the useful number, because the next rupee of bonus is taxed at the top slab he has entered, plus cess." },
    { title: "Old regime only if the papers exist", who: "Lata has receipts in a drawer in Varanasi.", income: 1350000, deductions: 280000, note: "The receipts are 80C, health insurance and a tuition fee. If a receipt is missing in July, it is not a deduction. She runs the file twice, once with the drawer and once without." },
    { title: "Rent but no HRA", who: "Joseph's employer in Kochi does not pay HRA.", income: 900000, deductions: 80000, note: "A rent deduction under the old regime, where it exists, is not the same as HRA exemption and the cap is smaller. He did not type a metro HRA figure he does not receive." },
    { title: "The 15 lakh example", who: "This file is the worked case the site already uses as a check.", income: 1500000, deductions: 500000, note: "Under the new regime, Rs. 15 lakh of salary leaves taxable income of Rs. 14.25 lakh after the Rs. 75,000 standard deduction. The slabs produce Rs. 93,750 of tax before cess. With cess the bill is about Rs. 97,500. If this file ever disagrees with that, the slabs in the calculator have moved and this book should be regenerated." },
    { title: "A raise that does not feel like a raise", who: "Catherine in Chennai is due a Rs. 1 lakh raise.", income: 1600000, deductions: 150000, note: "She compares this gross with Rs. 15 lakh, not with her sense of fairness. The extra tax is the price of the last slab she touches. Knowing it stops the raise from feeling stolen." },
  ];

  return [
    ch("The bill has an order", [
      "Salary tax looks tangled because several names arrive at once: gross, standard deduction, slab, rebate, cess. They are a queue, not a pile. Start with gross income for the year. Subtract the standard deduction if you are salaried. Subtract other deductions only if the regime you chose allows them. What remains is taxable income. Tax it slab by slab. Then see if a rebate cancels some of that tax. Then add cess.",
      "A slab rate is not a rate on your whole income. The slice inside each band is taxed at that band's rate. A person who has entered the 15 percent band still has the lower bands taxed at lower rates. People say 'I am in the 30 percent slab' and then multiply their whole salary by 0.3. That overstates the bill.",
      "The new regime for FY 2026-27, as this site calculates it, taxes income up to Rs. 4 lakh at nil, then 5, 10, 15, 20 and 25 percent through successive bands, and 30 percent above Rs. 24 lakh. Salaried people get a Rs. 75,000 standard deduction. A rebate can wipe the tax when taxable income is up to Rs. 12 lakh. Just above that line, marginal relief stops the tax from jumping by more than the extra income. The old regime keeps a smaller standard deduction and allows the familiar deductions, at higher slab rates.",
      "This is a map for salaried readers. Capital gains, business income and the fine print of a particular deduction are outside it. The author of this book works as a UI and UX lead, not as your assessing officer. Use the map to read the calculator. Use the official form to file.",
    ]),
    ch("Choosing a regime without theatre", [
      "The new regime is kinder when your deductions are thin. The old regime is kinder when HRA, a home-loan interest claim, and the capped saving sections are large and real. There is no moral difference. There is a rupee difference, and the files compute it.",
      "Count a deduction only if you would spend the money anyway, or if the thing you buy is worth owning after the tax. A product you buy only to save tax can cost you a rupee to save thirty paise. That is a purchase, not a strategy.",
      "Salaried people without business income can usually choose again next year. Tell the employer early so the monthly TDS is close to the final bill. A year of the wrong TDS is not illegal. It is a large payable, or a refund you wait for. Both are annoying.",
      "Form 16 is the employer's version of your salary. Your return should be able to find those numbers. If you add a deduction the employer did not see, keep the proof. If you forget income the employer did not pay, such as interest on a deposit, the form will not remind you.",
    ]),
    { title: "Worked files", paragraphs: ["Every file is salaried, below 60, and uses the calculator's FY 2026-27 logic. Deductions in the old regime are the ones the person can support, not a wish list."], sections: people.map(taxFile) },
    ch("HRA in one sitting", [
      "House rent allowance is an old-regime exemption. The exempt part is the lowest of three numbers: the HRA you received, the rent you paid minus 10 percent of salary, and 50 percent of salary in Delhi, Mumbai, Kolkata or Chennai, or 40 percent elsewhere. Salary here means basic pay plus dearness allowance, not your full CTC.",
      "If you do not receive HRA, you do not run this sum. A different, smaller rent deduction may exist under the old regime. Do not paste a metro percentage onto a city that is not one of the four, and do not paste it onto Bengaluru because it feels like a metro. For HRA, it is not.",
    ], [
      (() => {
        const h = hraExempt({ basicMonthly: 50000, hraMonthly: 20000, rentMonthly: 22000, metro: false });
        return {
          heading: "Outside the four metros",
          paragraphs: [
            `Basic Rs. 50,000 a month, HRA Rs. 20,000, rent Rs. 22,000, not in Delhi, Mumbai, Kolkata or Chennai. HRA received is Rs. ${inr(h.hra)}. Rent minus 10 percent of salary is Rs. ${inr(h.rentMinus)}. Forty percent of salary is Rs. ${inr(h.cap)}. The lowest is Rs. ${inr(h.exempt)}, and that is the exempt part. The rest of the HRA is taxed, and only if the old regime is the one in use.`,
          ],
        };
      })(),
      (() => {
        const h = hraExempt({ basicMonthly: 80000, hraMonthly: 40000, rentMonthly: 45000, metro: true });
        return {
          heading: "A metro rent",
          paragraphs: [
            `Basic Rs. 80,000, HRA Rs. 40,000, rent Rs. 45,000, in a metro for HRA purposes. The three candidates are Rs. ${inr(h.hra)}, Rs. ${inr(h.rentMinus)} and Rs. ${inr(h.cap)}. Exempt HRA is Rs. ${inr(h.exempt)}. If the rent were lower, the middle number would fall and so would the exemption. Paying more rent than you do, on paper, is not a technique. It is a false return.`,
          ],
        };
      })(),
    ]),
    ch("Words worth keeping straight", ["The names you will see on a form or a calculator."], [
      ["Gross", ["Salary before the tax deduction. Not take-home. Not CTC. The tax calculator wants the income it is going to tax, and the label on the page tells you which."]],
      ["Standard deduction", ["A flat amount subtracted for salaried people. In the new regime, as modelled here, it is Rs. 75,000. In the old regime it is Rs. 50,000. You do not 'claim' it with a receipt."]],
      ["Rebate", ["A reduction in tax, not in income. Under the new regime it can cancel tax when taxable income is up to Rs. 12 lakh. It is not a refund of your salary."]],
      ["Cess", ["Four percent added after tax and any surcharge. People forget it and then think the calculator is wrong by a small amount. It is the cess."]],
      ["Marginal relief", ["A cap so that just above a rebate or surcharge threshold, the extra tax does not exceed the extra income. It is why the bill does not leap like a cliff."]],
      ["TDS", ["Tax your employer already deducted. It is a payment towards the bill, not a second tax. The return subtracts it."]],
    ]),
  ];
}

function takeHome({ ctc, basicPct, pfMode, pt, regime, deductions }) {
  const basicM = (ctc * basicPct) / 100 / 12;
  const pfM = pfMode === "none" ? 0 : pfMode === "capped" ? Math.min(basicM, 15000) * 0.12 : basicM * 0.12;
  const grat = basicM * 12 * 0.0481;
  const gross = ctc - pfM * 12 - grat;
  const ded = regime === "old" ? Math.min(150000, pfM * 12) + deductions : 0;
  const t = computeTax({ income: gross, regime, deductions: ded, salaried: true });
  const net = gross - pfM * 12 - pt - t.total;
  return { basicM, pfM, grat, gross, tax: t.total, net, monthly: net / 12, ded };
}

export function salaryBook() {
  const offers = [
    { title: "A twelve-lakh CTC", who: "Aditi", city: "Indore", ctc: 1200000, basicPct: 50, pfMode: "capped", pt: 2400, regime: "new", deductions: 0, note: "Her offer says twelve lakh. She wants the monthly credit, not the phrase." },
    { title: "The same CTC, full PF", who: "Aditi's other offer", city: "Indore", ctc: 1200000, basicPct: 50, pfMode: "full", pt: 2400, regime: "new", deductions: 0, note: "Same headline. PF is on the full basic, not capped at the Rs. 15,000 wage. Take-home falls. Retirement savings rise. She has to want that trade, not discover it in April." },
    { title: "A higher basic", who: "Naveen", city: "Coimbatore", ctc: 1800000, basicPct: 40, pfMode: "capped", pt: 2500, regime: "new", deductions: 0, note: "Basic is 40 percent of CTC. Gratuity and PF, where they follow basic, are smaller than in a 50 percent structure. Allowances make up the rest and may be taxable." },
    { title: "Old regime with real deductions", who: "Naveen, second pass", city: "Coimbatore", ctc: 1800000, basicPct: 40, pfMode: "capped", pt: 2500, regime: "old", deductions: 150000, note: "He can support Rs. 1,50,000 of deductions besides the PF the calculator already considers inside its old-regime sum, up to the cap the function applies. If the papers are weak, this pass is fiction." },
    { title: "A first offer at six lakh", who: "Ritika", city: "Ranchi", ctc: 600000, basicPct: 50, pfMode: "capped", pt: 0, regime: "new", deductions: 0, note: "No professional tax in this file. A state that charges it will shave the month. She should ask which state the payroll uses." },
    { title: "A large CTC and a modest basic", who: "Harsh", city: "Gurgaon", ctc: 3600000, basicPct: 35, pfMode: "full", pt: 2400, regime: "new", deductions: 0, note: "The CTC is loud. Basic is 35 percent. Variable pay is not in this file at all. If the offer includes a bonus he might not get, he should delete it before he believes the monthly figure." },
    { title: "No PF in the structure", who: "A contract role", city: "Pune", ctc: 1500000, basicPct: 50, pfMode: "none", pt: 2400, regime: "new", deductions: 0, note: "Some contracts do not deduct PF. Take-home looks richer. There is no employer PF hiding inside the CTC either. Compare it with a job that has PF by adding the missing savings back in your head. Otherwise the richer month is partly a missing future." },
    { title: "Gratuity is not this month's money", who: "Leela", city: "Thiruvananthapuram", ctc: 960000, basicPct: 50, pfMode: "capped", pt: 0, regime: "new", deductions: 0, note: "The illustration treats gratuity provision as 4.81 percent of basic, inside CTC, not paid monthly. She will see it only if she leaves after the service the law requires." },
  ];

  const sections = offers.map((o) => {
    const t = takeHome(o);
    return {
      heading: o.title,
      paragraphs: [
        `${o.who} in ${o.city}. ${o.note} CTC is Rs. ${inr(o.ctc)}. Basic is ${o.basicPct} percent of CTC.`,
        `Monthly basic is about Rs. ${inr(t.basicM)}. Employee PF is about Rs. ${inr(t.pfM)} a month, and the employer PF in this model matches it and sits inside CTC. Gratuity provision is about Rs. ${inr(t.grat)} a year. Gross salary after those employer costs is about Rs. ${inr(t.gross)}.`,
        `Income tax under the ${o.regime} regime, including cess, is about Rs. ${inr(t.tax)} for the year. Professional tax in the file is Rs. ${inr(o.pt)}. Take-home is about Rs. ${inr(t.net)} a year, which is about Rs. ${inr(t.monthly)} a month.`,
        "This mirrors the in-hand calculator's shape: employer PF and gratuity leave CTC before you see them, then your PF, professional tax and income tax leave the gross. A real offer can split allowances differently. Use the offer's basic, not a guess, when you have it.",
      ],
      table: {
        caption: "One year, rounded.",
        headers: ["Piece", "Rupees"],
        rows: [
          ["CTC", inr(o.ctc)],
          ["Employer PF", inr(t.pfM * 12)],
          ["Gratuity provision", inr(t.grat)],
          ["Gross", inr(t.gross)],
          ["Your PF", inr(t.pfM * 12)],
          ["Income tax", inr(t.tax)],
          ["Professional tax", inr(o.pt)],
          ["In hand", inr(t.net)],
        ],
      },
    };
  });

  const g1 = gratuity(50000, 8);
  const g2 = gratuity(28000, 6);

  return [
    ch("CTC is the employer's sentence", [
      "Cost to company is what the employer says you cost. It includes pieces that never arrive as a bank credit. Employer provident fund and a gratuity provision are the usual ones. A mediclaim premium and a bonus you have not earned yet are sometimes in there too. Take-home is what is left after those, and after your own PF, professional tax and income tax.",
      "Two offers with the same CTC can differ by thousands a month. The one with a higher basic builds more PF and gratuity and pays you less now. The one with a lower basic does the reverse, and more of it may be taxable. Neither is kinder until you write the month and the retirement piece on the same line.",
      "Variable pay is not monthly pay. If the letter says part of CTC is a performance bonus, delete it from the budget. You can celebrate it if it arrives. You cannot pay rent with it in advance.",
    ]),
    ch("PF and the habit of not withdrawing it", [
      "Each month, 12 percent of basic plus dearness allowance is the usual employee share, and the employer puts in a match. Part of the employer's share, up to a cap, goes to the pension scheme. The rest, with interest, stays in EPF. Some employers cap the wage on which PF is calculated, at the statutory ceiling. Others use the full basic. The second one lowers take-home and raises the fund.",
      "When you change jobs, transfer the balance with your UAN. Withdrawing it feels like a bonus and ends the compounding. Withdrawals before five years of continuous service can be taxed. Interest on a very large employee contribution can be taxed as well. Those are reasons to look at the passbook, not reasons to empty it on a job change.",
      "Gratuity, for an employer covered by the Payment of Gratuity Act, is 15 days of last drawn basic plus DA for each completed year, with the month counted as 26 working days. A final part-year of more than six months can count as a full year. Five years is the usual eligibility, with exceptions such as death or disability. Tax-free gratuity has a cap. The formula here is the gross figure, before that cap.",
    ]),
    { title: "Worked offers", paragraphs: ["Professional tax, basic share and PF mode are stated in each file. Change them to match the letter in your hand. The tax regime is part of the offer comparison because TDS will follow it."], sections },
    ch("Gratuity on two slips", [
      `Last drawn basic plus DA of Rs. 50,000 and 8 years of service give about Rs. ${inr(g1)} under the 15-by-26 formula. Seven years and seven months would still be counted as 8 if the part-year rule applies. Leaving a month too early can cost a whole year in the formula. Check the dates before you resign for a small raise.`,
      `A basic plus DA of Rs. 28,000 and 6 years gives about Rs. ${inr(g2)}. It is real money and it is not a monthly allowance. Do not add it into this month's budget. Do not forget it when you compare a job that pays gratuity with a contract that does not.`,
    ]),
    ch("Words worth keeping straight", ["The words on an offer, translated."], [
      ["CTC", ["Cost to company. The employer's total. Not your bank credit."]],
      ["Basic", ["The core of the salary. PF and gratuity usually follow it. A higher basic is not free money."]],
      ["Gross", ["After the employer-side pieces have been lifted out of CTC, in the way this calculator models it. Still not take-home."]],
      ["In-hand", ["After your PF, professional tax and income tax. This is the monthly planning number, and only if variable pay was left out."]],
      ["UAN", ["The number that lets PF follow you from one employer to the next. Transfer beats withdrawal."]],
      ["Gratuity", ["A lump at the end of long service. It is earned by staying, and it is calculated on the last basic, not on CTC."]],
    ]),
  ];
}

export function gstBook() {
  const bills = [
    { title: "A design invoice inside the state", who: "A studio in Jaipur billing a client in Jaipur", amount: 50000, rate: 18, inclusive: false, inter: false, note: "The quote was agreed before tax. GST is added. The client who says 'fifty thousand including everything' is describing a different invoice." },
    { title: "A fee that already includes tax", who: "A tutor in Patna who was paid a round figure", amount: 11800, rate: 18, inclusive: true, inter: false, note: "The parent paid Rs. 11,800 and believes that is the fee. Eighteen percent has to be lifted out by division, not shaved off by subtraction." },
    { title: "A low rate on a simple supply", who: "A small eatery in Madurai", amount: 840, rate: 5, inclusive: true, inter: false, note: "Five percent on an inclusive bill is a small tax and an easy place to use the wrong base. The kitchen still needs the base and the tax in two lines." },
    { title: "A sale to another state", who: "A seller in Gujarat shipping to Tamil Nadu", amount: 25000, rate: 18, inclusive: false, inter: true, note: "The tax does not split. It is IGST for the whole rate. Writing CGST and SGST on an inter-state invoice is a wrong form, not a different tax." },
    { title: "Before September 2025", who: "A bill from July 2025 being checked in a later month", amount: 11200, rate: 12, inclusive: true, inter: false, note: "Twelve percent is an older rate. It still matters when you are reading a bill issued before the rate change of 22 September 2025. A new invoice for the same goods may not use it." },
    { title: "A special rate", who: "A retailer ringing up an item at the special 40 percent rate", amount: 15000, rate: 40, inclusive: false, inter: false, note: "Forty percent is not the ordinary rate. It applies to a short list. If you are unsure the item is on that list, do not use this file to decide. Use it only after the HSN says so." },
    { title: "A round professional fee", who: "A consultant in Chandigarh", amount: 100000, rate: 18, inclusive: false, inter: true, note: "One lakh before tax, client in another state. The IGST is the number to set aside, not to spend, because it is not the consultant's money." },
    { title: "Gold-rate curiosity", who: "A jeweller checking a 3 percent line", amount: 200000, rate: 3, inclusive: false, inter: false, note: "Three percent is in the calculator for goods such as gold. This file only does the arithmetic. It does not decide that the ornament in your hand is taxed at 3 percent." },
    { title: "A tiny diamond rate", who: "An importer checking 0.25 percent", amount: 800000, rate: 0.25, inclusive: false, inter: true, note: "A quarter of one percent looks like a rounding error and is not. On a large base it is still a real line on the invoice." },
    { title: "Exempt, so the rate is zero", who: "A bill for an exempt supply", amount: 4000, rate: 0, inclusive: false, inter: false, note: "Zero is a rate you choose because the supply is exempt or nil-rated, not because you would prefer not to charge tax. The arithmetic is dull on purpose." },
    { title: "Eighteen percent people subtract", who: "A freelancer who subtracted 18 percent from an inclusive fee", amount: 59000, rate: 18, inclusive: true, inter: false, note: "Subtracting 18 percent of 59,000 is not the same as removing 18 percent GST. The correct base is lower than the wrong one. This file shows the division." },
    { title: "A five percent add", who: "A product priced at the counter before tax", amount: 2400, rate: 5, inclusive: false, inter: false, note: "Adding 5 percent is the rare easy case. It is still worth writing the base and the tax on separate lines so a later credit note has something to point at." },
  ];

  const sections = bills.map((b) => {
    const g = gstSplit(b.amount, b.rate, b.inclusive, b.inter);
    return {
      heading: b.title,
      paragraphs: [
        `${b.who}. ${b.note}`,
        b.inclusive
          ? `The amount in hand, Rs. ${inr2(b.amount)}, includes GST at ${b.rate} percent. Divide by ${((100 + b.rate) / 100).toFixed(2)}. The base is Rs. ${inr2(g.base)}. GST is Rs. ${inr2(g.gst)}.`
          : `The amount Rs. ${inr2(b.amount)} is before tax. GST at ${b.rate} percent is Rs. ${inr2(g.gst)}. The bill total is Rs. ${inr2(g.total)}.`,
        b.inter
          ? `The supply crosses states, so the GST is IGST of Rs. ${inr2(g.gst)}. There is no CGST or SGST line.`
          : `The supply stays inside the state, so the GST splits in half: CGST Rs. ${inr2(g.half)} and SGST Rs. ${inr2(g.half)}.`,
        "Since 22 September 2025 most ordinary goods and services sit in the 5 percent or 18 percent slab, with 40 percent on a short list of luxury and sin goods. Older 12 and 28 percent rates belong on older bills. The rate on a new invoice comes from the HSN or SAC, not from this paragraph.",
      ],
    };
  });

  return [
    ch("Base first, then the rate", [
      "GST mistakes on a small invoice are usually one of two moves. Adding the rate to a price that already includes it. Or subtracting the rate from an inclusive price instead of dividing. Both make the tax wrong by enough to annoy a buyer and a return.",
      "To add GST, multiply the base by the rate. To remove GST, divide the inclusive price by one plus the rate. A bill of Rs. 1,180 at 18 percent has a base of Rs. 1,000 and GST of Rs. 180. Subtracting 18 percent from 1,180 invents a different tax. It is a common invention. It is still wrong.",
      "Inside a state the tax splits equally into CGST and SGST. Across states it is IGST for the whole amount. The place of supply decides which story you are in. When you are unsure, stop and check before you print. The calculator will obediently split whatever rate you type.",
    ]),
    ch("The rate is not a mood", [
      "Most everyday supplies now fall in 5 percent or 18 percent. Forty percent is a special list. Twelve and twenty-eight survive on invoices from before 22 September 2025 and should not be copied forward out of habit. Three percent and a quarter percent exist for particular goods. Exempt means zero because the law says so.",
      "If you do not know the HSN or SAC, you do not know the rate. A book can teach the arithmetic. It cannot see your product. Look up the code, then come back and run the number.",
      "GST you collect is not revenue. It is due to the government when you file. Spending it because the bank balance looks healthy is how small businesses get surprised. Park it. Your own eligible input tax reduces what you pay. That net figure, not the gross collection, is the one to fear and to fund.",
    ]),
    { title: "Worked invoices", paragraphs: ["Each invoice is a story about the base. Round to the paisa at the end if your software does. Rounding every line and then adding can disagree by a rupee. A rupee is not a different tax theory."], sections },
    ch("Words worth keeping straight", ["Short, and enough for a bill."], [
      ["Base", ["The price before GST. Tax is a percent of this, not of the inclusive total."]],
      ["Inclusive", ["A price that already hides the tax. You divide, you do not subtract."]],
      ["CGST and SGST", ["The two halves of an intra-state GST. Same amount, different governments."]],
      ["IGST", ["The whole GST on an inter-state supply. It is not added on top of CGST."]],
      ["HSN or SAC", ["The code that points at the rate. Arithmetic comes after the code."]],
      ["Input tax", ["GST you paid on business purchases and may be allowed to set off against GST you collected. Not every purchase qualifies. The return, not this glossary, decides."]],
    ]),
  ];
}
