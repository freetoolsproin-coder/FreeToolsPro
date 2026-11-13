import { cgpa, attendance, inr } from "./lib/bookcraft.mjs";

function ch(title, paragraphs, sections) {
  return { title, paragraphs, sections };
}

export function studentBook() {
  const sheets = [
    { title: "A semester with one heavy paper", name: "Anjali", subjects: [{ name: "Maths", credits: 4, grade: 9 }, { name: "Physics", credits: 4, grade: 8 }, { name: "Lab", credits: 1, grade: 6 }, { name: "English", credits: 2, grade: 7 }] },
    { title: "The lab that looked harmless", name: "Rehman", subjects: [{ name: "Theory", credits: 3, grade: 8 }, { name: "Workshop", credits: 3, grade: 5 }, { name: "Elective", credits: 2, grade: 9 }, { name: "Project", credits: 4, grade: 7 }] },
    { title: "A comeback semester", name: "Sneha", subjects: [{ name: "Accounts", credits: 4, grade: 10 }, { name: "Law", credits: 4, grade: 9 }, { name: "Tax", credits: 3, grade: 8 }, { name: "Soft skills", credits: 1, grade: 6 }] },
    { title: "Credits hiding in a project", name: "Kabir", subjects: [{ name: "Design", credits: 2, grade: 9 }, { name: "Studio", credits: 6, grade: 7 }, { name: "History", credits: 2, grade: 8 }] },
    { title: "Even grades, uneven credits", name: "Meera", subjects: [{ name: "C1", credits: 1, grade: 10 }, { name: "C2", credits: 1, grade: 10 }, { name: "C3", credits: 5, grade: 6 }, { name: "C4", credits: 3, grade: 7 }] },
    { title: "A postgraduate load", name: "Divya", subjects: [{ name: "Seminar", credits: 2, grade: 8 }, { name: "Core", credits: 4, grade: 8 }, { name: "Core 2", credits: 4, grade: 7 }, { name: "Dissertation", credits: 8, grade: 8 }] },
  ];
  const sections = sheets.map((s) => {
    const g = cgpa(s.subjects);
    const pct = g.cgpa * 9.5;
    return {
      heading: s.title,
      paragraphs: [
        `${s.name}'s subjects this term are weighted by credits, not by how many names appear on the marksheet. Grade points are on a 10-point scale in this file.`,
        `Total credits are ${g.credits}. The credit-weighted grade point is ${g.cgpa.toFixed(2)}. A university that converts CGPA to a percentage by multiplying by 9.5 would print about ${pct.toFixed(2)}. A university that prints a different factor on the back of the marksheet wants that factor, not 9.5. Using the wrong factor is how a form and a marksheet disagree.`,
        `The lowest grade hurts in proportion to its credits. A 6 in a one-credit lab moves the average less than a 6 in a four-credit paper. When time is short, the heavy paper is the one to repair.`,
      ],
      table: {
        caption: "Credits times grade point.",
        headers: ["Subject", "Credits", "Grade", "Points"],
        rows: s.subjects.map((x) => [x.name, String(x.credits), String(x.grade), String(x.credits * x.grade)]),
      },
    };
  });

  const classes = [
    { name: "Arun", held: 40, attended: 28, need: 75, left: 20 },
    { name: "Fatima", held: 50, attended: 40, need: 75, left: 10 },
    { name: "John", held: 30, attended: 18, need: 80, left: 16 },
    { name: "Keerthi", held: 60, attended: 42, need: 75, left: 8 },
    { name: "Imran", held: 24, attended: 20, need: 75, left: 12 },
    { name: "Sara", held: 45, attended: 30, need: 85, left: 15 },
  ];
  const attendSections = classes.map((c) => {
    const a = attendance(c.held, c.attended, c.need, c.left);
    return {
      heading: `${c.name}: ${c.need} percent required`,
      paragraphs: [
        `${c.held} classes have been held and ${c.attended} were attended. That is ${a.now.toFixed(1)} percent so far. ${c.left} classes remain. The rule is ${c.need} percent of all classes, including the ones still to come.`,
        a.must <= 0
          ? `${c.name} is already safe even if the remaining classes are missed, on this arithmetic. The college may still have a rule about consecutive absences. Arithmetic does not cancel that rule.`
          : `${c.name} must attend at least ${a.must} of the remaining ${c.left} classes. That leaves ${a.canMiss} that can be missed. A negative room means the target is already out of reach unless the college condones it.`,
        "Count a class as held when the department counts it, not when you wish it had been cancelled. A mass bunk that the college marks as held is an absence. Check the number on the notice, then redo the sum.",
      ],
    };
  });

  return [
    ch("Credits, not subjects", [
      "A grade point average is a weighted mean. The weight is the credit. A paper with four credits pulls four times as hard as a one-credit lab with the same grade. Counting subjects instead of credits is how a 'fine' semester surprises you on the transcript.",
      "Many Indian universities turn CGPA into a percentage by multiplying by 9.5. Yours might not. The factor, if it is printed, beats the habit. A form that asks for a percentage wants the factor your university uses. A calculator that assumes 9.5 is a default, not a decree.",
      "Letter grades are cutoffs. The cutoff belongs to the board or the college, not to a general table you found online. CBSE grades and an engineering college's internal scheme are different ladders. Use the ladder that will sign the marksheet.",
    ]),
    ch("Attendance is a count, not a feeling", [
      "The percentage on a notice is classes attended divided by classes held. The useful number is how many of the remaining classes you must still attend. That number changes every time a class is held without you. Guessing from a percentage you remember from last month is how people discover the shortage in the last week.",
      "If the rule is 75 percent, you do not need 75 percent of what has already happened if many classes remain. You need 75 percent of the whole term. The files do that sum. They cannot see a medical condonation or a minimum number of practicals. Read those beside the arithmetic.",
      "An exam date is a count of days, and a count of days you will actually study. A calendar that includes Sundays looks kinder than a plan that studies on six evenings. Use the smaller number to divide the syllabus. Leave the last day to read the whole paper once, not to meet a new chapter.",
    ]),
    { title: "Marksheets", paragraphs: ["Grade points are illustrative. Put your own grades into the CGPA tool. If your scale is not out of 10, do not force these files to fit."], sections },
    { title: "Attendance files", paragraphs: ["Each file assumes every remaining class will be held. A cancelled class changes both the held count and the remaining count. Redo it. Do not edit only one side."], sections: attendSections },
    ch("Days before a paper", [
      "Suppose the paper is on the 18th and today is the 2nd. There are 16 days in between if you do not count today, and you still have to decide whether the 18th is a study day or only an exam day. It is an exam day. So the study days are fewer.",
      "If you study on weekdays only, cross out the weekends before you divide chapters by days. A plan of 'two chapters a day' that needed the Sundays you will spend travelling is not a plan. It is a wish with arithmetic on top.",
      "The exam countdown on the site counts the days. The attendance calculator counts the classes. They are different tools because they are different shortages. A student can be short of both in the same week. Fix the attendance one while the classes still exist. The days only shrink.",
    ]),
    ch("Words worth keeping straight", ["Plain meanings."], [
      ["Credit", ["The weight of a course. More credits, more pull on the average."]],
      ["CGPA", ["The weighted average of grade points across the courses that count. A semester GPA is the same idea for one term."]],
      ["Percentage factor", ["The number your university multiplies by. 9.5 is common and not universal."]],
      ["Held", ["A class the college counts. Your private opinion that it should have been cancelled does not change it."]],
      ["Condonation", ["A formal forgiveness of a shortage. It is a decision by the college, not a feeling that you attended in spirit."]],
    ]),
  ];
}

