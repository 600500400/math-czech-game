import { FunGraphics } from "@/components/spelling/FunGraphics";
import { GamificationStats } from "@/components/gamification/GamificationStats";
import { SpellingPracticeDialogs } from "@/components/spelling/SpellingPracticeDialogs";
import { useSpellingGame } from "@/hooks/spelling/useSpellingGame";
import { useAuth } from "@/hooks/useAuth";
import { useGamification } from "@/hooks/gamification/useGamification";
import { useState, useEffect } from "react";
import { useEnhancedMobileInteractions } from "@/hooks/useEnhancedMobileInteractions";
import { Button } from "@/components/ui/button";
import { BookOpen, Settings, Play } from "lucide-react";
import MobileShell from "@/components/layout/MobileShell";
import SectionHero from "@/components/layout/SectionHero";

const SpellingPractice = () => {
  const { authState } = useAuth();
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
    triggerButtonFeedback,
  } = useEnhancedMobileInteractions();

  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (lastAnswerCorrect === true && showAnimation) {
      triggerCorrectFeedback();
    } else if (lastAnswerCorrect === false && showAnimation) {
      triggerIncorrectFeedback();
    }
  }, [lastAnswerCorrect, showAnimation, triggerCorrectFeedback, triggerIncorrectFeedback]);

  const handleStartNewGame = () => {
    triggerGameStartFeedback();
    setGameStartTime(Date.now());
    startNewGame();
  };

  const handleEndGame = async () => {
    triggerGameEndFeedback();
    if (gameStartTime && (correctAnswers > 0 || wrongAnswers > 0)) {
      const gameDuration = Math.round((Date.now() - gameStartTime) / 1000);
      const perfectGame = wrongAnswers === 0 && correctAnswers >= 5;
      await processGameCompletion({
        correct_answers: correctAnswers,
        wrong_answers: wrongAnswers,
        game_duration: gameDuration,
        perfect_game: perfectGame,
        subject: "spelling",
      });
    }
    setGameStartTime(null);
    endGame();
  };

  const handleShowGroupDialog = () => {
    triggerButtonFeedback();
    setShowGroupDialog(true);
  };

  const successPct =
    correctAnswers + wrongAnswers > 0
      ? Math.round((correctAnswers / (correctAnswers + wrongAnswers)) * 100)
      : 0;

  return (
    <MobileShell>
      <FunGraphics isCorrect={lastAnswerCorrect} showAnimation={showAnimation} />

      <div className="space-y-6">
        <SectionHero
          title="Pravopis"
          subtitle="Vyjmenovaná slova a české psaní"
          icon={BookOpen}
          gradient="from-sunset-magenta to-sunset-purple"
        >
          <Button
            onClick={handleShowGroupDialog}
            variant="ghost"
            className="bg-white/20 border border-white/20 text-white hover:bg-white/30 backdrop-blur-md"
          >
            <Settings className="h-4 w-4 mr-2" />
            Skupiny ({selectedGroups.length})
          </Button>
          <Button
            onClick={handleStartNewGame}
            disabled={selectedGroups.length === 0}
            className="bg-white text-sunset-magenta hover:bg-white/90 font-semibold shadow-lg disabled:opacity-50"
          >
            <Play className="h-4 w-4 mr-2" />
            Začít novou hru
          </Button>
        </SectionHero>

        {selectedGroups.length === 0 && (
          <p className="text-sm text-white/60 text-center">
            Nejprve vyber skupiny slov pro začátek hry.
          </p>
        )}

        {authState.isAuthenticated && (
          <GamificationStats authState={authState} leveling={leveling} streaks={streaks} />
        )}

        {(correctAnswers > 0 || wrongAnswers > 0) && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-heading text-sm uppercase tracking-wider text-white/60 mb-4">
              Aktuální hra
            </h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-3xl font-heading font-bold text-emerald-400">{correctAnswers}</div>
                <div className="text-xs text-white/60 mt-1">Správně</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-rose-400">{wrongAnswers}</div>
                <div className="text-xs text-white/60 mt-1">Špatně</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-white">{problemCount}</div>
                <div className="text-xs text-white/60 mt-1">Slov</div>
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-sunset-magenta">{successPct}%</div>
                <div className="text-xs text-white/60 mt-1">Úspěšnost</div>
              </div>
            </div>
          </div>
        )}
      </div>

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
    </MobileShell>
  );
};

export default SpellingPractice;
