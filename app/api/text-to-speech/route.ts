// app/api/tts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { textToSpeech } from "@/lib/huggingface";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const audioBuffer = await textToSpeech(text);

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="speech.mp3"',
      },
    });

  } catch (error: any) {
    console.error("TTS API error:", error);
    
    return NextResponse.json(
      { 
        error: "Text-to-speech failed",
        message: error.message
      },
      { status: 500 }
    );
  }
}