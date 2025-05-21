
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MathStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { useStatisticsCore } from "./useStatisticsCore";

export const useMathStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { checkLocalUserMode } = useStatisticsCore(userId);

  // Uložení statistik matematiky s možností ukládat lokálně nebo do Supabase
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
      
      if (isLocalMode) {
        console.log("Using local user mode for math statistics");
        
        // Ukládání do localStorage pro nepřihlášené uživatele
        const localStatsStr = localStorage.getItem('mathStats');
        const localStats = localStatsStr ? JSON.parse(localStatsStr) : [];
        
        const newStat = {
          id: "local-" + Date.now(),
          user_id: userId,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          operation: operation,
          difficulty_level: difficultyLevel,
          created_at: new Date().toISOString()
        };
        
        localStats.push(newStat);
        localStorage.setItem('mathStats', JSON.stringify(localStats));
        
        // Aktualizace QueryClient pro okamžitou aktualizaci UI
        queryClient.setQueryData(["mathStatistics", userId], localStats);
        
        return newStat;
      }
        
      // Ukládání do Supabase pro přihlášené uživatele
      const { data, error } = await supabase
        .from("math_statistics")
        .insert({
          user_id: userId,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          operation: operation,
          difficulty_level: difficultyLevel,
        })
        .select();

      if (error) {
        console.error("Supabase error when saving math stats:", error);
        throw error;
      }
      
      // Aktualizace QueryClient pro okamžitou aktualizaci UI
      queryClient.invalidateQueries({ queryKey: ["mathStatistics", userId] });
      
      return data[0];
    },
    onSuccess: () => {
      toast.success("Statistiky matematiky uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik matematiky:", error);
      toast.error(`Nepodařilo se uložit statistiky matematiky: ${error.message || 'Neznámá chyba'}`);
    },
  });

  // Načtení statistik matematiky
  const { data: mathStats, isLoading: mathStatsLoading } = useQuery({
    queryKey: ["mathStatistics", userId],
    queryFn: async (): Promise<MathStatistics[]> => {
      if (!userId) return [];
      
      const isLocalMode = await checkLocalUserMode();
      
      if (isLocalMode) {
        // Načítání z localStorage pro nepřihlášené uživatele
        const localStatsStr = localStorage.getItem('mathStats');
        return localStatsStr ? JSON.parse(localStatsStr) : [];
      }

      // Načítání z Supabase pro přihlášené uživatele
      const { data, error } = await supabase
        .from("math_statistics")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading math statistics:", error);
        throw error;
      }
      
      return data as MathStatistics[];
    },
    enabled: !!userId,
  });

  return {
    saveMathStatistics,
    mathStats: mathStats || [],
    mathStatsLoading
  };
};
