import { Image } from "lucide-react";
import { useState, useEffect } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";
import Toolbar from "./Toolbar";

export default function AllInOneImageToolkit() {
  const [image, setImage] = useState(null);
  const [processed, setProcessed] = useState(null);
  const [actionText, setActionText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewMode, setViewMode] = useState("side-by-side"); // "side-by-side" or "tabs"
  const [activeTab, setActiveTab] = useState("processed");

  // Cached object URLs to prevent memory leaks during re-renders
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState("");

  // Revoke object URLs safely when files change or unmount
  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl("");
    }
  }, [image]);

  useEffect(() => {
    if (processed) {
      const url = URL.createObjectURL(processed);
      setProcessedPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setProcessedPreviewUrl("");
    }
  }, [processed]);

  const handleFileChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setProcessed(null);
      setActionText("Original Image Uploaded");
      setActiveTab("processed");
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const downloadProcessedImage = () => {
    if (!processedPreviewUrl) return;
    const link = document.createElement("a");
    link.href = processedPreviewUrl;
    link.download = `processed_${image?.name || "image.png"}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Seo page="allinoneimagetoolkit" />

      <ToolHeroShell
        category="image-tools"
        icon={Image}
        title="All-In-One Image Toolkit"
        subtitle="Professional web-based image manipulation suite"
        formLabel="Start here"
      >
<div className="bg-white p-6 md:p-8 space-y-6 rounded-3xl mt-4">
            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-50/50 scale-[0.99]"
                  : "border-gray-300 hover:border-blue-400 bg-gray-50/50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="file-upload"
              />
              <div className="space-y-2 pointer-events-none">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600 hover:text-blue-500">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP, or GIF</p>
              </div>
            </div>

            {/* Smart Toolbar Component Wrapper */}
            {image && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <Toolbar
                  image={image}
                  setProcessed={setProcessed}
                  setActionText={setActionText}
                  setIsProcessing={setIsProcessing}
                />
              </div>
            )}

            {/* Processing State Loader */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center p-12 space-y-3">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-500 font-medium">
                  Applying magic transformation...
                </p>
              </div>
            )}

            {/* Workspace Area */}
            {image && !isProcessing && (
              <div className="space-y-4">
                {/* Workspace Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-gray-200">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewMode("side-by-side")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                        viewMode === "side-by-side"
                          ? "btnRegular text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Side by Side
                    </button>
                    <button
                      onClick={() => setViewMode("tabs")}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                        viewMode === "tabs"
                          ? "btnRegular text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Tabbed View
                    </button>
                  </div>

                  {processed && (
                    <button
                      onClick={downloadProcessedImage}
                      className="inline-flex items-center gap-1.5 btnRegular text-white text-xs font-normal py-1.5 px-4 rounded-md transition shadow-sm"
                    >
                      📥 Download Output
                    </button>
                  )}
                </div>

                {/* Main View Renderer */}
                {viewMode === "side-by-side" ? (
                  /* Side by Side Layout */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 text-center">
                      <span className="inline-block bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full font-semibold mb-3">
                        Original Uploaded Image
                      </span>
                      <div className="flex items-center justify-center min-h-[250px] max-h-[400px] overflow-hidden rounded-lg bg-white border border-gray-100">
                        <img
                          src={imagePreviewUrl}
                          alt="original"
                          className="max-w-full max-h-[350px] object-contain shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold mb-3">
                        {processed ? actionText : "Awaiting Actions..."}
                      </span>
                      <div className="flex items-center justify-center min-h-[250px] max-h-[400px] overflow-hidden rounded-lg bg-white border border-gray-100">
                        {processed ? (
                          <img
                            src={processedPreviewUrl}
                            alt="processed"
                            className="max-w-full max-h-[350px] object-contain shadow-sm"
                          />
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            Select an operation from the toolbar above
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Tabbed Layout */
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex border-b border-gray-200 bg-gray-50 gap-4">
                      <button
                        onClick={() => setActiveTab("original")}
                        className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition ${
                          activeTab === "original"
                            ? "border-blue-600 text-blue-600 bg-white"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Original
                      </button>
                      <button
                        onClick={() => setActiveTab("processed")}
                        className={`flex-1 py-2.5 text-sm font-medium border-b-2 transition ${
                          activeTab === "processed"
                            ? "border-blue-600 text-blue-600 bg-white"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        Processed Output {actionText && `(${actionText})`}
                      </button>
                    </div>
                    <div className="p-6 bg-white flex items-center justify-center min-h-[300px]">
                      {activeTab === "original" ? (
                        <img
                          src={imagePreviewUrl}
                          alt="original"
                          className="max-w-full max-h-[400px] object-contain"
                        />
                      ) : processed ? (
                        <img
                          src={processedPreviewUrl}
                          alt="processed"
                          className="max-w-full max-h-[400px] object-contain"
                        />
                      ) : (
                        <p className="text-sm text-gray-400 italic">
                          Apply an effect via your toolbar options to view updates
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/all-in-one-image-toolkit" />
    </>
  );
}
