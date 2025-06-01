
import { useState, useEffect } from "react";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { supabase } from "@/integrations/supabase/client";

export const useDetailedAnswers = (userId: string | null) => {
  const [mathAnswers, setMathAnswers] = useState<MathAnswer[]>([]);
  const [spellingAnswers, setSpellingAnswers] = useState<SpellingAnswer[]>([]);

  // Load answers from Supabase when userId changes
  useEffect(() => {
    if (userId) {
      loadMathAnswers();
      loadSpellingAnswers();
    }
  }, [userId]);

  // Load math answers from Supabase
  const loadMathAnswers = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('math_answers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error loading math answers:", error);
        return;
      }

      // Convert database format to app format
      const convertedAnswers: MathAnswer[] = data.map(item => ({
        problem: item.problem as any,
        userAnswer: Number(item.user_answer),
        correctAnswer: Number(item.correct_answer),
        isCorrect: item.is_correct,
        timestamp: item.created_at
      }));

      console.log("useDetailedAnswers - načítání matematických odpovědí z databáze:", convertedAnswers);
      setMathAnswers(convertedAnswers);
    } catch (error) {
      console.error("Error loading math answers:", error);
    }
  };

  // Load spelling answers from Supabase
  const loadSpellingAnswers = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('spelling_answers')
        .select('*')
        .eq('user_id', userId)
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

      console.log("useDetailedAnswers - načítání pravopisných odpovědí z databáze:", convertedAnswers);
      setSpellingAnswers(convertedAnswers);
    } catch (error) {
      console.error("Error loading spelling answers:", error);
    }
  };

  // Save math answers to Supabase
  const saveMathAnswers = async (answers: MathAnswer[]) => {
    if (!userId) return;
    
    try {
      // Clear existing answers for this user and insert new ones
      await supabase
        .from('math_answers')
        .delete()
        .eq('user_id', userId);

      if (answers.length > 0) {
        const dbAnswers = answers.map(answer => ({
          user_id: userId,
          problem: answer.problem,
          user_answer: answer.userAnswer,
          correct_answer: answer.correctAnswer,
          is_correct: answer.isCorrect,
          created_at: answer.timestamp
        }));

        const { error } = await supabase
          .from('math_answers')
          .insert(dbAnswers);

        if (error) {
          console.error("Error saving math answers:", error);
          return;
        }
      }

      setMathAnswers(answers);
      console.log("useDetailedAnswers - uloženy matematické odpovědi do databáze:", answers);
    } catch (error) {
      console.error("Error saving math answers:", error);
    }
  };

  // Save spelling answers to Supabase
  const saveSpellingAnswers = async (answers: SpellingAnswer[]) => {
    if (!userId) return;
    
    try {
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
          console.error("Error saving spelling answers:", error);
          return;
        }
      }

      setSpellingAnswers(answers);
      console.log("useDetailedAnswers - uloženy pravopisné odpovědi do databáze:", answers);
    } catch (error) {
      console.error("Error saving spelling answers:", error);
    }
  };

  // Add single math answer to Supabase
  const addMathAnswer = async (answer: MathAnswer) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('math_answers')
        .insert({
          user_id: userId,
          problem: answer.problem,
          user_answer: answer.userAnswer,
          correct_answer: answer.correctAnswer,
          is_correct: answer.isCorrect,
          created_at: answer.timestamp
        });

      if (error) {
        console.error("Error adding math answer:", error);
        return;
      }

      const newAnswers = [...mathAnswers, answer];
      setMathAnswers(newAnswers);
    } catch (error) {
      console.error("Error adding math answer:", error);
    }
  };

  // Add single spelling answer to Supabase
  const addSpellingAnswer = async (answer: SpellingAnswer) => {
    if (!userId) return;
    
    try {
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
        console.error("Error adding spelling answer:", error);
        return;
      }

      const newAnswers = [...spellingAnswers, answer];
      setSpellingAnswers(newAnswers);
    } catch (error) {
      console.error("Error adding spelling answer:", error);
    }
  };

  // Clear all answers for user from Supabase
  const clearAllAnswers = async () => {
    if (!userId) return;
    
    try {
      await supabase
        .from('math_answers')
        .delete()
        .eq('user_id', userId);

      await supabase
        .from('spelling_answers')
        .delete()
        .eq('user_id', userId);

      setMathAnswers([]);
      setSpellingAnswers([]);
      
      console.log("useDetailedAnswers - vymazány všechny detailní odpovědi z databáze pro uživatele:", userId);
    } catch (error) {
      console.error("Error clearing answers:", error);
    }
  };

  console.log("useDetailedAnswers - aktuální stav:", {
    userId,
    mathAnswersCount: mathAnswers.length,
    spellingAnswersCount: spellingAnswers.length,
    mathWrongCount: mathAnswers.filter(a => !a.isCorrect).length,
    spellingWrongCount: spellingAnswers.filter(a => !a.isCorrect).length
  });

  return {
    mathAnswers,
    spellingAnswers,
    addMathAnswer,
    addSpellingAnswer,
    saveMathAnswers,
    saveSpellingAnswers,
    clearAllAnswers
  };
};
