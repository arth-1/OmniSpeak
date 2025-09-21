import { NextRequest, NextResponse } from 'next/server';
import { speechToText, analyzeCall } from '@/lib/huggingface';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type');
    
    let transcript = '';
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle audio file upload
      const formData = await request.formData();
      const audioFile = formData.get('audio') as File;

      if (!audioFile) {
        return NextResponse.json({
          success: false,
          error: 'No audio file provided'
        }, { status: 400 });
      }

      // Convert audio file to speech-to-text
      console.log('Processing audio file:', audioFile.name, audioFile.size);
      
      const transcriptResult = await speechToText(audioFile);
      transcript = transcriptResult.text;
      
      if (!transcript) {
        return NextResponse.json({
          success: false,
          error: 'Failed to transcribe audio'
        }, { status: 500 });
      }
    } else {
      // Handle JSON with transcript
      const body = await request.json();
      transcript = body.transcript;
      
      if (!transcript) {
        return NextResponse.json({
          success: false,
          error: 'No transcript provided'
        }, { status: 400 });
      }
    }

    console.log("📝 Transcript to analyze:", transcript);

    // Analyze the transcript for real estate insights
    const analysis = await analyzeCall(transcript);
    
    console.log("🤖 AI Analysis result:", JSON.stringify(analysis, null, 2));

    const finalResponse = {
      success: true,
      transcript,
      analysis
    };

    console.log("🚀 Final API response:", JSON.stringify(finalResponse, null, 2));

    return NextResponse.json(finalResponse);

  } catch (error: any) {
    console.error('Voice API error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process audio'
    }, { status: 500 });
  }
}