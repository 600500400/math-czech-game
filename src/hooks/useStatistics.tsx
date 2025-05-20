
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";
import { toast } from "sonner";

export const useStatistics = (userId: string | null) => {
  // Uložení matematických statistik
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
      difficultyLevel: {
        maxValue: number;
        maxMultiplyValue: number;
        maxDivideValue: number;
      };
    }) => {
      if (!userId) throw new Error("Uživatel není přihlášen");

      const { data, error } = await supabase
        .from("math_statistics")
        .insert({
          user_id: userId,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          operation,
          difficulty_level: difficultyLevel,
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast.success("Statistiky matematiky uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik matematiky:", error);
      toast.error("Nepodařilo se uložit statistiky matematiky");
    },
  });

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

      const { data, error } = await supabase
        .from("spelling_statistics")
        .insert({
          user_id: userId,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          word_group: wordGroup,
        })
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast.success("Statistiky pravopisu uloženy");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání statistik pravopisu:", error);
      toast.error("Nepodařilo se uložit statistiky pravopisu");
    },
  });

  // Načtení matematických statistik
  const { data: mathStats, isLoading: mathStatsLoading } = useQuery({
    queryKey: ["mathStatistics", userId],
    queryFn: async (): Promise<MathStatistics[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("math_statistics")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
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
      return data;
    },
    enabled: !!userId,
  });

  // Načtení statistik pro dítě (pouze pro rodiče)
  const getChildStatistics = async (childId: string) => {
    try {
      const [mathResult, spellingResult] = await Promise.all([
        supabase
          .from("math_statistics")
          .select("*")
          .eq("user_id", childId)
          .order("created_at", { ascending: false }),
        supabase
          .from("spelling_statistics")
          .select("*")
          .eq("user_id", childId)
          .order("created_at", { ascending: false }),
      ]);

      if (mathResult.error) throw mathResult.error;
      if (spellingResult.error) throw spellingResult.error;

      return {
        mathStats: mathResult.data as MathStatistics[],
        spellingStats: spellingResult.data as SpellingStatistics[],
      };
    } catch (error) {
      console.error("Chyba při načítání statistik dítěte:", error);
      toast.error("Nepodařilo se načíst statistiky dítěte");
      return { mathStats: [], spellingStats: [] };
    }
  };

  return {
    saveMathStatistics,
    saveSpellingStatistics,
    mathStats: mathStats || [],
    spellingStats: spellingStats || [],
    mathStatsLoading,
    spellingStatsLoading,
    getChildStatistics,
  };
};
