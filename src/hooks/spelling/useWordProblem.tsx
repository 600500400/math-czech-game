
import { useState, useCallback } from "react";
import { SpellingAnswer } from "@/types/spellingTypes";
import { getWordsFromGroups, createDisplayedWord } from "@/utils/spellingUtils";

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
  const [currentWord, setCurrentWord] = useState("");
  const [displayedWord, setDisplayedWord] = useState("");
  const [wordGroup, setWordGroup] = useState("");
  const [isPhrase, setIsPhrase] = useState(false);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

  const generateNewWord = useCallback(() => {
    console.log("Generuji nové slovo...");
    if (selectedGroups.length === 0) {
      console.warn("Žádné skupiny nevybrány");
      return;
    }

    try {
      const allWords = getWordsFromGroups(selectedGroups);
      if (allWords.length === 0) {
        console.warn("Žádná slova k dispozici");
        return;
      }

      const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
      console.log("Vybrané slovo:", randomWord);
      
      setCurrentWord(randomWord.word);
      setWordGroup(randomWord.group);
      setIsPhrase(randomWord.isPhrase || false);

      const { displayWord, positions, letters } = createDisplayedWord(randomWord.word);
      setDisplayedWord(displayWord);
      setMissingPositions(positions);
      setCorrectLetters(letters);
      setCurrentPosition(0);
      
      console.log("Nové slovo nastaveno:", {
        word: randomWord.word,
        displayWord,
        positions,
        letters
      });
    } catch (error) {
      console.error("Chyba při generování nového slova:", error);
    }
  }, [selectedGroups]);

  const handleAnswer = useCallback((letter: "i" | "y") => {
    if (currentPosition >= missingPositions.length) {
      console.warn("Všechny pozice již vyplněny");
      return;
    }

    const position = missingPositions[currentPosition];
    const correctAnswer = correctLetters[currentPosition];
    const isCorrect = letter === correctAnswer;

    console.log("Odpověď:", letter, "správná:", correctAnswer, "pozice:", position, "správně:", isCorrect);

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

    // Show animation
    setLastAnswerCorrect(isCorrect);
    setShowAnimation(true);

    // Hide animation after delay
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);

    // Posunout na další pozici nebo další slovo
    const nextPosition = currentPosition + 1;
    
    if (nextPosition >= missingPositions.length) {
      // Hotovo s tímto slovem - generovat nové
      setTimeout(() => {
        generateNewWord();
      }, 1500);
    } else {
      // Pokračovat na další pozici ve stejném slově
      setCurrentPosition(nextPosition);
      console.log("Pokračuji na pozici:", nextPosition);
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
    generateNewWord
  ]);

  const handleAnswerI = useCallback(() => handleAnswer("i"), [handleAnswer]);
  const handleAnswerY = useCallback(() => handleAnswer("y"), [handleAnswer]);

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
