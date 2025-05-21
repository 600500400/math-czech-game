
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

      console.log("Saving spelling statistics:", { userId, correctAnswers, wrongAnswers, wordGroup });
      
      const isLocalMode = await checkLocalUserMode();
      const timestamp = new Date().toISOString();
      
      if (isLocalMode) {
        console.log("Using local user mode for spelling statistics");
        
        try {
          // Get unique storage key for this user
          const storageKey = getLocalStorageKey('spellingStats');
          console.log("Using storage key:", storageKey);
          
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
          console.log("Saved local spelling statistics:", newStat);
          
          // Update QueryClient for immediate UI update
          queryClient.setQueryData(["spellingStatistics", userId], localStats);
          
          return newStat;
        } catch (error) {
          console.error("Error saving local spelling statistics:", error);
          throw error;
        }
      }
        
      // Saving to Supabase for authenticated users
      try {
        console.log("Saving spelling statistics to Supabase");
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
          console.error("Supabase error when saving spelling stats:", error);
          throw error;
        }
        
        console.log("Successfully saved spelling statistics to Supabase:", data);
        
        // Update QueryClient for immediate UI update
        queryClient.invalidateQueries({ queryKey: ["spellingStatistics", userId] });
        
        return data[0];
      } catch (error) {
        console.error("Failed to save spelling statistics to Supabase:", error);
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
          console.log("Loading spelling statistics from localStorage with key:", storageKey);
          
          const localStatsStr = localStorage.getItem(storageKey);
          const localStats = localStatsStr ? JSON.parse(localStatsStr) : [];
          
          console.log("Loaded local spelling statistics:", localStats);
          return localStats;
        }

        // Load from Supabase for authenticated users
        console.log("Loading spelling statistics from Supabase for user:", userId);
        
        const { data, error } = await supabase
          .from("spelling_statistics")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading spelling statistics from Supabase:", error);
          throw error;
        }
        
        console.log("Successfully loaded spelling statistics from Supabase:", data);
        return data as SpellingStatistics[];
      } catch (error) {
        console.error("Failed to load spelling statistics:", error);
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
