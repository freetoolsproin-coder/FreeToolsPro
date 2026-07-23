import React, { useState } from "react";
import Seo from "../../components/Seo";
import ToolContentLayout from "../../components/ToolContentLayout";
import { Youtube, Download, Sparkles } from "lucide-react";
import ExploreRelatedTools from "../../components/ExploreRelatedTools";
import ToolHeroShell from "../../components/ToolHeroShell";

export default function YouTubeThumbnailDownloader() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState("");

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    const id = extractVideoId(e.target.value);
    setVideoId(id);
  };

  const extractVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

  const thumbnailQualities = videoId
    ? [
        { name: "Max Resolution", url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` },
        { name: "Standard Definition", url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg` },
        { name: "High Quality", url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` },
        { name: "Medium Quality", url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` },
        { name: "Default", url: `https://img.youtube.com/vi/${videoId}/default.jpg` },
      ]
    : [];

  return (
    <>
      <Seo page="youtubeThumbnailDownloader" />

      <ToolHeroShell
        icon={Youtube}
        title="YouTube Thumbnail Downloader"
        subtitle="Paste a YouTube video URL to download its thumbnail in every available resolution."
        category="social-media-tools"
        wide={Boolean(videoId)}
      >
        <label
          className="block text-sm font-medium text-slate-300"
          htmlFor="youtube-url"
        >
          Enter YouTube video URL
        </label>
        <input
          id="youtube-url"
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-3.5 text-slate-100 outline-none transition focus:border-teal-400/60 focus:ring-2 focus:ring-teal-400/25"
        />

        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-6">
          {videoId ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white">Available Thumbnails</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {thumbnailQualities.map((thumb) => (
                  <div
                    key={thumb.name}
                    className="rounded-2xl border border-slate-700 bg-slate-950 p-4"
                  >
                    <h4 className="text-sm font-medium text-slate-400">{thumb.name}</h4>
                    <img
                      src={thumb.url}
                      alt={`${thumb.name} thumbnail`}
                      className="mt-3 w-full rounded-lg"
                    />
                    <a
                      href={thumb.url}
                      download={`${videoId}-${thumb.name}.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/60 p-8 text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-sky-400" />
              <h3 className="text-lg font-semibold text-white">
                Thumbnails will appear here
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-400">
                Enter a YouTube video URL to see the available thumbnails.
              </p>
            </div>
          )}
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/tools/youtube-thumbnail-downloader" />
    </>
  );
}
