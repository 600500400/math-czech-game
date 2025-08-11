import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DictionaryStatistics } from "@/types/dictionaryTypes";
import { toast } from "sonner";

export const useDictionaryStatistics = (userId: string | null) => {
  const queryClient = useQueryClient();

  // Fetch user's dictionary statistics
  const { data: stats = [], isLoading } = useQuery({
    queryKey: ["dictionaryStatistics", userId],
    queryFn: async (): Promise<DictionaryStatistics[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('dictionary_statistics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching dictionary statistics:", error);
        throw error;
      }

      return (data || []) as DictionaryStatistics[];
    },
    enabled: !!userId,
  });

  // Save new statistics
  const saveStatisticsMutation = useMutation({
    mutationFn: async (statistics: {
      correct_answers: number;
      wrong_answers: number;
      mode: 'simple' | 'advanced';
      direction: 'en_to_cz' | 'cz_to_en';
      game_duration: number;
    }) => {
      if (!userId) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from('dictionary_statistics')
        .insert({
          user_id: userId,
          ...statistics,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryStatistics"] });
      toast.success("Statistiky slovníčku uloženy");
    },
    onError: (error: any) => {
      console.error("Error saving dictionary statistics:", error);
      toast.error(`Nepodařilo se uložit statistiky: ${error.message}`);
    },
  });

  return {
    stats,
    isLoading,
    saveStatistics: saveStatisticsMutation.mutate,
    isSaving: saveStatisticsMutation.isPending,
  };
};