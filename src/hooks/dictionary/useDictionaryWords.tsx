import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DictionaryWord, NewDictionaryWord } from "@/types/dictionaryTypes";
import { toast } from "sonner";

import { logger } from "@/utils/logger";
import { DEFAULT_DICTIONARY_WORDS } from "@/data/dictionaryData";

import { USER_PERSONAL_WORDS } from "@/data/personalDictionaryData";

const SCHOOL_WORDS: DictionaryWord[] = DEFAULT_DICTIONARY_WORDS.map((w) => ({
  id: w.id,
  english_word: w.english_word,
  czech_translation: w.czech_translation,
  difficulty_level: w.difficulty_level,
  user_id: 'school',
  is_user_created: false,
  created_at: '',
  updated_at: '',
}));

export const useDictionaryWords = (userId: string | null) => {
  const queryClient = useQueryClient();

  // Load custom/personal database words
  const { data: dbWords = USER_PERSONAL_WORDS, isLoading, refetch } = useQuery({
    queryKey: ["dictionaryWords"],
    queryFn: async (): Promise<DictionaryWord[]> => {
      try {
        const { data, error } = await supabase
          .from('dictionary_words')
          .select('*')
          .order('english_word');

        if (error) {
          console.warn("Could not fetch remote dictionary words, using personal dataset:", error.message);
          return USER_PERSONAL_WORDS;
        }

        if (!data || data.length === 0) {
          return USER_PERSONAL_WORDS;
        }

        return data as DictionaryWord[];
      } catch (err) {
        console.warn("Exception fetching dictionary words, using personal defaults:", err);
        return USER_PERSONAL_WORDS;
      }
    },
    initialData: USER_PERSONAL_WORDS,
  });

  const personalWords = dbWords;
  const schoolWords = SCHOOL_WORDS;
  const allWords = [...personalWords, ...schoolWords];

  const getWordsBySource = (source: 'all' | 'personal' | 'school'): DictionaryWord[] => {
    switch (source) {
      case 'personal':
        return personalWords;
      case 'school':
        return schoolWords;
      case 'all':
      default:
        return allWords;
    }
  };

  // Add new word
  const addWordMutation = useMutation({
    mutationFn: async (newWord: NewDictionaryWord) => {
      // Allow guest users to add words with a default user_id
      const effectiveUserId = userId || 'guest';

      logger.log("Adding word with userId:", effectiveUserId, "word:", newWord);

      const { data, error } = await supabase
        .from('dictionary_words')
        .insert({
          english_word: newWord.english_word.trim(),
          czech_translation: newWord.czech_translation.trim(),
          difficulty_level: newWord.difficulty_level,
          user_id: effectiveUserId,
          is_user_created: true
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
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

  // Update word
  const updateWordMutation = useMutation({
    mutationFn: async ({ wordId, updates }: { wordId: string; updates: Partial<DictionaryWord> }) => {
      const { data, error } = await supabase
        .from('dictionary_words')
        .update(updates)
        .eq('id', wordId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dictionaryWords"] });
      toast.success("Slovíčko bylo upraveno");
    },
    onError: (error: any) => {
      console.error("Error updating word:", error);
      toast.error(`Nepodařilo se upravit slovíčko: ${error.message}`);
    },
  });

  // Delete word
  const deleteWordMutation = useMutation({
    mutationFn: async (wordId: string) => {
      const { error } = await supabase
        .from('dictionary_words')
        .delete()
        .eq('id', wordId);

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
      // Allow guest users to bulk import
      const effectiveUserId = userId || 'guest';

      const wordsToInsert = words.map(word => ({
        english_word: word.english_word.trim(),
        czech_translation: word.czech_translation.trim(),
        difficulty_level: word.difficulty_level,
        user_id: effectiveUserId,
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
  const words = allWords;
  const getRandomWord = (): DictionaryWord | null => {
    if (words.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  // Export to CSV
  const exportToCSV = () => {
    if (words.length === 0) {
      toast.error("Žádná slovíčka k exportu");
      return;
    }

    const csvContent = [
      "English,Czech,Difficulty",
      ...words.map(word => 
        `"${word.english_word}","${word.czech_translation}","${word.difficulty_level}"`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "dictionary_words.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success(`Exportováno ${words.length} slovíček`);
  };

  return {
    words: allWords,
    personalWords,
    schoolWords,
    allWords,
    getWordsBySource,
    isLoading,
    addWord: addWordMutation.mutate,
    updateWord: updateWordMutation.mutate,
    deleteWord: deleteWordMutation.mutate,
    bulkImport: bulkImportMutation.mutate,
    exportToCSV,
    getRandomWord,
    refetch,
    isAddingWord: addWordMutation.isPending,
    isUpdatingWord: updateWordMutation.isPending,
    isDeletingWord: deleteWordMutation.isPending,
    isBulkImporting: bulkImportMutation.isPending,
  };
};
