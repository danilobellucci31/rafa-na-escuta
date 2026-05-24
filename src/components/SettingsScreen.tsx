import React from "react";
import { ArrowLeft, Type, Volume2, HelpCircle, Shield, PhoneCall } from "lucide-react";

interface SettingsScreenProps {
  fontSizeLarge: boolean;
  setFontSizeLarge: (val: boolean) => void;
  onGoBack: () => void;
}

export default function SettingsScreen({
  fontSizeLarge,
  setFontSizeLarge,
  onGoBack,
}: SettingsScreenProps) {
  return (
    <div className="flex-1 p-3.5 flex flex-col justify-between space-y-3">
      {/* Top Header */}
      <div className="flex items-center gap-1 border-b border-slate-100 pb-1.5 select-none font-display">
        <button
          id="settings-back-btn"
          onClick={onGoBack}
          className="text-slate-700 hover:text-sky-700 font-bold flex items-center gap-1 p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-base"
        >
          <ArrowLeft className="w-5 h-5 shrink-0" />
          <span>Voltar</span>
        </button>
        <span className="text-xl font-black text-slate-800 tracking-tight font-display ml-1">Ajustes</span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pr-0.5">
        {/* TEXT SIZE ADJUSTMENT */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-1 text-left">
            <Type className="w-5 h-5 text-sky-600 shrink-0" />
            <h3 className="text-base font-bold text-slate-900">Tamanho das Letras</h3>
          </div>
          <p className="text-slate-600 text-xs font-medium leading-normal text-left">
            Se estiver com dificuldade de ler as mensagens, aumente para "Gigante":
          </p>

          <div className="flex gap-2">
            <button
              id="set-font-large-false"
              onClick={() => setFontSizeLarge(false)}
              className={`flex-1 p-2.5 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                !fontSizeLarge
                  ? "bg-sky-600 border-sky-700 text-white shadow-xs"
                  : "bg-slate-50 border-slate-100 text-slate-800"
              }`}
            >
              Letras Normais
            </button>
            <button
              id="set-font-large-true"
              onClick={() => setFontSizeLarge(true)}
              className={`flex-1 p-2.5 rounded-xl border-2 text-base font-black transition-all text-center ${
                fontSizeLarge
                  ? "bg-sky-600 border-sky-700 text-white shadow-xs"
                  : "bg-slate-50 border-slate-100 text-slate-800"
              }`}
            >
              Letras Gigantes 🐘
            </button>
          </div>
        </div>

        {/* REASSURANCE TIPS */}
        <div className="bg-teal-50 border-2 border-teal-100 rounded-2xl p-3 space-y-1 text-left">
          <div className="flex items-center gap-2 text-teal-900 border-b border-teal-100/30 pb-0.5">
            <Volume2 className="w-5 h-5 text-teal-600 shrink-0" />
            <h3 className="text-sm font-black">Leitura em Voz Alta</h3>
          </div>
          <p className="text-teal-950 text-xs leading-normal font-semibold">
            Todas as respostas do seu Professor têm o botão 🔊 <strong>Ouvir Resposta</strong>. Clique e ouça para cansar menos a vista!
          </p>
        </div>

        {/* SECURITY REASSURANCE */}
        <div className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-3 space-y-1 text-left">
          <div className="flex items-center gap-2 text-amber-900 border-b border-amber-100/30 pb-0.5">
            <Shield className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="text-sm font-black">Privacidade Segura</h3>
          </div>
          <p className="text-amber-950 text-xs leading-normal font-semibold">
            Seus dados, remédios e família estão 100% seguros. Respeitamos muito seu telefone e privacidade!
          </p>
        </div>

        {/* HELP DESK CALL MOCK */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-1.5">
            <PhoneCall className="w-5 h-5 text-sky-600 shrink-0" />
            <h4 className="text-xs font-black text-slate-800">Suporte por Telefone</h4>
          </div>
          <p className="text-slate-500 text-[11px] font-medium leading-none">
            Dúvidas? Ligue gratuito direto:
          </p>
          <a
            href="tel:0800777999"
            className="inline-block bg-sky-100 hover:bg-sky-200 border border-sky-200 text-sky-950 px-4 py-2 rounded-xl font-black text-sm text-center active:scale-95 transition-all"
          >
            Ligar Gratis: 0800 777 999
          </a>
        </div>
      </div>
    </div>
  );
}
