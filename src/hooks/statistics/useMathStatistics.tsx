
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MathStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { useStatisticsCore } from "./useStatisticsCore";

export const useMathStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { getLocalStorageKey } = useStatisticsCore(userId);

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
      
      try {
        // Vždy používáme lokální režim
        const timestamp = new Date().toISOString();
        
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
        toast.error(`Nepodařilo se uložit statistiky: ${error.message || 'Neznámá chyba'}`);
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
        // Load from localStorage with unique key
        const storageKey = getLocalStorageKey('mathStats');
        console.log("Načítání statistik matematiky z localStorage s klíčem:", storageKey);
        
        const localStatsStr = localStorage.getItem(storageKey);
        const localStats = localStatsStr ? JSON.parse(localStatsStr) : [];
        
        console.log("Načtené lokální statistiky matematiky:", localStats);
        return localStats;
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
