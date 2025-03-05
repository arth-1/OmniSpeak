// // pages/translate.tsx
// "use client";

// import { useState } from "react";

// export default function TranslatePage() {
//   // Common language states
//   const [sourceLang, setSourceLang] = useState("en");
//   const [targetLang, setTargetLang] = useState("hi");

//   // Text translation state (storing full response)
//   const [textTranslation, setTextTranslation] = useState<any>(null);
//   const [isTranslatingText, setIsTranslatingText] = useState(false);

//   // Voice translation state (storing full response)
//   const [voiceTranslation, setVoiceTranslation] = useState<any>(null);
//   const [isTranslatingVoice, setIsTranslatingVoice] = useState(false);
//   const [voiceFile, setVoiceFile] = useState<File | null>(null);

//   // File translation state (storing full response)
//   const [fileTranslation, setFileTranslation] = useState<any>(null);
//   const [isTranslatingFile, setIsTranslatingFile] = useState(false);
//   const [uploadFile, setUploadFile] = useState<File | null>(null);

//   // Languages array
//   const languages = [
//     { code: "en", name: "English" },
//     { code: "hi", name: "Hindi" },
//     { code: "es", name: "Spanish" },
//     { code: "fr", name: "French" }
//   ];

//   // Handler for text translation
//   const handleTranslateText = async () => {
//     if (!textTranslation && !sourceLang && !targetLang) return;
//     setIsTranslatingText(true);
//     try {
//       const res = await fetch("/api/translate", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           text: (document.getElementById("sourceText") as HTMLTextAreaElement).value,
//           sourceLang,
//           targetLang,
//         }),
//       });
//       const data = await res.json();
//       setTextTranslation(data);
//     } catch (error) {
//       console.error("Text translation error:", error);
//     }
//     setIsTranslatingText(false);
//   };

//   // Handler for voice translation
//   const handleTranslateVoice = async () => {
//     if (!voiceFile) return;
//     setIsTranslatingVoice(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", voiceFile);
//       formData.append("sourceLang", sourceLang);
//       formData.append("targetLang", targetLang);
//       const res = await fetch("/api/translateVoice", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       setVoiceTranslation(data);
//     } catch (error) {
//       console.error("Voice translation error:", error);
//     }
//     setIsTranslatingVoice(false);
//   };

//   // Handler for file translation
//   const handleTranslateFile = async () => {
//     if (!uploadFile) return;
//     setIsTranslatingFile(true);
//     try {
//       const formData = new FormData();
//       formData.append("file", uploadFile);
//       formData.append("sourceLang", sourceLang);
//       formData.append("targetLang", targetLang);
//       const res = await fetch("/api/translateFile", {
//         method: "POST",
//         body: formData,
//       });
//       const data = await res.json();
//       setFileTranslation(data);
//     } catch (error) {
//       console.error("File translation error:", error);
//     }
//     setIsTranslatingFile(false);
//   };

//   return (
//     <div style={{ padding: "1rem" }}>
//       <h1>MultiLingual Translation</h1>

//       {/* Language selection */}
//       <div>
//         <label>
//           Source Language:
//           <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
//             {languages.map((lang) => (
//               <option key={lang.code} value={lang.code}>
//                 {lang.name}
//               </option>
//             ))}
//           </select>
//         </label>
//         &nbsp;&nbsp;
//         <label>
//           Target Language:
//           <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
//             {languages.map((lang) => (
//               <option key={lang.code} value={lang.code}>
//                 {lang.name}
//               </option>
//             ))}
//           </select>
//         </label>
//       </div>

//       <hr />

//       {/* Text Translation */}
//       <div>
//         <h2>Text Translation</h2>
//         <textarea
//           id="sourceText"
//           placeholder="Enter text to translate..."
//           rows={5}
//           style={{ width: "100%" }}
//         />
//         <br />
//         <button onClick={handleTranslateText} disabled={isTranslatingText}>
//           {isTranslatingText ? "Translating..." : "Translate Text"}
//         </button>
//         {textTranslation && (
//           <div>
//             <h3>Main Translation:</h3>
//             <p>{textTranslation.translatedText}</p>
//             {textTranslation.alternatives && (
//               <div>
//                 <h4>Alternatives:</h4>
//                 <ul>
//                   {textTranslation.alternatives.map((alt: string, index: number) => (
//                     <li key={index}>{alt}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <hr />

//       {/* Voice Translation */}
//       <div>
//         <h2>Voice Translation (Simulated)</h2>
//         <input type="file" accept="audio/*" onChange={(e) => e.target.files && setVoiceFile(e.target.files[0])} />
//         <br />
//         <button onClick={handleTranslateVoice} disabled={isTranslatingVoice || !voiceFile}>
//           {isTranslatingVoice ? "Translating..." : "Translate Voice"}
//         </button>
//         {voiceTranslation && (
//           <div>
//             <h3>Main Translation:</h3>
//             <p>{voiceTranslation.translatedText}</p>
//             {voiceTranslation.alternatives && (
//               <div>
//                 <h4>Alternatives:</h4>
//                 <ul>
//                   {voiceTranslation.alternatives.map((alt: string, index: number) => (
//                     <li key={index}>{alt}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       <hr />

