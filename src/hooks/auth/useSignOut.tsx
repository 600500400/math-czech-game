
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState, attemptGlobalSignOut, forcePageReload } from "@/utils/authUtils";
import { AuthState } from "@/types/authTypes";

export const useSignOut = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      // Clean up auth state
      cleanupAuthState();
      
      // Remove local user
      localStorage.removeItem('localUser');
      
      // Attempt global sign out
      await attemptGlobalSignOut(supabase);
      
      // Force page reload for clean state
      forcePageReload('/auth');
    } catch (error: any) {
      console.error("Sign out error:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Chyba při odhlášení",
      }));
    }
  };

  return { signOut };
};
