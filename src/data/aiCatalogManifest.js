/**
 * AI tool catalog — new pages to scaffold.
 * Existing tools are remapped into these categories separately.
 */
export const AI_CATALOG = [
  // Writing
  ["ai-title-generator", "AI Title Generator", "Generate click-worthy title options from a topic.", "ai-writing-tools", "AiTitleGenerator", "Sparkles", "ai_title", ["title", "blog"]],
  ["blog-outline-generator", "Blog Outline Generator", "Build a structured blog outline in seconds.", "ai-writing-tools", "BlogOutlineGenerator", "FileText", "blog_outline", ["outline", "blog"]],
  ["meta-description-generator", "Meta Description Generator", "Draft SEO meta descriptions under 160 characters.", "ai-writing-tools", "MetaDescriptionGenerator", "Search", "meta_description", ["meta description"]],
  ["faq-generator", "FAQ Generator", "Create FAQ Q&A blocks for pages and posts.", "ai-writing-tools", "FaqGenerator", "MessageCircle", "faq_gen", ["faq"]],
  ["product-description-generator", "Product Description Generator", "Write benefit-led product descriptions.", "ai-writing-tools", "ProductDescriptionGenerator", "Package", "product_desc", ["product description"]],
  ["email-generator", "Email Generator", "Draft professional emails from a short brief.", "ai-writing-tools", "EmailGenerator", "Mail", "email_gen", ["email"]],
  ["cover-letter-generator", "Cover Letter Generator", "Generate a tailored cover letter draft.", "ai-writing-tools", "CoverLetterGenerator", "FileUser", "cover_letter", ["cover letter"]],
  ["linkedin-post-generator", "LinkedIn Post Generator", "Create LinkedIn posts with hooks and hashtags.", "ai-writing-tools", "LinkedinPostGenerator", "Share2", "linkedin_post", ["linkedin"]],
  ["tweet-generator", "Tweet Generator", "Generate short tweet options from an idea.", "ai-writing-tools", "TweetGenerator", "MessageSquareText", "tweet_gen", ["tweet", "x"]],
  ["rewrite-tool", "Rewrite Tool", "Rewrite text with clearer wording.", "ai-writing-tools", "RewriteTool", "PenSquare", "rewrite", ["rewrite"]],
  ["tone-changer", "Tone Changer", "Change writing tone (professional, casual, friendly).", "ai-writing-tools", "ToneChanger", "Wand2", "tone_change", ["tone"]],
  ["text-simplifier", "Text Simplifier", "Simplify complex wording for easier reading.", "ai-writing-tools", "TextSimplifier", "Type", "simplify", ["simplify"]],
  ["ai-proofreader", "AI Proofreader", "Surface quick proofreading fixes and a cleaned draft.", "ai-writing-tools", "AiProofreader", "SpellCheck", "proofread", ["proofread"]],

  // Coding
  ["code-reviewer", "Code Reviewer", "Get a quick static code-review checklist on pasted code.", "ai-coding-tools", "CodeReviewer", "SearchCheck", "code_review", ["code review"]],
  ["bug-finder", "Bug Finder", "Scan code for common bug and security patterns.", "ai-coding-tools", "BugFinder", "Bug", "bug_finder", ["bug"]],
  ["json-generator", "JSON Generator", "Generate sample JSON objects from field names.", "ai-coding-tools", "JsonGenerator", "Braces", "json_gen", ["json"]],
  ["unit-test-generator", "Unit Test Generator", "Scaffold unit tests for a function name.", "ai-coding-tools", "UnitTestGenerator", "FlaskConical", "unit_test_gen", ["unit test"]],
  ["css-generator-ai", "CSS Generator", "Generate starter CSS for a component name.", "ai-coding-tools", "CssGeneratorAi", "Palette", "css_gen", ["css"]],
  ["react-component-generator", "React Component Generator", "Scaffold a React function component.", "ai-coding-tools", "ReactComponentGenerator", "Code2", "react_component", ["react"]],
  ["readme-generator-ai", "README Generator", "Generate a project README skeleton.", "ai-coding-tools", "ReadmeGeneratorAi", "BookOpen", "readme_ai", ["readme"]],

  // SEO
  ["seo-audit-ai", "SEO Audit", "Run an AI-style SEO checklist for a page or topic.", "ai-seo-tools", "SeoAuditAi", "SearchCheck", "seo_audit_ai", ["seo audit"]],
  ["ai-keyword-generator", "AI Keyword Generator", "Brainstorm keyword variations around a seed term.", "ai-seo-tools", "AiKeywordGenerator", "Tags", "keyword_gen", ["keywords"]],
  ["keyword-clustering", "Keyword Clustering", "Group keywords into topical clusters.", "ai-seo-tools", "KeywordClustering", "Layers", "keyword_cluster", ["keyword cluster"]],
  ["internal-linking-suggestions", "Internal Linking Suggestions", "Suggest internal link opportunities for an article.", "ai-seo-tools", "InternalLinkingSuggestions", "Link2", "internal_links", ["internal links"]],
  ["ai-content-optimizer", "AI Content Optimizer", "Get optimization tips for draft content.", "ai-seo-tools", "AiContentOptimizer", "Sparkles", "content_optimizer", ["content optimizer"]],
  ["readability-checker", "Readability Checker", "Estimate readability from sentence length.", "ai-seo-tools", "ReadabilityChecker", "BookOpen", "readability", ["readability"]],
  ["heading-optimizer", "Heading Optimizer", "Turn rough headings into clean H1/H2 structure.", "ai-seo-tools", "HeadingOptimizer", "ListOrdered", "heading_optimizer", ["headings"]],
  ["faq-generator-seo", "FAQ Generator (SEO)", "Create FAQ blocks optimized for search snippets.", "ai-seo-tools", "FaqGeneratorSeo", "MessageCircle", "faq_gen", ["faq", "seo"]],

  // Marketing
  ["ad-copy-generator", "Ad Copy Generator", "Generate ad headline, primary text, and CTA.", "ai-marketing-tools", "AdCopyGenerator", "Megaphone", "ad_copy", ["ads"]],
  ["google-ads-headline-generator", "Google Ads Headline Generator", "Create Google Ads headline options.", "ai-marketing-tools", "GoogleAdsHeadlineGenerator", "Search", "google_ads", ["google ads"]],
  ["facebook-ad-generator", "Facebook Ad Generator", "Draft Facebook/Meta ad copy blocks.", "ai-marketing-tools", "FacebookAdGenerator", "Share2", "facebook_ad", ["facebook ads"]],
  ["youtube-title-generator", "YouTube Title Generator", "Generate YouTube title ideas.", "ai-marketing-tools", "YoutubeTitleGenerator", "PlayCircle", "yt_title", ["youtube"]],
  ["thumbnail-text-generator", "Thumbnail Text Generator", "Short punchy thumbnail text ideas.", "ai-marketing-tools", "ThumbnailTextGenerator", "Image", "thumbnail_text", ["thumbnail"]],
  ["landing-page-copy-generator", "Landing Page Copy Generator", "Draft hero, benefits, and CTA sections.", "ai-marketing-tools", "LandingPageCopyGenerator", "PanelsTopLeft", "landing_copy", ["landing page"]],
  ["call-to-action-generator", "Call-to-Action Generator", "Generate CTA button and line options.", "ai-marketing-tools", "CallToActionGenerator", "MousePointerClick", "cta_gen", ["cta"]],
  ["brand-slogan-generator", "Brand Slogan Generator", "Create short brand slogans.", "ai-marketing-tools", "BrandSloganGenerator", "Sparkles", "slogan_gen", ["slogan"]],
  ["brand-name-generator", "Brand Name Generator", "Brainstorm brand name candidates.", "ai-marketing-tools", "BrandNameGenerator", "Lightbulb", "brand_name", ["brand name"]],

  // Office
  ["meeting-notes-summarizer", "Meeting Notes Summarizer", "Turn rough notes into a concise meeting summary.", "ai-office-tools", "MeetingNotesSummarizer", "FileText", "meeting_summary", ["meeting notes"]],
  ["minutes-of-meeting-generator", "Minutes of Meeting Generator", "Generate MoM structure from discussion points.", "ai-office-tools", "MinutesOfMeetingGenerator", "ClipboardList", "mom_gen", ["minutes"]],
  ["task-list-extractor", "Task List Extractor", "Extract action items from notes or transcripts.", "ai-office-tools", "TaskListExtractor", "ListChecks", "task_extract", ["tasks"]],
  ["professional-email-writer", "Professional Email Writer", "Write polished professional emails.", "ai-office-tools", "ProfessionalEmailWriter", "Mail", "email_gen", ["email"]],
  ["business-proposal-generator", "Business Proposal Generator", "Draft a short business proposal outline.", "ai-office-tools", "BusinessProposalGenerator", "BriefcaseBusiness", "proposal_gen", ["proposal"]],
  ["invoice-description-writer", "Invoice Description Writer", "Write clean invoice line descriptions.", "ai-office-tools", "InvoiceDescriptionWriter", "Receipt", "invoice_desc", ["invoice"]],
  ["executive-summary-generator", "Executive Summary Generator", "Summarize an initiative for executives.", "ai-office-tools", "ExecutiveSummaryGenerator", "FileText", "exec_summary", ["executive summary"]],

  // Resume & career
  ["ats-resume-checker", "ATS Resume Checker", "Check resume text for common ATS issues.", "ai-resume-career", "AtsResumeChecker", "FileCheck2", "ats_resume", ["ats", "resume"]],
  ["resume-optimizer", "Resume Optimizer", "Get rewrite tips and a stronger sample bullet.", "ai-resume-career", "ResumeOptimizer", "Sparkles", "resume_optimize", ["resume"]],
  ["job-description-analyzer", "Job Description Analyzer", "Extract must-have signals from a job description.", "ai-resume-career", "JobDescriptionAnalyzer", "Search", "jd_analyzer", ["job description"]],
  ["salary-negotiation-assistant", "Salary Negotiation Assistant", "Get a practical negotiation script outline.", "ai-resume-career", "SalaryNegotiationAssistant", "BadgeIndianRupee", "salary_negotiate", ["salary"]],
  ["skill-gap-analyzer", "Skill Gap Analyzer", "Compare your skills vs required skills.", "ai-resume-career", "SkillGapAnalyzer", "GitCompare", "skill_gap", ["skills"]],

  // Learning
  ["flashcard-generator", "Flashcard Generator", "Turn topics into Q&A flashcards.", "ai-learning-tools", "FlashcardGenerator", "Layers", "flashcards", ["flashcards"]],
  ["quiz-generator", "Quiz Generator", "Generate a short quiz from a topic.", "ai-learning-tools", "QuizGenerator", "ListOrdered", "quiz_gen", ["quiz"]],
  ["study-notes-generator", "Study Notes Generator", "Create structured study notes.", "ai-learning-tools", "StudyNotesGenerator", "BookOpen", "study_notes", ["study notes"]],
  ["explain-like-im-10", "Explain Like I'm 10", "Explain a concept in simple language.", "ai-learning-tools", "ExplainLikeIm10", "Lightbulb", "eli10", ["eli5"]],
  ["code-tutor", "Code Tutor", "Get a tutoring plan for understanding code.", "ai-learning-tools", "CodeTutor", "GraduationCap", "code_tutor", ["tutor"]],
  ["formula-explainer", "Formula Explainer", "Explain a formula in plain English.", "ai-learning-tools", "FormulaExplainer", "Calculator", "formula_explain", ["formula"]],
  ["essay-improver", "Essay Improver", "Get essay improvement steps and a stronger opening.", "ai-learning-tools", "EssayImprover", "PenSquare", "essay_improve", ["essay"]],

  // Image helpers
  ["alt-text-generator", "Alt Text Generator", "Write accessible image alt text.", "ai-image-helpers", "AltTextGenerator", "Image", "alt_text", ["alt text"]],
  ["image-caption-generator", "Image Caption Generator", "Generate short image captions.", "ai-image-helpers", "ImageCaptionGenerator", "Image", "image_caption", ["caption"]],
  ["ocr-text-cleaner", "OCR Text Cleaner", "Clean messy OCR text for reuse.", "ai-image-helpers", "OcrTextCleaner", "ScanText", "ocr_clean", ["ocr"]],
  ["color-palette-extractor", "Color Palette Extractor", "Generate a palette seed from a word or brand.", "ai-image-helpers", "ColorPaletteExtractor", "Palette", "color_palette", ["palette"]],
  ["prompt-generator-image-models", "Prompt Generator for Image Models", "Write image-model prompts from a subject.", "ai-image-helpers", "PromptGeneratorImageModels", "Sparkles", "image_prompt", ["image prompt"]],
  ["background-description-generator", "Background Description Generator", "Describe backgrounds for design or generation.", "ai-image-helpers", "BackgroundDescriptionGenerator", "Image", "bg_description", ["background"]],

  // Prompt engineering
  ["prompt-enhancer", "Prompt Enhancer", "Expand a prompt with constraints and examples.", "ai-prompt-engineering", "PromptEnhancer", "Sparkles", "prompt_enhance", ["prompt"]],
  ["prompt-shortener", "Prompt Shortener", "Tighten long prompts while keeping intent.", "ai-prompt-engineering", "PromptShortener", "Minimize2", "prompt_shorten", ["prompt"]],
  ["prompt-debugger", "Prompt Debugger", "Diagnose weak prompts and fix gaps.", "ai-prompt-engineering", "PromptDebugger", "Bug", "prompt_debug", ["prompt"]],
  ["prompt-translator", "Prompt Translator", "Adapt a prompt for another language output.", "ai-prompt-engineering", "PromptTranslator", "Globe", "prompt_translate", ["prompt"]],
  ["prompt-library", "Prompt Library", "Browse reusable prompt starters.", "ai-prompt-engineering", "PromptLibrary", "BookOpen", "prompt_library", ["prompt library"]],
  ["prompt-version-comparison", "Prompt Version Comparison", "Compare two prompt versions side by side.", "ai-prompt-engineering", "PromptVersionComparison", "GitCompare", "prompt_compare", ["prompt"]],
  ["prompt-quality-score", "Prompt Quality Score", "Score prompt quality with a simple checklist.", "ai-prompt-engineering", "PromptQualityScore", "Gauge", "prompt_score", ["prompt score"]],
  ["role-prompt-generator", "Role Prompt Generator", "Generate role-based system prompts.", "ai-prompt-engineering", "RolePromptGenerator", "UserRound", "role_prompt", ["role prompt"]],

  // Data
  ["csv-cleaner", "CSV Cleaner", "Normalize messy CSV spacing and quotes.", "ai-data-tools", "CsvCleaner", "Table2", "csv_clean", ["csv"]],
  ["json-cleaner", "JSON Cleaner", "Pretty-print and validate JSON.", "ai-data-tools", "JsonCleaner", "Braces", "json_clean", ["json"]],
  ["duplicate-finder", "Duplicate Finder", "Find duplicate lines in a dataset dump.", "ai-data-tools", "DuplicateFinder", "Copy", "duplicate_finder", ["duplicates"]],
  ["data-summarizer", "Data Summarizer", "Summarize row/column shape of pasted data.", "ai-data-tools", "DataSummarizer", "BarChart3", "data_summarizer", ["data"]],
  ["sql-to-csv", "SQL to CSV", "Convert simple SQL value lists to CSV rows.", "ai-data-tools", "SqlToCsvAi", "Database", "sql_to_csv", ["sql", "csv"]],
  ["csv-visualizer", "CSV Visualizer", "Inspect CSV columns and row counts.", "ai-data-tools", "CsvVisualizer", "BarChart3", "csv_visualizer", ["csv"]],

  // Automation
  ["workflow-generator", "Workflow Generator", "Draft a generic automation workflow.", "ai-automation-tools", "WorkflowGenerator", "GitBranch", "workflow_gen", ["workflow"]],
  ["sop-generator", "SOP Generator", "Generate a standard operating procedure outline.", "ai-automation-tools", "SopGenerator", "ClipboardList", "sop_gen", ["sop"]],
  ["checklist-generator", "Checklist Generator", "Create an actionable checklist from a goal.", "ai-automation-tools", "ChecklistGenerator", "ListChecks", "checklist_gen", ["checklist"]],
  ["email-automation-drafts", "Email Automation Drafts", "Draft a simple email nurture sequence.", "ai-automation-tools", "EmailAutomationDrafts", "Mail", "email_automation", ["email automation"]],
  ["zapier-workflow-ideas", "Zapier Workflow Ideas", "Brainstorm Zapier-style automations.", "ai-automation-tools", "ZapierWorkflowIdeas", "Zap", "zapier_ideas", ["zapier"]],
  ["n8n-workflow-generator", "n8n Workflow Generator", "Sketch an n8n node sequence for a goal.", "ai-automation-tools", "N8nWorkflowGenerator", "GitBranch", "n8n_workflow", ["n8n"]],
  ["api-integration-assistant", "API Integration Assistant", "Plan API auth, endpoints, and error handling.", "ai-automation-tools", "ApiIntegrationAssistant", "Network", "api_integration", ["api"]],

  // Website auditor
  ["ai-website-auditor", "AI Website Auditor", "Run a practical website quality/SEO checklist.", "ai-website-auditor", "AiWebsiteAuditor", "Monitor", "website_auditor", ["website audit"]],
];

