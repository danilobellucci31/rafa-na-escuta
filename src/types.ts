export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalNotes: string;
  isDemo?: boolean;
  dbErrorFallback?: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "rafa";
  timestamp: Date;
  isAudio?: boolean;
}

export interface HealthTopic {
  id: string;
  title: string;
  description: string;
  detailedTip: string;
  color: string;
  iconName: string;
  audioPrompt: string; // Prompt used to ask Rafa initially about this topic
}
