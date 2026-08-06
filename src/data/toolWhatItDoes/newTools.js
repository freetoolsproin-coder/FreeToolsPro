/**
 * GEO / AEO long-form copy for newly added developer & text tools.
 * Each entry includes unique summary, use case, example, and limits.
 */

function privacyFor(kind) {
  if (kind === "text") {
    return [
      "Text transforms run in your browser whenever possible so drafts stay on the device.",
      "Avoid pasting passwords, private keys, or confidential customer data on shared screens.",
    ];
  }
  if (kind === "data") {
    return [
      "Prefer sample or anonymized datasets. Spreadsheet and CSV helpers are for convenience, not secure vaulting of PII.",
      "Download results only to machines you control, and delete temporary exports when finished.",
    ];
  }
  return [
    "Client-side developer helpers do not replace your organization’s security review.",
    "Redact secrets before pasting. Heuristic formatters and explainers are not full compilers or database engines—validate critical output in your target runtime.",
  ];
}

function richBlock({
  name,
  summary,
  useCase,
  example,
  whenNotTo,
  tip,
  kind = "code",
}) {
  return {
    paragraphs: [
      summary,
      useCase,
      `${name} on FreeToolsPro is free for standard use and designed to give a useful result in the browser without forcing an account.`,
    ],
    sections: [
      {
        title: "Example",
        paragraphs: [example],
      },
      {
        title: "When not to use it",
        paragraphs: [whenNotTo],
      },
      {
        title: "Tip",
        paragraphs: [tip],
      },
      {
        title: "Privacy and limits",
        paragraphs: privacyFor(kind),
      },
    ],
  };
}

