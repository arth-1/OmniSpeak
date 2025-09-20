"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  PlusCircle,
  MessageCircle,
  FileText,
  Mic,
  Languages,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TranslateApp() {
  // Common language states
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");
  const [activeTab, setActiveTab] = useState("text");

  // Text translation state
  const [sourceText, setSourceText] = useState("");
  const [textTranslation, setTextTranslation] = useState<any>(null);
  const [isTranslatingText, setIsTranslatingText] = useState(false);

  // Voice translation state (simulated)
  const [voiceTranslation, setVoiceTranslation] = useState<any>(null);
  const [isTranslatingVoice, setIsTranslatingVoice] = useState(false);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);

  // File translation state
  const [fileTranslation, setFileTranslation] = useState<any>(null);
  const [isTranslatingFile, setIsTranslatingFile] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Languages array
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "mr", name: "Marathi" },
  ];

  // Handler for text translation
  const handleTranslateText = async () => {
    if (!sourceText.trim()) return;
    setIsTranslatingText(true);
    setTextTranslation(null);

    // Simulate API call
    setTimeout(() => {
      const dummyTranslation = {
        translatedText: "This is a dummy translation.",
        alternatives: ["Alternative 1", "Alternative 2"],
      };
      setTextTranslation(dummyTranslation);
      setIsTranslatingText(false);
    }, 1500);
  };

  // Handler for voice translation (simulated)
  const handleTranslateVoice = async () => {
    if (!voiceFile) return;
    setIsTranslatingVoice(true);
    setVoiceTranslation(null);

    setTimeout(() => {
      const defaultTranslation = {
        translatedText:
          "हिंदी: तुम से मिल के, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के\nतुम से मिल के, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के, ऐ मेरी जान-ए-वफ़ा\nतेरी-मेरी, मेरी-तेरी एक जान है\nसाथ तेरे रहेंगे सदा, तुम से ना होंगे जुदा\nतुम से मिलके, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के\nमेरे सनम, तेरी क़सम, छोड़ेंगे अब ना ये हाथ\nये ज़िंदगी गुज़रेगी अब, हमदम, तुम्हारे ही साथ\nअपना ये वादा रहा, तुम से ना होंगे जुदा\nतुम से मिलके, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के, ऐ मेरी जान- ए - वफ़ा\nतेरी - मेरी, मेरी - तेरी एक जान है\nसाथ तेरे रहेंगे सदा, तुम से ना होंगे जुदा\nतुम से मिलके, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के\nमैंने किया है रात - दिन बस तेरा ही इंतज़ार\nतेरे बिना आता नहीं एक पल मुझे अब क़रार\nहमदम मेरा मिल गया, हम - तुम ना होंगे जुदा\nहमदम मेरा मिल गया, अब हम ना होंगे जुदा\nतुम से मिलके...\nतुम से मिल के, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के, ऐ मेरी जान - ए - वफ़ा\nतेरी - मेरी, मेरी - तेरी एक जान है\nसाथ तेरे रहेंगे सदा, तुम से ना होंगे जुदा",
        alternatives: [
          "हिंदी: तुला भेटल्यावर मला असेच वाटले.\nसंपूर्ण मनाच्या इच्छा पूर्ण होतात",
          "Alternative translation 2 for voice",
        ],
      };
      setVoiceTranslation(defaultTranslation);
      setIsTranslatingVoice(false);
    }, 2000);
  };

  // Handler for file translation
  const handleTranslateFile = async () => {
    if (!uploadFile) return;
    setIsTranslatingFile(true);
    setFileTranslation(null);

    // Simulate file reading and translation
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      const dummyFileTranslation = {
        translatedText: `Translated content of the file: "${fileContent.slice(0, 50)}..."`,
        alternatives: ["File alternative 1", "File alternative 2"],
      };
      setFileTranslation(dummyFileTranslation);
      setIsTranslatingFile(false);
    };
    reader.readAsText(uploadFile);
  };

  return (
    <div className="space-y-6 container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-7xl bg-slate-900 text-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Multi-Lingual Translator
          </h2>
          <CardDescription className="text-gray-400">
            Easily translate text, voice, or entire files.
          </CardDescription>
        </div>
      </div>

      {/* Language Selection */}
      <Card className="p-6 bg-slate-800 border-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Source Language:</span>
            <select
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-white border-gray-600"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-800">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <Languages className="h-6 w-6 text-teal-500" />
          <div className="flex items-center gap-2">
            <span className="text-gray-300">Target Language:</span>
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full p-2 rounded bg-slate-700 text-white border-gray-600"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-800">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Tabs for different translation types */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-3 h-auto bg-slate-800 border border-gray-700">
          <TabsTrigger
            value="text"
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" /> Text
          </TabsTrigger>
          <TabsTrigger
            value="voice"
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
          >
            <Mic className="h-4 w-4 mr-2" /> Voice
          </TabsTrigger>
          <TabsTrigger
            value="file"
            className="data-[state=active]:bg-teal-500 data-[state=active]:text-white"
          >
            <FileText className="h-4 w-4 mr-2" /> File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="mt-6">
          <Card className="bg-slate-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Text Translation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                rows={5}
                className="bg-slate-700 text-white border-gray-600 placeholder:text-gray-500"
              />
              <Button
                onClick={handleTranslateText}
                disabled={isTranslatingText}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isTranslatingText ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...
                  </>
                ) : (
                  "Translate Text"
                )}
              </Button>
              {textTranslation && (
                <div className="space-y-4">
                  <h3 className="text-gray-300 font-semibold">Main Translation:</h3>
                  <div className="p-4 rounded-md bg-slate-700 border-gray-600">
                    <p>{textTranslation.translatedText}</p>
                  </div>
                  {textTranslation.alternatives && (
                    <div className="mt-4">
                      <h4 className="text-gray-400 text-sm">Alternatives:</h4>
                      <ul className="list-disc list-inside text-gray-400">
                        {textTranslation.alternatives.map((alt: string, index: number) => (
                          <li key={index}>{alt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="mt-6">
          <Card className="bg-slate-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Voice Translation (Simulated)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept="audio/*"
                onChange={(e) => e.target.files && setVoiceFile(e.target.files[0])}
                className="bg-slate-700 text-white border-gray-600 file:bg-teal-500 file:text-white file:font-semibold hover:file:bg-teal-600"
              />
              <Button
                onClick={handleTranslateVoice}
                disabled={isTranslatingVoice || !voiceFile}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isTranslatingVoice ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...
                  </>
                ) : (
                  "Translate Voice"
                )}
              </Button>
              {voiceTranslation && (
                <div className="space-y-4">
                  <h3 className="text-gray-300 font-semibold">Main Translation:</h3>
                  <div className="p-4 rounded-md bg-slate-700 border-gray-600 whitespace-pre-line">
                    <p>{voiceTranslation.translatedText}</p>
                  </div>
                  {voiceTranslation.alternatives && (
                    <div className="mt-4">
                      <h4 className="text-gray-400 text-sm">Alternatives:</h4>
                      <ul className="list-disc list-inside text-gray-400">
                        {voiceTranslation.alternatives.map((alt: string, index: number) => (
                          <li key={index}>{alt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file" className="mt-6">
          <Card className="bg-slate-800 border-gray-700 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">File Translation (Text Files)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="file"
                accept=".txt"
                onChange={(e) => e.target.files && setUploadFile(e.target.files[0])}
                className="bg-slate-700 text-white border-gray-600 file:bg-teal-500 file:text-white file:font-semibold hover:file:bg-teal-600"
              />
              <Button
                onClick={handleTranslateFile}
                disabled={isTranslatingFile || !uploadFile}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
              >
                {isTranslatingFile ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Translating...
                  </>
                ) : (
                  "Translate File"
                )}
              </Button>
              {fileTranslation && (
                <div className="space-y-4">
                  <h3 className="text-gray-300 font-semibold">Main Translation:</h3>
                  <div className="p-4 rounded-md bg-slate-700 border-gray-600">
                    <p>{fileTranslation.translatedText}</p>
                  </div>
                  {fileTranslation.alternatives && (
                    <div className="mt-4">
                      <h4 className="text-gray-400 text-sm">Alternatives:</h4>
                      <ul className="list-disc list-inside text-gray-400">
                        {fileTranslation.alternatives.map((alt: string, index: number) => (
                          <li key={index}>{alt}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}