import { Zap } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

function QrCodeScanner() {
  const [result, setResult] = useState("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState("environment"); // 'environment' for back camera, 'user' for front
  const [errorMsg, setErrorMsg] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Clean up camera streams on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  // --- CAMERA HANDLING ---
  const startCamera = async () => {
    setErrorMsg("");
    setResult("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", true); // Required for iOS
        videoRef.current.play();
        setIsCameraOpen(true);
        animationFrameRef.current = requestAnimationFrame(tickCamera);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setErrorMsg("Could not access the camera. Please grant permissions or try file upload.");
    }
  };

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const toggleCameraFacing = () => {
    stopCamera();
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
    // Re-trigger camera with new facing mode
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  const tickCamera = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          setResult(code.data);
          stopCamera(); // Stop scanning once found
          return;
        }
      }
    }
    if (isCameraOpen) {
      animationFrameRef.current = requestAnimationFrame(tickCamera);
    }
  };

  // --- IMAGE FILE HANDLING ---
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    stopCamera();
    setResult("");
    setErrorMsg("");

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.src = event.target.result;
    };

    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setResult(code.data);
      } else {
        setErrorMsg("No valid QR code found in this image.");
      }
    };

    reader.readAsDataURL(file);
  };

  // --- UTILITIES ---
  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <>
      <Seo page="qrScanner" />

      <ToolHeroShell
        category="trending-tools"
        icon={Zap}
        title="QR Code Advanced Scanner"
        subtitle="Scan live via camera or upload an image file"
        formLabel="Start here"
      >
{/* Main Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {/* Mode Switcher Tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-700 gap-2">
              <button
                onClick={() => {
                  stopCamera();
                  startCamera();
                }}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  isCameraOpen
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500 dark:bg-gray-700 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                🎥 Live Camera
              </button>
              <button
                onClick={stopCamera}
                className={`flex-1 py-3 text-center font-medium transition-colors ${
                  !isCameraOpen
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500 dark:bg-gray-700 dark:text-blue-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                📁 Upload Image
              </button>
            </div>

            <div className="p-6">
              {/* Hidden Working Canvas */}
              <canvas ref={canvasRef} style={{ display: "none" }} />

              {/* Viewfinder Context */}
              {isCameraOpen ? (
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
                  <video ref={videoRef} className="w-full h-full object-cover" />
                  {/* Animated Scanner Laser Line */}
                  <div
                    className="absolute top-0 left-0 w-full h-1 bg-red-500 opacity-75 shadow-[0_0_8px_#f00] animate-bounce"
                    style={{ animationDuration: "3s" }}
                  />

                  {/* Camera Toolbar Overlay */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3 px-4">
                    <button
                      onClick={toggleCameraFacing}
                      className="px-3 py-1.5 text-xs bg-gray-900/80 text-white rounded-lg backdrop-blur hover:bg-gray-900 transition"
                    >
                      🔄 Flip Camera
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-1.5 text-xs bg-red-600/90 text-white rounded-lg backdrop-blur hover:bg-red-600 transition"
                    >
                      ⏹️ Stop Camera
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-4xl mb-2">📥</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Click to browse or drop QR code image here
                  </span>
                  <span className="text-xs text-gray-400 mt-1">Supports PNG, JPG, JPEG</span>
                </div>
              )}

              {/* Error State */}
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 text-center">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Scanned Result Card */}
              {result && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                    Scanned Result
                  </div>
                  <div className="text-base text-gray-800 dark:text-white break-all font-mono select-all bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 mb-4">
                    {result}
                  </div>

                  {/* Context-based Action Items */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={copyToClipboard}
                      className={`flex-1 min-w-[120px] py-2 px-4 rounded-lg font-medium text-sm text-white transition ${
                        isCopied ? "btnRegular" : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {isCopied ? "✓ Copied!" : "📋 Copy Content"}
                    </button>

                    {isUrl(result) && (
                      <a
                        href={result}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-[120px] text-center py-2 px-4 rounded-lg font-medium text-sm btnRegular hover:bg-purple-700 text-white transition"
                      >
                        🌐 Visit Link
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="trending-tools"
        currentToolPath="/trending-tools/qr-code-scanner" />
    </>
  );
}

export default QrCodeScanner;