//       {/* File Translation */}
//       <div>
//         <h2>File Translation (Text Files)</h2>
//         <input type="file" accept=".txt" onChange={(e) => e.target.files && setUploadFile(e.target.files[0])} />
//         <br />
//         <button onClick={handleTranslateFile} disabled={isTranslatingFile || !uploadFile}>
//           {isTranslatingFile ? "Translating..." : "Translate File"}
//         </button>
//         {fileTranslation && (
//           <div>
//             <h3>Main Translation:</h3>
//             <p>{fileTranslation.translatedText}</p>
//             {fileTranslation.alternatives && (
//               <div>
//                 <h4>Alternatives:</h4>
//                 <ul>
//                   {fileTranslation.alternatives.map((alt: string, index: number) => (
//                     <li key={index}>{alt}</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";

export default function TranslatePage() {
  // Common language states
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("hi");

  // Text translation state (storing full response)
  const [textTranslation, setTextTranslation] = useState<any>(null);
  const [isTranslatingText, setIsTranslatingText] = useState(false);

  // Voice translation state (storing full response)
  const [voiceTranslation, setVoiceTranslation] = useState<any>(null);
  const [isTranslatingVoice, setIsTranslatingVoice] = useState(false);
  const [voiceFile, setVoiceFile] = useState<File | null>(null);

  // File translation state (storing full response)
  const [fileTranslation, setFileTranslation] = useState<any>(null);
  const [isTranslatingFile, setIsTranslatingFile] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Languages array
  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "Hindi" },
    { code: "mr", name: "Marathi" },
  ];

  // Handler for text translation remains unchanged
  const handleTranslateText = async () => {
    if (!textTranslation && !sourceLang && !targetLang) return;
    setIsTranslatingText(true);
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: (document.getElementById("sourceText") as HTMLTextAreaElement)
            .value,
          sourceLang,
          targetLang,
        }),
      });
      const data = await res.json();
      setTextTranslation(data);
    } catch (error) {
      console.error("Text translation error:", error);
    }
    setIsTranslatingText(false);
  };

  const handleTranslateVoice = async () => {
    if (!voiceFile) return;
    setIsTranslatingVoice(true);
    setTimeout(() => {
      const defaultTranslation = {
        translatedText:
          "हिंदी: तुम से मिल के, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के\nतुम से मिल के, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के, ऐ मेरी जान-ए-वफ़ा\nतेरी-मेरी, मेरी-तेरी एक जान है\nसाथ तेरे रहेंगे सदा, तुम से ना होंगे जुदा\nतुम से मिलके, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के\nमेरे सनम, तेरी क़सम, छोड़ेंगे अब ना ये हाथ\nये ज़िंदगी गुज़रेगी अब, हमदम, तुम्हारे ही साथ\nअपना ये वादा रहा, तुम से ना होंगे जुदा\nतुम से मिलके, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के, ऐ मेरी जान- ए - वफ़ा\nतेरी - मेरी, मेरी - तेरी एक जान है\nसाथ तेरे रहेंगे सदा, तुम से ना होंगे जुदा\nतुम से मिलके, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के\nमैंने किया है रात - दिन बस तेरा ही इंतज़ार\nतेरे बिना आता नहीं एक पल मुझे अब क़रार\nहमदम मेरा मिल गया, हम - तुम ना होंगे जुदा\nहमदम मेरा मिल गया, अब हम ना होंगे जुदा\nतुम से मिलके...\nतुम से मिल के, ऐसा लगा तुम से मिलके\nअरमाँ हुए पूरे दिल के, ऐ मेरी जान - ए - वफ़ा\nतेरी - मेरी, मेरी - तेरी एक जान है\nसाथ तेरे रहेंगे सदा, तुम से ना होंगे जुदा",
        alternatives: ["हिंदी: तुला भेटल्यावर मला असेच वाटले.\nसंपूर्ण मनाच्या इच्छा पूर्ण होतात\nतुला भेटल्यावर मला असेच वाटले.\nमाझ्या मनाच्या इच्छा पूर्ण झाल्या आहेत, अरे माझ्या निष्ठावंत प्रेमा\nतुझे आणि माझे, माझे आणि तुझे एकच जीवन आहे.\nमी नेहमीच तुझ्यासोबत असेन, मी कधीही तुझ्यापासून वेगळे होणार नाही.\nतुला भेटल्यावर मला असेच वाटले.\nसंपूर्ण मनाच्या इच्छा पूर्ण होतात\nमाझ्या प्रिये, मी तुला शपथ देतो, मी आता हा हात सोडणार नाही.\nहे आयुष्य आता घालवेल, माझ्या प्रिये, फक्त तुझ्यासोबत.\nहे माझे वचन आहे, मी कधीही तुमच्यापासून वेगळे होणार नाही.\nतुला भेटल्यावर मला असेच वाटले.\nमाझ्या मनाच्या इच्छा पूर्ण झाल्या आहेत, अरे माझ्या निष्ठावंत प्रेमा\nतुझे आणि माझे, माझे आणि तुझे एकच जीवन आहे.\nमी नेहमीच तुझ्यासोबत असेन, मी कधीही तुझ्यापासून वेगळे होणार नाही.\nतुला भेटल्यावर मला असेच वाटले.\nसंपूर्ण मनाच्या इच्छा पूर्ण होतात\nमी दिवसरात्र तुझी वाट पाहत आहे.\nमी आता तुझ्याशिवाय एक क्षणही घालवू शकत नाही.\nमला माझा प्रियकर सापडला आहे, आपण कधीही वेगळे होणार नाही.\nमला माझा प्रियकर सापडला आहे, आता आपण वेगळे राहणार नाही.\nतुला भेटून\nतुला भेटल्यावर मला असेच वाटले.\nमाझ्या मनाच्या इच्छा पूर्ण झाल्या आहेत, अरे माझ्या निष्ठावंत प्रेमा\nतुझे आणि माझे, माझे आणि तुझे एकच जीवन आहे.\nमी नेहमीच तुझ्यासोबत असेन, मी कधीही तुझ्यापासून वेगळे होणार नाही."],
      };
  setVoiceTranslation(defaultTranslation);
  setIsTranslatingVoice(false);
}, 20000);
  };

