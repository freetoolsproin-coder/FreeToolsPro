import { loanChapter, loanStats, inr, sipRows, lumpsum, ppfBalance, fdMaturity, cardPayoff } from "../lib/calc.mjs";

function ch(title, paragraphs, sections) {
  return { title, paragraphs, sections };
}

const loanGlossary = ch(
  "Words the sanction letter uses",
  ["A quote is easier to read when the nouns are familiar. These are working definitions for this book, not the legal text of a loan agreement."],
  [
    ["EMI", ["The equated monthly instalment. The amount stays the same while the mix inside it changes. Early on, more of it is interest. Later, more of it is principal."]],
    ["Principal", ["The amount you still owe, or the amount you borrowed at the start, depending on the sentence. In a schedule, principal paid is the part of the EMI that reduces the balance."]],
    ["Tenure", ["The number of months the lender used to compute the EMI. A longer tenure lowers the EMI and raises the interest you pay over the life of the loan."]],
    ["Floating rate", ["A rate that can be reset when the lender's benchmark moves. Your EMI may change, or the tenure may change and the EMI may stay put. Ask which one your agreement does."]],
    ["Fixed rate", ["A rate that stays for a stated period or for the whole loan. The EMI is calmer. Prepayment is often charged. Read that clause before you treat the loan as easy to close."]],
    ["Processing fee", ["Money paid up front to open the loan. It is not inside the EMI. Add it when you compare two lenders, along with any insurance the branch has bundled in."]],
    ["Prepayment", ["Paying more than the EMI, or closing the loan early. On a floating-rate home loan to an individual, a fee is often not charged. Confirm it for your own account. Ask the lender to cut the tenure rather than the EMI if you want to save more interest."]],
    ["Balance transfer", ["Moving the outstanding amount to a new lender for a lower rate. It helps only after you subtract the new fee, the new insurance, and any break fee on the old loan. A small rate gap on a small balance is often not worth the paperwork."]],
    ["Sanction", ["The lender's yes, with the amount, rate, tenure and conditions written down. The EMI you planned is not real until this letter matches it."]],
    ["LTV", ["Loan to value. The loan as a share of the property value the lender accepts. A higher share means a smaller down payment and less room if prices fall or the valuation comes in low."]],
    ["Moratorium", ["A period when you pay less, or only interest, at the start. The unpaid interest is usually added to the balance. The EMI later feels heavier because the principal grew while you waited."]],
    ["Benchmark", ["The external or internal rate your floating loan is tied to. When someone says the rate changed, this is the number that moved, plus the spread the lender added for you."]],
  ]
);

