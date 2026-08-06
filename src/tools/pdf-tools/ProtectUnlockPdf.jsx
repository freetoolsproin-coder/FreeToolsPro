import { useEffect, useState } from "react";
import { Download, Lock, Unlock, Shield } from "lucide-react";
import { jsPDF } from "jspdf";
import { PDFDocument } from "pdf-lib";
import {
  PdfAlert,
  PdfFileChip,
  PdfPrimaryButton,
  PdfProgress,
  PdfSecondaryButton,
  PdfStats,
  PdfUploadZone,
  loadPdfDocument,
} from "./pdfShared";
import { downloadBytes, loadPdfLib } from "./pdfAdvanced";

async function protectPdfWithJsPdf(file, userPassword, ownerPassword, onProgress) {
  const pdf = await loadPdfDocument(file);
  let doc = null;

  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    const orientation = viewport.width >= viewport.height ? "landscape" : "portrait";

    if (!doc) {
      doc = new jsPDF({
        orientation,
        unit: "px",
        format: [viewport.width, viewport.height],
        encryption: {
          userPassword,
          ownerPassword: ownerPassword || userPassword,
          userPermissions: ["print", "modify", "copy", "annot-forms"],
        },
      });
    } else {
      doc.addPage([viewport.width, viewport.height], orientation);
    }
    doc.addImage(dataUrl, "JPEG", 0, 0, viewport.width, viewport.height);
    onProgress(Math.round((i / pdf.numPages) * 90));
  }

  if (!doc) throw new Error("No pages found.");
  return doc.output("arraybuffer");
}

function passwordStrength(pw) {
  if (!pw) return { label: "—", tone: "info" };
  if (pw.length < 6) return { label: "Weak", tone: "error" };
  if (pw.length < 10) return { label: "Fair", tone: "info" };
  return { label: "Strong", tone: "success" };
}

export default function ProtectUnlockPdf() {
  const [mode, setMode] = useState("unlock");
  const [file, setFile] = useState(null);
  const [userPassword, setUserPassword] = useState("");
  const [ownerPassword, setOwnerPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (!file) return;
    loadPdfLib(file)
      .then((doc) => setPageCount(doc.getPageCount()))
      .catch(() => setPageCount(0));
  }, [file]);

  const clear = () => {
    setFile(null);
    setNote("");
    setError("");
    setPageCount(0);
  };

  const run = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setNote("");
    setProgress(8);

    try {
      if (mode === "unlock") {
        setProgress(40);
        const source = await loadPdfLib(file);
        const outputDoc = await PDFDocument.create();
        const pages = await outputDoc.copyPages(source, source.getPageIndices());
        pages.forEach((p) => outputDoc.addPage(p));
        const output = await outputDoc.save();
        const name = (file.name || "document").replace(/\.pdf$/i, "") + "-unlocked.pdf";
        downloadBytes(name, output);
        setNote("Unlocked copy saved. Some restrictions may remain if the source used advanced DRM.");
      } else {
        if (!userPassword.trim()) throw new Error("Enter a password to protect the PDF.");
        if (file.size > 15 * 1024 * 1024) {
          throw new Error("Protect mode supports PDFs up to ~15 MB in the browser. Compress or split first.");
        }
        const output = await protectPdfWithJsPdf(
          file,
          userPassword.trim(),
          ownerPassword.trim(),
          setProgress
        );
        const name = (file.name || "document").replace(/\.pdf$/i, "") + "-protected.pdf";
        downloadBytes(name, output);
        setNote("Password applied. PDF is rebuilt from page images—text may not be selectable until OCR.");
      }
      setProgress(100);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not process this PDF.");
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(userPassword);

  return (
    <div className="space-y-1">
      <p className="mb-4 text-sm leading-6 text-[var(--ftp-ink-soft)]">
        Advanced protect & unlock: remove open passwords by rebuilding the PDF, or add AES-style
        password protection with permission flags.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { id: "unlock", label: "Unlock PDF", icon: Unlock },
          { id: "protect", label: "Protect PDF", icon: Lock },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => { setMode(tab.id); clear(); }}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold ${
              mode === tab.id ? "bg-[var(--ftp-ink)] text-white" : "border border-[var(--ftp-line)] bg-white"
            }`}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      <PdfUploadZone onFiles={(f) => { clear(); setFile(f); }} disabled={loading} />
      <PdfFileChip file={file} onClear={loading ? undefined : clear} />

      {pageCount ? <PdfStats items={[{ label: "Pages", value: pageCount }, { label: "Mode", value: mode }, { label: "Max protect size", value: "15 MB" }]} /> : null}

      {mode === "protect" ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-[var(--ftp-ink-soft)]">
            User password
            <input type="password" className="mt-1.5 w-full rounded-xl border border-[var(--ftp-line)] bg-white px-3 py-2.5 text-sm" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} disabled={loading} />
          </label>
          <label className="text-sm text-[var(--ftp-ink-soft)]">
            Owner password (optional)
            <input type="password" className="mt-1.5 w-full rounded-xl border border-[var(--ftp-line)] bg-white px-3 py-2.5 text-sm" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} disabled={loading} />
          </label>
          {userPassword ? (
            <p className="sm:col-span-2 flex items-center gap-1.5 text-xs text-[var(--ftp-ink-soft)]">
              <Shield className="h-3.5 w-3.5" /> Strength: {strength.label}
            </p>
          ) : null}
        </div>
      ) : null}

      {loading ? <PdfProgress value={progress} label={mode === "unlock" ? "Unlocking…" : "Encrypting…"} /> : null}
      {note ? <PdfAlert tone="success">{note}</PdfAlert> : null}
      {error ? <PdfAlert tone="error">{error}</PdfAlert> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <PdfPrimaryButton onClick={run} disabled={!file || loading}>
          {mode === "unlock" ? <><Unlock className="h-4 w-4" /> Unlock & download</> : <><Lock className="h-4 w-4" /> Protect & download</>}
        </PdfPrimaryButton>
        <PdfSecondaryButton onClick={clear} disabled={loading}>Reset</PdfSecondaryButton>
      </div>
    </div>
  );
}
