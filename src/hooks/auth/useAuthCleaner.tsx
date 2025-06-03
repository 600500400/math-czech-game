
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAuthCleaner = () => {
  const cleanupAuthState = () => {
    console.log("Čištění auth stavu...");
    
    // Vyčistíme localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
        console.log(`Odstraněn klíč: ${key}`);
      }
    });
    
    // Vyčistíme sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      Object.keys(sessionStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          sessionStorage.removeItem(key);
          console.log(`Odstraněn sessionStorage klíč: ${key}`);
        }
      });
    }
    
    console.log("Auth stav vyčištěn");
  };

  const forceAuthRefresh = async () => {
    try {
      console.log("Vynucování refresh auth stavu...");
      
      // Nejdříve vyčistíme stav
      cleanupAuthState();
      
      // Pokusíme se o globální odhlášení
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log("Globální odhlášení selhalo, pokračujeme...", err);
      }
      
      // Krátká pauza
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Obnovíme session
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Chyba při obnovování session:", error);
        throw error;
      }
      
      console.log("Auth stav obnoven:", data.session?.user?.id);
      
      // Vynucujeme page reload pro úplně čistý stav
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return true;
    } catch (error) {
      console.error("Chyba při refresh auth:", error);
      toast.error("Nepodařilo se obnovit auth stav");
      return false;
    }
  };

  return {
    cleanupAuthState,
    forceAuthRefresh
  };
};
