import { useState, useCallback } from "react";
import { SpellingGroup, SpellingAnswer } from "@/types/spellingTypes";
import { spellingGroups } from "@/data/spellingData";

interface UseWordProblemProps {
  selectedGroups: string[];
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  showAnimation: boolean;
  setLastAnswerCorrect: (isCorrect: boolean | null) => void;
  setShowAnimation: (show: boolean) => void;
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
    console.log("🎯 generateProblem: Začínám generování s vybranými skupinami:", selectedGroups);
    
    // Výběr náhodné skupiny ze seznamu vybraných skupin
    const groupName = selectedGroups[Math.floor(Math.random() * selectedGroups.length)];
    const group = spellingGroups.find(g => g.name === groupName);
    
    console.log("🎯 generateProblem: Vybraná skupina:", groupName, "nalezena:", !!group);
    
    if (!group || !group.words || group.words.length === 0) {
      console.error("🎯 generateProblem: Skupina nemá slova!");
      return { word: "", group: "", isPhrase: false };
    }

    // Pokusíme se najít slovo s i/y (max 50 pokusů)
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      const wordObj = group.words[Math.floor(Math.random() * group.words.length)];
      const word = wordObj.word;
      const isPhrase = word.includes(" ");
      
      console.log(`🎯 generateProblem: Pokus ${attempts + 1}: testuju slovo "${word}"`);
      
      // Kontrola, zda slovo obsahuje i/y/í/ý
      const hasTargetLetters = /[iyíý]/i.test(word);
      
      console.log(`🎯 generateProblem: Slovo "${word}" obsahuje i/y/í/ý:`, hasTargetLetters);
      
      if (hasTargetLetters) {
        console.log(`🎯 generateProblem: ✅ Vybrané slovo: "${word}" ze skupiny ${groupName}`);
        return {
          word: word,
          group: groupName,
          isPhrase
        };
      }
      
      attempts++;
    }
    
    console.error(`🎯 generateProblem: ❌ Nenalezeno vhodné slovo po ${maxAttempts} pokusech`);
    return { word: "", group: "", isPhrase: false };
  };

  const generateMissingPositions = (word: string) => {
    console.log("🔍 generateMissingPositions: Analyzuji slovo:", word);
    
    // Najít všechny pozice, kde je 'i' nebo 'y'
    const positions: number[] = [];
    const letters: string[] = [];
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const lowerChar = char.toLowerCase();
      if (lowerChar === 'i' || lowerChar === 'y' || lowerChar === 'í' || lowerChar === 'ý') {
        positions.push(i);
        letters.push(lowerChar);
        console.log(`🔍 generateMissingPositions: Pozice ${i}: "${char}" -> "${lowerChar}"`);
      }
    }
    
    console.log("🔍 generateMissingPositions: Nalezené pozice:", positions);
    console.log("🔍 generateMissingPositions: Nalezená písmena:", letters);
    
    // Vytvořit slovo s mezerami na místech i/y
    let displayWord = '';
    for (let i = 0; i < word.length; i++) {
      if (positions.includes(i)) {
        displayWord += '_';
      } else {
        displayWord += word[i];
      }
    }
    
    console.log("🔍 generateMissingPositions: Zobrazované slovo:", displayWord);
    
    return { displayWord, positions, letters };
  };

  // Generování nového problému
  const generateNewProblem = useCallback(() => {
    console.log("🚀 generateNewProblem: Spouštím generování nového problému");
    
    if (selectedGroups.length === 0) {
      console.error("🚀 generateNewProblem: Žádné vybrané skupiny!");
      return null;
    }

    const { word, group, isPhrase } = generateProblem(selectedGroups);
    
    if (!word) {
      console.error("🚀 generateNewProblem: Nepodařilo se vygenerovat slovo!");
      return null;
    }
    
    const { displayWord, positions, letters } = generateMissingPositions(word);
    
    console.log("🚀 generateNewProblem: Nastavuji stav s:", {
      currentWord: word,
      displayedWord: displayWord,
      wordGroup: group,
      isPhrase,
      missingPositions: positions,
      correctLetters: letters,
      currentPosition: 0
    });
    
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
    console.log("💭 handleAnswer: Odpovídám:", answer);
    console.log("💭 handleAnswer: Současná pozice:", currentPosition);
    console.log("💭 handleAnswer: Správná písmena:", correctLetters);
    console.log("💭 handleAnswer: Správné písmeno na pozici:", correctLetters[currentPosition]);
    
    const correctLetter = correctLetters[currentPosition];
    
    // Normalizace pro porovnání (í->i, ý->y)
    const normalizedCorrect = correctLetter === 'í' ? 'i' : correctLetter === 'ý' ? 'y' : correctLetter;
    const isCorrect = normalizedCorrect === answer;
    
    console.log("💭 handleAnswer: Normalizované správné písmeno:", normalizedCorrect);
    console.log("💭 handleAnswer: Je odpověď správná?", isCorrect);
    
    // Create detailed answer record
    const answerRecord: SpellingAnswer = {
      word: currentWord,
      position: currentPosition,
      userAnswer: answer,
      correctAnswer: normalizedCorrect,
      isCorrect,
      timestamp: new Date().toISOString(),
      wordGroup: wordGroup
    };
    
    // Add to answers array
    addAnswer(answerRecord);
    
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
        console.log("💭 handleAnswer: Posun na další pozici:", currentPosition + 1);
        setCurrentPosition(prev => prev + 1);
      } else {
        // Všechna písmena ve slově byla zodpovězena
        console.log("💭 handleAnswer: Generuji nové slovo");
        generateNewProblem();
      }
    }, 1000);
  }, [correctLetters, currentPosition, generateNewProblem, missingPositions.length, onCorrectAnswer, onWrongAnswer, setLastAnswerCorrect, setShowAnimation, addAnswer, currentWord, wordGroup]);

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
