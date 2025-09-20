// app/api/tts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { textToSpeech } from "../../../lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const { audioBuffer, contentType } = await textToSpeech(text);

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
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