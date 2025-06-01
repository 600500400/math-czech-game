
import { toast } from "sonner";
import { supabase, checkSupabaseConnection } from "@/integrations/supabase/client";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

export const useDiagnostics = (
  userId: string | null,
  mathStats: MathStatistics[],
  spellingStats: SpellingStatistics[]
) => {
  // Funkce pro vynucené testování připojení k Supabase
  const testSupabaseConnection = async () => {
    toast.info("Testuji přímé připojení k Supabase...");
    
    try {
      const result = await checkSupabaseConnection();
      if (result.success) {
        toast.success(`Přímé připojení k Supabase úspěšné (${result.elapsed}ms)`);
        
        // Since there are no tables yet, we'll skip the profiles query
        toast.info("Database je připravena, ale zatím neobsahuje tabulky");
        
      } else {
        toast.error(`Problém s připojením k Supabase: ${result.error?.message || 'Neznámá chyba'}`);
      }
    } catch (error: any) {
      console.error("Chyba při testování Supabase:", error);
      toast.error(`Neočekávaná chyba: ${error.message || 'Neznámá chyba'}`);
    }
  };

  // Funkce pro export lokálních statistik
  const exportLocalStatistics = () => {
    const statsData = {
      user: userId,
      timestamp: new Date().toISOString(),
      mathStats: mathStats,
      spellingStats: spellingStats,
      localStorage: {}
    };
    
    // Přidáme obsah localStorage (pouze statistiky)
    Object.keys(localStorage).forEach(key => {
      if (key.includes('Stats_') || key.startsWith('mathStats_') || key.startsWith('spellingStats_')) {
        try {
          statsData.localStorage[key] = JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
          statsData.localStorage[key] = localStorage.getItem(key);
        }
      }
    });
    
    // Vytvoříme a stáhneme soubor
    const dataStr = JSON.stringify(statsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `procvicka-stats-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Statistiky exportovány do JSON souboru");
  };

  return {
    testSupabaseConnection,
    exportLocalStatistics
  };
};
