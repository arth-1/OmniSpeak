import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const systemPrompt = 'You are a real estate AI assistant...';
    
    const payload = {
      model: 'deepseek-r1:14b',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      stream: true
    };

    const apiResponse = await fetch('http://localhost:11434/api', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Ollama API error: ${errorText}`);
    }

    const reader = apiResponse.body?.getReader();
    if (!reader) throw new Error('No response body');

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          try {
            const json = JSON.parse(chunk);
            if (json.message?.content) {
              controller.enqueue(new TextEncoder().encode(json.message.content));
            }
          } catch (err) {
            controller.error(err);
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
