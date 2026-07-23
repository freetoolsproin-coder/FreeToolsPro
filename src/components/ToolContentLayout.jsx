import ToolPageContent from "./ToolPageContent";

/**
 * Routes tool pages onto the standard editorial column
 * (how it works → steps → privacy note → FAQ → related tools).
 * Category defaults fill gaps when props are omitted.
 */
export default function ToolContentLayout({
  category,
  currentToolPath,
  trustBullets,
  ctaLabel = "Back to tool",
  howTitle,
  howBody,
  steps,
  whatItDoes,
  faqs,
  privacyNote,
}) {
  return (
    <ToolPageContent
      category={category}
      currentToolPath={currentToolPath}
      howTitle={howTitle}
      howBody={howBody}
      steps={steps}
      whatItDoes={whatItDoes}
      faqs={faqs}
      trustBullets={trustBullets}
      ctaLabel={ctaLabel}
      privacyNote={privacyNote}
    />
  );
}
