
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
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("Uživatel není přihlášen - nelze uložit statistiky");
      }

      console.log("Ukládání statistik pravopisu do databáze pro autentifikovaného uživatele:", user.id);
      
      const { data, error } = await supabase
        .from('spelling_statistics')
        .insert({
          user_id: user.id, // Use authenticated user ID
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
      queryClient.invalidateQueries({ queryKey: ["spellingStatistics"] });
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
      // Get current authenticated user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log("Uživatel není přihlášen - vracím prázdné statistiky");
        return [];
      }
      
      console.log("Načítání statistik pravopisu z databáze pro uživatele:", user.id);
      
      const { data, error } = await supabase
        .from('spelling_statistics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Chyba při načítání statistik pravopisu:", error);
        throw error;
      }

      console.log("Načtené statistiky pravopisu z databáze:", data);
      return data || [];
    },
    enabled: true, // Always enabled, auth check is inside the function
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  return {
    saveSpellingStatistics,
    spellingStats: spellingStats || [],
    spellingStatsLoading,
    refetchSpellingStats: refetch
  };
};
