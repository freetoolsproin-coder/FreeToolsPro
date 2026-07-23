import React, { useState, useRef } from "react";
import { Crop, FileUp, Download, Sparkles } from "lucide-react";
import Seo from "../../components/Seo";
import ToolHeroShell, { inputDark } from "../../components/ToolHeroShell";
import ToolPageContent from "../../components/ToolPageContent";

export default function ImageResizer() {
  const [image, setImage] = useState(null);
  const [resizedImage, setResizedImage] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [fileName, setFileName] = useState("");
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setResizedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResize = () => {
    if (image && width && height) {
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        setResizedImage(canvas.toDataURL("image/jpeg"));
      };
    }
  };

  return (
    <>
      <Seo page="imageResizer" />

      <ToolHeroShell
        icon={Crop}
        title="Image Resizer"
        subtitle="Resize your image to exact pixel dimensions in your browser"
        layout="stack"
      >
        <div>
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
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-slate-300">
              Width
            </label>
            <input
              type="number"
              id="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              placeholder="e.g., 1920"
              className={`${inputDark} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-slate-300">
              Height
            </label>
            <input
              type="number"
              id="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 1080"
              className={`${inputDark} mt-2`}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleResize}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          Resize Image
        </button>

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {resizedImage ? (
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
            <h2 className="text-lg font-semibold text-white">Resized Image</h2>
            <img
              src={resizedImage}
              alt="Resized"
              className="mt-4 max-w-full rounded-lg"
            />
            <a
              href={resizedImage}
              download="resized-image.jpg"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              <Download className="h-4 w-4" />
              Download Resized Image
            </a>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center">
            <Sparkles className="mx-auto mb-3 h-8 w-8 text-sky-400" />
            <h2 className="text-lg font-semibold text-white">Your resized image will appear here</h2>
            <p className="mt-2 text-sm text-slate-400">
              Upload an image and set the dimensions to resize it.
            </p>
          </div>
        )}
      </ToolHeroShell>

      <ToolPageContent category="image-tools" currentToolPath="/image-tools/image-resizer" />
    </>
  );
}
