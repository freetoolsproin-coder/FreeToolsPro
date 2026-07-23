import React from "react";
import compressImage from "./image-js/compress";
import resizeImage from "./image-js/resize";
import convertImage from "./image-js/convert";
import applyFilter from "./image-js/filters";
import { Expand, Copy, ImagePlay, Download, FoldHorizontal, Check, Repeat2 } from "lucide-react";

export default function Toolbar({ image, setProcessed, setActionText }) {
  const handleAction = async (type) => {
    if (!image) {
      alert("Upload image first");
      return;
    }

    let result;

    try {
      if (type === "compress") {
        result = await compressImage(image);
        setActionText("Compressed Image");
      } else if (type === "resize") {
        result = await resizeImage(image, 300, 300);
        setActionText("Resized Image (300x300)");
      } else if (type === "convert") {
        result = await convertImage(image, "image/png");
        setActionText("Converted to PNG");
      } else if (type === "filter") {
        result = await applyFilter(image, "grayscale");
        setActionText("Grayscale Image");
      }

      setProcessed(result);
    } catch (err) {
      console.error(err);
      alert("Processing failed");
    }
  };

  return (
    <div className="flex justify-between gap-2">
      <button
        className="btnRegular flex justify-center items-center gap-2"
        onClick={() => handleAction("compress")}
      >
        <FoldHorizontal size={16} /> Compress
      </button>
      <button
        className="btnRegular flex justify-center items-center gap-2"
        onClick={() => handleAction("resize")}
      >
        <Expand size={16} /> Resize
      </button>
      <button
        className="btnRegular flex justify-center items-center gap-2"
        onClick={() => handleAction("convert")}
      >
        <Repeat2 size={16} /> Convert PNG
      </button>
      <button
        className="btnRegular flex justify-center items-center gap-2"
        onClick={() => handleAction("filter")}
      >
        <ImagePlay size={16} /> Grayscale
      </button>
    </div>
  );
}
