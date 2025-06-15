
import { FunGraphics } from "./spelling/FunGraphics";
import { SpellingPracticeHeader } from "./spelling/SpellingPracticeHeader";
import { GamificationStats } from "@/components/gamification/GamificationStats";
import { SpellingPracticeControls } from "./spelling/SpellingPracticeControls";
import { SpellingPracticeDialogs } from "./spelling/SpellingPracticeDialogs";
import { useSpellingGame } from "@/hooks/spelling/useSpellingGame";
import { useAuth } from "@/hooks/useAuth";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useGamification } from "@/hooks/gamification/useGamification";
import { useState, useEffect } from "react";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";

const SpellingPractice = () => {
  const { authState } = useAuth();
  const { theme, getCSSVariables, getGradientClasses } = useUserTheme(authState.user?.id);
  const { leveling, streaks, processGameCompletion } = useGamification();
  
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

  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  
  // Simplified feedback - only haptic, no particles during animation
  useEffect(() => {
    if (lastAnswerCorrect === true && showAnimation) {
      triggerCorrectFeedback();
    } else if (lastAnswerCorrect === false && showAnimation) {
      triggerIncorrectFeedback();
    }
  }, [lastAnswerCorrect, showAnimation, triggerCorrectFeedback, triggerIncorrectFeedback]);

  // Enhanced game start with feedback
  const handleStartNewGame = () => {
    triggerGameStartFeedback();
    setGameStartTime(Date.now());
    startNewGame();
  };

  // Enhanced game end with feedback and gamification
  const handleEndGame = async () => {
    triggerGameEndFeedback();
    
    // Process gamification if we have game data
    if (gameStartTime && (correctAnswers > 0 || wrongAnswers > 0)) {
      const gameDuration = Math.round((Date.now() - gameStartTime) / 1000);
      const perfectGame = wrongAnswers === 0 && correctAnswers >= 5;
      
      await processGameCompletion({
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
        game_duration: gameDuration,
        perfect_game: perfectGame,
        subject: 'spelling'
      });
    }
    
    setGameStartTime(null);
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
      
      {/* SINGLE, SIMPLIFIED FunGraphics Component */}
      <FunGraphics 
        isCorrect={lastAnswerCorrect} 
        showAnimation={showAnimation}
      />
      
      {/* Enhanced header with floating animation */}
      <SpellingPracticeHeader 
        theme={theme}
        getGradientClasses={getGradientClasses}
      />

      {/* Gamification displays */}
      <GamificationStats 
        authState={authState}
        leveling={leveling}
        streaks={streaks}
      />

      {/* Glass morphism game controls */}
      <SpellingPracticeControls 
        selectedGroups={selectedGroups}
        onShowGroupDialog={handleShowGroupDialog}
        onStartNewGame={handleStartNewGame}
      />

      {/* All dialogs */}
      <SpellingPracticeDialogs 
        showGroupDialog={showGroupDialog}
        setShowGroupDialog={setShowGroupDialog}
        selectedGroups={selectedGroups}
        toggleGroup={toggleGroup}
        setGroups={setGroups}
        toggleAllGroups={toggleAllGroups}
        allSelected={allSelected}
        showProblem={showProblem}
        onEndGame={handleEndGame}
        displayedWord={displayedWord}
        currentWord={currentWord}
        isPhrase={isPhrase}
        wordGroup={wordGroup}
        missingPositions={missingPositions}
        correctLetters={correctLetters}
        currentPosition={currentPosition}
        handleAnswerI={handleAnswerI}
        handleAnswerY={handleAnswerY}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        showStatsDialog={showStatsDialog}
        setShowStatsDialog={setShowStatsDialog}
        totalAnswers={totalAnswers}
        answers={answers}
      />
    </div>
  );
};

export default SpellingPractice;
