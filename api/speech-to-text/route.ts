import { NextResponse } from "next/server";
import { speechToText } from "@/lib/huggingface";

export async function POST(req: Request) {
  try {
    const audioBlob = await req.blob();
    const result = await speechToText(audioBlob);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Speech recognition failed" },
      { status: 500 }
    );
  }
}