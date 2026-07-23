import React from "react";
import compressImage from "./image-js/compress";
import resizeImage from "./image-js/resize";
import convertImage from "./image-js/convert";
import applyFilter from "./image-js/filters";

export default function Toolbar({ image, setProcessed }) {
  return (
    <div className="toolbar">
      <button
        onClick={async () => {
          const result = await compressImage(image);
          setProcessed(result);
        }}
      >
        Compress
      </button>

      <button
        onClick={async () => {
          const result = await resizeImage(image, 300, 300);
          setProcessed(result);
        }}
      >
        Resize
      </button>

      <button
        onClick={async () => {
          const result = await convertImage(image, "image/png");
          setProcessed(result);
        }}
      >
        Convert PNG
      </button>

      <button
        onClick={async () => {
          const result = await applyFilter(image, "grayscale");
          setProcessed(result);
        }}
      >
        Grayscale
      </button>
    </div>
  );
}
