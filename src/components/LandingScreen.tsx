import React, { useState } from "react";
import { Play, Check, Heart, Sparkles, Shield, Volume2, Share2, MessageSquare, ArrowRight, UserPlus, LogIn, Award } from "lucide-react";

interface LandingScreenProps {
  onNavigate: (view: any) => void;
  fontSizeLarge: boolean;
}

export default function LandingScreen({ onNavigate, fontSizeLarge }: LandingScreenProps) {
  const [showPricingModal, setShowPricingModal] = useState(false);

  const pricePlans = [
    {
      name: "Plano Gratuito",
      price: "R$ 0,00",
      period: "para sempre",
      description: "Acesso total aos recursos fundamentais de bem-estar.",
      color: "border-slate-200 bg-white text-slate-900",
      buttonText: "Começar Grátis",
      buttonStyle: "bg-slate-800 hover:bg-slate-900 text-white",
      features: [
        "Acesso completo a todos os módulos do app",
        "Guias de alimentação saudável & rotinas",
        "Dicas de sono, alongamentos e exercícios mentais",
        "Direito a fazer 1 pergunta por dia para o Prof. Rafa"
      ],
      tag: "Gratuito"
    },
    {
      name: "Plano Iniciante",
      price: "R$ 9,90",
      period: "/mês",
      description: "Ideal para manter seu corpo e sua mente sempre ativos.",
      color: "border-sky-200 bg-sky-50/60 text-sky-950 ring-2 ring-sky-500/20",
      buttonText: "Assinar Iniciante",
      buttonStyle: "bg-sky-600 hover:bg-sky-700 text-white border-2 border-sky-850",
      features: [
        "Acesso completo a todos os módulos do app",
        "Guias de alimentação saudável & rotinas",
        "Dicas de sono, alongamentos e exercícios mentais",
        "Direito a fazer 5 perguntas por dia para o Prof. Rafa"
      ],
      tag: "Mais Vendido",
      popular: true
    },
    {
      name: "Plano Avançado",
      price: "R$ 24,90",
      period: "/mês",
      description: "Segurança, tranquilidade e mais conexão com o Prof. Rafa.",
      color: "border-purple-200 bg-purple-50/40 text-purple-950",
      buttonText: "Garantir Plano Avançado",
      buttonStyle: "bg-purple-600 hover:bg-purple-700 text-white border-2 border-purple-855",
      features: [
        "Acesso completo a todos os módulos do app",
        "Guias de alimentação saudável & rotinas",
        "Dicas de sono, alongamentos e exercícios mentais",
        "Direito a fazer 10 perguntas por dia para o Prof. Rafa",
        "Relatórios de saúde detalhados"
      ],
      tag: "Proteção Total"
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-slate-50 select-none">
      
      {/* Dynamic Selling Hero Area */}
      <div className="p-4 space-y-4 pt-3 flex-1 overflow-y-auto">
        
        {/* Sales Tagline with sparkles */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl p-3 flex items-start gap-2.5 shadow-xs text-left">
          <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="space-y-0.5">
            <span className="block text-[10px] uppercase font-extrabold tracking-wider text-sky-700">Maturidade Saudável e Ativa</span>
            <p className="text-xs font-black text-sky-950 leading-tight">
              A maneira mais fácil, guiada por voz e segura de cuidar da sua saúde diariamente!
            </p>
          </div>
        </div>

        {/* Video of Professor Rafa Explaining the App */}
        <div className="bg-slate-900 rounded-[24px] p-3 text-center border-2 border-slate-800 shadow-md space-y-2 relative">
          <div className="absolute top-2.5 left-2.5 bg-sky-600 text-white text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full z-10">
            Apresentação Oficial
          </div>

          <div className="w-full aspect-video rounded-xl overflow-hidden shadow-inner relative bg-black">
            <iframe
              className="w-full h-full border-0 rounded-xl"
              src="https://www.youtube.com/embed/QI8Mk0ZgDkg?autoplay=0&rel=0"
              title="Apresentação do App pelo Prof. Rafa"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer"
            ></iframe>
          </div>

          <div className="text-left space-y-1 pt-1 border-t border-slate-800/80">
            <h4 className="text-slate-100 text-xs font-black leading-none flex items-center gap-1.5 col-span-2">
              <Play className="w-3.5 h-3.5 text-sky-400 fill-current shrink-0" />
              <span>Vídeo explicativo do Prof. Rafa sobre o app!</span>
            </h4>
            <p className="text-slate-400 text-[10px] font-bold leading-normal">
              Veja em 1 minuto como o aplicativo funciona perfeitamente para idosos, com comandos de voz, acompanhamento de médicos e lembretes fáceis.
            </p>
          </div>
        </div>

        {/* Core Benefits Grid */}
        <div className="space-y-2 text-left">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide px-1">Por que escolher o Prof. Rafa?</h3>
          
          <div className="grid grid-cols-1 gap-2">
            <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                <Heart className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800">Feito para a Melhor Idade</h4>
                <p className="text-[10px] text-slate-500 font-bold leading-normal">
                  Interface extremamente simples, rápida de navegar, com letras grandes de fácil leitura e botões confortáveis que evitam erros.
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800">Guias de Alimentação Saudável</h4>
                <p className="text-[10px] text-slate-500 font-bold leading-normal">
                  Sugestões práticas de nutrição para dar mais energia, fortalecer a imunidade e ajudar você a manter hábitos alimentares saudáveis.
                </p>
              </div>
            </div>

            <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-black text-slate-800">Exercícios Físicos, Mentais e Sono</h4>
                <p className="text-[10px] text-slate-500 font-bold leading-normal">
                  Exercícios físicos leves de alongamento, jogos cognitivos divertidos para exercitar a memória e dicas fundamentais para um sono revigorante.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Quick Reveal / Call to Action Anchor */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100 p-3 rounded-[24px] space-y-2 text-left">
          <div className="flex items-center gap-1.5">
            <Award className="w-5 h-5 text-indigo-600 shrink-0" />
            <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest leading-none">Planos Promocionais</span>
          </div>
          <h4 className="text-xs font-black text-slate-900 leading-tight">
            Planos a partir de apenas R$ 9,90/mês para manter sua saúde em dia!
          </h4>
          <p className="text-[10px] text-slate-600 font-bold leading-normal">
            Escolha o melhor plano para você ou sua família. O plano gratuito inclui acesso vitalício a conversações básicas e lembretes essenciais.
          </p>
          <div className="flex gap-2 pt-1 border-t border-indigo-100">
            <button
              onClick={() => setShowPricingModal(true)}
              className="flex-1 bg-white hover:bg-slate-55 border border-indigo-200 text-indigo-950 py-2 px-3 rounded-xl text-[11px] font-black shadow-xs transition-all cursor-pointer text-center"
            >
              🔎 Ver Preços Detalhados
            </button>
            <button
              onClick={() => onNavigate("login")}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-xl text-[11px] font-black border border-indigo-800 shadow-xs transition-all cursor-pointer text-center"
            >
              🚀 Entrar Grátis
            </button>
          </div>
        </div>

        {/* Happy testimonials area */}
        <div className="space-y-2 text-left pt-1">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wide px-1">O que dizem os nossos usuários:</h3>
          <div className="bg-white border text-left p-3 rounded-2xl border-slate-100 space-y-1.5 shadow-2xs">
            <p className="text-slate-600 text-xs font-medium leading-relaxed italic">
              "Com as letras ampliadas e o Professor Rafa me lembrando pelo nome de beber água e tomar a pílula do coração, me sinto muito mais segura! Meus netos também ficam tranquilos."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-orange-100 shrink-0 flex items-center justify-center font-black text-orange-700 text-[10px]">
                D.M
              </div>
              <div>
                <span className="block text-[10px] font-black text-slate-900">Dona Maria de Lourdes, 72 anos</span>
                <span className="block text-[9px] font-semibold text-slate-400">Ativa no app há 4 meses</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Floating Interactive Bottom CTA */}
      <div className="bg-slate-100 border-t border-slate-200 p-3 space-y-2 shrink-0 animate-fade-in">
        <div className="flex gap-1.5">
          <button
            id="show-pricing-main-btn"
            onClick={() => setShowPricingModal(true)}
            className="flex-1 bg-white hover:bg-slate-50 text-slate-800 p-2.5 rounded-xl border-2 border-slate-200 shadow-xs text-xs font-black cursor-pointer transition-all"
          >
            📊 CONHECER PREÇOS
          </button>
          <button
            id="start-demo-btn"
            onClick={() => onNavigate("login")}
            className="flex-1 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white p-2.5 rounded-xl flex items-center justify-center gap-1.5 font-black border-2 border-sky-800 text-xs shadow-xs cursor-pointer transition-all"
          >
            <span>CADASTRAR / ENTRAR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Pricing Modal Content */}
      {showPricingModal && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-xs z-55 flex items-end justify-center">
          <div className="bg-slate-50 rounded-t-[28px] border-t-4 border-sky-600 p-4 space-y-3.5 shadow-2xl w-full max-h-[92%] overflow-y-auto">
            
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
              <div>
                <h3 className="text-base font-black text-slate-800 font-display">Tabela de Preços e Planos</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Sem contratos chatos, cancele quando desejar.</p>
              </div>
              <button
                onClick={() => setShowPricingModal(false)}
                className="bg-slate-200 hover:bg-slate-300 rounded-full p-1.5 text-slate-600 font-bold transition-transform cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {pricePlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`border-2 p-3 rounded-2xl flex flex-col justify-between space-y-2.5 relative ${plan.color}`}
                >
                  {plan.tag && (
                    <span className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded-full">
                      {plan.tag}
                    </span>
                  )}

                  <div className="text-left">
                    <span className="text-xs font-black block text-slate-400 uppercase leading-none">{plan.name}</span>
                    <div className="flex items-baseline gap-1 mt-1 leading-none">
                      <span className="text-xl font-black text-slate-900">{plan.price}</span>
                      <span className="text-[10px] text-slate-400 font-bold">{plan.period}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold leading-tight mt-1">{plan.description}</p>
                  </div>

                  <div className="border-t border-slate-200/50 pt-2 space-y-1 text-left">
                    {plan.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-1.5 text-[10px]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-slate-700 font-bold leading-tight">{feat}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setShowPricingModal(false);
                      onNavigate("login");
                    }}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowPricingModal(false)}
              className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 py-2.5 px-4 rounded-xl text-xs font-black text-center cursor-pointer transition-all"
            >
              Fechar e Voltar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
