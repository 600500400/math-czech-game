
import { useState, useCallback } from "react";

export const useWordState = () => {
  const [currentWord, setCurrentWord] = useState("");
  const [displayedWord, setDisplayedWord] = useState("");
  const [wordGroup, setWordGroup] = useState("");
  const [isPhrase, setIsPhrase] = useState(false);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

  const resetWordState = useCallback(() => {
    setCurrentWord("");
    setDisplayedWord("");
    setWordGroup("");
    setIsPhrase(false);
    setCorrectLetters([]);
    setMissingPositions([]);
    setCurrentPosition(0);
  }, []);

  const updateWordState = useCallback((wordData: {
    word: string;
    displayWord: string;
    group: string;
    isPhrase: boolean;
    positions: number[];
    letters: string[];
  }) => {
    setCurrentWord(wordData.word);
    setDisplayedWord(wordData.displayWord);
    setWordGroup(wordData.group);
    setIsPhrase(wordData.isPhrase);
    setMissingPositions(wordData.positions);
    setCorrectLetters(wordData.letters);
    setCurrentPosition(0);
  }, []);

  const moveToNextPosition = useCallback(() => {
    setCurrentPosition(prev => prev + 1);
  }, []);

  return {
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
  };
};
