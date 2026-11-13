const NAMES = ["Asha", "Imran", "Joseph", "Harpreet", "Divya", "Rahul", "Farida", "Sandeep", "Lakshmi", "Arjun", "Neha", "Vivek", "Kavita", "Omar", "Priya", "Manoj", "Renu", "Iqbal", "Selvi", "Thomas", "Noor", "Gopal", "Deepa", "Yusuf", "Maria", "Shruti", "Nikhil", "Pooja", "Abdul", "Tara"];
const CITIES = ["Pune", "Lucknow", "Kochi", "Chandigarh", "Bengaluru", "Jaipur", "Hyderabad", "Nagpur", "Coimbatore", "Noida", "Indore", "Guwahati", "Surat", "Srinagar", "Patna", "Udaipur", "Varanasi", "Madurai", "Kottayam", "Bhopal", "Ranchi", "Mysuru", "Raipur", "Panaji", "Kanpur", "Cuttack", "Shimla", "Vadodara", "Kollam", "Ajmer"];

function pick(list, n, salt = 0) {
  return list[(n + salt) % list.length];
}

function moneyDrill(n) {
  const name = pick(NAMES, n);
  const city = pick(CITIES, n, 3);
  const loan = 1800000 + (n % 17) * 350000;
  const rate = 8 + (n % 9) * 0.15;
  const years = 10 + (n % 16);
  const emiHint = Math.round((loan / (years * 12)) * (1 + rate / 18));
  return {
    title: `A month in ${city}`,
    paragraphs: [
      `${name} is looking at a home loan of about Rs. ${loan.toLocaleString("en-IN")} in ${city}, pitched at ${rate.toFixed(2)} percent for ${years} years. The sales sheet circles a monthly figure near Rs. ${emiHint.toLocaleString("en-IN")}. That figure is a sketch, not the sanction. ${name} writes down the amount that will actually be disbursed, the rate, and the months, and only then opens the EMI calculator.`,
      `The useful comparison is not with a friend's EMI. It is with the same loan five years shorter, and with the same loan half a percent dearer. If the dearer EMI breaks the month, the loan is too large for a floating rate. ${name} also writes the processing fee beside the EMI, because the fee never appears inside it and still leaves the bank account.`,
      `Before signing, ${name} asks whether a later rate change will lift the EMI or stretch the last payment, and whether an extra payment will cut the months. The answers go on the same page as the two EMIs. A loan ${name} can finish in a dull year in ${city} is a better loan than a cheaper-looking one that needs a raise.`,
      `This file is a way of practising the questions. The rupees will not match a branch printout to the last rupee, and they are not an offer. Run the same three numbers on the calculator, then change one of them. The number that moves the interest column most is the one to negotiate.`,
    ],
  };
}

function sipDrill(n) {
  const name = pick(NAMES, n, 1);
  const city = pick(CITIES, n, 5);
  const monthly = 2000 + (n % 12) * 1500;
  const years = 6 + (n % 15);
  const rate = 7 + (n % 6);
  return {
    title: `${name}'s ${years}-year habit`,
    paragraphs: [
      `${name} in ${city} can spare Rs. ${monthly.toLocaleString("en-IN")} a month without touching the emergency fund. The date on the goal is ${years} years away. ${name} illustrates the SIP at ${rate} percent, not at the highest number a video mentioned, and writes down both the invested total and the illustrated value.`,
      `The invested total is the promise. The value is a sketch of a steady rate that real markets will not pay smoothly. ${name} runs the same SIP one percent lower before telling anyone the larger figure. If the goal still works at the lower rate, the habit is sized honestly. If it only works at the cheerful rate, the monthly amount is too proud.`,
      `A lumpsum ${name} might receive later is a separate decision. It does not cancel the SIP. Pausing the SIP because a bonus arrived trains the month to wait for luck. ${name} keeps the mandate and decides about the bonus on its own page.`,
      `Once a year, in the month the salary actually changes, ${name} edits the mandate or leaves it. A step-up that lives only in a notebook is not a step-up. The bank will keep taking today's amount, which is fine if that was the decision, and a surprise if it was not.`,
    ],
  };
}

