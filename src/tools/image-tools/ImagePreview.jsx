import React from "react";

export default function Preview({ image }) {
  const url = URL.createObjectURL(image);

  return (
    <div>
      <h3>Preview</h3>
      <img src={url} width="300" alt="preview" />

      <a href={url} download="edited.png">
        <button>Download</button>
      </a>
    </div>
  );
}
