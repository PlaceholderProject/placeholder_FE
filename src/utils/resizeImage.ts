// utils/resizeImage.ts
export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = e => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = width / height;
        if (ratio > maxWidth / maxHeight) {
          width = maxWidth;
          height = maxWidth / ratio;
        } else {
          height = maxHeight;
          width = maxHeight * ratio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context 생성 실패");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else reject("Blob 변환 실패");
      }, file.type);
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
