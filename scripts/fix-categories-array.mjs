import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = path.join(ROOT, "src/data/toolDefinitions.js");
let text = fs.readFileSync(p, "utf8");

text = text.replace(/category: "seo-tools"/g, 'category: "ai-tools"');

const cats = `export const categories = [
  {
    id: "calculators",
    name: "Calculators",
    icon: Calculator,
    path: "/calculators",
  },
  {
    id: "finance-tools",
    name: "Finance & Investing",
    icon: CandlestickChart,
    path: "/tools?cat=finance-tools",
  },
  {
    id: "trending-tools",
    name: "Daily Utilities",
    icon: Flame,
    path: "/trending-tools",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    icon: Code2,
    path: "/developer-tools",
  },
  {
    id: "ai-tools",
    name: "AI Tools",
    icon: Sparkles,
    path: "/tools?cat=ai-tools",
  },
  {
    id: "career-learning",
    name: "Career & Learning",
    icon: GraduationCap,
    path: "/tools?cat=career-learning",
  },
  {
    id: "business-tools",
    name: "Business Tools",
    icon: BriefcaseBusiness,
    path: "/business-tools",
  },
  {
    id: "image-tools",
    name: "Image Tools",
    icon: Image,
    path: "/image-tools",
  },
  {
    id: "pdf-tools",
    name: "PDF Tools",
    icon: FileText,
    path: "/pdf-tools",
  },
  {
    id: "text-tools",
    name: "Text Tools",
    icon: Type,
    path: "/text-tools",
  },
  {
    id: "social-media-tools",
    name: "Social Media Tools",
    icon: Share2,
    path: "/social-media-tools",
  },
];
`;

const re =
  /export const categories = \[[\s\S]*?\];\r?\n\r?\n\/\* ===========================\r?\n   Tools/;

if (!re.test(text)) {
  console.error("NO MATCH for categories block");
  process.exit(1);
}

text = text.replace(re, `${cats}\n/* ===========================\n   Tools`);
fs.writeFileSync(p, text, "utf8");
console.log("OK categories =", (text.match(/id: "/g) || []).length);
