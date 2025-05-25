
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { toast } from 'sonner';

// Interface for the return value of checkSupabaseConnection
export interface ConnectionCheckResult {
  success: boolean;
  error?: any;
  elapsed?: number;
  data?: any;
  offline?: boolean;
  timeout?: boolean;
  skipped?: boolean;
}

// Klíče Supabase - zajistíme, že jsou správně
const SUPABASE_URL = "https://giyrynavkqezdzhygwvk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpeXJ5bmF2a3FlemR6aHlnd3ZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzU2NjUsImV4cCI6MjA2MzM1MTY2NX0.tjVm14v_jHbp2AWZEJRsp32Zw5Amd7t5XiKYFJaNbws";

// Kompletní reset Supabase instance pro odstranění případných zombie připojení
// ALE DŮLEŽITÉ: Nikdy neodstraňujeme klíče statistik! Jen auth klíče!
const resetSupabaseCache = () => {
  // Vyčistíme localStorage od potenciálně problémových klíčů
  Object.keys(localStorage).forEach(key => {
    if ((key.startsWith('sb-') || key.includes('supabase'))
        && !key.includes('Stats_')  // Nikdy nemažeme statistiky!
        && !key.startsWith('mathStats_')
        && !key.startsWith('spellingStats_')
        && key !== 'localUser') {
      console.log(`Čistím localStorage klíč: ${key}`);
      localStorage.removeItem(key);
    }
  });
};

// Resetujeme před vytvořením nového klienta, ale jen auth klíče
resetSupabaseCache();

// Test síťového připojení před inicializací Supabase
const testNetworkConnection = async () => {
  try {
    // Pokusíme se o jednoduché síťové připojení
    const testStartTime = Date.now();
    const response = await fetch('https://www.google.com', { 
      mode: 'no-cors',
      cache: 'no-store',
      method: 'HEAD'
    });
    const elapsed = Date.now() - testStartTime;
    console.log(`Test síťového připojení: OK (${elapsed}ms)`);
    return true;
  } catch (error) {
    console.error("Problém se síťovým připojením:", error);
    return false;
  }
};

// Provedeme rychlý test připojení
testNetworkConnection().then(isConnected => {
  if (!isConnected) {
    console.warn("Problém s internetovým připojením detekován. Aplikace poběží v offline režimu.");
    // Odstraněno automatické zobrazení toast zprávy
  }
});

// Inicializace klienta s detailní konfigurací
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    debug: true, // Detailní logování pro diagnostiku
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-app-version': '1.0.0',
    },
    fetch: (url, options) => {
      // Vylepšené logování pro každý request
      console.log(`Supabase požadavek na: ${url}`);
      return fetch(url, {
        ...options,
        credentials: 'include',
      });
    },
  }
});

// Export pomocné funkce pro logování stavu připojení s vylepšeným logováním
export const checkSupabaseConnection = async (): Promise<ConnectionCheckResult> => {
  try {
    // Nejprve zkontrolujeme základní síťové připojení
    const networkConnected = await testNetworkConnection();
    if (!networkConnected) {
      console.error("Síťové připojení není dostupné, nelze připojit k Supabase");
      return { success: false, error: { message: "Není dostupné internetové připojení" }, offline: true };
    }
    
    console.log("Kontrola připojení k Supabase - nový pokus...");
    const startTime = Date.now();
    
    // Nastavíme timeout pro kontrolu
    const timeoutPromise = new Promise<ConnectionCheckResult>((_, reject) => {
      setTimeout(() => reject({ message: "Timeout při kontrole spojení" }), 10000);
    });
    
    // Funkce pro samotnou kontrolu
    const checkPromise = async () => {
      try {
        // Zkusíme nejprve získat současnou session pro kontrolu autentizace
        const authSession = await supabase.auth.getSession();
        console.log("Aktuální session:", authSession);
        
        // Jednoduchá kontrola oprávnění - zkusíme udělat velmi jednoduchý dotaz
        const { data, error } = await supabase.from("profiles").select("count").limit(1);
        
        const elapsed = Date.now() - startTime;
        
        if (error) {
          console.error(`Chyba při připojení k Supabase (${elapsed}ms):`, error);
          // Kontrola konkrétních typů chyb
          if (error.code === "PGRST301") {
            console.error("Problém s oprávněním - zkontrolujte Row Level Security (RLS)");
          } else if (error.code?.includes("token")) {
            console.error("Problém s autentizací - zkuste se odhlásit a znovu přihlásit");
          }
          return { success: false, error, elapsed };
        }
        
        console.log(`Připojení k Supabase úspěšné (${elapsed}ms):`, data);
        return { success: true, data, elapsed };
      } catch (err) {
        console.error("Neočekávaná chyba při kontrole připojení k Supabase:", err);
        return { success: false, error: err };
      }
    };
    
    // Spustíme kontrolu s timeoutem
    try {
      return await Promise.race([checkPromise(), timeoutPromise]);
    } catch (error) {
      console.error("Supabase kontrola selhala (timeout):", error);
      return { success: false, error, timeout: true };
    }
  } catch (err) {
    console.error("Neočekávaná chyba při kontrole připojení k Supabase:", err);
    return { success: false, error: err };
  }
};

// Automatická kontrola připojení při načtení - bez zobrazování toast zpráv
checkSupabaseConnection().then(result => {
  if (result.success) {
    console.log("Databáze je připravena k použití");
    // Odstraněno automatické zobrazení success toast zprávy
  } else {
    console.error("Problém s databází. Data budou ukládána lokálně.");
    // Odstraněny všechny automatické toast zprávy při problémech
  }
});
