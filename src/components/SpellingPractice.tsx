
import { GroupSelectionDialog } from "./spelling/GroupSelectionDialog";
import { WordProblemDialog } from "./spelling/WordProblemDialog";
import { StatisticsDialog } from "./spelling/StatisticsDialog";
import { FunGraphics } from "./spelling/FunGraphics";
import { GameControls } from "./spelling/GameControls";
import { useSpellingGame } from "@/hooks/spelling/useSpellingGame";
import { useAuth } from "@/hooks/useAuth";
import { useUserTheme } from "@/hooks/useUserTheme";
import { spellingGroups } from "@/data/spellingData";
import { ConfettiExplosion } from "@/components/ui/confetti-explosion";
import { useState, useEffect } from "react";

const SpellingPractice = () => {
  const { authState } = useAuth();
  const { theme, getCSSVariables } = useUserTheme(authState.user?.id);
  
  const {
    correctAnswers,
    wrongAnswers,
    problemCount,
    currentWord,
    displayedWord,
    showProblem,
    showGroupDialog,
    showStatsDialog,
    selectedGroups,
    wordGroup,
    isPhrase,
    correctLetters,
    missingPositions,
    currentPosition,
    lastAnswerCorrect,
    showAnimation,
    totalAnswers,
    allSelected,
    answers,
    
    setShowGroupDialog,
    setShowStatsDialog,
    toggleGroup,
    setGroups,
    toggleAllGroups,
    startNewGame,
    handleAnswerI,
    handleAnswerY,
    endGame,
  } = useSpellingGame();

  const [showConfetti, setShowConfetti] = useState(false);
  
  // Trigger confetti when correct answer is given
  useEffect(() => {
    if (lastAnswerCorrect === true && showAnimation) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerCorrect, showAnimation]);

  const hasStats = correctAnswers > 0 || wrongAnswers > 0;

  // Custom end game handler that doesn't show stats dialog automatically
  const handleEndGame = () => {
    endGame();
    // Remove automatic stats dialog display - user can still access it via button
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
        Procvičování vyjmenovaných slov {theme.avatar}
      </h1>

      <GameControls 
        selectedGroupsCount={selectedGroups.length}
        hasStats={hasStats}
        onShowGroupDialog={() => setShowGroupDialog(true)}
        onStartGame={startNewGame}
        onShowStats={() => setShowStatsDialog(true)}
      />

      {/* Group Selection Dialog */}
      <GroupSelectionDialog
        open={showGroupDialog}
        onOpenChange={setShowGroupDialog}
        spellingGroups={spellingGroups}
        selectedGroups={selectedGroups}
        toggleGroup={toggleGroup}
        setGroups={setGroups}
        toggleAllGroups={toggleAllGroups}
        allSelected={allSelected}
      />

      {/* Word Problem Dialog with statistics */}
      <WordProblemDialog
        open={showProblem}
        onOpenChange={(open) => {
          if (!open) handleEndGame(); // Use custom handler
        }}
        displayedWord={displayedWord}
        currentWord={currentWord}
        isPhrase={isPhrase}
        wordGroup={wordGroup}
        missingPositions={missingPositions}
        correctLetters={correctLetters}
        currentPosition={currentPosition}
        onAnswerI={handleAnswerI}
        onAnswerY={handleAnswerY}
        onEndGame={handleEndGame} // Use custom handler
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
      />
      
      {/* Statistics Dialog with answers - only shown when manually requested */}
      <StatisticsDialog 
        open={showStatsDialog}
        onOpenChange={setShowStatsDialog}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        totalAnswers={totalAnswers}
        answers={answers}
      />
    </div>
  );
};

export default SpellingPractice;
