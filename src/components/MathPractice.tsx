import { useEffect, useState } from "react";
import { MathProblemDialog } from "./math/MathProblemDialog";
import DifficultyDialog from "./math/DifficultyDialog";
import { StatisticsDialog } from "./math/StatisticsDialog";
import { MathPracticeHeader } from "./math/MathPracticeHeader";
import { MathPracticeControls } from "./math/MathPracticeControls";
import { GamificationStats } from "@/components/gamification/GamificationStats";
import { useMathGame } from "@/hooks/math/useMathGame";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/gamification/useGamification";

const MathPractice = () => {
  const { authState } = useAuth();
  const userId = authState.profile?.username?.toLowerCase() || 'host';
  const { theme, getCSSVariables, getGradientClasses } = useUserTheme(userId);
  const mathGame = useMathGame();
  const { leveling, streaks, processGameCompletion } = useGamification();

  const {
    triggerCorrectFeedback,
    triggerIncorrectFeedback,
    triggerGameStartFeedback,
    triggerGameEndFeedback,
    triggerButtonFeedback
  } = useEnhancedMobileInteractions({});

  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Simplified feedback effects
  useEffect(() => {
    if (mathGame.lastAnswerCorrect === true && mathGame.showAnimation) {
      triggerCorrectFeedback();
    } else if (mathGame.lastAnswerCorrect === false && mathGame.showAnimation) {
      triggerIncorrectFeedback();
    }
  }, [mathGame.lastAnswerCorrect, mathGame.showAnimation, triggerCorrectFeedback, triggerIncorrectFeedback]);

  // Enhanced game start with feedback
  const handleStartNewGame = () => {
    triggerGameStartFeedback();
    setGameStartTime(Date.now());
    mathGame.startNewGame();
  };

  // Enhanced game end with feedback
  const handleEndGame = async () => {
    triggerGameEndFeedback();
    
    if (authState.user && gameStartTime && (mathGame.correctAnswers > 0 || mathGame.wrongAnswers > 0)) {
      const gameDuration = Math.round((Date.now() - gameStartTime) / 1000);
      const perfectGame = mathGame.wrongAnswers === 0 && mathGame.correctAnswers >= 10;
      
      await processGameCompletion({
        correct_answers: mathGame.correctAnswers,
        wrong_answers: mathGame.wrongAnswers,
        game_duration: gameDuration,
        perfect_game: perfectGame,
        subject: 'math'
      });
    }

    setGameStartTime(null);
    mathGame.endGame();
  };

  // Enhanced button interactions
  const handleShowDifficultyDialog = () => {
    triggerButtonFeedback();
    mathGame.setShowDifficultyDialog(true);
  };

  return (
    <div className="space-y-4 relative min-h-screen" style={getCSSVariables}>
      {/* Background glass effect with theme support */}
      <div className={`fixed inset-0 bg-gradient-to-br ${getGradientClasses.background} -z-10`} />

      {/* Header with theme support */}
      <MathPracticeHeader 
        theme={theme}
        getGradientClasses={getGradientClasses}
      />

      {/* Gamification displays */}
      <GamificationStats
        authState={authState}
        leveling={leveling}
        streaks={streaks}
      />

      {/* Glass morphism game controls */}
      <MathPracticeControls 
        onShowDifficultyDialog={handleShowDifficultyDialog}
        onStartNewGame={handleStartNewGame}
      />

      {/* Math Problem Dialog */}
      <MathProblemDialog
        open={mathGame.showProblem}
        onOpenChange={mathGame.setShowProblem}
        problem={mathGame.currentProblem}
        userAnswer={mathGame.userAnswer}
        setUserAnswer={mathGame.setUserAnswer}
        checkAnswer={mathGame.checkAnswer}
        handleKeyPress={mathGame.handleKeyPress}
        onEndGame={handleEndGame}
        lastAnswerCorrect={mathGame.lastAnswerCorrect}
        showAnimation={mathGame.showAnimation}
      />

      {/* Difficulty Settings Dialog */}
      <DifficultyDialog
        open={mathGame.showDifficultyDialog}
        onOpenChange={mathGame.setShowDifficultyDialog}
        maxValue={mathGame.maxValue}
        maxMultiplyValue={mathGame.maxMultiplyValue}
        maxDivideValue={mathGame.maxDivideValue}
        allowedOperations={mathGame.allowedOperations}
        toggleOperation={mathGame.toggleOperation}
        setDifficulty={mathGame.setDifficulty}
      />

      {/* Statistics Dialog */}
      <StatisticsDialog
        open={mathGame.showStatsDialog}
        onOpenChange={mathGame.setShowStatsDialog}
        correctAnswers={mathGame.correctAnswers}
        wrongAnswers={mathGame.wrongAnswers}
        answers={mathGame.answers}
      />
    </div>
  );
};

export default MathPractice;
