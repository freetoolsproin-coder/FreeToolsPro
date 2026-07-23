import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Copy, Check, RefreshCw, Layers, Target, Globe } from "lucide-react";
import { generateTitles } from "../../utils/generateTitles";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

const BlogTitleGenerator = () => {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Catchy");
  const [audience, setAudience] = useState("General");
  const [language, setLanguage] = useState("English");
  const [count, setCount] = useState(5);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      // Passing advanced filters to your utility function
      const data = await generateTitles({
        topic: topic.trim(),
        tone,
        audience,
        language,
        count,
      });
      setTitles(data || []);
    } catch (error) {
      console.error("Error generating titles:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setTopic("");
    setTitles([]);
  };

  return (
    <>
      <Seo page="blogTitleGenerator" />

      <ToolHeroShell
        category="social-media-tools"
        icon={Sparkles}
        title="Advanced Blog Title Generator"
        subtitle="Craft high-converting, SEO-optimized titles for your audience."
        formLabel="Generate"
      >
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Primary Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  What is your blog post about?
                </label>
                <input
                  type="text"
                  placeholder="Enter main topic or keywords (e.g., SEO, HIIT Workout, Remote Work)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition-all outline-none"
                />
              </div>

              {/* Advanced Configurations Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Sparkles size={14} className="text-indigo-500" /> Tone & Style
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  >
                    <option>Catchy</option>
                    <option>Professional</option>
                    <option>Viral & Clickworthy</option>
                    <option>SEO Optimized</option>
                    <option>Question-Based</option>
                    <option>Minimalist</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Target size={14} className="text-indigo-500" /> Target Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  >
                    <option>General</option>
                    <option>Beginners</option>
                    <option>Experts/Professionals</option>
                    <option>Tech Savvy</option>
                    <option>Business Owners</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Globe size={14} className="text-indigo-500" /> Output Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  >
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Layers size={14} className="text-indigo-500" /> Number of Variations
                  </label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-all outline-none"
                  >
                    <option value={3}>Generate 3 Ideas</option>
                    <option value={5}>Generate 5 Ideas</option>
                    <option value={10}>Generate 10 Ideas</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                {titles.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className="flex items-center justify-center gap-2 px-6 py-3 btnRegular hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Analyzing & Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Generate Titles
                    </>
                  )}
                </button>
              </div>

              {/* RESULTS SECTION */}
              <AnimatePresence mode="wait">
                {titles.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                      ✨ Suggested Headlines ({titles.length})
                    </h3>
                    <div className="space-y-3">
                      {titles.map((title, i) => (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          key={i}
                          className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 px-4 py-3.5 rounded-xl border border-gray-100 dark:border-gray-700 group transition-all"
                        >
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 pr-4">
                            {title}
                          </p>
                          <button
                            onClick={() => copyText(title, i)}
                            className="flex items-center gap-1.5 p-2 rounded-lg text-gray-400 hover:text-teal-700 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-all shrink-0"
                            title="Copy to clipboard"
                          >
                            {copiedIndex === i ? (
                              <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                                <Check size={16} /> Copied!
                              </span>
                            ) : (
                              <Copy
                                size={16}
                                className="group-hover:scale-105 transition-transform"
                              />
                            )}
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/blog-title-generator" />
    </>
  );
};

export default BlogTitleGenerator;
