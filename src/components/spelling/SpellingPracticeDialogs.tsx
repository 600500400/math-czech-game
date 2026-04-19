
import { GroupSelectionDialog } from "./GroupSelectionDialog";
import WordProblemDialog from "./WordProblemDialog";
import { StatisticsDialog } from "./StatisticsDialog";
import { spellingGroups } from "@/data/spellingData";
import { SpellingAnswer } from "@/types/spellingTypes";

interface SpellingPracticeDialogsProps {
  // Group dialog props
  showGroupDialog: boolean;
  setShowGroupDialog: (show: boolean) => void;
  selectedGroups: string[];
  toggleGroup: (group: string) => void;
  setGroups: () => void;
  toggleAllGroups: () => void;
  allSelected: boolean;

  // Word problem dialog props
  showProblem: boolean;
  onEndGame: () => void;
  displayedWord: string;
  currentWord: string;
  isPhrase: boolean;
  wordGroup: string;
  wordType?: string;
  missingPositions: number[];
  correctLetters: string[];
  currentPosition: number;
  handleAnswerI: () => void;
  handleAnswerY: () => void;
  correctAnswers: number;
  wrongAnswers: number;
  lastAnswerCorrect?: boolean | null;

  // Statistics dialog props
  showStatsDialog: boolean;
  setShowStatsDialog: (show: boolean) => void;
  totalAnswers: number;
  answers: SpellingAnswer[];
}

export const SpellingPracticeDialogs = ({
  showGroupDialog,
  setShowGroupDialog,
  selectedGroups,
  toggleGroup,
  setGroups,
  toggleAllGroups,
  allSelected,
  showProblem,
  onEndGame,
  displayedWord,
  currentWord,
  isPhrase,
  wordGroup,
  wordType,
  missingPositions,
  correctLetters,
  currentPosition,
  handleAnswerI,
  handleAnswerY,
  correctAnswers,
  wrongAnswers,
  lastAnswerCorrect,
  showStatsDialog,
  setShowStatsDialog,
  totalAnswers,
  answers,
}: SpellingPracticeDialogsProps) => {
  return (
    <>
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

      <WordProblemDialog
        open={showProblem}
        onOpenChange={(open) => {
          if (!open) onEndGame();
        }}
        displayedWord={displayedWord}
        currentWord={currentWord}
        isPhrase={isPhrase}
        wordGroup={wordGroup}
        wordType={wordType}
        missingPositions={missingPositions}
        correctLetters={correctLetters}
        currentPosition={currentPosition}
        handleAnswerI={handleAnswerI}
        handleAnswerY={handleAnswerY}
        onEndGame={onEndGame}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        lastAnswerCorrect={lastAnswerCorrect}
      />

      <StatisticsDialog
        open={showStatsDialog}
        onOpenChange={setShowStatsDialog}
        correctAnswers={correctAnswers}
        wrongAnswers={wrongAnswers}
        totalAnswers={totalAnswers}
        answers={answers}
      />
    </>
  );
};
