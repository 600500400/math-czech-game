import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DictionaryWord, NewDictionaryWord } from "@/types/dictionaryTypes";
import { toast } from "sonner";

export const useDictionaryWords = (userId: string | null) => {
  const queryClient = useQueryClient();
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'basic' | 'intermediate' | 'advanced'>('all');

  // Fetch all available words (system + user words)
  const { data: words = [], isLoading, refetch } = useQuery({
    queryKey: ["dictionaryWords", userId, filterDifficulty],
    queryFn: async (): Promise<DictionaryWord[]> => {
      if (!userId) return [];

      let query = supabase
        .from('dictionary_words')
        .select('*')
        .or(`user_id.eq.${userId},user_id.eq.system`)
        .order('english_word');

      if (filterDifficulty !== 'all') {
        query = query.eq('difficulty_level', filterDifficulty);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching dictionary words:", error);
        throw error;
      }

      return (data || []) as DictionaryWord[];
    },
    enabled: !!userId,
  });

  // Add new word
  const addWordMutation = useMutation({
    mutationFn: async (newWord: NewDictionaryWord) => {
      if (!userId) throw new Error("User not logged in");

      const { data, error } = await supabase
        .from('dictionary_words')
        .insert({
          english_word: newWord.english_word.trim(),
          czech_translation: newWord.czech_translation.trim(),
          difficulty_level: newWord.difficulty_level,
          user_id: userId,
          is_user_created: true
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryWords"] });
      toast.success("Slovíčko bylo přidáno");
    },
    onError: (error: any) => {
      console.error("Error adding word:", error);
      toast.error(`Nepodařilo se přidat slovíčko: ${error.message}`);
    },
  });

  // Delete word (only user-created words)
  const deleteWordMutation = useMutation({
    mutationFn: async (wordId: string) => {
      const { error } = await supabase
        .from('dictionary_words')
        .delete()
        .eq('id', wordId)
        .eq('user_id', userId)
        .eq('is_user_created', true);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryWords"] });
      toast.success("Slovíčko bylo smazáno");
    },
    onError: (error: any) => {
      console.error("Error deleting word:", error);
      toast.error(`Nepodařilo se smazat slovíčko: ${error.message}`);
    },
  });

  // Bulk import words
  const bulkImportMutation = useMutation({
    mutationFn: async (words: NewDictionaryWord[]) => {
      if (!userId) throw new Error("User not logged in");

      const wordsToInsert = words.map(word => ({
        english_word: word.english_word.trim(),
        czech_translation: word.czech_translation.trim(),
        difficulty_level: word.difficulty_level,
        user_id: userId,
        is_user_created: true
      }));

      const { data, error } = await supabase
        .from('dictionary_words')
        .insert(wordsToInsert)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryWords"] });
      toast.success(`Bylo přidáno ${data?.length || 0} slovíček`);
    },
    onError: (error: any) => {
      console.error("Error bulk importing words:", error);
      toast.error(`Nepodařilo se importovat slovíčka: ${error.message}`);
    },
  });

  // Get random word for practice
  const getRandomWord = (): DictionaryWord | null => {
    if (words.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  return {
    words,
    isLoading,
    filterDifficulty,
    setFilterDifficulty,
    addWord: addWordMutation.mutate,
    deleteWord: deleteWordMutation.mutate,
    bulkImport: bulkImportMutation.mutate,
    getRandomWord,
    refetch,
    isAddingWord: addWordMutation.isPending,
    isDeletingWord: deleteWordMutation.isPending,
    isBulkImporting: bulkImportMutation.isPending,
  };
};