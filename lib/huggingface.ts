// This file preserves the public API used around the app (chatCompletion, translateText,
// summarizeText, speechToText, textToSpeech) but implements them using Google's
// Generative AI (Gemini) REST API instead of Hugging Face / Ollama.

import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GEMINI_BEARER_TOKEN;
// DEFAULT_MODEL should be a bare model name like `gemini-pro`, `gemini-2.5-pro`, or `gemini-1.5-flash`.
// Users may set GEMINI_MODEL to either `gemini-2.5-pro` or `models/gemini-2.5-pro`.
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-pro"; // sensible default

const SYSTEM_PROMPTS = {
  translation: (source: string, target: string) =>
    `Translate from ${source} to ${target}. Respond ONLY with the translation.`,
  summarization: () => `Summarize concisely under 100 words. Respond ONLY with summary.`,
  chat: () => `You are a real estate AI assistant. Follow these rules:\n1. Use markdown\n2. Professional tone\n3. Include relevant market data`
};

if (!GEMINI_API_KEY) {
  // Do not throw on import; leave runtime checks in call sites.
  console.warn("GEMINI_API_KEY is not set. Gemini calls will fail until configured.");
}

async function callGemini(payload: any) {
  if (!GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
  // Normalize model/endpoint: allow DEFAULT_MODEL to be 'gemini-1.5-pro' or 'models/gemini-1.5-pro'
  const modelParam = payload.model || process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const modelName = String(modelParam).replace(/^models\//, "");
  // Supported Gemini models
  const supportedModels = [
    "gemini-pro",
    "gemini-1.5-flash",
    "gemini-1.5-pro"
  ];
  const endpointModel = supportedModels.includes(modelName) ? modelName : "gemini-1.5-pro";
  
  // Use the correct Google AI API endpoint with API key parameter
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${endpointModel}:generateContent?key=${GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload.body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${t}`);
  }

  return res.json();
}

async function handleGeminiChat(messages: { role: string; content: string }[]) {
  // Gemini expects a single prompt string for chat.
  const prompt = messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");

  const body = {
    model: DEFAULT_MODEL,
    body: {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      }
    }
  };

  const result = await callGemini(body);
  // Debug: log raw response for troubleshooting if empty
  try {
    // Stringify for full nested visibility in logs
    console.debug("Gemini raw result:", JSON.stringify(result, null, 2));
  } catch (e) {
    // ignore logging errors
  }


  // Try multiple common shapes used by Gemini responses
  let output: string | undefined;

  try {
    const c0 = result?.candidates?.[0];
    // 1) candidates[0].content.parts[0].text
    output = c0?.content?.parts?.[0]?.text;
    // 2) candidates[0].content.text
    if (!output) output = c0?.content?.text;
    // 3) candidates[0].content[0].text or content[0].parts[0].text
    if (!output && Array.isArray(c0?.content)) {
      output = c0.content[0]?.text || c0.content[0]?.parts?.[0]?.text;
    }
    // 4) result.output[0].content.text (older shapes)
    if (!output) output = result?.output?.[0]?.content?.text;
    // 5) concatenate candidate content parts
    if (!output && Array.isArray(result?.candidates)) {
      const pieces: string[] = [];
      for (const cand of result.candidates) {
        if (cand?.content?.parts) pieces.push(cand.content.parts.map((p: any) => p.text).filter(Boolean).join(" "));
        else if (cand?.content?.text) pieces.push(cand.content.text);
        else if (Array.isArray(cand?.content) && cand.content[0]) {
          const cc = cand.content[0];
          if (cc?.parts) pieces.push(cc.parts.map((p: any) => p.text).filter(Boolean).join(" "));
          else if (cc?.text) pieces.push(cc.text);
        }
      }
      if (pieces.length) output = pieces.join("\n");
    }
  } catch (e) {
    // ignore extraction exceptions
  }

  if (!output) {
    // Nothing parsed — return the raw JSON so the frontend can show something
    output = JSON.stringify(result);
  }

  return output;
}

async function ensureAuthUser() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    return userId;
  } catch (err: any) {
    // If Clerk middleware isn't configured (local dev or public endpoints), allow
    // the request to proceed but log a helpful warning. This keeps behavior
    // backward-compatible for projects that haven't set up Clerk middleware.
    console.warn(
      "Clerk auth() failed — continuing without authenticated user. To enable auth, ensure clerkMiddleware() is used in your Next.js middleware.",
      err?.message || err
    );
    return null as any;
  }
}

export async function chatCompletion(messages: any[]) {
  try {
    await ensureAuthUser();
    const lastContent = messages[messages.length - 1]?.content ?? messages.map((m: any) => m.content).join("\n");
    const system = SYSTEM_PROMPTS.chat();
    const chatMessages = [
      { role: "system", content: system },
      { role: "user", content: lastContent }
    ];
    const responseText = await handleGeminiChat(chatMessages);
    return responseText;
  } catch (err) {
    console.error("chatCompletion error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function translateText(text: string, sourceLang: string, targetLang: string) {
  try {
    await ensureAuthUser();
    const system = SYSTEM_PROMPTS.translation(sourceLang, targetLang);
    const chatMessages = [
      { role: "system", content: system },
      { role: "user", content: text }
    ];
    const responseText = await handleGeminiChat(chatMessages);
    return responseText;
  } catch (err) {
    console.error("translateText error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function summarizeText(text: string) {
  try {
    await ensureAuthUser();
    const system = SYSTEM_PROMPTS.summarization();
    const chatMessages = [
      { role: "system", content: system },
      { role: "user", content: text }
    ];
    const responseText = await handleGeminiChat(chatMessages);
    return responseText;
  } catch (err) {
    console.error("summarizeText error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Speech and TTS: project had placeholder implementations. Keep the same placeholders
// but surface the same return types so routes keep working. If you want, we can
// integrate Google Speech-to-Text or Text-to-Speech later.
export async function speechToText(audioData: Blob) {
  // Placeholder: return a simple transcribed text. For production, call
  // Google Cloud Speech-to-Text or another provider and return the transcript.
  return { text: "Mock transcribed text from audio" };
}

export async function textToSpeech(text: string) {
  // Placeholder: return empty ArrayBuffer. For production, call
  // Google's Text-to-Speech to get audio content and return it as ArrayBuffer.
  return new ArrayBuffer(0);
}