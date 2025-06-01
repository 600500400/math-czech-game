
import { AuthState } from "@/types/authTypes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useLocalUser = (setAuthState: React.Dispatch<React.SetStateAction<AuthState>>) => {
  const setLocalUser = async (user: { id: string, username: string, role: string }) => {
    try {
      console.log(`Přihlašování lokálního uživatele ${user.username} s ID ${user.id}`);
      
      // First try to sign in this user to Supabase using email/password
      // For demo purposes, we'll create a dummy email and try to sign in
      const email = `${user.username.toLowerCase()}@demo.local`;
      const password = "demo123456"; // Demo password
      
      // Try to sign up the user first (in case they don't exist)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: user.username,
            role: user.role
          }
        }
      });

      if (signUpError && !signUpError.message.includes('already been registered')) {
        console.error("Sign up error:", signUpError);
      }

      // Now try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        // Fall back to local user mode
        localStorage.setItem('localUser', JSON.stringify(user));
        
        setAuthState({
          user: { id: user.id } as any,
          profile: {
            id: user.id,
            username: user.username,
            role: user.role as any,
          },
          isLoading: false,
          isAuthenticated: true,
          error: null
        });
      } else {
        console.log("Successfully signed in to Supabase:", signInData.user?.id);
        // Auth state will be updated by the auth state change listener
      }
      
    } catch (error: any) {
      console.error("Error setting local user:", error);
      
      // Fall back to pure local mode
      localStorage.setItem('localUser', JSON.stringify(user));
      
      setAuthState({
        user: { id: user.id } as any,
        profile: {
          id: user.id,
          username: user.username,
          role: user.role as any,
        },
        isLoading: false,
        isAuthenticated: true,
        error: null
      });
      
      toast.success(`Přihlášen jako ${user.username} (lokální režim)`);
    }
  };

  return { setLocalUser };
};
