import React from "react";
import { UserProfile } from "../types";
import { Mic, Dumbbell, Moon, Brain, CalendarRange } from "lucide-react";

interface DashboardScreenProps {
  userProfile: UserProfile;
  onStartChat: () => void;
  fontSizeLarge: boolean;
  onNavigate: (view: "dashboard" | "profile" | "settings" | "exercicios" | "sono" | "memoria" | "rotina" | "remedios" | "agendamentos" | "alimentacao" | "videos") => void;
}

export default function DashboardScreen({
  userProfile,
  onStartChat,
  fontSizeLarge,
  onNavigate,
}: DashboardScreenProps) {
  
  return (
    <div className="flex-1 p-3 flex flex-col justify-center space-y-3 min-h-0 select-none">
      
      {/* RECTANGULAR SPEAK BUTTON - Styled to minimize vertical space & optimize for senior visibility */}
      <div id="main-voice-cta" className="w-full shrink-0">
        <button
          id="ask-rafa-rect-btn"
          onClick={onStartChat}
          className="mic-btn w-full p-3.5 rounded-2xl flex items-center justify-center gap-3 text-white border-2 border-white cursor-pointer select-none outline-none font-display font-black text-xl hover:opacity-95 shadow-md active:scale-[0.98] transition-all transform shrink-0"
          aria-label="Tocar para falar com o Professor Rafa por dotação de voz ou áudio"
        >
          <Mic className="w-6 h-6 filter drop-shadow font-bold text-white shrink-0 animate-pulse-slow" />
          <span className="tracking-wide uppercase font-display text-lg">Tocar para Falar</span>
        </button>
      </div>

      {/* Grid of 6 Specific Health Modules */}
      <div className="space-y-1 relative shrink-0 flex-1 flex flex-col justify-center">
        <div id="topics-grid" className="grid grid-cols-2 gap-2 pb-1">
          
          {/* 1. EXERCÍCIO */}
          <button
            id="topic-card-exercicios"
            onClick={() => onNavigate("exercicios")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-0.5 select-none text-teal-700">🏃</span>
            <span className="block text-base font-black leading-tight tracking-tight">Exercícios</span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              Alongar & Caminhar
            </span>
          </button>

          {/* 2. SONO */}
          <button
            id="topic-card-sono"
            onClick={() => onNavigate("sono")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-0.5 select-none text-indigo-700">😴</span>
            <span className="block text-base font-black leading-tight tracking-tight">Sono</span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              Dormir Bem
            </span>
          </button>

          {/* 3. MEMÓRIA */}
          <button
            id="topic-card-memoria"
            onClick={() => onNavigate("memoria")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-0.5 select-none text-purple-700">🧠</span>
            <span className="block text-base font-black leading-tight tracking-tight">Memória</span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              Ginástica Mente
            </span>
          </button>

          {/* 4. ROTINA */}
          <button
            id="topic-card-rotina"
            onClick={() => onNavigate("rotina")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-0.5 select-none text-orange-700">📅</span>
            <span className="block text-base font-black leading-tight tracking-tight">Rotina</span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              Lembretes Diários
            </span>
          </button>

          {/* 5. REMÉDIOS */}
          <button
            id="topic-card-remedios"
            onClick={() => onNavigate("remedios")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-0.5 select-none text-emerald-700">💊</span>
            <span className="block text-base font-black leading-tight tracking-tight">Remédios</span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              Meus Horários
            </span>
          </button>

          {/* 6. AGENDAMENTOS */}
          <button
            id="topic-card-agendamentos"
            onClick={() => onNavigate("agendamentos")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-0.5 select-none text-sky-700">🩺</span>
            <span className="block text-base font-black leading-tight tracking-tight">Agendamentos</span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              Consultas & Exames
            </span>
          </button>

          {/* 7. ALIMENTAÇÃO SAUDÁVEL */}
          <button
            id="topic-card-alimentacao"
            onClick={() => onNavigate("alimentacao")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-0.5 select-none text-emerald-700">🍏</span>
            <span className="block text-base font-black leading-tight tracking-tight">Alimentação</span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              Hábitos Saudáveis
            </span>
          </button>

          {/* 8. VÍDEOS DO PROF. RAFA */}
          <button
            id="topic-card-videos"
            onClick={() => onNavigate("videos")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-0.5 select-none text-rose-700">🎥</span>
            <span className="block text-base font-black leading-tight tracking-tight">Vídeos do Rafa</span>
            <span className="block text-[10px] font-bold text-slate-500 mt-0.5 leading-none">
              Dicas de Prática
            </span>
          </button>

        </div>
      </div>

    </div>
  );
}
