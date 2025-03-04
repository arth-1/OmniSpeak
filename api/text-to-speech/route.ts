import { NextResponse } from "next/server";
import { textToSpeech } from "@/lib/huggingface";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const audioBuffer = await textToSpeech(text);
    
    return new Response(audioBuffer, {
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": "attachment; filename=speech.wav"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Speech synthesis failed" },
      { status: 500 }
    );
  }
}