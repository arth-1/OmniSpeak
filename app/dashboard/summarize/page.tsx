"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Upload, FileText, Mic } from "lucide-react";

export default function SummarizePage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryLength, setSummaryLength] = useState([50]);
  const [file, setFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const handleSummarize = () => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate summarization delay
    setTimeout(() => {
      // In a real app, this would call the Hugging Face API
      setSummary(mockSummarize(text, summaryLength[0]));
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would start/stop recording audio
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text">Text Summarization</TabsTrigger>
          <TabsTrigger value="document">Document Summarization</TabsTrigger>
          <TabsTrigger value="voice">Voice Summarization</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Summarization</CardTitle>
              <CardDescription>
                Paste your text and get a concise summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Input Text</label>
                <Textarea
                  placeholder="Paste your text here to summarize..."
                  className="min-h-[200px]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Summary Length</label>
                  <span className="text-sm text-muted-foreground">{summaryLength[0]}%</span>
                </div>
                <Slider
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  min={10}
                  max={90}
                  step={10}
                />
              </div>
              
              <Button 
                onClick={handleSummarize} 
                disabled={!text.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? "Summarizing..." : "Summarize"}
              </Button>
              
              {summary && (
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-medium">Summary</label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p>{summary}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="document" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Summarization</CardTitle>
              <CardDescription>
                Upload a document and get a concise summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed rounded-lg p-10 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Document</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop a document or click to browse
                </p>
                <input
                  type="file"
                  id="document-file"
                  accept=".pdf,.doc,.docx,.txt"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="document-file">
                  <Button variant="outline" className="mx-auto">
                    Select File
                  </Button>
                </label>
                {file && (
                  <p className="mt-4 text-sm">
                    Selected file: {file.name}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Summary Length</label>
                  <span className="text-sm text-muted-foreground">{summaryLength[0]}%</span>
                </div>
                <Slider
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  min={10}
                  max={90}
                  step={10}
                />
              </div>
              
              <Button 
                disabled={!file} 
                className="w-full"
              >
                Summarize Document
              </Button>
              
              {summary && (
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-medium">Summary</label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p>{summary}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="voice" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Summarization</CardTitle>
              <CardDescription>
                Record your voice and get a concise summary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <div className={`w-32 h-32 rounded-full flex items-center justify-center ${isRecording ? "bg-red-100 dark:bg-red-900/20 animate-pulse" : "bg-muted"}`}>
                  <Mic className={`h-12 w-12 ${isRecording ? "text-red-500" : ""}`} />
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-medium mb-2">
                    {isRecording ? "Recording..." : "Press to start recording"}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRecording
                      ? "Speak clearly and I'll summarize your voice recording"
                      : "Click the button below to start recording your voice"}
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    variant={isRecording ? "destructive" : "default"}
                    onClick={toggleRecording}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </Button>
                  
                  <Button variant="outline" disabled={!isRecording}>
                    Summarize
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Summary Length</label>
                  <span className="text-sm text-muted-foreground">{summaryLength[0]}%</span>
                </div>
                <Slider
                  value={summaryLength}
                  onValueChange={setSummaryLength}
                  min={10}
                  max={90}
                  step={10}
                />
              </div>
              
              {summary && (
                <div className="space-y-2 mt-4">
                  <label className="text-sm font-medium">Summary</label>
                  <div className="p-4 bg-muted rounded-lg">
                    <p>{summary}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function mockSummarize(text: string, length: number): string {
  // This is a simple mock summarization function
  // In a real app, this would call the Hugging Face API
  
  const mockSummaries = [
    "This property features 3 bedrooms, 2 bathrooms, and is located in a prime neighborhood with excellent schools and amenities. Recent renovations include a new kitchen and updated bathrooms.",
    
    "The client is interested in a 2-bedroom apartment in the downtown area with a budget of $350,000. They prefer modern finishes and are flexible on the move-in date.",
    
    "The market analysis shows a 5% increase in property values in this neighborhood over the past year. Inventory is low, making it a seller's market with properties typically selling within 10 days of listing.",
    
    "The meeting covered the new development project timeline, with construction set to begin next month. Pre-sales have reached 60% and marketing efforts will focus on the remaining premium units.",
    
    "The client feedback indicates high satisfaction with the virtual tour experience but concerns about the property's proximity to the highway. They've requested additional information about noise levels and potential soundproofing options."
  ];
  
  // Return a random mock summary
  return mockSummaries[Math.floor(Math.random() * mockSummaries.length)];
}