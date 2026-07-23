import data from "./src/data/toolWhatItDoes/businessTools.js";

function countWords(entry) {
  const texts = [
    ...(entry.paragraphs || []),
    ...(entry.sections || []).flatMap((s) => s.paragraphs || []),
  ];
  return texts.join(" ").split(/\s+/).filter(Boolean).length;
}

for (const [path, entry] of Object.entries(data)) {
  console.log(`${path}: ${countWords(entry)} words`);
}
