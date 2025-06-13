
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomGameControls } from "./math/CustomGameControls";
import DifficultyDialog from "./math/DifficultyDialog";
import ProblemDialog from "./math/ProblemDialog";
import DetailedErrorsDialog from "./math/DetailedErrorsDialog";
import { FunGraphics } from "./spelling/FunGraphics";
import { useMathGame } from "@/hooks/math/useMathGame";
import { useAuth } from "@/hooks/useAuth";
import { useUserTheme } from "@/hooks/useUserTheme";
import { SuccessParticles, ErrorParticles } from "@/components/ui/advanced-particle-system";
import { GlassCard, GlassDialog } from "@/components/ui/glass-morphism";
import { FloatingIcon, HoverScale } from "@/components/ui/microanimations";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";

const MathPractice = () => {
  const { authState } = useAuth();
  const { theme, getCSSVariables } = useUserTheme(authState.user?.id);
  
  const {
    currentProblem,
    userAnswer,
    correctAnswers,
    wrongAnswers,
    showProblem,
    showDifficultyDialog,
    lastAnswerCorrect,
    showAnimation,
    answers,
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    allowedOperations,
    difficultySet,
    
    setUserAnswer,
    setShowDifficultyDialog,
    checkAnswer,
    handleKeyPress,
    startNewGame,
    endGame,
    toggleOperation,
    setDifficulty,
  } = useMathGame();

  const {
    triggerCorrectFeedback,
    triggerIncorrectFeedback,
    triggerGameStartFeedback,
    triggerGameEndFeedback,
    triggerButtonFeedback
  } = useEnhancedMobileInteractions();

  const [showSuccessParticles, setShowSuccessParticles] = useState(false);
  const [showErrorParticles, setShowErrorParticles] = useState(false);
  
  // Trigger particle effects and enhanced feedback when answers are given
  useEffect(() => {
    if (lastAnswerCorrect === true && showAnimation) {
      setShowSuccessParticles(true);
      triggerCorrectFeedback();
      const timer = setTimeout(() => setShowSuccessParticles(false), 3000);
      return () => clearTimeout(timer);
    } else if (lastAnswerCorrect === false && showAnimation) {
      setShowErrorParticles(true);
      triggerIncorrectFeedback();
      const timer = setTimeout(() => setShowErrorParticles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerCorrect, showAnimation, triggerCorrectFeedback, triggerIncorrectFeedback]);

  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  // Enhanced game start with feedback
  const handleStartNewGame = () => {
    triggerGameStartFeedback();
    startNewGame();
  };

  // Enhanced game end with feedback
  const handleEndGame = () => {
    triggerGameEndFeedback();
    endGame();
  };

  // Enhanced button interactions
  const handleShowDifficultyDialog = () => {
    triggerButtonFeedback();
    setShowDifficultyDialog(true);
  };

  // Create difficulty settings object for compatibility
  const difficultySettings = {
    operations: {
      "+": allowedOperations.includes("+"),
      "-": allowedOperations.includes("-"),
      "*": allowedOperations.includes("*"),
      "/": allowedOperations.includes("/")
    },
    maxValue,
    maxMultiplyValue,
    maxDivideValue
  };

  return (
    <div className="space-y-4 relative min-h-screen" style={getCSSVariables}>
      {/* Background glass effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 -z-10" />
      
      {/* Enhanced particle effects */}
      <SuccessParticles trigger={showSuccessParticles} />
      <ErrorParticles trigger={showErrorParticles} />
      
      {/* Fun Graphics Component - moved outside dialogs for visibility with higher z-index */}
      <div className="z-[9999]">
        {showAnimation && (
          <FunGraphics isCorrect={lastAnswerCorrect} showAnimation={showAnimation} />
        )}
      </div>
      
      {/* Enhanced header with floating animation */}
      <FloatingIcon className="text-center">
        <h1 
          className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          style={{ color: theme.primaryColor }}
        >
          Procvičování matematiky {theme.avatar}
        </h1>
      </FloatingIcon>

      {/* Glass morphism game controls */}
      <HoverScale>
        <GlassCard className="hover:bg-white/25 transition-all duration-500">
          <CustomGameControls 
            onShowDifficultyDialog={handleShowDifficultyDialog}
            onStartGame={handleStartNewGame}
            difficultySettings={difficultySettings}
          />
        </GlassCard>
      </HoverScale>

      {/* Enhanced Difficulty Settings Dialog with glass morphism */}
      <DifficultyDialog
        open={showDifficultyDialog}
        onOpenChange={setShowDifficultyDialog}
        maxValue={maxValue}
        maxMultiplyValue={maxMultiplyValue}
        maxDivideValue={maxDivideValue}
        setMaxValue={() => {}} // These will be handled by the dialog internally
        setMaxMultiplyValue={() => {}}
        setMaxDivideValue={() => {}}
        allowedOperations={allowedOperations}
        toggleOperation={toggleOperation}
        setDifficulty={setDifficulty}
      />

      {/* Math Problem Dialog */}
      <ProblemDialog
        open={showProblem}
        onOpenChange={(open) => {
          if (!open) handleEndGame();
        }}
        currentProblem={currentProblem}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        handleKeyPress={handleKeyPress}
        checkAnswer={checkAnswer}
        endGame={handleEndGame}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        totalAnswers={totalAnswers}
        correctPercentage={correctPercentage}
      />
      
      {/* Detailed Errors Dialog - kept for potential future use from statistics */}
      <DetailedErrorsDialog 
        open={false}
        onOpenChange={() => {}}
        answers={answers}
      />
    </div>
  );
};

export default MathPractice;
