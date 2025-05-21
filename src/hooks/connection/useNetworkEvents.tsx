
import { useEffect } from "react";
import { toast } from "sonner";

export const useNetworkEvents = (
  checkConnection: (forceCheck?: boolean) => Promise<any>
) => {
  // Kontrola při návratu do aplikace (když uživatel přepne zpět z jiné záložky)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log("Uživatel se vrátil do aplikace, kontroluji připojení");
        
        // Při návratu do aplikace, počkáme 2 sekundy na ustálení síťového připojení
        setTimeout(() => {
          checkConnection(true);
        }, 2000);
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [checkConnection]);
  
  // Kontrola při online/offline změnách
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 Zařízení přešlo do online režimu, kontroluji připojení...");
      toast.info("Internetové připojení obnoveno, kontroluji připojení k databázi");
      
      // Počkáme 2 sekundy na ustálení síťového připojení
      setTimeout(() => {
        checkConnection(true);
      }, 2000);
    };
    
    const handleOffline = () => {
      console.log("⚠️ Zařízení přešlo do offline režimu");
      toast.warning("Internetové připojení ztraceno, přepínám do offline režimu");
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);
};
