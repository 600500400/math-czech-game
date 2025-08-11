import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DictionaryAnswer } from "@/types/dictionaryTypes";

export const useDictionaryAnswers = (userId: string | null) => {
  const queryClient = useQueryClient();

  // Fetch user's dictionary answers
  const { data: answers = [], isLoading } = useQuery({
    queryKey: ["dictionaryAnswers", userId],
    queryFn: async (): Promise<DictionaryAnswer[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('dictionary_answers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching dictionary answers:", error);
        throw error;
      }

      return (data || []) as DictionaryAnswer[];
    },
    enabled: !!userId,
  });

  // Add new answer
  const addAnswerMutation = useMutation({
    mutationFn: async (answer: Omit<DictionaryAnswer, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('dictionary_answers')
        .insert(answer)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryAnswers"] });
    },
    onError: (error: any) => {
      console.error("Error adding dictionary answer:", error);
    },
  });

  // Clear all answers for user
  const clearAnswersMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User not logged in");

      const { error } = await supabase
        .from('dictionary_answers')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryAnswers"] });
    },
    onError: (error: any) => {
      console.error("Error clearing dictionary answers:", error);
    },
  });

  return {
    answers,
    isLoading,
    addAnswer: addAnswerMutation.mutate,
    clearAnswers: clearAnswersMutation.mutate,
    isAddingAnswer: addAnswerMutation.isPending,
  };
};