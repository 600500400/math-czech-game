
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpellingStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { useStatisticsCore } from "./useStatisticsCore";

export const useSpellingStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { getLocalStorageKey } = useStatisticsCore(userId);

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
      
      try {
        // Vždy používáme lokální režim
        const timestamp = new Date().toISOString();
        
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
        toast.error(`Nepodařilo se uložit statistiky: ${error.message || 'Neznámá chyba'}`);
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
        // Load from localStorage with unique key
        const storageKey = getLocalStorageKey('spellingStats');
        console.log("Načítání statistik pravopisu z localStorage s klíčem:", storageKey);
        
        const localStatsStr = localStorage.getItem(storageKey);
        const localStats = localStatsStr ? JSON.parse(localStatsStr) : [];
        
        console.log("Načtené lokální statistiky pravopisu:", localStats);
        return localStats;
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
