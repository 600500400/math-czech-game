
import { useMathGame } from "@/hooks/math/useMathGame";
import { ConfettiExplosion } from "@/components/ui/confetti-explosion";
import { FunGraphics } from "./spelling/FunGraphics";
import GameControls from "./math/GameControls";
import DifficultyDialog from "./math/DifficultyDialog";
import ProblemDialog from "./math/ProblemDialog";
import StatisticsDialog from "./math/StatisticsDialog";

const MathPractice = () => {
  const {
    correctAnswers,
    wrongAnswers,
    problemCount,
    currentProblem,
    userAnswer,
    showProblem,
    showDifficultyDialog,
    showStatsDialog,
    maxValue,
    maxMultiplyValue,
    maxDivideValue,
    difficultySet,
    gameEnded,
    lastAnswerCorrect,
    showAnimation,
    showConfetti,
    totalAnswers,
    correctPercentage,
    allowedOperations,
    
    setUserAnswer,
    setShowDifficultyDialog,
    setShowStatsDialog,
    setMaxValue,
    setMaxMultiplyValue,
    setMaxDivideValue,
    setAllowedOperations,
    
    setDifficulty,
    toggleOperation,
    startNewGame,
    checkAnswer,
    endGame,
    resetGame,
    handleKeyPress,
  } = useMathGame();

  // Helper function that wraps the original toggleOperation with required parameters
  const handleToggleOperation = (operation) => {
    toggleOperation(operation);
  };

  // Helper function that wraps the original setDifficulty with required parameters
  const handleSetDifficulty = () => {
    setDifficulty();
  };

  return (
    <div className="space-y-4 relative">
      {/* Fun Graphics & Confetti Components - moved above dialogs for visibility */}
      {showAnimation && (
        <FunGraphics isCorrect={lastAnswerCorrect} showAnimation={showAnimation} />
      )}
      {showConfetti && <ConfettiExplosion particleCount={30} />}
      
      <h1 className="text-3xl font-bold text-center text-orange-500">Procvičování matematiky</h1>
      
      {/* Game Controls */}
      <GameControls 
        problemCount={problemCount}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        totalAnswers={totalAnswers}
        correctPercentage={correctPercentage}
        difficultySet={difficultySet}
        gameEnded={gameEnded}
        onSetDifficulty={() => setShowDifficultyDialog(true)}
        onStartGame={startNewGame}
        onShowStats={() => setShowStatsDialog(true)}
        onResetGame={resetGame}
      />

      {/* Difficulty Dialog */}
      <DifficultyDialog 
        open={showDifficultyDialog}
        onOpenChange={setShowDifficultyDialog}
        maxValue={maxValue}
        maxMultiplyValue={maxMultiplyValue}
        maxDivideValue={maxDivideValue}
        setMaxValue={setMaxValue}
        setMaxMultiplyValue={setMaxMultiplyValue}
        setMaxDivideValue={setMaxDivideValue}
        allowedOperations={allowedOperations}
        toggleOperation={handleToggleOperation}
        setDifficulty={handleSetDifficulty}
      />

      {/* Problem Dialog */}
      <ProblemDialog 
        open={showProblem}
        onOpenChange={(open) => !open && endGame()}
        currentProblem={currentProblem}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        handleKeyPress={handleKeyPress}
        checkAnswer={checkAnswer}
        endGame={endGame}
      />

      {/* Statistics Dialog */}
      <StatisticsDialog 
        open={showStatsDialog}
        onOpenChange={setShowStatsDialog}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        totalAnswers={totalAnswers}
        correctPercentage={correctPercentage}
      />
    </div>
  );
};

export default MathPractice;
