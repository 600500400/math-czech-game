
import { useState, useEffect } from "react";
import { SpellingAnswer } from "@/types/spellingTypes";
import { supabase } from "@/integrations/supabase/client";

export const useSpellingAnswers = (userId: string | null) => {
  const [spellingAnswers, setSpellingAnswers] = useState<SpellingAnswer[]>([]);

  // Load spelling answers from Supabase when component mounts or userId changes
  useEffect(() => {
    console.log("useSpellingAnswers - useEffect triggered with userId:", userId);
    if (userId) {
      loadSpellingAnswers();
    } else {
      console.log("useSpellingAnswers - žádný userId, mazám data");
      setSpellingAnswers([]);
    }
  }, [userId]);

  // Load spelling answers from Supabase
  const loadSpellingAnswers = async () => {
    try {
      if (!userId) {
        console.log("useSpellingAnswers - Žádný userId - nelze načíst pravopisné odpovědi");
        return;
      }
      
      console.log("useSpellingAnswers - načítám pravopisné odpovědi pro userId:", userId);
      
      const { data, error } = await supabase
        .from('spelling_answers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useSpellingAnswers - Error loading spelling answers:", error);
        return;
      }

      console.log("useSpellingAnswers - načteno z databáze:", data?.length || 0, "záznamů");

      // Convert database format to app format
      const convertedAnswers: SpellingAnswer[] = (data || []).map(item => ({
        word: item.word,
        position: item.position,
        userAnswer: item.user_answer,
        correctAnswer: item.correct_answer,
        isCorrect: item.is_correct,
        timestamp: item.created_at,
        wordGroup: item.word_group
      }));

      console.log("useSpellingAnswers - konvertované odpovědi:", convertedAnswers);
      setSpellingAnswers(convertedAnswers);
    } catch (error) {
      console.error("useSpellingAnswers - Error loading spelling answers:", error);
    }
  };

  // Save spelling answers to Supabase
  const saveSpellingAnswers = async (answers: SpellingAnswer[]) => {
    try {
      if (!userId) {
        console.error("useSpellingAnswers - Žádný userId - nelze uložit pravopisné odpovědi");
        return;
      }
      
      // Clear existing answers for this user and insert new ones
      await supabase
        .from('spelling_answers')
        .delete()
        .eq('user_id', userId);

      if (answers.length > 0) {
        const dbAnswers = answers.map(answer => ({
          user_id: userId,
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
          console.error("useSpellingAnswers - Error saving spelling answers:", error);
          return;
        }
      }

      setSpellingAnswers(answers);
      console.log("useSpellingAnswers - uloženy pravopisné odpovědi do databáze:", answers);
    } catch (error) {
      console.error("useSpellingAnswers - Error saving spelling answers:", error);
    }
  };

  // Add single spelling answer to Supabase
  const addSpellingAnswer = async (answer: SpellingAnswer) => {
    try {
      if (!userId) {
        console.error("useSpellingAnswers - Žádný userId - nelze přidat pravopisnou odpověď");
        return;
      }
      
      console.log("useSpellingAnswers - přidávám pravopisnou odpověď:", answer);
      
      const { error } = await supabase
        .from('spelling_answers')
        .insert({
          user_id: userId,
          word: answer.word,
          position: answer.position,
          user_answer: answer.userAnswer,
          correct_answer: answer.correctAnswer,
          is_correct: answer.isCorrect,
          word_group: answer.wordGroup,
          created_at: answer.timestamp
        });

      if (error) {
        console.error("useSpellingAnswers - Error adding spelling answer:", error);
        return;
      }

      const newAnswers = [...spellingAnswers, answer];
      setSpellingAnswers(newAnswers);
      console.log("useSpellingAnswers - přidána pravopisná odpověď, celkem:", newAnswers.length);
    } catch (error) {
      console.error("useSpellingAnswers - Error adding spelling answer:", error);
    }
  };

  // Clear spelling answers for user from Supabase
  const clearSpellingAnswers = async () => {
    try {
      if (!userId) {
        console.error("useSpellingAnswers - Žádný userId - nelze vymazat pravopisné odpovědi");
        return;
      }
      
      await supabase
        .from('spelling_answers')
        .delete()
        .eq('user_id', userId);

      setSpellingAnswers([]);
      
      console.log("useSpellingAnswers - vymazány pravopisné odpovědi z databáze pro uživatele:", userId);
    } catch (error) {
      console.error("useSpellingAnswers - Error clearing spelling answers:", error);
    }
  };

  console.log("useSpellingAnswers - aktuální stav:", {
    userId,
    spellingAnswersCount: spellingAnswers.length,
    wrongAnswersCount: spellingAnswers.filter(a => !a.isCorrect).length
  });

  return {
    spellingAnswers,
    addSpellingAnswer,
    saveSpellingAnswers,
    clearSpellingAnswers
  };
};
