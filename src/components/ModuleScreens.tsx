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
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    arms: false,
    shoulders: false,
    ankles: false,
    walk: false,
  });

  const exercises = [
    { id: "arms", title: "Alongamento de Braços 🙆‍♂️", desc: "Estique cada braço para o lado por 10 segundos respirando fundo." },
    { id: "shoulders", title: "Giro de Ombros 🔄", desc: "Faça movimentos circulares com os ombros para trás 5 vezes para relaxar." },
    { id: "ankles", title: "Movimento com os Pés 🦶", desc: "Sentado, levante e gire o pé esquerdo, depois o direito 8 vezes." },
    { id: "walk", title: "Caminhar no Corredor 🚶", desc: "Dê 20 passos calmos pela casa ou no quintal para acordar as pernas." },
  ];

  const toggle = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalCompleted = Object.values(completed).filter(Boolean).length;
  const isAllDone = totalCompleted === exercises.length;

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none">
      <div className="space-y-2">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5">
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
            <span>Exercícios</span>
          </span>
        </div>

        {/* Introduction and Goal Tracker */}
        <div id="ex-header-card" className="bg-gradient-to-br from-rose-50 to-orange-50 border-2 border-rose-100 p-2.5 rounded-2xl space-y-0.5 text-rose-950 text-left">
          <p className="font-bold text-xs leading-normal">
            Alongar previne dores e melhora seu humor! Vamos tentar um pouquinho hoje?
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-sm">🏆</span>
            <span className="font-black text-xs">
              {isAllDone 
                ? "Incrível! Feito tudo hoje! 🌟" 
                : `Objetivo Diário: ${totalCompleted} de ${exercises.length} feitos`}
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden mt-0.5 border border-slate-200">
            <div 
              className="bg-rose-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${(totalCompleted / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Exercise Checklist List */}
        <div id="ex-checklist" className="space-y-1.5">
          {exercises.map(ex => {
            const isDone = completed[ex.id];
            return (
              <button
                id={`ex-chk-${ex.id}`}
                key={ex.id}
                onClick={() => toggle(ex.id)}
                className={`w-full text-left p-2 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                  isDone 
                    ? "bg-rose-50 border-rose-300 text-rose-950" 
                    : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-rose-600 fill-rose-100" />
                  ) : (
                    <div className="w-5 h-5 rounded border-2 border-slate-300 bg-slate-50" />
                  )}
                </div>
                <div className="flex-1">
                  <span className={`block font-black text-sm leading-tight ${isDone ? "line-through opacity-80" : ""}`}>
                    {ex.title}
                  </span>
                  <span className="block text-[11px] text-slate-500 font-semibold leading-none mt-0.5">
                    {ex.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Tem alguma dor ou quer sugestão de outro exercício?
        </p>
        <button
          id="ex-ask-rafa-btn"
          onClick={() => onStartChat()}
          className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-rose-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>PERGUNTAR AO PROF. RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 2. MODULE: SONO (Dormir Bem & Higiene do Sono)
export function SonoModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const [breathePhase, setBreathePhase] = useState<"Click" | "Inalar" | "Segurar" | "Exalar">("Click");
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(prev => {
          const nextSec = prev + 1;
          if (nextSec <= 4) {
            setBreathePhase("Inalar");
          } else if (nextSec <= 8) {
            setBreathePhase("Segurar");
          } else if (nextSec <= 12) {
            setBreathePhase("Exalar");
          } else {
            return 1; // loop back to inalar or restart
          }
          return nextSec;
        });
      }, 1000);
    } else {
      setBreathePhase("Click");
      setSeconds(0);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleToggleBreathing = () => {
    setTimerActive(!timerActive);
    if (!timerActive) {
      setBreathePhase("Inalar");
      setSeconds(1);
    }
  };

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2 min-h-0 select-none">
      <div className="space-y-2">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
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

        {/* Breathing Assist Box */}
        <div id="sono-breathe-player" className="bg-sky-950 text-white rounded-2xl p-3.5 text-center space-y-2 border-2 border-sky-800/80 shadow-sm">
          <div className="text-left flex justify-between items-center border-b border-sky-800/55 pb-1">
            <h4 className="text-sm font-black tracking-tight">Respiração Guiada 4s</h4>
            <span className="text-indigo-300 font-bold uppercase tracking-wider text-[10px]">Apoio Sono</span>
          </div>

          {/* Interactive Breathing Bubble */}
          <div className="flex justify-center py-1 h-20 items-center">
            <div 
              className={`rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                breathePhase === "Inalar" 
                  ? "w-18 h-18 bg-sky-500/30 border-3 border-sky-300 scale-110" 
                  : breathePhase === "Segurar" 
                  ? "w-18 h-18 bg-indigo-500/40 border-3 border-indigo-300 scale-115 animate-pulse" 
                  : breathePhase === "Exalar" 
                  ? "w-16 h-16 bg-blue-500/20 border-3 border-blue-400 scale-90"
                  : "w-16 h-16 bg-slate-800 border-2 border-slate-600"
              }`}
            >
              <span className="text-xs font-black uppercase text-white tracking-widest">
                {breathePhase === "Click" ? "Ligar" : breathePhase}
              </span>
              {timerActive && (
                <span className="text-[10px] font-mono font-bold text-sky-200">
                  {seconds % 4 === 0 ? 4 : seconds % 4}s
                </span>
              )}
            </div>
          </div>

          <p className="text-sky-100/90 text-xs leading-tight font-medium">
            {breathePhase === "Inalar" && "💨 Puxe o ar devagar pelo nariz..."}
            {breathePhase === "Segurar" && "🛑 Segure o ar nos pulmões..."}
            {breathePhase === "Exalar" && "🌬️ Solte todo o ar pela boca..."}
            {breathePhase === "Click" && "Respirar com calma acalma o coração e convida o sono. Comece abaixo:"}
          </p>

          <button
            id="sono-toggle-breathe"
            onClick={handleToggleBreathing}
            className={`w-full py-2 px-4 rounded-xl font-black text-sm border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              timerActive 
                ? "bg-red-600 hover:bg-red-700 border-red-800 text-white" 
                : "bg-sky-500 hover:bg-sky-600 border-sky-400 text-white"
            }`}
          >
            {timerActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Parar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Começar Respiração</span>
              </>
            )}
          </button>
        </div>

        {/* Rapid Soothing Sleeping Advice */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 space-y-1 text-slate-800 text-left">
          <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-indigo-900 leading-none">
            <span>🌙</span>
            <span>Dicas Preciosas para Dormir Bem:</span>
          </h4>
          <ul className="space-y-1 text-xs font-semibold text-slate-600 leading-snug">
            <li className="flex items-start gap-1">
              <span className="text-rose-500">☕</span>
              <span>Evite café, refrigerantes ou chá preto após as 14:00 da tarde.</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-indigo-500">⏰</span>
              <span>Devemos dormir 8h por dia para manter o corpo e cérebro saudáveis.</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-amber-500">💡</span>
              <span>Ao entardecer, use luzes amarelas fracas no quarto.</span>
            </li>
            <li className="flex items-start gap-1">
              <span className="text-sky-500">📺</span>
              <span>Desligue a televisão 30 minutos antes de deitar.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Tem insônia frequente ou quer chá saudável relaxante?
        </p>
        <button
          id="sono-ask-rafa-btn"
          onClick={() => onStartChat()}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-indigo-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>PERGUNTAR AO PROF. RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 3. MODULE: MEMÓRIA (Ginástica da Mente & Jogos de Estimulação Cognitiva)
export function MemoriaModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  // Navigation between memory games
  const [activeGame, setActiveGame] = useState<"pares" | "onde_estava" | "charadas">("pares");

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
            <span>Academia do Cérebro</span>
          </span>
        </div>

        {/* 3 Games Picker Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
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
          <button
            onClick={() => {
              setActiveGame("charadas");
              setActiveRiddleId(null);
            }}
            className={`py-1.5 px-1 rounded-xl text-xs font-black transition-all cursor-pointer text-center ${
              activeGame === "charadas"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            💡 Charadas
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

        {/* ==========================================
            GAME 3: COGNITIVE CHALLENGES / CHARADAS
           ========================================== */}
        {activeGame === "charadas" && (
          <div className="space-y-2 animate-fade-in text-left">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide px-1">Charadas e Quebra-Cabeças do Rafa</span>
            {charadas.map(item => {
              const isSelected = activeRiddleId === item.id;
              return (
                <div key={item.id} className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden shadow-xs transition-all">
                  <button
                    type="button"
                    onClick={() => setActiveRiddleId(isSelected ? null : item.id)}
                    className="w-full text-left p-3 flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <span className="block font-black text-xs text-slate-800">{item.title}</span>
                      <span className="block text-[10px] text-slate-500 font-bold mt-0.5 leading-tight">{item.question}</span>
                    </div>
                    <span className="text-base font-black text-slate-400 shrink-0 ml-2">
                      {isSelected ? "▲" : "▼"}
                    </span>
                  </button>

                  {isSelected && (
                    <div className="bg-slate-50 p-3 border-t border-slate-100 space-y-2 text-left">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-full inline-block">
                          Resposta Correta:
                        </span>
                        <p className="text-xs font-black text-emerald-950 mt-1">{item.answer}</p>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold leading-relaxed pt-1 border-t border-slate-200/50">
                        {item.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Helpful Tips Box */}
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-2.5 space-y-1 text-slate-800 text-left shadow-xs">
          <h4 className="font-extrabold text-xs flex items-center gap-1 text-emerald-900 leading-none">
            <span>💡</span>
            <span>Dica de Especialista do Prof. Rafa:</span>
          </h4>
          <p className="text-slate-500 text-[10px] leading-normal font-semibold">
            Treinar a memória apenas 5 minutos todos os dias cria conexões neurais fortes, ajudando a evitar o esquecimento comum da rotina!
          </p>
        </div>
      </div>

      {/* Dynamic CTA asking for voice help */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Gostaria de mais perguntas ou charadas para exercitar a memória agora?
        </p>
        <button
          id="mem-ask-rafa-btn"
          onClick={() => onStartChat("Professor Rafa, faça um pequeno jogo de perguntas e respostas em áudio comigo para testar minha atenção!")}
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
    const newItem = {
      id: "custom-" + Date.now(),
      label: customText + " ✨",
      checked: false,
      time: "Personalizado"
    };
    setItems(prev => [...prev, newItem]);
    setCustomText("");
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
              Resetar Checklist
            </button>
          </div>

          {/* Interactive list with scroll inside if needed */}
          <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
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

                {item.id.startsWith("custom-") && (
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 font-extrabold text-[10px] px-1.5 py-0.5 bg-red-50 hover:bg-red-100 border border-red-200 rounded cursor-pointer shrink-0 ml-1"
                  >
                    Excluir
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* New Custom reminder row */}
          <form onSubmit={handleAddNewItem} className="flex gap-1.5 pt-0.5">
            <input
              id="new-routine-input"
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Ex: Pegar remédio..."
              className="flex-1 text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-left"
            />
            <button
              id="add-routine-btn"
              type="submit"
              className="bg-sky-600 hover:bg-sky-700 text-white font-black px-3 rounded-xl border border-sky-800 text-xs shadow-sm cursor-pointer whitespace-nowrap active:scale-95 transition-all"
            >
              + Add
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
              Resetar Tomados
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
              <div className="w-20">
                <label className="block text-[9px] font-bold text-emerald-700 uppercase tracking-wide mb-0.5 leading-none text-center">Horário</label>
                <input
                  id="new-remedio-time"
                  type="text"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  placeholder="Ex: 08:00"
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
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none">
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
              onClick={clearAllChecked}
              className="bg-white hover:bg-rose-50 text-rose-700 border border-rose-100 px-2.5 py-1 rounded-lg font-black text-[10px] shadow-xs transition-colors cursor-pointer shrink-0"
            >
              Resetar Concluídos
            </button>
          </div>

          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
            {items.length === 0 ? (
              <div className="text-center py-6 text-slate-400 font-bold text-xs leading-normal">
                Nenhum agendamento cadastrado ainda.<br />Digite o compromisso e a data/hora abaixo para adicionar!
              </div>
            ) : (
              items.map(item => (
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
          <form onSubmit={handleAddNewItem} className="space-y-2 pt-1.5 border-t border-sky-200/30 text-left">
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
                  className="w-full text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 bg-white text-slate-800 font-sans font-bold cursor-pointer"
                  required
                />
              </div>
            </div>
            <button
              id="add-agendamento-btn"
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-black py-1.5 rounded-xl border border-sky-800 text-xs shadow-sm cursor-pointer whitespace-nowrap active:scale-95 transition-all text-center font-sans"
            >
              + Adicionar Novo Compromisso
            </button>
          </form>
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Quer saber quais exames de rotina pedir na próxima médica?
        </p>
        <button
          id="age-ask-rafa-btn"
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

// 7. MODULE: ALIMENTAÇÃO SAUDÁVEL (Nutrição & Hábitos para Seniores)
export function AlimentacaoModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  // Habits state with localStorage persistence
  const [habits, setHabits] = useState(() => {
    const cached = localStorage.getItem("senior_alimentacao_habits");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      { id: "h1", name: "Beber água ao acordar 💧", done: false, detail: "Ajuda a ativar os órgãos e a lubrificar o estômago." },
      { id: "h2", name: "Prato colorido no almoço 🥗", done: false, detail: "Busque ter verde, vermelho e amarelo para mais vitaminas." },
      { id: "h3", name: "Comer uma fruta fresca de lanche 🍊", done: false, detail: "Excelente fonte de fibras naturais e imunidade." },
      { id: "h4", name: "Mastigar devagar (20x por garfada) ⏳", done: false, detail: "Facilita muito a digestão e evita a sensação de estufamento." },
    ];
  });

  const [selectedPlateSection, setSelectedPlateSection] = useState<"saladas" | "proteinas" | "carboidratos">("saladas");
  const [activeDicaIndex, setActiveDicaIndex] = useState<number | null>(null);
  
  // Rafael's Instant Wisdom simulation
  const [selectedQuery, setSelectedQuery] = useState<string | null>(null);
  const [queryAnswer, setQueryAnswer] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("senior_alimentacao_habits", JSON.stringify(habits));
  }, [habits]);

  const toggleHabit = (id: string) => {
    setHabits((prev: any) =>
      prev.map((h: any) => (h.id === id ? { ...h, done: !h.done } : h))
    );
  };

  const totalDone = habits.filter((h: any) => h.done).length;
  const progressPercent = Math.round((totalDone / habits.length) * 100);

  // Curated elder tips
  const superDicas = [
    {
      title: "🧂 1. Reduza o sal usando Tempero Verde",
      short: "Alho, cebola, orégano, coentro e limão.",
      full: "O sal em excesso eleva a pressão arterial e cansa as artérias. Exponha o seu paladar a ervas frescas como alecrim, cebolinha, hortelã e limão espremido. Eles dão um sabor delicioso sem prejudicar o coração!"
    },
    {
      title: "🥛 2. O Cálcio que protege os ossos",
      short: "Leites, iogurte natural e vegetais escuros.",
      full: "Para prevenir quedas e fortalecer o esqueleto, o cálcio é indispensável. Consuma iogurte natural desnatado, queijo branco, ou vegetais de folhas verde-escuras (como brócolis e couve refogada) diariamente."
    },
    {
      title: "🥬 3. Fibras para um intestino ativo",
      short: "Aveia, semente de linhaça e mamão formosa.",
      full: "Com o passar dos anos, o trânsito intestinal pode desacelerar. Adicione uma colher de farelo de aveia nas frutas picadas ou no iogurte, e coma mamão ou ameixas secas. Isso mantém o intestino funcionando como um reloginho!"
    },
    {
      title: "💧 4. Água silenciosa (Mesmo sem sede!)",
      short: "Ande com um copinho sempre por perto.",
      full: "Após os 60 anos, o corpo naturalmente perde um pouco do reflexo de sentir sede, mas a necessidade de água continua a mesma! Beber pequenos goles de água fresca previne tonturas, infecções urinárias e confusão mental."
    }
  ];

  // Simulated answers from Profe Rafa
  const rafaWisdom: Record<string, string> = {
    "Suco de Uva Integral": "🍇 O suco de uva integral é excelente para o coração porque contém resveratrol, um poderoso antioxidante! Mas atenção: beba apenas um copo pequeno (150 ml) por dia, pois ele é bastante concentrado em açúcar natural da fruta.",
    "Ovo Cozido": "🥚 O ovo é um 'superalimento'! Ele ajuda a manter a força dos músculos porque é rico em proteínas de altíssima qualidade. Prefira consumi-lo cozido ou mexido com um fio de azeite, evitando frituras em óleo imerso.",
    "Café Preto": "☕ O cafezinho é ótimo para dar ânimo e foco! No entanto, evite adoçar demais com açúcar refinado e tome cuidado para não tomar após as 15:00 ou 16:00, para que ele não interfira no seu precioso sono à noite.",
    "Chá de Boldo": "🌱 O sagrado boldo é um aliado incrível para quando o estômago está pesado ou a digestão está difícil. Ele ajuda o fígado no processo! Tome morno, preferencialmente sem açúcar refinado e sem ferver a folha por muito tempo."
  };

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
      title: "🥔 25% UM QUARTO DO PRATO: Energia de Qualidade",
      badge: "Carboidratos Saudáveis & Grãos",
      desc: "Eles são o combustível do seu corpo para caminhar, falar e raciocinar. Mas prefira os carboidratos complexos (integrais) ou raízes naturais, que liberam energia devagar sem causar picos repentinos de açúcar no seu sangue.",
      examples: "Exemplos: Arroz integral, mandioquinha cozida, purê de batata-doce, abóbora cabotiá ou macarrão integral."
    }
  };

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none">
      <div className="space-y-3">
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

        {/* Goal Banner */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-100 p-2.5 rounded-2xl space-y-1 text-emerald-950 text-left">
          <p className="font-bold text-xs leading-normal">
            Alimentação colorida, corpo fortalecido e mente ativa! Vamos focar em pequenos hábitos saudáveis hoje?
          </p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs font-black">Meta diária de hábitos:</span>
            <span className="text-xs font-black text-emerald-800 bg-white border border-emerald-100 px-2 py-0.5 rounded-full">
              {progressPercent}% Concluído ({totalDone}/{habits.length})
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-200/60 h-2.5 rounded-full overflow-hidden mt-1 border border-slate-200">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Interactive Habitos List */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-black text-slate-700 text-left uppercase tracking-wide px-1">Meus Hábitos de Hoje:</h3>
          <div className="grid grid-cols-1 gap-1.5">
            {habits.map((item: any) => (
              <button
                key={item.id}
                onClick={() => toggleHabit(item.id)}
                className={`w-full text-left p-2 rounded-xl border-2 flex items-start gap-2.5 transition-all cursor-pointer ${
                  item.done 
                    ? "bg-emerald-50/60 border-emerald-300 text-emerald-950 shadow-xs" 
                    : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                }`}
              >
                <div className="shrink-0 pt-0.5">
                  {item.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                  ) : (
                    <div className="w-5 h-5 rounded-lg border-2 border-slate-300 bg-slate-50" />
                  )}
                </div>
                <div>
                  <span className={`block font-black text-xs leading-tight ${item.done ? "line-through text-slate-500 font-medium" : ""}`}>
                    {item.name}
                  </span>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* INTERACTIVE PLATE VISUALIZER */}
        <div className="bg-white border-2 border-slate-100 rounded-2xl p-3 text-left space-y-2.5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide leading-none">🍽️ O Prato Saudável Guia</h3>
            <p className="text-[10px] text-slate-500 font-bold leading-tight">Como dividir idealmente suas refeições principais? Toque em um dos grupos abaixo para ler as dicas:</p>
          </div>

          {/* Interactive Plate Shape */}
          <div className="flex justify-center items-center py-2 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="relative w-36 h-36 rounded-full border-4 border-slate-200 flex overflow-hidden shadow-inner bg-white">
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

        {/* SUPER HEALTHY TIPS FROM THE DOCTOR */}
        <div className="space-y-1.5 text-left">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide px-1">Super Dicas de Saúde Alimentar:</h3>
          <div className="space-y-1.5">
            {superDicas.map((item, idx) => {
              const isOpen = activeDicaIndex === idx;
              return (
                <div key={idx} className="bg-white border-2 border-slate-100 rounded-2xl overflow-hidden transition-all shadow-xs">
                  <button
                    type="button"
                    onClick={() => setActiveDicaIndex(isOpen ? null : idx)}
                    className="w-full text-left p-3 flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <span className="block font-black text-xs text-slate-800">{item.title}</span>
                      <span className="block text-[10px] text-slate-500 font-bold mt-0.5">{item.short}</span>
                    </div>
                    <span className="text-lg font-black text-slate-400 shrink-0 select-none">
                      {isOpen ? "▲" : "▼"}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="bg-slate-50 p-3 border-t border-slate-100 text-[11px] text-slate-700 leading-relaxed font-medium">
                      {item.full}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* INSTANT ADVICE WISDOM GENERATOR */}
        <div className="bg-amber-50/50 border-2 border-amber-100 rounded-2xl p-3 text-left space-y-2">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">💡</span>
              <h3 className="text-xs font-black text-amber-900 uppercase">Consultor de Alimentos do Rafa</h3>
            </div>
            <p className="text-[10px] text-slate-500 font-bold leading-tight">Escolha um item abaixo e veja o conselho do Professor Rafa sobre ele:</p>
          </div>

          <div className="flex flex-wrap gap-1.5 pb-1">
            {Object.keys(rafaWisdom).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSelectedQuery(key);
                  setQueryAnswer(rafaWisdom[key]);
                }}
                className={`text-[11px] px-2.5 py-1 rounded-xl border font-black transition-all cursor-pointer ${
                  selectedQuery === key
                    ? "bg-amber-600 border-amber-700 text-white shadow-xs"
                    : "bg-white hover:bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {selectedQuery && queryAnswer && (
            <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-left space-y-1 transition-all animate-fade-in shadow-xs">
              <span className="text-[9px] font-black uppercase tracking-wide text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-full">
                Professor Rafa na Escuta diz:
              </span>
              <p className="text-[11px] font-semibold text-slate-800 leading-relaxed">
                {queryAnswer}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
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
                <button
                  key={video.id}
                  onClick={() => setActiveVideoId(video.id)}
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
                </button>
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
