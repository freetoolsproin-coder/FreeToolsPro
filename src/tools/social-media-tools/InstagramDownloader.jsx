import { useState } from "react";
import { Download,
  Clipboard,
  X,
  RefreshCw,
  AlertCircle,
  Video,
  Image as ImageIcon, Sparkles } from "lucide-react";
import { fetchVideo } from "../../backend/api";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [videoData, setVideoData] = useState(null); // Changed to handle object payloads (videoUrl, title, thumbnailUrl)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadingFile, setDownloadingFile] = useState(false);

  // Validate Instagram URLs before calling the API
  const validateInstagramUrl = (inputUrl) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9-_]+)/;
    return regex.test(inputUrl);
  };

  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Please paste an Instagram URL first.");
      return;
    }

    if (!validateInstagramUrl(url)) {
      setError("Invalid Instagram link. Please provide a valid Post, Reel, or IGTV URL.");
      return;
    }

    setLoading(true);
    setError("");
    setVideoData(null);

    try {
      const res = await fetchVideo(url);
      // Backend should ideally return: { videoUrl: '...', title: '...', thumbnailUrl: '...' }
      if (res && res.videoUrl) {
        setVideoData(res);
      } else {
        throw new Error("No media found.");
      }
    } catch (err) {
      setError("Failed to fetch media. Make sure the account is public and the link is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError("");
    } catch (err) {
      setError("Unable to access clipboard. Please paste manually.");
    }
  };

  // Triggers actual file download instead of opening a new browser tab
  const forceDownloadFile = async (fileUrl, filename = "instagram-media.mp4") => {
    setDownloadingFile(true);
    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback to opening in new window if CORS blocks the direct blob fetch
      window.open(fileUrl, "_blank");
    } finally {
      setDownloadingFile(false);
    }
  };

  return (
    <>
      <Seo page="instagramVideoDownloader" />

      <ToolHeroShell
        category="social-media-tools"
        icon={Sparkles}
        title="Instagram Downloader"
        subtitle="Download high-quality Reels, Videos, and Photos instantly."
        formLabel="Start here"
      >
{/* Input Group */}
          <div className="space-y-4 mt-4 bg-white rounded-3xl p-6">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Paste Instagram link here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError("");
                }}
                className="w-full pl-4 pr-24 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all text-sm md:text-base"
              />

              {/* Actions Inside Input Box */}
              <div className="absolute right-2 flex items-center gap-1">
                {url && (
                  <button
                    onClick={() => setUrl("")}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg bg-white"
                    title="Clear"
                  >
                    <X size={18} />
                  </button>
                )}
                <button
                  onClick={handlePaste}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-200 hover:bg-slate-300 btnRegular dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-xs rounded-lg transition"
                  title="Paste from clipboard"
                >
                  <Clipboard size={14} />
                  <span className="hidden sm:inline">Paste</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full btnRegular hover:to-purple-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleDownload}
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Processing Media...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Fetch Content</span>
                </>
              )}
            </button>

            {/* Error Alert View */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-xl flex items-start gap-2.5 text-sm animate-fadeIn">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading && (
              <div className="mt-6 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="w-full h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mx-auto" />
                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/2 mx-auto" />
              </div>
            )}

            {/* Premium Preview & Download Cards */}
            {videoData && !loading && (
              <div className="mt-6 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 bg-slate-50 dark:bg-slate-900/50 text-center space-y-4 animate-fadeIn">
                <div className="relative max-w-xs mx-auto rounded-xl overflow-hidden shadow-md group">
                  <video
                    src={videoData.videoUrl}
                    poster={videoData.thumbnailUrl || ""}
                    controls
                    className="w-full max-h-96 object-cover mx-auto"
                  />
                </div>

                {videoData.title && (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2 max-w-md mx-auto">
                    {videoData.title}
                  </p>
                )}

                {/* Multiple Options Layout */}
                <div className="flex flex-col sm:flex-row justify-center gap-2 pt-2 max-w-md mx-auto">
                  <button
                    onClick={() => forceDownloadFile(videoData.videoUrl, "instagram-video.mp4")}
                    disabled={downloadingFile}
                    className="flex-1 btnRegular text-white font-medium py-2.5 px-4 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow-sm disabled:opacity-50"
                  >
                    <Video size={16} />
                    {downloadingFile ? "Saving..." : "Download MP4"}
                  </button>

                  {videoData.thumbnailUrl && (
                    <button
                      onClick={() =>
                        forceDownloadFile(videoData.thumbnailUrl, "instagram-cover.jpg")
                      }
                      className="flex-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-medium py-2.5 px-4 rounded-xl transition flex justify-center items-center gap-2 text-sm shadow-sm"
                    >
                      <ImageIcon size={16} /> Download Cover
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Note Segment */}
            <div className="mt-2 pt-2 text-xs text-center text-black leading-relaxed">
              💡 <strong>Pro Tip:</strong> Secure public access handles ensure optimal retrieval
              speed. Supports reels, standard profile videos, multi-slide video posts, and IGTV
              arrays.
            </div>
          </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/instagram-downloader" />
    </>
  );
}
