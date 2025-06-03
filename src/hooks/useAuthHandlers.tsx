
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

export const useAuthHandlers = () => {
  const { signIn, signUp, setLocalUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      await signIn(email, password);
      toast.success(t('auth.loginSuccess'));
      navigate("/");
    } catch (error: any) {
      console.error("Sign in failed:", error);
      toast.error(error.message || "Chyba při přihlášení");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, username: string, role: string = "child") => {
    setAuthLoading(true);
    try {
      // Sign up with role in metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: username,
            role: role
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        toast.success("Registrace úspěšná! Zkontrolujte email pro potvrzení.");
        // Auto sign in after successful signup
        setTimeout(async () => {
          try {
            await signIn(email, password);
            navigate("/");
          } catch (error) {
            console.error("Auto sign in failed:", error);
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("Sign up failed:", error);
      toast.error(error.message || "Chyba při registraci");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGuestMode = async () => {
    const guestUser = {
      id: uuidv4(),
      username: t('user.guest'),
      role: "child"
    };
    
    await setLocalUser(guestUser);
    toast.success(t('auth.guestWelcome'));
    navigate("/");
  };

  return {
    handleSignIn,
    handleSignUp,
    handleGuestMode,
    authLoading
  };
};
