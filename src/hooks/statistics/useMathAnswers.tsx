
import { useState, useEffect } from "react";
import { MathAnswer } from "@/types/mathTypes";
import { supabase } from "@/integrations/supabase/client";

import { logger } from "@/utils/logger";
export const useMathAnswers = (userId: string | null) => {
  const [mathAnswers, setMathAnswers] = useState<MathAnswer[]>([]);

  // Load math answers from Supabase when component mounts or userId changes
  useEffect(() => {
    logger.log("useMathAnswers - useEffect triggered with userId:", userId);
    if (userId) {
      loadMathAnswers();
    } else {
      logger.log("useMathAnswers - žádný userId, mazám data");
      setMathAnswers([]);
    }
  }, [userId]);

  // Load math answers from Supabase
  const loadMathAnswers = async () => {
    try {
      if (!userId) {
        logger.log("useMathAnswers - Žádný userId - nelze načíst matematické odpovědi");
        return;
      }
      
      logger.log("useMathAnswers - načítám matematické odpovědi pro userId:", userId);
      
      const { data, error } = await supabase
        .from('math_answers')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useMathAnswers - Error loading math answers:", error);
        return;
      }

      logger.log("useMathAnswers - načteno z databáze:", data?.length || 0, "záznamů");

      // Convert database format to app format
      const convertedAnswers: MathAnswer[] = (data || []).map(item => ({
        problem: item.problem as any,
        userAnswer: Number(item.user_answer),
        correctAnswer: Number(item.correct_answer),
        isCorrect: item.is_correct,
        timestamp: item.created_at
      }));

      logger.log("useMathAnswers - konvertované odpovědi:", convertedAnswers);
      setMathAnswers(convertedAnswers);
    } catch (error) {
      console.error("useMathAnswers - Error loading math answers:", error);
    }
  };

  // Save math answers to Supabase
  const saveMathAnswers = async (answers: MathAnswer[]) => {
    try {
      if (!userId) {
        console.error("useMathAnswers - Žádný userId - nelze uložit matematické odpovědi");
        return;
      }
      
      // Clear existing answers for this user and insert new ones
      await supabase
        .from('math_answers')
        .delete()
        .eq('user_id', userId);

      if (answers.length > 0) {
        const dbAnswers = answers.map(answer => ({
          user_id: userId,
          problem: answer.problem as any,
          user_answer: answer.userAnswer,
          correct_answer: answer.correctAnswer,
          is_correct: answer.isCorrect,
          created_at: answer.timestamp
        }));

        const { error } = await supabase
          .from('math_answers')
          .insert(dbAnswers);

        if (error) {
          console.error("useMathAnswers - Error saving math answers:", error);
          return;
        }
      }

      setMathAnswers(answers);
      logger.log("useMathAnswers - uloženy matematické odpovědi do databáze:", answers);
    } catch (error) {
      console.error("useMathAnswers - Error saving math answers:", error);
    }
  };

  // Add single math answer to Supabase
  const addMathAnswer = async (answer: MathAnswer) => {
    try {
      if (!userId) {
        console.error("useMathAnswers - Žádný userId - nelze přidat matematickou odpověď");
        return;
      }
      
      logger.log("useMathAnswers - přidávám matematickou odpověď:", answer);
      
      const { error } = await supabase
        .from('math_answers')
        .insert({
          user_id: userId,
          problem: answer.problem as any,
          user_answer: answer.userAnswer,
          correct_answer: answer.correctAnswer,
          is_correct: answer.isCorrect,
          created_at: answer.timestamp
        });

      if (error) {
        console.error("useMathAnswers - Error adding math answer:", error);
        return;
      }

      const newAnswers = [...mathAnswers, answer];
      setMathAnswers(newAnswers);
      logger.log("useMathAnswers - přidána matematická odpověď, celkem:", newAnswers.length);
    } catch (error) {
      console.error("useMathAnswers - Error adding math answer:", error);
    }
  };

  // Clear math answers for user from Supabase
  const clearMathAnswers = async () => {
    try {
      if (!userId) {
        console.error("useMathAnswers - Žádný userId - nelze vymazat matematické odpovědi");
        return;
      }
      
      await supabase
        .from('math_answers')
        .delete()
        .eq('user_id', userId);

      setMathAnswers([]);
      
      logger.log("useMathAnswers - vymazány matematické odpovědi z databáze pro uživatele:", userId);
    } catch (error) {
      console.error("useMathAnswers - Error clearing math answers:", error);
    }
  };

  logger.log("useMathAnswers - aktuální stav:", {
    userId,
    mathAnswersCount: mathAnswers.length,
    wrongAnswersCount: mathAnswers.filter(a => !a.isCorrect).length
  });

  return {
    mathAnswers,
    addMathAnswer,
    saveMathAnswers,
    clearMathAnswers
  };
};
