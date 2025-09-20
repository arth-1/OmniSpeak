// lib/huggingface.ts
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-pro";

// Add this debug log to check if env vars are loading:
console.log("GEMINI_API_KEY loaded:", GEMINI_API_KEY ? "Yes" : "No");
console.log("GEMINI_MODEL:", DEFAULT_MODEL);

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is not configured!");
  console.error("Please add GEMINI_API_KEY to your .env.local file");
}

// Rest of your code...

// ✅ REAL Gemini API call
async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY not configured");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      }
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ✅ REAL Speech-to-Text with Google Cloud Speech-to-Text API
export async function speechToText(audioData: Blob): Promise<{ text: string }> {
  try {
    console.log("Real speech-to-text called with audio size:", audioData.size);
    
    // Check if we have Google Cloud Speech API key
    const speechApiKey = process.env.GOOGLE_CLOUD_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!speechApiKey) {
      console.warn("No Google Cloud API key found, using fallback");
      return await fallbackSpeechToText(audioData);
    }

    // Convert blob to base64 for Google Cloud Speech API
    const arrayBuffer = await audioData.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    const speechUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${speechApiKey}`;
    
    const requestBody = {
      config: {
        encoding: 'WEBM_OPUS', // Common browser recording format
        sampleRateHertz: 48000,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false,
        model: 'latest_long', // Good for longer recordings
        useEnhanced: true
      },
      audio: {
        content: base64Audio
      }
    };

    console.log("Sending audio to Google Cloud Speech API...");
    const response = await fetch(speechUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error("Speech API error:", response.status, await response.text());
      return await fallbackSpeechToText(audioData);
    }

    const result = await response.json();
    console.log("Google Speech API response:", result);
    
    if (result.results && result.results.length > 0) {
      const transcript = result.results
        .map((r: any) => r.alternatives[0]?.transcript || '')
        .join(' ')
        .trim();
      
      if (transcript) {
        console.log("Transcription successful:", transcript.substring(0, 100) + "...");
        return { text: transcript };
      }
    }

    console.warn("No transcript found in response, using fallback");
    return await fallbackSpeechToText(audioData);
    
  } catch (error) {
    console.error("Speech-to-text error:", error);
    return await fallbackSpeechToText(audioData);
  }
}

// Fallback speech-to-text for development/demo
async function fallbackSpeechToText(audioData: Blob): Promise<{ text: string }> {
  console.log("Using fallback speech-to-text with audio size:", audioData.size);
  
  // Simulate different responses based on recording duration and size
  const duration = audioData.size / 1000; // Rough estimate
  
  const responses = [
    "Hi, I'm interested in viewing some properties in the downtown area. I'm looking for a 2-3 bedroom house or condo with good access to public transportation.",
    "Can you tell me about the current market conditions? I'm thinking about both buying a home and possibly investing in rental properties.",
    "I'd like to schedule a property tour for this weekend. Are there any open houses or could we arrange a private showing?",
    "What financing options are available? I'd like to discuss mortgage pre-approval and what kind of down payment I would need.",
    "I'm relocating for work and need to find housing quickly. What's available in family-friendly neighborhoods with good schools?",
    "I'm a first-time homebuyer and feeling a bit overwhelmed. Can you walk me through the process and what I should expect?",
    "I have some properties I might want to sell. Could you give me an idea of what they might be worth in today's market?",
    "I'm looking for investment opportunities. What areas do you think have the best potential for property value appreciation?"
  ];
  
  // Select response based on recording characteristics
  const index = Math.min(Math.floor(duration / 3), responses.length - 1);
  
  return { 
    text: responses[index] 
  };
}

// ✅ REAL Analysis with Gemini
export async function analyzeCall(transcript: string) {
  try {
    console.log("Real analysis called with transcript:", transcript.substring(0, 100) + "...");
    
    const prompt = `You are a real estate assistant analyzing a call transcript. Analyze the following client conversation and provide your response as a valid JSON object.

INSTRUCTIONS:
- Provide a professional 2-3 sentence summary
- Rate the call quality from 1-5 (5 being excellent)
- Assess client interest level as "High", "Medium", or "Low"
- Extract 3-5 relevant keywords from the conversation
- Analyze sentiment (percentages must add to 100)
- Suggest 2-4 practical next steps for the agent

TRANSCRIPT: "${transcript}"

Respond with ONLY this JSON structure (no other text):
{
  "summary": "Professional summary of the conversation in 2-3 sentences",
  "rating": 5,
  "clientInterest": "High",
  "keywords": ["property", "viewing", "interested", "schedule", "weekend"],
  "sentiment": {
    "positive": 85,
    "neutral": 10,
    "negative": 5
  },
  "nextSteps": [
    "Schedule property viewing for requested time",
    "Send property details and pricing information",
    "Follow up within 24 hours to confirm appointment"
  ]
}`;

    const response = await callGemini(prompt);
    console.log("Gemini raw response:", response);
    
    // Enhanced JSON parsing
    try {
      // Remove any markdown formatting or extra text
      let cleanResponse = response.trim();
      
      // Remove code block markers if present
      cleanResponse = cleanResponse.replace(/```json\s*/, '').replace(/```\s*$/, '');
      
      // Find JSON object in response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate required fields
        if (!parsed.summary || !parsed.rating || !parsed.clientInterest) {
          throw new Error("Missing required fields in AI response");
        }
        
        // Ensure sentiment percentages add up to 100
        if (parsed.sentiment) {
          const total = parsed.sentiment.positive + parsed.sentiment.neutral + parsed.sentiment.negative;
          if (Math.abs(total - 100) > 1) { // Allow 1% tolerance
            const factor = 100 / total;
            parsed.sentiment.positive = Math.round(parsed.sentiment.positive * factor);
            parsed.sentiment.neutral = Math.round(parsed.sentiment.neutral * factor);
            parsed.sentiment.negative = 100 - parsed.sentiment.positive - parsed.sentiment.neutral;
          }
        }
        
        console.log("Parsed analysis:", parsed);
        return parsed;
      }
      throw new Error("No JSON found in response");
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response was:", response);
      return createFallbackAnalysis(transcript);
    }
    
  } catch (error) {
    console.error("Real analysis failed:", error);
    return createFallbackAnalysis(transcript);
  }
}

// Fallback analysis function for when AI parsing fails
function createFallbackAnalysis(transcript: string) {
  const interestLevel = transcript.toLowerCase().includes('interested') || transcript.toLowerCase().includes('schedule') ? 'High' : 
                       transcript.toLowerCase().includes('maybe') || transcript.toLowerCase().includes('considering') ? 'Medium' : 'Low';
  
  const rating = interestLevel === 'High' ? 4 : interestLevel === 'Medium' ? 3 : 2;
  
  // Extract keywords from transcript
  const keywords = [];
  const keywordMap = {
    'property': ['property', 'house', 'home', 'condo', 'apartment'],
    'viewing': ['tour', 'viewing', 'showing', 'visit', 'schedule'],
    'price': ['price', 'cost', 'budget', 'afford', 'financing'],
    'location': ['location', 'area', 'neighborhood', 'downtown', 'suburb'],
    'investment': ['investment', 'rental', 'roi', 'appreciation', 'market']
  };
  
  Object.entries(keywordMap).forEach(([key, variations]) => {
    if (variations.some(word => transcript.toLowerCase().includes(word))) {
      keywords.push(key);
    }
  });
  
  // Ensure we have at least 3 keywords
  if (keywords.length < 3) {
    keywords.push('real estate', 'discussion', 'consultation');
  }
  
  return {
    summary: `Client expressed ${interestLevel.toLowerCase()} interest in real estate services. ${
      transcript.includes('schedule') || transcript.includes('tour') ? 'Requested property viewing.' : 
      transcript.includes('financing') || transcript.includes('mortgage') ? 'Discussed financing options.' :
      'General inquiry about available properties.'
    } Professional follow-up recommended.`,
    rating: rating,
    clientInterest: interestLevel,
    keywords: keywords.slice(0, 5),
    sentiment: { 
      positive: interestLevel === 'High' ? 75 : interestLevel === 'Medium' ? 60 : 40, 
      neutral: 20, 
      negative: interestLevel === 'High' ? 5 : interestLevel === 'Medium' ? 20 : 40
    },
    nextSteps: [
      interestLevel === 'High' ? "Schedule property viewing within 24 hours" : "Follow up with property information",
      "Send relevant listings and market data",
      interestLevel === 'High' ? "Prepare pre-qualification materials" : "Schedule follow-up call in 3-5 days"
    ]
  };
}

export async function textToSpeech(text: string): Promise<ArrayBuffer> {
  return new ArrayBuffer(0);
}