"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Mic, User, Bot } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatPage() {
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
      const response = await fetch("http://localhost:11434/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "deepseek-r1:14b", // Required field
          messages: [
            { role: 'system', content: 'You are a real estate AI assistant...' },
            // ...other messages
          ],
          stream: true
        }),
      });

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let aiResponse = "";
      const aiMessageId = Date.now().toString();  

if (!reader) throw new Error("No response body");

let fullResponse = "";
let done = false;
let buffer = "";

while (!done) {
  const { value, done: doneReading } = await reader.read();
  if (doneReading) break;
  if (value) {
    buffer += decoder.decode(value, { stream: true });
    // Assuming JSON objects are newline-delimited:
    const lines = buffer.split("\n");
    // Process all complete lines
    for (let i = 0; i < lines.length - 1; i++) {
      try {
        const json = JSON.parse(lines[i]);
        fullResponse += json.message?.content || "";
        if (json.done) { // Stop if API signals completion
          done = true;
          break;
        }
      } catch (err) {
        console.error("Parsing error:", err);
      }
    }
    // Keep the incomplete part in the buffer
    buffer = lines[lines.length - 1];
  }
}
// Optionally flush any remaining data
fullResponse += decoder.decode();
console.log("Final response:", fullResponse);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: "error",
          content:
            error instanceof Error ? error.message.replace(/</g, "&lt;") : "Request failed",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Optional: Audio recording implementation
  const handleAudioRecording = async () => {
    setIsRecording((prev) => !prev);
    // Implement audio recording as needed...
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Card className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
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
                    <p>{message.content}</p>
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
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button size="icon" onClick={handleAudioRecording}>
              <Mic className={isRecording ? "text-red-500" : ""} />
            </Button>
            <Button size="icon" onClick={handleSendMessage}>
              <Send />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
