  "use client";

  import { useState, useRef, useEffect } from "react";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
  import { Textarea } from "@/components/ui/textarea";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
  import { Slider } from "@/components/ui/slider";
  import { Bot, FileText, Mic, Send, User } from "lucide-react";
  import Markdown from "react-markdown";
  import { ScrollArea } from "@/components/ui/scroll-area"; 
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";   
import { Input } from "@/components/ui/input";

  interface Message {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
  }

  export default function SummarizePage() {
    const [input, setInput] = useState("");
      const [messages, setMessages] = useState<Message[]>([]);
      const [isRecording, setIsRecording] = useState(false);
      const messagesEndRef = useRef<HTMLDivElement>(null);
    
      const handleSendMessage = async () => {
        if (!input.trim()) return;
        const userMessage: Message = {
          id: Date.now().toString(),
          content: input,
          sender: "user",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
    
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: [
                { role: "system", content: "You are a real estate AI assistant..." },
                { role: "user", content: userMessage.content },
              ],
              stream: true,
            }),
          });
    
          if (!response.ok || !response.body) {
            throw new Error("No response body from server");
          }
    
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let aiContent = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n").filter(Boolean);
            for (const line of lines) {
              try {
                const json = JSON.parse(line);
                if (json.message) {
                  aiContent += json.message;
                  setMessages((prev) => {
                    const last = prev[prev.length - 1];
                    if (last && last.sender === "ai") {
                      return [...prev.slice(0, -1), { ...last, content: aiContent }];
                    }
                    return [...prev, { id: Date.now().toString(), content: aiContent, sender: "ai", timestamp: new Date() }];
                  });
                }
              } catch (error) {
                console.error("Parsing error:", error);
              }
            }
          }
        } catch (error) {
          setMessages((prev) => [
            ...prev,
            {
              id: "error",
              content: error instanceof Error ? error.message : "Request failed",
              sender: "ai",
              timestamp: new Date(),
            },
          ]);
        }
    };

    // // Voice recording handlers
    // const startRecording = async () => {
    //   try {
    //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    //     mediaRecorder.current = new MediaRecorder(stream);
    //     mediaRecorder.current.start();
        
    //     mediaRecorder.current.ondataavailable = (e) => {
    //       audioChunks.current.push(e.data);
    //     };

    //     mediaRecorder.current.onstop = async () => {
    //       const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
    //       audioChunks.current = [];
    //       await processAudio(audioBlob);
    //     };

    //     setIsRecording(true);
    //   } catch (error) {
    //     console.error("Error accessing microphone:", error);
    //   }
    // };

    // const processAudio = async (audioBlob: Blob) => {
    //   try {
    //     const formData = new FormData();
    //     formData.append("audio", audioBlob);
        
    //     const response = await fetch("/api/summarize/voice", {
    //       method: "POST",
    //       body: formData,
    //     });

    //     const result = await response.json();
    //     if (result.text) {
    //       await processSummary("text", { text: result.text });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     setSummary(`Error: ${error instanceof Error ? error.message : "Failed to process audio"}`);
    //   }
    // };

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
  
    function formatTime(date: Date): string {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    return (
      <div className="space-y-6">
        <Tabs defaultValue="chat">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            {/* <TabsTrigger value="document">Document</TabsTrigger>
            <TabsTrigger value="voice">Voice</TabsTrigger> */}
          </TabsList>
    
          {/* Chat Tab */}
          <TabsContent value="chat">
            <Card className="flex-1 flex flex-col h-[calc(100vh-12rem)]">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div className="flex items-start gap-2 max-w-[80%]">
                        {message.sender === "ai" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <Bot size={16} />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.sender === "ai" ? (
                            <Markdown>{message.content}</Markdown>
                          ) : (
                            <p>{message.content}</p>
                          )}
                          <p className="text-xs opacity-70 mt-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                        {message.sender === "user" && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              <User size={16} />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <CardContent className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMessage}>
                    <Send />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }    
    
  //   // Sub-components
  //   function ConfigPanel({ config, setConfig }: { 
  //     config: SummaryConfig, 
  //     setConfig: React.Dispatch<React.SetStateAction<SummaryConfig>> 
  //   }) {
  //     return (
  //       <div className="space-y-4">
  //         <div className="space-y-2">
  //           <label className="text-sm font-medium">Summary Length</label>
  //           <Slider
  //             value={[config.length]}
  //             onValueChange={([val]) => setConfig(prev => ({ ...prev, length: val }))}
  //             min={10}
  //             max={90}
  //             step={10}
  //           />
  //           <div className="flex justify-between text-sm text-muted-foreground">
  //             <span>Concise</span>
  //             <span>Detailed</span>
  //           </div>
  //         </div>
    
  //         <div className="space-y-2">
  //           <label className="text-sm font-medium">Summary Format</label>
  //           <div className="flex gap-4">
  //             <Button
  //               variant={config.format === "bullet-points" ? "default" : "outline"}
  //               onClick={() => setConfig(prev => ({ ...prev, format: "bullet-points" }))}
  //             >
  //               Bullet Points
  //             </Button>
  //             <Button
  //               variant={config.format === "paragraph" ? "default" : "outline"}
  //               onClick={() => setConfig(prev => ({ ...prev, format: "paragraph" }))}
  //             >
  //               Paragraph
  //             </Button>
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   }
    

  // // function FileUpload({ file, setFile }: { 
  // //   file: File | null, 
  // //   setFile: React.Dispatch<React.SetStateAction<File | null>> 
  // // }) {
  // //   return (
  // //     <div className="border-2 border-dashed rounded-lg p-6 text-center">
  // //       <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
  // //       <input
  // //         type="file"
  // //         id="document-upload"
  // //         className="hidden"
  // //         accept=".pdf,.doc,.docx,.txt,.md"
  // //         onChange={(e) => setFile(e.target.files?.[0] || null)}
  // //       />
  // //       <label htmlFor="document-upload" className="cursor-pointer">
  // //         <Button variant="outline">{file ? file.name : "Select Document"}</Button>
  // //       </label>
  // //       <p className="text-sm text-muted-foreground mt-2">
  // //         Supported formats: PDF, DOC/DOCX, TXT, MD
  // //       </p>
  // //     </div>
  // //   );
  // // }

  // // function VoiceRecorder({ 
  // //   isRecording, 
  // //   startRecording, 
  // //   stopRecording 
  // // }: {
  // //   isRecording: boolean;
  // //   startRecording: () => void;
  // //   stopRecording: () => void;
  // // }) {
  // //   return (
  // //     <div className="flex flex-col items-center gap-4">
  // //       <div className={`relative w-32 h-32 rounded-full flex items-center justify-center 
  // //         ${isRecording ? "bg-red-100 animate-pulse" : "bg-muted"}`}>
  // //         <Mic className={`h-16 w-16 ${isRecording ? "text-red-500" : ""}`} />
  // //       </div>
  // //       <Button
  // //         variant={isRecording ? "destructive" : "default"}
  // //         onClick={isRecording ? stopRecording : startRecording}
  // //       >
  // //         {isRecording ? "Stop Recording" : "Start Recording"}
  // //       </Button>
  // //     </div>
  // //   );
  // // }

  // // function SummaryOutput({ summary }: { summary: string }) {
  // //   if (!summary) return null;
    
  // //   return (
  // //     <div className="space-y-2">
  // //       <label className="text-sm font-medium">Generated Summary</label>
  // //       <div className="p-4 bg-muted rounded-lg prose max-w-none">
  // //         <Markdown>{summary}</Markdown>
  // //       </div>
  // //     </div>
  // //   );
  // // }
