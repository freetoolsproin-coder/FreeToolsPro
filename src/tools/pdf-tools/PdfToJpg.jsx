import { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min?url";
import { Upload, FileText, Download, Loader2 } from "lucide-react";

GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PdfToJpg() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const convertPdf = async (file) => {
    if (!file) return;

    setImages([]);
    setProgress(0);
    setLoading(true);

    const buffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: buffer }).promise;

    const output = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 });

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      output.push(canvas.toDataURL("image/jpeg", 0.9));
      setProgress(Math.round((i / pdf.numPages) * 100));
    }

    setImages(output);
    setLoading(false);
  };

  return (
    <div className="mx-auto mt-8">
      {/* Upload Card */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 text-center">
        <label className="flex flex-col items-center gap-4 cursor-pointer">
          <div className="h-16 w-16 rounded-full bg-amber-800/20 flex items-center justify-center">
            <Upload className="text-amber-800" size={30} />
          </div>

          <div className="text-white">
            <div className="font-semibold text-white">Click to upload PDF</div>
            <div className="text-white text-sm">or drag & drop</div>
          </div>

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => convertPdf(e.target.files[0])}
          />
        </label>

        {/* Progress */}
        {loading && (
          <div className="mt-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Loader2 className="animate-spin" size={18} />
              <span className="text-sm">Converting… {progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3">
              <img src={img} alt={`Page ${i + 1}`} className="rounded-lg w-full object-cover" />

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <FileText size={14} /> Page {i + 1}
                </span>

                <a
                  href={img}
                  download={`page-${i + 1}.jpg`}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 text-sm"
                >
                  <Download size={14} /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
