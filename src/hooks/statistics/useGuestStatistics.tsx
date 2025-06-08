
import { useState, useEffect } from "react";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

export const useGuestStatistics = (userId: string | null) => {
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    // Zkontrolujeme jestli je uživatel lokální (všechny naše identity: gabi, misa, ada, host, rodic)
    const localUser = localStorage.getItem('localUser');
    if (localUser && userId) {
      try {
        const user = JSON.parse(localUser);
        // Všechny naše přednastavené identity jsou považovány za guest mode
        const guestIds = ['gabi', 'misa', 'ada', 'host', 'rodic'];
        setIsGuestMode(guestIds.includes(user.id) && user.id === userId);
        console.log(`useGuestStatistics - Uživatel ${userId} je v guest režimu:`, guestIds.includes(user.id) && user.id === userId);
      } catch (e) {
        setIsGuestMode(false);
      }
    } else {
      setIsGuestMode(false);
    }
  }, [userId]);

  // Funkce pro ukládání math statistik do localStorage
  const saveMathStatsToLocal = (stats: {
    correctAnswers: number;
    wrongAnswers: number;
    operation: string;
    difficultyLevel: any;
    gameDuration?: number;
  }) => {
    if (!userId) return;
    
    const storageKey = `mathStats_${userId}`;
    const existing = localStorage.getItem(storageKey);
    let allStats = [];
    
    try {
      allStats = existing ? JSON.parse(existing) : [];
    } catch (e) {
      allStats = [];
    }
    
    const newStat = {
      id: Date.now().toString(),
      user_id: userId,
      correct_answers: stats.correctAnswers,
      wrong_answers: stats.wrongAnswers,
      operation: stats.operation,
      difficulty_level: stats.difficultyLevel,
      game_duration: stats.gameDuration || 0,
      created_at: new Date().toISOString()
    };
    
    allStats.push(newStat);
    localStorage.setItem(storageKey, JSON.stringify(allStats));
    
    console.log(`Guest math statistiky uloženy lokálně pro uživatele ${userId}:`, newStat);
  };

  // Funkce pro ukládání spelling statistik do localStorage
  const saveSpellingStatsToLocal = (stats: {
    correctAnswers: number;
    wrongAnswers: number;
    wordGroup: string;
    gameDuration?: number;
    difficulty?: any;
  }) => {
    if (!userId) return;
    
    const storageKey = `spellingStats_${userId}`;
    const existing = localStorage.getItem(storageKey);
    let allStats = [];
    
    try {
      allStats = existing ? JSON.parse(existing) : [];
    } catch (e) {
      allStats = [];
    }
    
    const newStat = {
      id: Date.now().toString(),
      user_id: userId,
      correct_answers: stats.correctAnswers,
      wrong_answers: stats.wrongAnswers,
      word_group: stats.wordGroup,
      game_duration: stats.gameDuration || 0,
      difficulty_level: stats.difficulty || { selectedGroups: stats.wordGroup.split(','), wordCount: stats.correctAnswers + stats.wrongAnswers },
      created_at: new Date().toISOString()
    };
    
    allStats.push(newStat);
    localStorage.setItem(storageKey, JSON.stringify(allStats));
    
    console.log(`Guest spelling statistiky uloženy lokálně pro uživatele ${userId}:`, newStat);
  };

  // Funkce pro načtení math statistik z localStorage
  const loadMathStatsFromLocal = (): MathStatistics[] => {
    if (!userId) return [];
    
    const storageKey = `mathStats_${userId}`;
    const existing = localStorage.getItem(storageKey);
    
    try {
      const stats = existing ? JSON.parse(existing) : [];
      console.log(`useGuestStatistics - načítám math statistiky pro ${userId}:`, stats);
      return stats;
    } catch (e) {
      console.error("Chyba při načítání lokálních math statistik:", e);
      return [];
    }
  };

  // Funkce pro načtení spelling statistik z localStorage
  const loadSpellingStatsFromLocal = (): SpellingStatistics[] => {
    if (!userId) return [];
    
    const storageKey = `spellingStats_${userId}`;
    const existing = localStorage.getItem(storageKey);
    
    try {
      const stats = existing ? JSON.parse(existing) : [];
      console.log(`useGuestStatistics - načítám spelling statistiky pro ${userId}:`, stats);
      return stats;
    } catch (e) {
      console.error("Chyba při načítání lokálních spelling statistik:", e);
      return [];
    }
  };

  return {
    isGuestMode,
    saveMathStatsToLocal,
    saveSpellingStatsToLocal,
    loadMathStatsFromLocal,
    loadSpellingStatsFromLocal
  };
};