export function emailBook() {
  const letters = [
    {
      title: "Asking for a decision",
      weak: "Hi, just checking in on the thing we discussed last week regarding the homepage and also the banner if you have time whenever you get a chance no rush but also we kind of need it soon thanks.",
      better: "Subject: Homepage layout, need a yes or no by Thursday\n\nPriya, can we ship the simpler homepage, the one with the search box above the fold, on Thursday?\n\nThe banner can wait for the next release. I need the homepage decision so engineering can stop holding two versions.\n\nIf I do not hear a no by 4 pm Thursday, I will ship the simpler one.",
      why: "The weak note hides the decision, the date and the thing that can wait. The better note leads with the ask. A reader can answer it from a phone between meetings. 'No rush' and 'we kind of need it soon' are the same sentence fighting itself.",
    },
    {
      title: "A late reply",
      weak: "Sorry for the delay sorry I was buried I know this is late I feel terrible about the delay and I hope you are not upset. Anyway the file is attached I think it is the right one let me know.",
      better: "Subject: Brand file, attached\n\nThe brand file is attached. I am sorry it is two days past the date I gave you.\n\nPage 3 has the logo clear space. If you needed a different export, tell me the size and I will send it today.",
      why: "One apology is enough. A stack of them pushes the attachment down and makes the reader manage your feelings. The better note names the file, the fault, and the next step.",
    },
    {
      title: "Telling a client the date moved",
      weak: "There have been some unforeseen circumstances and resource constraints which have impacted the timeline and we are hopeful of a revised delivery window in the near future. We value your partnership.",
      better: "Subject: The checkout fixes move from the 12th to the 19th\n\nThe checkout fixes will be ready on the 19th, not the 12th. I found a tax rounding bug while testing and I do not want to ship it.\n\nNothing else in the release moves. I will send a build on the 17th so you can look before the 19th.",
      why: "A client can use a date. A client cannot use 'a revised delivery window'. The reason is one sentence, because the reader needs the date more than the weather inside the team.",
    },
    {
      title: "Asking a teammate for work",
      weak: "Can you take a look at the designs when you get a chance and also do the icons and maybe the empty state if possible and share thoughts thanks so much you are the best.",
      better: "Subject: Need the empty-state screen by Wednesday\n\nCan you draw the empty state for the ebook library by Wednesday noon?\n\nThe icons can stay as they are. I need the empty state so I can write the message that sits on it. The frame is in the file named library-empty.",
      why: "Three asks became one ask with a date. Praise at the end does not replace the date. The filename saves a round trip.",
    },
    {
      title: "Notes after a meeting",
      weak: "We talked about a lot of things. Rahul said the filter is confusing. Someone mentioned mobile. We should probably do something about search. Let us reconnect.",
      better: "Decisions\n- The filter chips stay. We will not add a second filter row.\n\nOpen\n- Whether search should match the author name. Meera will check the data by Friday.\n\nActions\n- Arun: cut the hero text to two lines, Thursday.\n- Lalaji: review the empty state once Arun's frame is in.",
      why: "A meeting note is three lists. Decisions, open questions, actions with a name and a date. A diary of who spoke is hard to use the next morning and easy to argue with.",
    },
    {
      title: "Saying no to a feature",
      weak: "That is a great idea and we love the passion. We will park it for now and revisit it in the future as we continue to optimise the roadmap and drive alignment.",
      better: "Subject: We will not add ratings this release\n\nWe are not adding star ratings in this release. The library has no reviews yet, so the stars would be empty, and empty stars look like a broken page.\n\nIf we still want them after ten real reviews exist, bring it back and we will schedule it.",
      why: "A no with a reason and a condition is kinder than a fog of alignment. The reader knows what would change your mind. That is a door, not a brush-off.",
    },
    {
      title: "A status that respects the reader",
      weak: "Quick update: things are moving, we are on track, a few blockers but nothing major, will keep you posted, thanks for your patience and support.",
      better: "Subject: Monday status, login bug still open\n\nDone: the ebook cards and the download button.\nNot done: login on Safari. I will know by Tuesday whether it is our cookie or their browser.\nNeed: nothing from you today.",
      why: "Status is done, not done, and what you need. 'On track' is a mood. The reader wanted to know whether to worry. Tell them.",
    },
    {
      title: "Introducing yourself without a speech",
      weak: "I am a passionate and results-driven professional with a proven track record of leveraging cross-functional synergies to deliver best-in-class outcomes across the stakeholder landscape.",
      better: "I am Lalaji Prashanth Kumar, a freelance consultant. I work as a UI/UX manager and UI lead. I design and ship web applications for education, shops and larger companies, mostly with React, and I have led the teams that build them.",
      why: "A title and a material are enough. The weak sentence could belong to anyone, which means it tells the reader nothing. Specific work is shorter and easier to believe.",
    },
  ];

  return [
    ch("One job per message", [
      "A work email fails when the reader cannot see what to do. The fix is dull. Put the action in the subject. Put the action again in the first lines, with a date. Put the background after that, for the person who needs it. Stop.",
      "If you need a yes or no, ask a yes or no. If you need a choice, offer two options and say which one you recommend. A paragraph of context with no question gets a slow reply, and then a second email, and then a meeting. The meeting is usually the tax on a vague note.",
      "Short is polite when the point is clear. A long apology is not polite. It makes the reader soothe you before they can do the work. One sentence of fault is adult. Five sentences of fault is a second task.",
    ]),
    ch("Meetings become lists", [
      "During the meeting, separate what was decided, what is still open, and who does what by when. A transcript of the conversation feels thorough and dies in the inbox. Three lists survive until the next morning.",
      "An action without a name is a wish. An action without a date is a hobby. If nobody owns it, write that down too, so it does not look decided. 'We should look at search' is not a decision that search will change.",
      "Send the note the same day. A note on Friday about a Monday meeting has already started to rot. You will remember the joke and forget the date. The date was the point.",
    ]),
    {
      title: "Before and after",
      paragraphs: ["The weak lines are the kind that feel busy and say little. The better lines are not fancy. They can be answered. None of these are from a client's real mail. They are patterns, written for this book."],
      sections: letters.map((letter) => ({
        heading: letter.title,
        paragraphs: [`The muddy version: ${letter.weak}`, `A clearer version:\n${letter.better}`.replaceAll("\n", " "), letter.why],
      })),
    },
    ch("How to edit your own note", [
      "Read the first line as if you did not write it. If it does not contain the ask, move the ask up. Delete every sentence that repeats the apology or the enthusiasm. Leave one.",
      "Look at the subject. If it could sit on a different email from a different week, it is too vague. 'Quick question' is not a subject. The decision and the date are a subject.",
      "Then send it. Another pass for tone, after the ask is visible, is optional. Another pass before the ask is visible is hiding.",
      "The email writer and the meeting-notes organiser on FreeToolsPro can draft this shape from rough points. They run in the browser. Edit the result. A tool does not know which date slipped or which fact is sensitive.",
    ]),
    ch("Words worth keeping straight", ["A small set, used above."], [
      ["Ask", ["The thing you need the reader to do, including the date. If you cannot point at it, the email is not finished."]],
      ["Subject", ["The ask, shortened. Not a greeting and not the name of the project alone."]],
      ["Decision", ["A choice that was made. Write it as a fact. 'We might' is not a decision."]],
      ["Action", ["A name, a verb, and a date. Missing any one of them, it belongs on the open list instead."]],
    ]),
  ];
}

