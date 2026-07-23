import imageCompression from "browser-image-compression";

export default async function compressImage(file) {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1024,
  };

  return await imageCompression(file, options);
}
