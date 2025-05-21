
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState, attemptGlobalSignOut, forcePageReload } from "@/utils/authUtils";
import { AuthState } from "@/types/authTypes";
import { toast } from "sonner";

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
      // Kontrola existence statistik před odhlášením
      if (currentUserId) {
        const mathStatsKey = `mathStats_${currentUserId}`;
        const spellingStatsKey = `spellingStats_${currentUserId}`;
        
        const mathStats = localStorage.getItem(mathStatsKey);
        const spellingStats = localStorage.getItem(spellingStatsKey);
        
        console.log("Statistiky před odhlášením:", {
          mathStats: mathStats ? JSON.parse(mathStats).length : 0,
          spellingStats: spellingStats ? JSON.parse(spellingStats).length : 0
        });
      }
      
      // Čistíme pouze autentizační data
      const cleanupResult = cleanupAuthState();
      console.log("Vyčištění auth stavu:", cleanupResult);
      
      // Odstraníme lokálního uživatele
      localStorage.removeItem('localUser');
      
      // Pokusíme se o globální odhlášení ze všech zařízení
      await attemptGlobalSignOut(supabase);
      
      // Zkontrolujeme zachování statistik po odhlášení
      if (currentUserId) {
        const mathStatsKey = `mathStats_${currentUserId}`;
        const spellingStatsKey = `spellingStats_${currentUserId}`;
        
        const mathStats = localStorage.getItem(mathStatsKey);
        const spellingStats = localStorage.getItem(spellingStatsKey);
        
        console.log("Statistiky po odhlášení (měly by zůstat zachované):", {
          mathStats: mathStats ? JSON.parse(mathStats).length : 0,
          spellingStats: spellingStats ? JSON.parse(spellingStats).length : 0
        });
      }
      
      // Aktualizujeme stav bez přesměrování
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        error: null
      });
      
      toast.success("Odhlášení proběhlo úspěšně");
      
      // Vynucené přesměrování pro čistý stav
      forcePageReload('/auth');
    } catch (error: any) {
      console.error("Chyba při odhlášení:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Chyba při odhlášení",
      }));
      toast.error(`Chyba při odhlášení: ${error.message || "Neznámá chyba"}`);
    }
  };

  return { signOut };
};
