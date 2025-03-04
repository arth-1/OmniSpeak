"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Mic, Play, Upload } from "lucide-react";

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
];

export default function TranslatePage() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate translation delay
    setTimeout(() => {
      // In a real app, this would call the Hugging Face API
      setTranslatedText(mockTranslate(sourceText, sourceLang, targetLang));
      setIsTranslating(false);
    }, 1000);
  };

  const handleSwapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    
    // Also swap the text if there's translated content
    if (translatedText) {
      setSourceText(translatedText);
      setTranslatedText("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
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
          <TabsTrigger value="text">Text Translation</TabsTrigger>
          <TabsTrigger value="voice">Voice Translation</TabsTrigger>
          <TabsTrigger value="file">Audio File Translation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Text Translation</CardTitle>
              <CardDescription>
                Translate text between multiple languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Source Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="icon" onClick={handleSwapLanguages}>
                  <ArrowRightLeft className="h-4 w-4" />
                </Button>
                
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Target Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source Text</label>
                  <Textarea
                    placeholder="Enter text to translate..."
                    className="min-h-[200px]"
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Translated Text</label>
                  <Textarea
                    placeholder="Translation will appear here..."
                    className="min-h-[200px]"
                    value={translatedText}
                    readOnly
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleTranslate} 
                disabled={!sourceText.trim() || isTranslating}
                className="w-full"
              >
                {isTranslating ? "Translating..." : "Translate"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="voice" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Translation</CardTitle>
              <CardDescription>
                Record your voice and translate it to another language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Source Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Target Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
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
                      ? "Speak clearly and I'll translate your voice"
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
                    Translate
                  </Button>
                </div>
              </div>
              
              {translatedText && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Translation Result:</h4>
                  <p>{translatedText}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Play Translation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="file" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Audio File Translation</CardTitle>
              <CardDescription>
                Upload an audio file and translate it to another language
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Select value={sourceLang} onValueChange={setSourceLang}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Source Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                
                <Select value={targetLang} onValueChange={setTargetLang}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Target Language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="border-2 border-dashed rounded-lg p-10 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Audio File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop an audio file or click to browse
                </p>
                <input
                  type="file"
                  id="audio-file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="audio-file">
                  <Button variant="outline" className="mx-auto">
                    Select File
                  </Button>
                </label>
                {audioFile && (
                  <p className="mt-4 text-sm">
                    Selected file: {audioFile.name}
                  </p>
                )}
              </div>
              
              <Button 
                disabled={!audioFile} 
                className="w-full"
              >
                Translate Audio
              </Button>
              
              {translatedText && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Translation Result:</h4>
                  <p>{translatedText}</p>
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Play Translation
                    </Button>
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

function mockTranslate(text: string, sourceLang: string, targetLang: string): string {
  // This is a simple mock translation function
  // In a real app, this would call the Hugging Face API
  
  const mockTranslations: Record<string, Record<string, string>> = {
    en: {
      es: "Este es un texto traducido al español.",
      fr: "Voici un texte traduit en français.",
      de: "Dies ist ein ins Deutsche übersetzter Text.",
    },
    es: {
      en: "This is text translated to English.",
      fr: "Voici un texte traduit en français.",
      de: "Dies ist ein ins Deutsche übersetzter Text.",
    },
    fr: {
      en: "This is text translated to English.",
      es: "Este es un texto traducido al español.",
      de: "Dies ist ein ins Deutsche übersetzter Text.",
    },
    de: {
      en: "This is text translated to English.",
      es: "Este es un texto traducido al español.",
      fr: "Voici un texte traduit en français.",
    },
  };
  
  if (mockTranslations[sourceLang]?.[targetLang]) {
    return mockTranslations[sourceLang][targetLang];
  }
  
  return `[Translation from ${sourceLang} to ${targetLang}]: ${text}`;
}