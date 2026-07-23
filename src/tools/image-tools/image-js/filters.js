export default function applyFilter(file, type) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");

      if (type === "grayscale") ctx.filter = "grayscale(100%)";
      if (type === "sepia") ctx.filter = "sepia(100%)";
      if (type === "blur") ctx.filter = "blur(5px)";

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => resolve(blob), "image/jpeg");
    };
  });
}
