import { useRef, useState } from "react";
import { Image } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

export default function SvgToPng() {
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
      const size = img.width;
      const w = Math.min(img.width, 1200);
      const h = Math.round(img.height * (w / img.width));
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img,0,0,w,h);
      setInfo("Rasterized preview ready — right-click image to save.");
    };
    if (file.type.includes("svg") || file.name.endsWith(".svg")) {
      file.text().then((txt) => { img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(txt); });
    } else img.src = url;
  };

  return (
    <>
      <Seo page="svgToPng" />
      <ToolHeroShell category="image-tools" icon={Image} title="SVG to PNG" subtitle="Rasterize SVG to PNG." layout="stack" panel="light">
        <input type="file" accept="image/svg+xml,.svg" onChange={(e) => onFile(e.target.files?.[0])} />
        <canvas ref={canvasRef} className="mt-4 max-h-72 max-w-full rounded-xl border border-[var(--ftp-line)]" />
        {preview ? <img src={preview} alt="preview" className="mt-3 max-h-48 rounded-xl border border-[var(--ftp-line)]" /> : null}
        {info ? <pre className="mt-3 text-sm text-[var(--ftp-ink-soft)]">{info}</pre> : null}
      </ToolHeroShell>
      <ToolContentLayout category="image-tools" currentToolPath="/image-tools/svg-to-png" />
    </>
  );
}
