// pages/api/translateVoice.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';

export const config = {
  api: { bodyParser: false }
};

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { fields } = await parseForm(req);
    // Extract language values (they might be arrays)
    const sourceLang = Array.isArray(fields.sourceLang) ? fields.sourceLang[0] : fields.sourceLang;
    const targetLang = Array.isArray(fields.targetLang) ? fields.targetLang[0] : fields.targetLang;
    if (!sourceLang || !targetLang) {
      return res.status(400).json({ error: 'Missing language parameters' });
    }
    
    // Simulated voice transcription (replace with actual speech-to-text integration if needed)
    const transcribedText = "Simulated transcription from voice audio";

    const payload = {
      q: transcribedText,
      source: sourceLang,
      target: targetLang,
      format: "text",
      alternatives: 3,
      api_key: ""
    };

    const response = await fetch("https://translate.argosopentech.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
    console.error("Voice translation error:", error);
    return res.status(500).json({ error: 'Voice translation error', details: error.message });
  }
}
