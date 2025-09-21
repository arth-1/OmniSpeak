import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/huggingface';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const summary = await chatCompletion([
      {
        role: 'user',
        content: `Please provide a clear and concise summary of the following text:\n\n${text}`
      }
    ]);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error);
    return NextResponse.json({ error: "Summarization failed" }, { status: 500 });
  }
}