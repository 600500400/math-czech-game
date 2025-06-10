
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
import { ConfettiExplosion } from "@/components/ui/confetti-explosion";

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

  const [showConfetti, setShowConfetti] = useState(false);
  const [showDetailedErrors, setShowDetailedErrors] = useState(false);
  
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
        onStartGame={startNewGame}
        onShowDetailedErrors={() => setShowDetailedErrors(true)}
        hasDetailedErrors={answers.length > 0}
        difficultySettings={difficultySettings}
      />

      {/* Difficulty Settings Dialog */}
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
          if (!open) endGame();
        }}
        currentProblem={currentProblem}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        handleKeyPress={handleKeyPress}
        checkAnswer={checkAnswer}
        endGame={endGame}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        totalAnswers={totalAnswers}
        correctPercentage={correctPercentage}
      />
      
      {/* Detailed Errors Dialog */}
      <DetailedErrorsDialog 
        open={showDetailedErrors}
        onOpenChange={setShowDetailedErrors}
        answers={answers}
      />
    </div>
  );
};

export default MathPractice;
