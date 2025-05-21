
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState, attemptGlobalSignOut, forcePageReload } from "@/utils/authUtils";
import { AuthState } from "@/types/authTypes";

export const useSignOut = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const signOut = async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      
      // Get current user ID before cleanup
      const localUserStr = localStorage.getItem('localUser');
      const currentUserId = localUserStr ? 
        JSON.parse(localUserStr).id : null;
      
      console.log("Začínám odhlašování uživatele s ID:", currentUserId);
      
      // DŮLEŽITÉ: NIKDY nečistíme statistiky při odhlášení
      // Záměrně necháváme statistiky v localStorage, aby byly dostupné i po odhlášení
      
      // Čistíme pouze autentizační data
      const cleanupResult = cleanupAuthState();
      console.log("Vyčištění auth stavu:", cleanupResult);
      
      // Odstraníme lokálního uživatele
      localStorage.removeItem('localUser');
      
      // Pokusíme se o globální odhlášení ze všech zařízení
      await attemptGlobalSignOut(supabase);
      
      // Vynucené přesměrování pro čistý stav
      forcePageReload('/auth');
    } catch (error: any) {
      console.error("Chyba při odhlášení:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Chyba při odhlášení",
      }));
    }
  };

  return { signOut };
};
