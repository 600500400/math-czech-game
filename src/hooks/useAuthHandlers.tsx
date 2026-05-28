
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { supabase } from "@/integrations/supabase/client";

import { logger } from "@/utils/logger";
export const useAuthHandlers = () => {
  const { signIn, signUp, setLocalUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [authLoading, setAuthLoading] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    setAuthLoading(true);
    try {
      logger.log("Zahajuji přihlášení pro email:", email);
      
      await signIn(email, password);
      toast.success(t('auth.loginSuccess'));
      
      // Počkáme chvilku na aktualizaci stavu
      setTimeout(() => {
        navigate("/");
      }, 1000);
      
    } catch (error: any) {
      console.error("Přihlášení selhalo:", error);
      
      // Specifické chybové zprávy
      if (error.message.includes('Invalid login credentials')) {
        toast.error("Neplatný email nebo heslo");
      } else if (error.message.includes('Email not confirmed')) {
        toast.error("Email ještě nebyl potvrzen. Zkontrolujte svou emailovou schránku.");
      } else if (error.message.includes('Too many requests')) {
        toast.error("Příliš mnoho pokusů o přihlášení. Zkuste to později.");
      } else {
        toast.error(`Chyba při přihlášení: ${error.message || "Neznámá chyba"}`);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, username: string, role: string = "child") => {
    setAuthLoading(true);
    try {
      logger.log("Zahajuji registraci pro email:", email, "s rolí:", role);
      
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
      
      if (error) {
        console.error("Registrace selhala:", error);
        throw error;
      }
      
      if (data.user) {
        logger.log("Registrace úspěšná pro uživatele:", data.user.id);
        
        if (data.user.email_confirmed_at) {
          toast.success("Registrace úspěšná! Přihlašuji...");
          // Auto sign in if email is already confirmed
          setTimeout(async () => {
            try {
              await signIn(email, password);
              navigate("/");
            } catch (error) {
              console.error("Auto přihlášení selhalo:", error);
              toast.error("Registrace úspěšná, ale auto-přihlášení selhalo. Přihlaste se ručně.");
            }
          }, 2000);
        } else {
          toast.success("Registrace úspěšná! Zkontrolujte email pro potvrzení.");
        }
      }
    } catch (error: any) {
      console.error("Registrace selhala:", error);
      
      // Specifické chybové zprávy
      if (error.message.includes('User already registered')) {
        toast.error("Uživatel s tímto emailem už existuje");
      } else if (error.message.includes('Password should be at least')) {
        toast.error("Heslo musí mít alespoň 6 znaků");
      } else if (error.message.includes('Invalid email')) {
        toast.error("Neplatný formát emailu");
      } else {
        toast.error(`Chyba při registraci: ${error.message || "Neznámá chyba"}`);
      }
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
    
    logger.log("Vytváření guest uživatele:", guestUser);
    
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
