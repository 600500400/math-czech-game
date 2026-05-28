
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpellingStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { logger } from "@/utils/logger";
export const useSpellingStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();

  // Save spelling statistics - přímo do Supabase databáze
  const saveSpellingStatistics = useMutation({
    mutationFn: async ({
      correctAnswers,
      wrongAnswers,
      wordGroup,
      gameDuration,
      difficulty,
    }: {
      correctAnswers: number;
      wrongAnswers: number;
      wordGroup: string;
      gameDuration?: number;
      difficulty?: any;
    }) => {
      if (!userId) {
        throw new Error("Uživatel není nastaven - nelze uložit statistiky");
      }

      logger.log("Ukládání statistik pravopisu do databáze pro uživatele:", userId);
      
      const { data, error } = await supabase
        .from('spelling_statistics')
        .insert({
          user_id: userId, // Nyní jako text - podporuje jak běžné uživatele tak lokální jako "gabi"
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          word_group: wordGroup,
          game_duration: gameDuration || 0,
          difficulty_level: difficulty || { selectedGroups: wordGroup.split(','), wordCount: correctAnswers + wrongAnswers }
        })
        .select()
        .single();

      if (error) {
        console.error("Chyba při ukládání do databáze:", error);
        throw error;
      }

      logger.log("Statistiky pravopisu úspěšně uloženy do databáze:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spellingStatistics"] });
      // Zobrazit pouze jednu toast notifikaci
      toast.success("Statistiky pravopisu uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik pravopisu:", error);
      // Toast se zobrazí v useGameControls při chybě
    },
  });

  // Load spelling statistics - z Supabase databáze
  const { data: spellingStats, isLoading: spellingStatsLoading, refetch } = useQuery({
    queryKey: ["spellingStatistics", userId],
    queryFn: async (): Promise<SpellingStatistics[]> => {
      if (!userId) {
        logger.log("Žádný userId - vracím prázdné statistiky");
        return [];
      }
      
      logger.log("Načítání statistik pravopisu z databáze pro uživatele:", userId);
      
      const { data, error } = await supabase
        .from('spelling_statistics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Chyba při načítání statistik pravopisu:", error);
        throw error;
      }

      logger.log("Načtené statistiky pravopisu z databáze:", data);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 30000,
  });

  return {
    saveSpellingStatistics,
    spellingStats: spellingStats || [],
    spellingStatsLoading,
    refetchSpellingStats: refetch
  };
};
