
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

      console.log("Saving math statistics:", { userId, correctAnswers, wrongAnswers, operation });
      
      const isLocalMode = await checkLocalUserMode();
      const timestamp = new Date().toISOString();
      
      if (isLocalMode) {
        console.log("Using local user mode for math statistics");
        
        try {
          // Get unique storage key for this user
          const storageKey = getLocalStorageKey('mathStats');
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
            operation: operation,
            difficulty_level: difficultyLevel,
            created_at: timestamp
          };
          
          // Add to beginning of array for chronological display
          localStats.unshift(newStat);
          
          // Save back to localStorage
          localStorage.setItem(storageKey, JSON.stringify(localStats));
          console.log("Saved local math statistics:", newStat);
          
          // Update QueryClient for immediate UI update
          queryClient.setQueryData(["mathStatistics", userId], localStats);
          
          return newStat;
        } catch (error) {
          console.error("Error saving local math statistics:", error);
          throw error;
        }
      }
        
      // Saving to Supabase for authenticated users
      try {
        console.log("Saving math statistics to Supabase");
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
          console.error("Supabase error when saving math stats:", error);
          throw error;
        }
        
        console.log("Successfully saved math statistics to Supabase:", data);
        
        // Update QueryClient for immediate UI update
        queryClient.invalidateQueries({ queryKey: ["mathStatistics", userId] });
        
        return data[0];
      } catch (error) {
        console.error("Failed to save math statistics to Supabase:", error);
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
          console.log("Loading math statistics from localStorage with key:", storageKey);
          
          const localStatsStr = localStorage.getItem(storageKey);
          const localStats = localStatsStr ? JSON.parse(localStatsStr) : [];
          
          console.log("Loaded local math statistics:", localStats);
          return localStats;
        }

        // Load from Supabase for authenticated users
        console.log("Loading math statistics from Supabase for user:", userId);
        
        const { data, error } = await supabase
          .from("math_statistics")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error loading math statistics from Supabase:", error);
          throw error;
        }
        
        console.log("Successfully loaded math statistics from Supabase:", data);
        return data as MathStatistics[];
      } catch (error) {
        console.error("Failed to load math statistics:", error);
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
