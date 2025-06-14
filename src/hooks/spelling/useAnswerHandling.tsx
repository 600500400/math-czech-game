
import { useCallback } from "react";
import { SpellingAnswer } from "@/types/spellingTypes";
import { checkSpellingAnswer, renderWordWithCurrentGap } from "@/utils/spellingUtils";

interface UseAnswerHandlingProps {
  currentWord: string;
  displayedWord: string;
  setDisplayedWord: (word: string) => void;
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
  displayedWord,
  setDisplayedWord,
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

    // Record the answer
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

    // Show animation
    console.log("🎬 handleAnswer: Starting animation sequence");
    setLastAnswerCorrect(isCorrect);
    setShowAnimation(true);

    // After animation, update the displayed word and continue
    setTimeout(() => {
      console.log("🎬 handleAnswer: Hiding animation");
      setShowAnimation(false);
      setLastAnswerCorrect(null);
      
      // Update displayed word to show the filled letter
      const nextPosition = currentPosition + 1;
      const updatedDisplayedWord = renderWordWithCurrentGap(
        currentWord, 
        missingPositions, 
        correctLetters, 
        nextPosition
      );
      
      console.log("🔤 handleAnswer: Updating displayed word:", updatedDisplayedWord);
      setDisplayedWord(updatedDisplayedWord);
      
      setTimeout(() => {
        if (nextPosition >= missingPositions.length) {
          // Word completed - generate new word
          console.log("🎯 handleAnswer: Word completed, generating new word");
          generateNewWord();
        } else {
          // Move to next position in same word
          console.log("➡️ handleAnswer: Moving to next position:", nextPosition);
          moveToNextPosition();
        }
      }, 100);
      
    }, 600);

  }, [
    currentPosition,
    missingPositions,
    correctLetters,
    currentWord,
    displayedWord,
    setDisplayedWord,
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
