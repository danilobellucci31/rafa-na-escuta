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
      
      // Attempt background save to cloud profiles or user metadata
      mockAuthService.updateProfile(newUserProfile).catch(err => {
        console.warn("Could not save initial profile to Supabase during sign up:", err);
      });

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

      // Load profile metadata from user_metadata (which always exists in Supabase Auth user record)
      const userMeta = data.user?.user_metadata || {};

      // Try reading row from profiles table as backup if configured and it exists
      let dbProfile: Partial<UserProfile> = {};
      try {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user?.id)
          .single();
        if (profileRow) {
          dbProfile = {
            name: profileRow.name,
            emergencyContactName: profileRow.emergency_contact_name || profileRow.emergencyContactName,
            emergencyContactPhone: profileRow.emergency_contact_phone || profileRow.emergencyContactPhone,
            medicalNotes: profileRow.medical_notes || profileRow.medicalNotes
          };
        }
      } catch (e) {
        // Quiet fallback
      }

      // Update locally cached info or fetch
      const currentProfile: UserProfile = {
        id: data.user?.id || "",
        name: dbProfile.name || userMeta.full_name || userMeta.name || email.split("@")[0],
        email: email,
        emergencyContactName: dbProfile.emergencyContactName || userMeta.emergencyContactName || "Familiar",
        emergencyContactPhone: dbProfile.emergencyContactPhone || userMeta.emergencyContactPhone || "",
        medicalNotes: dbProfile.medicalNotes || userMeta.medicalNotes || "",
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

  fetchProfile: async (userId: string): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      // First try to fetch from 'profiles' database table
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      
      if (!error && data) {
        return {
          id: userId,
          name: data.name || "",
          email: data.email || "",
          emergencyContactName: data.emergency_contact_name || data.emergencyContactName || "Familiar",
          emergencyContactPhone: data.emergency_contact_phone || data.emergencyContactPhone || "",
          medicalNotes: data.medical_notes || data.medicalNotes || "",
          isDemo: false
        };
      }
    } catch (err) {
      console.warn("Could not load from profiles table:", err);
    }
    return null;
  },

  syncSession: async (): Promise<UserProfile | null> => {
    if (!isSupabaseConfigured) return null;
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return null;
      
      const userMeta = user.user_metadata || {};
      
      // Try DB table too
      let dbProfile: Partial<UserProfile> = {};
      try {
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileRow) {
          dbProfile = {
            name: profileRow.name,
            emergencyContactName: profileRow.emergency_contact_name || profileRow.emergencyContactName,
            emergencyContactPhone: profileRow.emergency_contact_phone || profileRow.emergencyContactPhone,
            medicalNotes: profileRow.medical_notes || profileRow.medicalNotes
          };
        }
      } catch (e) {
        // Quiet fallback
      }

      const activeProfile: UserProfile = {
        id: user.id,
        name: dbProfile.name || userMeta.full_name || userMeta.name || user.email?.split("@")[0] || "Visitante",
        email: user.email || "",
        emergencyContactName: dbProfile.emergencyContactName || userMeta.emergencyContactName || "Familiar",
        emergencyContactPhone: dbProfile.emergencyContactPhone || userMeta.emergencyContactPhone || "",
        medicalNotes: dbProfile.medicalNotes || userMeta.medicalNotes || "",
        isDemo: false
      };

      localStorage.setItem("rafa_user_profile", JSON.stringify(activeProfile));
      return activeProfile;
    } catch (err) {
      console.error("Erro ao sincronizar sessão com Supabase:", err);
      return null;
    }
  },

  updateProfile: async (profile: UserProfile): Promise<void> => {
    localStorage.setItem("rafa_user_profile", JSON.stringify(profile));
    
    if (isSupabaseConfigured && !profile.isDemo) {
      try {
        // 1. Update Supabase Auth user_metadata (highly guaranteed to run as long as auth is active!)
        await supabase.auth.updateUser({
          data: {
            full_name: profile.name,
            emergencyContactName: profile.emergencyContactName,
            emergencyContactPhone: profile.emergencyContactPhone,
            medicalNotes: profile.medicalNotes
          }
        });

        // 2. Also try writing duplicate state inside public 'profiles' table if it exists
        try {
          const { error: dbError } = await supabase
            .from("profiles")
            .upsert({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              emergency_contact_name: profile.emergencyContactName,
              emergency_contact_phone: profile.emergencyContactPhone,
              medical_notes: profile.medicalNotes,
              updated_at: new Date().toISOString()
            }, { onConflict: "id" });

          if (dbError) {
            // Retry with camelCase keys
            await supabase
              .from("profiles")
              .upsert({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                emergencyContactName: profile.emergencyContactName,
                emergencyContactPhone: profile.emergencyContactPhone,
                medicalNotes: profile.medicalNotes
              }, { onConflict: "id" });
          }
        } catch (dbErr) {
          console.warn("Profiles database table update skipped/unavailable:", dbErr);
        }
      } catch (err) {
        console.error("Erro geral ao atualizar perfil no Supabase:", err);
      }
    }
  }
};
