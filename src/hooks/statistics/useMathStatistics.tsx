
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MathStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { useStatisticsCore } from "./useStatisticsCore";

export const useMathStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { checkLocalUserMode, getLocalStorageKey } = useStatisticsCore(userId);

  // Save math statistics with option to save locally or to Supabase
  const saveMathStatistics = useMutation({
    mutationFn: async ({
      correctAnswers,
      wrongAnswers,
      operation,
      difficultyLevel,
    }: {
      correctAnswers: number;
      wrongAnswers: number;
      operation: string;
      difficultyLevel: any;
    }) => {
      if (!userId) throw new Error("Uživatel není přihlášen");

      console.log("Ukládání statistik matematiky:", { userId, correctAnswers, wrongAnswers, operation });
      
      const isLocalMode = await checkLocalUserMode();
      const timestamp = new Date().toISOString();
      
      if (isLocalMode) {
        console.log("Použití lokálního režimu pro statistiky matematiky");
        
        try {
          // Get unique storage key for this user
          const storageKey = getLocalStorageKey('mathStats');
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
            operation: operation,
            difficulty_level: difficultyLevel,
            created_at: timestamp
          };
          
          // Add to beginning of array for chronological display
          localStats.unshift(newStat);
          
          // Save back to localStorage
          localStorage.setItem(storageKey, JSON.stringify(localStats));
          console.log("Lokální statistiky matematiky uloženy:", newStat);
          
          // Update QueryClient for immediate UI update
          queryClient.setQueryData(["mathStatistics", userId], localStats);
          
          return newStat;
        } catch (error) {
          console.error("Chyba ukládání lokálních statistik matematiky:", error);
          throw error;
        }
      }
        
      // Saving to Supabase for authenticated users
      try {
        console.log("Ukládání statistik matematiky do Supabase");
        
        // Zkontrolujeme připojení k Supabase
        const currentSession = await supabase.auth.getSession();
        console.log("Aktuální session při ukládání matematiky:", currentSession);
        
        const { data, error } = await supabase
          .from("math_statistics")
          .insert({
            user_id: userId,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            operation: operation,
            difficulty_level: difficultyLevel,
            created_at: timestamp
          })
          .select();

        if (error) {
          console.error("Chyba Supabase při ukládání statistik matematiky:", error);
          // Zkusíme uložit lokálně jako záložní řešení
          const backupKey = `backup_mathStats_${userId}`;
          const backupStatsStr = localStorage.getItem(backupKey);
          const backupStats = backupStatsStr ? JSON.parse(backupStatsStr) : [];
          
          const backupStat = {
            id: "backup-" + Date.now(),
            user_id: userId,
            correct_answers: correctAnswers,
            wrong_answers: wrongAnswers,
            operation: operation,
            difficulty_level: difficultyLevel,
            created_at: timestamp,
            error: error.message
          };
          
          backupStats.push(backupStat);
          localStorage.setItem(backupKey, JSON.stringify(backupStats));
          console.log("Statistiky matematiky uloženy záložně kvůli chybě Supabase:", backupStat);
          
          throw error;
        }
        
        console.log("Statistiky matematiky úspěšně uloženy do Supabase:", data);
        
        // Update QueryClient for immediate UI update
        queryClient.invalidateQueries({ queryKey: ["mathStatistics", userId] });
        
        return data[0];
      } catch (error) {
        console.error("Selhání ukládání statistik matematiky do Supabase:", error);
        toast.error(`Nepodařilo se uložit statistiky do databáze. Zkontrolujte připojení.`);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Statistiky matematiky uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik matematiky:", error);
      toast.error(`Nepodařilo se uložit statistiky matematiky: ${error.message || 'Neznámá chyba'}`);
    },
  });

  // Load math statistics
  const { data: mathStats, isLoading: mathStatsLoading } = useQuery({
    queryKey: ["mathStatistics", userId],
    queryFn: async (): Promise<MathStatistics[]> => {
      if (!userId) return [];
      
      try {
        const isLocalMode = await checkLocalUserMode();
        
        if (isLocalMode) {
          // Load from localStorage for local users with unique key
          const storageKey = getLocalStorageKey('mathStats');
          console.log("Načítání statistik matematiky z localStorage s klíčem:", storageKey);
          
          const localStatsStr = localStorage.getItem(storageKey);
          const localStats = localStatsStr ? JSON.parse(localStatsStr) : [];
          
          console.log("Načtené lokální statistiky matematiky:", localStats);
          return localStats;
        }

        // Load from Supabase for authenticated users
        console.log("Načítání statistik matematiky ze Supabase pro uživatele:", userId);
        
        // Zkontrolujeme připojení
        const currentSession = await supabase.auth.getSession();
        console.log("Aktuální session při načítání matematických statistik:", currentSession);
        
        const { data, error } = await supabase
          .from("math_statistics")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Chyba načítání statistik matematiky ze Supabase:", error);
          // Zkusíme načíst lokální zálohy
          const backupKey = `backup_mathStats_${userId}`;
          const backupStatsStr = localStorage.getItem(backupKey);
          if (backupStatsStr) {
            console.log("Načítám záložní matematické statistiky z localStorage");
            return JSON.parse(backupStatsStr);
          }
          throw error;
        }
        
        console.log("Statistiky matematiky úspěšně načteny ze Supabase:", data);
        return data as MathStatistics[];
      } catch (error) {
        console.error("Selhání načítání statistik matematiky:", error);
        return [];
      }
    },
    enabled: !!userId,
  });

  return {
    saveMathStatistics,
    mathStats: mathStats || [],
    mathStatsLoading
  };
};
