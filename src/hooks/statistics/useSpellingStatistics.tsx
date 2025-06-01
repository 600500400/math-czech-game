
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpellingStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const useSpellingStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();

  // Save spelling statistics to Supabase
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
      if (!userId) throw new Error("Uživatel není přihlášen");

      console.log("Ukládání statistik pravopisu do databáze:", { userId, correctAnswers, wrongAnswers, wordGroup, gameDuration, difficulty });
      
      const { data, error } = await supabase
        .from('spelling_statistics')
        .insert({
          user_id: userId,
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

      console.log("Statistiky pravopisu úspěšně uloženy do databáze:", data);
      return data;
    },
    onSuccess: () => {
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["spellingStatistics", userId] });
      toast.success("Statistiky pravopisu uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik pravopisu:", error);
      toast.error(`Nepodařilo se uložit statistiky pravopisu: ${error.message || 'Neznámá chyba'}`);
    },
  });

  // Load spelling statistics from Supabase
  const { data: spellingStats, isLoading: spellingStatsLoading, refetch } = useQuery({
    queryKey: ["spellingStatistics", userId],
    queryFn: async (): Promise<SpellingStatistics[]> => {
      if (!userId) return [];
      
      console.log("Načítání statistik pravopisu z databáze pro uživatele:", userId);
      
      const { data, error } = await supabase
        .from('spelling_statistics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Chyba při načítání statistik pravopisu:", error);
        throw error;
      }

      console.log("Načtené statistiky pravopisu z databáze:", data);
      return data || [];
    },
    enabled: !!userId,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  return {
    saveSpellingStatistics,
    spellingStats: spellingStats || [],
    spellingStatsLoading,
    refetchSpellingStats: refetch
  };
};
