// lib/speech.ts
const GOOGLE_CLOUD_API_KEY = process.env.GOOGLE_CLOUD_API_KEY!;

export async function speechToText(audioBlob: Blob): Promise<string> {
  const audioContent = await blobToBase64(audioBlob);

  const res = await fetch(
    `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        config: {
          encoding: "OGG_OPUS",
          sampleRateHertz: 48000,
          languageCode: "en-US",
          enableAutomaticPunctuation: true,
          useEnhanced: true,
        },
        audio: { content: audioContent },
      }),
    }
  );

  const data = await res.json();
  if (!data.results) return "";
  return data.results.map((r: any) => r.alternatives[0].transcript).join(" ");
}

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
