import mammoth from "mammoth";

export async function docxToText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  // Convert ArrayBuffer to Node Buffer
  const buffer = Buffer.from(arrayBuffer);
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}
