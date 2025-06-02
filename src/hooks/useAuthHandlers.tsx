
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

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

  const handleSignUp = async (email: string, password: string, username: string) => {
    setAuthLoading(true);
    try {
      await signUp(email, password, username);
      toast.success(t('auth.registrationSuccess'));
      // After successful signup, automatically sign in
      setTimeout(async () => {
        try {
          await signIn(email, password);
          navigate("/");
        } catch (error) {
          console.error("Auto sign in failed:", error);
          toast.success("Registrace úspěšná! Nyní se můžete přihlásit.");
        }
      }, 1000);
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