function savingsDrill(n) {
  const name = pick(NAMES, n, 2);
  const city = pick(CITIES, n, 6);
  const kinds = ["a one-year deposit", "a PPF account", "an NPS contribution", "a three-year deposit", "a recurring deposit"];
  const kind = kinds[n % kinds.length];
  return {
    title: `${kind[0].toUpperCase()}${kind.slice(1)} for ${name}`,
    paragraphs: [
      `${name} in ${city} is about to open ${kind}. The first line on the page is the date the money must be available again, not the rate on the poster. If that date is inside a year, a long lock is the wrong prize even when the rate looks polite.`,
      `The second line is the rate ${name} was actually offered, written as a teaching figure only until the passbook or the scheme order confirms it. PPF rates are declared. Deposit rates are a contract. NPS has no promised rate. Mixing those sentences is how people feel cheated by a product that did what it said.`,
      `${name} keeps an emergency buffer in an account that can be emptied tomorrow. The locked product starts after that buffer exists. Breaking a deposit, or pleading with a long scheme, to pay a hospital bill is a costly way to discover the date.`,
      `Tax on interest, TDS, and the NPS annuity rule sit on the third line. The maturity figure is not always the figure ${name} keeps. The form at the bank and the scheme booklet outrank this page. This page is only the order of the questions.`,
    ],
  };
}

function cardDrill(n) {
  const name = pick(NAMES, n, 4);
  const city = pick(CITIES, n, 2);
  const bal = 15000 + (n % 14) * 12000;
  const pay = 2000 + (n % 8) * 1000;
  return {
    title: `${name} stops the swipes`,
    paragraphs: [
      `${name} in ${city} is carrying about Rs. ${bal.toLocaleString("en-IN")} on a card. The minimum due is small and feels responsible. It is the bank's request not to mark the account late. It is not a plan to clear the balance. ${name} picks a fixed payment of Rs. ${pay.toLocaleString("en-IN")} that still fits a dull month.`,
      `New spending on that card stops the same week. A payment of Rs. ${pay.toLocaleString("en-IN")} beside fresh swipes of nearly the same size is not a payment. ${name} leaves one different card, or a debit card, for the expenses that must happen, and clears that one in full.`,
      `If another card has a higher rate, the extra rupee goes there after every card has had its minimum. Fairness between cards is not the aim. The expensive balance is the aim. A personal loan is considered only after the fee is added and only if the empty card will stay empty.`,
      `The due date goes in the calendar a day early. ${name} does not type the real card password into a random checker to 'see the strength'. The strength that matters is the payment that repeats and the swipe that does not.`,
    ],
  };
}

function taxDrill(n) {
  const name = pick(NAMES, n, 7);
  const city = pick(CITIES, n, 8);
  const gross = 700000 + (n % 16) * 150000;
  return {
    title: `${name}'s year in ${city}`,
    paragraphs: [
      `${name} collects the year's gross salary, including any bonus, before opening the calculator. A good March is not a new monthly salary. The gross for this practice is Rs. ${gross.toLocaleString("en-IN")}, and it is only a practice figure. The new regime and the old regime are then run on that same gross.`,
      `Deductions enter the old regime only when a receipt exists. ${name} runs the comparison twice if the receipts are still in a drawer: once with them, once without. The regime that wins only on imaginary deductions is not the regime to tell the employer.`,
      `The slab table is read before any sentence about 'being in the 30 percent slab'. A slice is taxed at each rate. Cess is added at the end. A rebate, when it applies, cancels tax. It does not refund the salary. Marginal relief is why the bill does not always jump like a cliff just above a line.`,
      `Form 16 is checked against the gross ${name} typed. Interest from deposits is added even when no tax was deducted. This book is a salaried map for FY 2026-27 as the site calculates it. A house sale, a business, or a later budget is a reason to leave the map and read the official instruction.`,
    ],
  };
}

function salaryDrill(n) {
  const name = pick(NAMES, n, 9);
  const city = pick(CITIES, n, 1);
  const ctc = 600000 + (n % 12) * 200000;
  return {
    title: `The offer ${name} should rewrite`,
    paragraphs: [
      `${name} in ${city} has a CTC of Rs. ${ctc.toLocaleString("en-IN")}. The first edit is to cross out variable pay, a joining bonus paid later, and anything that says 'up to'. What remains is the number to compare with another offer. The crossed-out lines can be celebrated if they arrive.`,
      `The second edit is the basic percentage and whether PF is capped. A higher basic builds PF and gratuity and lowers the month. A capped PF does the reverse. ${name} asks the recruiter which one the payroll uses instead of assuming the calculator's default.`,
      `Gratuity is written as a leaving benefit, not as this month's rent. Professional tax is written at the state's figure, including zero. Income tax is run in the regime ${name} will actually tell the employer. Take-home is what survives all of that.`,
      `The first real payslip will not match a mid-month joining. ${name} judges the calculator against a full month and the slip against itself, line by line, once. A higher CTC that produces a lower month is a reason to pause the resignation, not a reason to feel ungrateful.`,
    ],
  };
}

