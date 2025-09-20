import { NextRequest, NextResponse } from "next/server";
import { summarizeText } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const summary = await summarizeText(text);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json({ error: "Summarization failed" }, { status: 500 });
  }
}