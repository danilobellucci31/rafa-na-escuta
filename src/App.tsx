import { useState, useEffect, useRef } from "react";
import { UserProfile } from "./types";
import { mockAuthService, supabase, isSupabaseConfigured } from "./lib/supabase";
import MobileFrame from "./components/MobileFrame";
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";
import ChatScreen from "./components/ChatScreen";
import ProfileScreen from "./components/ProfileScreen";
import SettingsScreen from "./components/SettingsScreen";
import { ExerciciosModule, SonoModule, MemoriaModule, RotinaModule, RemediosModule, AgendamentosModule, AlimentacaoModule, VideosModule } from "./components/ModuleScreens";
import EmergencyModal from "./components/EmergencyModal";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<"login" | "dashboard" | "chat" | "profile" | "settings" | "exercicios" | "sono" | "memoria" | "rotina" | "remedios" | "agendamentos" | "alimentacao" | "videos">("login");
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [fontSizePx, setFontSizePx] = useState<number>(() => {
    const cached = localStorage.getItem("senior_font_size_px");
    if (cached) return parseInt(cached, 10);
    return 18; // Default comfortable font size for older adults
  });

  const fontSizeLarge = fontSizePx >= 20;

  const setFontSizeLarge = (large: boolean) => {
    setFontSizePx(large ? 22 : 16);
  };

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSizePx}px`;
    localStorage.setItem("senior_font_size_px", fontSizePx.toString());
  }, [fontSizePx]);

  const notifiedRefs = useRef<Record<string, string>>({});

  // Request browser notification permissions immediately on user login
  useEffect(() => {
    if (user && typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((permission) => {
          console.log("Status de permissão de notificações:", permission);
        });
      }
    }
  }, [user]);

  // Periodic check for medicines or appointments to trigger push notifications
  useEffect(() => {
    if (!user) return;

    const checkScheduledNotifications = async () => {
      let remedios: any[] = [];
      let agendamentos: any[] = [];

      // 1. Fetch remedios
      if (isSupabaseConfigured && !user.isDemo) {
        try {
          const { data } = await supabase
            .from("remedios")
            .select("*")
            .eq("user_id", user.id);
          if (data) {
            remedios = data.map((d: any) => ({
              id: d.id.toString(),
              label: d.label,
              checked: !!d.checked,
              time: d.time
            }));
          }
        } catch (e) {
          console.warn("Erro ao buscar remedios para notificacoes:", e);
        }
      } else {
        const key = `senior_remedios_checklist_v2_${user.id}`;
        const local = localStorage.getItem(key);
        if (local) {
          try {
            remedios = JSON.parse(local);
          } catch (e) {}
        }
      }

      // 2. Fetch agendamentos
      if (isSupabaseConfigured && !user.isDemo) {
        try {
          const { data } = await supabase
            .from("agendamentos")
            .select("*")
            .eq("user_id", user.id);
          if (data) {
            agendamentos = data.map((d: any) => ({
              id: d.id.toString(),
              label: d.label,
              checked: !!d.checked,
              when: d.when
            }));
          }
        } catch (e) {
          console.warn("Erro ao buscar agendamentos para notificacoes:", e);
        }
      } else {
        const key = `senior_agendamentos_checklist_v2_${user.id}`;
        const local = localStorage.getItem(key);
        if (local) {
          try {
            agendamentos = JSON.parse(local);
          } catch (e) {}
        }
      }

      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, "0");
      const currentMinute = now.getMinutes().toString().padStart(2, "0");
      const currentTimeString = `${currentHour}:${currentMinute}`;

      const daysOfWeekPt = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
      const currentDayPt = daysOfWeekPt[now.getDay()];

      // Check Remedios
      remedios.forEach((item) => {
        if (item.checked) return;

        const parts = item.time.split(" (");
        const timeOnly = parts[0].trim();
        const daysOnly = parts[1] ? parts[1].replace(")", "").trim() : "Todos os dias";

        const dayMatches =
          daysOnly === "Todos os dias" ||
          daysOnly === "Sob demanda" ||
          daysOnly.toLowerCase().includes(currentDayPt.toLowerCase());

        if (timeOnly === currentTimeString && dayMatches) {
          const notificationKey = `remedio_${item.id}_${now.toDateString()}_${currentTimeString}`;
          if (!notifiedRefs.current[notificationKey]) {
            notifiedRefs.current[notificationKey] = "true";

            // Push notification in the browser
            if (typeof window !== "undefined" && "Notification" in window) {
              if (Notification.permission === "granted") {
                try {
                  const notif = new Notification("💊 Hora do Remédio", {
                    body: `Olá! Está na hora de tomar: ${item.label}`,
                    tag: `remedio_${item.id}`,
                    requireInteraction: true
                  });
                } catch (e) {
                  console.warn("Erro na notificacao:", e);
                }
              }
            }

            // Audio synthesis for friendly Voice Lembrete
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
              try {
                const speech = new SpeechSynthesisUtterance(`Atenção, hora de tomar seu remédio: ${item.label}`);
                speech.lang = "pt-BR";
                window.speechSynthesis.speak(speech);
              } catch (e) {
                console.warn("Erro ao falar:", e);
              }
            }
          }
        }
      });

      // Check Agendamentos
      agendamentos.forEach((item) => {
        if (item.checked) return;
        if (!item.when) return;

        const appDate = new Date(item.when);
        if (isNaN(appDate.getTime())) return;

        const isSameDate =
          appDate.getFullYear() === now.getFullYear() &&
          appDate.getMonth() === now.getMonth() &&
          appDate.getDate() === now.getDate() &&
          appDate.getHours() === now.getHours() &&
          appDate.getMinutes() === now.getMinutes();

        if (isSameDate) {
          const notificationKey = `agendamento_${item.id}_${now.toDateString()}_${currentTimeString}`;
          if (!notifiedRefs.current[notificationKey]) {
            notifiedRefs.current[notificationKey] = "true";

            // Push notification in the browser
            if (typeof window !== "undefined" && "Notification" in window) {
              if (Notification.permission === "granted") {
                try {
                  const notif = new Notification("📅 Lembrete de Compromisso", {
                    body: `Você tem um agendamento agora: ${item.label}`,
                    tag: `agendamento_${item.id}`,
                    requireInteraction: true
                  });
                } catch (e) {
                  console.warn("Erro na notificacao:", e);
                }
              }
            }

            // Audio synthesis for friendly Voice Lembrete
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
              try {
                const speech = new SpeechSynthesisUtterance(`Atenção, você tem um compromisso agora: ${item.label}`);
                speech.lang = "pt-BR";
                window.speechSynthesis.speak(speech);
              } catch (e) {
                console.warn("Erro ao falar:", e);
              }
            }
          }
        }
      });
    };

    // Run check immediately on mount and then every 15 seconds
    checkScheduledNotifications();
    const interval = setInterval(checkScheduledNotifications, 15000);

    return () => clearInterval(interval);
  }, [user]);

  // Load active user profile on mount and sync from Supabase
  useEffect(() => {
    const initUser = async () => {
      const savedUser = mockAuthService.getUser();
      if (savedUser) {
        setUser(savedUser);
        setCurrentView("dashboard");
      }
      
      // Attempt background cloud sync if Supabase is active
      try {
        const syncedUser = await mockAuthService.syncSession();
        if (syncedUser) {
          setUser(syncedUser);
        }
      } catch (err) {
        console.warn("Could not sync profile session on boot:", err);
      }
    };
    initUser();
  }, []);

  const handleLoginSuccess = (profile: UserProfile) => {
    setUser(profile);
    setCurrentView("dashboard");
  };

  const handleLogout = async () => {
    await mockAuthService.signOut();
    setUser(null);
    setCurrentView("login");
  };

  const handleStartChat = (initialPrompt?: string) => {
    setChatInitialPrompt(initialPrompt);
    setCurrentView("chat");
  };

  const handleGoBackToDashboard = () => {
    setChatInitialPrompt(undefined);
    setCurrentView("dashboard");
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    mockAuthService.updateProfile(updatedProfile);
  };

  return (
    <MobileFrame
      isLoggedIn={!!user}
      onEmergencyClick={() => setIsEmergencyOpen(true)}
      onLogout={handleLogout}
      fontSizeLarge={fontSizeLarge}
      setFontSizeLarge={setFontSizeLarge}
      fontSizePx={fontSizePx}
      setFontSizePx={setFontSizePx}
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
    >
      {/* Animated Screen Router */}
      {currentView === "login" && (
        <LoginScreen 
          onLoginSuccess={handleLoginSuccess} 
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "dashboard" && user && (
        <DashboardScreen
          userProfile={user}
          onStartChat={() => handleStartChat()}
          fontSizeLarge={fontSizeLarge}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === "exercicios" && (
        <ExerciciosModule
          onGoBack={handleGoBackToDashboard}
          onStartChat={handleStartChat}
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "sono" && (
        <SonoModule
          onGoBack={handleGoBackToDashboard}
          onStartChat={handleStartChat}
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "memoria" && (
        <MemoriaModule
          onGoBack={handleGoBackToDashboard}
          onStartChat={handleStartChat}
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "rotina" && (
        <RotinaModule
          onGoBack={handleGoBackToDashboard}
          onStartChat={handleStartChat}
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "remedios" && (
        <RemediosModule
          onGoBack={handleGoBackToDashboard}
          onStartChat={handleStartChat}
          fontSizeLarge={fontSizeLarge}
          user={user}
        />
      )}

      {currentView === "agendamentos" && (
        <AgendamentosModule
          onGoBack={handleGoBackToDashboard}
          onStartChat={handleStartChat}
          fontSizeLarge={fontSizeLarge}
          user={user}
        />
      )}

      {currentView === "alimentacao" && (
        <AlimentacaoModule
          onGoBack={handleGoBackToDashboard}
          onStartChat={handleStartChat}
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "videos" && (
        <VideosModule
          onGoBack={handleGoBackToDashboard}
          onStartChat={handleStartChat}
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "chat" && user && (
        <ChatScreen
          userProfile={user}
          initialPrompt={chatInitialPrompt}
          onGoBack={handleGoBackToDashboard}
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "profile" && user && (
        <ProfileScreen
          userProfile={user}
          onUpdateProfile={handleUpdateProfile}
          onGoBack={handleGoBackToDashboard}
          fontSizeLarge={fontSizeLarge}
        />
      )}

      {currentView === "settings" && (
        <SettingsScreen
          fontSizeLarge={fontSizeLarge}
          setFontSizeLarge={setFontSizeLarge}
          onGoBack={handleGoBackToDashboard}
        />
      )}

      {/* Persistent Critical Safety / Emergency Overlay */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        userProfile={user}
        onUpdateProfile={handleUpdateProfile}
      />
    </MobileFrame>
  );
}
