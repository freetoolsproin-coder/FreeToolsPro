import { loanChapter, sipRows, inr } from "./lib/bookcraft.mjs";

function ch(title, paragraphs, sections = []) {
  return { title, paragraphs, sections };
}

function notes(title, intro, pairs) {
  return ch(title, [intro], pairs.map(([heading, ...paragraphs]) => ({ heading, paragraphs })));
}

const moreLoans = [
  { title: "A transfer and a smaller city", who: "Rekha is moving from Pune to Nashik for her parents", want: "She wants a loan sized for Nashik prices, not for the flat she is leaving.", loan: 3900000, rate: 8.6, years: 18, extra: 4000, fee: 9000, note: "She did not carry the old city's budget into the new one. The EMI is set against the Nashik salary, which is lower, and the extra payment waits until the move costs are over." },
  { title: "A sibling on the title", who: "Amit and his sister bought together in Nagpur", want: "Both names are on the agreement. Only Amit's salary pays the EMI.", loan: 5600000, rate: 8.5, years: 20, extra: 0, fee: 13000, note: "They wrote down, outside the bank form, what happens if one of them wants to sell. The EMI plan and the family plan are different documents. He needs both." },
  { title: "An under-construction delay", who: "Sana's builder in Greater Noida slipped by a year", want: "She is paying rent and a pre-EMI at the same time.", loan: 7200000, rate: 8.7, years: 20, extra: 0, fee: 0, note: "The pre-EMI is interest on the amount already released. It is not a moral discount. She reran the full EMI from the date possession is now promised, and she checked she can carry rent plus that interest without a new card." },
  { title: "A doctor with uneven months", who: "Dr Iyer in Madurai has a clinic and a visiting post", want: "The visiting post pays quarterly. The EMI does not.", loan: 8400000, rate: 8.4, years: 15, extra: 10000, fee: 16000, note: "He set the EMI against the clinic month, and he parks the visiting cheque for the quarter's EMIs in a separate account the week it arrives. The extra payment comes only from a month that was already surplus." },
  { title: "Closing a cheap personal loan first", who: "Neelam in Raipur has a home-loan quote and a personal loan", want: "The personal loan is at 16 percent. The home loan is near 8.5.", loan: 4500000, rate: 8.5, years: 20, extra: 0, fee: 10000, note: "She did not stretch the home loan to feel house-poor while the 16 percent loan sat untouched. The home EMI is sized so the personal loan can be finished first. The house can wait a few more months of rent." },
  { title: "A rate from a housing scheme", who: "Joseph qualifies for a concessional rate in Kerala", want: "The rate is lower and the paperwork is heavier.", loan: 3200000, rate: 7.4, years: 20, extra: 3000, fee: 5000, note: "He read which delays cancel the concession. A cheap rate that becomes a normal rate after a missed paper is a different loan. The file uses the concessional rate only because he has the eligibility letter." },
  { title: "Two flats, one too many", who: "Karthik in Hyderabad was approved for a larger loan", want: "The larger flat has a view and a weaker month.", loan: 9800000, rate: 8.55, years: 25, extra: 0, fee: 22000, note: "He is looking at this number in order to refuse it. The EMI fits only if nothing else goes wrong. He is keeping the smaller flat, and this file exists so the refusal has arithmetic behind it." },
  { title: "A joint income that might become one", who: "Ritu and Sameer in Noida both work in the same company", want: "A layoff would hit them together.", loan: 7000000, rate: 8.45, years: 20, extra: 5000, fee: 15000, note: "Two salaries from one employer are not two risks. They sized the EMI for one salary. The second salary builds the extra payment and the emergency fund. If both incomes vanish, no EMI was ever safe, and they know that." },
];

