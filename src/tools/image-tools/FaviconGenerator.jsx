import React, { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { FileUp, Download, Trash2, Sparkles } from "lucide-react";
import ExploreRelatedTools from "../../components/ExploreRelatedTools";
import ToolHeroShell from "../../components/ToolHeroShell";
import ToolContentLayout from "../../components/ToolContentLayout";

const SIZES = [16, 32, 48, 64, 128, 192, 256, 512];

const textEncoder = new TextEncoder();

const makeCrcTable = () => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
};

const CRC_TABLE = makeCrcTable();

const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const writeUint16 = (bytes, value) => {
  bytes.push(value & 0xff, (value >>> 8) & 0xff);
};

const writeUint32 = (bytes, value) => {
  bytes.push(value & 0xff, (value >>> 8) & 0xff, (value >>> 16) & 0xff, (value >>> 24) & 0xff);
};

const createZipBlob = (files) => {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach(({ name, data }) => {
    const nameBytes = textEncoder.encode(name);
    const checksum = crc32(data);
    const localHeader = [];

    writeUint32(localHeader, 0x04034b50);
    writeUint16(localHeader, 20);
    writeUint16(localHeader, 0);
    writeUint16(localHeader, 0);
    writeUint16(localHeader, 0);
    writeUint16(localHeader, 0);
    writeUint32(localHeader, checksum);
    writeUint32(localHeader, data.length);
    writeUint32(localHeader, data.length);
    writeUint16(localHeader, nameBytes.length);
    writeUint16(localHeader, 0);
    localParts.push(new Uint8Array(localHeader), nameBytes, data);

    const centralHeader = [];
    writeUint32(centralHeader, 0x02014b50);
    writeUint16(centralHeader, 20);
    writeUint16(centralHeader, 20);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint32(centralHeader, checksum);
    writeUint32(centralHeader, data.length);
    writeUint32(centralHeader, data.length);
    writeUint16(centralHeader, nameBytes.length);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint16(centralHeader, 0);
    writeUint32(centralHeader, 0);
    writeUint32(centralHeader, offset);
    centralParts.push(new Uint8Array(centralHeader), nameBytes);

    offset += localHeader.length + nameBytes.length + data.length;
  });

  const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
  const endRecord = [];
  writeUint32(endRecord, 0x06054b50);
  writeUint16(endRecord, 0);
  writeUint16(endRecord, 0);
  writeUint16(endRecord, files.length);
  writeUint16(endRecord, files.length);
  writeUint32(endRecord, centralSize);
  writeUint32(endRecord, offset);
  writeUint16(endRecord, 0);

  return new Blob([...localParts, ...centralParts, new Uint8Array(endRecord)], {
    type: "application/zip",
  });
};

const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const FaviconGenerator = () => {
  const [sourceImage, setSourceImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file (PNG, JPG, etc.).");
        setSourceImage(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFavicons = useCallback(async () => {
    if (!sourceImage) {
      setError("Please select an image first.");
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const image = new Image();
      image.src = sourceImage;

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      const files = [];

      for (const size of SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(image, 0, 0, size, size);
          const blob = await new Promise((resolve) =>
            canvas.toBlob(resolve, "image/png")
          );
          if (blob) {
            files.push({
              name: `favicon-${size}x${size}.png`,
              data: new Uint8Array(await blob.arrayBuffer()),
            });
          }
        }
      }

      if (!files.length) {
        throw new Error("No favicon files could be generated.");
      }

      const manifest = {
        icons: [
          { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
        ],
      };
      files.push({
        name: "site.webmanifest",
        data: textEncoder.encode(JSON.stringify(manifest, null, 2)),
      });

      downloadBlob(createZipBlob(files), "favicons.zip");
    } catch (err) {
      setError(
        "Failed to generate favicons. The image might be corrupted or in an unsupported format."
      );
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [sourceImage]);

  const clearImage = () => {
    setSourceImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <Helmet>
        <title>Favicon Generator | Free Online Tools</title>
        <meta
          name="description"
          content="Generate all the favicon sizes you need for your website from a single image. Create PNG favicons in multiple dimensions and download them in a ZIP file."
        />
        <link rel="canonical" href="https://freetoolspro.in/image-tools/favicon-generator" />
      </Helmet>

      <ToolHeroShell
        icon={Sparkles}
        title="Favicon Generator"
        subtitle="Generate all the favicon sizes you need for your website from a single image."
        category="image-tools"
      >
        <label htmlFor="file-upload" className="relative cursor-pointer w-full flex justify-center rounded-2xl border border-dashed border-slate-700 px-6 py-10 bg-slate-900/80 hover:border-sky-400 transition-colors">
          <div className="text-center">
            <FileUp className="mx-auto h-12 w-12 text-slate-500" />
            <div className="mt-4 flex text-sm leading-6 text-slate-400">
              <span className="font-semibold text-sky-400">Upload a file</span>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-slate-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="sr-only" />
        </label>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

        {sourceImage && (
          <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/80 p-6 text-center">
            <h3 className="text-lg font-semibold text-white">Image Preview</h3>
            <img src={sourceImage} alt="Preview" className="mt-4 max-w-xs max-h-48 rounded mx-auto border border-slate-700" />
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <button onClick={generateFavicons} disabled={isGenerating} className="flex items-center justify-center gap-2 rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:bg-gray-400">
                <Download className="h-4 w-4" />
                {isGenerating ? 'Generating...' : 'Generate & Download'}
              </button>
              <button onClick={clearImage} className="flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500">
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
          </div>
        )}
      </ToolHeroShell>

      <ToolContentLayout
        category="image-tools"
        currentToolPath="/image-tools/favicon-generator" />
    </>
  );
};

export default FaviconGenerator;