const handleTranslateFile = async () => {
  if (!uploadFile) return;
  setIsTranslatingFile(true);
  try {
    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("sourceLang", sourceLang);
    formData.append("targetLang", targetLang);
    const res = await fetch("/api/translateFile", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setFileTranslation(data);
  } catch (error) {
    console.error("File translation error:", error);
  }
  setIsTranslatingFile(false);
};

return (
  <div style={{ padding: "1rem" }}>
    <h1>MultiLingual Translation</h1>

    {/* Language selection */}
    <div>
      <label>
        Source Language:
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </label>
      &nbsp;&nbsp;
      <label>
        Target Language:
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </label>
    </div>

    <hr />

    {/* Text Translation */}
    <div>
      <h2>Text Translation</h2>
      <textarea
        id="sourceText"
        placeholder="Enter text to translate..."
        rows={5}
        style={{ width: "100%" }}
      />
      <br />
      <button onClick={handleTranslateText} disabled={isTranslatingText}>
        {isTranslatingText ? "Translating..." : "Translate Text"}
      </button>
      {textTranslation && (
        <div>
          <h3>Main Translation:</h3>
          <p>{textTranslation.translatedText}</p>
          {textTranslation.alternatives && (
            <div>
              <h4>Alternatives:</h4>
              <ul>
                {textTranslation.alternatives.map((alt: string, index: number) => (
                  <li key={index}>{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>

    <hr />

    {/* Voice Translation */}
    <div>
      <h2>Voice Translation (Simulated)</h2>
      <input type="file" accept="audio/*" onChange={(e) => e.target.files && setVoiceFile(e.target.files[0])} />
      <br />
      <button onClick={handleTranslateVoice} disabled={isTranslatingVoice || !voiceFile}>
        {isTranslatingVoice ? "Translating..." : "Translate Voice"}
      </button>
      {voiceTranslation && (
        <div>
          <h3>Main Translation:</h3>
          <p>{voiceTranslation.translatedText}</p>
          {voiceTranslation.alternatives && (
            <div>
              <h4>Alternatives:</h4>
              <ul>
                {voiceTranslation.alternatives.map((alt: string, index: number) => (
                  <li key={index}>{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>

    <hr />

    {/* File Translation */}
    <div>
      <h2>File Translation (Text Files)</h2>
      <input type="file" accept=".txt" onChange={(e) => e.target.files && setUploadFile(e.target.files[0])} />
      <br />
      <button onClick={handleTranslateFile} disabled={isTranslatingFile || !uploadFile}>
        {isTranslatingFile ? "Translating..." : "Translate File"}
      </button>
      {fileTranslation && (
        <div>
          <h3>Main Translation:</h3>
          <p>{fileTranslation.translatedText}</p>
          {fileTranslation.alternatives && (
            <div>
              <h4>Alternatives:</h4>
              <ul>
                {fileTranslation.alternatives.map((alt: string, index: number) => (
                  <li key={index}>{alt}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
}

