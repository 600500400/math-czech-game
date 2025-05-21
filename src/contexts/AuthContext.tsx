
import { createContext } from "react";
import { AuthState, UserProfile } from "@/types/authTypes";

// Context type definition
export interface AuthContextType {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, role?: 'child' | 'parent' | 'teacher') => Promise<void>;
  signOut: () => Promise<void>;
  cleanupAuthState: () => void;
  setLocalUser: (user: { id: string, username: string, role: string }) => void;
}

// Default context values
const defaultContext: AuthContextType = {
  authState: { user: null, profile: null, isLoading: true, isAuthenticated: false, error: null },
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  cleanupAuthState: () => {},
  setLocalUser: () => {},
};

// Create the auth context
export const AuthContext = createContext<AuthContextType>(defaultContext);
