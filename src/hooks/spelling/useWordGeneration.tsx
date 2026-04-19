
import { useCallback } from "react";
import { getWordsFromGroups, createDisplayedWord } from "@/utils/spellingUtils";
import { logger } from "@/utils/logger";

interface UseWordGenerationProps {
  selectedGroups: string[];
  setLastAnswerCorrect: (value: boolean | null) => void;
  setShowAnimation: (value: boolean) => void;
  updateWordState: (wordData: {
    word: string;
    displayWord: string;
    group: string;
    isPhrase: boolean;
    positions: number[];
    letters: string[];
    type?: string;
  }) => void;
}

export const useWordGeneration = ({
  selectedGroups,
  setLastAnswerCorrect,
  setShowAnimation,
  updateWordState,
}: UseWordGenerationProps) => {

  const generateNewWord = useCallback(() => {
    if (selectedGroups.length === 0) {
      logger.warn("⚠️ generateNewWord: Žádné skupiny nevybrány");
      return;
    }

    try {
      const allWords = getWordsFromGroups(selectedGroups);

      if (allWords.length === 0) {
        logger.error("❌ generateNewWord: Žádná platná slova pro skupiny:", selectedGroups);
        return;
      }

      let attempts = 0;
      const maxAttempts = 50;
      let validWord: ReturnType<typeof getWordsFromGroups>[number] & {
        displayWord: string;
        positions: number[];
        letters: string[];
      } | null = null;

      while (attempts < maxAttempts && !validWord) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        const { displayWord, positions, letters } = createDisplayedWord(randomWord.word);

        if (positions.length > 0) {
          validWord = {
            ...randomWord,
            displayWord,
            positions,
            letters,
          };
        }
        attempts++;
      }

      if (!validWord) {
        logger.error("❌ generateNewWord: Nepodařilo se najít platné slovo po", maxAttempts, "pokusech");
        return;
      }

      // FORCE RESET ANIMATION BEFORE SETTING NEW WORD
      setShowAnimation(false);
      setLastAnswerCorrect(null);

      updateWordState({
        word: validWord.word,
        displayWord: validWord.displayWord,
        group: validWord.group,
        isPhrase: validWord.isPhrase || false,
        positions: validWord.positions,
        letters: validWord.letters,
        type: validWord.type,
      });
    } catch (error) {
      logger.error("❌ generateNewWord: Chyba při generování slova:", error);
    }
  }, [selectedGroups, setShowAnimation, setLastAnswerCorrect, updateWordState]);

  return {
    generateNewWord,
  };
};
