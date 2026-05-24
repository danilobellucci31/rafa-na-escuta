import React, { useState, useEffect } from "react";
import { ShieldAlert, Menu, X, ArrowDownToLine, Smartphone, Info } from "lucide-react";

interface MobileFrameProps {
  children: React.ReactNode;
  onEmergencyClick: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  fontSizeLarge: boolean;
  setFontSizeLarge: (val: boolean) => void;
  onNavigate?: (view: "dashboard" | "profile" | "settings" | "exercicios" | "sono" | "memoria" | "rotina") => void;
  currentView?: string;
}

export default function MobileFrame({
  children,
  onEmergencyClick,
  onLogout,
  isLoggedIn,
  fontSizeLarge,
  setFontSizeLarge,
  onNavigate,
  currentView = "dashboard",
}: MobileFrameProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
        setDeferredPrompt(null);
        setIsMenuOpen(false);
      } else {
        console.log("User dismissed the install prompt");
      }
    } else {
      // Trigger user-friendly modal guide for installing to Home Screen
      setShowInstallGuide(true);
    }
  };

  return (
    <div id="pwa-container" className="min-h-screen bg-slate-100 flex flex-col md:items-center md:justify-center md:py-8 md:px-4">
      {/* Outer Shell for Desktop Viewing - Styled with the exact Professional Polish frame specs */}
      <div 
        id="phone-envelope" 
        className="w-full md:w-[380px] md:h-[820px] bg-white md:rounded-[48px] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-0 md:border-[12px] md:border-[#1e293b] flex flex-col overflow-hidden relative"
      >
        {/* Top Camera Notch & Speaker Grill Mockup on Desktop */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-800 rounded-b-2xl z-40 items-center justify-center">
          <div className="w-12 h-1 bg-slate-700 rounded-full mb-1"></div>
          <div className="w-3 h-3 bg-slate-900 rounded-full ml-3 mb-1 border border-slate-700/50"></div>
        </div>

        {/* Outer Header: Fixed Navigation & Core Urgent Action */}
        <div id="phone-header" className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shrink-0 shadow-xs z-20">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                id="menu-trigger-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 p-3 rounded-2xl flex items-center justify-center border-2 border-slate-200 transition-all select-none cursor-pointer"
                aria-label="Menu do aplicativo"
                title="Menu de opções"
              >
                {isMenuOpen ? <X className="w-6 h-6 shrink-0" /> : <Menu className="w-6 h-6 shrink-0" />}
              </button>
              <div className="block">
                <span className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 block leading-none">PROF. RAFA</span>
                <span className="font-black text-sm text-slate-900 block leading-tight">
                  {currentView === "profile" ? "Perfil" : 
                   currentView === "settings" ? "Ajustes" : 
                   currentView === "chat" ? "Conversa" : 
                   currentView === "exercicios" ? "Exercícios" :
                   currentView === "sono" ? "Sono" :
                   currentView === "memoria" ? "Memória" :
                   currentView === "rotina" ? "Rotina" :
                   currentView === "remedios" ? "Remédios" :
                   currentView === "agendamentos" ? "Agendamentos" :
                   "Início"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 py-1 select-none">
              <img 
                src="/logo.png" 
                alt="Prof. Rafa" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-sky-100" 
                referrerPolicy="no-referrer"
              />
              <div>
                <h1 className="text-xl font-bold font-display text-sky-950 tracking-tight leading-none">Prof. Rafa</h1>
                <span className="text-slate-500 text-xs font-medium tracking-wide">Saúde Preventiva</span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* GIANT RED EMERGENCY BUTTON - Styled with the Professional Polish emergency-btn shadow style */}
            <button 
              id="emergency-trigger"
              onClick={onEmergencyClick}
              className="btn-shadow-emergency bg-[#dc2626] hover:bg-red-700 active:scale-95 text-white py-3 px-4 rounded-2xl flex items-center gap-2 font-black border-2 border-red-800 shadow-md cursor-pointer transition-all"
              title="Pedir socorro urgente"
            >
              <ShieldAlert className="w-6 h-6 shrink-0 text-white" />
              <span className="text-md leading-none tracking-tight">AJUDA</span>
            </button>
          </div>
        </div>

        {/* Main Fluid Content Container */}
        <main 
          id="phone-viewport" 
          className={`flex-1 overflow-y-auto bg-slate-50 flex flex-col relative ${
            fontSizeLarge ? 'text-lg' : 'text-base'
          }`}
        >
          {children}

          {/* Absolute Menu Overlay - Big Friendly Options for Seniors */}
          {isLoggedIn && isMenuOpen && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-55 flex flex-col justify-end">
              <div className="bg-white rounded-t-[28px] border-t-4 border-sky-600 p-4 space-y-2.5 shadow-2xl select-none max-h-[95%] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <h3 className="text-lg font-black text-slate-800 font-display">Opções do Aplicativo</h3>
                  <button
                    id="close-menu-btn"
                    onClick={() => setIsMenuOpen(false)}
                    className="bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-1.5 py-0.5">
                  {/* 1. Voltar para o Início / Principal */}
                  <button
                    id="menu-goto-home"
                    onClick={() => {
                      if (onNavigate) onNavigate("dashboard");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left border-2 text-base font-bold transition-all cursor-pointer ${
                      currentView === "dashboard"
                        ? "bg-sky-50 border-sky-300 text-sky-950"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-2xl shrink-0">🏠</span>
                    <div className="flex-1 min-w-0">
                      <span className="block font-black text-xs text-slate-900 leading-tight">Página Inicial</span>
                      <span className="block text-[10px] font-medium text-slate-500 leading-none mt-0.5">Falar com o Professor Rafa</span>
                    </div>
                  </button>

                  {/* 2. Meu Perfil de Saúde */}
                  <button
                    id="menu-goto-profile"
                    onClick={() => {
                      if (onNavigate) onNavigate("profile");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left border-2 text-base font-bold transition-all cursor-pointer ${
                      currentView === "profile"
                        ? "bg-sky-50 border-sky-300 text-sky-950"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-2xl shrink-0">👤</span>
                    <div className="flex-1 min-w-0">
                      <span className="block font-black text-xs text-slate-900 leading-tight">Meu Perfil de Saúde</span>
                      <span className="block text-[10px] font-semibold text-slate-500 leading-none mt-0.5">Meus contatos e remédios</span>
                    </div>
                  </button>

                  {/* 3. Configurações de Acessibilidade */}
                  <button
                    id="menu-goto-settings"
                    onClick={() => {
                      if (onNavigate) onNavigate("settings");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left border-2 text-base font-bold transition-all cursor-pointer ${
                      currentView === "settings"
                        ? "bg-sky-50 border-sky-300 text-sky-950"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-2xl shrink-0">⚙️</span>
                    <div className="flex-1 min-w-0">
                      <span className="block font-black text-xs text-slate-900 leading-tight">Opções & Letras</span>
                      <span className="block text-[10px] font-semibold text-slate-500 leading-none mt-0.5">Mudar tamanho das letras</span>
                    </div>
                  </button>

                  {/* NEW "INSTALAR APP" BUTTON */}
                  <button
                    id="menu-install-app"
                    onClick={handleInstallApp}
                    className="w-full p-2 rounded-xl flex items-center gap-2.5 text-left border-2 border-emerald-200 bg-emerald-50 text-emerald-950 hover:bg-emerald-100 text-base font-bold transition-all cursor-pointer"
                  >
                    <span className="text-2xl shrink-0">📲</span>
                    <div className="flex-1 min-w-0">
                      <span className="block font-black text-xs text-emerald-900 leading-tight">Salvar na Tela Inicial</span>
                      <span className="block text-[10px] font-semibold text-emerald-600 leading-none mt-0.5">Ter o aplicativo como um botão no celular</span>
                    </div>
                  </button>

                  {/* 4. Sair do Aplicativo */}
                  <button
                    id="menu-goto-logout"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full p-2 rounded-xl flex items-center gap-2.5 text-left border-2 border-red-200 bg-red-50 text-red-900 hover:bg-red-100 text-base font-bold transition-all cursor-pointer"
                  >
                    <span className="text-2xl shrink-0">🚪</span>
                    <div className="flex-1 min-w-0">
                      <span className="block font-black text-xs text-red-800 leading-tight">Sair da Conta (Sair)</span>
                      <span className="block text-[10px] font-semibold text-red-500 leading-none mt-0.5">Desconectar com segurança</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Visual step-by-step Installation Modal Guide */}
          {showInstallGuide && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-59 flex items-center justify-center p-4">
              <div className="bg-white rounded-[24px] border-4 border-sky-600 p-4 space-y-3 max-w-sm shadow-2xl w-full text-slate-900 select-none max-h-[92%] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-sky-600" />
                    <h3 className="text-lg font-black font-display text-slate-800">Instalar no Celular</h3>
                  </div>
                  <button
                    onClick={() => setShowInstallGuide(false)}
                    className="bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                  Para abrir o Professor Rafa direto da tela de início do seu telefone sem digitar sites, siga estas instruções rápidas:
                </p>

                {/* Android vs iOS tabs or unified simple lists */}
                <div className="space-y-2 pt-0.5">
                  {/* Android guide */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 space-y-0.5">
                    <span className="block text-[11px] font-black text-emerald-700 uppercase leading-none">Se seu celular é Android (SAMSUNG, MOTOROLA...):</span>
                    <span className="block text-xs font-medium text-slate-700 leading-normal">
                      1. Toque nos <strong>três pontinhos</strong> no canto superior do navegador.<br />
                      2. Toque em <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar"</strong>.
                    </span>
                  </div>

                  {/* iOS guide */}
                  <div className="bg-sky-50/50 border border-sky-200 rounded-xl p-2.5 space-y-0.5">
                    <span className="block text-[11px] font-black text-sky-700 uppercase leading-none">Se seu celular é iPhone (APPLE):</span>
                    <span className="block text-xs font-medium text-slate-700 leading-normal">
                      1. Toque no botão de <strong>Compartilhar</strong> (embaixo na tela).<br />
                      2. Suba a tela e clique em <strong>"Adicionar à Tela de Início"</strong>.
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowInstallGuide(false)}
                  className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white py-2.5 px-3 rounded-xl text-md font-black border-2 border-sky-800 shadow-sm cursor-pointer transition-all mt-1"
                >
                  Entendi! Vou Fazer
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