export function filesBook() {
  return [
    ch("Pixels are not kilobytes", [
      "A photo has a width and a height in pixels, and it has a file size in kilobytes. They are related and they are not the same knob. Resizing changes the pixels. Compressing, on a photo, mostly throws away detail the eye will not miss and leaves the pixel size alone. A form that says 'under 50 KB' cares about the file. A form that says '300 pixels wide' cares about the pixels. Read which one you were given.",
      "JPEG is usually the smaller file for a photograph. PNG is the right file for a screenshot, a logo, or anything with flat colour and sharp text. Putting a screenshot through a heavy JPEG makes the text fuzzy and sometimes not even smaller. Putting a photograph in a PNG makes a large file that looks the same.",
      "Save a copy before you compress. You cannot rebuild the original from the small file. If the first try is too mushy, go back to the copy and compress less. Do not compress the compressed file again and hope. Each pass throws more away.",
      "Phones take pictures that are far larger than a form needs. A passport-size upload does not need a 4000-pixel original. Resize first, then compress if the file is still heavy. Doing it backwards wastes time and sometimes makes a blurry small picture that is still too big on disk.",
    ]),
    ch("A PDF is a stack of pages", [
      "A PDF is not a picture of a document, though it can contain pictures. It is a list of pages. Merging copies those pages into a new file in the order you choose. Splitting copies the pages you name, such as 1 to 3 and then 5, into one file or into several. Rotating turns a page. None of these, done properly, re-photograph the page, so the print does not get blurrier.",
      "Order the pages before you merge. A sideways scan is easier to rotate before it is buried in a 20-page file, but you can rotate it after. Blank pages are worth deleting. The person who receives the file will print them.",
      "Images become a PDF when each picture is placed on a page. A4 with a small margin looks like a scan of a form. A page fitted to the picture keeps the whole photo and adds no white frame. For a document you will print, A4 is usually what the other person expects. For a photo you will not print, fit-to-image wastes less space.",
      "These tools on FreeToolsPro run in the browser. The file is not uploaded. The limit is your device's memory. A phone that fails on a huge scan may succeed after you close other apps, and a laptop may succeed where the phone did not. That is memory, not a secret file-size rule.",
    ]),
    ch("Worked jobs", [
      "Each job is a sequence. Doing the steps out of order is the usual reason a portal rejects a file you were sure was fine.",
    ], [
      ["A scan of an application", ["Photograph each page in order, in daylight, filling the frame. Crop the table and the knee out of the picture. Rotate anything sideways. Resize so the long edge is around 1600 pixels if the portal is fussy about size. Combine them into one PDF on A4. Read it once, page by page, before you upload. A missing page is easier to see now than in a rejection email."]],
      ["A photo that must be under 100 KB", ["Start from the original, not from a forward someone sent on a chat app. Those are already bruised. Resize to the pixel size the form asked for. Then compress the JPEG until it falls under 100 KB. If it looks like a watercolour, you resized too little and compressed too much. Resize smaller and compress gently."]],
      ["A signature on a form", ["Keep the form as PDF pages. Do not turn the whole form into a photograph if you can avoid it. If you must sign on paper, scan only the signed page and replace that page, or append it if the instructions say to append. Re-photographing every page to add one signature makes the text softer for no reason."]],
      ["Several bills into one file", ["Name the files in the order you want, or sort them in the merger. A date order and a 'whatever downloaded last' order are different. Split them back out later by page range if a clerk asks for one bill alone. Ranges like 1-2 and 4 are enough. You do not need a new scan."]],
      ["A screenshot for a bug", ["PNG, not JPEG. Crop to the window that matters. A full desktop with three chats and a personal notification is a larger file and a privacy leak. The PNG will be crisp. If someone demands JPEG, convert at the end, once."]],
      ["A colour scan that is grey", ["If the document is black text, a grey image is smaller and prints more honestly than a blue-tinted colour photo of a tube light. Convert before you build the PDF. The PDF will only preserve the tint you gave it."]],
      ["Pages in the wrong order", ["Open the reorder tool. Move the page, do not re-scan the stack because page 4 was shot before page 3. Delete the blank. Save a new file. Keep the original until you have checked the new one."]],
      ["A file the portal calls too big", ["The portal means kilobytes. Compress the PDF if the tool can, or rebuild it from smaller images. Splitting into two uploads only helps if the portal allows two uploads. Read that line before you split a file they will only accept once."]],
    ].map(([heading, paragraphs]) => ({ heading, paragraphs }))),
    ch("What these tools will not do", [
      "They will not remove a password from a PDF. They will not invent detail a blurry photo never had. They will not send the file to a server to be stored. If a tool fails on a very large file, it is the memory of the device, and the remedy is a smaller input or a larger device.",
      "A rejected upload is sometimes the format, sometimes the size, and sometimes a filename with a symbol the portal dislikes. Change one thing and try again. Changing the format, the size and the filename at once means you will not know which fix worked.",
    ]),
    ch("Words worth keeping straight", ["The few that get mixed up."], [
      ["Pixel size", ["How many dots across and down. This is what 'resize' changes."]],
      ["File size", ["How heavy the file is, in KB or MB. This is what 'compress' mainly changes on a photo."]],
      ["JPEG", ["A photo format that can be small because it discards detail. Bad for text and logos."]],
      ["PNG", ["A format that keeps sharp edges. Good for screenshots and graphics. Often large for photos."]],
      ["Page range", ["A list such as 1-3, 5. It means those pages and not the others."]],
      ["A4", ["A paper size. A PDF page can be A4 even when the picture on it is not."]],
    ]),
  ];
}

