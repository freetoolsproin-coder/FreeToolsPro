/**
 * Demo-only originality score helper (not a real plagiarism scan).
 * @param {string} text
 * @returns {Promise<{score: number, unique: number, words: number, message: string} | {error: string}>}
 */
export const checkPlagiarism = async (text) => {
  if (!text || typeof text !== "string") {
    return { error: "Invalid input: Text is required." };
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Illustrative random score only — does not compare against any web index.
  const score = Math.floor(Math.random() * 30);
  const unique = 100 - score;

  return {
    score,
    unique,
    words,
    message:
      "Demo only: this percentage is random for UI practice. FreeToolsPro does not compare your text to web pages or academic databases. Use a commercial checker (for example Copyleaks, Turnitin, or Grammarly) for real originality scans.",
  };
};
