'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Mic, Hourglass, BarChart2, Lightbulb, TrendingUp, Sparkles, AlertCircle, PhoneCall, History } from 'lucide-react';

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
  const [audioProgress, setAudioProgress] = useState(0);
  const [selectedRecordingUrl, setSelectedRecordingUrl] = useState<string | null>(null);

  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array>(new Uint8Array(0));
  const animationFrameId = useRef<number | null>(null);

  // Load saved history
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

  // Save history when updated
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("callHistory", JSON.stringify(history));
    }
  }, [history]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
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
          if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
        }
      };

      // Audio Visualizer
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser.current = audioContext.current.createAnalyser();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(analyser.current);
      analyser.current.fftSize = 256;

      const bufferLength = analyser.current.frequencyBinCount;
      dataArray.current = new Uint8Array(bufferLength);

      const draw = () => {
        if (analyser.current && dataArray.current.length > 0) {
          analyser.current.getByteFrequencyData(dataArray.current);
          const avg = dataArray.current.reduce((a, v) => a + v, 0) / dataArray.current.length;
          setAudioProgress(avg);
        }
        animationFrameId.current = requestAnimationFrame(draw);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      draw();

    } catch (err) {
      console.error("Recording error:", err);
      setError("Microphone access denied. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const processRecording = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    // Mock analysis
    const duration = Math.floor(audioBlob.size / 2000);
    const mockData = {
      transcript: "This is a mock transcript about a property sale. The client was very interested in the downtown loft.",
      analysis: {
        summary: "The client showed high interest in the downtown loft. Discussion included budget and unique features. Next step: schedule a follow-up.",
        rating: 4,
        clientInterest: "High",
        keywords: ["downtown loft", "budget", "follow-up", "features"],
        sentiment: { positive: 75, neutral: 15, negative: 10 },
        nextSteps: [
          "Schedule a follow-up meeting.",
          "Send detailed property brochure.",
          "Provide alternatives.",
          "Send thank-you email."
        ],
      },
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const recordingUrl = URL.createObjectURL(audioBlob);

      const summary: CallSummary = {
        id: Date.now().toString(),
        transcript: mockData.transcript,
        summary: mockData.analysis.summary,
        rating: mockData.analysis.rating,
        clientInterest: mockData.analysis.clientInterest,
        keywords: mockData.analysis.keywords,
        date: new Date().toISOString(),
        duration,
        sentiment: mockData.analysis.sentiment,
        nextSteps: mockData.analysis.nextSteps,
        recording: recordingUrl,
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

  const handleHistoryItemClick = (call: CallSummary) => {
    setCurrentSummary(call);
    setSelectedRecordingUrl(call.recording || null);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-white min-h-screen font-sans">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
          <PhoneCall size={32} className="text-purple-400"/>
          Voice Call Analysis
        </h1>
      </header>

      {/* Error */}
      {error && (
        <Card className="bg-red-900/50 border-red-800 text-red-300">
          <CardContent className="p-4 flex items-center">
            <AlertCircle className="mr-3 h-5 w-5" />
            <div>
              <p className="font-semibold">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recording */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <Mic size={20} className="text-sky-400"/> Start Recording
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant={isRecording ? "destructive" : "default"}
            className={`w-full ${isRecording ? "bg-red-600" : "bg-gradient-to-r from-teal-500 to-sky-500"}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
          >
            {isRecording ? "⏹ Stop" : "🎤 Start"}
            {isProcessing && " (Processing...)"}
          </Button>

          {isRecording && (
            <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full bg-sky-500" style={{ width: `${audioProgress / 2.55}%` }} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {currentSummary && (
        <AnalysisCard currentSummary={currentSummary} selectedRecordingUrl={selectedRecordingUrl}/>
      )}

      {/* History */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-200">
            <History size={20} className="text-yellow-400"/> Recent Calls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            {history.length > 0 ? history.map((c) => (
              <CallHistoryItem key={c.id} call={c} onClick={() => handleHistoryItemClick(c)} />
            )) : <p className="text-center text-slate-500 py-6">No calls yet</p>}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

// Analysis Results Card
function AnalysisCard({ currentSummary, selectedRecordingUrl }: { currentSummary: CallSummary, selectedRecordingUrl: string | null }) {
  return (
    <Card className="bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-200">
          <BarChart2 size={20} className="text-sky-400"/> Analysis Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="bg-slate-800 p-4 rounded-lg">{currentSummary.summary}</p>

        {selectedRecordingUrl && (
          <audio controls className="w-full">
            <source src={selectedRecordingUrl} type="audio/webm" />
          </audio>
        )}
      </CardContent>
    </Card>
  );
}

// History Card
function CallHistoryItem({ call, onClick }: { call: CallSummary; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="p-4 bg-slate-800 border border-slate-700 hover:border-sky-500 cursor-pointer">
      <h4 className="text-slate-200">{format(new Date(call.date), "MMM dd, yyyy HH:mm")}</h4>
      <p className="text-xs text-slate-400">{call.summary}</p>
    </Card>
  );
}
