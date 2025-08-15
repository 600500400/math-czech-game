
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DictionaryAnswer } from "@/types/dictionaryTypes";
import { supabase } from "@/integrations/supabase/client";

export const useDictionaryAnswers = (userId: string | null) => {
  const queryClient = useQueryClient();
  const [localAnswers, setLocalAnswers] = useState<DictionaryAnswer[]>([]);

  console.log("useDictionaryAnswers - inicializace s userId:", userId);

  // Load answers from database
  const { data: databaseAnswers = [] } = useQuery({
    queryKey: ["dictionaryAnswers", userId],
    queryFn: async (): Promise<DictionaryAnswer[]> => {
      if (!userId) {
        console.log("useDictionaryAnswers - žádný userId, vracím prázdné pole");
        return [];
      }

      console.log("useDictionaryAnswers - načítám odpovědi z databáze pro userId:", userId);
      
      const { data, error } = await supabase
        .from('dictionary_answers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useDictionaryAnswers - chyba při načítání:", error);
        throw error;
      }

      console.log("useDictionaryAnswers - načteno z databáze:", data?.length || 0, "odpovědí");
      return data || [];
    },
    enabled: !!userId,
    staleTime: 30000,
  });

  // Combine database and local answers
  const allAnswers = [...databaseAnswers, ...localAnswers];

  // Add answer mutation
  const addAnswerMutation = useMutation({
    mutationFn: async (answer: Omit<DictionaryAnswer, 'id' | 'created_at'>) => {
      if (!userId) {
        throw new Error("Uživatel není nastaven");
      }

      console.log("useDictionaryAnswers - přidávám odpověď do databáze:", answer);

      const { data, error } = await supabase
        .from('dictionary_answers')
        .insert({
          user_id: userId,
          word_id: answer.word_id,
          czech_word: answer.czech_word,
          english_word: answer.english_word,
          user_answer: answer.user_answer,
          is_correct: answer.is_correct,
          answer_time: answer.answer_time
        })
        .select()
        .single();

      if (error) {
        console.error("useDictionaryAnswers - chyba při ukládání:", error);
        throw error;
      }

      console.log("useDictionaryAnswers - odpověď uložena do databáze:", data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryAnswers", userId] });
    }
  });

  // Save answers mutation
  const saveAnswersMutation = useMutation({
    mutationFn: async (answers: Omit<DictionaryAnswer, 'id' | 'created_at'>[]) => {
      if (!userId || answers.length === 0) {
        return;
      }

      console.log("useDictionaryAnswers - ukládám", answers.length, "odpovědí do databáze");

      const { data, error } = await supabase
        .from('dictionary_answers')
        .insert(
          answers.map(answer => ({
            user_id: userId,
            word_id: answer.word_id,
            czech_word: answer.czech_word,
            english_word: answer.english_word,
            user_answer: answer.user_answer,
            is_correct: answer.is_correct,
            answer_time: answer.answer_time
          }))
        )
        .select();

      if (error) {
        console.error("useDictionaryAnswers - chyba při ukládání odpovědí:", error);
        throw error;
      }

      console.log("useDictionaryAnswers - uloženo", data?.length || 0, "odpovědí do databáze");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryAnswers", userId] });
      setLocalAnswers([]);
    }
  });

  // Clear answers mutation
  const clearAnswersMutation = useMutation({
    mutationFn: async () => {
      if (!userId) {
        return;
      }

      console.log("useDictionaryAnswers - mažu všechny odpovědi pro userId:", userId);

      const { error } = await supabase
        .from('dictionary_answers')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error("useDictionaryAnswers - chyba při mazání:", error);
        throw error;
      }

      console.log("useDictionaryAnswers - odpovědi vymazány z databáze");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryAnswers", userId] });
      setLocalAnswers([]);
    }
  });

  const addDictionaryAnswer = (answer: Omit<DictionaryAnswer, 'id' | 'created_at'>) => {
    console.log("useDictionaryAnswers - přidávám lokální odpověď:", answer);
    setLocalAnswers(prev => [...prev, {
      ...answer,
      id: `temp-${Date.now()}`,
      created_at: new Date().toISOString()
    }]);
  };

  const saveDictionaryAnswers = () => {
    console.log("useDictionaryAnswers - ukládám", localAnswers.length, "lokálních odpovědí");
    if (localAnswers.length > 0) {
      saveAnswersMutation.mutate(localAnswers);
    }
  };

  const clearDictionaryAnswers = () => {
    console.log("useDictionaryAnswers - mažu všechny odpovědi");
    return clearAnswersMutation.mutateAsync();
  };

  console.log("useDictionaryAnswers - aktuální stav:", {
    userId,
    databaseAnswersCount: databaseAnswers.length,
    localAnswersCount: localAnswers.length,
    totalAnswersCount: allAnswers.length
  });

  return {
    dictionaryAnswers: allAnswers,
    addDictionaryAnswer,
    saveDictionaryAnswers,
    clearDictionaryAnswers,
    isLoading: saveAnswersMutation.isPending || clearAnswersMutation.isPending
  };
};
