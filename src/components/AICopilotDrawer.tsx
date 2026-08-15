import React, { useState, useRef, useEffect } from "react";
import { sound } from "../utils/audio";
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  MapPin, 
  Search as SearchIcon, 
  Brain, 
  Mic, 
  MicOff, 
  Volume2, 
  FileText, 
  Upload, 
  ExternalLink,
  Cpu,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { auth, db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCascadeForSupplier: (supplierId: string) => void;
}

interface ChatMessage {
  id?: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  modelUsed?: string;
  sources?: { title: string; url: string }[];
  isThinking?: boolean;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onRunCascadeForSupplier
}) => {
  // Chat History & Model Selection
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Greetings. I am the TrustGraph Multi-Model Intelligence Copilot. I can query live supply chains, search real-time market data with Google Search Grounding, verify facility locations via Google Maps Grounding, inspect scanned supplier invoices, and engage in high-thinking root cause analysis.",
      timestamp: "Just now",
      modelUsed: "gemini-3.5-flash"
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModel, setActiveModel] = useState<"gemini-3.5-flash" | "gemini-3.1-pro-preview" | "gemini-3.1-flash-lite">("gemini-3.5-flash");
  
  // Grounding Toggles
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(false);
  const [useMapsGrounding, setUseMapsGrounding] = useState<boolean>(false);
  
  // High Thinking Mode State
  const [isHighThinkingMode, setIsHighThinkingMode] = useState<boolean>(false);
  const [thinkingOutput, setThinkingOutput] = useState<any | null>(null);

  // Document / Image Scanner State
  const [isDocumentScannerOpen, setIsDocumentScannerOpen] = useState<boolean>(false);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [imageAnalysisResult, setImageAnalysisResult] = useState<any | null>(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live Audio / Voice Assistant State
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceSpeechResult, setVoiceSpeechResult] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    "Which suppliers present critical contagion risks right now?",
    "Use Google Search to check global copper & semiconductor supply alerts",
    "Verify Mehta Semiconductors fabrication location in Bengaluru via Maps",
    "Run high-thinking systemic contagion simulation for Verma PharmaTech"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinkingOutput]);

  if (!isOpen) return null;

  // Multi-turn Gemini Chat Call with History & Grounding
  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim() || isGenerating) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputPrompt("");
    setIsGenerating(true);

    try {
      if (isHighThinkingMode) {
        // Route to High-Thinking Reasoning Engine (gemini-3.1-pro-preview with thinkingLevel: HIGH)
        const res = await fetch("/api/ai/high-thinking-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query })
        });
        const data = await res.json();
        sound.playAISuccess();
        setThinkingOutput(data);

        const aiMsg: ChatMessage = {
          sender: "ai",
          text: `[High-Thinking Engine]: ${data.deepReasoningSummary}\n\nKey Vulnerabilities Identified:\n${(data.systemicVulnerabilities || []).map((v: string) => `• ${v}`).join("\n")}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: "gemini-3.1-pro-preview (Thinking: HIGH)",
          isThinking: true
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        // Route to Multi-turn Copilot (with optional Search and Maps Grounding)
        const res = await fetch("/api/ai/copilot-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: query,
            history: newHistory.map(m => ({ role: m.sender, content: m.text })),
            modelChoice: activeModel,
            useSearch: useSearchGrounding,
            useMaps: useMapsGrounding
          })
        });
        const data = await res.json();
        sound.playAISuccess();

        const aiMsg: ChatMessage = {
          sender: "ai",
          text: data.reply || "Analysis complete.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: data.modelUsed || activeModel,
          sources: data.sources || []
        };
        setMessages(prev => [...prev, aiMsg]);

        // Save conversation turn to Firestore if available
        try {
          if (auth.currentUser) {
            await addDoc(collection(db, "chat_messages"), {
              userId: auth.currentUser.uid,
              role: "user",
              content: query,
              timestamp: new Date().toISOString()
            });
            await addDoc(collection(db, "chat_messages"), {
              userId: auth.currentUser.uid,
              role: "model",
              content: data.reply,
              model: data.modelUsed,
              timestamp: new Date().toISOString(),
              groundingSources: data.sources || []
            });
          }
        } catch (e) {
          // Non-blocking firestore persistence
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "System telemetry error: Unable to contact neural model. Please retry.",
          timestamp: "Now"
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Image Upload and Document Understanding (gemini-3.1-pro-preview)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setScannedImage(base64);
      setIsAnalyzingImage(true);
      sound.playClick();

      try {
        const res = await fetch("/api/ai/analyze-document-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64,
            mimeType: file.type || "image/jpeg",
            documentType: file.name
          })
        });
        const data = await res.json();
        setImageAnalysisResult(data);
        sound.playAISuccess();

        // Append to chat stream
        setMessages(prev => [
          ...prev,
          {
            sender: "ai",
            text: `📄 [Document Scan Verified]: Extracted data for ${data.supplierDetected || "Scanned Entity"} (${data.documentType}). Compliance Status: ${data.complianceStatus}. Operational Insight: ${data.operationalInsight}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            modelUsed: "gemini-3.1-pro-preview (Vision)"
          }
        ]);
      } catch (err) {
        console.error("Document analysis error:", err);
      } finally {
        setIsAnalyzingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Live Voice Assistant Simulation & Web Speech API Integration
  const handleToggleVoice = () => {
    sound.playClick();
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      // Fallback voice test
      const sampleQueries = [
        "What is the average trust rating across our tier 1 suppliers?",
        "Simulate contagion shockwave for Verma Pharma",
        "Check search grounding for semiconductor import tariffs"
      ];
      const randomQ = sampleQueries[Math.floor(Math.random() * sampleQueries.length)];
      handleVoiceTurn(randomQ);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleVoiceTurn(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleVoiceTurn = async (transcript: string) => {
    sound.playClick();
    try {
      const res = await fetch("/api/ai/live-voice-turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceTranscript: transcript })
      });
      const data = await res.json();
      setVoiceSpeechResult(data.spokenResponse);
      sound.playAISuccess();

      // Read aloud using SpeechSynthesis if available
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(data.spokenResponse);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }

      setMessages(prev => [
        ...prev,
        {
          sender: "user",
          text: `🎙️ Voice Command: "${transcript}"`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        },
        {
          sender: "ai",
          text: data.spokenResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          modelUsed: "gemini-3.1-flash-live-preview (Voice)"
        }
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      id="ai-copilot-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-white/85 dark:bg-[#07070B]/85 backdrop-blur-2xl border-l border-slate-200/80 dark:border-white/10 shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300 font-sans text-slate-900 dark:text-slate-100"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/15 dark:bg-cyan-400/20 border border-sky-500/30 dark:border-cyan-400/40 text-sky-600 dark:text-cyan-300 shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase text-sky-600 dark:text-cyan-400 tracking-wider font-bold">
                Multi-Model Neural Intelligence
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-display">
              TrustGraph AI Copilot
            </h2>
          </div>
        </div>

        <button
          id="close-copilot-drawer-btn"
          onClick={() => { sound.playClick(); onClose(); }}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Model Selector & Grounding Controls Bar */}
      <div className="shrink-0 py-3 border-b border-slate-200/80 dark:border-white/10 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Model Choice Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono">
            <button
              onClick={() => { sound.playClick(); setActiveModel("gemini-3.5-flash"); setIsHighThinkingMode(false); }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeModel === "gemini-3.5-flash" && !isHighThinkingMode
                  ? "bg-sky-500 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold shadow-md shadow-sky-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              3.5 Flash (General)
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveModel("gemini-3.1-pro-preview"); setIsHighThinkingMode(false); }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeModel === "gemini-3.1-pro-preview" && !isHighThinkingMode
                  ? "bg-sky-500 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold shadow-md shadow-sky-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              3.1 Pro (Complex)
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveModel("gemini-3.1-flash-lite"); setIsHighThinkingMode(false); }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeModel === "gemini-3.1-flash-lite" && !isHighThinkingMode
                  ? "bg-sky-500 dark:bg-cyan-400 text-white dark:text-slate-950 font-bold shadow-md shadow-sky-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              3.1 Lite (Fast)
            </button>
          </div>

          {/* High Thinking Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              setIsHighThinkingMode(!isHighThinkingMode);
              if (!isHighThinkingMode) setActiveModel("gemini-3.1-pro-preview");
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              isHighThinkingMode
                ? "bg-purple-500/20 border-purple-500/50 text-purple-700 dark:text-purple-300 shadow-md shadow-purple-500/20 font-bold"
                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:border-purple-400/40"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-purple-500" />
            <span>High Thinking</span>
          </button>
        </div>

        {/* Grounding & Vision Toggles */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Google Search Grounding */}
          <button
            onClick={() => { sound.playClick(); setUseSearchGrounding(!useSearchGrounding); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
              useSearchGrounding
                ? "bg-blue-500/20 border-blue-400 text-blue-700 dark:text-blue-300 font-semibold"
                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <SearchIcon className="w-3 h-3 text-blue-500" />
            <span>Google Search</span>
          </button>

          {/* Google Maps Grounding */}
          <button
            onClick={() => { sound.playClick(); setUseMapsGrounding(!useMapsGrounding); }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
              useMapsGrounding
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-700 dark:text-emerald-300 font-semibold"
                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300"
            }`}
          >
            <MapPin className="w-3 h-3 text-emerald-500" />
            <span>Google Maps</span>
          </button>

          {/* Document Scanner Trigger */}
          <button
            onClick={() => { sound.playClick(); fileInputRef.current?.click(); }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-amber-600 dark:text-amber-300 hover:border-amber-400/40 transition-all cursor-pointer ml-auto"
          >
            <FileText className="w-3 h-3 text-amber-500" />
            <span>Scan Doc</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Live Voice API Button */}
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all cursor-pointer ${
              isListening
                ? "bg-red-500/20 border-red-500 text-red-600 dark:text-red-300 animate-pulse font-bold"
                : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-cyan-700 dark:text-cyan-300 hover:border-cyan-400/40"
            }`}
          >
            {isListening ? <MicOff className="w-3 h-3 text-red-500" /> : <Mic className="w-3 h-3 text-cyan-500" />}
            <span>{isListening ? "Listening..." : "Live Voice API"}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto my-3 space-y-4 pr-1">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs leading-relaxed ${
              m.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {m.sender === "ai" && (
              <div className="w-7 h-7 rounded-xl bg-sky-500/10 dark:bg-cyan-950/80 border border-sky-500/30 dark:border-[#38BDF8]/30 flex items-center justify-center shrink-0 text-sky-600 dark:text-[#38BDF8] mt-1 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <div
              className={`p-4 rounded-2xl max-w-[85%] backdrop-blur-md shadow-sm ${
                m.sender === "user"
                  ? "bg-sky-500 text-white rounded-br-none shadow-sky-500/20"
                  : "bg-slate-100/90 dark:bg-white/[0.06] border border-slate-200/80 dark:border-white/10 text-slate-800 dark:text-slate-100 rounded-bl-none"
              }`}
            >
              {/* Model Attribution Badge */}
              {m.modelUsed && (
                <div className={`flex items-center gap-1.5 mb-1.5 text-[9px] font-mono uppercase tracking-wider ${
                  m.sender === "user" ? "text-sky-100" : "text-sky-600 dark:text-cyan-400 font-bold"
                }`}>
                  <Cpu className="w-2.5 h-2.5" />
                  <span>Model: {m.modelUsed}</span>
                </div>
              )}

              <div className="whitespace-pre-wrap">{m.text}</div>

              {/* Grounding Source Links if present */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-white/10 space-y-1">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Grounding Sources ({m.sources.length}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.sources.map((s, sIdx) => (
                      <a
                        key={sIdx}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-[10px] font-mono text-sky-600 dark:text-cyan-300 hover:underline shadow-xs"
                      >
                        <span>{s.title}</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className={`mt-1.5 text-[9px] font-mono text-right ${
                m.sender === "user" ? "text-sky-200" : "text-slate-400 dark:text-slate-500"
              }`}>
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 p-3 text-xs text-sky-600 dark:text-cyan-400 font-mono animate-pulse">
            <Sparkles className="w-4 h-4" />
            <span>Formulating {isHighThinkingMode ? "High-Thinking Deep Reasoner" : "Gemini"} response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="shrink-0 space-y-2 pt-2 border-t border-slate-200/80 dark:border-white/10">
        <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
          Suggested Multi-Modal Prompts
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-sky-500/40 text-[11px] text-slate-700 dark:text-slate-300 text-left transition-colors cursor-pointer shadow-xs"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="mt-3 shrink-0 relative">
        <textarea
          rows={2}
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            isHighThinkingMode
              ? "Ask High-Thinking Reasoner (gemini-3.1-pro-preview)..."
              : useSearchGrounding
              ? "Search grounded query (e.g. latest port strikes or metal prices)..."
              : useMapsGrounding
              ? "Maps query (e.g. factory coordinates in Bengaluru)..."
              : "Ask Copilot about any vendor, delay, or supply shock..."
          }
          className="w-full pl-3.5 pr-12 py-2.5 rounded-2xl bg-slate-100/90 dark:bg-[#0A0A0C] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none font-sans shadow-inner"
        />
        <button
          id="send-copilot-msg-btn"
          disabled={!inputPrompt.trim() || isGenerating}
          onClick={() => handleSendMessage()}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 disabled:opacity-30 cursor-pointer transition-all shadow-md shadow-sky-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