export function seoBook() {
  const pages = [
    ["A neighbourhood tuition page", "The title was 'Home'. It is now 'Class 10 maths tuition in Madurai'. The description says the batch size and the area, not the word 'welcome'. The canonical is the https address without a trailing campaign tag."],
    ["A recipe", "The title starts with the dish, not with the blog's name. The blog's name can sit at the end if there is room. The description is one sentence about the dish and one about the time it takes. A paragraph of childhood memory is for the page, not for the grey snippet."],
    ["A product", "The title is the product and the type, 'cotton kurta, indigo, size guide'. The description states the fabric and the dispatch window. It does not say 'best price' with no price. The canonical drops the sort and filter parameters."],
    ["A job post", "The title is the role and the city. The description is the one requirement that filters people, not a list of ten soft skills. A canonical points at the post, not at the careers index."],
    ["A documentation page", "The title matches the task the reader is trying to do. 'Export a PDF' beats 'Docs - section 4'. The description says what the page helps you finish. Older URLs redirect here and the canonical is the new one."],
    ["A local clinic", "The title is the clinic, the specialty and the area. The description gives the hours in one phrase. The same text is not pasted onto every doctor with only the name swapped. That pattern makes five pages look like one."],
    ["An event", "The title has the event and the date. After the date passes, the title should not keep promising a future. Update it or the snippet lies, and the page should say the event is over."],
    ["A tool on this site", "The title says what the tool does and for which year, if the year matters. The description is the result the visitor gets. The canonical is the tool's own path, not the home page."],
  ];
  return [
    ch("The blue link is a title you chose", [
      "On a small site you can touch every page. That is the advantage. Each page can have a title that says what that page is, and a description that a person can read before they click. Large sites struggle to do this. You do not have that excuse.",
      "The title is the blue link in a search result. Put the subject first. A title that starts with the site name wastes the words that might have been read. Keep it short enough that the end is not cut off on a phone. If the last words are the only ones that say what the page is, move them forward.",
      "The description is the grey text. It does not magically rank the page. It does decide whether a person who already sees you bothers to visit. Write it as a sentence about this page. A list of every topic on the site, repeated everywhere, helps no one choose.",
    ]),
    ch("One address, on purpose", [
      "A canonical tag tells a search engine which URL is the main copy when the same page opens under more than one address. Use the full https address. Use that same address in the sitemap. A canonical that points at a redirect, or at a page that redirects back, is a knot.",
      "www and the bare domain are a common pair. Pick one, redirect the other, and make the canonical agree. Tracking parameters are the other common pair. The canonical should ignore them. Otherwise every shared link looks like a new page.",
      "A sitemap is a list of URLs you want crawled. Leave out admin pages, thin duplicates, and addresses that now redirect. An address in the sitemap that returns 'not found' spends attention you wanted on a real page. robots.txt can tell a crawler to stay out of a folder. It does not hide a URL that other sites already link to. A page that must stay reachable but should not appear in results wants a noindex, which is a different instruction.",
    ]),
    {
      title: "Eight pages, rewritten",
      paragraphs: ["These are invented pages. The pattern is the useful part: subject first, one true detail, one canonical address."],
      sections: pages.map(([heading, paragraphs]) => ({ heading, paragraphs: [paragraphs] })),
    },
    ch("A pass before you publish", [
      "Read the title, the description and the canonical in one sitting. Then look at the Open Graph title and image, because a chat app may show those instead of the search snippet. They are allowed to differ. They are not allowed to contradict each other.",
      "Check the snippet length in a preview tool. A title cut in half is a title you did not finish. Check that the sitemap URL and the canonical URL are the same string, including https and the trailing slash you actually use.",
      "Nothing in this book submits your site to a search engine. That happens in your own search console, if you want it. The tools on FreeToolsPro preview the snippet, check title length, and validate a sitemap or a robots file. They do not rank you. They stop you publishing a contradiction.",
    ]),
    ch("Words worth keeping straight", ["The words that get used as if they were the same."], [
      ["Title", ["The blue link. One per page. Subject first."]],
      ["Description", ["The grey text. A reason to click. Not a ranking spell."]],
      ["Canonical", ["The preferred URL when copies exist. It should be a real, final address."]],
      ["Sitemap", ["A list of URLs you claim are real. Not a junk drawer."]],
      ["robots.txt", ["A note to crawlers about folders. Not a privacy lock."]],
      ["noindex", ["A note on a specific page asking not to be listed. The page can still be opened."]],
      ["Open Graph", ["The title and image chat apps use when someone pastes your link."]],
    ]),
  ];
}

