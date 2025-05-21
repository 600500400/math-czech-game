
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cleanupAuthState, attemptGlobalSignOut, forcePageReload } from "@/utils/authUtils";
import { AuthState } from "@/types/authTypes";

export const useSignIn = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const signIn = async (email: string, password: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      
      // Clean up existing state
      cleanupAuthState();
      
      // Attempt global sign out
      await attemptGlobalSignOut(supabase);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Přihlášení úspěšné");
        // Force reload for clean state
        forcePageReload('/');
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

  return { signIn };
};
