
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpellingStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useGuestStatistics } from "./useGuestStatistics";

export const useSpellingStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { 
    isGuestMode, 
    saveSpellingStatsToLocal 
  } = useGuestStatistics(userId);

  // Save spelling statistics - nyní vždy do Supabase
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

      console.log("Ukládání statistik pravopisu do databáze pro uživatele:", userId);
      
      // Uložíme přímo do Supabase s userId (bez kontroly autentifikace)
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
        // Uložíme jako backup lokálně
        saveSpellingStatsToLocal({
          correctAnswers,
          wrongAnswers,
          wordGroup,
          gameDuration,
          difficulty
        });
        throw error;
      }

      console.log("Statistiky pravopisu úspěšně uloženy do databáze:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spellingStatistics"] });
      toast.success("Statistiky pravopisu uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik pravopisu:", error);
      toast.error(`Nepodařilo se uložit statistiky pravopisu: ${error.message || 'Neznámá chyba'}`);
    },
  });

  // Load spelling statistics - nyní vždy z Supabase
  const { data: spellingStats, isLoading: spellingStatsLoading, refetch } = useQuery({
    queryKey: ["spellingStatistics", userId],
    queryFn: async (): Promise<SpellingStatistics[]> => {
      if (!userId) {
        console.log("Žádný userId - vracím prázdné statistiky");
        return [];
      }
      
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
    staleTime: 30000,
  });

  return {
    saveSpellingStatistics,
    spellingStats: spellingStats || [],
    spellingStatsLoading,
    refetchSpellingStats: refetch
  };
};
