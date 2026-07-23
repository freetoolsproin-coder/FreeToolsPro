import axios from "axios";

// 🔗 Change this URL when deploying
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/blog-titles";

/**
 * Generate blog titles using AI
 * @param {Object} data
 * @param {string} data.topic
 * @param {string} data.tone
 * @returns {Promise<string[]>}
 */
export const generateTitles = async ({ topic, tone }) => {
  try {
    const response = await axios.post(API_URL, {
      topic,
      tone,
    });

    let titles = response.data.titles;

    // 🧹 Clean titles (remove numbers, bullets, etc.)
    titles = titles
      .map((title) =>
        title
          .replace(/^\d+[\).\-\s]*/, "") // remove numbering
          .replace(/^[-•]\s*/, "") // remove bullets
          .trim()
      )
      .filter((title) => title.length > 0);

    return titles;
  } catch (error) {
    console.error("Error generating titles:", error);

    // 🛑 Fallback titles (if API fails)
    return [
      `Top 10 ${topic} Tips You Should Know`,
      `The Ultimate Guide to ${topic}`,
      `How to Master ${topic} in 2026`,
      `${topic}: Beginner to Pro Guide`,
      `Why ${topic} is Important Today`,
      `Best Strategies for ${topic} Success`,
      `${topic} Secrets Nobody Tells You`,
      `Step-by-Step Guide to ${topic}`,
      `${tone} Ways to Improve ${topic}`,
      `Everything You Need to Know About ${topic}`,
    ];
  }
};
