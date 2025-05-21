
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SpellingStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { useStatisticsCore } from "./useStatisticsCore";

export const useSpellingStatistics = (userId: string | null) => {
  const { checkLocalUserMode } = useStatisticsCore(userId);

  // Uložení statistik pravopisu
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
      
      if (isLocalMode) {
        console.log("Using local user mode for spelling statistics");
        toast.info("Statistiky pravopisu uloženy lokálně");
        return {
          id: "local-" + Date.now(),
          user_id: userId,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          word_group: wordGroup,
          created_at: new Date().toISOString()
        };
      }
        
      const { data, error } = await supabase
        .from("spelling_statistics")
        .insert({
          user_id: userId,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          word_group: wordGroup,
        })
        .select();

      if (error) {
        console.error("Supabase error when saving spelling stats:", error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      toast.success("Statistiky pravopisu uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik pravopisu:", error);
      toast.error(`Nepodařilo se uložit statistiky pravopisu: ${error.message || 'Neznámá chyba'}`);
    },
  });

  // Načtení statistik pravopisu
  const { data: spellingStats, isLoading: spellingStatsLoading } = useQuery({
    queryKey: ["spellingStatistics", userId],
    queryFn: async (): Promise<SpellingStatistics[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("spelling_statistics")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as SpellingStatistics[];
    },
    enabled: !!userId,
  });

  return {
    saveSpellingStatistics,
    spellingStats: spellingStats || [],
    spellingStatsLoading
  };
};