export function emiBook() {
  const scenarios = [
    { title: "A studio and a 20-year flat", who: "Meera runs a two-person design studio in Pune", want: "She wants a flat she can move into before her rented lease ends, without a roommate.", loan: 6500000, rate: 8.4, years: 20, extra: 8000, fee: 15000, note: "She tested a 30-year EMI because it looked kinder on a slow month at the studio. The extra interest was larger than a year of rent. She stayed at 20 years and kept the extra Rs. 8,000 for months when a client paid late." },
    { title: "Parents moving in", who: "Imran teaches in a college in Lucknow", want: "He wants a ground-floor house so his parents can stop climbing stairs.", loan: 4200000, rate: 8.7, years: 25, extra: 0, fee: 10000, note: "The 25-year tenure was a family decision, not a bank's suggestion. His father's pension cannot carry an EMI, so Imran did not want a shorter loan that would break if he changed cities. He wrote the prepayment plan for later, when a promotion actually arrives." },
    { title: "Fifteen years, two salaries", who: "Joseph and Anitha both work in Kochi", want: "They want the loan gone before their elder child starts college.", loan: 9000000, rate: 8.5, years: 15, extra: 15000, fee: 20000, note: "Two salaries made the 15-year EMI possible. They still ran the numbers as if one salary stopped for six months. The emergency fund, not the EMI, is what makes the short tenure safe." },
    { title: "Plot plus a house that is not built yet", who: "Harpreet is building on family land outside Chandigarh", want: "He needs a loan for construction, released in stages, not a single cheque.", loan: 5500000, rate: 9, years: 20, extra: 5000, fee: 12000, note: "A construction loan does not behave like a finished-flat loan. Interest during the build can be added to the principal if he pays only a part EMI. He asked the branch what the balance will be on the day the full EMI starts, and he put that number in the schedule, not the sanctioned amount." },
    { title: "The 30-year quote", who: "Divya has a new job in Bengaluru and a thin emergency fund", want: "She was offered 30 years because the EMI fitted a take-home figure she had only just started earning.", loan: 7800000, rate: 8.35, years: 30, extra: 10000, fee: 18000, note: "Thirty years made the monthly number look like a rent receipt. The interest column did not. She is keeping the long tenure only until she has three months of expenses saved, then she will ask for a tenure cut rather than a lifestyle upgrade." },
    { title: "A small loan, paid like a big one", who: "Rahul works in a hotel in Jaipur", want: "He wants a modest house and a loan he can see the end of.", loan: 2800000, rate: 8.9, years: 10, extra: 4000, fee: 6000, note: "Ten years hurts every month and then it stops. Rahul preferred that to a cheap EMI he would still be paying in his fifties. The fee was small, so the comparison really was tenure against tenure." },
    { title: "A second house is a different risk", who: "Farida already lives in a family house in Hyderabad", want: "She is looking at a flat she would rent out.", loan: 11000000, rate: 8.6, years: 20, extra: 20000, fee: 25000, note: "Rent will not match the EMI in the first years, and a rented flat can sit empty. She is not treating expected rent as salary. The EMI has to fit her practice income with the flat vacant." },
    { title: "Moving what is left, not what was borrowed", who: "Sandeep is halfway through a loan in Nagpur", want: "A new lender offered a lower rate on the outstanding balance.", loan: 3600000, rate: 8.2, years: 12, extra: 6000, fee: 8000, note: "He compared the new EMI with the remaining months on the old loan, not with the original 20-year story. The fee is earned back only if he actually stays long enough for the rate gap to matter. He asked the old lender to match the rate before he moved the file." },
    { title: "A pension and a careful EMI", who: "Lakshmi lives in Coimbatore on a pension and a small rent", want: "She wants a smaller house closer to her daughter, with a loan her pension can carry alone.", loan: 2200000, rate: 8.75, years: 15, extra: 0, fee: 5000, note: "There is no extra payment in the plan. The pension does not grow the way a salary might. A loan that needs a future raise is the wrong shape for her, even if the bank would sanction a larger one." },
    { title: "After the builder's offer ended", who: "Arjun bought an under-construction flat in Noida", want: "The subvention period is over and the bank EMI is about to start in full.", loan: 9500000, rate: 8.55, years: 25, extra: 10000, fee: 0, note: "He had been paying a smaller amount during construction. The full EMI feels like a new loan because it is, in the monthly budget. He rebuilt the schedule from the balance on the first full-EMI date, not from the price he paid the builder three years ago." },
    { title: "One EMI, two names", who: "Neha and her husband work in Indore", want: "They want a joint loan and a clear rule for what happens if one income pauses.", loan: 4800000, rate: 8.45, years: 18, extra: 7000, fee: 9000, note: "The bank added both salaries and offered more than they wanted. They borrowed against the lower of the two salaries plus a margin, and they kept the other salary out of the EMI. The joint title is about the house. The EMI is about the month." },
    { title: "A smaller city, a higher rate", who: "Vivek works with a telecom contractor in Guwahati", want: "He has a modest quote and a rate that is a little higher than the ads he sees online.", loan: 1800000, rate: 9.1, years: 12, extra: 2000, fee: 4000, note: "He did not chase a viral rate from a city where he does not live. The higher rate on a smaller loan costs less in rupees than a lower rate on a loan inflated to the maximum eligibility. He negotiated the fee before he negotiated the sofa." },
    { title: "Shop income is lumpy", who: "Kavita runs a textile shop in Surat", want: "Her income is strong around festivals and thin in between, and she still wants a house loan.", loan: 6000000, rate: 8.8, years: 20, extra: 12000, fee: 14000, note: "She set the EMI against an ordinary month, not a Diwali month. The extra Rs. 12,000 is what she will pay in the fat months, not a promise she must meet in a quiet one. The lender still wants the standing instruction every month, so the base EMI stays inside the quiet month." },
    { title: "A hill-station salary", who: "Omar works in a hotel in Srinagar", want: "The season peaks and then drops, and the loan cannot do the same.", loan: 3300000, rate: 8.95, years: 15, extra: 3000, fee: 7000, note: "He saved the off-season EMI in the peak months, in a separate account, before he signed. A loan does not care that the hotel is shut. The separate account is the only part of the plan that understands the season." },
    { title: "Leaving a margin for a parent", who: "Priya works in a public office in Thiruvananthapuram", want: "She wants a home loan that still leaves room to support her mother.", loan: 5200000, rate: 8.5, years: 22, extra: 9000, fee: 11000, note: "Eligibility said she could borrow more. She cut the loan until the EMI, her mother's medicines, and a small SIP could all exist in the same month. The house is a little smaller. The month is calmer." },
    { title: "Ten years and a clear end", who: "Manoj is a supervisor in a workshop in Patna", want: "He wants to own the house outright before his son finishes school.", loan: 2500000, rate: 9.2, years: 10, extra: 5000, fee: 6000, note: "The rate is not pretty. The tenure is the part he could control. A cheaper EMI over 25 years would still be running when the school fees turn into college fees. He would rather be done." },
  ];

  return [
    ch("The monthly number is not the price", [
      "A home loan is sold as a monthly figure. The monthly figure is the EMI. It is real, and you have to pay it, but it is not the price of the loan. The price is the EMI multiplied by the number of months, plus the fees you pay before the first EMI, minus the amount you actually received.",
      "Inside a single EMI there are two piles. One pile is interest, which is the cost of still owing money. The other is principal, which is the loan getting smaller. At the start of a long loan the interest pile is the larger one. You can pay on time for a year and still owe almost what you borrowed. That is not a trick. It is how a fixed payment on a long debt behaves.",
      "Three inputs set the EMI. How much you borrow. The yearly interest rate. How many months the lender spreads it over. Change any one of them and the EMI moves. Change the number of months and the total interest moves the other way. A smaller EMI is often a more expensive loan.",
      "This book walks through those moves with people and with schedules. The people are invented. The arithmetic is the standard reducing-balance EMI. Your sanction letter can add insurance, a fee, or a rate reset that these pages do not know about. Read the letter after you understand the shape, not instead of reading it.",
    ]),
    ch("Why the first years feel slow", [
      "Interest each month is the outstanding balance times the monthly rate. The monthly rate is the yearly rate divided by twelve, in the way these schedules are built. A large balance means a large interest charge. The EMI pays that charge first. Only what is left reduces the balance.",
      "So the balance falls slowly at the start. Each small drop in the balance makes next month's interest a little smaller, which leaves a little more of the EMI for principal. The change is boring for a long time and then it is obvious. The month when principal finally exceeds interest is a useful mark. It is printed in the worked files so you do not have to hunt for it.",
      "This is also why an extra payment in year two saves more interest than the same payment in year eighteen. Early money shrinks the balance that future interest is calculated on. Late money mostly shortens a loan that was already cheap to carry.",
      "If a schedule you were given shows the balance falling in a straight line, it is not this kind of loan, or it has been simplified for a brochure. Ask for the year-wise principal and interest. A lender who has sanctioned a loan can produce it.",
    ]),
    ch("Tenure is a price list", [
      "Stretch a loan from 15 years to 25 and the EMI drops. That drop is what gets circled in a sales conversation. The interest column is what gets smaller on the page. Write both down before you choose.",
      "A longer tenure is not always wrong. A single income, a parent to support, or a business that has quiet months can make a high EMI dangerous. Missing EMIs is more expensive than a longer tenure chosen on purpose. The mistake is taking the longer tenure only because nobody showed you the interest.",
      "If you can pay more, ask the lender to keep the EMI and cut the months, or keep the months and cut the EMI. Cutting the months saves more interest. Cutting the EMI makes the month easier and leaves the expensive tail of the loan in place. Know which one you asked for. The passbook will not announce it.",
      "Some people take the long tenure and then pay extra whenever they can. That can work, if the extra is real and the lender applies it to principal. It fails when the extra was a mood. A tenure you can finish with the contractual EMI, even in a dull year, is sturdier than a plan that needs heroics.",
    ]),
    ch("Fees, insurance and the rate that moves", [
      "Compare two offers on the same amount and the same months. Then add the processing fee, the legal charges, and any insurance you would not have bought on your own. A loan that is 0.1 percent cheaper and Rs. 40,000 dearer in fees can lose to the plainer offer on a short stay.",
      "A floating rate will move. When you test a loan, run it again half a percent higher and a full percent higher. If the higher EMI breaks the month, the loan is too big for you, even if today's EMI fits. You can also ask whether a rate rise will lift the EMI or push the last payment further out. Those are different kinds of pain.",
      "A fixed rate buys a calmer EMI for a while. It often charges more at the start, and it often charges you to prepay. If you expect to close the loan with a bonus in three years, a fixed loan with a stiff prepayment fee can be the expensive kind of calm.",
      "Balance transfer is the same comparison in the middle of the loan. Use the amount still outstanding and the months still left. Ignore the original loan amount. It is history. The fee on the new loan has to be earned back by the rate you will actually pay, not by the rate in the advertisement.",
    ]),
    ch("How much house the month can carry", [
      "Eligibility is the lender's ceiling, based on income, existing EMIs and their own policy. It is not a recommendation. A lender is paid if you borrow. You are the one who lives with the EMI when the scooter needs a repair.",
      "A practical test is dull. Write the take-home pay. Subtract rent you will still pay, support you already send, and the EMIs you already have. What remains is the room for this EMI, food, school, and a broken appliance. If the new EMI takes that whole room, the house is too expensive at this tenure.",
      "Do not count a future raise, a spouse's income you do not want to depend on, or rent from a flat that has no tenant yet. You can count them as a reason to prepay later. You should not count them as a reason to sign.",
      "The down payment matters as much as the EMI. A smaller loan is a smaller interest bill. Stretching for the down payment by emptying the emergency fund makes the first illness or job gap into a missed EMI. A slightly cheaper house with six months of expenses left in the bank is a finished plan. A larger house with an empty bank account is a hope.",
    ]),
    ch("Using a calculator without lying to it", [
      "The EMI calculator on FreeToolsPro asks for amount, rate and time. It uses a reducing balance. Put in the amount you will actually receive, not the property price. Put in the rate from the sanction, not the rate from a banner. Put in the months, not a rounded 'about twenty years' if the letter says 236 months.",
      "Then change one input. Add two years. Add half a percent. Add a prepayment in the prepayment calculator if you have a real extra amount. One change at a time tells you which lever matters. Changing all three and feeling confused does not.",
      "Round to the nearest rupee at the end. A schedule that rounds every month will disagree with this book by a few rupees. That is not a different loan. A schedule that disagrees by thousands of rupees means a different rate, a different amount, or fees you have not entered.",
      "When the sanction arrives, check it against the last numbers you ran. Amount, rate, months, fee, and what happens on prepayment. If the letter is kinder than your notes, be pleased and still read the fee schedule. If it is harsher, you are allowed to walk back to the branch before you are allowed to feel silly.",
    ]),
    loanChapter(scenarios),
    ch(
      "Check yourself",
      ["Answer from the figures, then read the line under the question. A difference of a few rupees is rounding. A difference of thousands means the tenure or the rate slipped."],
      scenarios.slice(0, 10).map((s, i) => {
        const st = loanStats(s.loan, s.rate, s.years, s.extra || 0);
        return {
          heading: `${i + 1}. ${s.title}`,
          paragraphs: [
            `${s.who.split(".")[0]}. What is the EMI on Rs. ${inr(s.loan)} at ${s.rate} percent for ${s.years} years, and how much interest is paid if the rate never moves?`,
            `EMI Rs. ${inr(st.emi)}. Total paid Rs. ${inr(st.total)}. Interest Rs. ${inr(st.interest)}. ${s.extra ? `With Rs. ${inr(s.extra)} extra each month the loan ends in ${st.extraMonths} months and about Rs. ${inr(st.saved)} of interest is saved, if the tenure is what shrinks.` : "No extra payment is assumed in this file."}`,
          ],
        };
      })
    ),
    loanGlossary,
    ch("A week with your own quote", [
      "Take the quote you actually have, or a house you are honestly considering. Run the EMI at the offered tenure. Run it five years shorter. Write both interest totals on the same piece of paper.",
      "Add the fee and one insurance premium if the branch insists on it. See whether the 'cheaper' lender is still cheaper. Then add half a percent to the rate and see if the month still works.",
      "If you can pay extra, decide before you sign whether that extra will cut the EMI or the tenure. Tell the lender. Keep the sanction letter with the page of your own figures. They should tell the same story.",
    ]),
  ];
}

