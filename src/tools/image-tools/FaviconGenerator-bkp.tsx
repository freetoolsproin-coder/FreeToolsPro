import React, { useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SIZES = [16, 32, 48, 64, 128, 192, 256, 512];

const FaviconGenerator: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, etc.).');
        setSourceImage(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setSourceImage(event.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateFavicons = useCallback(async () => {
    if (!sourceImage) {
      setError('Please select an image first.');
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const zip = new JSZip();
      const image = new Image();
      image.src = sourceImage;

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });

      for (const size of SIZES) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(image, 0, 0, size, size);
          const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
          if (blob) {
            zip.file(`favicon-${size}x${size}.png`, blob);
          }
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'favicons.zip');
    } catch (err) {
      setError('Failed to generate favicons. The image might be corrupted or in an unsupported format.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [sourceImage]);

  return (
    <div className="p-4 md:p-8">
      <Helmet>
        <title>Favicon Generator | Free Online Tools</title>
        <meta name="description" content="Generate all the favicon sizes you need for your website from a single image. Create PNG favicons in multiple dimensions and download them in a ZIP file." />
        <link rel="canonical" href="https://yourdomain.com/favicon-generator" />
      </Helmet>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Favicon Generator</h1>
        <p className="text-lg mb-6 text-gray-600">Upload a single image, and we'll generate all the standard favicon sizes for your website.</p>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {sourceImage && <img src={sourceImage} alt="Preview" className="mt-4 max-w-xs max-h-48 rounded" />}
          
          <button onClick={generateFavicons} disabled={!sourceImage || isGenerating} className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
            {isGenerating ? 'Generating...' : 'Generate and Download Favicons'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaviconGenerator;