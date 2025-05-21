
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthState, UserProfile } from "@/types/authTypes";
import { toast } from "sonner";
import { cleanupAuthState } from "@/utils/authUtils";

export const useAuthMethods = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
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
      user: { id: user.id } as any,
      profile: localUser as UserProfile,
      isLoading: false,
      isAuthenticated: true,
      error: null
    });
  };

  return { signIn, signUp, signOut, setLocalUser };
};
