// Practice material for "Passwords and Browser Privacy".
// Tool outputs quoted here were produced by the site's own password generator,
// strength checker and hash tools (src/tools/texts.js) and can be reproduced.

const log2 = Math.log2;
const bits = (len, pool) => len * log2(pool);
const f1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
const big = (n) => Math.round(n).toLocaleString("en-IN");
function human(secs) {
  const yr = 365 * 24 * 3600;
  if (secs < 60) return `${Math.round(secs)} seconds`;
  if (secs < 3600) return `${Math.round(secs / 60)} minutes`;
  if (secs < 86400) return `${Math.round(secs / 3600)} hours`;
  if (secs < yr) return `${Math.round(secs / 86400)} days`;
  if (secs < 1000 * yr) return `${Math.round(secs / yr)} years`;
  if (secs < 1e6 * yr) return `${Math.round(secs / yr / 1000)} thousand years`;
  if (secs < 1e9 * yr) return `${Math.round(secs / yr / 1e6)} million years`;
  return "more than a billion years";
}
const avgTime = (b, rate) => human(Math.pow(2, b) / 2 / rate);

const WORDLIST = 767; // passphrase list used by the site's generator

export default {
  checked: "October 2026",
  welcome:
    "This book is about the small number of habits that keep your accounts yours: long, unique passwords kept in a manager, a second factor on the accounts that can reset the others, and a clear idea of what your browser keeps and what it sends. It also explains what a hash is, what Base64 is not, and why a strength meter can be wrong in both directions.",

  chapters: [
    {
      title: "What current guidance says",
      paragraphs: [
        "The United States National Institute of Standards and Technology publishes the guideline most security teams copy, Special Publication 800-63B. Its fourth revision was finalised in August 2025. It is written for services that check passwords, not for the people who type them, but it settles several arguments that still appear in office policies.",
        "It does not apply to you by law, and an Indian bank or employer may follow a different rule. It is useful because it is evidence-based, public, and blunt about which old habits do harm.",
      ],
      sections: [
        {
          heading: "Length is the main requirement",
          paragraphs: [
            "When a password is the only thing protecting an account, the service should require at least 15 characters. When the password is one part of a login that also needs a second factor, the minimum is 8. Services should accept passwords of at least 64 characters, so that passphrases and manager-generated strings fit.",
            "Fifteen characters sounds long until you type a short sentence. Four or five ordinary words with spaces between them pass easily, and they are easier to type on a phone than a short string of symbols.",
          ],
        },
        {
          heading: "No composition rules, no forced changes",
          paragraphs: [
            "The guideline says services shall not demand a mix of character types, such as one capital, one digit and one symbol. Those rules produce predictable passwords: a capital at the front, a digit and an exclamation mark at the end. Attackers know the pattern and try it first.",
            "It also says services shall not force people to change passwords on a schedule. A forced change every 90 days produces Summer2026! followed by Monsoon2026!. A password should change when there is evidence it has leaked, and then it must change.",
          ],
        },
        {
          heading: "Check against known bad passwords",
          paragraphs: [
            "Instead of composition rules, a service should compare a new password against a blocklist: passwords from earlier breaches, dictionary words, repeated or sequential characters, and words tied to the service itself. A password on the list is rejected and the person is told why.",
            "This is the check a strength meter on a web page cannot do properly, because it would need the full breach list. The site's checker carries a short list of the most common passwords, which catches the worst cases and nothing more.",
          ],
        },
        {
          heading: "Let people paste and use managers",
          paragraphs: [
            "Services should allow pasting and autofill, so that password managers work. A login form that blocks paste pushes people towards shorter passwords they can type from memory. The guideline also says services should not use password hints or knowledge questions such as a mother's maiden name, because those answers are often public or easy to find.",
            "Failed attempts should be limited, so that an online attacker cannot guess at full speed. That limit is the reason the online guessing figures in this book are so much slower than the offline ones.",
          ],
          note: "Source: NIST SP 800-63B-4, Digital Identity Guidelines: Authentication and Authenticator Management, August 2025. The full reference is in the references chapter.",
        },
      ],
    },
    {
      title: "How guessing actually works",
      paragraphs: [
        "Nobody guesses your password by typing at a login page. Two kinds of attack matter, and they move at very different speeds.",
      ],
      sections: [
        {
          heading: "Online guessing",
          paragraphs: [
            "An online attacker sends guesses to the real login page. The service can slow them down, lock the account, or ask for a captcha. That is why the strength checker on this site uses 100 guesses a second for its online figure. Against a service that limits attempts, even a modest password survives online guessing, unless it is one of the first few thousand an attacker tries.",
            "The danger online is not brute force. It is credential stuffing: the attacker already has your email and password from another site's breach and simply tries the same pair everywhere. Length does not help at all against that. Only a different password on each site does.",
          ],
        },
        {
          heading: "Offline guessing",
          paragraphs: [
            "An offline attacker has stolen a service's database of password hashes and can test guesses on their own hardware, with no lockout. The site's checker uses 10 billion guesses a second for this case, which is a fair figure for a fast hash on graphics cards. Services that store passwords with a deliberately slow method, such as bcrypt, scrypt or Argon2, cut that rate by a factor of thousands or more.",
            "Offline speed is why length matters. Every extra random character multiplies the work. A password that falls instantly offline may still look fine on a login page for years, until the database leaks.",
          ],
        },
        {
          heading: "Attackers guess in order",
          paragraphs: [
            "Guessing programs do not start at aaaa and count upwards. They start with leaked passwords, then common words with the usual decorations: a capital first letter, a year, an exclamation mark, a swapped @ for a. Then names, cities, cricket players and film titles. Pure brute force over random characters is the last resort.",
            "This is why bits of entropy, the measure in the next chapter, only describe passwords that were chosen at random. A password you made up is weaker than its length and character set suggest, because you are a person and people choose in patterns.",
          ],
        },
      ],
    },
    {
      title: "Entropy in plain numbers",
      paragraphs: [
        "Entropy is the number of guesses needed, written as a power of two. A password with 40 bits of entropy needs up to 2 to the power 40 guesses, about 1.1 trillion. On average an attacker finds it halfway through, so the expected work is half that.",
        `For a password chosen at random, the calculation is simple: length multiplied by the base-2 logarithm of the number of possible characters. Lower-case letters alone give 26 options, ${f1(log2(26))} bits per character. Upper and lower case give 52, ${f1(log2(52))} bits. Add digits for 62, ${f1(log2(62))} bits. Add the 33 common symbols for 95, ${f1(log2(95))} bits.`,
      ],
      sections: [
        {
          heading: "The table to remember",
          paragraphs: ["Each row is a password chosen by a random generator, not by a person."],
          table: {
            caption: "Entropy and average offline guessing time at 10 billion guesses a second.",
            headers: ["Password made of", "Length", "Bits", "Average time offline"],
            widths: [2.2, 0.8, 0.8, 1.8],
            rows: [
              ["Digits only", "6", f1(bits(6, 10)), avgTime(bits(6, 10), 1e10)],
              ["Lower case", "8", f1(bits(8, 26)), avgTime(bits(8, 26), 1e10)],
              ["Mixed case and digits", "8", f1(bits(8, 62)), avgTime(bits(8, 62), 1e10)],
              ["All 95 printable", "8", f1(bits(8, 95)), avgTime(bits(8, 95), 1e10)],
              ["Mixed case and digits", "12", f1(bits(12, 62)), avgTime(bits(12, 62), 1e10)],
              ["Lower case", "16", f1(bits(16, 26)), avgTime(bits(16, 26), 1e10)],
              ["All 95 printable", "16", f1(bits(16, 95)), avgTime(bits(16, 95), 1e10)],
              [`Words from a ${WORDLIST}-word list`, "4 words", f1(4 * log2(WORDLIST)), avgTime(4 * log2(WORDLIST), 1e10)],
              [`Words from a ${WORDLIST}-word list`, "6 words", f1(6 * log2(WORDLIST)), avgTime(6 * log2(WORDLIST), 1e10)],
              ["Words from a 7,776-word list", "6 words", f1(6 * log2(7776)), avgTime(6 * log2(7776), 1e10)],
            ],
          },
          note: "The 7,776-word list is the size used by dice-based passphrase lists: five dice give 7,776 combinations. The site's own generator uses a shorter list of 767 words, so each word adds a little under 10 bits.",
        },
        {
          heading: "Length beats variety",
          paragraphs: [
            `Going from 8 to 16 lower-case letters adds ${f1(bits(16, 26) - bits(8, 26))} bits. Switching 8 lower-case letters to the full 95-character set adds only ${f1(bits(8, 95) - bits(8, 26))}. Doubling the length did roughly three times as much good as adding every kind of character, and the long lower-case password is far easier to type on a phone.`,
            "A useful rule: aim for at least 80 bits for anything that matters if its database is stolen, and let a generator do the choosing. Below 60 bits, a stolen fast hash will fall in days or less.",
          ],
        },
        {
          heading: "Why a person's password scores lower than its length",
          paragraphs: [
            "A random 12-character string from 62 characters has about 71 bits. Rahul@1995 is 10 characters from a 95-character set, so the naive formula says about 66 bits. In reality it is a common first name, a symbol attackers try first, and a birth year. A guessing program that knows names and years needs a few million tries at most. That is about 22 bits, not 66.",
            "The site's checker scored Rahul@1995 as Fair, 60 bits, with a warning about the year. It cannot tell that Rahul is a name. Treat any meter's score as an upper bound for a password you invented yourself.",
          ],
        },
      ],
    },
    {
      title: "What the site's tools do and do not see",
      paragraphs: [
        "These figures come from running the site's own tools. The generator, the strength checker and the hash tools all run in your browser. Nothing you type is sent to the site.",
      ],
      sections: [
        {
          heading: "The strength checker on twelve passwords",
          paragraphs: ["Real results from the checker. The last column shows what it warned about, shortened."],
          table: {
            caption: "Password strength checker output. Offline figure at 10 billion guesses a second.",
            headers: ["Password", "Rating", "Bits", "Offline", "Warnings"],
            widths: [1.9, 0.9, 0.6, 1.4, 2.4],
            rows: [
              ["password", "Very weak", "10", "instantly", "common password; under 12 characters"],
              ["qwerty123", "Very weak", "8", "instantly", "common; keyboard sequence; short"],
              ["P@ssw0rd2026", "Very weak", "11", "instantly", "common; year; look-alike swaps"],
              ["Krishna@108", "Very weak", "23", "instantly", "common; short"],
              ["sunshine2026", "Very weak", "17", "instantly", "common; year"],
              ["Asha@2001", "Fair", "53", "about 6 days", "year; short"],
              ["Rahul@1995", "Fair", "60", "about 1 year", "year; short"],
              ["Mumbai#123", "Strong", "66", "about 95 years", "short"],
              ["Summer2026!", "Strong", "66", "about 141 years", "year; short"],
              ["blue-cup-tall-door", "Fair", "52", "about 3 days", "none"],
              ["kV9#mQ2!xLp7", "Strong", "79", "about 857 thousand years", "none"],
              ["correcthorsebatterystaple", "Very strong", "118", "more than a billion years", "none"],
            ],
          },
        },
        {
          heading: "Where it is right",
          paragraphs: [
            "It catches the famous passwords, including decorated versions such as P@ssw0rd2026 and sunshine2026, and it flags years, keyboard runs, repeated characters and look-alike swaps. For a password generated at random, such as kV9#mQ2!xLp7, its bit count matches the formula.",
            "It also treats a passphrase of separated words sensibly. blue-cup-tall-door gets 52 bits, close to what four words from a list of a few thousand would give, rather than the inflated figure an 18-character string would suggest.",
          ],
        },
        {
          heading: "Where it is wrong",
          paragraphs: [
            "It rates correcthorsebatterystaple as very strong. That phrase is famous: it comes from a widely shared comic about passwords, and it is in every cracking list. The checker does not know famous phrases, and because the words are joined without separators it measures the string as 25 random lower-case letters.",
            "It rates Mumbai#123 and Summer2026! as strong. Both are a capitalised word, a symbol and a short number, which is the first pattern an attacker tries. It cannot tell that Rahul@1995 is a first name and a year. It has no access to breach lists, so it cannot know whether your exact password has leaked.",
            "So use it to catch obvious mistakes and to compare two of your own ideas. Do not use a high score as permission to reuse a password, and do not use it to approve a password you invented when a generator is one click away.",
          ],
        },
        {
          heading: "The generator's own numbers",
          paragraphs: [
            "The generator reports the entropy of what it produced. In testing, 16 characters from all four sets with look-alikes removed showed 102 bits. Twelve characters without symbols showed 70 bits. Twenty lower-case letters showed 94 bits. Six passphrase words with one capital and one digit showed 63 bits. Four plain words showed 38 bits and was marked weak.",
            "Look-alike removal drops characters such as 0, O, l, 1 and I. That shrinks the pool slightly, which is why 16 characters show 102 bits rather than the 105 a full 95-character pool would give. It is worth it if you ever have to read the password aloud or type it from a screen.",
          ],
        },
        {
          heading: "Hashes from the hash tools",
          paragraphs: ["SHA-256 of a few short inputs, from the site's SHA-256 generator. Change one character and the whole output changes."],
          code: [
            "hello",
            "  2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
            "Hello",
            "  185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969",
            "hello followed by a space",
            "  5e3235a8346e5a4585f8c58562f5052b8fe26a3bb122e1e96c76784964dfc461",
            "(empty input)",
            "  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            "FreeToolsPro",
            "  dd70b387ca25878a25a31a971e106941ce6cc0119a5e5f4b978d647893d83ca5",
          ].join("\n"),
          codeCaption: "SHA-256, hexadecimal. Each output is 64 hex characters, which is 256 bits.",
          after: [
            "The MD5 of hello is 5d41402abc4b2a76b9719d911017c592. MD5 is fast and broken for security purposes: people can deliberately make two different files with the same MD5. It is still fine for spotting accidental corruption in a download, which is all most sites use it for.",
          ],
        },
      ],
    },
    {
      title: "What your browser keeps and sends",
      paragraphs: [
        "Browser privacy is mostly about four things: what is stored on your device, what each site can read back, what extensions can see, and what you are logged into.",
      ],
      sections: [
        {
          heading: "Cookies and site storage",
          paragraphs: [
            "A cookie is a small piece of text a site asks the browser to store and send back on later visits. It is how you stay logged in. First-party cookies belong to the site in the address bar. Third-party cookies belong to other domains embedded in the page, such as an ad network, and were historically how you were followed from site to site. Most browsers now limit third-party cookies by default or let you block them.",
            "Sites can also store data in local storage and similar places. Clearing site data for one site logs you out of it and resets its preferences. Clearing everything logs you out of everything, which is a good reason to have your passwords in a manager before you do it.",
          ],
        },
        {
          heading: "Private or incognito windows",
          paragraphs: [
            "A private window does not keep history, cookies or form entries after you close it. That is useful on a shared computer or when you want a site to treat you as a new visitor. It does not hide your activity from the sites you visit, your employer's network, your internet provider, or anyone who controls the device. Extensions may still run in it if you allowed them to.",
            "Use a private window to log into your account on a friend's laptop, then close every private window when you are done. The session ends when the last private window closes, not when you close the tab.",
          ],
        },
        {
          heading: "Extensions",
          paragraphs: [
            "An extension that can read and change data on all websites can read every password you type and every page you open. Many legitimate extensions need that permission. That is why the list should be short and every entry should be from a publisher you can name. Remove anything you installed for one job and no longer use.",
            "Extensions are sold. A harmless extension with many users can change owner and be updated with tracking or ad injection. Review the list every few months.",
          ],
        },
        {
          heading: "Site permissions",
          paragraphs: [
            "Camera, microphone, location, notifications and clipboard access are granted per site. A news site that asks to send notifications on the first visit is asking for a channel to your screen. Say no by default. Check the list of sites with permissions in the browser settings and remove the ones you no longer trust.",
          ],
        },
        {
          heading: "Tools that run in the browser",
          paragraphs: [
            "A tool that runs in the browser does its work with code downloaded to your device. Your text or file is processed there and is not uploaded. FreeToolsPro's password, hash and text tools work this way. You can check it yourself: open the browser's developer tools, choose the Network tab, use the tool, and watch that no request carries your input.",
            "That is a privacy property, not a promise that it is safe to paste real secrets anywhere. Generate a new password rather than testing an old one you still use.",
          ],
        },
      ],
    },
    {
      title: "Managers, second factors and passkeys",
      paragraphs: [
        "A password manager makes unique passwords practical. A second factor makes a leaked password less useful. A passkey removes the password from the login altogether. Most people need the first two now and will move to the third account by account.",
      ],
      sections: [
        {
          heading: "Choosing a manager",
          paragraphs: [
            "The manager built into your browser or phone is a reasonable start and is far better than reuse. A separate manager is useful if you use more than one browser or phone platform. Whichever you choose, protect it with a long passphrase you can type, turn on its second factor, and write the recovery method down somewhere a lost phone does not take with it.",
            "A manager also fills passwords only on the domain they were saved for. That is protection against look-alike phishing pages: if the manager does not offer to fill, stop and read the address bar.",
          ],
        },
        {
          heading: "Second factors, strongest first",
          bullets: [
            "A security key or passkey. Resistant to phishing, because it checks the real domain before it responds.",
            "An authenticator app that shows a six-digit code changing every 30 seconds. Strong, but a convincing fake page can still ask you to type the code.",
            "A push approval on your phone. Convenient. Never approve a prompt you did not trigger; repeated prompts are an attack.",
            "A code by SMS. Better than nothing. Vulnerable to SIM swap and to being read on a lock screen.",
          ],
        },
        {
          heading: "Passkeys",
          paragraphs: [
            "A passkey is a pair of keys created by your device for one site. The site stores the public half. Your device keeps the private half and uses it to sign a challenge when you unlock it with your fingerprint, face or PIN. There is no shared secret for the site to leak, nothing for you to type into a fake page, and nothing to reuse.",
            "Passkeys can sync between your devices through your phone platform or password manager. Keep at least one recovery route for each important account, and keep a second device or a security key registered for your email.",
          ],
        },
        {
          heading: "Recovery is part of security",
          paragraphs: [
            "Most lockouts are not attacks. They are a lost phone with the only authenticator on it. When you turn on a second factor, save the backup codes the service offers, print them or store them in the manager, and add a second method where possible. Test recovery once on an account that matters, on a calm day.",
          ],
        },
      ],
    },
    {
      title: "Phones, OTPs and payment scams",
      paragraphs: [
        "In India most account takeovers do not start with a guessed password. They start with a one-time password read out on a phone call, a screen-sharing app, or a payment request that looks like a refund. The habits in this chapter matter as much as anything about entropy.",
      ],
      sections: [
        {
          heading: "An OTP is a signature",
          paragraphs: [
            "A one-time password sent by your bank is permission for one specific action, and the message usually says which: a login, a new payee, a card payment of a stated amount. Reading it out to someone gives them that permission. No bank, delivery company or government office needs you to tell them an OTP on a call.",
            "Read the whole message before you use a code. If it says the code is to add a beneficiary or approve a payment, and you are not doing that, you are being tricked, whatever the caller says.",
          ],
        },
        {
          heading: "Collect requests are not refunds",
          paragraphs: [
            "On UPI you never enter your PIN to receive money. A request that asks for your PIN is a request to pay. Scammers send collect requests labelled as a refund, a prize or a buyer's advance and rely on you entering the PIN out of habit.",
            "If someone you are selling to online sends a QR code and asks you to scan it to receive payment, stop. Scanning a code and entering a PIN sends money out.",
          ],
        },
        {
          heading: "Screen-sharing and remote-support apps",
          paragraphs: [
            "Remote-support apps are legitimate tools for IT departments. In a scam, the caller asks you to install one to fix a problem with your account, then watches your screen while you open your banking app or reads OTPs as they arrive. Do not install software at a stranger's request. If you already did, uninstall it, restart the phone, and change passwords for anything opened while it ran.",
          ],
        },
        {
          heading: "SIM and phone hygiene",
          bullets: [
            "Set a SIM PIN so a stolen SIM cannot be used in another phone without it.",
            "Hide message previews on the lock screen.",
            "Use the phone's own screen lock: a 6-digit PIN or longer, with biometrics on top.",
            "Keep the operating system and banking apps updated; updates fix holes that criminals use.",
            "Install apps only from the official store, and question any app that wants to read SMS or draw over other apps.",
          ],
        },
        {
          heading: "If money has gone",
          paragraphs: [
            "Call the national cyber-fraud helpline, 1930, or report on cybercrime.gov.in at once, and call your bank on the number printed on your card to block the card or account. The first hours matter, because the money is often moved through several accounts and can sometimes be frozen on the way.",
            "Write down the time, the amount, the transaction reference and the phone numbers involved. Keep the messages; do not delete the conversation in embarrassment. Scammers are skilled, and people of every age and profession are caught.",
          ],
        },
      ],
    },
    {
      title: "Passwords at work and in small teams",
      paragraphs: [
        "A household can get by with one manager per person. A team needs a little more structure, because people join and leave, and accounts outlive the person who created them.",
      ],
      sections: [
        {
          heading: "One person, one login",
          paragraphs: [
            "Shared logins make it impossible to tell who did what, and impossible to remove one person's access without disturbing everyone. Where a service allows separate users, use them, even on a small plan. Where it does not, keep the shared password in a team vault in the manager, never in chat or email, and change it when anyone with access leaves.",
          ],
        },
        {
          heading: "The leaving checklist",
          steps: [
            "Disable the person's own accounts on the day they leave, starting with email.",
            "Change every shared password they could see, and rotate any API keys they created.",
            "Transfer ownership of documents, domains, social accounts and ad accounts that were in their name.",
            "Check forwarding rules and recovery email addresses on accounts they managed.",
            "Remove their devices from the company's account lists and, if used, from the team manager.",
          ],
        },
        {
          heading: "Admin accounts",
          paragraphs: [
            "The administrator account for email, the domain registrar and the website host can undo everything else. Give these accounts long generated passwords, a passkey or security key as the second factor, and at least two named people who can recover them. Do not use the admin account for daily work.",
            "Write down, on paper kept by the owner, which email address owns the domain name and the hosting. Many small businesses lose their website because the person who registered it has left and the renewal notices went to their personal address.",
          ],
        },
        {
          heading: "Keys and tokens in code",
          paragraphs: [
            "Never commit a password, API key or token to a code repository, even a private one. Load secrets from environment variables or a secret store. If one leaks, revoke and replace it; deleting the commit does not remove copies others may already have. Most code hosts can scan for leaked keys automatically; turn that on.",
          ],
        },
      ],
    },
    {
      title: "Helping parents and older relatives",
      paragraphs: [
        "Older relatives are targeted precisely because they are polite on the phone and less familiar with how apps behave. The goal is not to make them experts. It is to set up a few defaults that protect them without daily effort, and an agreement about who to call.",
      ],
      sections: [
        {
          heading: "Set up once",
          bullets: [
            "A screen lock with a PIN they can remember and biometrics where the phone supports it.",
            "The phone's built-in password manager, with the email and bank passwords generated and saved.",
            "A second factor on email using the phone's authenticator or a passkey, with printed backup codes kept with their important papers.",
            "Lock-screen previews hidden for messages.",
            "Your number saved as a favourite, and a household rule that they call you before acting on any call about their bank, a parcel, electricity disconnection or a police case.",
          ],
        },
        {
          heading: "The three sentences",
          paragraphs: [
            "Teach three sentences rather than a lecture. Nobody genuine will ask for an OTP or a PIN. Nobody genuine will ask you to install an app while on a call. When in doubt, hang up and call the number printed on your card or bill.",
            "Repeat them when a news story about a scam comes up. People remember rules attached to stories.",
          ],
        },
        {
          heading: "Without taking over",
          paragraphs: [
            "Avoid keeping your parents' passwords in your own head or your own phone unless they ask you to. Use the manager's emergency-access or sharing features instead, so they remain the owners of their accounts and you can help when needed. Respect their privacy in the same way you would want yours respected.",
          ],
        },
      ],
    },
    {
      title: "A thirty-minute security check",
      paragraphs: [
        "Do this once a quarter, or after any scare. It needs your phone, your laptop, and half an hour.",
      ],
      sections: [
        {
          steps: [
            "Open your password manager's security report. Fix reused and leaked passwords, email and banking first.",
            "In your email account, review signed-in devices, recovery phone and email, forwarding rules and connected apps. Remove anything you do not recognise.",
            "Confirm your email has a second factor that is not only SMS, and that your backup codes are where you think they are.",
            "In the browser, review extensions and remove anything unused. Then review site permissions for camera, microphone, location and notifications.",
            "On your phone, check for apps you do not remember installing and apps with permission to read SMS or draw over other apps.",
            "Delete one old account you no longer use. A forgotten account is still an account.",
            "Write the date in your manager's notes so you know when you last did this.",
          ],
          note: "If you do only one thing this year, make your email password unique and add a second factor to it. Everything else can be reset through email.",
        },
      ],
    },
    {
      title: "Encryption you can actually use",
      paragraphs: [
        "The hash tools on this site do not encrypt anything, and that is deliberate: encryption is only useful when the keys are handled well, and that is the job of your device and your apps. You already have more of it than you may think.",
      ],
      sections: [
        {
          heading: "Device encryption",
          paragraphs: [
            "Modern phones encrypt their storage when a screen lock is set. That is why a strong phone PIN matters: it is part of the key. Laptops offer the same through the operating system's disk-encryption setting. Turn it on, and store the recovery key somewhere other than the laptop itself, such as your password manager or a printed sheet with your papers.",
            "Without disk encryption, anyone who removes the drive from a lost laptop can read every file and every saved browser session on it.",
          ],
        },
        {
          heading: "Messages and backups",
          paragraphs: [
            "End-to-end encrypted messaging means only the people in the chat hold the keys. The service carries the message but cannot read it. That protection can be undone by a backup stored without encryption in the cloud. If your messaging app offers encrypted backups, turn them on and keep the backup password in your manager.",
          ],
        },
        {
          heading: "Sending a file safely",
          paragraphs: [
            "For a document with personal details, such as a scanned identity card, prefer the secure upload the receiving organisation provides over email. If you must email it, put it in a password-protected archive or PDF and send the password by a different channel, such as a phone call. Sending both in the same email protects nothing.",
            "Remember that a password-protected PDF is only as strong as its password and the software that made it. Use a long generated password, not a date of birth.",
          ],
        },
      ],
    },
    {
      title: "Myths, checked",
      paragraphs: ["Common beliefs, and what is actually true."],
      sections: [
        { label: "Myth: Nobody would bother hacking me.", paragraphs: ["Most attacks are automated. Programs try leaked passwords on millions of accounts without knowing or caring who owns them. Your email, phone number and UPI ID are valuable to them because they are yours, not because you are important."] },
        { label: "Myth: A password with symbols is always strong.", paragraphs: ["Symbols in predictable places add very little. Length and randomness matter more. A long passphrase of random words is stronger than a short word decorated with @ and !."] },
        { label: "Myth: Changing passwords monthly keeps me safe.", paragraphs: ["Scheduled changes push people into patterns attackers already try. Change a password when there is a reason, and change it to something unrelated."] },
        { label: "Myth: Incognito mode makes me anonymous.", paragraphs: ["It only stops your own browser keeping a record. Websites, your network and your internet provider can still see what you do."] },
        { label: "Myth: The padlock means the site is safe.", paragraphs: ["The padlock means the connection to that domain is encrypted. A phishing site can have a padlock too. Read the domain itself."] },
        { label: "Myth: Password managers are a single target, so they are worse.", paragraphs: ["A manager is a single target that is heavily protected and encrypted with your master passphrase. Reuse spreads one password across dozens of weakly protected targets. For almost everyone the manager is far safer."] },
        { label: "Myth: Two-factor login means my password does not matter.", paragraphs: ["A second factor limits the damage of a leaked password, but codes can still be phished and some services fall back to SMS. A unique password and a second factor together are the standard."] },
        { label: "Myth: Hashing a password with SHA-256 is encryption.", paragraphs: ["Hashing is one-way and has no key. Encryption is two-way with a key. Neither SHA-256 alone nor Base64 is a safe way to store passwords."] },
      ],
    },
    {
      title: "Reading an address before you trust it",
      paragraphs: [
        "Phishing works because the page looks right. The address is the one part a fake page cannot copy exactly. Reading it takes five seconds once you know where to look.",
      ],
      sections: [
        {
          heading: "Find the registered domain",
          paragraphs: [
            "Take the part between https:// and the next single slash. That is the host name. Read it from the right. The last part is the ending, such as .in, .com or .co.in. The part just before it is the name someone registered. Everything to the left is a subdomain chosen by whoever owns that name.",
            "So in accounts.example.in, the registered name is example.in. In example.in.secure-login.net, the registered name is secure-login.net, and example.in is just a word placed at the front to fool you.",
          ],
          table: {
            caption: "Five addresses and who really owns them.",
            headers: ["Address", "Registered domain", "Safe for example.in?"],
            widths: [2.4, 1.4, 1],
            rows: [
              ["https://www.example.in/login", "example.in", "Yes"],
              ["https://netbanking.example.in/", "example.in", "Yes"],
              ["https://example.in.kyc-update.com/", "kyc-update.com", "No"],
              ["https://examp1e.in/login", "examp1e.in", "No: digit 1 for letter l"],
              ["https://example-in.co/", "example-in.co", "No"],
            ],
          },
        },
        {
          heading: "Shortened links and QR codes",
          paragraphs: [
            "Short links and QR codes hide the address until you open them. Most phones show the address when you long-press a link or before opening a scanned code. Check it there. If a message pushes urgency, such as an account freezing today or an electricity cut tonight, the urgency is part of the trick.",
          ],
        },
        {
          heading: "Look-alike characters",
          paragraphs: [
            "Some fake domains swap letters for similar ones: rn for m, 1 for l, 0 for o, or letters from other alphabets that look identical on screen. Browsers display many such addresses in a special encoded form beginning with xn--, which is a warning sign for a site you expected to be ordinary. Your password manager is a better detector than your eyes, because it compares the exact domain.",
          ],
        },
      ],
    },
    {
      title: "Students, children and first accounts",
      paragraphs: [
        "A first email account usually becomes the recovery address for everything that follows: exam portals, scholarships, bank accounts, job applications. Setting it up well at fifteen saves trouble at twenty-five.",
      ],
      sections: [
        {
          heading: "A sensible first setup",
          bullets: [
            "One email address in the student's own name, used for official things, with a passphrase they chose with a generator and a second factor on their phone.",
            "A separate address, if they want one, for games and sign-ups, so that marketing and breaches stay away from the official one.",
            "The phone's password manager turned on from the start, so unique passwords are the habit rather than a later project.",
            "Backup codes printed and kept with school certificates.",
          ],
        },
        {
          heading: "Shared family devices",
          paragraphs: [
            "On a shared computer, give each person their own user account on the computer, or at least their own browser profile. Saved passwords in a shared profile are visible to everyone who uses it. Children's accounts can then have their own settings without touching a parent's banking session.",
          ],
        },
        {
          heading: "Exam and college portals",
          paragraphs: [
            "Exam portals are busy, slow and full of deadlines, which tempts people to reuse a password they can remember under pressure. Generate one, save it in the manager and also write the registration number and password on the admit-card folder, because some exam centres do not allow phones. After results, change it if the portal allowed it to be emailed in plain text.",
          ],
        },
      ],
    },
    {
      title: "The first hour after a compromise",
      paragraphs: [
        "When something goes wrong, the order of repair matters more than speed alone. Fixing a shopping account while the attacker still controls your email only gives them a fresh reset link. Work from the accounts that can reset others downwards, on a device you trust.",
      ],
      sections: [
        {
          heading: "If your email was taken",
          steps: [
            "Use a device you are confident is clean, such as your phone if the problem started on a laptop.",
            "Use the provider's account recovery if you are locked out; have your recovery phone and backup codes ready.",
            "Change the password to a new generated one and sign out of all other sessions.",
            "Check and remove forwarding rules, filters that delete or hide mail, unknown recovery addresses and phone numbers, and connected apps.",
            "Reset or re-enrol the second factor, and print new backup codes.",
            "Reset the passwords of accounts whose reset emails go to this address, starting with banks, phone operator and work accounts.",
            "Tell your contacts that messages sent from your address in the last few days may be fake.",
          ],
        },
        {
          heading: "If money moved",
          steps: [
            "Call 1930 or report on cybercrime.gov.in, then call the bank on the number printed on your card.",
            "Block the card or freeze the account as the bank advises, and ask for the transaction to be disputed.",
            "Save screenshots of messages, call logs and transaction references.",
            "Change the banking app PIN and passwords after the account is secured.",
            "File a written complaint with the bank and keep the reference number.",
          ],
        },
        {
          heading: "If a device was lost",
          paragraphs: [
            "Use the phone platform's find-my-device service to lock or erase it. Ask the operator to block the SIM and issue a replacement on the same number. Sign out of the lost device from your email and other important accounts, and remove it from the trusted device lists of your password manager and banking apps. Because a phone with a strong PIN is encrypted, a locked phone is usually not a data disaster; the SIM is the urgent part.",
          ],
        },
      ],
    },
  ],

  scenarioIntro:
    "Fifteen situations, from a first phone to a small office. Names and places are illustrations. The decisions are the ones that come up again and again.",

  scenarios: [
    {
      title: "One password, five years, nine accounts",
      paragraphs: [
        "Deepa, a teacher in Kochi, used one password for email, her bank, two shopping sites, a train booking account and four apps. It was her daughter's name and birth year, with a capital and an exclamation mark. In 2026 one of the shopping sites announced a breach.",
        "She changed that shop's password and felt the problem was solved. It was not. The attacker now held her email address and the password that opened eight other accounts. Credential-stuffing tools try a leaked pair on hundreds of popular sites within hours of a breach going on sale.",
        "Her son sat with her for an hour. They turned on the phone's built-in password manager, changed the email password first to a generated 20-character string, added an authenticator app to the email, then did the bank. The other accounts were changed over the next fortnight, each the next time she logged in.",
      ],
      lesson: "Change the password everywhere it was reused, starting with email, because email can reset everything else.",
    },
    {
      title: "The office policy that made things worse",
      paragraphs: [
        "A logistics firm in Nagpur required a password change every 60 days, with at least one capital, one digit and one symbol, and no reuse of the last five. Staff complied. An audit of the reset log found most passwords followed the pattern Name@MonthYear, and many were written on sticky notes under keyboards.",
        "The IT lead, Gopal, rewrote the policy along the lines of the NIST guidance: a minimum of 15 characters for passwords used alone, no composition rules, no scheduled expiry, a check against a list of leaked and common passwords, and a forced change only when there was evidence of compromise. He added authenticator-app sign-in for email and the accounting system.",
        "Help-desk resets fell in the first quarter. Staff chose short sentences they could type. The sticky notes disappeared because nobody had to remember a new password every two months.",
      ],
      lesson: "Rules that look strict on paper can push people into patterns. Length, a blocklist and a second factor do more.",
    },
    {
      title: "A generated password nobody can type",
      paragraphs: [
        "Imran set the family's home Wi-Fi to a 24-character random string with every symbol available. The first guest needed ten minutes and three attempts to type it on a phone keyboard. His parents asked him to change it to something simple.",
        "He switched the generator to a passphrase: five words separated by hyphens, with one capital and one digit. The result was long, typed easily on a phone, and could be read aloud without spelling out symbols. He printed it on a card stuck inside a kitchen cupboard, not on the fridge.",
        "The router's admin password was a different matter. Nobody types that, so it stayed a 20-character random string in his password manager.",
      ],
      lesson: "Choose the form of password by how it will be entered. Passphrases for things people type; random strings for things a manager fills.",
    },
    {
      title: "A strength meter that said yes",
      paragraphs: [
        "Arjun, a college student in Jaipur, tested Mumbai#123 on a strength checker for his new exam-portal account. It came back Strong, 66 bits. He was pleased.",
        "His roommate pointed out that the checker had treated the password as 10 random characters from a 95-character set. It was really a city name, a symbol, and the most common short number in the world. A guessing program trying common words with the usual decorations would reach it quickly.",
        "Arjun let the generator pick instead. He saved the result in his browser's manager, which would fill it on the portal. He also learned that the checker had flagged the length: under 12 characters is short whatever the rating says.",
      ],
      lesson: "A meter measures the shape of a string, not where the string came from. Invented passwords are weaker than their score.",
    },
    {
      title: "The shared streaming login",
      paragraphs: [
        "Four friends in Bengaluru shared a streaming account. The owner, Nikhil, had used his everyday password for it. When the group fell apart, one of the friends still had the password, and it also opened Nikhil's food-delivery app with a saved card.",
        "He changed both. For the new streaming password he used one generated only for that service, and he shared it through the manager's sharing feature with the people who still used it. When someone left, he changed it again and re-shared.",
        "He also decided which accounts may ever be shared: entertainment, yes; anything with a saved card or an address, no.",
        "The streaming service itself offered profiles and a sign-out-of-all-devices button. He used it the day the group split, which ended every old session at once without waiting for anyone to notice the password had changed.",
      ],
      lesson: "A shared password should exist only for one account and should change when someone leaves the group.",
    },
    {
      title: "SMS as the only second factor",
      paragraphs: [
        "Farida in Hyderabad received a message saying her SIM had been deactivated at her request. She had not asked. Within the hour, password-reset codes for her email went to the attacker's new SIM.",
        "She recovered the number at the operator's store with ID, then recovered her email through the backup codes she had once printed and kept in a drawer. Her bank had not been touched because it used its own app for approval.",
        "Afterwards she moved her email's second factor to an authenticator app and a passkey, kept SMS only as a fallback where the service required it, and asked her operator about a port-out or SIM-change lock.",
        "She also noticed how the attack had started: a call two days earlier from someone claiming to be from her bank, asking her to confirm her date of birth and address. Those details are what an operator asks for. She now ends such calls and rings the number printed on her card.",
      ],
      lesson: "SMS is the weakest common second factor. Keep it as a fallback, not the only route, and keep printed backup codes.",
    },
    {
      title: "Base64 is not a secret",
      paragraphs: [
        "A freelance developer, Vivek, put a demo app on a public code site. The API key was stored as Base64 text in a configuration file, on the theory that nobody would recognise it. Two days later his cloud bill showed thousands of requests he had not made.",
        "Base64 is an encoding. It changes bytes into letters and digits so they survive systems that expect text. Anyone can reverse it with a free tool in a second. Automated scanners on public code sites look for exactly these patterns.",
        "He revoked the key, created a new one, moved it into an environment variable that is never committed, and added a rule to his repository to block files that look like keys.",
      ],
      lesson: "Encoding changes the costume. Encryption needs a key. A secret in a public file is public, whatever it is wearing.",
    },
    {
      title: "Checking a download",
      paragraphs: [
        "Lakshmi, who manages a small office in Coimbatore, downloaded an installer for accounting software. The publisher listed a SHA-256 checksum on its download page.",
        "She computed the SHA-256 of the downloaded file and compared the first and last eight characters with the published value. They matched. A single changed byte anywhere in the file would have produced a completely different hash.",
        "She noted one limit. If an attacker controls the download page, they can change both the file and the published hash. The check proves the file matches what the page says, not that the page is honest. For that, the file's digital signature, checked by the operating system, is the stronger test.",
      ],
      lesson: "A checksum detects corruption and tampering in transit. It is only as trustworthy as the place you read it from.",
    },
    {
      title: "A laptop left logged in",
      paragraphs: [
        "Thomas used the computer in a hotel business centre in Udaipur to print a boarding pass. He logged into his email in a normal window, printed, and closed the tab.",
        "Closing a tab does not log you out. The next guest opened the browser and found his inbox still signed in, with the full password-reset history of every account he owned.",
        "The next time, he used a private window, logged out explicitly, then closed every private window. He also turned on alerts for new sign-ins in his email settings and reviewed the list of signed-in devices, removing the hotel computer that was still there.",
        "He found one more thing in the email settings: a forwarding rule he had not created, sending copies of any message containing the word bank to an unknown address. Attackers add such rules so that they keep seeing reset emails even after you change the password. He deleted it and now checks forwarding rules whenever he reviews his devices.",
      ],
      lesson: "On a shared device, log out and close the private window. Then check your account's device list from your own phone.",
    },
    {
      title: "Security questions that were public",
      paragraphs: [
        "A government-scheme portal asked Kavita in Bhopal to set three security questions: her mother's maiden name, her first school and her favourite food. All three answers were on her public social media profile, in posts about family and school reunions.",
        "Where a site insists on these questions, the answer does not have to be true. She generated a random word for each answer and stored the question and answer pairs in her password manager's notes for that login.",
        "Current guidance from NIST tells services not to use such questions at all. Until every site follows it, treat each answer as another password.",
        "The one risk with random answers is a phone call. A help desk may ask the question aloud, and you will need to read the answer from your manager. That is fine. It is better than an answer anyone who has seen her photo albums could give.",
      ],
      lesson: "Answer security questions with random words stored in your manager. A true answer is a guessable answer.",
    },
    {
      title: "The browser extension with too much access",
      paragraphs: [
        "Pooja installed a coupon extension that promised discounts at checkout. It asked for permission to read and change data on all websites. A few months later her browser started showing ads on sites that never had them.",
        "The extension had been sold to a new owner and updated. With the permission it already had, it could read every page she visited, including forms where she typed passwords.",
        "She removed it, changed the passwords for accounts she had used while it was installed, starting with email and banking, and set a reminder to review her extensions every three months. Her rule now: no extension with all-site access unless she can name the company behind it and it does a job she uses weekly.",
      ],
      lesson: "Extensions with broad permissions can see what you type. Keep the list short and review it.",
    },
    {
      title: "A father's first password manager",
      paragraphs: [
        "Manoj, retired in Lucknow, kept passwords in a notebook by the computer. His daughter suggested a manager. He worried about putting all his passwords in one place.",
        "They agreed on a compromise. The manager's master password would be a six-word passphrase he chose with dice and wrote on a card kept in the cupboard with his property papers. The manager would hold everything else. The notebook would go, except for one page listing the email address and the location of the card.",
        "After a month he said he preferred it, because the manager filled the login for him and he no longer had to read his own handwriting.",
        "His daughter added one more step: she set herself up as the manager's emergency contact, a feature that lets a trusted person request access after a waiting period that Manoj can refuse. If he is ever in hospital, the family can still pay the electricity bill.",
      ],
      lesson: "A written master passphrase stored at home is a reasonable trade for most people. The threat at home is rarely a burglar reading cards.",
    },
    {
      title: "Hashing a password for a project",
      paragraphs: [
        "Shruti, a final-year student, built a login system for a college project. She stored passwords as unsalted SHA-256 hashes, which she generated with an online hash tool to test.",
        "Her guide asked her to run the hashes of ten common passwords through a lookup table. Seven matched immediately, because the SHA-256 of a common password is the same everywhere and pre-computed tables exist. A fast hash also lets an attacker try billions of new guesses a second.",
        "She replaced it with a library implementation of a slow password-hashing function with a unique random salt per user, and kept the SHA-256 tool only for its proper job of fingerprinting files.",
        "She also learned to stop testing with real passwords. Her test data now uses generated values, and her project report includes a short section explaining why the login stores a slow, salted hash and never the password itself. The examiner asked about it in the viva.",
      ],
      lesson: "SHA-256 is a fingerprint, not a password store. Passwords need a slow hash with a salt, from a maintained library.",
    },
    {
      title: "A phishing page the manager would not fill",
      paragraphs: [
        "Omar received an email saying his bank account would be frozen unless he verified it today. The link opened a page that looked exactly like the bank's login. He clicked the username field and waited for his manager to fill it. It did not.",
        "He looked at the address bar. The domain had an extra word and a different ending. The manager had saved his password for the real bank domain only, so it offered nothing here.",
        "He closed the page, opened the bank's app directly, found no warning there, and reported the email to the bank's phishing address.",
        "Had he typed the password, the right response would have been fast: change it from the real site at once, check recent transactions, and call the bank on the number on his card. Speed matters because phishing kits pass credentials to the attacker within seconds.",
      ],
      lesson: "When the manager does not offer to fill a login you use often, stop. Check the address before typing anything.",
    },
    {
      title: "Moving the family to passkeys",
      paragraphs: [
        "Selvi in Madurai noticed her email provider offering a passkey. She created one on her phone, then a second on her laptop. Signing in became a fingerprint instead of a password and a code.",
        "Before she removed the old password route, she checked recovery. She registered a second phone, her husband's, as a recovery device for her email, kept the printed backup codes, and left her recovery email set to an account with its own passkey.",
        "She did not switch every account at once. She added passkeys when a site offered them and left the rest on unique passwords in the manager.",
        "Her mother's phone was older and did not support passkeys for one of her accounts. Selvi did not force it. She made sure that account had a unique generated password and an authenticator code, and noted it to revisit when the phone is replaced.",
      ],
      lesson: "Add passkeys where offered, starting with email, and set up a second device or backup codes before you rely on them.",
    },
    {
      title: "A refund that was a payment",
      paragraphs: [
        "Renu in Indore listed an old sofa on a classifieds site. A buyer agreed the price within minutes, said he was in the army and could not visit, and sent a UPI request labelled 'advance for sofa'. Her app asked for her PIN.",
        "She almost entered it. Then she remembered that receiving money never needs a PIN. The request was a collect request: approving it would have sent Rs. 15,000 from her account to his. She declined it and blocked the number.",
        "The pattern is common: a buyer who is too keen, a story that explains why they cannot meet, and a request or QR code that must be approved quickly. She now accepts only cash on collection or payments she can see arrive in her bank app before handing anything over.",
      ],
      lesson: "If the app asks for your PIN, money is leaving. Receiving never needs one.",
    },
    {
      title: "The domain renewal nobody saw",
      paragraphs: [
        "A tuition centre in Kollam had its website and email on a domain registered six years earlier by a former teacher, using his personal email. When he moved abroad, renewal notices kept going to him. He ignored them. The domain expired, and the centre's email stopped working in the middle of admissions.",
        "Recovering it took three weeks of emails with the registrar, proof of business documents, and a renewal fee with a late charge. During that time parents' emails bounced.",
        "The owner, Iqbal, moved the domain to an account in the centre's name with two administrators, turned on auto-renew with a card that does not expire soon, added a second factor, and wrote the registrar's name and login location on a sheet in the office file.",
      ],
      lesson: "Business accounts must belong to the business, with more than one person able to recover them.",
    },
    {
      title: "A shared laptop in a hostel",
      paragraphs: [
        "Four students in a Pune hostel shared one laptop for assignments. Everyone used the same browser profile. One of them, Neha, noticed that her college portal opened without asking for a password, and so did her friends' email accounts and one friend's bank.",
        "The browser had saved everyone's passwords in the same profile and kept everyone signed in. Anyone using the laptop could read any of them in the browser settings.",
        "They set up a separate user account on the laptop for each person, each with its own login password. Each person moved their saved passwords into their own phone's manager and signed out of everything on the shared account. It took an evening and ended a lot of nervous jokes about who had read whose messages.",
      ],
      lesson: "On a shared computer, each person needs their own user account or browser profile. One profile means shared passwords.",
    },
  ],

  problemIntro:
    "Most problems need only a calculator with a log button, or the habit of multiplying powers of two. Where a figure comes from the site's tools, it is stated. Average guessing time means half of all possibilities have been tried.",

  problems: [
    {
      title: "Bits in a PIN",
      q: ["How many bits of entropy does a random 6-digit PIN have, and how many guesses does it take on average?"],
      steps: ["Each digit has 10 options.", `Bits = 6 × log2(10) = 6 × ${f1(log2(10))} = ${f1(bits(6, 10))}.`, "Possibilities = 10^6 = 10,00,000. On average an attacker finds it after half: 5,00,000 guesses."],
      answer: `About ${f1(bits(6, 10))} bits; 5,00,000 guesses on average. Safe only because the device or bank limits attempts.`,
    },
    {
      title: "Eight lower-case letters offline",
      q: ["A random 8-letter lower-case password is stored as a fast hash that leaks. At 10 billion guesses a second, how long on average?"],
      steps: [`Bits = 8 × log2(26) = ${f1(bits(8, 26))}.`, `Possibilities = 26^8 = ${big(Math.pow(26, 8))}.`, `Average guesses = half = ${big(Math.pow(26, 8) / 2)}.`, `Time = ${big(Math.pow(26, 8) / 2)} ÷ 10,000,000,000 = about ${f1(Math.pow(26, 8) / 2 / 1e10)} seconds.`],
      answer: "About 10 seconds. Short passwords do not survive an offline attack whatever letters they use.",
    },
    {
      title: "Adding symbols or adding length",
      q: ["Compare two changes to an 8-character lower-case password: switching to all 95 printable characters, or doubling the length to 16 lower-case letters. Which adds more bits?"],
      steps: [`Start: 8 × ${f1(log2(26))} = ${f1(bits(8, 26))} bits.`, `All 95 characters at 8 long: 8 × ${f1(log2(95))} = ${f1(bits(8, 95))} bits, a gain of ${f1(bits(8, 95) - bits(8, 26))}.`, `16 lower-case letters: 16 × ${f1(log2(26))} = ${f1(bits(16, 26))} bits, a gain of ${f1(bits(16, 26) - bits(8, 26))}.`],
      answer: `Doubling the length adds ${f1(bits(16, 26) - bits(8, 26))} bits, against ${f1(bits(8, 95) - bits(8, 26))} for symbols. Length wins.`,
    },
    {
      title: "How many characters for 80 bits",
      q: ["How many random characters from mixed case and digits (62 options) are needed for at least 80 bits?"],
      steps: [`Each character gives log2(62) = ${f1(log2(62))} bits.`, `80 ÷ ${f1(log2(62))} = ${f1(80 / log2(62))}.`, "Round up to a whole character."],
      answer: `${Math.ceil(80 / log2(62))} characters, giving ${f1(bits(Math.ceil(80 / log2(62)), 62))} bits.`,
    },
    {
      title: "Passphrase from the site's word list",
      q: [`The site's passphrase generator draws from a list of ${WORDLIST} words. How many bits do five random words give, before any capital or digit is added?`],
      steps: [`Bits per word = log2(${WORDLIST}) = ${f1(log2(WORDLIST))}.`, `Five words = 5 × ${f1(log2(WORDLIST))} = ${f1(5 * log2(WORDLIST))}.`],
      answer: `About ${f1(5 * log2(WORDLIST))} bits. Use six or more words, or a longer word list, for anything protected only by the password.`,
    },
    {
      title: "Why the generator showed 63 bits",
      q: ["The site's generator showed 63 bits for six words with one word capitalised and a digit added. Reproduce the figure."],
      steps: [`Six words: 6 × ${f1(log2(WORDLIST))} = ${f1(6 * log2(WORDLIST))} bits.`, "Choosing which of the 6 words gets the capital and the digit, and which of 10 digits: 6 × 10 = 60 choices.", `log2(60) = ${f1(log2(60))} bits.`, `Total = ${f1(6 * log2(WORDLIST))} + ${f1(log2(60))} = ${f1(6 * log2(WORDLIST) + log2(60))}.`],
      answer: "About 63 bits, matching the tool. The capital and digit add only about 6 bits; another word adds nearly 10.",
    },
    {
      title: "Dice passphrase",
      q: ["A passphrase uses 6 words from a 7,776-word list, picked by rolling five dice per word. How many bits, and how long on average at 10 billion guesses a second?"],
      steps: [`Bits per word = log2(7776) = ${f1(log2(7776))}.`, `Six words = ${f1(6 * log2(7776))} bits.`, `Average time = 2^${f1(6 * log2(7776))} ÷ 2 ÷ 10^10 seconds.`],
      answer: `About ${f1(6 * log2(7776))} bits; on average ${avgTime(6 * log2(7776), 1e10)} at that rate.`,
    },
    {
      title: "Online versus offline",
      q: ["A password has 40 bits of entropy. How long on average to guess it online at 100 guesses a second, and offline at 10 billion a second?"],
      steps: [`Possibilities = 2^40 = ${big(Math.pow(2, 40))}. Half = ${big(Math.pow(2, 39))}.`, `Online: ${big(Math.pow(2, 39))} ÷ 100 seconds = ${avgTime(40, 100)}.`, `Offline: ${big(Math.pow(2, 39))} ÷ 10^10 = ${f1(Math.pow(2, 39) / 1e10)} seconds.`],
      answer: `Online about ${avgTime(40, 100)}; offline under a minute. The same password is safe at the login page and unsafe once the database leaks.`,
    },
    {
      title: "A slower hash",
      q: ["A service switches from a fast hash (10 billion guesses a second) to a slow one that allows only 10,000 guesses a second on the same hardware. How many bits of extra protection is that worth?"],
      steps: ["Speed falls by a factor of 10^10 ÷ 10^4 = 10^6.", `log2(10^6) = ${f1(log2(1e6))}.`],
      answer: `About ${f1(log2(1e6))} bits, as if every user's password had become about four characters longer. The service did it once for everyone.`,
    },
    {
      title: "Reading the checker on Rahul@1995",
      q: ["The checker rated Rahul@1995 as Fair, 60 bits. Estimate its real strength if an attacker tries 10,000 common first names, 10 common symbols and the 100 years from 1930 to 2029."],
      steps: ["Combinations = 10,000 × 10 × 100 = 1,00,00,000 (ten million).", `log2(10^7) = ${f1(log2(1e7))} bits.`, "Allow for capital or lower-case first letter: ×2, one more bit."],
      answer: `About ${f1(log2(2e7))} bits, not 60. At 10 billion guesses a second the whole space takes a fraction of a second.`,
    },
    {
      title: "The famous passphrase",
      q: ["Why does correcthorsebatterystaple score 118 bits on the checker but deserve close to zero?"],
      steps: ["The checker sees 25 lower-case letters: 25 × 4.7 = 117.5 bits.", "Without separators it cannot spot words, so it does not apply its passphrase rule.", "The phrase is famous from a widely shared comic and appears in public password lists, so it would be among the first guesses."],
      answer: "Its entropy as a random string is high, but it was not chosen at random from anything. A published example is a known password.",
    },
    {
      title: "Composition rules and real entropy",
      q: ["A policy requires 8 characters with one capital, one digit and one symbol. Most users write a capitalised word of 6 letters followed by one digit and one symbol. Estimate the real space if attackers use a 50,000-word dictionary."],
      steps: ["Words: 50,000.", "Digit: 10. Symbol: say the 10 most common: 10.", "Total = 50,000 × 10 × 10 = 50,00,000.", `log2(5 × 10^6) = ${f1(log2(5e6))} bits.`],
      answer: `About ${f1(log2(5e6))} bits, against ${f1(bits(8, 95))} for 8 random characters. The rule did not create the strength it was meant to.`,
    },
    {
      title: "Reading a hash length",
      q: ["A SHA-256 output in hexadecimal has 64 characters. Show that this is 256 bits. How long would it be in Base64?"],
      steps: ["Each hex character encodes 4 bits. 64 × 4 = 256.", "256 bits = 32 bytes.", "Base64 writes 3 bytes as 4 characters. 32 bytes = 10 groups of 3 plus 2 bytes; 10 × 4 = 40, plus 4 characters with one padding sign = 44."],
      answer: "256 bits; 44 characters in Base64, ending in one equals sign.",
    },
    {
      title: "Does one character change the hash",
      q: ["The SHA-256 of hello begins 2cf24dba. The SHA-256 of Hello begins 185f8db3. Explain the difference and what it means for checking downloads."],
      steps: ["Hash functions are designed so a one-bit change in the input changes about half of the output bits.", "H and h differ in one bit in ASCII, so the outputs look unrelated.", "This makes a hash a reliable test: if any byte of a download changed, the hash will not match."],
      answer: "A tiny change in input gives an unrelated hash. Comparing hashes is a strong test that two files are identical.",
    },
    {
      title: "Comparing a checksum by eye",
      q: ["You compare only the first 8 hex characters of a SHA-256 checksum. If a file was accidentally corrupted, what is the chance the first 8 characters still match?"],
      steps: ["8 hex characters = 32 bits.", `Chance of a random match = 1 in 2^32 = 1 in ${big(Math.pow(2, 32))}.`],
      answer: "About 1 in 4.3 billion for accidental corruption. For deliberate tampering, compare the whole value, or rely on a signature.",
    },
    {
      title: "MD5 for a password store",
      q: ["A forum stores passwords as MD5 without a salt. Give two separate reasons this is unsafe."],
      steps: ["MD5 is extremely fast, so offline guessing runs at billions of tries a second on ordinary graphics cards.", "Without a salt, every user with the same password has the same hash, and pre-computed tables of common-password hashes match instantly.", "MD5 is also broken against collisions, though that matters more for signatures than for passwords."],
      answer: "Speed and the lack of a salt. Use a slow password-hashing function with a unique salt per user.",
    },
    {
      title: "Salting",
      q: ["Two users both choose sunshine2026. With a unique random salt each, the stored values differ. Why does that matter if one database leaks?"],
      steps: ["Without salts, cracking one hash cracks every account with the same password.", "Pre-computed tables cannot be used, because each salt changes the input.", "The attacker must guess each user's password separately."],
      answer: "Salts force separate work per user and defeat pre-computed tables. They do not make a weak password strong.",
    },
    {
      title: "HMAC on a payment callback",
      q: ["A shop receives the message amount=500&order=ORD-20931 with an HMAC-SHA-256 signature. The shared secret is known only to the shop and the payment gateway. What does checking the HMAC prove?"],
      steps: ["The shop computes HMAC-SHA-256 of the message with its secret.", "If the result matches the signature, only someone with the secret could have produced it.", "Changing the amount to 50 would produce a different HMAC, which the attacker cannot compute without the secret."],
      answer: "That the message came from someone holding the secret and was not changed. It does not hide the message; anyone can read it.",
      solutionCode: "HMAC-SHA-256 with key 'shop-secret':\n173b13623ee47b5bdc15b65b8ebe6233d1d75f97403818e9318c2a8809683ad9",
      solutionCaption: "Output from the site's SHA-256 tool with the HMAC key field filled in.",
    },
    {
      title: "Base64 reversed",
      q: ["A configuration file contains the line token: c2stbGl2ZS00MjQy. Is the token hidden?"],
      steps: ["Base64 decodes c2stbGl2ZS00MjQy to sk-live-4242.", "Anyone with a decoder, including the site's Base64 tool, can do this instantly."],
      answer: "No. It is encoded, not encrypted. Treat the token as published and revoke it.",
    },
    {
      title: "How many accounts reuse puts at risk",
      q: ["Someone uses one password on 12 sites. Each site independently has a 3 percent chance of a breach in a given year. What is the chance at least one leaks this year?"],
      steps: ["Chance none leaks = 0.97^12.", `0.97^12 = ${(Math.pow(0.97, 12)).toFixed(3)}.`, `At least one = 1 − ${(Math.pow(0.97, 12)).toFixed(3)} = ${(1 - Math.pow(0.97, 12)).toFixed(3)}.`],
      answer: `About ${Math.round((1 - Math.pow(0.97, 12)) * 100)} percent a year, and each leak exposes all 12 accounts. With unique passwords, a leak exposes one.`,
    },
    {
      title: "TOTP codes",
      q: ["An authenticator app shows a 6-digit code that changes every 30 seconds. If a site allows 5 attempts per code before locking, what is an attacker's chance of guessing one code?"],
      steps: ["There are 10^6 possible codes.", "Five attempts cover 5 of them.", "Chance = 5 ÷ 10,00,000."],
      answer: "1 in 2,00,000 per code window, before lockout. The real risk is being tricked into typing the code on a fake page.",
    },
    {
      title: "Backup codes",
      q: ["A service gives 10 one-time backup codes, each 8 random digits. Is it safe to store them in the password manager that the second factor protects?"],
      steps: ["If the manager is the only place they exist, losing access to the manager also loses the codes.", "If an attacker gets into the manager, they get both password and codes, which defeats the second factor for that account.", "A printed copy in a safe place at home avoids both problems."],
      answer: "Keep one printed copy outside the manager. Storing a copy inside as well is a convenience trade-off, acceptable only if the manager has its own strong second factor.",
    },
    {
      title: "Blocklist size",
      q: ["A service rejects any new password found in a list of 100 million leaked passwords. If an attacker tries that whole list, what share of a well-chosen 80-bit password space have they covered?"],
      steps: ["10^8 ÷ 2^80.", `2^80 ≈ ${(Math.pow(2, 80)).toExponential(2)}.`, `Share ≈ ${(1e8 / Math.pow(2, 80)).toExponential(1)}.`],
      answer: "Effectively none. A blocklist removes the passwords people actually choose; it does not weaken a random one.",
    },
    {
      title: "Typing cost of a passphrase",
      q: ["Compare typing kV9#mQ2!xLp7 on a phone with typing maple orbit cactus lantern quiet river. Which has more entropy if both were chosen at random, the first from 95 characters, the second from a 767-word list?"],
      steps: [`12 random characters from 95: 12 × ${f1(log2(95))} = ${f1(bits(12, 95))} bits.`, `6 random words from 767: 6 × ${f1(log2(WORDLIST))} = ${f1(6 * log2(WORDLIST))} bits.`, "The first needs several keyboard switches per character on a phone; the second needs none."],
      answer: `The random characters have more (${f1(bits(12, 95))} against ${f1(6 * log2(WORDLIST))}), but adding a seventh word closes most of the gap and stays easy to type.`,
    },
    {
      title: "Lock-screen preview",
      q: ["A bank sends one-time passwords by SMS. Your phone shows message previews on the lock screen. What risk does that create, and what setting fixes it?"],
      steps: ["Anyone holding the locked phone can read the code as it arrives.", "Combined with a password learned elsewhere, that is enough to log in or approve a payment.", "Hide sensitive notification content on the lock screen, or hide previews for the messages app."],
      answer: "A passer-by can read codes without unlocking. Turn off lock-screen previews for messages.",
    },
    {
      title: "Wi-Fi passphrase for a café",
      q: ["A café wants a Wi-Fi password customers can read from a card and type quickly, and that will survive an offline attack on a captured handshake at 1 million guesses a second for at least 100 years on average. How many random words from a 7,776-word list are needed?"],
      steps: ["Seconds in 100 years = 100 × 365 × 24 × 3600 = 3,153,600,000.", "Guesses needed on average = 3.15 × 10^9 × 10^6 = 3.15 × 10^15; total space must be twice that, 6.3 × 10^15.", `log2(6.3 × 10^15) = ${f1(log2(6.3e15))} bits.`, `Words needed = ${f1(log2(6.3e15))} ÷ ${f1(log2(7776))} = ${f1(log2(6.3e15) / log2(7776))}, so ${Math.ceil(log2(6.3e15) / log2(7776))} words.`],
      answer: `${Math.ceil(log2(6.3e15) / log2(7776))} random words. Change it if it is posted where people outside the café can see it.`,
    },
    {
      title: "Lockout policy",
      q: ["A site locks an account for 15 minutes after 5 wrong attempts. How many guesses a day can an online attacker make against one account?"],
      steps: ["Each 15-minute window allows 5 guesses.", "There are 24 × 4 = 96 windows a day.", "96 × 5 = 480."],
      answer: "About 480 guesses a day. Over a year, 1,75,200, which is enough to try the most common passwords but not a random 12-character one.",
    },
    {
      title: "Counting reused passwords",
      q: ["A manager's security report lists 60 saved logins. Twenty-four use one of three passwords. If you fix 6 accounts a week, starting with the most important, how long until none are reused?"],
      steps: ["Accounts sharing a password: 24.", "At 6 a week: 24 ÷ 6 = 4 weeks.", "Do email, bank, phone account and domain or work accounts in week one."],
      answer: "Four weeks. The risk falls fastest in the first week if you start with accounts that can reset others.",
    },
    {
      title: "Recovery key storage",
      q: ["You turn on disk encryption for a laptop and get a 48-digit recovery key. List three places to keep it and one place not to."],
      steps: ["Good: your password manager; a printed sheet with important papers; the account recovery feature of your operating system's online account, if you trust it.", "Bad: a text file on the same laptop, which is locked if you need the key."],
      answer: "Keep two copies, at least one off the laptop. Never only on the device it unlocks.",
    },
    {
      title: "Spot the domain",
      q: ["Which of these addresses belongs to the domain example-bank.in? (a) login.example-bank.in/secure (b) example-bank.in.verify-account.co (c) example-bank-in.com/login"],
      steps: ["The registered domain is read from the right of the host name, just before the first single slash.", "(a) host login.example-bank.in ends in example-bank.in: genuine subdomain.", "(b) host ends in verify-account.co: a different domain using the bank's name at the front.", "(c) host is example-bank-in.com: a different domain."],
      answer: "Only (a).",
    },
    {
      title: "Password length limits",
      q: ["A site says passwords must be 8 to 12 characters. Using all 95 printable characters at the maximum length, what is the most entropy available, and how does that compare with the 80-bit target?"],
      steps: [`12 × log2(95) = ${f1(bits(12, 95))} bits.`],
      answer: `${f1(bits(12, 95))} bits, just under 80. Use the full 12 random characters and add a second factor. A maximum below 64 characters goes against current NIST guidance.`,
    },
    {
      title: "PIN versus pattern",
      q: ["A phone allows a 6-digit PIN or a 3 by 3 swipe pattern. Studies of real patterns find most start in a corner and use 4 to 6 points. Why is the PIN usually the safer choice?"],
      steps: ["A random 6-digit PIN has 10^6 possibilities.", "Patterns are limited by geometry and by habit; the commonly used ones are a small set.", "Patterns also leave smudge trails on the screen and are easy to watch over a shoulder."],
      answer: "A random PIN of 6 or more digits gives more real possibilities and is harder to observe. Avoid dates and repeated digits.",
    },
    {
      title: "Estimating a leaked list attack",
      q: ["An attacker has 10 million leaked email and password pairs and tries each pair once on a popular shopping site. If 2 percent of people reuse the same password there, how many accounts are opened?"],
      steps: ["10,000,000 × 0.02 = 2,00,000."],
      answer: "About 2,00,000 accounts, with no guessing at all. This is why uniqueness matters more than strength for most people.",
    },
    {
      title: "Base64 size growth",
      q: ["A 300 KB image is pasted into an email as Base64 text. About how large is the text?"],
      steps: ["Base64 writes every 3 bytes as 4 characters, an increase of one third.", "300 × 4 ÷ 3 = 400.", "Line breaks add a little more."],
      answer: "About 400 KB. Encoding makes data bigger and no safer.",
    },
    {
      title: "Hash of a file versus its name",
      q: ["Two downloads are named setup.exe. One has SHA-256 beginning 9f2c and the other 9f2c too, but they differ later in the string. Are they the same file?"],
      steps: ["The whole 64-character hash must match.", "Matching the first four characters happens by chance about once in 65,536 comparisons."],
      answer: "No. Different hashes mean different files, whatever the names.",
    },
    {
      title: "Average time in a table",
      q: ["Fill in the average offline time at 10 billion guesses a second for random passwords of 50, 60, 70 and 80 bits."],
      steps: ["Average time = 2^bits ÷ 2 ÷ 10^10 seconds.", `50 bits: ${avgTime(50, 1e10)}.`, `60 bits: ${avgTime(60, 1e10)}.`, `70 bits: ${avgTime(70, 1e10)}.`, `80 bits: ${avgTime(80, 1e10)}.`],
      answer: "Each 10 bits multiplies the time by about 1,000. That is why 80 bits is a comfortable target for important accounts.",
    },
    {
      title: "How many backup codes are left",
      q: ["You used 3 of your 10 backup codes over two years after losing phones. What should you do now, and why?"],
      steps: ["Seven codes remain, but you cannot be sure which you used unless you crossed them off.", "Most services let you generate a fresh set, which cancels the old ones."],
      answer: "Generate a new set, print it, and destroy the old sheet. Then set up a second authenticator device so you rely on codes less.",
    },
    {
      title: "Truncated password",
      q: ["A site silently uses only the first 8 characters of your password. You chose a 6-word passphrase beginning maple-or. How strong is it in practice?"],
      steps: ["Only maple-or is checked.", "That is a common word, a hyphen and two letters, which a guessing program would reach quickly.", "Even if random, 8 characters from 95 would be only about 52 bits."],
      answer: "Very weak. For such a site use 8 or more random characters, add a second factor, and avoid reusing anything there.",
    },
    {
      title: "Two-person rule for admin access",
      q: ["A business wants no single person able to lock everyone out of email. What setup achieves that?"],
      steps: ["Create two named administrator accounts belonging to two different people.", "Give each its own strong password and a security key or passkey.", "Keep printed recovery codes for both in a sealed envelope in the office safe."],
      answer: "Two administrators with separate credentials and stored recovery codes. Either can restore the other.",
    },
  ],

  exercises: {
    warmup: [
      { q: "How many bits does one random lower-case letter carry?", a: `log2(26), about ${f1(log2(26))} bits.` },
      { q: "True or false: a hash can be decoded back to the original text if you know the algorithm.", a: "False. A cryptographic hash is one-way. Short or common inputs can be guessed and checked, which is different from decoding." },
      { q: "Which account's password should be changed first after a reuse leak, and why?", a: "Email, because password resets for other accounts go there." },
      { q: "Name the strongest common second factor against phishing.", a: "A passkey or hardware security key, because it checks the real domain before responding." },
      { q: "Does a private window hide your browsing from your employer's network?", a: "No. It only avoids saving history, cookies and form data on the device after the window closes." },
      { q: "What is the minimum password length NIST SP 800-63B-4 asks services to require when the password is the only factor?", a: "15 characters. When used with another factor, 8." },
      { q: "What does Base64 do?", a: "It encodes bytes as text using 64 characters so they pass through text-only systems. Anyone can reverse it." },
      { q: "How many hex characters are in a SHA-256 output?", a: "64." },
      { q: "What does the padlock in the address bar tell you?", a: "That the connection to the domain shown is encrypted. It says nothing about whether that domain is honest." },
      { q: "On UPI, do you enter your PIN to receive money?", a: "No. Entering a PIN always authorises a payment out of your account." },
      { q: "What is a salt?", a: "A random value stored with each password hash so that identical passwords give different hashes." },
      { q: "Which is reversible by anyone: hashing, encoding or encryption?", a: "Encoding." },
    ],
    practice: [
      { q: "A generated password uses 14 characters from upper, lower and digits (62 options). How many bits?", a: `14 × ${f1(log2(62))} = ${f1(bits(14, 62))} bits.` },
      { q: "Rewrite this policy line to match current guidance: 'Passwords must be changed every 90 days and include a capital, a digit and a symbol.'", a: "For example: 'Passwords must be at least 15 characters. They are checked against a list of leaked and common passwords. They are changed when there is evidence of compromise, not on a schedule.'" },
      { q: "Your manager does not offer to fill your bank login on a page you reached from an email. List the next three things you do.", a: "Do not type anything. Read the domain in the address bar. Close the page and open the bank's app or a saved bookmark to check for any real message." },
      { q: "A friend says her password is strong because a meter rated it 'Very strong'. What two questions would you ask?", a: "Did a generator choose it, or did she? Is it used anywhere else? A meter cannot know either answer." },
      { q: "How many words from a 767-word list do you need for at least 70 bits?", a: `70 ÷ ${f1(log2(WORDLIST))} = ${f1(70 / log2(WORDLIST))}, so ${Math.ceil(70 / log2(WORDLIST))} words.` },
      { q: "You hashed the word apple with SHA-256 and want the word back later. What went wrong in the design?", a: "A hash is a fingerprint. If you need the original later, store it in a password manager or encrypt it with a key you keep." },
      { q: "List four places in a browser's settings worth reviewing twice a year.", a: "Saved passwords, installed extensions, site permissions (camera, microphone, location, notifications), and signed-in sessions or synced devices." },
      { q: "A security question asks for the city you were born in. What do you enter?", a: "A random word or phrase, stored with that login in your password manager." },
      { q: "A caller from 'customer care' asks you to install a support app to fix your account. What do you say and do?", a: "Decline and hang up. Call the organisation on the number from its official website, card or bill. Never install software at a caller's request." },
      { q: "How many bits does a random 10-digit number have?", a: `10 × ${f1(log2(10))} = ${f1(bits(10, 10))} bits.` },
      { q: "Write the leaving checklist for a staff member who had access to the shop's social media and website host.", a: "Disable their accounts; change shared passwords they saw; transfer ownership of the social pages and hosting to a company address; check recovery emails and forwarding; remove their devices and API keys." },
      { q: "Your laptop shows a disk-encryption recovery key during setup. Where do you put it?", a: "In your password manager and on paper with important documents. Not only on the laptop." },
      { q: "A friend saved her bank password in a shared family browser profile. List the risks and the fix.", a: "Anyone using the profile can open the saved password and may find the bank already signed in. Fix: separate profiles or user accounts, remove the saved password from the shared profile, sign out of all sessions and change the password." },
      { q: "Read this address and name the registered domain: https://secure.login.example.in.verify-kyc.org/update", a: "verify-kyc.org. Everything to its left was chosen by the owner of verify-kyc.org." },
      { q: "A website tells you your new password must not contain spaces and must be at most 12 characters. What does that suggest about the site, and what do you do?", a: "It may store or process passwords poorly and does not follow current guidance. Use 12 random characters from the manager, add a second factor if offered, and keep nothing sensitive there." },
    ],
    stretch: [
      { q: "An attacker steals a database protected by a slow hash allowing 1,000 guesses a second per graphics card and has 100 cards. How long on average for a random 10-character password from 62 characters?", a: `Bits = ${f1(bits(10, 62))}. Rate = 1,00,000 a second. Average time = 2^${f1(bits(10, 62))} ÷ 2 ÷ 10^5, about ${avgTime(bits(10, 62), 1e5)}.` },
      { q: "Explain why changing Summer2026! to Monsoon2026! after a breach does little.", a: "Attackers who have the old password try predictable variations first: other seasons, the next year, a different symbol. A new password should be unrelated, ideally generated." },
      { q: "Your college forces 8-character passwords with SMS as the only second factor. Write a short, polite request to the IT office asking for two improvements, with reasons.", a: "Ask for authenticator-app or passkey sign-in, because SMS can be redirected by SIM swap; and for a longer maximum length that allows passphrases, because length adds more protection than composition rules. Cite NIST SP 800-63B-4 as a public reference." },
      { q: "A file's published SHA-256 matches the one you computed, but the download page itself was on an unfamiliar mirror. What does the match prove, and what would prove more?", a: "It proves the file matches what that mirror published. If the mirror is malicious it could publish a matching hash. A hash from the publisher's own site, or a valid digital signature checked by your operating system, proves more." },
      { q: "Estimate the entropy of a password made of a 6-digit date (DDMMYY) followed by a 4-digit PIN.", a: `About 36,500 plausible dates in 100 years and 10,000 PINs: 3.65 × 10^8 combinations, log2 about ${f1(log2(3.65e8))} bits.` },
      { q: "Why is an authenticator code still phishable while a passkey is not?", a: "A code is just six digits; a fake page can ask for it and forward it to the real site within 30 seconds. A passkey signs a challenge that includes the real site's domain, so a fake domain gets nothing usable." },
      { q: "Design a sharing rule for a family of four for streaming, banking, email and a shopping account with a saved card.", a: "Streaming: one generated password shared through the manager, changed if someone leaves. Shopping with saved card: one owner, not shared. Email and banking: personal, each with its own second factor, never shared." },
      { q: "A site truncates passwords silently after 16 characters. What risk does that create for a 30-character passphrase?", a: "Only the first 16 characters count, so the effective strength is that of the first 16. If those are common words, the password is far weaker than it looks. Prefer random characters for such sites, and report the limit." },
      { q: "Estimate how many guesses a day an attacker gets against an account that allows 10 attempts per hour with no lockout.", a: "240 a day, about 87,600 a year. Enough for common passwords, nowhere near enough for a random one." },
      { q: "Describe how a forwarding rule can keep an attacker in your email after you change the password.", a: "The rule sends copies of incoming mail, including reset links and OTPs, to the attacker's address. The password change does not remove it. Always check forwarding rules after a compromise." },
      { q: "Your manager says 14 of your passwords appeared in known breaches. Plan the order in which you fix them.", a: "First any that are also used elsewhere, then email, banking, phone operator and work accounts, then shopping accounts with saved cards, then the rest. Delete accounts you no longer need instead of fixing them." },
    ],
    challenge: [
      { q: "A small business has six staff, one shared accounting login and email on a common provider. Draw up a one-page security plan in priority order.", a: "1. Individual email accounts with passkeys or authenticator apps. 2. A team password manager with shared vaults by role. 3. Individual logins for the accounting system if it allows; if not, the shared login lives only in the manager and is changed when anyone leaves. 4. Remove old staff the same day. 5. Review extensions and admin accounts quarterly. 6. Printed recovery codes for the owner's email kept in the office safe." },
      { q: "Argue for and against writing a master passphrase on paper at home.", a: "For: home burglary aimed at reading notes is rare, and a forgotten master passphrase locks you out of everything. Against: anyone in the household or a visitor could read it, and a single card has no backup. A reasonable middle: write it, store it with other important papers, and tell one trusted person where." },
      { q: "A strength checker could be improved in three ways. Suggest them and say what each would catch that the current one misses.", a: "A large breach-list check would catch leaked passwords. A dictionary of names, places and famous phrases would catch Rahul@1995 and correcthorsebatterystaple. Pattern rules for word-symbol-number endings would catch Mumbai#123 and Summer2026!." },
      { q: "When is SMS as a second factor the right choice despite its weaknesses?", a: "When the person has no smartphone, cannot install an app, or the service offers nothing else. It still blocks attackers who only have the password. Pair it with an operator SIM-change lock and lock-screen previews turned off." },
      { q: "Plan a move from passwords to passkeys for a parent with one phone. What could go wrong, and how do you prevent it?", a: "Losing or breaking the only phone would lock them out. Register a second device or security key for email first, print backup codes, keep the password as a recovery route until the second device works, and test recovery once together." },
      { q: "Write a one-page family security agreement covering phones, payments and calls.", a: "Include: every phone has a 6-digit or longer PIN; email and bank passwords are unique and saved in the manager; nobody shares OTPs or PINs with anyone; calls about banks, parcels, bills or police are ended and checked by calling the official number; one named person to call before acting; the fraud helpline 1930 written by the phone." },
      { q: "A small online shop asks whether it should build its own login or use a sign-in provider. Give the main security arguments on each side.", a: "Own login: full control, but the shop must store passwords correctly with a slow salted hash, handle resets, lockouts and second factors, and protect the database. Provider: those problems are handled by specialists and passkeys come built in, but the shop depends on the provider and shares some customer data with it. For a small team, a provider is usually safer." },
      { q: "Explain to someone who distrusts technology why a password manager is safer than memorising five passwords and reusing them.", a: "Reuse means one leak opens many accounts, and leaks happen to sites you cannot control. A manager lets every account have its own long password, so a leak stays contained. The manager itself is protected by one strong passphrase you know and a second factor, and it refuses to fill passwords on fake sites." },
    ],
  },

  faqs: [
    {
      group: "Choosing passwords",
      items: [
        ["How long should a password be?", "At least 15 characters for anything protected only by the password, and 16 or more random characters when a manager fills it. For a passphrase, use five or six random words. Length adds more protection than any mix of symbols."],
        ["Is a passphrase better than a random string?", "For anything you type, yes, because a long passphrase is as strong as a shorter random string and much easier to enter. For anything a manager fills, a random string is fine. Both must be chosen at random to be strong."],
        ["Can I make my own passphrase from a favourite song line?", "No. Song lines, proverbs, film quotes and famous phrases are in guessing lists. A passphrase is strong only when the words were picked at random, by dice or a generator."],
        ["Do symbols make a password strong?", "They add a little. A symbol in a predictable place, such as an @ instead of a or an exclamation mark at the end, adds almost nothing because attackers try those first. Extra length adds more."],
        ["Should I use my birth year or phone number?", "No. Years, dates and phone numbers are among the first things guessing programs try, and they are often public. The site's checker warns about anything that looks like a year."],
        ["How often should I change my passwords?", "When there is a reason: a breach notice, a shared device, someone leaving a team, or anything suspicious. Scheduled changes push people into patterns and are no longer recommended by NIST."],
        ["Is it safe to reuse a strong password on unimportant sites?", "No. Unimportant sites are breached more often and the leaked password is then tried on important ones. Every site gets its own password; a manager makes that easy."],
        ["What makes a password unique enough?", "It should not be a variation of another of your passwords. Bank2026 and Shop2026 are not unique in any useful sense. Generated passwords are unique by design."],
        ["Can I use the same passphrase with a different number for each site?", "No. Anyone who sees one of them can guess the pattern. Sites leak plain passwords more often than you would hope, and attackers look for exactly this kind of family resemblance. Each password should be unrelated to the others."],
        ["Is it fine to write passwords in a notebook?", "A notebook at home is safer than reuse, because the threat to most people is online, not a burglar. It is weaker than a manager because it cannot generate passwords, cannot fill them, and can be lost. If you use one, keep it out of sight and do not carry it."],
        ["What should my password manager's master password look like?", "A passphrase of six or more random words that you can type without looking, used nowhere else. Write it down once and store it with your important papers until you know it by heart."],
        ["Is a longer PIN worth it on a phone?", "Yes, if the phone allows it. A 6-digit PIN has a million combinations against ten thousand for 4 digits, and the phone's attempt limits make each extra digit count."],
        ["What about the Wi-Fi password?", "Use a long passphrase people can type, at least 15 characters. Change it if someone who should not have it does. The router's admin password should be different and random."],
      ],
    },
    {
      group: "Strength meters",
      items: [
        ["Why did two checkers give my password different scores?", "Each uses its own formula and word lists. Some only count length and character types; better ones look for words, names and patterns. Treat any score as a rough guide, not a measurement."],
        ["Can the site's checker tell if my password was leaked?", "No. It has a short list of the most common passwords, not a breach database. A long unique password is the practical defence against leaks."],
        ["Why does the checker call correcthorsebatterystaple very strong?", "It sees 25 lower-case letters and calculates about 118 bits. It does not know that this exact phrase is famous and appears in public password lists."],
        ["What do the online and offline times mean?", "Online assumes 100 guesses a second at a login page that limits attempts. Offline assumes a stolen database and 10 billion guesses a second on a fast hash. The offline figure is the one that matters if a site leaks."],
        ["Is it safe to type my real password into a strength checker?", "On this site the check runs in your browser and nothing is sent. Still, it is better to generate a new password than to test one you use, because you cannot verify every site behaves the same way."],
        ["Why does my password say Fair when it has 60 bits?", "The checker groups results: under 28 bits very weak, under 40 weak, under 60 fair, under 80 strong, 80 and above very strong. 60 sits at the edge between fair and strong."],
        ["The checker warns about a year in my password. Does that matter?", "Yes. Years are tried early in every attack, especially recent ones and birth years. Remove it or replace the password with a generated one."],
        ["Does the checker store what I type?", "No. The calculation runs on your device. You can confirm by watching the Network tab in your browser's developer tools while you type."],
      ],
    },
    {
      group: "Managers and second factors",
      items: [
        ["Is a password manager safe if it holds everything?", "It concentrates risk, but it removes the much bigger risk of reuse. Protect it with a long passphrase and its own second factor, and keep a recovery method somewhere safe. For most people that is a large improvement."],
        ["Is the browser's built-in manager good enough?", "For most people, yes. It is far better than reuse. A separate manager helps if you use different browsers or phones from different makers, or need to share passwords with family or a team."],
        ["What happens if I forget the master password?", "Many managers cannot recover it, by design. Set up the recovery option the manager offers when you create the account, and keep a written copy of the master passphrase with your important papers."],
        ["Which second factor should I use?", "A passkey or security key where offered, then an authenticator app, then push approval, then SMS. Any second factor is better than none."],
        ["Why is SMS considered weak?", "Codes can be redirected by a SIM swap, intercepted on some networks, or read on a lock screen. It still stops attackers who only have the password, so keep it if nothing better is offered."],
        ["What are backup codes for?", "They let you sign in if you lose your phone or authenticator. Save them when you turn on a second factor, print a copy, and store it somewhere other than the phone."],
        ["What is a passkey?", "A login credential made of a key pair. Your device keeps the private key and unlocks it with your fingerprint, face or PIN. The site holds only the public key, so there is no password to steal or type into a fake page."],
        ["Can I use passkeys on more than one device?", "Yes. Passkeys can sync through your phone platform or password manager, and you can register more than one device or a security key. Do that before relying on a passkey for email."],
        ["I keep getting login approval prompts I did not request. What do I do?", "Deny them all and change the password for that account immediately, because someone has it. Repeated prompts are an attack that hopes you will approve one by mistake."],
      ],
    },
    {
      group: "Hashes and encoding",
      items: [
        ["What is a hash?", "A fixed-length fingerprint of some data. The same input always gives the same hash, a tiny change gives a completely different one, and you cannot work backwards from the hash to the input."],
        ["Is SHA-256 good for storing passwords?", "Not on its own. It is too fast and, without a salt, identical passwords give identical hashes. Password storage needs a slow function such as bcrypt, scrypt or Argon2, with a unique salt per user."],
        ["Is MD5 still useful?", "For spotting accidental corruption, yes. For anything where someone might tamper on purpose, or for passwords, no. Use SHA-256 for file checks."],
        ["What is the difference between hashing, encoding and encryption?", "Hashing makes a one-way fingerprint. Encoding, such as Base64, changes the format and anyone can reverse it. Encryption locks data so only someone with the key can read it."],
        ["Why does the SHA-256 of an empty string have a value?", "A hash function always produces output. The empty input happens to give e3b0c442 and so on. Seeing that value often means a program hashed nothing by mistake."],
        ["What is HMAC?", "A hash mixed with a secret key. It proves a message came from someone who knows the key and was not changed. Payment gateways and webhooks use it to sign callbacks."],
        ["How do I check a download's checksum?", "Compute the SHA-256 of the file you downloaded and compare it with the value on the publisher's own website. Every character must match. A mismatch means the file is different."],
        ["Can two different files have the same SHA-256?", "In theory, because there are more possible files than hashes. In practice nobody has found two, and doing so deliberately is far beyond current computers."],
        ["Does Base64 make a secret safe to share?", "No. It only changes the format. Anyone can decode it in seconds. Treat a Base64 secret exactly like the plain secret."],
      ],
    },
    {
      group: "Browser privacy",
      items: [
        ["What does a private window actually do?", "It does not save history, cookies, site data or form entries after you close all private windows. It does not hide what you do from the sites themselves, your network, or your internet provider."],
        ["Should I clear cookies regularly?", "Clearing them logs you out and resets preferences. It is useful on a shared device or after removing a suspicious extension. Blocking third-party cookies is a better everyday setting than clearing everything."],
        ["Are browser extensions dangerous?", "Those with permission to read all sites can see what you type. Install only what you need, from publishers you can name, and remove extensions you no longer use."],
        ["Why does a site want to send notifications?", "To bring you back with alerts on your screen. Most sites do not need it. Block notification requests by default and allow only the few you want."],
        ["Does a browser tool upload what I type?", "Tools that run in the browser, like this site's password and hash tools, process everything on your device. You can check by watching the Network tab while using the tool."],
        ["Is it safe to save passwords in the browser on a shared family computer?", "Only if each person has their own profile or user account on the computer. Otherwise everyone using the profile can open the saved passwords."],
        ["Should I sign out of sites every time?", "On your own locked devices, staying signed in is fine. On shared or public devices, always sign out and close private windows, then check your account's device list from your own phone."],
        ["What is a third-party cookie?", "A cookie set by a domain other than the one in the address bar, such as an ad network embedded in the page. It was used to recognise you across many sites. Most browsers now restrict it."],
        ["Why does my browser show an address starting with xn--?", "That is how browsers display domain names containing characters from other alphabets. It is normal for some sites, but if you expected a plain English address for your bank or shop, it may be a look-alike. Check before you type anything."],
        ["Should I let the browser remember payment cards?", "It is convenient and usually needs the card's security code or a device unlock to use. On a shared device or profile, do not save cards. On your own locked device it is a reasonable choice."],
        ["What does 'Sign out of all sessions' do?", "It ends every logged-in copy of that account on every device, forcing each to log in again. Use it after a lost phone, a shared computer, or any suspicion that someone else is signed in."],
        ["Does a VPN make my passwords safer?", "Not much. A VPN changes who can see your traffic on the network, which helps on untrusted Wi-Fi, but sites already encrypt logins with HTTPS. It does nothing against reuse, phishing or a weak password."],
        ["How do I see which sites can use my camera or location?", "Open the browser's settings, find site settings or permissions, and review camera, microphone, location and notifications. Remove any site you do not recognise or no longer use."],
      ],
    },
    {
      group: "After a breach",
      items: [
        ["A site emailed to say it was breached. What now?", "Change that site's password, then change it on every other site where you used the same or a similar one, starting with email and banking. Turn on a second factor where available. Watch for phishing that mentions the breach."],
        ["How do I know if my email appeared in a breach?", "Reputable breach-notification services let you check an email address against known breaches. Your password manager may also warn about exposed or reused passwords."],
        ["Someone logged into my email. What is the order of repair?", "Change the email password from a clean device, sign out all other sessions, add or reset the second factor, check forwarding rules and recovery details for changes, then reset passwords for accounts whose reset emails go there."],
        ["Should I tell my bank if my email was hacked?", "Yes, if bank alerts or resets go to that email, or if you see transactions you did not make. Use the number on your card or the bank's app, not a number from an email."],
        ["Do I need to change passwords after removing a bad extension?", "Change passwords you typed while it was installed, starting with email and banking, because it may have read them."],
      ],
    },
    {
      group: "Phones and payments",
      items: [
        ["A caller knows my name and last four card digits. Is it really my bank?", "Not necessarily. Those details leak in many ways. Banks do not ask for OTPs, PINs or full card numbers on calls they make. Hang up and call the number printed on your card."],
        ["Is it safe to save cards in shopping apps?", "It is convenient and usually protected by tokenisation and a second check at payment. The risk is someone with access to the account. Protect those accounts with unique passwords and a phone lock, and remove cards from apps you rarely use."],
        ["Should I use biometrics or a PIN to unlock my phone?", "Use both: a strong PIN as the base, because it protects the encryption, and fingerprint or face for convenience. Biometrics can be forced in some situations; a PIN cannot be taken from your finger."],
        ["What is a SIM PIN?", "A code on the SIM card itself, asked for when the phone restarts or the SIM moves to another phone. It stops a thief using your number for OTPs in their own handset."],
        ["I scanned a QR code and entered my UPI PIN to receive money. What happened?", "You paid. Receiving money never needs a PIN. Report it immediately on 1930 or cybercrime.gov.in and to your bank, with the transaction reference."],
        ["Are apps that ask to read SMS dangerous?", "Many legitimate apps read SMS to fill OTPs automatically. A game, flashlight or loan app asking for it is suspicious, because it could read your bank codes. Deny it unless the app clearly needs it."],
        ["What is the cyber-fraud helpline number in India?", "1930, run under the Ministry of Home Affairs. You can also report at cybercrime.gov.in. Call quickly; the first hours give the best chance of stopping the money."],
      ],
    },
    {
      group: "Work and teams",
      items: [
        ["Should a team share one login for a service?", "Only if the service gives no way to add users. Then keep the password in a team vault in a password manager, never in chat, and change it whenever someone with access leaves."],
        ["Is it safe to keep API keys in a private repository?", "No. Private repositories are cloned to laptops, shared with contractors and sometimes made public by mistake. Keep keys in environment variables or a secret store, and rotate any key that has ever been committed."],
        ["Who should own the company domain name?", "An email address the business controls, not a staff member's personal address, with at least two people able to recover it. Losing the domain means losing email and website together."],
        ["How often should a team review access?", "When anyone joins or leaves, and once a quarter otherwise. Remove accounts and devices that are no longer needed, and rotate shared secrets."],
        ["What is the most important account to protect in a small business?", "The main email administrator account, followed by the domain registrar. Either can be used to reset or take over almost everything else."],
      ],
    },
    {
      group: "Encryption and files",
      items: [
        ["Is my phone encrypted?", "Modern Android phones and iPhones encrypt storage once a screen lock is set. The strength depends partly on that lock, so use a 6-digit or longer PIN."],
        ["How do I send a scanned ID document safely?", "Use the organisation's own secure upload if it has one. Otherwise send it in a password-protected file and give the password by phone or another channel, never in the same email."],
        ["Are cloud backups of my chats encrypted?", "It depends on the app and the setting. Some apps offer end-to-end encrypted backups that you must turn on and protect with a password. Without it, the backup may be readable by the cloud provider."],
        ["Is a password-protected PDF secure?", "Reasonably, if made with modern software and a long generated password. With a short or guessable password such as a date of birth, it can be opened quickly by guessing tools."],
      ],
    },
  ],

  glossary: [
    ["Argon2", "A modern slow password-hashing function designed to use memory as well as time, which makes guessing on graphics cards expensive."],
    ["Authenticator app", "An app that shows a short code which changes every 30 seconds, based on a secret shared with the site when you set it up."],
    ["Base64", "An encoding that writes bytes using 64 text characters. It is reversible by anyone and provides no secrecy."],
    ["bcrypt", "An older but still sound slow password-hashing function with a built-in salt and a tunable work factor."],
    ["Bit", "A single binary choice. Each bit of entropy doubles the number of guesses an attacker needs."],
    ["Blocklist", "A list of passwords a service refuses, such as leaked, common or context-specific ones."],
    ["Breach", "An incident in which a service's data, often including password hashes, is taken by someone not allowed to have it."],
    ["Brute force", "Trying every possible combination. Attackers use it last, after lists and patterns."],
    ["Checksum", "A value computed from a file so that changes can be detected. SHA-256 is a common checksum."],
    ["Composition rule", "A policy requiring certain character types. Current NIST guidance says services should not impose them."],
    ["Cookie", "A small piece of data a site stores in your browser and receives back on later visits, used for logins and preferences."],
    ["Credential stuffing", "Trying username and password pairs leaked from one site on many other sites."],
    ["Encoding", "Changing data from one format to another, such as text to Base64. It can be reversed without a key."],
    ["Encryption", "Locking data so it can only be read with a key."],
    ["Entropy", "A measure of unpredictability, given in bits. A random password of n bits needs up to 2^n guesses."],
    ["Extension", "An add-on that changes how the browser behaves. Some can read every page you open."],
    ["Hash", "A one-way fixed-length fingerprint of data. The same input always gives the same output."],
    ["HMAC", "A hash computed with a secret key, used to prove a message is authentic and unchanged."],
    ["MD5", "An old, fast hash function broken for security uses. Still seen for simple file checks."],
    ["Multi-factor authentication", "A login that needs two or more different kinds of proof, such as a password and a phone."],
    ["Offline attack", "Guessing against stolen password hashes on the attacker's own hardware, with no rate limit."],
    ["Online attack", "Guessing through a real login page, where the service can slow or block attempts."],
    ["Passkey", "A login credential based on a key pair stored on your device and unlocked with biometrics or a PIN."],
    ["Passphrase", "A password made of several words. Strong only when the words are chosen at random."],
    ["Password manager", "Software that generates, stores and fills passwords, protected by one master password."],
    ["Phishing", "Tricking someone into entering credentials on a fake site or sharing a code."],
    ["Private window", "A browser mode that does not keep history, cookies or form data after the window closes."],
    ["Salt", "A random value stored with each password hash so identical passwords produce different hashes."],
    ["SHA-256", "A widely used cryptographic hash giving a 256-bit output, written as 64 hexadecimal characters."],
    ["SIM swap", "Taking over a phone number by persuading the operator to move it to a new SIM."],
    ["Third-party cookie", "A cookie set by a domain other than the site in the address bar, historically used for cross-site tracking."],
    ["Domain", "The registered name of a website, read from the right of the host name, such as example.in."],
    ["Emergency access", "A password-manager feature letting a trusted person request access after a waiting period that the owner can refuse."],
    ["Forwarding rule", "An email setting that copies incoming messages to another address. Attackers add them to keep reading reset emails."],
    ["Host name", "The full name of a server in an address, including subdomains, such as netbanking.example.in."],
    ["Look-alike domain", "A domain made to resemble a real one, using swapped or similar-looking characters."],
    ["OTP", "One-time password: a short code valid for one action, sent by SMS, email or shown in an app."],
    ["Recovery key", "A long code that unlocks encrypted storage or an account if the normal password or device is lost."],
    ["SIM PIN", "A code that protects the SIM card itself, asked for when the phone restarts or the SIM is moved."],
    ["Subdomain", "A name to the left of the registered domain, chosen by the domain's owner, such as login in login.example.in."],
    ["UPI collect request", "A request for payment sent to your UPI app. Approving it with your PIN sends money out."],
  ],

  references: [
    { title: "NIST Special Publication 800-63B-4, Authentication and Authenticator Management", who: "National Institute of Standards and Technology, U.S. Department of Commerce, August 2025", where: "csrc.nist.gov, search for SP 800-63B-4", note: "The source for the 15-character minimum, the ban on composition rules and scheduled changes, blocklists, and support for paste and password managers." },
    { title: "FIPS 180-4, Secure Hash Standard", who: "National Institute of Standards and Technology", where: "csrc.nist.gov", note: "Defines SHA-1 and the SHA-2 family, including SHA-256, SHA-384 and SHA-512." },
    { title: "RFC 2104, HMAC: Keyed-Hashing for Message Authentication", who: "Internet Engineering Task Force", where: "rfc-editor.org", note: "The original definition of HMAC used to sign webhooks and payment callbacks." },
    { title: "RFC 4648, The Base16, Base32, and Base64 Data Encodings", who: "Internet Engineering Task Force", where: "rfc-editor.org", note: "Explains exactly what Base64 does, which is why it provides no secrecy." },
    { title: "RFC 9106, Argon2 Memory-Hard Function for Password Hashing", who: "Internet Engineering Task Force", where: "rfc-editor.org", note: "Specification of Argon2, a recommended function for storing passwords." },
    { title: "OWASP Password Storage Cheat Sheet", who: "Open Worldwide Application Security Project", where: "cheatsheetseries.owasp.org", note: "Practical guidance for developers on salts, work factors and choosing a password-hashing function." },
    { title: "Passkeys overview", who: "FIDO Alliance", where: "fidoalliance.org/passkeys", note: "How passkeys work and which platforms support them." },
    { title: "CERT-In advisories and security guidelines", who: "Indian Computer Emergency Response Team, Ministry of Electronics and Information Technology", where: "cert-in.org.in", note: "India's national agency for cyber security incidents, with advisories and reporting channels." },
    { title: "Reporting cyber fraud in India", who: "National Cyber Crime Reporting Portal, Ministry of Home Affairs", where: "cybercrime.gov.in, helpline 1930", note: "Where to report online financial fraud quickly. Report within hours where possible." },
  ],
};
