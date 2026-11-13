// Turns one book's material into the chapters the renderer lays out.
// Every book has the same back half: situations, worked problems, exercises at
// four levels with answers, reader questions, a glossary and references.
import { coreFor } from "./core/index.mjs";

const LEVELS = [
  ["warmup", "Warm-up", "Quick checks of a single idea. If one of these is hard, re-read the chapter it comes from before moving on."],
  ["practice", "Practice", "The everyday version of the task, with one or two moving parts."],
  ["stretch", "Stretch", "Several steps, or a detail that is easy to miss. Write your working down."],
  ["challenge", "Challenge", "Open questions with more than one defensible answer. The answer section shows one good way through, not the only one."],
];

function scenarioBlock(s, i) {
  return {
    heading: `Situation ${i + 1}: ${s.title}`,
    paragraphs: s.paragraphs,
    bullets: s.bullets,
    steps: s.steps,
    table: s.table,
    tables: s.tables,
    code: s.code,
    codeCaption: s.codeCaption,
    codes: s.codes,
    after: s.after,
    note: s.lesson ? `What to take from it: ${s.lesson}` : s.note,
  };
}

function problemBlock(p, i) {
  return {
    heading: `Problem ${i + 1}: ${p.title}`,
    paragraphs: p.q,
    code: p.code,
    codeCaption: p.codeCaption,
    table: p.qtable,
    sections: [
      {
        label: "Working",
        paragraphs: p.work,
        steps: p.steps,
        table: p.table,
        codes: p.solutionCode ? [{ code: p.solutionCode, caption: p.solutionCaption }] : undefined,
        note: `Answer: ${p.answer}`,
      },
    ],
  };
}

function toolsChapter(book) {
  return {
    title: "Try it on the site",
    paragraphs: [
      "The tools below match this book. They run in your browser on FreeToolsPro, and nothing you type is uploaded. Work one situation from the book by hand first, then type your own figures. The book shows the shape of the problem. The tool does the arithmetic on your data.",
    ],
    sections: (book.related || []).map((tool) => ({
      heading: tool.name,
      paragraphs: [`Open freetoolspro.in${tool.path}. If the tool's result and this book disagree by more than rounding, check which input you used and whether a rate or rule has changed since this edition.`],
    })),
  };
}

export function manuscriptFor(book, material) {
  const m = material;
  const chapters = [];
  const counts = {
    scenarios: m.scenarios.length,
    problems: m.problems.length,
    faqs: m.faqs.reduce((n, g) => n + g.items.length, 0),
    glossary: m.glossary.length,
    references: m.references.length,
    exercises: Object.fromEntries(LEVELS.map(([k]) => [k, (m.exercises[k] || []).length])),
  };
  const exerciseTotal = Object.values(counts.exercises).reduce((a, b) => a + b, 0);

  chapters.push({
    title: "How to use this book",
    paragraphs: [
      m.welcome,
      `The first part explains the ideas. The second part is practice: ${counts.scenarios} situations taken from ordinary lives, ${counts.problems} worked problems with every step shown, and ${exerciseTotal} exercises at four levels with answers at the back. After that come ${counts.faqs} questions readers ask, a glossary of ${counts.glossary} terms, and a list of references for the rules that change.`,
      "You do not have to read it in order. If you came for one answer, use the contents page, then try the matching problem to check you understood it. If you want the subject to stick, read the first part, then do the warm-up exercises before you read the situations.",
      `Rules and rates in this edition are as checked in ${m.checked}. Where a figure depends on a rule that changes, the text says so. Confirm the current figure with the source listed in the references before you rely on it for a real decision.`,
    ],
  });

  const core = coreFor(book).filter((c) => !/^Words/.test(c.title) && c.title !== "Check yourself");
  chapters.push(...core);
  if (m.chapters) chapters.push(...m.chapters);

  chapters.push({
    title: "Situations",
    kicker: "Part two: practice",
    paragraphs: [m.scenarioIntro || "Each situation is a person with a real constraint. Read what they decided and why, then ask what you would change for your own case."],
    sections: m.scenarios.map(scenarioBlock),
  });

  chapters.push({
    title: "Worked problems",
    paragraphs: [m.problemIntro || "Try each problem before you read the working. Cover the page below the question if it helps. The answer is at the end of each one."],
    sections: m.problems.map(problemBlock),
  });

  chapters.push({
    title: "Exercises",
    paragraphs: ["The exercises are grouped by difficulty. Answers are in the next chapter, numbered the same way."],
    sections: LEVELS.map(([k, name, intro]) => ({
      heading: name,
      paragraphs: [intro],
      sections: (m.exercises[k] || []).map((e, i) => ({ label: `${name} ${i + 1}`, paragraphs: [].concat(e.q), code: e.code, table: e.table })),
    })),
  });

  chapters.push({
    title: "Answers to the exercises",
    paragraphs: ["Check the method as well as the final figure. A right number reached by a wrong route will fail you on the next question."],
    sections: LEVELS.map(([k, name]) => ({
      heading: name,
      sections: (m.exercises[k] || []).map((e, i) => ({ label: `${name} ${i + 1}`, paragraphs: [].concat(e.a), code: e.acode, table: e.atable })),
    })),
  });

  chapters.push({
    title: "Questions readers ask",
    paragraphs: ["Short answers to the questions that come up most. Each one points back to the idea it depends on."],
    sections: m.faqs.map((g) => ({
      heading: g.group,
      sections: g.items.map(([q, a]) => ({ label: q, paragraphs: [].concat(a) })),
    })),
  });

  const gloss = [...m.glossary].sort((a, b) => a[0].localeCompare(b[0], "en", { sensitivity: "base" }));
  chapters.push({
    title: "Glossary",
    paragraphs: ["Working definitions for this book. Where a law or a standard defines a word more precisely, the references point to it."],
    sections: gloss.map(([term, def]) => ({ label: term, paragraphs: [def] })),
  });

  chapters.push({
    title: "References and further reading",
    paragraphs: ["Primary sources first: the body that makes the rule or publishes the standard. These are the places to check a figure before you rely on it. Addresses were correct when this edition was checked; if one has moved, search the publisher's site for the title."],
    sections: m.references.map((r) => ({ label: r.title, paragraphs: [`${r.who}.${r.where ? ` ${r.where}.` : ""} ${r.note}`] })),
  });

  chapters.push(toolsChapter(book));
  return { chapters, counts };
}
