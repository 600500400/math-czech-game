import { useEffect, useState } from "react";
import { MathProblemDialog } from "@/components/math/MathProblemDialog";
import DifficultyDialog from "@/components/math/DifficultyDialog";
import { StatisticsDialog } from "@/components/math/StatisticsDialog";
import { GamificationStats } from "@/components/gamification/GamificationStats";
import { useMathGame } from "@/hooks/math/useMathGame";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/gamification/useGamification";
import { Button } from "@/components/ui/button";
import { Calculator, Settings, Play } from "lucide-react";
import MobileShell from "@/components/layout/MobileShell";
import SectionHero from "@/components/layout/SectionHero";

const MathPractice = () => {
  const { authState } = useAuth();
  const mathGame = useMathGame();
  const { leveling, streaks, processGameCompletion } = useGamification();

  const {
    triggerCorrectFeedback,
    triggerIncorrectFeedback,
    triggerGameStartFeedback,
    triggerGameEndFeedback,
    triggerButtonFeedback,
  } = useEnhancedMobileInteractions({});

  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (mathGame.lastAnswerCorrect === true && mathGame.showAnimation) {
      triggerCorrectFeedback();
    } else if (mathGame.lastAnswerCorrect === false && mathGame.showAnimation) {
      triggerIncorrectFeedback();
    }
  }, [mathGame.lastAnswerCorrect, mathGame.showAnimation, triggerCorrectFeedback, triggerIncorrectFeedback]);

  const handleStartNewGame = () => {
    triggerGameStartFeedback();
    setGameStartTime(Date.now());
    mathGame.startNewGame();
  };

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
        subject: "math",
      });
    }
    setGameStartTime(null);
    mathGame.endGame();
  };

  const handleShowDifficultyDialog = () => {
    triggerButtonFeedback();
    mathGame.setShowDifficultyDialog(true);
  };

  const totalAnswers = mathGame.correctAnswers + mathGame.wrongAnswers;
  const successPct = totalAnswers > 0 ? Math.round((mathGame.correctAnswers / totalAnswers) * 100) : 0;

  return (
    <MobileShell>
      <div className="space-y-6">
        <SectionHero
          title="Matematika"
          subtitle="Procvičuj počítání a překonej svůj rekord"
          icon={Calculator}
          gradient="from-sunset-orange to-sunset-amber"
        >
          <Button
            onClick={handleShowDifficultyDialog}
            variant="ghost"
            className="bg-white/20 border border-white/20 text-white hover:bg-white/30 backdrop-blur-md"
          >
            <Settings className="h-4 w-4 mr-2" />
            Obtížnost
          </Button>
          <Button
            onClick={handleStartNewGame}
            disabled={!mathGame.difficultySet}
            className="bg-white text-sunset-orange hover:bg-white/90 font-semibold shadow-lg disabled:opacity-50"
          >
            <Play className="h-4 w-4 mr-2" />
            Začít novou hru
          </Button>
        </SectionHero>

        {!mathGame.difficultySet && (
          <p className="text-sm text-white/60 text-center">
            Nejprve nastav obtížnost pro začátek hry.
          </p>
        )}

        {authState.isAuthenticated && (
          <GamificationStats authState={authState} leveling={leveling} streaks={streaks} />
        )}

        {totalAnswers > 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-heading text-sm uppercase tracking-wider text-white/60 mb-4">
              Aktuální hra
            </h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-heading font-bold text-emerald-400">
                  {mathGame.correctAnswers}
                </div>
                <div className="text-xs text-white/60 mt-1">Správně</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-rose-400">
                  {mathGame.wrongAnswers}
                </div>
                <div className="text-xs text-white/60 mt-1">Špatně</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-white">{totalAnswers}</div>
                <div className="text-xs text-white/60 mt-1">Příkladů</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-sunset-amber">{successPct}%</div>
                <div className="text-xs text-white/60 mt-1">Úspěšnost</div>
              </div>
            </div>
          </div>
        )}
      </div>

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

      <DifficultyDialog
        open={mathGame.showDifficultyDialog}
        onOpenChange={mathGame.setShowDifficultyDialog}
        minValue={mathGame.minValue}
        maxValue={mathGame.maxValue}
        mulDivMin={mathGame.mulDivMin}
        mulDivMax={mathGame.mulDivMax}
        allowedOperations={mathGame.allowedOperations}
        toggleOperation={mathGame.toggleOperation}
        setDifficulty={mathGame.setDifficulty}
        setMinValue={mathGame.setMinValue}
        setMaxValue={mathGame.setMaxValue}
        setMulDivMin={mathGame.setMulDivMin}
        setMulDivMax={mathGame.setMulDivMax}
      />

      <StatisticsDialog
        open={mathGame.showStatsDialog}
        onOpenChange={mathGame.setShowStatsDialog}
        correctAnswers={mathGame.correctAnswers}
        wrongAnswers={mathGame.wrongAnswers}
        answers={mathGame.answers}
      />
    </MobileShell>
  );
};

export default MathPractice;
