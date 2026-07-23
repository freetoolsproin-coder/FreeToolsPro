import fs from "fs";

const seo = fs.readFileSync("src/seo/seoConfig.js", "utf8");
const what =
  fs.readFileSync("src/data/toolWhatItDoes/newTools.js", "utf8") +
  fs.readFileSync("src/data/toolWhatItDoes/developerTools.js", "utf8") +
  fs.readFileSync("src/data/toolWhatItDoes/textTools.js", "utf8");
const defs = fs.readFileSync("src/data/toolDefinitions.js", "utf8");

const paths = [...defs.matchAll(/path: "(\/(?:developer|text)-tools\/[^"]+)"/g)].map((m) => m[1]);
const re =
  /email-rewriter|code-explainer|documentation|bug-report|flowchart|database-schema|yaml-|json-to-yaml|csv-viewer|csv-to-xml|csv-to-sql|excel-to-json|json-to-excel|csv-merge|csv-splitter|sql-|json-to-sql|regex-|ping-tool|duplicate-line|csv-to-json/;
const uniq = [...new Set(paths.filter((p) => re.test(p)))];

const missSeo = uniq.filter((p) => !seo.includes(`path: "${p}"`));
const missWhat = uniq.filter((p) => !what.includes(`"${p}"`));

console.log("checked", uniq.length);
console.log("missing seo path", missSeo);
console.log("missing whatItDoes", missWhat);

const sample = uniq[0];
const hasTypeTool = /type:\s*"tool"/.test(seo);
console.log("seoConfig uses type tool:", hasTypeTool);
