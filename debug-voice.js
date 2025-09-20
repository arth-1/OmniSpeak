// Test the voice analysis API to debug the response
async function testVoiceAnalysis() {
  const sampleTranscript = "I'm looking for investment opportunities. What areas do you think have the best potential for property value appreciation?";
  
  try {
    const response = await fetch('/api/voice', {
      method: 'POST',
      body: new FormData()
    });
    
    // For testing, we can also directly test the analyzeCall function
    const { analyzeCall } = await import('./lib/huggingface');
    
    console.log("Testing analyzeCall directly...");
    const result = await analyzeCall(sampleTranscript);
    console.log("Direct analyzeCall result:", JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error("Test error:", error);
  }
}

// Uncomment to run test
// testVoiceAnalysis();