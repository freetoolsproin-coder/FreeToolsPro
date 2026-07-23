export default {
  "/text-tools/word-counter": {
    paragraphs: [
      "A Word Counter tallies text you paste or type: words, characters with and without spaces, sentences, and paragraphs. Writers, students, and editors use it when a brief, essay, or caption must stay inside a hard limit. Social posts, grant forms, and academic abstracts punish overruns, so a live count beats guessing from a status bar that may hide or lag.",
      "The tool treats whitespace as the main word boundary and splits sentences on terminal punctuation. Paragraph breaks usually follow blank lines or hard returns. Character totals include letters, digits, and symbols; the space-excluded figure helps when a CMS counts every glyph toward an SEO title or meta description. FreeToolsPro runs this math in the browser so drafts need not leave your machine for a simple tally.",
      "Counts update as you edit, which makes the counter useful during revision, not only at the end. Trim fluff until a headline fits, expand a thin paragraph to meet a minimum, or confirm a client brief still matches the agreed length after a late rewrite.",
    ],
    sections: [
      {
        title: "What the numbers mean",
        paragraphs: [
          "Word count is an estimate based on whitespace splits. Hyphenated compounds and contractions may count as one or two tokens depending on the splitter. Sentence count rises when periods appear in abbreviations or decimals, so treat that figure as guidance. Paragraph count tracks structural breaks; a long block with soft wraps still registers as one paragraph.",
          "Character counts matter for platforms that cap bytes or glyphs: short posts, SMS gateways, and form fields with maxlength. Knowing both with-spaces and without-spaces totals prevents surprises when a publisher strips spaces or a search snippet truncates mid-phrase.",
        ],
      },
      {
        title: "Who benefits most",
        paragraphs: [
          "Students verifying essay minimums, freelancers billing by word, and marketers sizing blog posts all rely on fast counts. UX writers check microcopy against design constraints. Translators compare source and target length when a UI string must not overflow a button.",
          "Journalists convert word estimates into column space; a counter gives a repeatable baseline. Teachers use it to show how revision shortens or expands a draft without opening a full office suite.",
        ],
      },
      {
        title: "Using the counter wisely",
        paragraphs: [
          "Paste clean text when possible. Markdown, HTML tags, and citation markers inflate characters and can skew word totals if you leave markup in the box. Strip footnotes and captions the publisher counts separately. For bilingual drafts, count each language block on its own.",
          "Recheck after track-changes cleanup and after exporting from Docs or Word, because hidden characters sometimes survive copy-paste. If a client quotes a different number, ask which tool and options they used before arguing over a handful of words.",
        ],
      },
      {
        title: "Limits and caveats",
        paragraphs: [
          "No browser counter replaces a publisher style guide. Some venues exclude titles, abstracts, or references from the official total. Others count words inside tables and figure legends. Always confirm the rule set for the portal you care about.",
          "Very large pastes may feel sluggish on low-end devices. The tool does not score readability, grade level, or plagiarism. It cannot tell whether your sentences are clear—only how many of them you wrote.",
        ],
      },
    ],
  },
  "/text-tools/grammar-checker": {
    paragraphs: [
      "A Grammar Checker reviews drafted prose for spelling mistakes, shaky punctuation, and common writing errors readers notice before they notice your ideas. It highlights suspect words and phrases so you can fix them before sending mail, publishing a post, or submitting schoolwork. The goal is clearer sentences, not a machine that rewrites your voice.",
      "Paste or type a passage, then scan suggestions for misspellings, missing commas, subject-verb clashes, and repeated words. Some checks flag informal tone or weak constructions when the mode supports it. FreeToolsPro keeps the flow simple: review each hint, accept what helps, and ignore anything that fights your intended style.",
      "Good checking is iterative. Run a pass after the first draft, another after you cut filler, and a final skim on the opening and closing paragraphs where first impressions form. Pair the tool with a human read-aloud when stakes are high; ears catch rhythm problems algorithms miss.",
    ],
    sections: [
      {
        title: "What it catches and what it misses",
        paragraphs: [
          "Spelling engines catch typos and many out-of-dictionary words. Punctuation helpers look for missing terminal marks, unbalanced quotes, and comma splices that turn two clauses into a run-on. Grammar rules cover agreement, tense consistency, and basic article use in ordinary English.",
          "Idioms, brand names, and niche jargon often look wrong to a general dictionary. Poetry, dialogue, and dialect may trip false alarms on purpose. Technical papers with equations or code snippets need care so the checker does not mangle intentional syntax.",
        ],
      },
      {
        title: "Who should use it",
        paragraphs: [
          "Non-native writers use it as a safety net before client delivery. Native speakers use it when fatigue lets small errors slip through. Support teams standardize ticket replies; marketers polish landing-page copy; students clean essays before deadline pressure peaks.",
          "Editors still own final judgment. The checker speeds the first pass so humans spend time on argument, structure, and facts instead of hunting stray apostrophes.",
        ],
      },
      {
        title: "How to review suggestions well",
        paragraphs: [
          "Read the surrounding sentence before accepting a fix. Autocorrect-style replacements can invent the wrong word that happens to be spelled correctly. Prefer suggestions that preserve meaning over ones that only sound formal. Keep a short ignore list for product names you use often.",
          "Work in short chunks when the draft is long. Fatigue makes you click Accept everywhere. After bulk edits, reread transitions between paragraphs; grammar fixes can leave abrupt jumps that an error count will not show.",
        ],
      },
      {
        title: "Privacy and practical limits",
        paragraphs: [
          "Treat sensitive text with care. Contracts, medical notes, and unpublished manuscripts may not belong in any online box under your policy. Prefer local or session-only processing when your organization forbids sending drafts to third parties.",
          "A checker will not verify facts, citations, or legal wording. It will not guarantee a perfect grade. British and American spelling differ; pick one variety and stay consistent. Extreme slang and incomplete UI microcopy may need manual override.",
        ],
      },
    ],
  },
  "/text-tools/lorem-ipsum-generator": {
    paragraphs: [
      "A Lorem Ipsum Generator produces placeholder Latin-style text for layouts, wireframes, and mockups when real copy is not ready. Designers and front-end developers drop filler into pages so spacing, typography, and column balance can be judged without waiting on final wording. The scrambled classic look signals temporary content and stops stakeholders from debating unfinished phrases.",
      "Choose how many paragraphs, sentences, or words you need, then copy the output into a design tool, CMS draft, or HTML prototype. Length controls matter: a hero needs a short line; a blog template needs several blocks. FreeToolsPro makes generating that filler quick so you can focus on structure instead of inventing nonsense by hand.",
      "Placeholder text is a stand-in, not a substitute for real messaging. Replace it before usability tests with customers and before any public launch. Leaving lorem in production confuses visitors and hurts trust, SEO, and accessibility reviews that expect meaningful language.",
    ],
    sections: [
      {
        title: "Why designers still use filler",
        paragraphs: [
          "Real copy varies wildly in length. Early layouts need predictable bulk so grids, line heights, and truncation rules can be tuned. Latin-like filler avoids accidental meaning that English dummy sentences sometimes create when a client reads them as final claims.",
          "Mockups for apps, emails, and print pieces benefit from consistent paragraph shapes. Generators let you refresh text between versions so reviewers do not memorize leftover phrases from yesterday’s slide and treat them as approved.",
        ],
      },
      {
        title: "Practical workflow tips",
        paragraphs: [
          "Match the approximate length of the real content you expect. A product description that will be two sentences should not be filled with six long paragraphs, or the design will look wrong when true copy arrives. Generate separate snippets for titles, body, and captions.",
          "In HTML prototypes, keep placeholder strings in clearly named components so search-and-replace is safe later. In Figma or similar tools, store a text style with sample lorem so every card inherits the same metrics. Label draft frames so nobody quotes the Latin aloud in a meeting.",
        ],
      },
      {
        title: "Accessibility and review hygiene",
        paragraphs: [
          "Screen reader users hear placeholder Latin as real language noise. Hide decorative filler from assistive tech when possible, or use visibly marked sample data that announces itself as temporary. Color contrast and font size still matter even when words are fake.",
          "Before handoff, run a project-wide search for “lorem” and “ipsum”. Staging sites often ship with forgotten blocks. QA checklists should include a no-placeholder gate alongside broken-link checks.",
        ],
      },
      {
        title: "Limits of generated text",
        paragraphs: [
          "Classic lorem does not stress-test character sets, right-to-left scripts, or long German compounds. If your product ships in multiple locales, also try realistic samples in those languages. Filler will not reveal awkward breaks in CJK text or emoji-heavy captions.",
          "Some generators repeat patterns; very long outputs may feel cyclic. That is fine for spacing tests but poor for screenshots meant to look finished. Never use placeholder paragraphs as SEO body copy. They exist to hold space until writers deliver the real thing.",
        ],
      },
    ],
  },
};
