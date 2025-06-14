
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

    // Show animation with proper timing
    console.log("🎬 handleAnswer: Starting animation sequence");
    setLastAnswerCorrect(isCorrect);
    setShowAnimation(true);

    // Auto-hide animation and move to next after shorter time
    setTimeout(() => {
      console.log("🎬 handleAnswer: Hiding animation");
      setShowAnimation(false);
      setLastAnswerCorrect(null);
      
      // Small delay for smooth transition
      setTimeout(() => {
        const nextPosition = currentPosition + 1;
        
        if (nextPosition >= missingPositions.length) {
          // Hotovo s tímto slovem - generovat nové
          console.log("🎯 handleAnswer: Word completed, generating new word");
          generateNewWord();
        } else {
          // Pokračovat na další pozici ve stejném slově
          console.log("➡️ handleAnswer: Moving to next position:", nextPosition);
          moveToNextPosition();
        }
      }, 100);
      
    }, 800); // Shortened animation time

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
