
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SpellingStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { useStatisticsCore } from "./useStatisticsCore";

export const useSpellingStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { checkLocalUserMode, getLocalStorageKey } = useStatisticsCore(userId);

  // Save spelling statistics
  const saveSpellingStatistics = useMutation({
    mutationFn: async ({
      correctAnswers,
      wrongAnswers,
      wordGroup,
    }: {
      correctAnswers: number;
      wrongAnswers: number;
      wordGroup: string;
    }) => {
      if (!userId) throw new Error("Uživatel není přihlášen");

      console.log("Ukládání statistik pravopisu:", { userId, correctAnswers, wrongAnswers, wordGroup });
      
      const isLocalMode = await checkLocalUserMode();
      const timestamp = new Date().toISOString();
      
      if (isLocalMode) {
        console.log("Použití lokálního režimu pro statistiky pravopisu");
        
        try {
          // Get unique storage key for this user
          const storageKey = getLocalStorageKey('spellingStats');
          console.log("Použití lokálního klíče:", storageKey);
          
          // Load existing stats
          const localStatsStr = localStorage.getItem(storageKey);
          const localStats = localStatsStr ? JSON.parse(localStatsStr) : [];
          
          // Create new stat entry
          const newStat = {
            id: "local-" + Date.now(),
            user_id: userId,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            word_group: wordGroup,
            created_at: timestamp
          };
          
          // Add to beginning of array for chronological display
          localStats.unshift(newStat);
          
          // Save back to localStorage
          localStorage.setItem(storageKey, JSON.stringify(localStats));
          console.log("Lokální statistiky pravopisu uloženy:", newStat);
          
          // Update QueryClient for immediate UI update
          queryClient.setQueryData(["spellingStatistics", userId], localStats);
          
          return newStat;
        } catch (error) {
          console.error("Chyba ukládání lokálních statistik pravopisu:", error);
          throw error;
        }
      }
        
      // Saving to Supabase for authenticated users
      try {
        console.log("Ukládání statistik pravopisu do Supabase");
        
        // Zkontrolujeme připojení k Supabase
        const currentSession = await supabase.auth.getSession();
        console.log("Aktuální session při ukládání:", currentSession);
        
        const { data, error } = await supabase
          .from("spelling_statistics")
          .insert({
            user_id: userId,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            word_group: wordGroup,
            created_at: timestamp
          })
          .select();

        if (error) {
          console.error("Chyba Supabase při ukládání statistik pravopisu:", error);
          // Zkusíme uložit lokálně jako záložní řešení
          const backupKey = `backup_spellingStats_${userId}`;
          const backupStatsStr = localStorage.getItem(backupKey);
          const backupStats = backupStatsStr ? JSON.parse(backupStatsStr) : [];
          
          const backupStat = {
            id: "backup-" + Date.now(),
            user_id: userId,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            word_group: wordGroup,
            created_at: timestamp,
            error: error.message
          };
          
          backupStats.push(backupStat);
          localStorage.setItem(backupKey, JSON.stringify(backupStats));
          console.log("Statistiky uloženy záložně kvůli chybě Supabase:", backupStat);
          
          throw error;
        }
        
        console.log("Statistiky pravopisu úspěšně uloženy do Supabase:", data);
        
        // Update QueryClient for immediate UI update
        queryClient.invalidateQueries({ queryKey: ["spellingStatistics", userId] });
        
        return data[0];
      } catch (error) {
        console.error("Selhání ukládání statistik pravopisu do Supabase:", error);
        toast.error(`Nepodařilo se uložit statistiky do databáze. Zkontrolujte připojení.`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Statistiky pravopisu uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik pravopisu:", error);
      toast.error(`Nepodařilo se uložit statistiky pravopisu: ${error.message || 'Neznámá chyba'}`);
    },
  });

  // Load spelling statistics
  const { data: spellingStats, isLoading: spellingStatsLoading } = useQuery({
    queryKey: ["spellingStatistics", userId],
    queryFn: async (): Promise<SpellingStatistics[]> => {
      if (!userId) return [];
      
      try {
        const isLocalMode = await checkLocalUserMode();
        
        if (isLocalMode) {
          // Load from localStorage for local users with unique key
          const storageKey = getLocalStorageKey('spellingStats');
          console.log("Načítání statistik pravopisu z localStorage s klíčem:", storageKey);
          
          const localStatsStr = localStorage.getItem(storageKey);
          const localStats = localStatsStr ? JSON.parse(localStatsStr) : [];
          
          console.log("Načtené lokální statistiky pravopisu:", localStats);
          return localStats;
        }

        // Load from Supabase for authenticated users
        console.log("Načítání statistik pravopisu ze Supabase pro uživatele:", userId);
        
        // Zkontrolujeme připojení
        const currentSession = await supabase.auth.getSession();
        console.log("Aktuální session při načítání statistik:", currentSession);
        
        const { data, error } = await supabase
          .from("spelling_statistics")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Chyba načítání statistik pravopisu ze Supabase:", error);
          // Zkusíme načíst lokální zálohy
          const backupKey = `backup_spellingStats_${userId}`;
          const backupStatsStr = localStorage.getItem(backupKey);
          if (backupStatsStr) {
            console.log("Načítám záložní statistiky z localStorage");
            return JSON.parse(backupStatsStr);
          }
          throw error;
        }
        
        console.log("Statistiky pravopisu úspěšně načteny ze Supabase:", data);
        return data as SpellingStatistics[];
      } catch (error) {
        console.error("Selhání načítání statistik pravopisu:", error);
        return [];
      }
    },
    enabled: !!userId,
  });

  return {
    saveSpellingStatistics,
    spellingStats: spellingStats || [],
    spellingStatsLoading
  };
};
