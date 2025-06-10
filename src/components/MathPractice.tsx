
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomGameControls } from "./math/CustomGameControls";
import { DifficultyDialog } from "./math/DifficultyDialog";
import { ProblemDialog } from "./math/ProblemDialog";
import { DetailedErrorsDialog } from "./math/DetailedErrorsDialog";
import { FunGraphics } from "./spelling/FunGraphics";
import { useMathGame } from "@/hooks/math/useMathGame";
import { useAuth } from "@/hooks/useAuth";
import { useUserTheme } from "@/hooks/useUserTheme";
import { ConfettiExplosion } from "@/components/ui/confetti-explosion";

const MathPractice = () => {
  const { authState } = useAuth();
  const { theme, getCSSVariables } = useUserTheme(authState.user?.id);
  
  const {
    currentProblem,
    userAnswer,
    correctAnswers,
    wrongAnswers,
    totalProblems,
    showProblem,
    showDifficultyDialog,
    showDetailedErrors,
    isAnswerCorrect,
    showAnimation,
    lastAnswerCorrect,
    answers,
    difficultySettings,
    errorsByOperation,
    
    setUserAnswer,
    setShowDifficultyDialog,
    setShowDetailedErrors,
    handleAnswerSubmit,
    handleStartGame,
    handleEndGame,
    updateDifficultySettings
  } = useMathGame();

  const [showConfetti, setShowConfetti] = useState(false);
  
  // Trigger confetti when correct answer is given
  useEffect(() => {
    if (lastAnswerCorrect === true && showAnimation) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerCorrect, showAnimation]);

  const totalAnswers = correctAnswers + wrongAnswers;
  const correctPercentage = totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0;

  return (
    <div className="space-y-4 relative" style={getCSSVariables}>
      {/* Fun Graphics Component - moved outside dialogs for visibility with higher z-index */}
      <div className="z-[9999]">
        {showAnimation && (
          <FunGraphics isCorrect={lastAnswerCorrect} showAnimation={showAnimation} />
        )}
      </div>
      
      {/* Confetti effect when answers are correct - with high z-index */}
      <div className="z-[9999] relative">
        <ConfettiExplosion 
          trigger={showConfetti} 
          particleCount={30}
          duration={2000}
          colors={[theme.primaryColor, theme.secondaryColor, theme.accentColor, '#FFC700', '#FF0000']}
        />
      </div>
      
      <h1 
        className="text-3xl font-bold text-center"
        style={{ color: theme.primaryColor }}
      >
        Procvičování matematiky {theme.avatar}
      </h1>

      <CustomGameControls 
        onShowDifficultyDialog={() => setShowDifficultyDialog(true)}
        onStartGame={handleStartGame}
        onShowDetailedErrors={() => setShowDetailedErrors(true)}
        hasDetailedErrors={answers.length > 0}
        difficultySettings={difficultySettings}
      />

      {/* Difficulty Settings Dialog */}
      <DifficultyDialog
        open={showDifficultyDialog}
        onOpenChange={setShowDifficultyDialog}
        difficultySettings={difficultySettings}
        onSave={updateDifficultySettings}
      />

      {/* Math Problem Dialog */}
      <ProblemDialog
        open={showProblem}
        onOpenChange={(open) => {
          if (!open) handleEndGame();
        }}
        problem={currentProblem}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        onSubmit={handleAnswerSubmit}
        onEndGame={handleEndGame}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        isAnswerCorrect={isAnswerCorrect}
      />
      
      {/* Detailed Errors Dialog */}
      <DetailedErrorsDialog 
        open={showDetailedErrors}
        onOpenChange={setShowDetailedErrors}
        answers={answers}
        errorsByOperation={errorsByOperation}
      />
    </div>
  );
};

export default MathPractice;
