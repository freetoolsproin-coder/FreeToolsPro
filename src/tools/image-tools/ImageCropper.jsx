import { useRef, useState } from "react";
import { Scissors } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function ImageCropper() {
  const [info, setInfo] = useState("");
  const [preview, setPreview] = useState("");
  const canvasRef = useRef(null);

  const onFile = async (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    if (false) {
      setInfo("Name: " + file.name + "\nType: " + file.type + "\nSize: " + (file.size / 1024).toFixed(1) + " KB");
      return;
    }
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const size = Math.min(img.width, img.height);
      const w = Math.min(img.width, img.height);
      const h = w;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      const side = Math.min(img.width, img.height); const sx=(img.width-side)/2, sy=(img.height-side)/2; ctx.drawImage(img,sx,sy,side,side,0,0,w,h);
      setInfo("Processed " + w + "×" + h);
    };
    img.src = url;
  };

  return (
    <>
      <Seo page="imageCropper" />
      <ToolHeroShell category="image-tools" icon={Scissors} title="Image Cropper" subtitle="Crop images to an aspect ratio." layout="stack" panel="light">
        <input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0])} />
        <canvas ref={canvasRef} className="mt-4 max-h-72 max-w-full rounded-xl border border-[var(--ftp-line)]" />
        {preview ? <img src={preview} alt="preview" className="mt-3 max-h-48 rounded-xl border border-[var(--ftp-line)]" /> : null}
        {info ? <pre className="mt-3 text-sm text-[var(--ftp-ink-soft)]">{info}</pre> : null}
      </ToolHeroShell>
      <ToolContentLayout category="image-tools" currentToolPath="/image-tools/image-cropper" />
    </>
  );
}
