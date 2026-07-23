import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

function QrCodeTool() {
  const [text, setText] = useState("");
  const qrRef = useRef();

  const downloadQR = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = url;
    link.download = "qrcode.png";
    link.click();
  };

  return (
    <div className="qr-tool ">
      <input
        className="border rounded-2xl outline-0"
        type="text"
        placeholder="Enter URL or text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="qr-preview" ref={qrRef}>
        {text && (
          <QRCodeCanvas
            value={text}
            size={220}
            level="H"
            includeMargin={true}
            className="text-center mx-auto"
          />
        )}
      </div>
      <div className="text-center">
        {text && (
          <button onClick={downloadQR} className="btnRegular">
            Download QR Code
          </button>
        )}
      </div>
    </div>
  );
}

export default QrCodeTool;
