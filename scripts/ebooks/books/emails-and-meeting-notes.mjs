// Practice material for "Emails and Meeting Notes".
// Example messages are original. Names, companies and dates are illustrations.

const mail = (lines) => lines.join("\n");

const book = {
  checked: "October 2026",
  welcome:
    "This book is about writing messages that get read and acted on: emails that ask for one clear thing, replies that close loops, status updates that respect the reader, and meeting notes that turn talk into decisions and actions with owners and dates. It is full of before-and-after examples you can adapt. None of it needs fine writing; it needs clear thinking about what the reader must know and do.",

  chapters: [
    {
      title: "The reader's three questions",
      paragraphs: [
        "Every reader of a work message asks three things in the first few seconds: what is this about, what do you need from me, and by when. A message that answers all three in its subject and first two lines will usually get a fast, useful reply. One that answers them in the fifth paragraph often gets none.",
      ],
      sections: [
        {
          heading: "Put the ask first",
          paragraphs: [
            "Start with the request or the main point, then give the context needed to act on it. Background that comes first makes the reader hunt for the point. Background that comes second helps them act on it.",
          ],
          codes: [
            {
              caption: "Before: the ask is buried.",
              code: mail([
                "Subject: Update",
                "",
                "Hi Rohan,",
                "As you know, we've been working on the Q3 vendor review for the past few",
                "weeks, and there have been several discussions with procurement about the",
                "approach. After the last call, it seemed like the best next step would be",
                "to get sign-off on the shortlist, which is attached. Let me know.",
              ]),
            },
            {
              caption: "After: subject and first line carry the ask and the date.",
              code: mail([
                "Subject: Approve vendor shortlist by Thursday?",
                "",
                "Hi Rohan,",
                "Could you approve the attached shortlist of three vendors by Thursday?",
                "Procurement needs it to start contract talks on Monday.",
                "",
                "The shortlist follows the criteria we agreed on 12 Oct: cost, delivery",
                "time and support hours. Notes on each vendor are in the sheet.",
              ]),
            },
          ],
        },
        {
          heading: "One message, one job",
          paragraphs: [
            "A message that asks for three unrelated things will get a reply to one of them. Split unrelated requests into separate messages with separate subjects, so each can be answered, forwarded and searched on its own.",
          ],
        },
        {
          heading: "Subjects that work",
          bullets: [
            "Say the action and the topic: 'Approve vendor shortlist by Thursday?' rather than 'Update'.",
            "Add a date when there is one.",
            "Use tags your team agrees on, such as [Action], [FYI] or [Decision], sparingly.",
            "Change the subject when a thread changes topic.",
            "Keep it under about 60 characters so it fits on a phone screen.",
          ],
        },
      ],
    },
    {
      title: "Writing short",
      paragraphs: [
        "Short messages are not rude; unclear ones are. Most work emails can be five sentences or fewer. When they cannot, structure helps the reader find what they need.",
      ],
      sections: [
        {
          heading: "Cut, then cut again",
          bullets: [
            "Delete opening throat-clearing such as 'I hope this email finds you well' when the reader is a colleague you write to often.",
            "Replace phrases with words: 'at this point in time' becomes 'now', 'in order to' becomes 'to', 'due to the fact that' becomes 'because'.",
            "Remove words that add nothing: 'just', 'really', 'basically', 'actually' in most uses.",
            "Prefer active verbs: 'We approved the budget' rather than 'The budget was approved by us'.",
            "Turn lists hidden in sentences into bullet points.",
          ],
        },
        {
          heading: "When length is needed",
          paragraphs: [
            "Some messages must be long: a proposal, an incident report, a handover. Give them a summary at the top of three lines or fewer, then headings, then detail. Readers who need only the summary stop there; others read on.",
          ],
        },
        {
          heading: "Word count as a check",
          paragraphs: [
            "The site's word counter shows words, sentences and reading time. A useful rule for routine emails is under 150 words and under a minute of reading. If a draft is much longer, ask whether it should be two messages, a document, or a short call.",
          ],
        },
      ],
    },
    {
      title: "Tone without fuss",
      paragraphs: [
        "Tone is mostly about respect and clarity. Warmth comes from being specific and considerate, not from extra adjectives.",
      ],
      sections: [
        {
          heading: "Polite and direct can go together",
          paragraphs: [
            "'Could you send the figures by 3 pm today?' is polite and direct. 'If it's not too much trouble, whenever you get a chance, it would be great if you could possibly look at the figures' is polite and unclear. The reader cannot tell whether it is urgent.",
          ],
        },
        {
          heading: "Indian workplace conventions",
          paragraphs: [
            "Many Indian workplaces use formal openings with senior people and clients, such as 'Dear Mr Iyer' or 'Dear Ma'am', and first names with peers. 'Kindly' is common and acceptable in Indian business English, though some international readers find it formal. 'Do the needful' and 'revert' meaning 'reply' are widely understood in India but may confuse readers elsewhere; with international readers, prefer 'please take the necessary action' and 'reply'.",
          ],
        },
        {
          heading: "Avoiding accidental sharpness",
          bullets: [
            "Avoid all capitals and multiple exclamation marks.",
            "Replace 'As I said earlier' with a short restatement and a link.",
            "Replace 'Why haven't you...?' with 'Could you let me know where ... stands?'",
            "Read the message once as the recipient on a bad day.",
            "If you are angry, write the draft, wait an hour, and then edit it.",
          ],
        },
      ],
    },
    {
      title: "Replies, follow-ups and closing loops",
      paragraphs: [
        "Much of the work in email is not the first message but the replies. A good reply answers every question asked, in order, and makes clear what happens next.",
      ],
      sections: [
        {
          heading: "Answer inline when there are several questions",
          paragraphs: [
            "If a message has numbered questions, reply with the same numbers. If it has several paragraphs of questions, quote each briefly and answer below it.",
          ],
        },
        {
          heading: "The follow-up that does not nag",
          codes: [
            {
              caption: "A follow-up that restates the ask and makes it easy to answer.",
              code: mail([
                "Subject: Re: Approve vendor shortlist by Thursday?",
                "",
                "Hi Rohan,",
                "Bringing this back up: procurement starts contract talks on Monday and",
                "needs the shortlist approved first. If any of the three vendors is a",
                "concern, I can drop it and send the next one on the list today.",
              ]),
            },
          ],
          paragraphs: [
            "Follow up once after a reasonable time, two working days for routine requests, sooner for urgent ones. Offer an easy path to yes. If two follow-ups get no reply, try another channel: a call, a short meeting, or a message to someone who can decide.",
          ],
        },
        {
          heading: "Closing a loop",
          paragraphs: [
            "When something is done, say so in the same thread: 'Done: contracts signed with Vendor A and B; C declined.' It saves the next person from asking. A thread that ends with 'Thanks!' and no outcome leaves everyone uncertain.",
          ],
        },
        {
          heading: "Out-of-office and handovers",
          paragraphs: [
            "An out-of-office message should say when you are back and who to contact for urgent matters, with their email. Before leave, send a short handover to the person covering: open items, deadlines, and where files are.",
          ],
        },
      ],
    },
    {
      title: "Meetings that produce something",
      paragraphs: [
        "A meeting is worth its time when it ends with decisions made and actions assigned. Notes are how those survive the meeting.",
      ],
      sections: [
        {
          heading: "Before the meeting",
          steps: [
            "Write the purpose in one sentence: 'Decide which two vendors go to contract talks.'",
            "Send an agenda with the decision or input needed for each item.",
            "Attach or link material people should read, and say how long it takes to read.",
            "Invite only people who are needed to decide or contribute; send notes to others.",
          ],
        },
        {
          heading: "During the meeting",
          paragraphs: [
            "Name a note-taker at the start. Capture three kinds of thing: decisions, actions with owner and date, and open questions. Most of the discussion does not need to be recorded.",
          ],
        },
        {
          heading: "After the meeting",
          paragraphs: [
            "Send notes within a day, while memories are fresh. Put decisions and actions at the top. Ask people to correct anything wrong by a set time; silence then means agreement.",
          ],
          codes: [
            {
              caption: "Notes that can be acted on.",
              code: mail([
                "Subject: Notes: Vendor review, 14 Oct",
                "",
                "Decisions",
                "- Vendors A and B go to contract talks. C dropped (support hours).",
                "",
                "Actions",
                "- Anita: send contract templates to A and B. Fri 16 Oct.",
                "- Rohan: confirm budget ceiling with finance. Wed 15 Oct.",
                "- Vikram: check B's references. Tue 20 Oct.",
                "",
                "Open questions",
                "- Do we need a security review before signing? (Rohan to ask IT)",
                "",
                "Attendees: Anita, Rohan, Vikram, Sara",
              ]),
            },
          ],
        },
        {
          heading: "Using the site's notes organiser",
          paragraphs: [
            "The meeting notes organiser turns rough notes into this shape automatically. Lines containing words such as will, to do, action, or an @name become action items; lines with decided or agreed become decisions; lines ending in a question mark become open questions. It also picks out owners and dates when written plainly, such as '@Anita send templates by Friday'. Check the result before sending; it is a starting point, not a minute-taker.",
          ],
        },
      ],
    },
    {
      title: "Messages people find hard to write",
      paragraphs: [
        "Some messages are hard because of what they say, not how. A few patterns make them easier.",
      ],
      sections: [
        {
          heading: "Bad news",
          paragraphs: [
            "Put the news in the first line, then the reason in one or two sentences, then what happens next. Do not bury it under apologies or background. Readers prefer knowing early.",
          ],
          codes: [
            {
              code: mail([
                "Subject: Launch moves to 4 November",
                "",
                "Hi team,",
                "The launch moves from 28 October to 4 November. Payment testing found an",
                "error in refunds that we will not have fixed and retested by the 28th.",
                "",
                "What changes: the press note goes out on the 3rd; social posts move a week.",
                "What stays: the feature list and pricing.",
                "I'll confirm the fix on Friday.",
              ]),
            },
          ],
        },
        {
          heading: "Saying no",
          paragraphs: [
            "Say no clearly, give a short reason, and offer what you can do instead if anything. 'I can't take on the report this week because the audit is due Friday. I could start it Monday, or Priya may have time now.'",
          ],
        },
        {
          heading: "Asking for help or time",
          paragraphs: [
            "Be specific about what you need, how long it takes, and why the person is the right one. 'Could you spare 20 minutes this week to review my slides for the client meeting? You've presented to them before.'",
          ],
        },
        {
          heading: "After a mistake",
          paragraphs: [
            "Say what happened, what you have done about it, and what you will change, without excessive apology or blame. 'I sent last month's figures to the client by mistake. I've sent the correct file with an apology and checked that nothing else went out. From now on I'll attach files from the shared folder rather than my downloads.'",
          ],
        },
      ],
    },
    {
      title: "Chat, email or meeting?",
      paragraphs: [
        "Choosing the right channel saves everyone time.",
      ],
      sections: [
        {
          table: {
            caption: "A rough guide. Your team's habits matter too.",
            headers: ["Situation", "Best channel"],
            widths: [3, 1.5],
            rows: [
              ["Quick question with a short answer", "Chat"],
              ["Request that needs a record or approval", "Email"],
              ["Information for several people to keep", "Email or shared document"],
              ["Disagreement or sensitive feedback", "Call or meeting, then a short written summary"],
              ["Decision needing discussion among several people", "Meeting with notes"],
              ["Urgent problem", "Call or chat, then email to record"],
              ["Status updates", "Written update on a regular day"],
            ],
          },
        },
        {
          heading: "Chat etiquette",
          bullets: [
            "Say the whole question in one message; avoid sending 'Hi' and waiting.",
            "Use threads to keep conversations together.",
            "Do not expect instant replies outside working hours.",
            "Move to a call after three back-and-forths on the same point.",
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Eighteen working situations, each with a message or set of notes that went wrong and how it was fixed.",

  scenarios: [
    {
      title: "A request that never got an answer",
      paragraphs: [
        "Anita, a project coordinator in Pune, sent her manager an email titled 'Update' with four paragraphs about a vendor review. The last sentence asked for approval of a shortlist. A week later there was no reply, and procurement was waiting.",
        "She rewrote it with the subject 'Approve vendor shortlist by Thursday?' and put the request and the reason in the first two lines. Her manager approved it within an hour, from his phone, between meetings.",
        "Her manager later said he had seen the first email, read the first paragraph, assumed it was background, and meant to come back to it. That is the normal fate of buried requests. Anita now writes the subject last, after she knows exactly what she is asking.",
      ],
      lesson: "Put the ask and the deadline in the subject and the first line. Readers decide in seconds.",
    },
    {
      title: "Three questions, one answer",
      paragraphs: [
        "Vikram in Bengaluru asked a client three things in one email: whether they had approved the design, when they could share content, and whether the launch date could move. The client replied, 'Approved, thanks!'",
        "He had to chase the other two answers separately, losing two days. Next time, he numbered the questions and asked the client to reply to each, or split them into separate messages if they involved different people.",
        "The client's marketing lead later told him that numbered questions were easy to forward to the right person in her team: content to the writer, date to the manager. Long paragraphs had to be retyped.",
      ],
      lesson: "Number multiple questions, or split unrelated ones into separate emails.",
    },
    {
      title: "Meeting notes nobody read",
      paragraphs: [
        "Sara in Chennai kept detailed notes of a weekly product meeting: two pages summarising every discussion. Actions kept slipping because no one could find them.",
        "She changed the format: decisions first, then actions with an owner and date on each line, then open questions, then a link to the full discussion notes for anyone who wanted them. She sent the notes within an hour of the meeting.",
        "Within a month, the team started each meeting by reviewing last week's action list, which took five minutes and caught most slips. The two-page summaries stopped, and no one missed them.",
      ],
      lesson: "Notes are for action. Decisions and actions with owners and dates go first.",
    },
    {
      title: "Bad news buried in paragraph four",
      paragraphs: [
        "Rahul, leading an app project in Hyderabad, needed to tell a client the launch would slip by a week. His draft opened with three paragraphs of progress updates and mentioned the delay near the end.",
        "A senior colleague suggested putting the delay in the subject and first line, with the reason and what would and would not change. The client replied appreciating the clarity and asked one question about the press release.",
        "Rahul noted that the client was not upset by the delay itself, which had a clear reason, but would likely have been by discovering it late in a long email.",
      ],
      lesson: "Deliver bad news first, with a reason and what changes. Burying it erodes trust.",
    },
    {
      title: "A follow-up that sounded like a complaint",
      paragraphs: [
        "Priya in Delhi sent a supplier a follow-up: 'As mentioned in my previous three emails, we STILL have not received the invoice.' The supplier's reply was defensive and slow.",
        "Her manager suggested a different approach: restate the need, explain the consequence, and make it easy to act. 'Could you send the invoice for PO 4417 today? Without it our finance team can't release payment in this cycle, which closes Friday.'",
        "The invoice came the same afternoon. Priya kept the factual consequence, which is what actually motivates action, and dropped the frustration, which only made the reader defensive.",
      ],
      lesson: "Follow-ups work by restating the need and the consequence, not by expressing frustration.",
    },
    {
      title: "Chat thread chaos",
      paragraphs: [
        "A team in Noida used a single chat group for everything. Important decisions were buried among greetings, jokes and links, and new members could not find what had been agreed.",
        "They created separate channels for projects, used threads for discussions, and agreed that any decision made in chat would be summarised in one pinned message or in an email to the project list.",
        "The rule that helped most was simple: when a chat discussion ends in a decision, the person who proposed it posts a one-line summary starting with 'Decided:'. Searching for that word now finds every decision.",
      ],
      lesson: "Use channels and threads, and write decisions down in a findable place.",
    },
    {
      title: "Saying no to extra work",
      paragraphs: [
        "Meera in Mumbai was asked by a senior from another team to prepare a report this week, while she was finishing an audit due Friday.",
        "Instead of agreeing and missing both deadlines, she wrote: 'I can't take this on before Friday because of the audit. I could start Monday and finish by Wednesday, or Arjun may have time now. Which would work better?'",
        "The senior chose Monday. Meera's manager, copied on the reply, appreciated that she had protected the audit and offered alternatives rather than a flat refusal.",
      ],
      lesson: "Say no clearly with a reason and offer an alternative.",
    },
    {
      title: "An email to a senior leader",
      paragraphs: [
        "Karthik, a junior analyst in Chennai, needed approval from the head of finance for an exception. His draft was long and apologetic.",
        "He rewrote it in five sentences: the request, the amount, the reason it was needed, the risk of not approving, and the deadline. He attached the supporting sheet and offered a five-minute call if needed.",
        "The head of finance approved it the same day and later told Karthik's manager that the email was 'exactly what I need': she could decide without opening the attachment, and the attachment was there if she wanted it.",
      ],
      lesson: "Busy senior readers want the decision, the reason and the risk in a few lines, with detail attached.",
    },
    {
      title: "Leave request",
      paragraphs: [
        "Fatima in Lucknow needed three days of leave for a family function. Her first draft explained the function in detail before mentioning dates.",
        "The final version: 'I'd like to take leave on 6, 7 and 8 November for a family function. My tasks for those days are covered: Rohit will handle client calls, and the weekly report will go out on the 5th. I'll be reachable by phone for anything urgent.'",
        "Her manager approved it in a minute. The handover details mattered most, because they answered the manager's real question: will anything break while you are away?",
      ],
      lesson: "Leave requests should state dates and cover arrangements first; detail about the reason is optional.",
    },
    {
      title: "Status update that respected the reader",
      paragraphs: [
        "Sameer in Gurugram sent weekly status updates as long narratives. His manager admitted she skimmed them.",
        "He switched to a fixed format: one line on overall status (on track, at risk or blocked), three bullets on what was done, three on what is next, and any decisions or help needed at the top if relevant.",
        "His manager now reads every update, and once replied within minutes to a 'Help needed' item that had sat unnoticed in a paragraph the previous month.",
      ],
      lesson: "A fixed status format with the status and any help needed at the top gets read.",
    },
    {
      title: "Reply-all that should not have been",
      paragraphs: [
        "A message to a 200-person company list about a fire drill led to a chain of 'Please remove me' and 'Stop replying all' replies.",
        "The office administrator sent one short message asking everyone to stop replying, and set the next announcement to come from an address that did not accept replies, with a separate contact for questions.",
        "Staff were reminded that reply-all is for when every recipient needs your reply. Most of the time, replying only to the sender is right.",
      ],
      lesson: "Use reply-all only when every recipient needs your reply. Announcements should not invite replies to everyone.",
    },
    {
      title: "A meeting that should have been an email",
      paragraphs: [
        "A weekly hour-long meeting in a Pune office consisted mostly of people reading their updates aloud. Few decisions were made.",
        "The team lead replaced it with written updates posted by Monday noon and a 25-minute meeting on Tuesday only for items marked 'needs discussion'. Some weeks the meeting was cancelled because nothing needed discussing.",
        "The team regained about three hours each per month, and the discussions that remained were sharper because people came having read the updates.",
      ],
      lesson: "Use meetings for discussion and decisions. Share updates in writing.",
    },
    {
      title: "Notes from a client call",
      paragraphs: [
        "Deepa in Kochi took notes during a client call about a website redesign. Her raw notes were a list of fragments.",
        "She pasted them into the site's meeting notes organiser, which separated actions with owners ('@Deepa share wireframes Fri'), decisions ('agreed to keep current logo') and questions ('budget for photos?'). She checked and edited the output and sent it to the client within the hour.",
        "The client replied with one correction and confirmed the rest. The written notes later settled a disagreement about whether the logo was in scope.",
      ],
      lesson: "Written notes sent soon after a call become the shared record. Ask for corrections by a set time.",
    },
    {
      title: "Writing to a government office",
      paragraphs: [
        "Mr Rao in Visakhapatnam needed a correction in his property tax record. His earlier letters had been long and emotional.",
        "His daughter helped him write a short letter: a subject line with his assessment number, one paragraph stating the error and the correction requested, a list of enclosed documents, and his contact details.",
        "The office replied within two weeks asking for one more document. The clear structure, she said, made it easy for the clerk to route the letter to the right desk.",
      ],
      lesson: "Formal letters to offices work best with an identifying subject, a clear request and a list of enclosures.",
    },
    {
      title: "A cold email to a potential client",
      paragraphs: [
        "Nikhil, a freelance designer in Jaipur, sent long introductory emails to potential clients describing his background. Few replied.",
        "He changed to a short message: one line on a specific problem he had noticed on their website, one line on how he had solved a similar problem for another client with a result, and a low-effort ask: 'Would a 15-minute call next week be useful?'",
        "His reply rate rose noticeably. The specific observation showed he had looked at their business, which mattered more than his background.",
      ],
      lesson: "Cold emails should be short, specific to the reader, and end with a small ask.",
    },
    {
      title: "Feedback by email",
      paragraphs: [
        "Ananya, a team lead in Bengaluru, needed to give a colleague feedback on a report with several errors. She was tempted to list every mistake in an email.",
        "She called him instead, discussed the main issues, and then sent a short email summarising the two changes agreed and the date for the revised report.",
        "The conversation let her hear his side: he had been working from an outdated template. The email recorded what they agreed without the tone problems a long critique might have caused.",
      ],
      lesson: "Give difficult feedback in conversation, then confirm agreements in writing.",
    },
    {
      title: "An email in Hindi and English",
      paragraphs: [
        "Suresh, a site supervisor in Indore, wrote to contractors in a mix of Hindi and English, as they spoke. Some messages were misread, especially numbers and dates.",
        "He kept the friendly mixed language for greetings and context, but wrote quantities, dates, deadlines and amounts in a short list in a consistent format, such as '20 bags cement, by 14 Oct'.",
        "Misunderstandings dropped. He found that the language mattered less than writing the key facts in a form that could not be misread.",
      ],
      lesson: "Whatever the language, write numbers, dates and quantities in a consistent, unambiguous list.",
    },
    {
      title: "A handover before leave",
      paragraphs: [
        "Lakshmi in Coimbatore was going on two weeks of leave. Her first handover was a ten-minute verbal briefing to a colleague, who forgot half of it by the second day.",
        "Before her next leave, she wrote a one-page handover: open items with status and next step, deadlines in the period, contacts for each client, and where files were. She walked her colleague through it and left it in the shared folder.",
        "She returned to find nothing had slipped, and her colleague said the document was more useful than any conversation.",
      ],
      lesson: "Write handovers down: open items, deadlines, contacts and file locations.",
    },
  ],

  problemIntro: "Each problem gives a message or notes. Rewrite them before reading the worked version. There is no single right answer; the working shows one good version and why.",

  problems: [
    {
      title: "A vague subject",
      q: ["Rewrite this subject: 'Regarding the thing we discussed'. The email asks the reader to confirm the training venue by Wednesday."],
      steps: ["Name the action, the topic and the date."],
      answer: "'Confirm training venue by Wednesday?'",
    },
    {
      title: "Ask first",
      q: ["Reorder: 'We've had a lot of requests for the new report format. Several teams have tried it. Feedback has been positive. Can you approve rolling it out to all teams from next month?'"],
      steps: ["Lead with the request; follow with supporting facts."],
      answer: "'Could you approve rolling out the new report format to all teams from next month? Several teams have tried it and feedback has been positive.'",
    },
    {
      title: "Wordy phrases",
      q: ["Shorten: 'At this point in time, due to the fact that the budget has not yet been finalised, we are not in a position to proceed with the hiring.'"],
      steps: ["'At this point in time' → 'now'; 'due to the fact that' → 'because'; 'not in a position to proceed with' → 'can't start'."],
      answer: "'We can't start hiring because the budget isn't final yet.'",
    },
    {
      title: "Passive to active",
      q: ["Rewrite actively: 'It was decided that the deadline would be extended by the committee.'"],
      steps: ["Find who acted: the committee."],
      answer: "'The committee extended the deadline.'",
    },
    {
      title: "Hidden list",
      q: ["Turn into bullets: 'For the event we need chairs for 50 people, a projector, two microphones, a registration desk and lunch for 55.'"],
      steps: ["One item per bullet."],
      answer: "Chairs for 50; projector; two microphones; registration desk; lunch for 55.",
    },
    {
      title: "Polite but unclear",
      q: ["Rewrite: 'Whenever you get a chance, if it's not too much trouble, it would be great if you could maybe look at the draft.' The draft is needed by Friday noon."],
      steps: ["Keep politeness, add clarity and time."],
      answer: "'Could you review the draft by Friday noon? I need to send it to the client that afternoon.'",
    },
    {
      title: "Sharp follow-up",
      q: ["Soften without weakening: 'I've asked for this three times. Why is it still not done?'"],
      steps: ["Restate the need and consequence; ask for status; offer help."],
      answer: "'Could you let me know where the report stands? I need it by Thursday to include in the board pack. If something is blocking it, I can help.'",
    },
    {
      title: "Notes to actions",
      q: ["Raw notes: 'Logo stays. Anita to send wireframes Friday. Do we need photos? Budget TBD. Rohan will check with finance.' Organise them."],
      steps: ["Decisions: logo stays.", "Actions: Anita, wireframes, Friday; Rohan, check budget with finance.", "Open questions: photos needed? budget?"],
      answer: "Decisions: Logo stays. Actions: Anita sends wireframes Fri; Rohan checks budget with finance. Open: Are photos needed? What is the budget?",
    },
    {
      title: "Action without an owner",
      q: ["Improve: 'Someone needs to update the price list.'"],
      steps: ["Assign a person and a date."],
      answer: "'Priya: update the price list by Wednesday 21 Oct.'",
    },
    {
      title: "Bad news first",
      q: ["Rewrite the opening of an email whose fourth paragraph says the shipment will be ten days late because of a port strike."],
      steps: ["Subject and first line carry the news; then reason; then what changes."],
      answer: "Subject: 'Shipment delayed ten days (port strike)'. First line: 'Your shipment will arrive about ten days late, around 24 October, because of a strike at the port.'",
    },
    {
      title: "Saying no",
      q: ["Write a two-sentence reply declining to join a weekend workshop, offering an alternative."],
      steps: ["Decline clearly; give reason; offer alternative."],
      answer: "'I can't attend the workshop this Saturday because of a family commitment. Could you share the slides, or I could join the next session?'",
    },
    {
      title: "Status format",
      q: ["Turn this into a status update: 'This week I finished the data cleaning and started the analysis. I'm waiting for sales data from Ravi. Next week I'll finish the analysis if the data comes.'"],
      steps: ["Status, done, next, help needed."],
      answer: "Status: At risk. Done: data cleaning; analysis started. Next: finish analysis. Help needed: sales data from Ravi by Monday.",
    },
    {
      title: "International reader",
      q: ["Rewrite for a client in Germany: 'Kindly revert at the earliest and do the needful.'"],
      steps: ["Replace Indian English idioms with widely understood terms; add a date."],
      answer: "'Please reply by Thursday with your decision, and let me know if you need anything from us.'",
    },
    {
      title: "Too long",
      q: ["An email asking for approval runs to 400 words. What three changes would you make first?"],
      steps: ["Summary of the ask at the top; move detail to an attachment or bullets; cut background the reader already knows."],
      answer: "Put the request and deadline first, move supporting detail into bullets or an attachment, and delete background the reader knows.",
    },
    {
      title: "Meeting purpose",
      q: ["Rewrite as a one-sentence purpose: 'Discussion on Q4 marketing.'"],
      steps: ["State the decision or output wanted."],
      answer: "'Decide the Q4 marketing budget split between digital and events.'",
    },
    {
      title: "Agenda",
      q: ["Draft a three-item agenda for a 30-minute meeting to choose a venue for a team offsite."],
      steps: ["Each item says what is needed."],
      answer: "1. Review three shortlisted venues (5 min, read notes before). 2. Decide venue and dates (15 min). 3. Assign bookings and communication (10 min).",
    },
    {
      title: "Reply-all decision",
      q: ["A manager emails 12 people asking who can attend Friday's training. Should you reply all?"],
      steps: ["Does everyone need your answer?"],
      answer: "No; reply to the manager only.",
    },
    {
      title: "Closing the loop",
      q: ["A thread ends with 'Thanks, will do!' a week ago. The task is now done. What do you write?"],
      steps: ["State completion and any result in the same thread."],
      answer: "'Done: the updated price list is live on the site as of today. Link here.'",
    },
    {
      title: "Leave handover",
      q: ["List four things a handover note should contain."],
      steps: ["Think what the cover person needs on day one."],
      answer: "Open items with status and next step; deadlines during the leave; contacts for each client or task; where files and passwords are kept.",
    },
    {
      title: "Cold email ask",
      q: ["Improve the ending of a cold email: 'Please let me know if you'd like to work together on any projects in the future.'"],
      steps: ["Make the ask specific and small."],
      answer: "'Would a 15-minute call next Tuesday or Wednesday be useful to see if this fits?'",
    },
    {
      title: "Apology after a mistake",
      q: ["Draft a three-sentence message after sending a client the wrong file."],
      steps: ["What happened; what you did; what changes."],
      answer: "'I sent you last month's figures by mistake earlier today. The correct file is attached; please delete the earlier one. I've changed how I attach files so this doesn't happen again.'",
    },
    {
      title: "Chat to email",
      q: ["A 20-message chat thread reached a decision about the launch date. What should happen next?"],
      steps: ["Record the decision where it can be found."],
      answer: "Post a one-line 'Decided:' summary in the thread and send it to the project email list or add it to the project document.",
    },
    {
      title: "Formal letter subject",
      q: ["Write a subject line for a letter to a municipal office asking to correct a name in property tax records, assessment number PT/2023/4418."],
      steps: ["Identify the record and the request."],
      answer: "'Request to correct owner's name: assessment no. PT/2023/4418'.",
    },
    {
      title: "Word count check",
      q: ["A routine email is 260 words and takes about a minute and a half to read. What does that suggest?"],
      steps: ["Routine emails are usually under 150 words."],
      answer: "It may contain two messages, unnecessary background, or detail that belongs in an attachment. Cut or split.",
    },
    {
      title: "Numbers in mixed language",
      q: ["Rewrite clearly: 'Bhai kal tak 20-25 bags bhej dena, aur woh payment wala bhi dekh lena.'"],
      steps: ["Keep friendly tone; state quantities, dates and actions unambiguously."],
      answer: "'Bhai, please send 25 bags of cement by tomorrow, 15 Oct. Also please confirm the payment of Rs. 18,500 for the last order.'",
    },
  ],

  exercises: {
    warmup: [
      { q: "What three questions does every reader of a work message ask?", a: "What is this about, what do you need from me, and by when." },
      { q: "Rewrite 'in order to' in one word.", a: "'To'." },
      { q: "What three things should meeting notes record?", a: "Decisions, actions with owners and dates, and open questions." },
      { q: "When should you use reply-all?", a: "Only when every recipient needs your reply." },
      { q: "Where should bad news go in a message?", a: "In the subject and first line." },
      { q: "What should an out-of-office message include?", a: "When you are back and who to contact for urgent matters." },
    ],
    practice: [
      { q: "Write a subject for an email asking a colleague to share the client contract by Monday.", a: "'Share client contract by Monday?'" },
      { q: "Shorten: 'I am writing this email to inform you that the meeting has been rescheduled.'", a: "'The meeting has moved to [new time].'" },
      { q: "Turn 'We should probably look at the pricing at some point' into an action.", a: "'Ravi: review pricing options and share by Thursday 22 Oct.'" },
      { q: "Write a polite, direct request for a reply by a deadline.", a: "'Could you reply by 4 pm tomorrow? I need your input before the client call.'" },
      { q: "Write a one-line status for a project that is blocked on legal review.", a: "'Status: Blocked: waiting for legal review of the contract (requested 10 Oct).'" },
      { q: "Rewrite 'Pls do the needful asap' for a client abroad.", a: "'Please take the necessary steps by Wednesday, and let me know if you need anything from us.'" },
    ],
    stretch: [
      { q: "Write notes from these fragments: 'pricing agreed 499. @Meena landing page by 20th. need legal ok? Arjun ads budget tbd will ask CFO'.", a: "Decisions: price set at Rs. 499. Actions: Meena, landing page, by 20 Oct; Arjun, ask CFO for ads budget. Open: Is legal approval needed? What is the ads budget?" },
      { q: "Write a three-paragraph email telling a client a deliverable will be late, with reason and what changes.", a: "First line: the new date. Second: the reason in one or two sentences. Third: what changes and what stays the same, and when you will next update them." },
      { q: "Decline a meeting invitation where you have nothing to contribute, offering an alternative.", a: "'I don't think I'm needed for this one, as the agenda is about the vendor contract. Could you send me the notes? I'm happy to review anything that affects the integration.'" },
      { q: "Write a handover note for one week of leave covering two clients.", a: "A short document listing each client's open items with status and next step, deadlines in the week, contacts, file locations, and how to reach you for emergencies." },
      { q: "Turn a narrative status update into a fixed format of four parts.", a: "Status line; done this week; next week; decisions or help needed." },
    ],
    challenge: [
      { q: "Design a meeting policy for a ten-person team that meets too often.", a: "Every meeting needs a one-sentence purpose and an agenda; updates go in writing; default length 25 minutes; notes with decisions and actions sent within a day; anyone may decline a meeting without an agenda; review recurring meetings monthly." },
      { q: "Rewrite an angry draft complaint to a vendor into a firm, effective email.", a: "State the problem factually with dates and reference numbers, the impact on your business, what you need and by when, and what you will do if it is not resolved. Remove accusations and capitals." },
      { q: "Write guidelines for using chat versus email in a small company.", a: "Chat for quick questions and coordination; email for requests needing records, approvals and external communication; decisions in chat summarised with 'Decided:'; urgent issues by call, then recorded; no expectation of replies outside working hours." },
      { q: "Explain why a meeting note-taker should not record every discussion.", a: "Long notes bury decisions and actions; readers skip them. Recording outcomes and owners makes notes useful; detailed discussion can be linked separately if needed." },
      { q: "Draft a cold email to a potential client in under 100 words.", a: "One line showing you understand a specific problem they have; one line on a relevant result for a similar client; a small, specific ask such as a 15-minute call; your name and a link to work samples." },
    ],
  },

  faqs: [
    {
      group: "Writing emails",
      items: [
        ["How long should a work email be?", "As short as it can be while still clear. Many routine emails need five sentences or fewer. Long messages should start with a short summary."],
        ["Should I start with 'I hope this email finds you well'?", "With people you write to often, it is unnecessary. With new contacts or formal letters, a brief friendly opening is fine, but get to the point in the next sentence."],
        ["How do I write a good subject line?", "State the action and the topic, add a date if there is one, and keep it short enough to read on a phone."],
        ["Is it rude to be direct?", "Not when it is polite. A clear request with a reason and a time respects the reader's time more than a vague one."],
        ["Should I use bullet points in emails?", "Yes, for lists of items, steps or questions. Keep full sentences for explanations and requests."],
        ["How formal should I be?", "Match the relationship and the organisation. With clients and senior people, start formally until they switch to first names."],
        ["Is 'kindly' acceptable?", "In Indian business English it is common and polite. Some international readers find it formal; 'please' works everywhere."],
        ["What does 'revert' mean in Indian emails?", "It is widely used to mean 'reply'. Readers outside India may understand it as 'go back to a previous state'; use 'reply' with them."],
        ["When should I use CC and BCC?", "CC people who need to know but not act. Use BCC for large lists to protect addresses, or to move someone out of a thread politely with a note."],
      ],
    },
    {
      group: "Replies and follow-ups",
      items: [
        ["How soon should I reply to an email?", "Within one working day for most work emails, even if only to say when you will answer fully. Urgent matters sooner."],
        ["How long should I wait before following up?", "About two working days for routine requests, sooner if the deadline is close. Restate the need and make it easy to answer."],
        ["What if someone never replies?", "Follow up once or twice, then try another channel such as a call, or ask someone else who can decide."],
        ["Should I reply 'Thanks' to every email?", "Not always. A thank-you is kind when someone did something for you; unnecessary replies add to everyone's inbox."],
        ["How do I answer an email with many questions?", "Number your answers to match the questions, or quote each briefly and answer below."],
        ["How do I end a thread?", "With the outcome: what was done or decided, and any next step. 'Done' with a link is a good ending."],
      ],
    },
    {
      group: "Meetings and notes",
      items: [
        ["Who should take notes?", "Name someone at the start of each meeting. Rotating the role spreads the work and gets everyone used to writing outcomes."],
        ["What should meeting notes include?", "Decisions, actions with owner and date, open questions, and attendees. Discussion detail is optional."],
        ["When should notes be sent?", "Within a day, ideally within an hour, while everyone remembers. Ask for corrections by a set time."],
        ["How do I run a shorter meeting?", "Write a one-sentence purpose, send an agenda with time per item, share updates in writing beforehand, and end with a recap of decisions and actions."],
        ["Should every meeting have an agenda?", "Yes, even a short one. People can then decide whether to attend and how to prepare."],
        ["How does the site's meeting notes organiser work?", "It reads your rough notes and sorts lines into actions, decisions and open questions using simple cues: words like will, action or an @name for actions, decided or agreed for decisions, and question marks for questions."],
        ["What makes an action item good?", "An owner, a clear verb, and a date. 'Anita: send templates by Fri 16 Oct' is good; 'templates to be sent' is not."],
      ],
    },
    {
      group: "Difficult messages",
      items: [
        ["How do I deliver bad news by email?", "Put the news first, give a brief reason, explain what changes and what does not, and say when you will update next."],
        ["How do I say no without damaging the relationship?", "Say no clearly, give a short reason, and offer an alternative where possible."],
        ["Should I give critical feedback by email?", "Prefer a conversation for anything sensitive, then confirm what was agreed in a short email."],
        ["How do I apologise for a mistake at work?", "State what happened, what you have done to fix it, and what you will change, without excessive apology or blame."],
        ["How do I write when I'm angry?", "Write the draft if it helps, but wait before sending. Then remove accusations, keep facts and consequences, and ask for what you need."],
        ["How do I ask a senior person for help?", "Be specific about what you need, how long it will take, and why they are the right person. Make it easy to say yes or suggest someone else."],
      ],
    },
    {
      group: "Channels and habits",
      items: [
        ["When should I use chat instead of email?", "For quick questions and coordination. Use email for requests that need a record, approvals and external communication."],
        ["Is it rude to message 'Hi' and wait?", "It makes the other person wait twice. Write the greeting and the full question in one message."],
        ["How do I manage a full inbox?", "Check at set times, act on short items immediately, file or archive what is done, and flag only what needs action."],
        ["Should I reply outside working hours?", "Follow your team's norms. Scheduling messages to send in working hours respects others' time."],
        ["How do I write to people in another time zone?", "Give times with the time zone, such as 3 pm IST, and allow a full working day for replies."],
        ["Can I use AI tools to draft emails?", "They can help with drafts and tone, but check facts, names and numbers, and make sure the message says what you mean. Do not paste confidential information into tools your organisation has not approved."],
      ],
    },
  ],

  glossary: [
    ["Action item", "A task from a meeting with an owner and a due date."],
    ["Agenda", "A list of items for a meeting, with the decision or input needed for each."],
    ["BCC", "Blind carbon copy: recipients hidden from others."],
    ["CC", "Carbon copy: recipients who need to know but not act."],
    ["Closing the loop", "Telling people when an item is done or decided."],
    ["Cold email", "A first message to someone you have not dealt with before."],
    ["Decision log", "A record of decisions with dates and owners."],
    ["Escalation", "Raising an unresolved issue to someone with more authority."],
    ["Follow-up", "A message checking on a request that has not been answered."],
    ["FYI", "For your information: no action required."],
    ["Handover", "A note passing open work to someone covering for you."],
    ["Inline reply", "Answering questions within the quoted text of the original message."],
    ["Minutes", "A formal record of a meeting, often required for committees and boards."],
    ["Open question", "An unresolved issue noted in a meeting for follow-up."],
    ["Out-of-office", "An automatic reply while you are away."],
    ["Purpose statement", "One sentence saying what a meeting must achieve."],
    ["Reply-all", "Replying to every recipient of a message."],
    ["Status update", "A regular report on progress, next steps and help needed."],
    ["Subject line", "The short title of an email that tells the reader what it is about."],
    ["Thread", "A chain of messages on one topic."],
    ["Tone", "The attitude a message conveys through its words."],
    ["Read receipt", "A notification that a message was opened, often unreliable."],
    ["Signature", "The block at the end of an email with name, role and contact details."],
    ["Template", "A reusable message structure for common situations."],
    ["Word count", "The number of words in a text, useful as a length check."],
  ],

  references: [
    { title: "Plain Language guidelines", who: "plainlanguage.gov (US federal government)", where: "plainlanguage.gov", note: "Practical, evidence-based guidance on writing for readers, including putting the main point first." },
    { title: "Style guide for government content", who: "UK Government Digital Service", where: "gov.uk/guidance/style-guide", note: "Clear guidance on short sentences, active voice and plain words." },
    { title: "Writing for the web: how users read", who: "Nielsen Norman Group", where: "nngroup.com", note: "Research on scanning and front-loading content, relevant to emails and updates." },
    { title: "Meeting effectiveness research", who: "Steven G. Rogelberg, The Surprising Science of Meetings, 2019", where: "Oxford University Press", note: "Evidence on meeting length, agendas and participation." },
    { title: "Indian English usage", who: "Oxford English Dictionary and Oxford Learner's Dictionaries", where: "oed.com and oxfordlearnersdictionaries.com", note: "Notes on Indian English terms such as 'revert' and 'prepone' and how they are understood elsewhere." },
    { title: "Email etiquette and security guidance", who: "CERT-In", where: "cert-in.org.in", note: "Advice on recognising phishing and handling attachments safely." },
    { title: "Email writer, meeting notes organiser and word counter", who: "FreeToolsPro", where: "freetoolspro.in/writing-tools", note: "Tools that apply the patterns in this book." },
  ],
};

// ---------------------------------------------------------------------------
// Second pass: longer situations, fuller answers and the chapters on
// templates, checking, security, remote meetings, letters and habits.

const scenarioMore = {
  "A request that never got an answer":
    "The fix took her five minutes. The cost of the first version was a week of waiting and an anxious call from procurement, which is the hidden price of a buried ask: nobody refuses it, it simply never reaches the top of anyone's list.",
  "Three questions, one answer":
    "Vikram also learned to restate each question in the client's terms. 'Can the launch move?' became 'Can we move the launch from 3 to 10 November, which gives you an extra week for content?' A question the reader can answer yes or no, with the consequence spelled out, gets answered faster than an open one.",
  "Meeting notes nobody read":
    "She also stopped writing who said what. Notes such as 'Ravi felt the design was too busy' invited argument; 'Decided: simplify the home page, Ravi to share two options by Thursday' recorded the outcome. The full discussion remained in her own notebook for the rare occasion someone needed it, which in practice was almost never.",
  "Bad news buried in paragraph four":
    "The rewrite was shorter than the original. The three paragraphs of progress went into a bulleted list at the end under 'What is on track', where they reassured the client instead of delaying the news. Rahul now keeps a rule for himself: if a message contains a change of date, money or scope, that change is the first line.",
  "A follow-up that sounded like a complaint":
    "Priya also checked whether the earlier emails had gone to the right person. The second and third had gone to a sales contact who had since left; the accounts team never saw them. A short phone call to confirm the right address would have saved a week, and she now does that after one unanswered follow-up.",
  "Chat thread chaos":
    "They also added a short channel description saying what belonged there and where to post everything else. New joiners were given a two-line guide on their first day. Six months later the main channel was quiet enough that important announcements were noticed again, which had been the original goal.",
  "Saying no to extra work":
    "The phrasing mattered. She did not say she was too busy, which invites a debate about priorities; she named the specific commitment and its date, which is a fact. She also gave the senior a choice rather than a refusal, so the decision stayed with the person who owned the report. Nobody had to escalate anything.",
  "An email to a senior leader":
    "His original draft had opened with two sentences of apology for taking up her time. The final version had none. Karthik's manager explained that senior readers do not need to be thanked for reading an email; they need to be able to decide quickly, and every sentence that does not help them decide is a sentence they must read anyway.",
  "Leave request":
    "Her manager forwarded the message unchanged to the team as the leave notice, because it already contained everything they needed: dates, who was covering what, and how to reach Fatima if something broke. A request written for the decision-maker often doubles as the announcement, if it starts with the facts.",
  "Status update that respected the reader":
    "The fixed format had a second benefit. Because every week looked the same, changes stood out. When the status line moved from 'On track' to 'At risk', his manager noticed immediately and asked what she could do. In the narrative version, the same change had been one adjective in the middle of a paragraph, and she had missed it. Sameer kept a copy of each update in a shared folder, so that by the end of the project there was a complete, readable history of what had happened and when.",
  "Reply-all that should not have been":
    "The administrator also changed the list so that only a few people could post to it. The next fire drill announcement went out from the facilities address with a line at the top: 'Questions? Write to facilities@, not to this list.' There were three questions, all sent to the right place, and no chain of replies at all.",
  "A meeting that should have been an email":
    "Not everyone liked the change at first. Two people said they missed the weekly chance to see everyone. The lead kept a fortnightly 15-minute informal call with no agenda for exactly that purpose, and labelled it as such. Separating the social purpose from the working purpose let each be done properly, and both were shorter than the old meeting.",
  "Notes from a client call":
    "She also learned to type actions in the organiser's format during the call itself: '@Deepa share wireframes Fri' rather than 'wireframes - me - end of week'. Writing actions in that shape as they come up costs nothing in the moment and means the organiser picks them up correctly. Her clean-up time fell from twenty minutes to five.",
  "Writing to a government office":
    "His daughter kept a copy of the letter, the enclosures and the acknowledgement slip from the counter in one folder, and wrote the date and reference number on the folder's cover. When the office asked for the extra document, she replied quoting the original reference number, which meant the clerk could attach it to the existing file instead of starting a new one. Mr Rao's earlier letters had all been treated as fresh requests because none of them quoted a reference.",
  "A cold email to a potential client":
    "He also cut his signature from six lines to three: name, what he does, and one link to his portfolio. He stopped attaching a PDF brochure, because attachments from strangers are often filtered or ignored. One potential client told him later that she had replied because the email was short enough to read on her phone while waiting for a lift.",
  "Feedback by email":
    "The follow-up email was four lines long: the two agreed changes, the date for the revision, and an offer to look at a draft before then. Her colleague replied 'Thanks, that's clear,' and the revised report came in a day early. Had she sent the long list, she suspected she would have received a defensive reply and a slower revision.",
  "An email in Hindi and English":
    "He also stopped using ranges such as '20-25 bags', which contractors read in whichever way suited them, and gave one number. Dates went in as day and month with the month named, '14 Oct', instead of '14/10', which one contractor had read as the tenth of the fourteenth month and laughed off, but another had simply ignored. Small habits removed most disputes about what had been agreed.",
  "A handover before leave":
    "She now keeps the handover document running all year, updating it at the end of each week in two minutes. When leave comes, it needs only a final check rather than an evening of writing. It also proved useful when she was unexpectedly ill for three days: her manager found it in the shared folder and the work carried on without a phone call.",
};
for (const s of book.scenarios) if (scenarioMore[s.title]) s.paragraphs.push(scenarioMore[s.title]);

const faqMore = {
  "How do I write a good subject line?": " Write it last, once you know exactly what the message asks. 'Approve budget by Friday?' beats 'Budget' every time.",
  "Is it rude to be direct?": " Directness that includes a reason and a date reads as considerate; vagueness forces the reader to ask follow-up questions, which costs them more time.",
  "Should I use bullet points in emails?": " Bullets make it easy to reply to each item and to see at a glance how many things are being asked. Avoid more than about seven in one list.",
  "How formal should I be?": " When unsure, start one step more formal than you think necessary and follow the other person's lead. It is easy to relax later and awkward to recover from being too casual.",
  "Is 'kindly' acceptable?": " Use it once per message at most; 'kindly' at the start of every sentence reads as stiff in any variety of English.",
  "How soon should I reply to an email?": " A one-line holding reply, such as 'Got it, I'll come back by Thursday,' is better than silence while you work on the full answer.",
  "How long should I wait before following up?": " If you gave a deadline in the first message, follow up the morning after it passes rather than waiting longer.",
  "What if someone never replies?": " Check that you wrote to the right person; unanswered emails often went to someone who has changed role or left.",
  "Should I reply 'Thanks' to every email?": " When a sender needs to know you received something, such as a file or an approval, a short acknowledgement is useful; otherwise it is optional.",
  "How do I answer an email with many questions?": " Answer in the same order as they were asked, and say clearly if one question needs more time, so the sender knows it was not missed.",
  "How do I end a thread?": " If a decision was reached elsewhere, such as in a call, record it in the thread so anyone searching later finds the outcome.",
  "Who should take notes?": " The chair should not usually take notes as well, because running a discussion and recording it at the same time is hard to do well.",
  "What should meeting notes include?": " Put decisions and actions at the top so readers who stop after five lines still get what they need. Add the date and a link to any documents discussed.",
  "When should notes be sent?": " Notes sent a week later are often wrong and rarely read. If time is short, send decisions and actions first and tidy the rest later.",
  "Should every meeting have an agenda?": " Without one, people cannot prepare and the loudest topic fills the time. A three-line agenda in the invitation is enough for most meetings.",
  "What makes an action item good?": " One owner, not a team; when two names are on an action, each tends to assume the other will do it.",
  "How do I deliver bad news by email?": " For news that seriously affects someone personally, such as a rejection after a long process, a call followed by email is kinder.",
  "How do I say no without damaging the relationship?": " Name the specific commitment that prevents you rather than saying you are busy, and if you can, suggest someone else or a later date. A clear, early no is more respected than a late yes that is not delivered.",
  "Should I give critical feedback by email?": " Written criticism lacks tone of voice and is easy to reread in the worst light. Talk first, listen to the other side, then write down what you agreed.",
  "How do I apologise for a mistake at work?": " One clear apology is enough; repeated apologies shift attention from the fix to your feelings.",
  "How do I write when I'm angry?": " Never put an angry draft in the 'To' field until it is ready; write it in a notes app so it cannot be sent by accident.",
  "When should I use chat instead of email?": " If the answer is likely to be one line and nobody needs to find it later, chat is usually better. If someone will need to find it next month, use email or a shared document.",
  "Is it rude to message 'Hi' and wait?": " The other person sees 'Hi', wonders what you want, and must wait for your next message. Write the greeting and the question together so they can answer straight away.",
  "How do I manage a full inbox?": " Unsubscribe from newsletters you never read, and use filters to move automatic notifications out of the main inbox.",
  "Should I reply outside working hours?": " If you work late, use the scheduled-send feature so colleagues do not feel pressure to reply at night. Urgent matters are better handled by a call anyway.",
  "How do I write to people in another time zone?": " When proposing meeting times, give them in both time zones, such as '4 pm IST / 12:30 pm CEST', to avoid mistakes.",
};
for (const g of book.faqs) g.items = g.items.map(([q, a]) => [q, faqMore[q] ? a + faqMore[q] : a]);

book.faqs.push(
  {
    group: "Templates, tools and checking",
    items: [
      ["Should I use email templates?", "Yes, for messages you send often, such as meeting requests, status updates, leave requests and follow-ups. A template saves time and keeps the structure consistent, but always change the details and read it once before sending so it does not feel copied."],
      ["What should I check before pressing send?", "The recipients, the subject, the ask and deadline in the first lines, any attachment actually attached, names spelled correctly, and numbers and dates checked against the source. Reading the message once from the recipient's point of view catches most problems."],
      ["How do I avoid forgetting attachments?", "Attach the file before writing the message, or turn on the attachment reminder that many email services offer when your text mentions 'attached'. Check the file name too: it should be the final version, not 'draft2'."],
      ["How does the site's email writer help?", "It gives a structure for common types of message, such as requests, follow-ups and apologies, with the ask placed first. You fill in the details and edit the result. It is a starting point; the facts, names and tone are yours to check."],
      ["Is reading time a useful measure?", "Yes, as a rough check. Most readers spend under a minute on a routine work email. If the word counter shows more than a minute, consider whether part of the message belongs in an attachment or a separate email."],
      ["How do I write a good email signature?", "Name, role, organisation, and one or two contact details. Leave out quotes, large images and long legal text unless your organisation requires it. Phone numbers are useful for people who need to reach you urgently."],
      ["Should I use read receipts?", "Rarely. Many people find them intrusive, and many email services do not send them reliably. If you need confirmation, ask for a short reply instead."],
    ],
  },
  {
    group: "Safety and records",
    items: [
      ["How do I spot a phishing email?", "Look for urgency, requests for passwords, OTPs or payments, sender addresses that do not match the organisation, and links whose real address differs from the text. When in doubt, contact the sender through a known channel rather than replying."],
      ["What should I do if I click a suspicious link?", "Do not enter any details. Close the page, tell your IT team or the person who manages your accounts, and change the password of any account you may have entered on the page, from a device you trust."],
      ["Should I send passwords or OTPs by email?", "No. Email can be forwarded, stored and read by others. Use your organisation's password manager or another approved secure channel, and never share an OTP with anyone who asks for it."],
      ["How long should I keep work emails?", "Follow your organisation's retention policy. Emails that record approvals, contracts or decisions may need to be kept for years for legal or audit reasons; many routine messages can be archived or deleted."],
      ["Are meeting notes a legal record?", "Formal minutes of boards and committees often are, and may be required by law or company rules. Ordinary team notes are a useful record and may be read later in a dispute, so keep them factual and avoid personal remarks."],
      ["Is it safe to forward an email thread?", "Read the whole thread first. Earlier messages may include information the new recipient should not see, such as prices, personal details or internal opinions. Forward only what is needed, or summarise."],
    ],
  },
  {
    group: "Remote and hybrid work",
    items: [
      ["How do I run a good video meeting?", "Send the link and agenda in the invitation, start on time, ask people to keep cameras on where practical, and name someone to watch the chat. Summarise decisions and actions before ending."],
      ["How do I include people joining remotely in a hybrid meeting?", "Use a good microphone in the room, invite remote people to speak first on each item, share documents on screen rather than on paper, and put actions in the chat as they are agreed."],
      ["Should meetings be recorded?", "Only with the knowledge of everyone present, and only when there is a reason, such as people who could not attend. A recording is not a substitute for notes; few people watch an hour of recording to find one decision."],
      ["How do I keep remote colleagues informed?", "Write things down in shared places: decisions in a decision log, updates on a regular day, and documents in a shared folder. Remote colleagues miss corridor conversations, so the written record matters more."],
      ["How do AI meeting summaries compare with human notes?", "Automatic transcripts and summaries can save time, but they miss context, mishear names and numbers, and sometimes record decisions that were not made. Treat them as drafts: someone who was in the meeting should check and edit them before they are sent."],
    ],
  },
);

book.chapters.push(
  {
    title: "Templates for everyday messages",
    paragraphs: [
      "Most work messages fall into a handful of types. Having a pattern for each saves time and means you do not forget the part that matters. Each template below is a skeleton; change the words so it sounds like you.",
    ],
    sections: [
      {
        heading: "Request",
        codes: [
          {
            caption: "Ask, reason, details, offer of help.",
            code: mail([
              "Subject: [Action] Share Q3 sales figures by Wed 21 Oct?",
              "",
              "Hi Neha,",
              "Could you share the Q3 sales figures by Wednesday 21 Oct? I need them",
              "for the board pack, which goes out on Friday.",
              "",
              "The region-wise totals are enough; I don't need product detail.",
              "If Wednesday is hard, let me know and I'll ask finance for a draft.",
            ]),
          },
        ],
      },
      {
        heading: "Meeting request",
        codes: [
          {
            caption: "Purpose, length, options, preparation.",
            code: mail([
              "Subject: 30 min to agree the training plan? Thu or Fri",
              "",
              "Hi Arjun,",
              "Could we meet for 30 minutes to agree the Q4 training plan?",
              "Thu 22 Oct 11:00 or Fri 23 Oct 15:00 IST both work for me.",
              "",
              "Before then, please look at the draft plan (link). It takes",
              "about five minutes to read.",
            ]),
          },
        ],
      },
      {
        heading: "Weekly status",
        codes: [
          {
            caption: "Same four parts every week.",
            code: mail([
              "Subject: Status: Website redesign, week of 20 Oct",
              "",
              "Status: At risk (content late)",
              "Help needed: final product copy from marketing by Wed",
              "",
              "Done",
              "- Home and pricing pages built",
              "- Payment test passed",
              "",
              "Next",
              "- Product pages (needs copy)",
              "- Mobile testing",
            ]),
          },
        ],
      },
      {
        heading: "Acknowledgement",
        paragraphs: [
          "When someone sends you something you must act on, a one-line reply tells them it arrived and when to expect your response: 'Received, thanks. I'll review and come back by Thursday.' It prevents a follow-up and sets an expectation you can keep.",
        ],
      },
      {
        heading: "Introduction",
        paragraphs: [
          "When introducing two people, say who each is, why they should talk, and then step back. 'Meena, meet Arjun, who runs our Pune warehouse. Arjun, Meena is setting up the new logistics contract and has questions about storage. I'll let you two take it from here.' Move yourself to BCC in the first reply so you are not copied on their whole conversation.",
        ],
      },
      {
        heading: "Thank you",
        paragraphs: [
          "Specific thanks mean more than general ones. 'Thanks for staying late to fix the invoice export; it meant we could bill on time this month' tells the person what they did and why it mattered. Copy their manager when the help was significant; it costs nothing and is remembered.",
        ],
      },
      {
        heading: "Making templates your own",
        bullets: [
          "Keep templates in your email program's saved replies or a notes file.",
          "Review them every few months and delete the ones you no longer use.",
          "Never send a template without changing the names, dates and details.",
          "Share good templates with your team so messages look consistent.",
          "Use the site's email writer as a starting point for types you write rarely.",
        ],
      },
    ],
  },
  {
    title: "Checking before you send",
    paragraphs: [
      "Most email mistakes are not about writing style. They are wrong recipients, missing attachments, wrong numbers and names spelled incorrectly. A short check before sending prevents nearly all of them.",
    ],
    sections: [
      {
        heading: "A one-minute check",
        steps: [
          "Recipients: is everyone in To and CC meant to be there? Is anyone missing? Did autocomplete pick the right person?",
          "Subject: does it say the action, the topic and the date?",
          "First two lines: is the ask or main point there?",
          "Attachments: are they attached, and are they the final versions?",
          "Names: are they spelled correctly, including the greeting?",
          "Numbers and dates: do they match the source? Is the day of the week right for the date?",
          "Tone: read it once as the recipient on a bad day.",
        ],
      },
      {
        heading: "The autocomplete trap",
        paragraphs: [
          "Email programs suggest addresses as you type. Two people with similar names, or a client and a colleague with the same first name, are easy to confuse. Sending a confidential file to the wrong Rahul is one of the most common workplace data leaks. Add recipients last, after the message is written, and look at the full address, not just the name.",
        ],
      },
      {
        heading: "Dates and days",
        paragraphs: [
          "'Thursday 22 October' is clear only if 22 October 2026 really is a Thursday. When a day and date disagree, readers do not know which to trust. Check against a calendar, or use the site's date tools. Write dates with the month as a word, such as '23 Oct', to avoid confusion between day-first and month-first formats with international readers.",
        ],
      },
      {
        heading: "Numbers",
        paragraphs: [
          "Copy numbers from the source rather than retyping them. Write money with the currency, such as Rs. 18,500, and large numbers with the format your reader expects: Indian readers are used to lakh and crore, international readers to thousands and millions. If both may read the message, give one and the other in brackets, such as 'Rs. 12 lakh (1.2 million)'.",
        ],
      },
      {
        heading: "Undo send and scheduled send",
        paragraphs: [
          "Many email services can hold a message for a few seconds after you press send, so you can cancel it. Turning this on, with the longest delay available, catches the mistakes you notice the moment you press the button. Scheduled send lets you write now and deliver in the recipient's working hours.",
        ],
      },
    ],
  },
  {
    title: "Staying safe with email",
    paragraphs: [
      "Email is the most common way fraud reaches organisations and individuals. Writing clear messages is half the job; recognising dangerous ones is the other half.",
    ],
    sections: [
      {
        heading: "Signs of phishing",
        bullets: [
          "Urgency or threats: 'Your account will be closed today', 'Pay now to avoid penalty'.",
          "Requests for passwords, OTPs, card details or payment changes.",
          "A sender address that does not match the organisation, or a display name that hides a different address.",
          "Links whose real destination, shown when you hover or long-press, differs from the text.",
          "Unexpected attachments, especially compressed files or documents that ask you to enable macros.",
          "Messages from a 'senior' asking for gift cards or an urgent transfer, often written from a personal address.",
        ],
      },
      {
        heading: "Payment change requests",
        paragraphs: [
          "A common fraud is an email that appears to come from a supplier saying their bank account has changed and asking that the next payment go to a new account. Always confirm such changes by calling the supplier on a number you already have, not one given in the email. Many organisations require two people to approve any change to payee details.",
        ],
      },
      {
        heading: "Writing so your own emails are trusted",
        bullets: [
          "Do not ask anyone to send passwords or OTPs by email.",
          "Avoid link shorteners in work email; show the real address.",
          "Tell clients in advance how you will and will not contact them about payments.",
          "Use your organisation's address, not a personal one, for work.",
        ],
      },
      {
        heading: "Reporting",
        paragraphs: [
          "In India, cyber fraud can be reported at the national cybercrime portal, cybercrime.gov.in, or on the helpline 1930, which is especially important for financial fraud reported quickly. Inside an organisation, report suspicious messages to IT using the method they provide; a fast report can stop the same message fooling a colleague.",
        ],
      },
    ],
  },
  {
    title: "Remote and hybrid meetings",
    paragraphs: [
      "Video calls and hybrid meetings, with some people in a room and others joining online, need a little more structure than meetings in one room. The aim is that everyone can hear, see the material, and take part equally.",
    ],
    sections: [
      {
        heading: "Before",
        bullets: [
          "Put the link, the agenda and any reading in the invitation.",
          "Give times with the time zone if people are in different places.",
          "Test the room's microphone and screen-sharing before an important meeting.",
          "Share documents as links so everyone sees the same version.",
        ],
      },
      {
        heading: "During",
        bullets: [
          "Start on time; late starts waste the time of everyone who joined promptly.",
          "Ask remote participants to speak first on each item, since they find it hardest to break in.",
          "Name someone to watch the chat for questions.",
          "Type actions in the chat or a shared document as they are agreed.",
          "In the last five minutes, read back decisions and actions.",
        ],
      },
      {
        heading: "After",
        paragraphs: [
          "Send notes as you would for any meeting. If you used an automatic transcript or summary, check it against your own understanding before sending: these tools often mishear names and numbers and sometimes describe as decided something that was only discussed.",
        ],
      },
      {
        heading: "Camera and attention",
        paragraphs: [
          "Cameras help people read each other, but long days of video are tiring. Many teams agree that cameras are on for small discussions and optional for large briefings. Whatever the rule, close other windows during the meeting; people can tell when attention is elsewhere, and the meeting takes longer as a result.",
        ],
      },
      {
        heading: "Recording",
        paragraphs: [
          "Tell everyone at the start if a meeting is being recorded, and why. Store recordings according to your organisation's rules and delete them when no longer needed. A recording is a backup, not a substitute for notes.",
        ],
      },
    ],
  },
  {
    title: "Formal letters and applications",
    paragraphs: [
      "Some messages still follow formal conventions: letters to government offices, banks and universities, job applications, and complaints. The structure is predictable, which makes them easier to write than they first seem.",
    ],
    sections: [
      {
        heading: "Structure of a formal letter",
        steps: [
          "Your name, address and contact details, then the date.",
          "The recipient's designation and office address.",
          "A subject line that identifies the matter and any reference number.",
          "A salutation, such as 'Dear Sir or Madam' or 'Respected Sir/Madam' where that is customary.",
          "One paragraph stating the request and the facts.",
          "A list of enclosures, numbered.",
          "A closing, such as 'Yours faithfully' when you do not know the name, or 'Yours sincerely' when you do, followed by your signature and name.",
        ],
        codes: [
          {
            caption: "A short letter to a bank.",
            code: mail([
              "To: The Branch Manager, XYZ Bank, MG Road Branch, Pune",
              "Date: 20 October 2026",
              "",
              "Subject: Request to update mobile number, savings account ending 4421",
              "",
              "Dear Sir or Madam,",
              "I request you to update the mobile number linked to my savings account",
              "ending 4421 from the old number ending 1180 to the new number ending 7702.",
              "",
              "Enclosed: 1. Copy of PAN card  2. Signed update form",
              "",
              "Yours faithfully,",
              "Anil Kumar",
            ]),
          },
        ],
      },
      {
        heading: "Job application emails",
        paragraphs: [
          "Keep the email short: the role you are applying for and where you saw it, two or three lines on why you fit, and a note that your CV is attached. Name the attachment clearly, such as 'Anita-Sharma-CV.pdf'. Use a professional email address. Follow the employer's instructions exactly; if they ask for a reference number in the subject, include it.",
        ],
      },
      {
        heading: "Complaints",
        paragraphs: [
          "An effective complaint states what happened with dates and reference numbers, what it cost you, what you want done, and by when. Keep it factual. Most organisations have a grievance or escalation process; follow it, and keep copies of everything. For banks and many services there is a regulator or ombudsman to escalate to if the organisation does not respond within its stated time.",
        ],
      },
      {
        heading: "Personal details in letters",
        paragraphs: [
          "Give only the details needed to identify your case. Account numbers can usually be shown as the last four digits. Do not include passwords, PINs or OTPs in any letter or email, whatever the request says.",
        ],
      },
    ],
  },
  {
    title: "Habits that keep an inbox under control",
    paragraphs: [
      "Good writing helps others; good habits help you. A few routines keep email from taking over the day.",
    ],
    sections: [
      {
        heading: "Check at set times",
        paragraphs: [
          "Checking email every few minutes breaks concentration. Many people do better checking three or four times a day, at times they choose, and leaving notifications off in between. Tell colleagues how to reach you urgently, usually by phone or chat, so they do not depend on you seeing an email at once.",
        ],
      },
      {
        heading: "Decide once",
        bullets: [
          "If it takes under two minutes, do it now.",
          "If it needs more time, add it to your task list with a date and archive the email.",
          "If someone else should handle it, forward it with a line saying why.",
          "If it needs nothing, archive or delete it.",
        ],
      },
      {
        heading: "Folders and search",
        paragraphs: [
          "Elaborate folder systems take time to maintain. Search is usually faster for finding old messages. A single archive plus a few folders for active projects is enough for most people. Good subject lines, yours and others', make search work.",
        ],
      },
      {
        heading: "Fewer emails in, fewer out",
        paragraphs: [
          "Every email you send tends to create replies. Before sending, ask whether a message is needed, whether it could go to fewer people, and whether a shared document or a quick call would close the matter faster. Unsubscribe from lists you do not read and filter automatic notifications into their own folder.",
        ],
      },
    ],
  },
);

book.problems.push(
  {
    title: "Phishing check",
    q: ["An email from 'Accounts Team <accounts@paymnts-secure.co>' says your salary account will be frozen today unless you confirm your details at a link. List the warning signs and the right response."],
    steps: ["Sender domain does not match your bank or employer.", "Urgency and a threat.", "Asks you to confirm details through a link."],
    answer: "Three warning signs: a mismatched domain, urgency, and a request for details via a link. Do not click; report it to IT or the bank through a known channel, then delete it.",
  },
  {
    title: "Payment change",
    q: ["A supplier's email says their bank account has changed and asks you to pay this month's invoice of Rs. 2,40,000 to a new account. What do you do?"],
    steps: ["Treat as possible fraud until confirmed.", "Call the supplier on a number already on file, not one in the email.", "Follow your organisation's approval process for payee changes."],
    answer: "Do not change the payee from the email alone. Confirm by phone using a known number, and get the change approved through the normal process before paying.",
  },
  {
    title: "Wrong day",
    q: ["A draft says 'Meeting on Friday 24 October 2026'. Is the day right?"],
    steps: ["27 October 2026 is a Tuesday, so 24 October is the Saturday before.", "Friday that week is 23 October."],
    answer: "No. 24 October 2026 is a Saturday. Either the date should be 23 October or the day should be Saturday; check with the organiser before sending.",
  },
  {
    title: "Introduction",
    q: ["Write a three-sentence introduction between Ravi, a supplier of packaging, and Sana, who runs operations for a new client."],
    steps: ["Who each is, why they should talk, step back."],
    answer: "'Sana, meet Ravi, who supplies our packaging and knows the options for fragile items well. Ravi, Sana runs operations at Bright Home and is choosing packaging for their new range. I'll leave you two to find a time.'",
  },
  {
    title: "Specific thanks",
    q: ["Improve: 'Thanks for all your help!' sent to a colleague who reworked a presentation overnight before a client pitch."],
    steps: ["Say what they did and what it achieved."],
    answer: "'Thank you for reworking the deck overnight. The new pricing slide was the one the client asked about most, and they've invited us to the next round.'",
  },
  {
    title: "Hybrid meeting",
    q: ["In a hybrid meeting, two remote participants have not spoken for 20 minutes. What can the chair do?"],
    steps: ["Invite remote people to speak first on the next item.", "Check the chat.", "Ask by name with a specific question."],
    answer: "Ask the remote participants by name for their view on the next item before the room speaks, check the chat for questions they may have posted, and make sure they can see the material being discussed.",
  },
  {
    title: "Forwarding a thread",
    q: ["You are asked to forward a long thread about a supplier contract to a new colleague in another department. What should you check?"],
    steps: ["Read the whole thread.", "Look for prices, personal details and internal opinions.", "Decide whether to forward or summarise."],
    answer: "Read the full thread first, remove or avoid forwarding parts with confidential prices or internal remarks, and consider sending a short summary with only the relevant messages attached.",
  },
  {
    title: "Formal letter subject and closing",
    q: ["You are writing to 'The Registrar' of a university, whose name you do not know, asking for a duplicate marksheet for roll number 21CS044. Give the subject line and closing."],
    steps: ["Subject identifies the matter and the reference.", "'Yours faithfully' when the name is unknown."],
    answer: "Subject: 'Request for duplicate marksheet, roll no. 21CS044'. Closing: 'Yours faithfully', followed by signature and name.",
  },
  {
    title: "Complaint",
    q: ["Write the key facts for a complaint about a refund of Rs. 3,499 promised within 7 days for order 88213, which has not arrived after 21 days."],
    steps: ["What happened with dates and references.", "What you want and by when."],
    answer: "'Order 88213 was returned on 1 Oct, and a refund of Rs. 3,499 was promised within 7 days. It has not arrived as of 22 Oct. Please process the refund by 29 Oct or tell me the reason for the delay. If I don't hear by then, I will escalate through your grievance process.'",
  },
  {
    title: "Meeting request with time zones",
    q: ["Propose a call to a colleague in London for 3:30 pm IST on Thursday 29 October 2026. What is the London time?"],
    steps: ["UK clocks go back to GMT on 25 October 2026, so London is 5 hours 30 minutes behind IST.", "3:30 pm IST minus 5:30 is 10:00 am."],
    answer: "'Thu 29 Oct, 3:30 pm IST / 10:00 am London (GMT).'",
  },
  {
    title: "AI summary check",
    q: ["An automatic meeting summary says 'Team decided to move launch to December.' You remember this was suggested but not agreed. What do you do?"],
    steps: ["Correct the summary before sending.", "Record it as an open question."],
    answer: "Change it to an open question, such as 'Open: should the launch move to December? (Rohan to propose by Friday)', and check the rest of the summary for similar errors before sending.",
  },
  {
    title: "Acknowledgement",
    q: ["A client sends you a 30-page contract to review. You need three days. What do you reply now?"],
    steps: ["Confirm receipt and set an expectation."],
    answer: "'Received, thank you. I'll review it and send comments by Friday 30 Oct.'",
  },
  {
    title: "Inbox triage",
    q: ["You have 40 unread emails after a day off. Describe a quick way through them."],
    steps: ["Sort by sender or subject to spot important threads.", "Read the latest message in each thread first.", "Apply the two-minute rule and move longer tasks to a list."],
    answer: "Scan subjects and senders, read only the latest message in each thread, act on anything under two minutes, move larger items to your task list with dates, and archive the rest.",
  },
);

book.exercises.warmup.push(
  { q: "Name two signs that an email may be phishing.", a: "Urgency or threats, and a request for passwords, OTPs or payment details. Others: mismatched sender address, links that go somewhere unexpected." },
  { q: "Which closing goes with 'Dear Sir or Madam'?", a: "'Yours faithfully'." },
);
book.exercises.practice.push(
  { q: "Write a one-line acknowledgement for a report you will review by Monday.", a: "'Received, thanks. I'll send comments by Monday.'" },
  { q: "Write a subject line for a weekly status update on a hiring project for the week of 27 Oct.", a: "'Status: Hiring for support team, week of 27 Oct'." },
);
book.exercises.stretch.push(
  { q: "Write a short introduction between two colleagues who should work together.", a: "Say who each is, why they should talk, and step back; move yourself to BCC on the first reply." },
  { q: "List five checks to make before sending an important email.", a: "Recipients, subject, the ask in the first lines, attachments, and names, numbers and dates against the source." },
);
book.exercises.challenge.push(
  { q: "Write a team rule for confirming changes to a supplier's bank account.", a: "Any change to payee details must be confirmed by a phone call to a number already on file, recorded with the date and the name of the person spoken to, and approved by a second person before any payment is made to the new account." },
);

book.glossary.push(
  ["Phishing", "A fraudulent message that tries to get you to reveal details, click a harmful link or make a payment."],
  ["Scheduled send", "A feature that delivers a message at a later time you choose."],
  ["Undo send", "A short delay after sending during which you can cancel a message."],
  ["Hybrid meeting", "A meeting with some people in a room and others joining online."],
  ["Yours faithfully", "A formal closing used when you do not know the recipient's name."],
  ["Enclosure", "A document sent with a letter, usually listed at the end."],
  ["Acknowledgement", "A short reply confirming receipt and saying when you will respond."],
);

book.references.push(
  { title: "National Cyber Crime Reporting Portal", who: "Ministry of Home Affairs, Government of India", where: "cybercrime.gov.in, helpline 1930", note: "Where to report online fraud, including phishing and payment fraud." },
);

book.chapters.push(
  {
    title: "Writing for people who read on phones",
    paragraphs: [
      "A large share of work email is now read on a phone, often between other tasks. A message that looks tidy on a laptop can become a wall of text on a small screen. Writing with the phone reader in mind helps every reader.",
    ],
    sections: [
      {
        heading: "What the phone reader sees",
        paragraphs: [
          "On a phone, the inbox shows the sender, the first 30 to 40 characters of the subject, and perhaps the first line of the message. That is all the reader has to decide whether to open it now, later or never. A subject that starts with the action and a first line that states the ask use that space well.",
          "Inside the message, a paragraph of five lines on a laptop becomes ten or twelve on a phone. Short paragraphs of two or three sentences, with a blank line between them, are much easier to follow.",
        ],
      },
      {
        heading: "Attachments and tables",
        paragraphs: [
          "Opening attachments on a phone is slow, and wide spreadsheets are hard to read. If the reader needs one number or one decision from an attachment, put it in the body of the email as well. Avoid tables in the email body unless they are small; three columns is about the limit for a phone screen.",
        ],
      },
      {
        heading: "Making replies easy",
        paragraphs: [
          "Typing long replies on a phone is tiresome, so readers on phones prefer questions they can answer in a word. 'Shall I book Thursday 11 am? Yes or suggest another time' gets a faster answer than 'What time would suit you?' Offering two options and a default is a kindness to a busy reader on a small screen.",
        ],
      },
      {
        heading: "Links and formatting",
        bullets: [
          "Use descriptive link text, such as 'draft plan (5-minute read)', rather than a long raw address.",
          "Avoid colour and font changes to carry meaning; some phone apps strip them.",
          "Put the most important line in bold sparingly; too much bold means nothing stands out.",
          "Keep signatures short so they do not take a whole screen.",
        ],
      },
    ],
  },
  {
    title: "Decision logs and project records",
    paragraphs: [
      "Meeting notes capture one meeting. On a project that lasts months, decisions are spread over dozens of meetings, emails and chats. A decision log collects them in one place so that anyone can see what was decided, when and why.",
    ],
    sections: [
      {
        heading: "What a decision log contains",
        table: {
          caption: "One row per decision. A shared spreadsheet or document is enough.",
          headers: ["Date", "Decision", "Reason", "Decided by"],
          widths: [1, 2.4, 2.2, 1.2],
          rows: [
            ["14 Oct", "Vendors A and B go to contract talks", "C's support hours too short", "Rohan"],
            ["16 Oct", "Launch moves to 4 Nov", "Refund bug in payment testing", "Anita"],
            ["21 Oct", "Logo stays as is", "Client preference; no budget for redesign", "Client call"],
          ],
        },
      },
      {
        heading: "Why the reason matters",
        paragraphs: [
          "Months later, someone will ask why a choice was made. Without the reason, the team either repeats the old discussion or reverses a sound decision because nobody remembers what it was based on. One line of reason is usually enough: 'C's support hours too short' answers the question that would otherwise take a meeting.",
        ],
      },
      {
        heading: "Keeping it up to date",
        steps: [
          "Name one person to own the log for each project.",
          "After each meeting, copy the decisions from the notes into the log.",
          "When a decision is made in chat or email, the person who made it adds it, or asks the owner to.",
          "When a decision is reversed, add a new row rather than deleting the old one, so the history is clear.",
          "Link the log from the project's main page or channel description.",
        ],
      },
      {
        heading: "Action trackers",
        paragraphs: [
          "Actions from meetings are best kept in one list too, with owner, due date and status. Reviewing the list at the start of each meeting takes a few minutes and catches anything that has slipped. When an action is done, mark it done with the date rather than deleting it, so the record shows what was completed.",
        ],
      },
    ],
  },
  {
    title: "Writing for customers",
    paragraphs: [
      "Messages to customers follow the same principles as internal email, with more care for tone and for what the customer needs to do next. A clear message can turn a complaint into loyalty; a confusing one can turn a question into a complaint.",
    ],
    sections: [
      {
        heading: "Replying to a complaint",
        steps: [
          "Thank the customer for telling you, and say you understand the problem in one sentence that shows you read their message.",
          "Say what you have done or will do, with a date.",
          "Tell them exactly what, if anything, they need to do.",
          "Give a name or reference number they can use if they need to follow up.",
        ],
        codes: [
          {
            caption: "A reply that states the fix and the date.",
            code: mail([
              "Subject: Your refund for order 88213",
              "",
              "Dear Ms Rao,",
              "Thank you for letting us know that your refund of Rs. 3,499 has not",
              "arrived. I'm sorry for the delay. I have checked, and the refund was",
              "held because of a mismatch in the bank details.",
              "",
              "I have corrected it today, and the refund will reach your account by",
              "Friday 30 October. You don't need to do anything else.",
              "",
              "If it has not arrived by then, reply to this email quoting",
              "reference CR-55102 and I'll look into it personally.",
              "",
              "Kavya, Customer Care",
            ]),
          },
        ],
      },
      {
        heading: "Words to avoid with customers",
        bullets: [
          "Internal jargon and abbreviations the customer will not know.",
          "'As per policy' without explaining what the policy means for them.",
          "Blaming another department; the customer sees one organisation.",
          "Promises you cannot keep, such as a date nobody has confirmed.",
        ],
      },
      {
        heading: "Order and service messages",
        paragraphs: [
          "Confirmations, reminders and notices are often automated, but someone writes the templates. Put the essential fact first, such as the order number, the delivery date or the amount due, then what the customer should do. Keep legal text short and at the end. Test the message on a phone before it goes to thousands of people.",
        ],
      },
      {
        heading: "Asking for reviews or feedback",
        paragraphs: [
          "Ask once, soon after the service, with one link and a sentence on why feedback matters. Never offer rewards only for positive reviews or write reviews on customers' behalf; it misleads other customers and may break consumer protection rules and platform policies.",
        ],
      },
    ],
  },
);

book.scenarios.push(
  {
    title: "The wrong Rahul",
    paragraphs: [
      "Shreya, an HR executive in Gurugram, was sending a salary revision letter to Rahul Mehta in the sales team. Her email program suggested 'Rahul' as she typed, and she picked the first one, Rahul Menon, a vendor contact with a similar address.",
      "She noticed seconds after pressing send. Because her email service had undo send turned on with a ten-second delay, she cancelled it in time. Had it gone, a colleague's salary would have reached an outside company, and she would have had to report it as a data leak.",
      "Her team made two changes afterwards. Undo send was set to the maximum delay for everyone, and the HR team agreed to add recipients last, after writing the message, and to check the full email address rather than the display name. They also started sending salary letters through the HR system rather than ordinary email.",
    ],
    lesson: "Add recipients last and check the full address. Turn on undo send for the longest delay available.",
  },
  {
    title: "A refund reply that made things worse",
    paragraphs: [
      "An online shop in Jaipur received a complaint from a customer whose refund was late. The first reply said: 'As per policy, refunds are processed within 7-10 working days. Please wait.' The customer had already waited three weeks and posted a public complaint.",
      "The shop's owner rewrote the reply: an apology, a sentence explaining that the refund had been held because of a bank details mismatch, the date it would arrive, a reference number, and a promise of a personal follow-up if it did not. The customer updated the public complaint to say the problem had been resolved well.",
      "The owner then changed the shop's reply templates so that every refund reply included a specific date and a reference number. Complaints about refunds fell, because customers knew what to expect and whom to contact.",
    ],
    lesson: "Customer replies should state the cause, the fix and a date, not just quote a policy.",
  },
  {
    title: "The supplier who changed bank accounts",
    paragraphs: [
      "The accounts team at a small manufacturer in Ludhiana received an email from what looked like their regular steel supplier. It said the supplier's bank had changed and asked that this month's payment of Rs. 6,80,000 go to a new account. The email used the supplier's logo and the usual contact's name.",
      "The accounts assistant, Harpreet, noticed that the sender's address had one letter different from the usual domain. She called the supplier on the number in their records. The supplier had not changed banks and had not sent the email.",
      "The company reported the email to the cyber crime portal and told the supplier, whose email account had probably been compromised. They added a written rule: no change to payee details without a call to a known number and a second person's approval. Harpreet's care saved a payment the company could not easily have recovered.",
    ],
    lesson: "Confirm any request to change bank details by calling a number you already have. Never rely on the email alone.",
  },
);

book.faqs.push({
  group: "Customers and phones",
  items: [
    ["How should I reply to an angry customer?", "Thank them for telling you, show you understood the problem, state what you will do and by when, and give a reference they can use. Avoid quoting policy without explaining it, and do not argue about how they feel."],
    ["How do I write for someone reading on a phone?", "Put the action in the first words of the subject, the ask in the first line, and keep paragraphs to two or three sentences. Put key figures in the body rather than only in an attachment."],
    ["What is a decision log?", "A simple shared list of decisions with the date, the decision, the reason and who made it. It saves teams from repeating old discussions and makes it easy for new members to catch up on a project."],
    ["Should I use emoji in work email?", "Follow your team's habits. In internal chat a simple emoji is often fine; in email to clients, senior people or anyone you do not know well, leave them out."],
  ],
});

book.chapters.push(
  {
    title: "Longer messages: proposals, reports and incidents",
    paragraphs: [
      "Some messages cannot be five sentences: a proposal for new spending, a monthly report, an account of something that went wrong. The same principle applies at a larger scale. Put the conclusion first, then the support, and make it easy for each reader to stop when they have what they need.",
    ],
    sections: [
      {
        heading: "The summary at the top",
        paragraphs: [
          "Start with three lines or fewer that state the decision needed or the main finding, the key number, and what happens next. A director who reads only that much should be able to act. Everything after it is for readers who want to check the reasoning.",
        ],
        codes: [
          {
            caption: "A summary that stands on its own.",
            code: mail([
              "Summary",
              "We propose moving customer support to a shared inbox tool at",
              "Rs. 1,20,000 a year. It should cut average reply time from 26 hours",
              "to under 8. We need approval by 31 Oct to start in November.",
            ]),
          },
        ],
      },
      {
        heading: "A structure for proposals",
        steps: [
          "Summary: the request, cost and benefit in three lines.",
          "The problem: what is wrong now, with a number if possible.",
          "The proposal: what you want to do, in plain terms.",
          "Options considered: two or three alternatives and why you did not choose them.",
          "Cost and timing: money, people and dates.",
          "Risks: what could go wrong and how you would handle it.",
          "Decision needed: who must approve what, by when.",
        ],
      },
      {
        heading: "Incident reports",
        paragraphs: [
          "When something goes wrong, such as a system outage or a data error, a short written account helps everyone understand what happened and prevents it happening again. Write it within a few days, while memories are fresh, and keep it blameless: describe what happened and why the system allowed it, not who to blame. People share more honestly when they are not afraid of punishment, and the fixes are better as a result.",
        ],
        bullets: [
          "Summary: what happened, how long it lasted, who was affected.",
          "Timeline: key events with times.",
          "Cause: why it happened, including the conditions that allowed it.",
          "Fixes: what was done at the time and what will change, each with an owner and date.",
          "What went well: things that limited the damage, worth keeping.",
        ],
      },
      {
        heading: "Monthly reports",
        paragraphs: [
          "A monthly report is read most carefully in its first page. Start with three to five headline points, including anything that is off track. Use the same structure and the same measures each month so readers can compare. Put detailed tables in an appendix or attached sheet, and explain any number that changed sharply.",
        ],
      },
      {
        heading: "Email or document?",
        paragraphs: [
          "If a message is longer than about a screen and a half, consider writing it as a shared document and sending a short email with the summary and a link. Documents are easier to comment on, keep one current version, and can be found later. The email then does its proper job: telling people what the document is, what you need from them and by when.",
        ],
      },
    ],
  },
  {
    title: "Plain words: a quick reference",
    paragraphs: [
      "These swaps make most work messages shorter and clearer. The longer phrase is not wrong; the shorter one is usually better.",
    ],
    sections: [
      {
        table: {
          caption: "Common phrases and plainer alternatives.",
          headers: ["Instead of", "Try"],
          widths: [2.4, 1.6],
          rows: [
            ["at this point in time", "now"],
            ["in order to", "to"],
            ["due to the fact that", "because"],
            ["in the event that", "if"],
            ["with regard to", "about"],
            ["a large number of", "many"],
            ["prior to", "before"],
            ["subsequent to", "after"],
            ["in the near future", "soon (or give a date)"],
            ["please find attached", "I've attached"],
            ["revert back", "reply"],
            ["do the needful", "please (name the action)"],
            ["at the earliest", "by (give a date)"],
            ["it is requested that you", "please"],
            ["we are in receipt of", "we have received"],
            ["take into consideration", "consider"],
            ["make a decision", "decide"],
            ["conduct a review of", "review"],
          ],
        },
      },
      {
        heading: "Vague time words",
        paragraphs: [
          "'Soon', 'at the earliest', 'ASAP' and 'end of week' mean different things to different readers. 'End of week' may mean Friday 5 pm to one person and Sunday night to another. Replace them with a day and, where it matters, a time: 'by Friday 23 Oct, 5 pm IST'. The reader can then plan, and you can follow up fairly if it is missed.",
        ],
      },
      {
        heading: "Hedging",
        paragraphs: [
          "Words such as 'perhaps', 'maybe', 'I think it might be' soften a message, and a little softening is polite. Too much makes a clear request sound optional. Keep hedges for genuine uncertainty, and state requests and facts plainly.",
        ],
      },
    ],
  },
);

book.scenarios.push(
  {
    title: "A proposal that got approved in one reading",
    paragraphs: [
      "Nisha, who managed customer support for a software company in Kolkata, wanted a shared inbox tool. Her first proposal was a six-page document that began with the history of the support team and reached the cost on page five. Her director asked her to 'come back with something shorter'.",
      "She rewrote it with a three-line summary at the top: the tool, the annual cost of Rs. 1,20,000, the expected fall in reply time from 26 hours to under 8, and the approval date needed. Below that came the problem, two alternatives she had rejected and why, and the risks. The history went into an appendix.",
      "The director approved it the same afternoon, writing only 'Clear. Go ahead.' Nisha noticed that nothing in the content had changed; only the order had. The director had been willing to spend the money from the start but had not been able to find the request.",
    ],
    lesson: "Long documents need a short summary at the top with the decision, the cost and the date.",
  },
  {
    title: "End of week",
    paragraphs: [
      "Imran in Hyderabad asked a designer to send revised banners 'by end of week'. He expected them on Friday afternoon so he could check them before a Monday campaign. The designer, working weekends, sent them on Sunday night.",
      "The banners had two errors that could not be fixed before Monday morning, and the campaign started a day late. Neither person had done anything wrong; they had read the same phrase differently.",
      "Imran now writes deadlines as a day, a date and a time, such as 'by Friday 23 Oct, 4 pm IST', and adds the reason when the timing matters: 'so I can check them before Monday's launch'. The designer said the reason was the most useful part, because it told her what would happen if she was late.",
    ],
    lesson: "Replace vague time words with a day, date and time, and say why the deadline matters.",
  },
);

export default book;
