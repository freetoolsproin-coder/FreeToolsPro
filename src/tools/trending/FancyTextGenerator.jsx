import React, { useState, useMemo } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import { Copy, Share2, Sparkles, RefreshCw, Type, AlignLeft, Search, Check, Zap } from "lucide-react";

export default function FancyTextGenerator() {
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [decoration, setDecoration] = useState("none");
  const [copiedIndex, setCopiedIndex] = useState(null);

  // 📝 Text analysis metrics
  const stats = useMemo(() => {
    return {
      characters: inputText.length,
      words: inputText.trim() ? inputText.trim().split(/\s+/).length : 0,
      spaces: (inputText.match(/ /g) || []).length,
    };
  }, [inputText]);

  // 🔠 Core Unicode Transformation Maps
  const transformText = (text, type) => {
    if (!text) return "";

    const normal = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const maps = {
      bold: "𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗",
      italic: "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁0123456789",
      boldItalic: "𝒂𝒃𝒄𝒅𝒆𝒇𝒈𝒉𝒊𝒋𝒌𝒍𝒎𝒏𝒐𝒑𝒒𝒓𝒔𝒕𝒖𝒗𝒘𝒙𝒚𝒛𝑨𝑩𝑪𝑫𝑬𝑭𝑮𝑯𝑰𝑱𝑲𝑳𝑴𝑵𝑶𝑷𝑸𝑹𝑺𝑻𝑼𝑽𝑾𝑿𝒀𝒁0123456789",
      script: "𝒶𝒷𝒸 crumb𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵0123456789",
      doubleStruck: "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ🔑𝕎𝕏𝕐ℤ𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡",
      fraktur: "𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷𝔄𝔅𝔆𝔇𝔈𝔉𝔊𝔧𝔨𝔏𝔐𝔫𝔒𝔐𝔔𝔯𝔖𝔗𝔘𝔙𝔚𝔛𝔜𝔷0123456789",
      monospace: "𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉0123456789",
      circled: "ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩⒶⒷⒸⒹⒺⒻⓉⓊⓋⓌⓍⓎⓏ⓪①②③④⑤⑥⑦⑧⑨",
      squared: "🄲🄱🄲🄳🄴🄵🄶🄸🄹🄺wrapwrap🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉🄰🄱🄲🄳🄴🄵🄶🄸🄹🄺wrapwrap🄽🄾🄿🅀🅁🅂🅃🅄🅅🅆🅇🅈🅉0123456789",
      smallCaps: "ᴀʙᴄᴅᴇꜰ爆ʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ0123456789",
      inverted: "ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz∀qƆpƎℲפHIſʞ˥WNOԀQပS┴∩ΛMX⅄Z0123456789",
    };

    let result = "";

    // Character inversion needs string reversal
    const targetText = type === "inverted" ? text.split("").reverse().join("") : text;

    for (let char of targetText) {
      const index = normal.indexOf(char);
      if (index !== -1 && maps[type]) {
        result += maps[type][index] || char;
      } else {
        result += char;
      }
    }

    // Apply custom decorators/borders
    if (decoration === "sparkle") return `✨ ${result} ✨`;
    if (decoration === "stars") return `⭐彡 ${result} 彡⭐`;
    if (decoration === "bracket") return `【 ${result} 】`;
    if (decoration === "heart") return `💖 ${result} 💖`;

    return result;
  };

  // 📂 Typography Styles Engine List
  const fontStyles = [
    { id: "bold", label: "Math Bold", example: "𝐚𝐛𝐜" },
    { id: "italic", label: "Mathematical Italic", example: "𝒂𝒃𝒄" },
    { id: "script", label: "Cursive / Script", example: "𝒶𝒷𝒸" },
    { id: "doubleStruck", label: "Blackboard Double-Struck", example: "𝕒𝕓𝕔" },
    { id: "fraktur", label: "Gothic / Fraktur", example: "𝔲𝔳𝔴" },
    { id: "monospace", label: "Retro Monospace", example: "𝚊𝚋𝚌" },
    { id: "circled", label: "Bubble Circled", example: "ⓐⓑⓒ" },
    { id: "squared", label: "Block Squared", example: "🄰🄱🄲" },
    { id: "smallCaps", label: "Clean Small Caps", example: "ᴀʙᴄ" },
    { id: "inverted", label: "Upside Down Flipped", example: "ɐqɔ" },
  ];

  const processedResults = useMemo(() => {
    return fontStyles
      .filter((style) => style.label.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((style) => ({
        ...style,
        // Default to empty string instead of running fallback text through transformer
        output: inputText ? transformText(inputText, style.id) : "",
      }));
  }, [inputText, searchTerm, decoration]);

  const handleCopy = (text, index) => {
    if (!text) return; // Prevent copying empty strings
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleShare = (text) => {
    if (!text) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <>
      <Seo page="fancyTextGenerator" />

      <ToolHeroShell
        category="trending-tools"
        icon={Zap}
        title="Fancy Text Generator"
        subtitle="Convert regular text into stylish Unicode web fonts effortlessly."
        formLabel="Start here"
      >
<div className="bg-white rounded-3xl p-6 mt-4 sm:p-8">
            {/* 📝 Text Input Box */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 flex text-slate-800 items-center gap-2">
                <Type size={16} className="text-blue-500" /> Input Your Text
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here..."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 font-medium transition-all resize-none"
              />
            </div>

            {/* 🛠️ Realtime Utilities & Customizer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Decoration Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Text Borders & Decor
                </label>
                <select
                  value={decoration}
                  onChange={(e) => setDecoration(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700"
                >
                  <option value="none">No Decoration (Clean)</option>
                  <option value="sparkle">✨ Sparkles ✨</option>
                  <option value="stars">⭐ Stars ⭐</option>
                  <option value="bracket">【 Brackets 】</option>
                  <option value="heart">💖 Hearts 💖</option>
                </select>
              </div>

              {/* Instant Transformations */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Quick Cases
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setInputText(inputText.toUpperCase())}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    UPPERCASE
                  </button>
                  <button
                    onClick={() => setInputText(inputText.toLowerCase())}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    lowercase
                  </button>
                </div>
              </div>
            </div>

            {/* 🔍 Search Styles and Statistics Counter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-t border-b border-slate-100 py-3 mb-6">
              <div className="relative w-full sm:w-64">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Filter fonts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-400"
                />
              </div>

              <div className="flex gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <AlignLeft size={12} /> Chars: <strong>{stats.characters}</strong>
                </span>
                <span>
                  Words: <strong>{stats.words}</strong>
                </span>
                <span>
                  Spaces: <strong>{stats.spaces}</strong>
                </span>
              </div>
            </div>

            {/* 📋 Styles Variant Result Cards */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {processedResults.map((style, index) => (
                <div
                  key={style.id}
                  className="p-4 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl flex items-center justify-between transition-all group"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase block mb-1">
                      {style.label}
                    </span>
                    <p className="text-lg text-slate-900 font-medium break-words select-all whitespace-pre-wrap min-h-[1.75rem]">
                      {style.output}
                    </p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(style.output, index)}
                      disabled={!style.output}
                      className={`p-2.5 rounded-xl transition-all border flex items-center gap-1 text-xs font-semibold ${
                        !style.output
                          ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                          : copiedIndex === index
                            ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                      title="Copy to clipboard"
                    >
                      {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedIndex === index ? "Copied" : "Copy"}</span>
                    </button>

                    <button
                      onClick={() => handleShare(style.output)}
                      disabled={!style.output}
                      className={`p-2.5 rounded-xl transition-all border ${
                        !style.output
                          ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                          : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                      title="Share to WhatsApp"
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {processedResults.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm">
                  No matching fancy font styles found.
                </div>
              )}
            </div>

            {/* Global Clear Trigger */}
            {inputText && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setInputText("")}
                  className="text-xs text-slate-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors"
                >
                  <RefreshCw size={12} /> Clear Output
                </button>
              </div>
            )}
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/fancy-text-generator" />
    </>
  );
}
