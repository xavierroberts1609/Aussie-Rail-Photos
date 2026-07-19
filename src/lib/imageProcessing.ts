import sharp from "sharp";

const MAX_DIMENSION = 2560;

// Uploaded camera photos regularly arrive at 15-20MB+ and 6000px+ wide,
// which the tiny production VM then has to decode from scratch on every
// distinct thumbnail size Next's image optimizer generates. Shrinking and
// re-compressing once at upload time makes every later read cheap.
export async function optimizeUpload(buffer: Buffer, mimeType: string): Promise<Buffer> {
  const image = sharp(buffer).rotate().resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  });

  switch (mimeType) {
    case "image/png":
      return image.png({ compressionLevel: 9 }).toBuffer();
    case "image/webp":
      return image.webp({ quality: 85 }).toBuffer();
    default:
      return image.jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  }
}
