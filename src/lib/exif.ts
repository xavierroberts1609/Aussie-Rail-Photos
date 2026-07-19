import exifr from "exifr";

export async function extractDateTaken(buffer: Buffer): Promise<Date | null> {
  try {
    const exif = await exifr.parse(buffer, { pick: ["DateTimeOriginal", "CreateDate"] });
    const date = exif?.DateTimeOriginal ?? exif?.CreateDate;
    return date instanceof Date && !isNaN(date.getTime()) ? date : null;
  } catch {
    return null;
  }
}
