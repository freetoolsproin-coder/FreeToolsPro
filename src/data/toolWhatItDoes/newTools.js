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
};
