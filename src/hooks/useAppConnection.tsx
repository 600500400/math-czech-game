
import { useState, useEffect } from "react";
import { checkSupabaseConnection } from "@/integrations/supabase/client";

import { logger } from "@/utils/logger";
export function useAppConnection() {
  const [databaseStatus, setDatabaseStatus] = useState<"checking" | "connected" | "disconnected" | "error">("checking");

  // Kontrola připojení k databázi při načtení
  useEffect(() => {
    const checkConnection = async () => {
      try {
        setDatabaseStatus("checking");
        const result = await checkSupabaseConnection();
        if (result.success) {
          setDatabaseStatus("connected");
          logger.log("Databáze je připojena:", result);
        } else {
          setDatabaseStatus("disconnected");
          logger.log("Aplikace běží v offline režimu");
        }
      } catch (error) {
        setDatabaseStatus("error");
        logger.log("Aplikace běží v offline režimu");
      }
    };
    
    checkConnection();
    
    // Nastavíme interval pro pravidelnou kontrolu, ale pouze když je stránka aktivní
    const visibilityHandler = () => {
      if (document.visibilityState === 'visible') {
        checkConnection();
      }
    };
    
    document.addEventListener('visibilitychange', visibilityHandler);
    
    return () => {
      document.removeEventListener('visibilitychange', visibilityHandler);
    };
  }, []);

  // Funkce pro manuální kontrolu/obnovení připojení
  const handleCheckConnection = async () => {
    try {
      setDatabaseStatus("checking");
      
      const result = await checkSupabaseConnection();
      
      if (result.success) {
        setDatabaseStatus("connected");
        logger.log("Připojení k databázi úspěšné");
      } else {
        setDatabaseStatus("disconnected");
        logger.log("Aplikace běží v offline režimu");
      }
    } catch (error) {
      setDatabaseStatus("error");
      logger.log("Aplikace běží v offline režimu");
    }
  };

  return { databaseStatus, handleCheckConnection };
}
