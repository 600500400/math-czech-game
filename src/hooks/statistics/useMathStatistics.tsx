
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MathStatistics } from "@/types/authTypes";
import { toast } from "sonner";
import { useStatisticsCore } from "./useStatisticsCore";

export const useMathStatistics = (userId: string | null) => {
  const { checkLocalUserMode } = useStatisticsCore(userId);

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

      const isLocalMode = await checkLocalUserMode();
      
      if (isLocalMode) {
        console.log("Using local user mode for math statistics");
        toast.info("Statistiky matematiky uloženy lokálně");
        return {
          id: "local-" + Date.now(),
          user_id: userId,
          correct_answers: correctAnswers,
          wrong_answers: wrongAnswers,
          operation,
          difficulty_level: difficultyLevel,
          created_at: new Date().toISOString()
        };
      }

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

  // Načtení matematických statistik
  const { data: mathStats, isLoading: mathStatsLoading } = useQuery({
    queryKey: ["mathStatistics", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("math_statistics")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Upravíme formát JSON dat, aby odpovídal očekávanému typu
      return data.map(item => ({
        ...item,
        difficulty_level: typeof item.difficulty_level === 'string'
          ? JSON.parse(item.difficulty_level)
          : item.difficulty_level
      })) as MathStatistics[];
    },
    enabled: !!userId,
  });

  return {
    saveMathStatistics,
    mathStats: mathStats || [],
    mathStatsLoading
  };
};
