import React, { useState } from "react";
import { mockAuthService, isSupabaseConfigured } from "../lib/supabase";
import { UserProfile } from "../types";
import { KeyRound, Mail, User, CheckCircle2, BadgeAlert, AlertCircle, ArrowRight, Compass } from "lucide-react";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  fontSizeLarge: boolean;
}

export default function LoginScreen({ onLoginSuccess, fontSizeLarge }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 números ou letras.");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!name) {
          setError("Por favor, escreva o seu nome.");
          setIsLoading(false);
          return;
        }
        const { data, error: signupError } = await mockAuthService.signUp(email, password, name);
        if (signupError) {
          setError(signupError.message);
        } else {
          if (data?.isLocalFallback) {
            setInfo("Sua conta foi criada com sucesso no armazenamento local! (Sua base de dados Supabase remota possui uma falha interna 'Database error saving new user'. Salvamos seu cadastro de forma segura em seu navegador para que você consiga usar todas as funções normalmente!).");
          } else {
            setInfo("Conta criada! Pode entrar agora.");
          }
          setIsSignUp(false);
          setPassword("");
        }
      } else {
        const { data, error: loginError } = await mockAuthService.signIn(email, password);
        if (loginError) {
          setError(loginError.message);
        } else {
          const user = mockAuthService.getUser();
          if (user) {
            onLoginSuccess(user);
          }
        }
      }
    } catch (err: any) {
      setError("Houve um erro imprevisto. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAccess = () => {
    // Generate a quick guest profile
    const guestUser: UserProfile = {
      id: "demo_guest",
      name: "Querido Amigo",
      email: "convidado@professorrafa.com",
      emergencyContactName: "Familiar de Confiança",
      emergencyContactPhone: "",
      medicalNotes: "Nenhuma alergia relatada.",
      isDemo: true,
    };
    mockAuthService.updateProfile(guestUser);
    onLoginSuccess(guestUser);
  };  return (
    <div className="flex-1 p-4 flex flex-col justify-start space-y-4 bg-gradient-to-b from-sky-50 to-white overflow-y-auto max-h-full">
      
      {/* Visual greeting card */}
      <div className="text-center space-y-1.5 pt-1">
        <img 
          src="/logo.png" 
          alt="Professor Rafa" 
          className="mx-auto w-14 h-14 rounded-full shadow-md object-cover border-2 border-white ring-2 ring-sky-100 select-none animate-pulse-slow" 
          referrerPolicy="no-referrer"
        />
        <div className="space-y-0.5">
          <h2 className="text-xl sm:text-2xl font-black font-display text-sky-950 tracking-tight leading-none">
            Professor Rafa na Escuta
          </h2>
          <p className="text-slate-500 font-semibold text-xs sm:text-sm leading-tight max-w-xs mx-auto">
            Seu assistente de voz e saúde para uma vida mais leve e saudável!
          </p>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 space-y-4">
        <div className="flex border-b border-slate-100 pb-2 justify-around gap-1 select-none">
          <button 
            id="tab-entrar"
            onClick={() => { setIsSignUp(false); setError(null); }}
            className={`flex-1 py-1.5 text-lg sm:text-xl font-black rounded-lg transition-all ${
              !isSignUp ? 'text-sky-905 bg-sky-50 underline decoration-sky-600 decoration-2' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Entrar
          </button>
          <button 
            id="tab-criar-conta"
            onClick={() => { setIsSignUp(true); setError(null); }}
            className={`flex-1 py-1.5 text-lg sm:text-xl font-black rounded-lg transition-all ${
              isSignUp ? 'text-sky-905 bg-sky-50 underline decoration-sky-600 decoration-2' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 text-red-800 p-2.5 rounded-lg border border-red-200 flex items-start gap-2 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <span className="leading-relaxed font-semibold">{error}</span>
          </div>
        )}

        {info && (
          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg border border-emerald-200 flex items-start gap-2 text-xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <span className="leading-relaxed font-semibold">{info}</span>
          </div>
        )}

        {/* Inputs and Submit Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div className="space-y-0.5">
              <label htmlFor="user-name" className="block text-sm font-bold text-slate-700">Qual é o seu nome?</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  id="user-name"
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Escreva seu nome aqui"
                  className="w-full text-base pl-10 pr-3 py-2 border border-slate-250 rounded-xl focus:border-sky-550 bg-slate-50 font-medium h-10 sm:h-11"
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-0.5">
            <label htmlFor="user-email" className="block text-sm font-bold text-slate-700">Seu e-mail:</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                id="user-email"
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Exemplo: rafa@email.com"
                className="w-full text-base pl-10 pr-3 py-2 border border-slate-250 rounded-xl focus:border-sky-550 bg-slate-50 font-medium h-10 sm:h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-0.5">
            <label htmlFor="user-password" className="block text-sm font-bold text-slate-700">Sua senha:</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                id="user-password"
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escreva sua senha aqui"
                className="w-full text-base pl-10 pr-3 py-2 border border-slate-250 rounded-xl focus:border-sky-550 bg-slate-50 font-medium h-10 sm:h-11"
                required
              />
            </div>
          </div>

          <button 
            id="auth-submit-btn"
            type="submit" 
            disabled={isLoading}
            className="w-full bg-sky-600 hover:bg-sky-700 active:scale-95 text-white py-2 px-4 rounded-xl text-lg font-black border border-sky-800 shadow-sm flex items-center justify-center gap-2 mt-4 transition-all disabled:opacity-50 h-11"
          >
            <span>{isLoading ? "Carregando..." : isSignUp ? "Criar Minha Conta" : "Entrar no Aplicativo"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>

      {/* Guest Entrance Card */}
      <div className="bg-amber-50/70 border border-amber-200/50 rounded-xl p-3 text-center space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-amber-800 font-bold text-sm">
          <Compass className="w-5 h-5 shrink-0" />
          <span>Quer testar de forma simples e rápida?</span>
        </div>
        <p className="text-slate-600 text-xs leading-normal max-w-xs mx-auto">
          Você pode usar o aplicativo imediatamente sem criar nenhuma conta ou senha.
        </p>
        <button 
          id="demo-mode-btn"
          onClick={handleDemoAccess}
          className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-white py-2 px-4 rounded-lg text-sm sm:text-base font-bold border border-amber-700 shadow-xs transition-all h-10"
        >
          Experimentar Grátis (Modo Demo)
        </button>
      </div>

      {/* Warm assistance note */}
      <div className="text-center pb-1">
        <p className="text-slate-400 text-xs">
          Acessível para idosos com fontes maiores e layouts simples.
        </p>
      </div>

    </div>
  );
}
