
import { useState, useEffect } from "react";
import { MathStatistics, SpellingStatistics } from "@/types/authTypes";

import { logger } from "@/utils/logger";
export const useGuestStatistics = (userId: string | null) => {
  // Všichni uživatelé nyní používají databázi - guest mode již nepotřebujeme
  const [isGuestMode, setIsGuestMode] = useState(false);

  useEffect(() => {
    // Všichni uživatelé používají databázi
    setIsGuestMode(false);
    logger.log(`useGuestStatistics - Uživatel ${userId} používá databázi`);
  }, [userId]);

  // Funkce pro ukládání math statistik do localStorage (pouze jako záloha pro offline režim)
  const saveMathStatsToLocal = (stats: {
    correctAnswers: number;
    wrongAnswers: number;
    operation: string;
    difficultyLevel: any;
    gameDuration?: number;
  }) => {
    if (!userId) return;
    
    const storageKey = `mathStats_backup_${userId}`;
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
    
    logger.log(`Math statistiky uloženy lokálně jako záloha pro ${userId}:`, newStat);
  };

  // Funkce pro ukládání spelling statistik do localStorage (pouze jako záloha pro offline režim)
  const saveSpellingStatsToLocal = (stats: {
    correctAnswers: number;
    wrongAnswers: number;
    wordGroup: string;
    gameDuration?: number;
    difficulty?: any;
  }) => {
    if (!userId) return;
    
    const storageKey = `spellingStats_backup_${userId}`;
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
    
    logger.log(`Spelling statistiky uloženy lokálně jako záloha pro ${userId}:`, newStat);
  };

  // Funkce pro načtení math statistik z localStorage (záloha)
  const loadMathStatsFromLocal = (): MathStatistics[] => {
    if (!userId) return [];
    
    const storageKey = `mathStats_backup_${userId}`;
    const existing = localStorage.getItem(storageKey);
    
    try {
      const stats = existing ? JSON.parse(existing) : [];
      logger.log(`Načítám záložní math statistiky pro ${userId}:`, stats);
      return stats;
    } catch (e) {
      console.error("Chyba při načítání lokálních math statistik:", e);
      return [];
    }
  };

  // Funkce pro načtení spelling statistik z localStorage (záloha)
  const loadSpellingStatsFromLocal = (): SpellingStatistics[] => {
    if (!userId) return [];
    
    const storageKey = `spellingStats_backup_${userId}`;
    const existing = localStorage.getItem(storageKey);
    
    try {
      const stats = existing ? JSON.parse(existing) : [];
      logger.log(`Načítám záložní spelling statistiky pro ${userId}:`, stats);
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
