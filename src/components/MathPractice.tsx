
import { useEffect } from "react";
import { MathProblemDialog } from "./math/MathProblemDialog";
import DifficultyDialog from "./math/DifficultyDialog";
import { StatisticsDialog } from "./math/StatisticsDialog";
import { MathPracticeHeader } from "./math/MathPracticeHeader";
import { MathPracticeControls } from "./math/MathPracticeControls";
import { MathPracticeStats } from "./math/MathPracticeStats";
import { useMathGame } from "@/hooks/math/useMathGame";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";

const MathPractice = () => {
  const { theme, getCSSVariables, getGradientClasses } = useUserTheme();
  const mathGame = useMathGame();
  
  const {
    triggerCorrectFeedback,
    triggerIncorrectFeedback,
    triggerGameStartFeedback,
    triggerGameEndFeedback,
    triggerButtonFeedback
  } = useEnhancedMobileInteractions();

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
    mathGame.startNewGame();
  };

  // Enhanced game end with feedback
  const handleEndGame = () => {
    triggerGameEndFeedback();
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

      {/* Game statistics display */}
      <MathPracticeStats 
        correctAnswers={mathGame.correctAnswers}
        wrongAnswers={mathGame.wrongAnswers}
      />

      {/* Glass morphism game controls */}
      <MathPracticeControls 
        allowedOperations={mathGame.allowedOperations}
        maxValue={mathGame.maxValue}
        maxMultiplyValue={mathGame.maxMultiplyValue}
        maxDivideValue={mathGame.maxDivideValue}
        onShowDifficultyDialog={handleShowDifficultyDialog}
        onStartNewGame={handleStartNewGame}
        toggleOperation={mathGame.toggleOperation}
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
