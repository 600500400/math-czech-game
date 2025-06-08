
import { useState, useEffect } from "react";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

export const useGuestStatistics = (userId: string | null) => {
  // Změníme výchozí hodnotu na false - už nebudeme používat guest mode pro lokální uživatele
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    // Pro lokální uživatele už nepoužíváme guest mode - všechno jde do databáze
    setIsGuestMode(false);
    console.log(`useGuestStatistics - Všichni uživatelé včetně ${userId} používají databázi`);
  }, [userId]);

  // Funkce pro ukládání math statistik do localStorage (backup - jen pro případ offline)
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
    
    console.log(`Math statistiky uloženy lokálně jako backup pro uživatele ${userId}:`, newStat);
  };

  // Funkce pro ukládání spelling statistik do localStorage (backup - jen pro případ offline)
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
    
    console.log(`Spelling statistiky uloženy lokálně jako backup pro uživatele ${userId}:`, newStat);
  };

  // Funkce pro načtení math statistik z localStorage (backup)
  const loadMathStatsFromLocal = (): MathStatistics[] => {
    if (!userId) return [];
    
    const storageKey = `mathStats_${userId}`;
    const existing = localStorage.getItem(storageKey);
    
    try {
      const stats = existing ? JSON.parse(existing) : [];
      console.log(`Načítám backup math statistiky pro ${userId}:`, stats);
      return stats;
    } catch (e) {
      console.error("Chyba při načítání lokálních math statistik:", e);
      return [];
    }
  };

  // Funkce pro načtení spelling statistik z localStorage (backup)
  const loadSpellingStatsFromLocal = (): SpellingStatistics[] => {
    if (!userId) return [];
    
    const storageKey = `spellingStats_${userId}`;
    const existing = localStorage.getItem(storageKey);
    
    try {
      const stats = existing ? JSON.parse(existing) : [];
      console.log(`Načítám backup spelling statistiky pro ${userId}:`, stats);
      return stats;
    } catch (e) {
      console.error("Chyba při načítání lokálních spelling statistik:", e);
      return [];
    }
  };

  return {
    isGuestMode, // Vždy false - všichni používají databázi
    saveMathStatsToLocal,
    saveSpellingStatsToLocal,
    loadMathStatsFromLocal,
    loadSpellingStatsFromLocal
  };
};
