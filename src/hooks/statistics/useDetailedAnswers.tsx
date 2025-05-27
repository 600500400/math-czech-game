
import { useState, useEffect } from "react";
import { MathAnswer } from "@/types/mathTypes";
import { SpellingAnswer } from "@/types/spellingTypes";

export const useDetailedAnswers = (userId: string | null) => {
  const [mathAnswers, setMathAnswers] = useState<MathAnswer[]>([]);
  const [spellingAnswers, setSpellingAnswers] = useState<SpellingAnswer[]>([]);

  // Load answers from localStorage when userId changes
  useEffect(() => {
    if (userId) {
      const mathKey = `mathAnswers_${userId}`;
      const spellingKey = `spellingAnswers_${userId}`;
      
      try {
        const storedMathAnswers = localStorage.getItem(mathKey);
        const storedSpellingAnswers = localStorage.getItem(spellingKey);
        
        const mathData = storedMathAnswers ? JSON.parse(storedMathAnswers) : [];
        const spellingData = storedSpellingAnswers ? JSON.parse(storedSpellingAnswers) : [];
        
        console.log("useDetailedAnswers - načítání detailních odpovědí pro uživatele:", userId);
        console.log("useDetailedAnswers - matematické odpovědi:", mathData);
        console.log("useDetailedAnswers - pravopisné odpovědi:", spellingData);
        
        setMathAnswers(mathData);
        setSpellingAnswers(spellingData);
      } catch (error) {
        console.error("Error loading detailed answers:", error);
        setMathAnswers([]);
        setSpellingAnswers([]);
      }
    }
  }, [userId]);

  // Save math answers to localStorage
  const saveMathAnswers = (answers: MathAnswer[]) => {
    if (userId) {
      const mathKey = `mathAnswers_${userId}`;
      try {
        localStorage.setItem(mathKey, JSON.stringify(answers));
        setMathAnswers(answers);
        console.log("useDetailedAnswers - uloženy matematické odpovědi:", answers);
      } catch (error) {
        console.error("Error saving math answers:", error);
      }
    }
  };

  // Save spelling answers to localStorage
  const saveSpellingAnswers = (answers: SpellingAnswer[]) => {
    if (userId) {
      const spellingKey = `spellingAnswers_${userId}`;
      try {
        localStorage.setItem(spellingKey, JSON.stringify(answers));
        setSpellingAnswers(answers);
        console.log("useDetailedAnswers - uloženy pravopisné odpovědi:", answers);
      } catch (error) {
        console.error("Error saving spelling answers:", error);
      }
    }
  };

  // Add single math answer
  const addMathAnswer = (answer: MathAnswer) => {
    const newAnswers = [...mathAnswers, answer];
    saveMathAnswers(newAnswers);
  };

  // Add single spelling answer
  const addSpellingAnswer = (answer: SpellingAnswer) => {
    const newAnswers = [...spellingAnswers, answer];
    saveSpellingAnswers(newAnswers);
  };

  // Clear all answers for user
  const clearAllAnswers = () => {
    if (userId) {
      const mathKey = `mathAnswers_${userId}`;
      const spellingKey = `spellingAnswers_${userId}`;
      
      localStorage.removeItem(mathKey);
      localStorage.removeItem(spellingKey);
      
      setMathAnswers([]);
      setSpellingAnswers([]);
      
      console.log("useDetailedAnswers - vymazány všechny detailní odpovědi pro uživatele:", userId);
    }
  };

  console.log("useDetailedAnswers - aktuální stav:", {
    userId,
    mathAnswersCount: mathAnswers.length,
    spellingAnswersCount: spellingAnswers.length,
    mathWrongCount: mathAnswers.filter(a => !a.isCorrect).length,
    spellingWrongCount: spellingAnswers.filter(a => !a.isCorrect).length
  });

  return {
    mathAnswers,
    spellingAnswers,
    addMathAnswer,
    addSpellingAnswer,
    saveMathAnswers,
    saveSpellingAnswers,
    clearAllAnswers
  };
};
