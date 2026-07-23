import { useMemo, useState } from "react";
import { Share2 as Twitter, Copy, Check } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, selectDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

const CARD_TYPES = [
  { value: "summary", label: "Summary" },
  { value: "summary_large_image", label: "Summary Large Image" },
  { value: "app", label: "App" },
  { value: "player", label: "Player" },
];

function buildMetaTags({ cardType, title, description, site, image, url }) {
  const lines = [`<meta name="twitter:card" content="${cardType}" />`];
  if (title.trim()) lines.push(`<meta name="twitter:title" content="${escapeAttr(title)}" />`);
  if (description.trim()) {
    lines.push(`<meta name="twitter:description" content="${escapeAttr(description)}" />`);
  }
  if (site.trim()) lines.push(`<meta name="twitter:site" content="${escapeAttr(site)}" />`);
  if (image.trim()) lines.push(`<meta name="twitter:image" content="${escapeAttr(image)}" />`);
  if (url.trim()) lines.push(`<meta name="twitter:url" content="${escapeAttr(url)}" />`);
  return lines.join("\n");
}

function escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

export default function TwitterCardGenerator() {
  const [cardType, setCardType] = useState("summary_large_image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [site, setSite] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const metaTags = useMemo(
    () => buildMetaTags({ cardType, title, description, site, image, url }),
    [cardType, title, description, site, image, url]
  );

  const hasPreview = title.trim() || description.trim() || image.trim();

  const copyTags = async () => {
    await navigator.clipboard.writeText(metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="twitterCardGenerator" />

      <ToolHeroShell
        category="social-media-tools"
        icon={Twitter}
        title="Twitter Card Generator"
        subtitle="Create Twitter Card meta tags and preview how they may appear."
        formLabel="Card details"
        layout="stack"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
            <div>
              <label className={labelClass} htmlFor="tc-type">
                Card type
              </label>
              <select
                id="tc-type"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className={selectDark}
              >
                {CARD_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="tc-title">
                Title
              </label>
              <input
                id="tc-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Page title"
                className={inputDark}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="tc-desc">
                Description
              </label>
              <textarea
                id="tc-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short summary for the card"
                className={textareaDark}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="tc-site">
                Site (@handle)
              </label>
              <input
                id="tc-site"
                type="text"
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="@yourbrand"
                className={inputDark}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="tc-image">
                Image URL
              </label>
              <input
                id="tc-image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={inputDark}
              />
            </div>

            <div>
              <label className={labelClass} htmlFor="tc-url">
                Page URL
              </label>
              <input
                id="tc-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className={inputDark}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
              <h2 className="mb-3 text-sm font-semibold text-[var(--ftp-ink)]">Preview</h2>
              {hasPreview ? (
                <div className="overflow-hidden rounded-xl border border-[var(--ftp-line)] bg-white">
                  {image.trim() && cardType !== "summary" && (
                    <div className="aspect-[1.91/1] bg-[var(--ftp-porcelain)]">
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    {site.trim() && (
                      <p className="text-xs text-[var(--ftp-ink-soft)]">{site}</p>
                    )}
                    {title.trim() && (
                      <p className="mt-1 font-semibold text-[var(--ftp-ink)]">{title}</p>
                    )}
                    {description.trim() && (
                      <p className="mt-1 text-sm text-[var(--ftp-ink-soft)]">{description}</p>
                    )}
                    {url.trim() && (
                      <p className="mt-2 truncate text-xs text-[var(--ftp-teal)]">{url}</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-[var(--ftp-ink-soft)]">
                  Fill in card fields to see a preview.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-[var(--ftp-ink)]">Meta tags</h2>
                <button type="button" onClick={copyTags} className="age-btn-ghost px-3 py-2 text-sm">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy tags"}
                </button>
              </div>
              <pre className="overflow-x-auto rounded-xl border border-[var(--ftp-line)] bg-white p-3 font-mono text-xs leading-6 text-[var(--ftp-ink)]">
                {metaTags}
              </pre>
            </div>
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/twitter-card-generator"
      />
    </>
  );
}
