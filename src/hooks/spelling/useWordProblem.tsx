
import { useEffect } from "react";
import { SpellingAnswer } from "@/types/spellingTypes";
import { useWordState } from "./useWordState";
import { useWordGeneration } from "./useWordGeneration";
import { useAnswerHandling } from "./useAnswerHandling";

interface UseWordProblemProps {
  selectedGroups: string[];
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  showAnimation: boolean;
  setLastAnswerCorrect: (value: boolean | null) => void;
  setShowAnimation: (value: boolean) => void;
  addAnswer: (answer: SpellingAnswer) => void;
}

export const useWordProblem = ({
  selectedGroups,
  onCorrectAnswer,
  onWrongAnswer,
  showAnimation,
  setLastAnswerCorrect,
  setShowAnimation,
  addAnswer
}: UseWordProblemProps) => {
  
  // Use the word state management hook
  const {
    currentWord,
    displayedWord,
    wordGroup,
    isPhrase,
    correctLetters,
    missingPositions,
    currentPosition,
    resetWordState,
    updateWordState,
    moveToNextPosition,
    setDisplayedWord
  } = useWordState();

  // Use the word generation hook
  const { generateNewWord } = useWordGeneration({
    selectedGroups,
    setLastAnswerCorrect,
    setShowAnimation,
    updateWordState
  });

  // Use the answer handling hook
  const { handleAnswer, handleAnswerI, handleAnswerY } = useAnswerHandling({
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
  });

  // Generate initial word when groups are selected
  useEffect(() => {
    if (selectedGroups.length > 0 && !currentWord) {
      console.log("🚀 useWordProblem: Generuji první slovo pro vybrané skupiny");
      generateNewWord();
    }
  }, [selectedGroups, currentWord, generateNewWord]);

  return {
    currentWord,
    displayedWord,
    wordGroup,
    isPhrase,
    correctLetters,
    missingPositions,
    currentPosition,
    generateNewWord,
    handleAnswer,
    handleAnswerI,
    handleAnswerY
  };
};
