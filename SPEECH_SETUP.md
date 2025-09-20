# Speech-to-Text Setup Guide

## Current Implementation

The voice analysis feature currently works with both real Google Cloud Speech-to-Text API and a fallback system for development.

## Environment Variables Needed

Add these to your `.env.local` file:

```env
# Required for Gemini AI (already set up)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-pro

# Optional: For real speech-to-text (otherwise uses smart fallback)
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
```

## How It Works

### Real Speech-to-Text (Production)
- Uses Google Cloud Speech-to-Text API
- Requires `GOOGLE_CLOUD_API_KEY` environment variable
- Processes actual audio recordings
- Supports various audio formats (WebM, MP3, WAV)

### Fallback Speech-to-Text (Development)
- Intelligent simulation based on recording characteristics
- Uses different realistic responses based on audio duration/size
- No additional setup required
- Good for development and testing

### AI Analysis
- Always uses real Gemini AI for analysis
- Processes actual transcripts (real or simulated)
- Returns structured JSON with:
  - Professional summary
  - Quality rating (1-5)
  - Client interest level (High/Medium/Low)
  - Relevant keywords
  - Sentiment analysis
  - Next steps recommendations

## Setting Up Google Cloud Speech-to-Text (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Speech-to-Text API
4. Create API credentials (API key)
5. Add the API key to your `.env.local` as `GOOGLE_CLOUD_API_KEY`

## Testing

The system will automatically:
- Try real speech-to-text if API key is available
- Fall back to intelligent simulation if no API key
- Always use real AI analysis for processing results

This ensures the voice analysis feature works immediately while allowing for production-ready real speech processing when configured.