
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { generateSpellingProblem, checkSpellingAnswer } from "@/utils/spellingUtils";
import { spellingGroups } from "@/data/spellingData";

interface UseGameMechanicsProps {
  selectedGroups: string[];
  incrementProblemCount: () => void;
  incrementCorrect: () => void;
  incrementWrong: () => void;
}

export function useGameMechanics({
  selectedGroups,
  incrementProblemCount,
  incrementCorrect,
  incrementWrong
}: UseGameMechanicsProps) {
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState("");
  const [displayedWord, setDisplayedWord] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [showProblem, setShowProblem] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [wordGroup, setWordGroup] = useState("");
  const [isPhrase, setIsPhrase] = useState(false);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  const startNewGame = () => {
    if (selectedGroups.length === 0) {
      toast({
        title: "Chyba",
        description: "Nejdříve vyberte skupiny vyjmenovaných slov.",
        variant: "destructive",
      });
      return;
    }

    incrementProblemCount();
    const problem = generateSpellingProblem(selectedGroups, spellingGroups);
    
    if (!problem) {
      toast({
        title: "Chyba",
        description: "Nepodařilo se vygenerovat příklad.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentWord(problem.word);
    setDisplayedWord(problem.displayed);
    setWordGroup(problem.group);
    setIsPhrase(problem.isPhrase || false);
    setMissingPositions(problem.positions || []);
    setCorrectLetters(problem.letters || []);
    setCurrentPosition(0);
    setShowProblem(true);
    setUserAnswer("");
    setGameEnded(false);
    setShowAnimation(false);
  };

  const handleAnswer = (answer: string) => {
    if (!currentWord || missingPositions.length === 0) return;

    const correctLetter = correctLetters[currentPosition];
    setUserAnswer(answer);
    
    // Kontrola odpovědi pomocí utility funkce
    const isCorrect = checkSpellingAnswer(correctLetter, answer);
    
    // Pro debug do konzole
    console.log(`Správná odpověď: ${correctLetter}, Uživatelova odpověď: ${answer}, Vyhodnoceno jako: ${isCorrect ? 'Správně' : 'Špatně'}`);
    
    // Nastavíme výsledek a spustíme animaci
    setLastAnswerCorrect(isCorrect);
    setShowAnimation(true);
    
    if (isCorrect) {
      toast({
        title: "Správně!",
        variant: "default",
      });
      
      // Přejdeme na další pozici, pokud existuje
      if (currentPosition < missingPositions.length - 1) {
        setCurrentPosition(currentPosition + 1);
        setUserAnswer("");
      } else {
        incrementCorrect();
        
        // Timeout před dalším slovem, aby byla vidět animace
        setTimeout(() => {
          startNewGame(); // Začneme novou hru
        }, 1500);
      }
    } else {
      toast({
        title: "Špatně!",
        description: `Správná odpověď byla: ${correctLetter}`,
        variant: "destructive",
      });
      
      incrementWrong();
      
      // Přejdeme na další pozici i po špatné odpovědi
      if (currentPosition < missingPositions.length - 1) {
        setCurrentPosition(currentPosition + 1);
        setUserAnswer("");
      } else {
        // Timeout před dalším slovem, aby byla vidět animace
        setTimeout(() => {
          startNewGame(); // Začneme novou hru
        }, 1500);
      }
    }
    
    // Schováme animaci po 1,5 sekundách
    setTimeout(() => {
      setShowAnimation(false);
    }, 1500);
  };

  const endGame = () => {
    setShowProblem(false);
    setGameEnded(true);
    toast({
      title: "Hra ukončena",
      description: `Počet správných odpovědí: ${correctLetters.length}`,
    });
  };
  
  const handleAnswerI = () => handleAnswer("i");
  const handleAnswerY = () => handleAnswer("y");

  return {
    currentWord,
    displayedWord,
    userAnswer,
    showProblem,
    gameEnded,
    wordGroup,
    isPhrase,
    correctLetters,
    missingPositions,
    currentPosition,
    lastAnswerCorrect,
    showAnimation,
    
    startNewGame,
    handleAnswerI,
    handleAnswerY,
    endGame,
  };
}