export function sipBook() {
  const people = [
    { title: "Ten thousand from a salary", who: "Anita", city: "Nashik", monthly: 10000, rate: 11, years: 15, step: 0, lump: 0, note: "Anita's SIP is a slice of salary, not a windfall. She picked 11 percent as a cautious illustration, not as a promise any fund has made her. If the real return is lower, the habit still exists and the final number is smaller. She would rather meet a smaller number than miss a fantasy." },
    { title: "The same money, once", who: "Anita's brother Rohan", city: "Nashik", monthly: 0, rate: 11, years: 15, step: 0, lump: 1800000, note: "Rohan has a lump from selling a plot. Fifteen years at the same illustrated rate is a different shape from his sister's monthly habit. He does not need a SIP to be virtuous. He needs a place for money he already has, and a stomach for the year the value falls." },
    { title: "A step-up when the salary moves", who: "Kiran", city: "Visakhapatnam", monthly: 8000, rate: 10, years: 20, step: 8, lump: 0, note: "Kiran raises the SIP by 8 percent a year because the salary usually rises. The step-up is not automatic in the real world. It happens only if he edits the mandate. The table shows the edited version." },
    { title: "A short goal should not wear a long story", who: "Fathima", city: "Kozhikode", monthly: 20000, rate: 7, years: 4, step: 0, lump: 0, note: "Four years is a short time for a volatile investment. Fathima used 7 percent and a goal she can also fund with a deposit if markets sulk. The SIP is a helper, not the only way the fee gets paid." },
    { title: "A delayed start", who: "George", city: "Shillong", monthly: 15000, rate: 11, years: 10, step: 0, lump: 0, note: "George started at 40, not at 25. Ten years of a larger SIP does not recreate twenty-five years of a small one. He stopped apologising and raised the monthly amount to what the month can lose without a drama." },
    { title: "Bonus as a lumpsum beside a SIP", who: "Smita", city: "Ahmedabad", monthly: 12000, rate: 10, years: 12, step: 0, lump: 200000, note: "The bonus is invested once, in the same illustrated rate, and the SIP keeps going. She does not stop the SIP because the bonus felt large. The bonus is a guest. The SIP is the rent." },
    { title: "Inflation sitting in the corner", who: "Naveen", city: "Hubballi", monthly: 6000, rate: 12, years: 18, step: 5, lump: 0, note: "A future amount that ignores inflation buys less house, less college and less quiet. Naveen steps the SIP up and still treats the final figure as tomorrow's rupees, not today's. He will raise the goal when he can say what it is for." },
    { title: "Stopping for a year", who: "Leela", city: "Thrissur", monthly: 10000, rate: 11, years: 15, step: 0, lump: 0, note: "A year of missed SIPs is not a moral failure. It is a hole in the invested column. Leela's plan is to restart at the same amount, not at double, and not to sell the existing units to 'start fresh'. Selling to feel tidy is how a dip becomes a loss." },
    { title: "A goal with a date", who: "Arif", city: "Aligarh", monthly: 25000, rate: 9, years: 8, step: 0, lump: 0, note: "Eight years, a named down payment, 9 percent because he does not want the plan to require a heroic market. If the value is short when the date arrives, he will borrow less or wait a year. The date is allowed to win." },
    { title: "Two rates, one habit", who: "Charu", city: "Dehradun", monthly: 9000, rate: 8, years: 20, step: 0, lump: 0, note: "Charu runs the same SIP at 8 percent after she has looked at 12. The lower figure is the one she is willing to plan her life around. The higher figure is a pleasant surprise, not a budget." },
    { title: "A lumpsum she is afraid to invest on one day", who: "Rebecca", city: "Aizawl", monthly: 0, rate: 10, years: 12, step: 0, lump: 600000, note: "She split the story in her head into a lumpsum because that is what the money is. Dribbling it in over six months is a comfort, not a law of returns. This file shows the single investment so she can see the number she is nervous about." },
    { title: "Retirement is a long SIP with a rule", who: "Harish", city: "Jodhpur", monthly: 20000, rate: 10, years: 25, step: 5, lump: 0, note: "Twenty-five years is long enough for compounding to do the heavy work, and long enough for Harish to quit in year three if he watches the value every Friday. He checks the SIP once a year, when he also raises it." },
  ];

  const sections = people.map((p) => {
    const sip = p.monthly ? sipRows(p.monthly, p.rate, p.years, p.step) : null;
    const lump = p.lump ? lumpsum(p.lump, p.rate, p.years) : null;
    const paras = [
      `${p.who} lives in ${p.city}. ${p.note}`,
      sip
        ? `For ${p.who}, a monthly SIP of Rs. ${inr(p.monthly)}${p.step ? `, raised by ${p.step} percent each year,` : ""} illustrated at ${p.rate} percent for ${p.years} years, grows to about Rs. ${inr(sip.value)}. The money actually put in is about Rs. ${inr(sip.invested)}. The rest, Rs. ${inr(sip.value - sip.invested)}, is growth in the illustration, not a guarantee.`
        : `There is no monthly SIP in this file.`,
    ];
    if (lump) {
      paras.push(
        `The lumpsum of Rs. ${inr(p.lump)} at the same ${p.rate} percent for ${p.years} years is about Rs. ${inr(lump.value)}. Growth in the illustration is Rs. ${inr(lump.gain)}. A lumpsum feels the first year more sharply than a SIP, because all the money is already in.`
      );
    }
    const tables = [];
    if (sip) {
      tables.push({
        caption: "End of each year. Invested is what left the bank. Value is the illustration.",
        headers: ["Year", "Invested", "Value", "Growth"],
        rows: sip.rows,
      });
    }
    return { heading: p.title, paragraphs: paras, tables };
  });

  return [
    ch("Compounding is quiet until it is not", [
      "A return that stays invested earns a return of its own. Over three years you mostly see what you put in. Over fifteen years the growth can be larger than the contributions. That is the whole magic, and it is ordinary arithmetic, not a personality trait.",
      "The tables in this book use a steady yearly rate, converted to a monthly step the way a SIP calculator usually does. Markets do not pay a steady rate. A table is a map of an assumption. If you only look at the bottom right cell, you will treat the assumption as a forecast. Look at the invested column as well. That one is the part you control.",
      "A SIP and a lumpsum are not rivals in character. A SIP is what you do with salary that arrives every month. A lumpsum is what you do with money that is already sitting in the account. Using a SIP for a bonus, in tiny pieces, is a way to feel safer. It is not always a way to earn more.",
    ]),
    ch("Pick the goal before the product", [
      "A date and an amount beat a product name. 'A down payment in eight years' can be calculated. 'Wealth' cannot. Once you have the date, a high illustrated return is a temptation, because it shrinks the monthly amount you need to save. Shrink it too far and you will miss the goal in an ordinary decade.",
      "Inflation sits behind the amount. A college fee written in today's rupees will not be the cheque you write later. Raise the target, or raise the SIP as your salary rises, or both. A step-up only works if you change the instruction. A spreadsheet step-up that you never type into the bank is fan fiction.",
      "When the date is close, the job changes. Money you need within a few years should not depend on a bad year in the market. The SIP that built the pile can be the wrong place to park the pile. Moving it is not betrayal. It is the date winning.",
    ]),
    ch("What a bad year is allowed to do", [
      "A bad year reduces the value. It does not reduce the units you already bought, and a SIP buys more units when the price is lower. That helps only if you keep the SIP going and you do not need the money that year. If you sell because the number on the screen hurts, you turn a dip into a finished loss.",
      "Stopping for a real reason, a illness or a job gap, is allowed. Restart when the month can spare the money. Doubling the SIP to 'catch up' is optional and often too proud. Catching up by working three more years is quieter and more reliable.",
      "Do not invest money you owe at a high card rate, and do not invest the emergency fund so that the SIP looks serious. A SIP that gets sold in the first emergency was the emergency fund, wearing a costume.",
    ]),
    { title: "Worked files", paragraphs: ["Each file uses one illustrated rate. Change the rate before you change your life. The lower rate is the planning rate.", "Every rate here is a teaching rate. A real fund, deposit or pension product will not move in a straight line. Run the same habit at a lower rate before you promise anyone the higher figure."], sections },
    ch("Check yourself", [
      "The answers use the same monthly compounding illustration as the files. A bank or a fund statement will not match to the rupee.",
    ], people.slice(0, 8).map((p, i) => {
      const sip = p.monthly ? sipRows(p.monthly, p.rate, p.years, p.step) : null;
      const lump = p.lump ? lumpsum(p.lump, p.rate, p.years) : null;
      return {
        heading: `${i + 1}. ${p.title}`,
        paragraphs: [
          sip
            ? `About how much is invested, and what is the illustrated value, for Rs. ${inr(p.monthly)} a month at ${p.rate} percent for ${p.years} years${p.step ? ` with a ${p.step} percent yearly step-up` : ""}?`
            : `What does a lumpsum of Rs. ${inr(p.lump)} become at ${p.rate} percent over ${p.years} years in this straight-line illustration?`,
          sip
            ? `Invested about Rs. ${inr(sip.invested)}. Illustrated value about Rs. ${inr(sip.value)}.`
            : `Illustrated value about Rs. ${inr(lump.value)}, of which growth is about Rs. ${inr(lump.gain)}.`,
        ],
      };
    })),
    ch("Words worth keeping straight", ["A short glossary. Products have legal definitions that are longer than this."], [
      ["SIP", ["A systematic investment plan. A fixed amount leaves your bank on a schedule and buys units of whatever you chose. The amount can be stepped up only if you say so."]],
      ["Lumpsum", ["One investment, on one day, left alone. It is the right tool for money you already have and can leave for years."]],
      ["NAV", ["The price of one unit. A SIP buys fewer units when the NAV is high and more when it is low. The value of what you hold is units times NAV."]],
      ["CAGR", ["The steady yearly rate that would connect a starting amount to an ending amount. It hides the bumpy path. Two funds with the same CAGR can have felt very different to live through."]],
      ["Step-up", ["Raising the SIP, usually once a year, by a percent or a rupee amount. It is a feature you turn on. It is not a law of salary."]],
      ["Goal", ["An amount and a date. Without the date, a calculator can only show growth. It cannot tell you whether you are saving enough."]],
    ]),
  ];
}

