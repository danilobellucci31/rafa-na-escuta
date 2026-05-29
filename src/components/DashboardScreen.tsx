import React from "react";
import { UserProfile } from "../types";
import { Mic, Dumbbell, Moon, Brain, CalendarRange } from "lucide-react";

interface DashboardScreenProps {
  userProfile: UserProfile;
  onStartChat: () => void;
  fontSizeLarge: boolean;
  onNavigate: (view: "dashboard" | "profile" | "settings" | "exercicios" | "sono" | "memoria" | "rotina" | "remedios" | "agendamentos" | "alimentacao" | "videos" | "prevencao") => void;
}

export default function DashboardScreen({
  userProfile,
  onStartChat,
  fontSizeLarge,
  onNavigate,
}: DashboardScreenProps) {
  
  return (
    <div className="flex-1 p-3 flex flex-col justify-center space-y-3 min-h-0 select-none">
      
      {/* Grid of 6 Specific Health Modules */}
      <div className="space-y-1 relative shrink-0 flex-1 flex flex-col justify-center">
        <div id="topics-grid" className="grid grid-cols-2 gap-2 pb-1">
          
          {/* 1. EXERCÍCIOS */}
          <button
            id="topic-card-exercicios"
            onClick={() => onNavigate("exercicios")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-1 select-none text-teal-700">🏃</span>
            <span className="block text-base font-black leading-tight tracking-tight">EXERCÍCIOS</span>
          </button>

          {/* 2. SONO */}
          <button
            id="topic-card-sono"
            onClick={() => onNavigate("sono")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-1 select-none text-indigo-700">😴</span>
            <span className="block text-base font-black leading-tight tracking-tight">SONO</span>
          </button>

          {/* 3. ALIMENTAÇÃO */}
          <button
            id="topic-card-alimentacao"
            onClick={() => onNavigate("alimentacao")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-1 select-none text-emerald-700">🍏</span>
            <span className="block text-base font-black leading-tight tracking-tight">ALIMENTAÇÃO</span>
          </button>

          {/* 4. PREVENÇÃO DE ACIDENTES */}
          <button
            id="topic-card-prevencao"
            onClick={() => onNavigate("prevencao")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-red-200 bg-red-50 hover:bg-red-100 text-red-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-1 select-none text-red-700 animate-pulse">🛡️</span>
            <span className="block text-base font-black leading-tight tracking-tight text-red-900">PREVENÇÃO DE ACIDENTES</span>
          </button>

          {/* 5. ROTINA */}
          <button
            id="topic-card-rotina"
            onClick={() => onNavigate("rotina")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-1 select-none text-orange-700">📅</span>
            <span className="block text-base font-black leading-tight tracking-tight">ROTINA</span>
          </button>

          {/* 6. REMÉDIOS */}
          <button
            id="topic-card-remedios"
            onClick={() => onNavigate("remedios")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-1 select-none text-emerald-700">💊</span>
            <span className="block text-base font-black leading-tight tracking-tight">REMÉDIOS</span>
          </button>

          {/* 7. AGENDAMENTOS */}
          <button
            id="topic-card-agendamentos"
            onClick={() => onNavigate("agendamentos")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-1 select-none text-sky-700">🩺</span>
            <span className="block text-base font-black leading-tight tracking-tight">AGENDAMENTOS MÉDICOS</span>
          </button>

          {/* 8. EXERCÍCIOS MENTAIS */}
          <button
            id="topic-card-memoria"
            onClick={() => onNavigate("memoria")}
            className="action-card-theme rounded-[22px] p-3 flex flex-col items-center text-center justify-center border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-950 transition-all cursor-pointer h-24 relative shadow-sm"
          >
            <span className="text-2xl mb-1 select-none text-purple-700">🧠</span>
            <span className="block text-base font-black leading-tight tracking-tight">EXERCÍCIOS MENTAIS</span>
          </button>

        </div>
      </div>

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

    </div>
  );
}