export function codeBook() {
  return [
    ch("JSON is strict on purpose", [
      "JSON is a way to write objects and lists as text. Keys are in double quotes. Strings are in double quotes. The last item does not get a trailing comma. Comments are not allowed. A single quote, because it looks friendlier, is enough to make the whole file invalid. The strictness is the point. A program can read it without guessing.",
      "Pretty-printing adds line breaks and indents so a person can read it. Minifying removes them so the file is smaller. The data is the same. Format a file before you compare two versions, or the only difference you will see is the whitespace. Minify when a tool asked for a small file, not when you are still editing.",
      "When a large file fails, do not read it from the top hoping to see the comma. Take a small example you know is valid. Then add the large file back in pieces until the error returns. The piece you just added contains the break. A validator that points at a line is doing this for you. Believe the first error. Later errors are often echoes.",
    ]),
    ch("CSV is a table with sharp edges", [
      "Each line is a row. A comma starts a new column, until a value itself contains a comma. That value has to be wrapped in quotes. A quote inside that value is usually doubled. A spreadsheet will do this when you export. A hand-edited file often will not, and the columns will slide.",
      "A number that looks like a date may become a date when a spreadsheet opens it. The file still had text. Check the first rows after a conversion. Leading zeros on a PIN or an HSN are the usual victims. If the zero matters, the column is text, and you have to tell the spreadsheet so.",
      "JSON turns into CSV cleanly when every object has the same keys. Nested objects need a decision. Flatten them into columns, or keep a cell of JSON and accept that the sheet cannot see inside it. Look at the output before you import it into a sheet you cannot easily undo.",
    ]),
    ch("YAML, XML and a query", [
      "YAML uses indentation instead of braces. A tab where spaces were expected is a different structure, or an error. Convert YAML to JSON when you want a stricter check, then convert back if the tool you are configuring insists on YAML. Do not mix tabs and spaces to make it 'look aligned'.",
      "XML cares about matching tags and about a particular header. A missing close tag fails the file. A formatter shows the nesting. It does not invent the tag you meant to type.",
      "A SQL formatter puts keywords and commas where a person can see them. It does not know if the query is the one you intended. Read the formatted query once before you run it on data you care about. A comma in the wrong place selects a different set of rows, neatly.",
    ]),
    {
      title: "Small files, read out loud",
      paragraphs: ["These are teaching fragments. They are not your production data. Do not paste secrets into a formatter to see if it 'works'."],
      sections: [
        ["A trailing comma", ["{ \"qty\": 2, } is invalid JSON because of the comma before the close. { \"qty\": 2 } is the same fact, and it parses. The error will point at the comma or at the brace. Delete the comma, not the value."]],
        ["A single quote", ["{ 'qty': 2 } looks like JSON and is not. Keys and strings take double quotes. If you copied it from a JavaScript file, you translated a language by eye. Run it through a parser instead."]],
        ["A CSV comma", ["The row Anita, \"12, Marine Drive\", Mumbai is three columns. The row Anita, 12, Marine Drive, Mumbai is four, and the address has broken in half. The quotes are the repair."]],
        ["A zero", ["The text 00123 is not the number 123 if the zero is part of a code. Exporting to a spreadsheet can eat it. Check the cell before you send the file to a client who will match it against another system."]],
        ["YAML space", ["A nested key that is indented with a tab can fail while the same key indented with spaces works. Pick spaces. Be dull about it."]],
        ["A secret in a sample", ["A sample file wants example-key, not the key that opens your database. Replacing it after you have pasted the real one into a chat is late. Replace it before."]],
      ].map(([heading, paragraphs]) => ({ heading, paragraphs })),
    },
    ch("Words worth keeping straight", ["Format words, not computer science."], [
      ["Parse", ["Read the text as data. If it parses, the structure is legal. It can still be the wrong structure."]],
      ["Pretty", ["Spaced out so a person can read it."]],
      ["Minified", ["Spacing removed. Same data, smaller file, harder to read."]],
      ["Flatten", ["Turn nested fields into columns so a table can hold them."]],
      ["Key", ["The name of a field. In JSON it is a string in double quotes."]],
    ]),
  ];
}

