import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DictionaryAnswer } from "@/types/dictionaryTypes";
import { toast } from "sonner";

export const useDictionaryAnswers = (userId: string | null) => {
  console.log("useDictionaryAnswers - inicializace s userId:", userId);
  
  const [localAnswers, setLocalAnswers] = useState<DictionaryAnswer[]>([]);
  const queryClient = useQueryClient();

  // Fetch dictionary answers from database
  const { data: dictionaryAnswers = [], isLoading } = useQuery({
    queryKey: ["dictionaryAnswers", userId],
    queryFn: async (): Promise<DictionaryAnswer[]> => {
      if (!userId) {
        console.log("Žádný userId - vracím prázdné dictionary odpovědi");
        return [];
      }
      
      console.log("Načítání dictionary odpovědí z databáze pro uživatele:", userId);
      
      const { data, error } = await supabase
        .from('dictionary_answers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Chyba při načítání dictionary odpovědí:", error);
        throw error;
      }

      console.log("Načtené dictionary odpovědi z databáze:", data);
      return (data || []) as DictionaryAnswer[];
    },
    enabled: !!userId,
    staleTime: 30000,
  });

  // Add answer to local state
  const addDictionaryAnswer = (answer: Omit<DictionaryAnswer, 'id' | 'created_at'>) => {
    const newAnswer: DictionaryAnswer = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...answer
    };
    
    console.log("Přidávám dictionary odpověď do lokálního stavu:", newAnswer);
    setLocalAnswers(prev => [...prev, newAnswer]);
  };

  // Save answers to Supabase
  const saveDictionaryAnswers = useMutation({
    mutationFn: async () => {
      if (!userId || localAnswers.length === 0) {
        throw new Error("Žádné dictionary odpovědi k uložení nebo chybí userId");
      }

      console.log("Ukládání dictionary odpovědí do databáze:", localAnswers);
      
      const answersToSave = localAnswers.map(answer => ({
        user_id: userId,
        word_id: answer.word_id,
        english_word: answer.english_word,
        czech_translation: answer.czech_translation,
        user_answer: answer.user_answer,
        is_correct: answer.is_correct,
        mode: answer.mode,
        direction: answer.direction
      }));

      const { data, error } = await supabase
        .from('dictionary_answers')
        .insert(answersToSave);

      if (error) {
        console.error("Chyba při ukládání dictionary odpovědí:", error);
        throw error;
      }

      console.log("Dictionary odpovědi úspěšně uloženy do databáze");
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryAnswers"] });
      setLocalAnswers([]); // Clear local answers after successful save
      console.log("Dictionary odpovědi uloženy a lokální stav vyčištěn");
    },
    onError: (error: any) => {
      console.error("Chyba při ukládání dictionary odpovědí:", error);
    },
  });

  // Clear answers from database
  const clearDictionaryAnswers = async () => {
    if (!userId) return;
    
    console.log("Mažu dictionary odpovědi z databáze pro userId:", userId);
    
    const { error } = await supabase
      .from('dictionary_answers')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error("Chyba při mazání dictionary odpovědí:", error);
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ["dictionaryAnswers"] });
    setLocalAnswers([]);
    console.log("Dictionary odpovědi vymazány z databáze");
  };

  const allAnswers = [...dictionaryAnswers, ...localAnswers];
  
  console.log("useDictionaryAnswers - aktuální stav:", {
    userId,
    databaseAnswers: dictionaryAnswers.length,
    localAnswers: localAnswers.length,
    totalAnswers: allAnswers.length,
    wrongAnswers: allAnswers.filter(a => !a.is_correct).length
  });

  return {
    dictionaryAnswers: allAnswers,
    addDictionaryAnswer,
    saveDictionaryAnswers: saveDictionaryAnswers.mutate,
    clearDictionaryAnswers,
    isLoading,
    isSaving: saveDictionaryAnswers.isPending
  };
};