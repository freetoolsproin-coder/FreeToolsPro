// Practice material for "CGPA, Attendance and Exams".
// Conversions match the site's CGPA-to-percentage calculator; attendance formulas
// match the attendance calculator.

const f2 = (n) => (Math.round(n * 100) / 100).toFixed(2);
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
const sgpa = (subs) => subs.reduce((a, [c, g]) => a + c * g, 0) / subs.reduce((a, [c]) => a + c, 0);
const canMiss = (held, att, req) => Math.max(0, Math.floor((100 * att - req * held) / req + 1e-9));
const mustAttend = (held, att, req) => Math.max(0, Math.ceil((req * held - 100 * att) / (100 - req) - 1e-9));
const pctOf = (a, b) => (a / b) * 100;

const SEM1 = [[4, 9], [4, 8], [3, 7], [3, 10], [2, 8], [1, 9]];
const SEM2 = [[4, 7], [4, 8], [3, 9], [3, 8], [2, 10], [1, 10]];

export default {
  checked: "October 2026",
  welcome:
    "This book is for students who want to understand their own numbers: how SGPA and CGPA are calculated from credits and grade points, how a CGPA converts to a percentage and why the formula depends on the university, how attendance requirements work and how many classes you can still miss or must attend, and how to plan the weeks before an exam. It also covers the habits that matter more than any formula.",

  chapters: [
    {
      title: "Credits, grade points and SGPA",
      paragraphs: [
        "Under a credit system, each course carries credits that reflect the teaching hours per week. A common rule is one credit for one hour of lecture a week across a semester, or two hours of lab. Your grade in each course becomes a grade point on a 10-point scale, and your semester grade point average weights each grade point by the course's credits.",
      ],
      sections: [
        {
          heading: "The formula",
          paragraphs: [
            "SGPA = sum of (credits × grade points) ÷ sum of credits. CGPA is the same calculation across all semesters so far, using every course's credits and grade points, not an average of SGPAs unless every semester has the same credits.",
          ],
        },
        {
          heading: "A worked semester",
          table: {
            caption: "Six courses, 17 credits.",
            headers: ["Course", "Credits", "Grade point", "Credit points"],
            rows: [...SEM1.map(([c, g], i) => [`Course ${i + 1}`, String(c), String(g), String(c * g)]), ["Total", String(SEM1.reduce((a, [c]) => a + c, 0)), "", String(SEM1.reduce((a, [c, g]) => a + c * g, 0))]],
          },
          paragraphs: [`SGPA = ${SEM1.reduce((a, [c, g]) => a + c * g, 0)} ÷ ${SEM1.reduce((a, [c]) => a + c, 0)} = ${f2(sgpa(SEM1))}.`],
        },
        {
          heading: "Why heavy courses matter more",
          paragraphs: [
            "A 4-credit course moves the SGPA four times as much as a 1-credit course. Raising a grade from 7 to 9 in a 4-credit course adds 8 credit points; the same jump in a 1-credit course adds 2. When time is short, spend it where the credits are.",
          ],
        },
        {
          heading: "A typical 10-point scale",
          table: {
            caption: "Many universities follow a scale like this, recommended in UGC guidelines. Your university's ordinance is the authority.",
            headers: ["Letter", "Meaning", "Grade point"],
            rows: [["O", "Outstanding", "10"], ["A+", "Excellent", "9"], ["A", "Very good", "8"], ["B+", "Good", "7"], ["B", "Above average", "6"], ["C", "Average", "5"], ["P", "Pass", "4"], ["F", "Fail", "0"], ["Ab", "Absent", "0"]],
          },
        },
      ],
    },
    {
      title: "From SGPA to CGPA",
      paragraphs: [
        "CGPA accumulates every course you have taken. It moves less each semester as the total credits grow, which is why early semesters matter and why a late improvement takes time to show.",
      ],
      sections: [
        {
          heading: "Two semesters",
          paragraphs: [
            (() => {
              const c1 = SEM1.reduce((a, [c]) => a + c, 0);
              const c2 = SEM2.reduce((a, [c]) => a + c, 0);
              const p1 = SEM1.reduce((a, [c, g]) => a + c * g, 0);
              const p2 = SEM2.reduce((a, [c, g]) => a + c * g, 0);
              return `Semester 1: ${p1} credit points over ${c1} credits, SGPA ${f2(p1 / c1)}. Semester 2: ${p2} over ${c2}, SGPA ${f2(p2 / c2)}. CGPA after two semesters = (${p1} + ${p2}) ÷ (${c1} + ${c2}) = ${f2((p1 + p2) / (c1 + c2))}.`;
            })(),
          ],
        },
        {
          heading: "How much can one semester move CGPA?",
          paragraphs: [
            `With 80 credits done at a CGPA of 7.0, a 20-credit semester at SGPA 9.0 raises CGPA to (7.0 × 80 + 9.0 × 20) ÷ 100 = ${f2((7 * 80 + 9 * 20) / 100)}. After 140 credits, the same semester would raise it only to ${f2((7 * 140 + 9 * 20) / 160)}. Start early if you want a higher final CGPA.`,
          ],
          table: {
            caption: "CGPA after one more 20-credit semester, starting from CGPA 7.0.",
            headers: ["Credits done", "Next SGPA 8.0", "Next SGPA 9.0", "Next SGPA 10.0"],
            rows: [40, 80, 120, 140].map((done) => [String(done), f2((7 * done + 8 * 20) / (done + 20)), f2((7 * done + 9 * 20) / (done + 20)), f2((7 * done + 10 * 20) / (done + 20))]),
          },
        },
        {
          heading: "Failed and repeated courses",
          paragraphs: [
            "Rules differ on how a failed course counts. Some universities replace the F with the grade from the repeat attempt; others keep both on the transcript; some cap the grade for a repeat. The credits for a failed course may still count in the denominator until cleared, which drags CGPA down. Read your ordinance on supplementary exams and grade replacement.",
          ],
        },
      ],
    },
    {
      title: "Converting CGPA to a percentage",
      paragraphs: [
        "There is no single national formula. Each board or university sets its own conversion, often printed on the marksheet or in an ordinance. Employers and admissions offices usually ask for the conversion your institution uses.",
      ],
      sections: [
        {
          table: {
            caption: "Common conversions. Use only the one your institution specifies.",
            headers: ["Rule", "Formula", "CGPA 7.5 becomes", "CGPA 8.5 becomes"],
            rows: [
              ["CBSE (older Class 10 CGPA)", "CGPA × 9.5", `${f1(7.5 * 9.5)}%`, `${f1(8.5 * 9.5)}%`],
              ["Many universities", "CGPA × 10", "75.0%", "85.0%"],
              ["VTU (older rule)", "(CGPA − 0.75) × 10", "67.5%", "77.5%"],
              ["4-point GPA", "GPA ÷ 4 × 100", "-", "-"],
            ],
          },
          paragraphs: [
            "The same CGPA can therefore mean different percentages at different institutions. When a form asks for a percentage and your institution has an official rule, use it and say which rule you used. If there is no official rule, many forms accept the CGPA with the scale, such as 8.2 out of 10.",
          ],
        },
        {
          heading: "Class and division",
          paragraphs: [
            "Universities classify results into divisions such as first class with distinction, first class and second class, using either percentage or CGPA cut-offs. The site's converter shows common percentage bands, but your university's own cut-offs decide your class.",
          ],
        },
      ],
    },
    {
      title: "Attendance in numbers",
      paragraphs: [
        "Most colleges require 75 percent attendance in each course to sit the end-semester exam, with some allowing condonation for medical or other reasons down to a lower figure. Some programmes require more. Attendance is usually counted per course, not overall.",
      ],
      sections: [
        {
          heading: "Classes you can miss",
          paragraphs: [
            `If you have attended A of H classes and need R percent, you can miss floor((100A − RH) ÷ R) more and stay at or above R. With 52 attended out of 60 at 75 percent: (5,200 − 4,500) ÷ 75 = 9.33, so ${canMiss(60, 52, 75)} more.`,
          ],
        },
        {
          heading: "Classes you must attend",
          paragraphs: [
            `If you are below R, you must attend ceil((RH − 100A) ÷ (100 − R)) classes in a row. With 40 of 60 at 75 percent: (4,500 − 4,000) ÷ 25 = 20, so ${mustAttend(60, 40, 75)} in a row.`,
            "The higher the requirement, the harder it is to recover. At 85 percent, each missed class needs about 5.7 attended classes to make up; at 75 percent, 3.",
          ],
        },
        {
          heading: "Attendance by course",
          table: {
            caption: "Five courses after 8 weeks, requirement 75 percent.",
            headers: ["Course", "Held", "Attended", "Current", "Can miss", "Must attend"],
            rows: [["Maths", 32, 28], ["Physics", 32, 22], ["Chemistry lab", 16, 13], ["English", 24, 21], ["Programming", 40, 29]].map(([n, h, a]) => [n, String(h), String(a), `${f1(pctOf(a, h))}%`, String(canMiss(h, a, 75)), String(mustAttend(h, a, 75))]),
          },
          paragraphs: ["Physics and Programming need attention now. Overall attendance looks fine, which is exactly the trap."],
        },
        {
          heading: "Medical leave and condonation",
          paragraphs: [
            "If illness keeps you away, submit the medical certificate on time, as the rules require. Condonation is usually discretionary, limited, and sometimes involves a fee. It is a safety net, not a plan.",
          ],
        },
      ],
    },
    {
      title: "Planning the weeks before an exam",
      paragraphs: [
        "A plan turns the days you have into a list of what to do each day. The site's exam countdown counts study days after rest days and keeps revision days at the end; the method below is the same.",
      ],
      sections: [
        {
          steps: [
            "Count study days from today to the exam, leaving out days you will genuinely not study.",
            "Set aside the last 20 to 25 percent of those days for revision and past papers.",
            "List every topic and its weight in the exam, from the syllabus and past papers.",
            "Divide topics across the remaining days, heavier topics first and earlier.",
            "Put two short reviews of each topic into the plan: one a few days after first study, one a week or two later.",
            "Schedule at least three timed past papers in the revision days.",
            "Review the plan every Sunday and move what slipped.",
          ],
        },
        {
          heading: "A worked plan",
          paragraphs: [
            "Exam in 45 days, Sundays off: 39 study days. Keep 9 for revision, leaving 30 for first study of 24 topics, about 0.8 topics a day, so the heavier topics get two days each. At 4 hours a day, that is 120 hours for first study and 36 for revision.",
          ],
        },
        {
          heading: "Techniques with good evidence",
          bullets: [
            "Practice testing: answering questions from memory beats re-reading.",
            "Spacing: reviewing a topic over several days beats one long session.",
            "Interleaving: mixing problem types in a session helps you choose the right method in the exam.",
            "Explaining in your own words, out loud or in writing, reveals gaps.",
            "Sleep: memory consolidates during sleep; all-nighters before exams usually cost marks.",
          ],
        },
      ],
    },
    {
      title: "Marks, grades and moderation",
      paragraphs: [
        "Final grades often combine internal assessment, such as tests, assignments and attendance marks, with the end-semester exam. The split varies, commonly 30 to 50 percent internal.",
      ],
      sections: [
        {
          heading: "Absolute and relative grading",
          paragraphs: [
            "Under absolute grading, fixed mark ranges map to grades: 90 and above might be O. Under relative grading, grades depend on the class's distribution, so the same marks can earn different grades in different years. Ask which your course uses; it changes how you should read a mark.",
          ],
        },
        {
          heading: "What you need in the final exam",
          paragraphs: [
            "If internal assessment is worth 40 marks and the final 60, and you have 31 internal marks, then to reach 70 overall you need 39 of 60 in the final, 65 percent. Working this out early tells you whether the target is comfortable or tight.",
          ],
        },
        {
          heading: "Revaluation and supplementary exams",
          paragraphs: [
            "Most universities allow you to request photocopies of answer scripts, re-totalling or revaluation within a short window after results, for a fee. Supplementary or repeat exams let you clear failed courses. Note the deadlines when results are announced; they are often only a week or two.",
          ],
        },
      ],
    },
    {
      title: "Your academic records",
      paragraphs: [
        "Marksheets, provisional certificates and degrees are needed for jobs, higher study and visas, sometimes decades later. Keeping them safe and verifiable saves trouble.",
      ],
      sections: [
        { label: "DigiLocker", paragraphs: ["Many boards and universities issue marksheets and certificates to DigiLocker, where they are legally valid as originals for many purposes. Link your Aadhaar and check that your documents appear."] },
        { label: "APAAR ID and Academic Bank of Credits", paragraphs: ["Under the National Education Policy, students can have an APAAR ID that links academic records, and credits earned can be stored in the Academic Bank of Credits, which supports multiple entry and exit in degree programmes. Ask your institution how it uses them."] },
        { label: "Name and date of birth", paragraphs: ["Check that your name and date of birth match across all certificates and your identity documents. Mismatches cause problems in background checks and visa applications; correct them early through the board or university."] },
        { label: "Transcripts", paragraphs: ["Foreign universities and some employers ask for official transcripts sent directly by your university. The process can take weeks; start early."] },
      ],
    },
    {
      title: "Lectures, notes and assignments",
      paragraphs: [
        "Most of a grade is decided long before the exam, in how you use lectures and how you handle assignments. Small habits during the semester save a great deal of stress at the end.",
      ],
      sections: [
        {
          heading: "Before a lecture",
          paragraphs: [
            "Spend ten minutes skimming the topic: headings, key terms, one example. You will recognise more in the lecture and know which parts to listen to closely. It also makes it obvious when the teacher says something that does not match the book, which is often where exam questions come from.",
          ],
        },
        {
          heading: "During a lecture",
          paragraphs: [
            "Write down structure and examples rather than every word. Leave space to add notes later. Mark anything you did not understand with a question mark and ask about it the same week, in class, at office hours, or in the study group.",
          ],
        },
        {
          heading: "After a lecture",
          paragraphs: [
            "Within a day, spend fifteen minutes turning the notes into questions: what would an exam ask about this? Answer them without looking. This is practice testing, and done a little each day it builds the revision material you will need anyway.",
          ],
        },
        {
          heading: "Assignments",
          paragraphs: [
            "Start each assignment the day it is set, even if only to read it and list what you need. Submit before the deadline, keep a copy, and read the feedback. Assignments and internal tests are often 30 to 50 percent of a grade; they are the cheapest marks you will ever earn.",
            "Do your own work. Copying from classmates or generating answers you cannot explain is academic misconduct in most institutions, and it leaves you unprepared for the exam where the same topic appears.",
          ],
        },
      ],
    },
    {
      title: "Choosing courses and electives",
      paragraphs: [
        "Most programmes now offer electives, open electives and minors. The choice affects your CGPA a little and your learning and career a lot.",
      ],
      sections: [
        {
          heading: "Questions to ask",
          steps: [
            "What will I be able to do after this course that I cannot do now?",
            "How is it assessed: projects, exams, or both?",
            "How have past students done, and how is it graded?",
            "Does it lead to a minor, a specialisation, or skills employers or graduate programmes look for?",
            "Can I manage its workload alongside my heavy core courses?",
          ],
        },
        {
          heading: "The CGPA effect is small",
          paragraphs: [
            `A 3-credit elective in a 160-credit degree is under 2 percent of the total. A grade two points lower changes CGPA by about ${f2((2 * 3) / 160)}. Choose for learning, and protect CGPA through the heavy core courses where most credits sit.`,
          ],
        },
        {
          heading: "Minors and honours",
          paragraphs: [
            "Under NEP-aligned programmes, many universities offer minors and honours with additional credits. These can strengthen applications but add workload. Check the CGPA requirement to stay eligible.",
          ],
        },
      ],
    },
    {
      title: "Board exams, entrance exams and university exams",
      paragraphs: [
        "Different exams reward different preparation. Knowing the format changes how you should study.",
      ],
      sections: [
        { label: "School board exams", paragraphs: ["Board exams test the syllabus in a set pattern, with marking schemes published by the board. Past papers and sample papers are the best guide. Presentation and following the marking scheme's steps earn marks."] },
        { label: "Entrance exams", paragraphs: ["Competitive exams such as engineering, medical and university entrance tests are often multiple-choice, with negative marking in many. Speed, accuracy and choosing which questions to skip matter as much as knowledge. Practise full mock tests under timed conditions."] },
        { label: "University semester exams", paragraphs: ["Usually descriptive answers to a set of questions, with choices. The question pattern repeats across years; past papers show which topics are examined most. Writing clear, structured answers with diagrams and examples earns marks."] },
        { label: "Practicals and viva", paragraphs: ["Assess whether you can perform and explain. Know the theory behind each experiment, keep your record book complete, and practise explaining your procedure aloud."] },
        { label: "Online and open-book exams", paragraphs: ["Test application rather than recall. Prepare by organising notes for quick reference and practising applying concepts to new problems."] },
      ],
    },
    {
      title: "A semester, week by week",
      paragraphs: [
        "Most semesters follow the same rhythm. Planning around it spreads the work and avoids the end-of-term crush.",
      ],
      sections: [
        {
          table: {
            caption: "A typical 16-week semester. Adjust to your calendar.",
            headers: ["Weeks", "What happens", "What to do"],
            widths: [0.8, 1.8, 2.6],
            rows: [
              ["1-2", "Courses start; outlines issued", "Note credits, assessment weights and attendance rules for each course; set up an attendance table"],
              ["3-6", "Regular lectures; first assignments", "Daily 15-minute question review; submit assignments early; check attendance weekly"],
              ["7-8", "First internal tests", "Two short timed practice sessions per course before each test; read feedback"],
              ["9-12", "Heavier topics; projects", "Start projects early; keep spaced reviews going; identify weak courses"],
              ["13-14", "Second internals; last assignments", "Calculate internal marks so far and the final target for each course"],
              ["15-16", "Study leave; end-semester exams", "Revision days and timed past papers; normal sleep; logistics"],
            ],
          },
          paragraphs: [
            "The two moments that decide most results are weeks 7 and 13, when internal tests show where you stand. Acting on them, rather than waiting for the final, is what separates a comfortable semester from a stressful one.",
          ],
        },
      ],
    },
    {
      title: "Sleep, health and exam stress",
      paragraphs: [
        "Good preparation includes looking after the brain doing the work. Several findings are consistent across studies and are worth taking seriously.",
      ],
      sections: [
        { label: "Sleep", paragraphs: ["Memory consolidation happens during sleep. Students who cut sleep before exams often perform worse than those who sleep normally, even with fewer study hours. Aim for seven to nine hours, especially in the last week."] },
        { label: "Breaks", paragraphs: ["Attention declines over long sessions. Study in blocks of 40 to 60 minutes with short breaks, and take a longer break every few hours. A walk helps more than scrolling a phone."] },
        { label: "Food and water", paragraphs: ["Regular meals and enough water keep energy steady. Heavy meals right before studying or an exam can make you drowsy."] },
        { label: "Phones", paragraphs: ["Notifications break concentration. Keep the phone in another room while studying, or use focus settings."] },
        { label: "Anxiety", paragraphs: ["Some anxiety is normal and can sharpen performance. When it becomes overwhelming, with trouble sleeping, eating or concentrating for days, talk to someone: a parent, a teacher, a friend or a counsellor. Many colleges have counselling services, and national helplines exist for students. Asking for help is part of preparing well."] },
        { label: "On the day", paragraphs: ["Read the whole paper first, plan time per question, start with a question you know well, and leave a few minutes to check. If you blank on a question, move on and return later."] },
      ],
    },
    {
      title: "Applying abroad with an Indian CGPA",
      paragraphs: [
        "Universities abroad see many grading systems. They usually evaluate Indian transcripts in context, not by converting your CGPA with one formula.",
      ],
      sections: [
        {
          bullets: [
            "Provide official transcripts with the grading scale explained, often on the back of the transcript or in a letter from the university.",
            "Some universities ask for evaluation by a credential service, which converts grades using its own tables and knowledge of your institution.",
            "Class rank or percentile, if your university provides it, helps admissions officers place your CGPA.",
            "Many programmes state minimum requirements in Indian terms, such as first class or a CGPA of 7 on 10, on their international admissions pages.",
            "Explain any dips or backlogs briefly in the statement of purpose if they have a reason, and show the recovery.",
          ],
          paragraphs: [
            "Do not convert your CGPA to a 4-point GPA yourself unless asked; if you must, state the method. Inconsistent self-conversions are a common reason for queries.",
          ],
        },
      ],
    },
    {
      title: "Mistakes students make with numbers",
      paragraphs: ["Most problems with grades and attendance come from a few avoidable errors."],
      sections: [
        { label: "Watching overall attendance only", paragraphs: ["Per-course rules decide eligibility. Track each course weekly."] },
        { label: "Averaging SGPAs", paragraphs: ["Semesters with different credits must be weighted. Use total credit points over total credits."] },
        { label: "Using someone else's conversion", paragraphs: ["Use your own institution's rule and state it."] },
        { label: "Ignoring internal marks", paragraphs: ["Internals can be half the grade. Late or missed assignments are lost marks you cannot recover in the final."] },
        { label: "Spreading effort evenly", paragraphs: ["Heavy courses deserve more time. Credits tell you where."] },
        { label: "Missing deadlines", paragraphs: ["Medical certificates, revaluation and supplementary exam registrations have short windows."] },
        { label: "Cramming", paragraphs: ["Last-minute study with little sleep usually lowers scores. Spaced practice and rest work better."] },
        { label: "Not keeping records", paragraphs: ["Marksheets, certificates and transcripts are needed for decades. Keep digital and physical copies and check details for errors."] },
      ],
    },
    {
      title: "Using the site's student tools",
      paragraphs: ["The calculators on FreeToolsPro use the same formulas as this book. A few tips help you get accurate answers."],
      sections: [
        { label: "CGPA to percentage", paragraphs: ["Pick the conversion your board or university uses. The tool also shows the CGPA needed for 60 and 75 percent under that rule, which helps when a form has a cut-off."] },
        { label: "Marks to grade", paragraphs: ["Enter each subject as a line, such as 'Maths 87/100'. Choose the grading scale your board or university uses. The tool shows percentage, grade and best-of-five where relevant."] },
        { label: "Attendance calculator", paragraphs: ["Enter held, attended and required percentage for one course at a time. Add the classes left in the term to see the best and worst possible outcome."] },
        { label: "Exam countdown", paragraphs: ["Enter the exam date, study hours, topics left, revision days and rest days. It shows study days available, topics per day and when revision should begin."] },
      ],
    },
    {
      title: "If you fall behind mid-semester",
      paragraphs: [
        "Illness, family events, a part-time job or simply a slow start can leave you weeks behind. Recovery is usually possible if you act early and specifically.",
      ],
      sections: [
        {
          steps: [
            "List every course with its attendance, internal marks so far and topics covered.",
            "Mark the courses at risk: below attendance requirement, low internal marks, or many topics behind.",
            "Talk to each course teacher or mentor this week. Explain briefly and ask what can be done: makeup assignments, notes, office hours.",
            "Fix attendance first in courses close to the line, because it cannot be recovered later.",
            "Catch up topics in order of exam weight, using summaries and past questions rather than full textbook reading.",
            "Reduce non-essential commitments for a few weeks.",
            "Check progress every Sunday and adjust.",
          ],
          note: "If personal or family difficulties are the cause, ask whether your institution has a student welfare office or counsellor. Many have provisions you will not know about unless you ask.",
        },
      ],
    },
    {
      title: "For parents: supporting without pressure",
      paragraphs: [
        "Parents can help a great deal with grades and exams, mostly by making study easier rather than by adding pressure.",
      ],
      sections: [
        { label: "Understand the numbers", paragraphs: ["Ask your child to show you how their CGPA, credits and attendance work. Knowing that attendance is per course, or that a 4-credit course matters more, helps you ask useful questions."] },
        { label: "Protect time and sleep", paragraphs: ["A quiet place to study, regular meals and reasonable bedtimes matter more than long hours. Avoid scheduling family events in the final weeks where you can."] },
        { label: "Ask about the plan, not the marks", paragraphs: ["'What are you working on this week?' opens a conversation; 'Why only 72?' closes one."] },
        { label: "Watch for stress", paragraphs: ["Changes in sleep, appetite, mood or withdrawal can signal that a student needs support. Listen, and help them talk to a counsellor if needed."] },
        { label: "Keep records together", paragraphs: ["Help maintain a folder of marksheets, certificates and identity documents, and check names and dates for errors when each is issued."] },
      ],
    },
    {
      title: "How results are prepared",
      paragraphs: [
        "Knowing what happens between your exam and your result explains some surprises and helps you use revaluation sensibly.",
      ],
      sections: [
        {
          bullets: [
            "Answer scripts are coded to hide identity, evaluated against a marking scheme, and often checked by a second examiner for a sample.",
            "Internal marks are submitted by departments and added to external marks.",
            "Moderation may adjust marks across examiners or sections if marking was inconsistent.",
            "Grades are assigned by absolute ranges or relative distribution, depending on the course.",
            "Results are approved by the examination committee and published, usually with a window for photocopies, re-totalling and revaluation.",
          ],
          paragraphs: [
            "Errors do happen, most often in totalling or unmarked pages. A photocopy of the script is the best way to see whether revaluation is worth requesting. Disagreeing with an examiner's judgment on a correct answer is less likely to change the mark than pointing to a page that was missed.",
          ],
        },
      ],
    },
    {
      title: "Writing better exam answers",
      paragraphs: [
        "In descriptive exams, how you write an answer affects marks as much as what you know. Examiners mark against a scheme, usually looking for key points, steps and correct terms.",
      ],
      sections: [
        { label: "Read the question twice", paragraphs: ["Underline the command word: define, explain, compare, derive, evaluate. Each asks for something different. 'Compare' needs similarities and differences, not two separate descriptions."] },
        { label: "Plan for a minute", paragraphs: ["Jot the points you will make in the margin. It prevents rambling and helps you include what the scheme rewards."] },
        { label: "Structure", paragraphs: ["Start with a direct answer or definition, then explanation, then an example or diagram, then a short conclusion. Use headings or numbered points for long answers."] },
        { label: "Show working", paragraphs: ["In numerical answers, write the formula, substitution and units. Step marks often survive an arithmetic slip."] },
        { label: "Diagrams", paragraphs: ["Label clearly and refer to the diagram in the text. A good diagram can replace a paragraph."] },
        { label: "Time", paragraphs: ["Divide time by marks. A 10-mark question deserves about twice the time of a 5-mark question. If time runs short, write the key points of remaining answers in brief rather than leaving them blank."] },
        { label: "Presentation", paragraphs: ["Number answers correctly, leave space between them, and write legibly. Examiners mark many scripts; making yours easy to mark helps."] },
      ],
    },
    {
      title: "Revision techniques in practice",
      paragraphs: [
        "Knowing that practice testing and spacing work is one thing. Here is what they look like on a normal study day.",
      ],
      sections: [
        {
          heading: "A two-hour session",
          steps: [
            "Ten minutes: answer, from memory, five questions on topics studied two days ago and a week ago. Check and note gaps.",
            "Fifty minutes: study a new topic. Make a short list of questions it could generate.",
            "Ten-minute break away from the desk.",
            "Forty minutes: mixed problems from this topic and two earlier ones, without notes.",
            "Ten minutes: write a summary of the new topic from memory and compare it with the book.",
          ],
        },
        {
          heading: "Flashcards",
          paragraphs: [
            "Cards with a question on one side and an answer on the other are a simple way to practise recall. Shuffle them, put cards you get wrong back in the pile, and review the stack again in a few days. Many free apps do the scheduling for you.",
          ],
        },
        {
          heading: "Past papers",
          paragraphs: [
            "Use past papers in two ways: early in the semester, read them to see what is asked and how; in revision, sit them under timed conditions. After each paper, list the questions you lost marks on and revise those topics first.",
          ],
        },
      ],
    },
    {
      title: "Reading your university's rules",
      paragraphs: [
        "Almost every question in this book ends with 'check your university's rules'. Here is how to find and read them quickly.",
      ],
      sections: [
        {
          steps: [
            "Find the examination or academic ordinance on the university website, often under Academics, Examinations or Regulations.",
            "Search within it for 'credit', 'grade point', 'conversion', 'attendance', 'condonation', 'revaluation' and 'supplementary'.",
            "Note the section numbers and copy the key rules into one page of your own notes.",
            "Check whether your programme has its own regulations that override general ones.",
            "Look for notices issued each semester, which may change dates and fees.",
            "If a rule is unclear, ask the examination office in writing and keep the reply.",
          ],
          note: "Rules sometimes change between batches. The regulations for the year you joined usually apply to you, unless the university states otherwise.",
        },
      ],
    },
  ],

  scenarioIntro:
    "Eighteen students working with their own numbers. Credits, grades and rules are illustrations; your institution's ordinance always decides.",

  scenarios: [
    {
      title: "A heavy course worth fighting for",
      paragraphs: [
        "Aditi, a second-year engineering student in Pune, had a semester with a 4-credit Signals course, a 3-credit Electronics course, and four smaller courses. Mid-semester tests showed she was heading for a 6 in Signals and a 9 in a 1-credit seminar.",
        "She had limited time. Moving Signals from 6 to 8 would add 8 credit points; moving the seminar from 9 to 10 would add 1. She shifted her effort to Signals, joined a study group, and worked through five years of past papers.",
        `She ended with an 8 in Signals. With 18 credits in the semester, that change alone raised her SGPA by ${f2(8 / 18)} points.`,
        "She did not abandon the smaller courses; she kept them at a steady level with less time, attending every class and doing the assignments, which is usually enough to hold a grade.",
        "Looking back, she said the most useful thing was simply writing down the credits next to each course at the start of the semester. It made the choice obvious when time ran short."
      ],
      lesson: "Put effort where the credits are. A heavy course moves your SGPA most.",
    },
    {
      title: "Overall attendance looked fine",
      paragraphs: [
        "Rahul in Jaipur had 82 percent attendance overall in week ten and assumed he was safe. His college counts attendance per course.",
        `In his 9 a.m. Programming lab he had attended 20 of 30 sessions, 66.7 percent. To reach 75 percent he needed ${mustAttend(30, 20, 75)} sessions in a row, and only 12 were left in the semester.`,
        "He attended every remaining session and asked his mentor about condonation, which the college allowed down to 65 percent with a medical reason he did not have. He reached 74.4 percent and was barred from that lab exam, repeating it the next semester.",
        "His friend in another college had the same problem in reverse: excellent attendance in labs, poor in one theory course, and an overall figure that looked fine. Both now keep a small table with one row per course, updated every Friday.",
        "The repeat cost him a summer and a fee. He calls it the most expensive lesson of his first year, and the easiest to have avoided."
      ],
      lesson: "Check attendance per course every week. Overall percentages hide the course that will stop you.",
    },
    {
      title: "Converting CGPA for a job form",
      paragraphs: [
        "Fatima, graduating from a university in Chennai, was filling an application that required 'percentage in graduation'. Her CGPA was 8.1.",
        "Her friend from another state said to multiply by 9.5. Fatima checked her marksheet, which stated that the university's percentage equals CGPA × 10. She entered 81 percent and noted 'as per university conversion, CGPA 8.1 on 10-point scale'.",
        "During verification, the employer checked the marksheet and the note matched. A colleague who had used × 9.5 on a different university's marksheet had to explain the discrepancy.",
        "She also kept a copy of the page of the university ordinance that stated the rule, in case any later verification questioned the figure.",
        "Some forms ask for both CGPA and percentage. She now fills both, with the scale and the rule, so that nobody has to guess."
      ],
      lesson: "Use your own institution's conversion rule and say which one you used.",
    },
    {
      title: "Recovering a low first year",
      paragraphs: [
        "Imran in Lucknow finished his first year with a CGPA of 6.4 over 40 credits. He wanted at least 7.5 by graduation, after 160 credits.",
        `Required average over the remaining 120 credits: (7.5 × 160 − 6.4 × 40) ÷ 120 = ${f2((7.5 * 160 - 6.4 * 40) / 120)}. Ambitious but possible.`,
        "He changed how he studied, using practice questions instead of re-reading, and kept a weekly attendance check. His SGPAs were 7.6, 7.9, 8.1, 7.8, 8.2 and 8.0, finishing near 7.6.",
        "He also met his mentor at the start of each semester to review his previous results course by course, which helped him spot that his weakest grades were always in courses with weekly problem sets he skipped.",
        "The target gave his effort a shape. Instead of 'study harder', he had a number for each semester and a way to check whether he was on track."
      ],
      lesson: "Work out the average you need for the rest of the course. It turns a vague goal into a semester target.",
    },
    {
      title: "Medical leave in the middle of a semester",
      paragraphs: [
        "Keerthi in Kochi was hospitalised for dengue for twelve days and missed 18 classes across five courses.",
        "She submitted the medical certificate to the department within the time the rules allowed, which her college requires within a week of returning. The department marked the absence as medical, eligible for condonation.",
        "She then calculated each course's attendance with and without condonation, and attended every class for the rest of the semester to stay above the required level in all five, so condonation was only needed in one course.",
        "She also told each course teacher individually, since some keep their own attendance registers, and asked whether any assignments missed during illness could be submitted late.",
        "Her advice to juniors: keep the doctor's prescription, test reports and discharge summary together, because departments often ask for more than a single certificate."
      ],
      lesson: "Submit medical documents promptly, then rebuild attendance so you rely on condonation as little as possible.",
    },
    {
      title: "Internal marks set the target",
      paragraphs: [
        "John in Bengaluru had 28 of 40 internal marks in Thermodynamics. He wanted at least an A, which needed 70 overall out of 100 under absolute grading.",
        "He needed 42 of 60 in the final, 70 percent. His past papers showed he scored around 60 percent under timed conditions.",
        "He spent the revision days on timed past papers, focusing on the question types he lost marks on. He scored 44 in the final and reached 72 overall.",
        "He also checked the past five years' papers to see which topics carried the most marks, and made sure those were his strongest before spending time on rarely examined ones.",
        "Knowing he needed exactly 42 made the revision calmer. He was not chasing an impossible perfect score; he was practising enough to clear a clear line."
      ],
      lesson: "Work out what you need in the final from your internal marks. It shows whether the target is realistic and what to practise.",
    },
    {
      title: "Relative grading surprise",
      paragraphs: [
        "Sara in Delhi scored 78 in a course and expected an A. Her course used relative grading, and the class average was high that year. Her grade was B+.",
        "In another course she scored 64 and received an A, because the paper was hard and the class average was low.",
        "She learned to compare her marks with the class distribution rather than with fixed ranges, and to ask instructors early whether grading was relative or absolute.",
        "She also stopped comparing marks with friends in other sections, since different sections sometimes had different grading curves and instructors.",
        "Her new habit is to ask for the previous year's grade distribution if the course publishes it, which helps her set realistic targets."
      ],
      lesson: "Under relative grading, your grade depends on the class. Ask how a course is graded at the start.",
    },
    {
      title: "Planning 40 days before a university exam",
      paragraphs: [
        "Vikram in Nagpur had 40 days before end-semester exams with five papers, and about 30 topics left.",
        "He counted 34 study days after rest days, kept 8 for revision, and spread 30 topics over 26 days, with heavier topics first. Each evening he spent 30 minutes reviewing what he had studied two days and a week earlier.",
        "The revision days went to past papers under timed conditions. He felt less rushed than ever before, and his SGPA rose by half a point.",
        "He kept the plan on a single sheet on his wall, ticking topics off. The ticks were motivating in a way a long to-do list on his phone had never been.",
        "In the last two days he did only light review and practice of formulae, which he says kept him calm enough to read questions carefully."
      ],
      lesson: "A plan with revision days and spaced reviews beats starting late and studying long hours.",
    },
    {
      title: "A failed course and its effect",
      paragraphs: [
        "Ananya in Hyderabad failed a 3-credit course, scoring an F, in a 20-credit semester where her other grades averaged 8.",
        `Her SGPA was (17 × 8 + 3 × 0) ÷ 20 = ${f2((17 * 8) / 20)}. She cleared the course in the supplementary exam with a B (6).`,
        `Her university replaced the F with the new grade in CGPA but showed both on the transcript. Her recalculated semester figure was (17 × 8 + 3 × 6) ÷ 20 = ${f2((17 * 8 + 3 * 6) / 20)}.`,
        "She also learned that some employers ask whether a candidate ever had a backlog, so clearing failed courses quickly and keeping records of the clearing exam matters beyond CGPA.",
        "Her advice: register for the supplementary exam the day the window opens, and treat the failed course as the first priority of the next semester."
      ],
      lesson: "A failed course hurts CGPA heavily until cleared. Learn your university's replacement rule and clear it quickly.",
    },
    {
      title: "Revaluation that changed a grade",
      paragraphs: [
        "Mohit in Indore scored 38 in a course where the pass mark was 40, though he was confident of more. He applied for a photocopy of his answer script within the deadline.",
        "The photocopy showed an answer that had not been marked. He applied for revaluation with the page highlighted. His revised mark was 47.",
        "He noted that revaluation can also lower marks in some universities, and that deadlines are short. He now keeps a calendar note for results and revaluation windows.",
        "He also kept a copy of his application and the revaluation receipt until the revised marksheet was issued, which took several weeks.",
        "His friend applied for revaluation without first seeing the script and lost marks. Mohit's view is that the photocopy is worth the fee because it shows whether revaluation is likely to help."
      ],
      lesson: "If you believe a script was mismarked, request a photocopy and revaluation quickly. Deadlines are short.",
    },
    {
      title: "Lab attendance at 85 percent",
      paragraphs: [
        "Nisha's medical college in Mysuru requires 85 percent attendance in practicals. She had attended 34 of 40 sessions, 85 percent exactly.",
        `She could miss ${canMiss(40, 34, 85)} more sessions without dropping below 85. One more absence would leave her needing about ${mustAttend(41, 34, 85)} consecutive sessions to recover.`,
        "She treated the practicals as compulsory for the rest of the term and planned family travel around the timetable.",
        "Her college also counts late arrival after ten minutes as absent, which she had not known. She now leaves for the hospital early on practical days.",
        "For students in courses with high requirements, she suggests treating every practical as an exam: the cost of missing one is that high."
      ],
      lesson: "Higher requirements leave almost no slack. Know your exact margin in each course.",
    },
    {
      title: "Comparing two universities' CGPAs",
      paragraphs: [
        "An employer in Gurugram compared two candidates: one with 8.0 CGPA from a university using × 10, one with 8.4 from a university using × 9.5.",
        `Their percentages were 80 and ${f1(8.4 * 9.5)}. Under the official rules the gap was much smaller than the CGPAs suggested.`,
        "The employer's HR team decided to accept CGPA with scale and university, and to use percentages only where the university provided an official conversion.",
        "The HR team also noted that relative grading in some universities makes CGPAs from different years hard to compare even within the same institution.",
        "Candidates who added their class rank or percentile alongside their CGPA made the comparison much easier, and the employer started asking for it."
      ],
      lesson: "CGPAs from different institutions are not directly comparable. The conversion rule matters.",
    },
    {
      title: "Credits from an online course",
      paragraphs: [
        "Pooja in Bhopal took a SWAYAM course for credit transfer, which her university allowed for an elective.",
        "She checked the credits the university would award, the grade conversion, and the deadline for submitting the certificate. The course carried 3 credits and her grade converted to an 8.",
        "The credits appeared in her Academic Bank of Credits account and on her transcript. She noted that some universities cap the share of credits that can come from online courses.",
        "She also checked that the online course's final exam was proctored as her university required, since unproctored certificates are often not accepted for credit.",
        "Her advice to classmates: read the university's notice on credit transfer before paying for any certificate, because rules vary by department."
      ],
      lesson: "Online courses can count for credit if your university allows it. Confirm credits, conversion and deadlines first.",
    },
    {
      title: "Stress before the exam",
      paragraphs: [
        "Arjun, preparing for Class 12 boards in Patna, was sleeping five hours a night in the last month and scoring worse in mock tests.",
        "His teacher suggested seven to eight hours of sleep, shorter study blocks with breaks, and timed past papers instead of re-reading. He also cut late-night phone use.",
        "His mock scores improved within two weeks. He spoke to the school counsellor about exam anxiety, which helped him more than he expected.",
        "He also learned to recognise the signs of burnout: headaches, irritability, and reading the same paragraph three times. A short walk usually helped more than another hour at the desk.",
        "If you feel overwhelmed, telling a parent, teacher or counsellor is part of preparing, not a sign of weakness. Many schools and colleges have counselling services and helplines."
      ],
      lesson: "Sleep and breaks are part of preparation. If anxiety is heavy, talk to a counsellor or someone you trust.",
    },
    {
      title: "Group study that worked",
      paragraphs: [
        "Four students in Coimbatore formed a group for Mathematics II. In the first week they mostly chatted.",
        "They set a structure: each member prepared a topic and three problems for the others, sessions lasted ninety minutes, and they ended by listing what each would study alone before the next meeting.",
        "Explaining topics to each other exposed gaps quickly. All four improved, and they kept the group for the next semester.",
        "The group also kept a shared document of common mistakes from past papers, which became their most useful revision sheet in the final week.",
        "They found that the member who explained a topic usually learned it best, so they rotated topics so everyone taught their weakest one at least once."
      ],
      lesson: "Group study works when each session has a job and members teach each other.",
    },
    {
      title: "Marksheet name mismatch",
      paragraphs: [
        "Rohan's Class 10 certificate spelled his surname differently from his degree certificate and passport. A visa officer asked for an explanation.",
        "He applied to the board for correction with his birth certificate and school records, and obtained an affidavit and gazette notification for the name in the meantime.",
        "It took three months. He advised his younger sister to check every certificate when issued, while correction is easy.",
        "He also updated his Aadhaar and PAN details at the same time, so that every identity document and certificate now carries the same spelling.",
        "His sister checked hers the day her Class 10 results came out and found her date of birth wrong by a day. The board corrected it within a month."
      ],
      lesson: "Check name and date of birth on every certificate when issued. Corrections are far harder later.",
    },
    {
      title: "Choosing electives with CGPA in mind",
      paragraphs: [
        "Meena in Kolkata had to choose two electives. One was in her strength, data visualisation; another was a hard but useful course in machine learning.",
        "She considered taking two easy electives to protect her CGPA, then looked at the credits: each elective was 3 credits out of 160. Even a grade two points lower would cut her CGPA by about 0.04.",
        "She chose the machine learning course for the skills, accepting a small CGPA risk, and got a B+ while learning far more than an easy course would have taught.",
        "She also discussed the choice with a senior, who told her that interviewers asked far more about projects and electives than about CGPA differences of a few hundredths.",
        "Her rule for future choices: pick electives for skills and interest, protect CGPA through the heavy core courses."
      ],
      lesson: "Small courses barely move CGPA. Choose electives for what you will learn.",
    },
    {
      title: "Exam on a Monday",
      paragraphs: [
        "Selvi in Madurai had her exam on a Monday morning and planned to revise everything on Sunday.",
        "She moved the full revision to Friday and Saturday, kept Sunday for light review and rest, and slept early. She packed her admit card, ID and stationery on Sunday evening.",
        "On Monday she arrived early and calm. She says the plan's real benefit was that she did not need to cram, because the work had been done by Saturday.",
        "She also kept her phone in another room on Sunday evening, which she says helped more than any revision technique.",
        "Her friend who studied late on Sunday felt sharp at midnight and dull at nine in the morning, which is exactly when it mattered."
      ],
      lesson: "Finish heavy revision two days before. Use the last day for light review, rest and logistics.",
    },
    {
      title: "An entrance exam with negative marking",
      paragraphs: [
        "Harsh, preparing for an engineering entrance exam in Kota, answered every question in his mock tests, guessing when unsure. With one mark deducted for each wrong answer out of four for a right one, his guesses were costing him.",
        "His teacher showed him the arithmetic: with four options and no idea, a guess gains 4 × 0.25 − 1 × 0.75 = 0.25 marks on average; with two options eliminated, a guess gains 4 × 0.5 − 1 × 0.5 = 1.5. Blind guesses barely help; educated guesses do.",
        "He changed his rule: answer when confident, guess only after eliminating at least one option, skip otherwise. His mock scores rose by about 15 marks within a month without learning anything new.",
        "He also practised full-length mocks at the same time of day as the real exam, so his concentration peaked when it mattered.",
      ],
      lesson: "With negative marking, skip blind guesses and guess only after eliminating options. Practise the decision in mocks.",
    },
    {
      title: "A project worth half the grade",
      paragraphs: [
        "Ritu's final-year project in Ahmedabad carried 8 credits, as much as two theory courses. She treated it as a side activity until week ten.",
        "Her guide warned that the project grade depended on regular progress reviews as well as the final report and presentation. She had missed two reviews.",
        "She set a weekly schedule, met her guide every Friday, and wrote the report in sections as she went rather than at the end. She finished with an A, but the late start cost her two weeks of revision for other exams.",
        "She now tells juniors to book the first guide meeting in week one and to keep a short log of each week's work, which also makes writing the final report much easier."
      ],
      lesson: "Projects can carry many credits. Treat them as courses with weekly work, not last-minute tasks.",
    },
    {
      title: "Second board exam opportunity",
      paragraphs: [
        "Aarav in Delhi was disappointed with his Class 10 Mathematics score and learned that the board offered students an additional opportunity to improve scores in some subjects under its revised scheme.",
        "He checked the board's notice for which subjects were allowed, the registration deadline and how the better score would count. He registered for Mathematics only and focused his preparation on the topics where he had lost most marks.",
        "His improved score replaced the earlier one under the scheme's rules. He advised friends to read the official notice rather than rely on rumours, since rules on improvement exams change.",
        "He also kept preparing for his other subjects normally, so the extra exam did not take time away from courses he still had to complete."
      ],
      lesson: "Improvement exams can help, but rules change. Read the board's current notice for eligibility and deadlines.",
    },
    {
      title: "Falling behind after a family emergency",
      paragraphs: [
        "Divya in Kolkata missed three weeks in her fourth semester when her father was hospitalised. When she returned, two courses were close to the attendance line and she had missed the first internal test.",
        "She listed each course's position and met her mentor the same week. The department allowed a makeup test with a medical letter for her father's hospitalisation, and two teachers shared their notes.",
        `In the course where she had attended 24 of 36 classes, she needed ${mustAttend(36, 24, 75)} classes in a row to reach 75 percent; 20 were left. She attended all of them and caught up topics through past papers.`,
        "She finished the semester with an SGPA only slightly below her usual. The early conversation with her mentor, she says, made everything else possible.",
      ],
      lesson: "When you fall behind, list each course's position and talk to teachers within the week. Attendance first, then topics by weight.",
    },
    {
      title: "Two students, same CGPA, different ranks",
      paragraphs: [
        "Priya and Sameer both graduated with a CGPA of 8.1, from different departments of the same university in Hyderabad.",
        "Priya's department had a class average of 7.2 and she ranked in the top 10 percent. Sameer's department averaged 8.3 and his rank was in the bottom half.",
        "A graduate programme abroad that asked for class rank saw them very differently. Priya included her rank and percentile in her application; Sameer focused on his projects and internship, which were strong.",
        "Both were admitted to good programmes. The difference was that each presented the evidence that made their own record clearest: Priya her rank, Sameer his work.",
        "Their professor's advice to juniors was to ask the department each year whether rank or percentile is published, and to request a letter stating it if needed for applications."
      ],
      lesson: "The same CGPA can mean different things in different departments. Rank and projects add context.",
    },
    {
      title: "Using the attendance calculator every Friday",
      paragraphs: [
        "Nikhil in Pune set a phone reminder every Friday at 5 p.m. to update his attendance for each course in the site's calculator.",
        "In week six the calculator showed he could miss only one more Chemistry class. He had been planning a trip that would have cost three.",
        "He moved the trip to the mid-semester break. By the end of term he was above 80 percent in every course and never had to think about condonation.",
        "His friends started doing the same after he showed them the figures for their own courses, which were tighter than any of them had realised.",
        "He kept the figures in a note on his phone too, so that when a friend proposed a cinema trip on a Tuesday afternoon he could answer in seconds."
      ],
      lesson: "A weekly two-minute check turns attendance from a surprise into a plan.",
    },
    {
      title: "A part-time job and attendance",
      paragraphs: [
        "Karthik in Coimbatore worked evenings at a café to pay part of his fees. Twice a week his shift started before his last class ended, and he left early.",
        `By week eight his 4 p.m. Statistics class stood at 21 of 30, 70 percent. He needed ${mustAttend(30, 21, 75)} in a row to reach 75, with 18 classes left.`,
        "He asked his manager to move his two early shifts to weekends for the rest of the term, explaining the attendance rule. The manager agreed. Karthik attended every remaining Statistics class and finished at 79 percent.",
        "He now checks the timetable before agreeing shifts each semester, and keeps a written note of the attendance figure that would put him at risk.",
      ],
      lesson: "Work and study can coexist if you plan around the timetable. Know your margin before agreeing to commitments.",
    },
    {
      title: "An open-book exam that was not easy",
      paragraphs: [
        "Leena's university in Pune ran an open-book exam for a law course. She assumed it would be easy and did not prepare notes.",
        "The questions asked her to apply principles to new situations. Searching through a textbook took too long, and she ran short of time on the last two answers.",
        "For the next open-book exam she prepared a short index of key principles and cases with page numbers and practised applying them to past problems under time. Her marks rose sharply.",
        "She also learned that tabs and coloured markers in the textbook, prepared in advance, saved more time than any amount of reading during the exam.",
        "Her friends who had prepared indexes finished on time and wrote fuller answers, which is where the marks were."
      ],
      lesson: "Open-book exams test application. Prepare an index and practise using it under time.",
    },
    {
      title: "A student with a disability asks for support",
      paragraphs: [
        "Ishaan, who has dyslexia, was finding timed written exams hard at his university in Delhi. A friend told him universities may provide reasonable accommodations.",
        "He approached the disability support office with his assessment report. The university allowed extra time and a separate room for exams, as its policy provided for students with certified learning disabilities.",
        "His results improved, and he says the hardest part was asking. He encourages others to check their institution's policy early, since documentation can take time.",
        "He also asked his teachers for lecture slides in advance, which the support office arranged, so he could read them at his own pace before class.",
        "Several classmates did not know the support office existed until he mentioned it."
      ],
      lesson: "Students with disabilities may be entitled to accommodations. Ask the institution's support office early with documents.",
    },
    {
      title: "Building a revision timetable with friends",
      paragraphs: [
        "Three friends in Bhopal preparing for the same five papers agreed on a shared revision timetable, posted on a group chat. Each day had one main paper and one short review of another.",
        "They met online for an hour each evening to test each other with ten questions on the day's paper. Anyone who missed two evenings bought snacks for the next session, which kept attendance high.",
        "The shared timetable stopped them all leaving one subject to the end, a habit each had admitted to separately. Their results were their best so far, and they kept the system for the following year.",
        "They also learned to stop comparing hours studied, which only made everyone anxious, and to compare the number of questions answered correctly instead.",
      ],
      lesson: "A shared timetable and short daily testing sessions keep a group honest without long meetings.",
    },
  ],

  problemIntro: "Use the formulas in this book or the site's calculators. Round SGPA and CGPA to two decimals.",

  problems: [
    {
      title: "SGPA",
      q: ["Credits and grade points: 4 × 8, 4 × 7, 3 × 9, 3 × 6, 2 × 10. SGPA?"],
      steps: ["Credit points = 32 + 28 + 27 + 18 + 20 = 125.", "Credits = 16."],
      answer: `${f2(125 / 16)}.`,
    },
    {
      title: "CGPA from two semesters",
      q: ["Semester 1: 20 credits, SGPA 7.8. Semester 2: 24 credits, SGPA 8.5. CGPA?"],
      steps: ["(7.8 × 20 + 8.5 × 24) ÷ 44."],
      answer: `${f2((7.8 * 20 + 8.5 * 24) / 44)}.`,
    },
    {
      title: "Average of SGPAs is wrong",
      q: ["Why is the CGPA in Problem 2 not (7.8 + 8.5) ÷ 2?"],
      steps: ["The semesters have different credits; a simple average weights them equally."],
      answer: `The simple average is ${f2((7.8 + 8.5) / 2)}, slightly different from the correct ${f2((7.8 * 20 + 8.5 * 24) / 44)}.`,
    },
    {
      title: "Target for remaining semesters",
      q: ["CGPA 7.2 after 100 credits. Target 7.8 after 180 credits. Required average for the remaining 80?"],
      steps: ["(7.8 × 180 − 7.2 × 100) ÷ 80."],
      answer: `${f2((7.8 * 180 - 7.2 * 100) / 80)}.`,
    },
    {
      title: "Impossible target",
      q: ["CGPA 6.0 after 140 credits of 160. Can the student reach 7.0?"],
      steps: ["Needed average over 20 credits = (7 × 160 − 6 × 140) ÷ 20 = 14."],
      answer: "No; it would need 14 on a 10-point scale.",
    },
    {
      title: "CBSE conversion",
      q: ["Convert CGPA 8.6 using CGPA × 9.5."],
      steps: ["8.6 × 9.5."],
      answer: `${f1(8.6 * 9.5)} percent.`,
    },
    {
      title: "VTU-style conversion",
      q: ["Convert CGPA 7.9 using (CGPA − 0.75) × 10."],
      steps: ["(7.9 − 0.75) × 10."],
      answer: "71.5 percent.",
    },
    {
      title: "Reverse conversion",
      q: ["What CGPA corresponds to 75 percent under CGPA × 9.5?"],
      steps: ["75 ÷ 9.5."],
      answer: `${f2(75 / 9.5)}.`,
    },
    {
      title: "4-point GPA",
      q: ["Convert a GPA of 3.4 on a 4-point scale to a percentage with GPA ÷ 4 × 100."],
      steps: ["3.4 ÷ 4 × 100."],
      answer: "85 percent, though foreign universities often evaluate transcripts their own way.",
    },
    {
      title: "Classes you can miss",
      q: ["Attended 70 of 84; requirement 75 percent. How many more can be missed?"],
      steps: ["(100 × 70 − 75 × 84) ÷ 75 = (7,000 − 6,300) ÷ 75 = 9.33."],
      answer: `${canMiss(84, 70, 75)}.`,
    },
    {
      title: "Classes you must attend",
      q: ["Attended 45 of 70; requirement 75 percent. How many in a row?"],
      steps: ["(75 × 70 − 100 × 45) ÷ 25 = (5,250 − 4,500) ÷ 25 = 30."],
      answer: `${mustAttend(70, 45, 75)}.`,
    },
    {
      title: "Higher requirement",
      q: ["Attended 30 of 38; requirement 85 percent. Must attend how many in a row?"],
      steps: ["(85 × 38 − 3,000) ÷ 15 = (3,230 − 3,000) ÷ 15 = 15.33."],
      answer: `${mustAttend(38, 30, 85)}.`,
    },
    {
      title: "Best possible by term end",
      q: ["Attended 40 of 60; 20 classes left. Best possible attendance?"],
      steps: ["(40 + 20) ÷ (60 + 20)."],
      answer: "75 percent exactly, if every remaining class is attended.",
    },
    {
      title: "Final exam target",
      q: ["Internal 32 of 50; final out of 50. To reach 65 overall, what is needed in the final?"],
      steps: ["65 − 32 = 33 of 50."],
      answer: "33 of 50, 66 percent.",
    },
    {
      title: "Weighted final",
      q: ["Internal is 30 percent, final 70 percent. Internal score 80 percent. What final percentage gives 75 overall?"],
      steps: ["0.3 × 80 + 0.7 × x = 75.", "24 + 0.7x = 75; x = 72.86."],
      answer: "About 72.9 percent in the final.",
    },
    {
      title: "Effect of one grade",
      q: ["In a 22-credit semester, a 4-credit course improves from 6 to 9. Change in SGPA?"],
      steps: ["Extra credit points = 4 × 3 = 12.", "÷ 22."],
      answer: `+${f2(12 / 22)}.`,
    },
    {
      title: "Failed course replaced",
      q: ["A 20-credit semester has 17 credits at average 8 and a 3-credit F. After the course is cleared with 7 and the F replaced, what is the semester's figure?"],
      steps: ["Before: (136 + 0) ÷ 20 = 6.8.", "After: (136 + 21) ÷ 20."],
      answer: `${f2((136 + 21) / 20)}, up from 6.80.`,
    },
    {
      title: "Study days",
      q: ["An exam is 50 days away. Saturdays and Sundays off. Roughly how many study days?"],
      steps: ["About 50 × 5 ÷ 7 ≈ 35.7, depending on which weekday you start."],
      answer: "About 35 or 36 study days.",
    },
    {
      title: "Topics per day",
      q: ["36 study days, 9 kept for revision, 30 topics left. Topics per day in first study?"],
      steps: ["30 ÷ 27."],
      answer: "About 1.1 topics a day; give heavier topics two days and lighter ones half a day.",
    },
    {
      title: "Credits from contact hours",
      q: ["A course has 3 lecture hours and 2 lab hours a week. Under one credit per lecture hour and one per two lab hours, how many credits?"],
      steps: ["3 + 1."],
      answer: "4 credits.",
    },
    {
      title: "Class from percentage",
      q: ["Using common bands (75 and above: distinction; 60 to 75: first class), classify CGPA 7.4 under × 10 and under × 9.5."],
      steps: ["× 10: 74 percent.", "× 9.5: 70.3 percent."],
      answer: "First class under both, just below distinction under × 10.",
    },
    {
      title: "Attendance with condonation",
      q: ["Requirement 75 percent, condonation to 65 percent with medical proof. Attended 42 of 60, with 6 classes missed for a documented illness. Eligible?"],
      steps: ["Attendance = 70 percent, below 75 but above 65.", "Condonation possible with proof, subject to approval."],
      answer: "Likely eligible for condonation, at the institution's discretion.",
    },
    {
      title: "CGPA ceiling",
      q: ["CGPA 8.0 after 120 credits; 40 credits left. Highest possible final CGPA?"],
      steps: ["(8 × 120 + 10 × 40) ÷ 160."],
      answer: "8.50.",
    },
    {
      title: "Practical marks",
      q: ["A lab course awards 40 percent for records, 20 for viva and 40 for the practical exam. Scores: 85, 70, 60 percent. Overall?"],
      steps: ["0.4 × 85 + 0.2 × 70 + 0.4 × 60 = 34 + 14 + 24."],
      answer: "72 percent.",
    },
    {
      title: "Past paper timing",
      q: ["A 3-hour paper has 5 questions of 20 marks. How long per question, with 15 minutes for reading and checking?"],
      steps: ["165 minutes ÷ 5."],
      answer: "33 minutes per question.",
    },
    {
      title: "Negative marking guess",
      q: ["A question has 4 options; +4 for right, −1 for wrong. Expected gain from a blind guess? After eliminating two options?"],
      steps: ["Blind: 0.25 × 4 − 0.75 × 1 = 0.25.", "Two eliminated: 0.5 × 4 − 0.5 × 1 = 1.5."],
      answer: "0.25 marks blind; 1.5 marks after eliminating two options.",
    },
    {
      title: "Project credits",
      q: ["An 8-credit project improves from 7 to 9 in a 26-credit semester. SGPA change?"],
      steps: ["Extra credit points = 16.", "÷ 26."],
      answer: `+${f2(16 / 26)}.`,
    },
    {
      title: "Study blocks",
      q: ["You have 5 hours a day. Using 50-minute blocks with 10-minute breaks and one 30-minute break after three blocks, how many blocks fit?"],
      steps: ["Three blocks with breaks: 3 hours; long break 30 minutes; remaining 1.5 hours: about one more block and a half."],
      answer: "About 4 to 5 focused blocks.",
    },
    {
      title: "Attendance over a whole term",
      q: ["A course will have 48 classes. You must attend at least 75 percent. What is the most you can miss over the whole term?"],
      steps: ["75% of 48 = 36 attended.", "48 − 36 = 12."],
      answer: "12 classes over the term.",
    },
    {
      title: "Weighted internal components",
      q: ["Internal assessment is out of 40: two tests of 10 each, assignments 10, attendance 5 and a quiz 5. Scores: 7.5, 8.5, 8, 4 and 3. Internal total?"],
      steps: ["7.5 + 8.5 + 8 + 4 + 3."],
      answer: "31 out of 40, 77.5 percent.",
    },
    {
      title: "Percentile and rank",
      q: ["In a class of 120, you are ranked 18th. What percentile is that, roughly?"],
      steps: ["Students below you = 102.", "102 ÷ 120."],
      answer: "About the 85th percentile.",
    },
    {
      title: "Recovering after three weeks away",
      q: ["Attended 24 of 36 classes; 20 left; requirement 75 percent. How many must be attended in a row, and is it possible?"],
      steps: [`(75 × 36 − 100 × 24) ÷ 25 = (2,700 − 2,400) ÷ 25 = 12.`],
      answer: `${mustAttend(36, 24, 75)} in a row; possible with 20 left.`,
    },
    {
      title: "Rank to percentile",
      q: ["Rank 45 in a class of 300. Approximate percentile?"],
      steps: ["Students below = 255.", "255 ÷ 300."],
      answer: "About the 85th percentile.",
    },
    {
      title: "Planning a trip",
      q: ["Attended 46 of 54 at 75 percent. A trip would miss 4 classes. Safe?"],
      steps: [`Can miss = ${canMiss(54, 46, 75)}.`],
      answer: canMiss(54, 46, 75) >= 4 ? "Yes, just within the margin." : "No; it would drop below the requirement.",
    },
    {
      title: "Time per question by marks",
      q: ["A 3-hour paper: 2 questions of 15 marks, 4 of 10, and 5 of 4. With 15 minutes reserved, how many minutes per mark, and per question type?"],
      steps: ["Total marks = 30 + 40 + 20 = 90.", "Minutes available = 165.", "Per mark ≈ 1.83."],
      answer: "About 27 minutes for each 15-mark question, 18 for each 10-mark, and 7 for each 4-mark.",
    },
    {
      title: "Step marks",
      q: ["A 10-mark numerical awards 2 for the formula, 3 for substitution, 3 for working and 2 for the answer with units. You make an arithmetic error in the last step. Likely marks?"],
      steps: ["Formula, substitution and most working earn marks; the final answer loses 2."],
      answer: "Around 8 of 10, if the working is shown clearly.",
    },
    {
      title: "Shift change for attendance",
      q: ["Attended 21 of 30 at 75 percent; 18 left. Must attend in a row? Final attendance if all 18 are attended?"],
      steps: [`Must attend = ${mustAttend(30, 21, 75)}.`, "Final = 39 ÷ 48."],
      answer: `${mustAttend(30, 21, 75)} in a row; final attendance 81.25 percent if all are attended.`,
    },
    {
      title: "Extra time",
      q: ["A 3-hour exam with 20 minutes of extra time per hour. Total time?"],
      steps: ["3 × 20 = 60 minutes extra."],
      answer: "4 hours.",
    },
    {
      title: "Does CGPA fall?",
      q: ["CGPA 7.6 after 90 credits. Next semester 22 credits at SGPA 7.2. New CGPA?"],
      steps: ["(7.6 × 90 + 7.2 × 22) ÷ 112."],
      answer: `${f2((7.6 * 90 + 7.2 * 22) / 112)}, a small fall because the SGPA was below the CGPA.`,
    },
    {
      title: "Minimum SGPA to keep CGPA",
      q: ["CGPA 8.0 after 100 credits. What SGPA in a 20-credit semester keeps it at 8.0?"],
      steps: ["Any SGPA of 8.0 keeps it unchanged."],
      answer: "8.0; above raises it, below lowers it.",
    },
    {
      title: "Attendance including cancelled classes",
      q: ["40 classes scheduled, 4 cancelled, 28 attended. Attendance?"],
      steps: ["Held = 36.", "28 ÷ 36."],
      answer: `${f1(pctOf(28, 36))} percent.`,
    },
    {
      title: "Credits and contact hours over a semester",
      q: ["A 4-credit course meets 4 hours a week for 15 weeks. Total contact hours? If you miss 9 hours, what attendance is that?"],
      steps: ["4 × 15 = 60 hours.", "Attended 51 of 60."],
      answer: "60 hours; 85 percent attendance.",
    },
    {
      title: "Final exam needed for a grade boundary",
      q: ["Internal 34 of 50; final out of 50; grade A needs 80 overall. What final score is needed, and is it realistic if past papers average 36?"],
      steps: ["80 − 34 = 46 of 50 needed."],
      answer: "46 of 50, 92 percent, well above the past-paper average; an A is unlikely, but a B+ at 70 needs only 36.",
    },
    {
      title: "Spaced review schedule",
      q: ["A topic first studied on day 1 is reviewed on days 3, 8 and 21. How many reviews by day 30, and what are the gaps?"],
      steps: ["Reviews on days 3, 8, 21.", "Gaps: 2, 5 and 13 days."],
      answer: "Three reviews, with gaps that grow as memory strengthens.",
    },
  ],

  exercises: {
    warmup: [
      { q: "What is the formula for SGPA?", a: "Sum of credits × grade points, divided by the sum of credits." },
      { q: "On a typical 10-point scale, what grade point is an A+?", a: "9." },
      { q: "Is attendance usually counted per course or overall?", a: "Per course, in most institutions." },
      { q: "What is condonation?", a: "Permission to sit an exam despite attendance below the requirement, for valid reasons, within limits." },
      { q: "Which conversion did CBSE use for older Class 10 CGPA?", a: "CGPA × 9.5." },
      { q: "Name one study technique with strong evidence.", a: "Practice testing, spacing, interleaving or self-explanation." },
      { q: "Why do weeks 7 and 13 of a semester matter so much?", a: "Internal tests at those points show where you stand while there is still time to act." },
      { q: "With negative marking of −1 for a wrong answer and +4 for a right one, should you guess blindly?", a: "Only marginally; the expected gain is small. Guess after eliminating options." },
      { q: "What is the best evidence for revaluation?", a: "A photocopy of the answer script showing an unmarked page or a totalling error." },
      { q: "If your SGPA is above your CGPA, what happens to CGPA?", a: "It rises." },
    ],
    practice: [
      { q: "Credits 3, 3, 4, 2 with grade points 8, 9, 7, 10. SGPA?", a: `${f2((24 + 27 + 28 + 20) / 12)}.` },
      { q: "Attended 55 of 70 at 75 percent. Can miss?", a: `${canMiss(70, 55, 75)}.` },
      { q: "Attended 38 of 56 at 75 percent. Must attend?", a: `${mustAttend(56, 38, 75)}.` },
      { q: "Convert CGPA 7.2 using × 10 and × 9.5.", a: "72.0 percent and 68.4 percent." },
      { q: "CGPA 7.0 after 60 credits; next semester 20 credits at 9.0. New CGPA?", a: `${f2((7 * 60 + 9 * 20) / 80)}.` },
      { q: "Internal 26 of 40; need 60 of 100 overall. Final needed out of 60?", a: "34 of 60." },
      { q: "A course has 40 classes at a 75 percent requirement. Most you can miss in total?", a: "10." },
      { q: "An 8-credit project in a 24-credit semester rises from 6 to 8. SGPA change?", a: `+${f2(16 / 24)}.` },
      { q: "List four things to do in weeks 1 and 2 of a semester.", a: "Note credits, assessment weights and attendance rules; set up an attendance table; skim course outlines; plan time for heavy courses." },
      { q: "Attended 30 of 42 at 75 percent; 18 left. Must attend in a row?", a: `${mustAttend(42, 30, 75)}.` },
      { q: "Write a short message to a teacher after missing two weeks for illness.", a: "For example: 'I was unwell from 3 to 16 March and have submitted the medical certificate to the office. Could I meet you this week to plan how to catch up, and is a makeup for the internal test possible?'" },
      { q: "A 5-mark 'compare' question: what should your answer contain?", a: "A short statement of what is being compared, then points of similarity and difference side by side, ideally in a small table, and a one-line conclusion." },
      { q: "Attended 28 of 36 at 75 percent. Can miss?", a: `${canMiss(36, 28, 75)}.` },
      { q: "CGPA 6.9 after 60 credits; next 20 credits at 8.1. New CGPA?", a: `${f2((6.9 * 60 + 8.1 * 20) / 80)}.` },
      { q: "36 classes held, 29 attended. Attendance and can-miss at 75 percent?", a: `${f1(pctOf(29, 36))} percent; can miss ${canMiss(36, 29, 75)}.` },
    ],
    stretch: [
      { q: "CGPA 6.8 after 80 credits. What average over the next 80 gives 7.5?", a: `${f2((7.5 * 160 - 6.8 * 80) / 80)}.` },
      { q: "Why does each missed class hurt more when the requirement is 85 percent rather than 75?", a: "Each missed class needs R ÷ (100 − R) attended classes to make up: 3 at 75 percent, about 5.7 at 85." },
      { q: "Design a 30-day plan for 4 papers with 20 topics, 4 rest days and 6 revision days.", a: "20 first-study days for 20 topics, one a day with heavier ones split; 6 revision days with at least one timed paper per subject; spaced reviews each evening of topics from two and seven days earlier." },
      { q: "A friend says a 1-credit course with an F barely matters. Show the effect in a 20-credit semester where the rest average 8.", a: `SGPA ${f2((19 * 8) / 20)} instead of 8.00 if the F were an 8, a drop of 0.40.` },
      { q: "Explain how relative grading can change your strategy.", a: "Since grades depend on classmates' performance, your target is a position in the distribution; difficult papers may still yield high grades, and easy ones may not." },
      { q: "Explain why an Indian CGPA should not be self-converted to a 4-point GPA for applications.", a: "Universities and evaluators use their own methods considering the institution and scale; a self-conversion may be inconsistent and raise questions. Provide the official scale and transcripts." },
      { q: "Create a decision rule for multiple-choice questions with negative marking.", a: "Answer when confident; if one or more options can be eliminated, guess; if not, skip. Practise the rule on mocks and track net marks gained or lost from guesses." },
      { q: "Explain how moderation can change marks after evaluation.", a: "If marking varies between examiners or sections, moderation may adjust marks so that standards are consistent, before grades are assigned." },
      { q: "Plan a two-hour revision session using practice testing and spacing for a topic you studied last week.", a: "Ten minutes of recall questions on last week's and two-day-old topics; fifty minutes on the new topic with question writing; a break; forty minutes of mixed problems without notes; ten minutes of summary from memory." },
      { q: "Show that a semester SGPA equal to the current CGPA leaves CGPA unchanged, whatever the credits.", a: "New CGPA = (C × N + C × n) ÷ (N + n) = C." },
    ],
    challenge: [
      { q: "Write a one-page guide for first-year students on credits, CGPA and attendance at a typical college.", a: "Explain credits and grade points with one worked SGPA; show how heavy courses dominate; explain per-course attendance with the can-miss formula; list the medical leave and condonation rules; point to the ordinance as the authority." },
      { q: "A university proposes changing from × 10 to × 9.5 for conversions. Argue the effect on students' applications.", a: "Students' stated percentages would fall by 5 percent of CGPA, about 4 points at 8.0, which could affect cut-offs that ask for a percentage. The university should issue clear certificates of the rule to avoid confusion." },
      { q: "Plan the last week before a set of five exams in five days.", a: "Prioritise the first exam fully, with light review of others; after each exam, rest briefly then switch to the next; sleep normally; prepare logistics each evening; avoid discussing completed papers." },
      { q: "Explain why studying by re-reading notes feels effective but often is not.", a: "Familiarity from re-reading creates an illusion of knowing; recall under exam conditions requires retrieval practice, which re-reading does not provide." },
      { q: "Design a semester plan for a student with 6 courses, a project and a part-time job of 10 hours a week.", a: "Fix weekly hours per course weighted by credits; schedule project work weekly with guide meetings; protect sleep; use commute and short gaps for question reviews; track attendance per course; plan internal test preparation in weeks 6 and 12; reduce job hours during study leave if possible." },
      { q: "Advise a student who works 15 hours a week and is falling behind in two of six courses.", a: "Map work shifts against the timetable; move shifts that clash with classes in at-risk courses; talk to those teachers about catching up; use commute time for question review; reduce hours temporarily during exams if finances allow; check for any scholarship or fee support." },
      { q: "Write a short note to yourself, to read on the first day of next semester, listing five habits from this book you will keep.", a: "For example: write credits beside each course; update attendance every Friday; turn lecture notes into questions within a day; start assignments the day they are set; keep the last fifth of study days for revision and sleep normally before exams." },
    ],
  },

  faqs: [
    {
      group: "SGPA and CGPA",
      items: [
        ["What is the difference between SGPA and CGPA?", "SGPA covers one semester's courses; CGPA covers every course you have taken so far, weighting each by its credits. CGPA is the figure most forms and employers ask for."],
        ["Is CGPA the average of SGPAs?", "Only if every semester has the same total credits. Otherwise, compute it from total credit points divided by total credits."],
        ["Do failed courses count in CGPA?", "Usually yes until cleared, with zero grade points. Rules on replacing the grade after a repeat attempt vary by university."],
        ["What is a good CGPA?", "It depends on the institution and field. Many employers use cut-offs such as 6.0, 7.0 or 7.5 on 10. Graduate programmes abroad look at the whole transcript and class rank."],
        ["How many credits is a typical degree?", "Many four-year undergraduate degrees require around 160 credits; three-year degrees fewer. NEP-aligned programmes define credits for each year of study."],
        ["Do audit or non-credit courses affect CGPA?", "No. Audit and non-credit courses may appear on the transcript with a pass or satisfactory mark, but they carry no credits and are left out of the calculation."],
        ["Why did my CGPA barely move after a great semester?", "Because CGPA averages over all credits so far; each new semester is a smaller share of the total as you progress."],
      ],
    },
    {
      group: "Conversions",
      items: [
        ["How do I convert CGPA to percentage?", "Use the formula your board or university specifies, often printed on the marksheet. Common ones are × 10 and × 9.5, but they differ by institution."],
        ["Why does × 9.5 appear so often?", "CBSE used it for its older Class 10 CGPA scheme, and the figure spread to many forms. It is not a national rule for universities."],
        ["What if my university has no conversion rule?", "State your CGPA with the scale, such as 8.2 on 10, and attach a note or certificate from the university if a percentage is demanded."],
        ["How do foreign universities read Indian CGPAs?", "Many use credential evaluation services or their own tables, considering the institution and scale. Provide official transcripts and grading scale descriptions."],
        ["Can I convert to a 4-point GPA?", "There are rough methods, but official evaluations vary. Use the evaluator or university's method, not a simple formula, for applications."],
        ["What is first class with distinction?", "A division usually defined by percentage or CGPA cut-offs, often 75 percent or a CGPA around 7.5 or 8. Check your university's definition."],
      ],
    },
    {
      group: "Attendance",
      items: [
        ["What is the usual attendance requirement?", "Many colleges require 75 percent per course to sit the final exam; some programmes, such as medicine, require more for practicals."],
        ["How many classes can I miss?", "Use floor((100 × attended − required × held) ÷ required). The site's attendance calculator does this and shows how many you must attend if below."],
        ["Does medical leave count as attendance?", "Usually not as attendance itself, but documented medical leave submitted on time can support condonation, allowing you to sit the exam with attendance below the normal requirement."],
        ["What happens if I fall short?", "You may be barred from that course's exam and need to repeat it. Condonation may be available within limits for valid reasons."],
        ["Do late arrivals count as absent?", "Many colleges mark students absent if they arrive after a cut-off, often ten or fifteen minutes. Rules differ, so check your college's policy and ask the teacher if unsure."],
        ["Is attendance for labs separate?", "Usually yes. Labs and practicals are separate courses or components with their own attendance, and some programmes require a higher percentage for them."],
        ["Can I make up attendance with extra classes?", "Only if your institution counts them, such as remedial or makeup sessions recorded in the register. Ask the department before relying on it."],
      ],
    },
    {
      group: "Exams and results",
      items: [
        ["How should I start preparing for exams?", "Count study days, keep the last fifth for revision, list topics by weight, and plan heavier topics first, with spaced reviews and timed past papers."],
        ["Is it better to study late at night?", "Regular sleep supports memory and performance. Consistent study at times you are alert beats late nights that cut sleep."],
        ["How many past papers should I do?", "At least three timed papers per subject in the revision period, plus targeted questions on weak topics. Mark them strictly against the scheme and redo the questions you lost marks on."],
        ["What is revaluation?", "A request to re-check or re-mark an answer script after results, for a fee, within a short deadline. Marks can sometimes go down as well as up."],
        ["What is a supplementary exam?", "An exam to clear failed courses, usually held soon after results or alongside the next semester's exams. Register within the window and check how the new grade replaces the old one."],
        ["How is internal assessment calculated?", "From tests, assignments, projects and sometimes attendance, as defined in the course plan. Ask for the breakdown at the start of the semester."],
        ["What should I carry to an exam?", "Admit card, a photo ID, permitted stationery and calculator, and anything specified. Check the list the night before."],
        ["How do I handle exam anxiety?", "Prepare with practice under exam conditions, sleep well, use slow breathing during the exam, and talk to a counsellor or trusted person if anxiety is heavy."],
      ],
    },
    {
      group: "Records and credits",
      items: [
        ["Are DigiLocker marksheets valid?", "Documents issued to DigiLocker by boards and universities are treated as valid for many purposes. Some processes still ask for physical copies or attested ones."],
        ["What is the Academic Bank of Credits?", "A national system to store credits earned by students, supporting credit transfer and multiple entry and exit under the National Education Policy."],
        ["What is an APAAR ID?", "An identifier for students linked to academic records, introduced under the National Education Policy, used with the Academic Bank of Credits."],
        ["How do I correct my name on a certificate?", "Apply to the issuing board or university with supporting documents such as a birth certificate and school records. Corrections are easiest soon after the certificate is issued."],
        ["Can online courses count for credit?", "Many universities accept SWAYAM or similar courses for credit within limits. Confirm credits and grade conversion before enrolling."],
      ],
    },
    {
      group: "Study habits",
      items: [
        ["How many hours a day should I study?", "It depends on the course and time left, but consistent focused hours beat long distracted ones. Many students do well with three to five focused hours a day outside classes during exam preparation, with breaks."],
        ["Is it better to study alone or in a group?", "Both help in different ways. Study alone to learn and practise; use a structured group to explain topics, test each other and fill gaps."],
        ["Should I make detailed notes or summaries?", "Short summaries and question lists you test yourself on are usually more useful for revision than long notes you only re-read."],
        ["How do I stop procrastinating?", "Start with a small, specific task for ten minutes, remove the phone, and use a fixed daily start time. Starting is the hardest part."],
        ["Does listening to music help studying?", "It varies. Lyrics tend to interfere with reading and writing tasks; quiet instrumental music may be fine for some. Test what works for you."],
        ["How do I remember formulas?", "Use them: practise problems that need each formula, write them from memory every few days, and understand where they come from."],
        ["How long before exams should I start revising?", "Ideally, weave short reviews through the whole semester and start dedicated revision three to six weeks before exams, depending on the number of papers. Starting a week before usually means cramming."],
        ["What should I do the night before an exam?", "Light review of summaries and formulas, prepare your bag and documents, and sleep at your normal time. New topics the night before rarely help."],
        ["Is it useful to rewrite my notes neatly?", "Rewriting feels productive but adds little. Turning notes into questions and answering them is a better use of time."],
        ["What is the best time of day to study?", "When you are most alert. Many students do best in the morning, but consistency matters more than the hour."],
      ],
    },
    {
      group: "Projects, labs and internships",
      items: [
        ["How are projects graded?", "Usually on progress reviews, the final report, a presentation and sometimes a viva. Ask for the rubric at the start."],
        ["Can I use AI tools for assignments?", "Check your institution's policy. Many allow limited use with disclosure; submitting work you cannot explain or that is not your own is misconduct."],
        ["Do internships carry credits?", "In many NEP-aligned programmes, yes: internships can carry credits and sometimes grades. Check how they are awarded, what documents and reports are needed, and whether the host organisation must sign an evaluation."],
        ["How important is the lab record?", "Often a significant part of the practical grade. Keep it complete, neat and up to date after each session."],
        ["What happens if I miss a practical session?", "It counts as an absence and you may need to repeat it in a makeup slot if offered. Practicals often have higher attendance requirements."],
      ],
    },
    {
      group: "Common worries",
      items: [
        ["My CGPA is low. Is my career over?", "No. CGPA matters for some cut-offs, but skills, projects, internships and how you present them matter more over time. Improving steadily and building evidence of ability opens many doors."],
        ["Can I improve my CGPA after graduation?", "Generally no, once the degree is awarded. Some universities allow improvement exams before graduation. Focus on further study, certifications and work that demonstrate ability."],
        ["Should I mention a backlog in interviews?", "Answer honestly if asked. Explain briefly what happened and how you cleared it, and focus on what you learned."],
        ["I failed an exam. What now?", "Note the supplementary exam dates, request your script if allowed, identify what went wrong, and make the course a priority. Talk to your mentor about support."],
        ["Is 75 percent attendance enough?", "It meets the usual requirement, but leaves little margin. Aim higher early in the semester so illness later does not push you below the line."],
        ["What if a teacher marks me absent by mistake?", "Raise it promptly with the teacher, with any evidence such as your signature on a sheet or work submitted that day. Errors are easier to fix the same week."],
        ["Do grades matter for government jobs?", "Many government recruitments require a minimum qualification and sometimes a percentage; selection is usually by exam. Check each notification's eligibility conditions."],
      ],
    },
    {
      group: "Support and rights",
      items: [
        ["Can I get extra time in exams for a disability?", "Many boards and universities provide accommodations such as extra time, a scribe or a separate room for students with certified disabilities. Apply through the institution's support office with documents, well before exams."],
        ["Who do I approach about a grading dispute?", "Start with the course teacher, then the head of department or examination office, following the university's grievance procedure. Keep copies of everything."],
        ["Can I see my answer script?", "Many universities allow you to request a photocopy for a fee within a set period after results. Some also allow viewing in person."],
        ["What if I am unwell on an exam day?", "Inform the examination office as soon as possible and submit a medical certificate. Rules on missed exams vary: some allow a special exam, others treat it as an absence to be cleared in the supplementary round."],
        ["Is there a limit to how many times I can attempt a failed course?", "Many universities set a maximum duration for completing a degree, within which you can attempt failed courses. Check the ordinance for limits."],
      ],
    },
    {
      group: "Numbers people get wrong",
      items: [
        ["If my SGPA is 9 and CGPA 7, did I do well this semester?", "Yes. SGPA shows this semester; CGPA includes earlier ones. A high SGPA will pull the CGPA up gradually."],
        ["Can my CGPA go down after a good semester?", "Not if the new SGPA is above your CGPA. It falls only when a semester's SGPA is below your current CGPA."],
        ["Is 75 percent attendance calculated on scheduled or held classes?", "On classes actually held, as recorded by the department. Cancelled classes are usually left out, but a class the college treats as held, such as during a mass absence, counts against those who were not there."],
        ["Does a 0 in an internal test count?", "Yes, it is part of the internal total. Ask about makeup tests if you missed it for a valid reason."],
        ["Why does my percentage differ from my friend's with the same CGPA?", "Your universities use different conversion formulas, such as × 10 and × 9.5, or one of you used a formula your institution does not use. The same CGPA can therefore give percentages several points apart."],
        ["Do grace marks exist?", "Some universities award limited grace or moderation marks under defined rules, for example to help students just below a pass mark. They are not guaranteed."],
        ["What does 'equivalent percentage' on a certificate mean?", "It is your university's official conversion of your CGPA into a percentage, issued for situations that require one. Quote it as stated rather than calculating your own."],
        ["Do I need to convert CGPA for a government job form?", "Follow the recruitment notification's instructions. Many accept CGPA with the university's conversion certificate where a percentage is required, and some specify a formula to use if the university has none."],
      ],
    },
  ],

  glossary: [
    ["Absolute grading", "Grading where fixed mark ranges map to grades."],
    ["Academic Bank of Credits", "A national repository of credits earned by students under the NEP."],
    ["APAAR ID", "A student identifier linking academic records."],
    ["Audit course", "A course taken without credit, not counted in CGPA."],
    ["Backlog", "A failed course yet to be cleared."],
    ["CGPA", "Cumulative grade point average across all semesters so far."],
    ["Condonation", "Permission to sit an exam despite attendance shortfall, within limits."],
    ["Credit", "A unit reflecting a course's teaching hours and weight."],
    ["Credit points", "Credits multiplied by grade points for a course."],
    ["Division", "A classification of results such as first class or distinction."],
    ["Elective", "A course chosen from options."],
    ["End-semester exam", "The final exam of a semester's course."],
    ["Grade point", "The number assigned to a letter grade, such as 9 for A+."],
    ["Interleaving", "Mixing different types of problems in a study session."],
    ["Internal assessment", "Marks from tests, assignments and other work during the semester."],
    ["Ordinance", "The university's official rules for examinations and grading."],
    ["Practice testing", "Answering questions from memory as a study method."],
    ["Relative grading", "Grading based on the distribution of the class's marks."],
    ["Revaluation", "Re-marking of an answer script on request."],
    ["SGPA", "Semester grade point average."],
    ["Spacing", "Spreading study of a topic over several days."],
    ["Supplementary exam", "An exam to clear failed courses."],
    ["SWAYAM", "India's national platform for online courses, some eligible for credit."],
    ["Transcript", "An official record of all courses, credits and grades."],
    ["Viva", "An oral examination."],
    ["DigiLocker", "A government platform for digital documents, including marksheets."],
    ["Backlog clearance", "Passing a previously failed course, usually in a supplementary exam."],
    ["Class rank", "A student's position in the class by CGPA or marks."],
    ["Command word", "The instruction in an exam question, such as explain, compare or derive."],
    ["Equivalent percentage", "A university's official conversion of CGPA to a percentage."],
    ["Grace marks", "Limited marks some universities add under defined rules, such as to reach a pass."],
    ["Moderation", "Adjustment of marks to make standards consistent across examiners or sections."],
    ["Open-book exam", "An exam where reference materials are allowed, testing application."],
    ["Percentile", "The percentage of students scoring below a given student."],
    ["Reasonable accommodation", "Adjustments such as extra time provided to students with disabilities."],
    ["Study leave", "A break before end-semester exams set aside for preparation."],
  ],

  references: [
    { title: "Guidelines on the Choice Based Credit System", who: "University Grants Commission", where: "ugc.gov.in", note: "The basis for credits, grade points and the 10-point scale used by many universities." },
    { title: "National Education Policy 2020", who: "Ministry of Education", where: "education.gov.in", note: "Multiple entry and exit, the Academic Bank of Credits and credit frameworks." },
    { title: "Academic Bank of Credits", who: "Ministry of Education and UGC", where: "abc.gov.in", note: "How credits are stored and transferred." },
    { title: "DigiLocker", who: "Ministry of Electronics and Information Technology", where: "digilocker.gov.in", note: "Digital marksheets and certificates." },
    { title: "SWAYAM", who: "Ministry of Education", where: "swayam.gov.in", note: "Online courses, some eligible for credit transfer." },
    { title: "Your university's examination ordinance", who: "Your university", where: "University website", note: "The authority on grading, conversion, attendance, condonation and revaluation." },
    { title: "Research on effective learning techniques", who: "Dunlosky and colleagues, Psychological Science in the Public Interest, 2013", where: "journals.sagepub.com", note: "A widely cited review finding practice testing and distributed practice most effective." },
  ],
};