export function volumeFor(slug) {
  const common = {
    "emi-and-home-loans": [
      loanChapter(moreLoans),
      notes(
        "What to ask before you sign",
        "Take this list to the branch. Write the answers on the sanction letter, not in your memory.",
        [
          ["Which balance is the EMI calculated on?", ["Ask whether any fee is deducted from the amount disbursed. An EMI on Rs. 50 lakh when you received Rs. 49.2 lakh is a different loan from the one in the advertisement. Make the schedule match the money that hit your account, or the money that will hit it in stages."]],
          ["What happens when the benchmark moves?", ["You want a sentence: the EMI changes, or the tenure changes. Both are legal shapes. They feel different in a household. If the tenure stretches silently, you can pay for years and not notice until a statement shows a date you did not agree to in spirit."]],
          ["Is prepayment free, and does it cut the months?", ["Get the fee in writing for your type of rate. Then say you want the tenure reduced. A lower EMI feels like a gift and keeps the expensive years. A shorter tenure is how you bought the house sooner."]],
          ["What is insured, and who is paid?", ["A policy that pays the lender is not the same as a policy that protects your family. You may still want it. You should know which one you are buying, and whether the premium is a single deduction or a quiet addition to the loan."]],
          ["What counts as a default?", ["One missed EMI and three missed EMIs are not the same event in every agreement. Ask about the late charge, the rate penalty, and the day they report you. Knowing the cliff is part of deciding the EMI was small enough."]],
          ["Can the EMI date match your salary date?", ["A salary on the 7th and an EMI on the 2nd spends a weekend in overdraft. Moving the EMI date is sometimes free and sometimes not. It is a better negotiation than a free gift hamper."]],
        ]
      ),
    ],
    "sip-versus-lumpsum": [
      notes(
        "More files, same honesty about the rate",
        "These use the same straight illustration as the earlier files. The rate is a teaching rate. The habit is the part you can actually promise.",
        [
          ["Rakesh starts at Rs. 3,000", (() => { const s = sipRows(3000, 10, 20, 10); return [`He lives in Ajmer and will not pretend to invest his brother's amount. Rs. 3,000 a month, stepped up 10 percent a year, at an illustrated 10 percent for 20 years, puts in about Rs. ${inr(s.invested)} and shows a value near Rs. ${inr(s.value)}. He will believe the invested column. The value column is a sketch.`]; })()],
          ["Hema does not copy a larger SIP", (() => { const s = sipRows(5000, 9, 12, 0); return [`In Trichy she invests Rs. 5,000. Twelve years at an illustrated 9 percent grows toward Rs. ${inr(s.value)}, with about Rs. ${inr(s.invested)} coming from her. Matching a relative's amount and then stopping in month four is a worse result than a smaller SIP that stays.`]; })()],
          ["Parveen's shop deposit", (() => { const s = sipRows(18000, 8, 7, 0); return [`Seven years is close. He uses 8 percent on Rs. 18,000 a month so the plan does not need a boom. Illustrated value is about Rs. ${inr(s.value)} from about Rs. ${inr(s.invested)} invested. If the shop is for sale a year early, he will not force the last year by borrowing.`]; })()],
          ["A bonus that tries to cancel the SIP", ["Cynthia in Shillong received a bonus and considered pausing the SIP 'because this year is covered'. The bonus is a lumpsum. The SIP is the month. Pausing trains the month to wait for luck. She kept the SIP and invested part of the bonus beside it."]],
          ["The year you will want to stop", ["Write down, now, the fall that would scare you. A 20 percent drop? A flat three years? If the honest answer is that you would sell, do not use a volatile illustration for money you need on a date. The calculator is not braver than you are."]],
          ["Raising the SIP without a ceremony", ["The useful moment is the month your salary actually rises. Change the mandate that week. A New Year resolution and a spreadsheet step-up are not a mandate. The bank will keep taking the old amount forever, faithfully."]],
          ["Two goals, two dates", ["A down payment in six years and retirement in twenty-five cannot share one SIP and one risk. Split the amount. The near date gets the calmer home. The far date can tolerate a bad year. Mixing them means the bad year arrives exactly when the down payment is due."]],
          ["When the illustration is enough", ["If the invested column already reaches your goal, you do not need a heroic rate. Stop hunting a product that promises the gap. The gap you can close by saving a little more is a better gap than the one you close by believing a louder number."]],
        ]
      ),
    ],
    "ppf-fd-and-nps": [
      notes(
        "Dates before rates",
        "A higher rate in the wrong lock is a smaller help than it looks.",
        [
          ["The emergency fund stays liquid", ["Three months of expenses in an account you can empty tomorrow beats a PPF deposit you will regret in a fever. The locked products start after that buffer exists. People reverse this and then take a personal loan to get their own money out, which is a bleak kind of saving."]],
          ["A deposit ladder", ["Instead of one five-year deposit, some households split the sum across one, two and three years so something matures each year. The rate on the short piece is lower. The point is the cash that arrives without breaking a contract. Use it when your dates are staggered. Do not use it to feel clever about a single far date."]],
          ["PPF and the yearly cap", ["There is a ceiling on what you can add in a year. Depositing in a rush in March and depositing in April are different years. If you miss a year, you cannot pour two years in later to 'catch the interest'. You can only fill the year you are in, up to the cap."]],
          ["Whose name is on the PPF", ["An account in a spouse's or a child's name has rules about who may pay and how it is taxed in the parent's hands. Do not open it as a costume for your own limit without reading the current rule. A gift that creates a tax surprise is a clumsy gift."]],
          ["NPS allocation is a mood if you change it weekly", ["Pick a mix you can leave through a bad year. Changing to safety after a fall and to equity after a rise is a method for buying high and selling low. The illustration in this book is a straight line precisely so you notice that real life will not be."]],
          ["Annuity is a purchase, not a leftover", ["The part of NPS that must buy an annuity is not 'trapped'. It is the pension. Price it as a purchase you will make at an unknown future rate. If you need every rupee as cash on a known date, NPS is the wrong shelf."]],
          ["Senior rates on deposits", ["Banks often pay a higher deposit rate above a certain age. It is still a deposit, with a date and a tax treatment. Do not move a pensioner's emergency money into a five-year deposit only because the senior rate looks polite."]],
          ["Writing the date on the passbook", ["For every locked rupee, write the date you are allowed to see it again. If you cannot say the date, you do not yet know whether the product fits. The rate is the second line. People put it first and then discover the date in a crisis."]],
        ]
      ),
    ],
    "paying-off-a-credit-card": [
      notes(
        "Staying clear after the balance dies",
        "The month the balance hits zero is not the end of the plan. It is the start of a different one.",
        [
          ["Freeze the card in the app", ["You can leave the account open and turn off swipes. The limit sitting there is a temptation with your name on it. A freeze you can undo in a minute is still a speed bump. Use it for the first three quiet months."]],
          ["One card, paid in full, on purpose", ["A single card you clear every month is a payment tool. Three cards you clear 'most months' are three ways to revolve. Pick one. Put a reminder the day before the due date, not the morning the fee posts."]],
          ["Cash advances are a different price", ["Taking cash on a card often starts interest immediately and adds a fee. It is not the same product as paying for groceries inside the grace period. If you need cash, a card advance is one of the expensive ways to get it. Price it before you do it, not after."]],
          ["The statement date and the due date", ["They are not the same day. Spending just after the statement can feel like it belongs to the next life. It belongs to the next statement, which arrives quickly. Know both dates. Pay before the due date, not on the evening of it, when a failed transfer becomes a late fee."]],
          ["A raise is not a reason to raise the limit", ["The bank will offer. A higher limit does not reduce the interest rate on the balance you already have. Accept it only if a higher limit helps a utilisation figure you care about and you will not spend it. Otherwise the offer is a larger hole."]],
          ["Couples and a shared card", ["Whoever's name is on the card owes the balance, including what the other person spent. A household rule written down is less romantic and more useful. The rule can be 'this card pays groceries and is cleared on payday'."]],
          ["When you still cannot pay the fixed amount", ["Call the bank before the due date and ask what hardship arrangement exists. A conversation before the miss is different from a conversation after three misses. This book cannot invent their policy. It can tell you the order: talk early, stop new spending, then resume a fixed payment you named."]],
          ["The score will follow the behaviour", ["Paying down a revolving balance usually helps a credit report more than a new card 'for the points'. The points on a revolving balance are bought at the APR. Ignore them until the balance is gone."]],
        ]
      ),
    ],
    "income-tax-for-salaried-people": [
      notes(
        "Reading a year without panic",
        "These are habits around the slabs, not extra slabs. The worked files earlier are the arithmetic.",
        [
          ["Open the form in June, not in July", ["The documents do not become clearer in the last week. A June evening with Form 16, the interest certificates and last year's return is enough to see which regime you are drifting toward. The calculator then takes ten minutes. The last week takes your weekend."]],
          ["Interest is income", ["Deposit interest and savings-account interest belong in the return even when the bank did not deduct tax, and even when the amount feels small. Small amounts across four banks stop being small. The form will not list a bank you forgot to mention."]],
          ["A rebate is not a refund of salary", ["Crossing the rebate line does not mean your whole salary becomes taxable at the top rate. It means the rebate that was cancelling the slab tax steps aside, sometimes gently because of marginal relief. Read the slab table in the file before you describe your life as 'falling into 30 percent'."]],
          ["Employer and employee can disagree", ["Your employer deducted tax on the regime they were told. Your return can, for many salaried people, choose again. If you choose differently, the difference is payable or refundable. It is not a scolding. It is arithmetic you should have previewed, which is what the comparison file is for."]],
          ["Keep the proof with the deduction", ["A deduction without a receipt is a story. If you are not willing to keep the receipt, do not enter the deduction. The old regime's advantage is exactly those receipts. The new regime's advantage is not needing them."]],
          ["A bonus is a year's income", ["Do not divide March's credit by one and call it your new monthly salary for tax. Put the year's gross in the calculator, bonus included, and see the bill. Then see what TDS has already been taken. The gap is what you save for, or what you get back."]],
          ["Rent receipts are not a personality", ["If you claim HRA, the rent should be rent you paid, to a person who owns the house, and the paperwork your employer asked for should exist. A convenient number is how people get letters later. Use the HRA file only with the three real figures."]],
          ["When to stop using this book", ["Business income, capital gains, a house sold, or a year lived in two countries. Those are not the salaried map in these pages. A preparer or the official instructions are the next step. Guessing with a salary calculator is how a special-rate income gets taxed as if it were salary."]],
        ]
      ),
    ],
    "salary-pf-and-take-home": [
      notes(
        "Offer letters, line by line",
        "Read the letter with a pencil. Circle anything that is not paid every month.",
        [
          ["Find the variable line and delete it", ["Bonus, incentive, joining bonus paid later, and 'up to' amounts are not rent money. Rewrite the CTC without them. Compare that smaller number with the other offer's smaller number. You can add the bonus back as a maybe. You cannot start from it."]],
          ["Ask what basic percent they use", ["PF and gratuity follow basic. A role with basic at 40 percent and a role at 50 percent are different months and different futures. If the letter does not say, ask. Do not assume the calculator's default is their payroll."]],
          ["Ask if PF is capped", ["Capped PF raises take-home and slows the fund. Full basic PF does the opposite. Neither is a scam. They are a choice the employer already made. Your choice is whether you prefer that month or that fund, and whether you will add a SIP to replace a thin PF."]],
          ["Professional tax is a state habit", ["Some states charge it and some do not, and the amount is small beside income tax. Small is not zero. A move between cities can change it. Put the new state's figure in the calculator when you move, not the old city's."]],
          ["Gratuity is a leaving benefit", ["Do not spend it in the offer comparison as if it arrives each March. Do include it when you compare a job that has it with a contract that pays a higher month and nothing at the end. Five years is a long time. Zero is also a number."]],
          ["The first month will look wrong", ["Joining midway, a prorated salary, and a deposit of old PF can make month one unlike the calculator. Judge the calculator against a full month. Judge month one against the payroll slip, line by line, once."]],
          ["A higher CTC can be a lower month", ["Employer PF, gratuity, and a lower basic structure can do this. Write both months before you resign. A resignation is expensive to reverse. A spreadsheet row is not."]],
          ["Keep the slip", ["The salary slip is the evidence for gratuity, for PF, and for the return. A folder, paper or digital, beats a portal you lose the password to in year six. Download the PF passbook twice a year and check that the employer actually paid."]],
        ]
      ),
    ],
    "gst-for-small-invoices": [
      notes(
        "Invoices people actually send",
        "The arithmetic is the same as the earlier files. These are the moments it goes wrong.",
        [
          ["The client said 'including'", ["Write the inclusive total, then the base, then the tax, on the invoice. A single number and a smile is how a dispute starts. If your fee is Rs. 25,000 including 18 percent, the base is 25,000 divided by 1.18, not 25,000 minus 18 percent."]],
          ["A credit note", ["When you reduce a bill, you reduce the base and the tax together. Cancelling only the base and leaving the tax, or the reverse, makes the next return sulk. Match the original rate. Do not use today's rate on last year's invoice."]],
          ["Round off", ["A rupee of round-off is a line, not a new tax rate. If you round every line to a rupee and also round the total, you can be a rupee off from a system that rounded once. Pick the same habit as the return software."]],
          ["Place of supply", ["A client with a GSTIN in another state is a clue, not the whole rule. The place-of-supply rules depend on what you supplied. When the clue and your memory disagree, stop and check. IGST and a CGST pair are not interchangeable costumes."]],
          ["Your own purchase", ["A laptop for the studio may have GST you can set off, and a laptop for the house may not. The invoice should be in the business name if you intend to claim it. A personal bill with the company written on later is a weak claim."]],
          ["The money is not yours", ["Move the GST you collected to a separate account the week it arrives, if you can. Mixing it with fees is how a decent quarter becomes a return you cannot pay. The separate account is dull. Dull is the point."]],
          ["Exempt and nil are choices you must earn", ["Charging zero because a customer asked is not an exemption. The exemption lives in the rate list. If you are not sure, charge the ordinary rate or ask a preparer. A friendly zero is an expensive friendship."]],
          ["Old bills in a new month", ["A July bill at 12 percent stays a 12 percent bill when you amend it. A fresh supply in a later month uses the rate for that month. Copying the old invoice as a template is how dead rates walk into new years."]],
        ]
      ),
    ],
    "cgpa-attendance-and-exams": [
      notes(
        "A term, kept honest",
        "The marksheets and attendance files earlier are the sums. These are the decisions around them.",
        [
          ["Repair the heavy credit first", ["A one-credit lab at a low grade is irritating and cheap. A four-credit paper at the same grade moves the average like furniture. When you have ten hours, spend them on the heavy paper. Vanity study of the easy elective is a way to feel busy."]],
          ["Ask for the conversion factor once", ["Email the office and keep the reply. Multiplying by 9.5 because a cousin did is how two forms in the same university disagree. If they say they do not convert, report the CGPA and stop inventing a percentage a recruiter did not require."]],
          ["Attendance is a weekly look, not a finale", ["Fifteen minutes on Friday with the held and attended counts prevents a crisis in the last fortnight. The calculator is fast. The crisis is not. Put the remaining classes in as well, or you will comfort yourself with a percentage of the past."]],
          ["A medical absence still needs a paper", ["The arithmetic may show a shortage the college can condone. Condonation is a form, a date and a signature. It is not the fact that you were ill. File it while the classes still exist to be discussed."]],
          ["Count revision days you will use", ["A plan of fourteen days that includes three travel days and a wedding is an eleven-day plan. Write the eleven. Divide the syllabus by eleven. The wedding does not become a study day because the countdown tool was optimistic."]],
          ["Past papers are a map", ["One full paper, timed, tells you more than a reread of the favourite chapter. The grade you want has a shape on the page. Look at the shape before you highlight another paragraph."]],
          ["Group study needs a job", ["Four people rereading notes to each other is company. Four people solving one question and arguing about the mark scheme is study. Give the meeting a question or cancel it."]],
          ["Sleep is part of the mark", ["The last night is a bad time to meet a new chapter. A rested paper beats a heroic one. Stop at a fixed hour. The chapter you did not finish is still there in the morning, and so are you."]],
        ]
      ),
    ],
    "emails-and-meeting-notes": [
      notes(
        "Sentences you can steal",
        "These are originals for this book. Change the names. Keep the shape.",
        [
          ["The follow-up that does not nag", ["Subject: Friday's decision, still need it. The first line repeats the decision and the date. The second line says what you will do if you hear nothing. People answer a consequence faster than they answer a mood. 'Just bumping this' is a mood."]],
          ["Handing work back clearly", ["Subject: Draft returned, two changes. Say what you changed and what you did not touch. A draft returned with 'some thoughts' in the margin is a second job for the writer. A draft returned with two numbered changes is a finish line."]],
          ["A meeting you can decline", ["Subject: I will skip Thursday's status. I have nothing to decide there and the notes will reach me. Invite me when the ebook layout is on the agenda. A decline with a reason saves an hour and does not insult the host."]],
          ["Notes for a design review", ["Decisions: the cover keeps the author name at the bottom. Open: whether the topic label is orange or white. Actions: Lalaji updates the cover by Tuesday. Three lines. The debate about orange can live in the open list without pretending it was settled."]],
          ["Bad news in the first line", ["Subject: The export will not make Thursday. We found broken page numbers on the contents page. I will send a new file on Monday. I am not going to bury that under a paragraph of effort. The reader can feel the effort after they know the date."]],
          ["Asking for a file", ["Subject: Need the logo SVG today. PNG will not scale on the cover. Please send the SVG by 3 pm. If it does not exist, tell me and I will set the type without it. A request that includes the fallback is easier to answer than a request that assumes the file is sitting there."]],
          ["After you were wrong", ["Subject: The tax figure in yesterday's note was the old regime. The new-regime figure is lower. I have attached the corrected line. Use that one. Correct the fact. Do not write a paragraph about how busy the week was."]],
          ["A note to yourself", ["At the end of the day, three lines: decided, waiting, next. It is the same shape as the meeting note. You are allowed to be a meeting of one. It stops the next morning from starting with a hunt through chat."]],
        ]
      ),
    ],
    "images-and-pdf-files": [
      notes(
        "Jobs, in order",
        "Do one change, check the file, then do the next. A portal does not tell you which of three changes it disliked.",
        [
          ["The scholarship form", ["Scan in daylight. Crop to the page. Rotate. Combine to one PDF. Check that page 2 is the income certificate and not a second photo of page 1. Then look at the file size. Compress only if the portal complains. A crisp readable scan beats a tiny blurry one that scraped under the limit."]],
          ["The photo for an ID", ["They gave pixel size and file size. Resize to the pixels first. Then compress if needed. Do not beautify. The ID office wants your face, not a filter. A filter that changes skin tone can get the photo rejected for looking unlike you."]],
          ["A signed contract", ["Keep the unsigned PDF. Sign the printed signature page or use a proper signature flow if you have one. Replace only that page if you must scan. Rebuilding the whole contract as photographs makes the text soft and the file huge."]],
          ["WhatsApp is not a scanner", ["Pictures sent through chat are already crushed. Ask for the original, or photograph again. Starting from a crushed image and compressing more is how text becomes a stain."]],
          ["Naming the file", ["application-meera-kumar.pdf is a kinder name than IMG_4033.pdf. Some portals reject spaces or symbols. Use letters, numbers and hyphens. The name is not the place for a joke."]],
          ["One long PDF or many", ["Read the instruction. 'Single PDF' means merge. 'Each certificate separate' means do not merge. People merge out of neatness and then fail a form that wanted five uploads. The form's sentence beats your sense of order."]],
          ["Colour or grey", ["Text documents can be grey. A stamp that is red sometimes needs colour so it is visible. If the stamp disappears in grey, go back to colour for that page only, if the tool allows, or for the whole file if it does not."]],
          ["Check on another device", ["Open the PDF on a phone before you upload it from a laptop. A font that substituted, or a page that rotated only on one viewer, shows up there. Two minutes. Fewer rejection mails."]],
        ]
      ),
    ],
    "seo-for-a-small-website": [
      notes(
        "A page worth indexing",
        "Small sites win by being specific. These are the edits, not the theory.",
        [
          ["Kill the duplicate welcome", ["If three pages open with the same paragraph, two of them are not pages. Rewrite or combine. A search engine asked to choose among copies will choose slowly, or choose the one you did not mean."]],
          ["Titles that share a prefix", ["'FreeToolsPro - ' in front of every title spends the same words forty times. Put the tool first. The site name can end the title if there is room. The person scanning results already sees the site elsewhere."]],
          ["Descriptions that share a suffix", ["A tagline pasted on every page trains people to ignore it. Write one fact that is true only of this page. The EMI page can mention tenure. The GST page can mention inclusive prices. The tagline can live on the home page, where it is actually about the site."]],
          ["Canonicals after a redesign", ["New URLs need redirects from the old ones, and canonicals that point at the new ones. A canonical pointing at an old URL that redirects back is a loop. Pick the final address and use it everywhere, including the sitemap."]],
          ["Parameter mess", ["A link with a campaign tag should canonical to the clean URL. Otherwise every newsletter creates a new 'page'. The clean URL is the one you would read aloud."]],
          ["Sitemap hygiene", ["Remove URLs that 404. Remove URLs that redirect. The sitemap is a claim that these addresses are real and final. A claim you break on purpose wastes the crawl you wanted for the new guide."]],
          ["The page should match the title", ["A title that promises a 2026 tax slab and a page that explains a generic percentage is a disappointment. The click was earned by the title. The page has to pay it. This is also why people leave, and leaving is the part you feel."]],
          ["Images need words", ["A cover image with no alt text is invisible to a search and to a screen reader. Describe the cover: the book title and that it shows the author's name. Do not stuff keywords into the alt. Say what the picture is."]],
        ]
      ),
    ],
    "json-csv-and-everyday-code": [
      notes(
        "Breakages, and the fix that is usually enough",
        "You do not need a new parser. You need the first error.",
        [
          ["The comma that ended a list", ["Delete the comma before the closing bracket. Add nothing else. If the file then fails later, that is a second error, which you could not see while the first one was shouting."]],
          ["Smart quotes from a document", ["A word processor turns straight quotes into curled ones. JSON wants straight quotes. Retype the quotes or paste through a plain-text editor. The curl is invisible and fatal."]],
          ["A comment you meant to be helpful", ["JSON has nowhere for a comment. Put the note in a README, or in a field called note if the consumer of the file agreed to that. A // in the file is not a note. It is a syntax error."]],
          ["CSV opened and saved by a spreadsheet", ["The spreadsheet may have rewritten dates and dropped zeros. Keep the original export. If you must edit, set the sensitive columns to text before you type. Save a copy. Diff the headers. A shifted column is a silent disaster."]],
          ["Two JSON objects in one file", ["Some logs write one object per line. That is not one JSON document. A strict parser wants one value. Either wrap them in an array, or use a parser that expects lines. Do not add a comma between them and hope."]],
          ["YAML that was almost JSON", ["If the indentation is fighting you, convert to JSON, fix the data, and convert back. You are allowed to use the stricter format as a workbench. The production file can still be YAML if the tool demands it."]],
          ["A query formatted and still wrong", ["Pretty SQL can still join the wrong table. Read the formatted version from the FROM clause downward. Ask what each join adds. A formatter is a lamp, not a colleague."]],
          ["Secrets in the sample", ["Search the file for words like key, secret, password and bearer before you send it to anyone, including a formatter on a site you do not trust. Replace with obvious fakes. Then send it."]],
        ]
      ),
    ],
    "passwords-and-browser-privacy": [
      notes(
        "A setup you will still use on a tired day",
        "The best lock is the one you do not bypass.",
        [
          ["Put the manager on before you need it", ["Install it on a calm afternoon. Add email and banking first. Add the rest when you next log in, not in a single heroic hour you will abandon. Turn on the second factor for the manager itself. A manager without a second factor is a single point of failure you chose."]],
          ["Recovery before cleverness", ["Write the recovery method down and store it where a fire or a lost phone does not take both copies. A password system you cannot recover is a future lockout. People then reuse a weak password to escape it. The recovery is part of the security."]],
          ["Unique where a reset lives", ["Email first, then the bank, then the domain name, then everything else. Those four unlock the others. If you do nothing else this month, make those four unique and add a second factor."]],
          ["Do not quiz yourself monthly", ["Forced monthly changes push people into Season2026! and Season2027!. Change a password when there is a reason: a breach, a shared laptop, someone leaving the team. A calendar is a weak reason."]],
          ["Shared houses and shared logins", ["A streaming password on the fridge is a streaming password. A banking password on the fridge is a bad plan. Decide which accounts are allowed to be casual. Write that down so a guest does not get the wrong one."]],
          ["Public wifi and the ordinary rules", ["A cafe network is a reason to use the sites' own locks, not a reason to invent a new password habit for the afternoon. The second factor matters more on a network you do not control. So does not typing a password into a page that looks almost like your bank."]],
          ["Old accounts", ["Close the ones you do not use. An account you forgot is still an account, with a password you may have reused. A password manager's list of logins is also a list of things to shut."]],
          ["What this site will not do", ["It will not store a password for you, and it will not encrypt a file. Generate, check a shape, or hash a sample. Then leave. Your real secrets belong in the manager, not in a text box you used for learning."]],
        ]
      ),
    ],
    "percentages-units-and-dates": [
      notes(
        "More questions, same habit",
        "Name the base. Then multiply or divide once. Round at the end.",
        [
          ["A shop says 20 percent off and then 10 percent more", ["Twenty percent off Rs. 2,000 leaves Rs. 1,600. Ten percent off that leaves Rs. 1,440. It is not 30 percent off, which would have left Rs. 1,400. The second discount applies to the already reduced price. Write both steps or the customer and the owner will argue about Rs. 40 and both will be sure."]],
          ["A score out of 60", ["41 out of 60 is 41 divided by 60, times 100, about 68.3 percent. It is not 41 percent. The habit of reading the numerator as the percentage is the whole error. The denominator is the exam, not 100, unless the exam was out of 100."]],
          ["Fuel", ["A car that drinks 5 litres per 100 kilometres uses 5 litres to go 100. To go 250 it uses 12.5 litres. Price that at the pump rate and you have the cost. People divide backwards and get a confident, tiny number. If the number could not fill a bottle, it is backwards."]],
          ["Time zones without heroics", ["A meeting at 6 pm in India is not 6 pm in London. Convert with a known offset for that date, because offsets change with daylight saving. Write both times in the invite. A verbal 'evening' is how people miss each other by an hour and a half."]],
          ["A loan of days", ["Borrowed on the 10th and returned on the 12th might be two days or three, depending on whether both ends count. A library and a bank do not have to agree. Read their sentence. Then add. Do not subtract and then argue from memory."]],
          ["Percent of the remainder", ["You have finished 30 percent of a book. The rest is 70 percent, not 30. A plan to finish 'the same again' finishes 60 percent and leaves you short. The remainder is the base for the next plan."]],
          ["Square metres", ["A room 4 metres by 5 is 20 square metres. A carpet priced per square foot needs the conversion before the price, not after you have fallen in love with the sample. Convert the area once. Then multiply by money."]],
          ["Cooking and the factor", ["A recipe for 4, you are 6. Multiply each ingredient by 6/4, which is 1.5. Salt and spice can be less than the factor if you know the dish. The factor is the start, not a law against tasting."]],
        ]
      ),
    ],
    "youtube-titles-and-thumbnails": [
      notes(
        "A upload you can explain",
        "If you cannot say the promise in one breath, the title is not finished.",
        [
          ["Write the title before you edit", ["The edit should serve a sentence you already believe. A title invented after a meandering edit becomes a guess about what the footage might be. The sentence can change. It should exist first."]],
          ["One viewer", ["Not 'everyone who likes money'. A person holding a sanction letter. A student counting attendance. A shopkeeper with a GST-inclusive price. Speak to that person and the title gets specific without trying to be clever."]],
          ["The number has to be in the video", ["If the title says Rs. 12 lakh is not Rs. 1 lakh a month, the video should show the subtraction. A title that the video does not pay is a trick, and the audience that leaves will be right."]],
          ["Faces are optional", ["A face helps recognition. It does not replace the four words. A face with no words on a technical video makes people guess. Guessing is not a click you want. Add the words."]],
          ["Contrast is not clutter", ["Light text on a light shirt disappears on a phone in daylight. Check the thumbnail at the size of a postage stamp. If you cannot read it, neither can they. Increase the type or cut a word."]],
          ["Series need their own promises", ["Part 3 should say what part 3 is. 'Part 3' alone is a password for people who saw part 2. A new viewer is allowed to start there. Give them a noun."]],
          ["The description's first verb", ["Start with a verb or a fact. 'In this video I will be talking about' spends the visible lines on a throat clear. 'Remove GST from an inclusive price in one division' is the line. Then the chapters."]],
          ["Leave when it is agreed", ["Title, first lines, thumbnail. If all three could be swapped onto a different video of yours, they are too vague. If they contradict, fix them before you publish. After publishing, you can still edit a title. Do it when you notice, not after a month of the wrong people clicking."]],
        ]
      ),
    ],
  };
  return common[slug] || [];
}
