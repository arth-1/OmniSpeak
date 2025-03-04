import { summarizeText } from "@/lib/huggingface";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    return summarizeText(text);
  } catch (error) {
    return Response.json(
      { error: "Summarization failed" },
      { status: 500 }
    );
  }
}