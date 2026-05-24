import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Mic, CheckSquare, Square, Play, Pause, RefreshCw, 
  HelpCircle, CheckCircle2, Moon, Brain, Key, Dumbbell, CalendarRange, Sparkles, Smile, Sunset
} from "lucide-react";

interface ModuleScreenProps {
  onGoBack: () => void;
  onStartChat: (initialPrompt?: string) => void;
  fontSizeLarge: boolean;
  topicId: "exercicios" | "sono" | "memoria" | "rotina";
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
          onClick={() => onStartChat("Professor Rafa, quais exercícios leves de alongamento eu posso fazer em casa hoje de manhã com segurança e sem forçar as articulações?")}
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
          onClick={() => onStartChat("Professor Rafa, ando com dificuldades para dormir à noite. O que posso fazer de forma simples na minha rotina para relaxar e ter um sono pesado e seguro?")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-indigo-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>PERGUNTAR AO PROF. RAFA</span>
        </button>
      </div>
    </div>
  );
}

// 3. MODULE: MEMÓRIA (Ginástica da Mente & Jogo)
export function MemoriaModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  // Senior interactive clean Memory Mini-Game with 4 items / 2 pairs or 6 items / 3 pairs. Let's make 6 cards !
  // Emojis: 🍎 (Apple), 🍌 (Banana), 🍊 (Orange)
  const initialCards = [
    { id: 1, type: "apple", emoji: "🍎", isFlipped: false, isMatched: false },
    { id: 2, type: "banana", emoji: "🍌", isFlipped: false, isMatched: false },
    { id: 3, type: "orange", emoji: "🍊", isFlipped: false, isMatched: false },
    { id: 4, type: "apple", emoji: "🍎", isFlipped: false, isMatched: false },
    { id: 5, type: "banana", emoji: "🍌", isFlipped: false, isMatched: false },
    { id: 6, type: "orange", emoji: "🍊", isFlipped: false, isMatched: false },
  ];

  // Randomize cards helper
  const shuffle = (array: typeof initialCards) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState<typeof initialCards>(() => shuffle(initialCards));
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const handleCardClick = (cardId: number) => {
    // If already flipped or matched, do nothing
    const current = cards.find(c => c.id === cardId);
    if (!current || current.isFlipped || current.isMatched || selected.length >= 2) return;

    // Flip card
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, isFlipped: true } : c));
    const nextSelected = [...selected, cardId];
    setSelected(nextSelected);

    if (nextSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [firstId, secondId] = nextSelected;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.type === secondCard.type) {
        // MATCH found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true, isFlipped: true } 
              : c
          ));
          setSelected([]);
        }, 300);
      } else {
        // No match - Flip back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setSelected([]);
        }, 1000);
      }
    }
  };

  const handleReset = () => {
    setCards(shuffle(initialCards));
    setSelected([]);
    setMoves(0);
  };

  const allMatched = cards.every(c => c.isMatched);

  return (
    <div className="flex-1 p-3 flex flex-col justify-between space-y-2.5 min-h-0 select-none">
      <div className="space-y-2">
        {/* Module Header */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-1">
          <button
            id="mem-back-btn"
            onClick={onGoBack}
            className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1 hover:bg-slate-50 rounded-lg transition-colors text-base cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 shrink-0 text-slate-700" />
            <span>Voltar</span>
          </button>
          <span className="text-xl font-black text-emerald-800 tracking-tight font-display ml-1 flex items-center gap-1">
            <Brain className="w-5 h-5 text-emerald-600 animate-pulse-slow" />
            <span>Ginástica Mental</span>
          </span>
        </div>

        {/* Memory game box */}
        <div id="mem-game-box" className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-3 text-center space-y-2.5">
          <div className="flex justify-between items-center px-1">
            <div className="text-left">
              <span className="block text-xs font-bold text-emerald-600 uppercase tracking-wide leading-none">Jogo da Memória</span>
              <span className="block text-base font-black text-slate-900 mt-0.5">Ache os pares!</span>
            </div>
            <button
              id="mem-game-reset"
              onClick={handleReset}
              className="bg-white hover:bg-emerald-100 text-emerald-800 border-2 border-emerald-200 p-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1 font-black text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Congrats check */}
          {allMatched ? (
            <div className="bg-white border-2 border-emerald-300 p-4 rounded-xl text-center space-y-1 animate-bounce">
              <span className="text-3xl">🏆🌟👏</span>
              <h4 className="text-base font-black text-emerald-950">Mente Super Rápida!</h4>
              <p className="text-slate-600 text-xs font-semibold">
                Você completou em apenas {moves} tentativas de memorização!
              </p>
            </div>
          ) : (
            /* Cards Game Grid */
            <div className="grid grid-cols-3 gap-2">
              {cards.map(card => {
                const isOpen = card.isFlipped || card.isMatched;
                return (
                  <button
                    id={`mem-card-${card.id}`}
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`h-16 rounded-xl flex items-center justify-center text-3xl border-2 transition-all cursor-pointer ${
                      isOpen
                        ? "bg-white border-emerald-400 text-slate-900 scale-100"
                        : "bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-800 text-emerald-100 hover:scale-105 active:scale-95 shadow-md"
                    }`}
                  >
                    {isOpen ? card.emoji : "❓"}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Dynamic Tips Box */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-3 space-y-1 text-slate-800 text-left">
          <h4 className="font-extrabold text-sm flex items-center gap-1 text-emerald-900 leading-none">
            <span>🧠</span>
            <span>Pratique a mente rindo:</span>
          </h4>
          <p className="text-slate-600 text-xs leading-normal font-semibold">
            Ler, fazer passatempos físicos, escutar velhas músicas ou ligar para amigos antigos ajudam a exercitar o raciocínio.
          </p>
        </div>
      </div>

      {/* Dynamic CTA with Rafa */}
      <div className="bg-slate-100 border-2 border-slate-200 rounded-2xl p-2.5 space-y-1.5 shrink-0">
        <p className="text-slate-600 text-xs font-bold text-center leading-none">
          Gostaria de perguntas e charadas para exercitar a memória agora?
        </p>
        <button
          id="mem-ask-rafa-btn"
          onClick={() => onStartChat("Professor Rafa, quero exercitar minha memória hoje. Você poderia fazer 3 perguntas de adivinhações ou charadas engraçadas e educativas para eu tentar responder?")}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-emerald-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>PERGUNTAR AO PROF. RAFA</span>
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
          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
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
          onClick={() => onStartChat("Professor Rafa, como posso organizar melhor minha rotina diária para lembrar da minha água e dos meus remédios de forma segura?")}
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
export function RemediosModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const [items, setItems] = useState<{ id: string; label: string; checked: boolean; time: string }[]>(() => {
    const local = localStorage.getItem("senior_remedios_checklist_v2");
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    return [];
  });

  const [customText, setCustomText] = useState("");
  const [customTime, setCustomTime] = useState("");

  useEffect(() => {
    localStorage.setItem("senior_remedios_checklist_v2", JSON.stringify(items));
  }, [items]);

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const timeVal = customTime.trim() || "Horário Livre";
    const newItem = {
      id: "rem-custom-" + Date.now(),
      label: customText + " 💊",
      checked: false,
      time: timeVal
    };
    setItems(prev => [...prev, newItem]);
    setCustomText("");
    setCustomTime("");
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

          <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
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
                    <div className="flex-1">
                      <span className={`block font-bold text-xs leading-none ${item.checked ? "line-through opacity-60" : ""}`}>
                        {item.label}
                      </span>
                      <span className="block text-[10px] font-black tracking-wider text-slate-400 uppercase mt-0.5">
                        Hora: {item.time}
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
          <form onSubmit={handleAddNewItem} className="space-y-1.5 pt-0.5 border-t border-emerald-200/30">
            <div className="flex gap-1.5">
              <input
                id="new-remedio-input"
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ex: Novo remédio..."
                className="flex-1 text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-left bg-white text-slate-800"
              />
              <input
                id="new-remedio-time"
                type="text"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                placeholder="Ex: 08:00"
                className="w-20 text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-center bg-white text-slate-800"
              />
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
          onClick={() => onStartChat("Professor Rafa, ando com algumas dúvidas sobre as possíveis misturas de medicamentos que tomo na minha rotina. Como ter certeza de que estou tomando meus remédios de forma segura nos horários corretos, e com quais alimentos ou bebidas devo evitar acompanhá-los?")}
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
export function AgendamentosModule({ onGoBack, onStartChat, fontSizeLarge }: Omit<ModuleScreenProps, "topicId">) {
  const [items, setItems] = useState<{ id: string; label: string; checked: boolean; when: string }[]>(() => {
    const local = localStorage.getItem("senior_agendamentos_checklist_v2");
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    return [];
  });

  const [customText, setCustomText] = useState("");
  const [customWhen, setCustomWhen] = useState("");

  useEffect(() => {
    localStorage.setItem("senior_agendamentos_checklist_v2", JSON.stringify(items));
  }, [items]);

  const toggleCheck = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    const whenVal = customWhen.trim() || "Em definição";
    const newItem = {
      id: "age-custom-" + Date.now(),
      label: customText + " 📅",
      checked: false,
      when: whenVal
    };
    setItems(prev => [...prev, newItem]);
    setCustomText("");
    setCustomWhen("");
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
          <form onSubmit={handleAddNewItem} className="space-y-1.5 pt-0.5 border-t border-sky-200/30">
            <div className="flex gap-1.5">
              <input
                id="new-agendamento-input"
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Ex: Cardiologista, Exame..."
                className="flex-1 text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-left bg-white text-slate-800"
              />
              <input
                id="new-agendamento-when"
                type="text"
                value={customWhen}
                onChange={(e) => setCustomWhen(e.target.value)}
                placeholder="Ex: Terça, 10h"
                className="w-20 text-xs px-2.5 py-1.5 border-2 border-slate-200 rounded-xl focus:border-sky-500 text-center bg-white text-slate-800"
              />
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
          onClick={() => onStartChat("Professor Rafa, tenho uma consulta agendada em breve e gostaria de saber: quais são as perguntas mais importantes e fáceis de fazer ao médico para tirar minhas principais dúvidas de saúde, e quais exames de rotina comuns para minha idade eu deveria sugerir ou perguntar a respeito?")}
          className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-2 font-black border-2 border-sky-800 text-sm shadow-xs cursor-pointer transition-all"
        >
          <Mic className="w-4 h-4 shrink-0" />
          <span>PERGUNTAR AO PROF. RAFA</span>
        </button>
      </div>
    </div>
  );
}