export function normalizeAiEntry(row) {
  const [id, name, desc, category, component, icon, kind, keywords] = row;
  return {
    id,
    name,
    desc,
    category,
    component,
    icon,
    kind,
    keywords,
    path: `/${category}/${id}`,
    folder: category,
    seoKey: id
      .split("-")
      .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
      .join(""),
  };
}

export const AI_CATALOG_NORMALIZED = AI_CATALOG.map(normalizeAiEntry);

export const AI_CATEGORIES = [
  ["ai-writing-tools", "AI Writing Tools", "PenSquare", "/ai-writing-tools"],
  ["ai-coding-tools", "AI Coding Tools", "Code2", "/ai-coding-tools"],
  ["ai-seo-tools", "AI SEO Tools", "Search", "/ai-seo-tools"],
  ["ai-marketing-tools", "AI Marketing Tools", "Megaphone", "/ai-marketing-tools"],
  ["ai-office-tools", "AI Office Tools", "BriefcaseBusiness", "/ai-office-tools"],
  ["ai-resume-career", "AI Resume & Career", "FileUser", "/ai-resume-career"],
  ["ai-learning-tools", "AI Learning", "GraduationCap", "/ai-learning-tools"],
  ["ai-image-helpers", "AI Image Helpers", "Image", "/ai-image-helpers"],
  ["ai-prompt-engineering", "AI Prompt Engineering", "Sparkles", "/ai-prompt-engineering"],
  ["ai-data-tools", "AI Data Tools", "Database", "/ai-data-tools"],
  ["ai-automation-tools", "AI Automation", "GitBranch", "/ai-automation-tools"],
  ["ai-website-auditor", "AI Website Auditor", "Monitor", "/ai-website-auditor"],
];