function gstDrill(n) {
  const name = pick(NAMES, n, 3);
  const city = pick(CITIES, n, 9);
  const amt = 800 + (n % 20) * 1750;
  const rate = [5, 18, 12, 18, 5, 18][n % 6];
  const inclusive = n % 2 === 0;
  return {
    title: `${name}'s bill in ${city}`,
    paragraphs: [
      `${name} is writing an invoice for Rs. ${amt.toLocaleString("en-IN")}${inclusive ? ", and the client already said the figure includes tax" : ", before tax"}. The rate on the HSN they looked up is ${rate} percent. ${inclusive ? "The base comes from dividing by one plus the rate, not from subtracting the rate." : "The tax is the base times the rate, and the total is base plus tax."}`,
      `Whether the client is in ${city} or outside the state decides CGST and SGST, or IGST. ${name} does not split a tax that should be IGST, and does not add IGST on top of a split. The place of supply is checked when the GSTIN and the memory disagree.`,
      `The tax collected is moved aside. It is not ${name}'s fee. A credit note later uses the same rate as the original invoice, not whatever rate is fashionable in a later month. An old 12 percent bill stays a 12 percent story when it is amended.`,
      `Zero is typed only when the supply is exempt or nil-rated, not when a customer prefers it. This page does not choose the HSN. It only refuses the two common arithmetic mistakes: taxing an inclusive price twice, and subtracting where a division belongs.`,
    ],
  };
}

function studentDrill(n) {
  const name = pick(NAMES, n, 6);
  const credits = [4, 3, 2, 1, 6][n % 5];
  const held = 20 + (n % 8) * 5;
  const attended = held - (n % 6) - 1;
  return {
    title: `${name} counts credits and classes`,
    paragraphs: [
      `${name} has a paper worth ${credits} credits sitting next to a one-credit lab. The lab grade is the one friends talk about, because it is easy to retake in conversation. The ${credits}-credit paper moves the average. When the week has ten spare hours, they go to the heavy paper first.`,
      `Attendance so far: ${attended} present out of ${held} held. ${name} also types the classes still remaining, because a percentage of the past is not the rule. The rule is a percentage of the whole term. The calculator's 'must attend' number is the one that gets written on the timetable.`,
      `The CGPA conversion uses the factor the college printed, not a cousin's 9.5, unless the college said 9.5. If the office will not convert, ${name} reports the grade point and does not invent a percentage for a form that did not ask.`,
      `The exam date loses the travel days and the wedding before the syllabus is divided. A countdown that includes days ${name} will spend on a bus is a flattering countdown. The smaller number is the plan.`,
    ],
  };
}

function emailDrill(n) {
  const name = pick(NAMES, n, 8);
  const topics = [
    ["the homepage decision", "Thursday 4 pm", "ship the simpler layout"],
    ["the logo SVG", "today 3 pm", "set the type without it"],
    ["the tax figure", "this afternoon", "send the corrected regime"],
    ["the empty state", "Wednesday noon", "write the message on it"],
    ["the release date", "Monday", "keep the rest of the release"],
    ["the meeting notes", "end of today", "list decisions, open points, and owners"],
  ];
  const [topic, when, next] = topics[n % topics.length];
  return {
    title: `A note ${name} can send`,
    paragraphs: [
      `${name} is about to write three paragraphs of context about ${topic}. The reader needs the ask. The subject becomes the ask and the date: ${when}. The first line repeats it. The background, if it still matters, goes underneath.`,
      `One apology is allowed if ${name} is late. A stack of apologies is a second task. The next step is concrete: ${next}. If nothing is needed from the reader, the note says that too, so they do not hunt for a hidden question.`,
      `A meeting note uses three lists. What was decided about ${topic}. What is still open. Who does what by ${when}. A diary of who spoke is not a note. 'We should look at it' is not a decision, and ${name} does not write it as one.`,
      `Then ${name} reads only the first line, as a stranger. If the ask is missing, it moves up. The email tool on the site can draft the shape. It cannot know which date slipped. That edit stays with ${name}.`,
    ],
  };
}

