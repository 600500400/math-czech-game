
import { useState, useEffect } from "react";
import { checkSupabaseConnection } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
          console.log("Databáze je připojena:", result);
          toast.success("Připojení k databázi úspěšné");
        } else {
          setDatabaseStatus("disconnected");
          console.error("Problém s připojením k databázi:", result.error);
          toast.warning("Problém s připojením k databázi - statistiky budou uloženy lokálně");
        }
      } catch (error) {
        setDatabaseStatus("error");
        console.error("Chyba při kontrole databáze:", error);
        toast.error("Chyba při kontrole databáze");
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
      toast.info("Kontroluji připojení k databázi...");
      
      const result = await checkSupabaseConnection();
      
      if (result.success) {
        setDatabaseStatus("connected");
        toast.success(`Připojení k databázi úspěšné! (${result.elapsed}ms)`);
      } else {
        setDatabaseStatus("disconnected");
        toast.error("Problém s připojením k databázi");
      }
    } catch (error) {
      setDatabaseStatus("error");
      toast.error("Chyba při kontrole připojení k databázi");
    }
  };

  return { databaseStatus, handleCheckConnection };
}
