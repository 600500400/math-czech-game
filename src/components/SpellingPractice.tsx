
import { GroupSelectionDialog } from "./spelling/GroupSelectionDialog";
import { WordProblemDialog } from "./spelling/WordProblemDialog";
import { StatisticsDialog } from "./spelling/StatisticsDialog";
import { FunGraphics } from "./spelling/FunGraphics";
import { GameControls } from "./spelling/GameControls";
import { useSpellingGame } from "@/hooks/spelling/useSpellingGame";
import { useAuth } from "@/hooks/useAuth";
import { useUserTheme } from "@/hooks/useUserTheme";
import { spellingGroups } from "@/data/spellingData";
import { SuccessParticles, ErrorParticles } from "@/components/ui/advanced-particle-system";
import { GlassCard } from "@/components/ui/glass-morphism";
import { FloatingIcon, HoverScale } from "@/components/ui/microanimations";
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

  const [showSuccessParticles, setShowSuccessParticles] = useState(false);
  const [showErrorParticles, setShowErrorParticles] = useState(false);
  
  // Trigger particle effects when answers are given
  useEffect(() => {
    if (lastAnswerCorrect === true && showAnimation) {
      setShowSuccessParticles(true);
      const timer = setTimeout(() => setShowSuccessParticles(false), 3000);
      return () => clearTimeout(timer);
    } else if (lastAnswerCorrect === false && showAnimation) {
      setShowErrorParticles(true);
      const timer = setTimeout(() => setShowErrorParticles(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastAnswerCorrect, showAnimation]);

  // Custom end game handler that doesn't show stats dialog automatically
  const handleEndGame = () => {
    endGame();
    // Remove automatic stats dialog display - user can still access it via button
  };

  return (
    <div className="space-y-4 relative min-h-screen" style={getCSSVariables}>
      {/* Background glass effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-50/50 to-blue-50/50 -z-10" />
      
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
          className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"
          style={{ color: theme.primaryColor }}
        >
          Procvičování vyjmenovaných slov {theme.avatar}
        </h1>
      </FloatingIcon>

      {/* Glass morphism game controls */}
      <HoverScale>
        <GlassCard className="hover:bg-white/25 transition-all duration-500">
          <GameControls 
            selectedGroupsCount={selectedGroups.length}
            onShowGroupDialog={() => setShowGroupDialog(true)}
            onStartGame={startNewGame}
          />
        </GlassCard>
      </HoverScale>

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