export function savingsBook() {
  const files = [];
  const ppfPeople = [
    { name: "Renu", city: "Udaipur", yearly: 150000, rate: 7.1, years: 15, note: "She puts in the yearly cap used for this illustration, Rs. 1,50,000, at the start of each year. The 7.1 percent rate is a teaching rate so the shape is visible. The rate on a real PPF account is declared for a quarter at a time." },
    { name: "Iqbal", city: "Varanasi", yearly: 60000, rate: 7.1, years: 15, note: "He cannot spare the full cap. A smaller yearly deposit still compounds. Waiting until he can 'do it properly' at the cap would skip years of interest on the smaller sum." },
    { name: "Selvi", city: "Madurai", yearly: 100000, rate: 7.1, years: 15, note: "She treats PPF as the portion of savings she must not touch for a wedding or a sale. The lock-in is the product, not a defect she plans to argue with." },
  ];
  ppfPeople.forEach((p, idx) => {
    const b = ppfBalance(p.yearly, p.rate, p.years);
    files.push({
      heading: `PPF: ${p.name} in ${p.city}`,
      paragraphs: [
        p.note,
        `After ${p.years} years at a steady ${p.rate} percent, credited once a year on the balance plus that year's deposit, the illustration ends near Rs. ${inr(b.value)}. Deposits add up to Rs. ${inr(p.yearly * p.years)}. The gap is interest in the illustration.`,
        ...(idx === 0 ? ["PPF is a long public scheme with rules on how much you may put in and when you may take money out. Do not park an emergency fund here. The calculator on the site is the place to try a different yearly amount. The passbook is the place to see what was actually credited."] : []),
      ],
      table: { caption: "Balance at the end of each year in the illustration.", headers: ["Year", "Deposited so far", "Balance"], rows: b.rows },
    });
  });

  const fds = [
    { name: "Thomas", city: "Kottayam", principal: 500000, rate: 7.25, years: 3, note: "A three-year deposit for a fee he can already see coming. He does not need growth. He needs the money to still be there, and he needs to know the maturity before he promises the fee to anyone." },
    { name: "Noor", city: "Bhopal", principal: 200000, rate: 6.8, years: 1, note: "One year, a modest rate, a sum she might need if a parent travels for treatment. A higher rate on a five-year lock would be the wrong prize." },
    { name: "Gopal", city: "Ranchi", principal: 1000000, rate: 7.5, years: 5, note: "Five years is long enough that he asked about TDS and about whether the interest is paid out or folded back in. This illustration folds it back quarterly. A payout option would leave him with the principal at the end and the interest already spent." },
    { name: "Shalini", city: "Mysuru", principal: 300000, rate: 7.1, years: 2, note: "She compared this deposit with a recurring deposit of the same total. The lump is what she has. Spreading it would only make sense if she did not have it yet." },
  ];
  fds.forEach((f, idx) => {
    const m = fdMaturity(f.principal, f.rate, f.years);
    files.push({
      heading: `Fixed deposit: ${f.name} in ${f.city}`,
      paragraphs: [
        f.note,
        `Rs. ${inr(f.principal)} at ${f.rate} percent, compounded quarterly for ${f.years} years, matures near Rs. ${inr(m.value)}. Interest in the illustration is Rs. ${inr(m.interest)}. A bank may quote a slightly different maturity because of the day count or a senior-citizen rate. Ask for their figure before you lock it.`,
        ...(idx === 0 ? ["Tax on the interest depends on your slab and on TDS rules. The maturity number is not the number you keep if tax is due. The deposit screen at the bank will show TDS if it applies. Believe that screen over a rough mental cut."] : []),
      ],
    });
  });

  const nps = [
    { name: "Deepa", city: "Raipur", monthly: 5000, rate: 9, years: 25, note: "NPS is aimed at retirement. Deepa is 25 years from the age she used in this file. The 9 percent is an illustration across a mix of equity and debt, not the return of a particular fund manager." },
    { name: "Yusuf", city: "Aurangabad", monthly: 8000, rate: 8, years: 20, note: "He ran 8 percent because he holds a conservative mix. A friend with a higher equity share should not copy Yusuf's table, and Yusuf should not copy the friend's." },
    { name: "Maria", city: "Panaji", monthly: 3000, rate: 10, years: 30, note: "Thirty years makes the growth column loud. It also makes the chance of a bad decade along the way almost certain. She will not judge the product by year three." },
  ];
  nps.forEach((n, idx) => {
    const s = sipRows(n.monthly, n.rate, n.years, 0);
    files.push({
      heading: `NPS illustration: ${n.name} in ${n.city}`,
      paragraphs: [
        n.note,
        `Rs. ${inr(n.monthly)} a month at ${n.rate} percent for ${n.years} years reaches about Rs. ${inr(s.value)} in this straight illustration. Contributions are about Rs. ${inr(s.invested)}.`,
        ...(idx === 0 ? ["At exit, part of an NPS corpus has to be used to buy an annuity, within the rules in force at that time, and the rest can be withdrawn. This table is the corpus, not the pension. The pension depends on the annuity rate on the day you buy it. That rate is not knowable from here."] : []),
      ],
      table: { caption: "Yearly snapshot of the illustrated corpus.", headers: ["Year", "Contributed", "Corpus", "Growth"], rows: s.rows },
    });
  });

  return [
    ch("Three products, three dates", [
      "PPF, a bank fixed deposit and NPS are all called savings. They do not do the same job. PPF is a long locked scheme with a declared rate and a yearly cap. A fixed deposit is a contract for a rate and a date you choose. NPS is a retirement account whose value moves with the mix you selected, and the exit rules are not the same as breaking a deposit.",
      "Pick the date you need the money, then the product whose lock ends before that date. A wonderful rate you cannot touch is a bad emergency fund. A calm deposit is a bad 30-year retirement plan if inflation eats it. This book keeps the three apart on purpose.",
      "The rates used in the files are teaching rates. PPF is reset by the government. Deposit cards in the bank window change. NPS has no promised rate at all. Replace the teaching rate with the current one before you fill a form.",
    ]),
    ch("What lock-in is for", [
      "Lock-in is a feature when the money is for a far date and you know you might raid it. It is a defect when the money is for a near date. Read the withdrawal rules before you praise your own discipline. Partial withdrawal from PPF exists and is limited. Breaking a deposit usually costs you rate. Exiting NPS early is a different, stricter conversation.",
      "A household can hold all three. The split follows the dates. Money for a fee in two years lives in a deposit. Money for a teenager's distant college can sit in PPF if the maturity lines up. Money for life after work can go to NPS or to a longer equity habit. The labels on the products are less useful than the dates on your own list.",
      "Do not move emergency money into a locked product to feel serious. Serious is being able to pay a hospital bill without a personal loan. The locked product can start the month after that fund exists.",
    ]),
    { title: "Worked files", paragraphs: ["Deposits are compounded quarterly in these files. PPF is compounded yearly on the balance after that year's deposit. NPS is shown with the same monthly illustration used for a SIP, which is a simplification of a market-linked account."], sections: files },
    ch("Check yourself", ["Use the teaching rate in the question. Then redo it with this month's real rate."], [
      ["A full PPF cap", ["Renu deposits Rs. 1,50,000 a year for 15 years at a steady 7.1 percent. Deposits alone are Rs. 22,50,000. The illustrated balance is higher because each year's deposit earns interest, and earlier deposits earn it for longer. The table in her file is the authority for the rupee figure. If your mental total equals only the deposits, you have forgotten the compounding."]],
      ["A short deposit", ["Noor's Rs. 2,00,000 for one year should not be judged against Selvi's 15-year PPF. The date is the point. A higher 15-year number she cannot access is not a better one-year plan."]],
      ["Corpus is not pension", ["Maria's illustrated corpus is not a yearly pension. Part of an NPS exit goes to an annuity. The pension is whatever that annuity costs on the day she buys it. Planning as if the whole corpus can be drawn as cash will overstate the spendable amount."]],
    ].map(([heading, paragraphs]) => ({ heading, paragraphs }))),
    ch("Words worth keeping straight", ["Enough to read a form. Not a substitute for the scheme rules."], [
      ["PPF", ["Public Provident Fund. A long government scheme. You deposit up to a yearly cap. Interest is declared, not chosen by you. The lock is long. Partial withdrawal is possible inside the rules and is not the same as an ATM."]],
      ["Fixed deposit", ["A bank contract. You lend the bank a sum for a period at a stated rate. Quarterly compounding is common, which is why the maturity is a bit more than a simple yearly multiplication."]],
      ["Recurring deposit", ["A deposit built from a monthly contribution. Useful when you do not yet have the lump. The rate and the end date are still a contract."]],
      ["TDS", ["Tax deducted by the bank on interest in some cases. It is not always the full tax you owe, and it is not a reason to ignore interest in your return."]],
      ["NPS", ["National Pension System. Contributions are invested in a mix you choose within the rules. The value moves. At a normal exit, part of the corpus buys an annuity."]],
      ["Annuity", ["A pension you buy from an insurer with a lump. You give up the lump, or part of it, and receive a payment. The rate depends on the market and your age at purchase."]],
    ]),
  ];
}

