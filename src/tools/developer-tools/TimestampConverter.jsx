import React, { useState, useEffect } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import { Check, Copy, RefreshCw, Clock, Code2 } from "lucide-react";

export default function TimestampConverter() {
  const [timestamp, setTimestamp] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [formattedDate, setFormattedDate] = useState("-");
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  );
  const [mode, setMode] = useState("seconds");
  const [relative, setRelative] = useState("-");
  const [liveNow, setLiveNow] = useState(Math.floor(Date.now() / 1000));
  const [copiedField, setCopiedField] = useState("");

  // Live clock generator for user convenience
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize with current time on first load
  useEffect(() => {
    handleCurrentTimestamp();
  }, [mode]);

  // Handle calculation when timestamp, mode, or timezone changes
  useEffect(() => {
    if (!timestamp) {
      setFormattedDate("-");
      setRelative("-");
      return;
    }

    let ts = Number(timestamp);
    if (isNaN(ts)) return;

    // Normalize to milliseconds for JS Date object
    const msTs = mode === "seconds" ? ts * 1000 : ts;
    const d = new Date(msTs);

    if (isNaN(d.getTime())) {
      setFormattedDate("Invalid Date");
      setRelative("-");
      return;
    }

    // Format human-readable date based on selected timezone
    try {
      const formatted = d.toLocaleString("en-US", {
        timeZone: timezone,
        dateStyle: "full",
        timeStyle: "long",
      });
      setFormattedDate(formatted);

      // Format input element value string (YYYY-MM-DDTHH:MM) in native browser local time
      // to keep the visual HTML date input synced without disrupting custom timezones
      const offset = d.getTimezoneOffset();
      const localDate = new Date(d.getTime() - offset * 60 * 1000);
      setDateInput(localDate.toISOString().slice(0, 16));
    } catch (e) {
      setFormattedDate(d.toUTCString() + " (Fallback UTC)");
    }

    // Relative time calculation
    const diff = Date.now() - msTs;
    const absSeconds = Math.abs(Math.floor(diff / 1000));
    const isPast = diff >= 0;

    let relText = "";
    if (absSeconds < 5) relText = "just now";
    else if (absSeconds < 60) relText = `${absSeconds} seconds`;
    else if (absSeconds < 3600) relText = `${Math.floor(absSeconds / 60)} minutes`;
    else if (absSeconds < 86400) relText = `${Math.floor(absSeconds / 3600)} hours`;
    else relText = `${Math.floor(absSeconds / 86400)} days`;

    if (absSeconds >= 5) {
      relText = isPast ? `${relText} ago` : `in ${relText}`;
    }

    setRelative(relText);
  }, [timestamp, timezone, mode]);

  // Convert HTML Input Date String → Timestamp
  const handleDateChange = (value) => {
    setDateInput(value);
    if (!value) return;

    const ts = new Date(value).getTime();
    if (isNaN(ts)) return;

    if (mode === "seconds") {
      setTimestamp(Math.floor(ts / 1000).toString());
    } else {
      setTimestamp(ts.toString());
    }
  };

  const handleCurrentTimestamp = () => {
    const now = Date.now();
    setTimestamp(mode === "seconds" ? Math.floor(now / 1000).toString() : now.toString());
  };

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  return (
    <>
      <Seo page="timestampConverter" />

      <ToolHeroShell
        category="developer-tools"
        icon={Code2}
        title="⏱️ Advanced Timestamp Converter"
        subtitle="Convert epoch times to human-readable dates seamlessly."
        formLabel="Start here"
      >
<div className="bg-white p-4 rounded-2xl">
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 mb-4 py-2 flex items-center gap-3 text-amber-800">
              <Clock size={18} className="animate-pulse" />
              <div className="text-xs sm:text-sm font-mono">
                Current Unix:{" "}
                <b className="tracking-wider">{mode === "seconds" ? liveNow : liveNow * 1000}</b>
              </div>
            </div>

            {/* Input control dashboard grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-xs font-normal text-gray-700 mb-1">
                  Epoch Unit Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2.5 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="seconds">Seconds (Unix)</option>
                  <option value="milliseconds">Milliseconds (JS)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-normal text-gray-700 mb-1">
                  Timestamp Value
                </label>
                <input
                  type="number"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2.5 w-full font-mono shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder={mode === "seconds" ? "e.g. 1719500000" : "e.g. 1719500000000"}
                />
              </div>

              <div>
                <label className="block text-xs font-normal text-gray-700 mb-1">
                  Date & Time Picker
                </label>
                <input
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2.5 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-normal text-gray-700 mb-1">
                  Display Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2.5 w-full bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="UTC">UTC (GMT +00:00)</option>
                  <option value={Intl.DateTimeFormat().resolvedOptions().timeZone}>
                    Local Browser Time
                  </option>
                  <option value="America/New_York">New York (EST/EDT)</option>
                  <option value="Europe/London">London (GMT/BST)</option>
                  <option value="Asia/Kolkata">Kolkata (IST)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
            </div>

            {/* Advanced Outputs UI */}
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center transition-all hover:bg-gray-100">
                <div className="overflow-hidden">
                  <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block mb-1">
                    Human Readable Date ({timezone})
                  </span>
                  <div className="text-gray-900 font-medium truncate text-base sm:text-lg">
                    {formattedDate}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(formattedDate, "date")}
                  className="ml-4 p-2 bg-white border rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                  title="Copy formatted date"
                >
                  {copiedField === "date" ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center transition-all hover:bg-gray-100">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-gray-400 block mb-1">
                    Relative Calculation
                  </span>
                  <div className="text-gray-900 font-mono font-bold text-base sm:text-lg capitalize">
                    {relative}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(relative, "relative")}
                  className="ml-4 p-2 bg-white border rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition"
                  title="Copy relative text"
                >
                  {copiedField === "relative" ? (
                    <Check size={18} className="text-green-600" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Action Bottom Row */}
            <div className="mt-6 flex justify-center border-t pt-4">
              <button
                onClick={handleCurrentTimestamp}
                className="flex items-center gap-2 px-5 py-2.5 btnRegular text-white font-medium rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all text-sm"
              >
                <RefreshCw size={16} /> Set to Present Moment
              </button>
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="developer-tools"
        currentToolPath="/developer-tools/timestamp-converter" />
    </>
  );
}
