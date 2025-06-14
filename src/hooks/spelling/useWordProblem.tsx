
import { useState, useCallback, useEffect } from "react";
import { SpellingAnswer } from "@/types/spellingTypes";
import { getWordsFromGroups, createDisplayedWord, checkSpellingAnswer } from "@/utils/spellingUtils";

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
    console.log("🎯 generateNewWord: Generuji nové slovo pro skupiny:", selectedGroups);
    
    if (selectedGroups.length === 0) {
      console.warn("⚠️ generateNewWord: Žádné skupiny nevybrány");
      return;
    }

    try {
      const allWords = getWordsFromGroups(selectedGroups);
      console.log("📚 generateNewWord: Dostupná slova:", allWords.length);
      
      if (allWords.length === 0) {
        console.error("❌ generateNewWord: Žádná platná slova k dispozici pro vybrané skupiny");
        return;
      }

      // Try to find a valid word (with safety limit to prevent infinite loop)
      let attempts = 0;
      const maxAttempts = 50;
      let validWord = null;

      while (attempts < maxAttempts && !validWord) {
        const randomWord = allWords[Math.floor(Math.random() * allWords.length)];
        console.log(`🎲 generateNewWord: Pokus ${attempts + 1}: testuju slovo "${randomWord.word}"`);
        
        const { displayWord, positions, letters } = createDisplayedWord(randomWord.word);
        
        // Check if word actually has positions to fill
        if (positions.length > 0) {
          validWord = {
            ...randomWord,
            displayWord,
            positions,
            letters
          };
          console.log("✅ generateNewWord: Nalezeno platné slovo:", validWord);
        } else {
          console.log(`⚠️ generateNewWord: Slovo "${randomWord.word}" nemá žádné i/y pozice`);
        }
        
        attempts++;
      }

      if (!validWord) {
        console.error("❌ generateNewWord: Nepodařilo se najít platné slovo po", maxAttempts, "pokusech");
        return;
      }

      // Set the valid word
      setCurrentWord(validWord.word);
      setWordGroup(validWord.group);
      setIsPhrase(validWord.isPhrase || false);
      setDisplayedWord(validWord.displayWord);
      setMissingPositions(validWord.positions);
      setCorrectLetters(validWord.letters);
      setCurrentPosition(0);
      
      console.log("✅ generateNewWord: Nové slovo úspěšně nastaveno:", {
        word: validWord.word,
        displayWord: validWord.displayWord,
        positions: validWord.positions,
        letters: validWord.letters
      });
    } catch (error) {
      console.error("❌ generateNewWord: Chyba při generování nového slova:", error);
    }
  }, [selectedGroups]);

  // Generate initial word when groups are selected
  useEffect(() => {
    if (selectedGroups.length > 0 && !currentWord) {
      console.log("🚀 useWordProblem: Generuji první slovo pro vybrané skupiny");
      generateNewWord();
    }
  }, [selectedGroups, currentWord, generateNewWord]);

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

    // Show animation with improved state management
    console.log("🎬 handleAnswer: Starting animation sequence");
    setLastAnswerCorrect(isCorrect);
    setShowAnimation(true);

    // Enhanced animation timing with proper cleanup
    const animationDuration = 2000;
    const hideTimeout = setTimeout(() => {
      console.log("🎬 handleAnswer: Hiding animation after timeout");
      setShowAnimation(false);
      
      // Reset animation state after hiding
      setTimeout(() => {
        setLastAnswerCorrect(null);
      }, 100);
    }, animationDuration);

    // Posunout na další pozici nebo další slovo
    const nextPosition = currentPosition + 1;
    
    if (nextPosition >= missingPositions.length) {
      // Hotovo s tímto slovem - generovat nové
      console.log("🎯 handleAnswer: Slovo dokončeno, generuji nové za 1.8s");
      setTimeout(() => {
        generateNewWord();
      }, 1800); // Slightly shorter to prevent overlap with animation
    } else {
      // Pokračovat na další pozici ve stejném slově
      setCurrentPosition(nextPosition);
      console.log("➡️ handleAnswer: Pokračuji na pozici:", nextPosition);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      clearTimeout(hideTimeout);
    };
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
