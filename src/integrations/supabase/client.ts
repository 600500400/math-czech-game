
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://giyrynavkqezdzhygwvk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeXJ5bmF2a3FlemR6aHlnd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzU2NjUsImV4cCI6MjA2MzM1MTY2NX0.tjVm14v_jHbp2AWZEJRsp32Zw5Amd7t5XiKYFJaNbws";

// Inicializace klienta s explicitním nastavením auth
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // Detekce session v URL (pro přesměrování po přihlášení)
    debug: true, // Povolit logování pro debugování
  }
});

// Export pomocné funkce pro logování stavu připojení
export const checkSupabaseConnection = async () => {
  try {
    console.log("Kontrola připojení k Supabase...");
    const { data, error } = await supabase.from("profiles").select("count").limit(1);
    
    if (error) {
      console.error("Chyba při připojení k Supabase:", error);
      return { success: false, error };
    }
    
    console.log("Připojení k Supabase úspěšné:", data);
    return { success: true, data };
  } catch (err) {
    console.error("Neočekávaná chyba při kontrole připojení k Supabase:", err);
    return { success: false, error: err };
  }
}
