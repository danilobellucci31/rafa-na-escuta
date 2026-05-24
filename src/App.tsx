import { useState, useEffect } from "react";
import { UserProfile } from "./types";
import { mockAuthService } from "./lib/supabase";
import MobileFrame from "./components/MobileFrame";
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";
import ChatScreen from "./components/ChatScreen";
import ProfileScreen from "./components/ProfileScreen";
import SettingsScreen from "./components/SettingsScreen";
import { ExerciciosModule, SonoModule, MemoriaModule, RotinaModule, RemediosModule, AgendamentosModule } from "./components/ModuleScreens";
import EmergencyModal from "./components/EmergencyModal";

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<"login" | "dashboard" | "chat" | "profile" | "settings" | "exercicios" | "sono" | "memoria" | "rotina" | "remedios" | "agendamentos">("login");
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | undefined>(undefined);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [fontSizeLarge, setFontSizeLarge] = useState(true);

  // Load active user profile on mount
  useEffect(() => {
    const savedUser = mockAuthService.getUser();
    if (savedUser) {
      setUser(savedUser);
      setCurrentView("dashboard");
    }
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
        />
      )}

      {currentView === "agendamentos" && (
        <AgendamentosModule
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