function filesDrill(n) {
  const name = pick(NAMES, n, 10);
  const jobs = ["a scholarship scan", "an ID photo", "a signed page", "three bills", "a bug screenshot", "a portal upload"];
  const job = jobs[n % jobs.length];
  return {
    title: `${name} prepares ${job}`,
    paragraphs: [
      `${name} starts from the original file, not from a picture that has already been through a chat app. Chat apps crush photographs. A second compression on a crushed image turns text into a stain. If the original is gone, ${name} photographs the paper again in daylight.`,
      `Pixels and kilobytes are handled in that order when a form asks for both. Resize to the pixel size first. Compress only if the file is still too heavy. JPEG for a photograph, PNG for a screenshot or a logo. A form that is text does not need a colour cast from a tube light unless a red stamp disappears in grey.`,
      `Pages go into the PDF in the order a clerk will read them. ${name} opens the file and checks page two, because page two is where a duplicate of page one hides. The filename uses letters, numbers and hyphens. The portal's sentence about 'one PDF' or 'separate files' beats ${name}'s love of neatness.`,
      `The tools run in the browser. Nothing is uploaded. A very large scan can still fail on a phone because of memory. That is a reason to close other apps or move to a laptop, not a reason to assume the file is cursed.`,
    ],
  };
}

function seoDrill(n) {
  const pages = ["a tuition page", "a clinic page", "a product page", "a tool page", "a job post", "a recipe", "an event page", "a documentation page"];
  const page = pages[n % pages.length];
  const name = pick(NAMES, n, 11);
  return {
    title: `${name} rewrites ${page}`,
    paragraphs: [
      `${name} reads the current title aloud. If it could sit on a different page from a different week, it is too vague. The subject moves to the front. The site name, if it stays, goes to the end. The description keeps one fact that is true only of ${page}, not the tagline that is pasted everywhere.`,
      `The canonical URL is the address ${name} would read aloud, with https, without a campaign tag. The sitemap uses that same string. Old addresses redirect to it. A canonical that points at a redirect is a knot, and ${name} undoes the knot before publishing.`,
      `The Open Graph title and image are checked against the search title. They may differ. They may not contradict. A cover with no alt text is described in plain words: what the picture shows, not a list of keywords.`,
      `Nothing here submits the site to a search engine. The preview tools show whether the snippet is cut off and whether the sitemap lists a page that is gone. ${name} fixes those. Ranking is not a button on this page.`,
    ],
  };
}

function codeDrill(n) {
  const name = pick(NAMES, n, 12);
  const faults = [
    "a trailing comma before a closing brace",
    "smart quotes copied from a document",
    "a comment left inside a JSON file",
    "a CSV column that slid because of an unquoted comma",
    "a leading zero eaten by a spreadsheet",
    "a tab hiding in a YAML indent",
    "two JSON objects pasted into one file",
    "a real API key sitting in a sample",
  ];
  const fault = faults[n % faults.length];
  return {
    title: `${name} meets ${fault}`,
    paragraphs: [
      `${name} trusts the first error the parser names. Later errors are often echoes of that one. The fix for ${fault} is local. ${name} does not reformat the whole project, rename keys, and 'tidy' types in the same save. One change, then parse again.`,
      `A spreadsheet is not a neutral viewer for CSV. Dates and leading zeros move. ${name} keeps the original export, sets delicate columns to text before typing, and checks the header row after saving. A shifted column is quiet and expensive.`,
      `YAML that will not indent is converted to JSON, repaired, and converted back if the tool insists on YAML. SQL that has been prettified is read from the FROM clause downward before it is run. Pretty is not the same as correct.`,
      `Before the file is sent anywhere, including a formatter on a site ${name} does not control, the words key, secret, password and bearer are searched. Real values become obvious fakes. A sample that still works against production is not a sample.`,
    ],
  };
}

