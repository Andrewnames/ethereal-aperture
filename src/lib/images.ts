import sharp from "sharp";

const MAX = 8 * 1024 * 1024;

export async function processUpload(file: File) {
  if (!file || file.size === 0) return null;
  if (file.size > MAX) {
    throw new Error("Photographs must be 8 MB or smaller.");
  }
  if (!file.type.startsWith("image/")) {
    throw new Error("Upload a JPEG, PNG, WebP, or TIFF photograph.");
  }

  const input = Buffer.from(await file.arrayBuffer());
  const bytes = await sharp(input)
    .rotate()
    .resize({
      width: 2200,
      height: 2200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 86 })
    .toBuffer();

  return { bytes, mime: "image/webp" };
}
