// pages/api/translate.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const { text, sourceLang, targetLang } = req.body;
    if (!text || !sourceLang || !targetLang) {
      return res.status(400).json({ error: 'Missing parameters' });
    }
    
    const payload = {
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
      alternatives: 3,
      api_key: ""
    };

    // Use your local instance at localhost:5000
    const response = await fetch('http://localhost:5000/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Translation API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return res.status(200).json({
      translatedText: data.translatedText,
      alternatives: data.alternatives,
      detectedLanguage: data.detectedLanguage
    });
  } catch (error: any) {
    console.error("Translation error:", error);
    return res.status(500).json({ error: 'Translation error', details: error.message });
  }
}
