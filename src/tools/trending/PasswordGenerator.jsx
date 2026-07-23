import React, { useState, useEffect, useCallback } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import { Copy, Check, RefreshCw, Lock } from "lucide-react";

function PasswordGenerator() {
  const [length, setLength] = useState(16); // Bumped default to a more secure 16
  const [password, setPassword] = useState("");
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [copied, setCopied] = useState(false);

  // Advanced, cryptographically secure password generation logic
  const generatePassword = useCallback(() => {
    let baseChars = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      number: "0123456789",
      symbol: "!@#$%^&*()_+[]{}<>?/",
    };

    if (excludeSimilar) {
      const similarPattern = /[il1Lo0O!|]/g;
      baseChars.upper = baseChars.upper.replace(similarPattern, "");
      baseChars.lower = baseChars.lower.replace(similarPattern, "");
      baseChars.number = baseChars.number.replace(similarPattern, "");
      baseChars.symbol = baseChars.symbol.replace(similarPattern, "");
    }

    let poolsToUse = [];
    let guaranteedChars = [];

    if (uppercase && baseChars.upper) poolsToUse.push(baseChars.upper);
    if (lowercase && baseChars.lower) poolsToUse.push(baseChars.lower);
    if (numbers && baseChars.number) poolsToUse.push(baseChars.number);
    if (symbols && baseChars.symbol) poolsToUse.push(baseChars.symbol);

    if (poolsToUse.length === 0) {
      setPassword("");
      return;
    }

    // Cryptographically secure helper function
    const getRandomChar = (str) => {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return str.charAt(array[0] % str.length);
    };

    // 1. Force at least one character from each selected option to guarantee structural validity
    poolsToUse.forEach((pool) => {
      guaranteedChars.push(getRandomChar(pool));
    });

    // 2. Fill out the remaining length with the full pooled character set
    const fullPool = poolsToUse.join("");
    let remainingPassword = "";
    const remainingLength = Math.max(0, length - guaranteedChars.length);

    for (let i = 0; i < remainingLength; i++) {
      remainingPassword += getRandomChar(fullPool);
    }

    // 3. Combine and shuffle the results to remove predictable placement patterns
    const combinedArray = [...guaranteedChars, ...remainingPassword.split("")];
    for (let i = combinedArray.length - 1; i > 0; i--) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      const j = array[0] % (i + 1);
      [combinedArray[i], combinedArray[j]] = [combinedArray[j], combinedArray[i]];
    }

    setPassword(combinedArray.join(""));
  }, [length, uppercase, lowercase, numbers, symbols, excludeSimilar]);

  // Regenerate password automatically when options change
  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Dynamic Password Strength Evaluation
  const getStrength = () => {
    if (!password) return { label: "Select Options", color: "bg-gray-300", width: "w-0" };

    let activePools = 0;
    if (uppercase) activePools++;
    if (lowercase) activePools++;
    if (numbers) activePools++;
    if (symbols) activePools++;

    if (length < 8 || activePools <= 1) {
      return { label: "Weak 🚫", color: "bg-red-500", width: "w-1/3" };
    }
    if (length < 12 || activePools === 2) {
      return { label: "Medium ⚠️", color: "bg-yellow-500", width: "w-2/3" };
    }
    return { label: "Strong 💪", color: "bg-green-500", width: "w-full" };
  };

  const strength = getStrength();

  const copyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset icon state after 2 seconds
  };

  return (
    <>
      <Seo page="passwordGenerator" />

      <ToolHeroShell
        category="trending-tools"
        icon={Lock}
        title="Advanced Password Generator"
        subtitle="Generate strong, private passwords in your browser."
        formLabel="Generate"
      >
          <div className="text-center">
            {/* Password Display Box */}
            <div className="password-box mb-4 mt-0 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center gap-2">
                <input
                  className="flex w-full rounded-xl border border-gray-300 bg-white p-3 font-mono text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-[color:var(--hero-accent)]"
                  type="text"
                  value={password}
                  readOnly
                  placeholder="Select options to generate password"
                />

                <button
                  className="flex items-center justify-center rounded-xl bg-[var(--ftp-ink)] p-2 text-white shadow transition duration-150"
                  onClick={generatePassword}
                  title="Regenerate"
                  disabled={!(uppercase || lowercase || numbers || symbols)}
                >
                  <RefreshCw size={20} className="transition-transform hover:rotate-45" />
                </button>

                <button
                  className={`flex items-center justify-center rounded-xl p-3 text-white shadow transition duration-150 ${
                    copied ? "bg-green-600 hover:bg-green-700" : "bg-[var(--ftp-ink)] hover:opacity-90"
                  }`}
                  onClick={copyPassword}
                  disabled={!password}
                  title="Copy to Clipboard"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>

              {/* Dynamic Password Strength Visualizer */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold mb-1 text-gray-600">
                  <span>Password Strength:</span>
                  <span>{strength.label}</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color} ${strength.width}`}
                  ></div>
                </div>
              </div>
            </div>

            {/* Control Panel Settings */}
            <div className="settings-panel bg-gray-50 rounded-2xl border border-gray-200 p-5 flex flex-col gap-5">
              {/* Length Slider Controls */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between font-medium text-sm text-gray-700">
                  <span>Character Length</span>
                  <span className="font-mono bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md text-sm">
                    {length}
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="64" // Expanded maximum limits for enterprise use cases
                  value={length}
                  className="w-full inputSlider h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  onChange={(e) => setLength(parseInt(e.target.value))}
                />
              </div>

              <hr className="border-gray-200" />

              {/* Character Rules Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex gap-3 items-center cursor-pointer select-none text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-600 cursor-pointer"
                    checked={uppercase}
                    onChange={() => setUppercase(!uppercase)}
                  />
                  Uppercase Letters (A-Z)
                </label>

                <label className="flex gap-3 items-center cursor-pointer select-none text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-600 cursor-pointer"
                    checked={lowercase}
                    onChange={() => setLowercase(!lowercase)}
                  />
                  Lowercase Letters (a-z)
                </label>

                <label className="flex gap-3 items-center cursor-pointer select-none text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-600 cursor-pointer"
                    checked={numbers}
                    onChange={() => setNumbers(!numbers)}
                  />
                  Numbers (0-9)
                </label>

                <label className="flex gap-3 items-center cursor-pointer select-none text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded accent-blue-600 cursor-pointer"
                    checked={symbols}
                    onChange={() => setSymbols(!symbols)}
                  />
                  Symbols (!@#$%^&*)
                </label>
              </div>

              <hr className="border-gray-200" />

              {/* Advanced Accessibility Setting */}
              <label className="flex gap-3 items-center cursor-pointer select-none text-sm font-medium text-gray-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded accent-amber-600 cursor-pointer"
                  checked={excludeSimilar}
                  onChange={() => setExcludeSimilar(!excludeSimilar)}
                />
                <span>
                  Exclude ambiguous characters{" "}
                  <span className="text-xs block text-gray-500">(e.g. avoid i, l, 1, L, o, 0)</span>
                </span>
              </label>
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/password-generator" />
    </>
  );
}

export default PasswordGenerator;