export function privacyBook() {
  return [
    ch("Length beats a clever swap", [
      "A password is a secret. Length is the part that matters most. A long phrase of ordinary words is harder to guess than a short word with a symbol where a letter used to be. People can see the symbol trick. A guessing program was built by people who can also see it.",
      "Use a different password for email, for banking, and for every other account that can reset the rest. The email password is the master key, because resets arrive there. Reusing it is how one leaked shop becomes a leaked bank.",
      "A generator can pick a random password. Store it in a password manager. A note on the same phone, in an unlocked app, is a small step up from reusing one password and a large step down from a manager. Write down a recovery method when you set the manager up. A manager you cannot open is a lockout, not a policy.",
    ]),
    ch("Strength is not a breach check", [
      "A strength meter looks at length and variety. It cannot know whether that exact password is already in a leaked list. A long unique password is the practical answer. Change a password when a service tells you it was exposed. Changing it every month, into a pattern, makes it weaker and more likely to be written on paper.",
      "Two-factor login helps when a password does leak. An app or a hardware key is stronger than a code sent by SMS, when the service offers the choice. SMS can be intercepted in ways an app code cannot. Use what the service actually gives you. A lecture about the perfect factor does not protect an account that has none.",
      "Do not invent a system so complex you have to break it. A system you bypass with 'Password1!' on the day you are tired is the system you have. A manager and a second factor is boring. Boring is what you want from a lock.",
    ]),
    ch("Hash, encoding, encryption", [
      "A hash such as SHA-256 turns text into a fingerprint. You cannot turn the fingerprint back into the text. Sites store hashes so they can check a password without keeping the password. MD5 is an old hash. Do not choose it for a new password store. These pages can show you a fingerprint. They are not a place to invent a security system.",
      "Base64 is a way to write bytes as text so they survive a channel that wants text. Anyone can decode it. It is not a lock. Pasting a secret into Base64 and calling it hidden is a costume. Encryption, which these pages do not provide, is what hides a message from someone who has the file.",
      "The password tools, the strength check and the hash tools on FreeToolsPro run in the browser. What you type is not uploaded to the site. That is still not a reason to type your real banking password into a page to 'see what happens'. Generate a new one, or hash a sample sentence.",
    ]),
    {
      title: "Scenes",
      paragraphs: ["Each scene is a choice, not a product review."],
      sections: [
        ["The reused shop password", ["A shop is breached. The password is the same as the email password. The attacker resets the bank, the cloud photos and the domain name. The fix was two different passwords, and a second factor on the email. The fix after the breach is longer and includes telling the bank."]],
        ["The clever substitution", ["P@ssw0rd looks busy and is famous. A long passphrase that is not a proverb is dull and stronger. The substitution did not add as many guesses as four extra letters would have."]],
        ["The shared team login", ["A team account with one password will be in a chat log within a month. Give people their own logins. If a tool forces one login, put it in a manager the team controls and change it when someone leaves. A password in a farewell message is a password."]],
        ["The hash you wanted to undo", ["You hashed a key and then wanted the key back. A hash does not work that way. If you needed the key later, you needed a manager or real encryption, not a fingerprint."]],
        ["Base64 on a résumé", ["An API token written as Base64 in a portfolio is still the token. Rotate it. Then put an obvious fake in the portfolio. Assume anything in a screenshot is public."]],
        ["SMS as the only second factor", ["It is better than a password alone. It is worse than an app you already have installed. Switch when the service allows it. Do not wait for a story about SIM swaps to feel real."]],
      ].map(([heading, paragraphs]) => ({ heading, paragraphs })),
    },
    ch("Words worth keeping straight", ["These three get swapped, and the swap causes leaks."], [
      ["Password", ["A secret you can remember or store. It should be long and unique."]],
      ["Hash", ["A one-way fingerprint. Useful for checking a secret. Useless for retrieving it."]],
      ["Encoding", ["A change of costume, such as Base64. Reversible by anyone."]],
      ["Encryption", ["A lock. Reversible with the key, and not without it. These tools do not claim to encrypt your files."]],
      ["Second factor", ["Something besides the password. An app, a key, or a code. It assumes the password might leak."]],
    ]),
  ];
}

