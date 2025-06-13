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
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";

const SpellingPractice = () => {
  const { authState } = useAuth();
  const { theme, getCSSVariables, getGradientClasses } = useUserTheme(authState.user?.id);
  
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
  const handleShowGroupDialog = () => {
    triggerButtonFeedback();
    setShowGroupDialog(true);
  };

  return (
    <div className="space-y-4 relative min-h-screen" style={getCSSVariables}>
      {/* Background glass effect with theme support */}
      <div className={`fixed inset-0 bg-gradient-to-br ${getGradientClasses.background} -z-10`} />
      
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
          className={`text-3xl font-bold bg-gradient-to-r ${getGradientClasses.primary} bg-clip-text text-transparent`}
        >
          Procvičování vyjmenovaných slov {theme.avatar}
        </h1>
      </FloatingIcon>

      {/* Glass morphism game controls */}
      <HoverScale>
        <GlassCard className="hover:bg-white/25 dark:hover:bg-white/10 transition-all duration-500">
          <GameControls 
            selectedGroupsCount={selectedGroups.length}
            onShowGroupDialog={handleShowGroupDialog}
            onStartGame={handleStartNewGame}
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
          if (!open) handleEndGame();
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
        onEndGame={handleEndGame}
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
