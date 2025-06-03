
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MathStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useGuestStatistics } from "./useGuestStatistics";

export const useMathStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();
  const { 
    isGuestMode, 
    saveMathStatsToLocal, 
    loadMathStatsFromLocal 
  } = useGuestStatistics(userId);

  // Save math statistics
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
      // Pokud je guest režim, uložíme lokálně
      if (isGuestMode) {
        saveMathStatsToLocal({
          correctAnswers,
          wrongAnswers,
          operation,
          difficultyLevel,
          gameDuration
        });
        return { success: true };
      }

      // Jinak uložíme do Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        throw new Error("Uživatel není přihlášen - nelze uložit statistiky");
      }

      console.log("Ukládání statistik matematiky do databáze pro autentifikovaného uživatele:", user.id);
      
      const { data, error } = await supabase
        .from('math_statistics')
        .insert({
          user_id: user.id,
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

      console.log("Statistiky matematiky úspěšně uloženy do databáze:", data);
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

  // Load math statistics
  const { data: mathStats, isLoading: mathStatsLoading, refetch } = useQuery({
    queryKey: ["mathStatistics", userId, isGuestMode],
    queryFn: async (): Promise<MathStatistics[]> => {
      // Pokud je guest režim, načteme z localStorage
      if (isGuestMode) {
        console.log("Načítání guest math statistik z localStorage pro uživatele:", userId);
        return loadMathStatsFromLocal();
      }

      // Jinak načteme z Supabase
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log("Uživatel není přihlášen - vracím prázdné statistiky");
        return [];
      }
      
      console.log("Načítání statistik matematiky z databáze pro uživatele:", user.id);
      
      const { data, error } = await supabase
        .from('math_statistics')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Chyba při načítání statistik matematiky:", error);
        throw error;
      }

      console.log("Načtené statistiky matematiky z databáze:", data);
      return data || [];
    },
    enabled: true,
    staleTime: 30000,
  });

  return {
    saveMathStatistics,
    mathStats: mathStats || [],
    mathStatsLoading,
    refetchMathStats: refetch
  };
};
