
import { useState, useCallback } from "react";
import { spellingGroups } from "@/data/spellingData";

interface UseWordProblemProps {
  selectedGroups: string[];
  onCorrectAnswer: () => void;
  onWrongAnswer: () => void;
  showAnimation: boolean;
  setLastAnswerCorrect: (isCorrect: boolean | null) => void;
  setShowAnimation: (show: boolean) => void;
}

export function useWordProblem({
  selectedGroups,
  onCorrectAnswer,
  onWrongAnswer,
  showAnimation,
  setLastAnswerCorrect,
  setShowAnimation
}: UseWordProblemProps) {
  // State for the current word
  const [currentWord, setCurrentWord] = useState("");
  const [displayedWord, setDisplayedWord] = useState("");
  const [wordGroup, setWordGroup] = useState("");
  const [isPhrase, setIsPhrase] = useState(false);
  
  // State for positions with i/y in the word
  const [missingPositions, setMissingPositions] = useState<number[]>([]);
  const [correctLetters, setCorrectLetters] = useState<string[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);

  // Generate a problem from selected groups
  const generateProblem = useCallback((groups: string[]) => {
    // Select a random group from the selected groups
    const groupName = groups[Math.floor(Math.random() * groups.length)];
    const group = spellingGroups.find(g => g.name === groupName);
    
    if (!group || !group.words || group.words.length === 0) {
      return { word: "", group: "", isPhrase: false };
    }

    // Select a random word from the group
    const wordObj = group.words[Math.floor(Math.random() * group.words.length)];
    const isPhrase = wordObj.word.includes(" ");
    
    return {
      word: wordObj.word,
      group: groupName,
      isPhrase
    };
  }, []);

  // Generate missing positions for a word
  const generateMissingPositions = useCallback((word: string) => {
    // Find all positions where 'i' or 'y' appear
    const positions: number[] = [];
    const letters: string[] = [];
    
    for (let i = 0; i < word.length; i++) {
      const lowerChar = word[i].toLowerCase();
      if (lowerChar === 'i' || lowerChar === 'y') {
        positions.push(i);
        letters.push(lowerChar);
      }
    }
    
    // Create a word with blanks at i/y positions
    let displayWord = '';
    for (let i = 0; i < word.length; i++) {
      if (positions.includes(i)) {
        displayWord += '_';
      } else {
        displayWord += word[i];
      }
    }
    
    return { displayWord, positions, letters };
  }, []);

  // Generate a new problem
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
  }, [generateMissingPositions, generateProblem, selectedGroups]);

  // Handle answer logic
  const handleAnswer = useCallback((answer: "i" | "y") => {
    const isCorrect = correctLetters[currentPosition] === answer;
    
    // Update animation state
    setLastAnswerCorrect(isCorrect);
    setShowAnimation(true);
    
    // After 2 seconds hide the animation
    setTimeout(() => {
      setShowAnimation(false);
    }, 2000);
    
    // Process the answer (correct or wrong)
    if (isCorrect) {
      onCorrectAnswer();
    } else {
      onWrongAnswer();
    }
    
    // Move to the next letter or problem
    setTimeout(() => {
      if (currentPosition + 1 < missingPositions.length) {
        // Next letter in the same word
        setCurrentPosition(prev => prev + 1);
      } else {
        // All letters in the word were answered, generate a new problem
        generateNewProblem();
      }
    }, 1000);
  }, [
    correctLetters, 
    currentPosition, 
    generateNewProblem, 
    missingPositions.length, 
    onCorrectAnswer, 
    onWrongAnswer, 
    setLastAnswerCorrect, 
    setShowAnimation
  ]);

  // Answer handlers for i and y
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
    handleAnswerY,
  };
}
