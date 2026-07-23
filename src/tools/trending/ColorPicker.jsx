import React, { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import { Copy, Check, RefreshCw, Eye, Zap } from "lucide-react";

function ColorPicker() {
  const [color, setColor] = useState({
    hex: "#ff0000",
    rgb: { r: 255, g: 0, b: 0, a: 1 },
    hsl: { h: 0, s: 1, l: 0.5, a: 1 },
  });
  const [copiedFormat, setCopiedFormat] = useState(null);
  const [history, setHistory] = useState(["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#00ffff"]);

  // Format strings for easy copying and viewing
  const hexString = color.hex.toUpperCase();
  const rgbString = `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
  const hslString = `hsl(${Math.round(color.hsl.h)}°, ${Math.round(color.hsl.s * 100)}%, ${Math.round(color.hsl.l * 100)}%)`;

  // Calculate Text Contrast (Relative Luminance WCAG Formula)
  const getContrastYIQ = (hexcolor) => {
    const r = parseInt(hexcolor.substring(1, 3), 16);
    const g = parseInt(hexcolor.substring(3, 5), 16);
    const b = parseInt(hexcolor.substring(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
  };

  const textColor = getContrastYIQ(color.hex);

  // Handle color picker updates
  const handleColorChange = (updatedColor) => {
    setColor({
      hex: updatedColor.hex,
      rgb: updatedColor.rgb,
      hsl: updatedColor.hsl,
    });
  };

  // Modern clipboard handler with inline feedback
  const copyToClipboard = (text, format) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);

    // Save to history if it's a new unique hex color
    if (!history.includes(text.toLowerCase()) && format === "HEX") {
      setHistory((prev) => [text.toLowerCase(), ...prev.slice(0, 7)]);
    }
  };

  // Reset copy state timeout
  useEffect(() => {
    if (copiedFormat) {
      const timer = setTimeout(() => setCopiedFormat(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedFormat]);

  // Generate random color function
  const generateRandomColor = () => {
    const randomHex =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    // Temporary container to let SketchPicker-compatible objects resolve smoothly
    copyToClipboard(randomHex, "HEX");
  };

  return (
    <>
      <Seo page="colorPicker" />

      <ToolHeroShell
        category="trending-tools"
        icon={Zap}
        title="Advanced Color Picker"
        subtitle="Pick, convert, analyze contrast, and save color palettes seamlessly."
        formLabel="Start here"
        layout="stack"
      >
{/* Main Interface Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white mt-4 dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            {/* Left Side: The Picker Box */}
            <div className="flex flex-col items-center justify-center p-2 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
              <SketchPicker
                className="!shadow-none !bg-transparent font-sans"
                color={color.rgb}
                onChange={handleColorChange}
              />
              <button
                onClick={generateRandomColor}
                className="mt-6 flex items-center gap-2 px-4 py-2 btnRegular hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-md"
              >
                <RefreshCw size={14} /> Random Color
              </button>
            </div>

            {/* Right Side: Displays & Utilities */}
            <div className="flex flex-col justify-between space-y-6">
              {/* Dynamic Preview & Contrast Check Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Live Preview & Contrast
                </label>
                <div
                  className="w-full h-32 rounded-xl flex flex-col items-center justify-center transition-all duration-200 border border-black/10 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                >
                  <span
                    style={{ color: textColor }}
                    className="text-lg font-bold flex items-center gap-2"
                  >
                    <Eye size={18} /> Aa Bb Cc
                  </span>
                  <span style={{ color: textColor }} className="text-xs opacity-75 mt-1">
                    Readable on this background (
                    {textColor === "#ffffff" ? "Light Text" : "Dark Text"})
                  </span>
                </div>
              </div>

              {/* Multiple Color Format Copiers */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Color Formats
                </label>

                {/* HEX */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-400 w-12 pl-2">HEX</span>
                  <code className="text-md font-mono font-bold text-gray-700 dark:text-gray-200">
                    {hexString}
                  </code>
                  <button
                    onClick={() => copyToClipboard(hexString, "HEX")}
                    className={`p-2 rounded-md transition ${copiedFormat === "HEX" ? "bg-green-100 text-green-700" : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500"}`}
                  >
                    {copiedFormat === "HEX" ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                {/* RGB */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-400 w-12 pl-2">RGB</span>
                  <code className="text-md font-mono text-sm text-gray-700 dark:text-gray-200">
                    {rgbString}
                  </code>
                  <button
                    onClick={() => copyToClipboard(rgbString, "RGB")}
                    className={`p-2 rounded-md transition ${copiedFormat === "RGB" ? "bg-green-100 text-green-700" : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500"}`}
                  >
                    {copiedFormat === "RGB" ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                {/* HSL */}
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-bold text-gray-400 w-12 pl-2">HSL</span>
                  <code className="text-md font-mono text-sm text-gray-700 dark:text-gray-200">
                    {hslString}
                  </code>
                  <button
                    onClick={() => copyToClipboard(hslString, "HSL")}
                    className={`p-2 rounded-md transition ${copiedFormat === "HSL" ? "bg-green-100 text-green-700" : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-500"}`}
                  >
                    {copiedFormat === "HSL" ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              {/* Color Session History */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Recent Palette
                </label>
                <div className="flex gap-2 flex-wrap">
                  {history.map((histColor, index) => (
                    <button
                      key={index}
                      className="w-8 h-8 rounded-full border border-black/10 transform hover:scale-110 active:scale-90 transition shadow-sm"
                      style={{ backgroundColor: histColor }}
                      title={`Switch to ${histColor}`}
                      onClick={() =>
                        handleColorChange({
                          hex: histColor,
                          rgb: {
                            r: parseInt(histColor.substring(1, 3), 16),
                            g: parseInt(histColor.substring(3, 5), 16),
                            b: parseInt(histColor.substring(5, 7), 16),
                          },
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/color-picker" />
    </>
  );
}

export default ColorPicker;
