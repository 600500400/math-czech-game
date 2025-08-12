
import React, { useState, useEffect } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { cleanupAuthState } from "@/utils/authUtils";
import { AuthState, UserProfile } from "@/types/authTypes";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  // Basic auth methods to avoid circular dependencies
  const signIn = async (email: string, password: string) => {
    console.log("Sign in not implemented yet");
  };

  const signUp = async (email: string, password: string, username: string, role?: 'child' | 'parent' | 'teacher') => {
    console.log("Sign up not implemented yet");
  };

  const signOut = async () => {
    console.log("Odhlašování uživatele");
    localStorage.removeItem('localUser');
    setAuthState({
      user: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
  };

  const setLocalUser = (user: { id: string, username: string, role: string }) => {
    console.log(`Setting local user ${user.username} with ID ${user.id}`);
    localStorage.setItem('localUser', JSON.stringify(user));
    
    setAuthState({
      user: { id: user.id, username: user.username },
      profile: {
        ...user,
        created_at: new Date().toISOString()
      } as UserProfile,
      isLoading: false,
      isAuthenticated: true,
      error: null
    });
  };

  // Initial auth state setup
  useEffect(() => {
    const checkLocalUser = () => {
      const localUserStr = localStorage.getItem('localUser');
      
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          console.log("Nalezen lokální uživatel:", localUser.id);
          
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
