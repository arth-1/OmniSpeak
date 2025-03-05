// app/dashboard/voice/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type CallSummary = {
  id: string;
  transcript: string;
  summary: string;
  positivity: number;
  quality: number;
  keywords: string[];
  date: string;
  duration: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  recording: string;
};

export default function VoicePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<CallSummary | null>(null);
  const [history, setHistory] = useState<CallSummary[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioSupported, setIsAudioSupported] = useState(true);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("callHistory");
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        
        // Data migration for older entries
        const migratedHistory = parsedHistory.map((call: any) => ({
          ...call,
          quality: call.quality ?? 0, // Add default quality if missing
          sentiment: call.sentiment || { 
            positive: 0, 
            neutral: 0, 
            negative: 0 
          }
        }));
        
        setHistory(migratedHistory);
      } catch (error) {
        console.error("Error parsing call history:", error);
        // Clear corrupted history
        localStorage.removeItem("callHistory");
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("callHistory", JSON.stringify(history));
    }
  }, [history]);

  // Check browser support
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setIsAudioSupported(false);
    }
  }, []);

  

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
        audioChunks.current = [];
        await processRecording(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsAudioSupported(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      // Convert to data URL for storage
      const recording = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });

      const transcript = await convertSpeechToText(audioBlob);
      const analysis = await analyzeCall(transcript);
      
      const summary: CallSummary = {
        id: Date.now().toString(),
        transcript,
        recording,
        date: new Date().toISOString(),
        duration: Math.floor(audioBlob.size / (16000 * 2)),
        ...analysis,
      };

      setCurrentSummary(summary);
      setHistory(prev => [summary, ...prev]);
    } catch (error) {
      console.error("Processing failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAudioSupported) {
    return (
      <div className="p-6">
        <Card className="text-red-500">
          <CardHeader>
            <CardTitle>Browser Not Supported</CardTitle>
          </CardHeader>
          <CardContent>
            Audio recording is not supported in this browser. Please use Chrome, Firefox, or Edge.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Controls Section */}
      <div className="md:col-span-1 space-y-4">
      <Card>
  <CardHeader>
    <CardTitle>Call Controls</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Button
      variant={isRecording ? "destructive" : "default"}
      className={`w-full ${!isRecording ? "bg-black text-white" : ""}`}
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
    >
      {isRecording ? "Stop Recording" : "Start Recording"}
    </Button>
  </CardContent>
</Card>


        {currentSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Call Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StatItem label="Positivity Score" value={`${currentSummary.positivity}/10`} />
              <StatItem label="Quality Score" value={`${currentSummary.quality}/5`} />
              <StatItem label="Duration" value={`${currentSummary.duration}s`} />
              <div className="space-y-2">
                <p className="text-sm font-medium">Key Topics</p>
                <div className="flex flex-wrap gap-2">
                  {currentSummary.keywords.map((word) => (
                    <Badge key={word} variant="outline">
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content */}
      <div className="md:col-span-2 space-y-6">
        {currentSummary ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Call Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Summary</p>
                  <p className="text-muted-foreground">{currentSummary.summary}</p>
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Sentiment Analysis</p>
                  <SentimentBars stats={currentSummary.sentiment} />
                </div>
                <div className="space-y-2">
                  <p className="font-medium">Recording</p>
                  <audio controls className="w-full">
                    <source src={currentSummary.recording} type="audio/webm" />
                  </audio>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
  <CardHeader>
    <CardTitle>Start a New Call</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">
      Click <Button className="bg-black text-white">Start Recording</Button> to begin analyzing a voice call
    </p>
  </CardContent>
</Card>

        )}

        {/* Call History */}
        <Card>
          <CardHeader>
            <CardTitle>Call History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {history.map((call) => (
                  <CallHistoryItem key={call.id} call={call} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Components
function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function SentimentBars({ stats }: { stats: CallSummary["sentiment"] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-sm text-green-600">Positive</span>
          <span className="text-sm">{stats.positive}%</span>
        </div>
        <Progress value={stats.positive} className="h-2" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-sm text-yellow-600">Neutral</span>
          <span className="text-sm">{stats.neutral}%</span>
        </div>
        <Progress value={stats.neutral} className="h-2" />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-sm text-red-600">Negative</span>
          <span className="text-sm">{stats.negative}%</span>
        </div>
        <Progress value={stats.negative} className="h-2" />
      </div>
    </div>
  );
}

function CallHistoryItem({ call }: { call: CallSummary }) {
    return (
      <Card className="p-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{format(new Date(call.date), "MMM dd, yyyy HH:mm")}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{call.summary}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="shrink-0">
                {(call.positivity ?? 0).toFixed(1)}/10
              </Badge>
              <Badge variant="outline" className="shrink-0">
                Quality: {(call.quality ?? 0).toFixed(1)}/5
              </Badge>
            </div>
          </div>
          <audio controls className="w-full mt-2">
            <source src={call.recording} type="audio/webm" />
          </audio>
        </div>
      </Card>
    );
  }

// Utility Functions
async function analyzeCall(transcript: string) {
  const SYSTEM_PROMPT = `Analyze this customer call transcript and provide:
1. Concise 3-sentence summary focusing on key issues and outcomes
2. Positivity score (1-10) based on customer sentiment
3. Quality score (1-5) for conversation clarity and professionalism
4. 5-7 key topics or keywords
5. Sentiment breakdown (positive/neutral/negative percentages)

Format response as JSON:
{
  "summary": "...",
  "positivity": 7.2,
  "quality": 4,
  "keywords": ["billing", "technical", ...],
  "sentiment": {
    "positive": 65,
    "neutral": 25,
    "negative": 10
  }
}`;

  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "deepseek-r1:14b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: transcript }
        ],
        format: "json",
        stream: false
      }),
    });

    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    
    const result = await response.json();
    
    // Validate and normalize response
    return {
        summary: result.summary || "No summary generated",
        positivity: Math.min(10, Math.max(0, Number(result.positivity) || 0)),
        quality: Math.min(5, Math.max(0, Number(result.quality) || 0)), // Ensure number
        keywords: Array.isArray(result.keywords) ? result.keywords.slice(0, 7) : [],
        sentiment: {
          positive: Math.min(100, Math.max(0, Number(result.sentiment?.positive) || 0)),
          neutral: Math.min(100, Math.max(0, Number(result.sentiment?.neutral) || 0)),
          negative: Math.min(100, Math.max(0, Number(result.sentiment?.negative) || 0))
        }
      };
  } catch (error) {
    console.error("Analysis error:", error);
    return {
      summary: "Analysis failed: " + (error instanceof Error ? error.message : "Unknown error"),
      positivity: 0,
      quality: 0,
      keywords: [],
      sentiment: { positive: 0, neutral: 0, negative: 0 }
    };
  }
}

async function convertSpeechToText(audioBlob: Blob): Promise<string> {
  // Implement proper STT here (this is a mock implementation)
  return "Customer called regarding a billing discrepancy. They expressed frustration about an overcharge but appreciated the quick response from support. The agent offered a 20% discount as compensation.";
}