import { NextRequest, NextResponse } from "next/server";
import { speechToText } from "@/lib/huggingface";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as Blob;
    
    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const result = await speechToText(audioFile);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return NextResponse.json({ error: "Speech recognition failed" }, { status: 500 });
  }
}