
import { useState, useEffect } from "react";
import { AuthState, UserProfile } from "@/types/authTypes";

import { logger } from "@/utils/logger";
export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Initial auth state setup
  useEffect(() => {
    const checkLocalUser = () => {
      const localUserStr = localStorage.getItem('localUser');
      
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          logger.log("Nalezen lokální uživatel:", localUser.id);
          
          setAuthState({
            user: { id: localUser.id, username: localUser.username },
            profile: {
              ...localUser,
              created_at: new Date().toISOString()
            } as UserProfile,
            isLoading: false,
            isAuthenticated: true,
            error: null
          });
          return;
        } catch (e) {
          console.error("Chyba při parsování lokálního uživatele:", e);
          localStorage.removeItem('localUser');
        }
      }

      // Žádný uživatel
      setAuthState({
        user: null,
        profile: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    };

    checkLocalUser();
  }, []);

  return { authState, setAuthState };
};
