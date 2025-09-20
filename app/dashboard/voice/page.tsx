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
  rating: number;
  clientInterest: string;
  keywords: string[];
  date: string;
  duration: number;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  nextSteps: string[];
  recording?: string;
};

export default function VoicePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<CallSummary | null>(null);
  const [history, setHistory] = useState<CallSummary[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("callHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch {
        localStorage.removeItem("callHistory");
      }
    }
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("callHistory", JSON.stringify(history));
    }
  }, [history]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true
      });
      
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      
      mediaRecorder.current.onstop = async () => {
        try {
          if (audioChunks.current.length > 0) {
            const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
            await processRecording(audioBlob);
          }
        } catch (err) {
          console.error("Processing error:", err);
          setError("Failed to process recording");
        } finally {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error("Recording error:", error);
      setError("Microphone access denied. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);

      const response = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Processing failed");
      }

      const recordingUrl = URL.createObjectURL(audioBlob);

      const summary: CallSummary = {
        id: Date.now().toString(),
        transcript: data.transcript,
        summary: data.analysis.summary,
        rating: data.analysis.rating,
        clientInterest: data.analysis.clientInterest,
        keywords: data.analysis.keywords,
        date: new Date().toISOString(),
        duration: Math.floor(audioBlob.size / 2000),
        sentiment: data.analysis.sentiment,
        nextSteps: data.analysis.nextSteps,
        recording: recordingUrl
      };

      setCurrentSummary(summary);
      setHistory(prev => [summary, ...prev.slice(0, 9)]);
      
    } catch (err: any) {
      console.error("API error:", err);
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Error Display */}
      {error && (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="text-red-700">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recording Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Voice Call Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button
              variant={isRecording ? "destructive" : "default"}
              className="w-full"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? "⏹️ Stop Recording" : "🎤 Start Recording"}
              {isProcessing && " (Processing...)"}
            </Button>
            
            {isProcessing && (
              <div className="text-center">
                <Progress value={50} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">Analyzing your call...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Analysis Results */}
      {currentSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Section */}
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {currentSummary.summary}
              </p>
            </div>

            {/* Transcript Section */}
            <div>
              <h3 className="font-semibold mb-2">Transcript</h3>
              <p className="text-gray-600 text-sm bg-blue-50 p-4 rounded-lg">
                {currentSummary.transcript}
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Metrics */}
              <div className="space-y-4">
                <h3 className="font-semibold">Metrics</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Quality Rating</span>
                    <Badge variant="outline" className="text-lg">
                      {currentSummary.rating}/5
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Client Interest</span>
                    <Badge variant={
                      currentSummary.clientInterest === "High" ? "default" :
                      currentSummary.clientInterest === "Medium" ? "secondary" : "outline"
                    }>
                      {currentSummary.clientInterest}
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Duration</span>
                    <span className="font-medium">{currentSummary.duration}s</span>
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <h4 className="font-medium mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSummary.keywords.map((word, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {word}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Sentiment */}
              <div className="space-y-4">
                <h3 className="font-semibold">Sentiment Analysis</h3>
                
                <div className="space-y-4">
                  {[
                    { label: "Positive", value: currentSummary.sentiment.positive, color: "bg-green-500" },
                    { label: "Neutral", value: currentSummary.sentiment.neutral, color: "bg-yellow-500" },
                    { label: "Negative", value: currentSummary.sentiment.negative, color: "bg-red-500" }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.label}</span>
                        <span className="text-gray-600">{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${item.color} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div>
              <h3 className="font-semibold mb-3">Recommended Next Steps</h3>
              <ul className="space-y-2">
                {currentSummary.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <span className="text-green-800">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recording Player */}
            {currentSummary.recording && (
              <div>
                <h3 className="font-semibold mb-2">Recording</h3>
                <audio controls className="w-full">
                  <source src={currentSummary.recording} type="audio/webm" />
                  Your browser does not support audio playback.
                </audio>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Call History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <div className="space-y-4">
              {history.map((call) => (
                <CallHistoryItem key={call.id} call={call} />
              ))}
              {history.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No call history yet</p>
                  <p className="text-sm">Start your first recording above</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components
function CallHistoryItem({ call }: { call: CallSummary }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-sm">
            {format(new Date(call.date), "MMM dd, yyyy 'at' HH:mm")}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2 mt-1">
            {call.summary}
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {call.rating}/5
            </Badge>
            <Badge variant={
              call.clientInterest === "High" ? "default" :
              call.clientInterest === "Medium" ? "secondary" : "outline"
            } className="text-xs">
              {call.clientInterest}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}