
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MathStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { logger } from "@/utils/logger";
export const useMathStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();

  // Save math statistics - přímo do Supabase databáze
  const saveMathStatistics = useMutation({
    mutationFn: async ({
      correctAnswers,
      wrongAnswers,
      operation,
      difficultyLevel,
      gameDuration,
    }: {
      correctAnswers: number;
      wrongAnswers: number;
      operation: string;
      difficultyLevel: any;
      gameDuration?: number;
    }) => {
      if (!userId) {
        throw new Error("Uživatel není nastaven - nelze uložit statistiky");
      }

      logger.log("Ukládání statistik matematiky do databáze pro uživatele:", userId);
      
      const { data, error } = await supabase
        .from('math_statistics')
        .insert({
          user_id: userId, // Nyní jako text - podporuje jak běžné uživatele tak lokální jako "gabi"
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          operation: operation,
          difficulty_level: difficultyLevel,
          game_duration: gameDuration || 0
        })
        .select()
        .single();

      if (error) {
        console.error("Chyba při ukládání do databáze:", error);
        throw error;
      }

      logger.log("Statistiky matematiky úspěšně uloženy do databáze:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mathStatistics"] });
      toast.success("Statistiky matematiky uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik matematiky:", error);
      toast.error(`Nepodařilo se uložit statistiky matematiky: ${error.message || 'Neznámá chyba'}`);
    },
  });

  // Load math statistics - z Supabase databáze
  const { data: mathStats, isLoading: mathStatsLoading, refetch } = useQuery({
    queryKey: ["mathStatistics", userId],
    queryFn: async (): Promise<MathStatistics[]> => {
      if (!userId) {
        logger.log("Žádný userId - vracím prázdné statistiky");
        return [];
      }
      
      logger.log("Načítání statistik matematiky z databáze pro uživatele:", userId);
      
      const { data, error } = await supabase
        .from('math_statistics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Chyba při načítání statistik matematiky:", error);
        throw error;
      }

      logger.log("Načtené statistiky matematiky z databáze:", data);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 30000,
  });

  return {
    saveMathStatistics,
    mathStats: mathStats || [],
    mathStatsLoading,
    refetchMathStats: refetch
  };
};
