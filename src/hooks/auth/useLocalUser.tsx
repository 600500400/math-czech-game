
import { AuthState } from "@/types/authTypes";
import { toast } from "sonner";

import { logger } from "@/utils/logger";
export const useLocalUser = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const setLocalUser = async (user: { id: string, username: string, role: string }) => {
    try {
      logger.log(`Setting local user ${user.username} with ID ${user.id}`);
      
      // Store user as local guest
      localStorage.setItem('localUser', JSON.stringify(user));
      
      setAuthState({
        user: { id: user.id, username: user.username } as any,
        profile: {
          id: user.id,
          username: user.username,
          role: user.role as any,
          created_at: new Date().toISOString(),
        },
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
      
      // Initialize empty statistics for new guest user if they don't exist
      const mathStatsKey = `mathStats_${user.id}`;
      const spellingStatsKey = `spellingStats_${user.id}`;
      
      if (!localStorage.getItem(mathStatsKey)) {
        localStorage.setItem(mathStatsKey, JSON.stringify([]));
        logger.log(`Inicializovány prázdné math statistiky pro ${user.id}`);
      }
      
      if (!localStorage.getItem(spellingStatsKey)) {
        localStorage.setItem(spellingStatsKey, JSON.stringify([]));
        logger.log(`Inicializovány prázdné spelling statistiky pro ${user.id}`);
      }
      
      logger.log(`Local guest user ${user.username} set up successfully`);
      
    } catch (error: any) {
      console.error("Error setting local user:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || "Chyba při nastavování lokálního uživatele"
      }));
    }
  };

  return { setLocalUser };
};
