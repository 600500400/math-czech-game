
import { useCallback } from "react";
import { SpellingAnswer } from "@/types/spellingTypes";
import { checkSpellingAnswer } from "@/utils/spellingUtils";

interface UseAnswerHandlingProps {
  currentWord: string;
  wordGroup: string;
  missingPositions: number[];
  correctLetters: string[];
  currentPosition: number;
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  setLastAnswerCorrect: (value: boolean | null) => void;
  setShowAnimation: (value: boolean) => void;
  addAnswer: (answer: SpellingAnswer) => void;
  moveToNextPosition: () => void;
  generateNewWord: () => void;
}

export const useAnswerHandling = ({
  currentWord,
  wordGroup,
  missingPositions,
  correctLetters,
  currentPosition,
  onCorrectAnswer,
  onWrongAnswer,
  setLastAnswerCorrect,
  setShowAnimation,
  addAnswer,
  moveToNextPosition,
  generateNewWord
}: UseAnswerHandlingProps) => {

  const handleAnswer = useCallback((letter: "i" | "y") => {
    console.log("🎯 handleAnswer: Zpracovávám odpověď:", letter);
    
    if (currentPosition >= missingPositions.length) {
      console.warn("⚠️ handleAnswer: Všechny pozice již vyplněny");
      return;
    }

    const position = missingPositions[currentPosition];
    const correctAnswer = correctLetters[currentPosition];
    
    // Use the checkSpellingAnswer function for proper comparison
    const isCorrect = checkSpellingAnswer(correctAnswer, letter);

    console.log("🔍 handleAnswer: Kontrola odpovědi:", {
      userAnswer: letter,
      correctAnswer,
      position,
      isCorrect
    });

    // Zaznamenat odpověď
    const answer: SpellingAnswer = {
      word: currentWord,
      position,
      userAnswer: letter,
      correctAnswer,
      isCorrect,
      timestamp: new Date().toISOString(),
      wordGroup
    };

    addAnswer(answer);

    // Update statistics
    if (isCorrect) {
      onCorrectAnswer();
    } else {
      onWrongAnswer();
    }

    // Show animation with simplified timing
    console.log("🎬 handleAnswer: Starting animation sequence");
    setLastAnswerCorrect(isCorrect);
    setShowAnimation(true);

    // Posunout na další pozici nebo další slovo
    const nextPosition = currentPosition + 1;
    
    if (nextPosition >= missingPositions.length) {
      // Hotovo s tímto slovem - generovat nové za kratší dobu
      console.log("🎯 handleAnswer: Slovo dokončeno, generuji nové za 1.2s");
      setTimeout(() => {
        generateNewWord();
      }, 1200); // Shorter delay
    } else {
      // Pokračovat na další pozici ve stejném slově
      moveToNextPosition();
      console.log("➡️ handleAnswer: Pokračuji na pozici:", nextPosition);
    }

  }, [
    currentPosition,
    missingPositions,
    correctLetters,
    currentWord,
    wordGroup,
    addAnswer,
    onCorrectAnswer,
    onWrongAnswer,
    setLastAnswerCorrect,
    setShowAnimation,
    moveToNextPosition,
    generateNewWord
  ]);

  const handleAnswerI = useCallback(() => handleAnswer("i"), [handleAnswer]);
  const handleAnswerY = useCallback(() => handleAnswer("y"), [handleAnswer]);

  return {
    handleAnswer,
    handleAnswerI,
    handleAnswerY
  };
};
