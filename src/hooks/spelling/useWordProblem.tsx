
import { useState, useCallback } from "react";
import { SpellingAnswer } from "@/types/spellingTypes";
import { getWordsFromGroups, createDisplayedWord } from "@/utils/spellingUtils";

export const useWordProblem = (
  selectedGroups: string[],
  addAnswer: (answer: SpellingAnswer) => void,
  correctAnswers: number,
  wrongAnswers: number,
  problemCount: number,
  endGame: () => void
) => {
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
      endGame();
      return;
    }

    try {
      const allWords = getWordsFromGroups(selectedGroups);
      if (allWords.length === 0) {
        console.warn("Žádná slova k dispozici");
        endGame();
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
      endGame();
    }
  }, [selectedGroups, endGame]);

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

    // Posunout na další pozici nebo další slovo
    const nextPosition = currentPosition + 1;
    
    if (nextPosition >= missingPositions.length) {
      // Hotovo s tímto slovem - zkontrolovat, zda pokračovat
      setTimeout(() => {
        const totalAnswers = correctAnswers + wrongAnswers + 1; // +1 pro aktuální odpověď
        
        if (totalAnswers >= problemCount) {
          console.log("Hra končí - dosaženo maximálního počtu odpovědí:", totalAnswers, "z", problemCount);
          endGame();
        } else {
          console.log("Generuji nové slovo - aktuální počet:", totalAnswers, "z", problemCount);
          generateNewWord();
        }
      }, 1500); // Krátká pauza pro animaci
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
    correctAnswers,
    wrongAnswers,
    problemCount,
    endGame,
    generateNewWord
  ]);

  return {
    currentWord,
    displayedWord,
    wordGroup,
    isPhrase,
    correctLetters,
    missingPositions,
    currentPosition,
    generateNewWord,
    handleAnswer
  };
};
