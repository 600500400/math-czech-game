
import { GroupSelectionDialog } from "./spelling/GroupSelectionDialog";
import { WordProblemDialog } from "./spelling/WordProblemDialog";
import { StatisticsDialog } from "./spelling/StatisticsDialog";
import { FunGraphics } from "./spelling/FunGraphics";
import { GameControls } from "./spelling/GameControls";
import { GameHeader } from "./spelling/GameHeader";
import { useSpellingGame } from "@/hooks/useSpellingGame";
import { spellingGroups } from "@/data/spellingData";
import { ConfettiExplosion } from "@/components/ui/confetti-explosion";
import { useState, useEffect } from "react";

const SpellingPractice = () => {
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
    
    setShowGroupDialog,
    setShowStatsDialog,
    toggleGroup,
    setGroups,
    selectAll,
    deselectAll,
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

  return (
    <div className="space-y-4 relative">
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
          colors={['#FFC700', '#FF0000', '#2E3191', '#41D3BD', '#FB5607']}
        />
      </div>
      
      <GameHeader 
        problemCount={problemCount}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
      />

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
        selectAll={selectAll}
        deselectAll={deselectAll}
      />

      {/* Word Problem Dialog */}
      <WordProblemDialog
        open={showProblem}
        onOpenChange={(open) => {
          if (!open) endGame();
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
        onEndGame={endGame}
      />
      
      {/* Statistics Dialog */}
      <StatisticsDialog 
        open={showStatsDialog}
        onOpenChange={setShowStatsDialog}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        totalAnswers={totalAnswers}
      />
    </div>
  );
};

export default SpellingPractice;
