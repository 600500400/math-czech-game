
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";
import { DictionaryAnswer } from "@/types/dictionaryTypes";
import { useMathAnswers } from "./useMathAnswers";
import { useSpellingAnswers } from "./useSpellingAnswers";
import { useDictionaryAnswers } from "../dictionary/useDictionaryAnswers";

import { logger } from "@/utils/logger";
export const useDetailedAnswers = (userId: string | null) => {
  logger.log("useDetailedAnswers - inicializace s userId:", userId);
  
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

  const {
    dictionaryAnswers,
    addDictionaryAnswer,
    saveDictionaryAnswers,
    clearDictionaryAnswers
  } = useDictionaryAnswers(userId);

  // Clear all answers for user from Supabase
  const clearAllAnswers = async () => {
    try {
      logger.log("useDetailedAnswers - mazám všechny detailní odpovědi pro userId:", userId);
      await Promise.all([
        clearMathAnswers(),
        clearSpellingAnswers(),
        clearDictionaryAnswers()
      ]);
      
      logger.log("useDetailedAnswers - vymazány všechny detailní odpovědi z databáze");
    } catch (error) {
      console.error("useDetailedAnswers - Error clearing answers:", error);
    }
  };

  logger.log("useDetailedAnswers - aktuální stav:", {
    userId,
    mathAnswersCount: mathAnswers.length,
    spellingAnswersCount: spellingAnswers.length,
    dictionaryAnswersCount: dictionaryAnswers.length,
    mathWrongCount: mathAnswers.filter(a => !a.isCorrect).length,
    spellingWrongCount: spellingAnswers.filter(a => !a.isCorrect).length,
    dictionaryWrongCount: dictionaryAnswers.filter(a => !a.is_correct).length
  });

  return {
    mathAnswers,
    spellingAnswers,
    dictionaryAnswers,
    addMathAnswer,
    addSpellingAnswer,
    addDictionaryAnswer,
    saveMathAnswers,
    saveSpellingAnswers,
    saveDictionaryAnswers,
    clearAllAnswers
  };
};
