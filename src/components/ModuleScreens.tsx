import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Mic, CheckSquare, Square, Play, Pause, RefreshCw, 
  HelpCircle, CheckCircle2, Moon, Brain, Key, Dumbbell, CalendarRange, Sparkles, Smile, Sunset
} from "lucide-react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface ModuleScreenProps {
  onGoBack: () => void;
  onStartChat: (initialPrompt?: string) => void;
  fontSizeLarge: boolean;
  topicId: "exercicios" | "sono" | "memoria" | "rotina";
  user?: any;
}

// 1. MODULE: EXERCÍCIOS (Alongamento & Caminhada)
export function ExerciciosModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const daysOfWeek = [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
  ];
  const todayIndex = new Date().getDay();
  const todayName = daysOfWeek[todayIndex];

  const allExercises = [
    {
      id: "stretch",
      title: "Alongamento ao acordar (na cama) 🛌",
      desc: "Estique os braços e pernas enquanto respira fundo 3 vezes antes de levantar da cama.",
      timing: "Todos os dias",
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      emoji: "🛌",
      videoUrl: "https://www.youtube.com/embed/kSktihO1CrY",
      color: "from-rose-500 to-orange-500",
      category: "Alongamento",
      guidelines: [
        "Estique os braços bem acima da cabeça ainda deitado.",
        "Puxe um joelho de cada vez em direção ao peito e segure por 10 segundos.",
        "Respire fundo pelo nariz e solte lentamente pela boca 3 vezes.",
        "Sente-se devagar na beira da cama antes de ficar em pé."
      ]
    },
    {
      id: "upper-limbs",
      title: "Membros superiores (braços, ombros, peito e costas) 🙆‍♂️",
      desc: "Giro de ombros para trás e elevações suaves de braços para aliviar as tensões.",
      timing: "Segunda e Quarta-feira",
      activeDays: [1, 3],
      emoji: "🙆‍♂️",
      videoUrl: "https://www.youtube.com/embed/QI8Mk0ZgDkg",
      color: "from-teal-500 to-emerald-500",
      category: "Fortalecimento",
      guidelines: [
        "Gire os ombros para trás 10 vezes em movimentos circulares suaves.",
        "Eleve os braços para os lados até a altura dos ombros e desça devagar.",
        "Entrelace os dedos e empurre os braços para a frente, alongando as costas.",
        "Faça os movimentos sentado e mantenha a coluna bem ereta."
      ]
    },
    {
      id: "lower-limbs",
      title: "Membros inferiores (bumbum, pernas e pés) 🦵",
      desc: "Sentado firme, eleve os joelhos devagar e faça círculos suaves com os pés.",
      timing: "Terças e Quintas-feiras",
      activeDays: [2, 4],
      emoji: "🦵",
      videoUrl: "https://www.youtube.com/embed/QI8Mk0ZgDkg",
      color: "from-amber-500 to-orange-500",
      category: "Mobilidade",
      guidelines: [
        "Sentado firme em uma cadeira, levante um joelho de cada vez alternadamente.",
        "Estique uma perna para a frente e gire o pé suavemente para a esquerda e direita.",
        "Abra e feche os dedos dos pés para estimular a circulação de retorno.",
        "Apoie-se em uma parede ou cadeira firme se for fazer em pé."
      ]
    },
    {
      id: "cardio-pulmonary",
      title: "Exercícios para o coração e pulmão ❤️",
      desc: "Respire fundo prendendo o ar por 3 segundos, depois solte devagar como se estivesse soprando uma vela.",
      timing: "Segunda à Quinta-feira",
      activeDays: [1, 2, 3, 4],
      emoji: "❤️",
      videoUrl: "https://www.youtube.com/embed/CR61Cof1W-Q",
      color: "from-sky-500 to-indigo-500",
      category: "Respiração",
      guidelines: [
        "Respire profundamente pelo nariz inflando o abdômen por 3 segundos.",
        "Prenda o ar por outros 3 segundos de forma confortável.",
        "Sopre o ar lentamente pelos lábios semi-fechados (como soprando uma vela).",
        "Repita esse ciclo respiratório de 5 a 10 vezes para ajudar os pulmões."
      ]
    },
    {
      id: "choke-prevention",
      title: "Exercícios para evitar engasgos 🗣️",
      desc: "Bocheche o ar de um lado para o outro e faça caretas/sons em tons fortes para exercitar a deglutição.",
      timing: "Sextas-feiras e Sábados",
      activeDays: [5, 6],
      emoji: "🗣️",
      videoUrl: "https://www.youtube.com/embed/VCAx5JHkSLE",
      color: "from-purple-500 to-pink-500",
      category: "Comunicação e Deglutição",
      guidelines: [
        "Encha as bochechas de ar e passe o ar de um lado para o outro 10 vezes.",
        "Faça caretas abrindo bem a boca e pronunciando as vogais 'A, E, I, O, U'.",
        "Engula a saliva com a cabeça levemente inclinada para a frente.",
        "Estes movimentos fortalecem os órgãos da mastigação e engasgo."
      ]
    },
    {
      id: "pelvic-floor",
      title: "Exercícios para segurar xixi e cocô 🚽",
      desc: "Kegel: Contraia a musculatura pélvica por 5 segundos, depois relaxe. Repita 5 vezes.",
      timing: "Sextas-feiras e Sábados",
      activeDays: [5, 6],
      emoji: "🚽",
      videoUrl: "https://www.youtube.com/embed/CR61Cof1W-Q",
      color: "from-indigo-500 to-pink-500",
      category: "Assoalho Pélvico",
      guidelines: [
        "Identifique os músculos que você usa para segurar o fluxo de urina.",
        "Contraia esses músculos firmemente por 5 segundos de forma isolada.",
        "Relaxe e descanse por 5 segundos.",
        "Faça 5 repetições respirando de forma normal e suave."
      ]
    }
  ];

  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    const local = localStorage.getItem("senior_exercicios_completed_v3");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const [showOnlyToday, setShowOnlyToday] = useState(false);
  const [activeExerciseId, setActiveExerciseId] = useState<string>("stretch");

  // Sync state to localstorage
  useEffect(() => {
    localStorage.setItem("senior_exercicios_completed_v3", JSON.stringify(completed));
  }, [completed]);

  // Daily reset check
  useEffect(() => {
    const todayDate = new Date().toLocaleDateString("pt-BR");
    const lastResetKey = "senior_exercicios_last_reset_date";
    const lastResetDate = localStorage.getItem(lastResetKey);
    if (lastResetDate && lastResetDate !== todayDate) {
      setCompleted({});
    }
    localStorage.setItem(lastResetKey, todayDate);
  }, []);

  const toggle = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const visibleExercises = showOnlyToday 
    ? allExercises.filter(ex => ex.activeDays.includes(todayIndex))
    : allExercises;

  // Auto-select fallback if active exercise is filtered out
  useEffect(() => {
    if (visibleExercises.length > 0 && !visibleExercises.some(ex => ex.id === activeExerciseId)) {
      setActiveExerciseId(visibleExercises[0].id);
    }
  }, [visibleExercises, activeExerciseId]);

  const activeExercise = allExercises.find(ex => ex.id === activeExerciseId) || allExercises[0];

  const totalCompleted = visibleExercises.filter(ex => completed[ex.id]).length;
  const isAllDone = visibleExercises.length > 0 && totalCompleted === visibleExercises.length;

  const resetToday = () => {
    const resetObj = { ...completed };
    visibleExercises.forEach(ex => {
      resetObj[ex.id] = false;
    });
    setCompleted(resetObj);
  };

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none font-sans">
      <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
          <button
            id="ex-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-rose-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <Dumbbell className="w-5 h-5 text-rose-600 animate-pulse-slow" />
            <span>Exercícios Físicos</span>
          </span>
        </div>

        {/* ACTIVE ORIENTATIVE PLAYER & COMPAS GUIDE (IDENTICAL TO PREVENÇÃO MODULE) */}
        <div className="bg-slate-900 rounded-[24px] p-3 text-center border-2 border-slate-800 shadow-md space-y-2.5 relative font-sans">
          <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full z-10 animate-fade-in">
            {activeExercise.category}
          </div>

          {/* Video Container */}
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-inner relative bg-slate-950/90 flex flex-col items-center justify-center p-4 border border-slate-700/40">
            {activeExercise.videoUrl ? (
              <iframe
                src={activeExercise.videoUrl}
                title={activeExercise.title}
                className="w-full h-full object-cover absolute inset-0"
                allowFullScreen
              />
            ) : (
              <div className="space-y-1.5 text-center px-2">
                <div className="mx-auto w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-455">
                  <Play className="w-5 h-5 fill-current opacity-85 ml-0.5 text-rose-500" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-slate-200 text-[11px] font-black uppercase text-rose-450">Vídeo de Treinamento</span>
                  <p className="text-slate-300 text-[10px] font-bold leading-tight">
                    Nenhum vídeo disponível no momento.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines under active exercise */}
          <div className="text-left space-y-1.5 pt-2 border-t border-slate-800/80 font-sans">
            <div className="flex justify-between items-center gap-2">
              <h4 className="text-slate-100 text-[11px] font-black leading-tight flex-1">{activeExercise.emoji} Exercício: {activeExercise.title}</h4>
              <button
                onClick={() => toggle(activeExercise.id)}
                className={`text-[10px] font-black px-2.5 py-1 rounded-xl shadow-2xs whitespace-nowrap transition-colors cursor-pointer border ${
                  completed[activeExercise.id]
                    ? "bg-rose-600 text-white border-rose-700"
                    : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {completed[activeExercise.id] ? "✓ Feito!" : "Marcar como Feito"}
              </button>
            </div>
          </div>
        </div>

        {/* SECTOR FOR EXERCISE SELECTION LIST (IDENTICAL TO PREVENÇÃO TOPICS ACCORDION SELECTION) */}
        <div className="space-y-1.5 text-left font-sans">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide px-1">Exercícios Disponíveis:</h3>
          <div className="grid grid-cols-1 gap-1.5">
            {visibleExercises.map((ex) => {
              const isActive = activeExerciseId === ex.id;
              const isDone = completed[ex.id];
              return (
                <button
                  key={ex.id}
                  onClick={() => setActiveExerciseId(ex.id)}
                  className={`p-2.5 rounded-[18px] border-2 text-left flex items-start gap-3 transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-rose-50/50 border-rose-300 shadow-sm"
                      : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl shrink-0 bg-gradient-to-br ${ex.color} text-white flex flex-col items-center justify-center text-lg shadow-2xs`}>
                    <span>{ex.emoji}</span>
                  </div>

                  <div className="flex-1 min-w-0 pr-2 font-sans">
                    <div className="flex items-center justify-between mb-1">
                      <span className="block text-[8px] text-slate-400 font-extrabold leading-none uppercase tracking-wider">
                        {ex.category}
                      </span>
                      {isDone && (
                        <span className="text-[9px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full inline-block">
                          ✓ Concluído
                        </span>
                      )}
                    </div>
                    <h5 className={`font-extrabold text-xs text-slate-800 leading-none mb-1 ${isDone ? "line-through opacity-75 text-slate-405" : ""}`}>
                      {ex.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-snug font-medium line-clamp-1">
                      {ex.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0 font-sans">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Tem alguma dor ou quer sugestão de outro exercício?
        </p>
        <button
          id="ex-ask-rafa-btn"
          onClick={() => onStartChat("Professor Rafa, preciso de orientações para fazer meus exercícios hoje de forma segura. Pode me ajudar?")}
          className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-rose-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>FALAR COM O PROFESSOR RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 2. MODULE: SONO (Dormir Bem & Higiene do Sono)
export function SonoModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const sleepVideos = [
    {
      id: "como-dormir-bem",
      title: "Como Dormir Bem e Acordar Disposto",
      emoji: "😴",
      category: "Higiene do Sono",
      color: "from-indigo-500 to-purple-500",
      desc: "Entenda boas práticas e hábitos simples para regular seu sono de maneira natural.",
      videoUrl: "https://www.youtube.com/embed/Ae7yiM4KbAg"
    },
    {
      id: "ambiente-seguro",
      title: "Criando um Quarto Seguro e Acolhedor",
      emoji: "🛌",
      category: "Qualidade do Sono",
      color: "from-blue-500 to-indigo-600",
      desc: "Como organizar seu quarto e fazer uma rotina de relaxamento antes de dormir.",
      videoUrl: "" // Awaiting official link
    }
  ];

  const [activeVideoId, setActiveVideoId] = useState<string>("como-dormir-bem");
  const activeVideo = sleepVideos.find(v => v.id === activeVideoId) || sleepVideos[0];

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none font-sans">
      <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5">
          <button
            id="sono-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-indigo-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <Moon className="w-5 h-5 text-indigo-600 animate-pulse-slow font-bold" />
            <span>Sono Seguro</span>
          </span>
        </div>

        {/* ACTIVE ORIENTATIVE PLAYER & COMPAS GUIDE */}
        <div className="bg-slate-900 rounded-[24px] p-3 text-center border-2 border-slate-800 shadow-md space-y-2.5 relative">
          <div className="absolute top-2 left-2 bg-indigo-600/90 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full z-10 animate-fade-in">
            {activeVideo.category}
          </div>

          {/* Video Player or Placeholder Box */}
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-inner relative bg-slate-950/90 flex flex-col items-center justify-center p-4 border border-slate-700/40">
            {activeVideo.videoUrl ? (
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full h-full object-cover absolute inset-0"
                allowFullScreen
              />
            ) : (
              <div className="space-y-1.5 text-center px-2">
                <div className="mx-auto w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                  <Play className="w-5 h-5 fill-current opacity-85 ml-0.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-slate-200 text-[11px] font-black uppercase text-indigo-400">Vídeo de Sono</span>
                  <p className="text-slate-300 text-[10px] font-bold leading-tight">
                    Aguardando o link de vídeo do Professor Rafa para carregar a sequência oficial aqui nesta tela!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines under active video */}
          <div className="text-left space-y-1.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-slate-100 text-xs font-black leading-none">{activeVideo.emoji} {activeVideo.title}</h4>
          </div>
        </div>

        {/* VIDEOS ACCORDION SELECTION */}
        <div className="space-y-1.5 text-left font-sans">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide px-1">Vídeos Disponíveis:</h3>
          <div className="grid grid-cols-1 gap-1.5">
            {sleepVideos.map((v) => {
              const isActive = activeVideoId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setActiveVideoId(v.id)}
                  className={`p-2.5 rounded-[18px] border-2 text-left flex items-start gap-3 transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-indigo-50/50 border-indigo-300 shadow-sm"
                      : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl shrink-0 bg-gradient-to-br ${v.color} text-white flex flex-col items-center justify-center text-lg shadow-2xs`}>
                    <span>{v.emoji}</span>
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <span className="block text-[8px] text-slate-400 font-extrabold leading-none mb-1 uppercase tracking-wider">
                      {v.category}
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-800 leading-none mb-1">
                      {v.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-snug font-medium line-clamp-1">
                      {v.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Tem insônia frequente ou quer chá saudável relaxante?
        </p>
        <button
          id="sono-ask-rafa-btn"
          onClick={() => onStartChat("Professor Rafa, tenho tido dificuldade para pegar no sono ultimamente. O que você me recomenda fazer na minha rotina de sono?")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-indigo-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>FALAR COM O PROFESSOR RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 3. MODULE: MEMÓRIA (Ginástica da Mente & Jogos de Estimulação Cognitiva)
export function MemoriaModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  // Navigation between memory games
  const [activeGame, setActiveGame] = useState<"pares" | "onde_estava">("pares");

  // Timer states for 10min limit
  const [seconds, setSeconds] = useState(600); // 10 minutes
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [showBreakAlert, setShowBreakAlert] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setShowBreakAlert(true);
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
              try {
                const speech = new SpeechSynthesisUtterance("Muito bem! Você completou dez minutos de exercícios mentais. Agora, faça uma pausa para descansar.");
                speech.lang = "pt-BR";
                window.speechSynthesis.speak(speech);
              } catch (e) {}
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, seconds]);

  // ==========================================
  // JOGO 1: PARES CLÁSSICOS (MEMORY MATCH) STATE & HELPERS
  // ==========================================
  const [cardsTheme, setCardsTheme] = useState<"frutas" | "animais" | "saude">("frutas");
  const themesData = {
    frutas: [
      { type: "apple", emoji: "🍎" },
      { type: "banana", emoji: "🍌" },
      { type: "orange", emoji: "🍊" },
      { type: "grape", emoji: "🍇" },
    ],
    animais: [
      { type: "dog", emoji: "🐶" },
      { type: "cat", emoji: "🐱" },
      { type: "bird", emoji: "🐦" },
      { type: "bunny", emoji: "🐰" },
    ],
    saude: [
      { type: "stethoscope", emoji: "🩺" },
      { type: "pills", emoji: "💊" },
      { type: "water", emoji: "💧" },
      { type: "heart", emoji: "❤️" },
    ]
  };

  const generateCards = (themeKey: "frutas" | "animais" | "saude") => {
    const base = themesData[themeKey];
    const doubled = [...base, ...base].map((item, index) => ({
      id: index + 1,
      type: item.type,
      emoji: item.emoji,
      isFlipped: false,
      isMatched: false
    }));
    return doubled.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(() => generateCards("frutas"));
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  // When theme changes, reset the match game
  const handleThemeChange = (newTheme: "frutas" | "animais" | "saude") => {
    setCardsTheme(newTheme);
    setCards(generateCards(newTheme));
    setSelectedCards([]);
    setMoves(0);
  };

  const handleCardClick = (cardId: number) => {
    const current = cards.find(c => c.id === cardId);
    if (!current || current.isFlipped || current.isMatched || selectedCards.length >= 2) return;

    // Flip card
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c));
    const nextSelected = [...selectedCards, cardId];
    setSelectedCards(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = nextSelected;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.type === secondCard.type) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true, isFlipped: true } 
              : c
          ));
          setSelectedCards([]);
        }, 300);
      } else {
        // No match - Flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  const handleResetMatch = () => {
    setCards(generateCards(cardsTheme));
    setSelectedCards([]);
    setMoves(0);
  };

  const allMatched = cards.every(c => c.isMatched);

  // ==========================================
  // JOGO 2: ONDE ESTAVA? (WHERE WAS IT?) STATE & HELPERS
  // ==========================================
  const ondeEstavaPools = [
    [
      { id: 1, emoji: "🐶", name: "Cachorrinho" },
      { id: 2, emoji: "🍕", name: "Pizza" },
      { id: 3, emoji: "🚗", name: "Carro" },
      { id: 4, emoji: "🔑", name: "Chave" }
    ],
    [
      { id: 1, emoji: "🌻", name: "Girassol" },
      { id: 2, emoji: "🚲", name: "Bicicleta" },
      { id: 3, emoji: "👟", name: "Tênis" },
      { id: 4, emoji: "📱", name: "Celular" }
    ],
    [
      { id: 1, emoji: "📚", name: "Livro" },
      { id: 2, emoji: "🍵", name: "Chá Quente" },
      { id: 3, emoji: "🎸", name: "Violão" },
      { id: 4, emoji: "⏰", name: "Relógio" }
    ]
  ];

  const [levelIndex, setLevelIndex] = useState(0);
  const [ondeEstavaState, setOndeEstavaState] = useState<"learning" | "hidden" | "correct" | "incorrect">("learning");
  const [targetItem, setTargetItem] = useState(ondeEstavaPools[0][0]);
  const [ondeEstavaScore, setOndeEstavaScore] = useState(0);
  const [revealedIds, setRevealedIds] = useState<Record<number, boolean>>({});

  // Shuffle or initialize the Onde Estava game
  const initOndeEstava = (lvl: number) => {
    setLevelIndex(lvl);
    setOndeEstavaState("learning");
    setRevealedIds({});
    
    // Choose a random item from this level list to be the target
    const currentPool = ondeEstavaPools[lvl];
    const randomIndex = Math.floor(Math.random() * currentPool.length);
    setTargetItem(currentPool[randomIndex]);
  };

  const startOndeEstavaGame = () => {
    setOndeEstavaState("hidden");
  };

  const handleOndeEstavaGuess = (cardId: number) => {
    if (ondeEstavaState !== "hidden") return;

    const pool = ondeEstavaPools[levelIndex];
    const clickedItem = pool.find(item => item.id === cardId);

    if (clickedItem && clickedItem.emoji === targetItem.emoji) {
      setOndeEstavaState("correct");
      setOndeEstavaScore(prev => prev + 1);
    } else {
      setOndeEstavaState("incorrect");
      // Reveal the clicked wrong one to show what is there
      setRevealedIds(prev => ({ ...prev, [cardId]: true }));
    }
  };

  // ==========================================
  // JOGO 3: CHARADAS E DESAFIOS COGNITIVOS STATE
  // ==========================================
  const charadas = [
    {
      id: 1,
      title: "O Enigma do Tempo 🕰️",
      question: "Se o ontem de amanhã é quarta-feira, então hoje é...",
      answer: "Quarta-feira!",
      explanation: "Amanhã será quinta-feira. O ontem de quinta-feira é hoje: quarta-feira!"
    },
    {
      id: 2,
      title: "As Pílulas da Manhã 💊",
      question: "Um médico lhe dá 3 pílulas para tomar de 30 em 30 minutos. Quanto tempo dura o tratamento?",
      answer: "1 hora!",
      explanation: "Você toma a 1ª pílula agora (minuto 0), a 2ª pílula 30 minutos depois, e a 3ª pílula completando 60 minutos (1 hora total)!"
    },
    {
      id: 3,
      title: "As Filhas de Maria 👩‍👧‍👧",
      question: "O pai de Maria tem 5 filhas: Lala, Lele, Lili, Lolo. Qual o nome da quinta filha?",
      answer: "Maria!",
      explanation: "Preste atenção no enunciado: ele começa com 'O pai de Maria...', portanto Maria é uma das 5 filhas!"
    },
    {
      id: 4,
      title: "O Item Misterioso 🥚",
      question: "O que tem que ser quebrado antes de ser usado?",
      answer: "Um ovo!",
      explanation: "Precisamos quebrá-lo para cozinhar ou fazer um bolo de lanche."
    }
  ];

  const [activeRiddleId, setActiveRiddleId] = useState<number | null>(null);

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none">
      <div className="space-y-3">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
          <button
            id="mem-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer animate-fade-in"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-emerald-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <Brain className="w-5 h-5 text-emerald-600 animate-pulse-slow" />
            <span>Exercícios Mentais</span>
          </span>
        </div>

        {/* Timer de Exercícios Mentais (10 min) */}
        <div className="bg-purple-50/80 border-2 border-purple-100 p-2.5 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="text-left font-sans">
            <span className="block text-[10px] font-extrabold text-purple-700 uppercase tracking-wider leading-none">Tempo de Exercício</span>
            <span className={`text-base font-black mt-0.5 font-mono flex items-center gap-1 ${seconds === 0 ? "text-red-600 animate-pulse" : "text-slate-900"}`}>
              ⏱️ {Math.floor(seconds / 60).toString().padStart(2, "0")}:{(seconds % 60).toString().padStart(2, "0")} / 10:00
            </span>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="text-[10px] font-black px-2.5 py-1 rounded-lg border bg-white hover:bg-purple-100 transition-all text-purple-950 border-purple-200 cursor-pointer"
            >
              {isTimerRunning ? "Pausar ⏸️" : "Iniciar ▶️"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSeconds(600);
                setIsTimerRunning(true);
                setShowBreakAlert(false);
              }}
              className="text-[10px] font-black px-2.5 py-1 rounded-lg border bg-white hover:bg-slate-50 transition-all text-slate-700 border-slate-200 cursor-pointer"
            >
              Resetar 🔄
            </button>
          </div>
        </div>

        {showBreakAlert && (
          <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl text-center space-y-2 animate-bounce shadow-md">
            <span className="text-3xl">☕🕊️⏳</span>
            <h4 className="text-base font-black text-amber-950">Hora do Descanso!</h4>
            <p className="text-slate-700 text-xs font-bold leading-normal">
              Você completou o tempo sugerido de 10 minutos de exercícios. Faça uma pausa agora para descansar sua visão e relaxar a mente!
            </p>
            <button
              type="button"
              onClick={() => setShowBreakAlert(false)}
              className="mt-2 text-xs font-black bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl border-2 border-amber-800 shadow-sm cursor-pointer transition-all"
            >
              Ok, entendi!
            </button>
          </div>
        )}

        {/* 2 Games Picker Selector Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActiveGame("pares")}
            className={`py-1.5 px-1 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
              activeGame === "pares"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            🧩 Pares
          </button>
          <button
            onClick={() => {
              setActiveGame("onde_estava");
              initOndeEstava(0);
            }}
            className={`py-1.5 px-1 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
              activeGame === "onde_estava"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            🙈 Onde Estava?
          </button>
        </div>

        {/* ==========================================
            GAME 1: CLASSIC MATCHING PAIRS VIEW
           ========================================== */}
        {activeGame === "pares" && (
          <div id="mem-game-box" className="bg-emerald-50/60 border-2 border-emerald-100 rounded-2xl p-3 text-center space-y-2.5 animate-fade-in shadow-xs">
            <div className="flex justify-between items-center px-1">
              <div className="text-left">
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wide leading-none">Jogo da Memória Clássico</span>
                <span className="block text-sm font-black text-slate-800 mt-0.5">Encontre os pares corretos!</span>
              </div>
              <button
                id="mem-game-reset"
                onClick={handleResetMatch}
                className="bg-white hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-200 p-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1 font-black text-xs shadow-xs transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            </div>

            {/* Themes Selector inside Match Game */}
            <div className="flex gap-1.5 justify-center py-1">
              <button
                onClick={() => handleThemeChange("frutas")}
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-black border transition-colors cursor-pointer ${
                  cardsTheme === "frutas" 
                    ? "bg-emerald-200 border-emerald-400 text-emerald-950 font-bold" 
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                🍎 Frutas
              </button>
              <button
                onClick={() => handleThemeChange("animais")}
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-black border transition-colors cursor-pointer ${
                  cardsTheme === "animais" 
                    ? "bg-emerald-200 border-emerald-400 text-emerald-950 font-bold" 
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                🐶 Animais
              </button>
              <button
                onClick={() => handleThemeChange("saude")}
                className={`text-[11px] px-2.5 py-0.5 rounded-full font-black border transition-colors cursor-pointer ${
                  cardsTheme === "saude" 
                    ? "bg-emerald-200 border-emerald-400 text-emerald-950 font-bold" 
                    : "bg-white border-slate-200 text-slate-600"
                }`}
              >
                🩺 Saúde
              </button>
            </div>

            {/* Congrats check or Grid */}
            {allMatched ? (
              <div className="bg-white border-2 border-emerald-300 p-4 rounded-2xl text-center space-y-1 animate-bounce">
                <span className="text-3xl">🏆🌟👏</span>
                <h4 className="text-base font-black text-emerald-950">Mente Excelente!</h4>
                <p className="text-slate-600 text-xs font-bold leading-normal">
                  Você completou o tema <span className="font-extrabold uppercase text-emerald-700">{cardsTheme}</span> em {moves} tentativas de memorização. Parabéns!
                </p>
                <button
                  onClick={handleResetMatch}
                  className="mt-2 text-xs font-black bg-emerald-600 text-white px-3 py-1.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  Jogar de Novo 🤝
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 py-1.5">
                {cards.map(card => {
                  const isOpen = card.isFlipped || card.isMatched;
                  return (
                    <button
                      id={`mem-card-${card.id}`}
                      key={card.id}
                      onClick={() => handleCardClick(card.id)}
                      className={`h-16 rounded-[18px] flex items-center justify-center text-3xl border-2 transition-all cursor-pointer ${
                        isOpen
                          ? "bg-white border-emerald-400 text-slate-900 scale-100"
                          : "bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-800 text-emerald-100 hover:scale-[1.05] active:scale-95 shadow-md"
                      }`}
                    >
                      {isOpen ? card.emoji : "❓"}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==========================================
            GAME 2: ONDE ESTAVA? GAME VIEW
           ========================================== */}
        {activeGame === "onde_estava" && (
          <div className="bg-emerald-50/60 border-2 border-emerald-100 rounded-2xl p-3 text-center space-y-2.5 animate-fade-in shadow-xs text-left">
            <div className="flex justify-between items-center">
              <div>
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wide leading-none">Desafio de Foco Rápido</span>
                <h4 className="text-sm font-black text-slate-800 mt-0.5">Onde Estava o Emojì?</h4>
              </div>
              <span className="text-xs bg-white text-emerald-800 font-extrabold px-2.5 py-1 rounded-xl border border-emerald-200">
                ⭐ Pontos: {ondeEstavaScore}
              </span>
            </div>

            {ondeEstavaState === "learning" && (
              <div className="space-y-2.5">
                <div className="bg-emerald-100 text-emerald-950 p-2 rounded-xl text-[11px] font-bold leading-normal">
                  👀 Memorize com atenção a posição de cada item abaixo. Quando estiver pronto, esconda os itens e ache o emojì solicitado!
                </div>
                
                <div className="grid grid-cols-4 gap-2">
                  {ondeEstavaPools[levelIndex].map(item => (
                    <div key={item.id} className="bg-white border-2 border-emerald-300 p-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-xs">
                      <span className="text-3xl select-none">{item.emoji}</span>
                      <span className="text-[9px] font-bold leading-none text-slate-500 mt-1">{item.name}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={startOndeEstavaGame}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 border-emerald-800 shadow-xs cursor-pointer text-center"
                >
                  Estou Pronto, Esconder! 🙈🧠
                </button>
              </div>
            )}

            {ondeEstavaState === "hidden" && (
              <div className="space-y-3 text-center">
                <div className="bg-amber-100 text-amber-900 p-2 rounded-xl text-xs font-black inline-block px-4 mx-auto animate-pulse">
                  Aonde estava o item: <span className="text-xl ml-1">{targetItem.emoji}</span> ({targetItem.name})?
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {ondeEstavaPools[levelIndex].map(item => {
                    const isRevealed = revealedIds[item.id];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleOndeEstavaGuess(item.id)}
                        className={`h-16 rounded-[18px] flex flex-col items-center justify-center border-2 shadow-xs transition-transform cursor-pointer hover:scale-105 active:scale-95 ${
                          isRevealed 
                            ? "bg-white border-red-300 text-slate-800" 
                            : "bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-800 text-white text-3xl font-black"
                        }`}
                      >
                        {isRevealed ? (
                          <>
                            <span className="text-xl">{item.emoji}</span>
                            <span className="text-[8px] font-black text-red-600 uppercase mt-0.5">X Errado</span>
                          </>
                        ) : "❓"}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Correct/Guessed Status block */}
            {(ondeEstavaState === "correct" || ondeEstavaState === "incorrect") && (
              <div className="space-y-3.5 text-center py-1">
                {ondeEstavaState === "correct" ? (
                  <div className="bg-white border-2 border-emerald-400 p-3.5 rounded-2xl space-y-1">
                    <span className="text-3xl text-center block">👏🎉🥳</span>
                    <h5 className="font-black text-sm text-emerald-950">Espetacular! Você se lembrou perfeitamente!</h5>
                    <p className="text-[11px] text-slate-600 font-bold">O emojì {targetItem.emoji} estava exatamente naquela posição!</p>
                  </div>
                ) : (
                  <div className="bg-white border-2 border-rose-300 p-3.5 rounded-2xl space-y-1">
                    <span className="text-3xl text-center block">😅💡</span>
                    <h5 className="font-black text-sm text-slate-800">Quase lá! Tente memorizar com mais calma agora!</h5>
                    <p className="text-[11px] text-slate-500 font-bold">O emojì {targetItem.emoji} mudou de posição ou você clicou no lugar equivocado.</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => initOndeEstava(levelIndex)}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-200 p-2 rounded-xl text-xs font-black text-center"
                  >
                    Tentar Novamente 🔄
                  </button>
                  <button
                    onClick={() => {
                      const nextLevel = (levelIndex + 1) % ondeEstavaPools.length;
                      initOndeEstava(nextLevel);
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl p-2 text-xs font-black text-center border-2 border-emerald-800"
                  >
                    Próximo Nível 🚀
                  </button>
                </div>
              </div>
            )}
          </div>
        )}



        {/* Helpful Tips Box */}
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-2.5 space-y-1 text-slate-800 text-left shadow-xs">
          <h4 className="font-extrabold text-xs flex items-center gap-1 text-emerald-900 leading-none">
            <span>💡</span>
            <span>Dica de Especialista do Prof. Rafa:</span>
          </h4>
          <p className="text-slate-500 text-[10px] leading-normal font-semibold">
            Praticar exercícios mentais apenas 5 minutos todos os dias cria conexões neurais fortes, ajudando a manter o cérebro jovem e focado!
          </p>
        </div>
      </div>

      {/* Dynamic CTA asking for voice help */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0 bg-slate-50">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Quer mais ideias de jogos ou exercícios mentais para fazer agora?
        </p>
        <button
          id="mem-ask-rafa-btn"
          onClick={() => onStartChat("Professor Rafa, me dê mais ideias de desafios ou exercícios mentais para estimular meu cérebro!")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-emerald-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>FALAR COM PROFESSOR RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 4. MODULE: ROTINA (Minha Rotina Saudável & Checklist)
export function RotinaModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const [items, setItems] = useState<{ id: string; label: string; checked: boolean; time: string }[]>(() => {
    const local = localStorage.getItem("senior_routine_checklist");
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    return [
      { id: "water-1", label: "Beber o primeiro copo d'água 💧", checked: false, time: "De Manhã" },
      { id: "remedy-morning", label: "Verificar remédios da manhã 💊", checked: false, time: "De Manhã" },
      { id: "water-2", label: "Copo de água extra para limpar os rins! 💧", checked: false, time: "De Tarde" },
      { id: "remedy-evening", label: "Remédios de dormir ou da janta 💊", checked: false, time: "De Noite" },
    ];
  });

  const [customText, setCustomText] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<"De Manhã" | "De Tarde" | "De Noite" | "Especifico">("De Manhã");
  const [customPeriodText, setCustomPeriodText] = useState("");

  useEffect(() => {
    localStorage.setItem("senior_routine_checklist", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const todayDate = new Date().toLocaleDateString("pt-BR");
    const lastResetKey = "senior_routine_last_reset_date";
    const lastResetDate = localStorage.getItem(lastResetKey);
    if (lastResetDate && lastResetDate !== todayDate) {
      setItems(prev => prev.map(item => ({ ...item, checked: false })));
    }
    localStorage.setItem(lastResetKey, todayDate);
  }, []);

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    let timeLabel = "";
    if (selectedPeriod === "De Manhã") {
      timeLabel = "De Manhã";
    } else if (selectedPeriod === "De Tarde") {
      timeLabel = "De Tarde";
    } else if (selectedPeriod === "De Noite") {
      timeLabel = "De Noite";
    } else {
      timeLabel = customPeriodText.trim() || "Horário Livre";
    }

    const newItem = {
      id: "custom-" + Date.now(),
      label: customText + " ✨",
      checked: false,
      time: timeLabel
    };
    setItems(prev => [...prev, newItem]);
    setCustomText("");
    setCustomPeriodText("");
    setSelectedPeriod("De Manhã");
  };

  const clearAllChecked = () => {
    setItems(prev => prev.map(item => ({ ...item, checked: false })));
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none">
      <div className="space-y-2">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
          <button
            id="rot-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-sky-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <CalendarRange className="w-5 h-5 text-sky-600 animate-pulse-slow font-bold" />
            <span>Minha Rotina</span>
          </span>
        </div>

        {/* Dynamic Task List Container */}
        <div className="bg-sky-50 border-2 border-sky-100 rounded-2xl p-3 space-y-2 shadow-xs">
          <div className="flex justify-between items-center border-b border-sky-200/50 pb-1">
            <div className="text-left">
              <span className="block text-[10px] font-extrabold text-sky-600 uppercase tracking-wider leading-none">Planejamento Simples</span>
              <h4 className="text-base font-black text-slate-950 mt-0.5">Lembretes Diários</h4>
            </div>
            <button
              id="clear-routine-checked-btn"
              onClick={clearAllChecked}
              className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-lg font-black text-[10px] shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Limpar listas
            </button>
          </div>

          {/* Interactive list with scroll inside if needed */}
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
            {items.map(item => (
              <div 
                key={item.id} 
                className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                  item.checked 
                    ? "bg-white/80 border-emerald-300 text-slate-400" 
                    : "bg-white border-slate-200 text-slate-800"
                }`}
              >
                <button
                  id={`chk-routine-${item.id}`}
                  onClick={() => toggleCheck(item.id)}
                  className="flex-1 text-left flex items-center gap-2 cursor-pointer"
                >
                  <div className="shrink-0">
                    {item.checked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <div className="w-5 h-5 rounded border-2 border-slate-300 bg-slate-50" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className={`block font-bold text-xs leading-none ${item.checked ? "line-through opacity-60" : ""}`}>
                      {item.label}
                    </span>
                    <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase mt-0.5">
                      {item.time}
                    </span>
                  </div>
                </button>

                <button
                  id={`del-routine-${item.id}`}
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-red-500 hover:text-red-700 font-extrabold text-[10px] px-1.5 py-0.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer shrink-0 ml-1"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>

          {/* New Custom reminder form with Period Options */}
          <form onSubmit={handleAddNewItem} className="space-y-2 pt-1.5 border-t border-sky-200/50">
            <div className="flex flex-col gap-1 text-left">
              <label htmlFor="new-routine-input" className="text-[10px] font-black text-slate-700 uppercase leading-none">
                Qual tarefa ou compromisso quer somar?
              </label>
              <input
                id="new-routine-input"
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ex: Ir na igreja, Caminhada..."
                className="w-full text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-left bg-white font-bold"
              />
            </div>

            <div className="flex flex-col gap-1 text-left">
              <span className="text-[10px] font-black text-slate-700 uppercase leading-none">Período / Horário:</span>
              <div className="grid grid-cols-4 gap-1">
                {(["De Manhã", "De Tarde", "De Noite", "Especifico"] as const).map((opt) => {
                  const labelMap = {
                    "De Manhã": "🌅 Manhã",
                    "De Tarde": "☀️ Tarde",
                    "De Noite": "🌙 Noite",
                    "Especifico": "⏰ Outro"
                  };
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedPeriod(opt)}
                      className={`py-1 px-1 text-[10px] font-extrabold rounded-lg border-2 transition-all cursor-pointer ${
                        selectedPeriod === opt
                          ? "bg-sky-600 text-white border-sky-800 shadow-sm"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {labelMap[opt]}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedPeriod === "Especifico" && (
              <div className="flex flex-col gap-1 text-left animate-in fade-in duration-300">
                <label htmlFor="custom-period-input" className="text-[10px] font-black text-slate-600 uppercase leading-none">
                  Digite o dia/hora:
                </label>
                <input
                  id="custom-period-input"
                  type="text"
                  value={customPeriodText}
                  onChange={(e) => setCustomPeriodText(e.target.value)}
                  placeholder="Ex: Todo domingo 8h, Terça 15:00..."
                  className="w-full text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-left bg-white font-bold"
                />
              </div>
            )}

            <button
              id="add-routine-btn"
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-extrabold py-2 rounded-xl border border-sky-800 text-xs shadow-sm cursor-pointer whitespace-nowrap transition-all flex items-center justify-center gap-1"
            >
              + Adicionar
            </button>
          </form>
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Quer ajuda de voz para organizar seus remédios ou rotina?
        </p>
        <button
          id="rot-ask-rafa-btn"
          onClick={() => onStartChat()}
          className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-sky-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>PERGUNTAR AO PROF. RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 5. MODULE: REMÉDIOS (Meus Remédios Diários)
export function RemediosModule({ onGoBack, onStartChat, fontSizeLarge, user: passedUser }: Omit<ModuleScreenProps, "topicId">) {
  const [items, setItems] = useState<{ id: string; label: string; checked: boolean; time: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dbError, setDbError] = useState<{ message: string; code?: string; table?: string } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  const [customText, setCustomText] = useState("");
  const [customTime, setCustomTime] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const parseTimeAndDays = (timeStr: string) => {
    const match = timeStr.match(/(.*?)\s*\((.*?)\)/);
    if (match) {
      return { time: match[1], days: match[2] };
    }
    return { time: timeStr || "Horário Livre", days: "Todos os dias" };
  };

  const getStorageKey = (userId?: string) => {
    const activeId = userId || passedUser?.id || user?.id || "guest";
    return `senior_remedios_checklist_v2_${activeId}`;
  };

  const loadLocal = (userId?: string) => {
    const key = getStorageKey(userId);
    const local = localStorage.getItem(key);
    let loadedItems: any[] = [];
    if (local) {
      try {
        loadedItems = JSON.parse(local);
      } catch (e) {}
    }
    const todayDate = new Date().toLocaleDateString("pt-BR");
    const activeUserId = userId || passedUser?.id || user?.id || "guest";
    const lastResetKey = `senior_remedios_last_reset_date_${activeUserId}`;
    const lastResetDate = localStorage.getItem(lastResetKey);
    if (lastResetDate && lastResetDate !== todayDate) {
      loadedItems = loadedItems.map((item: any) => ({ ...item, checked: false }));
    }
    setItems(loadedItems);
    localStorage.setItem(lastResetKey, todayDate);
  };

  useEffect(() => {
    const init = async () => {
      try {
        let activeUser = passedUser;
        if (!activeUser && isSupabaseConfigured) {
          const { data: { user: currentUser } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
          activeUser = currentUser;
        }
        setUser(activeUser);

        const userId = activeUser?.id || "guest";

        if (isSupabaseConfigured && activeUser && !activeUser.isDemo) {
          setLoading(true);
          const { data, error } = await supabase
            .from("remedios")
            .select("*")
            .eq("user_id", activeUser.id)
            .order("created_at", { ascending: true });
          
          if (error) {
            console.warn("Erro ao buscar remédios do Supabase:", error);
            setDbError({ message: error.message, code: error.code, table: "remedios" });
            setItems([]);
          } else {
            setDbError(null);
            if (data) {
              const mapped = data.map((d: any) => ({
                id: d.id.toString(),
                label: d.label,
                checked: !!d.checked,
                time: d.time
              }));
              
              const todayDate = new Date().toLocaleDateString("pt-BR");
              const lastResetKey = `senior_remedios_last_reset_date_${activeUser.id}`;
              const lastResetDate = localStorage.getItem(lastResetKey);
              if (lastResetDate && lastResetDate !== todayDate) {
                const updated = mapped.map((item: any) => ({ ...item, checked: false }));
                setItems(updated);
                supabase
                  .from("remedios")
                  .update({ checked: false })
                  .eq("user_id", activeUser.id)
                  .then(({ error: resetErr }) => {
                    if (resetErr) console.warn("Erro ao resetar remédios em lote:", resetErr);
                  });
              } else {
                setItems(mapped);
              }
              localStorage.setItem(lastResetKey, todayDate);
            } else {
              setItems([]);
            }
          }
        } else {
          loadLocal(userId);
        }
      } catch (e: any) {
        console.error("Erro ao inicializar remédios com Supabase:", e);
        setDbError({ message: e.message || String(e), table: "remedios" });
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [passedUser]);

  // Save changes to localStorage on any state update to keep local fallback in sync (ONLY in demo mode)
  useEffect(() => {
    const isDemo = !isSupabaseConfigured || (user && user.isDemo);
    if (isDemo) {
      const userId = passedUser?.id || user?.id || "guest";
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(items));
    }
  }, [items, passedUser, user]);

  const toggleCheck = async (id: string) => {
    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;
    const newChecked = !targetItem.checked;

    // Optimistically update
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: newChecked } : item));

    if (isSupabaseConfigured && user && !user.isDemo) {
      try {
        const { error } = await supabase
          .from("remedios")
          .update({ checked: newChecked })
          .eq("id", id)
          .eq("user_id", user.id);
        
        if (error) {
          const numericId = parseInt(id, 10);
          let finalErr = error;
          let success = false;
          if (!isNaN(numericId)) {
            const { error: error2 } = await supabase
              .from("remedios")
              .update({ checked: newChecked })
              .eq("id", numericId)
              .eq("user_id", user.id);
            if (!error2) {
              success = true;
            } else {
              finalErr = error2;
            }
          }
          if (!success) {
            console.warn("Erro ao registrar toggle:", finalErr);
            setDbError({ message: finalErr.message, code: finalErr.code, table: "remedios" });
            // Revert state
            setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !newChecked } : item));
          } else {
            setDbError(null);
          }
        } else {
          setDbError(null);
        }
      } catch (e: any) {
        console.error("Erro ao salvar toggle no Supabase, revertendo:", e);
        setDbError({ message: e.message || String(e), table: "remedios" });
        // Revert state
        setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !newChecked } : item));
      }
    }
  };

  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const daysLabel = selectedDays.length === 7 
      ? "Todos os dias" 
      : selectedDays.length === 0 
        ? "Sob demanda" 
        : selectedDays.join(", ");
    
    const timeVal = `${customTime.trim() || "08:00"} (${daysLabel})`;
    const labelVal = customText + " 💊";

    if (isSupabaseConfigured && user && !user.isDemo) {
      try {
        const { data, error } = await supabase
          .from("remedios")
          .insert({
            user_id: user.id,
            label: labelVal,
            checked: false,
            time: timeVal
          })
          .select();
        
        if (error) {
          console.error("Erro ao inserir remédio no Supabase:", error);
          setDbError({ message: error.message, code: error.code, table: "remedios" });
          return; // Strictly stop and do not add local backup
        } else if (data && data[0]) {
          setDbError(null);
          const newItem = {
            id: data[0].id.toString(),
            label: data[0].label,
            checked: !!data[0].checked,
            time: data[0].time
          };
          setItems(prev => [...prev, newItem]);
        }
      } catch (err: any) {
        console.error("Erro ao tentar salvar remédio no Supabase:", err);
        setDbError({ message: err.message || String(err), table: "remedios" });
        return; // Strictly stop and do not add local backup
      }
    } else {
      // Offline/Demo Mode
      const newItem = {
        id: "rem-custom-" + Date.now(),
        label: labelVal,
        checked: false,
        time: timeVal
      };
      setItems(prev => [...prev, newItem]);
    }

    setCustomText("");
    setCustomTime("");
    // Default to unselected (empty array)
    setSelectedDays([]);
  };

  const clearAllChecked = async () => {
    const backupItems = [...items];
    setItems(prev => prev.map(item => ({ ...item, checked: false })));

    if (isSupabaseConfigured && user && !user.isDemo) {
      try {
        const { error } = await supabase
          .from("remedios")
          .update({ checked: false })
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Erro ao resetar tomados no Supabase, revertendo:", error);
          setDbError({ message: error.message, code: error.code, table: "remedios" });
          setItems(backupItems);
        } else {
          setDbError(null);
        }
      } catch (e: any) {
        console.error("Erro ao resetar tomados no Supabase, revertendo:", e);
        setDbError({ message: e.message || String(e), table: "remedios" });
        setItems(backupItems);
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    const backupItems = [...items];
    setItems(prev => prev.filter(item => item.id !== id));

    if (isSupabaseConfigured && user && !user.isDemo) {
      try {
        const { error } = await supabase
          .from("remedios")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);
        
        if (error) {
          const numericId = parseInt(id, 10);
          let finalErr = error;
          let success = false;
          if (!isNaN(numericId)) {
            const { error: error2 } = await supabase
              .from("remedios")
              .delete()
              .eq("id", numericId)
              .eq("user_id", user.id);
            if (!error2) {
              success = true;
            } else {
              finalErr = error2;
            }
          }
          if (!success) {
            setDbError({ message: finalErr.message, code: finalErr.code, table: "remedios" });
            setItems(backupItems);
          } else {
            setDbError(null);
          }
        } else {
          setDbError(null);
        }
      } catch (e: any) {
        console.error("Erro ao deletar remedio, revertendo:", e);
        setDbError({ message: e.message || String(e), table: "remedios" });
        setItems(backupItems);
      }
    }
  };

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none">
      <div className="space-y-2">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
          <button
            id="rem-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-emerald-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <span className="text-xl">💊</span>
            <span>Meus Remédios</span>
          </span>
        </div>

        {/* Database Sync Advisory Info */}
        {dbError && (
          <div className="bg-rose-50 rounded-2xl p-4 border-2 border-rose-200 text-left space-y-3 transition-all shadow-sm">
            <div className="flex items-center gap-2 font-black text-rose-900 text-sm">
              <span className="inline-block w-3 h-3 bg-rose-500 rounded-full animate-pulse shrink-0" />
              <span>Erro de Permissão (RLS) do Supabase Detectado!</span>
            </div>
            
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              O aplicativo está configurado para salvar <strong className="text-rose-900">exclusivamente na nuvem</strong> do seu Supabase, sem contingência local. Porém, seu banco de dados bloqueou o salvamento devido às políticas de segurança (Row Level Security):
              <br />
              <code className="block bg-rose-100 text-rose-900 p-2 rounded-xl font-mono text-[11px] leading-tight break-all mt-1.5">{dbError.message}</code>
            </p>

            <div className="bg-slate-900 hover:bg-slate-950 text-slate-100 p-3 rounded-2xl space-y-2 border border-slate-800 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Como corrigir em 1 minuto:</span>
                <button
                  type="button"
                  onClick={() => {
                    const sqlText = `-- 1. CRIAR AS TABELAS NO SUPABASE SE ELAS NÃO EXISTIREM
CREATE TABLE IF NOT EXISTS public.remedios (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid NOT NULL,
    label text NOT NULL,
    checked boolean DEFAULT false,
    "time" text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agendamentos (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid NOT NULL,
    label text NOT NULL,
    checked boolean DEFAULT false,
    "when" text NOT NULL
);

-- 2. HABILITAR SEGURANÇA (RLS)
ALTER TABLE public.remedios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS DE PERMISSÃO RLS (DE ACESSO LIVRE SEGURO)
-- O aplicativo já filtra os dados de cada id de usuário no código do front-end (.eq("user_id", ID)), 
-- portanto a política abaixo garante que a operação nunca seja bloqueada por desalinhamento ou expiração de token.
DROP POLICY IF EXISTS "Acesso total aos remédios" ON public.remedios;
CREATE POLICY "Acesso total aos remédios" ON public.remedios
    FOR ALL TO public
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total aos agendamentos" ON public.agendamentos;
CREATE POLICY "Acesso total aos agendamentos" ON public.agendamentos
    FOR ALL TO public
    USING (true)
    WITH CHECK (true);`;
                    
                    try {
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(sqlText);
                      } else {
                        const textarea = document.createElement("textarea");
                        textarea.value = sqlText;
                        textarea.style.position = "absolute";
                        textarea.style.opacity = "0";
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                      }
                      setSqlCopied(true);
                      setTimeout(() => setSqlCopied(false), 3000);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    sqlCopied 
                      ? "bg-emerald-600 border border-emerald-700 text-white" 
                      : "bg-sky-600 hover:bg-sky-500 border border-sky-700 text-white shadow-xs"
                  }`}
                >
                  {sqlCopied ? "Copiado! ✅" : "Copiar Script SQL 📋"}
                </button>
              </div>
              <p className="text-[10px] text-slate-300 leading-normal">
                Clique no botão acima, vá no painel do seu <strong className="text-white">Supabase Dashboard &gt; SQL Editor</strong>, abra uma nova consulta (New Query), cole esse script e clique em <strong className="text-emerald-400">Run</strong> para liberar instantaneamente!
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Medicines Container */}
        <div className="bg-emerald-50/50 border-2 border-emerald-100 rounded-2xl p-3 space-y-2 shadow-xs">
          <div className="flex justify-between items-center border-b border-emerald-200/50 pb-1">
            <div className="text-left">
              <span className="block text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider leading-none">Controle de Horários</span>
              <h4 className="text-base font-black text-slate-950 mt-0.5">Remédios de Hoje</h4>
            </div>
            <button
              id="clear-remedios-checked-btn"
              onClick={clearAllChecked}
              className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-lg font-black text-[10px] shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Limpar tomados
            </button>
          </div>

          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
            {items.length === 0 ? (
              <div className="text-center py-6 text-slate-400 font-bold text-xs leading-normal">
                Nenhum remédio cadastrado ainda.<br />Digite o nome e a hora abaixo para adicionar!
              </div>
            ) : (
              items.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    item.checked 
                      ? "bg-white/80 border-emerald-300 text-slate-400" 
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <div
                    id={`chk-remedios-${item.id}`}
                    onClick={() => toggleCheck(item.id)}
                    className="flex-1 text-left flex items-center gap-2 cursor-pointer"
                  >
                    <div className="shrink-0">
                      {item.checked ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-slate-50" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <span className={`block font-bold text-sm text-slate-900 leading-tight ${item.checked ? "line-through opacity-60" : ""}`}>
                        {item.label}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="inline-flex items-center gap-0.5 bg-sky-50 border border-sky-100 px-1.5 py-0.5 rounded text-[10px] font-black text-sky-850 uppercase leading-none">
                          ⏰ {parseTimeAndDays(item.time).time}
                        </span>
                        <span className="inline-flex items-center gap-0.5 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded text-[10px] font-black text-emerald-850 uppercase leading-none">
                          📅 {parseTimeAndDays(item.time).days}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 font-extrabold text-[10px] px-1.5 py-0.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer shrink-0 ml-1"
                  >
                    Excluir
                  </button>
                </div>
              ))
            )}
          </div>

          {/* New Custom reminder row with compact input + time select/input */}
          <form onSubmit={handleAddNewItem} className="space-y-2 pt-1.5 border-t border-emerald-200/30 text-left">
            <div className="flex gap-1.5">
              <div className="flex-1">
                <label className="block text-[9px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5 leading-none">Nome do Remédio</label>
                <input
                  id="new-remedio-input"
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ex: Paracetamol, Losartana..."
                  className="w-full text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-left bg-white text-slate-800"
                />
              </div>
              <div className="w-28">
                <label className="block text-[9px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5 leading-none text-center">Horário</label>
                <input
                  id="new-remedio-time"
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-center bg-white text-slate-800"
                />
              </div>
            </div>

            {/* Weekdays selectors */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-0.5">
                <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wide leading-none font-sans">Dias que precisa tomar:</span>
                <button
                  type="button"
                  onClick={() => {
                    if (selectedDays.length === 7) {
                      setSelectedDays([]);
                    } else {
                      setSelectedDays(["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]);
                    }
                  }}
                  className="text-[9.5px] text-emerald-800 hover:text-emerald-950 underline font-black cursor-pointer leading-none"
                >
                  {selectedDays.length === 7 ? "Limpar" : "Todos os Dias"}
                </button>
              </div>
              <div className="flex gap-1 justify-between">
                {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(day => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        setSelectedDays(prev => 
                          prev.includes(day) 
                            ? prev.filter(d => d !== day) 
                            : [...prev, day]
                        );
                      }}
                      className={`flex-1 text-[10px] font-black py-1 rounded-lg border-2 transition-all cursor-pointer text-center leading-tight ${
                        isSelected 
                          ? "bg-emerald-600 border-emerald-700 text-white shadow-xs" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              id="add-remedio-btn"
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-1.5 rounded-xl border border-emerald-800 text-xs shadow-sm cursor-pointer whitespace-nowrap active:scale-95 transition-all text-center font-sans"
            >
              + Adicionar Novo Remédio à Lista
            </button>
          </form>
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Tem dúvidas se um remédio corta o efeito de outro?
        </p>
        <button
          id="rem-ask-rafa-btn"
          onClick={() => onStartChat()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-emerald-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>PERGUNTAR AO PROF. RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 6. MODULE: AGENDAMENTOS (Consultas & Exames)
// 6. MODULE: AGENDAMENTOS (Consultas & Exames)
export function AgendamentosModule({ onGoBack, onStartChat, fontSizeLarge, user: passedUser }: Omit<ModuleScreenProps, "topicId">) {
  const [items, setItems] = useState<{ id: string; label: string; checked: boolean; when: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dbError, setDbError] = useState<{ message: string; code?: string; table?: string } | null>(null);
  const [sqlCopied, setSqlCopied] = useState(false);

  const [customText, setCustomText] = useState("");
  const [customWhen, setCustomWhen] = useState("");
  const [showPastCompleted, setShowPastCompleted] = useState(false);
  const [isPickerFocused, setIsPickerFocused] = useState(false);

  const getAppointmentDate = (whenStr: string): Date | null => {
    if (!whenStr) return null;
    const matchPtBr = whenStr.match(/(\d{2})\/([a-zA-ZçÇ]{3})\/(\d{4})/i);
    if (matchPtBr) {
      const day = parseInt(matchPtBr[1], 10);
      const monthAbbr = matchPtBr[2].toLowerCase();
      const year = parseInt(matchPtBr[3], 10);
      
      const months = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
      const monthIndex = months.indexOf(monthAbbr);
      
      if (monthIndex !== -1) {
        const timeMatch = whenStr.match(/às\s+(\d{2}):(\d{2})h/);
        const hours = timeMatch ? parseInt(timeMatch[1], 10) : 0;
        const minutes = timeMatch ? parseInt(timeMatch[2], 10) : 0;
        return new Date(year, monthIndex, day, hours, minutes);
      }
    }
    const d = new Date(whenStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const isTodayOrFuture = (itemDate: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return itemDate >= today;
  };

  const filteredItems = items.filter(item => {
    if (showPastCompleted) {
      return true;
    }
    const itemDate = getAppointmentDate(item.when);
    const isFuture = itemDate ? isTodayOrFuture(itemDate) : true;
    return isFuture && !item.checked;
  });

  const formatDateTimeToPtBr = (dateTimeStr: string) => {
    if (!dateTimeStr) return "Em definição";
    try {
      const date = new Date(dateTimeStr);
      if (isNaN(date.getTime())) return dateTimeStr;
      
      const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      
      const weekday = weekdays[date.getDay()];
      const day = date.getDate().toString().padStart(2, "0");
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      const hour = date.getHours().toString().padStart(2, "0");
      const minute = date.getMinutes().toString().padStart(2, "0");
      
      return `${weekday}, ${day}/${month}/${year} às ${hour}:${minute}h`;
    } catch (e) {
      return dateTimeStr;
    }
  };

  const getStorageKey = (userId?: string) => {
    const activeId = userId || passedUser?.id || user?.id || "guest";
    return `senior_agendamentos_checklist_v2_${activeId}`;
  };

  const loadLocal = (userId?: string) => {
    const key = getStorageKey(userId);
    const local = localStorage.getItem(key);
    if (local) {
      try {
        setItems(JSON.parse(local));
        return;
      } catch (e) {}
    }
    setItems([]);
  };

  useEffect(() => {
    const init = async () => {
      try {
        let activeUser = passedUser;
        if (!activeUser && isSupabaseConfigured) {
          const { data: { user: currentUser } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));
          activeUser = currentUser;
        }
        setUser(activeUser);

        const userId = activeUser?.id || "guest";

        if (isSupabaseConfigured && activeUser && !activeUser.isDemo) {
          setLoading(true);
          const { data, error } = await supabase
            .from("agendamentos")
            .select("*")
            .eq("user_id", activeUser.id)
            .order("created_at", { ascending: true });
          
          if (error) {
            console.warn("Erro ao buscar agendamentos do Supabase:", error);
            setDbError({ message: error.message, code: error.code, table: "agendamentos" });
            setItems([]);
          } else {
            setDbError(null);
            if (data) {
              const mapped = data.map((d: any) => ({
                id: d.id.toString(),
                label: d.label,
                checked: !!d.checked,
                when: d.when
              }));
              setItems(mapped);
            } else {
              setItems([]);
            }
          }
        } else {
          loadLocal(userId);
        }
      } catch (e: any) {
        console.error("Erro ao inicializar agendamentos com Supabase:", e);
        setDbError({ message: e.message || String(e), table: "agendamentos" });
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [passedUser]);

  // Save changes to localStorage on any state update to keep local fallback in sync (ONLY in demo mode)
  useEffect(() => {
    const isDemo = !isSupabaseConfigured || (user && user.isDemo);
    if (isDemo) {
      const userId = passedUser?.id || user?.id || "guest";
      const key = getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(items));
    }
  }, [items, passedUser, user]);

  const toggleCheck = async (id: string) => {
    const targetItem = items.find(item => item.id === id);
    if (!targetItem) return;
    const newChecked = !targetItem.checked;

    // Optimistically update
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: newChecked } : item));

    if (isSupabaseConfigured && user && !user.isDemo) {
      try {
        const { error } = await supabase
          .from("agendamentos")
          .update({ checked: newChecked })
          .eq("id", id)
          .eq("user_id", user.id);
        
        if (error) {
          const numericId = parseInt(id, 10);
          let finalErr = error;
          let success = false;
          if (!isNaN(numericId)) {
            const { error: error2 } = await supabase
              .from("agendamentos")
              .update({ checked: newChecked })
              .eq("id", numericId)
              .eq("user_id", user.id);
            if (!error2) {
              success = true;
            } else {
              finalErr = error2;
            }
          }
          if (!success) {
            console.warn("Erro ao registrar toggle:", finalErr);
            setDbError({ message: finalErr.message, code: finalErr.code, table: "agendamentos" });
            // Revert state
            setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !newChecked } : item));
          } else {
            setDbError(null);
          }
        } else {
          setDbError(null);
        }
      } catch (e: any) {
        console.error("Erro ao salvar toggle no Supabase, revertendo:", e);
        setDbError({ message: e.message || String(e), table: "agendamentos" });
        // Revert state
        setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !newChecked } : item));
      }
    }
  };

  const handleAddNewItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const whenVal = formatDateTimeToPtBr(customWhen.trim());
    const labelVal = customText + " 📅";

    if (isSupabaseConfigured && user && !user.isDemo) {
      try {
        const { data, error } = await supabase
          .from("agendamentos")
          .insert({
            user_id: user.id,
            label: labelVal,
            checked: false,
            when: whenVal
          })
          .select();
        
        if (error) {
          console.error("Erro ao inserir agendamento no Supabase:", error);
          setDbError({ message: error.message, code: error.code, table: "agendamentos" });
          return; // Strictly stop and do not add to UI
        } else if (data && data[0]) {
          setDbError(null);
          const newItem = {
            id: data[0].id.toString(),
            label: data[0].label,
            checked: !!data[0].checked,
            when: data[0].when
          };
          setItems(prev => [...prev, newItem]);
        }
      } catch (err: any) {
        console.error("Erro ao tentar salvar agendamento no Supabase:", err);
        setDbError({ message: err.message || String(err), table: "agendamentos" });
        return; // Strictly stop and do not add to UI
      }
    } else {
      // Offline/Demo Mode
      const newItem = {
        id: "age-custom-" + Date.now(),
        label: labelVal,
        checked: false,
        when: whenVal
      };
      setItems(prev => [...prev, newItem]);
    }

    setCustomText("");
    setCustomWhen("");
  };

  const clearAllChecked = async () => {
    const backupItems = [...items];
    setItems(prev => prev.map(item => ({ ...item, checked: false })));

    if (isSupabaseConfigured && user && !user.isDemo) {
      try {
        const { error } = await supabase
          .from("agendamentos")
          .update({ checked: false })
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Erro ao resetar agendamentos no Supabase, revertendo:", error);
          setDbError({ message: error.message, code: error.code, table: "agendamentos" });
          setItems(backupItems);
        } else {
          setDbError(null);
        }
      } catch (e: any) {
        console.error("Erro ao resetar agendamentos no Supabase, revertendo:", e);
        setDbError({ message: e.message || String(e), table: "agendamentos" });
        setItems(backupItems);
      }
    }
  };

  const handleDeleteItem = async (id: string) => {
    const backupItems = [...items];
    setItems(prev => prev.filter(item => item.id !== id));

    if (isSupabaseConfigured && user && !user.isDemo) {
      try {
        const { error } = await supabase
          .from("agendamentos")
          .delete()
          .eq("id", id)
          .eq("user_id", user.id);
        
        if (error) {
          const numericId = parseInt(id, 10);
          let finalErr = error;
          let success = false;
          if (!isNaN(numericId)) {
            const { error: error2 } = await supabase
              .from("agendamentos")
              .delete()
              .eq("id", numericId)
              .eq("user_id", user.id);
            if (!error2) {
              success = true;
            } else {
              finalErr = error2;
            }
          }
          if (!success) {
            setDbError({ message: finalErr.message, code: finalErr.code, table: "agendamentos" });
            setItems(backupItems);
          } else {
            setDbError(null);
          }
        } else {
          setDbError(null);
        }
      } catch (e: any) {
        console.error("Erro ao deletar agendamento, revertendo:", e);
        setDbError({ message: e.message || String(e), table: "agendamentos" });
        setItems(backupItems);
      }
    }
  };

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none overflow-y-auto">
      <div className="space-y-2">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
          <button
            id="age-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-sky-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <span className="text-xl">🩺</span>
            <span>Agendamentos</span>
          </span>
        </div>

        {/* Database Sync Advisory Info */}
        {dbError && (
          <div className="bg-rose-50 rounded-2xl p-4 border-2 border-rose-200 text-left space-y-3 transition-all shadow-sm">
            <div className="flex items-center gap-2 font-black text-rose-900 text-sm">
              <span className="inline-block w-3 h-3 bg-rose-500 rounded-full animate-pulse shrink-0" />
              <span>Erro de Permissão (RLS) do Supabase Detectado!</span>
            </div>
            
            <p className="text-xs font-semibold text-slate-700 leading-relaxed">
              O aplicativo está configurado para salvar <strong className="text-rose-900">exclusivamente na nuvem</strong> do seu Supabase, sem contingência local. Porém, seu banco de dados bloqueou o salvamento devido às políticas de segurança (Row Level Security):
              <br />
              <code className="block bg-rose-100 text-rose-900 p-2 rounded-xl font-mono text-[11px] leading-tight break-all mt-1.5">{dbError.message}</code>
            </p>

            <div className="bg-slate-900 hover:bg-slate-950 text-slate-100 p-3 rounded-2xl space-y-2 border border-slate-800 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Como corrigir em 1 minuto:</span>
                <button
                  type="button"
                  onClick={() => {
                    const sqlText = `-- 1. CRIAR AS TABELAS NO SUPABASE SE ELAS NÃO EXISTIREM
CREATE TABLE IF NOT EXISTS public.remedios (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid NOT NULL,
    label text NOT NULL,
    checked boolean DEFAULT false,
    "time" text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.agendamentos (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid NOT NULL,
    label text NOT NULL,
    checked boolean DEFAULT false,
    "when" text NOT NULL
);

-- 2. HABILITAR SEGURANÇA (RLS)
ALTER TABLE public.remedios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS DE PERMISSÃO RLS (DE ACESSO LIVRE SEGURO)
-- O aplicativo já filtra os dados de cada id de usuário no código do front-end (.eq("user_id", ID)), 
-- portanto a política abaixo garante que a operação nunca seja bloqueada por desalinhamento ou expiração de token.
DROP POLICY IF EXISTS "Acesso total aos remédios" ON public.remedios;
CREATE POLICY "Acesso total aos remédios" ON public.remedios
    FOR ALL TO public
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Acesso total aos agendamentos" ON public.agendamentos;
CREATE POLICY "Acesso total aos agendamentos" ON public.agendamentos
    FOR ALL TO public
    USING (true)
    WITH CHECK (true);`;
                    
                    try {
                      if (navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(sqlText);
                      } else {
                        const textarea = document.createElement("textarea");
                        textarea.value = sqlText;
                        textarea.style.position = "absolute";
                        textarea.style.opacity = "0";
                        document.body.appendChild(textarea);
                        textarea.select();
                        document.execCommand("copy");
                        document.body.removeChild(textarea);
                      }
                      setSqlCopied(true);
                      setTimeout(() => setSqlCopied(false), 3000);
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    sqlCopied 
                      ? "bg-emerald-600 border border-emerald-700 text-white" 
                      : "bg-sky-600 hover:bg-sky-500 border border-sky-700 text-white shadow-xs"
                  }`}
                >
                  {sqlCopied ? "Copiado! ✅" : "Copiar Script SQL 📋"}
                </button>
              </div>
              <p className="text-[10px] text-slate-300 leading-normal">
                Clique no botão acima, vá no painel do seu <strong className="text-white">Supabase Dashboard &gt; SQL Editor</strong>, abra uma nova consulta (New Query), cole esse script e clique em <strong className="text-emerald-400">Run</strong> para liberar instantaneamente!
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Appointments Container */}
        <div className="bg-sky-50/50 border-2 border-sky-100 rounded-2xl p-3 space-y-2 shadow-xs">
          <div className="flex justify-between items-center border-b border-sky-200/50 pb-1">
            <div className="text-left">
              <span className="block text-[10px] font-extrabold text-sky-600 uppercase tracking-wider leading-none">Consultas e Exames</span>
              <h4 className="text-base font-black text-slate-950 mt-0.5">Próximas Datas</h4>
            </div>
            <button
              id="clear-agendamentos-checked-btn"
              onClick={() => setShowPastCompleted(prev => !prev)}
              className={`border px-2.5 py-1 rounded-lg font-black text-[10px] shadow-xs transition-colors cursor-pointer shrink-0 ${
                showPastCompleted 
                  ? "bg-sky-600 hover:bg-sky-700 text-white border-sky-700" 
                  : "bg-white hover:bg-sky-50 text-sky-700 border-sky-100"
              }`}
            >
              {showPastCompleted ? "Ocultar Concluídos" : "exibir concluídos"}
            </button>
          </div>

          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {filteredItems.length === 0 ? (
              <div className="text-center py-6 text-slate-400 font-bold text-xs leading-normal whitespace-pre-line">
                {items.length === 0 
                  ? "Nenhum agendamento cadastrado ainda.\nDigite o compromisso e a data/hora abaixo para adicionar!" 
                  : "Nenhum agendamento futuro pendente."}
              </div>
            ) : (
              filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    item.checked 
                      ? "bg-white/80 border-sky-300 text-slate-400" 
                      : "bg-white border-slate-200 text-slate-800"
                  }`}
                >
                  <div
                    id={`chk-agendamentos-${item.id}`}
                    onClick={() => toggleCheck(item.id)}
                    className="flex-1 text-left flex items-center gap-2 cursor-pointer"
                  >
                    <div className="shrink-0">
                      {item.checked ? (
                        <CheckCircle2 className="w-5 h-5 text-sky-600 fill-sky-50" />
                      ) : (
                        <div className="w-5 h-5 rounded border-2 border-slate-300 bg-slate-50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className={`block font-bold text-xs leading-none ${item.checked ? "line-through opacity-60" : ""}`}>
                        {item.label}
                      </span>
                      <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase mt-0.5">
                        Quando: {item.when}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 font-extrabold text-[10px] px-1.5 py-0.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer shrink-0 ml-1"
                  >
                    Excluir
                  </button>
                </div>
              ))
            )}
          </div>

          {/* New Custom reminder row with compact input + time select/input */}
          <form id="add-agendamento-form" onSubmit={handleAddNewItem} className="space-y-2 pt-1.5 border-t border-sky-200/30 text-left">
            <div className="space-y-1.5">
              <div>
                <label className="block text-[9px] font-bold text-sky-700 uppercase tracking-wide mb-0.5 leading-none">Compromisso ou Exame:</label>
                <input
                  id="new-agendamento-input"
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Ex: Cardiologista, Exame de Sangue..."
                  className="w-full text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-left bg-white text-slate-800"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-sky-700 uppercase tracking-wide mb-0.5 leading-none">Escolha a Data e Horário:</label>
                <input
                  id="new-agendamento-when"
                  type="datetime-local"
                  value={customWhen}
                  onChange={(e) => setCustomWhen(e.target.value)}
                  onFocus={() => setIsPickerFocused(true)}
                  onClick={() => setIsPickerFocused(true)}
                  onBlur={() => {
                    // Use a delay to let any click/touch events propagate cleanly
                    setTimeout(() => setIsPickerFocused(false), 500);
                  }}
                  className="w-full text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 bg-white text-slate-800 font-sans font-bold cursor-pointer"
                  required
                />
              </div>
            </div>
            {isPickerFocused && (
              <div className="h-72 w-full flex flex-col items-center justify-center border-2 border-dashed border-sky-300 bg-sky-50/50 rounded-2xl p-4 text-center animate-pulse transition-all duration-300 select-none">
                <span className="text-3xl mb-1">📅</span>
                <span className="block text-xs font-black text-sky-950">Escolha a data e hora no calendário acima</span>
                <span className="block text-[10px] font-bold text-slate-500 mt-1">O botão foi movido para o rodapé da tela para não ser coberto!</span>
              </div>
            )}
            {!isPickerFocused && (
              <button
                id="add-agendamento-btn"
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-1.5 rounded-xl border border-sky-800 text-xs shadow-sm cursor-pointer whitespace-nowrap active:scale-95 transition-all text-center font-sans"
              >
                + Adicionar Novo Compromisso
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Dynamic CTA with Rafa / Submit button at bottom if calendar is open */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        {isPickerFocused ? (
          <div className="space-y-1">
            <p className="text-emerald-700 text-[10px] font-black text-center uppercase tracking-wider leading-none animate-pulse">
              Calendário Aberto • Pronto para Salvar
            </p>
            <button
              form="add-agendamento-form"
              id="add-agendamento-btn-bottom"
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-emerald-800 text-xs shadow-xs cursor-pointer transition-all uppercase tracking-wider font-sans"
            >
              <span>+ Adicionar Novo Compromisso</span>
            </button>
          </div>
        ) : (
          <>
            <p className="text-slate-600 text-xs font-bold text-center leading-none">
              Quer saber quais exames de rotina pedir na próxima consulta médica?
            </p>
            <button
              id="age-ask-rafa-btn"
              onClick={() => onStartChat("Professor Rafa, quais exames de rotina eu devo pedir na consulta médica para manter a saúde preventiva?")}
              className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-sky-800 text-sm shadow-xs cursor-pointer transition-all font-sans"
            >
              <Mic className="w-4 h-4 shrink-0" />
              <span>PERGUNTAR AO PROF. RAFA</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// 7. MODULE: ALIMENTAÇÃO SAUDÁVEL (Nutrição & Hábitos para Seniores)
export function AlimentacaoModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const [selectedPlateSection, setSelectedPlateSection] = useState<"saladas" | "proteinas" | "carboidratos">("saladas");

  const plateSectionDetails = {
    saladas: {
      title: "🥗 50% METADE DO PRATO: Fibras & Vitaminas",
      badge: "Legumes e Verduras Frescas",
      desc: "Preencha metade do seu prato com saladas cruas e legumes cozidos de cores variadas (verde, laranja, vermelho). Eles oferecem vitaminas fundamentais, água e minerais que regulam a imunidade, a circulação dos seus vasos sanguíneos e mantêm o intestino saudável.",
      examples: "Exemplos: Alface, tomate, cenoura ralada, abobrinha, chuchu, beterraba ou couve refogada."
    },
    proteinas: {
      title: "🍗 25% UM QUARTO DO PRATO: Força Muscular",
      badge: "Proteínas Saudáveis",
      desc: "O corpo precisa de proteínas para manter a massa muscular e evitar a fraqueza nas pernas e braços. Escolha opções magras, macias e fáceis de mastigar para dar mais conforto e uma ótima digestão ao longo do dia.",
      examples: "Exemplos: Peito de frango desfiado, peixe assado, feijão fresco caldoso, ovos mexidos ou carne moída magra."
    },
    carboidratos: {
      title: "🥔 25% UM QUARTO DO PRATO: Emprego de Alta Energia",
      badge: "Carboidratos Saudáveis & Grãos",
      desc: "Eles são o combustível do seu corpo para caminhar, falar e raciocinar. Mas prefira os carboidratos complexos (integrais) ou raízes naturais, que liberam energia devagar sem causar picos repentinos de açúcar no seu sangue.",
      examples: "Exemplos: Arroz integral, mandioquinha cozida, purê de batata-doce, abóbora cabotiá ou macarrão integral."
    }
  };

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none font-sans">
      <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5">
          <button
            id="ali-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer animate-fade-in"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-emerald-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <span className="text-xl animate-bounce-slow">🍏</span>
            <span>Alimentação</span>
          </span>
        </div>

        {/* Regra de Ouro Descascar mais e desembrulhar menos */}
        <div className="bg-amber-50 border-2 border-amber-200 p-3 rounded-2xl space-y-1.5 text-left shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍌</span>
            <div className="leading-tight">
              <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Regra de Ouro</span>
              <p className="font-extrabold text-xs sm:text-sm text-amber-950">
                "Descascar mais e desembrulhar menos!"
              </p>
            </div>
          </div>
        </div>

        {/* Video placeholder */}
        <div className="bg-slate-900 rounded-[24px] p-3 text-center border-2 border-slate-800 shadow-md space-y-2 relative">
          <div className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full z-10 animate-fade-in">
            Dica do Rafa
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-inner relative bg-slate-950/90 flex flex-col items-center justify-center p-4 border border-slate-700/40">
            <div className="space-y-1.5 text-center px-2">
              <div className="mx-auto w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                <Play className="w-5 h-5 fill-current opacity-85 ml-0.5" />
              </div>
              <div className="space-y-0.5">
                <span className="block text-slate-200 text-[11px] font-black uppercase text-emerald-400">Vídeo de Alimentação</span>
                <p className="text-slate-300 text-[10px] font-bold leading-tight">
                  Vídeo sendo carregado... O link oficial do Professor Rafa será inserido aqui em breve!
                </p>
              </div>
            </div>
          </div>

          {/* Title under video */}
          <div className="text-left space-y-1.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-slate-100 text-xs font-black leading-none">🎥 Alimentação e Longevidade</h4>
          </div>
        </div>

        {/* INTERACTIVE PLATE VISUALIZER */}
        <div className="bg-white border-2 border-slate-100 rounded-[20px] p-3 text-left space-y-2.5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide leading-none">🍽️ O Prato Saudável Guia</h3>
            <p className="text-[10px] text-slate-500 font-bold leading-tight">Como dividir idealmente suas refeições principais? Toque em um dos grupos abaixo para ler as dicas:</p>
          </div>

          {/* Interactive Plate Shape */}
          <div className="flex justify-center items-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative w-36 h-36 rounded-full border-4 border-slate-200 flex overflow-hidden shadow-inner bg-white animate-fade-in">
              {/* Metade Esquerda: Saladas (50%) */}
              <button
                type="button"
                onClick={() => setSelectedPlateSection("saladas")}
                className={`w-1/2 h-full flex flex-col items-center justify-center transition-all ${
                  selectedPlateSection === "saladas"
                    ? "bg-emerald-500 text-white scale-[1.02] border-r-2 border-white z-10"
                    : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border-r border-slate-200"
                }`}
                aria-label="Selecionar Saladas e Legumes"
              >
                <span className="text-xl">🥗</span>
                <span className="text-[10px] font-black uppercase">50%</span>
                <span className="text-[8px] font-bold">Verduras</span>
              </button>

              {/* Metade Direita Dividida em duas */}
              <div className="w-1/2 h-full flex flex-col">
                {/* Quadrante Superior Direito: Proteínas (25%) */}
                <button
                  type="button"
                  onClick={() => setSelectedPlateSection("proteinas")}
                  className={`w-full h-1/2 flex flex-col items-center justify-center transition-all ${
                    selectedPlateSection === "proteinas"
                      ? "bg-orange-500 text-white scale-[1.02] border-b-2 border-white z-10"
                      : "bg-orange-100 hover:bg-orange-200 text-orange-800 border-b border-slate-200"
                  }`}
                  aria-label="Selecionar Proteínas"
                >
                  <span className="text-lg">🍗</span>
                  <span className="text-[10px] font-black">25%</span>
                  <span className="text-[8px] font-bold">Músculos</span>
                </button>

                {/* Quadrante Inferior Direito: Carboidratos (25%) */}
                <button
                  type="button"
                  onClick={() => setSelectedPlateSection("carboidratos")}
                  className={`w-full h-1/2 flex flex-col items-center justify-center transition-all ${
                    selectedPlateSection === "carboidratos"
                      ? "bg-amber-500 text-white scale-[1.02] z-10"
                      : "bg-amber-100 hover:bg-amber-200 text-amber-800"
                  }`}
                  aria-label="Selecionar Carboidratos"
                >
                  <span className="text-lg">🥔</span>
                  <span className="text-[10px] font-black">25%</span>
                  <span className="text-[8px] font-bold">Energia</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dinâmic Plate Tip Content Display Box */}
          <div className={`p-2.5 rounded-xl border-l-4 text-left transition-all ${
            selectedPlateSection === "saladas" ? "bg-emerald-50/60 border-emerald-500 text-emerald-950" :
            selectedPlateSection === "proteinas" ? "bg-orange-50/60 border-orange-500 text-orange-950" :
            "bg-amber-50/60 border-amber-500 text-amber-950"
          }`}>
            <span className={`inline-block text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full mb-1 ${
              selectedPlateSection === "saladas" ? "bg-emerald-100 text-emerald-800" :
              selectedPlateSection === "proteinas" ? "bg-orange-100 text-orange-800" :
              "bg-amber-100 text-amber-800"
            }`}>
              {plateSectionDetails[selectedPlateSection].badge}
            </span>
            <h4 className="font-black text-xs leading-snug">{plateSectionDetails[selectedPlateSection].title}</h4>
            <p className="text-[11px] text-slate-700 leading-relaxed font-semibold mt-1">
              {plateSectionDetails[selectedPlateSection].desc}
            </p>
            <p className="text-[10px] text-slate-500 font-bold leading-normal mt-1 pt-1 border-t border-slate-200/40">
              💡 {plateSectionDetails[selectedPlateSection].examples}
            </p>
          </div>
        </div>

        {/* Aviso Importante at the end */}
        <div className="bg-red-50/60 border border-red-100 p-3 rounded-2xl text-left">
          <p className="text-[10px] text-red-950 font-bold leading-normal">
            ⚠️ <strong>Aviso Importante:</strong> Se você possui algum tipo de distúrbio alimentar, lembre-se de procurar a orientação de um médico especialista (nutricionista, endocrinologista ou nutrólogo) para um acompanhamento seguro e personalizado.
          </p>
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0 animate-fade-in">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Precisa de ajuda para montar o cardápio da semana ou tem restrições alimentares?
        </p>
        <button
          id="ali-ask-rafa-btn"
          onClick={() => onStartChat("Rafa, me dê dicas de almoço saudável e fácil de digerir para hoje!")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-emerald-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>PERGUNTAR AO PROF. RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 8. MODULE: VÍDEOS DO PROF. RAFA (Vídeos & Shorts do Youtube)
export function VideosModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const videosList = [
    {
      id: "v1",
      title: "Saia do sedentarismo agora!",
      desc: "Comece a movimentar seu corpo hoje mesmo com pequenos passos que fazem uma enorme diferença.",
      duration: "1:00",
      url: "https://www.youtube.com/embed/kSktihO1CrY",
      emoji: "💪",
      color: "from-rose-500 to-orange-500",
      category: "Vida Ativa"
    },
    {
      id: "v2",
      title: "Treine 30 minutos e perca 300 calorias.",
      desc: "Dicas de exercícios práticos e eficientes para manter seu metabolismo ativo e queimar calorias.",
      duration: "0:59",
      url: "https://www.youtube.com/embed/QI8Mk0ZgDkg",
      emoji: "🔥",
      color: "from-emerald-500 to-teal-500",
      category: "Exercício Físico"
    },
    {
      id: "v3",
      title: "03 Pilares Básicos!",
      desc: "Descubra os três fundamentos indispensáveis recomendados pelo Prof. Rafa para viver melhor.",
      duration: "0:55",
      url: "https://www.youtube.com/embed/CR61Cof1W-Q",
      emoji: "🌟",
      color: "from-sky-500 to-indigo-500",
      category: "Longevidade"
    },
    {
      id: "v4",
      title: "Avaliação auditiva!",
      desc: "Faça um rápido teste auditivo focado em autoconhecimento e bem-estar sensorial.",
      duration: "1:00",
      url: "https://www.youtube.com/embed/VCAx5JHkSLE",
      emoji: "👂",
      color: "from-purple-500 to-pink-500",
      category: "Saúde Integral"
    }
  ];

  const [visitedVideos, setVisitedVideos] = useState<Record<string, boolean>>(() => {
    const cached = localStorage.getItem("senior_videos_watched");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return {};
  });

  const [activeVideoId, setActiveVideoId] = useState<string>("v1");

  useEffect(() => {
    localStorage.setItem("senior_videos_watched", JSON.stringify(visitedVideos));
  }, [visitedVideos]);

  const toggleWatched = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const willBeDone = !visitedVideos[id];
    setVisitedVideos(prev => ({
      ...prev,
      [id]: willBeDone
    }));

    if (willBeDone) {
      const currentIndex = videosList.findIndex(v => v.id === id);
      if (currentIndex !== -1 && currentIndex < videosList.length - 1) {
        const nextId = videosList[currentIndex + 1].id;
        setActiveVideoId(nextId);
      }
    }
  };

  const activeVideo = videosList.find(v => v.id === activeVideoId) || videosList[0];
  const watchedCount = Object.values(visitedVideos).filter(Boolean).length;
  const progressPercent = Math.round((watchedCount / videosList.length) * 100);

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none">
      <div className="space-y-3">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5 font-sans">
          <button
            id="vid-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer animate-fade-in"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-rose-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <span className="text-xl animate-bounce-slow">🎥</span>
            <span>Estúdio do Rafa</span>
          </span>
        </div>

        {/* Video Tutorial Stats Card */}
        <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-100 p-2.5 rounded-2xl space-y-1 text-slate-800 text-left">
          <p className="font-bold text-xs leading-normal text-rose-950">
            Assista aos conselhos rápidos do Professor Rafa e marque os que concluiu para acompanhar seus aprendizados!
          </p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs font-black text-rose-900">Progresso de Vídeos:</span>
            <span className="text-xs font-black text-rose-800 bg-white border border-rose-100 px-2 py-0.5 rounded-full">
              {progressPercent}% Visto ({watchedCount}/{videosList.length})
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden mt-1 border border-slate-200">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* ACTIVE EMBED PLAYER */}
        <div className="bg-slate-900 rounded-[28px] p-4 text-center border-4 border-slate-800 shadow-lg space-y-3 relative overflow-hidden">
          <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full z-10 animate-pulse">
            Reproduzindo • Shorts
          </div>
          
          {/* Video IFrame Container with correct aspect ratio for portrait Shorts video */}
          <div className="w-[180px] sm:w-[200px] aspect-[9/16] mx-auto rounded-2xl overflow-hidden shadow-2xl relative bg-black/90 group border-2 border-slate-700/50">
            <iframe
              key={activeVideo.id} // Re-mount iframe when video changes
              src={activeVideo.url}
              title={activeVideo.title}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Active Video Info */}
          <div className="text-left space-y-1 pt-1.5 border-t border-slate-800/80">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-rose-400 font-extrabold uppercase tracking-wide">
                🧭 {activeVideo.category}
              </span>
              <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-1.5 py-0.5 rounded-md">
                Duração: {activeVideo.duration}
              </span>
            </div>
            <h4 className="text-slate-100 text-sm font-black leading-tight">{activeVideo.emoji} {activeVideo.title}</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed font-semibold">
              {activeVideo.desc}
            </p>

            <button
              onClick={(e) => toggleWatched(activeVideo.id, e)}
              className={`w-full h-8 mt-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-xs border transition-all ${
                visitedVideos[activeVideo.id]
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-700 pointer-events-auto cursor-pointer"
                  : "bg-white hover:bg-slate-100 text-slate-800 border-slate-200 pointer-events-auto cursor-pointer"
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${visitedVideos[activeVideo.id] ? "text-white" : "text-slate-400"}`} />
              <span>{visitedVideos[activeVideo.id] ? "Marcar como não assistido" : "Marcar como Concluído / Visto"}</span>
            </button>
          </div>
        </div>

        {/* VIDEOS SELECTOR LIST */}
        <div className="space-y-1.5 text-left font-sans">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide px-1">Selecione para Assistir:</h3>
          <div className="grid grid-cols-1 gap-2">
            {videosList.map((video) => {
              const isActive = activeVideoId === video.id;
              const isWatched = visitedVideos[video.id];
              return (
                <div
                  key={video.id}
                  onClick={() => setActiveVideoId(video.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setActiveVideoId(video.id);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`p-2.5 rounded-[18px] border-2 text-left flex items-start gap-3 transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-rose-50/50 border-rose-300 shadow-sm"
                      : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  {/* Thumbnail Simulator */}
                  <div className={`w-12 h-16 rounded-[10px] shrink-0 bg-gradient-to-br ${video.color} text-white flex flex-col items-center justify-center text-xl shadow-xs relative overflow-hidden`}>
                    <span className="z-10">{video.emoji}</span>
                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-white opacity-90" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="block text-[10px] text-slate-500 font-extrabold leading-none mb-1">
                      {video.category} • {video.duration}
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-800 truncate leading-none mb-0.5">
                      {video.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 font-medium">
                      {video.desc}
                    </p>
                  </div>

                  {/* Watched Status Badge */}
                  <button
                    onClick={(e) => toggleWatched(video.id, e)}
                    className="absolute right-2.5 top-2.5 h-6 w-6 flex items-center justify-center cursor-pointer rounded-full hover:bg-slate-100 text-slate-700"
                    aria-label={isWatched ? "Marcar como não assistido" : "Marcar como assistido"}
                  >
                    <CheckCircle2 className={`w-5 h-5 ${isWatched ? "text-emerald-600 fill-emerald-100" : "text-slate-300"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic CTA asking for voice help */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0 font-sans">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Tem dúvidas ou quer ajuda guiada em áudio para estes exercícios?
        </p>
        <button
          id="vid-ask-rafa-btn"
          onClick={() => onStartChat("Rafa, quero fazer os alongamentos em vídeo junto com você! Pode me guiar em uma contagem?")}
          className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-rose-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>FALAR COM PROFESSOR RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 9. MODULE: PREVENÇÃO DE ACIDENTES (Dicas cruciais e vídeos educativos)
export function PrevencaoModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const topics = [
    {
      id: "quedas",
      title: "Quedas",
      emoji: "⚠️",
      category: "Segurança em Casa",
      color: "from-amber-500 to-orange-500",
      desc: "Evite escorregões e tombos mantendo o caminho livre de tapetes e muito bem iluminado.",
      videoUrl: "", // Awaiting official link
      guidelines: [
        "Prefira sapatos fechados com sola de borracha antiderrapante.",
        "Mantenha uma lâmpada ou tomada de luz piloto acesa no corredor para a noite.",
        "Instale barras de apoio no banheiro ao lado do vaso sanitário e dentro do box.",
        "Mantenha os fios e objetos fora das áreas de passagem mais frequentes."
      ]
    },
    {
      id: "pressao-alta",
      title: "Pressão Alta e Exercício",
      emoji: "❤️",
      category: "Saúde Cardiovascular",
      color: "from-rose-500 to-red-500",
      desc: "Orientações importantes sobre como exercitar-se de forma segura se você tem hipertensão.",
      videoUrl: "", // Awaiting official link
      guidelines: [
        "Verifique a pressão antes de iniciar. Evite treinar se estiver acima de 14 por 9.",
        "Comece sempre com um aquecimento leve (como caminhar devagar por 5 minutos).",
        "Mantenha a respiração contínua: nunca prenda o ar enquanto faz força.",
        "Se sentir tontura, dor de cabeça forte ou falta de ar, pare imediatamente."
      ]
    },
    {
      id: "glicemia-alta",
      title: "Glicemia Alta e Exercícios",
      emoji: "📈",
      category: "Controle de Diabetes",
      color: "from-pink-500 to-rose-500",
      desc: "O que fazer quando o nível de açúcar no sangue estiver alto antes de praticar atividades.",
      videoUrl: "", // Awaiting official link
      guidelines: [
        "Se a glicemia estiver acima de 250 mg/dl, evite realizar treinos intensos no dia.",
        "Beba bastante água fresca para ajudar os rins a eliminar o excesso de glicose.",
        "Dê preferência a caminhadas bem leves e tranquilas se o açúcar estiver moderadamente alto.",
        "Consulte seu médico para ajustar as doses de insulina ou remédio antes de exercícios."
      ]
    },
    {
      id: "glicemia-baixa",
      title: "Glicemia Baixa e Exercícios",
      emoji: "📉",
      category: "Prevenção de Hipoglicemia",
      color: "from-amber-650 to-yellow-500",
      desc: "Como evitar tonturas e fraquezas graves por queda de glicose durante o esforço.",
      videoUrl: "", // Awaiting official link
      guidelines: [
        "Nunca faça exercícios físicos em jejum total.",
        "Coma uma pequena fruta rústica ou biscoito 30 minutos antes de se movimentar.",
        "Tenha sempre um sachê de mel ou bala de açúcar por perto para emergências.",
        "Sinais de alerta: suor frio, tremores, tontura repentina e palpitação."
      ]
    },
    {
      id: "banho-quente",
      title: "Banho Muito Quente no Inverno",
      emoji: "🚿",
      category: "Proteção Térmica",
      color: "from-sky-500 to-indigo-500",
      desc: "O perigo do choque térmico e quedas bruscas de pressão no banho aquecido no frio.",
      videoUrl: "", // Awaiting official link
      guidelines: [
        "A água extremamente quente gera vapor que abaixa a pressão, podendo causar desmaios.",
        "Mantenha a temperatura regulada para morna agradável, nunca fervendo.",
        "Evite sair do banheiro quente direto para um ambiente totalmente gelado (resfriamento brusco).",
        "Se possível, use banquetas plásticas higiênicas antiderrapantes dentro do box para tomar banho sentado."
      ]
    },
    {
      id: "engasgos",
      title: "Engasgos",
      emoji: "🗣️",
      category: "Deglutição Segura",
      color: "from-teal-500 to-emerald-500",
      desc: "Como se alimentar de forma calma e segura e o que fazer em caso de engasgo.",
      videoUrl: "", // Awaiting official link
      guidelines: [
        "Coma sentado à mesa de forma ereta, nunca deitado ou recostado no sofá.",
        "Corte os alimentos sólidos em pedaços bem pequenos e mastigue exaustivamente.",
        "Evite falar ou dar risadas enquanto estiver com alimentos na boca.",
        "Alimentos perigosos: carnes desfiadas secas, pão fresco amassado e comprimidos grandes inteiros."
      ]
    }
  ];

  const [activeTopicId, setActiveTopicId] = useState<string>("quedas");
  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none font-sans">
      <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5">
          <button
            id="prev-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-rose-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <span className="text-xl animate-pulse">🛡️</span>
            <span>Prevenção de Acidentes</span>
          </span>
        </div>

        {/* ACTIVE ORIENTATIVE PLAYER & COMPAS GUIDE */}
        <div className="bg-slate-900 rounded-[24px] p-3 text-center border-2 border-slate-800 shadow-md space-y-2.5 relative">
          <div className="absolute top-2 left-2 bg-rose-600/90 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full z-10 animate-fade-in">
            {activeTopic.category}
          </div>

          {/* Video Placeholder Box mimicking standard player waiting for actual sequence URL links */}
          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-inner relative bg-slate-950/90 flex flex-col items-center justify-center p-4 border border-slate-700/40">
            {activeTopic.videoUrl ? (
              <iframe
                src={activeTopic.videoUrl}
                title={activeTopic.title}
                className="w-full h-full object-cover absolute inset-0"
                allowFullScreen
              />
            ) : (
              <div className="space-y-1.5 text-center px-2">
                <div className="mx-auto w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-450">
                  <Play className="w-5 h-5 fill-current opacity-85 ml-0.5" />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-slate-200 text-[11px] font-black uppercase text-rose-400">Vídeo Educativo</span>
                  <p className="text-slate-300 text-[10px] font-bold leading-tight">
                    Aguardando o link de vídeo do Professor Rafa para carregar a sequência oficial aqui nesta tela!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Guidelines under active topic */}
          <div className="text-left space-y-1.5 pt-2 border-t border-slate-800/80">
            <h4 className="text-slate-100 text-xs font-black leading-none">{activeTopic.emoji} Guia de Prevenção: {activeTopic.title}</h4>
          </div>
        </div>

        {/* TOPICS ACCORDION SELECTION */}
        <div className="space-y-1.5 text-left font-sans">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide px-1">Temas Disponíveis:</h3>
          <div className="grid grid-cols-1 gap-1.5">
            {topics.map((t) => {
              const isActive = activeTopicId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTopicId(t.id)}
                  className={`p-2.5 rounded-[18px] border-2 text-left flex items-start gap-3 transition-all cursor-pointer relative ${
                    isActive
                      ? "bg-rose-50/50 border-rose-300 shadow-sm"
                      : "bg-white border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl shrink-0 bg-gradient-to-br ${t.color} text-white flex flex-col items-center justify-center text-lg shadow-2xs`}>
                    <span>{t.emoji}</span>
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <span className="block text-[8px] text-slate-400 font-extrabold leading-none mb-1 uppercase tracking-wider">
                      {t.category}
                    </span>
                    <h5 className="font-extrabold text-xs text-slate-800 leading-none mb-1">
                      {t.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-snug font-medium line-clamp-1">
                      {t.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic CTA asking for voice help */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0 font-sans">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Quer tirar dúvidas de segurança ou pedir dicas para adaptar seu quarto/banheiro?
        </p>
        <button
          id="prev-ask-rafa-btn"
          onClick={() => onStartChat("Professor Rafa, quero dicas de como reorganizar minha casa para evitar quedas e torná-la mais segura!")}
          className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-rose-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>FALAR COM PROFESSOR RAFA</span>
        </button>
      </div>
    </div>
  );
}
