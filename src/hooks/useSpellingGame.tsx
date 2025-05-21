import { useState, useEffect, useCallback } from "react";
import { spellingGroups } from "../data/spellingData";
import { useAuth } from "./useAuth";
import { useStatistics } from "./useStatistics";
import { SpellingGroup } from "@/types/spellingTypes";

export const useSpellingGame = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  const { saveSpellingStatistics } = useStatistics(userId);

  // State pro sledování statistik
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [problemCount, setProblemCount] = useState(10);

  // State pro aktuální slovo
  const [currentWord, setCurrentWord] = useState("");
  const [displayedWord, setDisplayedWord] = useState("");
  const [wordGroup, setWordGroup] = useState("");
  const [isPhrase, setIsPhrase] = useState(false);
  
  // State pro místa s i/y v slově
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

  // State pro dialogy
  const [showProblem, setShowProblem] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);

  // State pro animace
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // State pro vybrané skupiny
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Celkový počet odpovědí
  const totalAnswers = correctAnswers + wrongAnswers;

  // Přepínání skupiny
  const toggleGroup = (group: string) => {
    setSelectedGroups(prev => {
      if (prev.includes(group)) {
        return prev.filter(g => g !== group);
      }
      return [...prev, group];
    });
  };

  // Nastavení všech/žádné skupiny
  const selectAll = () => {
    setSelectedGroups(spellingGroups.map(g => g.name));
  };

  const deselectAll = () => {
    setSelectedGroups([]);
  };

  // Nastavení skupin - updated to be a function without parameters
  const setGroups = () => {
    // This function now doesn't need parameters as it uses the current selectedGroups state
    // This matches the signature in GroupSelectionDialog props
  };

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

  // Předdeklarace endGame
  const endGame = useCallback(() => { /* bude definováno později */ }, []);

  // Generování nového problému
  const generateNewProblem = useCallback(() => {
    if (selectedGroups.length === 0) {
      setShowGroupDialog(true);
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

  // Spuštění nové hry
  const startNewGame = useCallback(() => {
    if (selectedGroups.length === 0) {
      setShowGroupDialog(true);
      return;
    }
    
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setProblemCount(10); // Výchozí počet problémů
    
    const problem = generateNewProblem();
    if (problem) {
      setShowProblem(true);
    }
  }, [generateNewProblem, selectedGroups]);

  // Odpověď na otázku
  const handleAnswer = useCallback((answer: "i" | "y") => {
    const isCorrect = correctLetters[currentPosition] === answer;
    
    // Aktualizace statistik
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setLastAnswerCorrect(true);
    } else {
      setWrongAnswers(prev => prev + 1);
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
        if (correctAnswers + wrongAnswers + 1 >= problemCount) {
          // Konec hry
          endGame();
        } else {
          // Další slovo
          generateNewProblem();
        }
      }
    }, 1000);
  }, [correctAnswers, correctLetters, currentPosition, endGame, generateNewProblem, missingPositions.length, problemCount, wrongAnswers]);

  // Implementace endGame
  const actualEndGame = useCallback(() => {
    setShowProblem(false);
    setShowStatsDialog(true);
    
    // Pokud je uživatel přihlášený, uložíme statistiky
    if (userId && (correctAnswers > 0 || wrongAnswers > 0)) {
      saveSpellingStatistics.mutate({
        correctAnswers,
        wrongAnswers,
        wordGroup: selectedGroups.join(',')
      });
    }
  }, [correctAnswers, saveSpellingStatistics, selectedGroups, userId, wrongAnswers]);

  // Přiřazení implementací do předdeklarovaných funkcí
  Object.assign(endGame, actualEndGame);

  // Odpovědi na i/y
  const handleAnswerI = useCallback(() => handleAnswer("i"), [handleAnswer]);
  const handleAnswerY = useCallback(() => handleAnswer("y"), [handleAnswer]);

  return {
    correctAnswers,
    wrongAnswers,
    problemCount,
    currentWord,
    displayedWord,
    showProblem,
    showGroupDialog,
    showStatsDialog,
    selectedGroups,
    wordGroup,
    isPhrase,
    correctLetters,
    missingPositions,
    currentPosition,
    lastAnswerCorrect,
    showAnimation,
    totalAnswers,
    
    setShowGroupDialog,
    setShowStatsDialog,
    toggleGroup,
    setGroups,  // This now returns the function without parameters
    selectAll,
    deselectAll,
    startNewGame,
    handleAnswerI,
    handleAnswerY,
    endGame,
  };
};
