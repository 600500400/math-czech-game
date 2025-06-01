
import { useState, useEffect } from "react";
import { MathAnswer } from "@/types/mathTypes";
import { supabase } from "@/integrations/supabase/client";

export const useMathAnswers = (userId: string | null) => {
  const [mathAnswers, setMathAnswers] = useState<MathAnswer[]>([]);

  // Load math answers from Supabase when userId changes
  useEffect(() => {
    if (userId) {
      loadMathAnswers();
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

      console.log("useMathAnswers - načítání matematických odpovědí z databáze:", convertedAnswers);
      setMathAnswers(convertedAnswers);
    } catch (error) {
      console.error("Error loading math answers:", error);
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
          problem: answer.problem as any, // Cast to any for Json compatibility
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
      console.log("useMathAnswers - uloženy matematické odpovědi do databáze:", answers);
    } catch (error) {
      console.error("Error saving math answers:", error);
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
          problem: answer.problem as any, // Cast to any for Json compatibility
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

  // Clear math answers for user from Supabase
  const clearMathAnswers = async () => {
    if (!userId) return;
    
    try {
      await supabase
        .from('math_answers')
        .delete()
        .eq('user_id', userId);

      setMathAnswers([]);
      
      console.log("useMathAnswers - vymazány matematické odpovědi z databáze pro uživatele:", userId);
    } catch (error) {
      console.error("Error clearing math answers:", error);
    }
  };

  return {
    mathAnswers,
    addMathAnswer,
    saveMathAnswers,
    clearMathAnswers
  };
};
