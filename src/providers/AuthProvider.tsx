
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthState, UserProfile } from "@/types/authTypes";
import { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { AuthContext } from "@/contexts/AuthContext";
import { cleanupAuthState } from "@/utils/authUtils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useNavigate } from "react-router-dom";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  const navigate = useNavigate();

  // Authentication methods
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Přihlášení úspěšné");
        // Force reload for clean state
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

  // Sign up with email, password, username and optional role
  const signUp = async (email: string, password: string, username: string, role: 'child' | 'parent' | 'teacher' = 'child') => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Clean up existing state
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

  // Sign out
  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      // Clean up auth state
      cleanupAuthState();
      
      // Remove local user
      localStorage.removeItem('localUser');
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }
      
      // Force page reload for clean state
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

  // Set local user without Supabase authentication
  const setLocalUser = (user: { id: string, username: string, role: string }) => {
    const localUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      created_at: new Date().toISOString()
    };
    
    localStorage.setItem('localUser', JSON.stringify(localUser));
    
    setAuthState({
      user: { id: user.id } as User,
      profile: localUser as UserProfile,
      isLoading: false,
      isAuthenticated: true,
      error: null
    });
  };

  // Initial auth state setup
  useEffect(() => {
    // Check for local user first
    const localUserStr = localStorage.getItem('localUser');
    
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        setAuthState({
          user: { id: localUser.id } as User,
          profile: localUser as UserProfile,
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
        return;
      } catch (e) {
        console.error("Error parsing local user:", e);
        localStorage.removeItem('localUser');
      }
    }
    
    // If no local user, check Supabase session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Update state synchronously
        setAuthState(prev => ({
          ...prev,
          user: session?.user || null,
          isAuthenticated: !!session?.user,
        }));

        if (session?.user) {
          // Defer profile loading to prevent deadlocks
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

    // Fetch initial session
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

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchUserProfile(session.user.id).then(profile => {
          setAuthState({
            user: session.user,
            profile,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
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
        setLocalUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
