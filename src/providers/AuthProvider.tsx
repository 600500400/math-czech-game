
import React from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { cleanupAuthState } from "@/utils/authUtils";
import { useAuthState } from "@/hooks/useAuthState";
import { useAuthMethods } from "@/hooks/useAuthMethods";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authState, setAuthState } = useAuthState();
  const { signIn, signUp, signOut, setLocalUser } = useAuthMethods(setAuthState);

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
