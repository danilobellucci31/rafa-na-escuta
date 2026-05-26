import React, { useState, useEffect, useRef } from "react";
import { Message, UserProfile } from "../types";
import { ArrowLeft, Mic, Send, Volume2, Square, HelpCircle, AlertCircle } from "lucide-react";

interface ChatScreenProps {
  userProfile: UserProfile;
  initialPrompt?: string;
  onGoBack: () => void;
  fontSizeLarge: boolean;
}

// Browser Web Speech recognition API reference
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

function renderFormattedMessage(content: string) {
  if (!content) return null;
  const lines = content.split("\n");
  return lines.map((line, index) => {
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <div key={index} className="min-h-[1.25rem]">
        {parts.map((part, pIdx) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const boldText = part.slice(2, -2);
            return (
              <strong key={pIdx} className="font-extrabold text-slate-900 border-b border-dotted border-slate-300">
                {boldText}
              </strong>
            );
          }
          return <span key={pIdx}>{part}</span>;
        })}
      </div>
    );
  });
}

export default function ChatScreen({
  userProfile,
  initialPrompt,
  onGoBack,
  fontSizeLarge,
}: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(1.0); // Default to 1.0 (Normal) for general playback
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);



  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const initializedWelcomeRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Suggested helpers for seniors
  const SUGGESTED_QUESTIONS = [
    "Dica para dormir bem hoje",
    "Alongamento simples para pernas",
    "Quantos copos de água tomar?",
    "Exercício simples de memória",
  ];

  // Initialize Speech Recognition on mount if available
  useEffect(() => {
    if (initializedWelcomeRef.current) return;
    initializedWelcomeRef.current = true;

    if (SpeechRecognition) {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.lang = "pt-BR";
        rec.interimResults = false;

        rec.onstart = () => {
          setIsListening(true);
          setErrorMessage(null);
        };

        rec.onresult = (event: any) => {
          const resultText = event.results[0][0].transcript;
          setInputText(resultText);
        };

        rec.onerror = (event: any) => {
          console.error("Erro no reconhecimento de voz:", event.error);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setErrorMessage("Permissão de microfone negada. Ative as permissões ou digite sua pergunta.");
          } else {
            setErrorMessage("Não consegui ouvir bem. Pode digitar ou falar de novo?");
          }
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      } catch (err) {
        console.error("Web Speech API error initialization:", err);
      }
    }

    // Add initial greeting (simplified per user request)
    const initialWelcomeId = "init-welcome-" + Date.now();
    const welcomeContent = "O que você quer me perguntar";

    setMessages([
      {
        id: initialWelcomeId,
        sender: "rafa",
        content: welcomeContent,
        timestamp: new Date()
      }
    ]);

    // Automatically prefill initial prompt into text input instead of instantly submitting it
    if (initialPrompt) {
      setInputText(initialPrompt);
    }

    // Cleanup speaking on exit
    return () => {
      if (audioSourceRef.current) {
        try {
          audioSourceRef.current.stop();
        } catch (e) {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Scroll to bottom every time messages increase
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleStopSpeech = () => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      audioSourceRef.current = null;
    }
    setCurrentlySpeakingId(null);
  };

  // Mic capture trigger
  const handleVoiceCaptureToggle = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      handleStopSpeech();
      if (recognitionRef.current) {
        recognitionRef.current.start();
      } else {
        alert("Seu aparelho ou navegador não suporta captura de voz por microfone. Você pode digitar sua pergunta de forma simples!");
      }
    }
  };

  // Speaks response using Gemini Flash TTS API on the server (pt-BR with voice 'Puck')
  const handleHearResponse = async (text: string, messageId: string) => {
    if (currentlySpeakingId === messageId) {
      handleStopSpeech();
      return;
    }

    // Cancel previous vocalizations
    handleStopSpeech();
    setCurrentlySpeakingId(messageId);
    setIsGeneratingAudio(true);

    try {
      const response = await fetch("/api/gemini/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Falha na requisição de voz.");
      }

      const data = await response.json();
      if (!data.audio) {
        throw new Error("Nenhum dado de áudio recebido.");
      }

      // Play the raw 24kHz PC-M 16bit base64 data returned by Gemini
      const binaryString = window.atob(data.audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const int16Array = new Int16Array(bytes.buffer);

      // Setup audio context
      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const audioCtx = audioCtxRef.current;
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      const audioBuffer = audioCtx.createBuffer(1, int16Array.length, 24000);
      const channelData = audioBuffer.getChannelData(0);

      // Normalize samples from 16-bit signed to float range [-1.0, 1.0]
      for (let i = 0; i < int16Array.length; i++) {
        channelData[i] = int16Array[i] / 32768.0;
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = speechRate; // Apply dynamic voice speed rates
      source.connect(audioCtx.destination);

      source.onended = () => {
        setCurrentlySpeakingId((currentId) => {
          if (currentId === messageId) {
            return null;
          }
          return currentId;
        });
      };

      audioSourceRef.current = source;
      setIsGeneratingAudio(false);
      source.start(0);

    } catch (err) {
      console.error("Erro ao reproduzir voz via Gemini Flash TTS:", err);
      setIsGeneratingAudio(false);
      setCurrentlySpeakingId(null);
    }
  };

  const handleInitiateSend = (text: string) => {
    if (!text.trim()) return;
    executeSendMessage(text);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      handleInitiateSend(inputText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputText.trim()) {
        handleInitiateSend(inputText);
      }
    }
  };

  const handleSuggestionClick = (q: string) => {
    setInputText(q);
    handleInitiateSend(q + "? Responda de forma simples, Professor Rafa!");
  };

  // Submit trigger
  const executeSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Clear inputs and voice
    setInputText("");
    setErrorMessage(null);
    if (isListening) {
      recognitionRef.current?.stop();
    }

    // Add user message
    const userMessage: Message = {
      id: "msg-user-" + Date.now(),
      sender: "user",
      content: textToSend,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsThinking(true);

    try {
      // API Post payload
      // Send chat history to back-end proxy so Gemini understands the conversational multi-turn state
      // We format for standard role-content array that the backend handles
      const historyPayload = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.content
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyPayload }),
      });

      if (!res.ok) {
        throw new Error("Resposta inválida da API do Professor Rafa.");
      }

      const data = await res.json();
      
      const rafaMessage: Message = {
        id: "msg-rafa-" + Date.now(),
        sender: "rafa",
        content: data.text || "Hum, desculpe, não consegui te ouvir bem. Pode me perguntar novamente, por favor?",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, rafaMessage]);

    } catch (err: any) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: "msg-error-" + Date.now(),
          sender: "rafa",
          content: "Oops! Meu sistema de escuta ficou um pouquinho instável agora. Mas não se preocupe! Tente clicar de novo ou veja se a sua internet está boa. Se precisar de algo urgente, use o botão vermelho de ajuda!",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  // Silent trigger for cards
  const handleSilentTrigger = (promptString: string) => {
    // Timeout to make sure initial welcome was fully rendered and structured
    setTimeout(() => {
      setInputText(promptString);
      executeSendMessage(promptString);
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 relative">
      
      {/* Top Interactive Banner */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between gap-2 z-10 sticky top-0 shadow-xs">
        <button 
          id="go-back-dashboard-btn"
          onClick={onGoBack}
          className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-2 p-1 hover:bg-slate-50 rounded-xl transition-colors select-none text-md sm:text-lg shrink-0"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* Voice feedback line */}
      {isListening && (
        <div className="bg-red-500 text-white text-md py-3 text-center font-bold flex items-center justify-center gap-3 animate-pulse shrink-0">
          <span className="w-3.5 h-3.5 rounded-full bg-white animate-ping"></span>
          <span>🎙️ ESTOU TE OUVINDO... Fale agora para perguntar!</span>
        </div>
      )}

      {/* Main scrolling chat list */}
      <div id="chat-scroller" className="flex-1 overflow-y-auto p-4 space-y-5 flex flex-col min-h-0">
        
        {messages.map((msg) => {
          const isUser = msg.sender === "user";
          const isCurrentlySpeaking = currentlySpeakingId === msg.id;

          return (
            <div 
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                isUser ? "self-end items-end" : "self-start items-start"
              }`}
            >
              {/* Message content bubble - Professional Polish themed high contrast bubbles */}
              <div 
                className={`p-5 rounded-3xl border text-xl leading-relaxed whitespace-pre-wrap ${
                  isUser 
                    ? "bg-blue-100 text-slate-800 border-blue-200 rounded-2xl rounded-tr-none shadow-xs font-semibold" 
                    : "bg-white text-slate-800 border-slate-200 rounded-2xl rounded-tl-none shadow-sm"
                }`}
                style={{ fontSize: fontSizeLarge ? "1.45rem" : "1.25rem" }}
              >
                {!isUser && (
                  <span className="block text-xs font-bold uppercase text-teal-600 tracking-wider mb-2">
                    Professor Rafa Responde:
                  </span>
                )}
                {renderFormattedMessage(msg.content)}

                {/* Visible timestamp or spacing under message */}
                {!isUser && (
                  <div className="mt-2 border-t border-slate-100 pt-2 flex items-center justify-end">
                    <span className="text-slate-400 text-xs font-mono">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Gemini thinking state animation spinner */}
        {isThinking && (
          <div className="self-start flex items-center gap-3 bg-white p-5 rounded-3xl border-2 border-slate-200 shadow-xs max-w-[85%] animate-pulse">
            <div className="flex gap-1">
              <span className="w-3.5 h-3.5 bg-sky-500 rounded-full animate-bounce"></span>
              <span className="w-3.5 h-3.5 bg-sky-500 rounded-full animate-bounce delay-150"></span>
              <span className="w-3.5 h-3.5 bg-sky-500 rounded-full animate-bounce delay-300"></span>
            </div>
            <span className="text-slate-500 font-bold text-lg select-none">
              Rafa está ouvindo e escrevendo a dica... 😊
            </span>
          </div>
        )}

        {/* Polished, accessible voice recording state card */}
        {isListening && (
          <div className="self-center bg-teal-50 border-2 border-teal-300 rounded-3xl p-5 text-center space-y-3 shadow-md max-w-sm w-full mx-auto animate-pulse flex flex-col items-center select-none">
            <div className="flex items-center gap-2 justify-center">
              <span className="w-3.5 h-3.5 bg-red-600 rounded-full animate-ping shrink-0" />
              <span className="font-extrabold text-teal-950 text-xl">Estou te ouvindo agora...</span>
            </div>
            <p className="text-teal-900 text-sm font-semibold leading-relaxed">
              Fale bem pertinho do celular ou computador. Suas palavras vão aparecer escritas na barra de digitação abaixo! Quando terminar, é só clicar no microfone de novo.🎙️
            </p>
            <div className="flex gap-1 justify-center items-end h-8">
              <span className="w-1.5 bg-teal-600 rounded-full animate-bounce h-4" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 bg-teal-600 rounded-full animate-bounce h-7" style={{ animationDelay: '0.3s' }} />
              <span className="w-1.5 bg-teal-600 rounded-full animate-bounce h-5" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 bg-teal-600 rounded-full animate-bounce h-8" style={{ animationDelay: '0.4s' }} />
              <span className="w-1.5 bg-teal-600 rounded-full animate-bounce h-3" style={{ animationDelay: '0.15s' }} />
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="self-center bg-amber-50 rounded-xl p-4 border border-amber-300 flex items-start gap-3 max-w-sm">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <span className="text-sm font-semibold text-amber-900 leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts helper for quick senior clicks */}
      {messages.length <= 1 && !isThinking && (
        <div className="p-4 bg-sky-50/70 border-t border-sky-100/50 shrink-0 select-none">
          <span className="block text-xs font-black text-sky-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Nossos idosos adoram perguntar:</span>
          </span>
          <div id="chat-suggestions" className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestionClick(q)}
                className="bg-white hover:bg-sky-100 text-slate-800 text-sm font-bold py-2.5 px-4 rounded-xl border-2 border-slate-200 hover:border-sky-300 transition-all text-left shadow-xs active:scale-95 duration-100 cursor-pointer"
              >
                💡 &ldquo;{q}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Simple Form Input & Giant Mic Bar */}
      <div className="p-4 bg-white border-t border-slate-200 shrink-0">
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
          
          {/* Text Input area (Now a spacious wrapped Textarea!) */}
          <div className="w-full relative">
            <textarea 
              id="chat-text-input"
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida aqui..."
              className={`w-full ${fontSizeLarge ? "text-2.5xl" : "text-xl"} p-4 rounded-2xl border-2 border-slate-200 focus:border-sky-500 bg-slate-50 font-bold text-slate-800 font-sans resize-none transition-all outline-none`}
              disabled={isThinking}
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Audio Tap Trigger Panel - Polished theme styled voice mic button */}
            <button 
              id="mic-recognition-btn"
              type="button"
              onClick={handleVoiceCaptureToggle}
              className={`flex-1 h-16 rounded-2xl flex items-center justify-center gap-2 border-2 shadow-md transition-all text-white active:scale-95 cursor-pointer ${
                isListening 
                  ? "bg-red-500 border-red-700 animate-pulse" 
                  : "bg-teal-600 hover:bg-teal-700 border-teal-800"
              }`}
              title="Ditar por voz (clique para falar)"
            >
              <Mic className="w-7 h-7 shrink-0" />
              <span className="text-md sm:text-lg font-black uppercase">{isListening ? "Parar Gravação" : "Falar por Áudio"}</span>
            </button>

            {/* Senders control */}
            <button 
              id="chat-send-btn"
              type="submit"
              disabled={!inputText.trim() || isThinking}
              className="w-32 h-16 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white rounded-2xl flex items-center justify-center shadow-md shrink-0 border-2 border-sky-800 transition-all active:scale-95 gap-2 cursor-pointer"
              title="Enviar mensagem"
            >
              <span className="text-md sm:text-lg font-black uppercase pl-1">Enviar</span>
              <Send className="w-5 h-5 shrink-0" />
            </button>
          </div>
        </form>
      </div>



      {/* Visual Audio Preparing Modal */}
      {isGeneratingAudio && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-teal-500 p-6 space-y-4 max-w-xs shadow-2xl w-full text-center">
            <img
              src="/logo.png"
              alt="Professor Rafa"
              className="mx-auto w-20 h-20 rounded-full animate-pulse border-2 border-teal-300 ring-4 ring-teal-50"
            />
            <div className="space-y-1">
              <h3 className="text-xl font-black font-display text-slate-800">Preparando a Voz...</h3>
              <p className="text-slate-600 text-sm font-semibold leading-relaxed">
                O Professor Rafa está preparando o áudio para falar com você. Prontinho em instantes! 😊
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"></span>
                <span className="w-3 h-3 bg-teal-500 rounded-full animate-bounce delay-150"></span>
                <span className="w-3 h-3 bg-teal-500 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