export function everydayBook() {
  const problems = [
    ["Ten percent of a bill", "A repair costs Rs. 8,400. A discount of 10 percent is Rs. 840. The bill is Rs. 7,560. Taking 10 percent off and then adding 10 percent does not bring you back, because the second 10 percent is of a smaller number."],
    ["Adding tax is not removing it", "A price of Rs. 1,000 plus 18 percent is Rs. 1,180. Removing 18 percent from 1,180 by subtraction gives the wrong base. Divide 1,180 by 1.18 to get 1,000. The chapter on GST uses the same move. It shows up in shops that have never said the letters GST."],
    ["A raise", "From Rs. 40,000 to Rs. 46,000 is a rise of 6,000 on a base of 40,000, which is 15 percent. It is not 15 percent of 46,000. The base is the old number, unless someone asked you a different question."],
    ["A drop", "From 200 to 150 is a fall of 50 on 200, which is 25 percent. People say 'half' because it feels large. The fraction is a quarter of the starting price."],
    ["Marks", "72 out of 80 is 72 divided by 80, then times 100, which is 90 percent. 72 out of 100 is a different question. The denominator is the whole thing, not a number you remember from another paper."],
    ["Kilometres and miles", "A mile is about 1.609 kilometres. Fifty miles is about 80.5 kilometres. Convert with the factor and round at the end. Rounding in the middle and then converting again stacks the error."],
    ["Kilograms", "A kilogram is about 2.205 pounds. Eight kilograms is about 17.6 pounds. A form that asks for pounds will mark a kilogram answer wrong even when you understood the weight."],
    ["Celsius", "Water freezes at 0 Celsius and 32 Fahrenheit, and boils at 100 and 212. The gap is not a simple multiply, because the zeros differ. A body temperature converted with a length-style factor will be nonsense. Use the temperature conversion, then round to a tenth."],
    ["File size", "A kilobyte in casual speech is 1,000 bytes, and in some software 1,024. For a form that says 100 KB, look at the number the form's own counter shows. Do not fight it with a definition."],
    ["Age in completed years", "Born on 2 March 2004, on 1 March 2026 the completed age is still 21. On 2 March 2026 it is 22. A form that asks for completed years wants the lower whole number, not a decimal you feel is fairer."],
    ["Days between", "From the 1st to the 10th is nine days of gap, or ten dates if both ends count. A hotel night count and a school day count do not use the same ends. Read whether the end date is included before you subtract."],
    ["Working days", "A project from Monday to the next Monday is not eight working days. Weekends drop out, and so do holidays you list. A promise made on calendar days will look late on working days, or the reverse. Say which count you meant."],
    ["A percentage of a percentage", "A fee of 2 percent on a bill that already had 10 percent added is not 12 percent of the original in a neat way you should guess. Apply one, then the other, to the amount each one actually touches."],
    ["Splitting a bill", "Three people share Rs. 1,500. One third is Rs. 500. If one person had a Rs. 300 dish of their own, the shared part is Rs. 1,200 and the thirds are Rs. 400, plus the 300 for the person who ordered it. Fairness is the split of the right base."],
    ["Speed", "120 kilometres in 1.5 hours is 80 kilometres an hour. Distance divided by time. Minutes have to become hours, or hours become minutes, before you divide. 90 minutes is 1.5, not 1.3 and not 90."],
  ];
  return [
    ch("Say which percentage you mean", [
      "Ten percent of 800 is 80. Adding 10 percent makes 880. Taking 10 percent off 880 does not return you to 800, because 10 percent of 880 is 88. The three sentences are three different questions. Most wrong bills come from answering a neighbour of the question that was asked.",
      "Percentage change is the difference divided by the starting value. A price from 200 to 250 rose by 25 percent, not by 50, and not by 'a quarter of the new price'. The starting value is the base unless you were told otherwise.",
      "Write the base down before you touch a calculator. If you cannot point at the base, you are not ready to multiply. This is the whole method. The rest is rounding at the end, once.",
    ]),
    ch("Units and the last step", [
      "Convert with a known factor and round only at the end. Rounding kilometres to miles and then to a whole number, and then converting back, invents a distance you did not measure. For cooking, a tenth is plenty. For a fee, follow the rounding the form already uses.",
      "Temperature does not share a zero between Celsius and Fahrenheit, so it is not a multiply the way kilometres are. Length, weight and most data sizes do share the idea of a factor. Read the unit on the result before you paste it into a form. A right number in the wrong unit is a wrong answer.",
      "Dates have the same trap of ends. Count the gap, or count the days included, and say which. Age in completed years drops the fraction. A decimal age is a different request. Working days remove weekends and the holidays you actually have. A plan that counts Sunday as a working day will slip, and the arithmetic will not be what slipped.",
    ]),
    {
      title: "Worked questions",
      paragraphs: ["The numbers are small on purpose. If the method is right on a small number, it is right on a large one. If it is wrong, a large number only makes the wrongness louder."],
      sections: problems.map(([heading, paragraphs]) => ({ heading, paragraphs: [paragraphs] })),
    },
    ch("A check before you trust the screen", [
      "Estimate first. Ten percent of 840 should be near 84, not near 840 and not near 8. If the tool disagrees with a rough estimate, the input is wrong or the question is a different question. Swap the units or the dates and see whether the answer flips as you expect.",
      "The percentage calculator, the unit converter, the age calculator and the working-day calculator are separate because the questions are separate. Picking the age tool to count working days will give you a confident, useless number. Match the sentence to the tool.",
    ]),
    ch("Words worth keeping straight", ["Five phrases."], [
      ["Base", ["The number the percentage is of. Name it before you calculate."]],
      ["Percentage change", ["Difference divided by the starting value."]],
      ["Factor", ["The multiply or divide that changes a unit. Temperature is the exception to remember."]],
      ["Completed years", ["The age in whole years, rounding down. The birthday is the hinge."]],
      ["Inclusive", ["Whether the end date counts. Ask, or read the form. Do not guess in the direction that flatters the plan."]],
    ]),
  ];
}

