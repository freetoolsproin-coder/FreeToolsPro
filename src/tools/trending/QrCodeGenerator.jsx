import { Zap } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react"; // Import the canvas engine
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

function QrCodeGenerator() {
  const [activeTab, setActiveTab] = useState("content");
  const canvasRef = useRef(null); // Attach to the hidden engine canvas

  // --- State for QR Code Data ---
  const [contentType, setContentType] = useState("url");
  const [textUrl, setTextUrl] = useState("");
  const [vcard, setVcard] = useState({ name: "", phone: "", email: "" });

  // --- State for Design ---
  const [designType, setDesignType] = useState("solid");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [gradientColor, setGradientColor] = useState("#4f46e5");
  const [dotsShape, setDotsShape] = useState("square");

  // --- State for Logo ---
  const [logo, setLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // --- State for Advanced Settings ---
  const [errorCorrection, setErrorCorrection] = useState("M");
  const [qrSize, setQrSize] = useState("512");
  const [downloadFormat, setDownloadFormat] = useState("png"); // png, svg

  const tabs = [
    { id: "content", label: "🔗 1. Enter URL", desc: "Text, URL, or VCard" },
    { id: "design", label: "🎨 2. Customize Design", desc: "Colors, gradients & shapes" },
    { id: "logo", label: "🖼️ 3. Add Logo", desc: "Brand your QR code" },
    { id: "settings", label: "⚙️ 4. Advanced Settings", desc: "Error correction and sizes" },
  ];

  // Handle Logo Upload Preview
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // --- Programmatic Download Logic ---
  const handleDownload = () => {
    // 1. Build out the structured data payload
    const qrData =
      contentType === "vcard"
        ? `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard.name}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nEND:VCARD`
        : textUrl || "https://example.com";

    // 2. Identify the real underlying <canvas> element inside our wrapper
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    if (downloadFormat === "png") {
      // Direct Canvas-to-PNG download string
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else if (downloadFormat === "svg") {
      // Programmatic inline SVG construct generation fallback
      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">
          <foreignObject width="100%" height="100%">
            <img src="${canvas.toDataURL("image/png")}" width="100%" height="100%" />
          </foreignObject>
        </svg>
      `;
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Construct current reactive configurations to pass to the engine
  const currentQrValue =
    contentType === "vcard"
      ? `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard.name}\nTEL:${vcard.phone}\nEMAIL:${vcard.email}\nEND:VCARD`
      : textUrl || "https://example.com";

  return (
    <>
      <Seo page="qrGenerator" />

      <ToolHeroShell
        category="trending-tools"
        icon={Zap}
        title="QR Code Generator Studio"
        subtitle="Configure options, preview live, and download instantly."
        formLabel="Start here"
        layout="stack"
        wide
      >
<div className="max-w-6xl mx-auto">
{/* 2-Column Studio Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-slate-800">
            {/* LEFT SIDE: Settings Configuration (7 Columns) */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 h-full">
              {/* Tab Navigation Menu */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 border-b border-slate-100 pb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-900 shadow-sm"
                        : "bg-slate-50 border-2 border-transparent text-slate-500 hover:bg-slate-100"
                    }`}
                  >
                    <div className="text-xs font-bold whitespace-nowrap">{tab.label}</div>
                    <div className="text-[10px] opacity-75 hidden sm:block truncate">
                      {tab.desc}
                    </div>
                  </button>
                ))}
              </div>

              {/* Dynamic Configuration Panels */}
              <div className="pt-2 min-h-[200px]">
                {activeTab === "content" && (
                  <div className="space-y-4">
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-lg max-w-xs">
                      {["url", "text", "vcard"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setContentType(type)}
                          className={`flex-1 text-xs py-1.5 px-3 rounded-md font-medium uppercase transition-all ${
                            contentType === type
                              ? "bg-white shadow-sm text-slate-900"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {contentType !== "vcard" ? (
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                          {contentType === "url" ? "Website URL" : "Plain Text"}
                        </label>
                        <input
                          type={contentType === "url" ? "url" : "text"}
                          placeholder={
                            contentType === "url" ? "https://example.com" : "Type your text here..."
                          }
                          value={textUrl}
                          onChange={(e) => setTextUrl(e.target.value)}
                          className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            placeholder="John Doe"
                            value={vcard.name}
                            onChange={(e) => setVcard({ ...vcard, name: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            placeholder="+123456789"
                            value={vcard.phone}
                            onChange={(e) => setVcard({ ...vcard, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="john@example.com"
                            value={vcard.email}
                            onChange={(e) => setVcard({ ...vcard, email: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "design" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                          Color Type
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setDesignType("solid")}
                            className={`flex-1 py-2 text-xs font-semibold border rounded-xl ${designType === "solid" ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-slate-200"}`}
                          >
                            Solid Color
                          </button>
                          <button
                            onClick={() => setDesignType("gradient")}
                            className={`flex-1 py-2 text-xs font-semibold border rounded-xl ${designType === "gradient" ? "border-indigo-600 bg-indigo-50/50 text-indigo-700" : "border-slate-200"}`}
                          >
                            Gradient
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2">
                          Pattern Shape
                        </label>
                        <select
                          value={dotsShape}
                          onChange={(e) => setDotsShape(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                        >
                          <option value="square">Square (Standard)</option>
                          <option value="rounded">Rounded Squares</option>
                          <option value="dots">Circular Dots</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex gap-4 items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">
                          {designType === "gradient" ? "Start Color" : "QR Color"}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={primaryColor}
                            onChange={(e) => setPrimaryColor(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border border-slate-300"
                          />
                          <span className="text-xs font-mono">{primaryColor}</span>
                        </div>
                      </div>

                      {designType === "gradient" && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">
                            End Color
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={gradientColor}
                              onChange={(e) => setGradientColor(e.target.value)}
                              className="w-8 h-8 rounded cursor-pointer border border-slate-300"
                            />
                            <span className="text-xs font-mono">{gradientColor}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "logo" && (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase text-slate-500">
                      Upload Brand Logo
                    </label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50/50 transition-all relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="text-sm text-slate-600">
                        {logo ? (
                          <span className="text-teal-700 font-medium">✨ {logo.name}</span>
                        ) : (
                          "Click or drag brand logo here"
                        )}
                      </div>
                    </div>
                    {logo && (
                      <button
                        onClick={() => {
                          setLogo(null);
                          setLogoPreview(null);
                        }}
                        className="text-xs text-rose-600 font-medium hover:underline"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Error Correction
                      </label>
                      <select
                        value={errorCorrection}
                        onChange={(e) => setErrorCorrection(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                      >
                        <option value="L">Low (7% recovery)</option>
                        <option value="M">Medium (15% recommended)</option>
                        <option value="Q">Quartile (25% protection)</option>
                        <option value="H">High (30% - safe with big logos)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-500 mb-1">
                        Output Resolution
                      </label>
                      <select
                        value={qrSize}
                        onChange={(e) => setQrSize(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm bg-white"
                      >
                        <option value="256">256 x 256 px</option>
                        <option value="512">512 x 512 px (HQ)</option>
                        <option value="1024">1024 x 1024 px (UHD Print)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Pro Tip Box */}
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
                <span className="text-lg">💡</span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Pro Tip:</strong> For large physical print layouts, grab your code in{" "}
                  <strong>SVG format</strong> to maximize crisp scaling elements!
                </p>
              </div>
            </div>

            {/* RIGHT SIDE: LIVE PREVIEW & DOWNLOAD CARD (5 Columns) */}
            <div className="lg:col-span-5 bg-slate-200 border border-slate-800 text-white p-6 rounded-2xl flex flex-col items-center justify-between shadow-xl text-center self-stretch">
              <div className="w-full">
                <span className="text-[10px] uppercase tracking-wider font-extrabold bg-slate-900 text-slate-100 px-2.5 py-1 rounded-full">
                  Live Studio Preview
                </span>

                {/* Simulated QR Code Canvas Area using qrcode.react */}
                <div
                  ref={canvasRef}
                  className="mt-6 w-48 h-48 bg-white rounded-xl mx-auto p-4 flex items-center justify-center relative shadow-inner"
                >
                  <QRCodeCanvas
                    value={currentQrValue}
                    size={Number(qrSize)}
                    level={errorCorrection}
                    bgColor="#FFFFFF"
                    fgColor={primaryColor}
                    style={{ width: "100%", height: "100%" }}
                    imageSettings={
                      logoPreview
                        ? {
                            src: logoPreview,
                            x: undefined,
                            y: undefined,
                            height: Number(qrSize) * 0.2,
                            width: Number(qrSize) * 0.2,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>

                <p className="text-sm text-slate-900 mt-4 max-w-xs mx-auto truncate">
                  {contentType === "vcard"
                    ? `📇 vCard: ${vcard.name || "Unnamed"}`
                    : `🔗 Data: ${textUrl || "https://example.com"}`}
                </p>
              </div>

              {/* Format Selectors and Primary Action Download Button */}
              <div className="w-full mt-6 pt-4 border-t border-slate-400 space-y-3">
                <div className="flex gap-2 justify-center p-1 bg-slate-400 rounded-lg">
                  {["png", "svg"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setDownloadFormat(fmt)}
                      className={`flex-1 text-xs py-1.5 font-bold btnRegular uppercase rounded-md transition-all ${
                        downloadFormat === fmt
                          ? "btnRegular text-white shadow-sm"
                          : "text-slate-200 hover:text-white"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full btnRegular mx-auto text-white font-normal py-3 px-4 rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2"
                >
                  📥 Download QR Code ({downloadFormat.toUpperCase()})
                </button>
              </div>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      {/* SEO Content Section */}
      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/qr-code-generator" />
    </>
  );
}

export default QrCodeGenerator;