function privacyDrill(n) {
  const name = pick(NAMES, n, 13);
  const places = ["email", "the bank", "the domain registrar", "the password manager", "the workplace chat", "an old shopping account"];
  const place = places[n % places.length];
  return {
    title: `${name} and ${place}`,
    paragraphs: [
      `${name} treats ${place} as its own lock. A password reused from a shop is how a shop breach becomes everything else. Length matters more than a clever symbol. A long phrase that is not a proverb beats a short word with a zero in it.`,
      `The password for ${place} lives in a manager, not in a note beside the phone's lock screen, and not in this book's text box. A second factor is turned on where the service allows it. An app or a hardware key is preferred to SMS when both exist. SMS still beats nothing.`,
      `${name} does not rotate the password every month into a pattern. It changes when there is a reason: a breach notice, a shared computer, someone leaving a team. The recovery method for the manager is written down somewhere a lost phone does not also destroy.`,
      `Encoding is not encryption. A hash is not a vault. Base64 is a costume. ${name} does not hide a token in a screenshot and call it safe. These tools can generate a password, look at its shape, or fingerprint a sample. They are not the place the real secret lives.`,
    ],
  };
}

function everydayDrill(n) {
  const name = pick(NAMES, n, 14);
  const bases = [800, 1500, 2400, 60, 80, 100, 250, 4200];
  const base = bases[n % bases.length];
  const pct = [5, 10, 12, 18, 20, 25][n % 6];
  const part = Math.round((base * pct) / 100);
  return {
    title: `${name} names the base`,
    paragraphs: [
      `${name} writes the base before touching a percentage. Here the base is ${base.toLocaleString("en-IN")} and the rate is ${pct} percent, so the slice is ${part.toLocaleString("en-IN")}. Adding that slice and removing it later are different questions, because the second percentage applies to a new base.`,
      `Percentage change uses the starting value. A rise from an old number is not a percentage of the new number. ${name} says the sentence aloud. If the word 'of' has no number after it, the sum is not ready.`,
      `Units are converted with one factor, and rounding waits until the end. Temperature is the conversion that does not share a zero, so it is not treated like kilometres. Dates need a decision about whether the end day counts. Completed age drops the fraction. Working days drop weekends and the holidays that actually exist.`,
      `A rough estimate comes first. If the tool's answer is ten times the estimate, the input is wrong or the tool is the wrong tool. The percentage calculator, the unit converter, the age calculator and the working-day calculator are separate because the questions are separate.`,
    ],
  };
}

function youtubeDrill(n) {
  const name = pick(NAMES, n, 15);
  const topics = [
    "removing GST from an inclusive price",
    "why CTC is not take-home pay",
    "a 25-minute revision block",
    "the minimum due on a card",
    "resizing a photo before compressing it",
    "writing a title a stranger can understand",
    "counting attendance before the last week",
    "a SIP sized at a cautious rate",
  ];
  const topic = topics[n % topics.length];
  return {
    title: `${name}'s title about ${topic}`,
    paragraphs: [
      `${name} writes the promise before the edit: the video is about ${topic}. The title says that in the first few words, with a number or a task a stranger can recognise. 'You won't believe' is deleted. It could sit on any video, which means it sits on none.`,
      `The thumbnail can show a face or a result. It cannot contradict the title. ${name} covers each in turn. If either one becomes mysterious alone, it is fixed. Four large words beat a collage. The image is exported at the size the platform asked for, and checked at the size of a postage stamp.`,
      `The first two lines of the description repeat the promise in a sentence. Hashtags, if any, go after that, and there are three, not twenty. A block of tags at the top spends the visible lines on labels. Chapters and links follow the summary.`,
      `The title is only honest if the video actually shows ${topic}. ${name} would rather retitle than tease. A viewer who leaves because the promise and the footage disagree is a viewer who was right.`,
    ],
  };
}

const WRITERS = {
  "emi-and-home-loans": moneyDrill,
  "sip-versus-lumpsum": sipDrill,
  "ppf-fd-and-nps": savingsDrill,
  "paying-off-a-credit-card": cardDrill,
  "income-tax-for-salaried-people": taxDrill,
  "salary-pf-and-take-home": salaryDrill,
  "gst-for-small-invoices": gstDrill,
  "cgpa-attendance-and-exams": studentDrill,
  "emails-and-meeting-notes": emailDrill,
  "images-and-pdf-files": filesDrill,
  "seo-for-a-small-website": seoDrill,
  "json-csv-and-everyday-code": codeDrill,
  "passwords-and-browser-privacy": privacyDrill,
  "percentages-units-and-dates": everydayDrill,
  "youtube-titles-and-thumbnails": youtubeDrill,
};

export function drill(slug, n) {
  const write = WRITERS[slug];
  if (!write) throw new Error(`No drill for ${slug}`);
  const body = write(n);
  return { title: body.title, toc: false, paragraphs: body.paragraphs };
}
