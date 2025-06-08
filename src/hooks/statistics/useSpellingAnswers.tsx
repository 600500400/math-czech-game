
import { useState, useEffect } from "react";
import { SpellingAnswer } from "@/types/spellingTypes";
import { supabase } from "@/integrations/supabase/client";

export const useSpellingAnswers = (userId: string | null) => {
  const [spellingAnswers, setSpellingAnswers] = useState<SpellingAnswer[]>([]);

  // Load spelling answers from Supabase when component mounts
  useEffect(() => {
    loadSpellingAnswers();
  }, [userId]);

  // Load spelling answers from Supabase
  const loadSpellingAnswers = async () => {
    try {
      if (!userId) {
        console.log("Žádný userId - nelze načíst pravopisné odpovědi");
        return;
      }
      
      const { data, error } = await supabase
        .from('spelling_answers')
        .select('*')
        .eq('user_id', userId) // Nyní jako text
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading spelling answers:", error);
        return;
      }

      // Convert database format to app format
      const convertedAnswers: SpellingAnswer[] = data.map(item => ({
        word: item.word,
        position: item.position,
        userAnswer: item.user_answer,
        correctAnswer: item.correct_answer,
        isCorrect: item.is_correct,
        timestamp: item.created_at,
        wordGroup: item.word_group
      }));

      console.log("useSpellingAnswers - načítání pravopisných odpovědí z databáze:", convertedAnswers);
      setSpellingAnswers(convertedAnswers);
    } catch (error) {
      console.error("Error loading spelling answers:", error);
    }
  };

  // Save spelling answers to Supabase
  const saveSpellingAnswers = async (answers: SpellingAnswer[]) => {
    try {
      if (!userId) {
        console.error("Žádný userId - nelze uložit pravopisné odpovědi");
        return;
      }
      
      // Clear existing answers for this user and insert new ones
      await supabase
        .from('spelling_answers')
        .delete()
        .eq('user_id', userId);

      if (answers.length > 0) {
        const dbAnswers = answers.map(answer => ({
          user_id: userId, // Nyní jako text
          word: answer.word,
          position: answer.position,
          user_answer: answer.userAnswer,
          correct_answer: answer.correctAnswer,
          is_correct: answer.isCorrect,
          word_group: answer.wordGroup,
          created_at: answer.timestamp
        }));

        const { error } = await supabase
          .from('spelling_answers')
          .insert(dbAnswers);

        if (error) {
          console.error("Error saving spelling answers:", error);
          return;
        }
      }

      setSpellingAnswers(answers);
      console.log("useSpellingAnswers - uloženy pravopisné odpovědi do databáze:", answers);
    } catch (error) {
      console.error("Error saving spelling answers:", error);
    }
  };

  // Add single spelling answer to Supabase
  const addSpellingAnswer = async (answer: SpellingAnswer) => {
    try {
      if (!userId) {
        console.error("Žádný userId - nelze přidat pravopisnou odpověď");
        return;
      }
      
      const { error } = await supabase
        .from('spelling_answers')
        .insert({
          user_id: userId, // Nyní jako text
          word: answer.word,
          position: answer.position,
          user_answer: answer.userAnswer,
          correct_answer: answer.correctAnswer,
          is_correct: answer.isCorrect,
          word_group: answer.wordGroup,
          created_at: answer.timestamp
        });

      if (error) {
        console.error("Error adding spelling answer:", error);
        return;
      }

      const newAnswers = [...spellingAnswers, answer];
      setSpellingAnswers(newAnswers);
    } catch (error) {
      console.error("Error adding spelling answer:", error);
    }
  };

  // Clear spelling answers for user from Supabase
  const clearSpellingAnswers = async () => {
    try {
      if (!userId) {
        console.error("Žádný userId - nelze vymazat pravopisné odpovědi");
        return;
      }
      
      await supabase
        .from('spelling_answers')
        .delete()
        .eq('user_id', userId);

      setSpellingAnswers([]);
      
      console.log("useSpellingAnswers - vymazány pravopisné odpovědi z databáze pro uživatele:", userId);
    } catch (error) {
      console.error("Error clearing spelling answers:", error);
    }
  };

  return {
    spellingAnswers,
    addSpellingAnswer,
    saveSpellingAnswers,
    clearSpellingAnswers
  };
};
