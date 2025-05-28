import { useCallback } from "react";
import { useGameState } from "./useGameState";
import { useDifficultySettings } from "./useDifficultySettings";
import { useProblemGenerator } from "./useProblemGenerator";
import { useAnswerHandler } from "./useAnswerHandler";
import { useGameFlow } from "./useGameFlow";
import { useAuth } from "../useAuth";
import { useStatistics } from "../useStatistics";
import { useDetailedAnswers } from "../statistics/useDetailedAnswers";

export const useMathGame = () => {
  const { authState } = useAuth();
  const userId = authState.user?.id || null;
  
  const { saveMathStatistics } = useStatistics(userId);
  const { addMathAnswer } = useDetailedAnswers(userId);
  
  const gameState = useGameState();
  const difficultySettings = useDifficultySettings();
  const problemGenerator = useProblemGenerator(difficultySettings);
  
  // Enhanced addAnswer function
  const enhancedAddAnswer = useCallback((answer: any) => {
    gameState.addAnswer(answer);
    addMathAnswer(answer);
  }, [gameState.addAnswer, addMathAnswer]);
  
  const answerHandler = useAnswerHandler({
    currentProblem: gameState.currentProblem,
    userAnswer: gameState.userAnswer,
    onCorrectAnswer: gameState.incrementCorrect,
    onWrongAnswer: gameState.incrementWrong,
    onShowAnimation: gameState.setShowAnimation,
    onSetLastAnswerCorrect: gameState.setLastAnswerCorrect,
    addAnswer: enhancedAddAnswer
  });
  
  const gameFlow = useGameFlow({
    gameState,
    difficultySettings,
    problemGenerator,
    answerHandler,
    saveMathStatistics,
    userId
  });

  return {
    ...gameState,
    ...difficultySettings,
    ...problemGenerator,
    ...answerHandler,
    ...gameFlow
  };
};
