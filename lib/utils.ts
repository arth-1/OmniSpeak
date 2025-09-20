// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function analyzeCall(transcript: string) {
  const prompt = `
Analyze this transcript and return JSON only:
{
  "summary": "3-sentence summary",
  "positivity": number 1-10,
  "quality": number 1-5,
  "clientInterest": "High|Medium|Low",
  "keywords": ["..."],
  "sentiment": {"positive":%, "neutral":%, "negative":%}
}`;

  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt + "\nTranscript: " + transcript }] }]
    })
  });

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    const match = text.match(/({[\s\S]*})/);
    return match ? JSON.parse(match[0]) : null;
  } catch {
    return {
      summary: text,
      positivity: 0,
      quality: 0,
      clientInterest: "Medium",
      keywords: [],
      sentiment: { positive: 0, neutral: 0, negative: 0 }
    };
  }
}

export async function translateText(text: string, targetLang: string = "es") {
  const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: `Translate this to ${targetLang}: ${text}` }] }]
    })
  });

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}
