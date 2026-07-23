import { useMemo, useState } from "react";
import { MessageCircle, Copy, Check, ExternalLink } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark, textareaDark } from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const labelClass = "mb-1.5 block text-sm font-medium text-[var(--ftp-ink-soft)]";

function stripPhone(raw) {
  return raw.replace(/\D/g, "");
}

export default function WhatsAppUrlGenerator() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const digits = useMemo(() => stripPhone(phone), [phone]);

  const waUrl = useMemo(() => {
    if (!digits) return "";
    const base = `https://wa.me/${digits}`;
    const trimmed = message.trim();
    return trimmed ? `${base}?text=${encodeURIComponent(trimmed)}` : base;
  }, [digits, message]);

  const copyUrl = async () => {
    if (!waUrl) return;
    await navigator.clipboard.writeText(waUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openLink = () => {
    if (!waUrl) return;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Seo page="whatsappUrlGenerator" />

      <ToolHeroShell
        category="social-media-tools"
        icon={MessageCircle}
        title="WhatsApp URL Generator"
        subtitle="Build a wa.me link with phone number and pre-filled message."
        formLabel="Build link"
        layout="stack"
      >
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5">
            <div>
              <label className={labelClass} htmlFor="wa-phone">
                Phone number (with country code)
              </label>
              <input
                id="wa-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 919876543210"
                className={inputDark}
              />
              <p className="mt-1.5 text-xs text-[var(--ftp-ink-soft)]">
                Digits only in the link{digits ? `: ${digits}` : ""}
              </p>
            </div>

            <div>
              <label className={labelClass} htmlFor="wa-message">
                Pre-filled message (optional)
              </label>
              <textarea
                id="wa-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I would like to know more about..."
                className={textareaDark}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--ftp-line)] bg-[var(--ftp-porcelain)]/50 p-5 lg:sticky lg:top-24">
            <h2 className="mb-3 text-sm font-semibold text-[var(--ftp-ink)]">Generated URL</h2>
            {waUrl ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-[var(--ftp-line)] bg-white p-3">
                  <p className="break-all font-mono text-sm text-[var(--ftp-ink)]">{waUrl}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="button" onClick={copyUrl} className="age-btn-primary">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy link"}
                  </button>
                  <button type="button" onClick={openLink} className="age-btn-ghost">
                    <ExternalLink className="h-4 w-4" />
                    Open link
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--ftp-ink-soft)]">
                Enter a phone number with country code to generate your WhatsApp link.
              </p>
            )}
          </div>
        </div>
      </ToolHeroShell>

      <ToolContentLayout
        category="social-media-tools"
        currentToolPath="/social-media-tools/whatsapp-url-generator"
      />
    </>
  );
}
