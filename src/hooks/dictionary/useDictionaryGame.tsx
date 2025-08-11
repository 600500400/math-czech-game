import { useState, useCallback } from "react";
import { DictionaryGameState, DictionaryAnswer } from "@/types/dictionaryTypes";
import { useDictionaryWords } from "./useDictionaryWords";
import { useDictionaryAnswers } from "./useDictionaryAnswers";
import { useDictionaryStatistics } from "./useDictionaryStatistics";
import { toast } from "sonner";

export const useDictionaryGame = (userId: string | null) => {
  const { getRandomWord } = useDictionaryWords(userId);
  const { addAnswer } = useDictionaryAnswers(userId);
  const { saveStatistics } = useDictionaryStatistics(userId);

  const [gameState, setGameState] = useState<DictionaryGameState>({
    currentWord: null,
    userAnswer: "",
    showAnswer: false,
    gameStarted: false,
    mode: 'simple',
    direction: 'en_to_cz',
    correctAnswers: 0,
    wrongAnswers: 0,
    showStatsDialog: false,
    answers: [],
    gameStartTime: null,
  });

  const startGame = useCallback(() => {
    const word = getRandomWord();
    if (!word) {
      toast.error("Žádná slovíčka k procvičování");
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentWord: word,
      gameStarted: true,
      userAnswer: "",
      showAnswer: false,
      gameStartTime: Date.now(),
    }));
  }, [getRandomWord]);

  const nextWord = useCallback(() => {
    const word = getRandomWord();
    if (!word) {
      endGame();
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentWord: word,
      userAnswer: "",
      showAnswer: false,
    }));
  }, [getRandomWord]);

  const handleSimpleAnswer = useCallback((isCorrect: boolean) => {
    if (!gameState.currentWord || !userId) return;

    const answer: Omit<DictionaryAnswer, 'id' | 'created_at'> = {
      user_id: userId,
      word_id: gameState.currentWord.id,
      english_word: gameState.currentWord.english_word,
      czech_translation: gameState.currentWord.czech_translation,
      user_answer: isCorrect ? "Know" : "Don't Know",
      is_correct: isCorrect,
      mode: gameState.mode,
      direction: gameState.direction,
    };

    addAnswer(answer);

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
  }, [gameState.currentWord, gameState.mode, gameState.direction, userId, addAnswer, nextWord]);

  const handleAdvancedAnswer = useCallback(() => {
    if (!gameState.currentWord || !userId || !gameState.userAnswer.trim()) return;

    const correctAnswer = gameState.direction === 'en_to_cz' 
      ? gameState.currentWord.czech_translation 
      : gameState.currentWord.english_word;

    const isCorrect = gameState.userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

    const answer: Omit<DictionaryAnswer, 'id' | 'created_at'> = {
      user_id: userId,
      word_id: gameState.currentWord.id,
      english_word: gameState.currentWord.english_word,
      czech_translation: gameState.currentWord.czech_translation,
      user_answer: gameState.userAnswer.trim(),
      is_correct: isCorrect,
      mode: gameState.mode,
      direction: gameState.direction,
    };

    addAnswer(answer);

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
  }, [gameState.currentWord, gameState.userAnswer, gameState.mode, gameState.direction, userId, addAnswer, nextWord]);

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

      setGameState(prev => ({
        ...prev,
        showStatsDialog: true,
      }));
    }

    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      currentWord: null,
    }));
  }, [gameState.correctAnswers, gameState.wrongAnswers, gameState.mode, gameState.direction, gameState.gameStartTime, saveStatistics]);

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

  const setShowStatsDialog = useCallback((show: boolean) => {
    setGameState(prev => ({ ...prev, showStatsDialog: show }));
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
    setUserAnswer,
    setShowStatsDialog,
  };
};