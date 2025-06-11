
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { useMathAnswers } from "./useMathAnswers";
import { useSpellingAnswers } from "./useSpellingAnswers";

export const useDetailedAnswers = (userId: string | null) => {
  console.log("useDetailedAnswers - inicializace s userId:", userId);
  
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
    try {
      console.log("useDetailedAnswers - mazám všechny detailní odpovědi pro userId:", userId);
      await Promise.all([
        clearMathAnswers(),
        clearSpellingAnswers()
      ]);
      
      console.log("useDetailedAnswers - vymazány všechny detailní odpovědi z databáze");
    } catch (error) {
      console.error("useDetailedAnswers - Error clearing answers:", error);
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
