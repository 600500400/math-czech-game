import { useState, useCallback } from "react";
import { DictionaryGameState, DictionaryAnswer, DictionarySource } from "@/types/dictionaryTypes";
import { useDictionaryWords } from "./useDictionaryWords";
import { useDictionaryAnswers } from "./useDictionaryAnswers";
import { useDictionaryStatistics } from "./useDictionaryStatistics";
import { useGamification } from "@/hooks/gamification/useGamification";
import { toast } from "sonner";

export const useDictionaryGame = (userId: string | null) => {
  const effectiveUserId = userId || 'local_user';
  const { words, personalWords, schoolWords, getWordsBySource } = useDictionaryWords(effectiveUserId);
  const { addDictionaryAnswer } = useDictionaryAnswers(effectiveUserId);
  const { saveStatistics } = useDictionaryStatistics(effectiveUserId);
  const { processGameCompletion } = useGamification();

  const [gameState, setGameState] = useState<DictionaryGameState>({
    currentWord: null,
    userAnswer: "",
    showAnswer: false,
    gameStarted: false,
    mode: 'simple',
    direction: 'en_to_cz',
    source: 'personal',
    correctAnswers: 0,
    wrongAnswers: 0,
    showStatsDialog: false,
    answers: [],
    gameStartTime: null,
    shuffledWords: [],
    currentIndex: 0,
    totalWords: 0,
    showSentences: true,
  });

  const shuffleArray = (arr: any[]) => [...arr].sort(() => Math.random() - 0.5);

  const startGame = useCallback(() => {
    const activeWords = getWordsBySource(gameState.source);
    if (!activeWords || activeWords.length === 0) {
      toast.error("V této kategorii nemáte žádná slovíčka");
      return;
    }

    const deck = shuffleArray(activeWords);

    setGameState(prev => ({
      ...prev,
      currentWord: deck[0],
      shuffledWords: deck,
      currentIndex: 0,
      totalWords: deck.length,
      gameStarted: true,
      userAnswer: "",
      showAnswer: false,
      correctAnswers: 0,
      wrongAnswers: 0,
      answers: [],
      gameStartTime: Date.now(),
    }));
  }, [gameState.source, getWordsBySource]);

  const endGame = useCallback(() => {
    if (gameState.correctAnswers + gameState.wrongAnswers > 0) {
      const gameDuration = gameState.gameStartTime 
        ? Math.floor((Date.now() - gameState.gameStartTime) / 1000)
        : 0;

      saveStatistics({
        correct_answers: gameState.correctAnswers,
        wrong_answers: gameState.wrongAnswers,
        mode: gameState.mode,
        direction: gameState.direction,
        game_duration: gameDuration,
      });

      // Award XP, streaks, and check achievements for dictionary practice!
      processGameCompletion({
        subject: 'spelling',
        correct_answers: gameState.correctAnswers,
        wrong_answers: gameState.wrongAnswers,
        perfect_game: gameState.wrongAnswers === 0 && gameState.correctAnswers >= 5,
        game_duration: gameDuration,
      });

      setGameState(prev => ({
        ...prev,
        showStatsDialog: true,
      }));
    }

    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      currentWord: null,
      shuffledWords: [],
      currentIndex: 0,
      totalWords: 0,
    }));
  }, [gameState.correctAnswers, gameState.wrongAnswers, gameState.mode, gameState.direction, gameState.gameStartTime, saveStatistics, processGameCompletion]);

  const nextWord = useCallback(() => {
    setGameState(prev => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.totalWords) {
        // End game if deck is finished
        setTimeout(() => endGame(), 0);
        return prev;
      }
      return {
        ...prev,
        currentWord: prev.shuffledWords[nextIndex],
        currentIndex: nextIndex,
        userAnswer: "",
        showAnswer: false,
      };
    });
  }, [endGame]);

  const shuffleDeck = useCallback(() => {
    const activeWords = getWordsBySource(gameState.source);
    if (!activeWords || activeWords.length === 0) return;
    const deck = shuffleArray(activeWords);
    setGameState(prev => ({
      ...prev,
      shuffledWords: deck,
      currentWord: deck[0],
      currentIndex: 0,
      totalWords: deck.length,
      userAnswer: "",
      showAnswer: false,
      correctAnswers: 0,
      wrongAnswers: 0,
      answers: [],
      gameStartTime: Date.now(),
    }));
  }, [gameState.source, getWordsBySource]);

  const handleSimpleAnswer = useCallback((isCorrect: boolean) => {
    if (!gameState.currentWord) return;

    const answer: Omit<DictionaryAnswer, 'id' | 'created_at'> = {
      user_id: effectiveUserId,
      word_id: gameState.currentWord.id,
      english_word: gameState.currentWord.english_word,
      czech_translation: gameState.currentWord.czech_translation,
      user_answer: isCorrect ? "Know" : "Don't Know",
      is_correct: isCorrect,
      mode: gameState.mode,
      direction: gameState.direction,
    };

    addDictionaryAnswer(answer);

    setGameState(prev => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
      answers: [...prev.answers, answer as DictionaryAnswer],
      showAnswer: true,
    }));

    // Auto proceed to next word after 1.5 seconds
    setTimeout(() => {
      nextWord();
    }, 1500);
  }, [gameState.currentWord, gameState.mode, gameState.direction, effectiveUserId, addDictionaryAnswer, nextWord]);

  const handleAdvancedAnswer = useCallback(() => {
    if (!gameState.currentWord || !gameState.userAnswer.trim()) return;

    const correctAnswer = gameState.direction === 'en_to_cz' 
      ? gameState.currentWord.czech_translation 
      : gameState.currentWord.english_word;

    const isCorrect = gameState.userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    const answer: Omit<DictionaryAnswer, 'id' | 'created_at'> = {
      user_id: effectiveUserId,
      word_id: gameState.currentWord.id,
      english_word: gameState.currentWord.english_word,
      czech_translation: gameState.currentWord.czech_translation,
      user_answer: gameState.userAnswer.trim(),
      is_correct: isCorrect,
      mode: gameState.mode,
      direction: gameState.direction,
    };

    addDictionaryAnswer(answer);

    setGameState(prev => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
      answers: [...prev.answers, answer as DictionaryAnswer],
      showAnswer: true,
    }));

    // Auto proceed to next word after 2 seconds
    setTimeout(() => {
      nextWord();
    }, 2000);
  }, [gameState.currentWord, gameState.userAnswer, gameState.mode, gameState.direction, effectiveUserId, addDictionaryAnswer, nextWord]);


  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentWord: null,
      userAnswer: "",
      showAnswer: false,
      gameStarted: false,
      correctAnswers: 0,
      wrongAnswers: 0,
      showStatsDialog: false,
      answers: [],
      gameStartTime: null,
      shuffledWords: [],
      currentIndex: 0,
      totalWords: 0,
    }));
  }, []);

  const setMode = useCallback((mode: 'simple' | 'advanced') => {
    setGameState(prev => ({ ...prev, mode }));
  }, []);

  const setDirection = useCallback((direction: 'en_to_cz' | 'cz_to_en') => {
    setGameState(prev => ({ ...prev, direction }));
  }, []);

  const setUserAnswer = useCallback((answer: string) => {
    setGameState(prev => ({ ...prev, userAnswer: answer }));
  }, []);

  const setSource = useCallback((source: DictionarySource) => {
    setGameState(prev => ({ ...prev, source }));
  }, []);

  return {
    ...gameState,
    startGame,
    nextWord,
    endGame,
    resetGame,
    handleSimpleAnswer,
    handleAdvancedAnswer,
    setMode,
    setDirection,
    setSource,
    personalWordsCount: personalWords.length,
    schoolWordsCount: schoolWords.length,
    totalWordsCount: words.length,
    setUserAnswer,
    setShowStatsDialog,
    setShowSentences,
    shuffleDeck,
  };
};