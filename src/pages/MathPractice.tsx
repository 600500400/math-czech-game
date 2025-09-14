import { useEffect, useState } from "react";
import { MathProblemDialog } from "@/components/math/MathProblemDialog";
import DifficultyDialog from "@/components/math/DifficultyDialog";
import { StatisticsDialog } from "@/components/math/StatisticsDialog";
import { GamificationStats } from "@/components/gamification/GamificationStats";
import { useMathGame } from "@/hooks/math/useMathGame";
import { useUserTheme } from "@/hooks/useUserTheme";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/gamification/useGamification";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, Settings, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ModernHeader from "@/components/layout/ModernHeader";
import AppFooter from "@/components/layout/AppFooter";

const MathPractice = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const userId = authState.profile?.username?.toLowerCase() || 'host';
  const { theme, getCSSVariables, getGradientClasses } = useUserTheme(userId);
  const mathGame = useMathGame();
  const { leveling, streaks, processGameCompletion } = useGamification();

  const {
    triggerCorrectFeedback,
    triggerIncorrectFeedback,
    triggerGameStartFeedback,
    triggerGameEndFeedback,
    triggerButtonFeedback
  } = useEnhancedMobileInteractions({});

  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  // Simplified feedback effects
  useEffect(() => {
    if (mathGame.lastAnswerCorrect === true && mathGame.showAnimation) {
      triggerCorrectFeedback();
    } else if (mathGame.lastAnswerCorrect === false && mathGame.showAnimation) {
      triggerIncorrectFeedback();
    }
  }, [mathGame.lastAnswerCorrect, mathGame.showAnimation, triggerCorrectFeedback, triggerIncorrectFeedback]);

  // Enhanced game start with feedback
  const handleStartNewGame = () => {
    triggerGameStartFeedback();
    setGameStartTime(Date.now());
    mathGame.startNewGame();
  };

  // Enhanced game end with feedback
  const handleEndGame = async () => {
    triggerGameEndFeedback();
    
    if (authState.user && gameStartTime && (mathGame.correctAnswers > 0 || mathGame.wrongAnswers > 0)) {
      const gameDuration = Math.round((Date.now() - gameStartTime) / 1000);
      const perfectGame = mathGame.wrongAnswers === 0 && mathGame.correctAnswers >= 10;
      
      await processGameCompletion({
        correct_answers: mathGame.correctAnswers,
        wrong_answers: mathGame.wrongAnswers,
        game_duration: gameDuration,
        perfect_game: perfectGame,
        subject: 'math'
      });
    }

    setGameStartTime(null);
    mathGame.endGame();
  };

  // Enhanced button interactions
  const handleShowDifficultyDialog = () => {
    triggerButtonFeedback();
    mathGame.setShowDifficultyDialog(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ModernHeader />
      
      <main className="max-w-4xl mx-auto px-4 py-6 flex-1">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <button 
                onClick={() => navigate('/')} 
                className="hover:text-foreground transition-colors"
              >
                Přehled
              </button>
            </li>
            <li className="flex items-center">
              <ArrowLeft className="h-3 w-3 mx-2 rotate-180" />
              <span className="text-foreground font-medium">Matematika</span>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <Calculator className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-heading font-bold text-foreground">Procvičování matematiky</h1>
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
                onClick={handleShowDifficultyDialog}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Nastavení obtížnosti</span>
              </Button>
              <Button
                onClick={handleStartNewGame}
                disabled={!mathGame.difficultySet}
                className="flex items-center space-x-2"
              >
                <Play className="h-4 w-4" />
                <span>Začít novou hru</span>
              </Button>
            </div>
            {!mathGame.difficultySet && (
              <p className="text-sm text-muted-foreground">
                Nejprve nastavte obtížnost pro začátek hry.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Current Game Stats */}
        {(mathGame.correctAnswers > 0 || mathGame.wrongAnswers > 0) && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Aktuální hra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{mathGame.correctAnswers}</div>
                  <div className="text-sm text-muted-foreground">Správně</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{mathGame.wrongAnswers}</div>
                  <div className="text-sm text-muted-foreground">Špatně</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{mathGame.correctAnswers + mathGame.wrongAnswers}</div>
                  <div className="text-sm text-muted-foreground">Příkladů</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {mathGame.correctAnswers + mathGame.wrongAnswers > 0 
                      ? Math.round((mathGame.correctAnswers / (mathGame.correctAnswers + mathGame.wrongAnswers)) * 100)
                      : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Úspěšnost</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <AppFooter />

      {/* Math Problem Dialog */}
      <MathProblemDialog
        open={mathGame.showProblem}
        onOpenChange={mathGame.setShowProblem}
        problem={mathGame.currentProblem}
        userAnswer={mathGame.userAnswer}
        setUserAnswer={mathGame.setUserAnswer}
        checkAnswer={mathGame.checkAnswer}
        handleKeyPress={mathGame.handleKeyPress}
        onEndGame={handleEndGame}
        lastAnswerCorrect={mathGame.lastAnswerCorrect}
        showAnimation={mathGame.showAnimation}
        correctAnswers={mathGame.correctAnswers}
        wrongAnswers={mathGame.wrongAnswers}
      />

      {/* Difficulty Settings Dialog */}
      <DifficultyDialog
        open={mathGame.showDifficultyDialog}
        onOpenChange={mathGame.setShowDifficultyDialog}
        maxValue={mathGame.maxValue}
        maxMultiplyValue={mathGame.maxMultiplyValue}
        maxDivideValue={mathGame.maxDivideValue}
        allowedOperations={mathGame.allowedOperations}
        toggleOperation={mathGame.toggleOperation}
        setDifficulty={mathGame.setDifficulty}
        setMaxValue={mathGame.setMaxValue}
        setMaxMultiplyValue={mathGame.setMaxMultiplyValue}
        setMaxDivideValue={mathGame.setMaxDivideValue}
      />

      {/* Statistics Dialog */}
      <StatisticsDialog
        open={mathGame.showStatsDialog}
        onOpenChange={mathGame.setShowStatsDialog}
        correctAnswers={mathGame.correctAnswers}
        wrongAnswers={mathGame.wrongAnswers}
        answers={mathGame.answers}
      />
    </div>
  );
};

export default MathPractice;