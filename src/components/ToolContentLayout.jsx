import ToolPageContent from "./ToolPageContent";

/**
 * Routes tool pages onto the standard 8-section editorial column.
 * Category defaults fill gaps when props are omitted.
 */
export default function ToolContentLayout({
  category,
  currentToolPath,
  toolName,
  toolDesc,
  relatedCategory,
  trustBullets,
  ctaLabel = "Back to tool",
  howTitle,
  howBody,
  steps,
  whatItDoes,
  faqs,
  examplePairs,
  privacyStatement,
  limitations,
  lastReviewed,
}) {
  return (
    <ToolPageContent
      category={category}
      currentToolPath={currentToolPath}
      toolName={toolName}
      toolDesc={toolDesc}
      relatedCategory={relatedCategory}
      howTitle={howTitle}
      howBody={howBody}
      steps={steps}
      whatItDoes={whatItDoes}
      faqs={faqs}
      trustBullets={trustBullets}
      ctaLabel={ctaLabel}
      examplePairs={examplePairs}
      privacyStatement={privacyStatement}
      limitations={limitations}
      lastReviewed={lastReviewed}
    />
  );
}