export default {
  "/developer-tools/code-explainer": richBlock({
    name: "Code Explainer",
    summary:
      "A code explainer turns source snippets into plain-language overviews: what the code appears to do, which constructs it uses, and a walkthrough of notable lines.",
    useCase:
      "Paste JavaScript, Python, SQL, or other languages when onboarding to unfamiliar repos, reviewing pull requests, or teaching beginners.",
    example:
      "Paste a short function that maps an array of users to emails. The explainer summarizes that it iterates the list, reads an email field, and returns a new array—useful before you dig into edge cases like missing fields.",
    whenNotTo:
      "Do not treat the overview as a formal security audit or proof of correctness. Large proprietary codebases still need human review and tests.",
    tip: "Explain the smallest coherent snippet first. Huge files produce vaguer summaries.",
  }),
  "/developer-tools/documentation-generator": richBlock({
    name: "Documentation Generator",
    summary:
      "A documentation generator drafts Markdown docs from function and class signatures—name, parameters, returns, and placeholder descriptions you can refine.",
    useCase:
      "Bootstrap README sections, API stubs, and internal wiki pages before writers polish tone and edge cases.",
    example:
      "Given `function add(a, b)` the generator drafts a heading, parameter list for a and b, and a Returns stub you can fill with types and examples.",
    whenNotTo:
      "Generated docs are scaffolds, not complete API contracts. They will miss undocumented side effects until you edit them.",
    tip: "Paste one public function at a time for clearer stubs, then merge into your README.",
  }),
  "/developer-tools/bug-report-generator": richBlock({
    name: "Bug Report Generator",
    summary:
      "A bug report generator structures title, severity, steps, expected vs actual behavior, and environment into paste-ready Markdown.",
    useCase:
      "QA and support keep GitHub, Jira, or Linear tickets consistent so engineers spend less time asking for reproduction details.",
    example:
      "Fill steps like “Open /checkout → apply coupon → pay” plus expected “total discounts” and actual “coupon ignored.” The tool emits a Markdown issue body with those sections labeled.",
    whenNotTo:
      "It cannot invent missing logs or screenshots. Incomplete steps still produce incomplete tickets.",
    tip: "Attach environment (browser/OS) every time—most “works on my machine” bugs start there.",
  }),
  "/developer-tools/flowchart-builder": richBlock({
    name: "Flowchart Builder",
    summary:
      "A flowchart builder converts ordered steps or simple edge lines into Mermaid flowchart syntax for docs and PRs.",
    useCase:
      "Product and engineering teams sketch onboarding flows, approval paths, and decision trees without opening Visio for a first draft.",
    example:
      "Steps “Start → Login → MFA? → Dashboard” become Mermaid nodes and arrows you can paste into GitHub Markdown.",
    whenNotTo:
      "Complex swimlanes and BPMN compliance need dedicated diagramming tools after the Mermaid draft.",
    tip: "Keep node labels short so rendered diagrams stay readable in PR previews.",
  }),
  "/developer-tools/database-schema-designer": richBlock({
    name: "Database Schema Designer",
    summary:
      "Define tables and columns, then export CREATE TABLE SQL for prototyping migrations and teaching relational design.",
    useCase:
      "Backend engineers and students model entities quickly before committing DDL in a real database console.",
    example:
      "A `users` table with id, email, and created_at exports as CREATE TABLE SQL you can paste into SQLite or Postgres after adjusting types.",
    whenNotTo:
      "Production migrations need review for indexes, constraints, and zero-downtime strategies this designer does not automate.",
    tip: "Export, then run against a local empty database before touching shared environments.",
    kind: "data",
  }),
  "/developer-tools/yaml-validator": richBlock({
    name: "YAML Validator",
    summary:
      "Parses YAML and reports syntax errors so CI configs and manifests fail fast before deploy.",
    useCase:
      "DevOps engineers paste suspect YAML to confirm indentation and structure without waiting for a red pipeline.",
    example:
      "A GitHub Actions file with a missing indent under `steps:` surfaces a parse error pointing you to fix spacing before push.",
    whenNotTo:
      "Passing syntax validation does not prove semantic correctness (wrong image tag, bad key names still fail at runtime).",
    tip: "Validate the exact file your CI reads, not a reformatted copy with different anchors.",
  }),
  "/developer-tools/yaml-formatter": richBlock({
    name: "YAML Formatter",
    summary: "Normalizes indentation and structure so large configs stay readable in code review.",
    useCase: "Clean Helm values, Actions workflows, or Compose files that grew messy over time.",
    example:
      "A densely nested values.yaml becomes consistently indented so reviewers can see which key owns which block.",
    whenNotTo:
      "Do not auto-format generated YAML you do not own if your pipeline expects byte-stable output.",
    tip: "Diff after formatting to catch accidental key reordering before commit.",
  }),
  "/developer-tools/yaml-to-json": richBlock({
    name: "YAML to JSON",
    summary: "Converts YAML documents into pretty-printed JSON for APIs and fixtures.",
    useCase:
      "Move configs between Kubernetes-style YAML and JSON Schema or Postman collections.",
    example:
      "A YAML list of services becomes a JSON array of objects ready for a test fixture file.",
    whenNotTo:
      "YAML features like custom tags may not map cleanly; simplify documents first.",
    tip: "Pretty-print JSON in review, then minify only when shipping to a size-sensitive client.",
  }),
  "/developer-tools/json-to-yaml": richBlock({
    name: "JSON to YAML",
    summary: "Turns JSON objects into clean YAML for human-edited configs and GitOps repos.",
    useCase: "Convert API responses into YAML for Ansible, CI, or cloud manifests.",
    example:
      "A package-like JSON object becomes YAML with nested keys that are easier to comment in Git.",
    whenNotTo:
      "Binary or extremely deep JSON may be awkward in YAML—prefer JSON for machine-only pipelines.",
    tip: "After conversion, validate YAML before merging to main.",
  }),
  "/developer-tools/yaml-diff": richBlock({
    name: "YAML Diff",
    summary:
      "Compares two YAML documents and highlights line-level additions, removals, and changes.",
    useCase: "Review config drift between staging and production or inspect PR value changes.",
    example:
      "Staging vs production values files show only the replica count and image tag lines as changed.",
    whenNotTo:
      "Semantic equivalence (reordered keys that mean the same) may still appear as a textual diff.",
    tip: "Normalize both sides with the formatter first for cleaner diffs.",
  }),
  "/developer-tools/csv-viewer": richBlock({
    name: "CSV Viewer",
    summary: "Parses comma-separated text into a table preview without opening Excel.",
    useCase: "Spot-check exports, quoted fields, and encoding issues before database import.",
    example:
      "Paste a three-column export; the viewer shows header row and sample cells so you catch a misplaced comma early.",
    whenNotTo:
      "Multi-gigabyte files belong in dedicated desktop or warehouse tools, not a browser tab.",
    tip: "If columns look shifted, check for unescaped quotes in the raw CSV.",
    kind: "data",
  }),
  "/developer-tools/csv-to-xml": richBlock({
    name: "CSV to XML",
    summary: "Maps spreadsheet rows into structured XML elements for legacy integrations.",
    useCase: "When a partner requires XML but your source system only exports CSV.",
    example:
      "Rows of name,email become `<row><name>…</name><email>…</email></row>` style elements you can adjust to the partner schema.",
    whenNotTo:
      "Complex nested XML schemas may need XSLT or custom mapping beyond a flat CSV.",
    tip: "Agree on element names with the partner before bulk converting.",
    kind: "data",
  }),
  "/developer-tools/csv-to-sql": richBlock({
    name: "CSV to SQL",
    summary: "Generates INSERT statements from tabular data to seed databases quickly.",
    useCase: "Bootstrap demo data without writing repetitive INSERT lines by hand.",
    example:
      "A products.csv with sku and price becomes INSERT INTO products (…) VALUES (…) rows you paste into a migration.",
    whenNotTo:
      "Do not run generated SQL on production without review—types, escaping, and table names must match your schema.",
    tip: "Start with five rows, verify in a local DB, then convert the full file.",
    kind: "data",
  }),
  "/developer-tools/excel-to-json": richBlock({
    name: "Excel to JSON",
    summary: "Reads .xlsx/.xls worksheets in the browser and emits JSON arrays.",
    useCase: "Convert business spreadsheets into fixtures without a third-party upload service.",
    example:
      "A sheet of city,population becomes `[{ \"city\": \"…\", \"population\": … }, …]` for an API mock.",
    whenNotTo:
      "Macros, pivots, and charts are not preserved—only cell values for conversion.",
    tip: "Use a clean header row; merged cells confuse column mapping.",
    kind: "data",
  }),
  "/developer-tools/json-to-excel": richBlock({
    name: "JSON to Excel",
    summary: "Builds a downloadable .xlsx workbook from a JSON array.",
    useCase: "Share API samples with non-technical stakeholders as a spreadsheet.",
    example:
      "An array of order objects downloads as columns for id, total, and status ready for Excel filters.",
    whenNotTo:
      "Deeply nested JSON may flatten poorly—normalize to an array of flat objects first.",
    tip: "Keep property names stable across rows so headers stay consistent.",
    kind: "data",
  }),
  "/developer-tools/csv-merge": richBlock({
    name: "CSV Merge",
    summary: "Combines two CSV datasets with header union so columns align when schemas differ slightly.",
    useCase: "Stitch monthly exports or partial dumps before analysis.",
    example:
      "January and February sales files with overlapping columns merge into one table; missing columns appear empty for rows that lack them.",
    whenNotTo:
      "True relational joins on keys need a proper join tool or SQL—not a simple header union merge.",
    tip: "Normalize date formats in each file before merging to keep sorts sane.",
    kind: "data",
  }),
  "/developer-tools/csv-splitter": richBlock({
    name: "CSV Splitter",
    summary: "Chunks large files into smaller parts with a repeated header row for batch imports.",
    useCase: "When upload portals cap file size or you need parallel import jobs.",
    example:
      "A 50,000-row export split into 5,000-row files each starting with the same header line.",
    whenNotTo:
      "If row order must stay global across chunks for a streaming consumer, document chunk sequence carefully.",
    tip: "Choose chunk sizes your importer already tested successfully.",
    kind: "data",
  }),
  "/developer-tools/sql-formatter": richBlock({
    name: "SQL Formatter",
    summary: "Pretty-prints queries with clearer keywords and clause breaks for readable reviews.",
    useCase: "Clean generated SQL before committing or pasting into tickets.",
    example:
      "A one-line SELECT with joins becomes multi-line with SELECT, FROM, WHERE, and ORDER BY on separate lines.",
    whenNotTo:
      "Dialect-specific hints may not format perfectly—spot-check Oracle/Postgres/MySQL specifics.",
    tip: "Format, then run EXPLAIN in your database for performance—not in this tool.",
  }),
  "/developer-tools/sql-minifier": richBlock({
    name: "SQL Minifier",
    summary: "Strips comments and excess whitespace for compact scripts.",
    useCase: "Embed SQL in configs or reduce noisy multi-line strings in logs.",
    example:
      "A commented multi-line query collapses to a single compact string suitable for a config value.",
    whenNotTo:
      "Do not minify the only copy of a query you still need to read—keep a formatted source of truth.",
    tip: "Store formatted SQL in Git; minify only at the transport boundary.",
  }),
  "/developer-tools/sql-beautifier": richBlock({
    name: "SQL Beautifier",
    summary: "Applies generous spacing so complex joins and nested selects are easier to scan.",
    useCase: "Teaching, pair programming, and long query debugging sessions.",
    example:
      "Nested subqueries gain indentation so each SELECT level is visually distinct.",
    whenNotTo:
      "Byte-identical SQL requirements (some hash-based caches) may forbid beautifying in place.",
    tip: "Beautify a copy; compare plans before and after only if your DB cares about text form.",
  }),
  "/developer-tools/sql-validator": richBlock({
    name: "SQL Validator",
    summary:
      "Checks balanced quotes/parentheses and common statement shape as a fast heuristic lint.",
    useCase: "Catch obvious typos before pasting into a console.",
    example:
      "A missing closing parenthesis in a WHERE clause is flagged before you run it on a shared database.",
    whenNotTo:
      "It is not a full parser for every dialect and will not catch semantic errors like wrong table names.",
    tip: "Green heuristic checks still need a dry run on a non-production database.",
  }),
  "/developer-tools/sql-query-builder": richBlock({
    name: "SQL Query Builder",
    summary:
      "Assembles SELECT statements from table, columns, WHERE, ORDER BY, and LIMIT fields.",
    useCase: "Students and non-experts generate valid SELECT skeletons without memorizing clause order.",
    example:
      "Table `orders`, columns id,total, WHERE status = 'paid', LIMIT 50 → a ready SELECT you can refine.",
    whenNotTo:
      "Complex CTEs, window functions, and upserts need hand-written SQL after the skeleton.",
    tip: "Generate the SELECT, then add joins manually in your editor with schema docs open.",
  }),
  "/developer-tools/sql-to-json": richBlock({
    name: "SQL to JSON",
    summary:
      "Extracts structured JSON from INSERT values or recognizable query shapes for fixtures.",
    useCase: "Migrate seed data from SQL dumps into JSON-based test suites.",
    example:
      "INSERT rows for users become a JSON array of objects with column names as keys.",
    whenNotTo:
      "Arbitrary SQL with functions and subselects may not convert—stick to simple INSERT shapes.",
    tip: "Export a small dump first to confirm column mapping.",
    kind: "data",
  }),
  "/developer-tools/json-to-sql-insert": richBlock({
    name: "JSON to SQL INSERT",
    summary: "Turns JSON arrays into INSERT statements for a chosen table name.",
    useCase: "Convert API payloads into database seed scripts in one step.",
    example:
      "`[{ \"id\": 1, \"name\": \"Ada\" }]` with table `authors` yields INSERT INTO authors (id, name) VALUES (1, 'Ada').",
    whenNotTo:
      "Untrusted JSON can inject unexpected values—review escaping and types before running.",
    tip: "Quote strings carefully and confirm boolean/null handling for your dialect.",
    kind: "data",
  }),
  "/developer-tools/sql-diff": richBlock({
    name: "SQL Diff",
    summary: "Compares two SQL scripts line by line for migration and rewrite audits.",
    useCase: "Review generated SQL changes or reconcile environment scripts.",
    example:
      "Old vs new migration files highlight only the added index statement.",
    whenNotTo:
      "Reformatted-only changes create noisy diffs—format both sides the same way first.",
    tip: "Diff logical migrations, not minified one-liners.",
  }),
  "/developer-tools/sql-explain": richBlock({
    name: "SQL Explain",
    summary:
      "Describes detected clauses in plain English so learners understand SELECT, JOIN, WHERE, and ORDER BY intent.",
    useCase: "Educational breakdown—not a database EXPLAIN plan with cost estimates.",
    example:
      "A query with JOIN and WHERE is described as reading two tables, filtering rows, then sorting—without claiming index usage.",
    whenNotTo:
      "Performance tuning requires your database’s real EXPLAIN/ANALYZE output.",
    tip: "Use it to teach structure, then run EXPLAIN in Postgres/MySQL for costs.",
  }),
  "/developer-tools/regex-tester": richBlock({
    name: "Regex Tester",
    summary:
      "Runs a pattern with flags against sample text and lists matches, indexes, and capture groups.",
    useCase: "Validate email, URL, and parsing patterns before shipping validation logic.",
    example:
      "Pattern `\\d{3}-\\d{2}` against sample IDs lists each match and group so you confirm boundaries.",
    whenNotTo:
      "Catastrophic backtracking patterns can freeze a tab—test carefully on large inputs.",
    tip: "Add unit tests in your codebase with the same samples once the pattern looks right.",
  }),
  "/developer-tools/regex-generator": richBlock({
    name: "Regex Generator",
    summary: "Builds common patterns from presets such as email, URL, phone, and date.",
    useCase: "Jump-start validation rules, then refine in the Regex Tester for edge cases.",
    example:
      "Choosing an email preset yields a starting pattern you tighten for your allowed domains.",
    whenNotTo:
      "Presets are not RFC-complete. Overly strict email regex rejects valid addresses.",
    tip: "Prefer simple validation plus server-side checks for critical forms.",
  }),
  "/developer-tools/regex-cheat-sheet": richBlock({
    name: "Regex Cheat Sheet",
    summary:
      "Lists tokens, anchors, quantifiers, groups, and flags as a searchable quick reference.",
    useCase: "Keep it open while writing or reviewing regular expressions in any language.",
    example:
      "Look up `*?` vs `*` when you need a non-greedy match explained in one place.",
    whenNotTo:
      "Flavor differences (JS vs PCRE vs .NET) still require dialect docs for advanced features.",
    tip: "Bookmark the cheat sheet beside the Regex Tester while learning.",
  }),
  "/developer-tools/regex-explainer": richBlock({
    name: "Regex Explainer",
    summary: "Breaks a pattern into readable token explanations so dense expressions become teachable.",
    useCase: "Inherit legacy validation code or document patterns for teammates.",
    example:
      "A password-strength pattern is explained token-by-token: length, character classes, and anchors.",
    whenNotTo:
      "Explanations are educational; they do not prove the pattern matches your full threat model.",
    tip: "Explain, then run the same pattern in the Regex Tester with failing and passing samples.",
  }),
  "/developer-tools/ping-tool": richBlock({
    name: "Ping Tool",
    summary:
      "Measures HTTP round-trip latency to a URL from your device, reporting min, max, and average times.",
    useCase:
      "Rough reachability and latency checks. It is not ICMP ping; CORS and network policy affect results.",
    example:
      "Pinging https://example.com several times shows average latency from your current network path.",
    whenNotTo:
      "Do not use it as proof a server is “down” globally—your local network or CORS may block the request.",
    tip: "Compare wired vs mobile networks when diagnosing slow API calls.",
  }),

  "/text-tools/email-rewriter": richBlock({
    name: "Email Rewriter",
    kind: "text",
    summary:
      "Restyles a draft into professional, friendly, concise, persuasive, or formal tone while keeping your core message.",
    useCase:
      "Sales, support, and job seekers polish outbound mail without sending content to a cloud writing API for the basic rewrite flow.",
    example:
      "A blunt “Need this today” draft becomes a polite professional request with the same deadline and ask.",
    whenNotTo:
      "Legal notices and HR letters still need human review for compliance—tone tools do not replace counsel.",
    tip: "Rewrite once for tone, then manually add facts only you know (dates, ticket IDs).",
  }),
  "/text-tools/duplicate-line-remover": richBlock({
    name: "Duplicate Line Remover",
    kind: "text",
    summary:
      "Keeps the first occurrence of each line and drops repeats, optionally ignoring case.",
    useCase: "Clean word lists, logs, and mailing lists before import or further processing.",
    example:
      "Input lines apple / banana / apple / Cherry become apple / banana / Cherry when case-sensitive; with case-insensitive matching, cherry collisions collapse too.",
    whenNotTo:
      "If later duplicates carry different meaning (timestamps on identical messages), dedupe may hide information you need.",
    tip: "Sort after dedupe when you need alphabetical unique lists.",
  }),
  "/text-tools/trim-text": richBlock({
    name: "Trim Text",
    kind: "text",
    summary:
      "Strips leading and trailing whitespace from the whole block or from each line, including leading-only and trailing-only modes.",
    useCase: "Clean pasted code, CSV cells, and messy copy before publishing or importing.",
    example:
      "A line `  hello  ` becomes `hello` in per-line trim mode, while internal spaces inside the sentence stay intact.",
    whenNotTo:
      "Do not trim if leading spaces are significant (Python blocks or aligned ASCII art) unless you choose a narrower mode.",
    tip: "Use trailing-only trim to remove CRLF padding without touching intentional indents.",
  }),
  "/text-tools/wrap-text": richBlock({
    name: "Wrap Text",
    kind: "text",
    summary:
      "Soft-wraps long lines to a chosen character width, or unwraps hard breaks into continuous paragraphs.",
    useCase: "Emails, commit messages, OCR cleanup, and plain-text docs that need readable columns or joined paragraphs.",
    example:
      "Wrap mode: a 200-character paragraph at 72 characters becomes multiple lines. Unwrap mode: hard-wrapped email lines join into sentences while blank lines can stay as paragraphs.",
    whenNotTo:
      "Preformatted code with significant line breaks should not be word-wrapped or unwrapped blindly; poetry should keep intentional breaks.",
    tip: "Wrap at 72 or 80 for git commit bodies; unwrap OCR text first, then trim.",
  }),
  "/text-tools/indent-text": richBlock({
    name: "Indent Text",
    kind: "text",
    summary: "Adds or removes spaces or tabs at the start of each line by a configurable amount.",
    useCase: "Nest lists, quote blocks, flatten over-indented snippets, or align pasted code quickly.",
    example:
      "Indent mode: two spaces turn `console.log('hi')` into `  console.log('hi')`. Outdent mode: removing two leading spaces from `    foo` yields `  foo`.",
    whenNotTo:
      "Follow the project style for tabs vs spaces. Outdenting Python or YAML too far will break structure—outdent gradually.",
    tip: "Indent by 2 spaces for Markdown nested lists; outdent one level at a time when cleaning nested quotes.",
  }),
  "/text-tools/justify-text": richBlock({
    name: "Justify Text",
    kind: "text",
    summary: "Distributes spaces between words so each non-empty line fills a target width.",
    useCase: "Plain-text layouts and monospace posters without a word processor.",
    example:
      "A short line padded to width 40 inserts extra spaces between words so left and right edges align in a mono font.",
    whenNotTo:
      "Justifying already-wrapped uneven paragraphs looks odd—wrap to width first, then justify.",
    tip: "Works best with proportional preview disabled—check output in a monospace editor.",
  }),
  "/text-tools/sort-lines-az": richBlock({
    name: "Sort Lines",
    kind: "text",
    summary:
      "Sorts each line alphabetically A–Z or Z–A, with optional case-insensitive matching and empty-line filtering.",
    useCase: "Glossaries, name lists, and unique value dumps in readable order.",
    example:
      "`zebra` / `apple` / `Banana` becomes `Banana` / `apple` / `zebra` (case-sensitive A–Z) or reverse with Z–A mode.",
    whenNotTo:
      "Natural numeric sort (2 before 10) needs a different algorithm—this is lexicographic text sort.",
    tip: "Dedupe first if you want a unique sorted glossary.",
  }),
  "/text-tools/reverse-lines": richBlock({
    name: "Reverse Lines",
    kind: "text",
    summary:
      "Flips line order so the last line becomes first while leaving each line’s text unchanged.",
    useCase: "Reverse chronologically ordered logs or stacked lists.",
    example:
      "`first` / `second` / `third` becomes `third` / `second` / `first`.",
    whenNotTo:
      "Reversing does not sort—unordered lists stay unordered, only flipped.",
    tip: "Reverse a newest-last export to read newest-first without a spreadsheet.",
  }),
  "/text-tools/shuffle-lines": richBlock({
    name: "Shuffle Lines",
    kind: "text",
    summary: "Randomizes line order and lets you reshuffle for a new permutation.",
    useCase: "Randomize teams, quiz order, and playlist-style lists.",
    example:
      "`one` / `two` / `three` / `four` might become `three` / `one` / `four` / `two`; Reshuffle yields another order.",
    whenNotTo:
      "Cryptographic shuffling or audit-grade randomness needs a dedicated CSPRNG library—not a browser teaching helper.",
    tip: "Copy the shuffled result immediately if you need to keep that exact order.",
  }),
  "/text-tools/number-lines": richBlock({
    name: "Number Lines",
    kind: "text",
    summary:
      "Prefixes each line with sequential numbers (1., 1), [1], etc.) or strips those common prefixes.",
    useCase: "Share drafts for review, clean numbered paste from editors/PDFs, or re-base a list at a new start index.",
    example:
      "Add mode: `alpha` / `beta` becomes `1. alpha` / `2. beta`. Remove mode: `1. alpha` / `2) beta` become `alpha` / `beta`.",
    whenNotTo:
      "Lines that start with real numeric content (years, IDs) can be damaged in Remove mode if they look like prefixes—review the output.",
    tip: "Skip empty lines when numbering prose paragraphs separated by blanks.",
  }),
  "/json-tools/json-validator": {
    paragraphs: [
      "JSON Validator on FreeToolsPro: Validate JSON and show parse errors.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-minifier": {
    paragraphs: [
      "JSON Minifier on FreeToolsPro: Minify JSON by removing whitespace.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-beautifier": {
    paragraphs: [
      "JSON Beautifier on FreeToolsPro: Beautify JSON with indentation.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-pretty-print": {
    paragraphs: [
      "JSON Pretty Print on FreeToolsPro: Pretty-print JSON for debugging.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-compare": {
    paragraphs: [
      "JSON Compare on FreeToolsPro: Compare two JSON documents.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-diff-viewer": {
    paragraphs: [
      "JSON Diff Viewer on FreeToolsPro: Side-by-side JSON diff viewer.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-tree-viewer": {
    paragraphs: [
      "JSON Tree Viewer on FreeToolsPro: Explore JSON as an expandable tree.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-to-xml": {
    paragraphs: [
      "JSON to XML on FreeToolsPro: Convert JSON objects into XML.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/xml-to-json": {
    paragraphs: [
      "XML to JSON on FreeToolsPro: Convert XML into JSON.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-to-csv": {
    paragraphs: [
      "JSON to CSV on FreeToolsPro: Flatten JSON arrays into CSV.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-to-typescript": {
    paragraphs: [
      "JSON to TypeScript on FreeToolsPro: Generate TypeScript interfaces from JSON.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-to-java": {
    paragraphs: [
      "JSON to Java on FreeToolsPro: Generate Java class stubs from JSON.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-to-csharp": {
    paragraphs: [
      "JSON to C# on FreeToolsPro: Generate C# class stubs from JSON.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-to-go-struct": {
    paragraphs: [
      "JSON to Go Struct on FreeToolsPro: Generate Go structs from JSON.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-to-dart": {
    paragraphs: [
      "JSON to Dart on FreeToolsPro: Generate Dart models from JSON.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/json-tools/json-schema-generator": {
    paragraphs: [
      "JSON Schema Generator on FreeToolsPro: Infer JSON Schema from sample JSON.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-formatter": {
    paragraphs: [
      "HTML Formatter on FreeToolsPro: Format HTML with readable indentation.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-beautifier": {
    paragraphs: [
      "HTML Beautifier on FreeToolsPro: Beautify HTML markup.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-escape": {
    paragraphs: [
      "HTML Escape on FreeToolsPro: Escape HTML special characters.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-unescape": {
    paragraphs: [
      "HTML Unescape on FreeToolsPro: Unescape HTML entities.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-encoder": {
    paragraphs: [
      "HTML Encoder on FreeToolsPro: Encode text as HTML entities.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-decoder": {
    paragraphs: [
      "HTML Decoder on FreeToolsPro: Decode HTML entities to text.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-preview": {
    paragraphs: [
      "HTML Preview on FreeToolsPro: Preview HTML in a sandboxed view.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-to-markdown": {
    paragraphs: [
      "HTML to Markdown on FreeToolsPro: Convert HTML to Markdown.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/markdown-to-html": {
    paragraphs: [
      "Markdown to HTML on FreeToolsPro: Convert Markdown to HTML.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-table-generator": {
    paragraphs: [
      "HTML Table Generator on FreeToolsPro: Generate HTML tables.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-email-generator": {
    paragraphs: [
      "HTML Email Generator on FreeToolsPro: Generate HTML email skeletons.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/html-tools/html-entity-converter": {
    paragraphs: [
      "HTML Entity Converter on FreeToolsPro: Convert characters to HTML entities.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-formatter": {
    paragraphs: [
      "CSS Formatter on FreeToolsPro: Format CSS with consistent spacing.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-minifier": {
    paragraphs: [
      "CSS Minifier on FreeToolsPro: Minify CSS payloads.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-shadow-generator": {
    paragraphs: [
      "CSS Shadow Generator on FreeToolsPro: Build box-shadow CSS with controls.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-clip-path-generator": {
    paragraphs: [
      "CSS Clip Path Generator on FreeToolsPro: Generate clip-path polygons.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-flexbox-generator": {
    paragraphs: [
      "CSS Flexbox Generator on FreeToolsPro: Compose flexbox layouts.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-grid-generator": {
    paragraphs: [
      "CSS Grid Generator on FreeToolsPro: Compose CSS grid templates.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-animation-generator": {
    paragraphs: [
      "CSS Animation Generator on FreeToolsPro: Generate @keyframes snippets.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-border-radius-generator": {
    paragraphs: [
      "CSS Border Radius Generator on FreeToolsPro: Tune border-radius corners.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-filter-generator": {
    paragraphs: [
      "CSS Filter Generator on FreeToolsPro: Compose CSS filter stacks.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/css-tools/css-transform-generator": {
    paragraphs: [
      "CSS Transform Generator on FreeToolsPro: Build CSS transforms.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/javascript-formatter": {
    paragraphs: [
      "JavaScript Formatter on FreeToolsPro: Format JavaScript code.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/javascript-minifier": {
    paragraphs: [
      "JavaScript Minifier on FreeToolsPro: Minify JavaScript code.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/javascript-beautifier": {
    paragraphs: [
      "JavaScript Beautifier on FreeToolsPro: Beautify JavaScript code.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/javascript-obfuscator": {
    paragraphs: [
      "JavaScript Obfuscator on FreeToolsPro: Lightly obfuscate JavaScript identifiers.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/javascript-deobfuscator": {
    paragraphs: [
      "JavaScript Deobfuscator on FreeToolsPro: Best-effort JS deobfuscation.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/javascript-validator": {
    paragraphs: [
      "JavaScript Validator on FreeToolsPro: Check basic JavaScript syntax.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/javascript-playground": {
    paragraphs: [
      "JavaScript Playground on FreeToolsPro: Run JS snippets and capture output.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/javascript-console": {
    paragraphs: [
      "JavaScript Console on FreeToolsPro: Evaluate expressions in a mini console.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/es6-converter": {
    paragraphs: [
      "ES6 Converter on FreeToolsPro: Convert common patterns toward ES6.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/javascript-tools/babel-playground": {
    paragraphs: [
      "Babel Playground on FreeToolsPro: Explore demo ESNext down-level transforms.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/api-tools/graphql-explorer": {
    paragraphs: [
      "GraphQL Explorer on FreeToolsPro: Draft GraphQL queries with sample responses.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/api-tools/curl-generator": {
    paragraphs: [
      "cURL Generator on FreeToolsPro: Generate cURL commands from request fields.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/api-tools/postman-collection-generator": {
    paragraphs: [
      "Postman Collection Generator on FreeToolsPro: Generate Postman v2.1 collection JSON.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/api-tools/http-header-viewer": {
    paragraphs: [
      "HTTP Header Viewer on FreeToolsPro: Parse and view HTTP headers.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/api-tools/api-mock-generator": {
    paragraphs: [
      "API Mock Generator on FreeToolsPro: Generate mock JSON from field names.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/api-tools/api-documentation-generator": {
    paragraphs: [
      "API Documentation Generator on FreeToolsPro: Draft Markdown API docs.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/api-tools/webhook-tester": {
    paragraphs: [
      "Webhook Tester on FreeToolsPro: Craft webhook payloads and sample signatures.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/api-tools/api-request-builder": {
    paragraphs: [
      "API Request Builder on FreeToolsPro: Build REST request objects.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/jwt-tools/jwt-encoder": {
    paragraphs: [
      "JWT Encoder on FreeToolsPro: Encode header/payload into an unsigned JWT.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/jwt-tools/jwt-inspector": {
    paragraphs: [
      "JWT Inspector on FreeToolsPro: Inspect JWT header, payload, and signature.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/jwt-tools/jwt-expiry-checker": {
    paragraphs: [
      "JWT Expiry Checker on FreeToolsPro: Check JWT exp claim status.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/jwt-tools/jwt-generator": {
    paragraphs: [
      "JWT Generator on FreeToolsPro: Generate sample JWTs for testing.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/url-encode": {
    paragraphs: [
      "URL Encode on FreeToolsPro: Percent-encode URL strings.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/url-decode": {
    paragraphs: [
      "URL Decode on FreeToolsPro: Decode percent-encoded URLs.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/html-encode": {
    paragraphs: [
      "HTML Encode on FreeToolsPro: Encode HTML entities.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/html-decode": {
    paragraphs: [
      "HTML Decode on FreeToolsPro: Decode HTML entities.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/unicode-converter": {
    paragraphs: [
      "Unicode Converter on FreeToolsPro: Convert text to Unicode code points.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/utf8-converter": {
    paragraphs: [
      "UTF-8 Converter on FreeToolsPro: Show UTF-8 bytes for text.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/ascii-converter": {
    paragraphs: [
      "ASCII Converter on FreeToolsPro: Convert text to ASCII codes.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/binary-converter": {
    paragraphs: [
      "Binary Converter on FreeToolsPro: Convert text to binary.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/hex-converter": {
    paragraphs: [
      "Hex Converter on FreeToolsPro: Convert text to hexadecimal.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/octal-converter": {
    paragraphs: [
      "Octal Converter on FreeToolsPro: Convert numbers to octal.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/base64-encode": {
    paragraphs: [
      "Base64 Encode on FreeToolsPro: Encode text to Base64.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/encoding-tools/base64-decode": {
    paragraphs: [
      "Base64 Decode on FreeToolsPro: Decode Base64 to text.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/hash-tools/md5-generator": {
    paragraphs: [
      "MD5 Generator on FreeToolsPro: Generate MD5 hashes.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/hash-tools/sha1-generator": {
    paragraphs: [
      "SHA1 Generator on FreeToolsPro: Generate SHA-1 hashes.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/hash-tools/sha256-generator": {
    paragraphs: [
      "SHA256 Generator on FreeToolsPro: Generate SHA-256 hashes.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/hash-tools/sha512-generator": {
    paragraphs: [
      "SHA512 Generator on FreeToolsPro: Generate SHA-512 hashes.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/hash-tools/hmac-generator": {
    paragraphs: [
      "HMAC Generator on FreeToolsPro: Generate HMAC-SHA256 signatures.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/hash-tools/bcrypt-generator": {
    paragraphs: [
      "BCrypt Generator on FreeToolsPro: Hash passwords with bcrypt.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/hash-tools/uuid-generator": {
    paragraphs: [
      "UUID Generator on FreeToolsPro: Generate UUID v4 values.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/hash-tools/uuid-validator": {
    paragraphs: [
      "UUID Validator on FreeToolsPro: Validate UUID format.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/developer-tools/sql-to-mongo-query": {
    paragraphs: [
      "SQL to Mongo Query on FreeToolsPro: Translate simple SQL to Mongo find().",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/developer-tools/sql-cheat-sheet": {
    paragraphs: [
      "SQL Cheat Sheet on FreeToolsPro: Quick SQL reference sheet.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/developer-tools/sql-beautifier": {
    paragraphs: [
      "SQL Beautifier on FreeToolsPro: Beautify SQL queries.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/svg-optimizer": {
    paragraphs: [
      "SVG Optimizer on FreeToolsPro: Strip comments/metadata from SVG.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/svg-viewer": {
    paragraphs: [
      "SVG Viewer on FreeToolsPro: Preview SVG markup.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/svg-to-png": {
    paragraphs: [
      "SVG to PNG on FreeToolsPro: Rasterize SVG to PNG.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/png-to-svg-guide": {
    paragraphs: [
      "PNG to SVG Guide on FreeToolsPro: Checklist for PNG→SVG conversion.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/image-compressor": {
    paragraphs: [
      "Image Compressor on FreeToolsPro: Compress images in the browser.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/image-cropper": {
    paragraphs: [
      "Image Cropper on FreeToolsPro: Crop images to an aspect ratio.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/image-metadata-viewer": {
    paragraphs: [
      "Image Metadata Viewer on FreeToolsPro: Inspect image dimensions and file info.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/exif-reader": {
    paragraphs: [
      "EXIF Reader on FreeToolsPro: Read basic image metadata in-browser.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/image-tools/ico-generator": {
    paragraphs: [
      "ICO Generator on FreeToolsPro: Generate favicon-sized PNG pack.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/password-strength-checker": {
    paragraphs: [
      "Password Strength Checker on FreeToolsPro: Score password strength.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/csr-generator": {
    paragraphs: [
      "CSR Generator on FreeToolsPro: Build OpenSSL CSR commands.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/certificate-decoder": {
    paragraphs: [
      "Certificate Decoder on FreeToolsPro: Inspect PEM certificate size/fields.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/cors-tester": {
    paragraphs: [
      "CORS Tester on FreeToolsPro: Draft CORS response headers.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/csp-generator": {
    paragraphs: [
      "CSP Generator on FreeToolsPro: Generate Content-Security-Policy drafts.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/security-headers-checker": {
    paragraphs: [
      "Security Headers Checker on FreeToolsPro: Recommended HTTP security headers.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/dns-lookup": {
    paragraphs: [
      "DNS Lookup on FreeToolsPro: DNS-over-HTTPS A record lookup.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/whois-lookup": {
    paragraphs: [
      "WHOIS Lookup on FreeToolsPro: RDAP domain registration lookup.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/spf-checker": {
    paragraphs: [
      "SPF Checker on FreeToolsPro: Inspect SPF TXT records.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/dkim-checker": {
    paragraphs: [
      "DKIM Checker on FreeToolsPro: Lookup DKIM selector records.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/security-tools/dmarc-checker": {
    paragraphs: [
      "DMARC Checker on FreeToolsPro: Inspect DMARC policies.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/http-tools/http-status-checker": {
    paragraphs: [
      "HTTP Status Checker on FreeToolsPro: Check HTTP status for a URL.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/http-tools/redirect-checker": {
    paragraphs: [
      "Redirect Checker on FreeToolsPro: Guidance for redirect-chain QA.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/http-tools/url-parser": {
    paragraphs: [
      "URL Parser on FreeToolsPro: Parse URL components.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/http-tools/url-inspector": {
    paragraphs: [
      "URL Inspector on FreeToolsPro: Inspect URL structure and query params.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/ai-dev-tools/sql-generator": {
    paragraphs: [
      "SQL Generator on FreeToolsPro: Generate SQL from a plain request.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/ai-dev-tools/api-generator": {
    paragraphs: [
      "API Generator on FreeToolsPro: Generate REST route stubs.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/ai-dev-tools/commit-message-generator": {
    paragraphs: [
      "Commit Message Generator on FreeToolsPro: Draft conventional commit messages.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/ai-dev-tools/readme-generator": {
    paragraphs: [
      "README Generator on FreeToolsPro: Generate README skeletons.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/ai-dev-tools/dockerfile-generator": {
    paragraphs: [
      "Dockerfile Generator on FreeToolsPro: Generate Dockerfiles for common stacks.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/ai-dev-tools/gitignore-generator": {
    paragraphs: [
      ".gitignore Generator on FreeToolsPro: Generate .gitignore files.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/ai-dev-tools/env-template-generator": {
    paragraphs: [
      ".env Template Generator on FreeToolsPro: Generate .env.example templates.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/text-tools/character-counter": {
    paragraphs: [
      "Character Counter on FreeToolsPro: Count characters, words, and lines.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/text-tools/remove-empty-lines": {
    paragraphs: [
      "Remove Empty Lines on FreeToolsPro: Strip blank lines from text.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/text-tools/case-converter": {
    paragraphs: [
      "Case Converter on FreeToolsPro: Convert camel, snake, kebab cases.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/text-tools/slug-generator": {
    paragraphs: [
      "Slug Generator on FreeToolsPro: Generate URL-safe slugs.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/text-tools/random-string-generator": {
    paragraphs: [
      "Random String Generator on FreeToolsPro: Generate random strings.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/seo-tools/open-graph-generator": {
    paragraphs: [
      "Open Graph Generator on FreeToolsPro: Generate Open Graph meta tags.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/seo-tools/canonical-url-generator": {
    paragraphs: [
      "Canonical URL Generator on FreeToolsPro: Generate canonical link tags.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/seo-tools/keyword-density-checker": {
    paragraphs: [
      "Keyword Density Checker on FreeToolsPro: Analyze keyword density.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },
  "/seo-tools/hreflang-generator": {
    paragraphs: [
      "Hreflang Generator on FreeToolsPro: Generate hreflang tags.",
      "Use this free utility in your browser—no signup required. For production systems, verify critical outputs with your own toolchain.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Paste or enter your input, run the tool, then copy the result.",
          "Keep sensitive secrets out of public machines when hashing or encoding credentials.",
        ],
      },
    ],
  },

  "/mutual-fund-tools/lumpsum-calculator": {
    paragraphs: [
      "Lumpsum Calculator on FreeToolsPro: Project lumpsum mutual fund growth over time.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/mutual-fund-tools/swp-calculator": {
    paragraphs: [
      "SWP Calculator on FreeToolsPro: Estimate how long a systematic withdrawal lasts.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/mutual-fund-tools/stp-calculator": {
    paragraphs: [
      "STP Calculator on FreeToolsPro: Model systematic transfer plan from one fund to another.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/mutual-fund-tools/goal-planner": {
    paragraphs: [
      "Goal Planner on FreeToolsPro: Find the SIP needed to reach a financial goal.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/mutual-fund-tools/retirement-corpus-calculator": {
    paragraphs: [
      "Retirement Corpus Calculator on FreeToolsPro: Estimate the corpus needed for retirement expenses.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/mutual-fund-tools/child-education-planner": {
    paragraphs: [
      "Child Education Planner on FreeToolsPro: Plan SIPs for future education costs with inflation.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/mutual-fund-tools/fire-calculator": {
    paragraphs: [
      "FIRE Calculator on FreeToolsPro: Estimate your FIRE number and years to financial independence.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/loan-calculators/home-loan-calculator": {
    paragraphs: [
      "Home Loan Calculator on FreeToolsPro: Calculate home loan EMI, interest, and total payout.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/loan-calculators/car-loan-calculator": {
    paragraphs: [
      "Car Loan Calculator on FreeToolsPro: Calculate car loan EMI and total interest.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/loan-calculators/personal-loan-calculator": {
    paragraphs: [
      "Personal Loan Calculator on FreeToolsPro: Calculate personal loan EMI and interest cost.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/loan-calculators/education-loan-calculator": {
    paragraphs: [
      "Education Loan Calculator on FreeToolsPro: Calculate education loan EMI and total payment.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/loan-calculators/gold-loan-calculator": {
    paragraphs: [
      "Gold Loan Calculator on FreeToolsPro: Estimate gold loan EMI from amount, rate, and tenure.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/loan-calculators/business-loan-calculator": {
    paragraphs: [
      "Business Loan Calculator on FreeToolsPro: Calculate business loan EMI and interest.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/loan-calculators/loan-prepayment-calculator": {
    paragraphs: [
      "Loan Prepayment Calculator on FreeToolsPro: See EMI and interest impact of a loan prepayment.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/loan-calculators/balance-transfer-calculator": {
    paragraphs: [
      "Balance Transfer Calculator on FreeToolsPro: Compare savings from transferring a loan to a lower rate.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/income-tax-calculator": {
    paragraphs: [
      "Income Tax Calculator on FreeToolsPro: Estimate Indian income tax under old or new regime.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/old-vs-new-tax-regime": {
    paragraphs: [
      "Old vs New Tax Regime on FreeToolsPro: Compare old vs new regime tax side by side.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/hra-calculator": {
    paragraphs: [
      "HRA Calculator on FreeToolsPro: Calculate HRA exemption for metro and non-metro cities.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/standard-deduction-calculator": {
    paragraphs: [
      "Standard Deduction Calculator on FreeToolsPro: Apply salaried standard deduction by regime.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/section-80c-calculator": {
    paragraphs: [
      "Section 80C Calculator on FreeToolsPro: Track Section 80C investments against the ₹1.5L limit.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/capital-gains-tax-calculator": {
    paragraphs: [
      "Capital Gains Tax Calculator on FreeToolsPro: Estimate capital gains tax on equity and other assets.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/gst-inclusive-exclusive-calculator": {
    paragraphs: [
      "GST Inclusive/Exclusive Calculator on FreeToolsPro: Convert between GST-inclusive and exclusive amounts.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/tds-calculator": {
    paragraphs: [
      "TDS Calculator on FreeToolsPro: Calculate TDS amount and net payable.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/tax-tools/advance-tax-calculator": {
    paragraphs: [
      "Advance Tax Calculator on FreeToolsPro: Split annual tax into advance-tax installments.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/salary-hr/in-hand-salary-calculator": {
    paragraphs: [
      "In-hand Salary Calculator on FreeToolsPro: Estimate monthly in-hand salary from CTC.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/salary-hr/ctc-calculator": {
    paragraphs: [
      "CTC Calculator on FreeToolsPro: Break CTC into basic, HRA, and common components.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/salary-hr/salary-breakup-calculator": {
    paragraphs: [
      "Salary Breakup Calculator on FreeToolsPro: View an illustrative monthly salary breakup.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/salary-hr/pf-calculator": {
    paragraphs: [
      "PF Calculator on FreeToolsPro: Calculate employee and employer PF contributions.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/salary-hr/epf-interest-calculator": {
    paragraphs: [
      "EPF Interest Calculator on FreeToolsPro: Project EPF corpus with assumed interest.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/salary-hr/leave-encashment-calculator": {
    paragraphs: [
      "Leave Encashment Calculator on FreeToolsPro: Estimate leave encashment from basic pay and days.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/salary-hr/bonus-calculator": {
    paragraphs: [
      "Bonus Calculator on FreeToolsPro: Calculate bonus as months of salary.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/salary-hr/notice-period-calculator": {
    paragraphs: [
      "Notice Period Calculator on FreeToolsPro: Estimate notice buyout for unserved days.",
      "Figures are planning estimates for Indian users. Confirm tax and loan numbers with a CA, lender, or official portal before acting.",
    ],
    sections: [
      {
        title: "How to use",
        paragraphs: [
          "Enter your amounts, rates, and tenure, then read the result cards.",
          "Change inputs to compare scenarios such as prepayment, regime choice, or SIP size.",
        ],
      },
    ],
  },
  "/retirement-tools/pension-calculator": {
    paragraphs: [
      "Pension Calculator: Estimate pension income from a retirement corpus and annuity rate.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/retirement-tools/nps-calculator": {
    paragraphs: [
      "NPS Calculator: Project NPS corpus, lump sum, and annuity pension.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/retirement-tools/epf-pension-estimator": {
    paragraphs: [
      "EPF Pension Estimator: Estimate EPS pension from pensionable salary and service years.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/retirement-tools/retirement-planner": {
    paragraphs: [
      "Retirement Planner: Compare corpus needed versus SIP accumulation for retirement.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/retirement-tools/safe-withdrawal-rate-calculator": {
    paragraphs: [
      "Safe Withdrawal Rate Calculator: Calculate sustainable withdrawal amounts from a corpus.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/banking-tools/fd-calculator": {
    paragraphs: [
      "FD Calculator: Calculate fixed deposit maturity value and interest.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/banking-tools/rd-calculator": {
    paragraphs: [
      "RD Calculator: Calculate recurring deposit maturity value.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/banking-tools/compound-interest-calculator": {
    paragraphs: [
      "Compound Interest Calculator: Compute compound interest with flexible compounding.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/banking-tools/simple-interest-calculator": {
    paragraphs: [
      "Simple Interest Calculator: Compute simple interest and total amount.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/banking-tools/savings-interest-calculator": {
    paragraphs: [
      "Savings Interest Calculator: Estimate savings-account interest for a period.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/banking-tools/credit-card-emi-calculator": {
    paragraphs: [
      "Credit Card EMI Calculator: Calculate credit card EMI, interest, and total payable.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/banking-tools/credit-card-payoff-calculator": {
    paragraphs: [
      "Credit Card Payoff Calculator: Estimate months to pay off a credit card balance.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/banking-tools/credit-utilization-calculator": {
    paragraphs: [
      "Credit Utilization Calculator: Check credit utilization ratio against your limit.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/insurance-tools/term-insurance-calculator": {
    paragraphs: [
      "Term Insurance Calculator: Ballpark term life premium from cover, age, and tenure.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/insurance-tools/life-insurance-calculator": {
    paragraphs: [
      "Life Insurance Calculator: Estimate life cover needs from income and liabilities.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/insurance-tools/health-insurance-premium-estimator": {
    paragraphs: [
      "Health Insurance Premium Estimator: Estimate family health insurance premiums.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/insurance-tools/vehicle-insurance-estimator": {
    paragraphs: [
      "Vehicle Insurance Estimator: Estimate OD + TP vehicle insurance premium.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/business-finance/invoice-generator": {
    paragraphs: [
      "Invoice Generator: Create a simple business invoice you can copy or print.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/business-finance/gst-invoice-generator": {
    paragraphs: [
      "GST Invoice Generator: Generate a GST-style invoice with taxable value and tax.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/business-finance/profit-margin-calculator": {
    paragraphs: [
      "Profit Margin Calculator: Calculate profit, margin %, and markup %.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/business-finance/break-even-calculator": {
    paragraphs: [
      "Break-even Calculator: Find break-even units and revenue.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/business-finance/depreciation-calculator": {
    paragraphs: [
      "Depreciation Calculator: Calculate straight-line or WDV depreciation.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/business-finance/roi-calculator": {
    paragraphs: [
      "ROI Calculator: Measure return on investment for a project or campaign.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },
  "/business-finance/business-valuation-calculator": {
    paragraphs: [
      "Business Valuation Calculator: Estimate business value using an earnings multiple.",
      "FreeToolsPro keeps these pages free for quick checks. Daily market boards use sample data—verify live prices and calendars on official sources.",
    ],
    sections: [{ title: "Tip", paragraphs: ["Bookmark high-traffic daily pages for repeat visits, and cross-check before trading or filing."] }],
  },

  "/ai-writing-tools/ai-title-generator": {
    paragraphs: [
      "AI Title Generator on FreeToolsPro: Generate click-worthy title options from a topic.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/blog-outline-generator": {
    paragraphs: [
      "Blog Outline Generator on FreeToolsPro: Build a structured blog outline in seconds.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/meta-description-generator": {
    paragraphs: [
      "Meta Description Generator on FreeToolsPro: Draft SEO meta descriptions under 160 characters.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/faq-generator": {
    paragraphs: [
      "FAQ Generator on FreeToolsPro: Create FAQ Q&A blocks for pages and posts.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/product-description-generator": {
    paragraphs: [
      "Product Description Generator on FreeToolsPro: Write benefit-led product descriptions.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/email-generator": {
    paragraphs: [
      "Email Generator on FreeToolsPro: Draft professional emails from a short brief.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/cover-letter-generator": {
    paragraphs: [
      "Cover Letter Generator on FreeToolsPro: Generate a tailored cover letter draft.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/linkedin-post-generator": {
    paragraphs: [
      "LinkedIn Post Generator on FreeToolsPro: Create LinkedIn posts with hooks and hashtags.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/tweet-generator": {
    paragraphs: [
      "Tweet Generator on FreeToolsPro: Generate short tweet options from an idea.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/rewrite-tool": {
    paragraphs: [
      "Rewrite Tool on FreeToolsPro: Rewrite text with clearer wording.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/tone-changer": {
    paragraphs: [
      "Tone Changer on FreeToolsPro: Change writing tone (professional, casual, friendly).",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/text-simplifier": {
    paragraphs: [
      "Text Simplifier on FreeToolsPro: Simplify complex wording for easier reading.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-writing-tools/ai-proofreader": {
    paragraphs: [
      "AI Proofreader on FreeToolsPro: Surface quick proofreading fixes and a cleaned draft.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-coding-tools/code-reviewer": {
    paragraphs: [
      "Code Reviewer on FreeToolsPro: Get a quick static code-review checklist on pasted code.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-coding-tools/bug-finder": {
    paragraphs: [
      "Bug Finder on FreeToolsPro: Scan code for common bug and security patterns.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-coding-tools/json-generator": {
    paragraphs: [
      "JSON Generator on FreeToolsPro: Generate sample JSON objects from field names.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-coding-tools/unit-test-generator": {
    paragraphs: [
      "Unit Test Generator on FreeToolsPro: Scaffold unit tests for a function name.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-coding-tools/css-generator-ai": {
    paragraphs: [
      "CSS Generator on FreeToolsPro: Generate starter CSS for a component name.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-coding-tools/react-component-generator": {
    paragraphs: [
      "React Component Generator on FreeToolsPro: Scaffold a React function component.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-coding-tools/readme-generator-ai": {
    paragraphs: [
      "README Generator on FreeToolsPro: Generate a project README skeleton.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-seo-tools/seo-audit-ai": {
    paragraphs: [
      "SEO Audit on FreeToolsPro: Run an AI-style SEO checklist for a page or topic.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-seo-tools/ai-keyword-generator": {
    paragraphs: [
      "AI Keyword Generator on FreeToolsPro: Brainstorm keyword variations around a seed term.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-seo-tools/keyword-clustering": {
    paragraphs: [
      "Keyword Clustering on FreeToolsPro: Group keywords into topical clusters.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-seo-tools/internal-linking-suggestions": {
    paragraphs: [
      "Internal Linking Suggestions on FreeToolsPro: Suggest internal link opportunities for an article.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-seo-tools/ai-content-optimizer": {
    paragraphs: [
      "AI Content Optimizer on FreeToolsPro: Get optimization tips for draft content.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-seo-tools/readability-checker": {
    paragraphs: [
      "Readability Checker on FreeToolsPro: Estimate readability from sentence length.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-seo-tools/heading-optimizer": {
    paragraphs: [
      "Heading Optimizer on FreeToolsPro: Turn rough headings into clean H1/H2 structure.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-seo-tools/faq-generator-seo": {
    paragraphs: [
      "FAQ Generator (SEO) on FreeToolsPro: Create FAQ blocks optimized for search snippets.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/ad-copy-generator": {
    paragraphs: [
      "Ad Copy Generator on FreeToolsPro: Generate ad headline, primary text, and CTA.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/google-ads-headline-generator": {
    paragraphs: [
      "Google Ads Headline Generator on FreeToolsPro: Create Google Ads headline options.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/facebook-ad-generator": {
    paragraphs: [
      "Facebook Ad Generator on FreeToolsPro: Draft Facebook/Meta ad copy blocks.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/youtube-title-generator": {
    paragraphs: [
      "YouTube Title Generator on FreeToolsPro: Generate YouTube title ideas.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/thumbnail-text-generator": {
    paragraphs: [
      "Thumbnail Text Generator on FreeToolsPro: Short punchy thumbnail text ideas.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/landing-page-copy-generator": {
    paragraphs: [
      "Landing Page Copy Generator on FreeToolsPro: Draft hero, benefits, and CTA sections.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/call-to-action-generator": {
    paragraphs: [
      "Call-to-Action Generator on FreeToolsPro: Generate CTA button and line options.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/brand-slogan-generator": {
    paragraphs: [
      "Brand Slogan Generator on FreeToolsPro: Create short brand slogans.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-marketing-tools/brand-name-generator": {
    paragraphs: [
      "Brand Name Generator on FreeToolsPro: Brainstorm brand name candidates.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-office-tools/meeting-notes-summarizer": {
    paragraphs: [
      "Meeting Notes Summarizer on FreeToolsPro: Turn rough notes into a concise meeting summary.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-office-tools/minutes-of-meeting-generator": {
    paragraphs: [
      "Minutes of Meeting Generator on FreeToolsPro: Generate MoM structure from discussion points.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-office-tools/task-list-extractor": {
    paragraphs: [
      "Task List Extractor on FreeToolsPro: Extract action items from notes or transcripts.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-office-tools/professional-email-writer": {
    paragraphs: [
      "Professional Email Writer on FreeToolsPro: Write polished professional emails.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-office-tools/business-proposal-generator": {
    paragraphs: [
      "Business Proposal Generator on FreeToolsPro: Draft a short business proposal outline.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-office-tools/invoice-description-writer": {
    paragraphs: [
      "Invoice Description Writer on FreeToolsPro: Write clean invoice line descriptions.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-office-tools/executive-summary-generator": {
    paragraphs: [
      "Executive Summary Generator on FreeToolsPro: Summarize an initiative for executives.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-resume-career/ats-resume-checker": {
    paragraphs: [
      "ATS Resume Checker on FreeToolsPro: Check resume text for common ATS issues.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-resume-career/resume-optimizer": {
    paragraphs: [
      "Resume Optimizer on FreeToolsPro: Get rewrite tips and a stronger sample bullet.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-resume-career/job-description-analyzer": {
    paragraphs: [
      "Job Description Analyzer on FreeToolsPro: Extract must-have signals from a job description.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-resume-career/salary-negotiation-assistant": {
    paragraphs: [
      "Salary Negotiation Assistant on FreeToolsPro: Get a practical negotiation script outline.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-resume-career/skill-gap-analyzer": {
    paragraphs: [
      "Skill Gap Analyzer on FreeToolsPro: Compare your skills vs required skills.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-learning-tools/flashcard-generator": {
    paragraphs: [
      "Flashcard Generator on FreeToolsPro: Turn topics into Q&A flashcards.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-learning-tools/quiz-generator": {
    paragraphs: [
      "Quiz Generator on FreeToolsPro: Generate a short quiz from a topic.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-learning-tools/study-notes-generator": {
    paragraphs: [
      "Study Notes Generator on FreeToolsPro: Create structured study notes.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-learning-tools/explain-like-im-10": {
    paragraphs: [
      "Explain Like I'm 10 on FreeToolsPro: Explain a concept in simple language.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-learning-tools/code-tutor": {
    paragraphs: [
      "Code Tutor on FreeToolsPro: Get a tutoring plan for understanding code.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-learning-tools/formula-explainer": {
    paragraphs: [
      "Formula Explainer on FreeToolsPro: Explain a formula in plain English.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-learning-tools/essay-improver": {
    paragraphs: [
      "Essay Improver on FreeToolsPro: Get essay improvement steps and a stronger opening.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-image-helpers/alt-text-generator": {
    paragraphs: [
      "Alt Text Generator on FreeToolsPro: Write accessible image alt text.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-image-helpers/image-caption-generator": {
    paragraphs: [
      "Image Caption Generator on FreeToolsPro: Generate short image captions.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-image-helpers/ocr-text-cleaner": {
    paragraphs: [
      "OCR Text Cleaner on FreeToolsPro: Clean messy OCR text for reuse.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-image-helpers/color-palette-extractor": {
    paragraphs: [
      "Color Palette Extractor on FreeToolsPro: Generate a palette seed from a word or brand.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-image-helpers/prompt-generator-image-models": {
    paragraphs: [
      "Prompt Generator for Image Models on FreeToolsPro: Write image-model prompts from a subject.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-image-helpers/background-description-generator": {
    paragraphs: [
      "Background Description Generator on FreeToolsPro: Describe backgrounds for design or generation.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-prompt-engineering/prompt-enhancer": {
    paragraphs: [
      "Prompt Enhancer on FreeToolsPro: Expand a prompt with constraints and examples.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-prompt-engineering/prompt-shortener": {
    paragraphs: [
      "Prompt Shortener on FreeToolsPro: Tighten long prompts while keeping intent.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-prompt-engineering/prompt-debugger": {
    paragraphs: [
      "Prompt Debugger on FreeToolsPro: Diagnose weak prompts and fix gaps.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-prompt-engineering/prompt-translator": {
    paragraphs: [
      "Prompt Translator on FreeToolsPro: Adapt a prompt for another language output.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-prompt-engineering/prompt-library": {
    paragraphs: [
      "Prompt Library on FreeToolsPro: Browse reusable prompt starters.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-prompt-engineering/prompt-version-comparison": {
    paragraphs: [
      "Prompt Version Comparison on FreeToolsPro: Compare two prompt versions side by side.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-prompt-engineering/prompt-quality-score": {
    paragraphs: [
      "Prompt Quality Score on FreeToolsPro: Score prompt quality with a simple checklist.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-prompt-engineering/role-prompt-generator": {
    paragraphs: [
      "Role Prompt Generator on FreeToolsPro: Generate role-based system prompts.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-data-tools/csv-cleaner": {
    paragraphs: [
      "CSV Cleaner on FreeToolsPro: Normalize messy CSV spacing and quotes.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-data-tools/json-cleaner": {
    paragraphs: [
      "JSON Cleaner on FreeToolsPro: Pretty-print and validate JSON.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-data-tools/duplicate-finder": {
    paragraphs: [
      "Duplicate Finder on FreeToolsPro: Find duplicate lines in a dataset dump.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-data-tools/data-summarizer": {
    paragraphs: [
      "Data Summarizer on FreeToolsPro: Summarize row/column shape of pasted data.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-data-tools/sql-to-csv": {
    paragraphs: [
      "SQL to CSV on FreeToolsPro: Convert simple SQL value lists to CSV rows.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-data-tools/csv-visualizer": {
    paragraphs: [
      "CSV Visualizer on FreeToolsPro: Inspect CSV columns and row counts.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-automation-tools/workflow-generator": {
    paragraphs: [
      "Workflow Generator on FreeToolsPro: Draft a generic automation workflow.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-automation-tools/sop-generator": {
    paragraphs: [
      "SOP Generator on FreeToolsPro: Generate a standard operating procedure outline.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-automation-tools/checklist-generator": {
    paragraphs: [
      "Checklist Generator on FreeToolsPro: Create an actionable checklist from a goal.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-automation-tools/email-automation-drafts": {
    paragraphs: [
      "Email Automation Drafts on FreeToolsPro: Draft a simple email nurture sequence.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-automation-tools/zapier-workflow-ideas": {
    paragraphs: [
      "Zapier Workflow Ideas on FreeToolsPro: Brainstorm Zapier-style automations.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-automation-tools/n8n-workflow-generator": {
    paragraphs: [
      "n8n Workflow Generator on FreeToolsPro: Sketch an n8n node sequence for a goal.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-automation-tools/api-integration-assistant": {
    paragraphs: [
      "API Integration Assistant on FreeToolsPro: Plan API auth, endpoints, and error handling.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
  "/ai-website-auditor/ai-website-auditor": {
    paragraphs: [
      "AI Website Auditor on FreeToolsPro: Run a practical website quality/SEO checklist.",
      "These assistants use fast on-device templates and heuristics—great for drafts. Edit before publishing.",
    ],
    sections: [{ title: "How to use", paragraphs: ["Paste a topic or draft, generate, then refine the output for your brand voice."] }],
  },
};
