import { translateText } from "@/lib/huggingface";

export async function POST(req: Request) {
  try {
    const { text, sourceLang, targetLang } = await req.json();
    return translateText(text, sourceLang, targetLang);
  } catch (error) {
    return Response.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}