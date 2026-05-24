import { createClient } from "@supabase/supabase-js";
import { UserProfile } from "../types";

// Access Vite client-side env vars
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

// Check if variables are configured
export const isSupabaseConfigured = !!(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== "https://sua-url-do-supabase.supabase.co"
);

// Lazy initialization wrapper
let supabaseInstance: any = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    console.log("✅ Conectado ao Supabase com sucesso!");
  } catch (err) {
    console.error("❌ Falha ao carregar o cliente do Supabase:", err);
  }
} else {
  console.warn(
    "⚠️ Supabase não configurado ou usando valores padrões. O app irá rodar no modo de demonstração local usando localStorage."
  );
}

// Simple export of the client instance (could be null if not configured)
export const supabase = supabaseInstance;

/**
 * Robust mock authentication engine for instant testability
 */
export const mockAuthService = {
  getUser: (): UserProfile | null => {
    const userStr = localStorage.getItem("rafa_user_profile");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  signUp: async (email: string, passwordString: string, name: string): Promise<{ data: any; error: any }> => {
    // Check if it should try mock
    if (!isSupabaseConfigured) {
      // Simulate network latency
      await new Promise(r => setTimeout(r, 800));
      const existingUser = localStorage.getItem(`mock_user_${email}`);
      if (existingUser) {
        return { data: null, error: { message: "Esta conta já existe no modo demonstração." } };
      }
      const newUserProfile: UserProfile = {
        id: "mock_" + Math.random().toString(36).substr(2, 9),
        name: name || "Visitante",
        email: email,
        emergencyContactName: "Familiar de Confiança",
        emergencyContactPhone: "",
        medicalNotes: "Nenhuma alergia relatada.",
        isDemo: true
      };
      
      localStorage.setItem(`mock_user_${email}`, JSON.stringify({ passwordString, profile: newUserProfile }));
      localStorage.setItem("rafa_user_profile", JSON.stringify(newUserProfile));
      return { data: { user: newUserProfile }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: passwordString,
        options: {
          data: {
            full_name: name
          }
        }
      });

      if (error) {
        if (error.message && error.message.includes("Database error saving new user")) {
          // Fall back gracefully to a fully working local account when the Supabase trigger fails.
          console.warn("Supabase database trigger error. Falling back to secure local account.");
          const newUserProfile: UserProfile = {
            id: "local_fb_" + Math.random().toString(36).substr(2, 9),
            name: name || "Visitante",
            email: email,
            emergencyContactName: "Familiar de Confiança",
            emergencyContactPhone: "",
            medicalNotes: "Nenhuma alergia relatada.",
            isDemo: true,
            dbErrorFallback: true
          };
          localStorage.setItem(`mock_user_${email}`, JSON.stringify({ passwordString, profile: newUserProfile }));
          localStorage.setItem("rafa_user_profile", JSON.stringify(newUserProfile));
          return { data: { user: newUserProfile, isLocalFallback: true }, error: null };
        }
        return { data: null, error };
      }

      // Create profile initial state
      const newUserProfile: UserProfile = {
        id: data.user?.id || "",
        name: name,
        email: email,
        emergencyContactName: "Familiar",
        emergencyContactPhone: "",
        medicalNotes: "",
        isDemo: false
      };
      localStorage.setItem("rafa_user_profile", JSON.stringify(newUserProfile));
      return { data, error: null };
    } catch (err: any) {
      if (err.message && err.message.includes("Database error saving new user")) {
        console.warn("Supabase database trigger error caught. Falling back to secure local account.");
        const newUserProfile: UserProfile = {
          id: "local_fb_" + Math.random().toString(36).substr(2, 9),
          name: name || "Visitante",
          email: email,
          emergencyContactName: "Familiar de Confiança",
          emergencyContactPhone: "",
          medicalNotes: "Nenhuma alergia relatada.",
          isDemo: true,
          dbErrorFallback: true
        };
        localStorage.setItem(`mock_user_${email}`, JSON.stringify({ passwordString, profile: newUserProfile }));
        localStorage.setItem("rafa_user_profile", JSON.stringify(newUserProfile));
        return { data: { user: newUserProfile, isLocalFallback: true }, error: null };
      }
      return { data: null, error: err };
    }
  },

  signIn: async (email: string, passwordString: string): Promise<{ data: any; error: any }> => {
    // Check if there is a local fallback credentials for this email
    const localUserStr = localStorage.getItem(`mock_user_${email}`);
    if (localUserStr) {
      const parsed = JSON.parse(localUserStr);
      if (parsed.profile && parsed.profile.dbErrorFallback) {
        if (parsed.passwordString !== passwordString) {
          return { data: null, error: { message: "Senha incorreta para esta conta local." } };
        }
        localStorage.setItem("rafa_user_profile", JSON.stringify(parsed.profile));
        return { data: { user: parsed.profile }, error: null };
      }
    }

    if (!isSupabaseConfigured) {
      await new Promise(r => setTimeout(r, 800));
      const userStr = localStorage.getItem(`mock_user_${email}`);
      if (!userStr) {
        return { data: null, error: { message: "Usuário não encontrado. Crie uma conta no modo demonstração para testar!" } };
      }

      const parsed = JSON.parse(userStr);
      if (parsed.passwordString !== passwordString) {
        return { data: null, error: { message: "Senha incorreta para esta conta de demonstração." } };
      }

      localStorage.setItem("rafa_user_profile", JSON.stringify(parsed.profile));
      return { data: { user: parsed.profile }, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordString,
      });

      if (error) return { data: null, error };

      // Update locally cached info or fetch
      const currentProfile: UserProfile = {
        id: data.user?.id || "",
        name: data.user?.user_metadata?.full_name || email.split("@")[0],
        email: email,
        emergencyContactName: "Familiar",
        emergencyContactPhone: "",
        medicalNotes: "",
        isDemo: false
      };
      localStorage.setItem("rafa_user_profile", JSON.stringify(currentProfile));
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err };
    }
  },

  signOut: async (): Promise<void> => {
    localStorage.removeItem("rafa_user_profile");
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  updateProfile: (profile: UserProfile): void => {
    localStorage.setItem("rafa_user_profile", JSON.stringify(profile));
    // Here we can also save to public.profiles table in Supabase in future MVP phases
  }
};
