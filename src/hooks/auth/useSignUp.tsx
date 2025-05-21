
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cleanupAuthState } from "@/utils/authUtils";
import { AuthState } from "@/types/authTypes";

export const useSignUp = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
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

  return { signUp };
};