/** Existing tool id → new category */
export const AI_REMAPS = {
  "blog-title-generator": "ai-writing-tools",
  "grammar-checker": "ai-writing-tools",
  "ai-instagram-caption-generator": "ai-writing-tools",
  "email-rewriter": "ai-writing-tools",
  "ai-humanizer": "ai-writing-tools",
  "ai-essay-writer": "ai-writing-tools",
  "ai-story-generator": "ai-writing-tools",
  "code-explainer": "ai-coding-tools",
  "regex-generator": "ai-coding-tools",
  "sql-generator": "ai-coding-tools",
  "api-documentation-generator": "ai-coding-tools",
  "commit-message-generator": "ai-coding-tools",
  "dockerfile-generator": "ai-coding-tools",
  "gitignore-generator": "ai-coding-tools",
  "api-mock-generator": "ai-coding-tools",
  "documentation-generator": "ai-coding-tools",
  "bug-report-generator": "ai-coding-tools",
  "meta-tag-generator": "ai-seo-tools",
  "schema-markup-generator": "ai-seo-tools",
  "robots-generator": "ai-seo-tools",
  "sitemap-generator": "ai-seo-tools",
  "website-seo-audit": "ai-seo-tools",
  "broken-link-checker": "ai-seo-tools",
  "page-speed-analyzer": "ai-seo-tools",
  "llm-readiness-checker": "ai-seo-tools",
  "keyword-density-checker": "ai-seo-tools",
  "open-graph-generator": "ai-seo-tools",
  "ai-prompt-optimizer": "ai-prompt-engineering",
  "gemini-prompt-generator": "ai-prompt-engineering",
  "ai-resume-score": "ai-resume-career",
  "ai-resume-builder": "ai-resume-career",
  "interview-question-generator": "ai-resume-career",
  "csv-to-json": "ai-data-tools",
  "json-to-csv": "ai-data-tools",
  "image-to-prompt": "ai-image-helpers",
  "ai-image-generator": "ai-image-helpers",
};
