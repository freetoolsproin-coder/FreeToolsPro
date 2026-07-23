import React, { useState } from "react";
import { Image, FileUp, ClipboardCopy, Sparkles } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { textareaDark } from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [fileName, setFileName] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo page="imageToBase64" />

      <ToolHeroShell
        icon={Image}
        title="Image to Base64"
        subtitle="Encode images to Base64 strings for HTML, CSS, or JSON"
      >
        <label className="block text-sm font-medium text-slate-300" htmlFor="image-upload">
          Upload your image
        </label>
        <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-slate-700 bg-slate-900/80 px-6 py-10">
          <div className="text-center">
            <FileUp className="mx-auto h-12 w-12 text-slate-500" />
            <div className="mt-4 flex text-sm leading-6 text-slate-400">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer rounded-md font-semibold text-sky-400 hover:text-sky-500"
              >
                <span>Upload a file</span>
                <input
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {fileName && (
          <p className="mt-3 text-sm text-slate-400">
            File: <span className="font-semibold text-white">{fileName}</span>
          </p>
        )}

        {base64 ? (
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <h2 className="text-lg font-semibold text-white">Base64 Result</h2>
            <textarea
              readOnly
              value={base64}
              className={`${textareaDark} mt-4 h-48`}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              <ClipboardCopy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Your result will appear here</h2>
            <p className="mt-2 text-sm text-slate-400">
              Upload an image to get its Base64 representation.
            </p>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent category="image-tools" currentToolPath="/image-tools/image-to-base64" />
    </>
  );
}
