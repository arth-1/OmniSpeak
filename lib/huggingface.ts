// const API_URL = "https://api-inference.huggingface.co/models";
// const API_KEY = process.env.HUGGINGFACE_API_KEY;

// export async function query(model: string, inputs: any) {
//   const response = await fetch(`${API_URL}/${model}`, {
//     headers: {
//       Authorization: `Bearer ${API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     method: "POST",
//     body: JSON.stringify(inputs),
//   });
  
//   return await response.json();
// }

// // Speech to text
// export async function speechToText(audioData: Blob) {
//   return query("facebook/wav2vec2-large-960h-lv60-self", {
//     inputs: audioData,
//   });
// }

// // Text to speech
// export async function textToSpeech(text: string) {
//   return query("facebook/fastspeech2-en-ljspeech", {
//     inputs: text,
//   });
// }

// // Translation
// export async function translateText(text: string, sourceLang: string, targetLang: string) {
//   return query("Helsinki-NLP/opus-mt-" + sourceLang + "-" + targetLang, {
//     inputs: text,
//   });
// }

// // Text summarization
// export async function summarizeText(text: string) {
//   return query("facebook/bart-large-cnn", {
//     inputs: text,
//     parameters: {
//       max_length: 100,
//       min_length: 30,
//     },
//   });
// }

// // Chat completion
// export async function chatCompletion(messages: any[]) {
//   return query("meta-llama/Llama-2-7b-chat-hf", {
//     inputs: messages,
//   });
// }

// lib/huggingface.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const OLLAMA_BASE_URL = "http://127.0.0.1:11434/api/chat";
const DEFAULT_MODEL = "deepseek-r1:14b";

type SystemPromptParams = {
  translation: [sourceLang: string, targetLang: string];
  summarization: [];
  chat: [];
};

const SYSTEM_PROMPTS = {
  translation: (source: string, target: string) => 
    `Translate from ${source} to ${target}. Respond ONLY with the translation.`,
  summarization: () => 
    `Summarize concisely under 100 words. Respond ONLY with summary.`,
  chat: () => 
    `You are a real estate AI assistant. Follow these rules:
1. Use markdown
2. Professional tone
3. Include relevant market data`
};

async function handleOllamaStream(stream: ReadableStream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let responseText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    
    lines.slice(0, -1).forEach(line => {
      try {
        const { message } = JSON.parse(line);
        responseText += message?.content || '';
      } catch (err) {
        console.error('JSON parse error:', err);
      }
    });
    
    buffer = lines[lines.length - 1];
  }

  return responseText;
}

export async function ollamaQuery(endpoint: string, payload: any) {
  const response = await fetch(`http://127.0.0.1:11434/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json", // Force JSON response
      "X-Requested-With": "XMLHttpRequest" // Avoid HTML fallback
    },
    body: JSON.stringify({
      ...payload,
      model: "deepseek-r1:14b",
      options: {
        num_gpu: 1
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Ollama error ${response.status}: ${errorText}`);
  }

  if (!response.body) {
    throw new Error("No response body from Ollama");
  }

  return handleOllamaStream(response.body);
}

export async function handleOllamaRequest(
  feature: keyof typeof SYSTEM_PROMPTS,
  userInput: any,
  additionalParams: readonly any[] = []
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Handle system prompt based on feature type
    let systemContent: string;
    if (feature === "translation") {
      const [sourceLang, targetLang] = additionalParams as [string, string];
      systemContent = SYSTEM_PROMPTS[feature](sourceLang, targetLang);
    } else {
      systemContent = SYSTEM_PROMPTS[feature]();
    }

    const messages = [
      { 
        role: "system", 
        content: systemContent
      },
      { role: "user", content: userInput }
    ];

    const responseText = await ollamaQuery("chat", {
      model: DEFAULT_MODEL,
      messages,
      stream: true
    });

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error(`${feature} error:`, error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Feature implementations
export async function chatCompletion(messages: any[]) {
  return handleOllamaRequest("chat", messages[messages.length - 1]?.content);
}

export async function translateText(text: string, sourceLang: string, targetLang: string) {
  return handleOllamaRequest(
    "translation", 
    text, 
    [sourceLang, targetLang] as const // Add const assertion
  );
}

export async function summarizeText(text: string) {
  return handleOllamaRequest("summarization", text);
}

// Mock audio implementations
export async function speechToText(audioData: Blob) {
  // Implement actual STT logic here
  return { text: "Mock transcribed text from audio" };
}

export async function textToSpeech(text: string) {
  // Implement actual TTS logic here
  return new ArrayBuffer(0);
}