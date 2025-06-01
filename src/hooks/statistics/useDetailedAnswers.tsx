
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { useMathAnswers } from "./useMathAnswers";
import { useSpellingAnswers } from "./useSpellingAnswers";
import { supabase } from "@/integrations/supabase/client";

export const useDetailedAnswers = (userId: string | null) => {
  const {
    mathAnswers,
    addMathAnswer,
    saveMathAnswers,
    clearMathAnswers
  } = useMathAnswers(userId);

  const {
    spellingAnswers,
    addSpellingAnswer,
    saveSpellingAnswers,
    clearSpellingAnswers
  } = useSpellingAnswers(userId);

  // Clear all answers for user from Supabase
  const clearAllAnswers = async () => {
    if (!userId) return;
    
    try {
      await Promise.all([
        clearMathAnswers(),
        clearSpellingAnswers()
      ]);
      
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