export function cardBook() {
  const cards = [
    { title: "A wedding that stayed on the card", who: "Shruti", city: "Kanpur", balance: 185000, apr: 36, pay: 8000, minimum: 3700, note: "The wedding is over. The card is not. She stopped using it the week she wrote this plan. New spending would replace the principal she is trying to kill." },
    { title: "Two cards, one extra rupee", who: "Nikhil", city: "Gurgaon", balance: 92000, apr: 42, pay: 7000, minimum: 2000, note: "This file is only the expensive card. The cheaper card gets its minimum and nothing more until this balance is gone. Splitting the extra across both cards feels fair and costs more." },
    { title: "Minimum due as a lifestyle", who: "Pooja", city: "Cuttack", balance: 64000, apr: 38, pay: 2500, minimum: 1600, note: "The minimum keeps the account polite. It does not keep the balance polite. She picked a fixed payment she can make even in a month with a family trip home." },
    { title: "A medical bill", who: "Abdul", city: "Malappuram", balance: 210000, apr: 30, pay: 12000, minimum: 4200, note: "The bill was not frivolous. The interest does not care. He asked the hospital about a payment plan before he compared a personal loan. This file is the card, paid hard, if he does not refinance." },
    { title: "A small balance people ignore", who: "Tara", city: "Shimla", balance: 18000, apr: 40, pay: 4000, minimum: 400, note: "Eighteen thousand feels too small to plan. At this rate it is not too small to notice. Four thousand a month ends it quickly. The minimum would turn it into a pet." },
    { title: "After a balance transfer offer", who: "Dev", city: "Vadodara", balance: 150000, apr: 18, pay: 9000, minimum: 3000, note: "Eighteen percent is a transferred rate, not the old card rate. He put the end date of the offer on the same page as the payment. When the offer ends, this file is no longer the loan he has." },
    { title: "Freelance months", who: "Ishaan", city: "Pondicherry", balance: 47000, apr: 36, pay: 6000, minimum: 1200, note: "Some months he can pay more. The plan uses the month he can always pay. Extra in a good month is welcome and is not written in as a requirement." },
    { title: "A card that was also the emergency fund", who: "Beena", city: "Kollam", balance: 73000, apr: 39, pay: 5500, minimum: 1500, note: "She is building a small cash buffer at the same time, even if that slows the card by a month or two. A card paid to zero with no buffer becomes the emergency fund again next month." },
  ];

  const sections = cards.map((c, idx) => {
    const hard = cardPayoff(c.balance, c.apr, c.pay);
    const soft = cardPayoff(c.balance, c.apr, c.minimum);
    const paras = [
      `${c.who} in ${c.city} has Rs. ${inr(c.balance)} on a card at ${c.apr} percent a year. ${c.note}`,
      hard.never
        ? `A payment of Rs. ${inr(c.pay)} does not cover the interest. The balance would grow. The payment has to rise before a payoff date exists.`
        : `A fixed payment of Rs. ${inr(c.pay)} clears the balance in ${hard.months} months. Interest along the way is about Rs. ${inr(hard.interest)}, on top of the Rs. ${inr(c.balance)} that was already spent.`,
      soft.never
        ? `The minimum of Rs. ${inr(c.minimum)} does not catch the interest either, or it takes so long that this simple cap stopped counting. That is the trap.`
        : `Paying only about Rs. ${inr(c.minimum)} a month stretches the same balance to ${soft.months} months and about Rs. ${inr(soft.interest)} of interest. The difference is the cost of being polite to the bank.`,
      ...(idx === 0 ? ["The model charges one twelfth of the yearly rate each month and ignores late fees, cash-advance fees, GST on interest and the way a real statement cuts a grace period. A real card can cost more than this. It should not cost less if you are revolving a balance."] : []),
    ];
    return {
      heading: c.title,
      paragraphs: paras,
      table: hard.never
        ? undefined
        : {
            caption: "A snapshot of the fixed payment. Every sixth month is shown after the first year and a half, so the page stays readable.",
            headers: ["Month", "Interest", "Principal", "Balance"],
            rows: hard.rows,
          },
    };
  });

  return [
    ch("The grace period is the whole product", [
      "A credit card is cheap when you pay the statement in full by the due date. The bank lends you the purchases for a few weeks and, on most cards, does not charge interest for that cycle. The card becomes expensive the month you pay less than the full statement. Interest starts on what you left, and new purchases often lose the free period too. The exact hour this happens is in the card's terms. The shape of it is not in dispute.",
      "The minimum amount due is the bank asking you not to be reported as late. It is a small number on purpose. Most of it is interest once you are revolving. People who pay it every month feel responsible. The balance agrees and stays.",
      "This book uses a simple monthly interest model so you can see months and rupees. Your statement will add fees and a particular way of counting days. If the book's payoff is 14 months and the bank's app says 16, believe the app for the date and believe the book for the reason: the minimum is not a plan.",
    ]),
    ch("One payment you can repeat", [
      "Pick a fixed amount above the minimum that survives a dull month. Divide the balance by that amount for a rough ceiling on the months. The real month count is longer than that division because interest is added, which is what the tables are for.",
      "Stop spending on the card you are paying off. A payment of Rs. 8,000 and new spending of Rs. 7,000 is a payment of Rs. 1,000. The plan dies in the swipe, not in the interest formula.",
      "If you have several cards, pay the minimum on all of them so none of them becomes a penalty. Put every extra rupee on the highest rate. When that balance dies, move the whole payment onto the next card. Spreading the extra evenly feels kind and feeds the expensive balance for longer.",
      "A personal loan at a lower rate can replace a card. Add the processing fee. Then imagine the card limit is still there, empty, and you are tired. If you would fill it again, the loan did not fix the problem. It stacked a new EMI on the old habit.",
    ]),
    { title: "Worked files", paragraphs: ["Rates here are yearly rates of the sort printed on card schedules. They are examples, not your APR. Read yours on the statement. It will be specific and it will be high."], sections },
    ch("Check yourself", ["Rough answers are enough. The direction matters more than a rupee."], [
      ["Why the minimum feels fine", ["It keeps the account from looking late. It does not pay the balance. On a revolving card, most of a small payment is interest, so the balance barely moves. A fixed payment chosen by you is a plan. The minimum is the bank's plan."]],
      ["Where extra money goes", ["Onto the highest rate, after every card has received its minimum. A lower rate can wait. Fairness between cards is not the goal. Interest is the goal."]],
      ["When a cheaper loan fails", ["When the fee eats the rate cut, or when the card is used again while the new loan is still being paid. Refinancing is a change of rate. It is not a change of habit unless the card stays quiet."]],
    ].map(([heading, paragraphs]) => ({ heading, paragraphs }))),
    ch("Words worth keeping straight", ["Enough to read a statement."], [
      ["Statement balance", ["What you owed at the end of the cycle. Pay this by the due date and, on a normal card, you stay inside the grace period for those purchases."]],
      ["Minimum due", ["The smallest amount that keeps the account in good standing. It is not a payoff."]],
      ["APR", ["The yearly interest rate. Divide by twelve for a rough monthly rate. The card may compound more finely than that. The direction of the damage is the same."]],
      ["Revolving", ["Carrying a balance from one statement into the next. This is when the card stops being a payment tool and starts being a loan."]],
      ["Grace period", ["The interest-free gap on purchases, if you have been paying in full. It is easy to lose and slower to win back. New purchases can start costing interest the moment you revolve."]],
    ]),
  ];
}
