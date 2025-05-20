
import { GroupSelectionDialog } from "./spelling/GroupSelectionDialog";
import { WordProblemDialog } from "./spelling/WordProblemDialog";
import { StatisticsDialog } from "./spelling/StatisticsDialog";
import { FunGraphics } from "./spelling/FunGraphics";
import { GameControls } from "./spelling/GameControls";
import { GameHeader } from "./spelling/GameHeader";
import { useSpellingGame } from "@/hooks/useSpellingGame";
import { spellingGroups } from "@/data/spellingData";

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
    startNewGame,
    handleAnswerI,
    handleAnswerY,
    endGame,
  } = useSpellingGame();

  const hasStats = correctAnswers > 0 || wrongAnswers > 0;

  return (
    <div className="space-y-4">
      <GameHeader 
        problemCount={problemCount}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
      />
      
      {/* Fun Graphics Component */}
      <FunGraphics isCorrect={lastAnswerCorrect} showAnimation={showAnimation} />

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
