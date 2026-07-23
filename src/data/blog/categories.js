/** Blog category taxonomy for FreeToolsPro. */
export const BLOG_CATEGORIES = [
  {
    slug: "tutorials",
    label: "Tutorials",
    description:
      "Step-by-step walkthroughs that help you finish a concrete task with FreeToolsPro utilities.",
  },
  {
    slug: "guides",
    label: "Guides",
    description:
      "Broader how-to guides for choosing workflows, planning projects, and getting more from the tool suite.",
  },
  {
    slug: "programming",
    label: "Programming",
    description:
      "Developer-focused articles on HTML, CSS, JavaScript, React, Node.js, Express, MongoDB, Git, regex, and practical coding patterns.",
  },
  {
    slug: "seo",
    label: "SEO",
    description:
      "Search optimization checklists, technical SEO tips, and on-page improvements you can apply today.",
  },
  {
    slug: "image-optimization",
    label: "Image optimization",
    description:
      "Tips for resizing, compressing, and preparing images for faster pages and cleaner layouts.",
  },
  {
    slug: "pdf",
    label: "PDF",
    description:
      "Tutorials for converting, merging, and preparing PDF documents without desktop software.",
  },
  {
    slug: "javascript",
    label: "JavaScript",
    description:
      "JavaScript core concepts—execution context, event loop, scope, closures, prototypes, classes, modules—plus practical tips for forms and dates.",
  },
  {
    slug: "ai-articles",
    label: "AI Articles",
    description:
      "Prompt engineering, ChatGPT tips, and practical AI workflows for students, developers, resumes, and email.",
  },
];

export function getCategory(slug) {
  return BLOG_CATEGORIES.find((c) => c.slug === slug) || null;
}

export function isValidCategory(slug) {
  return BLOG_CATEGORIES.some((c) => c.slug === slug);
}
