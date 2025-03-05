import pdfParse from "pdf-parse";

export async function pdfToText(file: File): Promise<string> {
  // Convert File to ArrayBuffer, then to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdfParse(buffer);
  return data.text;
}