export function youtubeBook() {
  const pairs = [
    ["You won't believe this study trick", "A 25-minute revision block for the night before a test", "The first title could be about anything. The second tells a student what they will get and how long it is."],
    ["My morning routine", "The three things I set up before a design review", "A routine title attracts browsers. A specific title attracts the person who has a review today. Pick the viewer you want."],
    ["GST explained", "How to remove 18 percent GST from a price that already includes it", "The broad title competes with thousands of videos. The narrow title matches a search someone actually types while holding a bill."],
    ["Thumbnail tips", "One line of text, large enough to read on a phone", "The advice is the title. A viewer knows the constraint before they click, so the people who click are the ones who want that constraint."],
    ["I rebuilt my site", "I rewrote 12 page titles and left the design alone", "The rebuild could be a tour of furniture. The rewrite is a specific change a small-site owner can copy."],
    ["Credit cards are bad", "What the minimum due costs on a Rs. 64,000 balance", "A scold is a mood. A number is a reason to watch. The video should then show the number, or the title is a tease."],
    ["Free tools!!", "Fifteen browser tools I use before I touch a design file", "The count and the moment of use are the promise. 'Free tools' is a category, not a video."],
    ["Watch till the end", "The title formula is in the first minute", "Asking for the end is a tax. Putting the useful part first respects the person who has a bus to catch. They may still stay."],
    ["How I edit", "Cutting a 20-minute interview down to a 6-minute clip", "The lengths make the video checkable. A viewer who needs that cut can see themselves in the title."],
    ["India salary", "Why a Rs. 12 lakh CTC is not Rs. 1 lakh a month in hand", "The second title is a question people argue about at work. The first title is a country."],
    ["Thumbnails that pop", "A face, four words, and the same promise as the title", "Pop is not a method. A face and four words is a method. The title and the picture should not repeat one sentence twice, and they should not disagree."],
    ["Hashtag strategy", "Three hashtags, after the description, not instead of it", "A block of tags at the top pushes the summary out of the first lines. Three relevant tags are enough. A pile does not make a vague video specific."],
  ];
  return [
    ch("The title is a promise", [
      "A title tells a person what the video is, in the first few words. A title that hides the topic behind 'you won't believe' is hard to search for and easy to resent after the click. Specifics beat a mood. The task, the tool, the number, or the result.",
      "Read the title aloud. If you run out of breath, it is too long. Check it in a preview at the size a phone uses. Words cut off at the end should not be the only words that carried the meaning. Move those words forward or lose them on purpose.",
      "The thumbnail is the same promise as a picture. When the picture says one thing and the title says another, people click and leave. Leaving is the result that hurts the video. Agreement is the repair. You do not need a louder thumbnail. You need the same sentence.",
    ]),
    ch("The first lines of the description", [
      "The first two lines show before a viewer taps 'more'. Use them for a clear summary. Chapters and links can follow. A block of hashtags at the top spends those lines on tags nobody will read as a sentence.",
      "Describe what the viewer will see. If the video is a short demo, do not write the description as a full course. The mismatch brings the wrong audience, and they leave, and the leaving is information. Match the size of the promise to the size of the video.",
      "Hashtags are optional and few. Three that a person might actually follow are enough. A list of twenty is a costume of relevance. Put them after the summary if you use them at all.",
    ]),
    {
      title: "Titles, side by side",
      paragraphs: ["The left-hand habit is vague. The right-hand title is something a particular person can recognise. These are original examples for this book, not titles taken from a channel."],
      sections: pairs.map(([weak, better, why], i) => ({
        heading: `Pair ${i + 1}`,
        paragraphs: [`Vague: ${weak}`, `Specific: ${better}`, why],
      })),
    },
    ch("A last look before you upload", [
      "Cover the thumbnail and read only the title. Then cover the title and look only at the thumbnail. Each one should still tell you the topic. If either one is mysterious, fix that one. Do not add a third element, such as a pile of tags, to compensate.",
      "Export the image at the size the platform asks for. A portrait photo stretched into a wide frame looks soft. The resizer and the thumbnail tools set the frame. They do not invent a better idea than the one you bring. Four words, large, and a picture that matches the title, beat a collage.",
      "Publish when the title, the first lines and the image agree. If they do not, you are hoping the viewer will sort out a confusion you could see yourself. They will sort it out by leaving.",
    ]),
    ch("Words worth keeping straight", ["Used loosely, and they should not be."], [
      ["Title", ["The promise, in words, readable without the picture."]],
      ["Thumbnail", ["The promise, as a picture, readable without the title. Same promise."]],
      ["Description", ["The summary in the first lines, then the extras."]],
      ["Tag", ["A label, not a substitute for the summary. Use a few."]],
      ["Preview", ["Looking at the title at phone size before the public does."]],
    ]),
  ];
}
