
import { useCallback } from "react";
import { getWordsFromGroups, createDisplayedWord } from "@/utils/spellingUtils";

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
  }) => void;
}

export const useWordGeneration = ({
  selectedGroups,
  setLastAnswerCorrect,
  setShowAnimation,
  updateWordState
}: UseWordGenerationProps) => {
  
  const generateNewWord = useCallback(() => {
    console.log("🎯 generateNewWord: Generuji nové slovo pro skupiny:", selectedGroups);
    
    if (selectedGroups.length === 0) {
      console.warn("⚠️ generateNewWord: Žádné skupiny nevybrány");
      return;
    }

    try {
      const allWords = getWordsFromGroups(selectedGroups);
      console.log("📚 generateNewWord: Dostupná slova:", allWords.length);
      
      if (allWords.length === 0) {
        console.error("❌ generateNewWord: Žádná platná slova k dispozici pro vybrané skupiny");
        return;
      }

      // Try to find a valid word (with safety limit to prevent infinite loop)
      let attempts = 0;
      const maxAttempts = 50;
      let validWord = null;

      while (attempts < maxAttempts && !validWord) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        console.log(`🎲 generateNewWord: Pokus ${attempts + 1}: testuju slovo "${randomWord.word}"`);
        
        const { displayWord, positions, letters } = createDisplayedWord(randomWord.word);
        
        // Check if word actually has positions to fill
        if (positions.length > 0) {
          validWord = {
            ...randomWord,
            displayWord,
            positions,
            letters
          };
          console.log("✅ generateNewWord: Nalezeno platné slovo:", validWord);
        } else {
          console.log(`⚠️ generateNewWord: Slovo "${randomWord.word}" nemá žádné i/y pozice`);
        }
        
        attempts++;
      }

      if (!validWord) {
        console.error("❌ generateNewWord: Nepodařilo se najít platné slovo po", maxAttempts, "pokusech");
        return;
      }

      // FORCE RESET ANIMATION BEFORE SETTING NEW WORD
      console.log("🎯 generateNewWord: Force reset animace před nastavením nového slova");
      setShowAnimation(false);
      setLastAnswerCorrect(null);

      // Set the valid word using the callback
      updateWordState({
        word: validWord.word,
        displayWord: validWord.displayWord,
        group: validWord.group,
        isPhrase: validWord.isPhrase || false,
        positions: validWord.positions,
        letters: validWord.letters
      });
      
      console.log("✅ generateNewWord: Nové slovo úspěšně nastaveno:", {
        word: validWord.word,
        displayWord: validWord.displayWord,
        positions: validWord.positions,
        letters: validWord.letters
      });
    } catch (error) {
      console.error("❌ generateNewWord: Chyba při generování nového slova:", error);
    }
  }, [selectedGroups, setShowAnimation, setLastAnswerCorrect, updateWordState]);

  return {
    generateNewWord
  };
};
