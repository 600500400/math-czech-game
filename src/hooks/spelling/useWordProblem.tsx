
import { useState, useCallback } from "react";
import { SpellingGroup } from "@/types/spellingTypes";
import { spellingGroups } from "@/data/spellingData";

interface UseWordProblemProps {
  selectedGroups: string[];
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  showAnimation: boolean;
  setLastAnswerCorrect: (isCorrect: boolean | null) => void;
  setShowAnimation: (show: boolean) => void;
}

export const useWordProblem = ({
  selectedGroups,
  onCorrectAnswer,
  onWrongAnswer,
  showAnimation,
  setLastAnswerCorrect,
  setShowAnimation
}: UseWordProblemProps) => {
  // State for current word
  const [currentWord, setCurrentWord] = useState("");
  const [displayedWord, setDisplayedWord] = useState("");
  const [wordGroup, setWordGroup] = useState("");
  const [isPhrase, setIsPhrase] = useState(false);
  
  // State for i/y positions in the word
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Pomocné funkce pro generování problémů a pozic
  const generateProblem = (selectedGroups: string[]) => {
    // Výběr náhodné skupiny ze seznamu vybraných skupin
    const groupName = selectedGroups[Math.floor(Math.random() * selectedGroups.length)];
    const group = spellingGroups.find(g => g.name === groupName);
    
    if (!group || !group.words || group.words.length === 0) {
      return { word: "", group: "", isPhrase: false };
    }

    // Výběr náhodného slova ze skupiny
    const wordObj = group.words[Math.floor(Math.random() * group.words.length)];
    const isPhrase = wordObj.word.includes(" ");
    
    return {
      word: wordObj.word,
      group: groupName,
      isPhrase
    };
  };

  const generateMissingPositions = (word: string) => {
    // Najít všechny pozice, kde je 'i' nebo 'y'
    const positions: number[] = [];
    const letters: string[] = [];
    
    for (let i = 0; i < word.length; i++) {
      const lowerChar = word[i].toLowerCase();
      if (lowerChar === 'i' || lowerChar === 'y') {
        positions.push(i);
        letters.push(lowerChar);
      }
    }
    
    // Vytvořit slovo s mezerami na místech i/y
    let displayWord = '';
    for (let i = 0; i < word.length; i++) {
      if (positions.includes(i)) {
        displayWord += '_';
      } else {
        displayWord += word[i];
      }
    }
    
    return { displayWord, positions, letters };
  };

  // Generování nového problému
  const generateNewProblem = useCallback(() => {
    if (selectedGroups.length === 0) {
      return null;
    }

    const { word, group, isPhrase } = generateProblem(selectedGroups);
    const { displayWord, positions, letters } = generateMissingPositions(word);
    
    setCurrentWord(word);
    setWordGroup(group);
    setIsPhrase(isPhrase);
    setDisplayedWord(displayWord);
    setMissingPositions(positions);
    setCorrectLetters(letters);
    setCurrentPosition(0);
    
    return { word, displayWord, positions, letters };
  }, [selectedGroups]);

  // Odpověď na otázku
  const handleAnswer = useCallback((answer: "i" | "y") => {
    const isCorrect = correctLetters[currentPosition] === answer;
    
    // Aktualizace statistik
    if (isCorrect) {
      onCorrectAnswer();
      setLastAnswerCorrect(true);
    } else {
      onWrongAnswer();
      setLastAnswerCorrect(false);
    }
    
    // Zobrazení animace
    setShowAnimation(true);
    
    // Po 2 sekundách skryjeme animaci
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    
    // Posun na další písmeno nebo další slovo
    setTimeout(() => {
      if (currentPosition + 1 < missingPositions.length) {
        // Další písmeno ve stejném slově
        setCurrentPosition(prev => prev + 1);
      } else {
        // Všechna písmena ve slově byla zodpovězena
        generateNewProblem();
      }
    }, 1000);
  }, [correctLetters, currentPosition, generateNewProblem, missingPositions.length, onCorrectAnswer, onWrongAnswer, setLastAnswerCorrect, setShowAnimation]);

  // Odpovědi na i/y
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
    generateNewProblem,
    handleAnswerI,
    handleAnswerY
  };
};
