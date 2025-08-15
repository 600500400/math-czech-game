import { FunGraphics } from "@/components/spelling/FunGraphics";
import { GamificationStats } from "@/components/gamification/GamificationStats";
import { SpellingPracticeDialogs } from "@/components/spelling/SpellingPracticeDialogs";
import { useSpellingGame } from "@/hooks/spelling/useSpellingGame";
import { useAuth } from "@/hooks/useAuth";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useGamification } from "@/hooks/gamification/useGamification";
import { useState, useEffect } from "react";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Settings, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModernHeader from "@/components/layout/ModernHeader";
import AppFooter from "@/components/layout/AppFooter";

const SpellingPractice = () => {
  const navigate = useNavigate();
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
    <div 
      className={`min-h-screen bg-gradient-to-br ${theme.bgGradient} flex flex-col`}
      style={getCSSVariables}
    >
      <ModernHeader />
      
      <div className="container mx-auto p-4 max-w-4xl flex-1">
        {/* SINGLE, SIMPLIFIED FunGraphics Component */}
        <FunGraphics 
          isCorrect={lastAnswerCorrect} 
          showAnimation={showAnimation}
        />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Zpět na dashboard</span>
            </Button>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Procvičování pravopisu</h1>
            </div>
          </div>
        </div>

        {/* Gamification displays */}
        {authState.isAuthenticated && (
          <GamificationStats 
            authState={authState}
            leveling={leveling}
            streaks={streaks}
          />
        )}

        {/* Game Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Ovládání hry</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                onClick={handleShowGroupDialog}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Vybrat skupiny slov ({selectedGroups.length})</span>
              </Button>
              <Button
                onClick={handleStartNewGame}
                disabled={selectedGroups.length === 0}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Začít novou hru</span>
              </Button>
            </div>
            {selectedGroups.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nejprve vyberte skupiny slov pro začátek hry.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Current Game Stats */}
        {(correctAnswers > 0 || wrongAnswers > 0) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Aktuální hra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Správně</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{wrongAnswers}</div>
                  <div className="text-sm text-muted-foreground">Špatně</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{problemCount}</div>
                  <div className="text-sm text-muted-foreground">Slov</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {correctAnswers + wrongAnswers > 0 
                      ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Úspěšnost</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <AppFooter />

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