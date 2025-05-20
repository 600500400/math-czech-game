
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthState, UserProfile } from "@/types/authTypes";
import { useNavigate } from "react-router-dom";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";

// Vytvoření kontextu pro autentizaci
const AuthContext = createContext<{
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, role?: 'child' | 'parent' | 'teacher') => Promise<void>;
  signOut: () => Promise<void>;
  cleanupAuthState: () => void;
}>({
  authState: { user: null, profile: null, isLoading: true, isAuthenticated: false, error: null },
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  cleanupAuthState: () => {},
});

// Funkce pro vyčištění auth state
const cleanupAuthState = () => {
  // Odstranění standardních auth tokenů
  localStorage.removeItem('supabase.auth.token');
  // Odstranění všech Supabase auth klíčů z localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  // Odstranění z sessionStorage, pokud je používáno
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  const navigate = useNavigate();

  // Funkce pro načtení profilu uživatele
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  // Nastavení stavu přihlášení
  const setAuthData = async (session: Session | null) => {
    if (session?.user) {
      const profile = await fetchUserProfile(session.user.id);
      setAuthState({
        user: session.user,
        profile,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } else {
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    }
  };

  // Přihlášení uživatele
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Vyčištění existujícího stavu
      cleanupAuthState();
      
      // Pokus o globální odhlášení
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Pokračujeme i když toto selže
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Přihlášení úspěšné");
        // Použijeme force reload pro čistý stav
        window.location.href = '/';
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Chyba při přihlášení",
      }));
      toast.error(error.message || "Chyba při přihlášení");
    }
  };

  // Registrace uživatele
  const signUp = async (email: string, password: string, username: string, role: 'child' | 'parent' | 'teacher' = 'child') => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Vyčištění existujícího stavu
      cleanupAuthState();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            role
          },
        },
      });

      if (error) throw error;

      toast.success("Registrace úspěšná! Můžete se přihlásit.");
      return;
    } catch (error: any) {
      console.error("Sign up error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Chyba při registraci",
      }));
      toast.error(error.message || "Chyba při registraci");
    }
  };

  // Odhlášení uživatele
  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      // Vyčištění auth stavu
      cleanupAuthState();
      
      // Pokus o globální odhlášení
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignorujeme chyby
      }
      
      // Vynucené přesměrování pro čistý stav
      window.location.href = '/auth';
    } catch (error: any) {
      console.error("Sign out error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Chyba při odhlášení",
      }));
    }
  };

  // Načtení stavu přihlášení při prvním načtení
  useEffect(() => {
    // Nejprve nastavíme posluchače událostí autentizace
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Synchronně aktualizujeme stav
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
        }));

        if (session?.user) {
          // Odložené načtení dat pro zabránění deadlockům
          setTimeout(() => {
            fetchUserProfile(session.user.id).then(profile => {
              setAuthState(prev => ({
                ...prev,
                profile,
                isLoading: false,
              }));
            });
          }, 0);
        }
      }
    );

    // Poté zkontrolujeme existující relaci
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthData(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        signIn,
        signUp,
        signOut,
        cleanupAuthState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook pro použití autentizace
export const useAuth = () => useContext(AuthContext);

// Hook pro ověření, zda je uživatel přihlášený
export const useRequireAuth = (redirectTo = "/auth") => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      navigate(redirectTo);
    }
  }, [authState.isLoading, authState.isAuthenticated, navigate, redirectTo]);

  return authState;
};
