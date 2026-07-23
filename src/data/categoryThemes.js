/**
 * Category visual themes for tool page heroes.
 * Accents stay distinct without falling into generic purple / cream tropes.
 */
export const CATEGORY_THEMES = {
  calculators: {
    id: "calculators",
    label: "Calculators",
    accent: "#14b8a6",
    accentSoft: "rgba(20, 184, 166, 0.16)",
    glowA: "rgba(56, 189, 248, 0.18)",
    glowB: "rgba(13, 148, 136, 0.2)",
    hint: "Precision math",
  },
  "business-tools": {
    id: "business-tools",
    label: "Business",
    accent: "#0ea5e9",
    accentSoft: "rgba(14, 165, 233, 0.16)",
    glowA: "rgba(14, 165, 233, 0.18)",
    glowB: "rgba(7, 16, 31, 0.08)",
    hint: "Operations & finance",
  },
  "developer-tools": {
    id: "developer-tools",
    label: "Developer",
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.14)",
    glowA: "rgba(34, 211, 238, 0.16)",
    glowB: "rgba(56, 189, 248, 0.12)",
    hint: "Build & ship faster",
  },
  "image-tools": {
    id: "image-tools",
    label: "Image",
    accent: "#fb7185",
    accentSoft: "rgba(251, 113, 133, 0.14)",
    glowA: "rgba(251, 113, 133, 0.16)",
    glowB: "rgba(56, 189, 248, 0.1)",
    hint: "Visual utilities",
  },
  "pdf-tools": {
    id: "pdf-tools",
    label: "PDF",
    accent: "#38bdf8",
    accentSoft: "rgba(56, 189, 248, 0.16)",
    glowA: "rgba(56, 189, 248, 0.18)",
    glowB: "rgba(148, 163, 184, 0.12)",
    hint: "Document tools",
  },
  "social-media-tools": {
    id: "social-media-tools",
    label: "Social & AI",
    accent: "#2dd4bf",
    accentSoft: "rgba(45, 212, 191, 0.16)",
    glowA: "rgba(45, 212, 191, 0.16)",
    glowB: "rgba(251, 113, 133, 0.1)",
    hint: "Content & growth",
  },
  "text-tools": {
    id: "text-tools",
    label: "Text",
    accent: "#34d399",
    accentSoft: "rgba(52, 211, 153, 0.14)",
    glowA: "rgba(52, 211, 153, 0.16)",
    glowB: "rgba(56, 189, 248, 0.1)",
    hint: "Writing helpers",
  },
  "trending-tools": {
    id: "trending-tools",
    label: "Trending",
    accent: "#67e8f9",
    accentSoft: "rgba(103, 232, 249, 0.16)",
    glowA: "rgba(103, 232, 249, 0.18)",
    glowB: "rgba(20, 184, 166, 0.12)",
    hint: "Popular utilities",
  },
  "ai-tools": {
    id: "ai-tools",
    label: "AI Tools",
    accent: "#5eead4",
    accentSoft: "rgba(94, 234, 212, 0.16)",
    glowA: "rgba(94, 234, 212, 0.18)",
    glowB: "rgba(56, 189, 248, 0.12)",
    hint: "Intelligent helpers",
  },
};

const FOLDER_TO_CATEGORY = {
  calculators: "calculators",
  "business-tools": "business-tools",
  "developer-tools": "developer-tools",
  "image-tools": "image-tools",
  "pdf-tools": "pdf-tools",
  "social-media-tools": "social-media-tools",
  "text-tools": "text-tools",
  trending: "trending-tools",
  "trending-tools": "trending-tools",
  "ai-tools": "ai-tools",
};

export function normalizeCategory(categoryOrFolder) {
  if (!categoryOrFolder) return "calculators";
  if (CATEGORY_THEMES[categoryOrFolder]) return categoryOrFolder;
  return FOLDER_TO_CATEGORY[categoryOrFolder] || "calculators";
}

export function getCategoryTheme(categoryOrFolder) {
  const id = normalizeCategory(categoryOrFolder);
  return CATEGORY_THEMES[id] || CATEGORY_THEMES.calculators;
}

const PATH_PREFIXES = [
  ["/calculators/", "calculators"],
  ["/business-tools/", "business-tools"],
  ["/developer-tools/", "developer-tools"],
  ["/image-tools/", "image-tools"],
  ["/pdf-tools/", "pdf-tools"],
  ["/social-media-tools/", "social-media-tools"],
  ["/text-tools/", "text-tools"],
  ["/trending-tools/", "trending-tools"],
  ["/trending/", "trending-tools"],
  ["/ai-tools/", "ai-tools"],
];

export function categoryFromPath(pathname) {
  if (!pathname) return null;
  for (const [prefix, category] of PATH_PREFIXES) {
    if (pathname.startsWith(prefix) || pathname === prefix.slice(0, -1)) {
      return category;
    }
  }
  return null;
}
