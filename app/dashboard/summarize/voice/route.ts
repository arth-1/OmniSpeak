import { convertSpeechToText } from "@/lib/speech";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as Blob;
    
    // Implement Whisper.cpp integration here
    const text = await convertSpeechToText(audio);
    
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}